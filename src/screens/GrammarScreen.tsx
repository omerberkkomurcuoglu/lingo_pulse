import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { C } from '../theme/colors';
import {
  GRAMMAR_CURRICULUM,
  GrammarCurriculumNode,
  GrammarUserProgress,
  CefrLevel,
} from '../data/grammarCurriculum';
import {
  GrammarPoolQuestion,
  DeepGrammarGuide,
} from '../data/grammarPool';
import { grammarService } from '../services/grammarService';

// ═══════════════════════════════════════════════════════════════════════════
// DUOLINGO TARZI ADIM ADIM SIFIRDAN ÖĞRETİM & OYUN TİPLERİ
// ═══════════════════════════════════════════════════════════════════════════

interface ConceptFormulaItem {
  label: string;
  code: string;
  example: string;
  exampleTr?: string;
  note?: string;
}

interface ConceptEdgeCaseItem {
  rule: string;
  examples: string;
  noteTr: string;
}

interface ConceptSignalItem {
  word: string;
  meaningTr: string;
  positionRule: string;
  sampleEn: string;
}

interface ConceptTrapItem {
  wrong: string;
  right: string;
  whyTr: string;
}

interface ConceptStep {
  type: 'concept';
  badge: string;
  stepSubtitle: string;
  title: string;
  zeroToHeroIntro?: string;
  explanation: string;
  coreFormulaBanner?: string;
  formula: ConceptFormulaItem[];
  edgeCases?: ConceptEdgeCaseItem[];
  signals?: ConceptSignalItem[];
  traps?: ConceptTrapItem[];
  checklist?: string[];
  timelineLabel: string;
  timeline: string;
}

interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  reason: string;
}

interface MultipleChoiceStep {
  type: 'multiple_choice';
  questionId?: string;
  badge: string;
  question: string;
  sentence: string;
  sentenceTr?: string;
  hintTr?: string;
  audioText?: string;
  options: MultipleChoiceOption[];
}

interface SentenceBuilderStep {
  type: 'sentence_builder';
  questionId?: string;
  badge: string;
  prompt: string;
  turkishSentence: string;
  targetAudioEn: string;
  hintTr?: string;
  correctOrder: string[];
  wordBank: string[];
  explanationTr: string;
}

interface MatchPairItem {
  id: number;
  left: string;
  right: string;
}

interface MatchPairsStep {
  type: 'match_pairs';
  badge: string;
  prompt: string;
  pairs: MatchPairItem[];
  explanationTr: string;
}

type InteractiveSessionStep =
  | ConceptStep
  | MultipleChoiceStep
  | SentenceBuilderStep
  | MatchPairsStep;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

// Yardımcı: Havuz sorusunu MultipleChoiceStep'e dönüştür
function poolFillToMcStep(
  fq: GrammarPoolQuestion,
  customQuestionPrompt?: string
): MultipleChoiceStep {
  const cleanSentence = (fq.sentence || '').replace('[_____]', '_______');
  const letters = ['a', 'b', 'c', 'd'];
  return {
    type: 'multiple_choice',
    questionId: fq.id,
    badge: 'BOŞLUK DOLDURMA',
    question:
      customQuestionPrompt ||
      'Az önce öğrendiğimiz kurala göre boşluğa gelebilecek en doğru yapıyı seçin:',
    sentence: cleanSentence.includes('_______') ? cleanSentence : `${cleanSentence} _______`,
    sentenceTr: fq.sentenceTr,
    hintTr: fq.hintTr,
    audioText: (fq.sentence || '').replace('[_____]', fq.correctAnswer || ''),
    options: (fq.options || []).slice(0, 4).map((optText, idx) => {
      const isCorrect =
        optText.trim().toLowerCase() === (fq.correctAnswer || '').trim().toLowerCase();
      return {
        id: letters[idx] || String(idx),
        text: optText,
        isCorrect,
        reason: isCorrect
          ? fq.explanationTr
          : `Doğru cevap "${fq.correctAnswer}" olmalıydı. ${fq.explanationTr}`,
      };
    }),
  };
}

