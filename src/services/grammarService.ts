import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GRAMMAR_CURRICULUM,
  GrammarCurriculumNode,
  GrammarTopicContent,
  GrammarUserProgress,
  GrammarWritingTask,
  getOrBuildTopicContent,
  CefrLevel,
} from '../data/grammarCurriculum';
import { LessonStep, SEED_LESSONS, buildLessonFromContent } from '../data/grammarLessons';
import {
  ExerciseKind,
  GrammarPoolQuestion,
  DeepGrammarGuide,
  getDeepGrammarGuide,
  build50QuestionsForNode,
} from '../data/grammarPool';
import { dbService } from './db';
import { authService } from './auth';
import { WordItem } from '../data/words';

const GRAMMAR_PROGRESS_KEY = '@lingo_grammar_progress_v1';
const GRAMMAR_CUSTOM_KEY = '@lingo_grammar_custom_v1';
const GRAMMAR_POOL_CACHE_KEY = '@lingo_grammar_pool_cache_v1';

export interface WritingEvaluationResult {
  score: number;
  passed: boolean;
  correctedSentence: string;
  feedbackTr: string;
  grammarAnalysis: string;
  isAiEvaluated: boolean;
}

class GrammarService {
  // Kullanıcının gramer ilerlemesini ve veritabanındaki Gemini içeriklerini getir
  async getGrammarState(): Promise<{
    progress: GrammarUserProgress;
    customContents: Record<string, any>;
  }> {
    let localProgress: GrammarUserProgress = { completedNodeIds: [], nodeScores: {} };
    let localCustom: Record<string, any> = {};

    try {
      const pStr = await AsyncStorage.getItem(GRAMMAR_PROGRESS_KEY);
      if (pStr) localProgress = JSON.parse(pStr);
      const cStr = await AsyncStorage.getItem(GRAMMAR_CUSTOM_KEY);
      if (cStr) localCustom = JSON.parse(cStr);
    } catch {}

    try {
      const res = await dbService.api('/api/grammar/state');
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          const mergedCompleted = Array.from(
            new Set([...(localProgress.completedNodeIds || []), ...(data.progress.completedNodeIds || [])])
          );
          localProgress = {
            completedNodeIds: mergedCompleted,
            nodeScores: { ...(localProgress.nodeScores || {}), ...(data.progress.nodeScores || {}) },
          };
          await AsyncStorage.setItem(GRAMMAR_PROGRESS_KEY, JSON.stringify(localProgress));
        }
        if (data.customContents) {
          localCustom = { ...localCustom, ...data.customContents };
          await AsyncStorage.setItem(GRAMMAR_CUSTOM_KEY, JSON.stringify(localCustom));
        }
      }
    } catch {}

    return { progress: localProgress, customContents: localCustom };
  }

  // Bir düğümün (Konu veya Kümülatif Sınav) kilidinin açık olup olmadığını kontrol et
  isNodeUnlocked(node: GrammarCurriculumNode, progress: GrammarUserProgress): boolean {
    if (node.orderIndex === 1) return true;
    const prevNode = GRAMMAR_CURRICULUM.find(n => n.orderIndex === node.orderIndex - 1);
    if (!prevNode) return true;
    return progress.completedNodeIds.includes(prevNode.id);
  }

  // Konu içeriğini (Tohum + Veritabanındaki Gemini Üretimleri) birleştirerek getir
  async getFullTopicContent(nodeId: string): Promise<GrammarTopicContent> {
    const base = getOrBuildTopicContent(nodeId);
    const { customContents } = await this.getGrammarState();
    const custom = customContents[nodeId];

    if (!custom) return base;

    return {
      ...base,
      lecture: {
        ...base.lecture,
        deepRules: [...base.lecture.deepRules, ...(custom.deepRules || [])],
        examples: [...base.lecture.examples, ...(custom.examples || [])],
      },
      drills: [...(custom.drills || []), ...base.drills],
      listening: custom.listening || base.listening,
      reading: custom.reading || base.reading,
      writing: [...(custom.writing || []), ...base.writing],
      examQuestions: [...(custom.examQuestions || []), ...base.examQuestions],
    };
  }

  // Adım Adım İnteraktif Öğretim Akışını (LessonStep[]) getir
  async getLessonSteps(node: GrammarCurriculumNode): Promise<any[]> {
    const fullContent = await this.getFullTopicContent(node.id);
    const { customContents } = await this.getGrammarState();
    const custom = customContents[node.id];
    const customSteps: any[] = Array.isArray(custom?.lessonSteps) ? custom.lessonSteps : [];

    // a1-1 gibi el işçiliğiyle hazırlanmış 24 adımlık özel müfredat varsa onu temel al
    let baseSteps: any[];
    if (SEED_LESSONS[node.id]) {
      baseSteps = [...SEED_LESSONS[node.id]];
    } else {
      baseSteps = buildLessonFromContent(fullContent, node.title);
    }

    let combined: any[];
    if (customSteps.length > 0) {
      const last = baseSteps[baseSteps.length - 1];
      if (last && last.kind === 'summary') {
        combined = [...baseSteps.slice(0, -1), ...customSteps, last];
      } else {
        combined = [...baseSteps, ...customSteps];
      }
    } else {
      combined = baseSteps;
    }

    return combined.map((s, idx) => {
      const id = s.id || `${node.id}-step-${idx + 1}`;
      if (s.kind === 'teach') {
        return {
          ...s,
          id,
          explanationTr: s.explanationTr || s.body || '',
          tipTr: s.tipTr || s.tip || '',
          bullets: s.bullets || [],
        };
      }
      if (s.kind === 'example') {
        return {
          ...s,
          id,
          title: s.title || 'Öğretilen Kuralın Örnekleri',
          contextTr: s.contextTr || 'Aşağıdaki örnek cümleyi ve yapı analizini inceleyin:',
          examples: Array.isArray(s.examples)
            ? s.examples
            : [
                {
                  en: s.en || '',
                  tr: s.tr || '',
                  highlight: s.title || node.level,
                  noteTr: s.analysis || '',
                },
              ],
        };
      }
      if (s.kind === 'check') {
        return {
          ...s,
          id,
          title: s.title || 'Öğrendiğini Hemen Test Et',
          sentence: s.sentence || s.question || '',
          sentenceTr: s.sentenceTr || s.question || '',
          explanationTr: s.explanationTr || s.explanation || '',
        };
      }
      if (s.kind === 'listen') {
        return {
          ...s,
          id,
          title: s.title || 'Dinle ve Yapıyı Yakala',
          audioText: s.audioText || s.audioScript || '',
          audioTr: s.audioTr || s.audioScriptTr || '',
          explanationTr: s.explanationTr || s.explanation || '',
        };
      }
      if (s.kind === 'read') {
        return {
          ...s,
          id,
          title: s.title || 'Okuma Parçası & Analiz',
          passageEn: s.passageEn || s.passage || '',
          passageTr: s.passageTr || '',
          highlightedStructures: s.highlightedStructures || [node.title],
          explanationTr: s.explanationTr || s.explanation || '',
        };
      }
      if (s.kind === 'write') {
        return {
          ...s,
          id,
          title: s.title || 'Cümle Üretimi (Writing)',
          instructionTr: s.instructionTr || s.instruction || '',
          targetHint: s.targetHint || s.hint || '',
          idealAnswer: s.idealAnswer || s.sampleIdealAnswer || '',
          requiredKeywords: s.requiredKeywords || [],
        };
      }
      if (s.kind === 'summary') {
        return {
          ...s,
          id,
          title: s.title || `${node.title} — Özet`,
          keyPoints: s.keyPoints || s.points || [],
          nextActionText:
            s.nextActionText ||
            'Tebrikler! Adım adım ders anlatımını tamamladınız. Şimdi 80+ Bölüm Sonu Sınavına geçebilirsiniz!',
        };
      }
      return { ...s, id };
    });
  }

  // Bölüm veya Sınav skorunu kaydet (Bölüm Sonu Sınavında >= 80 ise kilidi aç + Başarımları kontrol et!)
  async recordScore(params: {
    nodeId: string;
    examScore?: number;
    sectionType?: 'drills' | 'listening' | 'reading' | 'writing';
    sectionScore?: number;
  }): Promise<GrammarUserProgress> {
    const { nodeId, examScore, sectionType, sectionScore } = params;
    const { progress } = await this.getGrammarState();

    const prev = progress.nodeScores[nodeId] || {
      bestExamScore: 0,
      attempts: 0,
      passed: false,
      updatedAt: new Date().toISOString(),
    };

    const newBestExam = typeof examScore === 'number' ? Math.max(prev.bestExamScore || 0, examScore) : prev.bestExamScore;
    const passed = Boolean(prev.passed || (typeof examScore === 'number' && examScore >= 80));

    const updatedScore = {
      ...prev,
      bestExamScore: newBestExam,
      attempts: prev.attempts + 1,
      passed,
      updatedAt: new Date().toISOString(),
    };

    if (sectionType && typeof sectionScore === 'number') {
      (updatedScore as any)[`${sectionType}Score`] = Math.max((prev as any)[`${sectionType}Score`] || 0, sectionScore);
    }

    progress.nodeScores[nodeId] = updatedScore;
    if (passed && !progress.completedNodeIds.includes(nodeId)) {
      progress.completedNodeIds.push(nodeId);
    }

    await AsyncStorage.setItem(GRAMMAR_PROGRESS_KEY, JSON.stringify(progress));

    try {
      const res = await dbService.api('/api/grammar/progress', {
        method: 'POST',
        body: JSON.stringify({ nodeId, examScore, sectionType, sectionScore, passed }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.newAchievements) authService.emitAchievements(d.newAchievements);
      }
    } catch {}

    return progress;
  }

  // Gemini AI ile Adım Adım Yeni Ders Adımları + Sınav Soruları Üret ve Veritabanına Kaydet
  async generateAndSaveWithGemini(node: GrammarCurriculumNode): Promise<{
    addedSteps: number;
    addedDrills: number;
    addedExams: number;
    isAi: boolean;
  }> {
    const apiKey = await dbService.getGeminiApiKey();
    const isCheckpoint = node.type === 'checkpoint';
    const coveredTitles = isCheckpoint && node.coveredTopicIds
      ? node.coveredTopicIds.map(id => GRAMMAR_CURRICULUM.find(n => n.id === id)?.title || id).join(', ')
      : node.title;

    let generatedPayload: any = null;
    let isAi = false;
    const stamp = Date.now();

    if (apiKey) {
      const prompt = `You are an elite Cambridge/Oxford English Grammar professor creating a STEP-BY-STEP INTERACTIVE LESSON (${node.level} - Advanced Mastery) for Turkish learners.
Target Topic: "${node.title}" (${node.subtitle}).
${isCheckpoint ? `IMPORTANT: This is a CUMULATIVE CHECKPOINT covering ALL these past topics together: [${coveredTitles}].` : ''}

We teach STEP BY STEP: first teach a specific micro-rule in Turkish with formula, then show a real example with breakdown, then ask an interactive check question, then a listening step.

Generate pure JSON (NO markdown fences) with this exact structure:
{
  "lessonSteps": [
    {
      "id": "ai-teach-${stamp}",
      "kind": "teach",
      "badge": "AI İLERİ KURAL • ${node.level}",
      "title": "İleri Düzey Kural Başlığı (Türkçe)",
      "explanationTr": "Kuralın adım adım, anlaşılır ve derinlemesine Türkçe anlatımı.",
      "formula": "Subject + Auxiliary + Verb ...",
      "bullets": ["Önemli detay 1", "Önemli detay 2"],
      "tipTr": "Sınavlarda dikkat edilmesi gereken kritik ipucu"
    },
    {
      "id": "ai-ex-${stamp}",
      "kind": "example",
      "badge": "AI ÖRNEK ANALİZİ",
      "title": "Kuralın Cümle İçinde Uygulanışı",
      "contextTr": "Akademik ve günlük kullanım örneği:",
      "examples": [
        {
          "en": "Complex English example sentence.",
          "tr": "Cümlenin tam Türkçe çevirisi.",
          "highlight": "Vurgulanan gramer yapısı",
          "noteTr": "Neden bu yapının kullanıldığının açıklaması."
        }
      ]
    },
    {
      "id": "ai-chk-${stamp}",
      "kind": "check",
      "badge": "AI ANINDA UYGULAMA",
      "title": "Öğrendiğini Test Et",
      "sentence": "Challenging English sentence with [_____] blank.",
      "sentenceTr": "Cümlenin Türkçe çevirisi.",
      "options": ["correctOpt", "wrong1", "wrong2", "wrong3"],
      "correctAnswer": "correctOpt",
      "explanationTr": "Neden bu şıkkın doğru olduğunun detaylı Türkçe açıklaması."
    },
    {
      "id": "ai-lis-${stamp}",
      "kind": "listen",
      "badge": "AI LISTENING ADIMI",
      "title": "Dinle ve Yapıyı Yakala",
      "audioText": "Two sentences spoken naturally using the target grammar structure.",
      "audioTr": "Seslendirilen metnin Türkçe çevirisi.",
      "question": "Dinlediğiniz cümlede hangi yapı kullanılmıştır veya anlam nedir?",
      "options": ["Doğru yanıt", "Yanlış 1", "Yanlış 2", "Yanlış 3"],
      "correctAnswer": "Doğru yanıt",
      "explanationTr": "Dinleme sorusunun açıklaması."
    }
  ],
  "drills": [
    {
      "id": "gem-d-${stamp}-1",
      "sentence": "Challenging English sentence with [_____] blank",
      "sentenceTr": "Cümlenin tam Türkçe çevirisi",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "option1",
      "explanation": "Derin Türkçe gramer açıklaması",
      "difficulty": "expert"
    }
  ],
  "examQuestions": [
    {
      "id": "gem-e-${stamp}-1",
      "sentence": "Very hard exam sentence with [_____] testing subtle edge cases",
      "sentenceTr": "Cümlenin Türkçe çevirisi",
      "options": ["opt1", "opt2", "opt3", "opt4"],
      "correctAnswer": "opt1",
      "explanation": "Kapsamlı Türkçe akademik açıklama",
      "difficulty": "expert"
    },
    {
      "id": "gem-e-${stamp}-2",
      "sentence": "Second hard exam sentence with [_____] testing advanced mastery",
      "sentenceTr": "Cümlenin Türkçe çevirisi",
      "options": ["optA", "optB", "optC", "optD"],
      "correctAnswer": "optA",
      "explanation": "Kapsamlı Türkçe akademik açıklama",
      "difficulty": "expert"
    }
  ]
}`;

      const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const m of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.75, maxOutputTokens: 2000 },
              }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const clean = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
              generatedPayload = JSON.parse(clean);
              isAi = true;
              break;
            }
          }
        } catch {}
      }
    }

    if (!generatedPayload) {
      generatedPayload = this.buildHighDifficultyFallbackBatch(node, stamp);
    }

    try {
      const { customContents } = await this.getGrammarState();
      const bucket = customContents[node.id] || {
        lessonSteps: [],
        drills: [],
        examQuestions: [],
        examples: [],
        deepRules: [],
        writing: [],
      };

      bucket.lessonSteps = [...(bucket.lessonSteps || []), ...(generatedPayload.lessonSteps || [])];
      bucket.drills = [...(generatedPayload.drills || []), ...(bucket.drills || [])];
      bucket.examQuestions = [...(generatedPayload.examQuestions || []), ...(bucket.examQuestions || [])];
      bucket.examples = [...(generatedPayload.examples || []), ...(bucket.examples || [])];
      bucket.writing = [...(generatedPayload.writing || []), ...(bucket.writing || [])];

      customContents[node.id] = bucket;
      await AsyncStorage.setItem(GRAMMAR_CUSTOM_KEY, JSON.stringify(customContents));

      const res = await dbService.api(`/api/grammar/topic/${node.id}/save-content`, {
        method: 'POST',
        body: JSON.stringify(generatedPayload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.newAchievements) authService.emitAchievements(d.newAchievements);
      }
    } catch {}

    return {
      addedSteps: (generatedPayload.lessonSteps || []).length,
      addedDrills: (generatedPayload.drills || []).length,
      addedExams: (generatedPayload.examQuestions || []).length,
      isAi,
    };
  }

  private buildHighDifficultyFallbackBatch(node: GrammarCurriculumNode, stamp: number) {
    return {
      lessonSteps: [
        {
          id: `bank-teach-${stamp}`,
          kind: 'teach',
          badge: `EKSTRA ADIM • ${node.level} İLERİ KURAL`,
          title: `${node.title}: Akademik İstisnalar & Devrik Yapılar`,
          explanationTr: `Üst düzey İngilizce sınavlarında (IELTS, TOEFL, YDS) ${node.title} konusu genellikle özne-fiil uyumunu gizleyen uzun isim tamlamaları veya negatif zarf devriklikleriyle birlikte sorulur. Cümlenin ana fiilini bulmak için önce edat öbeklerini (of, in, with...) paranteze alın.`,
          formula: 'Main Subject + [Prepositional Phrase] + Singular/Plural Verb',
          bullets: [
            '"Neither A nor B" yapısında fiil her zaman B öznesine (yakın özneye) uyum sağlar.',
            '"The number of + çoğul isim" TEKİL fiil alırken, "A number of + çoğul isim" ÇOĞUL fiil alır.',
            '"Little / Never / Seldom" cümle başına gelirse yardımcı fiil özneden önce gelir.',
          ],
          tipTr: 'Edatlardan (of, in, on, with, along with) sonra gelen isimler ASLA cümlenin ana öznesi olamaz!',
        },
        {
          id: `bank-ex-${stamp}`,
          kind: 'example',
          badge: 'EKSTRA ÖRNEK • ANALİZ',
          title: 'Uzun Özne ve Devrik Yapı Örnekleri',
          contextTr: 'Aşağıdaki iki ileri düzey örneği dikkatle inceleyin:',
          examples: [
            {
              en: 'The quality of the raw materials used in these factories determines the final durability.',
              tr: 'Bu fabrikalarda kullanılan hammaddelerin kalitesi nihai dayanıklılığı belirler.',
              highlight: 'The quality ... determines',
              noteTr: 'Aradaki "materials" ve "factories" çoğul olsa bile ana özne "The quality" (tekil) olduğu için fiil "determines" (-s) aldı.',
            },
            {
              en: 'Seldom does the committee approve a budget without a comprehensive audit.',
              tr: 'Komite kapsamlı bir denetim olmadan nadiren bütçe onaylar.',
              highlight: 'Seldom does the committee approve',
              noteTr: '"Seldom" (nadiren) cümle başına geldiği için devrik yapı (does + subject + V1) kuruldu.',
            },
          ],
        },
        {
          id: `bank-chk-${stamp}`,
          kind: 'check',
          badge: 'EKSTRA UYGULAMA • KONTROL',
          title: 'Yeni Kuralı Hemen Test Et',
          sentence: 'Neither the lead engineer nor the technical assistants [_____] satisfied with the initial prototype.',
          sentenceTr: 'Ne baş mühendis ne de teknik asistanlar ilk prototipten memnundu.',
          options: ['were', 'was', 'has been', 'is'],
          correctAnswer: 'were',
          explanationTr: '"Neither A nor B" kalıbında fiil ikinci özneye ("the technical assistants" - çoğul) uyum sağlar; bu yüzden "were" doğrudur.',
        },
      ],
      drills: [
        {
          id: `bank-d-${stamp}-1`,
          sentence: `Neither the principal investigator nor the laboratory technicians [_____] aware of the calibration error until the alarm sounded.`,
          sentenceTr: `Alarm çalana kadar ne baş araştırmacı ne de laboratuvar teknisyenleri kalibrasyon hatasının farkındaydı.`,
          options: ['were', 'was', 'have been', 'are being'],
          correctAnswer: 'were',
          explanation: '"Neither A nor B" yapısında fiil ikinci özneye ("the laboratory technicians" - çoğul) uyum sağlar.',
          difficulty: 'expert',
          sourceTopicId: node.id,
        },
      ],
      examQuestions: [
        {
          id: `bank-e-${stamp}-1`,
          sentence: `The board of directors recommended that the chief financial officer [_____] the quarterly audit immediately.`,
          sentenceTr: `Yönetim kurulu, finans direktörünün üç aylık denetimi derhal sunmasını tavsiye etti.`,
          options: ['submit', 'submits', 'submitted', 'is submitting'],
          correctAnswer: 'submit',
          explanation: '"Recommend / insist / demand / suggest that..." kalıplarından sonra Subjunctive Mood gereği yalın fiil ("submit") kullanılır.',
          difficulty: 'expert',
          sourceTopicId: node.id,
        },
        {
          id: `bank-e-${stamp}-2`,
          sentence: `A number of independent researchers [_____] currently investigating why the number of anomalies [_____] every winter.`,
          sentenceTr: `Birçok bağımsız araştırmacı şu anda anormallik sayısının neden her kış arttığını araştırıyor.`,
          options: ['are / increases', 'is / increase', 'are / increase', 'is / increases'],
          correctAnswer: 'are / increases',
          explanation: '"A number of + çoğul isim" ÇOĞUL fiil ("are") alır; ancak "The number of + çoğul isim" TEKİL fiil ("increases") alır!',
          difficulty: 'expert',
          sourceTopicId: node.id,
        },
      ],
    };
  }

  // Writing (Yazma) bölümündeki kullanıcı cümlesini Gemini AI + Akıllı Rubrik ile değerlendir
  async evaluateWriting(task: GrammarWritingTask, userAnswer: string): Promise<WritingEvaluationResult> {
    const cleanUser = userAnswer.trim();
    if (!cleanUser) {
      return {
        score: 0,
        passed: false,
        correctedSentence: task.sampleIdealAnswer,
        feedbackTr: 'Lütfen değerlendirme için İngilizce cümlenizi yazın.',
        grammarAnalysis: 'Boş yanıt.',
        isAiEvaluated: false,
      };
    }

    const apiKey = await dbService.getGeminiApiKey();
    if (apiKey) {
      const prompt = `You are a strict English grammar examiner evaluating a Turkish student's translation/writing exercise.
Turkish Prompt: "${task.promptTr}"
Instruction: "${task.instruction}"
Ideal Reference Answer: "${task.sampleIdealAnswer}"
Student's Answer: "${cleanUser}"

Evaluate grammatical accuracy, tense/aspect precision, and vocabulary.
Respond ONLY with pure JSON (no markdown fences):
{
  "score": 85,
  "passed": true,
  "correctedSentence": "Best corrected version of student's sentence",
  "feedbackTr": "Türkçe yapıcı geri bildirim",
  "grammarAnalysis": "Detaylı Türkçe gramer ve yapı analizi"
}`;

      const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const m of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
              }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const clean = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(clean);
              return {
                score: Number(parsed.score) || 0,
                passed: (Number(parsed.score) || 0) >= 80,
                correctedSentence: parsed.correctedSentence || task.sampleIdealAnswer,
                feedbackTr: parsed.feedbackTr || 'Değerlendirme tamamlandı.',
                grammarAnalysis: parsed.grammarAnalysis || '',
                isAiEvaluated: true,
              };
            }
          }
        } catch {}
      }
    }

    const lowerUser = cleanUser.toLowerCase().replace(/[.,?!]/g, '');
    const lowerIdeal = task.sampleIdealAnswer.toLowerCase().replace(/[.,?!]/g, '');
    const idealTokens = lowerIdeal.split(/\s+/).filter(Boolean);
    const userTokens = lowerUser.split(/\s+/).filter(Boolean);

    let matchedKeywords = 0;
    for (const kw of task.requiredKeywords) {
      if (lowerUser.includes(kw.toLowerCase())) matchedKeywords++;
    }
    const kwRatio = task.requiredKeywords.length > 0 ? matchedKeywords / task.requiredKeywords.length : 1;

    let tokenHits = 0;
    for (const t of idealTokens) {
      if (userTokens.includes(t)) tokenHits++;
    }
    const tokenRatio = idealTokens.length > 0 ? tokenHits / idealTokens.length : 0;

    const rawScore = Math.min(100, Math.round(kwRatio * 55 + tokenRatio * 45));
    const passed = rawScore >= 80;

    return {
      score: rawScore,
      passed,
      correctedSentence: task.sampleIdealAnswer,
      feedbackTr: passed
        ? 'Tebrikler! Hedef gramer yapısını ve cümle kurgusunu doğru kullandınız.'
        : `Hedef gramer anahtar kelimelerinden (${task.requiredKeywords.join(', ')}) bazıları eksik veya farklı çekimlenmiş. İdeal cümleyi inceleyip tekrar deneyin.`,
      grammarAnalysis: `Hedef Kalıp: ${task.targetStructureHint}`,
      isAiEvaluated: false,
    };
  }

  // Gemini API ile Veritabanında Olmayan Yeni Kelimeler Üret ve Veritabanına Ekle
  async generateNewWordsWithGemini(level: CefrLevel = 'B2', count = 10): Promise<{
    addedCount: number;
    totalWords: number;
  }> {
    const apiKey = await dbService.getGeminiApiKey();
    let generatedWords: Partial<WordItem>[] = [];

    if (apiKey) {
      const prompt = `Generate ${count} advanced, high-value CEFR ${level} English vocabulary words for Turkish learners.
Respond ONLY with a pure JSON array (no markdown fences):
[
  {
    "word": "Ubiquitous",
    "phonetic": "/juːˈbɪkwɪtəs/",
    "translation": "Her yerde bulunan, yaygın",
    "partOfSpeech": "adjective",
    "level": "${level}",
    "sampleEn": "Smartphones have become ubiquitous in modern society.",
    "sampleTr": "Akıllı telefonlar modern toplumda her yerde bulunur hale geldi.",
    "mnemonicHint": "Ubi (nerede) -> Baktığın her yerde karşına çıkan şey."
  }
]`;

      const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const m of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.85, maxOutputTokens: 1500 },
              }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const clean = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(clean);
              if (Array.isArray(parsed)) {
                generatedWords = parsed;
                break;
              }
            }
          }
        } catch {}
      }
    }

    if (generatedWords.length === 0) {
      generatedWords = [
        {
          word: `Serendipity`,
          phonetic: '/ˌserənˈdɪpəti/',
          translation: 'Mutlu tesadüf, beklenmedik güzel keşif',
          partOfSpeech: 'noun',
          level,
          sampleEn: 'Finding that rare book in a small village shop was pure serendipity.',
          sampleTr: 'Küçük bir köy dükkanında o nadir kitabı bulmak tam bir mutlu tesadüftü.',
          mnemonicHint: 'Aramazken şans eseri bulunan hazine.',
        },
        {
          word: `Meticulous`,
          phonetic: '/məˈtɪkjələs/',
          translation: 'Titiz, en ince ayrıntısına kadar özenli',
          partOfSpeech: 'adjective',
          level,
          sampleEn: 'The forensic scientist kept meticulous records of every sample.',
          sampleTr: 'Adli bilimci her örneğin titiz kayıtlarını tuttu.',
          mnemonicHint: 'Mercekle her detayı inceleyen saat ustası.',
        },
      ];
    }

    try {
      const res = await dbService.api('/api/words/add-batch', {
        method: 'POST',
        body: JSON.stringify({ words: generatedWords }),
      });
      if (res.ok) {
        const d = await res.json();
        return { addedCount: d.addedCount || generatedWords.length, totalWords: d.totalWords || 10000 };
      }
    } catch {}

    return { addedCount: generatedWords.length, totalWords: 10000 };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 50+ SORULUK KARMA HAVUZ (10 Boşluk, 10 Kelime Kartı, 10 Listening, 10 Okuma, 10 Yazma)
  // & DETAYLI AKADEMİK KURAL ANLATIMI (PostgreSQL + Gemini API)
  // ═══════════════════════════════════════════════════════════════════════════

  async getQuestionPoolAndGuide(nodeId: string): Promise<{
    questions: GrammarPoolQuestion[];
    guide: DeepGrammarGuide;
    dbQuestionCount: number;
  }> {
    const baseQuestions = build50QuestionsForNode(nodeId);
    const baseGuide = getDeepGrammarGuide(nodeId);

    let dbQuestions: GrammarPoolQuestion[] = [];
    let dbDeepRules: any[] = [];

    try {
      const cachedRaw = await AsyncStorage.getItem(`${GRAMMAR_POOL_CACHE_KEY}_${nodeId}`);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (Array.isArray(parsed.questions)) dbQuestions = parsed.questions;
        if (Array.isArray(parsed.deepRules)) dbDeepRules = parsed.deepRules;
      }
    } catch {}

    try {
      const res = await dbService.api(`/api/grammar/pool/${nodeId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          dbQuestions = data.questions;
        }
        if (data.customContent && Array.isArray(data.customContent.deepRules)) {
          dbDeepRules = data.customContent.deepRules;
        }
        await AsyncStorage.setItem(
          `${GRAMMAR_POOL_CACHE_KEY}_${nodeId}`,
          JSON.stringify({ questions: dbQuestions, deepRules: dbDeepRules })
        );
      } else {
        // İlk kez açılıyorsa 50 çekirdek soruyu arka planda PostgreSQL'e kaydet (UI'ı asla bekletme)
        dbService.api(`/api/grammar/pool/${nodeId}/save`, {
          method: 'POST',
          body: JSON.stringify({ questions: baseQuestions }),
        }).catch(() => {});
      }
    } catch {}

    // İlk kez PostgreSQL'de bu ünite için soru yoksa 50 çekirdek soruyu arka planda veritabanına senkronize et
    if (dbQuestions.length === 0) {
      dbService
        .api(`/api/grammar/pool/${nodeId}/save`, {
          method: 'POST',
          body: JSON.stringify({ questions: baseQuestions }),
        })
        .catch(() => {});
    }

    const byId = new Map<string, GrammarPoolQuestion>();
    for (const q of baseQuestions) byId.set(q.id, q);
    for (const q of dbQuestions) {
      if (q && q.id && q.kind) byId.set(q.id, q);
    }

    const mergedQuestions = Array.from(byId.values());
    const baseSections = baseGuide?.detailedRuleBlocks || (baseGuide as any)?.sections || [];
    const mergedGuide: DeepGrammarGuide = {
      ...baseGuide,
      detailedRuleBlocks: [
        ...baseSections,
        ...dbDeepRules.map((r: any, idx: number) => ({
          badge: r.badge || '✨ GEMINI DERİN ARAŞTIRMA',
          title: r.title || 'İleri Akademik Kural Analizi',
          formula: r.formula || 'Subject + Auxiliary + Main Verb',
          explanationTr: r.explanationTr || r.body || '',
          examples: Array.isArray(r.examples)
            ? r.examples.map((ex: any) => ({
                en: ex.en || '',
                tr: ex.tr || '',
                note: ex.noteTr || ex.note || 'Yapısal kural ve kullanım analizi.',
              }))
            : [
                {
                  en: r.exampleEn || 'Academic mastery requires consistent practice.',
                  tr: r.exampleTr || 'Akademik ustalık düzenli pratik gerektirir.',
                  note: r.tipTr || 'Yapısal vurgu ve özne-fiil uyumu.',
                },
              ],
        })),
      ],
    };

    return {
      questions: mergedQuestions,
      guide: mergedGuide,
      dbQuestionCount: mergedQuestions.length,
    };
  }

  // Gemini API ile Detaylı Kural Araştırması + 5 Tipte Yeni Sorular Üret ve PostgreSQL'e Kaydet
  async generatePoolQuestionsAndResearchWithGemini(
    node: GrammarCurriculumNode,
    focusSubSkill?: string
  ): Promise<{
    addedQuestions: GrammarPoolQuestion[];
    addedRules: any[];
    isAi: boolean;
  }> {
    const apiKey = await dbService.getGeminiApiKey();
    const stamp = Date.now();
    let addedQuestions: GrammarPoolQuestion[] = [];
    let addedRules: any[] = [];
    let isAi = false;

    if (apiKey) {
      const prompt = `You are an Oxford/Cambridge linguistics professor creating deep interactive Turkish grammar instruction and 5 distinct Duolingo-style exercise types for "${node.title}" (${node.level} - ${node.subtitle}).
${focusSubSkill ? `CRITICAL FOCUS: The student made a mistake on sub-skill "${focusSubSkill}". Focus questions on mastering this exact rule!` : ''}

Generate pure JSON (NO markdown fences) with this exact structure:
{
  "deepRules": [
    {
      "id": "gem-rule-${stamp}",
      "badge": "✨ GEMINI DERİN ARAŞTIRMA • ${node.level}",
      "title": "Kapsamlı Akademik Kural & İstisnalar (Türkçe)",
      "subtitle": "Dilbilimsel Köken, Çekim Mantığı ve Sınav Tuzakları",
      "formula": "Exact Grammatical Formula",
      "explanationTr": "Çok detaylı, adım adım, yüzeysel olmayan kapsamlı Türkçe kural anlatımı (en az 3-4 cümle).",
      "keyPoints": [
        "Kritik kural detayı 1",
        "Yazım veya telaffuz kuralı detayı 2",
        "Türk öğrencilerin en sık yaptığı hata ve doğrusu 3"
      ],
      "examples": [
        {
          "en": "Natural, rich English sentence demonstrating the rule.",
          "tr": "Cümlenin tam Türkçe çevirisi.",
          "noteTr": "Bu cümlede kuralın nasıl uygulandığının analizi."
        },
        {
          "en": "Second contrasting or question/negative English sentence.",
          "tr": "İkinci cümlenin Türkçe çevirisi.",
          "noteTr": "Yardımcı fiil ve ek analizi."
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "${node.id}-ai-fill-${stamp}-1",
      "nodeId": "${node.id}",
      "kind": "fill",
      "subSkillTag": "${focusSubSkill || `${node.id}-core-rule`}",
      "promptEn": "English sentence with [_____] blank testing ${node.title}",
      "promptTr": "Cümlenin tam Türkçe çevirisi",
      "options": ["correctOpt", "wrong1", "wrong2", "wrong3"],
      "correctAnswer": "correctOpt",
      "explanationTr": "Neden bu şıkkın doğru olduğunun detaylı Türkçe açıklaması"
    },
    {
      "id": "${node.id}-ai-tiles-${stamp}-2",
      "nodeId": "${node.id}",
      "kind": "word_tiles",
      "subSkillTag": "${focusSubSkill || `${node.id}-syntax`}",
      "promptEn": "Complete English sentence (5 to 8 words).",
      "promptTr": "Bu cümlenin tam Türkçe karşılığı (Kullanıcı bunu görüp kelimeleri dizecek).",
      "correctAnswer": "Complete English sentence (5 to 8 words).",
      "wordTiles": ["Complete", "English", "sentence", "(5", "to", "8", "words).", "distractor1", "distractor2"],
      "explanationTr": "Cümle diziliminin (Özne + Yardımcı Fiil + Yüklem + Nesne) Türkçe açıklaması",
      "starterHint": "İlk iki kelime ipucu"
    },
    {
      "id": "${node.id}-ai-listen-${stamp}-3",
      "nodeId": "${node.id}",
      "kind": "listening",
      "subSkillTag": "${focusSubSkill || `${node.id}-listening`}",
      "audioScriptEn": "Spoken English sentence clearly using ${node.title}.",
      "promptEn": "Dinlediğiniz cümleye göre hangi ifade doğrudur veya boşluğa ne gelir?",
      "promptTr": "Seslendirilen cümlenin Türkçe çevirisi",
      "options": ["correctOpt", "wrong1", "wrong2", "wrong3"],
      "correctAnswer": "correctOpt",
      "explanationTr": "Dinleme cümlesindeki gramer yapısının Türkçe analizi"
    },
    {
      "id": "${node.id}-ai-read-${stamp}-4",
      "nodeId": "${node.id}",
      "kind": "reading",
      "subSkillTag": "${focusSubSkill || `${node.id}-reading`}",
      "passageEn": "A 2-3 sentence short paragraph in English using ${node.title} in context.",
      "passageTr": "Paragrafın tam Türkçe çevirisi.",
      "promptEn": "Parçaya göre hangi gramer yapısı veya bilgi doğrudur?",
      "promptTr": "Okuma anlama ve gramer analizi sorusu",
      "options": ["Doğru analiz", "Yanlış 1", "Yanlış 2", "Yanlış 3"],
      "correctAnswer": "Doğru analiz",
      "explanationTr": "Parçadaki hedef yapının Türkçe açıklaması"
    },
    {
      "id": "${node.id}-ai-write-${stamp}-5",
      "nodeId": "${node.id}",
      "kind": "writing",
      "subSkillTag": "${focusSubSkill || `${node.id}-writing`}",
      "promptEn": "Expected ideal English translation.",
      "promptTr": "Türkçe cümle (Kullanıcı bunu İngilizceye çevirecek).",
      "correctAnswer": "Expected ideal English translation.",
      "acceptableAnswers": ["Expected ideal English translation."],
      "requiredKeywords": ["keyword1", "keyword2"],
      "starterHint": "Expected ideal...",
      "vocabHint": "kelime1 = word1 | kelime2 = word2",
      "explanationTr": "Çeviride dikkat edilmesi gereken gramer kuralı açıklaması"
    }
  ]
}`;

      const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const m of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.75, maxOutputTokens: 2500 },
              }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const clean = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(clean);
              if (Array.isArray(parsed.questions)) addedQuestions = parsed.questions;
              if (Array.isArray(parsed.deepRules)) addedRules = parsed.deepRules;
              isAi = true;
              break;
            }
          }
        } catch {}
      }
    }

    if (addedQuestions.length === 0) {
      addedRules = [
        {
          id: `fallback-rule-${stamp}`,
          badge: `✨ DERİN ARAŞTIRMA • ${node.level}`,
          title: `${node.title}: Vurgu (Emphatic Do) & Sıklık Zarflarıyla İleri Kullanım`,
          subtitle: 'Olumlu Cümlede Vurgu ve Zarfların Cümle İçi Konumu',
          formula: 'Subject + DO / DOES + V1 (Yalın Fiil) -> "Gerçekten / Kesinlikle Yaparım!"',
          explanationTr:
            'Normalde olumlu Simple Present cümlelerinde "do/does" görünmez. Ancak konuşmacı duygusunu veya eylemin gerçekliğini şiddetle vurgulamak istediğinde olumlu cümlede de "do / does + yalın fiil" kullanır ("I DO understand you!" / "She DOES work hard!"). Dikkat: "does" kullanıldığı anda ana fiildeki "-s" takısı düşer!',
          keyPoints: [
            '"She does knows" YANLIŞTIR -> "She does know" DOĞRUDUR (Vurgulu olumlu cümle).',
            'Never, seldom, rarely, hardly ever zarfları yapıca olumlu cümleye eklense bile anlamı %100 OLUMSUZ yapar ("He never lies").',
            'Bu negatif zarflar vurgu için cümle başına çekilirse cümle soru gibi devrik olur: "Never does he arrive late."',
          ],
          examples: [
            {
              en: 'I do appreciate your constructive feedback on our research paper.',
              tr: 'Araştırma makalemiz hakkındaki yapıcı geri bildiriminizi gerçekten takdir ediyorum.',
              noteTr: '"Do appreciate" kullanımı cümleye "gerçekten, içtenlikle" vurgusu katar.',
            },
            {
              en: 'She does want to join the international conference, but her schedule is full.',
              tr: 'Uluslararası konferansa katılmayı gerçekten istiyor ama programı dolu.',
              noteTr: 'Özne "She" olduğu için vurgu yardımcı fiili "does" oldu ve "want" yalın kaldı.',
            },
          ],
        },
      ];

      addedQuestions = [
        {
          id: `${node.id}-fb-fill-${stamp}-1`,
          nodeId: node.id,
          kind: 'fill',
          subSkillTag: focusSubSkill || `${node.id}-emphatic`,
          sentence: 'People think he ignores the rules, but he [_____] follow the safety protocol strictly.',
          sentenceTr: 'İnsanlar onun kuralları görmezden geldiğini düşünüyor ama o güvenlik protokolünü gerçekten sıkıca takip ediyor.',
          options: ['does', 'do', 'is', 'has'],
          correctAnswer: 'does',
          hintTr: 'Vurgu yardımcı fiili (Emphatic Do) kuralı.',
          explanationTr: 'Olumlu cümlede "gerçekten yapar" vurgusu (Emphatic Do) için "he" öznesiyle "does + V1 (follow)" kullanılır.',
        },
        {
          id: `${node.id}-fb-tiles-${stamp}-2`,
          nodeId: node.id,
          kind: 'word_tiles',
          subSkillTag: focusSubSkill || `${node.id}-syntax`,
          targetEn: 'How often does the train leave from this platform?',
          promptTr: 'Tren bu perondan ne sıklıkla kalkar?',
          correctAnswer: 'How often does the train leave from this platform?',
          correctTokens: ['How', 'often', 'does', 'the', 'train', 'leave', 'from', 'this', 'platform?'],
          tiles: ['How', 'often', 'does', 'the', 'train', 'leave', 'from', 'this', 'platform?', 'leaves', 'is'],
          hintTr: 'How often + does + S + V1',
          explanationTr: 'Soru kelimesi (How often) + does + tekil özne (the train) + yalın fiil (leave) dizilimi kullanılır.',
          starterHint: 'How often does...',
        },
        {
          id: `${node.id}-fb-listen-${stamp}-3`,
          nodeId: node.id,
          kind: 'listening',
          subSkillTag: focusSubSkill || `${node.id}-listening`,
          audioEn: 'Neither my brother nor my parents approve of reckless spending.',
          question: 'Dinlediğiniz cümlede kullanılan gramer yapısı ve anlamı nedir?',
          audioTr: 'Ne erkek kardeşim ne de ebeveynlerim düşüncesiz harcamayı onaylar.',
          options: [
            'Neither...nor yapısında yakın özne "parents" çoğul olduğu için "approve" yalın kullanılmıştır.',
            'Cümle geçmiş zamandadır.',
            'Ebeveynler harcamayı onaylamaktadır.',
            'Cümlede şimdiki zaman (-ing) kullanılmıştır.',
          ],
          correctAnswer: 'Neither...nor yapısında yakın özne "parents" çoğul olduğu için "approve" yalın kullanılmıştır.',
          hintTr: 'Neither A nor B özne-yüklem uyumu.',
          explanationTr: '"Neither A nor B" kalıbında fiil B öznesine ("my parents" - çoğul) uyum sağlar.',
        },
        {
          id: `${node.id}-fb-read-${stamp}-4`,
          nodeId: node.id,
          kind: 'reading',
          subSkillTag: focusSubSkill || `${node.id}-reading`,
          passageEn: 'Every autumn, millions of monarch butterflies migrate thousands of kilometers south. A single butterfly does not survive the entire round trip, yet the species always finds the exact same forest.',
          passageTr: 'Her sonbaharda milyonlarca kral kelebeği güneye binlerce kilometre göç eder. Tek bir kelebek tüm gidiş-dönüş yolculuğunda hayatta kalmaz, yine de tür her zaman tam olarak aynı ormanı bulur.',
          question: 'Parçada "migrate", "does not survive" ve "finds" fiillerinin kullanım nedeni nedir?',
          promptTr: 'Doğa kanunu ve bilimsel gerçeklik analizi:',
          options: [
            'Doğa olayları ve tekrarlanan bilimsel gerçekler Simple Present Tense ile anlatılır.',
            'Sadece geçmişte bir kez yaşanmış bir olayı anlatır.',
            'Gelecek yılki tahmini bir planı anlatır.',
            'Şu an konuşma anında bitmiş bir eylemi anlatır.',
          ],
          correctAnswer: 'Doğa olayları ve tekrarlanan bilimsel gerçekler Simple Present Tense ile anlatılır.',
          hintTr: 'Bilimsel döngüler geniş zamanla ifade edilir.',
          explanationTr: 'Biyolojik döngüler ve doğa kanunları her zaman Simple Present Tense ile ifade edilir.',
        },
        {
          id: `${node.id}-fb-write-${stamp}-5`,
          nodeId: node.id,
          kind: 'writing',
          subSkillTag: focusSubSkill || `${node.id}-writing`,
          idealEn: 'My sister does not drink coffee at night because it affects her sleep.',
          promptTr: 'Kız kardeşim gece kahve içmez çünkü uykusunu etkiler.',
          correctAnswer: 'My sister does not drink coffee at night because it affects her sleep.',
          acceptedAnswers: [
            'My sister does not drink coffee at night because it affects her sleep.',
            "My sister doesn't drink coffee at night because it affects her sleep.",
          ],
          starterHint: 'My sister does not drink...',
          vocabHint: 'kız kardeşim = my sister | gece = at night | etkilemek = affect (-s)',
          hintTr: 'Olumsuzda does not + V1, yan cümlede it + V-s.',
          explanationTr: 'Olumsuz kısımda "does not drink" (yalın), "because" yan cümlesinde ise "it" öznesiyle "affects" (-s takılı) kullanılır.',
        },
      ];
    }

    try {
      await dbService.api(`/api/grammar/pool/${node.id}/save`, {
        method: 'POST',
        body: JSON.stringify({
          questions: addedQuestions,
          deepRules: addedRules,
        }),
      });
    } catch {}

    return {
      addedQuestions,
      addedRules,
      isAi,
    };
  }

  // Havuzdaki Yazma (Writing) sorusunu değerlendir
  async evaluatePoolWritingQuestion(
    q: GrammarPoolQuestion,
    userAnswer: string
  ): Promise<{
    passed: boolean;
    score: number;
    correctedSentence: string;
    feedbackTr: string;
  }> {
    const clean = userAnswer.trim();
    const targetAnswer = q.idealEn || q.correctAnswer || '';
    if (!clean) {
      return {
        passed: false,
        score: 0,
        correctedSentence: targetAnswer,
        feedbackTr: 'Lütfen cümlenin İngilizce çevirisini yazın.',
      };
    }

    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/[.,?!'"’]/g, '')
        .replace(/\bdoesn't\b/g, 'does not')
        .replace(/\bdon't\b/g, 'do not')
        .replace(/\bisn't\b/g, 'is not')
        .replace(/\baren't\b/g, 'are not')
        .replace(/\bi'm\b/g, 'i am')
        .replace(/\s+/g, ' ')
        .trim();

    const userNorm = norm(clean);
    const candidates = [targetAnswer, ...(q.acceptedAnswers || [])].filter(Boolean).map(norm);

    if (candidates.includes(userNorm)) {
      return {
        passed: true,
        score: 100,
        correctedSentence: targetAnswer,
        feedbackTr: 'Mükemmel! Cümleyi hem gramer hem de kelime dizilimi açısından %100 doğru kurdunuz.',
      };
    }

    // Anahtar kelime ve token benzerlik kontrolü
    const idealTokens = norm(targetAnswer).split(' ').filter(Boolean);
    const userTokens = userNorm.split(' ').filter(Boolean);

    let tokHits = 0;
    for (const t of idealTokens) {
      if (userTokens.includes(t)) tokHits++;
    }
    const tokRatio = idealTokens.length > 0 ? tokHits / idealTokens.length : 0;

    // Özel Türk öğrenci hata yakalayıcıları (örn: "does not likes", "i am agree", "she play")
    if (/\b(does|do|did)\s+not\s+\w+s\b/.test(userNorm)) {
      return {
        passed: false,
        score: 45,
        correctedSentence: targetAnswer,
        feedbackTr:
          'DİKKAT: "does not / doesn\'t" kullandığınızda yardımcı fiil "-es" yükünü zaten üstlenir; ana fiildeki "-s" takısını silip yalın kullanmalısınız!',
      };
    }

    const score = Math.round(tokRatio * 100);
    if (score >= 82) {
      return {
        passed: true,
        score,
        correctedSentence: targetAnswer,
        feedbackTr: 'Harika! Hedef gramer kalıbını ve cümle yapısını doğru kurdunuz.',
      };
    }

    return {
      passed: false,
      score,
      correctedSentence: targetAnswer,
      feedbackTr: `Cümlenizde eksik veya hatalı çekimlenmiş yapı var. İdeal cümle: "${targetAnswer}". Şimdi aynı kuralı pekiştirmek için yeni bir soruyla devam edeceğiz!`,
    };
  }
}

export const grammarService = new GrammarService();
