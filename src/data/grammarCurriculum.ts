import { ALL_DEEP_GUIDES, buildTopicContentFromGuide } from './grammar';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface GrammarExample {
  en: string;
  tr: string;
  analysis: string;
}

export interface GrammarDrillQuestion {
  id: string;
  sentence: string;       // Cümle içinde [_____] boşluğu
  sentenceTr: string;
  options: string[];
  correctAnswer: string;
  explanation: string;    // Neden doğru olduğunun detaylı gramer analizi
  difficulty: 'hard' | 'expert';
  sourceTopicId?: string;
}

export interface GrammarListeningTask {
  id: string;
  title: string;
  audioScript: string;    // TTS ile seslendirilecek yüksek seviyeli metin
  audioScriptTr: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface GrammarReadingTask {
  id: string;
  title: string;
  passage: string;
  passageTr: string;
  highlightedStructures: string[];
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface GrammarWritingTask {
  id: string;
  promptTr: string;       // Kullanıcının İngilizceye çevirmesi veya kurması gereken zorlu cümle/paragraf
  instruction: string;
  targetStructureHint: string;
  sampleIdealAnswer: string;
  requiredKeywords: string[];
}

export interface GrammarTopicContent {
  topicId: string;
  lecture: {
    summary: string;
    formulas: { type: string; formula: string; example: string }[];
    deepRules: { title: string; detail: string }[];
    commonPitfalls: { wrong: string; right: string; why: string }[];
    examples: GrammarExample[];
  };
  drills: GrammarDrillQuestion[];
  listening: GrammarListeningTask;
  reading: GrammarReadingTask;
  writing: GrammarWritingTask[];
  examQuestions: GrammarDrillQuestion[];
}

export interface GrammarCurriculumNode {
  id: string;
  orderIndex: number;
  level: CefrLevel;
  type: 'topic' | 'checkpoint';
  title: string;
  subtitle: string;
  badgeText: string;
  passingScore: number;         // Varsayılan 80
  coveredTopicIds?: string[];   // Checkpoint sınavları için kapsanan tüm geçmiş konular
}

export interface GrammarUserProgress {
  completedNodeIds: string[];
  nodeScores: Record<string, {
    bestExamScore: number;
    drillsScore?: number;
    listeningScore?: number;
    readingScore?: number;
    writingScore?: number;
    attempts: number;
    passed: boolean;
    updatedAt: string;
  }>;
}

export const GRAMMAR_CURRICULUM: GrammarCurriculumNode[] = [
  // ==================== A1 (Breakthrough) ====================
  {
    id: 'a1-1',
    orderIndex: 1,
    level: 'A1',
    type: 'topic',
    title: 'Simple Present Tense & To Be',
    subtitle: 'Geniş Zaman, Durum Fiilleri (Stative Verbs), 3. Tekil Şahıs Kuralları ve Sıklık Zarfları',
    badgeText: 'A1 • KONU 1',
    passingScore: 80,
  },
  {
    id: 'a1-2',
    orderIndex: 2,
    level: 'A1',
    type: 'topic',
    title: 'Present Continuous vs. Simple Present',
    subtitle: 'Şimdiki Zaman, Eylem ve Durum Fiilleri Ayrımı (Think, Have, See, Taste İkili Anlamları)',
    badgeText: 'A1 • KONU 2',
    passingScore: 80,
  },
  {
    id: 'a1-cp1',
    orderIndex: 3,
    level: 'A1',
    type: 'checkpoint',
    title: 'Kümülatif Tarama Sınavı #1',
    subtitle: 'Simple Present, To Be ve Present Continuous (Stative/Dynamic) Karma Geçiş Sınavı',
    badgeText: 'A1 • TARAMA 1',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2'],
  },
  {
    id: 'a1-3',
    orderIndex: 4,
    level: 'A1',
    type: 'topic',
    title: 'Articles & Noun Plurals: A, An, The & Zero Article',
    subtitle: 'Belirli/Belirsiz Tanımlıklar, Sayılabilen/Sayılamayan İsimler, Düzensiz Çoğullar (child/children, person/people)',
    badgeText: 'A1 • KONU 3',
    passingScore: 80,
  },
  {
    id: 'a1-4',
    orderIndex: 5,
    level: 'A1',
    type: 'topic',
    title: 'Prepositions of Time, Place & Movement',
    subtitle: 'In/On/At Derin Kuralları, By/Until/During Farkları, Under, Next to, Into ve Out of Kullanımları',
    badgeText: 'A1 • KONU 4',
    passingScore: 80,
  },
  {
    id: 'a1-5',
    orderIndex: 6,
    level: 'A1',
    type: 'topic',
    title: 'Modals of Ability & Requests: Can, Can\'t & Could',
    subtitle: 'Yetenek, İzin, Rica ve Olasılık: Can I...?, Could you...?, Can\'t (İmkansızlık) ve Be able to Karşılaştırması',
    badgeText: 'A1 • KONU 5',
    passingScore: 80,
  },
  {
    id: 'a1-6',
    orderIndex: 7,
    level: 'A1',
    type: 'topic',
    title: 'Pronouns, Demonstratives & Wh- Question Formation',
    subtitle: 'Özne/Nesne Zamirleri (Me, Him, Us), İyelikler (Mine, Hers), This/That/These/Those ve Soru Kelimeleri',
    badgeText: 'A1 • KONU 6',
    passingScore: 80,
  },
  {
    id: 'a1-cp2',
    orderIndex: 8,
    level: 'A1',
    type: 'checkpoint',
    title: 'A1 Master Kümülatif Sınavı #2',
    subtitle: 'Tüm A1 Müfredatını (Konu 1–6) Kapsayan Zorlu Seviye Atlama ve Bitirme Sınavı',
    badgeText: 'A1 • FİNAL TARAMA',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6'],
  },

  // ==================== A2 (Waystage) ====================
  {
    id: 'a2-1',
    orderIndex: 9,
    level: 'A2',
    type: 'topic',
    title: 'Simple Past Tense & Used To / Would',
    subtitle: 'Geçmiş Zaman, Düzensiz Fiiller, Did/Didn\'t Çekimleri ve Geçmiş Alışkanlıklarda Used To vs. Would',
    badgeText: 'A2 • KONU 7',
    passingScore: 80,
  },
  {
    id: 'a2-2',
    orderIndex: 10,
    level: 'A2',
    type: 'topic',
    title: 'Past Continuous & Time Clauses',
    subtitle: 'When, While, As, Just As ile Kesilen ve Paralel Geçmiş Eylemler (Was/Were + V-ing)',
    badgeText: 'A2 • KONU 8',
    passingScore: 80,
  },
  {
    id: 'a2-cp1',
    orderIndex: 11,
    level: 'A2',
    type: 'checkpoint',
    title: 'Kümülatif Tarama Sınavı #3 (A1 + A2 Temelleri)',
    subtitle: 'A1 Temelleri + Simple Past, Used To ve Past Continuous Birikimli Sınavı',
    badgeText: 'A2 • TARAMA 3',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2'],
  },
  {
    id: 'a2-3',
    orderIndex: 12,
    level: 'A2',
    type: 'topic',
    title: 'Future Forms: Will vs. Be Going To vs. Present Continuous',
    subtitle: 'Gelecek Zaman Çeşitleri: Anlık Kararlar (Will), Önceden Planlanan Niyetler (Be going to) ve Kesin Randevular',
    badgeText: 'A2 • KONU 9',
    passingScore: 80,
  },
  {
    id: 'a2-4',
    orderIndex: 13,
    level: 'A2',
    type: 'topic',
    title: 'Comparatives, Superlatives & As...As',
    subtitle: 'Derecelendirme, The... The... Kalıpları, Much/Far/Slightly Pekiştirme ve Eşitlik Karşılaştırmaları',
    badgeText: 'A2 • KONU 10',
    passingScore: 80,
  },
  {
    id: 'a2-5',
    orderIndex: 14,
    level: 'A2',
    type: 'topic',
    title: 'Modals of Obligation & Advice: Must, Have to, Should & Mustn\'t',
    subtitle: 'İçsel vs. Dışsal Zorunluluk (Must vs. Have to), Güçlü Tavsiye (Should/Ought to) ve Yasak vs. Zorunsuzluk (Mustn\'t vs. Don\'t have to)',
    badgeText: 'A2 • KONU 11',
    passingScore: 80,
  },
  {
    id: 'a2-6',
    orderIndex: 15,
    level: 'A2',
    type: 'topic',
    title: 'Quantifiers & Indefinite Pronouns',
    subtitle: 'Some, Any, Much, Many, A lot of, A few vs. Few, A little vs. Little, Someone, Anything, Nowhere',
    badgeText: 'A2 • KONU 12',
    passingScore: 80,
  },
  {
    id: 'a2-cp2',
    orderIndex: 16,
    level: 'A2',
    type: 'checkpoint',
    title: 'A2 Master Kümülatif Sınavı #4',
    subtitle: 'A1 ve A2 Seviyesindeki İlk 12 Konunun Tamamını Kapsayan Kapsamlı Seviye Atlama Sınavı',
    badgeText: 'A2 • FİNAL TARAMA',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6'],
  },

  // ==================== B1 (Threshold) ====================
  {
    id: 'b1-1',
    orderIndex: 17,
    level: 'B1',
    type: 'topic',
    title: 'Present Perfect vs. Simple Past',
    subtitle: 'Belirsiz Zaman, Bitmemiş Zaman Dilimleri, Been To vs. Gone To, Just/Already/Yet ve Since/For Altın Kuralı',
    badgeText: 'B1 • KONU 13',
    passingScore: 80,
  },
  {
    id: 'b1-2',
    orderIndex: 18,
    level: 'B1',
    type: 'topic',
    title: 'Present Perfect Continuous & Verb Aspect',
    subtitle: 'Süreç Odaklılık, Kesintisiz Süren Eylemler, How long...? ve Non-Continuous Fiil Kısıtlamaları',
    badgeText: 'B1 • KONU 14',
    passingScore: 80,
  },
  {
    id: 'b1-cp1',
    orderIndex: 19,
    level: 'B1',
    type: 'checkpoint',
    title: 'Kümülatif Tarama Sınavı #5 (A1–B1 Geçiş)',
    subtitle: 'Tüm Zamanlar (Present, Past, Future, Perfect) ve Modal Temellerinin Karşılaştırmalı Sınavı',
    badgeText: 'B1 • TARAMA 5',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2'],
  },
  {
    id: 'b1-3',
    orderIndex: 20,
    level: 'B1',
    type: 'topic',
    title: 'Modals of Deduction: Must, Can\'t, Might, May & Could',
    subtitle: 'Şimdiki Zaman Çıkarımları: %100 Eminlik (Must/Can\'t), Olasılık (%50 Might/May) ve Mantıksal Çıkarım',
    badgeText: 'B1 • KONU 15',
    passingScore: 80,
  },
  {
    id: 'b1-4',
    orderIndex: 21,
    level: 'B1',
    type: 'topic',
    title: 'Conditionals (Type 0, 1, 2) & Unless / In case',
    subtitle: 'Bilimsel Gerçekler (Type 0), Olası Gelecek (Type 1), Gerçek Dışı Şimdiki Zaman (Type 2: If I were you) ve Unless',
    badgeText: 'B1 • KONU 16',
    passingScore: 80,
  },
  {
    id: 'b1-5',
    orderIndex: 22,
    level: 'B1',
    type: 'topic',
    title: 'Past Perfect Simple & Continuous',
    subtitle: 'Geçmişin Geçmişi (Had + V3), By the time, Already, Before, After ve Süreklilik (Had been V-ing)',
    badgeText: 'B1 • KONU 17',
    passingScore: 80,
  },
  {
    id: 'b1-6',
    orderIndex: 23,
    level: 'B1',
    type: 'topic',
    title: 'Passive Voice Fundamentals',
    subtitle: 'Tüm Zamanlarda Edilgen Çatı Mantığı: Am/Is/Are + V3, Was/Were + V3, Have been + V3 ve By + Fail Yapısı',
    badgeText: 'B1 • KONU 18',
    passingScore: 80,
  },
  {
    id: 'b1-cp2',
    orderIndex: 24,
    level: 'B1',
    type: 'checkpoint',
    title: 'B1 Master Kümülatif Sınavı #6',
    subtitle: 'A1, A2 ve B1 Müfredatındaki 18 Konunun Tamamını Test Eden Kapsamlı Baraj Sınavı',
    badgeText: 'B1 • FİNAL TARAMA',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6'],
  },

  // ==================== B2 (Vantage) ====================
  {
    id: 'b2-1',
    orderIndex: 25,
    level: 'B2',
    type: 'topic',
    title: 'Advanced Passives & Causative Structures',
    subtitle: 'Çift Nesneli Passive, Have/Get something done, Make/Let/Have someone do, Get someone to do ve Impersonal Passives',
    badgeText: 'B2 • KONU 19',
    passingScore: 80,
  },
  {
    id: 'b2-2',
    orderIndex: 26,
    level: 'B2',
    type: 'topic',
    title: 'Third Conditionals, Mixed Conditionals & Wish Clauses',
    subtitle: 'Geçmiş Pişmanlıklar (If had V3, would have V3), Karışık Şartlar (Past -> Present / Present -> Past) ve I wish / If only',
    badgeText: 'B2 • KONU 20',
    passingScore: 80,
  },
  {
    id: 'b2-cp1',
    orderIndex: 27,
    level: 'B2',
    type: 'checkpoint',
    title: 'Kümülatif Tarama Sınavı #7 (A1–B2 İleri Düzey)',
    subtitle: '20 Gramer Konusunun Birleşik Akademik Sentez Sınavı',
    badgeText: 'B2 • TARAMA 7',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b2-1', 'b2-2'],
  },
  {
    id: 'b2-3',
    orderIndex: 28,
    level: 'B2',
    type: 'topic',
    title: 'Relative Clauses & Participle Reductions',
    subtitle: 'Defining/Non-Defining, Preposition + Whom/Which, Whose, Whereby ve V-ing / V3 / To V1 Cümlecik Kısaltmaları',
    badgeText: 'B2 • KONU 21',
    passingScore: 80,
  },
  {
    id: 'b2-4',
    orderIndex: 29,
    level: 'B2',
    type: 'topic',
    title: 'Reported Speech & Complex Reporting Verbs',
    subtitle: 'Dolaylı Anlatım, Zaman Kayması Kuralları ve Özel Raporlama Fiilleri (Accuse of, Deny, Insist on, Warn against)',
    badgeText: 'B2 • KONU 22',
    passingScore: 80,
  },
  {
    id: 'b2-5',
    orderIndex: 30,
    level: 'B2',
    type: 'topic',
    title: 'Future Continuous & Future Perfect Aspects',
    subtitle: 'Will be doing (Gelecekte Belirli Anda Süregelen Eylem) vs. Will have done (Belirli Bir Noktadan Önce Tamamlanmışlık: By 2030)',
    badgeText: 'B2 • KONU 23',
    passingScore: 80,
  },
  {
    id: 'b2-6',
    orderIndex: 31,
    level: 'B2',
    type: 'topic',
    title: 'Gerunds vs. Infinitives: Meaning Shifts & Prepositions',
    subtitle: 'Fiilimsi Farkları: Stop, Remember, Regret, Try, Forget ile Değişen Anlamlar ve Edat + V-ing Kuralı',
    badgeText: 'B2 • KONU 24',
    passingScore: 80,
  },
  {
    id: 'b2-cp2',
    orderIndex: 32,
    level: 'B2',
    type: 'checkpoint',
    title: 'B2 Master Kümülatif Sınavı #8',
    subtitle: 'A1–B2 Arası 24 Konunun Tamamını İçeren Uluslararası Yeterlilik ve IELTS/TOEFL Ön-Baraj Sınavı',
    badgeText: 'B2 • FİNAL TARAMA',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b2-1', 'b2-2', 'b2-3', 'b2-4', 'b2-5', 'b2-6'],
  },

  // ==================== C1 (Effective Operational) ====================
  {
    id: 'c1-1',
    orderIndex: 33,
    level: 'C1',
    type: 'topic',
    title: 'Negative Inversion & Fronting',
    subtitle: 'Never, Seldom, Little, Hardly... when, No sooner... than, Not only... but also, Only after ile Devrik Yapılar',
    badgeText: 'C1 • KONU 25',
    passingScore: 80,
  },
  {
    id: 'c1-2',
    orderIndex: 34,
    level: 'C1',
    type: 'topic',
    title: 'Cleft Sentences & The Subjunctive Mood',
    subtitle: 'Vurgu Cümleleri (It was... that, What I need is...) ve Resmi Subjunctive (Demand/Insist/Vital that + Bare Infinitive)',
    badgeText: 'C1 • KONU 26',
    passingScore: 80,
  },
  {
    id: 'c1-cp1',
    orderIndex: 35,
    level: 'C1',
    type: 'checkpoint',
    title: 'Kümülatif Tarama Sınavı #9 (A1–C1 İleri Akademik)',
    subtitle: 'Devrik Cümleler, Cleft, Subjunctive ve Önceki 24 Konunun Akademik Taraması',
    badgeText: 'C1 • TARAMA 9',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b2-1', 'b2-2', 'b2-3', 'b2-4', 'b2-5', 'b2-6', 'c1-1', 'c1-2'],
  },
  {
    id: 'c1-3',
    orderIndex: 36,
    level: 'C1',
    type: 'topic',
    title: 'Past Modals & Advanced Speculation',
    subtitle: 'Must have V3, Can\'t have V3, Needn\'t have V3 vs. Didn\'t need to, Should have V3 ve May/Might well have V3',
    badgeText: 'C1 • KONU 27',
    passingScore: 80,
  },
  {
    id: 'c1-4',
    orderIndex: 37,
    level: 'C1',
    type: 'topic',
    title: 'Conditional Inversion & Alternatives to If',
    subtitle: 'Had I known, Were you to ask, Should you require assistance, But for, Provided that, As long as, Supposing that',
    badgeText: 'C1 • KONU 28',
    passingScore: 80,
  },
  {
    id: 'c1-5',
    orderIndex: 38,
    level: 'C1',
    type: 'topic',
    title: 'Advanced Participle & Absolute Clauses',
    subtitle: 'Having been V3, Not having known, Weather permitting, With night falling, Bağımsız Özneli Kısaltmalar',
    badgeText: 'C1 • KONU 29',
    passingScore: 80,
  },
  {
    id: 'c1-6',
    orderIndex: 39,
    level: 'C1',
    type: 'topic',
    title: 'Impersonal Passive & Distance Language in Academic Reports',
    subtitle: 'It is claimed/believed that..., He is thought to have stolen..., There is alleged to be... ve Mesafeli Dil',
    badgeText: 'C1 • KONU 30',
    passingScore: 80,
  },
  {
    id: 'c1-cp2',
    orderIndex: 40,
    level: 'C1',
    type: 'checkpoint',
    title: 'C1 Master Kümülatif Sınavı #10',
    subtitle: 'A1–C1 Arası 30 Konunun Tamamını Kapsayan İleri Düzey Akademik İngilizce Baraj Sınavı',
    badgeText: 'C1 • FİNAL TARAMA',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b2-1', 'b2-2', 'b2-3', 'b2-4', 'b2-5', 'b2-6', 'c1-1', 'c1-2', 'c1-3', 'c1-4', 'c1-5', 'c1-6'],
  },

  // ==================== C2 (Mastery) ====================
  {
    id: 'c2-1',
    orderIndex: 41,
    level: 'C2',
    type: 'topic',
    title: 'Advanced Discourse Markers, Ellipsis & Substitution',
    subtitle: 'Notwithstanding, Albeit, Inasmuch as, Be that as it may, Much as, Do so, So/Neither Devrikliği ve Cümle Eksiltileri',
    badgeText: 'C2 • KONU 31',
    passingScore: 80,
  },
  {
    id: 'c2-2',
    orderIndex: 42,
    level: 'C2',
    type: 'topic',
    title: 'Nominalisation, Hedging & Stylistic Nuance',
    subtitle: 'Fiil Merkezli İfadeleri Akademik İsim Öbeklerine Dönüştürme, İhtiyatlı Akademik Dil (Hedging: It would appear that...)',
    badgeText: 'C2 • KONU 32',
    passingScore: 80,
  },
  {
    id: 'c2-3',
    orderIndex: 43,
    level: 'C2',
    type: 'topic',
    title: 'Stylistic & Locative Inversion',
    subtitle: 'Down came the rain, On the platform stood the conductor, Little did he realize, Seldom have I witnessed',
    badgeText: 'C2 • KONU 33',
    passingScore: 80,
  },
  {
    id: 'c2-4',
    orderIndex: 44,
    level: 'C2',
    type: 'topic',
    title: 'Archaic Subjunctive & Fixed Idiomatic Inversions',
    subtitle: 'Come what may, Suffice it to say, Be that as it may, Far be it from me, So be it, Were it not for your support',
    badgeText: 'C2 • KONU 34',
    passingScore: 80,
  },
  {
    id: 'c2-5',
    orderIndex: 45,
    level: 'C2',
    type: 'topic',
    title: 'Complex Prepositional Idioms & Register Shifts',
    subtitle: 'In light of, With a view to, Subject to, In lieu of, By virtue of, Under the auspices of ile Resmi / Hukuki Yazışmalar',
    badgeText: 'C2 • KONU 35',
    passingScore: 80,
  },
  {
    id: 'c2-6',
    orderIndex: 46,
    level: 'C2',
    type: 'topic',
    title: 'Grand Synthesis: Rhetorical Grammar & Textual Cohesion',
    subtitle: 'Tüm CEFR Düzeylerinin Birleşimi: Üst Düzey Retorik, Anlamsal Ritim, Paragraf Bağı ve Kusursuz Akıcılık',
    badgeText: 'C2 • KONU 36',
    passingScore: 80,
  },
  {
    id: 'c2-cp1',
    orderIndex: 47,
    level: 'C2',
    type: 'checkpoint',
    title: 'C2 Grandmaster Kümülatif Final Sınavı #11',
    subtitle: 'A1\'den C2\'ye Tüm 36 Gramer Konusunun Kusursuz Hakimiyetini Ölçen Büyük Şampiyonluk Sınavı',
    badgeText: 'C2 • BÜYÜK FİNAL',
    passingScore: 80,
    coveredTopicIds: ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b2-1', 'b2-2', 'b2-3', 'b2-4', 'b2-5', 'b2-6', 'c1-1', 'c1-2', 'c1-3', 'c1-4', 'c1-5', 'c1-6', 'c2-1', 'c2-2', 'c2-3', 'c2-4', 'c2-5', 'c2-6'],
  },
];

export const SEED_GRAMMAR_CONTENTS: Record<string, GrammarTopicContent> = {
  'a1-1': {
    topicId: 'a1-1',
    lecture: {
      summary: 'Simple Present Tense yalnızca basit günlük rutinleri değil; bilimsel gerçekleri, tarife/programları (timetables), durum fiillerini (stative verbs) ve zaman bağlaçlı gelecek yapıları ifade eder. Üçüncü tekil şahıs (-s/-es/-ies) çekimi ve "do/does" yardımcı fiiliyle "am/is/are" durum yapısının birbirine karıştırılmaması en kritik noktadır.',
      formulas: [
        { type: 'Olumlu (Fiil)', formula: 'Subject + V1 / V(-s/-es/-ies) + Object', example: 'Water freezes at 0°C, and she studies astrophysics every night.' },
        { type: 'Olumsuz (Fiil)', formula: 'Subject + do not (don\'t) / does not (doesn\'t) + V1 (yalın!)', example: 'He doesn\'t understand why the train leaves so early.' },
        { type: 'Soru (Fiil)', formula: '(Wh-) + Do / Does + Subject + V1 (yalın!)?', example: 'How often does the committee meet to review the budget?' },
        { type: 'Durum (To Be)', formula: 'Subject + am / is / are (+ not) + Noun / Adjective / Prep.', example: 'She is rarely late, even when the traffic is heavy.' },
      ],
      deepRules: [
        {
          title: '1. Sıklık Zarflarının (Adverbs of Frequency) Kesin Konumu',
          detail: 'Always, usually, often, seldom, rarely, never zarfları ASIL FİİLDEN ÖNCE (She rarely speaks), ancak TO BE (am/is/are) fiilinden SONRA (She is rarely quiet) gelir. Olumsuz cümlede "never" veya "hardly ever" kullanıldığında yardımcı fiil olumlu kalır (He never goes — "doesn\'t never" YANLIŞTIR).',
        },
        {
          title: '2. Tarife ve Programlarda (Timetables) Gelecek Anlamı',
          detail: 'Uçak, tren, ders, sınav, sinema gibi resmi saat çizelgesine bağlı gelecek olaylarda Simple Present kullanılır: "The international conference starts at 09:00 tomorrow morning."',
        },
        {
          title: '3. Üçüncü Tekil Şahıs (-s / -es / -ies) ve Have -> Has',
          detail: 'Sessiz harf + y ile biten fiillerde -y düşer ve -ies gelir (cry -> cries,Carry -> carries); ancak sesli + y ile bitenlerde sadece -s eklenir (play -> plays, buy -> buys). -ch, -sh, -ss, -x, -o ile bitenler -es alır (go -> goes, fix -> fixes).',
        },
        {
          title: '4. Özne Soruları (Subject Questions) Tuzağı',
          detail: '"Who" veya "What" cümlenin öznesini soruyorsa "do/does" KULLANILMAZ ve fiil 3. tekil şahıs (-s) alır: "Who knows the answer?" (Cevabı kim biliyor?) vs. "Who do you know here?" (Burada kimi tanıyorsun? - Nesne sorusu).',
        },
      ],
      commonPitfalls: [
        {
          wrong: 'She doesn\'t has enough time to finish the report.',
          right: 'She doesn\'t have enough time to finish the report.',
          why: '"Does / Doesn\'t" yardımcı fiili devreye girdiğinde asıl fiil mutlaka yalın (V1) haline döner; "has" -> "have" olur.',
        },
        {
          wrong: 'Are you agree with this proposal?',
          right: 'Do you agree with this proposal?',
          why: '"Agree" bir sıfat değil, tam bir fiildir (kabul etmek/katılmak). Bu yüzden "am/is/are" ile değil, "do/does" ile çekimlenir.',
        },
        {
          wrong: 'Who does live in that apartment?',
          right: 'Who lives in that apartment?',
          why: 'Özne sorularında (Who özne konumundayken) olumlu cümle dizilimi korunur ve "does" kullanılmaz.',
        },
      ],
      examples: [
        {
          en: 'The human heart beats approximately 100,000 times a day and pumps blood continuously.',
          tr: 'İnsan kalbi günde yaklaşık 100.000 kez atar ve sürekli kan pompalar.',
          analysis: 'Bilimsel gerçek (general truth). "The human heart" (it) öznesi için "beats" ve "pumps" fiilleri -s takısı almıştır.',
        },
        {
          en: 'Neither of the engineers understands why the server rarely responds on Mondays.',
          tr: 'Mühendislerin hiçbiri sunucunun pazartesileri neden nadiren yanıt verdiğini anlamıyor.',
          analysis: '"Neither of..." yapısı tekil kabul edilir ("understands"). Yan cümlede (why...) soru devrikliği yapılmaz, düz cümle dizilimi ("the server rarely responds") kullanılır.',
        },
        {
          en: 'What makes this algorithm so efficient compared to traditional methods?',
          tr: 'Geleneksel yöntemlerle kıyaslandığında bu algoritmayı bu kadar verimli kılan şey nedir?',
          analysis: '"What" burada özne sorusudur; bu nedenle "What does make" değil, doğrudan 3. tekil şahıs "What makes" kullanılır.',
        },
      ],
    },
    drills: [
      {
        id: 'a1-1-d1',
        sentence: 'Neither the manager nor his assistant [_____] with the new budget restrictions.',
        sentenceTr: 'Ne müdür ne de asistanı yeni bütçe kısıtlamalarına katılıyor.',
        options: ['agrees', 'is agree', 'agree', 'does agrees'],
        correctAnswer: 'agrees',
        explanation: '"Neither A nor B" yapısında fiil kendisine yakın olan özneye ("his assistant" - tekil) uyar. Ayrıca "agree" fiil olduğu için "is agree" kesinlikle yanlıştır.',
        difficulty: 'expert',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-d2',
        sentence: 'Who [_____] the laboratory keys when the chief scientist is abroad?',
        sentenceTr: 'Baş bilim insanı yurt dışındayken laboratuvar anahtarlarını kim tutar?',
        options: ['keeps', 'does keep', 'is keeping', 'keep'],
        correctAnswer: 'keeps',
        explanation: '"Who" burada eylemi yapan kişiyi (özneyi) sorduğu için "does" yardımcı fiili kullanılmaz ve fiil 3. tekil şahıs (-s) alır.',
        difficulty: 'hard',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-d3',
        sentence: 'Our flight to Zurich [_____] at 06:45 tomorrow morning, so we need to wake up early.',
        sentenceTr: 'Zürih uçağımız yarın sabah 06:45\'te kalkıyor, bu yüzden erken uyanmamız gerekiyor.',
        options: ['departs', 'depart', 'is depart', 'does depart'],
        correctAnswer: 'departs',
        explanation: 'Uçuş, tren ve resmi zaman çizelgeleri (timetables) gelecekte gerçekleşecek olsa dahi Simple Present Tense ile ifade edilir.',
        difficulty: 'hard',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-d4',
        sentence: 'She [_____] late for morning briefings, because she values punctuality.',
        sentenceTr: 'Sabah toplantılarına nadiren geç kalır çünkü dakikliğe değer verir.',
        options: ['is seldom', 'seldom is', 'doesn\'t seldom', 'seldom be'],
        correctAnswer: 'is seldom',
        explanation: '"Late" bir sıfattır ("be late"). Sıklık zarfları (seldom, rarely, always) "to be" (am/is/are) fiilinden SONRA gelir.',
        difficulty: 'expert',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-d5',
        sentence: 'Why [_____] any logical solution to this recurring problem?',
        sentenceTr: 'Neden bu tekrarlayan soruna mantıklı bir çözümün yok?',
        options: ['don\'t you have', 'haven\'t you', 'aren\'t you have', 'doesn\'t you have'],
        correctAnswer: 'don\'t you have',
        explanation: 'Sahiplik bildiren "have" fiili Simple Present olumsuz sorularda "don\'t you have / doesn\'t he have" şeklinde çekimlenir.',
        difficulty: 'hard',
        sourceTopicId: 'a1-1',
      },
    ],
    listening: {
      id: 'a1-1-listen',
      title: 'Dr. Aris\'in Araştırma Rutini ve Gözlemleri',
      audioScript: 'Dr. Aris works at an observatory in northern Chile. Because the desert air rarely contains moisture, the telescopes capture extraordinarily clear images of distant galaxies. Every evening, the automated system calibrates the mirrors at sunset, and Dr. Aris analyzes the incoming data until dawn. He never drinks coffee after midnight, as it disrupts his focus.',
      audioScriptTr: 'Dr. Aris, Kuzey Şili\'deki bir gözlemevinde çalışır. Çöl havası nadiren nem içerdiğinden, teleskoplar uzak galaksilerin olağanüstü net görüntülerini yakalar. Her akşam otomatik sistem gün batımında aynaları kalibre eder ve Dr. Aris şafağa kadar gelen verileri analiz eder. Odaklanmasını bozduğu için gece yarısından sonra asla kahve içmez.',
      questions: [
        {
          id: 'a1-1-l1',
          question: 'Dinlediğiniz metne göre teleskopların çok net görüntü yakalamasının bilimsel nedeni nedir?',
          options: [
            'The desert air rarely contains moisture.',
            'Dr. Aris calibrates the mirrors manually at dawn.',
            'The observatory only operates once a month.',
            'He drinks coffee every midnight to stay awake.',
          ],
          correctAnswer: 'The desert air rarely contains moisture.',
          explanation: 'Metinde "Because the desert air rarely contains moisture..." (Çöl havası nadiren nem içerdiği için) ifadesiyle genel doğa gerçeği Simple Present ile açıklanmıştır.',
        },
        {
          id: 'a1-1-l2',
          question: 'Metindeki "He never drinks coffee after midnight" cümlesinde neden "doesn\'t" kullanılmamıştır?',
          options: [
            '"Never" zarfı cümleye zaten olumsuzluk kattığı için fiil olumlu (drinks) çekimlenir.',
            '"Drink" fiili durum fiili olduğu için yardımcı fiil almaz.',
            'Özne çoğul olduğu için "never" tek başına kullanılır.',
            'Geçmiş zaman anlamı taşıdığı için.',
          ],
          correctAnswer: '"Never" zarfı cümleye zaten olumsuzluk kattığı için fiil olumlu (drinks) çekimlenir.',
          explanation: 'İngilizcede çift olumsuzluk (double negative) standart gramerde kullanılmaz; "never" varken 3. tekil şahıs olumlu çekimi ("drinks") korunur.',
        },
      ],
    },
    reading: {
      id: 'a1-1-read',
      title: 'The Architecture of Habit and Circadian Rhythms',
      passage: 'Every living organism possesses an internal biological clock known as the circadian rhythm. This mechanism regulates hormone production, body temperature, and sleep cycles across a 24-hour period. When morning sunlight enters the human eye, the brain immediately suppresses melatonin and increases cortisol levels. Consequently, a person feels alert and ready for cognitive tasks.\n\nHowever, modern artificial lighting often confuses this ancient system. People who stare at bright screens late at night rarely achieve deep restorative sleep. What happens when someone consistently ignores their biological clock? Chronic fatigue develops, and concentration drops significantly during daytime hours.',
      passageTr: 'Her canlı organizma, sirkadiyen ritim olarak bilinen içsel bir biyolojik saate sahiptir. Bu mekanizma 24 saatlik bir periyot boyunca hormon üretimini, vücut sıcaklığını ve uyku döngülerini düzenler. Sabah güneş ışığı insan gözüne girdiğinde, beyin anında melatonini baskılar ve kortizol seviyelerini artırır. Sonuç olarak kişi kendini zinde ve bilişsel görevlere hazır hisseder.\n\nAncak modern yapay aydınlatma sıklıkla bu kadim sistemi yanıltır. Gece geç saatlerde parlak ekranlara bakan insanlar nadiren derin ve yenileyici uykuya ulaşır. Biri biyolojik saatini sürekli görmezden geldiğinde ne olur? Kronik yorgunluk gelişir ve gündüz saatlerinde konsantrasyon önemli ölçüde düşer.',
      highlightedStructures: ['possesses', 'regulates', 'suppresses', 'rarely achieve', 'What happens'],
      questions: [
        {
          id: 'a1-1-r1',
          question: 'Parçadaki "People who stare at bright screens late at night rarely achieve..." cümlesinde "achieve" fiilinin -s almamasının sebebi nedir?',
          options: [
            'Cümlenin asıl öznesi çoğul olan "People" kelimesidir ("night" değil).',
            '"Rarely" zarfından sonra fiiller her zaman yalın gelir.',
            '"Who" bağlacı cümleyi olumsuz yaptığı için.',
            '"At night" ifadesi geçmiş zaman bildirdiği için.',
          ],
          correctAnswer: 'Cümlenin asıl öznesi çoğul olan "People" kelimesidir ("night" değil).',
          explanation: 'Uzun öznelerde fiilden hemen önceki kelimeye ("night") aldanmamak gerekir; asıl özne "People" (çoğul) olduğu için fiil "achieve" olarak kalır.',
        },
        {
          id: 'a1-1-r2',
          question: 'Parçada geçen "What happens when someone consistently ignores..." sorusunda neden "What does happen" denmemiştir?',
          options: [
            'Çünkü "What" burada cümlenin öznesini soran bir Subject Question yapısıdır.',
            'Çünkü "happen" fiili durum (stative) fiilidir.',
            'Çünkü "when" bağlacı soru sormayı engeller.',
            'Çünkü cümle devrik bir emir cümlesidir.',
          ],
          correctAnswer: 'Çünkü "What" burada cümlenin öznesini soran bir Subject Question yapısıdır.',
          explanation: '"Ne olur?" sorusunda işi yapan/gerçekleşen şey "What" olduğu için özne sorusu kuralı geçerlidir ve "What happens" kullanılır.',
        },
      ],
    },
    writing: [
      {
        id: 'a1-1-w1',
        promptTr: 'Güneş doğudan doğar, ancak kardeşim öğleden önce nadiren uyanır.',
        instruction: 'Bilimsel gerçek + sıklık zarfı (rarely/seldom) + 3. tekil şahıs kurallarına dikkat ederek İngilizceye çevirin.',
        targetStructureHint: 'The sun rises... / my brother rarely wakes up...',
        sampleIdealAnswer: 'The sun rises in the east, but my brother rarely wakes up before noon.',
        requiredKeywords: ['rises', 'rarely'],
      },
      {
        id: 'a1-1-w2',
        promptTr: 'Bu karmaşık yazılım mimarisinin nasıl çalıştığını ekipte kim biliyor?',
        instruction: 'Özne sorusu (Who knows...) ve dolaylı soru dizilimi (how this complex software architecture works) kullanarak yazın.',
        targetStructureHint: 'Who knows how... works?',
        sampleIdealAnswer: 'Who knows how this complex software architecture works in the team?',
        requiredKeywords: ['who', 'knows', 'works'],
      },
    ],
    examQuestions: [
      {
        id: 'a1-1-e1',
        sentence: 'Every single employee in the international branches [_____] access to the encrypted database.',
        sentenceTr: 'Uluslararası şubelerdeki her bir çalışanın şifreli veritabanına erişimi vardır.',
        options: ['has', 'have', 'is having', 'does have'],
        correctAnswer: 'has',
        explanation: '"Every single + tekil isim" yapısı, araya çoğul bir edat öbeği ("in the international branches") girse bile her zaman TEKİL fiil ("has") alır!',
        difficulty: 'expert',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-e2',
        sentence: 'Can you tell me what time [_____] tomorrow morning?',
        sentenceTr: 'Yarın sabah ekspres trenin saat kaçta kalktığını bana söyleyebilir misin?',
        options: ['the express train leaves', 'does the express train leave', 'leaves the express train', 'is the express train leave'],
        correctAnswer: 'the express train leaves',
        explanation: 'Cümle "Can you tell me..." ile başladığı için devamındaki "what time..." kısmı bir Noun Clause (dolaylı soru) yapısıdır; bu yüzden "does" düşer ve düz cümle dizilimi ("the express train leaves") kullanılır.',
        difficulty: 'expert',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-e3',
        sentence: 'My colleague [_____] with the board\'s decision, although he rarely voices his objection publicly.',
        sentenceTr: 'Meslektaşım, itirazını toplum içinde nadiren dile getirse de yönetim kurulunun kararına katılmıyor.',
        options: ['does not agree', 'is not agree', 'not agrees', 'doesn\'t agrees'],
        correctAnswer: 'does not agree',
        explanation: '"Agree" fiildir; olumsuz çekimi "does not agree" şeklindedir. "Is not agree" Türkçeden birebir çeviri kaynaklı en yaygın hatadır.',
        difficulty: 'hard',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-e4',
        sentence: 'Which department [_____] the highest amount of energy in this facility?',
        sentenceTr: 'Bu tesiste hangi departman en yüksek miktarda enerji tüketiyor?',
        options: ['consumes', 'does consume', 'consume', 'is consume'],
        correctAnswer: 'consumes',
        explanation: '"Which department" burada doğrudan cümlenin öznesini sorar (Subject Question); bu yüzden "does" kullanılmaz ve fiil "consumes" olur.',
        difficulty: 'expert',
        sourceTopicId: 'a1-1',
      },
      {
        id: 'a1-1-e5',
        sentence: 'Physics [_____] my favorite academic discipline because it explains the fundamental laws of nature.',
        sentenceTr: 'Fizik benim en sevdiğim akademik disiplindir çünkü doğanın temel yasalarını açıklar.',
        options: ['is', 'are', 'does', 'have'],
        correctAnswer: 'is',
        explanation: 'Physics, mathematics, economics, linguistics gibi bilim adları "-s" ile bitmesine rağmen TEKİL isimdir ve "is" alır.',
        difficulty: 'hard',
        sourceTopicId: 'a1-1',
      },
    ],
  },

  'a1-2': {
    topicId: 'a1-2',
    lecture: {
      summary: 'Present Continuous Tense (am/is/are + V-ing) konuşma anındaki veya bu dönemdeki geçici eylemleri, değişen trendleri ve "always/constantly" ile şikayet edilen alışkanlıkları anlatır. Ancak bu konunun en üst düzey noktası, hem Durum (Stative) hem Eylem (Dynamic) anlamı taşıyan fiillerin (think, have, see, taste, smell, appear, weigh, look) anlam değişimidir.',
      formulas: [
        { type: 'Anlık / Geçici Eylem', formula: 'Subject + am / is / are + V-ing', example: 'The global economy is undergoing a rapid digital transformation.' },
        { type: 'Şikayet / Rahatsızlık', formula: 'Subject + am/is/are + always / constantly + V-ing', example: 'He is constantly interrupting his colleagues during technical reviews!' },
        { type: 'Stative vs. Dynamic', formula: 'I think (Bence - Durum) vs. I am thinking of (Düşünüyorum/Planlıyorum - Eylem)', example: 'I think this soup tastes great, so the chef is tasting it proudly.' },
      ],
      deepRules: [
        {
          title: '1. Çift Karakterli Fiiller (State vs. Action Verbs)',
          detail: '• THINK: "Sanmak/kanaatinde olmak" anlamında -> I think (Simple Present). "Üzerinde kafa yormak/planlamak" -> I am thinking of moving abroad.\n• SEE: "Görmek/anlamak" -> I see your point. "Biriyle görüşmek/randevulaşmak" -> I am seeing the dentist tomorrow.\n• TASTE / SMELL: "Tadı/kokusu ... olmak" -> The coffee smells wonderful. "Tadına bakmak/koklamak" -> She is smelling the roses.\n• HAVE: "Sahip olmak" -> He has a car. "Deneyimlemek (duş almak, yemek yemek, sorun yaşamak)" -> We are having lunch / having trouble.',
        },
        {
          title: '2. "Be + Being + Adjective" (Geçici Davranış Kalıbı)',
          detail: 'Normalde "be" durum fiilidir; ancak bir kişinin sadece O ANKİ yapmacık veya geçici davranışını anlatırken "am/is/are being + sıfat" kullanılır: "He is usually polite, but today he is being extremely rude." (Bugün kaba davranıyor).',
        },
      ],
      commonPitfalls: [
        {
          wrong: 'I am knowing the answer to this question.',
          right: 'I know the answer to this question.',
          why: 'Know, believe, understand, belong, own, consist of, contain, seem gibi zihinsel ve sahiplik fiilleri kesinlikle -ing almaz.',
        },
        {
          wrong: 'This sauce is tasting too salty.',
          right: 'This sauce tastes too salty.',
          why: 'Sos kendi kendine tadına bakamaz; sosun tadının tuzlu olması bir durumdur ("tastes"). Aşçı tadına bakıyorsa "The chef is tasting the sauce" denir.',
        },
      ],
      examples: [
        {
          en: 'Although she owns three apartments in Istanbul, she is currently staying at a hotel in Berlin.',
          tr: 'İstanbul\'da üç daireye sahip olmasına rağmen şu sıralar Berlin\'de bir otelde kalıyor.',
          analysis: '"Owns" kalıcı sahiplik (Stative -> Simple Present), "is staying" ise geçici durum (Temporary action -> Present Continuous).',
        },
        {
          en: 'Why are you being so defensive today? Usually you welcome constructive criticism.',
          tr: 'Bugün neden bu kadar savunmacı davranıyorsun? Normalde yapıcı eleştiriyi memnuniyetle karşılarsın.',
          analysis: '"Are you being defensive" o anki geçici tavrı, "usually welcome" ise genel karakteri ifade eder.',
        },
      ],
    },
    drills: [
      {
        id: 'a1-2-d1',
        sentence: 'The head chef [_____] the risotto right now to check whether it [_____] more parmesan.',
        sentenceTr: 'Baş aşçı şu anda daha fazla parmesana ihtiyacı olup olmadığını kontrol etmek için risottonun tadına bakıyor.',
        options: ['is tasting / needs', 'tastes / is needing', 'is tasting / is needing', 'tastes / needs'],
        correctAnswer: 'is tasting / needs',
        explanation: 'Aşçının tadına bakması fiziksel bir eylemdir ("is tasting"), ancak "need" (ihtiyaç duymak) bir durum fiilidir ve asla "-ing" almaz ("needs").',
        difficulty: 'expert',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-d2',
        sentence: 'I [_____] what you mean, even though I [_____] the legal advisor this afternoon to clarify the details.',
        sentenceTr: 'Detayları netleştirmek için bu öğleden sonra hukuk danışmanıyla görüşecek olsam da ne demek istediğini anlıyorum.',
        options: ['see / am seeing', 'am seeing / see', 'see / see', 'am seeing / am seeing'],
        correctAnswer: 'see / am seeing',
        explanation: 'İlk boşlukta "see" = anlamak (stative -> see). İkinci boşlukta "see" = biriyle randevulaşıp görüşmek (action/future arrangement -> am seeing).',
        difficulty: 'expert',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-d3',
        sentence: 'You [_____] your keys in the office! It is becoming really frustrating.',
        sentenceTr: 'Sürekli anahtarlarını ofiste unutuyorsun! Bu gerçekten sinir bozucu olmaya başlıyor.',
        options: ['are constantly forgetting', 'constantly forget', 'forget constantly', 'are forget'],
        correctAnswer: 'are constantly forgetting',
        explanation: 'Rahatsızlık ve şikayet bildiren tekrarlanan alışkanlıklarda "be + always/constantly/forever + V-ing" yapısı kullanılır.',
        difficulty: 'hard',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-d4',
        sentence: 'This antique box [_____] nearly twenty kilograms and [_____] rare manuscripts.',
        sentenceTr: 'Bu antika kutu neredeyse yirmi kilogram ağırlığında ve nadir el yazmaları içeriyor.',
        options: ['weighs / contains', 'is weighing / is containing', 'weighs / is containing', 'is weighing / contains'],
        correctAnswer: 'weighs / contains',
        explanation: 'Bir nesnenin ağırlığının olması ("weighs") ve bir şeyi içermesi ("contains") tamamen durum (stative) fiilleridir.',
        difficulty: 'hard',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-d5',
        sentence: 'Normally David is very generous, so I don\'t understand why he [_____] so selfishly about this project.',
        sentenceTr: 'Normalde David çok cömerttir, bu yüzden bu proje konusunda neden bu kadar bencilce davrandığını anlamıyorum.',
        options: ['is behaving', 'behaves', 'does behave', 'is knowing'],
        correctAnswer: 'is behaving',
        explanation: 'Normal karakterinden farklı olarak sadece "şu dönemde / bugün" sergilenen geçici davranışlar Present Continuous ile anlatılır.',
        difficulty: 'hard',
        sourceTopicId: 'a1-2',
      },
    ],
    listening: {
      id: 'a1-2-listen',
      title: 'Canlı Stüdyo Bağlantısı: Şehir İçi Dönüşüm',
      audioScript: 'Good morning from downtown! Right now, municipal engineers are testing the new autonomous tram line while commuters are watching from the platform. Although the system still belongs to the testing authority, the mayor thinks it will reduce traffic congestion by thirty percent. Look! The lead engineer is weighing the safety sensors before the next trial run begins.',
      audioScriptTr: 'Şehir merkezinden günaydın! Şu anda belediye mühendisleri yeni otonom tramvay hattını test ederken, yolcular perondan izliyor. Sistem hâlâ test kurumuna ait olsa da belediye başkanı bunun trafik sıkışıklığını yüzde otuz azaltacağını düşünüyor. Bakın! Başmühendis bir sonraki deneme sürüşü başlamadan önce güvenlik sensörlerini tartıyor.',
      questions: [
        {
          id: 'a1-2-l1',
          question: 'Dinlediğiniz metinde "weigh" fiili neden "is weighing" olarak kullanılmıştır?',
          options: [
            'Çünkü mühendis o anda fiziksel olarak sensörleri tartma eylemini gerçekleştirmektedir.',
            'Çünkü sensörlerin kendi ağırlığı anlatılmaktadır.',
            '"Weigh" fiili hiçbir zaman Simple Present ile kullanılmaz.',
            'Gelecek zaman anlamı taşıdığı için.',
          ],
          correctAnswer: 'Çünkü mühendis o anda fiziksel olarak sensörleri tartma eylemini gerçekleştirmektedir.',
          explanation: '"Weigh" bir nesnenin ağırlığını belirtirken Stative (It weighs 5 kg), bir şeyi tartma eyleminde ise Dynamic (He is weighing the sensors) olur.',
        },
        {
          id: 'a1-2-l2',
          question: 'Metindeki hangi iki fiil konuşma anında gerçekleşmesine rağmen "-ing" ALMADAN kullanılmıştır?',
          options: [
            'belongs ve thinks',
            'testing ve watching',
            'begins ve weighing',
            'watching ve belongs',
          ],
          correctAnswer: 'belongs ve thinks',
          explanation: '"Belong" (ait olmak) ve kanaat bildiren "think" (düşünmek/sanmak) durum fiilleri oldukları için Simple Present ile çekimlenmiştir.',
        },
      ],
    },
    reading: {
      id: 'a1-2-read',
      title: 'Shifting Paradigms in Remote Work',
      passage: 'Across the globe, corporate culture is changing at an unprecedented pace. While traditional executives still believe that physical presence guarantees productivity, younger professionals are increasingly demanding flexible schedules. Many technology firms are currently downsizing their central offices and investing in cloud infrastructure instead.\n\nAt this very moment, our research team is evaluating five hundred companies that are transitioning to hybrid models. The preliminary data looks promising: employees report higher satisfaction, even though some managers are still having difficulty adapting to asynchronous communication.',
      passageTr: 'Dünya genelinde kurumsal kültür eşi benzeri görülmemiş bir hızla değişiyor. Geleneksel yöneticiler hâlâ fiziksel varlığın verimliliği garanti ettiğine inanırken, genç profesyoneller giderek daha fazla esnek çalışma saatleri talep ediyor. Birçok teknoloji firması şu sıralar merkez ofislerini küçültüyor ve bunun yerine bulut altyapısına yatırım yapıyor.\n\nTam şu anda araştırma ekibimiz hibrit modele geçiş yapan beş yüz şirketi değerlendiriyor. Ön veriler umut verici görünüyor: bazı yöneticiler asenkron iletişime uyum sağlamakta hâlâ zorluk yaşıyor olsa da çalışanlar daha yüksek memnuniyet bildiriyor.',
      highlightedStructures: ['is changing', 'still believe', 'are increasingly demanding', 'looks promising', 'are still having difficulty'],
      questions: [
        {
          id: 'a1-2-r1',
          question: 'Parçada "The preliminary data looks promising" cümlesinde neden "is looking" yerine "looks" tercih edilmiştir?',
          options: [
            'Çünkü "look" burada "bakmak" eylemi değil, "... gibi görünmek" (durum/izlenim) anlamındadır.',
            'Çünkü "data" kelimesi her zaman geçmiş zamanla kullanılır.',
            'Çünkü cümlede sıklık zarfı bulunmaktadır.',
            'Çünkü resmi metinlerde Present Continuous yasaktır.',
          ],
          correctAnswer: 'Çünkü "look" burada "bakmak" eylemi değil, "... gibi görünmek" (durum/izlenim) anlamındadır.',
          explanation: 'Bağlaç/durum fiili (linking verb) olarak "... gibi görünmek" anlamındaki "look", Stative kabul edilir ve Simple Present alır.',
        },
        {
          id: 'a1-2-r2',
          question: 'Parçadaki "...some managers are still having difficulty" ifadesinde "have" neden "-ing" alabilmiştir?',
          options: [
            'Çünkü "have difficulty" sahiplik değil, "zorluk çekmek/deneyimlemek" anlamında bir eylem kalıbıdır.',
            'Çünkü "managers" çoğul bir öznedir.',
            'Çünkü "still" zarfı tüm durum fiillerini eylem fiiline dönüştürür.',
            'Çünkü cümle edilgen (passive) yapıdadır.',
          ],
          correctAnswer: 'Çünkü "have difficulty" sahiplik değil, "zorluk çekmek/deneyimlemek" anlamında bir eylem kalıbıdır.',
          explanation: '"Have" sahiplik bildirirken -ing almaz (I have a car), ancak "have trouble / have difficulty / have dinner / have a meeting" gibi deneyim ifadelerinde -ing alır.',
        },
      ],
    },
    writing: [
      {
        id: 'a1-2-w1',
        promptTr: 'Yurt dışına taşınmayı düşünüyorum ama bunun kolay bir karar olduğunu düşünmüyorum.',
        instruction: '"Think" fiilinin hem eylem (am thinking of) hem durum (don\'t think) kullanımını tek cümlede gösterin.',
        targetStructureHint: 'I am thinking of moving... / I do not think...',
        sampleIdealAnswer: 'I am thinking of moving abroad, but I do not think that it is an easy decision.',
        requiredKeywords: ['thinking', 'think'],
      },
      {
        id: 'a1-2-w2',
        promptTr: 'Çorbanın tadı harika geliyor, bu yüzden aşçı şu an onu tekrar tatmıyor.',
        instruction: '"Taste" fiilinin durum (tastes) ve eylem (is not tasting) farkını kullanarak yazın.',
        targetStructureHint: 'The soup tastes... / is not tasting...',
        sampleIdealAnswer: 'The soup tastes wonderful, so the chef is not tasting it again right now.',
        requiredKeywords: ['tastes', 'tasting'],
      },
    ],
    examQuestions: [
      {
        id: 'a1-2-e1',
        sentence: 'I [_____] that our competitors [_____] a new artificial intelligence chip this quarter.',
        sentenceTr: 'Rakiplerimizin bu çeyrekte yeni bir yapay zeka çipi geliştirdiğine inanıyorum.',
        options: ['believe / are developing', 'am believing / develop', 'believe / develop', 'am believing / are developing'],
        correctAnswer: 'believe / are developing',
        explanation: '"Believe" zihinsel bir durum fiilidir (-ing almaz); "this quarter" (bu çeyrekte devam eden geçici proje) ise Present Continuous ("are developing") gerektirir.',
        difficulty: 'expert',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-e2',
        sentence: 'Why [_____] the fabric so carefully? Because it [_____] like pure silk, and I want to be sure.',
        sentenceTr: 'Kumaşa neden bu kadar dikkatli dokunuyorsun? Çünkü saf ipek gibi hissettiriyor ve emin olmak istiyorum.',
        options: ['are you feeling / feels', 'do you feel / is feeling', 'are you feeling / is feeling', 'do you feel / feels'],
        correctAnswer: 'are you feeling / feels',
        explanation: 'Kumaşa elle dokunmak/yoklamak fiziksel eylemdir ("are you feeling"), kumaşın dokusunun ipek gibi hissettirmesi ise nesnenin özelliğidir/durumdur ("feels").',
        difficulty: 'expert',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-e3',
        sentence: 'Normally our server [_____] smoothly, but today we [_____] serious latency issues.',
        sentenceTr: 'Normalde sunucumuz sorunsuz çalışır, ancak bugün ciddi gecikme sorunları yaşıyoruz.',
        options: ['runs / are having', 'is running / have', 'runs / have', 'is running / are having'],
        correctAnswer: 'runs / are having',
        explanation: 'Genel çalışma düzeni Simple Present ("runs"), bugün yaşanan geçici deneyim ise "have issues" -> "are having" ile ifade edilir.',
        difficulty: 'hard',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-e4',
        sentence: 'The new parliamentary bill [_____] of twelve chapters and [_____] strict environmental penalties.',
        sentenceTr: 'Yeni parlamento yasa tasarısı on iki bölümden oluşuyor ve katı çevre cezaları içeriyor.',
        options: ['consists / includes', 'is consisting / is including', 'consists / is including', 'is consisting / includes'],
        correctAnswer: 'consists / includes',
        explanation: '"Consist of" (...-den oluşmak) ve "include" (içermek) kesin durum fiilleridir; konuşma anında bile Present Continuous almazlar.',
        difficulty: 'expert',
        sourceTopicId: 'a1-2',
      },
      {
        id: 'a1-2-e5',
        sentence: 'Little Leo is usually very calm, so why [_____] so impatiently in the waiting room right now?',
        sentenceTr: 'Küçük Leo normalde çok sakindir, öyleyse şu anda bekleme odasında neden bu kadar sabırsız davranıyor?',
        options: ['is he acting', 'does he act', 'he is acting', 'acts he'],
        correctAnswer: 'is he acting',
        explanation: 'O anki geçici davranış ("right now") soru formunda "why is he acting" olarak kurulur.',
        difficulty: 'hard',
        sourceTopicId: 'a1-2',
      },
    ],
  },
};

// Herhangi bir gramer konusu için dinamik ve yüksek zorluklu içerik üreten yardımcı fonksiyon
export function getOrBuildTopicContent(nodeId: string): GrammarTopicContent {
  if (SEED_GRAMMAR_CONTENTS[nodeId]) {
    return SEED_GRAMMAR_CONTENTS[nodeId];
  }

  const node = GRAMMAR_CURRICULUM.find(n => n.id === nodeId) || GRAMMAR_CURRICULUM[0];

  // Eğer ALL_DEEP_GUIDES içinde bu konuya ait zengin kılavuz varsa doğrudan topic-spesifik içerik üret
  if (ALL_DEEP_GUIDES[node.id]) {
    return buildTopicContentFromGuide(node.id, ALL_DEEP_GUIDES[node.id], node.title, node.level);
  }

  // Checkpoint düğümü ise kapsadığı tüm konuların sınav ve alıştırma sorularını birleştirip zorlu bir kümülatif paket oluştur!
  if (node.type === 'checkpoint' && node.coveredTopicIds) {
    const combinedExams: GrammarDrillQuestion[] = [];
    node.coveredTopicIds.forEach((tid) => {
      const tc = getOrBuildTopicContent(tid);
      combinedExams.push(...tc.examQuestions, ...tc.drills.slice(0, 2));
    });

    return {
      topicId: node.id,
      lecture: {
        summary: `${node.title}: Bu kümülatif tarama sınavı, şimdiye kadar tamamladığınız ${node.coveredTopicIds.length} gramer konusunun (${node.coveredTopicIds.join(', ').toUpperCase()}) tamamını tek bir yüksek zorluklu sınavda birleştirir. Bir sonraki kilidi açmak için en az 80/100 puan almalısınız.`,
        formulas: [
          { type: 'Kapsam', formula: `${node.coveredTopicIds.length} Geçmiş Konu Sentezi`, example: 'Tüm önceki zamanlar, bağlaçlar ve yapısal kurallar bir arada test edilir.' },
        ],
        deepRules: [
          { title: 'Kümülatif Değerlendirme Kuralı', detail: 'Sorular geçmiş konuların tamamından karma olarak seçilir ve Gemini AI ile yeni çapraz sorular üretilerek veritabanına eklenir.' },
        ],
        commonPitfalls: [],
        examples: [],
      },
      drills: combinedExams.slice(0, 8),
      listening: SEED_GRAMMAR_CONTENTS['a1-1'].listening,
      reading: SEED_GRAMMAR_CONTENTS['a1-1'].reading,
      writing: SEED_GRAMMAR_CONTENTS['a1-1'].writing,
      examQuestions: combinedExams,
    };
  }

  // Diğer konular için seviyeye uygun yüksek zorluklu temel yapı (ve Gemini AI ile zenginleştirilebilir)
  return {
    topicId: node.id,
    lecture: {
      summary: `${node.title} (${node.level}): ${node.subtitle}. Bu modülde ileri düzey yapısal kuralları, akademik istisnaları ve sınav tuzaklarını derinlemesine inceleyeceksiniz. İsterseniz "Gemini AI ile Zenginleştir" butonuna dokunarak bu konuya özel yeni akademik örnekler ve sorular üretip veritabanına kaydedebilirsiniz.`,
      formulas: [
        { type: 'Temel Yapı', formula: `${node.title} — Standart & Akademik Kalıp`, example: `In advanced ${node.level} contexts, mastering "${node.title}" is crucial for precision.` },
        { type: 'İstisna / İleri Kalıp', formula: `Bağlaç + Yardımcı Fiil + Özne Uyumu`, example: `Had the team analyzed the structure earlier, the outcome would have been different.` },
      ],
      deepRules: [
        {
          title: `1. ${node.title} — Temel ve İleri Kullanım Farkı`,
          detail: `${node.subtitle} kapsamında cümlenin zaman uyumu (tense agreement), özne-yüklem uyumu ve yan cümlecik (clause) bağlaçları bir bütün olarak değerlendirilmelidir.`,
        },
        {
          title: '2. Akademik Metinlerde ve Sınavlarda Çeldirici Noktalar',
          detail: 'Özellikle zaman zarfları, devrik yapılar veya edilgen-etken geçişlerinde fiilin aldığı şekil bağlama göre değişir.',
        },
      ],
      commonPitfalls: [
        {
          wrong: 'Türkçe düşünerek bağlaçtan sonra yanlış zaman/kip kullanmak.',
          right: `${node.title} kurallarına uygun zaman ve kip uyumu sağlamak.`,
          why: 'İngilizcede yan cümle bağlaçları ana cümlenin zamanıyla sıkı bir matematiksel uyum içindedir.',
        },
      ],
      examples: [
        {
          en: `Having mastered the core principles of ${node.title}, the researchers published their findings in an international journal.`,
          tr: `${node.title} konusunun temel ilkelerinde ustalaşan araştırmacılar, bulgularını uluslararası bir dergide yayımladılar.`,
          analysis: `${node.level} seviyesinde bağlamsal ve akademik kullanım örneği.`,
        },
      ],
    },
    drills: [
      {
        id: `${node.id}-d1`,
        sentence: `By the time the international delegation arrives, the committee [_____] all clauses related to ${node.title}.`,
        sentenceTr: `Uluslararası heyet vardığında, komite bu konuyla ilgili tüm maddeleri gözden geçirmiş olacak.`,
        options: ['will have reviewed', 'reviews', 'has reviewed', 'would review'],
        correctAnswer: 'will have reviewed',
        explanation: 'Gelecekteki bir referans noktasından önce tamamlanmış olacak eylemler "will have + V3" ile ifade edilir.',
        difficulty: 'expert',
        sourceTopicId: node.id,
      },
      {
        id: `${node.id}-d2`,
        sentence: `Scarcely [_____] the new protocol when unexpected technical anomalies emerged in the main server.`,
        sentenceTr: `Yeni protokolü henüz uygulamaya koymuşlardı ki ana sunucuda beklenmedik teknik anormallikler ortaya çıktı.`,
        options: ['had they implemented', 'they had implemented', 'did they implemented', 'have they implement'],
        correctAnswer: 'had they implemented',
        explanation: '"Scarcely / Hardly ... when" cümle başında kullanıldığında Past Perfect devrik yapı ("had + subject + V3") zorunludur.',
        difficulty: 'expert',
        sourceTopicId: node.id,
      },
      {
        id: `${node.id}-d3`,
        sentence: `The legal advisor insisted that every single contractor [_____] the confidentiality agreement before Friday.`,
        sentenceTr: `Hukuk danışmanı, her bir yüklenicinin cuma gününden önce gizlilik sözleşmesini imzalaması konusunda ısrar etti.`,
        options: ['sign', 'signs', 'signed', 'is signing'],
        correctAnswer: 'sign',
        explanation: '"Insist, demand, suggest, recommend that..." yapılarından sonra Subjunctive Mood gereği tüm öznelerle yalın fiil ("sign") kullanılır.',
        difficulty: 'expert',
        sourceTopicId: node.id,
      },
    ],
    listening: {
      id: `${node.id}-listen`,
      title: `${node.title} — Akademik Dinleme Analizi`,
      audioScript: `During the annual symposium on linguistics, professors emphasized how structural accuracy transforms communication. When speakers apply ${node.title} with precision, complex arguments become clear and persuasive. Conversely, neglecting subtle grammatical distinctions often leads to costly misunderstandings in international negotiations.`,
      audioScriptTr: `Yıllık dilbilim sempozyumu sırasında profesörler, yapısal doğruluğun iletişimi nasıl dönüştürdüğünü vurguladılar. Konuşmacılar ${node.title} kurallarını hassasiyetle uyguladıklarında, karmaşık argümanlar net ve ikna edici hale gelir. Aksi takdirde ince gramer ayrımlarını göz ardı etmek uluslararası müzakerelerde sıklıkla maliyetli yanlış anlaşılmalara yol açar.`,
      questions: [
        {
          id: `${node.id}-l1`,
          question: 'Dinlediğiniz parçaya göre uluslararası müzakerelerde maliyetli yanlış anlaşılmalara yol açan temel etken nedir?',
          options: [
            'Neglecting subtle grammatical distinctions',
            'Speaking too slowly during symposia',
            'Using too many visual slides',
            'Avoiding international negotiations altogether',
          ],
          correctAnswer: 'Neglecting subtle grammatical distinctions',
          explanation: 'Parçanın son cümlesinde "neglecting subtle grammatical distinctions often leads to costly misunderstandings" ifadesi yer almaktadır.',
        },
      ],
    },
    reading: {
      id: `${node.id}-read`,
      title: `Mastering ${node.title} in Real-World Contexts`,
      passage: `Precision in language is not merely an academic exercise; it is the foundation of clear thought. In high-stakes environments such as aviation, diplomacy, and software engineering, a single ambiguous tense or misplaced modifier can alter the entire meaning of a directive.\n\nConsider how ${node.title} operates within complex discourse. Writers who command these structures effortlessly guide their readers through cause, effect, hypothesis, and chronology without confusion.`,
      passageTr: `Dilde kesinlik yalnızca akademik bir egzersiz değildir; berrak düşüncenin temelidir. Havacılık, diplomasi ve yazılım mühendisliği gibi yüksek riskli ortamlarda, tek bir belirsiz zaman kipi veya yanlış yerleştirilmiş bir niteleyici, bir talimatın tüm anlamını değiştirebilir.\n\n${node.title} yapısının karmaşık söylem içinde nasıl işlediğini düşünün. Bu yapılara zahmetsizce hâkim olan yazarlar, okuyucularını neden, sonuç, hipotez ve kronoloji boyunca kafa karışıklığı olmadan yönlendirir.`,
      highlightedStructures: ['is not merely', 'can alter', 'command', 'guide'],
      questions: [
        {
          id: `${node.id}-r1`,
          question: 'Metne göre havacılık ve diplomasi gibi alanlarda tek bir belirsiz gramer yapısının sonucu ne olabilir?',
          options: [
            'It can alter the entire meaning of a directive.',
            'It makes the text shorter and easier to read.',
            'It has no impact on professional communication.',
            'It only affects casual conversations.',
          ],
          correctAnswer: 'It can alter the entire meaning of a directive.',
          explanation: 'İlk paragrafta belirtildiği üzere, tek bir belirsiz yapı talimatın tüm anlamını değiştirebilir.',
        },
      ],
    },
    writing: [
      {
        id: `${node.id}-w1`,
        promptTr: `Eğer ekip verileri zamanında analiz etmiş olsaydı, şu an bu krizle uğraşıyor olmazdık.`,
        instruction: `${node.level} seviyesine uygun güçlü bir gramer kurgusuyla İngilizceye çevirin.`,
        targetStructureHint: 'Had the team analyzed... / If the team had analyzed..., we would not be dealing with...',
        sampleIdealAnswer: 'If the team had analyzed the data on time, we would not be dealing with this crisis right now.',
        requiredKeywords: ['had', 'would'],
      },
    ],
    examQuestions: [
      ...SEED_GRAMMAR_CONTENTS['a1-1'].examQuestions.slice(0, 3),
      ...SEED_GRAMMAR_CONTENTS['a1-2'].examQuestions.slice(0, 3),
    ],
  };
}

