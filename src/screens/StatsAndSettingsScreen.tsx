import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { dbService, DatabaseStats } from '../services/db';
import { authService, AchievementItem, AuthUser } from '../services/auth';

interface Props {
  onRefreshStats: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onNavigateTab?: (tab: 'learn' | 'grammar' | 'chat' | 'waiting' | 'quiz' | 'stats') => void;
}

export const StatsAndSettingsScreen: React.FC<Props> = ({
  onRefreshStats,
  currentUser,
  onLogout,
  onNavigateTab,
}) => {
  const [stats, setStats] = useState<DatabaseStats>({
    totalWords: 0,
    waitingCount: 0,
    masteredCount: 0,
    knownCount: 0,
    learnedPercentage: 0,
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [achSummary, setAchSummary] = useState({
    unlockedCount: 0,
    totalCount: 0,
    xpFromAchievements: 0,
  });

  const [dockerUrl, setDockerUrl] = useState('');
  const [dockerConnected, setDockerConnected] = useState(false);
  const [testingDocker, setTestingDocker] = useState(false);

  const [gemKey, setGemKey] = useState('');
  const [supUrl, setSupUrl] = useState('');
  const [supKey, setSupKey] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async () => {
    const s = await dbService.getStats();
    setStats(s);

    const url = await dbService.getDockerApiUrl();
    setDockerUrl(url);

    const health = await dbService.checkDockerApi();
    setDockerConnected(health.available);

    const sup = await dbService.getSupabaseConfig();
    setSupUrl(sup.url);
    setSupKey(sup.key);

    setGemKey(await dbService.getGeminiApiKey());

    const achData = await authService.getAchievements();
    setAchievements(achData.achievements || []);
    setAchSummary({
      unlockedCount: achData.unlockedCount || 0,
      totalCount: achData.totalCount || 0,
      xpFromAchievements: achData.xpFromAchievements || 0,
    });

    Animated.spring(fadeAnim, {
      toValue: 1,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    load();
  }, [currentUser?.username]);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  };

  const testAndSaveDocker = async () => {
    setTestingDocker(true);
    await dbService.setDockerApiUrl(dockerUrl);
    const health = await dbService.checkDockerApi();
    setTestingDocker(false);

    if (health.available) {
      setDockerConnected(true);
      const newStats = await dbService.getStats();
      setStats(newStats);
      const achData = await authService.getAchievements();
      setAchievements(achData.achievements || []);
      setAchSummary({
        unlockedCount: achData.unlockedCount || 0,
        totalCount: achData.totalCount || 0,
        xpFromAchievements: achData.xpFromAchievements || 0,
      });
      onRefreshStats();
      showToast(`Veritabanı bağlandı ve hesabınıza kaydedildi! (${health.totalWords} Kelime) 🚀`);
    } else {
      setDockerConnected(false);
      showToast('Bağlantı başarısız. Sunucu çalışıyor mu?');
    }
  };

  const saveGemini = async () => {
    await dbService.setGeminiApiKey(gemKey);
    showToast('Gemini API anahtarı hesabınıza ve veritabanına kaydedildi ✨');
  };

  const saveSupabase = async () => {
    if (!supUrl.trim() || !supKey.trim()) {
      showToast('URL ve Key giriniz.');
      return;
    }
    await dbService.setSupabaseConfig(supUrl, supKey);
    showToast('Bulut bağlantısı yapılandırıldı ☁️');
  };

  const reset = async () => {
    const doIt = async () => {
      await dbService.resetAllProgress();
      await load();
      onRefreshStats();
      showToast('Tüm ilerleme sıfırlandı.');
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Tüm ilerlemeyi sıfırlamak istediğinize emin misiniz?')) doIt();
    } else {
      Alert.alert('Sıfırla', 'Tüm öğrenme ilerlemeniz sıfırlanacak. Emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sıfırla', style: 'destructive', onPress: doIt },
      ]);
    }
  };

  const done = stats.masteredCount + stats.knownCount;
  const totalXp =
    stats.masteredCount * 25 +
    stats.knownCount * 10 +
    stats.waitingCount * 5 +
    achSummary.xpFromAchievements;
  const displayScore = Math.max(totalXp, 420);
  const displayName =
    currentUser?.displayName ||
    (currentUser?.username === 'admin' ? 'Admin' : currentUser?.username) ||
    'Alex';

  const waveHeights = [18, 26, 22, 34, 28, 42, 36, 46, 38, 48, 40, 44];

  return (
    <ScrollView
      style={st.root}
      contentContainerStyle={st.content}
      showsVerticalScrollIndicator={false}
    >
      {toast && (
        <View style={st.toast}>
          <Ionicons name="checkmark-circle" size={18} color={C.green} />
          <Text style={st.toastText}>{toast}</Text>
        </View>
      )}

      {/* 1. KARŞILAMA & GÜNLÜK TEKRAR KOÇU KARTI (LingoPulse Prototip Üst Bölüm) */}
      <View style={st.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={st.greetingOverline}>Günaydın,</Text>
          <Text style={st.greetingTitle}>{displayName} 👋</Text>
          <Text style={st.greetingSub}>Bugünkü dil hedeflerini aşmaya hazır mısın?</Text>
        </View>

        <TouchableOpacity
          style={st.pulseCoachCard}
          onPress={() => onNavigateTab?.(stats.waitingCount > 0 ? 'quiz' : 'waiting')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={st.pulseCoachTitle}>Günlük Tekrar</Text>
            <View style={st.pulseCoachMetaRow}>
              <Ionicons name="pulse" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={st.pulseCoachSub}>
                {stats.waitingCount > 0 ? `${stats.waitingCount} Kelime Hazır` : 'Havuzu Aç'}
              </Text>
            </View>
          </View>
          <View style={st.pulseCoachIconWrap}>
            <Ionicons name="headset" size={18} color={C.w} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. GÜNLÜK AKTİVİTE HALKALARI & 3'LÜ DİKEY METRİK SÜTUNU */}
      <Animated.View
        style={[
          st.ringsAndMetricsGrid,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Sol: Çift Katmanlı Dairesel İlerleme Halkası */}
        <View style={st.ringCard}>
          <View style={st.ringCardTopRow}>
            <Text style={st.ringCardTitle}>Günlük Skor</Text>
            <View style={st.todayPill}>
              <Text style={st.todayPillText}>Bugün</Text>
            </View>
          </View>

          <View style={st.ringsCenterWrap}>
            {/* Dış Halka (Pulse Mercan/Turuncu) */}
            <View style={st.outerRing}>
              {/* İç Halka (Spotify Yeşili) */}
              <View style={st.innerRing}>
                <Text style={st.ringCenterLabel}>Toplam Puan</Text>
                <Text style={st.ringCenterValue}>{displayScore.toLocaleString()}</Text>
                <Text style={st.ringCenterTarget}>/ 1,000</Text>
                <View style={st.harikaPill}>
                  <Text style={st.harikaPillText}>Harika ⚡</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Sağ: 3'lü Dikey İstatistik Sütunu */}
        <View style={st.rightMetricsCol}>
          {/* Kelime */}
          <View style={st.metricCard}>
            <View style={[st.metricIconCircle, { backgroundColor: C.coralSoft }]}>
              <Ionicons name="flame" size={16} color={C.coral} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.metricLabel}>Kelime</Text>
              <Text style={[st.metricVal, { color: C.coral }]}>
                {done}{' '}
                <Text style={st.metricTarget}>/ {Math.max(30, done + 10)} hedef</Text>
              </Text>
            </View>
          </View>

          {/* Havuz & Dinleme */}
          <TouchableOpacity
            style={st.metricCard}
            onPress={() => onNavigateTab?.('waiting')}
            activeOpacity={0.8}
          >
            <View style={[st.metricIconCircle, { backgroundColor: C.greenSoft }]}>
              <Ionicons name="headset" size={16} color={C.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.metricLabel}>Havuzda</Text>
              <Text style={[st.metricVal, { color: C.greenLight }]}>
                {stats.waitingCount}{' '}
                <Text style={st.metricTarget}>kelime</Text>
              </Text>
            </View>
          </TouchableOpacity>

          {/* Doğruluk Oranı */}
          <View style={st.metricCard}>
            <View style={[st.metricIconCircle, { backgroundColor: C.orangeSoft }]}>
              <Ionicons name="disc" size={16} color={C.orange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.metricLabel}>İsabet</Text>
              <Text style={[st.metricVal, { color: C.orange }]}>
                %{Math.max(92, stats.learnedPercentage)}{' '}
                <Text style={st.metricTarget}>B1/B2</Text>
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* 3. HAFIZA KALICILIK RİTMİ (Pulse Heart Rate Kartı) */}
      <View style={st.retentionCard}>
        <View style={st.retentionHeader}>
          <View style={st.retentionTitleRow}>
            <Ionicons name="pulse" size={17} color={C.coral} />
            <Text style={st.retentionTitle}>Hafıza Kalıcılık Ritmi</Text>
          </View>
          <View style={st.activeStatusPill}>
            <View style={st.activeStatusDot} />
            <Text style={st.activeStatusText}>Aktif</Text>
          </View>
        </View>

        <View style={st.retentionBodyRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
              <Text style={st.retentionBigPct}>94%</Text>
              <Text style={st.retentionTag}>RETENTION</Text>
            </View>
            <Text style={st.retentionSub}>Aralıklı Tekrar • Optimal</Text>
          </View>

          {/* Ritmik Dalga Çubukları */}
          <View style={st.waveGraphWrap}>
            {waveHeights.map((h, idx) => {
              const isPeak = idx === 9;
              return (
                <View key={idx} style={st.waveCol}>
                  {isPeak && (
                    <View style={st.wavePeakBadge}>
                      <Text style={st.wavePeakText}>94%</Text>
                    </View>
                  )}
                  <View
                    style={[
                      st.waveBarItem,
                      {
                        height: h,
                        backgroundColor: isPeak
                          ? C.coral
                          : idx % 2 === 0
                          ? 'rgba(255, 75, 114, 0.55)'
                          : 'rgba(255, 133, 72, 0.35)',
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={st.daysFooterRow}>
          <Text style={st.dayText}>Pzt</Text>
          <Text style={st.dayText}>Sal</Text>
          <Text style={st.dayText}>Çar</Text>
          <Text style={st.dayText}>Per</Text>
          <Text style={st.dayTextActive}>Cum (Bugün)</Text>
          <Text style={st.dayText}>Cmt</Text>
          <Text style={st.dayText}>Paz</Text>
        </View>
      </View>

      {/* 4. BUGÜNÜN ÖĞRENME PLANI (Görselli Modül Kartları) */}
      <View style={st.planSection}>
        <View style={st.planHeaderRow}>
          <Text style={st.planSectionTitle}>Bugünün Öğrenme Planı</Text>
          <TouchableOpacity onPress={() => onNavigateTab?.('grammar')}>
            <Text style={st.planSeeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {/* Modül 1: Akademik Kelime Kampı */}
        <TouchableOpacity
          style={st.moduleCard}
          onPress={() => onNavigateTab?.('learn')}
          activeOpacity={0.82}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&auto=format&fit=crop&q=80',
            }}
            style={st.moduleThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={st.moduleTitle}>Akademik Kelime Kampı</Text>
            <Text style={st.moduleSub}>
              15 dk • {stats.totalWords.toLocaleString()} Kelimelik Bağlamsal Deste
            </Text>
          </View>
          <View style={st.moduleRight}>
            <Text style={[st.moduleStatusText, { color: C.green }]}>%80</Text>
            <Ionicons name="chevron-forward" size={15} color={C.t3} />
          </View>
        </TouchableOpacity>

        {/* Modül 2: Simple Present & Stative Verbs */}
        <TouchableOpacity
          style={st.moduleCard}
          onPress={() => onNavigateTab?.('grammar')}
          activeOpacity={0.82}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
            }}
            style={st.moduleThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={st.moduleTitle}>Simple Present & Stative Verbs</Text>
            <Text style={st.moduleSub}>20 dk • Adım Adım İnteraktif Kurallar</Text>
          </View>
          <View style={st.moduleRight}>
            <Text style={[st.moduleStatusText, { color: C.orange }]}>Başla</Text>
            <Ionicons name="chevron-forward" size={15} color={C.t3} />
          </View>
        </TouchableOpacity>

        {/* Modül 3: Bekleme Havuzu */}
        <TouchableOpacity
          style={st.moduleCard}
          onPress={() => onNavigateTab?.('waiting')}
          activeOpacity={0.82}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80',
            }}
            style={st.moduleThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={st.moduleTitle}>Kelime Tekrar Havuzu</Text>
            <Text style={st.moduleSub}>
              Havuzda {stats.waitingCount} kelime pratik için bekliyor
            </Text>
          </View>
          <View style={st.moduleRight}>
            <Text style={[st.moduleStatusText, { color: C.coral }]}>Havuz</Text>
            <Ionicons name="chevron-forward" size={15} color={C.t3} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 5. BAŞARIMLAR & ROZETLER */}
      <View style={st.achSectionHeader}>
        <View>
          <Text style={st.planSectionTitle}>Başarımlar & Rozetler</Text>
          <Text style={st.achSubText}>
            @{currentUser?.username || 'admin'} hesabınıza kayıtlı rozetler
          </Text>
        </View>
        <View style={st.achCounterPill}>
          <Ionicons name="medal" size={13} color={C.green} />
          <Text style={st.achCounterText}>
            {achSummary.unlockedCount} / {achSummary.totalCount}
          </Text>
        </View>
      </View>

      <View style={st.achGrid}>
        {achievements.map(ach => (
          <View
            key={ach.id}
            style={[st.achCard, ach.unlocked ? st.achCardUnlocked : st.achCardLocked]}
          >
            <View
              style={[
                st.achIconWrap,
                { backgroundColor: ach.unlocked ? C.greenSoft : C.elevated },
              ]}
            >
              <Ionicons
                name={(ach.icon || 'trophy') as any}
                size={17}
                color={ach.unlocked ? C.green : C.t3}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={st.achTitleRow}>
                <Text style={[st.achTitle, !ach.unlocked && { color: C.t2 }]}>
                  {ach.title}
                </Text>
                <View style={st.achXpChip}>
                  <Text
                    style={[
                      st.achXpText,
                      { color: ach.unlocked ? C.greenLight : C.t3 },
                    ]}
                  >
                    +{ach.xpReward} XP
                  </Text>
                </View>
              </View>
              <Text style={st.achDesc}>{ach.description}</Text>
            </View>
            <Ionicons
              name={ach.unlocked ? 'checkmark-circle' : 'lock-closed-outline'}
              size={18}
              color={ach.unlocked ? C.green : C.t3}
            />
          </View>
        ))}
      </View>

      {/* 6. HESAP & API SUNUCU AYARLARI ÇEKMECESİ */}
      <TouchableOpacity
        style={st.settingsDrawerBtn}
        onPress={() => setShowSettingsPanel(!showSettingsPanel)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={st.adminAvatarMini}>
            <Ionicons name="shield-checkmark" size={16} color="#050507" />
          </View>
          <View>
            <Text style={st.settingsDrawerTitle}>
              Hesap & API Ayarları (@{currentUser?.username || 'admin'})
            </Text>
            <Text style={st.settingsDrawerSub}>
              PostgreSQL Sunucusu, Gemini API Anahtarı ve Oturum Yönetimi
            </Text>
          </View>
        </View>
        <Ionicons
          name={showSettingsPanel ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={C.t2}
        />
      </TouchableOpacity>

      {showSettingsPanel && (
        <View style={{ marginTop: 10 }}>
          {currentUser && onLogout && (
            <View style={st.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={st.userName}>
                  Aktif Hesap: @{currentUser.username}
                </Text>
                <Text style={st.userHandle}>
                  Tüm başarımlar ve API anahtarları PostgreSQL veritabanında senkronize
                </Text>
              </View>
              <TouchableOpacity style={st.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={15} color={C.coral} />
                <Text style={st.logoutBtnText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={st.settCard}>
            <View style={st.settHeader}>
              <View style={[st.dbIconWrap, { backgroundColor: C.green }]}>
                <Ionicons name="server" size={16} color="#050507" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.settTitle}>PostgreSQL Sunucu Adresi</Text>
                <Text style={st.settSubtitle}>Docker API köprüsü bağlantı durumu</Text>
              </View>
              <View
                style={[
                  st.statusBadge,
                  dockerConnected ? st.statusBadgeOn : st.statusBadgeOff,
                ]}
              >
                <View
                  style={[
                    st.statusDot,
                    { backgroundColor: dockerConnected ? C.green : C.coral },
                  ]}
                />
                <Text
                  style={[
                    st.statusBadgeText,
                    { color: dockerConnected ? C.green : C.coral },
                  ]}
                >
                  {dockerConnected ? 'AKTİF' : 'YEREL'}
                </Text>
              </View>
            </View>

            <TextInput
              style={st.input}
              placeholder="http://localhost:3001"
              placeholderTextColor={C.t3}
              value={dockerUrl}
              onChangeText={setDockerUrl}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[st.saveBtn, { backgroundColor: C.green }]}
              onPress={testAndSaveDocker}
              disabled={testingDocker}
              activeOpacity={0.85}
            >
              {testingDocker ? (
                <ActivityIndicator size="small" color="#050507" />
              ) : (
                <Text style={[st.saveBtnText, { color: '#050507' }]}>
                  Bağlantıyı Test Et & Kaydet
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={st.settCard}>
            <View style={st.settHeader}>
              <View style={[st.dbIconWrap, { backgroundColor: C.coral }]}>
                <Ionicons name="key" size={16} color={C.w} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.settTitle}>Kayıtlı API Anahtarı</Text>
                <Text style={st.settSubtitle}>Admin hesabınıza tanımlı anahtar</Text>
              </View>
            </View>

            <TextInput
              style={st.input}
              placeholder="API Anahtarınızı girin"
              placeholderTextColor={C.t3}
              value={gemKey}
              onChangeText={setGemKey}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[st.saveBtn, { backgroundColor: C.coral }]}
              onPress={saveGemini}
              activeOpacity={0.85}
            >
              <Text style={st.saveBtnText}>Anahtarı Güncelle</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={st.advancedToggle}
            onPress={() => setShowAdvanced(!showAdvanced)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showAdvanced ? 'chevron-up' : 'chevron-down'}
              size={15}
              color={C.t3}
            />
            <Text style={st.advancedToggleText}>Bulut Senkronizasyonu (Supabase)</Text>
          </TouchableOpacity>

          {showAdvanced && (
            <View style={st.settCard}>
              <Text style={st.inputLabel}>Supabase URL</Text>
              <TextInput
                style={st.input}
                placeholder="https://xxx.supabase.co"
                placeholderTextColor={C.t3}
                value={supUrl}
                onChangeText={setSupUrl}
                autoCapitalize="none"
              />
              <Text style={st.inputLabel}>Anon Key</Text>
              <TextInput
                style={st.input}
                placeholder="eyJhbGciOi..."
                placeholderTextColor={C.t3}
                value={supKey}
                onChangeText={setSupKey}
                autoCapitalize="none"
                secureTextEntry
              />
              <TouchableOpacity
                style={[st.saveBtn, { backgroundColor: C.elevated }]}
                onPress={saveSupabase}
              >
                <Text style={st.saveBtnText}>Bulut Bağlantısını Kaydet</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={st.resetBtn} onPress={reset} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={16} color={C.coral} />
            <Text style={st.resetText}>Tüm Öğrenme İlerlemesini Sıfırla</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 60 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.card,
    padding: 13,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.greenBorder,
  },
  toastText: { color: C.w, fontSize: 12, fontWeight: '700', flex: 1 },

  // 1. Greeting & Pulse Coach Card
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  greetingOverline: {
    color: C.t2,
    fontSize: 12,
    fontWeight: '500',
  },
  greetingTitle: {
    color: C.w,
    fontSize: 23,
    fontWeight: '800',
    marginTop: 1,
  },
  greetingSub: {
    color: C.t2,
    fontSize: 11,
    marginTop: 2,
  },
  pulseCoachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.coral,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 18,
    ...C.shadow.glow(C.coral),
  },
  pulseCoachTitle: {
    color: C.w,
    fontSize: 12,
    fontWeight: '800',
  },
  pulseCoachMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  pulseCoachSub: {
    color: 'rgba(255, 255, 255, 0.90)',
    fontSize: 10,
    fontWeight: '700',
  },
  pulseCoachIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 2. Dual Ring + 3 Metrics Column
  ringsAndMetricsGrid: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 14,
  },
  ringCard: {
    flex: 7,
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 15,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'space-between',
  },
  ringCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ringCardTitle: {
    color: C.w,
    fontSize: 12,
    fontWeight: '700',
  },
  todayPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  todayPillText: {
    color: C.t2,
    fontSize: 10,
    fontWeight: '600',
  },
  ringsCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 9,
    borderColor: C.coral,
    borderLeftColor: C.orange,
    borderBottomColor: 'rgba(255, 75, 114, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    borderColor: C.green,
    borderRightColor: C.greenLight,
    borderBottomColor: 'rgba(29, 185, 84, 0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenterLabel: {
    color: C.t2,
    fontSize: 9,
    fontWeight: '600',
  },
  ringCenterValue: {
    color: C.w,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ringCenterTarget: {
    color: C.t3,
    fontSize: 9,
  },
  harikaPill: {
    marginTop: 3,
    backgroundColor: C.coralSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  harikaPillText: {
    color: C.coral,
    fontSize: 9,
    fontWeight: '800',
  },

  rightMetricsCol: {
    flex: 5,
    justifyContent: 'space-between',
    gap: 9,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: C.card,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  metricIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    color: C.t2,
    fontSize: 10,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  metricTarget: {
    color: C.t3,
    fontSize: 10,
    fontWeight: '500',
  },

  // 3. Retention Card
  retentionCard: {
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  retentionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  retentionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retentionTitle: {
    color: C.w,
    fontSize: 12,
    fontWeight: '700',
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  activeStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  activeStatusText: {
    color: C.green,
    fontSize: 10,
    fontWeight: '700',
  },
  retentionBodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  retentionBigPct: {
    color: C.w,
    fontSize: 24,
    fontWeight: '800',
  },
  retentionTag: {
    color: C.coral,
    fontSize: 10,
    fontWeight: '800',
  },
  retentionSub: {
    color: C.t2,
    fontSize: 10,
    marginTop: 2,
  },
  waveGraphWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 58,
  },
  waveCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wavePeakBadge: {
    backgroundColor: C.coral,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginBottom: 3,
  },
  wavePeakText: {
    color: C.w,
    fontSize: 8,
    fontWeight: '800',
  },
  waveBarItem: {
    width: 6,
    borderRadius: 999,
  },
  daysFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  dayText: {
    color: C.t3,
    fontSize: 10,
    fontWeight: '500',
  },
  dayTextActive: {
    color: C.w,
    fontSize: 10,
    fontWeight: '800',
  },

  // 4. Learning Plan Modules
  planSection: {
    marginBottom: 16,
    gap: 9,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  planSectionTitle: {
    color: C.w,
    fontSize: 13,
    fontWeight: '800',
  },
  planSeeAllText: {
    color: C.coral,
    fontSize: 11,
    fontWeight: '700',
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  moduleThumb: {
    width: 56,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.surface,
  },
  moduleTitle: {
    color: C.w,
    fontSize: 12,
    fontWeight: '700',
  },
  moduleSub: {
    color: C.t2,
    fontSize: 10,
    marginTop: 2,
  },
  moduleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 4,
  },
  moduleStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // 5. Achievements
  achSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  achSubText: {
    color: C.t3,
    fontSize: 10,
    marginTop: 1,
  },
  achCounterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.greenBorder,
  },
  achCounterText: {
    color: C.greenLight,
    fontSize: 11,
    fontWeight: '800',
  },
  achGrid: {
    gap: 8,
    marginBottom: 16,
  },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
  },
  achCardUnlocked: {
    borderColor: 'rgba(29, 185, 84, 0.35)',
  },
  achCardLocked: {
    borderColor: C.border,
    opacity: 0.65,
  },
  achIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  achTitle: {
    color: C.w,
    fontSize: 12,
    fontWeight: '800',
  },
  achXpChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  achXpText: {
    fontSize: 9,
    fontWeight: '800',
  },
  achDesc: {
    color: C.t2,
    fontSize: 11,
    marginTop: 2,
  },

  // 6. Settings Drawer
  settingsDrawerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  adminAvatarMini: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsDrawerTitle: {
    color: C.w,
    fontSize: 13,
    fontWeight: '800',
  },
  settingsDrawerSub: {
    color: C.t2,
    fontSize: 10,
    marginTop: 1,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  userName: {
    color: C.w,
    fontSize: 13,
    fontWeight: '800',
  },
  userHandle: {
    color: C.t2,
    fontSize: 10,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.coralSoft,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 11,
  },
  logoutBtnText: {
    color: C.coral,
    fontSize: 11,
    fontWeight: '800',
  },

  settCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  settHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dbIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settTitle: { color: C.w, fontSize: 14, fontWeight: '800' },
  settSubtitle: { color: C.t2, fontSize: 11, marginTop: 1 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeOn: { backgroundColor: C.greenSoft },
  statusBadgeOff: { backgroundColor: C.coralSoft },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: 10, fontWeight: '800' },

  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  advancedToggleText: { color: C.t2, fontSize: 12, fontWeight: '600' },

  inputLabel: { color: C.t2, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: C.w,
    fontSize: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: C.w, fontSize: 13, fontWeight: '800' },

  resetBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: C.coralSoft,
    marginTop: 6,
  },
  resetText: { color: C.coral, fontSize: 12, fontWeight: '800' },
});
