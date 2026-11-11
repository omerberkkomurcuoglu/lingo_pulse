import { DeepGrammarGuide } from './types';

export const A1_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  'a1-1': {
    nodeId: 'a1-1',
    overviewTr:
      'Simple Present Tense (Geniş Zaman) ve "To Be" (am/is/are), İngilizcenin omurgasıdır. Geçici anlık olayları değil; genel gerçekleri, bilimsel yasaları, değişmeyen durumları, karakter özelliklerini, alışkanlıkları ve resmi zaman çizelgelerini (tren/uçak saatleri) anlatır. En kritik ayrım: Cümlede bir EYLEM (fiil: work, go, study) mi var, yoksa bir DURUM/İSİM (mutlu, doktor, evde: am/is/are) mi var?',
    timelineVisual: '◀─── [Geçmişte Öyleydi] ─── ★ [Şimdi Öyle] ★ ─── [Gelecekte de Öyle] ───▶',
    conjugationRows: [
      {
        formType: 'To Be (+)',
        subject: 'I / He-She-It / We-You-They',
        formula: 'S + am / is / are + İsim / Sıfat / Yer',
        exampleEn: 'I am an engineer. / She is at the office.',
        exampleTr: 'Ben bir mühendisim. / O ofiste.',
      },
      {
        formType: 'To Be (-)',
        subject: 'Tüm Özneler',
        formula: 'S + am not / isn’t / aren’t + İsim / Sıfat',
        exampleEn: 'They aren’t ready for the meeting yet.',
        exampleTr: 'Henüz toplantı için hazır değiller.',
      },
      {
        formType: 'To Be (?)',
        subject: 'Tüm Özneler',
        formula: 'Am / Is / Are + S + İsim / Sıfat?',
        exampleEn: 'Are you available tomorrow morning?',
        exampleTr: 'Yarın sabah müsait misin?',
      },
      {
        formType: 'Fiil Cümlesi (+)',
        subject: 'I / You / We / They',
        formula: 'Subject + V1 (Yalın Fiil)',
        exampleEn: 'We analyze financial data every Monday.',
        exampleTr: 'Her pazartesi finansal verileri analiz ederiz.',
      },
      {
        formType: '3. Tekil (+)',
        subject: 'He / She / It (veya Tekil İsim)',
        formula: 'Subject + V-s / -es / -ies',
        exampleEn: 'She manages the international team.',
        exampleTr: 'Uluslararası ekibi o yönetir.',
      },
      {
        formType: 'Fiil Olumsuz (-)',
        subject: 'I-You-We-They / He-She-It',
        formula: 'S + don’t / doesn’t + V1 (Takısız!)',
        exampleEn: 'He doesn’t drink coffee after 6 PM.',
        exampleTr: 'Akşam 6’dan sonra kahve içmez.',
      },
      {
        formType: 'Fiil Sorusu (?)',
        subject: 'I-You-We-They / He-She-It',
        formula: '(Wh-) + Do / Does + S + V1 (Takısız!)?',
        exampleEn: 'Where does your brother work?',
        exampleTr: 'Kardeşin nerede çalışıyor (çalışır)?',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ALTIN KURAL',
        title: '1. İsim/Durum Cümlesi (am/is/are) vs. Eylem Cümlesi (do/does) Ayrımı',
        explanationTr:
          'İngilizcede bir cümlede asla hem "am/is/are" hem de yalın bir eylem fiili ("work, go, like") yan yana gelmez! Eğer cümlede hareket/eylem yoksa (hasta, yorgun, mühendis, İstanbul’da) "am/is/are" kullanılır. Eylem varsa "am/is/are" tamamen silinir, doğrudan fiil kullanılır.',
        formula: 'Durum: S + am/is/are + Adj/Noun  |  Eylem: S + V1 / V-s',
        examples: [
          {
            en: 'She is very careful, so she checks every detail twice.',
            tr: 'O çok dikkatlidir (Durum: is), bu yüzden her detayı iki kez kontrol eder (Eylem: checks).',
            note: 'İlk cümlede fiil olmadığı için "is", ikinci cümlede "check" eylemi olduğu için "-s" takısı kullanıldı.',
          },
          {
            en: 'Are you hungry, or do you want some coffee?',
            tr: 'Aç mısın (Durum: Are you), yoksa biraz kahve ister misin (Eylem: do you want)?',
            note: '"Hungry" sıfattır -> Are you hungry? | "Want" fiildir -> Do you want?',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • 3. TEKİL ŞAHIS',
        title: '2. He / She / It ve "Does / Doesn’t" Mıknatıs Kuralı',
        explanationTr:
          'Olumlu cümlede özne tekil bir kişi veya nesne (He, She, It, My father, The company, Water) olduğunda fiile "-s / -es / -ies" eklenir. Ancak cümleye "does" veya "doesn’t" girdiği anda, bu yardımcı fiil "-s" takısını mıknatıs gibi kendine çeker ve ana fiil anında yalın (V1) haline döner!',
        formula: '(+) She knows.  |  (-) She doesn’t know.  |  (?) Does she know?',
        examples: [
          {
            en: 'Water boils at 100 degrees Celsius, but it doesn’t boil at 80 degrees.',
            tr: 'Su 100 derecede kaynar, ancak 80 derecede kaynamaz.',
            note: '"Water" (It) -> olumluda "boils", olumsuzda "doesn’t boil" (s takısı düştü!).',
          },
          {
            en: 'Why does the system require a password every time?',
            tr: 'Sistem neden her seferinde şifre gerektiriyor?',
            note: 'Soru cümlesinde "does" olduğu için "requires" değil "require" kullanılır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • STATIVE VERBS',
        title: '3. Durum Fiilleri (Stative Verbs): Türkçede "-yor" Olsa Bile İngilizcede Simple Present!',
        explanationTr:
          'Zihinsel süreçleri, duyguları, sahipliği ve duyuları anlatan fiiller (know, understand, believe, remember, want, need, prefer, like, love, hate, belong, own, seem, contain) "-ing" (Continuous) ALAMAZ. Türkçeye "Biliyorum, istiyorum, anlamıyorum" diye çevrilse bile İngilizcede zorunlu olarak Simple Present kullanılır.',
        formula: '❌ I am knowing / She is wanting  ──▶  ✅ I know / She wants',
        examples: [
          {
            en: 'I don’t understand what this word means right now.',
            tr: 'Şu anda bu kelimenin ne anlama geldiğini anlamıyorum.',
            note: 'Cümlede "right now" olsa bile "understand" ve "mean" durum fiili olduğu için Simple Present zorunludur.',
          },
          {
            en: 'This ancient manuscript belongs to the national museum.',
            tr: 'Bu antik el yazması ulusal müzeye aittir.',
            note: '"Belong" (ait olmak) asla "is belonging" şeklinde kullanılamaz.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 4 • RESMİ TARİFELER',
        title: '4. Gelecek Anlamlı Geniş Zaman (Timetables & Schedules)',
        explanationTr:
          'Uçak, tren, otobüs saatleri, sinema/ders başlangıçları ve resmi takvimler gelecekte gerçekleşecek olsa bile sabit bir çizelgeye bağlı olduğu için Simple Present ile ifade edilir.',
        formula: 'The train / flight / match + leaves / starts / arrives + at + Saat',
        examples: [
          {
            en: 'Our flight to London leaves at 07:45 tomorrow morning.',
            tr: 'Yarın sabah Londra uçağımız 07:45’te kalkıyor.',
            note: '"Tomorrow morning" olmasına rağmen tarifeli sefer olduğu için "leaves" kullanılır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Sonu -ch, -sh, -ss, -x, -o, -z ile biten fiiller → "-es" alır',
        examples: 'watch → watches, wash → washes, miss → misses, fix → fixes, go → goes, do → does',
        noteTr: 'Ses uyumunu korumak için sadece "-s" değil "-es" eklenir ve /ɪz/ olarak okunur.',
      },
      {
        rule: 'Sonu "Ünsüz + y" ile biten fiiller → "-y" düşer, "-ies" gelir',
        examples: 'study → studies, try → tries, carry → carries, fly → flies, cry → cries',
        noteTr: 'DİKKAT: "Ünlü + y" ile bitiyorsa "-y" düşmez! (play → plays, buy → buys, enjoy → enjoys).',
      },
      {
        rule: 'Düzensiz 3. Tekil Fiil: Have → Has',
        examples: 'I have a car. → She has a car. / She doesn’t have a car.',
        noteTr: '"Haves" diye bir kelime yoktur! Ancak olumsuz ve soruda tekrar "doesn’t have / does she have" olur.',
      },
    ],
    signalWords: [
      {
        word: 'always / usually / often / sometimes',
        meaningTr: 'her zaman / genellikle / sık sık / bazen',
        positionRule: 'Ana fiilden ÖNCE, ancak am/is/are yardımcı fiilinden SONRA gelir.',
        sampleEn: 'She always arrives early, and she is always polite.',
      },
      {
        word: 'rarely / seldom / hardly ever / never',
        meaningTr: 'nadiren / neredeyse hiç / asla',
        positionRule: 'Cümleye olumsuz anlam katar; bu kelimeler varken "don’t / doesn’t" KULLANILMAZ!',
        sampleEn: 'He never complains about his workload. (❌ He doesn’t never complain)',
      },
      {
        word: 'every day / once a week / on Mondays',
        meaningTr: 'her gün / haftada bir / pazartesileri',
        positionRule: 'Genellikle cümlenin en sonunda (veya vurgu için en başında) yer alır.',
        sampleEn: 'We hold a strategy meeting every Monday morning.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I am agree with your opinion.',
        right: 'I agree with your opinion.',
        whyTr: '"Agree" bir sıfat değil, "katılmak/hemfikir olmak" anlamına gelen bir FİİLDİR. Başına "am/is/are" gelmez!',
      },
      {
        wrong: 'She doesn’t knows the answer.',
        right: 'She doesn’t know the answer.',
        whyTr: '"Doesn’t" yardımcı fiili zaten "-s" takısını aldığı için ana fiil ("know") yalın kalmalıdır.',
      },
      {
        wrong: 'He never doesn’t eat fast food.',
        right: 'He never eats fast food.',
        whyTr: 'İngilizcede tek cümlede çift olumsuzluk (never + doesn’t) kullanılmaz. "Never" olumlu yapıdaki fiille kullanılır.',
      },
      {
        wrong: 'Everyone know the rules here.',
        right: 'Everyone knows the rules here.',
        whyTr: 'Everyone, everybody, someone, nobody, everything kelimeleri anlamca çoğul gibi görünse de gramer olarak TEKİLDİR (He/She/It) ve fiile "-s" takısı getirir!',
      },
      {
        wrong: 'Who does work in this laboratory?',
        right: 'Who works in this laboratory?',
        whyTr: 'Özne sorularında ("Kim çalışır?" - işi yapanı sorarken) "do/does" yardımcı fiili KULLANILMAZ, fiil doğrudan "-s" alır.',
      },
    ],
  },

  'a1-2': {
    nodeId: 'a1-2',
    overviewTr:
      'Present Continuous Tense (Şimdiki Zaman: am/is/are + V-ing) ile Simple Present (Geniş Zaman) arasındaki fark, İngilizcedeki en hayati ayrımdır. Present Continuous tam konuşma anında devam eden eylemleri, bu dönemdeki geçici projeleri, değişen trendleri (is getting warmer) ve "always/constantly" ile şikayet edilen alışkanlıkları anlatır. Ancak bazı fiiller (Stative Verbs) hareket bildirmediği için "-ing" ALAMAZ; bazıları ise (think, have, see, taste, smell, look, weigh) anlamına göre hem durum hem eylem olabilir!',
    timelineVisual: 'Simple Present: ◀── Her Zaman ──▶   |   Present Continuous: [Şu An / Geçici Süreç: ●═══▶]',
    conjugationRows: [
      {
        formType: 'Olumlu (+)',
        subject: 'I / He-She-It / We-You-They',
        formula: 'S + am / is / are + V-ing',
        exampleEn: 'I am analyzing the report right now.',
        exampleTr: 'Şu anda raporu analiz ediyorum.',
      },
      {
        formType: 'Olumsuz (-)',
        subject: 'Tüm Özneler',
        formula: 'S + am not / isn’t / aren’t + V-ing',
        exampleEn: 'She isn’t working from the office this week.',
        exampleTr: 'Bu hafta ofisten çalışmıyor (geçici durum).',
      },
      {
        formType: 'Soru (?)',
        subject: 'Tüm Özneler',
        formula: '(Wh-) + Am / Is / Are + S + V-ing?',
        exampleEn: 'Why are they changing the security protocol?',
        exampleTr: 'Güvenlik protokolünü neden değiştiriyorlar?',
      },
      {
        formType: 'Kısa Cevap (+)',
        subject: 'Yes, S + am/is/are',
        formula: 'Yes, I am. / Yes, he is. / Yes, we are.',
        exampleEn: 'Are you listening? Yes, I am.',
        exampleTr: 'Dinliyor musun? Evet, dinliyorum.',
      },
      {
        formType: 'Kısa Cevap (-)',
        subject: 'No, S + am not/isn’t/aren’t',
        formula: 'No, I’m not. / No, she isn’t. / No, they aren’t.',
        exampleEn: 'Is it raining? No, it isn’t.',
        exampleTr: 'Yağmur yağıyor mu? Hayır, yağmıyor.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ŞİMDİKİ ZAMAN vs GENİŞ ZAMAN',
        title: '1. Tam Konuşma Anı vs. Geçici Dönem vs. Kalıcı Durum',
        explanationTr:
          'Present Continuous yalnızca "şu anda tam bu saniyede" olanları değil; bu hafta, bu ay veya bu dönem geçici olarak devam eden olayları da anlatır. Kalıcı yaşam biçimleri Simple Present iken, geçici istisnalar Present Continuous olur.',
        formula: 'Geçici: am/is/are + V-ing  |  Kalıcı: V1 / V-s',
        examples: [
          {
            en: 'I usually drive to work, but this week I am taking the subway because my car is being repaired.',
            tr: 'Normalde işe arabayla giderim (Kalıcı: drive), ancak bu hafta metroya biniyorum (Geçici: am taking) çünkü arabam tamirde.',
            note: '"This week" geçici bir süreç bildirdiği için Present Continuous kullanıldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • İKİLİ ANLAMLI FİİLLER',
        title: '2. Çift Karakterli Fiiller: Think, Have, See, Taste, Smell, Look',
        explanationTr:
          'Bazı fiiller FİKİR/DURUM bildirdiğinde Simple Present olur (-ing alamaz); ancak FİZİKSEL BİR EYLEM bildirdiğinde Present Continuous alabilir!\n• Think: Bence/Fikrimce (I think it’s good) vs Düşünmek/Kafa yormak (I am thinking about the offer).\n• Have: Sahiplik (I have a car) vs Deneyim/Eylem (I am having breakfast / a meeting).\n• See: Görmek/Anlamak (I see your point) vs Görüşmek/Randevu (I am seeing the doctor tomorrow).',
        formula: 'Durum: S + V1 (Stative)  |  Eylem: S + be + V-ing (Dynamic)',
        examples: [
          {
            en: 'What do you think of our new strategy? — I think it is brilliant.',
            tr: 'Yeni stratejimiz hakkında ne düşünüyorsun (fikrin ne)? — Bence harika.',
            note: 'Fikir sorduğu için "What are you thinking" değil "What do you think" kullanılır.',
          },
          {
            en: 'Quiet, please! I am thinking about a complex math problem.',
            tr: 'Sessiz olun lütfen! Karmaşık bir matematik problemi üzerine düşünüyorum (zihinsel eylem).',
            note: 'Aktif düşünme eylemi olduğu için "am thinking" doğrudur.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • ŞİKAYET BİLDİREN ALWAYS',
        title: '3. "Always" ile Şikayet ve Rahatsızlık İfade Etme',
        explanationTr:
          '"Always" normalde Simple Present ile rutin bildirir. Ancak birinin sinir bozucu, aşırı tekrarlayan bir alışkanlığını eleştirirken Present Continuous ile kullanılır!',
        formula: 'S + am/is/are + always / constantly + V-ing',
        examples: [
          {
            en: 'He is always leaving his dirty coffee mugs on my desk!',
            tr: 'Sürekli kirli kahve kupalarını masamda bırakıyor! (Şikayet/Sitem)',
            note: '"He always leaves" sadece bilgi verirken, "is always leaving" sitem ve bıkkınlık vurgular.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Sessiz + Sesli + Sessiz (CVC) Tek Heceliler → Son harf çift yazılır',
        examples: 'run → running, sit → sitting, stop → stopping, swim → swimming, plan → planning',
        noteTr: 'İki hecelilerde vurgu sondaysa çift yazılır (begin → beginning), baştaysa çift yazılmaz (visit → visiting, open → opening).',
      },
      {
        rule: 'Sonu "-e" ile biten fiiller → "-e" harfi düşer, "-ing" gelir',
        examples: 'make → making, write → writing, drive → driving, take → taking',
        noteTr: 'İstisna: Sonu "-ee" bitenlerde düşmez (see → seeing, agree → agreeing).',
      },
      {
        rule: 'Sonu "-ie" ile biten fiiller → "-ie" yerine "-y" gelir',
        examples: 'die → dying, lie → lying, tie → tying',
        noteTr: 'Yazımı tamamen değişen bu 3 fiil sınavlarda sıkça sorulur.',
      },
    ],
    signalWords: [
      {
        word: 'now / right now / at the moment / currently',
        meaningTr: 'şimdi / tam şu anda / şu sıralar',
        positionRule: 'Cümle sonunda veya vurgu için cümle başında yer alır.',
        sampleEn: 'She is currently leading the clinical trials in Berlin.',
      },
      {
        word: 'these days / this semester / nowadays',
        meaningTr: 'bugünlerde / bu dönem / bu günlerde',
        positionRule: 'Geçici dönem vurgulayan cümlelerde kullanılır.',
        sampleEn: 'More and more companies are adopting artificial intelligence these days.',
      },
      {
        word: 'Look! / Listen! / Be quiet!',
        meaningTr: 'Bak! / Dinle! / Sessiz ol!',
        positionRule: 'Cümle başında emir şeklinde gelir ve ardından hemen o anda olan eylem anlatılır.',
        sampleEn: 'Listen! Someone is knocking on the emergency exit door.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I am knowing three foreign languages.',
        right: 'I know three foreign languages.',
        whyTr: '"Know" durum fiilidir; Türkçede "biliyorum" desek bile İngilizcede "-ing" alamaz.',
      },
      {
        wrong: 'I am having two laptops.',
        right: 'I have two laptops.',
        whyTr: '"Have" sahiplik bildirdiğinde asla "-ing" almaz! Yalnızca "having lunch / having fun" gibi eylemlerde -ing alır.',
      },
      {
        wrong: 'What you are doing?',
        right: 'What are you doing?',
        whyTr: 'Soru cümlelerinde yardımcı fiil (am/is/are) özneden ÖNCE gelmek zorundadır.',
      },
      {
        wrong: 'Look, the bus comes!',
        right: 'Look, the bus is coming!',
        whyTr: '"Look!" konuşma anındaki eylemi işaret ettiği için mutlaka Present Continuous kullanılmalıdır.',
      },
    ],
  },

  'a1-3': {
    nodeId: 'a1-3',
    overviewTr:
      'Tanımlıklar (Articles: A, An, The) ve Sayılabilen/Sayılamayan İsimler, Türkçe konuşanların en çok zorlandığı konudur çünkü Türkçede "The" benzeri bir belirlilik tanımlığı bulunmaz. "A/An", herhangi bir tekil sayılabilir ismi; "The" ise dinleyicinin ve konuşmacının tam olarak hangi nesneden bahsettiğini bildiği (belirli, dünyada tek veya önceden bahsedilmiş) isimleri niteler. Genel anlamda çoğul veya sayılamayan isimlerde ise hiçbir tanımlık (Zero Article) kullanılmaz.',
    timelineVisual: '[ A / An: Herhangi Biri ] ──▶ [ Zero Article: Genel / Sayılamayan ] ──▶ [ The: Tam Olarak Bu Bilinen ]',
    conjugationRows: [
      {
        formType: 'Belirsiz Tekil (A)',
        subject: 'Sessiz sesle başlayan tekiller',
        formula: 'a + ünsüz ses (a car, a university, a European country)',
        exampleEn: 'She works at a university in Canada.',
        exampleTr: 'Kanada’da bir üniversitede çalışıyor (herhangi bir).',
      },
      {
        formType: 'Belirsiz Tekil (An)',
        subject: 'Sesli sesle başlayan tekiller',
        formula: 'an + ünlü ses (an apple, an hour, an MBA degree)',
        exampleEn: 'We have an hour before the flight departs.',
        exampleTr: 'Uçak kalkmadan önce bir saatimiz var.',
      },
      {
        formType: 'Belirli (The)',
        subject: 'Tekil, çoğul veya sayılamayan',
        formula: 'the + bilinen / tek / tanımlanmış isim',
        exampleEn: 'Could you please pass the salt on the table?',
        exampleTr: 'Masadaki tuzu uzatabilir misiniz lütfen?',
      },
      {
        formType: 'Tanımlıksız (Zero Article)',
        subject: 'Genel çoğullar & Sayılamayanlar',
        formula: 'Ø + çoğul isim / soyut / madde',
        exampleEn: 'Water is essential for human life.',
        exampleTr: 'Su insan yaşamı için gereklidir (genel).',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • SES KURALI',
        title: '1. A vs. An: Harfe Değil, TELAFFUZA Bakın!',
        explanationTr:
          '"A" veya "An" seçimi yazılan ilk harfe göre DEĞİL, okunan ilk SESTE belirlenir!\n• "Hour" kelimesi "h" ile yazılır ama "our" diye sesli okunur → an hour, an honest man.\n• "University", "European" kelimeleri "u/e" ile yazılır ama /j/ (y) sesiyle okunur → a university, a European country.\n• Kısaltmalarda: an MBA (/em-bi-ey/), an FBI agent.',
        formula: 'Sesli okunuş: an  |  Sessiz okunuş: a',
        examples: [
          {
            en: 'It is an honor to meet a European ambassador today.',
            tr: 'Bugün bir Avrupalı büyükelçiyle tanışmak bir onurdur.',
            note: '"honor" sesliyle başladığı için "an", "European" /y/ sesiyle başladığı için "a" aldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • THE NE ZAMAN KULLANILIR?',
        title: '2. "The" Kullanımının Altın Kuralları',
        explanationTr:
          '"The" şu durumlarda zorunludur:\n1) İlk kez bahsederken "a/an", ikinci kez bahsederken "the" (I bought a book. The book was fascinating).\n2) Evrende tek olan varlıklar: the sun, the moon, the sky, the earth, the internet.\n3) Süperlatifler ve sıra sayıları: the best, the first, the only.\n4) Okyanuslar, denizler, nehirler ve çoğul ülke isimleri: the Atlantic, the Mediterranean, the Nile, the Netherlands, the United States.\n5) Müzik aletleri (çalarken): play the piano, play the violin.',
        formula: 'İkinci anma / Tek varlık / Süperlatif → THE zorunlu',
        examples: [
          {
            en: 'Look at the moon shining over the Atlantic Ocean.',
            tr: 'Atlantik Okyanusu’nun üzerinde parlayan aya bak.',
            note: 'Hem "the moon" tek varlık, hem "the Atlantic Ocean" deniz/okyanus ismidir.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • ZERO ARTICLE',
        title: '3. "The" KESİNLİKLE Nerede Kullanılmaz? (Zero Article)',
        explanationTr:
          'Genel anlamda konuşulan çoğullarda ve sayılamayan isimlerde "The" KULLANILMAZ:\n• "Children like sweets." (Bütün çocuklar tatlı sever - genel).\n• "The children are playing in the garden." (Bizim bildiğimiz o çocuklar - belirli).\n• Tekil ülkeler/şehirler: Turkey, Paris, Germany (İstisna: çoğul veya birleşik devletler: the UK, the USA).\n• Öğünler ve sporlar: have breakfast, play football, study math.',
        formula: 'Genel anlam: Ø + Plural / Uncountable',
        examples: [
          {
            en: 'Teachers deserve respect, but the teachers at this school are especially dedicated.',
            tr: 'Öğretmenler saygıyı hak eder (genel: Ø), ancak bu okuldaki öğretmenler (belirli: the teachers) özellikle özverilidir.',
            note: 'İlk kullanım dünyadaki tüm öğretmenler (genel), ikincisi bu okulun öğretmenleri (özel).',
          },
        ],
      },
      {
        badge: 'BÖLÜM 4 • DÜZENSİZ ÇOĞULLAR',
        title: '4. Düzensiz Çoğul İsimler (Irregular Plurals)',
        explanationTr:
          'İngilizcede bazı isimler çoğul yapılırken "-s" almaz, kelimenin kendi kökü değişir:\n• child → children, person → people, man → men, woman → women, tooth → teeth, foot → feet, mouse → mice.\n• Değişmeyenler: sheep → sheep, fish → fish, deer → deer.\n• Sayılamayanlar (asla çoğul olmaz!): information, advice, furniture, luggage, news, money.',
        formula: 'Düzensiz: child/children | Sayılamayan: information (not informations!)',
        examples: [
          {
            en: 'Several women and children were waiting for the doctor.',
            tr: 'Birkaç kadın ve çocuk doktoru bekliyordu.',
            note: '"Womans" veya "childs" kesinlikle yanlıştır; "women" ve "children" kullanılır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Sayılamayan İsimler Miktar Belirtirken "Piece of" Alır',
        examples: 'a piece of advice, a piece of information, a piece of furniture, a cup of coffee',
        noteTr: '"An advice" veya "informations" diyemezsiniz! Tekil yapmak için "a piece of advice" kullanılır.',
      },
      {
        rule: 'Sonu -f / -fe ile biten isimler → "-ves" olur',
        examples: 'knife → knives, leaf → leaves, life → lives, wife → wives, shelf → shelves',
        noteTr: 'İstisnalar: roof → roofs, chef → chefs, belief → beliefs.',
      },
    ],
    signalWords: [
      {
        word: 'the first / the second / the last / the only',
        meaningTr: 'birinci / ikinci / sonuncu / yegane',
        positionRule: 'Sıra sayıları ve tekil niteleyiciler her zaman "The" ile kullanılır.',
        sampleEn: 'Neil Armstrong was the first person to walk on the moon.',
      },
      {
        word: 'a pair of / a piece of',
        meaningTr: 'bir çift / bir parça',
        positionRule: 'Sayılamayan veya iki parçalı giysileri saymak için kullanılır.',
        sampleEn: 'I need to buy a pair of shoes and a piece of luggage.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He gave me a good advice.',
        right: 'He gave me some good advice. (veya a piece of good advice)',
        whyTr: '"Advice" İngilizcede sayılamaz (uncountable); başına asla "a/an" alamaz ve sonuna "-s" eklenemez!',
      },
      {
        wrong: 'I go to university by the car.',
        right: 'I go to university by car.',
        whyTr: 'Ulaşım araçları "by" edatıyla kullanıldığında araya tanımlık girmez: by car, by bus, by train, by plane.',
      },
      {
        wrong: 'The life is beautiful.',
        right: 'Life is beautiful.',
        whyTr: 'Genel anlamdaki soyut isimler (hayat, aşk, barış: life, love, peace) başına "The" almaz!',
      },
      {
        wrong: 'She is engineer.',
        right: 'She is an engineer.',
        whyTr: 'Meslekler söylenirken tekil isimlerin başına mutlaka "a" veya "an" getirilmelidir.',
      },
    ],
  },

  'a1-4': {
    nodeId: 'a1-4',
    overviewTr:
      'Zaman, Yer ve Hareket Edatları (Prepositions: In, On, At, To, Into, Out of), cümlelerin nerede, ne zaman ve hangi yöne gerçekleştiğini belirler. Zaman ve mekan için "In / On / At" hiyerarşisi piramit kuralıyla işler: "In" en genel (yıllar, aylar, ülkeler, odalar); "On" daha dar (günler, caddeler, yüzeyler); "At" ise en spesifik, nokta atışı (tam saatler, belirli adresler, binaların işlevi) için kullanılır.',
    timelineVisual: 'GENEL [ IN: Yıl, Ay, Şehir ] ──▶ DAHA DAR [ ON: Gün, Cadde, Yüzey ] ──▶ NOKTA ATIŞI [ AT: Saat, Adres ]',
    conjugationRows: [
      {
        formType: 'Zaman (IN)',
        subject: 'Geniş Zaman Dilimleri',
        formula: 'in + yıl / mevsim / ay / günün bölümleri',
        exampleEn: 'in 2026, in summer, in July, in the morning',
        exampleTr: '2026’da, yazın, temmuzda, sabahleyin',
      },
      {
        formType: 'Zaman (ON)',
        subject: 'Günler ve Özel Tarihler',
        formula: 'on + gün / tam tarih / özel gün',
        exampleEn: 'on Monday, on 15th May, on my birthday',
        exampleTr: 'pazartesi günü, 15 mayısta, doğum günümde',
      },
      {
        formType: 'Zaman (AT)',
        subject: 'Tam Saatler & Belirli Anlar',
        formula: 'at + saat / tatil dönemi / gece',
        exampleEn: 'at 09:30, at noon, at midnight, at the weekend',
        exampleTr: 'saat 09:30’da, öğleyin, gece yarısı, hafta sonu',
      },
      {
        formType: 'Yer (IN vs ON vs AT)',
        subject: 'Mekan Hiyerarşisi',
        formula: 'in (içinde) / on (üstünde) / at (noktasında)',
        exampleEn: 'in London / on Oxford Street / at number 42',
        exampleTr: 'Londra’da / Oxford Caddesi’nde / 42 numarada',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ZAMAN PİRAMİDİ',
        title: '1. In, On, At: Zaman Hiyerarşisi ve Kritik İstisnalar',
        explanationTr:
          '• IN: Yıllar (in 1999), aylar (in May), mevsimler (in winter), günün bölümleri (in the morning, in the evening).\n• ON: Günler (on Tuesday), tam tarihler (on May 4th), bir günün belirli bir bölümü (on Friday morning).\n• AT: Saatler (at 8:00), istisnai anlar: at night (gece), at noon (öğlen), at dawn (şafakta), at Christmas/Easter (bayram tatili süresince).\n• DİKKAT: "Next, last, every, this" kelimelerinden önce ASLA in/on/at gelmez! (❌ on next Monday → ✅ next Monday).',
        formula: 'In + Geniş  |  On + Gün  |  At + Saat / Gece',
        examples: [
          {
            en: 'The symposium begins at 09:00 on Monday morning in September.',
            tr: 'Sempozyum eylül ayında (in September), pazartesi sabahı (on Monday morning), saat 09:00’da (at 09:00) başlıyor.',
            note: 'Tek cümlede üç edatın hiyerarşik sıralanışı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • MEKAN AYRIMI',
        title: '2. Yer Edatları: In vs. On vs. At (Kutu, Yüzey, Nokta)',
        explanationTr:
          '• IN: Sınırları olan 3 boyutlu bir alanın veya kabın İÇİNDE (in the room, in the box, in the car, in Turkey).\n• ON: 2 boyutlu bir YÜZEYİN üstünde veya temas halinde (on the table, on the wall, on the floor, on page 45) ve toplu taşıma araçlarında (on the bus, on the train, on a plane - ayakta durulabilen araçlar!).\n• AT: Bir harita NOKTASI veya bir binada bulunma amacı (at the bus stop, at the door, at home, at school, at work, at the station).',
        formula: 'İçinde: IN  |  Yüzeyde: ON  |  Noktada: AT',
        examples: [
          {
            en: 'He was waiting at the airport, reading a document on his tablet in the lounge.',
            tr: 'Havalimanında (at), bekleme salonunun içinde (in), tabletinin ekranında (on) bir belge okuyarak bekliyordu.',
            note: 'Mekan bağlamına göre üç edatın kusursuz kullanımı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • HAREKET EDATLARI',
        title: '3. Hareket Edatları: To, Into, Out of, Onto, Through',
        explanationTr:
          'Hareketsiz durumlar (in, on, at) ile bir yöne HAREKET bildiren edatlar karıştırılmamalıdır:\n• To: Bir hedefe doğru hareket (go to the station).\n• Into: Dışarıdan İÇERİYE doğru giriş hareketi (walk into the room, jump into the pool).\n• Out of: İçeriden DIŞARIYA çıkış (get out of the car).\n• Through: İki ucu açık bir tünel, orman veya sürecin içinden geçmek (walk through the park).',
        formula: 'Hedef: To  |  İçeriye: Into  |  Dışarıya: Out of  |  İçinden geçiş: Through',
        examples: [
          {
            en: 'The scientist walked into the cleanroom and looked through the microscope.',
            tr: 'Bilim insanı temiz odaya girdi (into) ve mikroskobun içinden (through) baktı.',
            note: 'Dışarıdan içeriye hareket "into" ile ifade edilir.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: '"At the weekend" (UK) vs. "On the weekend" (US)',
        examples: 'British English: at the weekend  |  American English: on the weekend',
        noteTr: 'Her iki kullanım da uluslararası sınavlarda doğru kabul edilir.',
      },
      {
        rule: '"In the end" (Sonunda/Nihayetinde) vs. "At the end of" (...-in sonunda)',
        examples: 'In the end, we succeeded.  |  At the end of the movie, they separated.',
        noteTr: '"At the end" arkasından mutlaka "of + isim" alır; "In the end" ise tek başına zarftır.',
      },
    ],
    signalWords: [
      {
        word: 'during vs. for vs. while',
        meaningTr: 'sırasında / boyunca / iken',
        positionRule: 'During + İsim (during the meeting) | For + Süre (for 3 hours) | While + Cümle (while I was sleeping).',
        sampleEn: 'During the conference, he spoke for forty minutes.',
      },
      {
        word: 'by vs. until',
        meaningTr: '-e kadar (en geç) vs. -e kadar (kesintisiz devam)',
        positionRule: 'By: son teslim anı (by 5 PM) | Until: o ana kadar süren eylem (stay until Friday).',
        sampleEn: 'Please submit the report by Friday, and wait until I reply.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I will see you on next Monday.',
        right: 'I will see you next Monday.',
        whyTr: '"Next, last, every, this" gibi belirteçlerin önüne in/on/at edatı ASLA konulmaz!',
      },
      {
        wrong: 'She arrived to the airport.',
        right: 'She arrived at the airport.',
        whyTr: '"Arrive" fiili "to" almaz! Küçük yerler/binalar için "arrive at", şehir/ülke için "arrive in" alır.',
      },
      {
        wrong: 'I am in the bus.',
        right: 'I am on the bus.',
        whyTr: 'Otobüs, tren, uçak gibi içinde ayağa kalkıp yürünebilen toplu taşıma araçlarında "on" kullanılır. Sadece taksi ve arabalarda "in" kullanılır.',
      },
      {
        wrong: 'He is married with a doctor.',
        right: 'He is married to a doctor.',
        whyTr: 'İngilizcede biriyle evli olmak "married with" DEĞİL, "married to" ile söylenir!',
      },
    ],
  },

  'a1-5': {
    nodeId: 'a1-5',
    overviewTr:
      'Modal Yardımcı Fiilleri (Modals: Can, Can’t, Could, Be able to), yetenek, izin, rica ve olasılık bildirmek için kullanılır. Modalların en temel altın kuralı: Şahsa göre asla ek almazlar (he cans diyemezsiniz!) ve arkalarından gelen ana fiil her zaman "to" almadan YALIN (Bare Infinitive: V1) kalır. "Can" şimdiki/genel yetenek iken, "Could" geçmişteki genel yeteneği veya günümüzdeki kibar ricaları ifade eder.',
    timelineVisual: 'GEÇMİŞ YETENEK [ Could / Couldn’t ] ──▶ ŞİMDİKİ YETENEK [ Can / Can’t ] ──▶ GELECEK YETENEK [ Will be able to ]',
    conjugationRows: [
      {
        formType: 'Yetenek (+)',
        subject: 'Tüm Özneler (I, You, He, She, They)',
        formula: 'Subject + can + V1 (Yalın Fiil)',
        exampleEn: 'She can speak four languages fluently.',
        exampleTr: 'Dört dili akıcı bir şekilde konuşabilir.',
      },
      {
        formType: 'Yetersizlik (-)',
        subject: 'Tüm Özneler',
        formula: 'Subject + cannot / can’t + V1',
        exampleEn: 'I can’t open this encrypted attachment.',
        exampleTr: 'Bu şifreli eki açamıyorum.',
      },
      {
        formType: 'Yetenek Sorusu (?)',
        subject: 'Tüm Özneler',
        formula: 'Can + Subject + V1?',
        exampleEn: 'Can you swim across the river?',
        exampleTr: 'Nehri yüzerek geçebilir misin?',
      },
      {
        formType: 'Kibar Rica (Could)',
        subject: 'Could you / Could I',
        formula: 'Could you + V1, please?',
        exampleEn: 'Could you send me the updated invoice, please?',
        exampleTr: 'Güncellenmiş faturayı bana gönderebilir misiniz lütfen?',
      },
      {
        formType: 'Geçmiş Yetenek (Could)',
        subject: 'Tüm Özneler',
        formula: 'Subject + could / couldn’t + V1',
        exampleEn: 'When he was six, he could already play chess.',
        exampleTr: 'Altı yaşındayken zaten satranç oynayabiliyordu.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ALTIN MODAL KURALLARI',
        title: '1. Modalların 3 Değişmez Özelliği',
        explanationTr:
          '1) Özneye göre ek almaz: He can (❌ He cans).\n2) Olumsuzu ve sorusu "do/does" almaz: Can you swim? (❌ Do you can swim?).\n3) Kendisinden sonra "to" gelmez, doğrudan fiil yalın gelir: I can swim (❌ I can to swim).',
        formula: 'Subject + Modal + V1 (Takısız ve to’suz!)',
        examples: [
          {
            en: 'A cheetah can run up to 120 kilometers per hour.',
            tr: 'Bir çita saatte 120 kilometreye kadar koşabilir.',
            note: '"Cheetah" 3. tekil olmasına rağmen "can" hiçbir takı almaz ve "run" yalın kalır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • RİCALAR VE İZİNLER',
        title: '2. İzin ve Rica Hiyerarşisi: Can vs. Could vs. May',
        explanationTr:
          '• Can I / Can you...?: Samimi ve gündelik rica (Can you give me a hand?).\n• Could you / Could I...?: Daha nazik, saygılı ve resmi rica (Could you explain that again?). Burada geçmiş zaman anlamı yoktur, şimdiki zamandır!\n• May I...?: En resmi ve kurumsal izin isteme kalıbı (May I ask a question, Professor?).',
        formula: 'Can (Gündelik) ──▶ Could (Nazik) ──▶ May (Resmi İzin)',
        examples: [
          {
            en: 'Could you please hold the elevator for a moment?',
            tr: 'Asansörü bir saniye tutabilir misiniz lütfen?',
            note: '"Could" burada geçmiş değil, son derece kibar bir şimdiki zaman ricasıdır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • GELECEKTE YETENEK',
        title: '3. Can vs. Be Able To: Gelecekte ve Diğer Zamanlarda Yetenek',
        explanationTr:
          '"Can" yardımcı fiilinin sadece şimdiki zamanı (can) ve geçmiş zamanı (could) vardır. Gelecek zaman ("will can" diye bir şey olamaz!), Present Perfect ("have canned" olamaz!) veya mastar ("to can" olamaz!) gerektiğinde "BE ABLE TO" devreye girer.',
        formula: 'Gelecekte: will be able to  |  Perfect: have/has been able to',
        examples: [
          {
            en: 'With this new software, we will be able to automate the entire inventory.',
            tr: 'Bu yeni yazılımla tüm envanteri otomatikleştirebileceğiz.',
            note: 'Gelecekte yapabilirlik için "will can" denemez, "will be able to" zorunludur.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: '"Cannot" Tek Kelime Olarak Bitişik Yazılır',
        examples: 'Formal: cannot  |  Informal: can’t',
        noteTr: '"Can not" şeklinde iki ayrı kelime yazılması standart İngilizcede kabul görmez, "cannot" tek kelimedir.',
      },
      {
        rule: 'Geçmişte Tek Seferlik Zor Bir Başarı: Could DEĞİL, "Was/Were able to / Managed to"',
        examples: 'The fire was huge, but the firefighters were able to rescue everyone.',
        noteTr: 'Geçmişte tek seferlik zorlu bir eylemi başarmak için "could" değil, "was able to" veya "managed to" kullanılır.',
      },
    ],
    signalWords: [
      {
        word: 'fluently / easily / with ease',
        meaningTr: 'akıcı bir şekilde / kolaylıkla / zahmetsizce',
        positionRule: 'Yetenek fiillerinin derecesini belirtmek için cümle sonunda yer alır.',
        sampleEn: 'She can translate technical documents with ease.',
      },
      {
        word: 'Would you mind...? vs. Could you...?',
        meaningTr: 'Rica etsem sakıncası var mı...? vs. Yapabilir misiniz...?',
        positionRule: '"Would you mind + V-ing" alırken, "Could you + V1" alır.',
        sampleEn: 'Would you mind closing the window? / Could you close the window?',
      },
    ],
    turkishTraps: [
      {
        wrong: 'He cans speak German very well.',
        right: 'He can speak German very well.',
        whyTr: 'Modallar asla 3. tekil şahıs "-s" takısı ALMAZ!',
      },
      {
        wrong: 'I can to drive a manual car.',
        right: 'I can drive a manual car.',
        whyTr: 'Can yardımcı fiilinden sonra asla "to" gelmez, fiil doğrudan yalın gelir.',
      },
      {
        wrong: 'Next year, I will can speak Spanish.',
        right: 'Next year, I will be able to speak Spanish.',
        whyTr: 'İki modal ("will" ve "can") yan yana gelemez; gelecek zamanda "will be able to" kullanılır.',
      },
      {
        wrong: 'Do you can help me?',
        right: 'Can you help me?',
        whyTr: 'Can kendi başına soru yapar; "do" yardımcı fiili kullanılmaz.',
      },
    ],
  },

  'a1-6': {
    nodeId: 'a1-6',
    overviewTr:
      'Zamirler (Pronouns), İyelikler (Possessives), İşaret Sıfatları (Demonstratives) ve Soru Kelimeleri (Wh- Questions), İngilizcede cümle yapısının yapı taşlarıdır. En kritik ayrım; Özne Zamirleri (I, you, he: eylemi yapan), Nesne Zamirleri (me, you, him: eylemden etkilenen), İyelik Sıfatları (my, your, his: isimden önce gelen) ve İyelik Zamirleri (mine, yours, his: ismin yerine geçen) arasındadır. Soru oluşumunda ise "Özne Sorusu" ile "Nesne Sorusu" arasındaki devrik/düz ayrımı hayati önem taşır.',
    timelineVisual: '[ ÖZNE: He / She ] ──▶ [ NESNE: Him / Her ] ──▶ [ İYELİK SIFATI: His / Her car ] ──▶ [ İYELİK ZAMİRİ: Mine / Hers ]',
    conjugationRows: [
      {
        formType: 'Özne Zamiri (Subject)',
        subject: 'Cümlenin Başı (Eylemi yapan)',
        formula: 'I, You, He, She, It, We, They',
        exampleEn: 'They invited us to their annual gala.',
        exampleTr: 'Onlar bizi yıllık galalarına davet ettiler.',
      },
      {
        formType: 'Nesne Zamiri (Object)',
        subject: 'Fiil veya Edattan Sonra',
        formula: 'me, you, him, her, it, us, them',
        exampleEn: 'The manager gave him the project files.',
        exampleTr: 'Müdür ona proje dosyalarını verdi.',
      },
      {
        formType: 'İyelik Sıfatı (Possessive Adj)',
        subject: 'İsimden Önce Gelir',
        formula: 'my, your, his, her, its, our, their + İsim',
        exampleEn: 'Our research team presented their findings.',
        exampleTr: 'Bizim araştırma ekibimiz kendi bulgularını sundu.',
      },
      {
        formType: 'İyelik Zamiri (Possessive Pronoun)',
        subject: 'İsimsiz Tek Başına Kullanılır',
        formula: 'mine, yours, his, hers, ours, theirs (İsim YOK!)',
        exampleEn: 'This laptop is mine, and that one is hers.',
        exampleTr: 'Bu dizüstü benimki, şu ise onunkidir.',
      },
      {
        formType: 'Dönüşlü Zamir (Reflexive)',
        subject: 'Özne ve Nesne Aynı Kişiyse',
        formula: 'myself, yourself, himself, herself, itself, ourselves, themselves',
        exampleEn: 'He prepared the whole presentation by himself.',
        exampleTr: 'Tüm sunumu kendi başına (bizzat) hazırladı.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ZAMİR HARİTASI',
        title: '1. İyelik Sıfatı (My) vs. İyelik Zamiri (Mine)',
        explanationTr:
          '• İyelik Sıfatı (my, your, her, their) MUTLAKA arkasından bir isim almak zorundadır: "This is my car."\n• İyelik Zamiri (mine, yours, hers, theirs) ise ismin yerine geçer, arkasından ASLA isim almaz: "This car is mine."\n• DİKKAT: "Its" (onun) bir iyelik sıfatıdır (The cat licked its paws); "It\'s" ise "it is" veya "it has" kısaltmasıdır!',
        formula: 'my + İsim  |  mine (tek başına)',
        examples: [
          {
            en: 'Is this pen yours or mine? — It belongs to her; hers has a red cap.',
            tr: 'Bu kalem senin mi yoksa benim mi? — Ona ait; onunkinin kırmızı bir kapağı var.',
            note: '"yours", "mine" ve "hers" arkalarından isim almadan "seninki, benimki, onunki" anlamında kullanıldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • İŞARET KELİMELERİ',
        title: '2. This, That, These, Those (Yakın / Uzak Ayrımı)',
        explanationTr:
          '• This: Yakındaki TEKİL nesne/durum (This document right here).\n• That: Uzaktaki TEKİL nesne/durum (That building over there).\n• These: Yakındaki ÇOĞUL nesneler (These documents on my desk).\n• Those: Uzaktaki ÇOĞUL nesneler (Those stars in the night sky).',
        formula: 'Yakın: This (tekil) / These (çoğul)  |  Uzak: That (tekil) / Those (çoğul)',
        examples: [
          {
            en: 'These figures show last month’s revenue, whereas those charts represent last year’s trends.',
            tr: 'Elimizdeki bu rakamlar (these) geçen ayın gelirini, şuradaki o grafikler ise (those) geçen yılın eğilimlerini gösteriyor.',
            note: 'Mekansal veya kavramsal yakınlık/uzaklık karşılaştırması.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • WH- SORULARI',
        title: '3. Wh- Soru Dizilimi: Özne Soruları vs. Nesne Soruları',
        explanationTr:
          'İngilizcede soru cümlesi oluştururken:\n1) Nesne Sorusu (Eylemden etkileneni sorarken): Wh- + Yardımcı Fiil + Özne + Fiil? (What do you want? Where does she work? Who did you call?)\n2) ÖZNE SORUSU (İşi yapan kişiyi sorarken): Eğer sorulan kelime bizzat eylemi yapansa, "do/does/did" YARDIMCI FİİLİ KULLANILMAZ! Cümle düz cümle gibi kurulur:\n• Who called you? (Seni kim aradı? - "Who" işi yapan özne!).\n• Who did you call? (Sen kimi aradın? - "You" özne, "Who" aranan nesne!).',
        formula: 'Nesne Sorusu: Wh + Aux + S + V  |  Özne Sorusu: Who/What + V (Düz sıra!)',
        examples: [
          {
            en: 'Who broke the window? (Özne) vs. Who did you see at the party? (Nesne)',
            tr: 'Pencereyi kim kırdı? (Özne sorusu: do/did yok) vs. Partide kimi gördün? (Nesne sorusu: did var)',
            note: 'Sınavlardaki en kritik çeldirici kuraldır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Whose (Kimin) vs. Who’s (Kim)',
        examples: 'Whose jacket is this? (Sahiplik)  |  Who’s (Who is) knocking on the door?',
        noteTr: 'Sesteş oldukları için sınavlarda birbirinin çeldiricisi olarak kullanılır.',
      },
      {
        rule: 'Its (Onun) vs. It’s (It is)',
        examples: 'The company increased its profits.  |  It’s a remarkable achievement.',
        noteTr: 'Kesme işareti varsa "It is", yoksa "onun" anlamına gelen iyelik sıfatıdır.',
      },
    ],
    signalWords: [
      {
        word: 'Who / Whom / Whose / Which / What / Where / When / Why / How',
        meaningTr: 'Kim / Kimi / Kimin / Hangisi / Ne / Nerede / Ne zaman / Neden / Nasıl',
        positionRule: 'Soru cümlelerinin en başında yer alır.',
        sampleEn: 'Which option offers the best value for money?',
      },
      {
        word: 'by myself / on my own',
        meaningTr: 'kendi başıma / tek başıma / bağımsızca',
        positionRule: 'Cümle sonunda yalnızlığı veya bireysel emeği vurgular.',
        sampleEn: 'She solved the entire network issue all by herself.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Who did break the vase?',
        right: 'Who broke the vase?',
        whyTr: 'Özneyi ("Kim kırdı?") sorarken soru cümlesinde "did" kullanılmaz; doğrudan fiilin geçmiş zaman hali gelir.',
      },
      {
        wrong: 'This is mine car.',
        right: 'This is my car. (veya This car is mine.)',
        whyTr: '"Mine" arkasından asla isim almaz! İsim varsa "my car", isim yoksa "it is mine" denir.',
      },
      {
        wrong: 'Between you and I, this decision is wrong.',
        right: 'Between you and me, this decision is wrong.',
        whyTr: 'Edatlardan (between, with, for, to) sonra özne zamiri ("I, he") değil, nesne zamiri ("me, him") kullanılır.',
      },
      {
        wrong: 'The dog wagged it’s tail.',
        right: 'The dog wagged its tail.',
        whyTr: 'Sahiplik bildiren "its" kesme işareti almaz. "It’s" ise "it is" anlamına gelir.',
      },
    ],
  },
};
