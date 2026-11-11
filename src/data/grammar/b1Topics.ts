import { DeepGrammarGuide } from './types';

export const B1_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  'b1-1': {
    nodeId: 'b1-1',
    overviewTr:
      'Present Perfect Tense (have/has + V3) ile Simple Past Tense (V2) arasındaki ayrım, İngilizcenin en temel mantık sınavıdır. Türkçede bu iki zamanın doğrudan bir karşılığı olmadığı için "Present Perfect" Türk öğrenciler için en kafa karıştırıcı konudur.\n• Present Perfect: Geçmişte olmuş ama ZAMANI BELİRTİLMEMİŞ (ne zaman olduğu değil, eylemin kendisi veya şimdiki sonucu önemli) veya ŞİMDİYE KADAR DEVAM EDEN olayları anlatır (I have lived here for 10 years).\n• Simple Past: Geçmişte BELİRLİ BİR ANDA (yesterday, in 2020, 2 days ago, when I was a child) gerçekleşmiş ve ŞİMDİYLE BAĞI KOPMUŞ olayları anlatır.\n• Kritik Kural: "When...?" sorusu her zaman Simple Past ile sorulur! (When did you arrive? ❌ When have you arrived?).',
    timelineVisual: 'Simple Past: [ Geçmişte Nokta: ★ Dün bitti ]  |  Present Perfect: [ Geçmişten Şimdiye Köprü: ═══▶ Şimdiye Etki ]',
    conjugationRows: [
      {
        formType: 'Olumlu (+)',
        subject: 'I / You / We / They',
        formula: 'Subject + have + V3',
        exampleEn: 'We have updated all the client security credentials.',
        exampleTr: 'Tüm müşteri güvenlik kimlik bilgilerini güncelledik (etkisi şimdi geçerli).',
      },
      {
        formType: 'Olumlu 3. Tekil (+)',
        subject: 'He / She / It',
        formula: 'Subject + has + V3',
        exampleEn: 'The company has expanded into four European markets.',
        exampleTr: 'Şirket dört Avrupa pazarına genişledi.',
      },
      {
        formType: 'Olumsuz (-)',
        subject: 'Tüm Özneler',
        formula: 'Subject + haven’t / hasn’t + V3',
        exampleEn: 'They haven’t announced the official test results yet.',
        exampleTr: 'Resmi test sonuçlarını henüz açıklamadılar.',
      },
      {
        formType: 'Soru (?)',
        subject: 'Tüm Özneler',
        formula: '(Wh-) + Have / Has + Subject + V3?',
        exampleEn: 'Have you ever conducted clinical research abroad?',
        exampleTr: 'Hiç yurt dışında klinik araştırma yürüttünüz mü (hayatınız boyunca)?',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • SINCE vs FOR',
        title: '1. Zaman Süreçleri: Since (Başlangıç Noktası) vs. For (Toplam Süre)',
        explanationTr:
          '• SINCE: Eylemin geçmişte başladığı kesin NOKTAYI veya olayı gösterir (since 2018, since Monday, since I was born, since 9 o’clock).\n• FOR: Eylemin ne kadar sürdüğünü, TOPLAM SÜREYİ gösterir (for 3 days, for 5 years, for two hours, for a long time).',
        formula: 'Since + Başlangıç Noktası  |  For + Toplam Süre',
        examples: [
          {
            en: 'She has been the chief engineer since 2019, leading the division for over five years.',
            tr: '2019’dan beri (since 2019) başmühendistir ve beş yılı aşkın süredir (for five years) departmanı yönetmektedir.',
            note: '"Since" başlangıç yılını, "for" geçen toplam süreyi gösterir.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • BEEN TO vs GONE TO',
        title: '2. En Meşhur Sınav Tuzağı: Been To vs. Gone To',
        explanationTr:
          '• HAVE BEEN TO: Bir yere gidip geri dönmüş olmayı (ziyaret deneyimini) anlatır. Kişi şu an buradadır!\n• HAVE GONE TO: Bir yere gitmiş ve henüz GERİ DÖNMEMİŞ olmayı (hâlâ orada veya yolda) anlatır.',
        formula: 'Been to = Gitti ve DÖNDÜ  |  Gone to = Gitti, HÂLÂ ORADA',
        examples: [
          {
            en: 'Where is Dr. Martinez? — He has gone to Berlin for a summit; he will return on Friday.',
            tr: 'Dr. Martinez nerede? — Zirve için Berlin’e gitti (has gone: hâlâ Berlin’de); cuma dönecek.',
            note: 'Şu an burada olmadığı için "has gone to" zorunludur.',
          },
          {
            en: 'I have been to Berlin three times; it is a fascinating city.',
            tr: 'Berlin’e üç kez gittim (has been: gidip geri döndüm, deneyimim var).',
            note: 'Konuşmacı şu anda Berlin’de değil, kendi ülkesinde deneyimini anlatıyor.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • JUST, ALREADY, YET',
        title: '3. Anahtar Zarfların Cümle İçindeki Pozisyonları',
        explanationTr:
          '• JUST: Az önce, henüz (have/has ile V3 arasına gelir: "I have just sent the email").\n• ALREADY: Beklenenden önce, çoktan (have/has ile V3 arasına veya cümle sonuna gelir: "We have already finished").\n• YET: Henüz (SADECE olumsuz ve soru cümlelerinde, cümlenin EN SONUNA gelir: "Have you eaten yet? / I haven’t finished yet").',
        formula: 'have + just / already + V3  |  haven’t + V3 + yet',
        examples: [
          {
            en: 'We have already deployed the update, but the database hasn’t synced yet.',
            tr: 'Güncellemeyi çoktan dağıttık (already), ancak veritabanı henüz senkronize olmadı (yet).',
            note: 'Olumluda "already", olumsuzda cümle sonunda "yet" kullanımı.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: '"This morning / This week" Zaman Dilimi Henüz Bitmediyse Present Perfect, Bittiyse Simple Past',
        examples: 'Saat 10:00: I have drunk two coffees this morning.  |  Saat 15:00: I drank two coffees this morning.',
        noteTr: 'Eğer içinde bulunulan zaman dilimi devam ediyorsa Present Perfect, dilim bittiyse Past Simple kullanılır.',
      },
    ],
    signalWords: [
      {
        word: 'ever / never',
        meaningTr: 'hiç (sorularda) / asla, hiç (olumluda olumsuz anlam)',
        positionRule: 'Have/has ile V3 arasında yer alır.',
        sampleEn: 'Have you ever operated this machinery? — No, I have never seen it before.',
      },
      {
        word: 'so far / up to now / recently / lately',
        meaningTr: 'şu ana kadar / son zamanlarda',
        positionRule: 'Present Perfect ile cümle sonlarında veya başlarında sıkça kullanılır.',
        sampleEn: 'So far, we have collected over ten thousand survey responses.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I have seen him yesterday.',
        right: 'I saw him yesterday.',
        whyTr: '"Yesterday, last week, two days ago, in 1999" gibi kesin bitmiş zaman bildiren zarflarla Present Perfect ASLA KULLANILMAZ!',
      },
      {
        wrong: 'When have you arrived?',
        right: 'When did you arrive?',
        whyTr: '"When" sorusu belirli bir geçmiş zaman anını sorduğu için daima Simple Past ile kullanılır.',
      },
      {
        wrong: 'I am living in this city since 2015.',
        right: 'I have lived (veya have been living) in this city since 2015.',
        whyTr: '"Since" ile geçmişten bugüne gelen süreçler anlatılırken Present Continuous değil, Present Perfect kullanılır.',
      },
    ],
  },

  'b1-2': {
    nodeId: 'b1-2',
    overviewTr:
      'Present Perfect Continuous Tense (have/has been + V-ing), geçmişte başlayıp şu ana kadar KESİNTİSİZ SÜREN eylemleri veya az önce bitmiş olsa bile ŞU ANDA GÖZLE GÖRÜLÜR FİZİKSEL BİR KANITI olan durumları anlatır. En önemli ayrım:\n• Present Perfect Simple (have done): Eylemin BİTMİŞ OLMASINA ve SONUCUNA odaklanır (I have painted the ceiling - Tavan boyandı, bitti, tavan beyaz).\n• Present Perfect Continuous (have been doing): Eylemin SÜRECİNE, NE KADAR SÜRDÜĞÜNE veya YARATTIĞI YORGUNLUĞA odaklanır (I have been painting the ceiling - Üstüm başım boya içinde, saatlerdir boyuyorum).\n• Kritik Kısıtlama: Durum fiilleri (know, believe, like, understand) "-ing" alamadığı için Present Perfect Continuous yerine Present Perfect Simple ile kullanılır (I have known him for 10 years; ❌ have been knowing denemez!).',
    timelineVisual: 'Geçmişte Başladı ──▶ [ Kesintisiz Süreç: ══════════════▶ Şimdi de Devam Ediyor / Kanıtı Var ]',
    conjugationRows: [
      {
        formType: 'Olumlu (+)',
        subject: 'I / You / We / They',
        formula: 'Subject + have been + V-ing',
        exampleEn: 'We have been collaborating on this research since January.',
        exampleTr: 'Ocak ayından beri bu araştırma üzerinde birlikte çalışıyoruz.',
      },
      {
        formType: 'Olumlu 3. Tekil (+)',
        subject: 'He / She / It',
        formula: 'Subject + has been + V-ing',
        exampleEn: 'She has been coding for six hours straight.',
        exampleTr: 'Aralıksız altı saattir kod yazıyor.',
      },
      {
        formType: 'Olumsuz (-)',
        subject: 'Tüm Özneler',
        formula: 'Subject + haven’t / hasn’t been + V-ing',
        exampleEn: 'He hasn’t been sleeping well lately due to work stress.',
        exampleTr: 'İş stresi yüzünden son zamanlarda iyi uyuyamıyor.',
      },
      {
        formType: 'Soru (?)',
        subject: 'How long + have/has...?',
        formula: 'How long + have/has + Subject + been + V-ing?',
        exampleEn: 'How long have you been studying biomedical engineering?',
        exampleTr: 'Ne kadar süredir biyomedikal mühendisliği okuyorsunuz?',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • SONUÇ vs SÜREÇ',
        title: '1. Present Perfect Simple vs. Present Perfect Continuous',
        explanationTr:
          '• Simple: "Kaç tane?" (How many?), "Kaç kez?" (How many times?) sorularının yanıtıdır. Eylem tamamlanmıştır.\n• Continuous: "Ne kadar süredir?" (How long?) sorusunun yanıtıdır. Eylem bitmemiş olabilir veya yeni bitmiştir.',
        formula: 'Simple: Sonuç (How much / How many)  |  Continuous: Süreç (How long)',
        examples: [
          {
            en: 'She has written three scientific papers this year. (Simple: Sayı/Sonuç: 3 makale bitti)',
            tr: 'Bu yıl üç bilimsel makale yazdı.',
            note: 'Tamamlanan çıktı sayısı vurgulandığı için Simple kullanılır.',
          },
          {
            en: 'She has been writing scientific papers all morning. (Continuous: Süreç: Bütün sabahtır yazıyor)',
            tr: 'Bütün sabahtır bilimsel makale yazıyor.',
            note: 'Süreç ve harcanan mesai vurgulandığı için Continuous kullanılır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • GÖZLE GÖRÜLÜR KANIT',
        title: '2. Az Önce Biten Eylemin Şimdiki Fiziksel Belirtisi',
        explanationTr:
          'Eylem tam konuşma anında bitmiş olsa bile, şu an konuşmacının üzerinde fiziksel bir belirti/kanıt (terlemiş, elleri kirli, nefes nefese, gözleri kızarmış) varsa Present Perfect Continuous kullanılır.',
        formula: 'Şimdiki Belirti (Why are your hands dirty?) ──▶ have been V-ing (I have been fixing the car)',
        examples: [
          {
            en: 'You look exhausted! What have you been doing? — I have been running in the park.',
            tr: 'Bitkin görünüyorsun! Ne yapıyordun? — Parkta koşuyordum.',
            note: 'Koşu az önce bitti ama yorgunluk ve terleme kanıtı şu an mevcut.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Durum Fiilleri Kesinlikle Continuous Olamaz',
        examples: '❌ I have been knowing him for years  ──▶  ✅ I have known him for years',
        noteTr: 'Know, have (sahiplik), believe, belong gibi stative fiiller asla -ing almaz.',
      },
    ],
    signalWords: [
      {
        word: 'all morning / all day / all week',
        meaningTr: 'bütün sabah / bütün gün / bütün hafta boyunca',
        positionRule: 'Eylemin kesintisizliğini vurgular.',
        sampleEn: 'It has been raining all afternoon.',
      },
      {
        word: 'How long have you been...?',
        meaningTr: 'Ne kadar süredir ... yapmaktasınız?',
        positionRule: 'Süreci sorgulayan standart kalıptır.',
        sampleEn: 'How long have you been waiting for the bus?',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I am waiting for you since two hours.',
        right: 'I have been waiting for you for two hours.',
        whyTr: 'Geçmişte başlayıp süren eylemlerde Present Continuous değil Present Perfect Continuous kullanılır; süre için de "since" değil "for" kullanılır.',
      },
      {
        wrong: 'I have been understanding the topic now.',
        right: 'I understand the topic now. (veya I have understood)',
        whyTr: '"Understand" durum fiilidir, Continuous yapı içinde kullanılamaz.',
      },
    ],
  },

  'b1-3': {
    nodeId: 'b1-3',
    overviewTr:
      'Gramer Çıkarım Kipleri (Modals of Deduction: Must, Can’t, Might, May, Could), mevcut ipuçlarına ve kanıtlara bakarak bir durum hakkında ne kadar emin olduğumuzu ifade eder:\n• MUST (%95 Pozitif Eminlik): Mantıksal olarak kesinlikle öyle olmalı (He drives a Ferrari; he must be rich).\n• CAN’T (%95 Negatif İmkansızlık): Mantıksal olarak kesinlikle öyle olamaz (She left ten minutes ago; she can’t be in London yet).\n• MIGHT / MAY / COULD (%50 Olasılık): Belki öyle, belki değil, tam emin değilim (Take an umbrella; it might rain).\n• TÜRKÇE TUZAĞI: "Kesinlikle öyle değil/olamaz" derken ASLA "must not" denmez! İmkansızlık çıkarımında zorunlu olarak "CAN’T" kullanılır ("must not" yasak bildirir!).',
    timelineVisual: 'İmkansız [%0: CAN’T] ──▶ Olası [%50: MIGHT / MAY / COULD] ──▶ Kesinlikle Öyle [%95: MUST]',
    conjugationRows: [
      {
        formType: 'Güçlü Çıkarım (Must)',
        subject: 'Tüm Özneler',
        formula: 'Subject + must + V1 / be + Adj',
        exampleEn: 'The lights are on and music is playing; they must be at home.',
        exampleTr: 'Işıklar açık ve müzik çalıyor; evde olmalılar (kesin çıkarım).',
      },
      {
        formType: 'İmkansızlık Çıkarımı (Can’t)',
        subject: 'Tüm Özneler',
        formula: 'Subject + can’t + V1 / be + Adj',
        exampleEn: 'That can’t be true; the data contradicts the entire theory.',
        exampleTr: 'Bu doğru olamaz; veriler tüm teoriyle çelişiyor (imkansız çıkarım).',
      },
      {
        formType: 'Olasılık Çıkarımı (Might / May / Could)',
        subject: 'Tüm Özneler',
        formula: 'Subject + might / may / could + V1',
        exampleEn: 'He isn’t answering his phone; he might be in a meeting.',
        exampleTr: 'Telefonunu açmıyor; toplantıda olabilir (%50 olasılık).',
      },
      {
        formType: 'Devam Eden Eylem Çıkarımı',
        subject: 'Modal + be + V-ing',
        formula: 'Subject + must / can’t / might + be + V-ing',
        exampleEn: 'Listen to that noise! They must be renovating the apartment upstairs.',
        exampleTr: 'Şu sese bak! Üst kattaki daireyi tadilattan geçiriyor olmalılar.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • MUST vs CAN’T',
        title: '1. Çıkarımlarda Zıt Kutuplar: Must vs. Can’t',
        explanationTr:
          'Mantıksal çıkarım yaparken "Must"ın zıddı "Must not" DEĞİLDİR! Zıddı "CAN’T"tir.\n• "He must be American" (Kesinlikle Amerikalı olmalı - aksanı öyle).\n• "He can’t be American" (Kesinlikle Amerikalı olamaz - tek kelime İngilizce bilmiyor).\n• "Must not" derseniz bu çıkarım değil, yasak ("Yapmamalısın") anlamına gelir!',
        formula: 'Pozitif Eminlik = Must  |  Negatif İmkansızlık = Can’t',
        examples: [
          {
            en: 'She has two PhDs and speaks six languages; she must be exceptionally intelligent.',
            tr: 'İki doktorası var ve altı dil konuşuyor; olağanüstü zeki olmalı (must be).',
            note: 'Somut kanıtlara dayanan güçlü mantıksal çıkarım.',
          },
          {
            en: 'He only started working here yesterday; he can’t know the executive passwords.',
            tr: 'Burada çalışmaya henüz dün başladı; yönetici şifrelerini biliyor olamaz (can’t know).',
            note: 'Mevcut duruma göre mantıksal imkansızlık.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • OLASILIK: MIGHT vs MAY vs COULD',
        title: '2. Belki, İhtimal: Might, May, Could',
        explanationTr:
          'Kanıtlar kesin bir hüküm vermeye yetmiyorsa üçü de birbirinin yerine kullanılabilir:\n• "Where is Sarah? — She might / may / could be at the library." (Kütüphanede olabilir, emin değilim).\n• DİKKAT: Olumsuz olasılıkta "could not" (yapamazdı) çıkarım anlamında kullanılmaz; olumsuz olasılık için "might not" veya "may not" kullanılır (She might not come tonight - Gelemeyebilir).',
        formula: 'Belki öyle: might / may / could  |  Belki değil: might not / may not',
        examples: [
          {
            en: 'Don’t delete that file yet; we might need it for the audit next month.',
            tr: 'O dosyayı henüz silmeyin; gelecek ayki denetim için ona ihtiyaç duyabiliriz.',
            note: 'Gelecekteki olası bir duruma işaret ediyor.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Soru Cümlelerinde Can / Could Kullanılır',
        examples: 'Can this really be true? / Could she be telling the truth?',
        noteTr: 'Çıkarım sorularında "Must he be...?" pek kullanılmaz, "Can he be...?" tercih edilir.',
      },
    ],
    signalWords: [
      {
        word: 'I am certain / I am sure that',
        meaningTr: 'Eminim ki',
        positionRule: 'Eş anlamlı olarak "must" veya "can’t" gerektirir.',
        sampleEn: 'I am sure he is telling the truth = He must be telling the truth.',
      },
      {
        word: 'Perhaps / Maybe / It is possible that',
        meaningTr: 'Belki / Mümkündür ki',
        positionRule: 'Eş anlamlı olarak "might / may / could" gerektirir.',
        sampleEn: 'Perhaps it will rain = It might rain.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He didn’t eat all day; he must not be hungry.',
        right: 'He didn’t eat all day; he can’t be full. / He must be hungry.',
        whyTr: 'Çıkarımda olumsuz imkansızlık "can’t" ile ifade edilir, "must not" yasak bildirir.',
      },
      {
        wrong: 'She musts be at home.',
        right: 'She must be at home.',
        whyTr: 'Modallar asla "-s" takısı almaz.',
      },
    ],
  },

  'b1-4': {
    nodeId: 'b1-4',
    overviewTr:
      'Şart Cümleleri (Conditionals: Type 0, Type 1, Type 2) ve Şart Bağlaçları (Unless, In case, As long as), bir eylemin gerçekleşmesinin başka bir koşula bağlı olduğunu ifade eder:\n• Type 0 (Bilimsel & Evrensel Gerçekler): If + Present, Present (If you heat ice, it melts).\n• Type 1 (Olası Gelecek & Gerçekçi Şartlar): If + Present, Will + V1 (If it rains tomorrow, we will cancel the picnic).\n• Type 2 (Hayali / Gerçek Dışı Şimdiki Zaman & Tavsiye): If + Past Simple, Would + V1 (If I were you, I would accept the job offer).\n• UNLESS: "If not" (-medikçe / -mazsa) demektir; Unless bulunan yan cümleye ikinci bir olumsuzluk eki ("don’t/doesn’t") ASLA konulmaz!',
    timelineVisual: 'Type 0: [ Evrensel Yasa ]  |  Type 1: [ Olası Gelecek: If + V1 ──▶ Will ]  |  Type 2: [ Hayali / Gerçek Dışı: If + V2 ──▶ Would ]',
    conjugationRows: [
      {
        formType: 'Type 0 (Doğa Kanunu)',
        subject: 'Tüm Özneler',
        formula: 'If + Present Simple, Present Simple',
        exampleEn: 'If water reaches 100 degrees Celsius, it boils.',
        exampleTr: 'Su 100 santigrat dereceye ulaşırsa kaynar (her zaman doğru).',
      },
      {
        formType: 'Type 1 (Gerçekçi Gelecek)',
        subject: 'Tüm Özneler',
        formula: 'If + Present Simple, will / can / may + V1',
        exampleEn: 'If the server overheats, the backup system will activate automatically.',
        exampleTr: 'Eğer sunucu aşırı ısınırsa yedek sistem otomatik olarak devreye girecek.',
      },
      {
        formType: 'Type 2 (Hayali / Tavsiye)',
        subject: 'Tüm Özneler (was yerine were!)',
        formula: 'If + Past Simple, would / could + V1',
        exampleEn: 'If I had more free time, I would learn Japanese.',
        exampleTr: 'Daha fazla boş vaktim olsaydı (şu an yok), Japonca öğrenirdim.',
      },
      {
        formType: 'Şartlı Yasak (Unless)',
        subject: 'Unless = If not',
        formula: 'Unless + Olumlu Cümle, will / won’t + V1',
        exampleEn: 'Unless you submit the documents today, your visa will be rejected.',
        exampleTr: 'Belgeleri bugün teslim etmedikçe vizeniz reddedilecek.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • IF CÜMLESİNDE WILL OLMAZ!',
        title: '1. Altın Kural: "If"li Yan Cümlenin İçine ASLA "Will" Gelmez!',
        explanationTr:
          'Türkçede "Eğer yarın yağmur yağacaksa" gibi düşünülse de İngilizcede zaman ve şart bağlaçlarının (if, when, unless, as soon as, before, after) hemen arkasındaki yan cümleye "WILL" veya "WOULD" KESİNLİKLE GELEMEZ! Gelecek zaman anlamı Present Simple ile verilir.',
        formula: '❌ If it will rain...  ──▶  ✅ If it rains...',
        examples: [
          {
            en: 'If you arrive early tomorrow, we will review the contract together.',
            tr: 'Yarın erken gelirseniz (If you arrive: will yok!), sözleşmeyi birlikte inceleyeceğiz.',
            note: 'Yan cümlede "arrive", ana cümlede "will review" kullanıldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • IF I WERE YOU',
        title: '2. Type 2’de "Was" Yerine "WERE" Kuralı (Subjunctive)',
        explanationTr:
          'Type 2 gerçek dışı hayali durumları anlatır. Resmi ve standart İngilizcede "I, he, she, it" özneleriyle "was" yerine "WERE" kullanılır. Özellikle tavsiye verirken "If I were you" (Senin yerinde olsaydım) kalıbı değişmez bir standarttır.',
        formula: 'If I / he / she / it were..., would + V1',
        examples: [
          {
            en: 'If I were you, I would negotiate for a higher starting salary.',
            tr: 'Senin yerinde olsaydım daha yüksek bir başlangıç maaşı için müzakere ederdim.',
            note: 'Tavsiye kalıbında "If I were you" kullanımı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • IN CASE vs IF',
        title: '3. "In Case" (Her İhtimale Karşı) vs. "If" (Eğer)',
        explanationTr:
          '• If: Olay olursa yaparım (şarta bağlı): "I will buy an umbrella if it rains" (Yağmur yağarsa şemsiye alırım).\n• In case: Olay olsun ya da olmasın, tedbir olarak ŞİMDİDEN yaparım: "I will take an umbrella in case it rains" (Yağmur yağar ihtimaline karşı yanıma şemsiye alıyorum).',
        formula: 'If = Şart gerçekleşirse  |  In case = Önlem / Tedbir olarak',
        examples: [
          {
            en: 'Keep this backup hard drive in case the cloud server goes down.',
            tr: 'Bulut sunucusu çöker ihtimaline karşı bu yedek sabit diski saklayın (önlem).',
            note: 'Çökme ihtimaline karşı önceden alınan tedbir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Unless Cümlesinde Çift Olumsuzluk Yapılamaz',
        examples: '❌ Unless you don’t hurry  ──▶  ✅ Unless you hurry (Acele etmedikçe)',
        noteTr: '"Unless" zaten içinde "not" barındırır, fiil olumlu kalmalıdır.',
      },
    ],
    signalWords: [
      {
        word: 'provided that / as long as / on condition that',
        meaningTr: '-dığı sürece / şartıyla',
        positionRule: '"If" yerine geçen resmi şart bağlaçlarıdır.',
        sampleEn: 'You can borrow the equipment as long as you return it tomorrow.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'If I will see him, I will tell him.',
        right: 'If I see him, I will tell him.',
        whyTr: '"If"li yan cümlenin içine asla "will" girmez.',
      },
      {
        wrong: 'If I was you, I would go.',
        right: 'If I were you, I would go.',
        whyTr: 'Şart ve tavsiye cümlelerinde "I was" yerine "I were" kullanılır.',
      },
      {
        wrong: 'Unless you don’t study, you will fail.',
        right: 'Unless you study, you will fail.',
        whyTr: '"Unless" zaten olumsuzdur; yanına "don’t" konulamaz.',
      },
    ],
  },

  'b1-5': {
    nodeId: 'b1-5',
    overviewTr:
      'Past Perfect Tense (had + V3) ve Past Perfect Continuous (had been + V-ing), "GEÇMİŞİN DE GEÇMİŞİDİR". Geçmişte iki olay yaşandığında, ZAMAN ÇİZGİSİNDE DAHA ÖNCE OLAN İLK OLAYI belirtmek için Past Perfect kullanılır. Eğer iki olay "and" veya kronolojik sırayla anlatılıyorsa ikisi de Simple Past kalabilir; ancak "by the time", "already", "before" gibi bağlaçlarla kronolojik öncelik vurgulanıyorsa Past Perfect ZORUNLUDUR.',
    timelineVisual: 'En Eski Olay: [ 1. HAD + V3 ] ──▶ Daha Sonraki Geçmiş: [ 2. V2 (Simple Past) ] ──▶ [ ŞİMDİ ]',
    conjugationRows: [
      {
        formType: 'Olumlu (+)',
        subject: 'Tüm Özneler',
        formula: 'Subject + had + V3',
        exampleEn: 'By the time the fire brigade arrived, the neighbors had put out the fire.',
        exampleTr: 'İtfaiye vardığında komşular yangını çoktan söndürmüştü.',
      },
      {
        formType: 'Olumsuz (-)',
        subject: 'Tüm Özneler',
        formula: 'Subject + hadn’t + V3',
        exampleEn: 'I hadn’t realized how serious the security vulnerability was until the audit.',
        exampleTr: 'Denetime kadar güvenlik açığının ne kadar ciddi olduğunu fark etmemiştim.',
      },
      {
        formType: 'Soru (?)',
        subject: 'Tüm Özneler',
        formula: '(Wh-) + Had + Subject + V3?',
        exampleEn: 'Had you ever visited the headquarters before your promotion?',
        exampleTr: 'Terfinizden önce genel merkezi hiç ziyaret etmiş miydiniz?',
      },
      {
        formType: 'Geçmişte Süreç (Continuous)',
        subject: 'Subject + had been + V-ing',
        formula: 'had been + V-ing + for / since + Past Time',
        exampleEn: 'They had been negotiating for three weeks before reaching an agreement.',
        exampleTr: 'Bir anlaşmaya varmadan önce üç haftadır müzakere ediyorlardı.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • BY THE TIME KURALI',
        title: '1. Sınavların Favori Şablonu: "By the time + Past Simple, Past Perfect"',
        explanationTr:
          '"By the time" (-dığı zamana kadar) bağlacından sonraki yan cümle Simple Past (V2) olurken, ana cümle ondan önce tamamlandığı için Past Perfect (had + V3) olur!',
        formula: 'By the time + Subject + V2, Subject + had + V3',
        examples: [
          {
            en: 'By the time the flight took off, the mechanics had repaired the faulty sensor.',
            tr: 'Uçak havalandığı zamana kadar (took off), teknisyenler arızalı sensörü tamir etmişti (had repaired).',
            note: 'Tamir eylemi havalanmaktan daha önce tamamlandı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • PAST PERFECT CONTINUOUS',
        title: '2. Geçmişteki Bir Noktaya Kadar Kesintisiz Süren Eylemler',
        explanationTr:
          'Geçmişteki bir andan önce başlamış ve o ana kadar kesintisiz devam etmiş eylemleri süresiyle (for 2 hours) vurgulamak için "had been + V-ing" kullanılır.',
        formula: 'had been + V-ing + before + V2',
        examples: [
          {
            en: 'The pilot had been flying through dense fog for forty minutes before spotting the runway.',
            tr: 'Pilot pisti görmeden önce kırk dakikadır yoğun sisin içinde uçmaktaydı.',
            note: 'Pisti görme anına kadar süren 40 dakikalık kesintisiz uçuş süreci.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Kronolojik Sıralamada Past Perfect Gerekmez',
        examples: 'I woke up, brushed my teeth, and left the house.',
        noteTr: 'Eylemler art arda kronolojik anlatılıyorsa hepsi Simple Past kalır.',
      },
    ],
    signalWords: [
      {
        word: 'before / after / already / by the time',
        meaningTr: 'önce / sonra / çoktan / -e kadar',
        positionRule: 'İki geçmiş olay arasındaki öncelik-sonralık ilişkisini kurar.',
        sampleEn: 'After the team had tested the prototype, they presented it to the board.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'When I arrived at the cinema, the film already started.',
        right: 'When I arrived at the cinema, the film had already started.',
        whyTr: 'Sinemaya varıştan önce film başladığı için "had already started" zorunludur.',
      },
      {
        wrong: 'By the time she had finished, we left.',
        right: 'By the time she finished, we had left.',
        whyTr: '"By the time" yanına Past Simple alır, diğer cümle Past Perfect olur.',
      },
    ],
  },

  'b1-6': {
    nodeId: 'b1-6',
    overviewTr:
      'Edilgen Çatı (Passive Voice: be + V3), eylemi yapan kişinin (öznenin) değil; eylemden ETKİLENEN NESNENİN veya EYLEMİN KENDİSİNİN önemli olduğu durumlarda kullanılır. Bilimsel makalelerde, haber bültenlerinde, suç raporlarında ve resmi metinlerde standart anlatım biçimidir.\n• Altın Formül: Etken cümlenin NESNESİ başa geçer + Zamanın "BE" yardımcı fiili çekimlenir + Asıl fiilin 3. hali (V3) eklenir.\n• Eylemi yapan kişiyi belirtmek gerekirse cümlenin sonuna "BY + fail" (by scientists, by the government) getirilir.',
    timelineVisual: 'Etken: [ ÖZNE ──▶ Eylem ──▶ NESNE ]  |  Edilgen: [ NESNE ──▶ BE + V3 ──▶ (by Özne) ]',
    conjugationRows: [
      {
        formType: 'Simple Present Passive',
        subject: 'am / is / are + V3',
        formula: 'Object + am/is/are + V3',
        exampleEn: 'Millions of credit card transactions are processed every second.',
        exampleTr: 'Her saniye milyonlarca kredi kartı işlemi gerçekleştirilir.',
      },
      {
        formType: 'Simple Past Passive',
        subject: 'was / were + V3',
        formula: 'Object + was/were + V3',
        exampleEn: 'The penicillin antibiotic was discovered in 1928.',
        exampleTr: 'Penisilin antibiyotiği 1928 yılında keşfedildi.',
      },
      {
        formType: 'Present Perfect Passive',
        subject: 'have / has been + V3',
        formula: 'Object + have/has been + V3',
        exampleEn: 'The new cybersecurity patch has been installed on all servers.',
        exampleTr: 'Yeni siber güvenlik yaması tüm sunuculara yüklendi.',
      },
      {
        formType: 'Modal Passive',
        subject: 'Modal + be + V3',
        formula: 'Object + modal + be + V3',
        exampleEn: 'All safety goggles must be worn inside the laboratory.',
        exampleTr: 'Laboratuvar içinde tüm koruyucu gözlükler takılmalıdır.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • DÖNÜŞÜM MATEMATİĞİ',
        title: '1. Etkenden Edilgene Geçişin 3 Adımı',
        explanationTr:
          '1) Cümlenin nesnesini bul ve başa özne yap: "Alexander Fleming discovered penicillin" → Penicillin...\n2) Zamanı belirle ve "be" fiilini o zamanda çekimle: Past Simple → was/were → "was"\n3) Ana fiili V3 yap: discover → "discovered"\nSonuç: "Penicillin was discovered by Alexander Fleming."',
        formula: 'Active: S + V + O  ──▶  Passive: O + BE + V3 (+ by S)',
        examples: [
          {
            en: 'The committee approved the budget. ──▶ The budget was approved by the committee.',
            tr: 'Komite bütçeyi onayladı. ──▶ Bütçe komite tarafından onaylandı.',
            note: 'Past Simple etken cümle, was + V3 ile edilgene dönüştü.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • BY KULLANIMI',
        title: '2. "By" Ne Zaman Kullanılır, Ne Zaman Atılır?',
        explanationTr:
          'Eğer eylemi yapan kişi genel, önemsiz veya bilinmiyorsa (people, someone, they) "by" tamamen atılır:\n• "Someone stole my bike" ──▶ "My bike was stolen." (by someone denmez!).\n• Eylemi yapan kişi spesifik ve önemli bir isimse "by" ile korunur: "The novel was written by George Orwell."',
        formula: 'Bilinmeyen/Genel Fail → BY atılır  |  Önemli/Belirli Fail → by + İsim',
        examples: [
          {
            en: 'The highway was closed due to heavy snow. (by the police demeye gerek yok)',
            tr: 'Otoyol yoğun kar yağışı nedeniyle kapatıldı.',
            note: 'Yetkililerin kapattığı bariz olduğu için fail belirtilmemiştir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Geçişsiz Fiiller (Intransitive Verbs) Edilgen YAPILAMAZ',
        examples: '❌ An accident was happened  ──▶  ✅ An accident happened',
        noteTr: 'Happen, occur, die, arrive, fall gibi nesne almayan fiiller asla Passive yapılamaz!',
      },
    ],
    signalWords: [
      {
        word: 'by + fail / with + alet',
        meaningTr: 'tarafından / ile (araç)',
        positionRule: 'Edilgen cümlede fail "by", kullanılan alet/madde "with" alır.',
        sampleEn: 'The lock was cut with an electric saw by the burglar.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'The accident was occurred last night.',
        right: 'The accident occurred last night.',
        whyTr: '"Occur / happen" geçişsiz fiillerdir; edilgen yapılamazlar.',
      },
      {
        wrong: 'This book written by Shakespeare.',
        right: 'This book was written by Shakespeare.',
        whyTr: 'Passive cümlede "be" (was/is) yardımcı fiili unutulmamalıdır.',
      },
    ],
  },
};
