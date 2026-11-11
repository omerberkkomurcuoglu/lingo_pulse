import { DeepGrammarGuide } from './types';

export const C2_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  'c2-1': {
    nodeId: 'c2-1',
    overviewTr:
      'İleri Düzey Söylem Belirteçleri, Cümle Eksiltileri ve Yerine Koyma (Advanced Discourse Markers, Ellipsis & Substitution: Notwithstanding, Albeit, Inasmuch as, Be that as it may, Much as, Do so), C2 seviyesinde anadili İngilizce olan üst düzey yazarların ve akademisyenlerin metinlerindeki ritmi, ekonomikliği ve entelektüel ağırlığı belirler.\n• Discourse Markers: Basit bağlaçların (although, but, because) yerini alan sofistike yapılar: "Notwithstanding his lack of formal training...", "The experiment was successful, albeit expensive", "Inasmuch as the treaty remains unratified...", "Much as I respect his scholarship...".\n• Substitution (Yerine Koyma): Tekrarlardan kaçınmak için bir eylem veya cümlenin yerine "do so / did so", "one / ones", "so / not" kullanılması (If the minister resigns—and she may do so—the government will collapse).\n• Ellipsis (Eksilti): Anlamın bağlamdan açıkça anlaşıldığı durumlarda sözcüklerin kasıtlı olarak cümleden atılması (Some attended the morning session, others the afternoon).',
    timelineVisual: 'Hantal Metin ──▶ SÖYLEM ZENGİNLEŞTİRME & EKSİLTİ: [ Albeit / Notwithstanding / Do So ]',
    conjugationRows: [
      {
        formType: 'Zıtlık Belirteci (Notwithstanding)',
        subject: 'Notwithstanding + Noun / the fact that',
        formula: 'Notwithstanding + Noun Phrase / Fact that',
        exampleEn: 'Notwithstanding the severe macroeconomic headwinds, the conglomerate posted record quarterly profits.',
        exampleTr: 'Şiddetli makroekonomik ters rüzgarlara rağmen (notwithstanding), holding rekor üç aylık kâr açıkladı.',
      },
      {
        formType: 'Hafif Zıtlık / Taviz (Albeit)',
        subject: 'Albeit + Sıfat / Zarf / İsim Öbeği',
        formula: 'Main Clause, albeit + Adj / Adv',
        exampleEn: 'The diplomatic summit achieved a breakthrough, albeit a fragile one.',
        exampleTr: 'Diplomatik zirve, kırılgan da olsa (albeit a fragile one) bir atılım gerçekleştirdi.',
      },
      {
        formType: 'Gerekçe Belirteci (Inasmuch as)',
        subject: 'Inasmuch as + Clause',
        formula: 'Inasmuch as + Subject + Verb',
        exampleEn: 'Inasmuch as the initial premises were flawed, the entire mathematical proof collapses.',
        exampleTr: 'İlk önermeler kusurlu olduğu ölçüde/mademki öyleydi (inasmuch as), tüm matematiksel kanıt çöker.',
      },
      {
        formType: 'Eylem Yerine Koyma (Do so / Did so)',
        subject: 'do so = yerine getirilen eylem öbeği',
        formula: 'Verb Phrase ──▶ do so / did so',
        exampleEn: 'Employees who wish to join the pension plan must do so before the close of business on Friday.',
        exampleTr: 'Emeklilik planına katılmak isteyen çalışanlar bunu (do so = join the plan) cuma mesai bitiminden önce yapmalıdır.',
      },
      {
        formType: 'Zıtlık İtirafı (Much as)',
        subject: 'Much as + S + Verb..., Main Clause',
        formula: 'Much as I like/respect/admire..., Main Clause',
        exampleEn: 'Much as I admire the author’s stylistic eloquence, I cannot endorse his philosophical conclusions.',
        exampleTr: 'Yazarın üslup belagatına ne kadar hayran olsam da (much as I admire), felsefi sonuçlarını onaylayamam.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ALBEIT KULLANIM SINIRLARI',
        title: '1. "Albeit" Asla Bağımsız Bir Cümle Almaz!',
        explanationTr:
          '"Albeit" bağlacı "although it is/was" anlamına gelse de arkasından ASLA tam bir özne-yüklem cümlesi almaz! Yalnızca bir sıfat, zarf veya edat öbeğiyle kullanılır:\n• ❌ The project succeeded albeit it cost a lot of money.\n• ✅ The project succeeded, ALBEIT AT ENORMOUS COST.\n• ✅ He smiled, ALBEIT SOMEWHAT RELUCTANTLY.',
        formula: 'Clause, albeit + Adjective / Adverb / Prepositional phrase',
        examples: [
          {
            en: 'The surgical procedure was a success, albeit with unforeseen post-operative complications.',
            tr: 'Cerrahi operasyon, öngörülemeyen ameliyat sonrası komplikasyonlar olsa da (albeit with...), bir başarıydı.',
            note: '"Albeit" doğrudan edat öbeğini bağladı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • ELLIPSIS VE METİN AKIŞI',
        title: '2. Yüksek Düzey Cümle Eksiltileri (Ellipsis)',
        explanationTr:
          'Aynı eylemin veya yardımcı fiilin tekrarını önlemek için dilde gereksiz öğeler budanır:\n• "Some opted for surgical intervention, others for non-invasive radiotherapy." ("others opted for" yerine sadece "others for").\n• "She promised to call, but didn’t." ("didn’t call" yerine sadece "didn’t").\n• "If possible, send the files today." ("If it is possible" yerine "If possible").',
        formula: 'Gereksiz tekrarı buda ──▶ Özlü ve keskin anlatım',
        examples: [
          {
            en: 'The senior partner examined the first contract, and the junior associate the second.',
            tr: 'Kıdemli ortak birinci sözleşmeyi inceledi, kıdemsiz ortak ise ikinciyi (examined fiili ikinci cümlede eksiltildi).',
            note: 'Klasik edebi eksilti (gapping).',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Be that as it may (Yine de / Öyle olsa bile)',
        examples: 'The budget deficit is concerning. Be that as it may, public infrastructure investments cannot wait.',
        noteTr: 'C2 düzeyinde güçlü bir karşıtlık geçiş kalıbıdır.',
      },
    ],
    signalWords: [
      {
        word: 'Notwithstanding / Albeit / Inasmuch as / Insofar as',
        meaningTr: 'rağmen / -e rağmen de olsa / -dığı ölçüde',
        positionRule: 'C2 akademik ve hukuki metinlerinin ayırt edici belirteçleridir.',
        sampleEn: 'Insofar as the data is accurate, the hypothesis holds.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Albeit he was tired, he finished the race.',
        right: 'Although he was tired, he finished the race. (veya He finished the race, albeit tired)',
        whyTr: '"Albeit" arkasından tam cümle ("he was tired") alamaz; sadece sıfat ("albeit tired") alır.',
      },
      {
        wrong: 'Notwithstanding of his age, he won.',
        right: 'Notwithstanding his age, he won.',
        whyTr: '"Notwithstanding" bir edattır; arkasına "of" ALMAZ, doğrudan ismi alır.',
      },
    ],
  },

  'c2-2': {
    nodeId: 'c2-2',
    overviewTr:
      'İsimleştirme, İhtiyatlı Akademik Dil ve Üslup Nüansları (Nominalisation, Hedging & Stylistic Nuance: Turning verbs into nouns & Epistemic caution), akademik makalelerin ve prestijli uluslararası dergilerin (Nature, The Economist, Oxford Journals) ayırt edici üslubudur.\n• Nominalisation (İsimleştirme): Fiil merkezli, konuşma diline yakın dinamik cümleleri; soyut, yoğun ve nesnel isim öbeklerine dönüştürerek metnin akademik yoğunluğunu artırmaktır:\n  - Günlük Dil: "Because the climate is warming rapidly, sea levels are rising and coastal towns are eroding."\n  - C2 Nominalised: "ACCELERATING CLIMATE WARMING has precipitated EXTENSIVE SEA LEVEL RISES and SEVERE COASTAL EROSION."\n• Hedging (İhtiyatlı Dil): Bir araştırmacının asla mutlak iddialarda bulunmayıp, bulguları bilimsel alçakgönüllülük ve ihtiyatla sunmasıdır (tends to indicate, would seem to imply, it is plausible that).',
    timelineVisual: 'Konuşma Dili (Fiil Merkezli) ──▶ AKADEMİK DÖNÜŞÜM: [ İsim Öbekleri + İhtiyatlı Hedging ]',
    conjugationRows: [
      {
        formType: 'Fiilden İsme Dönüşüm (Nominalisation)',
        subject: 'Fiil Cümlesi ──▶ İsim Öbeği',
        formula: 'Verb clause ──▶ Noun Phrase as Subject/Object',
        exampleEn: 'The relentless deterioration of the ozone layer necessitated immediate legislative intervention.',
        exampleTr: 'Ozon tabakasının durmaksızın kötüleşmesi derhal yasal müdahaleyi zorunlu kıldı.',
      },
      {
        formType: 'İhtiyatlı İddia (Hedging with Verbs)',
        subject: 'tend to / suggest / indicate / imply',
        formula: 'The data / evidence + tends to indicate that...',
        exampleEn: 'Empirical observations tend to indicate a non-linear correlation between inflation and unemployment.',
        exampleTr: 'Ampirik gözlemler, enflasyon ile işsizlik arasında doğrusal olmayan bir korelasyona işaret etme eğilimindedir.',
      },
      {
        formType: 'İhtiyatlı Modal / Zarf (Hedging Modifiers)',
        subject: 'plausibly / conceivably / ostensibly',
        formula: 'Modal / Adverb of probability + Verb',
        exampleEn: 'The neural network could conceivably be extrapolating patterns from latent training artifacts.',
        exampleTr: 'Yapay sinir ağı, muhtemeldir ki gizil eğitim yapaylıklarından kalıplar çıkarıyor olabilir.',
      },
      {
        formType: 'Tarafsız Atıf (Impersonal Distance)',
        subject: 'There is reason to believe that',
        formula: 'There is substantial reason to suspect that...',
        exampleEn: 'There is reason to believe that the genetic mutation confers resilience against viral replication.',
        exampleTr: 'Genetik mutasyonun viral replikasyona karşı direnç sağladığına inanmak için makul nedenler vardır.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • İSİMLEŞTİRME TEKNİĞİ',
        title: '1. Cümleleri İsim Öbeklerine Yoğunlaştırma Stratejisi',
        explanationTr:
          'İsimleştirme sayesinde gereksiz bağlaçlar (because, although, when) ve kişisel özneler ortadan kalkar; eylemin kendisi cümlenin öznesi haline gelir:\n• "Scientists analyzed the data and discovered a new planet." (Basit)\n• "ANALYSIS of the data led to the DISCOVERY of an exoplanet." (C2 Akademik)\n• "Governments failed to regulate crypto, so fraud increased." (Basit)\n• "REGULATORY FAILURE facilitated a SURGE in financial fraud." (C2 Akademik).',
        formula: 'Fiil + Bağlaç ──▶ Soyut İsim + Sebep-Sonuç Fiili (lead to, result in, precipitate)',
        examples: [
          {
            en: 'The rapid proliferation of autonomous systems demands rigorous ethical scrutiny.',
            tr: 'Otonom sistemlerin hızla çoğalması (The proliferation), titiz bir etik denetimi zorunlu kılmaktadır.',
            note: '"Systems are proliferating rapidly" cümlesi isimleştirilerek akademik özneye dönüştürüldü.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • AKADEMİK HEDGING SEVİYELERİ',
        title: '2. Bilimsel İhtiyat (Hedging) Kademeleri',
        explanationTr:
          '• Aşırı İddialı (Kaçınılmalı): "This proves that the policy is wrong."\n• Kabul Edilebilir: "This shows that the policy has flaws."\n• C2 İhtiyatlı / Hedged: "These findings WOULD STRONGLY SUGGEST that the policy MAY ENTAIL unintended structural flaws."\nTemel hedging araçları:\n1) İhtiyatlı fiiller: appear, seem, suggest, indicate, tend to.\n2) Olasılık zarfları: plausibly, presumably, arguably, conceivably.\n3) Kısıtlayıcı ifadeler: in most respects, up to a point, generally speaking.',
        formula: 'would suggest that / could plausibly explain / tends to support',
        examples: [
          {
            en: 'The anomalies could plausibly be attributed to atmospheric interference rather than instrumental failure.',
            tr: 'Anormallikler alet arızasından ziyade atmosferik parazite makul bir şekilde atfedilebilir (ihtiyatlı bilimsel çıkarım).',
            note: '"Could plausibly be attributed" üç katmanlı hedging içerir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Arguably: İleri Sürülebileceği Üzere',
        examples: 'This is arguably the most consequential treatise on political philosophy since Rawls.',
        noteTr: '"Arguably", bir iddianın savunulabilir olduğunu ama kesin bir dogma olmadığını belirten en zarif C2 zarfıdır.',
      },
    ],
    signalWords: [
      {
        word: 'ostensibly / ostensibly / purportedly / presumably',
        meaningTr: 'görünüşe göre / iddiaya göre / muhtemelen',
        positionRule: 'İhtiyatlı anlatım için fiilin önüne gelir.',
        sampleEn: 'The firm ostensibly restructured its assets to optimize tax liability.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'This study completely proves the human nature.',
        right: 'This study appears to provide valuable insights into human nature.',
        whyTr: 'C2 akademik dilinde "completely proves" gibi toptancı ve kesin ifadelerden kaçınılır; hedging yapıları kullanılır.',
      },
    ],
  },

  'c2-3': {
    nodeId: 'c2-3',
    overviewTr:
      'Üslupsal ve Yer Bildiren Devriklik (Stylistic & Locative Inversion: Down came the rain, On the platform stood the conductor, Out rushed the students), İngilizcenin edebi ve tasviri zirvesidir. Gramer kuralları gereği zorunlu olan Negative Inversion’dan farklı olarak, Stylistic Inversion yazarın RİTİM, TİYATRAL ETKİ ve ODAK KAYDIRMASI yaratmak için kendi iradesiyle seçtiği bir sanattır.\n• Locative Inversion (Yer Belirteci Başa Geldiğinde): Yer veya yön bildiren bir edat öbeği cümle başına alındığında, "DO/DID" KULLANILMAKSIZIN doğrudan ASIL FİİL özneden önce gelir:\n  - Normal: "The ancient cathedral stood at the top of the hill."\n  - Devrik: "AT THE TOP OF THE HILL STOOD the ancient cathedral."\n• Yön Zarfları (Down, Up, Away, Out, Into): "Down came the rain", "Out rushed the eager children", "Away flew the eagle".\n• KRİTİK İSTİSNA: Özne bir ZAMİR ise (he, she, it, they), DEVRİKLİK YAPILMAZ! (Out rushed the boys ──▶ Out THEY rushed!).',
    timelineVisual: 'Normal Cümle ──▶ TASVİRİ ÖNE ALMA: [ YER / YÖN ZARFI ] ──▶ [ ASIL FİİL ] ──▶ [ ÖZNE ]',
    conjugationRows: [
      {
        formType: 'Yer Öbeği Devrikliği (Prepositional Fronting)',
        subject: 'Yer Edatı + Asıl Fiil + Özne',
        formula: 'Prepositional Phrase + Verb (stood/sat/lay) + Subject',
        exampleEn: 'On the summit of the mountain stood a solitary weather observatory.',
        exampleTr: 'Dağın zirvesinde tek başına bir meteoroloji gözlemevi duruyordu.',
      },
      {
        formType: 'Yön Zarfı Devrikliği (Directional Inversion)',
        subject: 'Down / Up / Out / Away + Verb + Özne',
        formula: 'Directional Adverb + Verb + Noun Subject',
        exampleEn: 'Into the council chamber walked the venerable ambassador, flanked by his aides.',
        exampleTr: 'Meclis salonuna, maiyetindeki yardımcıları eşliğinde muhterem büyükelçi girdi.',
      },
      {
        formType: 'Dengeleyici Fiil Devrikliği (Participial Inversion)',
        subject: 'Participle + be + Özne',
        formula: 'V-ing / V3 Phrase + was/were + Long Subject',
        exampleEn: 'Seated at the center of the dais was the Nobel laureate herself.',
        exampleTr: 'Kürsünün merkezinde oturan kişi bizzat Nobel ödüllü bilim insanının kendisiydi.',
      },
      {
        formType: 'Zamir İstisnası (PRONOUN EXCEPTION)',
        subject: 'Özne Zamirse Devriklik YOKTUR!',
        formula: 'Direction + PRONOUN + Verb (Düz sıra!)',
        exampleEn: 'The door opened and in they walked. (❌ in walked they denemez!)',
        exampleTr: 'Kapı açıldı ve içeri girdiler.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • LOCATIVE INVERSION MATEMATİĞİ',
        title: '1. Yardımcı Fiil (did/does) KULLANILMAZ Kuralı',
        explanationTr:
          'Negative Inversion’da "did he come" gibi yardımcı fiil gerekirken, Stylistic / Locative Inversion’da yardımcı fiil KULLANILMAZ! Asıl eylem fiili doğrudan cümlenin başına taşınır:\n• ❌ Under the tree did sit an old man.\n• ✅ UNDER THE TREE SAT an old man.\n• En çok kullanılan statik/hareket fiilleri: stand, sit, lie, hang, come, walk, run, flow.',
        formula: 'Yer Öbeği + Asıl Fiil (sat / stood / lay) + Özne',
        examples: [
          {
            en: 'Hanging above the fireplace was an ornate sixteenth-century oil portrait.',
            tr: 'Şöminenin üzerinde on altıncı yüzyıldan kalma süslü bir yağlı boya portre asılı duruyordu.',
            note: 'Doğrudan "was an oil portrait" devrik dizilimi kuruldu.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • ZAMİR İSTİSNASI',
        title: '2. En Meşhur C2 Tuzağı: Özne Zamir İse Devriklik Çöker!',
        explanationTr:
          'Eğer özne bir isim ise devriklik yapılır: "Away ran the thief" (Hırsız kaçtı).\nANCAK özne bir kişi zamiri ise (he, she, it, they), dilin melodisi gereği devriklik YAPILMAZ; düz sıra korunur:\n• ❌ Away ran he.\n• ✅ AWAY HE RAN!\n• ❌ Here comes he.\n• ✅ HERE HE COMES! (İşte geliyor!).',
        formula: 'İsim Özne ──▶ Devrik: Away ran the dog  |  Zamir Özne ──▶ Düz: Away it ran',
        examples: [
          {
            en: 'The whistle blew and off they sped across the frozen lake.',
            tr: 'Düdük çaldı ve donmuş göl boyunca hızla uzaklaştılar (off they sped).',
            note: 'Özne "they" olduğu için "off sped they" değil, "off they sped" kullanılır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Here / There ile Devriklik',
        examples: 'Here comes the train! (İşte tren geliyor!)  |  There goes our last opportunity.',
        noteTr: 'Günlük konuşmada da yaşayan en popüler locative inversion örnekleridir.',
      },
    ],
    signalWords: [
      {
        word: 'Beneath / At the foot of / Surrounding / Flanking',
        meaningTr: 'altında / eteğinde / çevreleyen / iki yanında',
        positionRule: 'Edebi betimlemelerde locative inversion başlatır.',
        sampleEn: 'At the foot of the cliff lay the wreckage of the galleon.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Here comes he.',
        right: 'Here he comes.',
        whyTr: 'Özne bir zamir ("he") olduğunda devriklik yapılmaz; "Here he comes" denir.',
      },
      {
        wrong: 'On the table did stand the trophy.',
        right: 'On the table stood the trophy.',
        whyTr: 'Locative inversion’da "did" yardımcı fiili kullanılmaz; asıl fiil ("stood") doğrudan özneden önce gelir.',
      },
    ],
  },

  'c2-4': {
    nodeId: 'c2-4',
    overviewTr:
      'Arkaik İsteme Kipi ve Kalıplaşmış Retorik Devriklikler (Archaic Subjunctive & Fixed Idiomatic Inversions: Come what may, Suffice it to say, Be that as it may, Far be it from me, So be it, Were it not for), modern İngilizcede yaşayan en kadim ve saygın ifade kalıplarıdır. Yüzyılların edebi mirasını taşıyan bu yapılar, üst düzey diplomaside, parlamento tutanaklarında ve klasik edebiyatta tartışılmaz bir otorite hissi yaratır:\n• Come what may: Ne olursa olsun / Her ne pahasına olursa olsun.\n• Suffice it to say: Şu kadarını söylemek yeterlidir ki...\n• Be that as it may: Öyle olsa bile / Yine de.\n• Far be it from me to judge: Yargılamak haddime değil ama...\n• So be it: Öyle olsun / Kabulümüzdür.\n• Inverted Concessions (Zıtlık Devrikliği): "Try as he might, he could not succeed" (Ne kadar çabalarsa çabalasın başaramadı!).',
    timelineVisual: 'Geleneksel Gramer ──▶ TARİHİ VE RETORİK KALIPLAR: [ Come what may / Be that as it may ]',
    conjugationRows: [
      {
        formType: 'Kalıplaşmış Subjunctive (Come what may)',
        subject: 'Değişmez Sabit İfade',
        formula: 'Come what may, Main Clause',
        exampleEn: 'Come what may, our nation will honor its treaty obligations.',
        exampleTr: 'Ne olursa olsun (her ne pahasına olursa olsun), ulusumuz anlaşma yükümlülüklerini yerine getirecektir.',
      },
      {
        formType: 'Yeterlik Subjunctive (Suffice it to say)',
        subject: 'Suffice it to say that...',
        formula: 'Suffice it to say (that) + Clause',
        exampleEn: 'Suffice it to say that the subsequent negotiations were contentious in the extreme.',
        exampleTr: 'Şu kadarını söylemek yeterlidir ki sonraki müzakereler son derece çekişmeli geçti.',
      },
      {
        formType: 'Taviz Zıtlığı (Be that as it may)',
        subject: 'Be that as it may, S + V',
        formula: 'Be that as it may, Main Clause',
        exampleEn: 'The initial data contains anomalies. Be that as it may, the overarching trend is undeniable.',
        exampleTr: 'İlk veriler anormallikler içeriyor. Öyle olsa bile (yine de), genel eğilim inkar edilemez.',
      },
      {
        formType: 'Haddini Bilme Subjunctive (Far be it from me)',
        subject: 'Far be it from me + to V1',
        formula: 'Far be it from me to + V1..., but Clause',
        exampleEn: 'Far be it from me to criticize the board’s judgment, but the timing seems ill-advised.',
        exampleTr: 'Yönetim kurulunun kararını eleştirmek haddim değil ama zamanlama pek akıllıca görünmüyor.',
      },
      {
        formType: 'Fiil Başlatan Zıtlık (Try as he might)',
        subject: 'Verb + as + S + might / may',
        formula: 'Verb (Try/Strive) + as + S + might, S + could not...',
        exampleEn: 'Try as they might, the defense counsel could not dismantle the biometric evidence.',
        exampleTr: 'Ne kadar uğraşırlarsa uğraşsınlar, savunma avukatları biyometrik delilleri çürütemedi.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • VERB + AS + SUBJECT + MIGHT',
        title: '1. Fiil Başa Geçen Zıtlık Devrikliği (Try as he might / Hard as they tried)',
        explanationTr:
          '"Although he tried very hard" demek yerine C2 retoriğinde eylem fiili cümlenin en başına çekilir:\n• "TRY AS HE MIGHT, he could not open the safe." (Ne kadar denerse denesin...)\n• "STRIVE AS THEY DID, they failed to meet the consensus." (Ne kadar çabalasalar da...)\n• Sıfatla da yapılabilir: "POOR AS HE WAS, he refused to take a bribe." (Her ne kadar fakir idiyse de rüşveti reddetti).',
        formula: 'Verb / Adjective + AS + Subject + might / was, Main Clause',
        examples: [
          {
            en: 'Eloquent as the ambassador’s defense was, it failed to convince the security council.',
            tr: 'Büyükelçinin savunması ne kadar etkili olursa olsun (eloquent as it was), güvenlik konseyini ikna etmeyi başaramadı.',
            note: 'Sıfat + as + özne + fiil zıtlık devrikliği.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • GOD FORBID VE SO BE IT',
        title: '2. Kalıplaşmış Dilek ve Kabullenme Cümleleri',
        explanationTr:
          '• God forbid (that)...: Allah korusun / Sakın olmasın (God forbids denmez, fiil daima yalındır!).\n• So be it: Öyle olsun / Yapacak bir şey yok (Kaderi kabullenme).\n• Long live the King!: Yaşasın Kral! ("lives" değil, subjunctive "live").\n• Heaven help us!: Tanrı yardımcımız olsun!',
        formula: 'God forbid / So be it / Long live...',
        examples: [
          {
            en: 'If the treaty collapses, so be it; we must defend our territorial integrity.',
            tr: 'Eğer anlaşma çökerse öyle olsun (kabulümüzdür); toprak bütünlüğümüzü savunmalıyız.',
            note: 'Dramatik retorik kabullenme kalıbı.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Suffice Kelimesi Üçüncü Tekil Olsa Bile "-s" Almaz',
        examples: 'Suffice it to say (❌ Suffices it to say KESİNLİKLE YANLIŞTIR)',
        noteTr: 'Subjunctive olduğu için fiil yalın "suffice" kalır.',
      },
    ],
    signalWords: [
      {
        word: 'Come what may / So be it / Far be it from me',
        meaningTr: 'ne olursa olsun / öyle olsun / haddime değil',
        positionRule: 'Kalıplaşmış edebi ve diplomatik deyimlerdir.',
        sampleEn: 'Come what may, we shall persist.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Suffices it to say that we won.',
        right: 'Suffice it to say that we won.',
        whyTr: 'Bu kalıp arkaik bir subjunctive yapıdır; fiile "-s" takısı eklenemez, daima "Suffice" kalır.',
      },
      {
        wrong: 'Although try as he might...',
        right: 'Try as he might...',
        whyTr: '"Try as he might" kendi başına zıtlık bağlacıdır; başına ayrıca "although" konulamaz.',
      },
    ],
  },

  'c2-5': {
    nodeId: 'c2-5',
    overviewTr:
      'Karmaşık Edatlı Deyimler ve Sicil/Üslup Kaymaları (Complex Prepositional Idioms & Register Shifts: In light of, With a view to, Subject to, In lieu of, By virtue of, Under the auspices of), resmi yazışmalarda, uluslararası hukukta, antlaşmalarda ve üst düzey editoryal basında standarttır. Basit edatların (because of, instead of, by, under) yerini alan bu kalıplar, metne kurumsal bir ciddiyet ve kesinlik kazandırır:\n• In light of: ...-in ışığında / göz önüne alındığında (In light of recent developments).\n• With a view to + V-ing: ... amacıyla / kastıyla (With a view to expanding our footprint).\n• In lieu of: ...-in yerine (In lieu of cash payment, shares were issued).\n• By virtue of: ...-in gücüyle / sayesinde / hasebiyle (By virtue of his seniority).\n• Under the auspices of: ...-in himayesinde / sponsorluğunda (Under the auspices of the UN).\n• Subject to: ...-e tabi olmak şartıyla (Subject to regulatory approval).',
    timelineVisual: 'Gündelik Dil [ because of / instead of ] ──▶ HUKUKİ & DİPLOMATİK SİCİL: [ In light of / In lieu of / By virtue of ]',
    conjugationRows: [
      {
        formType: 'Göz Önüne Alma (In light of)',
        subject: 'In light of + İsim Öbeği',
        formula: 'In light of + Noun Phrase, Main Clause',
        exampleEn: 'In light of newly declassified intelligence, the committee initiated a formal inquiry.',
        exampleTr: 'Gizliliği yeni kaldırılan istihbaratın ışığında, komite resmi bir soruşturma başlattı.',
      },
      {
        formType: 'Amaç / Maksat (With a view to + V-ing)',
        subject: 'With a view to + V-ing / Noun',
        formula: 'with a view to + V-ing (DİKKAT: To bir edattır!)',
        exampleEn: 'The ministry restructured the curriculum with a view to fostering critical analytical thinking.',
        exampleTr: 'Bakanlık, eleştirel analitik düşünmeyi teşvik etmek amacıyla müfredatı yeniden yapılandırdı.',
      },
      {
        formType: 'Yerine Geçme (In lieu of)',
        subject: 'In lieu of + İsim',
        formula: 'in lieu of + Noun (= instead of)',
        exampleEn: 'The executive accepted equity options in lieu of an annual performance bonus.',
        exampleTr: 'Yönetici yıllık performans primi yerine (in lieu of) hisse senedi opsiyonlarını kabul etti.',
      },
      {
        formType: 'Vasıf / Hak (By virtue of)',
        subject: 'By virtue of + İsim',
        formula: 'by virtue of + Noun Phrase (= because of / due to)',
        exampleEn: 'By virtue of his diplomatic immunity, the envoy could not be detained or interrogated.',
        exampleTr: 'Diplomatik dokunulmazlığı sayesinde (by virtue of), elçi gözaltına alınamadı veya sorgulanamadı.',
      },
      {
        formType: 'Şarta Bağlılık (Subject to)',
        subject: 'Subject to + İsim',
        formula: 'be subject to + Noun / approval',
        exampleEn: 'The acquisition is strictly subject to the antitrust approval of the competition authority.',
        exampleTr: 'Satın alma, kesin olarak rekabet kurumunun antitröst onayına tabidir.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • WITH A VIEW TO TUZAĞI',
        title: '1. "With a view to" Arkasından MUTLAKA "V-ing" Gelir!',
        explanationTr:
          'Sınavlarda en sık düşülen tuzak: "With a view to" kalıbındaki "to" mastar değil, EDATTIR! Dolayısıyla arkasından yalın fiil (with a view to expand) DEĞİL, zorunlu olarak "V-ing" (with a view to expanding) gelir!\n• ❌ with a view to reduce costs\n• ✅ WITH A VIEW TO REDUCING costs.',
        formula: 'with a view to + V-ing (Zorunlu Gerund!)',
        examples: [
          {
            en: 'The coalition reformed its tariff schedule with a view to stimulating bilateral commerce.',
            tr: 'Koalisyon, ikili ticareti canlandırmak amacıyla (with a view to stimulating) gümrük vergisi tarifesini revize etti.',
            note: '"Stimulate" fiili "-ing" alarak "stimulating" oldu.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • EDATLI RESMİ İDİYOMLAR SÖZLÜĞÜ',
        title: '2. Prestijli Prepositional Deyimler Repertuvarı',
        explanationTr:
          '• Under the auspices of: ...-in himayesinde (The peace talks were conducted under the auspices of Switzerland).\n• In accordance with: ...-e uygun olarak (in accordance with international maritime law).\n• To the detriment of: ...-in zararına olarak (Focusing on short-term profits to the detriment of product quality).\n• In the wake of: ...-in hemen ardından / neticesinde (In the wake of the devastating earthquake).\n• Irrespective of: ...-e bakılmaksızın (Irrespective of race, gender, or nationality).',
        formula: 'Preposition + Noun + Preposition',
        examples: [
          {
            en: 'The symposium took place under the auspices of the World Health Organization in Geneva.',
            tr: 'Sempozyum, Cenevre’de Dünya Sağlık Örgütü’nün himayesinde gerçekleşti.',
            note: '"Under the auspices of" diplomatik himaye bildirir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'In lieu of Fransızca Kökenlidir ve /luː/ Diye Okunur',
        examples: 'in lieu of notice (ihbarsız)  |  in lieu of payment',
        noteTr: 'Hukuki metinlerde "instead of" yerine geçen standart terimdir.',
      },
    ],
    signalWords: [
      {
        word: 'In light of / Under the auspices of / In accordance with',
        meaningTr: 'ışığında / himayesinde / uygun olarak',
        positionRule: 'Hukuki, diplomatik ve akademik metinlerin girişlerinde yer alır.',
        sampleEn: 'In accordance with Article 5, collective defense was invoked.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'With a view to increase sales, they lowered prices.',
        right: 'With a view to increasing sales, they lowered prices.',
        whyTr: '"With a view to" arkasından mutlaka "V-ing" alır; yalın fiil ("increase") kullanılamaz.',
      },
      {
        wrong: 'In lieu to payment, he offered services.',
        right: 'In lieu of payment, he offered services.',
        whyTr: 'Kalıbın doğru edatı "in lieu to" değil, "in lieu OF"tur.',
      },
    ],
  },

  'c2-6': {
    nodeId: 'c2-6',
    overviewTr:
      'Büyük Sentez: Retorik Gramer ve Metinsel Bağdaşıklık (Grand Synthesis: Rhetorical Grammar & Textual Cohesion), İngilizce dilbilgisinin en tepe noktasıdır. Bütün A1–C2 kurallarının sadece "doğru" değil; "muazzam derecede ikna edici, dengeli, müzikal ve ritmik" bir bütünlük içinde nasıl bir araya getirileceğini öğretir:\n• Information Packaging & End-Weight: Eski/bilinen bilgiyi (Theme) cümlenin başına, yeni ve en ağır/vurucu bilgiyi (Rheme) ise cümlenin sonuna yerleştirme sanatı.\n• Parallelism & Balanced Antithesis: Birbiriyle zıt veya paralel fikirleri simetrik gramer yapısıyla kurgulamak (Not because it is easy, but because it is hard).\n• Chiasmus (Çaprazlama): Gramer dizilimini aynalayarak çarpıcı bir retorik doruk noktası yaratmak (Ask not what your country can do for you; ask what you can do for your country).\n• Cohesion & Micro-Transitions: Bir paragrafın bir cümleden diğerine tek bir pürüz olmadan akması.',
    timelineVisual: 'A1–B2 [ Doğruluk ] ──▶ C1 [ Zenginlik ] ──▶ C2 GRAND SYNTHESIS [ Kusursuz Retorik, Ritim & Ustalık ]',
    conjugationRows: [
      {
        formType: 'Son Ağırlık İlkesi (End-Weight Principle)',
        subject: 'Kısa Özne ──▶ Ağır ve Vurucu Yüklem/Nesne',
        formula: 'Short Theme + Verb + Heavily modified, complex Rheme',
        exampleEn: 'The committee unanimously approved a comprehensive, fifty-page regulatory overhaul designed to eradicate fraudulent cryptocurrency transactions.',
        exampleTr: 'Komite, sahte kripto para işlemlerini kökünden kazımak üzere tasarlanmış kapsamlı, elli sayfalık bir mevzuat revizyonunu oybirliğiyle onayladı.',
      },
      {
        formType: 'Paralelizm (Parallel Structure)',
        subject: 'A, B and C simetrik gramer yapısında',
        formula: 'to Verb, to Verb and to Verb / Gerund, Gerund and Gerund',
        exampleEn: 'True intellectual integrity requires interrogating our assumptions, acknowledging our biases, and embracing contradictory evidence.',
        exampleTr: 'Gerçek entelektüel dürüstlük; varsayımlarımızı sorgulamayı, önyargılarımızı kabul etmeyi ve çelişkili kanıtları kucaklamayı gerektirir.',
      },
      {
        formType: 'Antitez Simetrisi (Antithesis)',
        subject: 'Not X, but Y',
        formula: 'It is not that S + V, but rather that S + V',
        exampleEn: 'The crisis was precipitated not by a sudden collapse of demand, but rather by an unprecedented paralysis of the international supply apparatus.',
        exampleTr: 'Kriz, talepteki ani bir çöküşten değil; bilakis uluslararası tedarik mekanizmasının benzeri görülmemiş bir felcinden kaynaklandı.',
      },
      {
        formType: 'Büyük Retorik Sentez (Grand Cadence)',
        subject: 'Tüm C1–C2 yapılarının uyumlu orkestrasyonu',
        formula: 'Fronted Adverbial + Inversion + Subjunctive + Parallel Climax',
        exampleEn: 'Seldom in the annals of diplomacy has a consensus been so arduously negotiated, yet so fragilely maintained; come what may, the signatories must preserve the accord.',
        exampleTr: 'Diplomasi tarihinde nadiren bir uzlaşı bu denli meşakkatle müzakere edilmiş, ancak bu denli kırılgan bir şekilde korunmuştur; ne olursa olsun, imzacılar anlaşmayı muhafaza etmelidir.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • END-WEIGHT İLKESİ',
        title: '1. Son Ağırlık (End-Weight) İlkesi: Neden Vurucu Bilgi Sona Konur?',
        explanationTr:
          'İnsan beyni cümlenin sonundaki kelimeleri en çok hatırlar ve en çok önemser. Uzun ve hantal sıfat tamlamalarını cümlenin başına özne yapmak yerine, cümlenin sonuna yerleştirmek akıcılığı katbekat artırır:\n• Hantal Cümle: "A system that allows automated cross-border settlements without intermediary banks was invented." (Özne çok uzun, fiil en sonda güdük kaldı).\n• End-Weight ile Zarif: "Engineers invented A SYSTEM THAT ALLOWS AUTOMATED CROSS-BORDER SETTLEMENTS WITHOUT INTERMEDIARY BANKS."',
        formula: 'Kısa Özne ──▶ Fiil ──▶ Cümlenin en sonuna bırakılan ağır ve detaylı nesne',
        examples: [
          {
            en: 'We must never underestimate the profound psychological resilience of communities torn apart by natural catastrophe.',
            tr: 'Doğal felaketlerle parçalanmış toplulukların derin psikolojik direncini asla küçümsememeliyiz.',
            note: 'Uzun ve vurucu tamlama cümlenin sonuna bırakılarak son ağırlık ilkesi uygulandı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • PARALELİZM VE RİTİM',
        title: '2. Paralel Gramer Yapılarıyla Hipnotik Ritim Yaratma',
        explanationTr:
          'Cümle içinde sıralanan maddelerin veya karşıtlıkların gramer türü birebir aynı olmalıdır (İsim ise hepsi isim, mastar ise hepsi mastar):\n• ❌ He likes swimming, to jog, and reading books.\n• ✅ He likes SWIMMING, JOGGING, and READING.\n• Winston Churchill: "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields..." (Mükemmel anaphora ve paralelizm).',
        formula: 'Gramer Şablonu A = Gramer Şablonu B = Gramer Şablonu C',
        examples: [
          {
            en: 'To govern is to choose, to prioritize, and ultimately to assume responsibility for the consequences.',
            tr: 'Yönetmek; seçmek, önceliklendirmek ve nihayetinde sonuçların sorumluluğunu üstlenmektir.',
            note: 'Üç parçalı kusursuz mastar paralelizmi (tricolon).',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Noktalı Virgül (Semicolon) ve İki Nokta (Colon) Kullanımı',
        examples: 'The evidence was overwhelming; the defense had no rejoinder.',
        noteTr: 'İki bağımsız tam cümleyi bağlaçsız ama anlamsal sıkı bağla bağlarken noktalı virgül C2 anlatımının işaretidir.',
      },
    ],
    signalWords: [
      {
        word: 'Conversely / In stark contrast / In tandem with / Henceforth',
        meaningTr: 'tersine / taban tabana zıt olarak / ile el ele / bundan böyle',
        positionRule: 'Üst düzey retorik geçiş kelimeleridir.',
        sampleEn: 'Henceforth, all unilateral declarations shall be deemed invalid.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He was known for his courage, his intelligence, and because he was kind.',
        right: 'He was known for his courage, his intelligence, and his kindness.',
        whyTr: 'Paralelizm kuralı gereği ilk iki madde isim öbeğiyse son madde de isim öbeği ("his kindness") olmalıdır; cümle ("because he was kind") yapılamaz.',
      },
    ],
  },
};
