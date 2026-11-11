import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { C } from './src/theme/colors';
import { LearnFeedScreen } from './src/screens/LearnFeedScreen';
import { GrammarScreen } from './src/screens/GrammarScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { WaitingPoolScreen } from './src/screens/WaitingPoolScreen';
import { GeminiQuizScreen } from './src/screens/GeminiQuizScreen';
import { StatsAndSettingsScreen } from './src/screens/StatsAndSettingsScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { dbService } from './src/services/db';
import { authService, AuthUser, AchievementItem } from './src/services/auth';

type Tab = 'learn' | 'grammar' | 'chat' | 'waiting' | 'quiz' | 'stats';

export default function App() {
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const [tab, setTab] = useState<Tab>('learn');
  const [waitC, setWaitC] = useState(0);
  const [mastC, setMastC] = useState(0);
  const [knownC, setKnownC] = useState(0);
  const [unlockedToast, setUnlockedToast] = useState<AchievementItem | null>(null);

  useEffect(() => {
    let mounted = true;
    authService.restore().then(restored => {
      if (!mounted) return;
      setUser(restored);
      setAuthChecking(false);
    });

    const unsub = authService.onAchievementUnlocked(items => {
      if (items && items.length > 0) {
        setUnlockedToast(items[0]);
        setTimeout(() => setUnlockedToast(null), 4500);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const refresh = async () => {
    const s = await dbService.getStats();
    setWaitC(s.waitingCount);
    setMastC(s.masteredCount);
    setKnownC(s.knownCount);
  };

  useEffect(() => {
    if (user) refresh();
  }, [tab, user]);

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (authChecking) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center' }]}>
          <StatusBar style="light" />
          <ActivityIndicator size="large" color={C.green} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={s.safe}>
          <StatusBar style="light" />
          <AuthScreen
            onAuthenticated={loggedInUser => {
              setUser(loggedInUser);
              refresh();
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const totalXp = Math.max(420, mastC * 25 + knownC * 10 + waitC * 5);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.safe}>
      <StatusBar style="light" />

      {/* UYGULAMA ÜST BAR (WARM CARBON & EDITORIAL MATTE HEADER) */}
      <View style={s.header}>
        {/* Sol: Lingo Pulse Mat Logo */}
        <TouchableOpacity
          style={s.headerLeft}
          activeOpacity={0.8}
          onPress={() => switchTab('learn')}
        >
          <View style={s.logoBox}>
            <Ionicons name="pulse" size={19} color="#E06D53" />
          </View>
          <View>
            <View style={s.brandRow}>
              <Text style={s.brand}>LINGO</Text>
              <View style={s.pulseTag}>
                <Text style={s.pulseTagText}>PULSE</Text>
              </View>
            </View>
            <Text style={s.brandSub}>AKADEMİK İNGİLİZCE</Text>
          </View>
        </TouchableOpacity>

        {/* Sağ Üst İstatistik & Profil (Warm Carbon Rozetler) */}
        <View style={s.headerRight}>
          {/* Seri (Streak / XP) - Gold / Ochre */}
          <TouchableOpacity
            style={s.xpPill}
            activeOpacity={0.8}
            onPress={() => switchTab('quiz')}
          >
            <Ionicons name="flame" size={14} color="#D4A359" />
            <Text style={s.xpValText}>{totalXp}</Text>
            <Text style={s.xpUnitText}>XP</Text>
          </TouchableOpacity>

          {/* Öğrenilen Kelime - Sage Green */}
          <TouchableOpacity
            style={s.masteredPill}
            activeOpacity={0.8}
            onPress={() => switchTab('waiting')}
          >
            <View style={s.masteredDot} />
            <Text style={s.masteredText}>{mastC + knownC} Usta</Text>
          </TouchableOpacity>

          {/* Kullanıcı Avatarı */}
          <TouchableOpacity
            style={s.avatarBtn}
            activeOpacity={0.8}
            onPress={() => switchTab('stats')}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              }}
              style={s.avatarImg}
            />
            <View style={s.avatarStatusDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Başarım Kazanıldı Bildirimi */}
      {unlockedToast && (
        <TouchableOpacity
          style={s.achToast}
          activeOpacity={0.9}
          onPress={() => {
            setUnlockedToast(null);
            switchTab('stats');
          }}
        >
          <View style={s.achToastDot} />
          <Text style={s.achToastTitle} numberOfLines={1}>
            🏆 {unlockedToast.title} (+{unlockedToast.xpReward} XP)
          </Text>
        </TouchableOpacity>
      )}

      {/* ANA İÇERİK ALANI */}
      <View style={s.screenContainer}>
        {tab === 'learn' && (
          <LearnFeedScreen
            onRefreshStats={refresh}
            onNavigateToWaiting={() => switchTab('waiting')}
          />
        )}
        {tab === 'grammar' && <GrammarScreen />}
        {tab === 'chat' && <ChatScreen />}
        {tab === 'waiting' && (
          <WaitingPoolScreen
            onRefreshStats={refresh}
            onStartQuiz={() => switchTab('quiz')}
            onNavigateToLearn={() => switchTab('learn')}
          />
        )}
        {tab === 'quiz' && (
          <GeminiQuizScreen
            onRefreshStats={refresh}
            onNavigateToLearn={() => switchTab('learn')}
            onNavigateToSettings={() => switchTab('stats')}
          />
        )}
        {tab === 'stats' && (
          <StatsAndSettingsScreen
            onRefreshStats={refresh}
            currentUser={user}
            onLogout={handleLogout}
            onNavigateTab={switchTab}
          />
        )}
      </View>

      {/* ALT NAVİGASYON BARI (WARM CARBON & FLOATING ZAP BUTONU) */}
      <View style={s.bottomNav}>
        {/* 1. Müfredat */}
        <TouchableOpacity
          style={s.navItem}
          onPress={() => switchTab('learn')}
          activeOpacity={0.75}
        >
          <Ionicons
            name={tab === 'learn' ? 'compass' : 'compass-outline'}
            size={22}
            color={tab === 'learn' ? C.coral : C.t4}
          />
          <Text
            style={[
              s.navLabel,
              tab === 'learn' && { color: C.coral, fontWeight: '800' },
            ]}
          >
            Müfredat
          </Text>
        </TouchableOpacity>

        {/* 2. Gramer */}
        <TouchableOpacity
          style={s.navItem}
          onPress={() => switchTab('grammar')}
          activeOpacity={0.75}
        >
          <Ionicons
            name={tab === 'grammar' ? 'book' : 'book-outline'}
            size={21}
            color={tab === 'grammar' ? C.coral : C.t4}
          />
          <Text
            style={[
              s.navLabel,
              tab === 'grammar' && { color: C.coral, fontWeight: '800' },
            ]}
          >
            Gramer
          </Text>
        </TouchableOpacity>

        {/* 3. ORTA YÜZEN (FLOATING) HIZLI PRATİK / HAVUZ BUTONU */}
        <View style={s.centerFabWrap}>
          <TouchableOpacity
            style={s.centerFab}
            onPress={() => switchTab(tab === 'quiz' && waitC > 0 ? 'waiting' : 'quiz')}
            activeOpacity={0.88}
          >
            <Ionicons name="flash" size={22} color="#141413" />
            {waitC > 0 && (
              <View style={s.fabBadge}>
                <Text style={s.fabBadgeText}>{waitC > 99 ? '99+' : waitC}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 4. Kelimelerim (Havuz) */}
        <TouchableOpacity
          style={s.navItem}
          onPress={() => switchTab('waiting')}
          activeOpacity={0.75}
        >
          <Ionicons
            name={tab === 'waiting' ? 'layers' : 'layers-outline'}
            size={21}
            color={tab === 'waiting' ? C.coral : C.t4}
          />
          <Text
            style={[
              s.navLabel,
              tab === 'waiting' && { color: C.coral, fontWeight: '800' },
            ]}
          >
            Kelimeler
          </Text>
        </TouchableOpacity>

        {/* 5. Pulse (Aktivite & İstatistik) */}
        <TouchableOpacity
          style={s.navItem}
          onPress={() => switchTab('stats')}
          activeOpacity={0.75}
        >
          <Ionicons
            name={tab === 'stats' ? 'pulse' : 'pulse-outline'}
            size={21}
            color={tab === 'stats' ? C.coral : C.t4}
          />
          <Text
            style={[
              s.navLabel,
              tab === 'stats' && { color: C.coral, fontWeight: '800' },
            ]}
          >
            Pulse
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop: Platform.OS === 'android' ? 28 : 0,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#141413',
    borderBottomWidth: 1,
    borderBottomColor: '#242321',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1F1E1C',
    borderWidth: 1,
    borderColor: '#302E2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    fontSize: 17,
    fontWeight: '900',
    color: '#F4F1EA',
    letterSpacing: -0.3,
  },
  pulseTag: {
    backgroundColor: 'rgba(224, 109, 83, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 83, 0.30)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  pulseTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E06D53',
    letterSpacing: 0.8,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8A857E',
    letterSpacing: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1C1B1A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C2B29',
  },
  xpValText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F4F1EA',
  },
  xpUnitText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A857E',
  },

  masteredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1B2421',
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 116, 0.30)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  masteredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#68A691',
  },
  masteredText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#88C2AE',
  },

  avatarBtn: {
    position: 'relative',
    marginLeft: 2,
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#363432',
  },
  avatarStatusDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E06D53',
    borderWidth: 2,
    borderColor: '#141413',
  },

  achToast: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: '#1C1B1A',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2C2B29',
    marginVertical: 4,
    ...C.shadow.md,
  },
  achToastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#68A691',
  },
  achToastTitle: {
    color: '#F4F1EA',
    fontSize: 12,
    fontWeight: '800',
  },

  screenContainer: {
    flex: 1,
    overflow: 'hidden',
  },

  bottomNav: {
    height: 66,
    backgroundColor: '#141413',
    borderTopWidth: 1,
    borderTopColor: '#262523',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A857E',
  },

  centerFabWrap: {
    position: 'relative',
    top: -14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  centerFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F4F1EA',
    borderWidth: 4,
    borderColor: '#141413',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  fabBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#E06D53',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#141413',
  },
  fabBadgeText: {
    color: '#141413',
    fontSize: 9,
    fontWeight: '900',
  },
});
