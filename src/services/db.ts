import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_VOCABULARY, WordItem, WordStatus, UserWordProgress } from '../data/words';
import { authService, CLOUDFLARE_TUNNEL_URL } from './auth';

const STORAGE_KEYS = {
  USER_PROGRESS: '@lingo_user_progress',
  SUPABASE_URL: '@lingo_supabase_url',
  SUPABASE_KEY: '@lingo_supabase_anon_key',
};

export interface DatabaseStats {
  totalWords: number;
  waitingCount: number;
  masteredCount: number;
  knownCount: number;
  unseenCount?: number;
  learnedPercentage: number;
  levelCounts?: Record<string, number>;
  source?: 'docker_postgres' | 'supabase' | 'local';
}

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private isConfiguredSupabase = false;
  private isDockerApiAvailable: boolean | null = null;
  private lastHealthCheckTime = 0;

  constructor() {
    this.initSupabase();
  }

  // Oturum açmış kullanıcının token'ı ile API isteği (çift hatlı fallback: Tünel + Yerel Wi-Fi)
  async api(path: string, init: RequestInit = {}): Promise<Response> {
    const doFetch = async (targetBase: string, timeoutMs: number) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(`${targetBase}${path}`, {
          ...init,
          signal: init.signal || controller.signal,
          headers: authService.headers((init.headers as Record<string, string>) || {}),
        });
        clearTimeout(timer);
        return res;
      } catch (err) {
        clearTimeout(timer);
        throw err;
      }
    };

    try {
      const primaryUrl = authService.serverUrl;
      const res = await doFetch(primaryUrl, 2500);
      if (res.status === 401) {
        await authService.handleUnauthorized();
      }
      return res;
    } catch (primaryErr) {
      // Birincil adres zaman aşımına uğrarsa veya Cloudflare tüneli gecikirse, alternatif adresi (Yerel Wi-Fi veya Tünel) anında dene:
      const altUrl = authService.serverUrl.includes('trycloudflare.com')
        ? (process.env.EXPO_PUBLIC_LAN_API_URL || 'http://localhost:3001')
        : (CLOUDFLARE_TUNNEL_URL || null);

      if (altUrl && altUrl !== authService.serverUrl) {
        try {
          const altRes = await doFetch(altUrl, 2500);
          authService.serverUrl = altUrl; // Hızlı olan hattı yeni birincil yap
          if (altRes.status === 401) {
            await authService.handleUnauthorized();
          }
          return altRes;
        } catch {}
      }
      throw primaryErr;
    }
  }

  async getDockerApiUrl(): Promise<string> {
    return authService.serverUrl;
  }

  async setDockerApiUrl(url: string): Promise<void> {
    await authService.setServerUrl(url);
    this.isDockerApiAvailable = null;
    try {
      await this.api('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'api_url', value: authService.serverUrl }),
      });
      await authService.updateLocalSetting('api_url', authService.serverUrl);
    } catch {}
  }

  async checkDockerApi(): Promise<{ available: boolean; totalWords?: number; postgres?: boolean; message?: string }> {
    const now = Date.now();
    const ttl = this.isDockerApiAvailable ? 15000 : 2000;
    if (this.isDockerApiAvailable !== null && now - this.lastHealthCheckTime < ttl) {
      return { available: this.isDockerApiAvailable };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${authService.serverUrl}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        this.isDockerApiAvailable = true;
        this.lastHealthCheckTime = now;
        return { available: true, totalWords: data.totalWords, postgres: data.postgres };
      }
    } catch {}

    this.isDockerApiAvailable = false;
    this.lastHealthCheckTime = now;
    return { available: false, message: 'API sunucusuna bağlanılamadı' };
  }

  async initSupabase() {
    try {
      const url = await AsyncStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
      const key = await AsyncStorage.getItem(STORAGE_KEYS.SUPABASE_KEY);
      if (url && key) {
        this.supabase = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } });
        this.isConfiguredSupabase = true;
      }
    } catch (e) {
      console.warn('Supabase başlatılamadı:', e);
    }
  }

  async setSupabaseConfig(url: string, key: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    await AsyncStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
    this.supabase = createClient(url.trim(), key.trim());
    this.isConfiguredSupabase = true;
  }

  async getSupabaseConfig(): Promise<{ url: string; key: string; isConnected: boolean }> {
    const url = (await AsyncStorage.getItem(STORAGE_KEYS.SUPABASE_URL)) || '';
    const key = (await AsyncStorage.getItem(STORAGE_KEYS.SUPABASE_KEY)) || '';
    return { url, key, isConnected: !!(url && key) };
  }

  // Gemini API anahtarı kullanıcının hesabında (sunucu + PostgreSQL) saklanır
  async getGeminiApiKey(): Promise<string> {
    const cached = authService.user?.settings?.gemini_api_key;
    if (cached) return cached;
    try {
      const res = await this.api('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.gemini_api_key) {
          await authService.updateLocalSetting('gemini_api_key', data.gemini_api_key);
          return data.gemini_api_key;
        }
      }
    } catch {}
    return '';
  }

  async setGeminiApiKey(key: string): Promise<void> {
    const trimmed = key.trim();
    await authService.updateLocalSetting('gemini_api_key', trimmed);
    try {
      await this.api('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'gemini_api_key', value: trimmed }),
      });
    } catch {}
  }

  async getAllWords(): Promise<WordItem[]> {
    if (this.isDockerApiAvailable !== false) {
      try {
        const res = await this.api('/api/words?limit=1000&status=ALL');
        if (res.ok) {
          const data = await res.json();
          this.isDockerApiAvailable = true;
          if (data.words?.length) return data.words;
        }
      } catch (err) {
        this.isDockerApiAvailable = false;
        console.warn('Kelimeler çekilemedi:', err);
      }
    }
    return INITIAL_VOCABULARY;
  }

  async getFeedWords(selectedLevel = 'ALL', offset = 0, limit = 40): Promise<WordItem[]> {
    if (this.isDockerApiAvailable !== false) {
      try {
        const query = new URLSearchParams({
          status: 'unseen',
          level: selectedLevel,
          limit: limit.toString(),
          offset: offset.toString(),
        });
        const res = await this.api(`/api/words?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          this.isDockerApiAvailable = true;
          return data.words || [];
        }
      } catch (e) {
        this.isDockerApiAvailable = false;
        console.warn('Feed çekme hatası:', e);
      }
    }

    // Çevrimdışı mod
    const progressMap = await this.getProgressMap();
    return INITIAL_VOCABULARY.filter(w => {
      const prog = progressMap[w.id];
      const isUnseen = !prog || prog.status === 'unseen';
      return isUnseen && (selectedLevel === 'ALL' || w.level === selectedLevel);
    }).slice(offset, offset + limit);
  }

  async getProgressMap(): Promise<Record<number, UserWordProgress>> {
    try {
      const stored = await AsyncStorage.getItem(authService.storageKey(STORAGE_KEYS.USER_PROGRESS));
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  async updateWordStatus(wordId: number, status: WordStatus): Promise<void> {
    const progressMap = await this.getProgressMap();
    const existing = progressMap[wordId] || { wordId, status: 'unseen', reviewCount: 0 };
    const now = new Date().toISOString();
    progressMap[wordId] = {
      ...existing,
      status,
      lastReviewedAt: now,
      reviewCount: existing.reviewCount + 1,
      waitingAddedAt: status === 'waiting' ? now : existing.waitingAddedAt,
      masteredAt: status === 'mastered' ? now : existing.masteredAt,
    };
    await AsyncStorage.setItem(authService.storageKey(STORAGE_KEYS.USER_PROGRESS), JSON.stringify(progressMap));

    try {
      const res = await this.api(`/api/words/${wordId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        authService.emitAchievements(data.newAchievements);
      }
    } catch (err) {
      console.warn('Durum güncelleme hatası:', err);
    }
  }

  async getWaitingWords(): Promise<WordItem[]> {
    if (this.isDockerApiAvailable !== false) {
      try {
        const res = await this.api('/api/waiting');
        if (res.ok) {
          const data = await res.json();
          this.isDockerApiAvailable = true;
          if (data.words) return data.words;
        }
      } catch (err) {
        this.isDockerApiAvailable = false;
        console.warn('Havuz kelimeleri çekilemedi:', err);
      }
    }
    const progressMap = await this.getProgressMap();
    return INITIAL_VOCABULARY.filter(w => progressMap[w.id]?.status === 'waiting');
  }

  async getMasteredWords(): Promise<WordItem[]> {
    return this.getWordsByStatus('mastered');
  }

  // Duruma göre kelime listesi (waiting / mastered / known)
  async getWordsByStatus(status: 'waiting' | 'mastered' | 'known'): Promise<WordItem[]> {
    if (this.isDockerApiAvailable !== false) {
      try {
        const res = await this.api(`/api/words?status=${status}&limit=ALL`);
        if (res.ok) {
          const data = await res.json();
          this.isDockerApiAvailable = true;
          if (Array.isArray(data.words)) return data.words;
        }
      } catch (err) {
        this.isDockerApiAvailable = false;
        console.warn('Kelimeler çekilemedi:', err);
      }
    }
    const progressMap = await this.getProgressMap();
    return INITIAL_VOCABULARY.filter(w => progressMap[w.id]?.status === status);
  }

  async getStats(): Promise<DatabaseStats> {
    if (this.isDockerApiAvailable !== false && authService.token) {
      try {
        const res = await this.api('/api/stats');
        if (res.ok) {
          const data = await res.json();
          this.isDockerApiAvailable = true;
          const done = data.masteredCount + data.knownCount;
          return {
            totalWords: data.totalCount,
            waitingCount: data.waitingCount,
            masteredCount: data.masteredCount,
            knownCount: data.knownCount,
            unseenCount: data.unseenCount,
            learnedPercentage: data.totalCount > 0 ? Math.round((done / data.totalCount) * 100) : 0,
            levelCounts: data.levelCounts,
            source: 'docker_postgres',
          };
        }
      } catch (err) {
        this.isDockerApiAvailable = false;
        console.warn('İstatistikler çekilemedi:', err);
      }
    }

    const progressMap = await this.getProgressMap();
    let waitingCount = 0, masteredCount = 0, knownCount = 0;
    Object.values(progressMap).forEach(p => {
      if (p.status === 'waiting') waitingCount++;
      else if (p.status === 'mastered') masteredCount++;
      else if (p.status === 'known') knownCount++;
    });
    const totalWords = INITIAL_VOCABULARY.length;
    return {
      totalWords,
      waitingCount,
      masteredCount,
      knownCount,
      learnedPercentage: totalWords > 0 ? Math.round(((masteredCount + knownCount) / totalWords) * 100) : 0,
      source: 'local',
    };
  }

  async resetAllProgress(): Promise<void> {
    await AsyncStorage.removeItem(authService.storageKey(STORAGE_KEYS.USER_PROGRESS));
    try {
      await this.api('/api/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Sıfırlama hatası:', err);
    }
  }
}

export const dbService = new DatabaseService();
