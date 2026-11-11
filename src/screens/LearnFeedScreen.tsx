import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

interface ViewToken {
  item: any;
  key: string;
  index: number | null;
  isViewable: boolean;
}
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { WordItem } from '../data/words';
import { dbService } from '../services/db';
import { TtsService } from '../services/tts';

const DEFAULT_LEVEL_COUNTS: Record<string, number> = {
  ALL: 14938,
  A1: 1200,
  A2: 2100,
  B1: 3200,
  B2: 3600,
  C1: 2800,
  C2: 2038,
};

interface CurriculumDeck {
  level: string;
  title: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  desc: string;
  themeColor: string;
  fallbackCount: string;
}

const CURRICULUM_DECKS: CurriculumDeck[] = [
  {
    level: 'A1',
    title: 'Temel Günlük İletişim',
    tag: '%68 Tamamlandı',
    tagColor: '#88C2AE',
    tagBg: 'rgba(104, 166, 145, 0.15)',
    desc: 'Zamirler, temel fiiller ve günlük diyalog çekirdeği',
    themeColor: '#68A691',
    fallbackCount: '398',
  },
  {
    level: 'A2',
    title: 'Pratik İfade & Deneyim',
    tag: '%34 Tamamlandı',
    tagColor: '#E5B976',
    tagBg: 'rgba(212, 163, 89, 0.15)',
    desc: 'Sosyal yaşam, seyahat, iş ve deneyim kelimeleri',
    themeColor: '#D4A359',
    fallbackCount: '1.7K',
  },
  {
    level: 'B1',
    title: 'İş & Küresel Gündem',
    tag: 'Önerilen Seviye',
    tagColor: '#F08A73',
    tagBg: 'rgba(224, 109, 83, 0.15)',
    desc: 'Sunum, raporlama ve soyut kavramları açıklama',
    themeColor: '#E06D53',
    fallbackCount: '2.4K',
  },
  {
    level: 'B2',
    title: 'Akademik Makale & IELTS',
    tag: 'AWL Listesi',
    tagColor: '#A8A39D',
    tagBg: '#262523',
    desc: 'Tez, bilimsel analiz ve akademik tartışma kelimeleri',
    themeColor: '#7A9A95',
    fallbackCount: '3.1K',
  },
  {
    level: 'C1',
    title: 'İleri Düzey Akademik Analiz',
    tag: 'C1 İleri',
    tagColor: '#A8A39D',
    tagBg: '#262523',
    desc: 'Karmaşık sentaks, retorik ve üst düzey literatür',
    themeColor: '#B89278',
    fallbackCount: '2.8K',
  },
  {
    level: 'C2',
    title: 'Edebi & Profesyonel Ustalık',
    tag: 'Grandmaster',
    tagColor: '#E5B976',
    tagBg: 'rgba(212, 163, 89, 0.15)',
    desc: 'İleri düzey nüanslar, deyimsel ustalık ve retorik',
    themeColor: '#D4A359',
    fallbackCount: '2.0K',
  },
];

const LEVEL_KEYS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const POS_TR_MAP: Record<string, string> = {
  noun: 'NOUN (İSİM)',
  verb: 'VERB (FİİL)',
  adjective: 'ADJECTIVE (SIFAT)',
  adverb: 'ADVERB (ZARF)',
  preposition: 'PREPOSITION (EDAT)',
  conjunction: 'CONJUNCTION (BAĞLAÇ)',
};

const LEVEL_THEME_MAP: Record<string, string> = {
  A1: 'TEMEL GÜNLÜK İLETİŞİM',
  A2: 'SOSYAL YAŞAM & DENEYİM',
  B1: 'KARAKTER & İŞ DÜNYASI',
  B2: 'DOĞA, ZAMAN & MODERN DÜNYA',
  C1: 'İLERİ AKADEMİK ANALİZ',
  C2: 'EDEBİ & PROFESYONEL USTALIK',
};

const LEVEL_COLOR_MAP: Record<string, string> = {
  A1: '#68A691',
  A2: '#D4A359',
  B1: '#E06D53',
  B2: '#7A9A95',
  C1: '#B89278',
  C2: '#D4A359',
};

function syllabifyWord(word: string): string {
  const clean = word.toLowerCase();
  if (clean.length <= 4) return clean;
  const parts = clean.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy](?![aeiouy]))*/gi);
  if (!parts || parts.length <= 1) return clean;
  return parts.join(' • ');
}

