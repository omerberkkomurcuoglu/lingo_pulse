import {
  DeepGrammarGuide,
  GrammarTopicContent,
  GrammarDrillQuestion,
  GrammarListeningTask,
  GrammarReadingTask,
  GrammarWritingTask,
  CefrLevel,
} from './types';

import { A1_DEEP_GUIDES } from './a1Topics';
import { A2_DEEP_GUIDES } from './a2Topics';
import { B1_DEEP_GUIDES } from './b1Topics';
import { B2_DEEP_GUIDES } from './b2Topics';
import { C1_DEEP_GUIDES } from './c1Topics';
import { C2_DEEP_GUIDES } from './c2Topics';

export * from './types';
export const ALL_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  ...A1_DEEP_GUIDES,
  ...A2_DEEP_GUIDES,
  ...B1_DEEP_GUIDES,
  ...B2_DEEP_GUIDES,
  ...C1_DEEP_GUIDES,
  ...C2_DEEP_GUIDES,
};

// Her bir konunun rehberinden ve kural bloklarından zengin, topic-spesifik TopicContent üretici
export function buildTopicContentFromGuide(
  nodeId: string,
  guide: DeepGrammarGuide,
  titleFallback?: string,
  levelFallback?: CefrLevel
): GrammarTopicContent {
  const title = titleFallback || nodeId.toUpperCase();
  const level = levelFallback || 'B1';

  // 1) Lecture Bloğu
  const formulas = guide.conjugationRows.map(r => ({
    type: r.formType,
    formula: r.formula,
    example: r.exampleEn,
  }));

  const deepRules = guide.detailedRuleBlocks.map(b => ({
    title: b.title,
    detail: b.explanationTr,
  }));

  const commonPitfalls = guide.turkishTraps.map(t => ({
    wrong: t.wrong,
    right: t.right,
    why: t.whyTr,
  }));

  const examples = guide.detailedRuleBlocks.flatMap(b =>
    b.examples.map(ex => ({
      en: ex.en,
      tr: ex.tr,
      analysis: ex.note,
    }))
  );

  // 2) Drills: Konunun kural ve tuzaklarından türetilen özgün alıştırma soruları
  const drills: GrammarDrillQuestion[] = [];

  // A) Tuzaklardan türetilen sorular
  guide.turkishTraps.forEach((trap, idx) => {
    const wrongWords = trap.wrong.split(' ');
    const rightWords = trap.right.split(' ');
    drills.push({
      id: `${nodeId}-drill-trap-${idx + 1}`,
      sentence: `Select the grammatically correct sentence: [_____]`,
      sentenceTr: `Hatasız cümleyi seçin: (${trap.whyTr.slice(0, 70)}...)`,
      options: [trap.right, trap.wrong, trap.right.replace(/ed\b|s\b/g, ''), trap.wrong + ' not'],
      correctAnswer: trap.right,
      explanation: `Doğru: "${trap.right}". Neden: ${trap.whyTr}`,
      difficulty: 'expert',
      sourceTopicId: nodeId,
    });
  });

  // B) Kural örneklerinden türetilen boşluk doldurma soruları
  guide.detailedRuleBlocks.forEach((block, bIdx) => {
    block.examples.forEach((ex, exIdx) => {
      const words = ex.en.split(' ');
      if (words.length >= 4) {
        const targetIndex = Math.min(3, words.length - 2);
        const targetWord = words[targetIndex].replace(/[.,?!]/g, '');
        const blankSentence = words.map((w, i) => (i === targetIndex ? '[_____]' : w)).join(' ');
        drills.push({
          id: `${nodeId}-drill-rule-${bIdx + 1}-${exIdx + 1}`,
          sentence: blankSentence,
          sentenceTr: ex.tr,
          options: [
            targetWord,
            targetWord + 'ing',
            targetWord + 'ed',
            'not ' + targetWord,
          ].slice(0, 4),
          correctAnswer: targetWord,
          explanation: `${block.title}: ${ex.note}`,
          difficulty: 'hard',
          sourceTopicId: nodeId,
        });
      }
    });
  });

  // 3) Listening: Rehberin örneklerini içeren bağlamsal ses metni
  const primaryExample = guide.detailedRuleBlocks[0]?.examples[0] || {
    en: 'Mastery of grammatical precision ensures clarity of thought.',
    tr: 'Gramer hassasiyetine hakimiyet düşünce berraklığı sağlar.',
    note: 'Temel akademik kural.',
  };

  const listening: GrammarListeningTask = {
    id: `${nodeId}-listen`,
    title: `${title} — Bağlamsal Dinleme Analizi`,
    audioScript: `In professional communication, mastering ${title} is essential. Consider this example: "${primaryExample.en}". Language precision eliminates ambiguity and enhances credibility.`,
    audioScriptTr: `Profesyonel iletişimde ${title} konusuna hâkim olmak çok önemlidir. Şu örneği inceleyin: "${primaryExample.tr}". Dilde kesinlik belirsizlikleri ortadan kaldırır ve güvenilirliği artırır.`,
    questions: [
      {
        id: `${nodeId}-l1`,
        question: `Dinlediğiniz parçada "${title}" kuralını örnekleyen cümle hangisidir?`,
        options: [
          primaryExample.en,
          'Language precision is optional in business.',
          'Ambiguity is preferred in scientific papers.',
          'None of the above.',
        ],
        correctAnswer: primaryExample.en,
        explanation: `Ses kaydında verilen örnek: "${primaryExample.en}" (${primaryExample.note})`,
      },
      {
        id: `${nodeId}-l2`,
        question: `Metne göre dilde yapısal doğruluğun sağladığı temel fayda nedir?`,
        options: [
          'It eliminates ambiguity and enhances credibility.',
          'It makes all sentences shorter.',
          'It removes the need for punctuation.',
          'It only matters in spoken conversations.',
        ],
        correctAnswer: 'It eliminates ambiguity and enhances credibility.',
        explanation: 'Son cümlede belirtildiği üzere: "Language precision eliminates ambiguity and enhances credibility."',
      },
    ],
  };

  // 4) Reading: Konu ile ilgili derin okuma ve analiz parçası
  const reading: GrammarReadingTask = {
    id: `${nodeId}-read`,
    title: `${title} — Akademik ve Profesyonel Metin İncelemesi`,
    passage: `Linguistic analysis reveals that structures such as ${title} play a foundational role in organizing complex ideas.\n\n${guide.overviewTr}\n\nExperts who command these subtleties communicate with persuasive clarity, avoiding the common pitfalls that often confuse non-native speakers.`,
    passageTr: `Dilbilimsel analizler, ${title} gibi yapıların karmaşık fikirleri düzenlemede kurucu bir rol oynadığını ortaya koymaktadır.\n\n${guide.overviewTr}\n\nBu inceliklere hâkim olan uzmanlar, anadili İngilizce olmayanların sıklıkla düştüğü tuzaklardan kaçınarak ikna edici bir netlikle iletişim kurarlar.`,
    highlightedStructures: guide.signalWords.map(s => s.word.split('/')[0].trim()).slice(0, 4),
    questions: [
      {
        id: `${nodeId}-r1`,
        question: `Parçaya göre "${title}" konusundaki kurallara hâkim olmanın temel avantajı nedir?`,
        options: [
          'It allows speakers to communicate with persuasive clarity and avoid common pitfalls.',
          'It eliminates the need to study vocabulary.',
          'It is only useful for historical novels.',
          'It makes writing informal and casual.',
        ],
        correctAnswer: 'It allows speakers to communicate with persuasive clarity and avoid common pitfalls.',
        explanation: 'Metnin son cümlesinde açıkça belirtildiği üzere karmaşık fikirleri netlikle ifade etmeyi ve tuzaklardan kaçınmayı sağlar.',
      },
    ],
  };

  // 5) Writing: Türkçeden İngilizceye çeviri ve üretim
  const writing: GrammarWritingTask[] = guide.turkishTraps.slice(0, 3).map((trap, idx) => ({
    id: `${nodeId}-w-${idx + 1}`,
    promptTr: `Aşağıdaki hatalı mantığı düzelterek doğru İngilizce cümleyi kurun: "${trap.right}"`,
    instruction: `${level} seviyesine uygun doğru gramer kurgusuyla yazın.`,
    targetStructureHint: `Doğru yapı: "${trap.right}" — ${trap.whyTr}`,
    sampleIdealAnswer: trap.right,
    requiredKeywords: trap.right.split(' ').slice(0, 3),
  }));

  // 6) Exam Questions: Zorlu bölüm sonu sınav soruları
  const examQuestions: GrammarDrillQuestion[] = drills.slice(0, 6);

  return {
    topicId: nodeId,
    lecture: {
      summary: guide.overviewTr,
      formulas,
      deepRules,
      commonPitfalls,
      examples,
    },
    drills,
    listening,
    reading,
    writing,
    examQuestions,
  };
}
