import { GrammarTopicContent } from './grammarCurriculum';

// Adım adım öğretim akışındaki her bir adım
export type LessonStep =
  | {
      kind: 'teach';
      title: string;
      body: string;
      formula?: string;
      bullets?: string[];
      tip?: string;
    }
  | {
      kind: 'example';
      title?: string;
      en: string;
      tr: string;
      analysis: string;
    }
  | {
      kind: 'check';
      question: string;
      sentence?: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }
  | {
      kind: 'listen';
      title: string;
      intro: string;
      audioScript: string;
      audioScriptTr: string;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }
  | {
      kind: 'read';
      title: string;
      intro: string;
      passage: string;
      passageTr: string;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }
  | {
      kind: 'write';
      promptTr: string;
      instruction: string;
      hint: string;
      sampleIdealAnswer: string;
      requiredKeywords: string[];
    }
  | {
      kind: 'summary';
      title: string;
      points: string[];
    };

// ==================== A1-1: SIMPLE PRESENT TENSE & TO BE ====================
const SIMPLE_PRESENT_LESSON: LessonStep[] = [
  {
    kind: 'teach',
    title: '1. Simple Present ne işe yarar?',
    body:
      'Simple Present Tense (Geniş Zaman), "şu an" olanı değil; genel olarak, her zaman, düzenli olarak olanı anlatır. Türkçedeki "-r / -ar / -er" ekine (okurum, gider, çalışır) çok benzer.\n\nBu zamanı dört temel durumda kullanırız:',
    bullets: [
      'Alışkanlıklar ve rutinler → I drink coffee every morning.',
      'Değişmeyen gerçekler / bilimsel bilgiler → Water boils at 100°C.',
      'Kalıcı durumlar (iş, yaşanılan yer) → She works in a bank.',
      'Tarifeler ve programlar (gelecek anlamında bile) → The train leaves at 9.',
    ],
    tip: 'Kendine şunu sor: "Bu eylem şu anda mı oluyor, yoksa genel olarak mı doğru?" Genel olarak doğruysa Simple Present.',
  },
  {
    kind: 'example',
    title: 'Örnek: Rutin',
    en: 'I wake up at seven and I walk to work.',
    tr: 'Yedide uyanırım ve işe yürüyerek giderim.',
    analysis: 'Konuşmacı şu anda yürümüyor; bu her gün tekrar eden bir rutin. Bu yüzden "wake up" ve "walk" Simple Present.',
  },
  {
    kind: 'teach',
    title: '2. Temel yapı: I / You / We / They',
    body:
      'Özne I, you, we veya they ise fiil hiçbir ek almaz. Fiilin sözlükteki yalın hâlini (V1) kullanırsın.',
    formula: 'I / You / We / They + V1',
    bullets: ['I play tennis.', 'You speak English very well.', 'We live in Ankara.', 'They watch films on Fridays.'],
  },
  {
    kind: 'check',
    question: 'Doğru seçeneği seç:',
    sentence: 'My parents [_____] in a small village near the sea.',
    options: ['live', 'lives', 'living', 'are live'],
    correctAnswer: 'live',
    explanation: '"My parents" = they (çoğul). I/you/we/they ile fiil yalın kalır: live. "are live" yanlıştır çünkü live bir fiildir, am/is/are ile birlikte kullanılmaz.',
  },
  {
    kind: 'teach',
    title: '3. Kritik kural: He / She / It → fiile -s',
    body:
      'Özne üçüncü tekil şahıs (he, she, it veya tek bir kişi/şey: my brother, the dog, Ali) olduğunda fiile -s eklenir. Türkçede bu ayrım olmadığı için Türk öğrencilerin en sık unuttuğu kural budur.',
    formula: 'He / She / It + V1 + s',
    bullets: [
      'Çoğu fiil: + s → work → works, read → reads',
      '-s, -sh, -ch, -x, -o ile biten: + es → watch → watches, go → goes, fix → fixes',
      'Sessiz harf + y: y düşer, + ies → study → studies, cry → cries',
      'Sesli harf + y: sadece + s → play → plays, buy → buys',
      'Düzensiz: have → has',
    ],
    tip: 'Hızlı test: Özne yerine "he" veya "it" koyabiliyorsan, fiil -s alır.',
  },
  {
    kind: 'example',
    title: 'Örnek: 3. tekil şahıs',
    en: 'My sister studies medicine and goes to the hospital every day.',
    tr: 'Kız kardeşim tıp okuyor ve her gün hastaneye gidiyor.',
    analysis: '"My sister" = she. study → studies (sessiz harf + y), go → goes (-o ile bitiyor → -es).',
  },
  {
    kind: 'check',
    question: 'Hangisi doğru yazılmıştır?',
    sentence: 'The baby [_____] when she is hungry.',
    options: ['cries', 'crys', 'cry', 'is cry'],
    correctAnswer: 'cries',
    explanation: '"The baby" = she → -s gerekir. "cry" sessiz harf (r) + y ile bittiği için y düşer ve -ies gelir: cries.',
  },
  {
    kind: 'check',
    question: 'Boşluğa ne gelmeli?',
    sentence: 'Ahmet [_____] a new car, but he rarely drives it.',
    options: ['has', 'have', 'haves', 'is have'],
    correctAnswer: 'has',
    explanation: '"have" düzensizdir: he/she/it ile "has" olur. "haves" diye bir çekim yoktur.',
  },
  {
    kind: 'listen',
    title: 'Dinleme: Maria\'nın günü',
    intro: 'Şimdi öğrendiklerini kulakla yakala. Metni dinle ve fiillerin sonundaki -s seslerine dikkat et.',
    audioScript:
      'Maria is a nurse. She starts work at six in the morning. She takes the bus because she does not have a car. Her husband teaches maths, and their children go to the same school.',
    audioScriptTr:
      'Maria bir hemşire. Sabah altıda işe başlar. Arabası olmadığı için otobüse biner. Kocası matematik öğretir ve çocukları aynı okula gider.',
    question: 'Metinde "go" fiili neden -s ALMADAN kullanıldı?',
    options: [
      'Çünkü öznesi "their children" (they) — çoğul.',
      'Çünkü cümle geçmiş zamanda.',
      'Çünkü "go" düzensiz bir fiil.',
      'Çünkü okul bir yer adı.',
    ],
    correctAnswer: 'Çünkü öznesi "their children" (they) — çoğul.',
    explanation: '"Their children" = they. Çoğul öznelerle fiil yalın kalır. Buna karşılık "she starts", "she takes", "her husband teaches" -s almıştır.',
  },
  {
    kind: 'teach',
    title: '4. Olumsuz cümle: don\'t / doesn\'t',
    body:
      'Olumsuz yapmak için fiilin önüne yardımcı fiil koyarız. I/you/we/they için "don\'t", he/she/it için "doesn\'t".\n\nEn önemli nokta: -s takısını artık "does" taşıdığı için asıl fiil YALIN hâle döner.',
    formula: 'I/You/We/They + don\'t + V1\nHe/She/It + doesn\'t + V1 (yalın!)',
    bullets: ['She works. → She doesn\'t work.', 'He has a car. → He doesn\'t have a car.', 'It rains. → It doesn\'t rain.'],
    tip: 'Bir cümlede -s sadece bir kez taşınır: ya fiilde (works) ya da yardımcı fiilde (does). İkisinde birden asla.',
  },
  {
    kind: 'example',
    en: 'My father doesn\'t eat meat, but he loves fish.',
    tr: 'Babam et yemez ama balığa bayılır.',
    analysis: 'Olumsuz kısımda -s "doesn\'t" içinde, bu yüzden "eat" yalın. Olumlu kısımda "loves" -s alıyor.',
  },
  {
    kind: 'check',
    question: 'Hangi cümle doğru?',
    options: [
      'She doesn\'t like horror films.',
      'She doesn\'t likes horror films.',
      'She don\'t like horror films.',
      'She not likes horror films.',
    ],
    correctAnswer: 'She doesn\'t like horror films.',
    explanation: 'She → doesn\'t. "doesn\'t" -s\'yi taşıdığı için fiil yalın kalır: like. "don\'t" he/she/it ile kullanılmaz.',
  },
  {
    kind: 'teach',
    title: '5. Soru cümlesi: Do / Does başa gelir',
    body:
      'Soru sormak için Do veya Does cümlenin başına geçer, fiil yine yalın kalır. Soru kelimesi (What, Where, How often...) varsa en başa o gelir.',
    formula: '(Wh-) + Do/Does + özne + V1 ?',
    bullets: [
      'Do you speak French? → Yes, I do. / No, I don\'t.',
      'Does he work here? → Yes, he does. / No, he doesn\'t.',
      'Where does your brother live?',
      'How often do they visit you?',
    ],
  },
  {
    kind: 'check',
    question: 'Boşluğu doldur:',
    sentence: 'What time [_____] the museum open on Sundays?',
    options: ['does', 'do', 'is', 'opens'],
    correctAnswer: 'does',
    explanation: '"The museum" = it → Does. Soru yapısı: What time + does + the museum + open (yalın)?',
  },
  {
    kind: 'teach',
    title: '6. To Be (am / is / are) ile karıştırma!',
    body:
      '"To be" bir fiil değil, durum bildirir: isim, sıfat veya yer ile kullanılır (I am tired, She is a doctor, They are at home). Asıl bir fiil (work, like, agree, want) varsa am/is/are KULLANILMAZ.\n\nTürkçede "katılıyorum" sıfat gibi hissettirdiği için "I am agree" hatası çok yapılır. Oysa agree bir fiildir.',
    bullets: [
      '✅ I agree with you. ❌ I am agree with you.',
      '✅ Do you agree? ❌ Are you agree?',
      '✅ She is happy. (happy = sıfat)',
      '✅ Is he a teacher? / Does he teach?',
    ],
    tip: 'Cümlede başka bir fiil var mı? Varsa do/does; yoksa (sıfat/isim/yer) am/is/are.',
  },
  {
    kind: 'check',
    question: 'Hangisi doğru?',
    options: ['Do you agree with this plan?', 'Are you agree with this plan?', 'Does you agree with this plan?', 'Are you agreeing with this plan?'],
    correctAnswer: 'Do you agree with this plan?',
    explanation: '"Agree" bir fiildir → Do you agree? "Are you agreeing" de yanlıştır çünkü agree bir durum fiilidir ve -ing almaz.',
  },
  {
    kind: 'teach',
    title: '7. Sıklık zarflarının yeri',
    body:
      'always, usually, often, sometimes, rarely/seldom, never gibi zarflar "ne sıklıkla" sorusuna cevap verir. Yerleri kurallıdır:',
    bullets: [
      'Asıl fiilden ÖNCE: She often reads. / They never eat pork.',
      'To be\'den SONRA: He is always late. / We are rarely bored.',
      '"never" zaten olumsuzdur: He never smokes. (❌ He doesn\'t never smoke.)',
    ],
    formula: 'Özne + zarf + fiil   |   Özne + am/is/are + zarf',
  },
  {
    kind: 'example',
    en: 'Tom is usually calm, but he sometimes shouts when he is tired.',
    tr: 'Tom genellikle sakindir ama yorgun olduğunda bazen bağırır.',
    analysis: '"is usually" → to be\'den sonra. "sometimes shouts" → asıl fiilden önce.',
  },
  {
    kind: 'check',
    question: 'Zarf doğru yerde olan cümleyi seç:',
    options: ['She is never late for class.', 'She never is late for class.', 'She is late never for class.', 'Never she is late for class.'],
    correctAnswer: 'She is never late for class.',
    explanation: '"late" bir sıfat, yani to be cümlesi. Sıklık zarfı to be\'den SONRA gelir: is never late.',
  },
  {
    kind: 'teach',
    title: '8. İleri seviye: Durum fiilleri ve tarifeler',
    body:
      'Bazı fiiller "eylem" değil "durum" anlatır ve şu an olsa bile genelde -ing almaz: know, believe, understand, want, need, like, love, hate, belong, own, seem, mean.\n\nAyrıca resmi saat çizelgesine bağlı gelecek olaylarda (uçak, tren, ders, film) Simple Present kullanılır.',
    bullets: [
      '✅ I know the answer now. ❌ I am knowing the answer.',
      '✅ This bag belongs to me.',
      '✅ Our flight departs at 06:45 tomorrow.',
      '✅ The lesson starts at 10, so don\'t be late.',
    ],
  },
  {
    kind: 'read',
    title: 'Okuma: Biyolojik saat',
    intro: 'Kısa bir akademik paragraf oku. Öznelere ve fiillerin aldığı eklere dikkat et.',
    passage:
      'Every living organism has an internal clock. This clock controls when we feel sleepy and when we feel alert. When sunlight enters the eye, the brain stops producing melatonin. People who look at bright screens late at night rarely sleep well, because the light confuses their body.',
    passageTr:
      'Her canlı organizmanın içsel bir saati vardır. Bu saat ne zaman uykulu, ne zaman zinde hissettiğimizi kontrol eder. Güneş ışığı göze girdiğinde beyin melatonin üretmeyi durdurur. Gece geç saatte parlak ekranlara bakan insanlar nadiren iyi uyur, çünkü ışık vücutlarını şaşırtır.',
    question: '"People who look at bright screens late at night rarely sleep well" cümlesinde "sleep" neden -s almamış?',
    options: [
      'Asıl özne çoğul olan "People" — "night" değil.',
      '"rarely" kelimesinden sonra fiiller -s almaz.',
      'Cümle olumsuz olduğu için.',
      '"sleep" düzensiz bir fiil olduğu için.',
    ],
    correctAnswer: 'Asıl özne çoğul olan "People" — "night" değil.',
    explanation: 'Uzun öznelerde fiilden hemen önceki kelimeye aldanma. Cümlenin öznesi "People" (they) → sleep yalın kalır.',
  },
  {
    kind: 'teach',
    title: '9. Tuzak: Özne soruları (Who / What)',
    body:
      'Who veya What cümlenin ÖZNESİNİ soruyorsa (yani eylemi yapanı), do/does KULLANILMAZ ve fiil -s alır.\n\nAma Who/What nesneyi soruyorsa normal soru yapısı kullanılır.',
    bullets: [
      'Özne sorusu: Who lives here? (Burada kim yaşıyor?)',
      'Özne sorusu: What makes you happy? (Seni ne mutlu eder?)',
      'Nesne sorusu: Who do you know here? (Burada kimi tanıyorsun?)',
      'Nesne sorusu: What does she want? (O ne istiyor?)',
    ],
    tip: 'Cevap cümlenin öznesi mi olacak? ("Ali lives here.") → do/does yok.',
  },
  {
    kind: 'check',
    question: 'Doğru soruyu seç:',
    sentence: '"Burada en iyi İngilizceyi kim konuşuyor?"',
    options: ['Who speaks the best English here?', 'Who does speak the best English here?', 'Who do speak the best English here?', 'Who is speak the best English here?'],
    correctAnswer: 'Who speaks the best English here?',
    explanation: 'Who burada konuşan kişiyi, yani özneyi soruyor. Özne sorularında do/does yoktur ve fiil -s alır: Who speaks...?',
  },
  {
    kind: 'write',
    promptTr: 'Kardeşim hafta sonları asla erken kalkmaz.',
    instruction: 'Sıklık zarfı (never) ve 3. tekil şahıs kuralını kullanarak İngilizceye çevir.',
    hint: 'My brother never ... up early at weekends.',
    sampleIdealAnswer: 'My brother never gets up early at weekends.',
    requiredKeywords: ['never', 'gets'],
  },
  {
    kind: 'write',
    promptTr: 'Annen hangi hastanede çalışıyor?',
    instruction: 'Wh- soru kelimesi + does + yalın fiil yapısını kullan.',
    hint: 'Which hospital does ... ?',
    sampleIdealAnswer: 'Which hospital does your mother work at?',
    requiredKeywords: ['does', 'work'],
  },
  {
    kind: 'summary',
    title: 'Ders özeti',
    points: [
      'Simple Present: alışkanlık, gerçek, kalıcı durum, tarife.',
      'I/you/we/they + V1  |  he/she/it + V1-s (es / ies / has).',
      'Olumsuz & soru: don\'t/doesn\'t, do/does + YALIN fiil.',
      'Asıl fiil varsa am/is/are kullanma (❌ I am agree).',
      'Sıklık zarfı: fiilden önce, to be\'den sonra.',
      'Durum fiilleri -ing almaz; Who/What özne sorusunda do/does yok.',
    ],
  },
];

