import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { WordItem } from '../data/words';
import { dbService } from '../services/db';
import { GeminiService, QuizQuestion } from '../services/gemini';
import { TtsService } from '../services/tts';

interface Props {
  onRefreshStats: () => void;
  onNavigateToLearn: () => void;
  onNavigateToSettings: () => void;
}

export const GeminiQuizScreen: React.FC<Props> = ({
  onRefreshStats,
  onNavigateToLearn,
}) => {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [waitCount, setWaitCount] = useState(0);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [streak, setStreak] = useState(3);
  const [bestStreak, setBestStreak] = useState(3);
  const [sessionXp, setSessionXp] = useState(45);

  const [learnedAsked, setLearnedAsked] = useState(false);
  const learnedPoolRef = useRef<WordItem[] | null>(null);
  const fallbackWordsRef = useRef<WordItem[] | null>(null);
  const resultAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const comboPulseAnim = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    questionAnim.setValue(0);
    Animated.spring(questionAnim, {
      toValue: 1,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const triggerComboPulse = () => {
    comboPulseAnim.setValue(0.8);
    Animated.spring(comboPulseAnim, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const loadQ = async () => {
    setLoading(true);
    setAnswered(false);
    setSelectedId(null);
    setCorrect(false);
    setLearnedAsked(false);
    resultAnim.setValue(0);

    const w = await dbService.getWaitingWords();
    setWaitCount(w.length);

    // Havuzda öğrenilecek kelime yoksa soru sorma (öğrenilmiş kelimeler tekrar sorulmaz)
    if (w.length === 0) {
      setQuestion(null);
      setLoading(false);
      return;
    }

    // Öğrenilmiş/bilinen kelimeleri sadece oturum başında bir kez çek (ağ ve RAM tasarrufu)
    if (!learnedPoolRef.current) {
      try {
        const [mastered, known] = await Promise.all([
          dbService.getWordsByStatus('mastered'),
          dbService.getWordsByStatus('known'),
        ]);
        learnedPoolRef.current = [...mastered, ...known];
      } catch {
        learnedPoolRef.current = [];
      }
    }

    const learnedPool = [...learnedPoolRef.current, ...w];

    // Şık sayısı 3'ten azsa sadece 15 kelimelik hafif bir yedek çek (1000 kelime indirmek yerine)
    if (learnedPool.length < 3 && !fallbackWordsRef.current) {
      try {
        fallbackWordsRef.current = await dbService.getFeedWords('ALL', 0, 15);
      } catch {
        fallbackWordsRef.current = [];
      }
    }

    const q = await GeminiService.generateQuestion(w, learnedPool, fallbackWordsRef.current || []);
    setQuestion(q);
    setLoading(false);
    setTimeout(animateIn, 40);
  };

  useEffect(() => {
    loadQ();
  }, []);

  const answerLearned = async (learned: boolean) => {
    if (!question) return;
    if (learned) {
      dbService.updateWordStatus(question.targetWord.id, 'mastered').then(() => onRefreshStats()).catch(() => {});
      setSessionXp(x => x + 25);
      if (learnedPoolRef.current) {
        learnedPoolRef.current.push(question.targetWord);
      }
    }
    loadQ();
  };

  const select = async (opt: WordItem) => {
    if (answered || !question) return;
    setSelectedId(opt.id);
    setAnswered(true);
    const ok = opt.id === question.targetWord.id;
    setCorrect(ok);
    setScore(p => ({ ok: p.ok + (ok ? 1 : 0), total: p.total + 1 }));

    if (ok) {
      const newStreak = streak + 1;
      const gained = 15;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setSessionXp(x => x + gained);
      triggerComboPulse();

      // Doğru bilmek kelimeyi "öğrenildi" yapmaz; kelime havuzda kalır ve tekrar sorulur.
      // Kullanıcı kelimeyi Kelimeler sekmesinden "Ustalaştım" ile kendisi öğrenilene taşır.
      TtsService.speak(question.targetWord.word);
    } else {
      setStreak(0);
    }

    Animated.spring(resultAnim, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
    return (
      <View style={st.center}>
        <View style={st.loadingOrb}>
          <ActivityIndicator size="large" color={C.green} />
        </View>
        <Text style={st.loadTitle}>Arena Hazırlanıyor...</Text>
        <Text style={st.loadSub}>Bağlamsal cümle tamamlama sorusu yükleniyor</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={st.center}>
        <View style={st.emptyIconWrap}>
          <Ionicons name="flash" size={42} color={C.green} />
        </View>
        <Text style={st.emptyTitle}>Öğrenilecek Kelime Yok</Text>
        <Text style={st.emptySub}>
          Havuzunda öğrenilecek kelime kalmadı. Müfredat ekranında "Öğren" diyerek yeni kelimeleri havuza ekle, sonra Arena'ya dön.
        </Text>
        <TouchableOpacity style={st.cta} onPress={onNavigateToLearn} activeOpacity={0.85}>
          <Ionicons name="compass" size={18} color="#050507" />
          <Text style={st.ctaText}>Kelime Keşfetmeye Git</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sentenceParts = question.sentence.split('[_____]');

  return (
    <ScrollView
      style={st.root}
      contentContainerStyle={st.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Üst Seri & Skor Kartları (Prototipteki 2'li Grid) */}
      <View style={st.topStatsGrid}>
        <Animated.View
          style={[
            st.statCard,
            { transform: [{ scale: comboPulseAnim }] },
          ]}
        >
          <View style={[st.statIconBox, { backgroundColor: C.orangeSoft }]}>
            <Ionicons name="flame" size={20} color={C.orange} />
          </View>
          <View>
            <Text style={st.statLabel}>SERİ KOMBO</Text>
            <Text style={[st.statValue, { color: C.orange }]}>{streak}x</Text>
          </View>
        </Animated.View>

        <View style={st.statCard}>
          <View style={[st.statIconBox, { backgroundColor: C.greenSoft }]}>
            <Ionicons name="trophy" size={20} color={C.green} />
          </View>
          <View>
            <Text style={st.statLabel}>ARENA KAZANCI</Text>
            <Text style={[st.statValue, { color: C.greenLight }]}>+{sessionXp} XP</Text>
          </View>
        </View>
      </View>

      {/* Soru Kartı (Görsel Bağlamlı Akıllı Boşluk Doldurma) */}
      <Animated.View
        style={[
          st.qCard,
          {
            opacity: questionAnim,
            transform: [
              {
                translateY: questionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={st.qCardHeader}>
          <View style={st.qTypeBadge}>
            <Ionicons name="disc" size={12} color={C.coral} />
            <Text style={st.qTypeText}>BAĞLAMSAL CÜMLE TAMAMLAMA</Text>
          </View>

          <View style={st.qLevelBadge}>
            <Text style={st.qLevelText}>
              {question.targetWord.level} • {(question.targetWord.partOfSpeech || 'KELİME').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* İngilizce Cümle */}
        <Text style={st.qSentence}>
          “
          {sentenceParts.length > 1 ? (
            <>
              {sentenceParts[0]}
              <Text
                style={[
                  st.blankPill,
                  answered && !correct && st.blankPillBad,
                ]}
              >
                {answered ? ` ${question.targetWord.word} ` : '  ?  '}
              </Text>
              {sentenceParts[1]}
            </>
          ) : (
            question.sentence
          )}
          ”
        </Text>

        {/* Türkçe Çeviri Kutusu */}
        <View style={st.trSentenceBox}>
          <Ionicons name="language" size={16} color={C.green} />
          <Text style={st.qTr}>“{question.sentenceTr}”</Text>
        </View>

        {/* Öğretici İpucu Göstergesi (Yanıtlandığında Açılır) */}
        {answered && (
          <View
            style={[
              st.inlineFeedbackBox,
              correct ? st.inlineFeedbackOk : st.inlineFeedbackBad,
            ]}
          >
            <Ionicons
              name={correct ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={correct ? '#6EE7B7' : '#FDA4AF'}
            />
            <Text
              style={[
                st.inlineFeedbackText,
                { color: correct ? '#6EE7B7' : '#FDA4AF' },
              ]}
            >
              {correct
                ? `Tebrikler! "${question.targetWord.word}" (${question.targetWord.translation}) cümledeki bağlamı tam olarak tamamlar.`
                : `Doğru yanıt "${question.targetWord.word}" (${question.targetWord.translation}) olmalıydı.`}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Şıklar Listesi */}
      <View style={st.optList}>
        {question.options.map((opt, i) => {
          const isSel = selectedId === opt.id;
          const isTgt = opt.id === question.targetWord.id;
          let cardStyle: StyleProp<ViewStyle> = st.opt;
          if (answered && isTgt) cardStyle = [st.opt, st.optOk];
          else if (answered && isSel && !isTgt) cardStyle = [st.opt, st.optBad];

          return (
            <TouchableOpacity
              key={opt.id}
              style={cardStyle}
              onPress={() => select(opt)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <View style={st.optLeft}>
                <View
                  style={[
                    st.optKeycap,
                    answered && isTgt && { backgroundColor: C.green },
                    answered && isSel && !isTgt && { backgroundColor: C.coral },
                  ]}
                >
                  <Text
                    style={[
                      st.optKeycapText,
                      answered && (isTgt || isSel) && { color: '#050507' },
                    ]}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>

                <View style={st.optWordWrap}>
                  <Text style={st.optWord}>{opt.word}</Text>
                  {opt.phonetic ? (
                    <Text style={st.optPhonetic}>{opt.phonetic}</Text>
                  ) : null}
                </View>
              </View>

              <Text style={st.optTrRight} numberOfLines={1}>
                {opt.translation}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sıradaki Soruya Geç Butonu */}
      {answered && (
        <View style={st.learnedBubble}>
          <Text style={st.learnedTitle}>
            💬 "{question?.targetWord.word}" kelimesini öğrendin mi?
          </Text>
          <Text style={st.learnedSub}>
            "Evet" dersen kelime Öğrenilen listesine geçer, "Henüz değil" dersen havuzda kalır ve tekrar sorulur.
          </Text>
          <View style={st.learnedRow}>
            <TouchableOpacity
              style={[st.learnedBtn, st.learnedNo]}
              onPress={() => answerLearned(false)}
              activeOpacity={0.85}
            >
              <Text style={st.learnedNoText}>Henüz değil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.learnedBtn, st.learnedYes]}
              onPress={() => answerLearned(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={16} color="#050507" />
              <Text style={st.learnedYesText}>Evet, öğrendim</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const st = StyleSheet.create({
  learnedBubble: {
    marginTop: 14, padding: 16, borderRadius: 20,
    backgroundColor: 'rgba(29,185,84,0.10)', borderWidth: 1.5, borderColor: 'rgba(29,185,84,0.45)',
  },
  learnedTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginBottom: 4 },
  learnedSub: { color: '#9CA3AF', fontSize: 12, lineHeight: 17, marginBottom: 12 },
  learnedRow: { flexDirection: 'row', gap: 10 },
  learnedBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 13, borderRadius: 14,
  },
  learnedNo: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  learnedNoText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  learnedYes: { backgroundColor: '#1DB954' },
  learnedYesText: { color: '#050507', fontSize: 13, fontWeight: '900' },
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 44 },
  center: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingOrb: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  loadTitle: { color: C.w, fontSize: 19, fontWeight: '800' },
  loadSub: { color: C.t2, fontSize: 12, marginTop: 4, textAlign: 'center' },

  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: C.greenSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: C.greenBorder,
  },
  emptyTitle: { color: C.w, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  emptySub: {
    color: C.t2,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.green,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
  },
  ctaText: { color: '#050507', fontSize: 14, fontWeight: '800' },

  // Üst Seri & Skor Kartları
  topStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: C.t2,
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 1,
  },

  // Soru Kartı
  qCard: {
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  qCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  qTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.coralSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  qTypeText: {
    color: C.coral,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  qLevelBadge: {
    backgroundColor: C.greenSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
  },
  qLevelText: {
    color: C.green,
    fontSize: 11,
    fontWeight: '800',
  },
  qSentence: {
    color: C.w,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 27,
    marginBottom: 14,
  },
  blankPill: {
    backgroundColor: 'rgba(29, 185, 84, 0.20)',
    color: C.green,
    fontWeight: '900',
  },
  blankPillBad: {
    backgroundColor: C.coralSoft,
    color: C.coral,
  },

  trSentenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  qTr: {
    color: '#D4D4D8',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  inlineFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  inlineFeedbackOk: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.30)',
  },
  inlineFeedbackBad: {
    backgroundColor: 'rgba(244, 63, 94, 0.14)',
    borderColor: 'rgba(244, 63, 94, 0.30)',
  },
  inlineFeedbackText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    flex: 1,
  },

  // Şıklar
  optList: { gap: 9 },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  optOk: {
    backgroundColor: 'rgba(29, 185, 84, 0.18)',
    borderColor: C.green,
  },
  optBad: {
    backgroundColor: 'rgba(255, 75, 114, 0.18)',
    borderColor: C.coral,
  },
  optLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optKeycap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optKeycapText: {
    color: C.t2,
    fontSize: 12,
    fontWeight: '800',
  },
  optWordWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
    flexWrap: 'wrap',
  },
  optWord: {
    color: C.w,
    fontSize: 15,
    fontWeight: '800',
  },
  optPhonetic: {
    color: C.t3,
    fontSize: 12,
    fontWeight: '500',
  },
  optTrRight: {
    color: C.t3,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
    maxWidth: 115,
  },

  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E06D53',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 14,
  },
  nextBtnText: {
    color: '#141413',
    fontSize: 14,
    fontWeight: '800',
  },
});
