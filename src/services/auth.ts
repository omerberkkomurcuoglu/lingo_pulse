import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SESSION_KEY = '@lingo_session_v1';
const SERVER_URL_KEY = '@lingo_docker_api_url';
const GEMINI_KEY_STORAGE = '@lingo_gemini_api_key';

export const CLOUDFLARE_TUNNEL_URL = process.env.EXPO_PUBLIC_TUNNEL_URL || '';

export const DEFAULT_SERVER_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web'
    ? 'http://localhost:3001'
    : (CLOUDFLARE_TUNNEL_URL || 'http://localhost:3001'));

export interface AuthUser {
  id: number | null;
  username: string;
  displayName?: string;
  role?: string;
  createdAt: string;
  settings: Record<string, string>;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  desc?: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export type UnlockedAchievement = AchievementItem;

type AchievementListener = (items: AchievementItem[]) => void;
type SessionListener = (user: AuthUser | null) => void;

class AuthService {
  user: AuthUser | null = null;
  token: string | null = null;
  serverUrl: string = DEFAULT_SERVER_URL;

  private achievementListeners = new Set<AchievementListener>();
  private sessionListeners = new Set<SessionListener>();

  async getServerUrl(): Promise<string> {
    if (CLOUDFLARE_TUNNEL_URL && Platform.OS !== 'web') {
      this.serverUrl = CLOUDFLARE_TUNNEL_URL;
      return this.serverUrl;
    }
    const storedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
    if (storedUrl) this.serverUrl = storedUrl;
    return this.serverUrl;
  }

  async restore(): Promise<AuthUser | null> {
    if (CLOUDFLARE_TUNNEL_URL && Platform.OS !== 'web') {
      this.serverUrl = CLOUDFLARE_TUNNEL_URL;
    } else {
      const storedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
      if (storedUrl) this.serverUrl = storedUrl;
    }

    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const saved = JSON.parse(raw) as { token: string; user: AuthUser };
      this.token = saved.token;
      this.user = this.normalizeUser(saved.user);

      // Doğrulama ve profil senkronizasyonunu arka planda yap, açılışta kullanıcıyı bekletme!
      this.verifySessionInBackground().catch(() => {});

      return this.user;
    } catch {
      return null;
    }
  }

  private async verifySessionInBackground(): Promise<void> {
    if (!this.token) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${this.serverUrl}/api/auth/me`, {
        headers: this.headers(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.status === 401) {
        await this.clear();
        this.sessionListeners.forEach(l => l(null));
        return;
      }
      if (res.ok) {
        const data = await res.json();
        this.user = this.normalizeUser(data.user);
        await this.syncSettingsToLocal(this.user);
        await this.persist();
      }
    } catch {}
  }

  private normalizeUser(u: any): AuthUser {
    return {
      id: u?.id ?? null,
      username: u?.username || 'admin',
      displayName: u?.displayName || (u?.username === 'admin' ? 'Admin' : u?.username),
      role: u?.role || (u?.username === 'admin' ? 'admin' : 'user'),
      createdAt: u?.createdAt || new Date().toISOString(),
      settings: u?.settings || {},
    };
  }

  private async syncSettingsToLocal(u: AuthUser | null) {
    if (!u || !u.settings) return;
    if (u.settings.gemini_api_key) {
      await AsyncStorage.setItem(GEMINI_KEY_STORAGE, u.settings.gemini_api_key);
    }
    const targetUrl =
      Platform.OS === 'web'
        ? u.settings.api_url || this.serverUrl
        : u.settings.api_url_mobile || u.settings.api_url || this.serverUrl;
    if (targetUrl) {
      this.serverUrl = targetUrl;
      await AsyncStorage.setItem(SERVER_URL_KEY, targetUrl);
    }
  }

  async setServerUrl(url: string) {
    this.serverUrl = url.trim().replace(/\/+$/, '');
    await AsyncStorage.setItem(SERVER_URL_KEY, this.serverUrl);
  }

  headers(extra: Record<string, string> = {}): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...extra,
    };
  }

  private async submit(
    path: string,
    username: string,
    password: string,
    displayName?: string
  ): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch(`${this.serverUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data.error || 'İşlem başarısız.' };
      }

      this.token = data.token;
      this.user = this.normalizeUser(data.user);
      await this.syncSettingsToLocal(this.user);
      await this.persist();
      this.sessionListeners.forEach(l => l(this.user));
      return { ok: true, user: this.user };
    } catch {
      return {
        ok: false,
        error: `Sunucuya ulaşılamadı (${this.serverUrl}). Sunucunun çalıştığından emin olun.`,
      };
    }
  }

  login(username: string, password: string) {
    return this.submit('/api/auth/login', username, password);
  }

  register(username: string, password: string, displayName?: string) {
    return this.submit('/api/auth/register', username, password, displayName);
  }

  async logout() {
    try {
      await fetch(`${this.serverUrl}/api/auth/logout`, {
        method: 'POST',
        headers: this.headers(),
      });
    } catch {}
    await this.clear();
  }

  async getAchievements(): Promise<{
    achievements: AchievementItem[];
    unlockedCount: number;
    totalCount: number;
    xpFromAchievements: number;
  }> {
    try {
      const res = await fetch(`${this.serverUrl}/api/me/achievements`, {
        headers: this.headers(),
      });
      if (res.ok) {
        const data = await res.json();
        const list: AchievementItem[] = (data.achievements || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description || a.desc || '',
          icon: a.icon || 'trophy',
          xpReward: a.xpReward || 50,
          unlocked: Boolean(a.unlocked),
          unlockedAt: a.unlockedAt || null,
        }));
        const unlockedCount = list.filter(x => x.unlocked).length;
        return {
          achievements: list,
          unlockedCount,
          totalCount: list.length,
          xpFromAchievements: unlockedCount * 50,
        };
      }
    } catch {}
    return { achievements: [], unlockedCount: 0, totalCount: 0, xpFromAchievements: 0 };
  }

  async updateLocalSetting(key: string, value: string) {
    if (!this.user) return;
    this.user = { ...this.user, settings: { ...this.user.settings, [key]: value } };
    await this.persist();
  }

  private async persist() {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ token: this.token, user: this.user })
    );
  }

  async clear() {
    this.token = null;
    this.user = null;
    await AsyncStorage.removeItem(SESSION_KEY);
    this.sessionListeners.forEach(l => l(null));
  }

  async handleUnauthorized() {
    if (this.token) await this.clear();
  }

  onSessionChange(listener: SessionListener) {
    this.sessionListeners.add(listener);
    return () => {
      this.sessionListeners.delete(listener);
    };
  }

  onAchievements(listener: AchievementListener) {
    this.achievementListeners.add(listener);
    return () => {
      this.achievementListeners.delete(listener);
    };
  }

  onAchievementUnlocked(listener: AchievementListener) {
    return this.onAchievements(listener);
  }

  emitAchievements(items?: any[]) {
    if (items && items.length) {
      const normalized: AchievementItem[] = items.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description || a.desc || '',
        icon: a.icon || 'trophy',
        xpReward: a.xpReward || 50,
        unlocked: true,
        unlockedAt: a.unlockedAt || new Date().toISOString(),
      }));
      this.achievementListeners.forEach(l => l(normalized));
    }
  }

  storageKey(base: string) {
    return `${base}__${this.user?.username || 'guest'}`;
  }
}

export const authService = new AuthService();