// Yardımcı: Havuz sorusunu SentenceBuilderStep'e dönüştür
function poolTileToBuilderStep(
  tq: GrammarPoolQuestion,
  customPrompt?: string
): SentenceBuilderStep {
  return {
    type: 'sentence_builder',
    questionId: tq.id,
    badge: 'CÜMLE İNŞASI',
    prompt:
      customPrompt ||
      'Verilen Türkçe cümleyi öğrendiğimiz gramer dizilimiyle oluşturun:',
    turkishSentence: `"${tq.promptTr || ''}"`,
    targetAudioEn: tq.targetEn || (tq.correctTokens || []).join(' '),
    hintTr: tq.hintTr,
    correctOrder: tq.correctTokens || [],
    wordBank: shuffleArray(tq.tiles || tq.correctTokens || []),
    explanationTr: tq.explanationTr,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. İLK ÖĞRENME AKIŞI: TÜM KONU ANLATIMLARI (KURAL -> SORU -> KURAL -> SORU)
// Ünitedeki hiçbir kuralı atlamadan tek seferde sırayla anlatır ve her kuralın
// hemen arkasından o kuralı pekiştiren soruyu sorar.
// ═══════════════════════════════════════════════════════════════════════════
function buildFullCourseSteps(
  node: GrammarCurriculumNode,
  guide: DeepGrammarGuide,
  pool: GrammarPoolQuestion[]
): { steps: InteractiveSessionStep[]; usedIds: string[] } {
  const steps: InteractiveSessionStep[] = [];
  const usedIds: string[] = [];

  const fillQuestions = pool.filter(q => q.kind === 'fill' && q.sentence && q.options?.length);
  const tileQuestions = pool.filter(
    q => q.kind === 'word_tiles' && q.correctTokens?.length && q.tiles?.length
  );
  const listeningQuestions = pool.filter(
    q => q.kind === 'listening' && q.options?.length && q.correctAnswer
  );
  const readingQuestions = pool.filter(
    q => q.kind === 'reading' && q.options?.length && q.correctAnswer
  );

  let fillCursor = 0;
  let tileCursor = 0;

  const takeNextFill = (promptText?: string): MultipleChoiceStep | null => {
    if (fillCursor >= fillQuestions.length) return null;
    const q = fillQuestions[fillCursor++];
    usedIds.push(q.id);
    return poolFillToMcStep(q, promptText);
  };

  const takeNextTile = (promptText?: string): SentenceBuilderStep | null => {
    if (tileCursor >= tileQuestions.length) return null;
    const q = tileQuestions[tileCursor++];
    usedIds.push(q.id);
    return poolTileToBuilderStep(q, promptText);
  };

  const ruleBlocks = guide.detailedRuleBlocks || [];
  const conjRows = guide.conjugationRows || [];
  const edgeCases = guide.spellingAndEdgeCases || [];
  const signals = guide.signalWords || [];
  const traps = guide.turkishTraps || [];

  // ── BÖLÜM 1: SIFIRDAN GENEL MANTIK & ZAMAN ÇİZELGESİ ──
  steps.push({
    type: 'concept',
    badge: 'KONU ANLATIMI',
    stepSubtitle: 'BAŞLANGIÇ: SIFIRDAN BU KONUNUN MANTIĞI & ZAMAN ÇİZELGESİ',
    title: `${node.title} — Nedir ve Neden Kullanılır?`,
    zeroToHeroIntro: guide.overviewTr,
    explanation:
      'Bu üniteye sıfırdan başlıyoruz. Önce aşağıdaki zaman/mantık şemasını ve temel yapı taşlarını inceleyin; hemen ardından her alt kuralı tek tek öğrenip arkasından sorusunu çözeceğiz.',
    coreFormulaBanner: conjRows[0]?.formula || ruleBlocks[0]?.formula,
    formula: conjRows.slice(0, 2).map(r => ({
      label: `${r.formType} • (${r.subject})`,
      code: r.formula,
      example: r.exampleEn,
      exampleTr: r.exampleTr,
    })),
    timelineLabel: `ZAMAN & MANTIK ÇİZELGESİ (${node.level})`,
    timeline: guide.timelineVisual,
  });

  // Hemen arkasından 1. Uygulama Sorusu
  const firstFill = takeNextFill(
    'Genel mantığa göre aşağıdaki cümlede boşluğa gelebilecek doğru yapıyı seçin:'
  );
  if (firstFill) steps.push(firstFill);

  // ── BÖLÜM 2: HER BİR DETAYLI KURAL BLOĞU İÇİN (KURAL ANLATIMI -> HEMEN ARDINDAN SORUSU) ──
  ruleBlocks.forEach((block, idx) => {
    steps.push({
      type: 'concept',
      badge: 'KONU ANLATIMI',
      stepSubtitle: `ALT KURAL ${idx + 1}/${ruleBlocks.length} • ADIM ADIM ÖĞRETİM`,
      title: block.title.replace(/^\d+\.\s*/, ''),
      explanation: block.explanationTr,
      coreFormulaBanner: block.formula,
      formula: (block.examples || []).map((ex, exIdx) => ({
        label: `Örnek Cümle Röntgeni #${exIdx + 1}`,
        code: ex.en,
        example: ex.tr,
        note: ex.note,
      })),
      timelineLabel: `ALT KURAL #${idx + 1} ÖZET FORMÜLÜ`,
      timeline: block.formula,
    });

    // Her kural bloğunun hemen arkasından 1 Boşluk Doldurma + 1 Cümle İnşası sorusu sor!
    const ruleFill = takeNextFill(
      `"${block.title.replace(/^\d+\.\s*/, '')}" kuralını kullanarak boşluğu doldurun:`
    );
    if (ruleFill) steps.push(ruleFill);

    if (idx % 2 === 0) {
      const ruleTile = takeNextTile(
        'Öğrendiğimiz bu kuralı şimdi kelime bloklarıyla cümleye dönüştürün:'
      );
      if (ruleTile) steps.push(ruleTile);
    }
  });

  // ── BÖLÜM 3: TAM ÇEKİM TABLOSU (+ / - / ?) -> ARDINDAN HIZLI EŞLEŞTİRME OYUNU ──
  if (conjRows.length > 0) {
    steps.push({
      type: 'concept',
      badge: 'KONU ANLATIMI',
      stepSubtitle: 'TAM ÇEKİM TABLOSU: OLUMLU (+), OLUMSUZ (-) VE SORU (?) KALIPLARI',
      title: `${node.title} — Tüm Özneler İçin Çekim Tablosu`,
      explanation:
        'Olumlu cümleden olumsuz ve soru cümlesine geçerken yardımcı fiilin nereye geldiğini ve ana fiilin nasıl değiştiğini aşağıdaki tam referans tablosundan inceleyin:',
      formula: conjRows.map(r => ({
        label: `${r.formType} • (${r.subject})`,
        code: r.formula,
        example: r.exampleEn,
        exampleTr: r.exampleTr,
      })),
      timelineLabel: 'ÇEKİM TABLOSU KURALI',
      timeline: 'Yardımcı fiil ve özne uyumunu eşleştirme oyununda şimdi test edelim!',
    });

    // Hemen arkasından Eşleştirme Oyunu
    const pairs: MatchPairItem[] = conjRows.slice(0, 4).map((row, idx) => ({
      id: idx + 1,
      left: `${row.formType} • ${row.subject.split('/')[0].trim()}`,
      right: row.exampleEn.split('/')[0].trim(),
    }));
    if (pairs.length >= 2) {
      steps.push({
        type: 'match_pairs',
        badge: 'EŞLEŞTİRME OYUNU',
        prompt: 'Az önce incelediğimiz çekim tablosundaki yapıları doğru örneklerle eşleştirin:',
        pairs,
        explanationTr: 'Tablodaki tüm olumlu, olumsuz ve soru çekimlerini doğru eşleştirdiniz!',
      });
    }
  }

  // ── BÖLÜM 4: YAZIM, EK & İSTİSNA KURALLARI -> ARDINDAN SORUSU ──
  if (edgeCases.length > 0) {
    steps.push({
      type: 'concept',
      badge: 'KONU ANLATIMI',
      stepSubtitle: 'YAZIM KURALLARI, EKLER & ÖZEL İSTİSNALAR',
      title: 'Fiil/İsim Ekleri ve Sınav İstisnaları',
      explanation:
        'Bu gramer yapısında kelimelerin sonuna gelen eklerin yazılış kurallarını ve kuralsız (düzensiz) değişen özel kelimeleri aşağıda adım adım görüyorsunuz:',
      formula: [],
      edgeCases: edgeCases,
      timelineLabel: 'YAZIM & İSTİSNA NOTU',
      timeline: edgeCases[0]?.rule || 'Eklerin yazılışına ve düzensiz yapılara dikkat edin.',
    });

    const edgeFill = takeNextFill(
      'Yazım ve istisna kurallarına dikkat ederek doğru seçeneği işaretleyin:'
    );
    if (edgeFill) steps.push(edgeFill);
  }

  // ── BÖLÜM 5: SİNYAL KELİMELER (ZAMAN İPUÇLARI) & CÜMLEDEKİ YERİ -> ARDINDAN CÜMLE İNŞASI ──
  if (signals.length > 0) {
    steps.push({
      type: 'concept',
      badge: 'KONU ANLATIMI',
      stepSubtitle: 'SİNYAL KELİMELER & CÜMLE İÇİNDEKİ KESİN KONUMU',
      title: 'Hangi İpucu Kelimesi Cümlenin Neresine Yazılır?',
      explanation:
        'Bir soruda veya konuşmada bu gramer yapısını kullanmanız gerektiğini fısıldayan anahtar kelimeler (zaman zarfları ve bağlaçlar) ve cümle içinde tam olarak nereye konuldukları aşağıdadır:',
      formula: [],
      signals: signals,
      timelineLabel: 'KONUM KURALI',
      timeline: signals[0]?.positionRule || 'Zarfların yardımcı fiil ve ana fiil arasındaki yerine dikkat edin.',
    });

    const sigTile = takeNextTile(
      'Sinyal kelimenin cümle içindeki konumuna dikkat ederek kelime bloklarını dizin:'
    );
    if (sigTile) steps.push(sigTile);
  }

  // ── BÖLÜM 6: TÜRK ÖĞRENCİLERİN EN SIK DÜŞTÜĞÜ TUZAKLAR (❌ vs ✅) -> ARDINDAN FİNAL SORULARI ──
  if (traps.length > 0) {
    steps.push({
      type: 'concept',
      badge: 'KONU ANLATIMI',
      stepSubtitle: 'SON BÖLÜM: TÜRKLERİN EN SIK DÜŞTÜĞÜ TUZAKLAR (❌ YANLIŞ → ✅ DOĞRU)',
      title: 'Türkçe Düşünme Tuzakları & 3 Saniyelik Çözüm Rehberi',
      explanation:
        'Türkçeden kelime kelime çeviri yapıldığında en sık düşülen hataları aşağıda görüyorsunuz. Bu son kural adımından sonra final sorularıyla üniteyi tamamlayacağız!',
      formula: [],
      traps: traps,
      checklist: [
        '1. ADIM (Özne Kontrolü): Cümlenin asıl öznesi tekil mi (He/She/It/Everyone) yoksa çoğul mu?',
        '2. ADIM (Fiil Türü Kontrolü): Cümlede fiziksel bir eylem mi var, yoksa bir durum/sahiplik/sıfat mı var?',
        '3. ADIM (Zaman & Bağlaç Kontrolü): Bağlaçtan veya yardımcı fiilden sonra gelen fiilin yalın/çekimli halini kontrol ettin mi?',
      ],
      timelineLabel: 'TÜM KONU ANLATIMLARI TAMAMLANDI',
      timeline: 'Harika! Ünitedeki tüm kuralları öğrendin. Şimdi son 2 final sorusunu çözerek üniteyi bitir!',
    });

    const trapFill = takeNextFill(
      'Türk öğrencilerin sık düştüğü tuzaklara dikkat ederek doğru cümleyi tamamlayın:'
    );
    if (trapFill) steps.push(trapFill);
  }

  // Final Dinleme / Okuma Analizi Sorusu
  if (listeningQuestions.length > 0) {
    const lq = listeningQuestions[0];
    usedIds.push(lq.id);
    const letters = ['a', 'b', 'c', 'd'];
    steps.push({
      type: 'multiple_choice',
      questionId: lq.id,
      badge: 'FİNAL ANALİZİ',
      question: lq.question || 'Cümleyi dinleyin/inceleyin ve gramer analizine göre doğru şıkkı seçin:',
      sentence: `"${lq.audioEn || ''}"`,
      sentenceTr: lq.audioTr,
      hintTr: lq.hintTr,
      audioText: lq.audioEn,
      options: (lq.options || []).slice(0, 4).map((optText, idx) => {
        const isCorrect =
          optText.trim().toLowerCase() === (lq.correctAnswer || '').trim().toLowerCase();
        return {
          id: letters[idx] || String(idx),
          text: optText,
          isCorrect,
          reason: isCorrect
            ? lq.explanationTr
            : `Doğru cevap: "${lq.correctAnswer}". ${lq.explanationTr}`,
        };
      }),
    });
  } else if (readingQuestions.length > 0) {
    const rq = readingQuestions[0];
    usedIds.push(rq.id);
    const letters = ['a', 'b', 'c', 'd'];
    steps.push({
      type: 'multiple_choice',
      questionId: rq.id,
      badge: 'OKUMA ANALİZİ',
      question: rq.question || 'Parçayı inceleyin ve gramer analizine göre doğru şıkkı seçin:',
      sentence: rq.passageEn || '',
      sentenceTr: rq.passageTr,
      hintTr: rq.hintTr,
      audioText: rq.passageEn,
      options: (rq.options || []).slice(0, 4).map((optText, idx) => {
        const isCorrect =
          optText.trim().toLowerCase() === (rq.correctAnswer || '').trim().toLowerCase();
        return {
          id: letters[idx] || String(idx),
          text: optText,
          isCorrect,
          reason: isCorrect
            ? rq.explanationTr
            : `Doğru cevap: "${rq.correctAnswer}". ${rq.explanationTr}`,
        };
      }),
    });
  }

  const numbered = steps.map((s, idx) => ({
    ...s,
    badge: `${s.badge} • ADIM ${idx + 1}/${steps.length}`,
  }));

  return { steps: numbered, usedIds };
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. TEKRAR & PEKİŞTİRME TURU: SADECE YENİ SORULAR (KONU ANLATIMI YOK!)
// Kullanıcı üniteyi bitirip "Yeni Sorularla Tekrar Et" dediğinde karşısına
// hiçbir konu anlatımı çıkmaz; havuzdaki kalan sorulardan 10 soruluk saf oyun gelir!
// ═══════════════════════════════════════════════════════════════════════════
function buildQuestionsOnlySteps(
  pool: GrammarPoolQuestion[],
  alreadyUsedIds: string[],
  roundIndex: number
): { steps: InteractiveSessionStep[]; newUsedIds: string[] } {
  const usedSet = new Set(alreadyUsedIds);
  let available = pool.filter(q => !usedSet.has(q.id));

  // Eğer 50 sorunun tamamı çözüldüyse havuzu sıfırlayıp karıştır
  if (available.length < 6) {
    available = shuffleArray(pool);
  } else {
    available = shuffleArray(available);
  }

  const steps: InteractiveSessionStep[] = [];
  const newUsedIds: string[] = [];
  const letters = ['a', 'b', 'c', 'd'];

  for (const q of available) {
    if (steps.length >= 10) break;

    if (q.kind === 'fill' && q.sentence && q.options?.length) {
      newUsedIds.push(q.id);
      steps.push(
        poolFillToMcStep(
          q,
          'Boşluğa gelebilecek en doğru akademik gramer yapısını seçin:'
        )
      );
    } else if (q.kind === 'word_tiles' && q.correctTokens?.length && q.tiles?.length) {
      newUsedIds.push(q.id);
      steps.push(
        poolTileToBuilderStep(
          q,
          'Verilen Türkçe cümleyi kelime bloklarıyla doğru sırayla oluşturun:'
        )
      );
    } else if (q.kind === 'listening' && q.options?.length && q.correctAnswer) {
      newUsedIds.push(q.id);
      steps.push({
        type: 'multiple_choice',
        questionId: q.id,
        badge: 'DİNLEME & ANALİZ',
        question: q.question || 'Cümleyi dinleyin ve doğru gramer analizini seçin:',
        sentence: `"${q.audioEn || ''}"`,
        sentenceTr: q.audioTr,
        hintTr: q.hintTr,
        audioText: q.audioEn,
        options: q.options.slice(0, 4).map((optText, idx) => {
          const isCorrect =
            optText.trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase();
          return {
            id: letters[idx] || String(idx),
            text: optText,
            isCorrect,
            reason: isCorrect
              ? q.explanationTr
              : `Doğru cevap: "${q.correctAnswer}". ${q.explanationTr}`,
          };
        }),
      });
    } else if (q.kind === 'reading' && q.options?.length && q.correctAnswer) {
      newUsedIds.push(q.id);
      steps.push({
        type: 'multiple_choice',
        questionId: q.id,
        badge: 'BAĞLAM & OKUMA',
        question: q.question || 'Metni inceleyin ve doğru gramer analizini seçin:',
        sentence: q.passageEn || '',
        sentenceTr: q.passageTr,
        hintTr: q.hintTr,
        audioText: q.passageEn,
        options: q.options.slice(0, 4).map((optText, idx) => {
          const isCorrect =
            optText.trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase();
          return {
            id: letters[idx] || String(idx),
            text: optText,
            isCorrect,
            reason: isCorrect
              ? q.explanationTr
              : `Doğru cevap: "${q.correctAnswer}". ${q.explanationTr}`,
          };
        }),
      });
    }
  }

  // Ortaya 1 adet de yeni eşleştirme sorusu (farklı sorulardaki doğru yapılardan) ekle
  const fillSubset = pool
    .filter(q => q.kind === 'fill' && q.sentence && q.correctAnswer)
    .slice((roundIndex * 4) % 10, ((roundIndex * 4) % 10) + 4);

  if (fillSubset.length >= 3) {
    const dynamicPairs: MatchPairItem[] = fillSubset.map((fq, idx) => {
      const parts = (fq.sentence || '').split('[_____]');
      const leftSnippet = (parts[0] || '').trim().split(' ').slice(-3).join(' ') + ' ...';
      return {
        id: idx + 1,
        left: leftSnippet,
        right: fq.correctAnswer || '',
      };
    });
    steps.splice(Math.min(4, steps.length), 0, {
      type: 'match_pairs',
      badge: 'HIZLI EŞLEŞTİRME',
      prompt: 'Cümle başlangıçlarını boşluğa gelecek doğru çekimlerle eşleştirin:',
      pairs: dynamicPairs,
      explanationTr: 'Tüm cümle parçalarını doğru çekimlerle eşleştirdiniz!',
    });
  }

  const numbered = steps.map((s, idx) => ({
    ...s,
    badge: `${s.badge} • SORU ${idx + 1}/${steps.length}`,
  }));

  return { steps: numbered, newUsedIds };
}

// ═══════════════════════════════════════════════════════════════════════════
// ANA EKRAN BİLEŞENİ
// ═══════════════════════════════════════════════════════════════════════════
export const GrammarScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<GrammarUserProgress>({
    completedNodeIds: [],
    nodeScores: {},
  });
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | 'ALL'>('ALL');
  const [activeNode, setActiveNode] = useState<GrammarCurriculumNode | null>(null);

  // Havuz & Rehber Verileri
  const [guide, setGuide] = useState<DeepGrammarGuide | null>(null);
  const [questionPool, setQuestionPool] = useState<GrammarPoolQuestion[]>([]);
  const [sessionSteps, setSessionSteps] = useState<InteractiveSessionStep[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isQuestionsOnlyMode, setIsQuestionsOnlyMode] = useState(false);

  // Duolingo Tarzı İnteraktif Oyun State'leri
  const [gameStep, setGameStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [builtWordIndices, setBuiltWordIndices] = useState<number[]>([]);
  const [showStepHint, setShowStepHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong';
    message: string;
  } | null>(null);
  const [hearts, setHearts] = useState(5);
  const [sessionXP, setSessionXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Eşleştirme Oyunu (Match Pairs) State'leri
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongPairFlash, setWrongPairFlash] = useState<number | null>(null);

  // Tam Kural Özeti Modalı (İstendiğinde oyun içinden de tüm tabloya bakabilme)
  const [showRuleSheetModal, setShowRuleSheetModal] = useState(false);

  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    try {
      const st = await grammarService.getGrammarState();
      if (st && st.progress) {
        setProgress(st.progress);
      }
    } catch (e) {
      console.warn('Gramer durumu yüklenirken hata:', e);
    }
  };

  const speakEn = (text: string, rate = 0.92) => {
    if (!text) return;
    try {
      Speech.stop();
      Speech.speak(text.replace(/_______/g, 'blank').replace(/\[_____\]/g, 'blank'), {
        language: 'en-US',
        rate,
      });
    } catch {}
  };

  const resetStepInteraction = () => {
    setSelectedOption(null);
    setBuiltWordIndices([]);
    setShowStepHint(false);
    setFeedback(null);
    setSelectedLeft(null);
    setMatchedIds([]);
    setWrongPairFlash(null);
  };

  // Üniteye tıklandığında: Tüm konu anlatımlarını sırayla (Kural -> Soru -> Kural -> Soru) başlatır
  const startUnitSession = async (
    node: GrammarCurriculumNode,
    questionsOnly = false
  ) => {
    try {
      setActiveNode(node);
      const { questions, guide: loadedGuide } = await grammarService.getQuestionPoolAndGuide(
        node.id
      );
      setGuide(loadedGuide);
      setQuestionPool(questions);

      if (questionsOnly) {
        const { steps, newUsedIds } = buildQuestionsOnlySteps(questions, [], 1);
        setSessionSteps(steps);
        setUsedQuestionIds(newUsedIds);
        setRoundIndex(1);
        setIsQuestionsOnlyMode(true);
      } else {
        const { steps, usedIds } = buildFullCourseSteps(node, loadedGuide, questions);
        setSessionSteps(steps);
        setUsedQuestionIds(usedIds);
        setRoundIndex(0);
        setIsQuestionsOnlyMode(false);
      }

      setGameStep(0);
      setHearts(5);
      setSessionXP(0);
      setCorrectCount(0);
      setSessionCompleted(false);
      resetStepInteraction();
    } catch (e) {
      console.error('Ünite oturumu başlatılırken hata:', e);
    }
  };

  // Ünite kartından doğrudan tüm kural rehberini (Ansiklopedi) açar
  const openGuideModal = async (node: GrammarCurriculumNode) => {
    try {
      setActiveNode(node);
      const { guide: loadedGuide, questions } = await grammarService.getQuestionPoolAndGuide(
        node.id
      );
      setGuide(loadedGuide);
      setQuestionPool(questions);
      setShowRuleSheetModal(true);
    } catch (e) {
      console.error('Rehber açılırken hata:', e);
    }
  };

  // Ünite bittiğinde "Yeni Sorularla Tekrar Et" -> KONU ANLATIMI ÇIKMAZ, SADECE YENİ SORULAR GELİR!
  const startNextQuestionsOnlyRound = () => {
    if (!activeNode || !guide) return;
    const nextRound = roundIndex + 1;
    const { steps, newUsedIds } = buildQuestionsOnlySteps(
      questionPool,
      usedQuestionIds,
      nextRound
    );
    setSessionSteps(steps);
    setUsedQuestionIds(prev => [...prev, ...newUsedIds]);
    setRoundIndex(nextRound);
    setIsQuestionsOnlyMode(true);
    setGameStep(0);
    setHearts(5);
    setSessionCompleted(false);
    resetStepInteraction();
  };

  const currentStepObj: InteractiveSessionStep | undefined = sessionSteps[gameStep];

  // Eşleştirme oyununda sağ sütunun karıştırılmış ama sabit dizilimi
  const rightColumnPairs = useMemo(() => {
    if (!currentStepObj || currentStepObj.type !== 'match_pairs') return [];
    return [...currentStepObj.pairs].reverse();
  }, [currentStepObj]);

  // "Kontrol Et" / "Anladım, Sorusuna Geç →" Aksiyonu
  const handleCheckAnswer = () => {
    if (!currentStepObj) return;

    // 1. MİKRO KURAL KARTI -> Doğrudan arkasındaki soruya geçer (+10 XP öğrenme ödülü)
    if (currentStepObj.type === 'concept') {
      setSessionXP(prev => prev + 10);
      handleNextStep();
      return;
    }

    // 2. ÇOKTAN SEÇMELİ BOŞLUK DOLDURMA
    if (currentStepObj.type === 'multiple_choice') {
      if (!selectedOption) return;
      const opt = currentStepObj.options.find(o => o.id === selectedOption);
      if (!opt) return;

      if (opt.isCorrect) {
        setFeedback({ status: 'correct', message: opt.reason });
        setSessionXP(prev => prev + 15);
        setCorrectCount(prev => prev + 1);
        if (currentStepObj.audioText) {
          speakEn(currentStepObj.audioText, 0.94);
        }
      } else {
        setFeedback({ status: 'wrong', message: opt.reason });
        setHearts(prev => Math.max(1, prev - 1));
      }
      return;
    }

    // 3. KELİME BLOKLARIYLA CÜMLE İNŞASI
    if (currentStepObj.type === 'sentence_builder') {
      if (builtWordIndices.length === 0) return;
      const builtWords = builtWordIndices.map(idx => currentStepObj.wordBank[idx]);
      const norm = (s: string) =>
        s
          .toLowerCase()
          .replace(/[.,?!]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userStr = builtWords.join(' ');
      const targetStr = currentStepObj.correctOrder.join(' ');

      if (norm(userStr) === norm(targetStr)) {
        setFeedback({
          status: 'correct',
          message: `Kusursuz dizilim! ${currentStepObj.explanationTr}`,
        });
        setSessionXP(prev => prev + 20);
        setCorrectCount(prev => prev + 1);
        speakEn(currentStepObj.targetAudioEn, 0.94);
      } else {
        setFeedback({
          status: 'wrong',
          message: `Doğru dizilim: "${targetStr}" olmalıydı.\n${currentStepObj.explanationTr}`,
        });
        setHearts(prev => Math.max(1, prev - 1));
      }
      return;
    }

    // 4. HIZLI EŞLEŞTİRME OYUNU
    if (currentStepObj.type === 'match_pairs') {
      if (matchedIds.length === currentStepObj.pairs.length) {
        setFeedback({
          status: 'correct',
          message: `Tüm akademik yapıları hatasız eşleştirdin! ${currentStepObj.explanationTr}`,
        });
        setSessionXP(prev => prev + 25);
        setCorrectCount(prev => prev + 1);
      }
    }
  };

  // Sonraki Adıma Geçiş veya Üniteyi Tamamlama
  const handleNextStep = async () => {
    resetStepInteraction();
    if (gameStep < sessionSteps.length - 1) {
      setGameStep(prev => prev + 1);
    } else {
      if (activeNode) {
        const existingBest = progress.nodeScores[activeNode.id]?.bestExamScore || 0;
        const newScore = Math.min(100, Math.max(existingBest + 25, 85));
        try {
          const updated = await grammarService.recordScore({
            nodeId: activeNode.id,
            examScore: newScore,
          });
          setProgress(updated);
        } catch {}
      }
      setSessionCompleted(true);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // REHBER / ANSİKLOPEDİ MODALI (TÜM KURALLAR, ÇEKİM, FORMÜL, TUZAK VE İSTİSNALAR)
  // ═══════════════════════════════════════════════════════════════════════════
  const renderRuleSheetModal = () => {
    if (!guide || !activeNode) return null;
    return (
      <Modal
        visible={showRuleSheetModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowRuleSheetModal(false)}
      >
        <View style={st.modalOverlay}>
          <View style={st.modalSheet}>
            <View style={st.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={st.modalOverline}>
                  {activeNode.level} • {activeNode.type === 'checkpoint' ? 'KÜMÜLATİF TARAMA' : `ÜNİTE ${activeNode.orderIndex}`} ANSİKLOPEDİSİ
                </Text>
                <Text style={st.modalTitle} numberOfLines={1}>
                  {activeNode.title}
                </Text>
              </View>
              <TouchableOpacity
                style={st.modalCloseBtn}
                onPress={() => setShowRuleSheetModal(false)}
              >
                <Ionicons name="close" size={20} color="#F4F1EA" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 18, gap: 16, paddingBottom: 48 }}
              showsVerticalScrollIndicator={false}
            >
              {/* 1. Genel Mantık ve Zihniyet */}
              <View style={st.conceptExplanationCard}>
                <Text style={st.conceptExplanationText}>{guide.overviewTr}</Text>
              </View>

              {/* 2. Görsel Zaman Çizgisi Şeması */}
              {guide.timelineVisual ? (
                <View style={{ backgroundColor: '#1C1B1A', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#2C2B29' }}>
                  <Text style={{ color: '#D4A359', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>⏳ ZAMAN ÇİZGİSİ DİYAGRAMI</Text>
                  <Text style={{ color: '#68A691', fontSize: 13, fontFamily: 'monospace' }}>{guide.timelineVisual}</Text>
                </View>
              ) : null}

              {/* 3. Tüm Detaylı Alt Kurallar ve Formüller */}
              {guide.detailedRuleBlocks && guide.detailedRuleBlocks.length > 0 && (
                <>
                  <Text style={st.modalSectionTitle}>📖 Detaylı Alt Kurallar ve Açıklamalı Örnekler</Text>
                  {guide.detailedRuleBlocks.map((block, idx) => (
                    <View key={idx} style={[st.formulaCard, { padding: 14, gap: 8 }]}>
                      <View style={st.conceptBadge}>
                        <Text style={st.conceptBadgeText}>{block.badge}</Text>
                      </View>
                      <Text style={{ color: '#F4F1EA', fontSize: 14, fontWeight: '700' }}>{block.title}</Text>
                      <Text style={{ color: '#C8C4BC', fontSize: 13, lineHeight: 19 }}>{block.explanationTr}</Text>
                      {block.formula ? (
                        <View style={st.formulaCodeBox}>
                          <Text style={st.formulaCodeText}>{block.formula}</Text>
                        </View>
                      ) : null}
                      {block.examples && block.examples.map((ex, eIdx) => (
                        <View key={eIdx} style={{ backgroundColor: '#1A1918', padding: 10, borderRadius: 8, gap: 3, marginTop: 4 }}>
                          <Text style={{ color: '#E06D53', fontSize: 13, fontWeight: '600' }}>{ex.en}</Text>
                          <Text style={{ color: '#9E9A93', fontSize: 12 }}>{ex.tr}</Text>
                          {ex.note ? <Text style={{ color: '#D4A359', fontSize: 11, fontStyle: 'italic', marginTop: 2 }}>💡 {ex.note}</Text> : null}
                        </View>
                      ))}
                    </View>
                  ))}
                </>
              )}

              {/* 4. Çekim Tablosu */}
              <Text style={st.modalSectionTitle}>📐 Tüm Çekim & Formül Tablosu</Text>
              {(guide.conjugationRows || []).map((row, idx) => (
                <View key={idx} style={st.formulaCard}>
                  <Text style={st.formulaLabel}>
                    {row.formType} • {row.subject}
                  </Text>
                  <View style={st.formulaCodeBox}>
                    <Text style={st.formulaCodeText}>{row.formula}</Text>
                  </View>
                  <Text style={st.formulaExampleMeta}>
                    <Text style={st.formulaExampleValue}>{row.exampleEn}</Text> —{' '}
                    {row.exampleTr}
                  </Text>
                </View>
              ))}

              {/* 5. Yazım Kuralları ve Kritik İstisnalar */}
              {guide.spellingAndEdgeCases && guide.spellingAndEdgeCases.length > 0 && (
                <>
                  <Text style={st.modalSectionTitle}>✍️ Yazım Kuralları & Kritik İstisnalar</Text>
                  {guide.spellingAndEdgeCases.map((edge, idx) => (
                    <View key={idx} style={[st.formulaCard, { padding: 12, gap: 5 }]}>
                      <Text style={{ color: '#F4F1EA', fontSize: 13, fontWeight: '700' }}>{edge.rule}</Text>
                      <Text style={{ color: '#E06D53', fontSize: 12, fontFamily: 'monospace' }}>{edge.examples}</Text>
                      <Text style={{ color: '#9E9A93', fontSize: 12 }}>{edge.noteTr}</Text>
                    </View>
                  ))}
                </>
              )}

              {/* 6. Sinyal ve Zaman Zarfları */}
              {guide.signalWords && guide.signalWords.length > 0 && (
                <>
                  <Text style={st.modalSectionTitle}>🚦 Sinyal & Zaman Zarfları</Text>
                  {guide.signalWords.map((sig, idx) => (
                    <View key={idx} style={[st.formulaCard, { padding: 12, gap: 5 }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#D4A359', fontSize: 13, fontWeight: '700' }}>{sig.word}</Text>
                        <Text style={{ color: '#9E9A93', fontSize: 12 }}>{sig.meaningTr}</Text>
                      </View>
                      <Text style={{ color: '#C8C4BC', fontSize: 12 }}>{sig.positionRule}</Text>
                      <Text style={{ color: '#68A691', fontSize: 12, fontStyle: 'italic' }}>Örnek: "{sig.sampleEn}"</Text>
                    </View>
                  ))}
                </>
              )}

              {/* 7. Türk Öğrenci Tuzakları */}
              {(guide.turkishTraps || []).length > 0 && (
                <>
                  <Text style={st.modalSectionTitle}>
                    ⚠️ Türk Öğrencilerin Sık Düştüğü Tuzaklar
                  </Text>
                  {guide.turkishTraps.map((trap, idx) => (
                    <View key={idx} style={st.trapCard}>
                      <View style={st.trapWrongRow}>
                        <Text style={st.trapWrongBadge}>❌ YANLIŞ</Text>
                        <Text style={st.trapWrongText}>{trap.wrong}</Text>
                      </View>
                      <View style={st.trapRightRow}>
                        <Text style={st.trapRightBadge}>✅ DOĞRU</Text>
                        <Text style={st.trapRightText}>{trap.right}</Text>
                      </View>
                      <Text style={st.trapWhyText}>{trap.whyTr}</Text>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={st.centerBox}>
        <ActivityIndicator size="large" color="#E06D53" />
        <Text style={st.loadingText}>Adım Adım Gramer & Oyun Modülü Hazırlanıyor...</Text>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EKRAN 2: DUOLINGO TARZI ADIM ADIM SIFIRDAN KONU ANLATIMI & OYUN EKRANI
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeNode && guide && sessionSteps.length > 0) {
    const progressPercent = sessionCompleted
      ? 100
      : Math.round(((gameStep + 1) / sessionSteps.length) * 100);

    return (
      <View style={st.gameContainer}>
        {/* ── ÜST OYUN İLERLEME ÇUBUĞU ── */}
        <View style={st.gameTopBar}>
          <TouchableOpacity
            style={st.gameBackBtn}
            onPress={() => setActiveNode(null)}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#9E9A93" />
          </TouchableOpacity>

          {/* Step Progress Bar */}
          <View style={st.gameProgressTrack}>
            <View style={[st.gameProgressFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Can & XP & Tam Tablo Göstergesi */}
          <View style={st.gameTopStatsRow}>
            <TouchableOpacity
              style={st.ruleQuickBtn}
              onPress={() => setShowRuleSheetModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={14} color="#D4A359" />
            </TouchableOpacity>

            <View style={st.heartsPill}>
              <Text style={{ fontSize: 11 }}>❤️</Text>
              <Text style={st.heartsPillText}>{hearts}</Text>
            </View>

            <View style={st.xpGamePill}>
              <Ionicons name="flash" size={13} color="#D4A359" />
              <Text style={st.xpGamePillText}>+{sessionXP}</Text>
            </View>
          </View>
        </View>

        {/* ── YATAY KAYDIRILABİLİR ADIM NOKTALARI (STEP DOTS BAR) ── */}
        {!sessionCompleted && (
          <View style={st.stepDotsBarContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={st.stepDotsScroll}
            >
              {sessionSteps.map((s, idx) => {
                const isCurrent = idx === gameStep;
                const isDone = idx < gameStep;
                const isConcept = s.type === 'concept';
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      st.stepDotPill,
                      isDone && st.stepDotPillDone,
                      isCurrent && st.stepDotPillCurrent,
                    ]}
                    onPress={() => {
                      resetStepInteraction();
                      setGameStep(idx);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={
                        isDone
                          ? 'checkmark'
                          : isConcept
                          ? 'book'
                          : s.type === 'multiple_choice'
                          ? 'help-circle'
                          : s.type === 'sentence_builder'
                          ? 'layers'
                          : 'sparkles'
                      }
                      size={10}
                      color={
                        isCurrent
                          ? '#141413'
                          : isDone
                          ? '#68A691'
                          : isConcept
                          ? '#D4A359'
                          : '#8A857E'
                      }
                    />
                    <Text
                      style={[
                        st.stepDotText,
                        isDone && { color: '#68A691' },
                        isCurrent && { color: '#141413', fontWeight: '900' },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── OYUN İÇERİK ALANI ── */}
        {sessionCompleted ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={st.victoryScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={st.victoryCard}>
              <View style={st.victoryIconCircle}>
                <Ionicons name="trophy" size={36} color="#D4A359" />
              </View>

              <View style={st.victoryBadge}>
                <Ionicons name="sparkles" size={12} color="#E5B976" />
                <Text style={st.victoryBadgeText}>
                  {activeNode.level} • ÜNİTE {activeNode.orderIndex}{' '}
                  {isQuestionsOnlyMode ? `SORU TURU #${roundIndex} BİTTİ` : 'TAMAMLANDI'}
                </Text>
              </View>

              <Text style={st.victoryTitle}>{activeNode.title}</Text>
              <Text style={st.victorySub}>
                {isQuestionsOnlyMode
                  ? 'Yeni sorularla hazırlanan pratik turunu başarıyla tamamladın! Havuzdaki diğer yeni sorularla devam edebilirsin.'
                  : 'Ünitedeki tüm konu anlatımlarını ve kural arkası pratik oyunlarını tek seferde tamamladın! Artık konu anlatımı olmadan sadece yeni sorularla pratik yapabilirsin.'}
              </Text>

              {/* İstatistik Kutuları */}
              <View style={st.victoryStatsGrid}>
                <View style={st.victoryStatBox}>
                  <Text style={st.victoryStatLabel}>KAZANILAN XP</Text>
                  <Text style={[st.victoryStatValue, { color: '#E5B976' }]}>
                    +{sessionXP} XP
                  </Text>
                </View>
                <View style={st.victoryStatBox}>
                  <Text style={st.victoryStatLabel}>KALAN CAN</Text>
                  <Text style={[st.victoryStatValue, { color: '#F08A73' }]}>
                    ❤️ {hearts} / 5
                  </Text>
                </View>
                <View style={st.victoryStatBox}>
                  <Text style={st.victoryStatLabel}>ÇÖZÜLEN HAVUZ</Text>
                  <Text style={[st.victoryStatValue, { color: '#68A691' }]}>
                    {Math.min(usedQuestionIds.length, questionPool.length)}/{questionPool.length}
                  </Text>
                </View>
              </View>

              {/* SADECE YENİ SORULARLA TEKRAR ET BUTONU (Konu Anlatımı Çıkmaz!) */}
              <TouchableOpacity
                style={st.victoryNextRoundBtn}
                onPress={startNextQuestionsOnlyRound}
                activeOpacity={0.85}
              >
                <Ionicons name="flash" size={18} color="#141413" />
                <Text style={st.victoryNextRoundBtnText}>
                  Sadece Yeni Sorularla Tekrar Et (Konu Anlatımsız)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={st.victoryBackRoadmapBtn}
                onPress={() => setActiveNode(null)}
                activeOpacity={0.85}
              >
                <Text style={st.victoryBackRoadmapBtnText}>
                  Ünite Yol Haritasına Dön
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={st.gameStepScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Ünite Mini Başlığı */}
              <View style={st.unitBreadcrumbRow}>
                <Text style={st.unitBreadcrumbText} numberOfLines={1}>
                  {activeNode.level} • Ünite {activeNode.orderIndex}: {activeNode.title}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowRuleSheetModal(true)}
                  style={st.unitBreadcrumbGuideBtn}
                >
                  <Text style={st.unitBreadcrumbGuideText}>Tüm Kurallar →</Text>
                </TouchableOpacity>
              </View>

              {/* ══════════════════════════════════════════════════════════════
                  1. ADIM ADIM DETAYLI KONU ANLATIM KARTI (CONCEPT)
                 ══════════════════════════════════════════════════════════════ */}
              {currentStepObj?.type === 'concept' && (
                <View style={st.stepBlockWrap}>
                  <View style={st.conceptBadgeRow}>
                    <View style={st.conceptBadge}>
                      <Ionicons name="bulb" size={14} color="#E5B976" />
                      <Text style={st.conceptBadgeText}>{currentStepObj.badge}</Text>
                    </View>
                    <Text style={st.conceptSubBadge}>{currentStepObj.stepSubtitle}</Text>
                  </View>

                  <Text style={st.conceptTitle}>{currentStepObj.title}</Text>

                  {/* Sıfırdan Başlayanlar İçin Genel Mantık Kutusu */}
                  {currentStepObj.zeroToHeroIntro &&
                    currentStepObj.zeroToHeroIntro !== currentStepObj.explanation && (
                      <View style={st.zeroToHeroBox}>
                        <View style={st.zeroToHeroHeader}>
                          <Ionicons name="compass" size={15} color="#E06D53" />
                          <Text style={st.zeroToHeroHeaderTitle}>
                            SIFIRDAN BAŞLAYANLAR İÇİN BU KONUNUN MANTIĞI
                          </Text>
                        </View>
                        <Text style={st.zeroToHeroBodyText}>
                          {currentStepObj.zeroToHeroIntro}
                        </Text>
                      </View>
                    )}

                  {/* Detaylı Kural Açıklaması */}
                  <View style={st.conceptExplanationCard}>
                    <View style={st.explanationHeaderRow}>
                      <Ionicons name="school-outline" size={15} color="#D4A359" />
                      <Text style={st.explanationHeaderTitle}>
                        DETAYLI KURAL ANLATIMI
                      </Text>
                    </View>
                    <Text style={st.conceptExplanationText}>
                      {currentStepObj.explanation}
                    </Text>

                    {currentStepObj.coreFormulaBanner ? (
                      <View style={st.coreFormulaBannerBox}>
                        <Text style={st.coreFormulaBannerLabel}>ALTIN FORMÜL:</Text>
                        <Text style={st.coreFormulaBannerCode}>
                          {currentStepObj.coreFormulaBanner}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Görsel Formül, Çekim & Cümle Röntgeni Kartları */}
                  {currentStepObj.formula.length > 0 && (
                    <View style={{ gap: 10 }}>
                      <Text style={st.subSectionHeaderTitle}>
                        📐 ADIM ADIM FORMÜLLER & CÜMLE ANALİZLERİ
                      </Text>
                      {currentStepObj.formula.map((f, idx) => (
                        <View key={idx} style={st.formulaCard}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={st.formulaLabel}>{f.label}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                speakEn(
                                  f.code.includes('+') ? f.example : f.code
                                )
                              }
                              style={st.miniAudioBtn}
                            >
                              <Ionicons name="volume-high" size={13} color="#88C2AE" />
                              <Text style={st.miniAudioBtnText}>Dinle</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={st.formulaCodeBox}>
                            <Text style={st.formulaCodeText}>{f.code}</Text>
                          </View>

                          <Text style={st.formulaExampleMeta}>
                            💡 <Text style={st.formulaExampleValue}>{f.example}</Text>
                            {f.exampleTr ? ` — ${f.exampleTr}` : ''}
                          </Text>

                          {f.note ? (
                            <View style={st.formulaNoteBox}>
                              <Text style={st.formulaNoteText}>
                                🔍 Neden Böyle Kuruldu?: {f.note}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Yazım, Ek ve İstisna Kuralları */}
                  {currentStepObj.edgeCases && currentStepObj.edgeCases.length > 0 && (
                    <View style={{ gap: 10 }}>
                      <Text style={st.subSectionHeaderTitle}>
                        ✍️ YAZIM, EK & İSTİSNA KURALLARI
                      </Text>
                      {currentStepObj.edgeCases.map((ec, idx) => (
                        <View key={idx} style={st.edgeCaseCard}>
                          <Text style={st.edgeCaseRuleTitle}>• {ec.rule}</Text>
                          <View style={st.formulaCodeBox}>
                            <Text style={[st.formulaCodeText, { color: '#E5B976' }]}>
                              {ec.examples}
                            </Text>
                          </View>
                          <Text style={st.edgeCaseNoteText}>{ec.noteTr}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Sinyal Kelimeler & Cümledeki Yeri */}
                  {currentStepObj.signals && currentStepObj.signals.length > 0 && (
                    <View style={{ gap: 10 }}>
                      <Text style={st.subSectionHeaderTitle}>
                        📡 SİNYAL KELİMELER (ZAMAN İPUÇLARI) & CÜMLEDEKİ YERİ
                      </Text>
                      {currentStepObj.signals.map((sig, idx) => (
                        <View key={idx} style={st.signalCard}>
                          <View style={st.signalTopRow}>
                            <Text style={st.signalWordText}>{sig.word}</Text>
                            <Text style={st.signalMeaningBadge}>{sig.meaningTr}</Text>
                          </View>
                          <Text style={st.signalPositionText}>
                            📍 Cümledeki Konumu: {sig.positionRule}
                          </Text>
                          <TouchableOpacity
                            style={st.signalSampleBox}
                            onPress={() => speakEn(sig.sampleEn)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="volume-medium" size={14} color="#68A691" />
                            <Text style={st.signalSampleText}>{sig.sampleEn}</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Türk Öğrencilerin En Sık Düştüğü Tuzaklar */}
                  {currentStepObj.traps && currentStepObj.traps.length > 0 && (
                    <View style={{ gap: 10 }}>
                      <Text style={st.subSectionHeaderTitle}>
                        ⚠️ TÜRK ÖĞRENCİLERİN EN SIK DÜŞTÜĞÜ TUZAKLAR
                      </Text>
                      {currentStepObj.traps.map((trap, idx) => (
                        <View key={idx} style={st.trapCard}>
                          <View style={st.trapWrongRow}>
                            <Text style={st.trapWrongBadge}>❌ YANLIŞ</Text>
                            <Text style={st.trapWrongText}>{trap.wrong}</Text>
                          </View>
                          <TouchableOpacity
                            style={st.trapRightRow}
                            onPress={() => speakEn(trap.right)}
                            activeOpacity={0.8}
                          >
                            <Text style={st.trapRightBadge}>✅ DOĞRU</Text>
                            <Text style={st.trapRightText}>{trap.right}</Text>
                            <Ionicons name="volume-medium" size={15} color="#68A691" />
                          </TouchableOpacity>
                          <Text style={st.trapWhyText}>💡 Neden?: {trap.whyTr}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* 3 Saniyelik Çözüm Kontrol Listesi */}
                  {currentStepObj.checklist && currentStepObj.checklist.length > 0 && (
                    <View style={st.checklistCard}>
                      <Text style={st.checklistTitle}>
                        🎯 SORULARI ÇÖZERKEN 3 SANİYELİK KONTROL LİSTESİ
                      </Text>
                      {currentStepObj.checklist.map((item, idx) => (
                        <Text key={idx} style={st.checklistItemText}>
                          {item}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Timeline Görseli */}
                  <View style={st.timelineVisualBox}>
                    <Text style={st.timelineVisualOverline}>
                      {currentStepObj.timelineLabel}
                    </Text>
                    <Text style={st.timelineVisualText}>{currentStepObj.timeline}</Text>
                  </View>
                </View>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  2. ÇOKTAN SEÇMELİ BOŞLUK DOLDURMA OYUNU (MULTIPLE CHOICE)
                 ══════════════════════════════════════════════════════════════ */}
              {currentStepObj?.type === 'multiple_choice' && (
                <View style={st.stepBlockWrap}>
                  <View style={st.mcTopHeaderRow}>
                    <View style={st.mcBadge}>
                      <Ionicons name="help-circle" size={14} color="#88C2AE" />
                      <Text style={st.mcBadgeText}>{currentStepObj.badge}</Text>
                    </View>
                    {currentStepObj.hintTr ? (
                      <TouchableOpacity
                        style={st.hintToggleBtn}
                        onPress={() => setShowStepHint(!showStepHint)}
                      >
                        <Ionicons name="bulb-outline" size={13} color="#D4A359" />
                        <Text style={st.hintToggleBtnText}>
                          {showStepHint ? 'İpucunu Gizle' : 'İpucu Gör'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  <Text style={st.mcQuestionText}>{currentStepObj.question}</Text>

                  {showStepHint && currentStepObj.hintTr ? (
                    <View style={st.stepHintBanner}>
                      <Text style={st.stepHintBannerText}>
                        💡 Kural İpucu: {currentStepObj.hintTr}
                      </Text>
                    </View>
                  ) : null}

                  {/* Cümle Kutusu (İçinde Kesikli Çizgili Boşluk Hapı) */}
                  <View style={st.mcSentenceCard}>
                    {currentStepObj.sentence.includes('_______') ? (
                      <Text style={st.mcSentenceText}>
                        {currentStepObj.sentence.split('_______')[0]}
                        <Text style={st.mcInlineBlankPill}>
                          {'  '}
                          {selectedOption
                            ? currentStepObj.options.find(o => o.id === selectedOption)?.text
                            : '.......'}
                          {'  '}
                        </Text>
                        {currentStepObj.sentence.split('_______')[1]}
                      </Text>
                    ) : (
                      <Text style={st.mcSentenceText}>{currentStepObj.sentence}</Text>
                    )}

                    <View style={st.mcSentenceFooter}>
                      {currentStepObj.sentenceTr ? (
                        <Text style={st.mcSentenceTrText}>
                          🇹🇷 {currentStepObj.sentenceTr}
                        </Text>
                      ) : (
                        <View />
                      )}
                      {currentStepObj.audioText ? (
                        <TouchableOpacity
                          style={st.mcListenChip}
                          onPress={() => speakEn(currentStepObj.audioText || '')}
                        >
                          <Ionicons name="volume-high" size={14} color="#E06D53" />
                          <Text style={st.mcListenChipText}>Dinle</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>

                  {/* Şıklar */}
                  <View style={{ gap: 10 }}>
                    {currentStepObj.options.map(opt => {
                      const isSelected = selectedOption === opt.id;
                      const showCorrect = feedback !== null && opt.isCorrect;
                      const showWrong =
                        feedback?.status === 'wrong' && isSelected && !opt.isCorrect;

                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            st.mcOptionBtn,
                            isSelected && st.mcOptionBtnSelected,
                            showCorrect && st.mcOptionBtnCorrect,
                            showWrong && st.mcOptionBtnWrong,
                          ]}
                          onPress={() => !feedback && setSelectedOption(opt.id)}
                          activeOpacity={0.85}
                        >
                          <View style={st.mcOptionLeft}>
                            <View
                              style={[
                                st.mcOptionIdBox,
                                isSelected && st.mcOptionIdBoxSelected,
                                showCorrect && { backgroundColor: '#68A691' },
                              ]}
                            >
                              <Text
                                style={[
                                  st.mcOptionIdText,
                                  (isSelected || showCorrect) && { color: '#141413' },
                                ]}
                              >
                                {opt.id}
                              </Text>
                            </View>
                            <Text
                              style={[
                                st.mcOptionLabel,
                                isSelected && { color: '#F4F1EA' },
                              ]}
                            >
                              {opt.text}
                            </Text>
                          </View>

                          <View
                            style={[
                              st.mcRadioCircle,
                              isSelected && st.mcRadioCircleSelected,
                              showCorrect && {
                                borderColor: '#68A691',
                                backgroundColor: '#68A691',
                              },
                            ]}
                          >
                            {(isSelected || showCorrect) && (
                              <Ionicons name="checkmark" size={12} color="#141413" />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  3. KELİME BLOKLARIYLA CÜMLE İNŞASI (SENTENCE BUILDER)
                 ══════════════════════════════════════════════════════════════ */}
              {currentStepObj?.type === 'sentence_builder' && (
                <View style={st.stepBlockWrap}>
                  <View style={st.mcTopHeaderRow}>
                    <View style={st.conceptBadge}>
                      <Ionicons name="layers" size={14} color="#E5B976" />
                      <Text style={st.conceptBadgeText}>{currentStepObj.badge}</Text>
                    </View>
                    {currentStepObj.hintTr ? (
                      <TouchableOpacity
                        style={st.hintToggleBtn}
                        onPress={() => setShowStepHint(!showStepHint)}
                      >
                        <Ionicons name="bulb-outline" size={13} color="#D4A359" />
                        <Text style={st.hintToggleBtnText}>
                          {showStepHint ? 'İpucunu Gizle' : 'Dizilim İpucu'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {showStepHint && currentStepObj.hintTr ? (
                    <View style={st.stepHintBanner}>
                      <Text style={st.stepHintBannerText}>
                        💡 Dizilim İpucu: {currentStepObj.hintTr}
                      </Text>
                    </View>
                  ) : null}

                  <View>
                    <Text style={st.sbPromptSub}>{currentStepObj.prompt}</Text>
                    <TouchableOpacity
                      style={st.sbTurkishCard}
                      onPress={() => speakEn(currentStepObj.targetAudioEn)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="volume-high" size={20} color="#E06D53" />
                      <Text style={st.sbTurkishText}>
                        {currentStepObj.turkishSentence}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Cümle Kurma Alanı (Kesikli Çizgili Kutu) */}
                  <View style={st.sbDropZone}>
                    {builtWordIndices.length === 0 ? (
                      <Text style={st.sbDropPlaceholder}>
                        Cümleyi oluşturmak için aşağıdaki kelimelere sırayla dokun...
                      </Text>
                    ) : (
                      <View style={st.sbPlacedWordsWrap}>
                        {builtWordIndices.map((bankIdx, pos) => (
                          <TouchableOpacity
                            key={`${bankIdx}-${pos}`}
                            style={st.sbPlacedWordBtn}
                            onPress={() => {
                              if (feedback) return;
                              setBuiltWordIndices(prev =>
                                prev.filter((_, idx) => idx !== pos)
                              );
                            }}
                            activeOpacity={0.8}
                          >
                            <Text style={st.sbPlacedWordText}>
                              {currentStepObj.wordBank[bankIdx]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Kelime Bankası (3B Dokunsal Koyu Butonlar) */}
                  <View style={st.sbWordBankWrap}>
                    {currentStepObj.wordBank.map((word, idx) => {
                      const isUsed = builtWordIndices.includes(idx);
                      if (isUsed) return null;
                      return (
                        <TouchableOpacity
                          key={idx}
                          style={st.sbBankWordBtn}
                          onPress={() => {
                            if (feedback) return;
                            setBuiltWordIndices(prev => [...prev, idx]);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={st.sbBankWordText}>{word}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  4. HIZLI EŞLEŞTİRME OYUNU (MATCH PAIRS)
                 ══════════════════════════════════════════════════════════════ */}
              {currentStepObj?.type === 'match_pairs' && (
                <View style={st.stepBlockWrap}>
                  <View style={st.matchBadge}>
                    <Ionicons name="sparkles" size={14} color="#F08A73" />
                    <Text style={st.matchBadgeText}>{currentStepObj.badge}</Text>
                  </View>

                  <Text style={st.mcQuestionText}>{currentStepObj.prompt}</Text>

                  <View style={st.matchGrid}>
                    {/* Sol Sütun */}
                    <View style={st.matchColumn}>
                      {currentStepObj.pairs.map(p => {
                        const isMatched = matchedIds.includes(p.id);
                        const isSelected = selectedLeft === p.id;
                        return (
                          <TouchableOpacity
                            key={p.id}
                            disabled={isMatched}
                            onPress={() => {
                              setWrongPairFlash(null);
                              setSelectedLeft(p.id);
                            }}
                            style={[
                              st.matchCardBtn,
                              isMatched && st.matchCardMatched,
                              isSelected && st.matchCardSelected,
                            ]}
                            activeOpacity={0.85}
                          >
                            <Text
                              style={[
                                st.matchCardText,
                                isMatched && st.matchCardTextMatched,
                                isSelected && st.matchCardTextSelected,
                              ]}
                            >
                              {p.left}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Sağ Sütun */}
                    <View style={st.matchColumn}>
                      {rightColumnPairs.map(p => {
                        const isMatched = matchedIds.includes(p.id);
                        const isWrongFlash = wrongPairFlash === p.id;
                        return (
                          <TouchableOpacity
                            key={p.id}
                            disabled={isMatched}
                            onPress={() => {
                              if (selectedLeft === null) return;
                              if (selectedLeft === p.id) {
                                const nextMatched = [...matchedIds, p.id];
                                setMatchedIds(nextMatched);
                                setSelectedLeft(null);
                                setWrongPairFlash(null);
                                if (nextMatched.length === currentStepObj.pairs.length) {
                                  setFeedback({
                                    status: 'correct',
                                    message: `Tüm akademik yapıları hatasız eşleştirdin! ${currentStepObj.explanationTr}`,
                                  });
                                  setSessionXP(prev => prev + 25);
                                  setCorrectCount(prev => prev + 1);
                                }
                              } else {
                                setWrongPairFlash(p.id);
                                setSelectedLeft(null);
                                setHearts(prev => Math.max(1, prev - 1));
                              }
                            }}
                            style={[
                              st.matchCardBtn,
                              isMatched && st.matchCardMatched,
                              isWrongFlash && st.matchCardWrong,
                            ]}
                            activeOpacity={0.85}
                          >
                            <Text
                              style={[
                                st.matchCardText,
                                isMatched && st.matchCardTextMatched,
                              ]}
                            >
                              {p.right}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* ── ALT GERİ BİLDİRİM & KONTROL ÇUBUĞU ── */}
            <View style={st.gameBottomBar}>
              {feedback && (
                <View
                  style={[
                    st.feedbackBanner,
                    feedback.status === 'correct'
                      ? st.feedbackBannerCorrect
                      : st.feedbackBannerWrong,
                  ]}
                >
                  <Ionicons
                    name={
                      feedback.status === 'correct'
                        ? 'checkmark-circle'
                        : 'close-circle'
                    }
                    size={22}
                    color={feedback.status === 'correct' ? '#68A691' : '#E06D53'}
                    style={{ marginTop: 1 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        st.feedbackTitle,
                        {
                          color:
                            feedback.status === 'correct' ? '#D8EDE5' : '#F5D6CE',
                        },
                      ]}
                    >
                      {feedback.status === 'correct' ? 'Harika!' : 'Not:'}
                    </Text>
                    <Text
                      style={[
                        st.feedbackDesc,
                        {
                          color:
                            feedback.status === 'correct' ? '#D8EDE5' : '#F5D6CE',
                        },
                      ]}
                    >
                      {feedback.message}
                    </Text>
                  </View>
                </View>
              )}

              {!feedback ? (
                <TouchableOpacity
                  style={st.gamePrimaryCheckBtn}
                  onPress={handleCheckAnswer}
                  activeOpacity={0.9}
                >
                  <Text style={st.gamePrimaryCheckBtnText}>
                    {currentStepObj?.type === 'concept'
                      ? 'Bu Kuralı Öğrendim, Sorusuna Geç (+10 XP) →'
                      : 'Kontrol Et'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    st.gameNextStepBtn,
                    feedback.status === 'correct'
                      ? { backgroundColor: '#68A691' }
                      : { backgroundColor: '#E06D53' },
                  ]}
                  onPress={handleNextStep}
                  activeOpacity={0.9}
                >
                  <Text style={st.gameNextStepBtnText}>
                    {gameStep < sessionSteps.length - 1
                      ? 'Devam Et →'
                      : 'Üniteyi Tamamla (+XP)'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── TAM KURAL TABLOSU & TUZAKLAR HIZLI REHBER MODALI ── */}
        {renderRuleSheetModal()}
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EKRAN 1: GRAMER & ÜNİTE YOL HARİTASI (TIMELINE SPINE)
  // Üniteye tıklandığında doğrudan tüm kuralları (Kural -> Soru -> Kural -> Soru)
  // sırayla anlatan akış başlar!
  // ═══════════════════════════════════════════════════════════════════════════
  const filteredNodes =
    selectedLevel === 'ALL'
      ? GRAMMAR_CURRICULUM
      : GRAMMAR_CURRICULUM.filter(n => n.level === selectedLevel);

  return (
    <View style={st.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. EDİTORYAL MATTE ÜST BİLGİ KARTI */}
        <View style={st.editorialHeroCard}>
          <View style={st.editorialHeroInner}>
            <View style={st.editorialHeroLeft}>
              <View style={st.editorialHeroIconBox}>
                <Ionicons name="bookmarks" size={18} color="#D4A359" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={st.editorialHeroTitle}>Sıfırdan Adım Adım Gramer</Text>
                  <View style={st.editorialHeroBadge}>
                    <Text style={st.editorialHeroBadgeText}>Kural → Soru</Text>
                  </View>
                </View>
                <Text style={st.editorialHeroSub}>
                  Üniteye dokun; her kuralı sırayla öğrenip hemen arkasından sorusunu çöz.
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Text style={st.editorialHeroCount}>
                {progress.completedNodeIds.length} / {GRAMMAR_CURRICULUM.length}
              </Text>
              <Text style={st.editorialHeroUnitLabel}>Ünite</Text>
            </View>
          </View>

          {/* İnce İlerleme Çubuğu */}
          <View style={st.editorialHeroTrack}>
            <View
              style={[
                st.editorialHeroFill,
                {
                  width: `${Math.max(
                    8,
                    (progress.completedNodeIds.length / GRAMMAR_CURRICULUM.length) * 100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* 2. MÜFREDAT SEVİYESİ SEGMENTED CONTROL */}
        <View style={st.segmentedWrapper}>
          <View style={st.segmentedHeader}>
            <Text style={st.segmentedLabel}>MÜFREDAT SEVİYESİ</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="options-outline" size={12} color="#D4A359" />
              <Text style={st.segmentedSub}>Üniteye Dokun & Adım Adım Öğren</Text>
            </View>
          </View>

          <View style={st.segmentedGrid}>
            {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map(lv => {
              const isActive = selectedLevel === lv;
              return (
                <TouchableOpacity
                  key={lv}
                  style={[st.segmentedBtn, isActive && st.segmentedBtnActive]}
                  onPress={() => setSelectedLevel(lv)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[st.segmentedBtnText, isActive && st.segmentedBtnTextActive]}
                  >
                    {lv === 'ALL' ? 'Tümü' : lv}
                  </Text>
                  <View
                    style={[
                      st.segmentedDot,
                      { backgroundColor: isActive ? '#E06D53' : 'transparent' },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. DİKEY YOL HARİTASI (TIMELINE SPINE) — DOĞRUDAN TIKLANABİLİR ÜNİTE KARTLARI */}
        <View style={st.timelineWrapper}>
          {filteredNodes.map((node, index) => {
            const isCompleted = progress.completedNodeIds.includes(node.id);
            const isActive = index === 0 || isCompleted || index === 1;
            const scoreObj = progress.nodeScores[node.id];
            const bestScore = scoreObj?.bestExamScore || 0;
            const percent =
              bestScore > 0
                ? bestScore
                : isCompleted
                ? 100
                : index === 0
                ? 76
                : index === 1
                ? 30
                : 0;

            return (
              <View key={node.id} style={st.timelineRow}>
                {/* Sol Dikey Timeline Çizgisi */}
                <View style={st.timelineSpineLine} />

                {/* Sol Düğüm Noktası */}
                <View
                  style={[
                    st.timelineNodeCircle,
                    isCompleted
                      ? st.nodeCircleCompleted
                      : isActive
                      ? st.nodeCircleActive
                      : st.nodeCircleLocked,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={15} color="#141413" />
                  ) : (
                    <Text
                      style={[
                        st.timelineNodeText,
                        isActive && { color: '#141413' },
                      ]}
                    >
                      {node.orderIndex}
                    </Text>
                  )}
                </View>

                {/* Tıklanabilir Ünite Kartı */}
                <TouchableOpacity
                  style={[
                    st.timelineCard,
                    isActive && !isCompleted && st.timelineCardActive,
                    isCompleted && st.timelineCardCompleted,
                  ]}
                  onPress={() => startUnitSession(node, false)}
                  activeOpacity={0.85}
                >
                  {/* Üst Rozetler */}
                  <View style={st.timelineCardTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View
                        style={[
                          st.timelineLevelPill,
                          isActive &&
                            !isCompleted && {
                              backgroundColor: 'rgba(224, 109, 83, 0.15)',
                              borderColor: 'rgba(224, 109, 83, 0.30)',
                            },
                        ]}
                      >
                        <Text
                          style={[
                            st.timelineLevelPillText,
                            isActive && !isCompleted && { color: '#F08A73' },
                          ]}
                        >
                          {node.level} • Ünite {node.orderIndex}
                        </Text>
                      </View>

                      {isActive && !isCompleted && (
                        <View style={st.activeUnitTag}>
                          <Text style={st.activeUnitTagText}>Aktif Ders</Text>
                        </View>
                      )}
                    </View>

                    <View style={st.unitStepCountBadge}>
                      <Ionicons name="layers-outline" size={11} color="#D4A359" />
                      <Text style={st.unitStepCountText}>Kural → Soru Akışı</Text>
                    </View>
                  </View>

                  {/* Başlık & Açıklama */}
                  <Text style={st.timelineCardTitle}>{node.title}</Text>
                  <Text style={st.timelineCardDesc} numberOfLines={2}>
                    {node.subtitle}
                  </Text>

                  {/* Adım Adım İçerik Mini Etiketleri */}
                  <View style={st.unitModulesPreviewRow}>
                    <View style={st.unitModuleChip}>
                      <Text style={st.unitModuleChipText}>1. Temel Mantık</Text>
                    </View>
                    <View style={st.unitModuleChip}>
                      <Text style={st.unitModuleChipText}>2. Alt Kurallar</Text>
                    </View>
                    <View style={st.unitModuleChip}>
                      <Text style={st.unitModuleChipText}>3. Çekim & Ekler</Text>
                    </View>
                    <View style={st.unitModuleChip}>
                      <Text style={st.unitModuleChipText}>4. Sinyal & Tuzaklar</Text>
                    </View>
                  </View>

                  {/* İlerleme Barı & Başlat Satırı */}
                  <View style={st.timelineFooterRow}>
                    <View style={{ flex: 1 }}>
                      <View style={st.timelineProgressRow}>
                        <View style={st.timelineProgressTrack}>
                          <View
                            style={[
                              st.timelineProgressFill,
                              {
                                width: `${percent}%`,
                                backgroundColor: isCompleted ? '#68A691' : '#E06D53',
                              },
                            ]}
                          />
                        </View>
                        <Text style={st.timelineProgressPercent}>%{percent}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TouchableOpacity
                        style={st.unitReadGuidePill}
                        onPress={(e) => {
                          e.stopPropagation();
                          openGuideModal(node);
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="book-outline" size={12} color="#D4A359" />
                        <Text style={st.unitReadGuideText}>Konu Anlatımı</Text>
                      </TouchableOpacity>

                      <View style={st.unitStartCtaPill}>
                        <Text style={st.unitStartCtaText}>Öğren</Text>
                        <Ionicons name="arrow-forward" size={12} color="#141413" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── TIMELINE ÜZERİNDEN DOĞRUDAN REHBER AÇILABİLME ── */}
      {renderRuleSheetModal()}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// WARM CARBON & EDITORIAL MATTE STİLLERİ
// ═══════════════════════════════════════════════════════════════════════════
const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.bg,
    padding: 24,
  },
  loadingText: {
    color: '#9E9A93',
    fontSize: 13,
    marginTop: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  // 1. Editoryal Matte Hero Kart
  editorialHeroCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 16,
    marginTop: 8,
    marginBottom: 18,
  },
  editorialHeroInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  editorialHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  editorialHeroIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#252321',
    borderWidth: 1,
    borderColor: '#363432',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editorialHeroTitle: {
    color: '#F4F1EA',
    fontSize: 14,
    fontWeight: '800',
  },
  editorialHeroBadge: {
    backgroundColor: '#2A2826',
    borderWidth: 1,
    borderColor: '#3A3734',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  editorialHeroBadgeText: {
    color: '#D4A359',
    fontSize: 10,
    fontWeight: '700',
  },
  editorialHeroSub: {
    color: '#9E9A93',
    fontSize: 11,
    marginTop: 2,
  },
  editorialHeroCount: {
    color: '#F4F1EA',
    fontSize: 12,
    fontWeight: '800',
  },
  editorialHeroUnitLabel: {
    color: '#8A857E',
    fontSize: 10,
  },
  editorialHeroTrack: {
    height: 6,
    backgroundColor: '#262523',
    borderRadius: 99,
    overflow: 'hidden',
    marginTop: 14,
  },
  editorialHeroFill: {
    height: '100%',
    backgroundColor: '#4E8774',
    borderRadius: 99,
  },

  // 2. Segmented Control
  segmentedWrapper: {
    marginBottom: 18,
  },
  segmentedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  segmentedLabel: {
    color: '#8A857E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  segmentedSub: {
    color: '#D4A359',
    fontSize: 11,
    fontWeight: '600',
  },
  segmentedGrid: {
    flexDirection: 'row',
    backgroundColor: '#1C1B1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 4,
    gap: 4,
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  segmentedBtnActive: {
    backgroundColor: '#F4F1EA',
  },
  segmentedBtnText: {
    color: '#9E9A93',
    fontSize: 11,
    fontWeight: '800',
  },
  segmentedBtnTextActive: {
    color: '#141413',
  },
  segmentedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // 3. Timeline Spine (Dikey Yol Haritası)
  timelineWrapper: {
    paddingLeft: 6,
  },
  timelineRow: {
    position: 'relative',
    paddingLeft: 32,
    marginBottom: 16,
  },
  timelineSpineLine: {
    position: 'absolute',
    left: 13,
    top: 0,
    bottom: -16,
    width: 2,
    backgroundColor: '#2C2B29',
  },
  timelineNodeCircle: {
    position: 'absolute',
    left: 0,
    top: 18,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#141413',
    zIndex: 5,
  },
  nodeCircleCompleted: {
    backgroundColor: '#4E8774',
  },
  nodeCircleActive: {
    backgroundColor: '#E06D53',
  },
  nodeCircleLocked: {
    backgroundColor: '#1F1E1C',
    borderColor: '#363432',
    borderWidth: 1,
  },
  timelineNodeText: {
    color: '#8A857E',
    fontSize: 11,
    fontWeight: '900',
  },
  timelineCard: {
    backgroundColor: '#161615',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242321',
    padding: 16,
  },
  timelineCardActive: {
    backgroundColor: '#1F1E1C',
    borderColor: 'rgba(224, 109, 83, 0.50)',
  },
  timelineCardCompleted: {
    backgroundColor: '#1A1918',
    borderColor: '#2C2B29',
  },
  timelineCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineLevelPill: {
    backgroundColor: '#252422',
    borderWidth: 1,
    borderColor: '#33312E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timelineLevelPillText: {
    color: '#A8A39D',
    fontSize: 10,
    fontWeight: '800',
  },
  activeUnitTag: {
    backgroundColor: 'rgba(212, 163, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.30)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeUnitTagText: {
    color: '#E5B976',
    fontSize: 10,
    fontWeight: '700',
  },
  unitStepCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#252422',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitStepCountText: {
    color: '#D4A359',
    fontSize: 10,
    fontWeight: '700',
  },
  timelineCardTitle: {
    color: '#F4F1EA',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  timelineCardDesc: {
    color: '#9E9A93',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  unitModulesPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  unitModuleChip: {
    backgroundColor: '#141413',
    borderWidth: 1,
    borderColor: '#2A2927',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitModuleChipText: {
    color: '#A8A39D',
    fontSize: 10,
    fontWeight: '600',
  },
  timelineFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  timelineProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#262523',
    borderRadius: 99,
    overflow: 'hidden',
  },
  timelineProgressFill: {
    height: '100%',
    borderRadius: 99,
  },
  timelineProgressPercent: {
    color: '#9E9A93',
    fontSize: 11,
    fontWeight: '700',
    width: 30,
  },
  unitReadGuidePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#262422',
    borderWidth: 1,
    borderColor: '#3D3A36',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
  },
  unitReadGuideText: {
    color: '#D4A359',
    fontSize: 11,
    fontWeight: '800',
  },
  unitStartCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E06D53',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  unitStartCtaText: {
    color: '#141413',
    fontSize: 11.5,
    fontWeight: '900',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // EKRAN 2: DUOLINGO TARZI ADIM ADIM KONU ANLATIMI & OYUN STİLLERİ
  // ═════════════════════════════════════════════════════════════════════════
  gameContainer: {
    flex: 1,
    backgroundColor: '#141413',
  },
  gameTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#141413',
  },
  gameBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameProgressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#22211F',
    borderRadius: 99,
    padding: 2,
    overflow: 'hidden',
  },
  gameProgressFill: {
    height: '100%',
    backgroundColor: '#68A691',
    borderRadius: 99,
  },
  gameTopStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ruleQuickBtn: {
    width: 32,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(224, 109, 83, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 83, 0.30)',
  },
  heartsPillText: {
    color: '#F08A73',
    fontSize: 12,
    fontWeight: '800',
  },
  xpGamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 163, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.30)',
  },
  xpGamePillText: {
    color: '#E5B976',
    fontSize: 12,
    fontWeight: '800',
  },

  // Adım Noktaları (Step Dots Bar)
  stepDotsBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#262523',
    paddingBottom: 10,
  },
  stepDotsScroll: {
    paddingHorizontal: 18,
    gap: 6,
  },
  stepDotPill: {
    minWidth: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2A2927',
  },
  stepDotPillDone: {
    backgroundColor: '#1B2421',
    borderColor: 'rgba(78, 135, 116, 0.40)',
  },
  stepDotPillCurrent: {
    backgroundColor: '#F4F1EA',
    borderColor: '#F4F1EA',
  },
  stepDotText: {
    color: '#8A857E',
    fontSize: 10,
    fontWeight: '700',
  },

  gameStepScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
  },
  unitBreadcrumbRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unitBreadcrumbText: {
    color: '#8A857E',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  unitBreadcrumbGuideBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
  },
  unitBreadcrumbGuideText: {
    color: '#D4A359',
    fontSize: 10,
    fontWeight: '800',
  },

  stepBlockWrap: {
    gap: 15,
  },

  // 1. ADIM ADIM DETAYLI KONU ANLATIM KARTI (CONCEPT)
  conceptBadgeRow: {
    gap: 6,
  },
  conceptBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 163, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.30)',
  },
  conceptBadgeText: {
    color: '#E5B976',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  conceptSubBadge: {
    color: '#9E9A93',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  conceptTitle: {
    color: '#F4F1EA',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 25,
  },
  zeroToHeroBox: {
    backgroundColor: '#1F1B19',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 83, 0.35)',
    padding: 15,
    gap: 8,
  },
  zeroToHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zeroToHeroHeaderTitle: {
    color: '#F08A73',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  zeroToHeroBodyText: {
    color: '#E6E2D8',
    fontSize: 13.5,
    lineHeight: 21,
  },
  conceptExplanationCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 15,
    gap: 10,
  },
  explanationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explanationHeaderTitle: {
    color: '#D4A359',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  conceptExplanationText: {
    color: '#D5D0C8',
    fontSize: 13.5,
    lineHeight: 21,
  },
  coreFormulaBannerBox: {
    backgroundColor: '#141413',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.35)',
    padding: 12,
    gap: 4,
  },
  coreFormulaBannerLabel: {
    color: '#D4A359',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  coreFormulaBannerCode: {
    color: '#F4F1EA',
    fontSize: 13.5,
    fontWeight: '800',
  },
  subSectionHeaderTitle: {
    color: '#A8A39D',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  formulaCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 14,
    gap: 7,
  },
  formulaLabel: {
    color: '#D4A359',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  miniAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#141413',
    borderWidth: 1,
    borderColor: '#262523',
  },
  miniAudioBtnText: {
    color: '#88C2AE',
    fontSize: 10.5,
    fontWeight: '700',
  },
  formulaCodeBox: {
    backgroundColor: '#141413',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262523',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  formulaCodeText: {
    color: '#88C2AE',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  formulaExampleMeta: {
    color: '#9E9A93',
    fontSize: 12.5,
    lineHeight: 19,
  },
  formulaExampleValue: {
    color: '#F4F1EA',
    fontWeight: '700',
  },
  formulaNoteBox: {
    backgroundColor: '#161615',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#D4A359',
  },
  formulaNoteText: {
    color: '#D5D0C8',
    fontSize: 12,
    lineHeight: 18,
  },

  // Yazım & İstisna Kartı
  edgeCaseCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 14,
    gap: 7,
  },
  edgeCaseRuleTitle: {
    color: '#F4F1EA',
    fontSize: 13,
    fontWeight: '800',
  },
  edgeCaseNoteText: {
    color: '#D5D0C8',
    fontSize: 12,
    lineHeight: 18,
  },

  // Sinyal Kelimeler Kartı
  signalCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 14,
    gap: 8,
  },
  signalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  signalWordText: {
    color: '#88C2AE',
    fontSize: 13.5,
    fontWeight: '900',
  },
  signalMeaningBadge: {
    color: '#E5B976',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#141413',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  signalPositionText: {
    color: '#D5D0C8',
    fontSize: 12,
    lineHeight: 18,
  },
  signalSampleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#141413',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#262523',
  },
  signalSampleText: {
    color: '#F4F1EA',
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },

  // Türk Öğrencilerin Düştüğü Tuzaklar Kartı
  trapCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 14,
    gap: 8,
  },
  trapWrongRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#291B19',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 83, 0.35)',
  },
  trapWrongBadge: {
    color: '#F08A73',
    fontSize: 10,
    fontWeight: '900',
  },
  trapWrongText: {
    color: '#F5D6CE',
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
    textDecorationLine: 'line-through',
  },
  trapRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1B2421',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 116, 0.35)',
  },
  trapRightBadge: {
    color: '#68A691',
    fontSize: 10,
    fontWeight: '900',
  },
  trapRightText: {
    color: '#D8EDE5',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  trapWhyText: {
    color: '#D5D0C8',
    fontSize: 12,
    lineHeight: 18,
  },

  // 3 Saniyelik Kontrol Listesi
  checklistCard: {
    backgroundColor: '#1B2421',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 116, 0.40)',
    padding: 15,
    gap: 8,
  },
  checklistTitle: {
    color: '#88C2AE',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  checklistItemText: {
    color: '#F4F1EA',
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '600',
  },

  timelineVisualBox: {
    backgroundColor: '#1A1918',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#282725',
    padding: 14,
    alignItems: 'center',
  },
  timelineVisualOverline: {
    color: '#8A857E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  timelineVisualText: {
    color: '#E5B976',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },

  // 2. ÇOKTAN SEÇMELİ BOŞLUK DOLDURMA (MULTIPLE CHOICE)
  mcTopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mcBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(78, 135, 116, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 116, 0.30)',
  },
  mcBadgeText: {
    color: '#88C2AE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  hintToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1C1B1A',
    borderWidth: 1,
    borderColor: '#2C2B29',
  },
  hintToggleBtnText: {
    color: '#D4A359',
    fontSize: 11,
    fontWeight: '700',
  },
  stepHintBanner: {
    backgroundColor: 'rgba(212, 163, 89, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.30)',
    padding: 12,
  },
  stepHintBannerText: {
    color: '#E5B976',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  mcQuestionText: {
    color: '#E6E2D8',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  mcSentenceCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2E2D2B',
    padding: 18,
  },
  mcSentenceText: {
    color: '#F4F1EA',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 28,
  },
  mcInlineBlankPill: {
    backgroundColor: 'rgba(224, 109, 83, 0.15)',
    color: '#F08A73',
    fontWeight: '900',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mcSentenceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  mcSentenceTrText: {
    color: '#9E9A93',
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  mcListenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#262523',
    borderWidth: 1,
    borderColor: '#363432',
  },
  mcListenChipText: {
    color: '#F4F1EA',
    fontSize: 11,
    fontWeight: '700',
  },
  mcOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 15,
  },
  mcOptionBtnSelected: {
    backgroundColor: '#262320',
    borderColor: '#E06D53',
  },
  mcOptionBtnCorrect: {
    backgroundColor: '#1B2421',
    borderColor: '#68A691',
  },
  mcOptionBtnWrong: {
    backgroundColor: '#291B19',
    borderColor: '#E06D53',
  },
  mcOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mcOptionIdBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#262523',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mcOptionIdBoxSelected: {
    backgroundColor: '#E06D53',
  },
  mcOptionIdText: {
    color: '#9E9A93',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  mcOptionLabel: {
    color: '#D5D0C8',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  mcRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3D3B38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mcRadioCircleSelected: {
    borderColor: '#E06D53',
    backgroundColor: '#E06D53',
  },

  // 3. CÜMLE İNŞASI (SENTENCE BUILDER)
  sbPromptSub: {
    color: '#9E9A93',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  sbTurkishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    padding: 15,
  },
  sbTurkishText: {
    color: '#F4F1EA',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    lineHeight: 22,
  },
  sbDropZone: {
    minHeight: 108,
    backgroundColor: '#181716',
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#2E2D2B',
    padding: 14,
    justifyContent: 'center',
  },
  sbDropPlaceholder: {
    color: '#78746E',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  sbPlacedWordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sbPlacedWordBtn: {
    backgroundColor: '#F4F1EA',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  sbPlacedWordText: {
    color: '#141413',
    fontSize: 14,
    fontWeight: '800',
  },
  sbWordBankWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 6,
  },
  sbBankWordBtn: {
    backgroundColor: '#22211F',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#111110',
    borderWidth: 1,
    borderColor: '#2E2D2B',
  },
  sbBankWordText: {
    color: '#F4F1EA',
    fontSize: 14,
    fontWeight: '800',
  },

  // 4. HIZLI EŞLEŞTİRME OYUNU (MATCH PAIRS)
  matchBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(224, 109, 83, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 83, 0.30)',
  },
  matchBadgeText: {
    color: '#F08A73',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  matchGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  matchColumn: {
    flex: 1,
    gap: 10,
  },
  matchCardBtn: {
    backgroundColor: '#1C1B1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2B29',
    paddingVertical: 15,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 58,
  },
  matchCardSelected: {
    backgroundColor: '#E06D53',
    borderColor: '#E06D53',
  },
  matchCardMatched: {
    backgroundColor: '#1B2421',
    borderColor: 'rgba(78, 135, 116, 0.35)',
    opacity: 0.55,
  },
  matchCardWrong: {
    backgroundColor: '#291B19',
    borderColor: '#E06D53',
  },
  matchCardText: {
    color: '#E6E2D8',
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  matchCardTextSelected: {
    color: '#141413',
  },
  matchCardTextMatched: {
    color: '#68A691',
  },

  // ALT GERİ BİLDİRİM & KONTROL ÇUBUĞU
  gameBottomBar: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#141413',
    borderTopWidth: 1,
    borderTopColor: '#22211F',
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  feedbackBannerCorrect: {
    backgroundColor: '#1B2421',
    borderColor: 'rgba(78, 135, 116, 0.45)',
  },
  feedbackBannerWrong: {
    backgroundColor: '#291B19',
    borderColor: 'rgba(224, 109, 83, 0.45)',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
  },
  feedbackDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    opacity: 0.92,
  },
  gamePrimaryCheckBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#F4F1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamePrimaryCheckBtnText: {
    color: '#141413',
    fontSize: 14,
    fontWeight: '900',
  },
  gameNextStepBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameNextStepBtnText: {
    color: '#141413',
    fontSize: 14,
    fontWeight: '900',
  },

  // ZAFER / ÜNİTE TAMAMLANDI EKRANI
  victoryScroll: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  victoryCard: {
    backgroundColor: '#1C1B1A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2E2D2B',
    padding: 24,
    alignItems: 'center',
  },
  victoryIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(212, 163, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  victoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 163, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 89, 0.30)',
    marginBottom: 10,
  },
  victoryBadgeText: {
    color: '#E5B976',
    fontSize: 11,
    fontWeight: '800',
  },
  victoryTitle: {
    color: '#F4F1EA',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  victorySub: {
    color: '#9E9A93',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  victoryStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 22,
  },
  victoryStatBox: {
    flex: 1,
    backgroundColor: '#141413',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262523',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  victoryStatLabel: {
    color: '#8A857E',
    fontSize: 9.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  victoryStatValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  victoryNextRoundBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#68A691',
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 10,
  },
  victoryNextRoundBtnText: {
    color: '#141413',
    fontSize: 13,
    fontWeight: '900',
  },
  victoryBackRoadmapBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#262523',
    borderWidth: 1,
    borderColor: '#363432',
    alignItems: 'center',
  },
  victoryBackRoadmapBtnText: {
    color: '#F4F1EA',
    fontSize: 13,
    fontWeight: '800',
  },

  // TAM TABLO REHBER MODALI
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 13, 12, 0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '82%',
    backgroundColor: '#141413',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#2C2B29',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#1C1B1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2B29',
  },
  modalOverline: {
    color: '#D4A359',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  modalTitle: {
    color: '#F4F1EA',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#262523',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSectionTitle: {
    color: '#F4F1EA',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
});
