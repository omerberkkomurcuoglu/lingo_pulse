import { DeepGrammarGuide } from './types';

export const B2_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  'b2-1': {
    nodeId: 'b2-1',
    overviewTr:
      'İleri Düzey Edilgen Yapılar (Advanced Passives) ve Ettirgen Çatılar (Causatives: Have, Get, Make, Let), bir eylemin bizzat konuşmacı tarafından değil, başkasına yaptırıldığı veya yetkilendirildiği durumları anlatır.\n• Have / Get something done: Bir hizmeti profesyonele yaptırmak (I had my car repaired - Arabamı tamir ettirdim).\n• Have someone DO something: Birine bir işi yapması talimatını vermek (I had the assistant print the reports - Yalın fiil!).\n• Get someone TO DO something: Birini ikna ederek/uğraşarak bir işi yaptırmak (I got the technician to fix the server - TO ile!).\n• Make someone DO something: Birini bir eylemi yapmaya zorlamak (The coach made us run 10 kilometers).\n• Let someone DO something: Birine bir şeyi yapması için izin vermek (They let us leave early).\n• Çift Nesneli Edilgenler: "They gave her a scholarship" ──▶ "She was given a scholarship" (Kişi özne olur!).',
    timelineVisual: 'Yetki/Sipariş Veren ──▶ [ Aracı Kişi / Profesyonel ] ──▶ [ Eylem Tamamlanır: V3 / V1 ]',
    conjugationRows: [
      {
        formType: 'Hizmet Ettirgeni (Have/Get sth done)',
        subject: 'have / get + Nesne + V3',
        formula: 'Subject + have/get + Nesne + V3',
        exampleEn: 'We must have our financial statements audited by an external firm.',
        exampleTr: 'Mali tablolarımızı bağımsız bir denetim firmasına denetletmeliyiz.',
      },
      {
        formType: 'Kişi Ettirgeni (Have sb do)',
        subject: 'have + Kişi + V1 (Yalın!)',
        formula: 'Subject + have + Kişi + V1',
        exampleEn: 'The CEO had her secretary reschedule all the afternoon meetings.',
        exampleTr: 'CEO, sekreterine öğleden sonraki tüm toplantıları yeniden planlattı.',
      },
      {
        formType: 'İkna Ettirgeni (Get sb to do)',
        subject: 'get + Kişi + TO + V1',
        formula: 'Subject + get + Kişi + to + V1',
        exampleEn: 'We finally got the investors to sign the funding agreement.',
        exampleTr: 'Sonunda yatırımcıları fonlama anlaşmasını imzalamaya ikna ettik.',
      },
      {
        formType: 'Zorlama Ettirgeni (Make sb do)',
        subject: 'make + Kişi + V1 (Yalın!)',
        formula: 'Subject + make + Kişi + V1',
        exampleEn: 'The strict regulations make companies disclose their carbon emissions.',
        exampleTr: 'Katı düzenlemeler şirketleri karbon emisyonlarını açıklamaya mecbur bırakıyor.',
      },
      {
        formType: 'Çift Nesneli Edilgen (Kişi Özne)',
        subject: 'Kişi + was/were + V3 + Nesne',
        formula: 'Person + be + V3 + Object',
        exampleEn: 'Dr. Watson was awarded the Nobel Prize in Medicine.',
        exampleTr: 'Dr. Watson’a Tıp alanında Nobel Ödülü verildi.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • HAVE vs GET İKİLEMİ',
        title: '1. Causative Formül Sınavı: Have sb DO vs. Get sb TO DO',
        explanationTr:
          'Sınavlarda en çok sorulan çeldirici: "Have" fiili nesneden sonra fiili YALIN (do) alırken, "Get" fiili araya "TO" (to do) alır!\n• S + have + someone + V1 (bare infinitive)\n• S + get + someone + TO + V1 (full infinitive)\n• İkisi de hizmet/nesne aldığında aynıdır: have/get something DONE (V3).',
        formula: 'have + person + DO  |  get + person + TO DO  |  have/get + thing + DONE',
        examples: [
          {
            en: 'The manager had the team submit the report, but she had to get the director to approve it.',
            tr: 'Yönetici ekibe raporu teslim ettirdi (had the team submit), ancak müdüre onaylatmak için onu ikna etmek zorunda kaldı (get the director to approve).',
            note: '"Submit" to’suz, "approve" ise to ile kullanıldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • MAKE EDİLGEN OLUNCA TO ALIR!',
        title: '2. "Make" Fiilinin Gizli Tuzağı: Edilgende "TO" Gelir!',
        explanationTr:
          'Etken cümlede "make someone DO" (yalın) iken, bu cümle edilgen (Passive) yapıldığında fiil araya "TO" alır!\n• Active: "The guard made them wait." (Yalın: wait)\n• Passive: "They were made TO wait by the guard." (to wait!).',
        formula: 'Active: make sb DO  ──▶  Passive: be made TO DO',
        examples: [
          {
            en: 'The witnesses were made to sign non-disclosure agreements.',
            tr: 'Tanıklara gizlilik sözleşmeleri imzalatıldı (zorla imzalatıldı).',
            note: 'Passive olduğu için "were made to sign" şeklinde "to" aldı.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Let Fiili Edilgen Yapılamaz, "Be allowed to" Olur',
        examples: 'Active: They let us go.  ──▶  Passive: We were allowed to go. (❌ We were let go denmez)',
        noteTr: '"Let" edilgende "be allowed to" kalıbına dönüşür.',
      },
    ],
    signalWords: [
      {
        word: 'have sth done / get sth done',
        meaningTr: 'bir şeyi profesyonele yaptırmak',
        positionRule: 'Subject + have/get + Object + V3.',
        sampleEn: 'I am having my teeth cleaned tomorrow.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I repaired my car yesterday. (Tamirciye yaptırdıysanız)',
        right: 'I had my car repaired yesterday.',
        whyTr: 'Eğer tamiri siz değil profesyonel tamirci yaptıysa "had my car repaired" denmelidir; "repaired my car" kendiniz yaptınız anlamına gelir.',
      },
      {
        wrong: 'She had her assistant to print the files.',
        right: 'She had her assistant print the files.',
        whyTr: '"Have someone..." kalıbında "to" kullanılmaz, fiil yalın kalır.',
      },
    ],
  },

  'b2-2': {
    nodeId: 'b2-2',
    overviewTr:
      'Üçüncü Tip Şart Cümleleri (Type 3 Conditionals), Karışık Şartlar (Mixed Conditionals) ve Dilek Cümleleri (Wish Clauses), geçmişteki pişmanlıkları ve gerçekleşmemiş alternatif senaryoları anlatır.\n• Type 3 (Geçmiş Pişmanlık): If + had V3, would have V3 (Geçmişte öyle olsaydı, geçmişte öyle olurdu: If I had studied harder, I would have passed).\n• Mixed Conditional 1 (Geçmiş Şart ──▶ Şimdiki Sonuç): If + had V3, would + V1 (Geçmişte o kararı alsaydım, ŞU ANDA hayatım şöyle olurdu: If I had accepted that job in London, I would be living there now).\n• Mixed Conditional 2 (Karakter Özelliği/Genel Durum ──▶ Geçmiş Sonuç): If + were/past, would have V3 (Genel olarak böyle biri olsaydım, o geçmiş hatayı yapmazdım).\n• Wish Clauses: I wish / If only + Past (Şimdiki durumdan yakınma: I wish I knew) | I wish + Past Perfect (Geçmiş pişmanlık: I wish I had listened).',
    timelineVisual: 'Geçmişte Yaşandı: [ Keşke Had + V3 Olsaydı ] ──▶ Geçmiş Sonuç: [ Would have V3 ] / Şimdiki Sonuç: [ Would + V1 now ]',
    conjugationRows: [
      {
        formType: 'Type 3 (Geçmiş ──▶ Geçmiş)',
        subject: 'If + had V3, would have V3',
        formula: 'If + had + V3, would/could/might have + V3',
        exampleEn: 'If the captain had seen the iceberg earlier, the ship wouldn’t have collided with it.',
        exampleTr: 'Kaptan buzdağını daha önce görmüş olsaydı, gemi ona çarpmazdı.',
      },
      {
        formType: 'Mixed 1 (Geçmiş Şart ──▶ Şimdiki Sonuç)',
        subject: 'If + had V3, would + V1 (NOW)',
        formula: 'If + had + V3, would + V1 (now / today)',
        exampleEn: 'If she had invested in tech stocks in 2010, she would be a millionaire today.',
        exampleTr: '2010’da teknoloji hisselerine yatırım yapmış olsaydı (geçmiş), bugün milyoner olurdu (şimdi).',
      },
      {
        formType: 'Mixed 2 (Genel Durum ──▶ Geçmiş Sonuç)',
        subject: 'If + Past Simple, would have V3',
        formula: 'If + were / V2, would have + V3 (yesterday / then)',
        exampleEn: 'If he weren’t so arrogant, he wouldn’t have insulted the committee yesterday.',
        exampleTr: 'Bu kadar kibirli biri olmasaydı (genel karakteri), dün komiteye hakaret etmezdi.',
      },
      {
        formType: 'Wish - Şimdiki Zaman Yakınması',
        subject: 'I wish + Past Simple',
        formula: 'I wish / If only + Subject + were / V2',
        exampleEn: 'I wish I had access to the high-performance computing cluster right now.',
        exampleTr: 'Keşke şu anda yüksek performanslı bilgi işlem kümesine erişimim olsa (maalesef yok).',
      },
      {
        formType: 'Wish - Geçmiş Pişmanlığı',
        subject: 'I wish + Past Perfect',
        formula: 'I wish / If only + Subject + had + V3',
        exampleEn: 'I wish we had backed up the database before running the update script.',
        exampleTr: 'Keşke güncelleme komut dosyasını çalıştırmadan önce veritabanını yedeklemiş olsaydık.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • MIXED CONDITIONALS MANTIĞI',
        title: '1. Karışık Şartların Mantığı: Zaman Çizgisini Kırmak',
        explanationTr:
          'Standart Type 3’te her iki taraf da geçmiştedir (If I had won, I would have bought - O zaman kazansaydım, o zaman alırdım). Ancak Mixed Conditional’da şart GEÇMİŞTE kalmışken, sonucu ŞU ANDA HÂLÂ DEVAM ETMEKTEDİR! Bu yüzden ana cümlede "would have V3" değil, "would + V1" (yalın) ve "now / today" kullanılır.',
        formula: 'If + had + V3 (Geçmiş) ──▶ would + V1 + now (Şu anki sonuç)',
        examples: [
          {
            en: 'If I hadn’t broken my leg last month, I would be participating in the marathon today.',
            tr: 'Geçen ay bacağımı kırmamış olsaydım (geçmiş: hadn’t broken), bugün maratona katılıyor olurdum (şu an: would be participating).',
            note: 'Geçmişteki kaza, bugünkü durumu belirledi.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • WISH VE IF ONLY KURALLARI',
        title: '2. "Wish" Cümlelerinde 1 Derece Geçmişe Gitme Kuralı',
        explanationTr:
          '"Wish" dilek cümlelerinde zaman DAİMA bir derece geriye çekilir:\n• Şimdiki zaman dileği (Şu an zengin değilim) ──▶ I wish I WERE rich (Past Simple).\n• Geçmiş zaman pişmanlığı (Dün ona bağırdım) ──▶ I wish I HADN’T shouted at him (Past Perfect).\n• Başkasının sinir bozucu alışkanlığını değiştirmesini isteme ──▶ I wish you WOULD stop interrupting me (Would + V1).',
        formula: 'Şimdi için: wish + V2  |  Geçmiş için: wish + had V3  |  Şikayet için: wish + would',
        examples: [
          {
            en: 'If only we had consulted the legal team before signing the partnership agreement.',
            tr: 'Keşke ortaklık sözleşmesini imzalamadan önce hukuk ekibine danışmış olsaydık (büyük pişmanlık).',
            note: '"If only" yapısı "I wish"ten daha güçlü ve dramatik bir pişmanlık vurgular.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Kendimiz İçin "I wish I would" KULLANILAMAZ',
        examples: '❌ I wish I would stop smoking  ──▶  ✅ I wish I could stop smoking',
        noteTr: '"Would" başkasının davranışından şikayet ederken kullanılır; kendi isteklerimizde "could" kullanılır.',
      },
    ],
    signalWords: [
      {
        word: 'If only / I wish / but for',
        meaningTr: 'Keşke / olmasaydı',
        positionRule: 'Cümle başında yer alır.',
        sampleEn: 'If only I had listened to your advice!',
      },
    ],
    turkishTraps: [
      {
        wrong: 'If I studied, I would have passed the exam yesterday.',
        right: 'If I had studied, I would have passed the exam yesterday.',
        whyTr: 'Dünkü sınavı geçebilmek geçmişte çalışmaya bağlıdır; her iki taraf da geçmiş olduğu için Type 3 (had studied) zorunludur.',
      },
      {
        wrong: 'I wish I didn’t say that yesterday.',
        right: 'I wish I hadn’t said that yesterday.',
        whyTr: 'Dün söylenen bir söze duyulan geçmiş pişmanlığı için Past Perfect ("hadn’t said") kullanılır.',
      },
    ],
  },

  'b2-3': {
    nodeId: 'b2-3',
    overviewTr:
      'Sıfat Cümlecikleri (Relative Clauses) ve Ortaç Kısaltmaları (Participle Reductions), akademik ve ileri düzey İngilizcede uzun, profesyonel cümleler kurmanın en önemli aracıdır.\n• Defining (Belirten: virgülsüz): Bahsedilen nesneyi/kişiyi tanımlamak için şart olan bilgiyi verir (The researcher who developed the algorithm won the award).\n• Non-Defining (Ek Bilgi Veren: iki virgül arasında): Zaten bilinen bir özneye ekstra bilgi ekler. En kritik kural: VİRGÜLDEN SONRA ASLA "THAT" GELMEZ! Zorunlu olarak "which" veya "who" kullanılır.\n• Edat + Whom / Which: Preposition cümleciğin başına çekilir (The project in which we invested).\n• Participle Reductions (Cümlecik Kısaltmaları): Uzun "who/which" bağlaçları atılarak etken fiiller V-ing, edilgen fiiller ise V3 ile kısaltılır!',
    timelineVisual: 'Uzun Cümlecik: [ The man who is sitting there ] ──▶ Kısaltma: [ The man sitting there ]',
    conjugationRows: [
      {
        formType: 'Kişi Niteleme (Who / Whom)',
        subject: 'Who (Özne) / Whom (Nesne)',
        formula: 'Person + who + Verb  |  Person + whom + Subject + Verb',
        exampleEn: 'The scientist whom the committee interviewed had published fifty papers.',
        exampleTr: 'Komitenin mülakat yaptığı bilim insanı elli makale yayımlamıştı.',
      },
      {
        formType: 'Nesne Niteleme (Which / That)',
        subject: 'Which (Virgüllü/Virgülsüz) / That (Sadece Virgülsüz)',
        formula: 'Thing + which / that + Clause',
        exampleEn: 'This algorithm, which was created in Zurich, processes images in milliseconds.',
        exampleTr: 'Zürih’te oluşturulan bu algoritma (ek bilgi), görüntüleri milisaniyeler içinde işler.',
      },
      {
        formType: 'Aitlik (Whose)',
        subject: 'whose + İsim (Kişi veya Nesne)',
        formula: 'Noun + whose + Noun',
        exampleEn: 'We selected the startup whose business model showed the lowest risk.',
        exampleTr: 'İş modeli en düşük riski gösteren girişimi seçtik.',
      },
      {
        formType: 'Edatlı İlgi Cümleciği',
        subject: 'Preposition + whom / which',
        formula: 'Prep + whom (insan) / Prep + which (nesne)',
        exampleEn: 'The conference at which she presented her theory was held in Oxford.',
        exampleTr: 'Teorisini sunduğu konferans Oxford’da düzenlendi.',
      },
      {
        formType: 'Etken Kısaltma (Active Reduction)',
        subject: 'who/which + V ──▶ V-ing',
        formula: 'Noun + V-ing',
        exampleEn: 'Passengers traveling to Tokyo should proceed to gate 14.',
        exampleTr: 'Tokyo’ya seyahat eden yolcular (who are traveling ──▶ traveling) 14 numaralı kapıya gitmelidir.',
      },
      {
        formType: 'Edilgen Kısaltma (Passive Reduction)',
        subject: 'which/who + be + V3 ──▶ V3',
        formula: 'Noun + V3',
        exampleEn: 'The methodology described in chapter three will be applied throughout the study.',
        exampleTr: 'Üçüncü bölümde açıklanan metodoloji (which is described ──▶ described) çalışma boyunca uygulanacaktır.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • VİRGÜL VE THAT KURALI',
        title: '1. Sınavların En Katı Kuralı: Virgül Varsa "THAT" KULLANILAMAZ!',
        explanationTr:
          'İki virgül arasında veya tek virgülün arkasında yer alan ek bilgi cümleciklerinde (Non-defining relative clauses) "THAT" kullanımı kesinlikle YASAKTIR!\n• İnsanlar için: who / whom / whose\n• Cansızlar / Durumlar için: which\n• ❌ Albert Einstein, that discovered relativity...  ──▶  ✅ Albert Einstein, who discovered relativity...',
        formula: ', that... KESİNLİKLE YANLIŞ!  ──▶  , which... / , who...',
        examples: [
          {
            en: 'The European Central Bank, which is based in Frankfurt, announced a new monetary policy.',
            tr: 'Merkezi Frankfurt’ta bulunan Avrupa Merkez Bankası (ek bilgi), yeni bir para politikası açıkladı.',
            note: 'Virgülle ayrıldığı için "that" kullanılamaz, "which" zorunludur.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • EDATIN BAŞA GELMESİ',
        title: '2. Formal Preposition Placement: "In which, With whom, To which"',
        explanationTr:
          'Günlük konuşmada edat cümlenin sonunda kalabilir ("The topic that we talked about"). Ancak akademik ve resmi dilde edat relative pronoun\'ın önüne taşınır ve bu durumda SADECE "WHOM" (insanlar için) veya "WHICH" (nesneler için) kullanılabilir!\n• "The company for which he works" (Çalıştığı şirket).\n• "The delegates with whom we negotiated" (Müzakere ettiğimiz delegeler).',
        formula: 'Preposition + whom (insan)  |  Preposition + which (nesne)',
        examples: [
          {
            en: 'The clinical trial in which five hundred patients participated demonstrated remarkable efficacy.',
            tr: 'Beş yüz hastanın katıldığı klinik deney (in which), kayda değer bir etkinlik gösterdi.',
            note: '"Participate in" fiilindeki "in" edatı "which"in başına çekildi.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • CÜMLECİK KISALTMALARI',
        title: '3. Participle Reductions: Metinleri Profesyonelleştiren Kısaltmalar',
        explanationTr:
          'Gereksiz "who/which + be" tekrarlarından kurtulmak için:\n1) ETKEN eylem kısaltması: Fiile "-ing" eklenir.\n• "Anyone who wants to register" ──▶ "Anyone wanting to register"\n2) EDİLGEN eylem kısaltması: Doğrudan 3. hal (V3) bırakılır.\n• "The documents that were stolen from the embassy" ──▶ "The documents stolen from the embassy"\n3) SIRA SAYILARINDAN SONRA: "To + V1" ile kısaltılır.\n• "The first woman who won the prize" ──▶ "The first woman TO WIN the prize".',
        formula: 'Active: Noun + V-ing  |  Passive: Noun + V3  |  The first/only: to + V1',
        examples: [
          {
            en: 'Neil Armstrong was the first human to step onto the surface of the Moon.',
            tr: 'Neil Armstrong, Ay’ın yüzeyine ayak basan ilk insandı (the first human to step).',
            note: '"The first" sıfatından sonra kısaltma "to V1" ile yapılır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Tüm Cümleyi Niteleyen "Which"',
        examples: 'He passed all his exams on the first attempt, which surprised everyone.',
        noteTr: 'Buradaki "which" tek bir kelimeyi değil, virgülden önceki cümlenin TAMAMINI niteler.',
      },
    ],
    signalWords: [
      {
        word: 'whereby / wherein / wherein',
        meaningTr: 'sayesinde / aracılığıyla / içinde',
        positionRule: 'Akademik ve hukuki metinlerde "by which / in which" yerine kullanılır.',
        sampleEn: 'They established a framework whereby all complaints are audited independently.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'My father, that lives in Ankara, is a doctor.',
        right: 'My father, who lives in Ankara, is a doctor.',
        whyTr: 'Virgülle ayrılan ek bilgi cümleciklerinde asla "that" kullanılmaz; insan için "who" zorunludur.',
      },
      {
        wrong: 'The car which its engine broke down was towed.',
        right: 'The car whose engine broke down was towed.',
        whyTr: '"Which its" denmez; sahiplik bağlacı "whose" kullanılır.',
      },
    ],
  },

  'b2-4': {
    nodeId: 'b2-4',
    overviewTr:
      'Dolaylı Anlatım (Reported Speech) ve İleri Raporlama Fiilleri (Complex Reporting Verbs), bir başkasının söylediği sözleri veya iddialarını aktarmak için kullanılır.\n• Tense Backshift (Zaman Kayması): Ana raporlama fiili geçmişteyse (said, told, claimed), aktarılan cümlenin zamanı bir derece geçmişe kayar:\n  - Present Simple ──▶ Past Simple\n  - Present Continuous ──▶ Past Continuous\n  - Simple Past / Present Perfect ──▶ Past Perfect\n  - Will ──▶ Would | Can ──▶ Could\n• İleri Raporlama Fiilleri: Sadece "said" veya "told" demek yerine akademide ve iş dünyasında spesifik fiil kalıpları kullanılır:\n  - Verb + that + Clause: explain, admit, claim, suggest\n  - Verb + sb + to V1: advise, warn, encourage, remind\n  - Verb + preposition + V-ing: apologize for, accuse of, insist on, congratulate on\n  - Verb + to V1: agree, refuse, offer, promise.',
    timelineVisual: 'Doğrudan Söz: "I am working" ──▶ Dolaylı Anlatım: She said that she was working',
    conjugationRows: [
      {
        formType: 'Düz Raporlama (Said that)',
        subject: 'Subject + said (that) + Backshift',
        formula: 'said (that) + Past Tense',
        exampleEn: 'The spokesperson said that the company had resolved the network failure.',
        exampleTr: 'Sözcü, şirketin ağ arızasını çözmüş olduğunu söyledi.',
      },
      {
        formType: 'Kişili Raporlama (Told sb)',
        subject: 'Subject + told + Kişi (that)',
        formula: 'told + Kişi (me, us, him) + that',
        exampleEn: 'The doctor told him that he needed complete bed rest.',
        exampleTr: 'Doktor ona tam yatak istirahatine ihtiyacı olduğunu söyledi.',
      },
      {
        formType: 'Edatlı Raporlama Fiili (Accuse of / Insist on)',
        subject: 'Verb + (sb) + Prep + V-ing',
        formula: 'accuse sb OF V-ing / insist ON V-ing',
        exampleEn: 'The prosecutor accused the executive of concealing financial losses.',
        exampleTr: 'Savcı, yöneticiyi mali kayıpları gizlemekle suçladı.',
      },
      {
        formType: 'Emir/Uyarı Raporlama (Warn sb not to)',
        subject: 'Verb + sb + (not) to + V1',
        formula: 'warn / advise / remind sb + to V1',
        exampleEn: 'The engineer warned us not to touch the high-voltage transformer.',
        exampleTr: 'Mühendis bizi yüksek gerilim trafosuna dokunmamamız konusunda uyardı.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • SAY vs TELL',
        title: '1. Say vs. Tell Ayrımı: Kime Söylendiği Var mı?',
        explanationTr:
          '• SAY: Arkasından doğrudan kişi nesnesi ALMAZ. "She said that..." (❌ She said me that denemez!). Eğer kime söylendiği belirtilecekse "said TO me" denmelidir.\n• TELL: Arkasından MUTLAKA bir kişi nesnesi almak zorundadır: "She told ME that..." (❌ She told that denemez!).',
        formula: 'said (that)...  |  said TO me that...  |  told ME that...',
        examples: [
          {
            en: 'She told the board that revenues had increased, and the chairman said that everyone deserved a bonus.',
            tr: 'Yönetim kuruluna gelirlerin arttığını söyledi (told the board), ve başkan herkesin ikramiyeyi hak ettiğini söyledi (said that).',
            note: '"Told" nesne aldı ("the board"), "said" ise doğrudan "that" ile bağlandı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • ZAMAN ZARFLARININ DEĞİŞİMİ',
        title: '2. Dolaylı Anlatımda Mekan ve Zaman Zarflarının Dönüşümü',
        explanationTr:
          'Cümle aktarılırken sadece fiiller değil, zaman ve mekan zarfları da dönüşür:\n• now ──▶ then / at that time\n• today ──▶ that day\n• yesterday ──▶ the day before / the previous day\n• tomorrow ──▶ the following day / the next day\n• here ──▶ there\n• this ──▶ that / these ──▶ those',
        formula: 'now ──▶ then  |  yesterday ──▶ the day before  |  tomorrow ──▶ the next day',
        examples: [
          {
            en: '“I will call you tomorrow,” he said. ──▶ He said that he would call me the following day.',
            tr: 'Ertesi gün beni arayacağını söyledi.',
            note: '"Will" ──▶ "would", "tomorrow" ──▶ "the following day" oldu.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • İLERİ RAPORLAMA ŞABLONLARI',
        title: '3. Özel Raporlama Fiilleri Matrisi',
        explanationTr:
          '• Verb + to V1: agree, refuse, promise, offer, threaten (He refused to sign).\n• Verb + sb + to V1: tell, order, warn, advise, encourage, remind (She advised me to wait).\n• Verb + -ing: admit, deny, suggest, recommend (He denied leaking the documents).\n• Verb + prep + -ing: apologize for, insist on, accuse of, congratulate on (She apologized for being late).',
        formula: 'refuse to V1  |  advise sb to V1  |  deny V-ing  |  accuse sb of V-ing',
        examples: [
          {
            en: 'The suspect denied stealing the necklace, but the witness accused him of lying.',
            tr: 'Şüpheli kolyeyi çaldığını inkar etti (denied stealing), ancak tanık onu yalan söylemekle suçladı (accused him of lying).',
            note: '"Deny + V-ing" ve "accuse of + V-ing" kalıpları bir arada.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Genel Geçer Bilimsel Gerçeklerde Zaman Geriye Kaymaz',
        examples: 'The teacher said that water boils at 100°C. (boiled denmez)',
        noteTr: 'Evrensel doğa kanunları aktarılırken Simple Present korunur.',
      },
    ],
    signalWords: [
      {
        word: 'the previous day / the following week',
        meaningTr: 'bir önceki gün / ertesi hafta',
        positionRule: 'Dolaylı anlatım yapıldığını gösteren en güçlü sinyal zarflardır.',
        sampleEn: 'She stated that the contract had been approved the previous week.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He said me that he was tired.',
        right: 'He told me that he was tired. (veya He said that he was tired)',
        whyTr: '"Say" fiilinden sonra doğrudan nesne zamiri ("me") gelemez.',
      },
      {
        wrong: 'She suggested me to buy a new laptop.',
        right: 'She suggested that I should buy a new laptop. (veya suggested buying)',
        whyTr: '"Suggest" fiili ASLA "suggest someone to do" kalıbını almaz! "Suggest V-ing" veya "suggest that S + (should) V1" alır.',
      },
    ],
  },

  'b2-5': {
    nodeId: 'b2-5',
    overviewTr:
      'Gelecekte Süreklilik ve Gelecekte Tamamlanmışlık Kipleri (Future Continuous: will be + V-ing & Future Perfect: will have + V3), gelecekteki zaman referanslarını mikroskop hassasiyetiyle konumlandırır:\n• FUTURE CONTINUOUS (will be + V-ing): Gelecekte belirli bir anda veya süreçte DEVAM ETMEKTE OLACAK eylemleri anlatır (This time tomorrow, I will be flying over the Atlantic - Tam o saatte uçağın içindeyim, uçuşum sürüyor olacak).\n• FUTURE PERFECT (will have + V3): Gelecekteki bir referans noktasından ÖNCE TAMAMLANMIŞ OLACAK eylemleri anlatır. En büyük tetikleyici bağlacı "BY" (-e kadar) kalıbıdır (By 2030, scientists will have cured this disease - 2030 yılı gelmeden önce tedavi çoktan bulunmuş olacak).\n• FUTURE PERFECT CONTINUOUS (will have been + V-ing): Gelecekteki bir noktaya kadar kesintisiz devam etmiş eylemin toplam süresini vurgular (By next year, I will have been teaching for twenty years).',
    timelineVisual: '[ ŞİMDİ ] ──▶ Gelecekte Süren: [ will be doing ] ──▶ Belirli Noktadan Önce Biten: [ will have done ★ By 2030 ]',
    conjugationRows: [
      {
        formType: 'Future Continuous (+)',
        subject: 'will be + V-ing',
        formula: 'Subject + will be + V-ing',
        exampleEn: 'This time next Friday, we will be presenting our research at the symposium.',
        exampleTr: 'Gelecek cuma tam bu saatte sempozyumda araştırmamızı sunuyor olacağız.',
      },
      {
        formType: 'Future Perfect (+)',
        subject: 'will have + V3',
        formula: 'Subject + will have + V3',
        exampleEn: 'By the end of this quarter, the development team will have migrated the entire cloud infrastructure.',
        exampleTr: 'Bu çeyreğin sonuna kadar geliştirme ekibi tüm bulut altyapısını taşımış olacak.',
      },
      {
        formType: 'Future Perfect Continuous',
        subject: 'will have been + V-ing',
        formula: 'Subject + will have been + V-ing + for ...',
        exampleEn: 'By November, Professor Adams will have been lecturing at this university for three decades.',
        exampleTr: 'Kasım ayı geldiğinde Profesör Adams otuz yıldır bu üniversitede ders veriyor olacak.',
      },
      {
        formType: 'Future Perfect Passive',
        subject: 'will have been + V3',
        formula: 'Subject + will have been + V3',
        exampleEn: 'The new subway line will have been completed before the Olympic Games open.',
        exampleTr: 'Yeni metro hattı Olimpiyat Oyunları açılmadan önce tamamlanmış olacaktır.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • WILL BE DOING vs WILL HAVE DONE',
        title: '1. Eylemin Ortasında Olmak vs. Önceden Bitirmiş Olmak',
        explanationTr:
          '• Will be doing: Eylem henüz bitmemiştir, tam o anda sürmektedir ("Don’t phone at 8:00; we will be having dinner").\n• Will have done: Eylem o an gelmeden önce çoktan bitmiş ve sonuçlanmıştır ("Phone at 9:00; we will have finished dinner").',
        formula: 'Tam o anda sürüyor = will be V-ing  |  O andan önce bitmiş = will have V3',
        examples: [
          {
            en: 'At 10:00 AM tomorrow, the inspectors will be examining the factory floor.',
            tr: 'Yarın sabah 10:00’da müfettişler fabrikayı inceliyor olacaklar (incelemenin ortasında).',
            note: 'Tam o saatte sürmekte olan eylem (Continuous).',
          },
          {
            en: 'By 5:00 PM tomorrow, the inspectors will have finalized their official audit report.',
            tr: 'Yarın akşam 17:00’ye kadar müfettişler resmi denetim raporlarını tamamlamış olacaklar.',
            note: 'O saat gelmeden önce eylem tamamlanmış olacak (Perfect).',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • BY + GELECEK ZAMAN KURALI',
        title: '2. "By" Bağlacı: Future Perfect’in Değişmez Parolası',
        explanationTr:
          '"By" edatı gelecek bir zaman ifadesiyle birleştiğinde (by tomorrow, by next year, by 2030, by the time S + V1), o noktadan önce tamamlanmışlığı vurgular ve cümleyi zorunlu olarak FUTURE PERFECT (will have + V3) yapar!',
        formula: 'By + Gelecek Zaman Noktası ──▶ Will have + V3',
        examples: [
          {
            en: 'By the time you return from your sabbatical, we will have recruited the entire software team.',
            tr: 'Siz araştırma izninizden dönene kadar (by the time you return), biz tüm yazılım ekibini işe almış olacağız.',
            note: '"By the time" yanına Present Simple alır, ana cümle "will have recruited" olur.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'By the time Cümlesinde "Will" Kullanılmaz',
        examples: '❌ By the time you will arrive  ──▶  ✅ By the time you arrive',
        noteTr: 'Zaman bağlaçlarının kuralı burada da geçerlidir: Yan cümle Present Simple kalır.',
      },
    ],
    signalWords: [
      {
        word: 'by then / by that time / by tomorrow evening',
        meaningTr: 'o zamana kadar / yarına kadar',
        positionRule: 'Future Perfect için en karakteristik zaman ifadesidir.',
        sampleEn: 'By then, all diplomatic negotiations will have concluded.',
      },
      {
        word: 'this time next week / this time tomorrow',
        meaningTr: 'gelecek hafta tam bu vakitte / yarın bu saatte',
        positionRule: 'Future Continuous için standart tetikleyicidir.',
        sampleEn: 'This time next week, we will be skiing in the Swiss Alps.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'By 2030, electric vehicles will replace diesel engines.',
        right: 'By 2030, electric vehicles will have replaced diesel engines.',
        whyTr: '"By 2030" bir bitiş sınırıdır; o tarihe kadar tamamlanmış olacağı için "will have replaced" zorunludur.',
      },
      {
        wrong: 'By the time he will come, I will have finished.',
        right: 'By the time he comes, I will have finished.',
        whyTr: '"By the time" yanına gelecek zaman "will" almaz, Present Simple ("comes") alır.',
      },
    ],
  },

  'b2-6': {
    nodeId: 'b2-6',
    overviewTr:
      'İsim-Fiiller (Gerunds: V-ing) ve Mastarlar (Infinitives: to + V1), iki fiilin yan yana geldiğinde ikinci fiilin hangi biçimi alacağını belirler. En hayati ayrım; hem Gerund hem Infinitive alabilen fakat ANLAMI 180 DERECE DEĞİŞEN kritik fiillerdir:\n• STOP doing (bir alışkanlığı/eylemi tamamen bırakmak) vs. STOP to do (başka bir şey yapmak amacıyla duraklamak).\n• REMEMBER doing (geçmişte yapılmış bir anıyı hatırlamak) vs. REMEMBER to do (yapılması gereken bir görevi unutmayıp yapmak).\n• REGRET doing (geçmişte yapılan bir hatadan pişman olmak) vs. REGRET to inform (üzülerek resmi bir haber vermek).\n• TRY doing (farklı bir yöntem olarak denemek/test etmek) vs. TRY to do (zor bir işi başarmak için çabalamak).\n• EDAT + V-ing KURALI: İngilizcede istisnasız TÜM edatlardan (in, on, at, about, without, for, of, by) sonra fiil gelirse zorunlu olarak "V-ing" (Gerund) olur!',
    timelineVisual: 'Geçmiş Anı / Deneyim: [ Gerund: V-ing ] ──▶ Gelecek Görev / Amaç: [ Infinitive: to + V1 ]',
    conjugationRows: [
      {
        formType: 'Sadece Gerund Alan Fiiller (V-ing)',
        subject: 'enjoy, avoid, consider, admit, delay, risk, postpone',
        formula: 'Verb + V-ing',
        exampleEn: 'The executive avoided answering questions about the company’s offshore accounts.',
        exampleTr: 'Yönetici şirketin denizaşırı hesapları hakkındaki soruları yanıtlamaktan kaçındı.',
      },
      {
        formType: 'Sadece Infinitive Alan Fiiller (to V1)',
        subject: 'decide, hope, manage, refuse, agree, afford, pretend',
        formula: 'Verb + to + V1',
        exampleEn: 'The board decided to postpone the international IPO.',
        exampleTr: 'Yönetim kurulu uluslararası halka arzı ertelemeye karar verdi.',
      },
      {
        formType: 'Anlam Değiştiren: STOP',
        subject: 'Stop doing (Bırakmak) vs Stop to do (Amacıyla durmak)',
        formula: 'stop V-ing  |  stop to V1',
        exampleEn: 'He stopped smoking three years ago, but on long drives he stops to buy coffee.',
        exampleTr: 'Üç yıl önce sigara içmeyi bıraktı (stop V-ing), ancak uzun yolculuklarda kahve almak için duraklar (stop to buy).',
      },
      {
        formType: 'Anlam Değiştiren: REMEMBER',
        subject: 'Remember doing (Geçmiş anı) vs Remember to do (Görev)',
        formula: 'remember V-ing  |  remember to V1',
        exampleEn: 'I remember locking the laboratory door, so please remember to bring your key card.',
        exampleTr: 'Laboratuvar kapısını kilitlediğimi hatırlıyorum (anı); bu yüzden kartını getirmeyi unutma (görev).',
      },
      {
        formType: 'Edat Sonrası Kuralı',
        subject: 'Preposition + V-ing',
        formula: 'Prep + V-ing (without, of, about, in, look forward to)',
        exampleEn: 'She succeeded by working tirelessly without complaining.',
        exampleTr: 'Şikayet etmeksizin (without complaining) yorulmadan çalışarak (by working) başardı.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ANLAM DEĞİŞTİREN 5 BÜYÜK FİİL',
        title: '1. Sınavların En Tehlikeli Ayrımı: Remember, Forget, Regret, Stop, Try',
        explanationTr:
          '• STOP: "Stop talking" (Konuşmayı kesin) vs "Stop to talk" (Konuşmak için durun).\n• REMEMBER: "Remember locking" (Kilitlediğimi anımsıyorum) vs "Remember to lock" (Kilitlemeyi unutma).\n• REGRET: "I regret saying that" (O lafı söylediğime pişmanım) vs "I regret to announce" (Üzülerek duyurmak zorundayım).\n• TRY: "Try restarting the router" (Modemi yeniden başlatmayı bir dene bakalım) vs "Try to push the heavy box" (Ağır kutuyu itmeye çabala).\n• FORGET: "I will never forget meeting the President" (Başkanla tanıştığım anı asla unutmayacağım) vs "Don’t forget to submit the form" (Formu teslim etmeyi unutma).',
        formula: 'V-ing = Geçmiş anı / Alışkanlık  |  To V1 = Görev / Amaç',
        examples: [
          {
            en: 'We regret to inform you that your application was unsuccessful, though you shouldn’t regret applying.',
            tr: 'Başvurunuzun başarısız olduğunu üzülerek bildiririz (regret to inform), yine de başvurduğunuza pişman olmamalısınız (regret applying).',
            note: 'Tek cümlede her iki anlamın karşılaştırması.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • "TO" BİR EDATTIR TUZAĞI',
        title: '2. "To"nun Mastar Değil EDAT Olduğu Özel Kalıplar (To + V-ing)',
        explanationTr:
          'Genellikle "to"dan sonra yalın fiil (to go) gelir. ANCAK bazı özel kalıplarda "to" mastar değil bir EDATTIR (Preposition). Edatlardan sonra ise MUTLAKA "V-ing" gelmek zorundadır!\n• Look forward TO + V-ing: Dört gözle beklemek (I look forward to hearing from you).\n• Be used TO / Get used TO + V-ing: Alışkın olmak (She is used to working under pressure).\n• Object TO + V-ing: İtiraz etmek (They object to paying extra fees).\n• With a view TO + V-ing: Amacıyla (He studied hard with a view to passing the exam).',
        formula: 'look forward to / be used to / object to + V-ing (DİKKAT!)',
        examples: [
          {
            en: 'We are looking forward to welcoming your delegation in Geneva.',
            tr: 'Heyetinizi Cenevre’de ağırlamayı dört gözle bekliyoruz (to welcoming!).',
            note: '"To welcome" değil, edat olduğu için "to welcoming" kullanılır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Cümle Başı Özne Olan Fiiller Gerund (V-ing) Olur',
        examples: 'Smoking is prohibited. / Learning a new language expands cognitive flexibility.',
        noteTr: 'Cümlenin öznesi olarak fiil kullanılıyorsa "V-ing" formu tercih edilir.',
      },
    ],
    signalWords: [
      {
        word: 'look forward to / be used to / commit to',
        meaningTr: 'dört gözle beklemek / alışkın olmak / kendini adamak',
        positionRule: 'Sonrasında isim veya V-ing gerektirir.',
        sampleEn: 'The government committed to reducing carbon emissions.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I am looking forward to meet you.',
        right: 'I am looking forward to meeting you.',
        whyTr: '"Look forward to" kalıbındaki "to" edattır; arkasından gelen fiil "-ing" almak zorundadır.',
      },
      {
        wrong: 'I am good in speak English.',
        right: 'I am good at speaking English.',
        whyTr: '"Good at" edatından sonra fiil Gerund (-ing) olarak gelir.',
      },
      {
        wrong: 'She stopped to smoke two years ago.',
        right: 'She stopped smoking two years ago.',
        whyTr: 'Sigarayı tamamen bırakmak "stop smoking"dir; "stop to smoke" sigara içmek için duraklamak demektir.',
      },
    ],
  },
};