export const SEED_LESSONS: Record<string, LessonStep[]> = {
  'a1-1': SIMPLE_PRESENT_LESSON,
};

// Herhangi bir konu içeriğinden "öğret → örnek → kontrol" akışında ders üretir
export function buildLessonFromContent(content: GrammarTopicContent, title: string): LessonStep[] {
  const { lecture, drills, listening, reading, writing } = content;
  const steps: LessonStep[] = [];
  const drillQueue = [...drills];
  const exampleQueue = [...lecture.examples];

  const takeCheck = () => {
    const d = drillQueue.shift();
    if (!d) return;
    steps.push({
      kind: 'check',
      question: 'Öğrendiğini uygula — doğru seçeneği bul:',
      sentence: d.sentence,
      options: d.options,
      correctAnswer: d.correctAnswer,
      explanation: d.explanation,
    });
  };

  steps.push({ kind: 'teach', title: `1. ${title}: Genel bakış`, body: lecture.summary });

  if (lecture.formulas.length) {
    steps.push({
      kind: 'teach',
      title: '2. Yapı ve formüller',
      body: 'Bu konunun cümle kalıpları aşağıda. Her kalıbın altındaki örneği sesli okuyarak yapıyı içselleştir.',
      bullets: lecture.formulas.map(f => `${f.type}: ${f.formula}  →  ${f.example}`),
    });
  }

  lecture.deepRules.forEach((rule, i) => {
    steps.push({ kind: 'teach', title: `${i + 3}. ${rule.title.replace(/^\d+\.\s*/, '')}`, body: rule.detail });
    const ex = exampleQueue.shift();
    if (ex) steps.push({ kind: 'example', en: ex.en, tr: ex.tr, analysis: ex.analysis });
    takeCheck();
  });

  if (lecture.commonPitfalls.length) {
    steps.push({
      kind: 'teach',
      title: 'Sık yapılan hatalar',
      body: 'Aşağıdaki hatalar sınavlarda en çok puan kaybettiren tuzaklardır. Her birinin nedenini oku.',
      bullets: lecture.commonPitfalls.map(p => `❌ ${p.wrong}\n✅ ${p.right}\n💡 ${p.why}`),
    });
    takeCheck();
  }

  exampleQueue.forEach(ex => steps.push({ kind: 'example', en: ex.en, tr: ex.tr, analysis: ex.analysis }));

  const lq = listening.questions[0];
  if (lq) {
    steps.push({
      kind: 'listen',
      title: `Dinleme: ${listening.title}`,
      intro: 'Öğrendiğin yapıları kulakla tanı. Önce metni görmeden dinle.',
      audioScript: listening.audioScript,
      audioScriptTr: listening.audioScriptTr,
      question: lq.question,
      options: lq.options,
      correctAnswer: lq.correctAnswer,
      explanation: lq.explanation,
    });
  }

  takeCheck();

  const rq = reading.questions[0];
  if (rq) {
    steps.push({
      kind: 'read',
      title: `Okuma: ${reading.title}`,
      intro: 'Yapıların gerçek bir metinde nasıl kullanıldığını incele.',
      passage: reading.passage,
      passageTr: reading.passageTr,
      question: rq.question,
      options: rq.options,
      correctAnswer: rq.correctAnswer,
      explanation: rq.explanation,
    });
  }

  while (drillQueue.length) takeCheck();

  writing.slice(0, 2).forEach(w =>
    steps.push({
      kind: 'write',
      promptTr: w.promptTr,
      instruction: w.instruction,
      hint: w.targetStructureHint,
      sampleIdealAnswer: w.sampleIdealAnswer,
      requiredKeywords: w.requiredKeywords,
    })
  );

  steps.push({
    kind: 'summary',
    title: 'Ders özeti',
    points: [
      ...lecture.deepRules.map(r => r.title.replace(/^\d+\.\s*/, '')),
      ...lecture.commonPitfalls.slice(0, 2).map(p => `Dikkat: ${p.right}`),
    ],
  });

  return steps;
}