function buildCollocation(item: WordItem): string {
  const w = item.word.toLowerCase();
  if (item.sampleEn) {
    const words = item.sampleEn
      .replace(/[.,?!";:()]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    const idx = words.findIndex(tok => tok.toLowerCase().startsWith(w.slice(0, 4)));
    if (idx >= 0) {
      if (idx + 1 < words.length) {
        return `Kalıp: "${words[idx]} ${words[idx + 1]}"`;
      }
      if (idx - 1 >= 0) {
        return `Kalıp: "${words[idx - 1]} ${words[idx]}"`;
      }
    }
  }
  return `Kalıp: "${w} + context"`;
}

function buildCleanHint(item: WordItem): string {
  const raw = (item.mnemonicHint || '').trim();
  if (!raw) {
    return `"${item.translation}" anlamında kullanılır. ${
      item.sampleTr || 'Bağlam içinde yüksek sıklıkla karşımıza çıkar.'
    }`;
  }
  if (raw.startsWith('Tanım:')) {
    const cleaned = raw.replace(/^Tanım:\s*/i, '');
    return `"${item.translation}" (${cleaned})`;
  }
  return raw;
}

// Native platformlar için sadece alt %38'lik kısmı yumuşakça karartan, fotoğrafın üstünü net bırakan gradyan
const GRADIENT_STEPS = [
  { height: '38%', opacity: 0.04 },
  { height: '32%', opacity: 0.08 },
  { height: '26%', opacity: 0.14 },
  { height: '21%', opacity: 0.22 },
  { height: '16%', opacity: 0.34 },
  { height: '12%', opacity: 0.48 },
  { height: '8%', opacity: 0.64 },
  { height: '5%', opacity: 0.80 },
  { height: '2%', opacity: 0.94 },
];

function getHighResImageUrl(rawUrl?: string): string {
  const fallback =
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=720&auto=format&fit=crop&q=80';
  if (!rawUrl) return fallback;
  return rawUrl
    .replace(/([?&])w=\d+/i, '$1w=720')
    .replace(/([?&])q=\d+/i, '$1q=80');
}

interface Props {
  onRefreshStats: () => void;
  onNavigateToWaiting: () => void;
}

export const LearnFeedScreen: React.FC<Props> = ({ onRefreshStats, onNavigateToWaiting }) => {
  const { width: winW, height: winH } = useWindowDimensions();
  const [containerW, setContainerW] = useState<number>(winW);
  const [listAreaH, setListAreaH] = useState<number>(Math.max(430, winH - 230));

  const effectiveW = containerW > 0 ? containerW : winW;
  const CARD_GAP = 14;
  const CARD_SIDE_PADDING = 16;
  const CARD_WIDTH = Math.max(260, effectiveW - CARD_SIDE_PADDING * 2);
  const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
  const CARD_HEIGHT = Math.max(410, listAreaH - 8);

  const [words, setWords] = useState<WordItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [levelCounts, setLevelCounts] = useState<Record<string, number>>(DEFAULT_LEVEL_COUNTS);
  const [viewMode, setViewMode] = useState<'menu' | 'feed'>('menu');

  const openDeck = (lvl: string) => {
    setSelectedLevel(lvl);
    setViewMode('feed');
  };

  const flatListRef = useRef<FlatList>(null);
  const flipAnims = useRef<Record<number, Animated.Value>>({});
  const offsetRef = useRef(0);
  const isFetchingMore = useRef(false);
  const hasMoreRef = useRef(true);
  const wordsRef = useRef<WordItem[]>([]);

  const cardEnterAnim = useRef(new Animated.Value(0)).current;
  const actionSwipeAnim = useRef(new Animated.Value(0)).current;

  const syncStatsAndCounts = async () => {
    const s = await dbService.getStats();
    if (s.levelCounts && Object.keys(s.levelCounts).length > 0) {
      setLevelCounts({
        ALL: s.totalWords || 14938,
        ...DEFAULT_LEVEL_COUNTS,
        ...s.levelCounts,
      });
    } else if (s.totalWords > 0) {
      setLevelCounts(prev => ({ ...prev, ALL: s.totalWords }));
    }
  };


  const loadInitial = async (lvl = selectedLevel) => {
    setLoading(true);
    offsetRef.current = 0;
    hasMoreRef.current = true;
    cardEnterAnim.setValue(0);

    // İstatistik senkronizasyonunu arka planda yap, kelimelerin gelmesini geciktirme
    syncStatsAndCounts().catch(() => {});

    const initialWords = await dbService.getFeedWords(lvl, 0, 35);
    setWords(initialWords);
    wordsRef.current = initialWords;
    offsetRef.current = initialWords.length;
    hasMoreRef.current = initialWords.length >= 35;
    setActiveIdx(0);
    setFlippedCards(new Set());
    flipAnims.current = {};

    setLoading(false);

    Animated.spring(cardEnterAnim, {
      toValue: 1,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };


  const loadMore = async () => {
    if (isFetchingMore.current || !hasMoreRef.current) return;
    isFetchingMore.current = true;
    const nextWords = await dbService.getFeedWords(selectedLevel, offsetRef.current, 35);
    if (nextWords.length === 0) {
      hasMoreRef.current = false;
    } else {
      setWords(prev => {
        const existingIds = new Set(prev.map(x => x.id));
        const uniqueNext = nextWords.filter(x => !existingIds.has(x.id));
        const updated = [...prev, ...uniqueNext];
        wordsRef.current = updated;
        return updated;
      });
      offsetRef.current += nextWords.length;
      if (nextWords.length < 35) hasMoreRef.current = false;
    }
    isFetchingMore.current = false;
  };


  useEffect(() => {
    loadInitial(selectedLevel);
  }, [selectedLevel]);

  const getFlipAnim = (id: number) => {
    if (!flipAnims.current[id]) {
      flipAnims.current[id] = new Animated.Value(0);
    }
    return flipAnims.current[id];
  };


  const toggleFlipCard = (id: number) => {
    const anim = getFlipAnim(id);
    const isCurrentlyFlipped = flippedCards.has(id);

    if (isCurrentlyFlipped) {
      Animated.spring(anim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }).start(() => {
        setFlippedCards(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      });
    } else {
      setFlippedCards(prev => new Set(prev).add(id));
      Animated.spring(anim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }).start();
    }
  };


  const viewabilityConfigCallbackPairs = useRef<any>([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 55 },
      onViewableItemsChanged: ({ viewableItems }: any) => {
        if (viewableItems.length > 0 && viewableItems[0].index != null) {
          const idx = viewableItems[0].index;
          setActiveIdx(idx);
          if (idx >= wordsRef.current.length - 20) {
            loadMore();
          }
        }
      },
    },
  ]);

  const markAndRemove = async (wordId: number, status: 'known' | 'waiting') => {
    const dir = status === 'waiting' ? 1 : -1;
    Animated.sequence([
      Animated.timing(actionSwipeAnim, {
        toValue: dir * 20,
        duration: 95,
        useNativeDriver: true,
      }),
      Animated.spring(actionSwipeAnim, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 1. KULLANICI DOKUNDUĞU AN (0 milisaniye) KARTI KALDIR VE ARAYÜZÜ YENİLE:
    const newWords = words.filter(w => w.id !== wordId);
    setWords(newWords);
    wordsRef.current = newWords;
    setFlippedCards(prev => {
      const n = new Set(prev);
      n.delete(wordId);
      return n;
    });

    if (newWords.length <= 15 && hasMoreRef.current) {
      loadMore();
    } else if (newWords.length === 0) {
      loadInitial(selectedLevel);
    }

    // 2. Veritabanını ve yerel hafızayı arka planda sessizce güncelle (UI'ı ASLA bekletme):
    dbService.updateWordStatus(wordId, status)
      .then(() => onRefreshStats())
      .catch(() => {});
  };


  const activeWord = words[activeIdx];

  const renderCard = useCallback(
    ({ item, index }: { item: WordItem; index: number }) => {
    const isFlipped = flippedCards.has(item.id);
    const anim = getFlipAnim(item.id);
    const posKey = (item.partOfSpeech || 'noun').toLowerCase();
    const posLabel = POS_TR_MAP[posKey] || item.partOfSpeech.toUpperCase();
    const themeLabel = LEVEL_THEME_MAP[item.level] || 'DOĞA & ZAMAN KAVRAMI';
    const levelColor = LEVEL_COLOR_MAP[item.level] || '#1DB954';
    const syllables = syllabifyWord(item.word);
    const collocation = buildCollocation(item);
    const cleanHint = buildCleanHint(item);

    return (
      <View
        style={[
          st.cardOuter,
          { width: CARD_WIDTH, height: CARD_HEIGHT, marginRight: CARD_GAP },
        ]}
      >
        <View
          style={[
            st.card,
            isFlipped && st.cardFlippedBorder,
          ]}
        >
          {!isFlipped ? (
            /* ================= KART ÖN YÜZÜ (%65 BÜYÜK GÖRSEL + EN ALTTA BİTİŞİK KUTULAR) ================= */
            <View style={st.frontCardLayout}>
              {/* ÜST BÜYÜK RESİM ALANI: Normal View üzerinde flex: 1 olduğu için alttaki iki kutu dışındaki TÜM alanı resim kaplar */}
              <View style={st.imageSection}>
                <Image
                  source={{
                    uri: getHighResImageUrl(item.imageUrl),
                  }}
                  style={st.cardImage}
                  resizeMode="cover"
                />

                {/* Sadece alt yazıların olduğu bölümü yumuşakça karartan, üst fotoğrafı tamamen net ve parlak bırakan gradyan */}
                {Platform.OS === 'web' ? (
                  <View
                    pointerEvents="none"
                    style={
                      [
                        StyleSheet.absoluteFill,
                        {
                          backgroundImage:
                            'linear-gradient(to top, #1C1C22 0%, rgba(28, 28, 34, 0.72) 15%, rgba(28, 28, 34, 0.14) 36%, rgba(0, 0, 0, 0) 62%)',
                        },
                      ] as any
                    }
                  />
                ) : (
                  GRADIENT_STEPS.map((g, i) => (
                    <View
                      key={i}
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: g.height as any,
                        backgroundColor: `rgba(28, 28, 34, ${g.opacity})`,
                      }}
                    />
                  ))
                )}

                {/* Tıklanabilir Arka Plan (Kartı çevirmek için) */}
                <TouchableOpacity
                  style={StyleSheet.absoluteFill}
                  activeOpacity={0.95}
                  onPress={() => toggleFlipCard(item.id)}
                />

                {/* Görsel Üstü Etiketler (Sol üst: Seviye & Tür, Sağ üst: Seslendirme) */}
                <View style={st.imageTopHud} pointerEvents="box-none">
                  <View style={st.badgeCluster} pointerEvents="none">
                    <View style={st.lvlBadge}>
                      <Text style={st.lvlText}>{item.level}</Text>
                    </View>
                    <View style={st.typeBadge}>
                      <Text style={st.typeText}>{posLabel}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={st.speakFab}
                    onPress={() => TtsService.speak(item.word)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="volume-high" size={18} color={C.green} />
                  </TouchableOpacity>
                </View>

                {/* Görselin En Alt Kısmına Gömülü Kelime ve Fonetik Okunuş */}
                <View style={st.heroWordOverlay} pointerEvents="none">
                  <Text style={st.wordThemeText}>{themeLabel}</Text>
                  <Text
                    style={st.wordText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item.word}
                  </Text>
                  <View style={st.phoneticRow}>
                    {item.phonetic ? (
                      <View style={st.phoneticPill}>
                        <View style={st.phoneticIconBox}>
                          <Ionicons name="stats-chart" size={10} color="#050507" />
                        </View>
                        <Text style={st.phoneticText}>{item.phonetic}</Text>
                      </View>
                    ) : null}
                    <Text style={st.syllablesText}>{syllables}</Text>
                  </View>
                </View>
              </View>

              {/* ALT ÖĞRETİCİ BÖLÜM: flexGrow: 0 sayesinde asla boşluk bırakmaz, iki kutu birbirine bitişik durur */}
              <View style={st.frontBottomSection}>
                {/* Akademik İpucu & Köken Kutusu */}
                <View style={st.hintSurfaceBox}>
                  <View style={st.hintTopRow}>
                    <View style={st.hintLabelRow}>
                      <Ionicons name="bulb" size={14} color={C.orange} />
                      <Text style={st.hintLabelText}>AKADEMİK İPUCU & KÖKEN</Text>
                    </View>
                    <View style={st.collocationPill}>
                      <Text style={st.collocationText} numberOfLines={1}>
                        {collocation}
                      </Text>
                    </View>
                  </View>
                  <Text style={st.hintBodyText} numberOfLines={2}>
                    <Text style={{ color: C.w, fontWeight: '800' }}>Kavram: </Text>
                    {cleanHint}
                  </Text>
                </View>

                {/* Kartı Çevir & Detaylı Öğren Barı */}
                <TouchableOpacity
                  style={st.flipTriggerBar}
                  onPress={() => toggleFlipCard(item.id)}
                  activeOpacity={0.82}
                >
                  <View style={st.flipBarLeft}>
                    <View style={st.flipIconBox}>
                      <Ionicons name="repeat" size={16} color={C.green} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.flipBarTitle}>Kartı Çevir & Detaylı Öğren</Text>
                      <Text style={st.flipBarSub} numberOfLines={1}>
                        Türkçe anlamı, örnek cümle ve eş anlamlılar
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={C.t2} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ================= KART ARKA YÜZÜ (PREMIUM BENTO DESIGN) ================= */
            <Animated.View
              style={[
                st.backFaceContainer,
                {
                  opacity: anim,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* ÜST BAR: Seviye + Kelime Türü Etiketleri ve Hızlı Kapat/Dön Butonu */}
              <View style={st.backTopNav}>
                <View style={st.backNavBadgeRow}>
                  <View style={[st.backLevelPill, { borderColor: levelColor }]}>
                    <View style={[st.backLevelDot, { backgroundColor: levelColor }]} />
                    <Text style={[st.backLevelText, { color: levelColor }]}>
                      CEFR {item.level}
                    </Text>
                  </View>
                  <View style={st.backPosPill}>
                    <Text style={st.backPosText}>{posLabel}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={st.backCloseBtn}
                  onPress={() => toggleFlipCard(item.id)}
                  activeOpacity={0.75}
                  accessibilityLabel="Ön yüze dön"
                >
                  <Ionicons name="close" size={18} color={C.w} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={st.backScrollArea}
                contentContainerStyle={st.backScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. HERO KELİME KARTI: İngilizce Kelime + Telaffuz + Ses + Türkçe Anlam */}
                <View style={st.backHeroCard}>
                  <View style={st.backHeroTopRow}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={st.backHeroWord} numberOfLines={1} adjustsFontSizeToFit>
                        {item.word}
                      </Text>
                      <View style={st.backHeroPhoneticRow}>
                        {item.phonetic ? (
                          <Text style={st.backHeroPhonetic}>/{item.phonetic}/</Text>
                        ) : null}
                        {syllables && syllables !== item.word ? (
                          <Text style={st.backHeroSyllables}>• {syllables}</Text>
                        ) : null}
                      </View>
                    </View>

                    <TouchableOpacity
                      style={st.backVoiceBtn}
                      onPress={() => TtsService.speak(item.word)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="volume-high" size={20} color="#050507" />
                    </TouchableOpacity>
                  </View>

                  {/* Türkçe Karşılık Alanı (Glow Banner) */}
                  <View style={st.backMeaningBanner}>
                    <View style={st.backMeaningHeader}>
                      <Ionicons name="language" size={13} color={C.greenLight} />
                      <Text style={st.backMeaningHeaderTitle}>TÜRKÇE ANLAMI</Text>
                    </View>
                    <Text style={st.backMeaningText}>{item.translation}</Text>
                  </View>
                </View>

                {/* 2. BENTO KUTUSU: Cümle İçinde Kullanımı (Sesli Dinleme) */}
                {item.sampleEn ? (
                  <View style={st.backExampleBox}>
                    <View style={st.backExampleHeader}>
                      <View style={st.backExampleLabelWrap}>
                        <Ionicons name="chatbubbles" size={14} color="#38BDF8" />
                        <Text style={st.backExampleLabel}>CÜMLE İÇİNDE KULLANIMI</Text>
                      </View>
                      <TouchableOpacity
                        style={st.backListenBtn}
                        onPress={() => TtsService.speak(item.sampleEn)}
                        activeOpacity={0.75}
                      >
                        <Ionicons name="volume-medium" size={14} color={C.greenLight} />
                        <Text style={st.backListenText}>Dinle</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={st.backExampleEn}>“{item.sampleEn}”</Text>
                    {item.sampleTr ? (
                      <Text style={st.backExampleTr}>{item.sampleTr}</Text>
                    ) : null}
                  </View>
                ) : null}

                {/* 3. BENTO KUTUSU: Akademik İpucu & Kavram Notu (Warm Amber) */}
                <View style={st.backInsightBox}>
                  <View style={st.backInsightHeaderRow}>
                    <View style={st.backInsightTitleWrap}>
                      <Ionicons name="bulb" size={14} color="#F59E0B" />
                      <Text style={st.backInsightTitle}>AKADEMİK İPUCU & KAVRAM</Text>
                    </View>
                    {collocation ? (
                      <View style={st.backCollocPill}>
                        <Ionicons name="link" size={10} color="#FBBF24" />
                        <Text style={st.backCollocText} numberOfLines={1}>
                          {collocation}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={st.backInsightText}>{cleanHint}</Text>
                </View>

                {/* 4. MİKRO STATS / TEMA ETİKETİ */}
                <View style={st.backMetaRow}>
                  <View style={st.backMetaPill}>
                    <Ionicons name="compass-outline" size={12} color={C.t2} />
                    <Text style={st.backMetaText} numberOfLines={1}>{themeLabel}</Text>
                  </View>
                  <View style={st.backMetaPill}>
                    <Ionicons name="layers-outline" size={12} color={C.t2} />
                    <Text style={st.backMetaText}>Lingo Pulse Deck</Text>
                  </View>
                </View>
              </ScrollView>

              {/* ALT AKSİYON: Ön Yüze & Görsele Dön Butonu (Glassmorphic Tactile) */}
              <TouchableOpacity
                style={st.backReturnPillBtn}
                onPress={() => toggleFlipCard(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="image-outline" size={16} color={C.greenLight} />
                <Text style={st.backReturnPillText}>Ön Yüze & Fotoğrafa Dön</Text>
                <Ionicons name="arrow-undo" size={14} color={C.t2} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }, [flippedCards, CARD_WIDTH, CARD_HEIGHT]);



  if (viewMode === 'menu') {
    return (
      <View style={st.root}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={st.menuScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. ÜST KART: BUGÜNÜN AKILLI ROTASI */}
          <View style={st.smartRouteCard}>
            <View style={st.smartRouteHeader}>
              <View style={st.smartRoutePill}>
                <Ionicons name="sparkles" size={12} color="#D4A359" />
                <Text style={st.smartRoutePillText}>GÜNLÜK ROTA</Text>
              </View>
              <Text style={st.smartRouteCountText}>Kesintisiz Akış</Text>
            </View>

            <Text style={st.smartRouteTitle}>
              Akademik & Günlük Kelime Havuzu
            </Text>
            <Text style={st.smartRouteDesc}>
              Seviyene özel seçilen kelimeler ve bağlam kartları kesintisiz akışla karşına gelir.
            </Text>

            {/* İlerleme Çubuğu & Günlük Hedef */}
            <View style={st.smartRouteTrackWrapper}>
              <View style={st.smartRouteGoalRow}>
                <Text style={st.smartRouteGoalLabel}>Günlük Hedef</Text>
                <Text style={st.smartRouteGoalValue}>14 / 20 Kelime</Text>
              </View>
              <View style={st.smartRouteTrack}>
                <View style={st.smartRouteFill} />
              </View>
            </View>

            <TouchableOpacity
              style={st.smartRouteBtn}
              onPress={() => openDeck('ALL')}
              activeOpacity={0.88}
            >
              <Text style={st.smartRouteBtnText}>Öğrenmeye Başla</Text>
              <Ionicons name="arrow-forward" size={16} color="#141413" />
            </TouchableOpacity>
          </View>

          {/* 2. BÖLÜM BAŞLIĞI: SEVİYE & MÜFREDAT DESTELERİ */}
          <View style={st.sectionHeaderRow}>
            <Text style={st.sectionHeaderTitle}>SEVİYE & MÜFREDAT DESTELERİ</Text>
            <View style={st.userLevelPill}>
              <Text style={st.sectionHeaderUserLevel}>
                Seviyen: <Text style={{ color: '#E06D53', fontWeight: '800' }}>B1</Text>
              </Text>
            </View>
          </View>

          {/* 3. DESTE LİSTESİ */}
          <View style={st.deckCardList}>
            {CURRICULUM_DECKS.map(deck => {
              const progressPct =
                deck.level === 'A1' ? 68 : deck.level === 'A2' ? 34 : deck.level === 'B1' ? 12 : 0;
              const isRecommended = deck.level === 'B1';

              return (
                <TouchableOpacity
                  key={deck.level}
                  style={[
                    st.deckCard,
                    isRecommended && { borderColor: 'rgba(224, 109, 83, 0.40)' },
                  ]}
                  onPress={() => openDeck(deck.level)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      st.deckLvlBox,
                      {
                        backgroundColor: '#141413',
                        borderColor: isRecommended ? 'rgba(224, 109, 83, 0.40)' : `${deck.themeColor}35`,
                      },
                    ]}
                  >
                    <Text style={[st.deckLvlText, { color: deck.themeColor }]}>
                      {deck.level}
                    </Text>
                    <View style={st.deckMiniTrack}>
                      <View
                        style={[
                          st.deckMiniFill,
                          { width: `${progressPct}%`, backgroundColor: deck.themeColor },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={st.deckMiddle}>
                    <View style={st.deckTitleRow}>
                      <Text style={st.deckTitle}>{deck.title}</Text>
                      <View style={[st.deckTagPill, { backgroundColor: deck.tagBg }]}>
                        <Text style={[st.deckTagText, { color: deck.tagColor }]}>
                          {deck.tag}
                        </Text>
                      </View>
                    </View>
                    <Text style={st.deckDesc} numberOfLines={2}>
                      {deck.desc}
                    </Text>
                  </View>

                  <View style={st.deckPlayBtn}>
                    <Ionicons name="play" size={14} color="#9E9A93" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={st.root}
      onLayout={e => {
        const w = e.nativeEvent.layout.width;
        if (w > 0 && Math.abs(w - containerW) > 2) {
          setContainerW(w);
        }
      }}
    >
      {/* Feed Üst Geri Dönüş ve Başlık Barı */}
      <View style={st.feedTopBar}>
        <TouchableOpacity
          style={st.feedBackBtn}
          onPress={() => setViewMode('menu')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={16} color="#E06D53" />
          <Text style={st.feedBackText}>Müfredat Desteleri</Text>
        </TouchableOpacity>

        <View style={st.currentDeckPill}>
          <Text style={st.currentDeckText}>
            {selectedLevel === 'ALL' ? 'Günlük Karma Paket' : `${selectedLevel} Seviyesi`}
          </Text>
        </View>
      </View>





      {loading ? (
        <View style={st.center}>
          <View style={st.loaderOrb}>
            <ActivityIndicator size="large" color={C.green} />
          </View>
          <Text style={st.loadText}>Akademik kelime destesi hazırlanıyor...</Text>
        </View>
      ) : words.length === 0 ? (
        <View style={st.center}>
          <View style={st.doneBadge}>
            <Ionicons name="trophy" size={40} color={C.green} />
          </View>
          <Text style={st.doneTitle}>Seviye Tamamlandı!</Text>
          <Text style={st.doneSub}>
            Bu seviyedeki tüm kelimeleri taradın. Şimdi bekleme havuzundaki kelimelerle Arena
            pratiğine geçebilirsin!
          </Text>
          <TouchableOpacity style={st.doneCta} onPress={onNavigateToWaiting}>
            <Text style={st.doneCtaText}>Havuza & Arenaya Geç →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View
            style={{ flex: 1 }}
            onLayout={e => {
              const h = e.nativeEvent.layout.height;
              if (h > 180 && Math.abs(h - listAreaH) > 4) {
                setListAreaH(h);
              }
            }}
          >
            <FlatList
              key={`feed-${Math.round(CARD_WIDTH)}`}
              ref={flatListRef}
              data={words}
              renderItem={renderCard}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: CARD_SIDE_PADDING, alignItems: 'center' }}
              viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              windowSize={5}
              removeClippedSubviews={Platform.OS !== 'web'}
              getItemLayout={(_, index) => ({
                length: SNAP_INTERVAL,
                offset: SNAP_INTERVAL * index,
                index,
              })}
            />
          </View>

          {/* ALT AKSİYON BUTONLARI (BİLİYORUM / ÇEVİR / ÖĞREN) */}
          {activeWord && (
            <View style={st.transportDeck}>
              {/* Biliyorum Butonu */}
              <TouchableOpacity
                style={st.passBtn}
                onPress={() => markAndRemove(activeWord.id, 'known')}
                activeOpacity={0.8}
              >
                <View style={st.passIconWrap}>
                  <Ionicons name="checkmark-sharp" size={16} color="#88C2AE" />
                </View>
                <View style={{ flexShrink: 1 }}>
                  <Text style={st.actionSubLabel}>GEÇ (+10 XP)</Text>
                  <Text style={st.passText} numberOfLines={1}>
                    Biliyorum
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Ortadaki Hızlı Çevir / Tekrar Butonu */}
              <TouchableOpacity
                style={st.centerFlipBtn}
                onPress={() => toggleFlipCard(activeWord.id)}
                activeOpacity={0.8}
                accessibilityLabel="Kartı Çevir"
              >
                <Ionicons name="refresh" size={18} color="#9E9A93" />
              </TouchableOpacity>

              {/* Öğrenme Havuzuna Ekle Butonu (Terra Cotta / Canlı Turuncu) */}
              <TouchableOpacity
                style={st.learnPrimaryBtn}
                onPress={() => markAndRemove(activeWord.id, 'waiting')}
                activeOpacity={0.85}
              >
                <View style={{ flexShrink: 1 }}>
                  <Text style={st.learnSubLabel}>HAVUZA (+5 XP)</Text>
                  <Text style={st.learnPrimaryText} numberOfLines={1}>
                    Öğren
                  </Text>
                </View>
                <View style={st.learnIconWrap}>
                  <Ionicons name="flash" size={16} color="#141413" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};


const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Müfredat Menüsü Stilleri
  menuScroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  smartRouteCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2E2D2B',
    padding: 20,
    ...C.shadow.md,
  },
  smartRouteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smartRoutePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 163, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.30)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
  },
  smartRoutePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D4A359',
    letterSpacing: 0.6,
  },
  smartRouteCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E9A93',
  },
  smartRouteTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F4F1EA',
    marginTop: 12,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  smartRouteDesc: {
    fontSize: 12,
    color: '#9E9A93',
    marginTop: 6,
    lineHeight: 18,
  },
  smartRouteTrackWrapper: {
    marginTop: 14,
    marginBottom: 16,
  },
  smartRouteGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  smartRouteGoalLabel: {
    fontSize: 11,
    color: '#8A857E',
    fontWeight: '600',
  },
  smartRouteGoalValue: {
    fontSize: 11,
    color: '#88C2AE',
    fontWeight: '800',
  },
  smartRouteTrack: {
    height: 6,
    backgroundColor: '#262523',
    borderRadius: 3,
    overflow: 'hidden',
  },
  smartRouteFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#68A691',
    borderRadius: 3,
  },
  smartRouteBtn: {
    backgroundColor: '#E06D53',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  smartRouteBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#141413',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A857E',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  userLevelPill: {
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionHeaderUserLevel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D5D0C8',
  },

  deckCardList: {
    gap: 12,
  },
  deckCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deckLvlBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckLvlText: {
    fontSize: 18,
    fontWeight: '900',
  },
  deckMiniTrack: {
    width: 28,
    height: 3,
    backgroundColor: '#262523',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginTop: 4,
  },
  deckMiniFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  deckMiddle: {
    flex: 1,
    marginHorizontal: 12,
  },
  deckTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deckTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F4F1EA',
  },
  deckTagPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  deckTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  deckDesc: {
    fontSize: 11.5,
    color: '#9E9A93',
    marginTop: 3,
    lineHeight: 16,
  },
  deckPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#141413',
    borderWidth: 1,
    borderColor: '#2C2B29',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Feed Üst Geri Dönüş Barı
  feedTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  feedBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  feedBackText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E06D53',
  },
  currentDeckPill: {
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentDeckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D5D0C8',
  },
  center: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  loaderOrb: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadText: { color: C.t2, marginTop: 12, fontSize: 13, fontWeight: '600' },
  doneBadge: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: C.greenSoft,
    borderWidth: 1,
    borderColor: C.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  doneTitle: { color: C.w, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  doneSub: {
    color: C.t2,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  doneCta: {
    backgroundColor: C.green,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 16,
  },
  doneCtaText: { color: '#050507', fontWeight: '800', fontSize: 14 },

  // Spotify Playlist Tarzı Seviye Filtresi
  filterWrap: {
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
  filterScroll: { gap: 8, paddingVertical: 2 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterChipActive: {
    backgroundColor: C.green,
    borderColor: C.green,
    ...C.shadow.glow(C.green),
  },
  filterDot: { width: 6, height: 6, borderRadius: 3 },
  filterChipText: { fontSize: 12, color: '#D4D4D8', fontWeight: '600' },
  filterChipTextActive: { color: '#050507', fontWeight: '800' },
  filterCountBox: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
  },
  filterCountBoxActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  filterCountText: { fontSize: 10, color: C.t3, fontWeight: '600' },
  filterCountTextActive: { color: '#050507', fontWeight: '800' },

  // Üst Akademik Başlık ve İlerleme
  topHudBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  hudLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deckTitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.t2,
  },
  hudProgressWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniTrack: {
    width: 78,
    height: 6,
    backgroundColor: C.card,
    borderRadius: 999,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: C.coral,
    borderRadius: 999,
  },
  progressCounter: { fontSize: 12, fontWeight: '700', color: C.w },

  // Ana 3B Kart
  cardOuter: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    ...C.shadow.lg,
  },
  cardFlippedBorder: {
    borderColor: 'rgba(29, 185, 84, 0.35)',
  },

  frontCardLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: C.card,
  },

  // Görsel Alanı: Normal View üzerinde flex: 1 olduğu için alttaki kutulara kadar tüm kartı doldurur
  imageSection: {
    flex: 1,
    position: 'relative',
    backgroundColor: C.surface,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  imageTopHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    zIndex: 10,
  },
  badgeCluster: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lvlBadge: {
    backgroundColor: C.green,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 9,
  },
  lvlText: { color: '#050507', fontSize: 12, fontWeight: '800' },
  typeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 9,
  },
  typeText: {
    color: C.w,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  speakFab: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroWordOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  wordThemeText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.orange,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  wordText: {
    fontSize: 38,
    fontWeight: '800',
    color: C.w,
    letterSpacing: -0.8,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  phoneticPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  phoneticIconBox: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneticText: { fontSize: 12, color: '#F4F4F5', fontWeight: '600' },
  syllablesText: { fontSize: 12, color: C.t2, fontWeight: '500' },

  // Ön Yüz Alt Bölüm: flexGrow: 0 ve flexShrink: 0 ile tam içeriği kadar yer kaplar, boşluk bırakmaz
  frontBottomSection: {
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 15,
    backgroundColor: C.card,
    gap: 10,
  },
  hintSurfaceBox: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: C.border,
    gap: 7,
  },
  hintTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  hintLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  hintLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.orange,
    letterSpacing: 0.6,
  },
  collocationPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: '48%',
  },
  collocationText: {
    fontSize: 10,
    fontWeight: '600',
    color: C.t2,
  },
  hintBodyText: {
    fontSize: 12,
    color: '#E4E4E7',
    lineHeight: 17,
  },

  flipTriggerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(38, 38, 46, 0.78)',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
  },
  flipBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  flipIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(29, 185, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipBarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.w,
  },
  flipBarSub: {
    fontSize: 10,
    color: C.t2,
    marginTop: 1,
  },

  // ================= ARKA YÜZ (PREMIUM BENTO DESIGN) =================
  backFaceContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0F1117',
    justifyContent: 'space-between',
  },
  backTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  backNavBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backLevelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  backLevelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  backLevelText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  backPosPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backPosText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  backCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backScrollArea: {
    flex: 1,
  },
  backScrollContent: {
    paddingVertical: 10,
    gap: 10,
  },

  // 1. Hero Word Card
  backHeroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  backHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backHeroWord: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  backHeroPhoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  backHeroPhonetic: {
    fontSize: 13,
    fontWeight: '600',
    color: C.greenLight,
  },
  backHeroSyllables: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  backVoiceBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  // Hero Meaning Banner
  backMeaningBanner: {
    backgroundColor: 'rgba(29, 185, 84, 0.09)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.22)',
  },
  backMeaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  backMeaningHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: C.greenLight,
    letterSpacing: 0.8,
  },
  backMeaningText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // 2. Bento Box: Example
  backExampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    gap: 6,
  },
  backExampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  backExampleLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backExampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.7,
  },
  backListenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.25)',
  },
  backListenText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.greenLight,
  },
  backExampleEn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  backExampleTr: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 2,
  },

  // 3. Bento Box: Insight & Concept Note (Warm Amber)
  backInsightBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.22)',
    borderRadius: 18,
    padding: 14,
    gap: 7,
  },
  backInsightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  backInsightTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backInsightTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.7,
  },
  backCollocPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: '50%',
  },
  backCollocText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
  },
  backInsightText: {
    fontSize: 12,
    color: '#F3F4F6',
    lineHeight: 18,
    fontWeight: '500',
  },

  // 4. Meta Row
  backMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backMetaPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  backMetaText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    flexShrink: 1,
  },

  // 5. Bottom Return Button
  backReturnPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    marginTop: 6,
  },
  backReturnPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Alt Aksiyon Butonları (Biliyorum / Çevir / Öğren)
  transportDeck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 10,
  },
  passBtn: {
    flex: 5,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1B1A',
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 116, 0.40)',
  },
  passIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(78, 135, 116, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 116, 0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#88C2AE',
    letterSpacing: 0.6,
  },
  passText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F4F1EA',
    marginTop: 2,
  },

  centerFlipBtn: {
    flex: 1.2,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
    justifyContent: 'center',
    alignItems: 'center',
  },

  learnPrimaryBtn: {
    flex: 5,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E06D53',
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  learnSubLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(20, 20, 19, 0.75)',
    letterSpacing: 0.6,
  },
  learnPrimaryText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#141413',
    marginTop: 2,
  },
  learnIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 20, 19, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
