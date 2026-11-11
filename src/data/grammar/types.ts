export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface GrammarExample {
  en: string;
  tr: string;
  analysis: string;
}

export interface GrammarDrillQuestion {
  id: string;
  sentence: string;
  sentenceTr: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'hard' | 'expert';
  sourceTopicId?: string;
}

export interface GrammarListeningTask {
  id: string;
  title: string;
  audioScript: string;
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
  promptTr: string;
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
  passingScore: number;
  coveredTopicIds?: string[];
}

export interface DeepGrammarGuide {
  nodeId: string;
  overviewTr: string;
  timelineVisual: string;
  conjugationRows: {
    formType: string;
    subject: string;
    formula: string;
    exampleEn: string;
    exampleTr: string;
  }[];
  detailedRuleBlocks: {
    badge: string;
    title: string;
    explanationTr: string;
    formula: string;
    examples: { en: string; tr: string; note: string }[];
  }[];
  spellingAndEdgeCases: {
    rule: string;
    examples: string;
    noteTr: string;
  }[];
  signalWords: {
    word: string;
    meaningTr: string;
    positionRule: string;
    sampleEn: string;
  }[];
  turkishTraps: {
    wrong: string;
    right: string;
    whyTr: string;
  }[];
}

