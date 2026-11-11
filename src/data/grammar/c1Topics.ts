import { DeepGrammarGuide } from './types';

export const C1_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  'c1-1': {
    nodeId: 'c1-1',
    overviewTr:
      'Olumsuz Devriklik ve Öne Alma (Negative Inversion & Fronting), C1 ve C2 düzeyinde akademik metinlerin, edebi anlatımların ve retorik hitabetin en prestijli yapısıdır. Bir cümlenin başına olumsuz veya kısıtlayıcı bir zarf (Never, Seldom, Rarely, Little, Scarcely, Hardly, Barely, No sooner, Not only, Under no circumstances, On no account, At no time) getirildiğinde, cümle SORU DİZİLİMİNE (Inversion) bürünür: Yardımcı fiil özneden ÖNCE gelir!\n• Düz Cümle: "I have never seen such courage."\n• Devrik Cümle: "NEVER HAVE I SEEN such courage." (Asla görmedim! - Güçlü vurgu).\n• Zaman Bağlaçları: "Hardly had S + V3... WHEN..." ve "No sooner had S + V3... THAN...".',
    timelineVisual: '[ Olumsuz / Kısıtlayıcı Zarf ] ──▶ [ YARDIMCI FİİL ] ──▶ [ ÖZNE ] ──▶ [ ANA FİİL ]',
    conjugationRows: [
      {
        formType: 'Zaman Devrikliği (Never / Seldom)',
        subject: 'Never / Seldom + Aux + S + V',
        formula: 'Never / Seldom + have/has/had/did + S + V',
        exampleEn: 'Seldom have international scientists witnessed such rapid consensus.',
        exampleTr: 'Uluslararası bilim insanları nadiren bu denli hızlı bir uzlaşıya tanık olmuşlardır.',
      },
      {
        formType: 'Ardışık Geçmiş (Hardly... when)',
        subject: 'Hardly / Scarcely + had + S + V3 + when',
        formula: 'Hardly had S + V3... when + S + V2',
        exampleEn: 'Hardly had the new protocol been initiated when unexpected anomalies emerged.',
        exampleTr: 'Yeni protokol henüz uygulamaya konmuştu ki beklenmedik anormallikler ortaya çıktı.',
      },
      {
        formType: 'Ardışık Geçmiş (No sooner... than)',
        subject: 'No sooner + had + S + V3 + than',
        formula: 'No sooner had S + V3... than + S + V2',
        exampleEn: 'No sooner had the CEO finished her speech than the share prices surged by ten percent.',
        exampleTr: 'CEO konuşmasını bitirir bitirmez hisse fiyatları yüzde on fırladı.',
      },
      {
        formType: 'Vurgulu Ekleme (Not only... but also)',
        subject: 'Not only + Aux + S + V..., but also...',
        formula: 'Not only did they meet the deadline, but they also exceeded revenue targets.',
        exampleEn: 'Not only did they meet the deadline, but they also reduced production costs.',
        exampleTr: 'Sadece son teslim tarihine uymakla kalmadılar, üretim maliyetlerini de düşürdüler.',
      },
      {
        formType: 'Kati Yasak (Under no circumstances)',
        subject: 'Under no circumstances + Aux + S + V',
        formula: 'Under no circumstances should / must + S + V1',
        exampleEn: 'Under no circumstances should confidential patient records be transferred via unencrypted email.',
        exampleTr: 'Gizli hasta kayıtları hiçbir koşulda şifrelenmemiş e-posta yoluyla aktarılmamalıdır.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • NO SOONER THAN vs HARDLY WHEN',
        title: '1. Sınavların En Büyük Eşleştirme Tuzağı: Than vs. When',
        explanationTr:
          '• "No sooner" kelimesinde "-er" (comparative) olduğu için ikinci cümleciğin bağlacı MUTLAKA "THAN" olur!\n• "Hardly / Scarcely / Barely" kelimelerinin bağlacı ise MUTLAKA "WHEN" olur!\n• Her iki yapıda da ilk cümle daima Past Perfect Devrik (had + subject + V3) başlar.',
        formula: 'No sooner had S V3... THAN  |  Hardly had S V3... WHEN',
        examples: [
          {
            en: 'No sooner had the aircraft touched down than emergency response teams surrounded the runway.',
            tr: 'Uçak teker koyar koymaz (no sooner... than) acil müdahale ekipleri pisti çevreledi.',
            note: '"No sooner" mutlaka "than" ile eşleşir.',
          },
          {
            en: 'Hardly had the vaccine been approved when global distribution commenced.',
            tr: 'Aşı henüz onaylanmıştı ki (hardly... when) küresel dağıtım başladı.',
            note: '"Hardly" mutlaka "when" ile eşleşir.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • ONLY SONRASINDA DEVRİKLİK',
        title: '2. "Only after / Only when" Cümlelerinde Devriklik Hangi Tarafta Olur?',
        explanationTr:
          '"Only after", "Only when", "Only if" gibi bağlaçlarla başlayan cümlelerde DEVRİKLİK BAĞLACIN İÇİNDE DEĞİL, VİRGÜLDEN SONRAKİ ANA CÜMLEDE YAPILIR!\n• ❌ Only after did he arrive, he spoke.\n• ✅ Only after he arrived DID HE SPEAK (Düz yan cümle, DEVRİK ana cümle!).',
        formula: 'Only after / when + Düz Yan Cümle, + DEVRİK ANA CÜMLE (Aux + S + V)',
        examples: [
          {
            en: 'Only after the independent audit was completed did the board understand the magnitude of the deficit.',
            tr: 'Ancak bağımsız denetim tamamlandıktan sonradır ki (düz), yönetim kurulu açığın büyüklüğünü anladı (did the board understand: devrik!).',
            note: 'Devriklik virgülden sonraki ana cümlede uygulanır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Little Zarfı Bilgisizlik ve Habersizlik Vurgular',
        examples: 'Little did they realize that their breakthrough would revolutionize neuroscience.',
        noteTr: '"Little did he know/realize" kalıbı "Asla tahmin etmiyordu / Hiç haberi yoktu" anlamına gelir.',
      },
    ],
    signalWords: [
      {
        word: 'On no account / At no time / In no way',
        meaningTr: 'hiçbir surette / hiçbir zaman / hiçbir şekilde',
        positionRule: 'Cümle başında yer alarak derhal soru devrikliği başlatır.',
        sampleEn: 'At no time did the suspect disclose the location of the encrypted drive.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Never I have seen such a performance.',
        right: 'Never have I seen such a performance.',
        whyTr: '"Never" cümle başına alındığında devriklik zorunludur: yardımcı fiil ("have") özneden önce gelir.',
      },
      {
        wrong: 'No sooner had we arrived when it started raining.',
        right: 'No sooner had we arrived than it started raining.',
        whyTr: '"No sooner" yapısı "when" ile değil, daima "than" ile eşleşir.',
      },
    ],
  },

  'c1-2': {
    nodeId: 'c1-2',
    overviewTr:
      'Vurgu Cümleleri (Cleft Sentences: It was... that & Wh- Clefts) ve İsteme Kipi (The Subjunctive Mood), ileri düzey editoryal ve akademik İngilizcenin omurgasıdır.\n• Cleft Sentences (Yarılan Vurgu Cümleleri): Bir cümlenin belirli bir öğesini (özne, zaman, nesne, neden) sahne ışıkları altına almak için cümleyi ikiye bölmektir:\n  - Normal: "Dr. Smith solved the crisis yesterday."\n  - Özne Vurgusu: "IT WAS Dr. Smith THAT solved the crisis yesterday." (Krizi çözen bizzat Dr. Smith’ti!).\n  - Zaman Vurgusu: "IT WAS yesterday THAT Dr. Smith solved the crisis."\n  - Wh- Cleft: "WHAT we really need IS more computational power."\n• The Subjunctive Mood: Talep, ısrar, öneri veya hayati gereklilik bildiren fiil ve sıfatlardan (demand, insist, recommend, suggest, vital, essential, crucial that) sonra gelen cümlede özne ne olursa olsun fiil ZORUNLU OLARAK YALIN (Bare Infinitive: V1) kalır! (I insist that he BE present; he is veya he was denemez!).',
    timelineVisual: 'Normal Cümle ──▶ VURGU ODASINA ALMA: [ IT WAS + Vurgulanan Öğe + THAT / WHO ]',
    conjugationRows: [
      {
        formType: 'It-Cleft (Özne Vurgusu)',
        subject: 'It + is/was + İsim + that/who',
        formula: 'It was + Özne + that/who + Rest of sentence',
        exampleEn: 'It was the junior developer who discovered the critical memory leak.',
        exampleTr: 'Kritik bellek sızıntısını keşfeden kişi kıdemsiz geliştiriciydi.',
      },
      {
        formType: 'Wh- Cleft (Eylem / Nesne Vurgusu)',
        subject: 'What + S + V + is/was + Vurgu',
        formula: 'What + S + Verb + is/was + Noun/Clause',
        exampleEn: 'What the board fundamentally failed to understand was the velocity of the market shift.',
        exampleTr: 'Yönetim kurulunun temelde anlamayı başaramadığı şey pazar değişiminin hızıydı.',
      },
      {
        formType: 'Subjunctive - Zorunluluk Fiilleri',
        subject: 'demand / insist / urge that + S + V1',
        formula: 'S + demand/insist/suggest that + S + BARE INFINITIVE (be / do / sign)',
        exampleEn: 'The legal advisor insisted that the contractor sign the liability clause immediately.',
        exampleTr: 'Hukuk danışmanı yüklenicinin sorumluluk maddesini derhal imzalaması konusunda ısrar etti.',
      },
      {
        formType: 'Subjunctive - Hayati Sıfatlar',
        subject: 'It is essential / crucial / vital that',
        formula: 'It is vital that + S + BARE INFINITIVE',
        exampleEn: 'It is crucial that every specimen be maintained at minus eighty degrees.',
        exampleTr: 'Her bir numunenin eksi seksen derecede muhafaza edilmesi hayati önem taşır.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • RESMİ SUBJUNCTIVE KURALI',
        title: '1. Subjunctive Mood: 3. Tekilde "-s" Takısı ve Geçmiş Zaman Kuralı ASLA İşlemez!',
        explanationTr:
          'İngilizcede şu fiil ve sıfatların arkasından gelen "that" cümlesinde fiil TÜM ŞAHISLARLA (He, She, It, The government dahil) ve TÜM ZAMANLARDA (Cümle geçmişte başlasa bile!) YALIN KALIR:\n• Fiiller: demand, insist, recommend, suggest, propose, require, urge, mandate that...\n• Sıfatlar: It is crucial / essential / vital / imperative / mandatory that...\n• Örnek: "The judge ordered that the prisoner BE released" (was veya is DEĞİL!).\n• Örnek: "I recommend that she STUDY medicine" (studies DEĞİL!).',
        formula: 'demand / crucial that + Subject + V1 (Yalın: be, go, have, sign)',
        examples: [
          {
            en: 'The regulator mandated that every financial institution maintain a fifteen percent liquidity reserve.',
            tr: 'Düzenleyici kurum her finansal kuruluşun yüzde on beşlik bir likidite rezervi tutmasını zorunlu kıldı (maintain: s takısı yok!).',
            note: 'Özne tekil ve cümle geçmiş ("mandated") olmasına rağmen Subjunctive gereği "maintain" yalın kaldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • WH- CLEFT KALIPLARI',
        title: '2. Pseudo-Clefts: "All that / The reason why / What concerns me"',
        explanationTr:
          '• "What concerns me is the lack of clinical validation." (Beni endişelendiren şey klinik doğrulamanın eksikliğidir).\n• "All we need is a reliable supply chain." (Tek ihtiyacımız olan şey güvenilir bir tedarik zinciridir).\n• "The person who inspired the entire movement was Rosa Parks."',
        formula: 'What / All + Clause + is/was + Noun',
        examples: [
          {
            en: 'All that the negotiations achieved was a temporary thirty-day ceasefire.',
            tr: 'Müzakerelerin başarabildiği tek şey geçici otuz günlük bir ateşkesti.',
            note: '"All that..." yarılan cümle ile sonuç odağa yerleştirildi.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Subjunctive Olumsuzu Sadece "Not + V1" Şeklinde Yapılır',
        examples: 'The director recommended that the staff NOT disclose the pending merger.',
        noteTr: '"Doesn’t / don’t" kullanılmaz; doğrudan "not + yalın fiil" gelir.',
      },
    ],
    signalWords: [
      {
        word: 'imperative / mandatory / indispensable that',
        meaningTr: 'zorunlu / vazgeçilmez',
        positionRule: 'Subjunctive Mood tetikleyicisidir.',
        sampleEn: 'It is imperative that the containment unit not be breached.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'The doctor insisted that she takes the pills.',
        right: 'The doctor insisted that she take the pills. (veya should take)',
        whyTr: '"Insist that" yapısından sonra gelen cümlede 3. tekil şahısta "-s" takısı KULLANILMAZ; fiil yalın ("take") kalır.',
      },
      {
        wrong: 'What I want it is peace.',
        right: 'What I want is peace.',
        whyTr: 'Cleft cümlesinde "it" fazlalıktır; doğrudan "What I want is..." denir.',
      },
    ],
  },

  'c1-3': {
    nodeId: 'c1-3',
    overviewTr:
      'Geçmiş Zaman Kipleri ve İleri Çıkarım (Past Modals: Must have V3, Can’t have V3, Should have V3, Needn’t have V3 vs. Didn’t need to do), geçmişte yaşanmış veya yaşanmamış olaylar hakkında yüksek seviyeli spekülasyon, pişmanlık ve eleştiri üretir:\n• MUST HAVE V3 (%95 Geçmiş Çıkarım): Kesinlikle öyle yapmış olmalı (He passed with honors; he must have studied relentlessly).\n• CAN’T / COULDN’T HAVE V3 (%95 İmkansızlık Çıkarımı): Kesinlikle öyle yapmış olamaz (She was in Paris yesterday; she can’t have committed the robbery in London).\n• SHOULD HAVE V3 (Geçmiş Eleştiri / Pişmanlık): Yapmalıydın ama yapmadın (You should have checked the tire pressure).\n• SHOULDN’T HAVE V3: Yapmamalıydın ama maalesef yaptın (You shouldn’t have shared the confidential password).\n• NEEDN’T HAVE V3 vs DIDN’T NEED TO DO (Büyük Ayrım!): "Needn’t have done" = Gerek yoktu ama boş yere yaptın! "Didn’t need to do" = Gerek yoktu ve yapmadın.',
    timelineVisual: 'Geçmiş Eylem: [ MUST HAVE V3: Kesin Yaptı ] ──▶ [ CAN’T HAVE V3: İmkansız Yapamazdı ] ──▶ [ SHOULD HAVE V3: Keşke Yapsaydı ]',
    conjugationRows: [
      {
        formType: 'Geçmiş Kesin Çıkarım (+)',
        subject: 'must have + V3',
        formula: 'Subject + must have + V3',
        exampleEn: 'The ground is completely saturated; it must have rained torrentially overnight.',
        exampleTr: 'Zemin tamamen sırılsıklam; gece boyunca bardaktan boşanırcasına yağmış olmalı.',
      },
      {
        formType: 'Geçmiş İmkansızlık (-)',
        subject: 'can’t / couldn’t have + V3',
        formula: 'Subject + can’t/couldn’t have + V3',
        exampleEn: 'The ancient civilization couldn’t have constructed this monument without sophisticated mathematical tools.',
        exampleTr: 'Antik uygarlık bu anıtı gelişmiş matematiksel aletler olmadan inşa etmiş olamaz.',
      },
      {
        formType: 'Geçmiş Eleştiri (Should have)',
        subject: 'should / ought to have + V3',
        formula: 'Subject + should have + V3',
        exampleEn: 'The engineering team should have conducted stress tests under extreme temperature conditions.',
        exampleTr: 'Mühendislik ekibi aşırı sıcaklık koşulları altında stres testleri yapmalıydı (ama yapmadı).',
      },
      {
        formType: 'Boş Yere Yapılan Eylem (Needn’t have)',
        subject: 'needn’t have + V3',
        formula: 'Subject + needn’t have + V3 (Yaptı ama gereksizdi)',
        exampleEn: 'You needn’t have printed all five hundred pages; the committee requested digital copies.',
        exampleTr: 'Beş yüz sayfanın tamamını yazdırmana gerek yoktu (yazdırdın ama boşunaydı); komite dijital kopya istedi.',
      },
      {
        formType: 'Yüksek Olasılık (Might/May well have)',
        subject: 'might / may well have + V3',
        formula: 'Subject + may/might well have + V3',
        exampleEn: 'The prolonged drought may well have triggered the migration of the entire population.',
        exampleTr: 'Uzayan kuraklık tüm nüfusun göçünü büyük olasılıkla tetiklemiş olabilir.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • NEEDN’T HAVE vs DIDN’T NEED TO',
        title: '1. Sınavların En Şöhretli Çeldiricisi: Needn’t Have V3 vs. Didn’t Need To Do',
        explanationTr:
          '• NEEDN’T HAVE V3: Eylem fiilen GERÇEKLEŞTİ, fakat sonradan bunun tamamen gereksiz olduğu anlaşıldı (Emek/para boşa gitti).\n• DIDN’T NEED TO DO: Gerekli olmadığını en baştan biliyordunuz ve bu yüzden eylemi YAPMADINIZ (Vaktiniz cebinizde kaldı).',
        formula: 'needn’t have done = Yapıldı (Boşunaydı)  |  didn’t need to do = Yapılmadı (Gerek yoktu)',
        examples: [
          {
            en: 'We needn’t have rushed to the station because the train was delayed by an hour.',
            tr: 'İstasyona koşa koşa yetişmemize gerek yoktu (koştuk ama boşunaydı) çünkü tren bir saat rötar yaptı.',
            note: 'Koşma eylemi yapıldı ama gereksiz çıktı.',
          },
          {
            en: 'Because the museum was free on Sundays, we didn’t need to purchase tickets.',
            tr: 'Pazar günleri müze ücretsiz olduğu için bilet almak zorunda kalmadık (almadık).',
            note: 'Gerek olmadığını bilip satın almadılar.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • COULD HAVE V3 ÇOK ANLAMLILIĞI',
        title: '2. "Could Have Done": Fırsat Vardı Ama Tercih Edilmedi',
        explanationTr:
          '"Could have V3", geçmişte kişinin bir şeyi yapma gücü, yeteneği veya fırsatı varken kendi iradesiyle yapmamayı seçtiğini anlatır:\n• "I could have studied at Harvard, but I preferred to stay in London." (Harvard’da okuyabilirdim ama kalmayı seçtim).',
        formula: 'could have + V3 = Yapabilirdi (Ama yapmadı)',
        examples: [
          {
            en: 'Why did you walk in the rain? You could have called a taxi!',
            tr: 'Neden yağmurda yürüdün? Taksi çağırabilirdin (fırsatın vardı, çağırmadın)!',
            note: 'Yapılmamış alternatif seçeneğe sitem.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: '"Mustn’t have V3" İngilizcede Çıkarım Olarak Kullanılmaz',
        examples: '❌ He mustn’t have known  ──▶  ✅ He can’t have known',
        noteTr: 'Geçmiş olumsuz çıkarımda standart yapı daima "can’t have V3" veya "couldn’t have V3"tür.',
      },
    ],
    signalWords: [
      {
        word: 'in hindsight / looking back',
        meaningTr: 'geçmişe bakıldığında / sonradan anlaşıldığı üzere',
        positionRule: 'Should have veya needn’t have ile geçmiş muhasebesi yapar.',
        sampleEn: 'In hindsight, we should have anticipated the market volatility.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He mustn’t have stolen the car because he was with me.',
        right: 'He can’t have stolen the car because he was with me.',
        whyTr: 'Geçmiş imkansızlık çıkarımında "mustn’t have" değil, "can’t have V3" kullanılır.',
      },
      {
        wrong: 'I should study yesterday.',
        right: 'I should have studied yesterday.',
        whyTr: '"Yesterday" geçmiş zaman zarfıdır; geçmiş tavsiye ve pişmanlık için "should have V3" zorunludur.',
      },
    ],
  },

  'c1-4': {
    nodeId: 'c1-4',
    overviewTr:
      'Şart Devrikliği ve "If" Alternatifleri (Conditional Inversion & Alternatives to If: Had I known, Were you to, Should you require), akademik makalelerde ve diplomatik sözleşmelerde "IF" kelimesini tamamen ortadan kaldırarak cümleyi devrik kurgulamaktır:\n• Type 1 Devrikliği: "If you need any assistance" ──▶ "SHOULD YOU REQUIRE any assistance" (Should başa gelir).\n• Type 2 Devrikliği: "If I were the president" ──▶ "WERE I the president" | Eylem fiili varsa: "WERE he TO ACCEPT the offer".\n• Type 3 Devrikliği: "If I had known" ──▶ "HAD I KNOWN the risks, I wouldn’t have invested".\n• Alternatif Bağlaçlar: "But for his intervention" (Müdahalesi olmasaydı: Had it not been for), "Provided that", "On condition that", "Supposing that".',
    timelineVisual: 'Normal Şart: [ If + S + had V3 ] ──▶ Devrik Şart: [ HAD + S + V3 ] (IF kelimesi tamamen silinir!)',
    conjugationRows: [
      {
        formType: 'Type 1 Devriklik (Should)',
        subject: 'Should + Subject + V1',
        formula: 'Should + S + V1 (Yalın)..., will / please + V1',
        exampleEn: 'Should you encounter any technical difficulties during installation, please contact the support desk.',
        exampleTr: 'Kurulum sırasında herhangi bir teknik zorlukla karşılaşacak olursanız lütfen destek birimiyle iletişime geçin.',
      },
      {
        formType: 'Type 2 Devriklik (Were + to V1)',
        subject: 'Were + Subject + to + V1',
        formula: 'Were + S + to + V1..., would + V1',
        exampleEn: 'Were the central bank to lower interest rates unexpectedly, the currency would depreciate rapidly.',
        exampleTr: 'Merkez bankası faiz oranlarını beklenmedik şekilde düşürecek olursa para birimi hızla değer kaybederdi.',
      },
      {
        formType: 'Type 3 Devriklik (Had + S + V3)',
        subject: 'Had + Subject + V3',
        formula: 'Had + S + V3..., would have + V3',
        exampleEn: 'Had the clinical trials revealed any adverse side effects, the regulator would have halted the approval.',
        exampleTr: 'Klinik deneyler herhangi bir olumsuz yan etki ortaya çıkarmış olsaydı, düzenleyici kurum onayı durdururdu.',
      },
      {
        formType: 'Olumsuz Devrik Şart',
        subject: 'Had / Were + S + NOT + V3',
        formula: 'Had + S + not + V3 (DİKKAT: Hadn’t S denmez!)',
        exampleEn: 'Had we not implemented multi-factor authentication, the hackers would have compromised the mainframe.',
        exampleTr: 'Çok faktörlü kimlik doğrulamayı uygulamamış olsaydık, korsanlar ana bilgisayarı ele geçirmiş olurdu.',
      },
      {
        formType: 'Olmasaydı Kalıbı (Were it not for / Had it not been for)',
        subject: 'But for + İsim',
        formula: 'Were it not for (Şimdi) / Had it not been for (Geçmiş) + Noun',
        exampleEn: 'Had it not been for the pilot’s extraordinary composure, the aircraft would have crashed.',
        exampleTr: 'Pilotun olağanüstü soğukkanlılığı olmasaydı, uçak düşerdi.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • DEVRİK OLUMSUZLUKTA NOT AYRI KALIR',
        title: '1. Hayati Kural: "Hadn’t I" KESİNLİKLE DİYEMEZSİNİZ!',
        explanationTr:
          'Şart devrikliğinde cümle olumsuz olduğunda "Hadn’t we..." şeklinde kısaltma ASLA KULLANILMAZ! "Not" kelimesi özneden SONRA tek başına kalmalıdır:\n• ❌ Hadn’t the team analyzed the data...\n• ✅ HAD THE TEAM NOT ANALYZED the data...',
        formula: 'Had + Subject + NOT + V3  |  Were + Subject + NOT + to V1',
        examples: [
          {
            en: 'Had the whistleblower not leaked the internal memos, the public would never have learned of the corruption.',
            tr: 'İçeriden bilgi sızdıran kişi dahili notları sızdırmamış olsaydı (Had not leaked), kamuoyu yolsuzluktan asla haberdar olmazdı.',
            note: '"Not" özneden sonra bağımsız kalır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • BUT FOR KALIBI',
        title: '2. "But For" = Olmasaydı / Sayesinde',
        explanationTr:
          '"But for + İsim" yapısı arkasından cümle değil, sadece bir isim veya isim öbeği alır ve "Eğer o şey olmasaydı" anlamına gelir:\n• "But for your assistance, we would have failed" = "Had it not been for your assistance, we would have failed."',
        formula: 'But for + Noun, would (have) + V3',
        examples: [
          {
            en: 'But for the emergency funding provided by the consortium, the startup would have gone bankrupt.',
            tr: 'Konsorsiyum tarafından sağlanan acil fonlama olmasaydı (But for the funding), girişim iflas etmiş olurdu.',
            note: '"But for" yapısından sonra tam cümle değil doğrudan isim öbeği gelir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Type 2 Durum Cümlesinde "Were" Doğrudan Özneyle Kullanılır',
        examples: 'Were I in your position... (Eğer senin yerinde olsaydım...)',
        noteTr: 'Eğer fiil "to be" ise "to" kullanılmaz, doğrudan "Were + S + Adj/Noun" olur.',
      },
    ],
    signalWords: [
      {
        word: 'Supposing that / Provided that / On condition that',
        meaningTr: 'Farz edelim ki / şartıyla',
        positionRule: 'Koşul yan cümleciği kurar.',
        sampleEn: 'Supposing that we miss the deadline, what are the contractual penalties?',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Hadn’t I seen the warning, I would have walked into the trap.',
        right: 'Had I not seen the warning, I would have walked into the trap.',
        whyTr: 'Şart devrikliğinde olumsuzluk kısaltılamaz; "Had I not seen" denmelidir.',
      },
      {
        wrong: 'Should you will have questions, call me.',
        right: 'Should you have questions, call me.',
        whyTr: '"Should" devriklik kuralında fiil yalın kalır; "will" kullanılamaz.',
      },
    ],
  },

  'c1-5': {
    nodeId: 'c1-5',
    overviewTr:
      'İleri Düzey Ortaç Cümlecikleri ve Bağımsız Özneli Yapılar (Advanced Participle & Absolute Clauses: Having been V3, Not having known, Weather permitting), uzun ve hantal yan cümleleri ("Because he had worked all night", "After they had been inspected") tek bir akıcı ve profesyonel sözcük öbeğine dönüştürür:\n• Perfect Participle Active (Having + V3): Ana eylemden DAHA ÖNCE gerçekleşmiş etken bir olayı bağlar (Having completed the audit, the accountant filed the report).\n• Perfect Participle Passive (Having been + V3): Ana eylemden önce gerçekleşmiş EDİLGEN olayı bağlar (Having been dismissed from his post, the diplomat left the country).\n• Olumsuz Kısaltma: "Not" ortacın en başına gelir (NOT having received the confirmation, we delayed the flight).\n• Absolute Clauses (Bağımsız Özneli Kısaltma): Yan cümlenin öznesi ile ana cümlenin öznesi FARKLI olduğunda özne silinmez, ortacın başında korunur (The weather permitting, we will set sail tomorrow).',
    timelineVisual: 'Önce Olan Eylem: [ HAVING + V3 ] ──▶ Sonra Olan Ana Eylem: [ V2 / Ana Cümle ]',
    conjugationRows: [
      {
        formType: 'Perfect Participle Active',
        subject: 'Having + V3..., S + V2',
        formula: 'Having + V3 + Object, S + V2',
        exampleEn: 'Having analyzed over two million genomic sequences, the lab published its breakthrough findings.',
        exampleTr: 'İki milyondan fazla genomik dizilimi analiz etmiş olan laboratuvar, çığır açan bulgularını yayımladı.',
      },
      {
        formType: 'Perfect Participle Passive',
        subject: 'Having been + V3..., S + V2',
        formula: 'Having been + V3, S + V2',
        exampleEn: 'Having been exposed to extreme radiation, the sensors ceased functioning within minutes.',
        exampleTr: 'Aşırı radyasyona maruz kalmış olan sensörler dakikalar içinde çalışmayı durdurdu.',
      },
      {
        formType: 'Olumsuz Kısaltma (Negative Participle)',
        subject: 'Not having + V3',
        formula: 'Not having + V3, S + V2',
        exampleEn: 'Not having anticipated the supply chain disruption, the manufacturer ran out of microchips.',
        exampleTr: 'Tedarik zinciri aksamasını öngörmemiş olan üreticinin mikroçipleri tükendi.',
      },
      {
        formType: 'Bağımsız Özneli (Absolute Clause)',
        subject: 'Farklı Özne + Participle',
        formula: 'Noun + Participle, Main Clause',
        exampleEn: 'All flights having been cancelled due to the volcanic eruption, stranded travelers slept in the terminal.',
        exampleTr: 'Volkanik patlama nedeniyle tüm uçuşlar iptal edilmiş olduğundan, mahsur kalan yolcular terminalde uyudu.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • DANGLING PARTICIPLE TEHLİKESİ',
        title: '1. Havada Kalan Özne (Dangling Modifier) Hatasından Kaçınma',
        explanationTr:
          'Eğer cümlenin başında özne belirtmeden ortaç kısaltması yapıyorsanız (Walking down the street...), virgülden hemen sonra gelen ANA CÜMLENİN ÖZNESİ o eylemi bizzat yapan kişi olmalıdır!\n• ❌ "Walking into the room, the window was broken." (Odaya giren pencere olamaz!).\n• ✅ "Walking into the room, I noticed that the window was broken."',
        formula: 'Participle virgülü sonrası Özne = Eylemi Yapan Kişi!',
        examples: [
          {
            en: 'Having reviewed the security logs, the analyst identified the unauthorized IP address.',
            tr: 'Güvenlik kayıtlarını incelemiş olan analist (analiz eden kişi = analist), yetkisiz IP adresini tespit etti.',
            note: 'Özne uyumu kusursuzdur.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • ABSOLUTE CLAUSE FORMÜLÜ',
        title: '2. Absolute Clauses: Kendi Bağımsız Öznesi Olan Cümlecikler',
        explanationTr:
          'Eğer yan cümlenin öznesi ana cümleden farklıysa, Dangling hatasına düşmemek için o özne ortacın hemen önüne açıkça yazılır:\n• "Weather permitting" (Hava elverirse).\n• "Time running short, we skipped the final slide." (Zaman azaldığından son slaytı atladık).\n• "Night having fallen, the search team halted operations."',
        formula: 'Subject 1 + V-ing / V3, Subject 2 + Verb',
        examples: [
          {
            en: 'The keynote speaker having concluded his lecture, the audience broke into spontaneous applause.',
            tr: 'Ana konuşmacı dersini tamamlamış olduğundan, dinleyiciler kendiliğinden alkışlamaya başladı.',
            note: 'Konuşmacı ile dinleyiciler farklı iki öznedir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'With / Without ile Başlayan Absolute Yapılar',
        examples: 'With temperatures plunging below zero, homeless shelters operated at maximum capacity.',
        noteTr: '"With + Noun + Participle" modern editoryal dilde çok yaygındır.',
      },
    ],
    signalWords: [
      {
        word: 'weather permitting / God willing / circumstances allowing',
        meaningTr: 'hava elverirse / şartlar izin verirse',
        positionRule: 'Kalıplaşmış absolute clause örnekleridir.',
        sampleEn: 'The outdoor ceremony will proceed as scheduled, weather permitting.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Having not seen him for years, he looked different.',
        right: 'Not having seen him for years, I found that he looked different.',
        whyTr: '"Not" en başa gelir ("Not having seen") ve eylemi yapan kişi ana cümlenin öznesi ("I") olmalıdır.',
      },
      {
        wrong: 'After having eaten lunch, we left.',
        right: 'Having eaten lunch, we left. (veya After eating lunch)',
        whyTr: '"After" ile "having V3" yan yana gereksiz tekrardır (redundancy); ya "Having V3" ya da "After V-ing" denir.',
      },
    ],
  },

  'c1-6': {
    nodeId: 'c1-6',
    overviewTr:
      'Kişisiz Edilgen ve Akademik Mesafeli Dil (Impersonal Passive & Distance Language in Academic Reports: It is claimed that... & Subject is said to do / to have done), akademik makalelerde, gazetecilikte ve diplomatik raporlarda doğrudan taraf olmadan, iddiaları objektif bir mesafeyle aktarmak için kullanılır.\n• Kalıp 1 (It-Passive): "IT IS claimed / thought / believed / reported / estimated THAT the inflation rate will decline."\n• Kalıp 2 (Özneyle Başlayan İleri Edilgen): Cümlenin asıl öznesi başa çekilir ve fiil mastarla bağlanır:\n  - Şimdiki/Gelecek Eylem: "He IS SAID TO BE living in Switzerland."\n  - Geçmiş Eylem (To Have V3): "The former CEO IS THOUGHT TO HAVE TRANSFERRED millions to offshore accounts." (Milyonları aktarmış olduğu düşünülüyor - eylem daha önce oldu!).\n• Hedging (Mesafeli İfade): "Evidence suggests that...", "It would appear that...", "Indications point to...".',
    timelineVisual: 'İddia / Düşünce [ ŞİMDİ: is thought ] ──▶ Geçmiş Eylem [ GEÇMİŞTE OLDU: TO HAVE V3 ]',
    conjugationRows: [
      {
        formType: 'Kişisiz Edilgen (It is said that)',
        subject: 'It + is/was + V3 (report, believe, claim) + that',
        formula: 'It + is/was + V3 + that + Clause',
        exampleEn: 'It is widely believed that quantum computing will render traditional cryptography obsolete.',
        exampleTr: 'Kuantum hesaplamanın geleneksel kriptografiyi hükümsüz kılacağına yaygın olarak inanılmaktadır.',
      },
      {
        formType: 'Kişiyle Başlayan Şimdiki Zaman (To V1)',
        subject: 'Subject + is said/believed + TO + V1',
        formula: 'S + be + V3 + to + V1 / be V-ing',
        exampleEn: 'The reclusive billionaire is understood to be funding three private space exploration initiatives.',
        exampleTr: 'İnzivaya çekilen milyarderin üç özel uzay keşif girişimini finanse etmekte olduğu anlaşılmaktadır.',
      },
      {
        formType: 'Kişiyle Başlayan Geçmiş Eylem (To have V3)',
        subject: 'Subject + is said/alleged + TO HAVE + V3',
        formula: 'S + be + V3 + to have + V3',
        exampleEn: 'The suspect is alleged to have orchestrated the cyberattack from an undisclosed location.',
        exampleTr: 'Şüphelinin siber saldırıyı gizli bir konumdan yönetmiş olduğu iddia edilmektedir.',
      },
      {
        formType: 'There ile Başlayan Edilgen (There is said to be)',
        subject: 'There + is/are said + to be',
        formula: 'There + is/are/was + V3 + to be + Noun',
        exampleEn: 'There are reported to be several dissenting voices within the executive committee.',
        exampleTr: 'İcra komitesi içinde birkaç muhalif sesin bulunduğu bildirilmektedir.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • TO DO vs TO HAVE DONE AYRIMI',
        title: '1. Sınavların En Prestijli Kuralı: "To V1" vs. "To Have V3"',
        explanationTr:
          'Eğer inanılan/iddia edilen eylem ŞU ANDA gerçekleşiyorsa veya gelecekteyse "TO + V1" (to be, to operate) kullanılır. ANCAK iddia edilen eylem GEÇMİŞTE gerçekleşip bitmişse, aradaki zaman farkını göstermek için zorunlu olarak "TO HAVE + V3" kullanılır!\n• "He is believed to BE innocent" (Şu anda masum olduğuna inanılıyor).\n• "He is believed TO HAVE ESCAPED abroad" (Yurt dışına kaçmış olduğuna inanılıyor - kaçış geçmişte bitti!).',
        formula: 'Şimdiki eylem: is said TO V1  |  Geçmiş eylem: is said TO HAVE V3',
        examples: [
          {
            en: 'The ancient manuscript is thought to have been written during the fourth century BC.',
            tr: 'Antik el yazmasının M.Ö. dördüncü yüzyılda yazılmış olduğu düşünülmektedir (to have been written: geçmiş edilgen).',
            note: 'Düşünce şimdi ("is thought"), yazılma ise binlerce yıl önce ("to have been written").',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • HEDGING: MESAFELİ AKADEMİK DİL',
        title: '2. İhtiyatlı ve Mesafeli Dil Kalıpları (Hedging)',
        explanationTr:
          'Akademik makalelerde kesin ve iddialı cümleler yerine ihtiyatlı ifadeler kullanılır:\n• "It would appear that the initial hypothesis was partially flawed." (Görünüşe göre ilk hipotez kısmen kusurluydu).\n• "The empirical evidence tends to indicate that..." (Ampirik kanıtlar gösterme eğilimindedir).\n• "It is widely acknowledged that..." (Yaygın olarak kabul edilmektedir ki...).',
        formula: 'It would seem/appear that...  |  Evidence suggests that...',
        examples: [
          {
            en: 'Preliminary data would suggest that the new drug exhibits minimal cytotoxicity.',
            tr: 'Ön veriler yeni ilacın asgari düzeyde sitotoksisite sergilediğini düşündürmektedir (mesafeli akademik üslup).',
            note: 'Kesin "proves" yerine temkinli "would suggest" tercihi.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Çoğul Öznelerde "Are Said", Tekillerde "Is Said"',
        examples: 'The artifacts are estimated to be 3,000 years old. / The artifact is estimated to be...',
        noteTr: 'Ana cümlenin "be" fiili cümlenin başındaki yeni özneyle uyumlu olmalıdır.',
      },
    ],
    signalWords: [
      {
        word: 'allegedly / reportedly / supposedly',
        meaningTr: 'iddia edildiğine göre / bildirildiğine göre',
        positionRule: 'Cümle içinde mesafeli dil sağlayan zarflardır.',
        sampleEn: 'The foreign minister allegedly met with opposition leaders in secret.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He is thought to stole the jewelry.',
        right: 'He is thought to have stolen the jewelry.',
        whyTr: 'Geçmişte yapılmış bir eylemi aktarırken "to V2" diye bir kalıp yoktur; "to have V3" (to have stolen) kullanılır.',
      },
      {
        wrong: 'It is said him to be rich.',
        right: 'He is said to be rich. (veya It is said that he is rich)',
        whyTr: '"It is said..." arkasından doğrudan "that" cümlesi alır; kişi özne yapılacaksa cümlenin en başına geçer.',
      },
    ],
  },
};
