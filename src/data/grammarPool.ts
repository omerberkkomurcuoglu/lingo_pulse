import { ALL_DEEP_GUIDES } from './grammar';
import { GRAMMAR_CURRICULUM, getOrBuildTopicContent } from './grammarCurriculum';

export type ExerciseKind = 'fill' | 'word_tiles' | 'listening' | 'reading' | 'writing';

export interface GrammarPoolQuestion {
  id: string;
  nodeId: string;
  kind: ExerciseKind;
  subSkillTag: string; // Aynı alt kuraldan farklı soru getirmek için etiket
  // 1) fill (Boşluk Doldurma)
  sentence?: string;
  sentenceTr?: string;
  options?: string[];
  correctAnswer?: string;
  // 2) word_tiles (Duolingo Tarzı Kelime Kartlarıyla Cümle Kurma)
  promptTr?: string;
  targetEn?: string;
  tiles?: string[]; // Karışık kelime kartları (doğru kelimeler + çeldiriciler)
  correctTokens?: string[];
  // 3) listening (Dinleme)
  audioEn?: string;
  audioTr?: string;
  question?: string;
  // 4) reading (Okuma Parçası)
  passageEn?: string;
  passageTr?: string;
  highlightWords?: string[];
  // 5) writing (Türkçeden İngilizceye Yazma)
  idealEn?: string;
  acceptedAnswers?: string[];
  starterHint?: string; // "Yardım Et: İlk Kelimeleri Göster"
  vocabHint?: string;   // "İpucu İste: Kelime & Kalıp İpucu"
  // Ortak alanlar
  hintTr: string;
  explanationTr: string;
  source?: 'seed' | 'gemini_db';
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

// ============================================================================
// DETAYLI KURAL ANLATIMI REHBERİ (İNTERAKTİF ANSİKLOPEDİ)
// ============================================================================
export const DEEP_GRAMMAR_GUIDES: Record<string, DeepGrammarGuide> = ALL_DEEP_GUIDES;

export function getDeepGrammarGuide(nodeId: string): DeepGrammarGuide {
  if (DEEP_GRAMMAR_GUIDES[nodeId]) {
    return DEEP_GRAMMAR_GUIDES[nodeId];
  }
  const node = GRAMMAR_CURRICULUM.find(n => n.id === nodeId);

  // Eğer Checkpoint (Tarama) ünitesiyse, kapsadığı tüm konuların detaylı kurallarını, tablolarını ve tuzaklarını birleştir!
  if (node?.type === 'checkpoint' && node.coveredTopicIds && node.coveredTopicIds.length > 0) {
    const subGuides = node.coveredTopicIds.map(id => getDeepGrammarGuide(id));
    return {
      nodeId,
      overviewTr: `${node.title}: Bu kümülatif ustalık modülünde önceki ünitelerin (${node.coveredTopicIds
        .map(id => id.toUpperCase())
        .join(', ')}) tüm çekim kurallarını, zaman bağlaçlarını ve sınav tuzaklarını adım adım tekrar edip karma oyunlarla pekiştireceksiniz.`,
      timelineVisual: `◀─── [ KÜMÜLATİF SENTEZ: ${node.coveredTopicIds.map(id => id.toUpperCase()).join(' + ')} ] ───▶`,
      conjugationRows: subGuides.flatMap(g => g.conjugationRows).slice(0, 8),
      detailedRuleBlocks: subGuides.flatMap(g => g.detailedRuleBlocks).slice(0, 6),
      spellingAndEdgeCases: subGuides.flatMap(g => g.spellingAndEdgeCases).slice(0, 5),
      signalWords: subGuides.flatMap(g => g.signalWords).slice(0, 6),
      turkishTraps: subGuides.flatMap(g => g.turkishTraps).slice(0, 6),
    };
  }

  const content = getOrBuildTopicContent(nodeId);
  return {
    nodeId,
    overviewTr: content.lecture.summary,
    timelineVisual: `◀─── [ ${node?.level || 'CEFR'} Akademik Gramer Yapısı: ${node?.title || nodeId} ] ───▶`,
    conjugationRows: [
      ...content.lecture.formulas.map(f => ({
        formType: f.type,
        subject: `${node?.level || ''} Akademik Kalıp`,
        formula: f.formula,
        exampleEn: f.example,
        exampleTr: content.lecture.examples[0]?.tr || 'Akademik ve profesyonel cümle yapısı örneği.',
      })),
      {
        formType: 'Bağlam & Uyum',
        subject: 'Ana Cümle + Yan Cümle',
        formula: `${node?.subtitle.split(',')[0] || node?.title} → Zaman & Özne Uyumu`,
        exampleEn: content.drills[0]?.sentence.replace('[_____]', content.drills[0]?.correctAnswer || '') || '',
        exampleTr: content.drills[0]?.sentenceTr || '',
      },
    ],
    detailedRuleBlocks: [
      ...content.lecture.deepRules.map((r, idx) => ({
        badge: `ADIM ${idx + 1} • DERİN KURAL ANALİZİ`,
        title: r.title,
        explanationTr: r.detail,
        formula: content.lecture.formulas[idx % content.lecture.formulas.length]?.formula || 'Subject + Auxiliary + Verb',
        examples: content.lecture.examples.map(ex => ({
          en: ex.en,
          tr: ex.tr,
          note: ex.analysis,
        })),
      })),
      {
        badge: 'ADIM 3 • CÜMLE ÇÖZÜMLEMESİ',
        title: `3. ${node?.title || ''} — Sınavlarda Doğru Şıkkı Yakalama Stratejisi`,
        explanationTr:
          content.drills
            .map((d, i) => `• Örnek ${i + 1}: "${d.sentence.replace('[_____]', d.correctAnswer)}" → ${d.explanation}`)
            .join('\n'),
        formula: `${node?.subtitle || ''}`,
        examples: content.drills.slice(0, 2).map(d => ({
          en: d.sentence.replace('[_____]', d.correctAnswer),
          tr: d.sentenceTr,
          note: d.explanation,
        })),
      },
    ],
    spellingAndEdgeCases: content.drills.map((d, idx) => ({
      rule: `Kritik Yapı #${idx + 1}: ${d.correctAnswer}`,
      examples: d.sentence.replace('[_____]', `[${d.correctAnswer}]`),
      noteTr: d.explanation,
    })),
    signalWords: [
      {
        word: node?.subtitle.split(',')[0] || 'Akademik İşaretleyiciler',
        meaningTr: `${node?.title} anahtar bağlaç ve zarfları`,
        positionRule: 'Yan cümle başında veya yardımcı fiil ile ana fiil arasında konumlanır.',
        sampleEn: content.drills[0]?.sentence.replace('[_____]', content.drills[0]?.correctAnswer || '') || '',
      },
    ],
    turkishTraps: [
      ...content.lecture.commonPitfalls.map(p => ({
        wrong: p.wrong,
        right: p.right,
        whyTr: p.why,
      })),
      ...(content.drills.slice(0, 2).map(d => ({
        wrong: d.sentence.replace('[_____]', d.options.find(o => o !== d.correctAnswer) || 'hatalı çekim'),
        right: d.sentence.replace('[_____]', d.correctAnswer),
        whyTr: d.explanation,
      }))),
    ],
  };
}

// ============================================================================
// A1-1 (SIMPLE PRESENT & TO BE) İÇİN 50 ÖZEL SORU (10x5 DUOLINGO TARZI TİP)
// ============================================================================
const A1_1_QUESTIONS: GrammarPoolQuestion[] = [
  // -------------------- 1. BOŞLUK DOLDURMA (10 SORU) --------------------
  {
    id: 'a1-1-fill-1',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'third_person_s',
    sentence: 'My sister [_____] in a multinational software company in Berlin.',
    sentenceTr: 'Kız kardeşim Berlin’de çok uluslu bir yazılım şirketinde çalışır.',
    options: ['works', 'work', 'is work', 'working'],
    correctAnswer: 'works',
    hintTr: 'Özne "My sister" (She - 3. tekil şahıs) olduğunda geniş zamanda fiile hangi ek gelir?',
    explanationTr: '"My sister" (She) 3. tekil şahıstır. Olumlu geniş zaman cümlesinde fiil "-s" takısı alır ("works"). Eylem cümlesinde "is work" kullanılmaz.',
  },
  {
    id: 'a1-1-fill-2',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'negative_doesnt',
    sentence: 'He [_____] coffee late at night because it affects his sleep.',
    sentenceTr: 'Uykusunu etkilediği için gece geç saatte kahve içmez.',
    options: ["doesn't drink", "don't drink", "doesn't drinks", "isn't drink"],
    correctAnswer: "doesn't drink",
    hintTr: '"He" öznesiyle olumsuz yaparken yardımcı fiil ne olur ve ana fiildeki "-s" takısına ne olur?',
    explanationTr: '"He" ile olumsuz cümlede "doesn\'t" kullanılır ve ana fiil yalın (V1) hale döner ("doesn\'t drink"). "doesn\'t drinks" hatalıdır.',
  },
  {
    id: 'a1-1-fill-3',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'to_be_vs_do',
    sentence: 'Why [_____] you so tired today? Do you need a break?',
    sentenceTr: 'Bugün neden bu kadar yorgunsun? Bir molaya ihtiyacın var mı?',
    options: ['are', 'do', 'is', 'does'],
    correctAnswer: 'are',
    hintTr: '"Tired" (yorgun) bir fiil değil, sıfattır! Sıfat cümlelerinde hangi yardımcı fiil kullanılır?',
    explanationTr: '"Tired" (yorgun) bir sıfattır, eylem bildirmez. Bu yüzden "do you tired" denmez, "are you tired" denir.',
  },
  {
    id: 'a1-1-fill-4',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'stative_verbs',
    sentence: 'I [_____] with your proposal completely; it is very logical.',
    sentenceTr: 'Önerine tamamen katılıyorum; çok mantıklı.',
    options: ['agree', 'am agree', 'agrees', 'am agreeing'],
    correctAnswer: 'agree',
    hintTr: 'Dikkat! "Agree" bir sıfat değil, fiildir. Başına "am" gelir mi?',
    explanationTr: 'Türk öğrencilerin en sık yaptığı hata "I am agree" demektir. "Agree" bir fiildir, bu yüzden doğrudan "I agree" kullanılır.',
  },
  {
    id: 'a1-1-fill-5',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'indefinite_pronouns',
    sentence: 'Everyone in our department [_____] the security password regularly.',
    sentenceTr: 'Departmanımızdaki herkes güvenlik şifresini düzenli olarak günceller.',
    options: ['updates', 'update', 'are updating', 'is update'],
    correctAnswer: 'updates',
    hintTr: '"Everyone / Everybody" gramer olarak tekil mi yoksa çoğul mu kabul edilir?',
    explanationTr: '"Everyone, everybody, someone, nobody" özneleri her zaman TEKİL (He/She) kabul edilir ve fiil "-s" takısı alır ("updates").',
  },
  {
    id: 'a1-1-fill-6',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'question_does',
    sentence: 'What time [_____] the first train to Oxford leave in the morning?',
    sentenceTr: 'Sabah Oxford’a giden ilk tren saat kaçta kalkıyor?',
    options: ['does', 'do', 'is', 'are'],
    correctAnswer: 'does',
    hintTr: 'Özne "the first train" (It - tekil) ve ana fiil "leave" (kalkmak/ayrılmak).',
    explanationTr: '"The first train" (It) tekil öznedir ve cümlede "leave" eylem fiili vardır. Soru yaparken "does" kullanılır.',
  },
  {
    id: 'a1-1-fill-7',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'adverb_never',
    sentence: 'My manager [_____] late for morning briefings; he is very punctual.',
    sentenceTr: 'Yöneticim sabah toplantılarına asla geç kalmaz; çok dakiktir.',
    options: ['is never', 'never is', "doesn't never", "isn't never"],
    correctAnswer: 'is never',
    hintTr: 'Sıklık zarfları (always, never) "am/is/are" yardımcı fiilinden önce mi sonra mı gelir?',
    explanationTr: '"Be late" yapısında "is" kullanılır. Sıklık zarfları (never, always) "am/is/are"dan SONRA gelir: "is never late".',
  },
  {
    id: 'a1-1-fill-8',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'spelling_ies',
    sentence: 'A good researcher always [_____] the primary sources before writing.',
    sentenceTr: 'İyi bir araştırmacı yazmadan önce her zaman birincil kaynakları inceler.',
    options: ['studies', 'studys', 'study', 'is study'],
    correctAnswer: 'studies',
    hintTr: '"Study" fiili "ünsüz + y" ile bitiyor. Tekil öznede nasıl yazılır?',
    explanationTr: '"A good researcher" (He/She) tekildir. Sonu "ünsüz + y" ile biten "study" fiilinde "-y" düşer ve "-ies" eklenir ("studies").',
  },
  {
    id: 'a1-1-fill-9',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'have_has',
    sentence: 'This laptop [_____] a very powerful battery, so it lasts all day.',
    sentenceTr: 'Bu dizüstü bilgisayarın çok güçlü bir bataryası var, bu yüzden tüm gün dayanır.',
    options: ['has', 'have', 'haves', 'is have'],
    correctAnswer: 'has',
    hintTr: '"This laptop" (It) tekil öznesiyle "have" fiili nasıl çekimlenir?',
    explanationTr: '3. tekil şahıslarda (He/She/It) "have" fiili düzensizdir ve "has" olur ("haves" diye bir kullanım yoktur).',
  },
  {
    id: 'a1-1-fill-10',
    nodeId: 'a1-1',
    kind: 'fill',
    subSkillTag: 'stative_verbs',
    sentence: 'Excuse me, [_____] this leather bag belong to you?',
    sentenceTr: 'Affedersiniz, bu deri çanta size mi ait?',
    options: ['does', 'is', 'do', 'are'],
    correctAnswer: 'does',
    hintTr: '"Belong" (ait olmak) bir durum fiilidir ve "this leather bag" (It) tekildir.',
    explanationTr: '"Belong" bir fiildir ve "-ing" almaz. Özne "this leather bag" (It) tekil olduğu için soru "Does this leather bag belong...?" şeklinde kurulur.',
  },

  // -------------------- 2. KELİME KARTLARIYLA CÜMLE KURMA (10 SORU) --------------------
  {
    id: 'a1-1-tiles-1',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'third_person_s',
    promptTr: 'O, hafta sonları genellikle erken uyanır.',
    targetEn: 'She usually wakes up early on weekends',
    correctTokens: ['She', 'usually', 'wakes', 'up', 'early', 'on', 'weekends'],
    tiles: ['She', 'usually', 'wakes', 'up', 'early', 'on', 'weekends', 'wake', 'is'],
    hintTr: 'Özne (She) + Sıklık zarfı (usually) + Fiil (-s takılı: wakes up) + Zaman.',
    explanationTr: 'Sıklık zarfı "usually" ana fiilden önce gelir ve özne "She" olduğu için fiil "wakes up" olur.',
  },
  {
    id: 'a1-1-tiles-2',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'negative_doesnt',
    promptTr: 'Erkek kardeşim büyük şehirlerde yaşamayı sevmez.',
    targetEn: 'My brother does not like living in big cities',
    correctTokens: ['My', 'brother', 'does', 'not', 'like', 'living', 'in', 'big', 'cities'],
    tiles: ['My', 'brother', 'does', 'not', 'like', 'living', 'in', 'big', 'cities', 'likes', 'do'],
    hintTr: '"My brother" (He) olduğu için "does not" + yalın fiil ("like") kullanın.',
    explanationTr: 'Olumsuz cümlede "does not" kullanıldığı için "likes" değil yalın "like" seçilir.',
  },
  {
    id: 'a1-1-tiles-3',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'question_does',
    promptTr: 'Toplantı her sabah saat dokuzda mı başlar?',
    targetEn: 'Does the meeting start at nine every morning',
    correctTokens: ['Does', 'the', 'meeting', 'start', 'at', 'nine', 'every', 'morning'],
    tiles: ['Does', 'the', 'meeting', 'start', 'at', 'nine', 'every', 'morning', 'starts', 'Is'],
    hintTr: 'Eylem sorusu olduğu için "Does" ile başlayın ve fiili yalın ("start") kullanın.',
    explanationTr: '"The meeting" (It) tekil öznedir; soru "Does" ile başlar ve "starts" yerine yalın "start" gelir.',
  },
  {
    id: 'a1-1-tiles-4',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'to_be_vs_do',
    promptTr: 'Onlar şu anda ofiste değiller.',
    targetEn: 'They are not at the office right now',
    correctTokens: ['They', 'are', 'not', 'at', 'the', 'office', 'right', 'now'],
    tiles: ['They', 'are', 'not', 'at', 'the', 'office', 'right', 'now', 'do', 'is'],
    hintTr: 'Cümlede eylem fiili yok ("ofiste değiller" bir durum/yer cümlesidir).',
    explanationTr: 'Yer ve durum bildiren cümlelerde "do not" değil, "are not" (To Be) kullanılır.',
  },
  {
    id: 'a1-1-tiles-5',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'stative_verbs',
    promptTr: 'Bu karmaşık problemi çok iyi anlıyorum.',
    targetEn: 'I understand this complex problem very well',
    correctTokens: ['I', 'understand', 'this', 'complex', 'problem', 'very', 'well'],
    tiles: ['I', 'understand', 'this', 'complex', 'problem', 'very', 'well', 'am', 'understanding'],
    hintTr: '"Understand" durum fiilidir; başına "am" veya sonuna "-ing" almaz!',
    explanationTr: 'Türkçede "anlıyorum" dense bile "understand" durum fiili olduğu için "I understand" şeklinde kurulur.',
  },
  {
    id: 'a1-1-tiles-6',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'adverb_never',
    promptTr: 'O, iş arkadaşlarına asla yalan söylemez.',
    targetEn: 'He never tells lies to his colleagues',
    correctTokens: ['He', 'never', 'tells', 'lies', 'to', 'his', 'colleagues'],
    tiles: ['He', 'never', 'tells', 'lies', 'to', 'his', 'colleagues', 'tell', 'does'],
    hintTr: '"Never" olumlu cümle yapısıyla kullanılır, bu yüzden "He" öznesiyle fiil "-s" alır ("tells").',
    explanationTr: '"Never" cümlede kendi başına olumsuzluk verir; "doesn\'t" kullanılmaz ve fiil "tells" olarak çekimlenir.',
  },
  {
    id: 'a1-1-tiles-7',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'question_does',
    promptTr: 'Hafta sonları boş zamanlarında ne yaparsın?',
    targetEn: 'What do you do in your free time on weekends',
    correctTokens: ['What', 'do', 'you', 'do', 'in', 'your', 'free', 'time', 'on', 'weekends'],
    tiles: ['What', 'do', 'you', 'do', 'in', 'your', 'free', 'time', 'on', 'weekends', 'are'],
    hintTr: 'İlk "do" soru yardımcı fiili, ikinci "do" ise "yapmak" ana fiilidir: "What do you do...?"',
    explanationTr: '"What do you do?" kalıbında ilk "do" geniş zaman soru yardımcısı, ikinci "do" ise ana eylem fiilidir.',
  },
  {
    id: 'a1-1-tiles-8',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'have_has',
    promptTr: 'Şirketimizin üç farklı ülkede ofisi var.',
    targetEn: 'Our company has offices in three different countries',
    correctTokens: ['Our', 'company', 'has', 'offices', 'in', 'three', 'different', 'countries'],
    tiles: ['Our', 'company', 'has', 'offices', 'in', 'three', 'different', 'countries', 'have', 'is'],
    hintTr: '"Our company" (It - tekil şirket) olduğu için sahiplik fiili "has" olur.',
    explanationTr: '"Our company" tekil bir kurumdur (It), bu nedenle "have" yerine "has" kullanılır.',
  },
  {
    id: 'a1-1-tiles-9',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'to_be_vs_do',
    promptTr: 'Yeni proje yöneticimiz oldukça deneyimli ve yardımseverdir.',
    targetEn: 'Our new project manager is quite experienced and helpful',
    correctTokens: ['Our', 'new', 'project', 'manager', 'is', 'quite', 'experienced', 'and', 'helpful'],
    tiles: ['Our', 'new', 'project', 'manager', 'is', 'quite', 'experienced', 'and', 'helpful', 'does', 'are'],
    hintTr: 'Sıfat cümlesi olduğu için tekil özneyle "is" kullanılır.',
    explanationTr: '"Experienced" ve "helpful" sıfattır; tekil özne ("Our new project manager") ile "is" bağlacı kullanılır.',
  },
  {
    id: 'a1-1-tiles-10',
    nodeId: 'a1-1',
    kind: 'word_tiles',
    subSkillTag: 'third_person_s',
    promptTr: 'Dünya Güneş’in etrafında döner.',
    targetEn: 'The Earth revolves around the Sun',
    correctTokens: ['The', 'Earth', 'revolves', 'around', 'the', 'Sun'],
    tiles: ['The', 'Earth', 'revolves', 'around', 'the', 'Sun', 'revolve', 'is'],
    hintTr: 'Doğa yasaları ve bilimsel gerçekler Simple Present ve tekil "-s" takısıyla ifade edilir.',
    explanationTr: '"The Earth" (It) tekildir ve bilimsel bir gerçek anlatıldığı için fiil "-s" alır ("revolves").',
  },

  // -------------------- 3. LISTENING / DİNLEME (10 SORU) --------------------
  {
    id: 'a1-1-listen-1',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'negative_doesnt',
    audioEn: 'Sarah doesn’t take the subway on rainy days; she prefers taking a taxi to work.',
    audioTr: 'Sarah yağmurlu günlerde metroya binmez; işe taksiyle gitmeyi tercih eder.',
    question: 'Dinlediğiniz cümleye göre Sarah yağmurlu günlerde ne yapar?',
    options: [
      'Metroya binmez, işe taksiyle gitmeyi tercih eder.',
      'Her zaman metroyla işe gider.',
      'Yağmurlu günlerde evden çalışır.',
      'Kendi arabasıyla ofise gider.',
    ],
    correctAnswer: 'Metroya binmez, işe taksiyle gitmeyi tercih eder.',
    hintTr: '"doesn’t take the subway" ve "prefers taking a taxi" ifadelerine odaklanın.',
    explanationTr: 'Ses kaydında olumsuz geniş zaman ("doesn’t take") ve tercih bildiren geniş zaman ("prefers") kullanılmıştır.',
  },
  {
    id: 'a1-1-listen-2',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'third_person_s',
    audioEn: 'The library opens at eight thirty in the morning and closes at ten at night.',
    audioTr: 'Kütüphane sabah 8:30’da açılır ve gece 10’da kapanır.',
    question: 'Dinlediğiniz cümlede hangi gramer yapısı ve anlam kullanılmıştır?',
    options: [
      'Resmi açılış/kapanış saatleri — opens & closes (Simple Present)',
      'Geçmişte tamamlanmış bir olay — opened & closed',
      'Şu anda yapılan geçici eylem — is opening',
      'Gelecek tahmini — will open',
    ],
    correctAnswer: 'Resmi açılış/kapanış saatleri — opens & closes (Simple Present)',
    hintTr: 'Kurumların sabit çalışma saatleri hangi zamanla anlatılır?',
    explanationTr: 'Sabit çizelgeler ve çalışma saatleri Simple Present ("opens / closes") ile ifade edilir.',
  },
  {
    id: 'a1-1-listen-3',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'stative_verbs',
    audioEn: 'I really appreciate your help, but I don’t need any extra equipment right now.',
    audioTr: 'Yardımını gerçekten takdir ediyorum ama şu anda ekstra bir ekipmana ihtiyacım yok.',
    question: 'Konuşmacının kullandığı doğru İngilizce olumsuz ifade hangisidir?',
    options: [
      "I don't need any extra equipment",
      'I am not needing any extra equipment',
      "I doesn't need any extra equipment",
      'I not need any extra equipment',
    ],
    correctAnswer: "I don't need any extra equipment",
    hintTr: '"Need" durum fiilidir ve "I" öznesiyle olumsuz nasıl yapılır?',
    explanationTr: '"Need" durum fiili olduğu için "right now" ile bile "I don\'t need" şeklinde kullanılır.',
  },
  {
    id: 'a1-1-listen-4',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'question_does',
    audioEn: 'How often does your team organize international workshops during the year?',
    audioTr: 'Ekibiniz yıl boyunca ne sıklıkla uluslararası atölyeler düzenliyor?',
    question: 'Soruda neden "do" yerine "does" yardımcı fiili kullanılmıştır?',
    options: [
      'Özne "your team" (It) tekil bir grup adı olduğu için.',
      '"Workshops" kelimesi çoğul olduğu için.',
      'Cümle geçmiş zamanda olduğu için.',
      '"Organize" fiili durum fiili olduğu için.',
    ],
    correctAnswer: 'Özne "your team" (It) tekil bir grup adı olduğu için.',
    hintTr: 'Soru yardımcı fiilini belirleyen şey nesne ("workshops") değil, öznedir ("your team").',
    explanationTr: '"Your team" tekil bir birim (It) olarak değerlendirilir, bu yüzden "How often does your team organize...?" kullanılır.',
  },
  {
    id: 'a1-1-listen-5',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'to_be_vs_do',
    audioEn: 'Are the new laboratory results ready, or do we need to wait until tomorrow?',
    audioTr: 'Yeni laboratuvar sonuçları hazır mı, yoksa yarına kadar beklememiz mi gerekiyor?',
    question: 'Cümlenin ilk yarısında "Are", ikinci yarısında "do" kullanılmasının sebebi nedir?',
    options: [
      'İlk yarıda "ready" sıfattır (Durum: Are), ikinci yarıda "need" fiildir (Eylem/Fiil: do).',
      'İkisi de tamamen rastgele seçilmiştir.',
      'İlk yarı geçmiş zaman, ikinci yarı gelecek zamandır.',
      '"Results" tekil bir kelimedir.',
    ],
    correctAnswer: 'İlk yarıda "ready" sıfattır (Durum: Are), ikinci yarıda "need" fiildir (Eylem/Fiil: do).',
    hintTr: '"Ready" (hazır) sıfatıyla ve "need" (ihtiyaç duymak) fiiliyle kurulan soruların farkını hatırlayın.',
    explanationTr: '"Ready" sıfat olduğu için "Are the results ready?", "need" fiil olduğu için "do we need?" kullanılır.',
  },
  {
    id: 'a1-1-listen-6',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'adverb_never',
    audioEn: 'David seldom checks his personal emails during working hours.',
    audioTr: 'David mesai saatleri içinde kişisel e-postalarını nadiren kontrol eder.',
    question: 'Dinlediğiniz cümledeki "seldom" kelimesinin anlamı ve gramer etkisi nedir?',
    options: [
      '"Nadiren" demektir; cümleye yarı-olumsuz anlam katar ve olumlu fiil çekimiyle (checks) kullanılır.',
      '"Her zaman" demektir; olumsuz fiille kullanılır.',
      '"Şu anda" demektir; sadece şimdiki zamanda kullanılır.',
      '"Hiçbir yer" demektir.',
    ],
    correctAnswer: '"Nadiren" demektir; cümleye yarı-olumsuz anlam katar ve olumlu fiil çekimiyle (checks) kullanılır.',
    hintTr: 'Seldom / rarely / never gibi zarflar fiilin "-s" takısını düşürür mü?',
    explanationTr: '"Seldom" (nadiren) ana fiilden önce gelir ve özne "David" olduğu için fiil "checks" olarak çekimlenir.',
  },
  {
    id: 'a1-1-listen-7',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'indefinite_pronouns',
    audioEn: 'Nobody in this room knows the exact date of the final inspection.',
    audioTr: 'Bu odadaki hiç kimse son denetimin kesin tarihini bilmiyor.',
    question: 'Dinlediğiniz cümlede "Nobody" öznesinden sonra fiil nasıl çekimlenmiştir?',
    options: [
      'Tekil özne kabul edildiği için "knows" (-s takılı) ve olumlu yapıda kullanılmıştır.',
      '"doesn\'t know" şeklinde olumsuz yardımcı fiille kullanılmıştır.',
      'Çoğul kabul edildiği için "know" şeklinde kullanılmıştır.',
      '"is knowing" şeklinde kullanılmıştır.',
    ],
    correctAnswer: 'Tekil özne kabul edildiği için "knows" (-s takılı) ve olumlu yapıda kullanılmıştır.',
    hintTr: '"Nobody" hem tekildir hem de kendi içinde olumsuz anlam taşır!',
    explanationTr: '"Nobody" tekildir ("knows") ve kendisi olumsuz olduğu için "doesn\'t" ile birlikte kullanılmaz.',
  },
  {
    id: 'a1-1-listen-8',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'have_has',
    audioEn: 'Does the new apartment have a balcony overlooking the park?',
    audioTr: 'Yeni dairenin parka bakan bir balkonu var mı?',
    question: 'Soruda neden "has" yerine "have" kullanılmıştır?',
    options: [
      'Soruda "Does" yardımcı fiili kullanıldığı için ana fiil yalın hali olan "have"e dönmüştür.',
      '"The new apartment" çoğul bir özne olduğu için.',
      'Cümle geçmiş zamanda olduğu için.',
      'Balkon kelimesi tekil olduğu için.',
    ],
    correctAnswer: 'Soruda "Does" yardımcı fiili kullanıldığı için ana fiil yalın hali olan "have"e dönmüştür.',
    hintTr: '"Does" mıknatıs kuralını hatırlayın: "has" fiili soruda neye dönüşür?',
    explanationTr: 'Olumluda "The apartment has..." denir; ancak soruda "Does" geldiği için "has" yalın hali olan "have"e döner.',
  },
  {
    id: 'a1-1-listen-9',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'spelling_ies',
    audioEn: 'Our logistics partner carries fragile medical supplies across Europe every week.',
    audioTr: 'Lojistik ortağımız her hafta Avrupa genelinde kırılabilir tıbbi malzemeler taşır.',
    question: 'Seslendirilen cümlede "taşıma" fiili hangi yazılışla kullanılmıştır?',
    options: ['carries', 'carrys', 'carry', 'is carry'],
    correctAnswer: 'carries',
    hintTr: '"Carry" fiili ünsüz + y ile biter ve özne "Our logistics partner" (It) tekildir.',
    explanationTr: '"Carry" fiili 3. tekil şahısta "-y" harfini düşürerek "carries" olur.',
  },
  {
    id: 'a1-1-listen-10',
    nodeId: 'a1-1',
    kind: 'listening',
    subSkillTag: 'stative_verbs',
    audioEn: 'This homemade soup tastes delicious; what spices do you put in it?',
    audioTr: 'Bu ev yapımı çorbanın tadı harika; içine hangi baharatları koyuyorsun?',
    question: 'Cümlede "tastes" fiilinin geniş zamanda kullanılmasının nedeni nedir?',
    options: [
      'Bir şeyin kalıcı tadını/özelliğini (durum) bildirdiği için Simple Present kullanılır.',
      'Geçmişte yapılmış bir çorba olduğu için.',
      'Gelecek zaman anlamı taşıdığı için.',
      'Emir cümlesi olduğu için.',
    ],
    correctAnswer: 'Bir şeyin kalıcı tadını/özelliğini (durum) bildirdiği için Simple Present kullanılır.',
    hintTr: '"Taste" fiili "tadı ... olmak" anlamında durum (stative) fiilidir.',
    explanationTr: 'Çorbanın tadının güzel olması bir durumdur ("tastes delicious"), bu yüzden "-ing" almaz.',
  },

  // -------------------- 4. READING / OKUMA & ANALİZ (10 SORU) --------------------
  {
    id: 'a1-1-read-1',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'third_person_s',
    passageEn:
      'Dr. Elena Vance is a marine biologist. She lives in a small coastal town in Norway. Every morning, she wakes up at 6:00 AM, checks the weather radar, and prepares her diving equipment. She doesn’t work in a traditional office; the ocean is her laboratory.',
    passageTr:
      'Dr. Elena Vance bir deniz biyoloğudur. Norveç’te küçük bir sahil kasabasında yaşar. Her sabah 06:00’da uyanır, hava radarını kontrol eder ve dalış ekipmanını hazırlar. Geleneksel bir ofiste çalışmaz; okyanus onun laboratuvarıdır.',
    highlightWords: ['is', 'lives', 'wakes up', 'checks', 'prepares', 'doesn’t work'],
    question: 'Parçadaki "the ocean is her laboratory" cümlesinde neden "does" yerine "is" kullanılmıştır?',
    options: [
      'Cümlede bir eylem/hareket fiili yoktur; okyanusun ne olduğu (isim/durum) tanımlanmaktadır.',
      '"Ocean" kelimesi çoğul olduğu için.',
      'Cümle olumsuz olduğu için.',
      'Soru cümlesi olduğu için.',
    ],
    correctAnswer: 'Cümlede bir eylem/hareket fiili yoktur; okyanusun ne olduğu (isim/durum) tanımlanmaktadır.',
    hintTr: '"Okyanus onun laboratuvarıdır" cümlesinde hareket bildiren bir fiil var mı?',
    explanationTr: 'İsim ve tanım cümlelerinde ("Okyanus onun laboratuvarıdır") eylem fiili olmadığı için "To Be" (is) kullanılır.',
  },
  {
    id: 'a1-1-read-2',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'stative_verbs',
    passageEn:
      'Many tourists think that desert nights are warm, but the temperature actually drops rapidly after sunset. Experienced travelers know this fact and always pack warm wool jackets in their backpacks.',
    passageTr:
      'Pek çok turist çöl gecelerinin sıcak olduğunu düşünür, ancak sıcaklık aslında gün batımından sonra hızla düşer. Deneyimli gezginler bu gerçeği bilir ve sırt çantalarına her zaman sıcak tutan yün ceketler koyar.',
    highlightWords: ['think', 'are', 'drops', 'know', 'always pack'],
    question: 'Metinde "the temperature actually drops" ifadesinde "drop" fiiline "-s" gelmesinin nedeni nedir?',
    options: [
      'Özne "the temperature" (It - tekil) olduğu ve doğa gerçeği anlatıldığı için.',
      '"Drops" çoğul bir isim olduğu için.',
      '"Actually" kelimesi fiile "-s" eklediği için.',
      'Özne "Many tourists" olduğu için.',
    ],
    correctAnswer: 'Özne "the temperature" (It - tekil) olduğu ve doğa gerçeği anlatıldığı için.',
    hintTr: 'İkinci cümlenin öznesi "the temperature" (sıcaklık - tekil) kelimesidir.',
    explanationTr: '"The temperature" (It) 3. tekil şahıstır ve genel bir doğa olayı anlatıldığı için "drops" kullanılır.',
  },
  {
    id: 'a1-1-read-3',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'negative_doesnt',
    passageEn:
      'In Japan, trains rarely arrive late. Even a two-minute delay causes an official apology from the railway company. Commuters trust the schedule completely because the system works with remarkable precision.',
    passageTr:
      'Japonya’da trenler nadiren geç gelir. İki dakikalık bir gecikme bile demiryolu şirketinden resmi bir özür gelmesine neden olur. Yolcular tarifeye tamamen güvenir çünkü sistem olağanüstü bir hassasiyetle çalışır.',
    highlightWords: ['rarely arrive', 'causes', 'trust', 'works'],
    question: '"Even a two-minute delay causes..." cümlesinde fiilin tekil ("causes") çekimlenmesinin nedeni nedir?',
    options: [
      'Özne "a two-minute delay" (iki dakikalık bir gecikme - It) tekil bir isimdir.',
      '"Two-minute" çoğul bir özne olduğu için.',
      'Cümle geçmiş zamanda olduğu için.',
      '"Even" zarfı her zaman tekil fiil gerektirdiği için.',
    ],
    correctAnswer: 'Özne "a two-minute delay" (iki dakikalık bir gecikme - It) tekil bir isimdir.',
    hintTr: 'Başındaki "a" artikeline dikkat edin: "a ... delay" (bir gecikme).',
    explanationTr: '"A two-minute delay" (bir gecikme) tekildir (It), bu nedenle fiil "causes" olarak çekimlenir.',
  },
  {
    id: 'a1-1-read-4',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'to_be_vs_do',
    passageEn:
      '“Are you the new software architect?” asks Lucas. “Yes, I am,” replies Maya. “I design cloud security systems, but I don’t write frontend code. My colleague Daniel handles the user interface.”',
    passageTr:
      '“Yeni yazılım mimarı siz misiniz?” diye sorar Lucas. “Evet, benim,” diye yanıtlar Maya. “Bulut güvenlik sistemleri tasarlarım ama önyüz kodu yazmam. İş arkadaşım Daniel kullanıcı arayüzüyle ilgilenir.”',
    highlightWords: ['Are you', 'I am', 'I design', 'I don’t write', 'handles'],
    question: 'Diyalogda Lucas’ın sorusuna Maya neden "Yes, I do" yerine "Yes, I am" diye cevap vermiştir?',
    options: [
      'Soru "Are you...?" (To Be) ile sorulduğu için kısa cevap da "Yes, I am" olmalıdır.',
      'Maya bir eylem yaptığı için.',
      '"I do" sadece olumsuz cümlelerde kullanıldığı için.',
      'Soru geçmiş zamanda sorulduğu için.',
    ],
    correctAnswer: 'Soru "Are you...?" (To Be) ile sorulduğu için kısa cevap da "Yes, I am" olmalıdır.',
    hintTr: 'Soru hangi yardımcı fiille sorulursa kısa cevap da o yardımcı fiille verilir!',
    explanationTr: '"Are you...?" sorusunun kısa olumlu yanıtı "Yes, I am", "Do you...?" sorusunun yanıtı ise "Yes, I do"dur.',
  },
  {
    id: 'a1-1-read-5',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'spelling_ies',
    passageEn:
      'Every autumn, the Arctic tern flies thousands of kilometers from the northern hemisphere to Antarctica. It enjoys more daylight than any other creature on Earth because it experiences two summers every year.',
    passageTr:
      'Her sonbahar, Kuzey kutup sumrusu kuzey yarımküreden Antarktika’ya binlerce kilometre uçar. Dünyadaki diğer tüm canlılardan daha fazla gün ışığının tadını çıkarır çünkü her yıl iki yaz yaşar.',
    highlightWords: ['flies', 'enjoys', 'experiences'],
    question: 'Metinde "fly" fiili "flies" olurken, "enjoy" fiili neden "enjoies" değil de "enjoys" olmuştur?',
    options: [
      '"Fly" ünsüz+y (l+y) ile bittiği için -ies alır; "enjoy" ise ünlü+y (o+y) ile bittiği için sadece -s alır.',
      '"Enjoy" düzensiz bir fiil olduğu için.',
      '"Flies" çoğul bir özneyle kullanıldığı için.',
      'İkisi arasında hiçbir kural farkı yoktur.',
    ],
    correctAnswer: '"Fly" ünsüz+y (l+y) ile bittiği için -ies alır; "enjoy" ise ünlü+y (o+y) ile bittiği için sadece -s alır.',
    hintTr: '"y" harfinden hemen önceki harfin ünlü mü ünsüz mü olduğuna bakın!',
    explanationTr: 'Ünsüz + y -> -ies (fly -> flies, study -> studies). Ünlü + y -> -s (enjoy -> enjoys, play -> plays).',
  },
  {
    id: 'a1-1-read-6',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'indefinite_pronouns',
    passageEn:
      'In our research group, everybody contributes to the weekly report, but nobody wants to present it on Friday afternoon. Therefore, our professor chooses a different presenter each week.',
    passageTr:
      'Araştırma grubumuzda herkes haftalık rapora katkıda bulunur, ancak hiç kimse onu cuma öğleden sonra sunmak istemez. Bu nedenle profesörümüz her hafta farklı bir sunucu seçer.',
    highlightWords: ['everybody contributes', 'nobody wants', 'chooses'],
    question: 'Metindeki "everybody contributes" ve "nobody wants" yapılarından hangi kural çıkarılır?',
    options: [
      'Everybody ve nobody gibi belgisiz zamirler her zaman tekil fiil (-s takısı) alır.',
      'Everybody çoğul, nobody tekil fiil alır.',
      'Nobody kelimesinden sonra "doesn\'t" kullanmak zorunludur.',
      'Bu kelimeler sadece geçmiş zamanda kullanılır.',
    ],
    correctAnswer: 'Everybody ve nobody gibi belgisiz zamirler her zaman tekil fiil (-s takısı) alır.',
    hintTr: 'İki zamirden sonra gelen fiillere dikkat edin: "contributes" ve "wants".',
    explanationTr: 'Belgisiz zamirler (everyone, everybody, someone, nobody) gramerce 3. tekil şahıs (He/She) gibi çekimlenir.',
  },
  {
    id: 'a1-1-read-7',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'have_has',
    passageEn:
      'Does a cactus need water every day? No, it doesn’t. Unlike tropical plants, a desert cactus has thick stems that store water for months, so it survives in extreme heat.',
    passageTr:
      'Bir kaktüsün her gün suya ihtiyacı var mıdır? Hayır, yoktur. Tropikal bitkilerin aksine, çöl kaktüsünün aylarca su depolayan kalın gövdeleri vardır, bu sayede aşırı sıcakta hayatta kalır.',
    highlightWords: ['Does a cactus need', 'has', 'store', 'survives'],
    question: 'Metindeki "thick stems that store water" kısmında "store" fiili neden "-s" takısı almamıştır?',
    options: [
      '"That" kelimesi çoğul olan "thick stems" (kalın gövdeler) ismini nitelediği için fiil çoğul (store) çekimlenmiştir.',
      'Cümle soru cümlesi olduğu için.',
      '"Store" durum fiili olduğu için.',
      'Öncesinde "doesn\'t" olduğu için.',
    ],
    correctAnswer: '"That" kelimesi çoğul olan "thick stems" (kalın gövdeler) ismini nitelediği için fiil çoğul (store) çekimlenmiştir.',
    hintTr: ' suyu depolayan şey "bir kaktüs" mü yoksa çoğul olan "kalın gövdeler (stems)" mi?',
    explanationTr: '"Stems" çoğul olduğu için onu niteleyen "that store" yapısında fiil yalın kalır.',
  },
  {
    id: 'a1-1-read-8',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'question_does',
    passageEn:
      '“Where do your parents live?” asks Clara. “They live in Izmir during the winter, but my father spends the entire summer in his olive grove because he produces organic olive oil.”',
    passageTr:
      '“Ailen (anne-baban) nerede yaşıyor?” diye sorar Clara. “Kışın İzmir’de yaşıyorlar ama babam organik zeytinyağı ürettiği için tüm yazı zeytinliğinde geçiriyor.”',
    highlightWords: ['do your parents live', 'They live', 'spends', 'produces'],
    question: 'Soruda "your parents" için "do", cevapta "my father" için "spends" kullanılmasının sebebi nedir?',
    options: [
      '"Your parents" (anne ve baba = They) çoğuldur; "my father" (He) ise tekildir.',
      '"Parents" tekil bir kelimedir.',
      'İzmir kelimesi çoğul fiil gerektirir.',
      '"Spend" fiili her zaman "-s" ile yazılır.',
    ],
    correctAnswer: '"Your parents" (anne ve baba = They) çoğuldur; "my father" (He) ise tekildir.',
    hintTr: '"Parents" (ebeveynler - çoğul) vs. "Father" (baba - tekil).',
    explanationTr: 'Çoğul özne ("parents") "do / live" alırken, tekil özne ("my father") "spends / produces" alır.',
  },
  {
    id: 'a1-1-read-9',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'adverb_never',
    passageEn:
      'Coffee contains caffeine, which stimulates the central nervous system. However, decaffeinated coffee doesn’t have the same effect, so many people drink it in the evening.',
    passageTr:
      'Kahve, merkezi sinir sistemini uyaran kafein içerir. Ancak kafeinsiz kahve aynı etkiye sahip değildir, bu yüzden pek çok insan onu akşamları içer.',
    highlightWords: ['contains', 'stimulates', 'doesn’t have', 'drink'],
    question: 'Metinde "decaffeinated coffee" (kafeinsiz kahve) nasıl bir öznedir ve olumsuzda nasıl çekimlenmiştir?',
    options: [
      'Sayılamayan (Uncountable - It) tekil öznedir; olumsuzda "doesn’t have" ile çekimlenmiştir.',
      'Çoğul öznedir; "don’t have" ile çekimlenmiştir.',
      'Durum sıfatıdır; "isn’t have" ile çekimlenmiştir.',
      'Geçmiş zaman öznesidir.',
    ],
    correctAnswer: 'Sayılamayan (Uncountable - It) tekil öznedir; olumsuzda "doesn’t have" ile çekimlenmiştir.',
    hintTr: 'Sıvılar ve sayılamayan maddeler (water, coffee, information) her zaman "It" (tekil) kabul edilir!',
    explanationTr: 'Sayılamayan isimler (coffee, water, money) tekil kabul edilir: olumluda "contains", olumsuzda "doesn\'t have" alır.',
  },
  {
    id: 'a1-1-read-10',
    nodeId: 'a1-1',
    kind: 'reading',
    subSkillTag: 'stative_verbs',
    passageEn:
      'This contract seems completely fair to both parties. It includes clear payment terms and doesn’t require any hidden fees.',
    passageTr:
      'Bu sözleşme her iki taraf için de tamamen adil görünüyor. Net ödeme koşulları içeriyor ve hiçbir gizli ücret gerektirmiyor.',
    highlightWords: ['seems', 'includes', 'doesn’t require'],
    question: 'Türkçeye "adil görünüyor, içeriyor, gerektirmiyor" diye "-yor" ile çevrilmesine rağmen neden tüm fiiller Simple Present’tir?',
    options: [
      '"Seem, include, require" durum (stative) fiilleridir; anlık hareket değil kalıcı nitelik bildirirler ve "-ing" almazlar.',
      'Sözleşme geçmişte imzalandığı için.',
      'İngilizcede "-ing" eki hiç kullanılmadığı için.',
      'Cümle emir kipiyle yazıldığı için.',
    ],
    correctAnswer: '"Seem, include, require" durum (stative) fiilleridir; anlık hareket değil kalıcı nitelik bildirirler ve "-ing" almazlar.',
    hintTr: 'Durum bildiren (görünmek, içermek, gerektirmek) fiillerin altın kuralını hatırlayın.',
    explanationTr: 'Durum fiilleri (seem, include, contain, require, belong) Türkçeye "-yor" ile çevrilse de İngilizcede Simple Present ile yazılır.',
  },

  // -------------------- 5. WRITING / TÜRKÇEDEN İNGİLİZCEYE YAZMA (10 SORU) --------------------
  {
    id: 'a1-1-write-1',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'third_person_s',
    promptTr: 'Kız kardeşim her sabah kahve içer.',
    idealEn: 'My sister drinks coffee every morning.',
    acceptedAnswers: [
      'my sister drinks coffee every morning',
      'every morning my sister drinks coffee',
    ],
    starterHint: 'My sister drinks ...',
    vocabHint: 'kız kardeşim = my sister | içmek = drink (-s takısına dikkat!) | kahve = coffee | her sabah = every morning',
    hintTr: 'Özne "My sister" (3. tekil) olduğu için "drink" fiiline "-s" eklemeyi unutmayın.',
    explanationTr: '3. tekil şahıs olumlu cümlede: "My sister drinks coffee every morning."',
  },
  {
    id: 'a1-1-write-2',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'negative_doesnt',
    promptTr: 'O, hafta sonları çalışmaz.',
    idealEn: 'He does not work on weekends.',
    acceptedAnswers: [
      'he does not work on weekends',
      "he doesn't work on weekends",
      'she does not work on weekends',
      "she doesn't work on weekends",
      'he does not work at weekends',
      "he doesn't work at weekends",
      'she does not work at weekends',
      "she doesn't work at weekends",
    ],
    starterHint: "He doesn't work ...",
    vocabHint: 'o = he / she | çalışmaz = doesn’t work (fiil yalın!) | hafta sonları = on weekends',
    hintTr: '"He/She" ile olumsuz yaparken "doesn\'t + work" (s takısız) kullanın.',
    explanationTr: '"Doesn\'t" geldiği için fiil yalın kalır: "He/She doesn\'t work on weekends."',
  },
  {
    id: 'a1-1-write-3',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'stative_verbs',
    promptTr: 'Sana tamamen katılıyorum.',
    idealEn: 'I completely agree with you.',
    acceptedAnswers: [
      'i completely agree with you',
      'i agree with you completely',
      'i totally agree with you',
      'i agree with you',
    ],
    starterHint: 'I completely agree ...',
    vocabHint: 'tamamen = completely / totally | katılmak = agree with (DİKKAT: "am agree" DEĞİL!)',
    hintTr: '"Agree" bir fiildir; sakın "I am agree" yazmayın! Doğrudan "I agree with you" kalıbını kullanın.',
    explanationTr: '"Agree" fiil olduğu için başına "am" almaz: "I completely agree with you."',
  },
  {
    id: 'a1-1-write-4',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'question_does',
    promptTr: 'O nerede yaşıyor?',
    idealEn: 'Where does he live?',
    acceptedAnswers: [
      'where does he live',
      'where does she live',
    ],
    starterHint: 'Where does ...',
    vocabHint: 'nerede = where | soru yardımcısı (he/she) = does | yaşamak = live (yalın)',
    hintTr: 'Geniş zamanda ikamet/yaşama yeri sorulurken Simple Present kullanılır: Where + does + he/she + live?',
    explanationTr: 'Kalıcı ikamet yeri sorulurken "Where does he/she live?" kullanılır.',
  },
  {
    id: 'a1-1-write-5',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'to_be_vs_do',
    promptTr: 'Ben bugün çok yorgunum.',
    idealEn: 'I am very tired today.',
    acceptedAnswers: [
      'i am very tired today',
      "i'm very tired today",
      'today i am very tired',
      'i am so tired today',
    ],
    starterHint: 'I am very ...',
    vocabHint: 'ben = I | -im (durum) = am | çok = very | yorgun = tired | bugün = today',
    hintTr: '"Tired" (yorgun) bir sıfattır; durum bildirmek için "I am" kullanın.',
    explanationTr: 'Sıfat cümlelerinde "To Be" kullanılır: "I am very tired today."',
  },
  {
    id: 'a1-1-write-6',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'adverb_never',
    promptTr: 'O asla yalan söylemez.',
    idealEn: 'He never tells a lie.',
    acceptedAnswers: [
      'he never tells a lie',
      'she never tells a lie',
      'he never tells lies',
      'she never tells lies',
      'he never lies',
      'she never lies',
    ],
    starterHint: 'He never tells ...',
    vocabHint: 'asla = never | yalan söylemek = tell lies / tell a lie / lie (-s takısına dikkat!)',
    hintTr: '"Never" kullanırken "doesn\'t" yazmayın ve fiile "-s" takısı ekleyin ("tells / lies").',
    explanationTr: '"Never" olumlu fiil çekimiyle kullanılır: "He/She never tells lies."',
  },
  {
    id: 'a1-1-write-7',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'spelling_ies',
    promptTr: 'O her gün İngilizce çalışır.',
    idealEn: 'She studies English every day.',
    acceptedAnswers: [
      'she studies english every day',
      'he studies english every day',
      'every day she studies english',
      'every day he studies english',
    ],
    starterHint: 'She studies ...',
    vocabHint: 'çalışmak (ders) = study -> 3. tekilde "studies" | İngilizce = English | her gün = every day',
    hintTr: '"Study" fiili 3. tekil şahısta "-y" düşerek "studies" olur.',
    explanationTr: '"Ünsüz + y" kuralı gereği "study" -> "studies" olur: "She studies English every day."',
  },
  {
    id: 'a1-1-write-8',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'have_has',
    promptTr: 'Onun iki kedisi var.',
    idealEn: 'She has two cats.',
    acceptedAnswers: [
      'she has two cats',
      'he has two cats',
      'she has 2 cats',
      'he has 2 cats',
    ],
    starterHint: 'She has ...',
    vocabHint: 'onun var (sahip olmak) = He/She has | iki kedi = two cats',
    hintTr: '3. tekil şahısta sahiplik için "have" değil "has" kullanılır.',
    explanationTr: '"He/She" ile "have" fiili "has" olur: "She has two cats."',
  },
  {
    id: 'a1-1-write-9',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'stative_verbs',
    promptTr: 'Cevabı bilmiyorum.',
    idealEn: 'I do not know the answer.',
    acceptedAnswers: [
      'i do not know the answer',
      "i don't know the answer",
    ],
    starterHint: "I don't know ...",
    vocabHint: 'bilmek = know | bilmiyorum = I don’t know | cevap = the answer',
    hintTr: '"Know" durum fiilidir; "I am not knowing" denmez, "I don\'t know" denir.',
    explanationTr: 'Durum fiili "know" geniş zamanda olumsuz yapılır: "I don\'t know the answer."',
  },
  {
    id: 'a1-1-write-10',
    nodeId: 'a1-1',
    kind: 'writing',
    subSkillTag: 'indefinite_pronouns',
    promptTr: 'Herkes gerçeği biliyor.',
    idealEn: 'Everyone knows the truth.',
    acceptedAnswers: [
      'everyone knows the truth',
      'everybody knows the truth',
    ],
    starterHint: 'Everyone knows ...',
    vocabHint: 'herkes = everyone / everybody | bilmek = know -> tekil "-s" takısıyla: knows | gerçek = the truth',
    hintTr: '"Everyone / Everybody" tekil kabul edilir, bu yüzden fiil "knows" olmalıdır!',
    explanationTr: '"Everyone" 3. tekil şahıs gibi çekimlenir: "Everyone knows the truth."',
  },
];

// ============================================================================
// HER ÜNİTE İÇİN 50 SORULUK (10x5 TİP) TAM HAVUZ OLUŞTURUCU
// ============================================================================
function tokenizeSentence(en: string): string[] {
  return en
    .replace(/[.?!,;:"“”]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function build50QuestionsForNode(nodeId: string): GrammarPoolQuestion[] {
  if (nodeId === 'a1-1') {
    return A1_1_QUESTIONS;
  }

  const node = GRAMMAR_CURRICULUM.find(n => n.id === nodeId);
  const content = getOrBuildTopicContent(nodeId);
  const pool: GrammarPoolQuestion[] = [];

  // Eldeki tüm drill + exam sorularını birleştir
  const rawDrills = [...content.drills, ...content.examQuestions];
  const rawExamples = content.lecture.examples || [];
  const rawWritings = content.writing || [];

  // 1) 10 Adet Boşluk Doldurma (fill)
  for (let i = 0; i < 10; i++) {
    const src = rawDrills[i % rawDrills.length];
    const variantSuffix = i >= rawDrills.length ? ` (Varyasyon #${i + 1})` : '';
    pool.push({
      id: `${nodeId}-fill-${i + 1}`,
      nodeId,
      kind: 'fill',
      subSkillTag: `rule_${(i % 3) + 1}`,
      sentence: src.sentence,
      sentenceTr: src.sentenceTr + variantSuffix,
      options: src.options,
      correctAnswer: src.correctAnswer,
      hintTr: `${node?.title || 'Gramer'} formülünü ve özne-zaman uyumunu kontrol edin.`,
      explanationTr: src.explanation,
      source: 'seed',
    });
  }

  // 2) 10 Adet Duolingo Tarzı Kelime Kartlarıyla Cümle Kurma (word_tiles)
  const tileSources: { en: string; tr: string; note: string }[] = [
    ...rawExamples.map(e => ({ en: e.en, tr: e.tr, note: e.analysis })),
    ...rawDrills.map(d => ({
      en: d.sentence.replace('[_____]', d.correctAnswer),
      tr: d.sentenceTr,
      note: d.explanation,
    })),
  ];

  for (let i = 0; i < 10; i++) {
    const src = tileSources[i % tileSources.length];
    const correctTokens = tokenizeSentence(src.en);
    const distractors = ['is', 'are', 'been', 'having', 'did', 'would'].filter(
      w => !correctTokens.map(t => t.toLowerCase()).includes(w)
    );
    const allTiles = [...correctTokens, ...distractors.slice(0, 2)];
    pool.push({
      id: `${nodeId}-tiles-${i + 1}`,
      nodeId,
      kind: 'word_tiles',
      subSkillTag: `rule_${(i % 3) + 1}`,
      promptTr: src.tr,
      targetEn: correctTokens.join(' '),
      correctTokens,
      tiles: allTiles,
      hintTr: `Cümleyi "${correctTokens.slice(0, 2).join(' ')}..." şeklinde başlatarak kurun.`,
      explanationTr: src.note,
      source: 'seed',
    });
  }

  // 3) 10 Adet Dinleme (listening)
  const listenQuestions = content.listening?.questions || [];
  for (let i = 0; i < 10; i++) {
    if (i < listenQuestions.length) {
      const lq = listenQuestions[i];
      pool.push({
        id: `${nodeId}-listen-${i + 1}`,
        nodeId,
        kind: 'listening',
        subSkillTag: `rule_${(i % 3) + 1}`,
        audioEn: content.listening.audioScript,
        audioTr: content.listening.audioScriptTr,
        question: lq.question,
        options: lq.options,
        correctAnswer: lq.correctAnswer,
        hintTr: 'Ses kaydındaki yardımcı fiil ve zaman vurgusuna dikkat edin.',
        explanationTr: lq.explanation,
        source: 'seed',
      });
    } else {
      const d = rawDrills[(i + 2) % rawDrills.length];
      const fullAudio = d.sentence.replace('[_____]', d.correctAnswer);
      pool.push({
        id: `${nodeId}-listen-${i + 1}`,
        nodeId,
        kind: 'listening',
        subSkillTag: `rule_${(i % 3) + 1}`,
        audioEn: fullAudio,
        audioTr: d.sentenceTr,
        question: 'Dinlediğiniz cümlede boşluğa gelen doğru gramer yapısı hangisidir?',
        options: d.options,
        correctAnswer: d.correctAnswer,
        hintTr: `İpucu: "${d.sentenceTr}" anlamını veren yapıyı yakalayın.`,
        explanationTr: d.explanation,
        source: 'seed',
      });
    }
  }

  // 4) 10 Adet Okuma & Analiz (reading)
  const readQuestions = content.reading?.questions || [];
  for (let i = 0; i < 10; i++) {
    if (i < readQuestions.length) {
      const rq = readQuestions[i];
      pool.push({
        id: `${nodeId}-read-${i + 1}`,
        nodeId,
        kind: 'reading',
        subSkillTag: `rule_${(i % 3) + 1}`,
        passageEn: content.reading.passage,
        passageTr: content.reading.passageTr,
        highlightWords: content.reading.highlightedStructures,
        question: rq.question,
        options: rq.options,
        correctAnswer: rq.correctAnswer,
        hintTr: 'Metindeki altı çizili/vurgulanan gramer kalıplarını inceleyin.',
        explanationTr: rq.explanation,
        source: 'seed',
      });
    } else {
      const d = rawDrills[(i + 4) % rawDrills.length];
      const fullSentence = d.sentence.replace('[_____]', d.correctAnswer);
      pool.push({
        id: `${nodeId}-read-${i + 1}`,
        nodeId,
        kind: 'reading',
        subSkillTag: `rule_${(i % 3) + 1}`,
        passageEn: `Context Analysis: "${fullSentence}" — This structure demonstrates ${node?.title || 'the target rule'} in an authentic academic context.`,
        passageTr: `Bağlam Analizi: "${d.sentenceTr}"`,
        highlightWords: [d.correctAnswer],
        question: `Yukarıdaki metinde "${d.correctAnswer}" yapısının kullanılma nedeni nedir?`,
        options: [
          d.explanation.slice(0, 95) + (d.explanation.length > 95 ? '...' : ''),
          'Sadece geçmişte tamamlanmış ve etkisi bitmiş bir olayı anlatmak için.',
          'Gelecekte iptal edilmiş bir planı vurgulamak için.',
          'Koşulsuz emir cümlesi kurmak için.',
        ],
        correctAnswer: d.explanation.slice(0, 95) + (d.explanation.length > 95 ? '...' : ''),
        hintTr: 'Vurgulanan yapının zaman ve anlam ilişkisine odaklanın.',
        explanationTr: d.explanation,
        source: 'seed',
      });
    }
  }

  // 5) 10 Adet Türkçeden İngilizceye Yazma + Yardım/İpucu (writing)
  const writeSources = [
    ...rawWritings.map(w => ({
      tr: w.promptTr,
      en: w.sampleIdealAnswer,
      hint: w.targetStructureHint,
      kw: w.requiredKeywords,
    })),
    ...rawExamples.map(e => ({
      tr: e.tr,
      en: e.en,
      hint: e.analysis,
      kw: tokenizeSentence(e.en).slice(0, 4),
    })),
    ...rawDrills.map(d => ({
      tr: d.sentenceTr,
      en: d.sentence.replace('[_____]', d.correctAnswer),
      hint: `Anahtar yapı: "${d.correctAnswer}" — ${d.explanation}`,
      kw: [d.correctAnswer],
    })),
  ];

  for (let i = 0; i < 10; i++) {
    const ws = writeSources[i % writeSources.length];
    const cleanEn = ws.en.replace(/[.?!]+$/, '').trim();
    const tokens = tokenizeSentence(ws.en);
    pool.push({
      id: `${nodeId}-write-${i + 1}`,
      nodeId,
      kind: 'writing',
      subSkillTag: `rule_${(i % 3) + 1}`,
      promptTr: ws.tr,
      idealEn: ws.en,
      acceptedAnswers: [cleanEn.toLowerCase()],
      starterHint: `${tokens.slice(0, Math.min(3, tokens.length)).join(' ')} ...`,
      vocabHint: `Anahtar Kalıp: ${ws.kw.join(', ')}`,
      hintTr: ws.hint,
      explanationTr: `İdeal Cümle: "${ws.en}" — ${ws.hint}`,
      source: 'seed',
    });
  }

  return pool;
}

