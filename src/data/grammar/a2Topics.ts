import { DeepGrammarGuide } from './types';

export const A2_DEEP_GUIDES: Record<string, DeepGrammarGuide> = {
  'a2-1': {
    nodeId: 'a2-1',
    overviewTr:
      'Simple Past Tense (Geçmiş Zaman) ve Geçmiş Alışkanlıklar (Used To / Would), geçmişte belirli bir zamanda gerçekleşmiş ve tamamen sona ermiş olayları anlatır. En kritik kurallar: Düzenli fiillere "-ed" eklenirken ses kurallarına dikkat edilmesi, yüzlerce düzensiz fiilin 2. hallerinin (V2) ezberlenmesi ve cümleye "did" veya "didn’t" girdiği anda fiilin derhal yalın (V1) haline dönmesidir. "Used To" geçmişteki durum ve alışkanlıkları anlatırken, "Would" geçmişte tekrarlanan eylemleri anlatır ancak durum fiilleriyle (be, live, have) KULLANILAMAZ.',
    timelineVisual: '◀─── [ Geçmişte Başladı ve BİTTİ: ★ V2 ] ───┼─── [ ŞİMDİ İLE İLGİSİ YOK ] ───▶',
    conjugationRows: [
      {
        formType: 'To Be Geçmişi (+)',
        subject: 'I-He-She-It (was) / We-You-They (were)',
        formula: 'S + was / were + Sıfat / İsim',
        exampleEn: 'She was the director of the lab last year.',
        exampleTr: 'Geçen yıl laboratuvarın direktörüydü.',
      },
      {
        formType: 'Fiil Olumlu (+)',
        subject: 'Tüm Özneler',
        formula: 'Subject + V2 (Düzenli: -ed / Düzensiz: V2)',
        exampleEn: 'We launched the mobile application yesterday.',
        exampleTr: 'Dün mobil uygulamayı piyasaya sürdük.',
      },
      {
        formType: 'Fiil Olumsuz (-)',
        subject: 'Tüm Özneler',
        formula: 'Subject + didn’t + V1 (Fiil YALIN!)',
        exampleEn: 'They didn’t receive the confirmation email.',
        exampleTr: 'Onay e-postasını almadılar.',
      },
      {
        formType: 'Fiil Sorusu (?)',
        subject: 'Tüm Özneler',
        formula: '(Wh-) + Did + Subject + V1 (Fiil YALIN!)?',
        exampleEn: 'Did you attend the international conference?',
        exampleTr: 'Uluslararası konferansa katıldınız mı?',
      },
      {
        formType: 'Geçmiş Alışkanlık (Used to)',
        subject: 'Tüm Özneler',
        formula: 'Subject + used to + V1 (Eski alışkanlık/durum)',
        exampleEn: 'I used to live in Berlin, but now I live in Tokyo.',
        exampleTr: 'Eskiden Berlin’de yaşardım, ama şimdi Tokyo’da yaşıyorum.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • DID / DIDN’T MIKNATISI',
        title: '1. "Did" Girdiği Anda Fiil Yalın Kalır Kuralı',
        explanationTr:
          'Türk öğrencilerin en sık yaptığı hata: Olumsuz veya soru cümlesinde hem "didn’t" hem de fiilin 2. halini (went, saw) kullanmaktır. "Did" geçmiş zaman ekini emen bir mıknatıs gibidir; cümleye girdiği anda ana fiil derhal sözlükteki yalın haline (V1) döner!',
        formula: '(-) S + didn’t + V1  |  (?) Did + S + V1?',
        examples: [
          {
            en: 'She went to Paris last month, but she didn’t visit the Louvre.',
            tr: 'Geçen ay Paris’e gitti (went), ancak Louvre’u ziyaret etmedi (didn’t visit).',
            note: 'Olumluda V2 ("went"), olumsuzda didn’t + V1 ("didn’t visit") kullanıldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • USED TO vs. WOULD',
        title: '2. Geçmiş Alışkanlıklar: Used To vs. Would Ayrımı',
        explanationTr:
          '• Used To: Geçmişteki hem EYLEMLERİ (used to swim) hem de DURUMLARI (used to be, used to live, used to have) anlatır. Artık geçerli olmayan bir geçmişi vurgular.\n• Would: Yalnızca geçmişte tekrarlanan DİNAMİK EYLEMLERİ anlatır ("Every summer we would visit our grandparents").\n• KRİTİK KURAL: Durum fiilleriyle (be, live, have, know, like) "would" KULLANILAMAZ! (❌ I would have long hair → ✅ I used to have long hair).',
        formula: 'Used to: Durum + Eylem  |  Would: SADECE Eylem',
        examples: [
          {
            en: 'My grandfather used to own a bakery, and every morning he would bake fresh croissants.',
            tr: 'Dedem eskiden bir fırına sahipti (durum: used to own) ve her sabah taze kruvasanlar pişirirdi (tekrarlanan eylem: would bake).',
            note: 'Sahiplik durum fiili olduğu için "would own" denemez, "used to own" şarttır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • -ED TELAFFUZU',
        title: '3. Düzenli Fiillerde "-ed" Ekinin 3 Farklı Okunuşu',
        explanationTr:
          'Düzenli fiillerin sonuna gelen "-ed" sesi gelişigüzel okunmaz:\n1) /ɪd/ sesi: Sadece son sesi /t/ veya /d/ ile biten fiillerde (wanted, decided, started, needed).\n2) /t/ sesi: Sessiz, patlamalı seslerle bitenlerde (p, k, f, s, sh, ch): stopped, looked, laughed, passed, washed, watched.\n3) /d/ sesi: Diğer tüm sesli ve yumuşak ünsüzlerle bitenlerde: played, lived, cleaned, opened.',
        formula: '/t/ veya /d/ ile biten → /ɪd/ okunur',
        examples: [
          {
            en: 'The flight landed on time, and we waited for our luggage.',
            tr: 'Uçak zamanında indi (/d/) ve biz bagajımızı bekledik (/ɪd/).',
            note: '"Land" /d/ ile bittiği için "landed" /ɪd/ olarak okunur.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Sessiz + Sesli + Sessiz Tek Hecelilerde Çift Harf',
        examples: 'stop → stopped, plan → planned, rob → robbed, drop → dropped',
        noteTr: 'Son harf çift yazılır ve "-ed" eklenir.',
      },
      {
        rule: '"Ünsüz + y" ile bitenler → "-ied" olur',
        examples: 'study → studied, carry → carried, cry → cried (Ancak: play → played)',
        noteTr: '"y"den önce ünlü varsa harf değişmez.',
      },
    ],
    signalWords: [
      {
        word: 'yesterday / last week / last year',
        meaningTr: 'dün / geçen hafta / geçen yıl',
        positionRule: 'Cümlenin en sonunda veya zaman vurgusu için en başında yer alır.',
        sampleEn: 'Last year, the engineering team patented three breakthrough algorithms.',
      },
      {
        word: 'in 2015 / two days ago / at that time',
        meaningTr: '2015’te / iki gün önce / o zamanlar',
        positionRule: 'Tamamen bitmiş geçmiş zaman referansı verir; Present Perfect ile ASLA kullanılmaz.',
        sampleEn: 'The company was founded ten years ago.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'I didn’t saw him yesterday.',
        right: 'I didn’t see him yesterday.',
        whyTr: '"Didn’t" yardımcı fiili varken ana fiil 2. hal ("saw") değil, 1. hal ("see") olmalıdır.',
      },
      {
        wrong: 'Did you went to the hospital?',
        right: 'Did you go to the hospital?',
        whyTr: '"Did" soruda zaten geçmişliği üstlendiği için fiil yalın ("go") kalmalıdır.',
      },
      {
        wrong: 'When I was young, I would have a bicycle.',
        right: 'When I was young, I used to have a bicycle.',
        whyTr: '"Have" (sahip olmak) bir durum fiilidir; geçmiş durumlar için "would" değil "used to" zorunludur.',
      },
      {
        wrong: 'I am living here since 5 years ago.',
        right: 'I lived here 5 years ago. / I have lived here for 5 years.',
        whyTr: '"Ago" sadece Simple Past ile kullanılır; "since" ve "for" ile Present Perfect gereklidir.',
      },
    ],
  },

  'a2-2': {
    nodeId: 'a2-2',
    overviewTr:
      'Past Continuous Tense (Geçmişte Süregelen Zaman: was/were + V-ing) ve Zaman Bağlaçları (When, While, As), geçmişte belirli bir anda devam etmekte olan bir eylemi veya başka bir eylemle kesilen arka plan olaylarını anlatır. Temel formül: Arka planda uzayıp giden uzun eylem Past Continuous (was walking), onu aniden bölen kısa eylem Simple Past (saw an accident) olur. "While" genellikle uzun eylemin (Past Continuous), "When" ise kesen kısa eylemin (Simple Past) başına gelir.',
    timelineVisual: 'Arka Plan Eylemi: [══════ was driving ══════] ──▶ Aniden Kesen: ★ [ phone rang ]',
    conjugationRows: [
      {
        formType: 'Olumlu (+)',
        subject: 'I / He / She / It',
        formula: 'Subject + was + V-ing',
        exampleEn: 'She was preparing the quarterly report at 9 PM.',
        exampleTr: 'Saat akşam 9’da üç aylık raporu hazırlıyordu.',
      },
      {
        formType: 'Olumlu (+)',
        subject: 'We / You / They',
        formula: 'Subject + were + V-ing',
        exampleEn: 'They were discussing the merger all afternoon.',
        exampleTr: 'Bütün öğleden sonra birleşmeyi tartışıyorlardı.',
      },
      {
        formType: 'Olumsuz (-)',
        subject: 'Tüm Özneler',
        formula: 'Subject + wasn’t / weren’t + V-ing',
        exampleEn: 'We weren’t expecting any visitors at that hour.',
        exampleTr: 'O saatte hiçbir ziyaretçi beklemiyorduk.',
      },
      {
        formType: 'Soru (?)',
        subject: 'Tüm Özneler',
        formula: '(Wh-) + Was / Were + Subject + V-ing?',
        exampleEn: 'What were you doing when the fire alarm sounded?',
        exampleTr: 'Yangın alarmı çaldığında ne yapıyordun?',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • KESİLEN EYLEMLER',
        title: '1. Kesilen Eylemler: When vs. While Altın Formülü',
        explanationTr:
          '• When + Simple Past (Kısa eylem), Past Continuous (Uzun eylem): "When the power went out, I was working on my computer."\n• While + Past Continuous (Uzun eylem), Simple Past (Kısa eylem): "While I was driving home, a deer crossed the road."\n• "When" anlık tekil olayı, "While/As" ise süreci vurgular.',
        formula: 'When + V2, was/were + V-ing  |  While + was/were + V-ing, V2',
        examples: [
          {
            en: 'While the scientists were conducting the experiment, an unexpected chemical reaction occurred.',
            tr: 'Bilim insanları deneyi yaparken (While were conducting), beklenmedik bir kimyasal reaksiyon meydana geldi (occurred).',
            note: 'Deneyin yapılışı uzun süreç (Continuous), reaksiyonun oluşu anlık kesiş (Simple Past).',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • PARALEL EYLEMLER',
        title: '2. Aynı Anda Devam Eden İki Uzun Eylem (Paralel)',
        explanationTr:
          'Geçmişte aynı zaman diliminde iki eylem birbirini kesmeden yan yana devam ediyorsa, "While" bağlacı her iki cümleyi de Past Continuous yapar.',
        formula: 'While + was/were V-ing, was/were V-ing',
        examples: [
          {
            en: 'While my colleague was analyzing the survey data, I was drafting the final conclusion.',
            tr: 'Meslektaşım anket verilerini analiz ederken, ben de nihai sonucu kaleme alıyordum.',
            note: 'İki eylem paralel şekilde eşzamanlı olarak devam etti.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • TAM BELİRLİ BİR ANDA SÜREN EYLEM',
        title: '3. Geçmişte Spesifik Bir Saatte Yapılmakta Olan Eylem',
        explanationTr:
          'Eğer geçmişte tam bir saat belirtilmişse (at 10:30 yesterday) ve eylem o anda sürüyorsa Past Continuous kullanılır. Eğer Simple Past kullanırsanız, o eylemin tam o saatte başladığı anlaşılır!',
        formula: 'At + Geçmiş Saat + was/were V-ing',
        examples: [
          {
            en: 'At midnight last night, the security team was still reviewing the surveillance footage.',
            tr: 'Dün gece yarısında güvenlik ekibi hâlâ güvenlik kamerası görüntülerini inceliyordu.',
            note: 'Gece yarısı eylemin ortasındaydılar.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Geçmişte Durum Fiilleri Past Continuous ALAMAZ',
        examples: '❌ I was knowing the answer  ──▶  ✅ I knew the answer',
        noteTr: 'Know, believe, remember, belong, understand gibi durum fiilleri geçmişte de -ing alamaz, Simple Past olurlar.',
      },
    ],
    signalWords: [
      {
        word: 'while / as / just as',
        meaningTr: '-iken / tam o esnada',
        positionRule: 'Past Continuous cümlenin başında yer alır.',
        sampleEn: 'Just as the train was departing, he jumped onto the platform.',
      },
      {
        word: 'all day yesterday / all night',
        meaningTr: 'dün bütün gün / bütün gece boyunca',
        positionRule: 'Eylemin kesintisiz sürdüğünü vurgular.',
        sampleEn: 'It was snowing heavily all night.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'When I was arriving home, my mother cooked dinner.',
        right: 'When I arrived home, my mother was cooking dinner.',
        whyTr: 'Eve varış tek bir andır (Simple Past: arrived), annenin yemek pişirmesi ise o sırada sürmekte olan eylemdir (was cooking).',
      },
      {
        wrong: 'While the phone rang, I had a bath.',
        right: 'While I was having a bath, the phone rang.',
        whyTr: '"While" uzun süren eylemin (banyo yapmak) önüne gelir; kısa kesen olay (telefonun çalması) ise Simple Past olur.',
      },
    ],
  },

  'a2-3': {
    nodeId: 'a2-3',
    overviewTr:
      'Gelecek Zaman İfadeleri (Future Forms: Will vs. Be Going To vs. Present Continuous), İngilizcede en ince nüanslara sahip konulardan biridir. Türkçede hepsine "-ecek / -acak" desek de İngilizcede niyetin ne zaman alındığı ve mevcut kanıtlar her şeyi değiştirir:\n• WILL: Konuşma anında aniden verilen kararlar (I’ll answer the phone), vaatler, teklifler ve kişisel tahminler (I think it will rain).\n• BE GOING TO: Önceden planlanmış niyetler (I am going to study medicine) ve GÖZLE GÖRÜLÜR SOMUT KANITLARA dayanan kesin tahminler (Look at the black clouds; it is going to rain!).\n• PRESENT CONTINUOUS: Diğer insanlarla önceden kesinleştirilmiş, randevusu/bileti ayarlanmış kesin organizasyonlar (I am meeting the CEO at 3 PM tomorrow).',
    timelineVisual: 'Konuşma Anı Kararı: [ WILL ]  |  Önceden Planlanan Niyet: [ GOING TO ]  |  Kesin Randevu: [ AM/IS/ARE + V-ING ]',
    conjugationRows: [
      {
        formType: 'Anlık / Tahmin (Will)',
        subject: 'Tüm Özneler',
        formula: 'Subject + will / won’t + V1 (Yalın)',
        exampleEn: 'Don’t worry; I will help you with the presentation.',
        exampleTr: 'Merak etme; sunumda sana yardım edeceğim (anlık teklif).',
      },
      {
        formType: 'Niyet / Kanıt (Be Going To)',
        subject: 'I / He-She-It / We-You-They',
        formula: 'S + am / is / are + going to + V1',
        exampleEn: 'We are going to launch the beta version next month.',
        exampleTr: 'Önümüzdeki ay beta sürümünü yayınlamayı planlıyoruz (niyet).',
      },
      {
        formType: 'Kesin Randevu (Present Continuous)',
        subject: 'Tüm Özneler',
        formula: 'S + am / is / are + V-ing + Gelecek Zaman Zarfı',
        exampleEn: 'I am seeing the dentist at 14:00 on Wednesday.',
        exampleTr: 'Çarşamba günü saat 14:00’te dişçiyle randevum var.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • ANLIK KARAR vs ÖNCEDEN NİYET',
        title: '1. Will vs. Be Going To: Karar Ne Zaman Alındı?',
        explanationTr:
          '• Konuşma anında alınan anlık kararlar: Kapı çaldığında "I will open it" (açacağım) denir. "I am going to open it" denemez çünkü kapının çalacağını önceden bilmiyordunuz!\n• Önceden kararlaştırılmış niyetler: "I am going to buy a new car next year" (Bütçemi ayarladım, niyetim var).',
        formula: 'Anlık: Will + V1  |  Önceden: Be going to + V1',
        examples: [
          {
            en: 'The phone is ringing. — I will get it!',
            tr: 'Telefon çalıyor. — Ben bakarım (anlık karar)!',
            note: 'Karar tam konuşma anında verildiği için "will" zorunludur.',
          },
          {
            en: 'Why do you have that paint? — Because I am going to paint my bedroom.',
            tr: 'O boya neden var? — Çünkü yatak odamı boyayacağım (önceden planlandı).',
            note: 'Boya önceden alınmış, niyet önceden oluşmuş.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • GÖZLE GÖRÜLÜR KANIT',
        title: '2. Tahminlerde Kanıt Kuralı: Will vs. Be Going To',
        explanationTr:
          '• Kişisel fikir, umut veya hisse dayalı tahmin: "I think humans will colonize Mars." (Bence öyle olacak - Will).\n• GÖZLE GÖRÜLÜR, FİZİKSEL MEVCUT KANITA dayalı kesin tahmin: "Look at that boy on the bicycle! He is going to fall!" (Düşecek! - Be going to).',
        formula: 'Kişisel Görüş: I think + will  |  Gözle Görülür Kanıt: Look! + be going to',
        examples: [
          {
            en: 'Look at those dark storm clouds gathering; it is going to rain heavily.',
            tr: 'Toplanan şu kara fırtına bulutlarına bak; şiddetli yağmur yağacak (gözle görülür kanıt).',
            note: 'Gökyüzündeki kara bulutlar fiziksel kanıt olduğu için "is going to rain" kullanılır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Will Not Kısaltması → Won’t',
        examples: 'She will not come → She won’t come',
        noteTr: 'Telaffuzu /woʊnt/ şeklindedir; "want" (/wɒnt/) ile karıştırılmamalıdır.',
      },
    ],
    signalWords: [
      {
        word: 'I promise / I swear / I hope / I think',
        meaningTr: 'Söz veriyorum / Umarım / Bence',
        positionRule: 'Bu ifadelerden sonra neredeyse her zaman "will" kullanılır.',
        sampleEn: 'I promise I won’t share your password with anyone.',
      },
      {
        word: 'Look! / Watch out! / Careful!',
        meaningTr: 'Bak! / Dikkat et!',
        positionRule: 'Göz önündeki fiziksel kanıtı uyarır, ardından "be going to" gelir.',
        sampleEn: 'Watch out! That ladder is going to collapse!',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Look at the baby! He will fall down!',
        right: 'Look at the baby! He is going to fall down!',
        whyTr: 'Gözümüzün önünde gerçekleşmek üzere olan fiziksel kanıtlı durumlarda "will" değil "be going to" kullanılır.',
      },
      {
        wrong: 'I am going to help you right now.',
        right: 'I will help you right now.',
        whyTr: 'Konuşma anında sunulan anlık yardım tekliflerinde "will" kullanılır.',
      },
    ],
  },

  'a2-4': {
    nodeId: 'a2-4',
    overviewTr:
      'Karşılaştırma Sıfatları (Comparatives: -er / more... than), Üstünlük Dereceleri (Superlatives: the -est / the most) ve Eşitlik Kalıpları (As... As), iki veya daha fazla nesneyi kıyaslamak için kullanılır. Tek heceli kısa sıfatlar sonuna "-er / -est" alırken, çok heceli uzun sıfatlar başına "more / the most" alır. Ayrıca "much / far / slightly" gibi pekiştirme zarfları ve "The more..., the more..." (Ne kadar..., o kadar...) kalıpları ileri seviye anlatım gücü kazandırır.',
    timelineVisual: 'Normal: Fast ──▶ Karşılaştırma: Faster than ──▶ En Üstün: The fastest',
    conjugationRows: [
      {
        formType: 'Kısa Sıfat (Comparative)',
        subject: 'Tek Heceliler',
        formula: 'Adj + -er + than',
        exampleEn: 'Sound travels faster in water than in air.',
        exampleTr: 'Ses suda havadan daha hızlı ilerler.',
      },
      {
        formType: 'Uzun Sıfat (Comparative)',
        subject: 'İki veya Daha Çok Heceliler',
        formula: 'more + Adj + than',
        exampleEn: 'This model is more reliable than the previous version.',
        exampleTr: 'Bu model önceki versiyondan daha güvenilirdir.',
      },
      {
        formType: 'Kısa Sıfat (Superlative)',
        subject: 'Tek Heceliler',
        formula: 'the + Adj + -est',
        exampleEn: 'Mount Everest is the highest mountain on Earth.',
        exampleTr: 'Everest Dağı Dünya üzerindeki en yüksek dağdır.',
      },
      {
        formType: 'Uzun Sıfat (Superlative)',
        subject: 'Çok Heceliler',
        formula: 'the most + Adj',
        exampleEn: 'It is the most prestigious scholarship in the country.',
        exampleTr: 'Ülkedeki en prestijli burstur.',
      },
      {
        formType: 'Eşitlik (As... As)',
        subject: 'Tüm Sıfatlar (Değişmeden!)',
        formula: 'as + Yalın Sıfat + as',
        exampleEn: 'The electric motor is as powerful as the diesel engine.',
        exampleTr: 'Elektrikli motor dizel motor kadar güçlüdür.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • DÜZENSİZ SIFATLAR',
        title: '1. Düzensiz Karşılaştırma Sıfatları (Ezberlenmesi Zorunlu)',
        explanationTr:
          'Bazı sıfatlar ne "-er" alır ne de "more" alır; tamamen biçim değiştirir:\n• good → better → the best (iyi / daha iyi / en iyi)\n• bad → worse → the worst (kötü / daha kötü / en kötü)\n• far → further / farther → the furthest / the farthest (uzak / daha ileri / en ileri)\n• little → less → the least (az / daha az / en az)\n• many/much → more → the most (çok / daha çok / en çok)',
        formula: 'good/better/best  |  bad/worse/worst  |  far/further/furthest',
        examples: [
          {
            en: 'Prevention is far better than cure, and negligence is the worst strategy.',
            tr: 'Önlem almak tedaviden çok daha iyidir (better than) ve ihmal en kötü stratejidir (the worst).',
            note: '"Better" ve "worst" düzensiz formları kullanıldı.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • PEKİŞTİRME ZARFLARI',
        title: '2. Derecelendirme Zarfları: Much, Far, Slightly, A bit',
        explanationTr:
          'İki şey arasındaki farkın derecesini belirtmek için Comparative yapının önüne zarf getirilir:\n• Çok daha: much better, far more expensive, considerably faster.\n• Biraz daha: slightly cheaper, a bit colder, a little more flexible.\n• DİKKAT: "Very" comparative önünde KULLANILMAZ! (❌ very better → ✅ much better).',
        formula: 'much / far / slightly + Comparative',
        examples: [
          {
            en: 'The quantum processor is far more efficient than classical silicon chips.',
            tr: 'Kuantum işlemcisi klasik silikon çiplerden çok daha (far more) verimlidir.',
            note: '"Far more" büyük bir farkı pekiştirir.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 3 • THE MORE... THE MORE',
        title: '3. "The... the..." (Ne Kadar..., O Kadar...) Kalıbı',
        explanationTr:
          'İki durumun birbiriyle orantılı olarak değiştiğini anlatan gelişmiş yapıdır.',
        formula: 'The + comparative..., the + comparative...',
        examples: [
          {
            en: 'The more you practice listening, the easier the IELTS exam becomes.',
            tr: 'Ne kadar çok dinleme pratiği yaparsanız, IELTS sınavı o kadar kolaylaşır.',
            note: 'Her iki cümlenin başında da "The + Comparative" yapısı yer alır.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Sonu "-y" ile biten 2 heceliler tek heceli gibi "-ier / -iest" alır',
        examples: 'easy → easier → easiest, heavy → heavier → heaviest, healthy → healthier',
        noteTr: '"More easy" değil, "easier" kullanılır.',
      },
    ],
    signalWords: [
      {
        word: 'than / as... as / compared to',
        meaningTr: '-den daha / kadar / kıyasla',
        positionRule: 'Karşılaştırılan ikinci nesneden önce gelir.',
        sampleEn: 'Our new laptop is not as heavy as the older generation.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'She is more taller than me.',
        right: 'She is taller than me.',
        whyTr: 'Çift karşılaştırma (double comparative) yapılamaz: hem "more" hem "-er" aynı anda kullanılmaz.',
      },
      {
        wrong: 'This is the most best solution.',
        right: 'This is the best solution.',
        whyTr: '"Best" zaten en üstün derecedir; önüne bir de "the most" getirilemez.',
      },
      {
        wrong: 'I am very taller than my brother.',
        right: 'I am much taller than my brother.',
        whyTr: 'Comparative sıfatların önüne "very" değil, "much" veya "far" getirilir.',
      },
    ],
  },

  'a2-5': {
    nodeId: 'a2-5',
    overviewTr:
      'Zorunluluk ve Tavsiye Kipleri (Must, Have to, Should, Mustn’t, Don’t have to), bir eylemin yapılmasının zorunlu mu, tavsiye mi, yasak mı yoksa isteğe bağlı mı olduğunu bildirir. En büyük kafa karışıklığı "Mustn’t" ile "Don’t have to" arasındadır:\n• Must: Konuşmacının kendi içinden hissettiği kişisel zorunluluk (I must study tonight).\n• Have to: Dışarıdan gelen kural, yasa veya amir baskısı (You have to wear a helmet by law).\n• Mustn’t: KESİN YASAK (Bunu yapman yasak, cezası var: You mustn’t smoke here).\n• Don’t / Doesn’t have to: ZORUNSUZLUK / İSTEĞE BAĞLI (Yapmak zorunda değilsin, istersen yap: Tomorrow is holiday, you don’t have to wake up early).\n• Should: TAVSİYE (Yapsan senin için iyi olur: You should see a doctor).',
    timelineVisual: 'Zorunluluk: MUST / HAVE TO  ──▶ Tavsiye: SHOULD  ──▶ Yasak: MUSTN’T  ──▶ Serbest/Gerek Yok: DON’T HAVE TO',
    conjugationRows: [
      {
        formType: 'İçsel Zorunluluk (Must)',
        subject: 'Tüm Özneler',
        formula: 'Subject + must + V1 (Yalın)',
        exampleEn: 'I must call my mother tonight; it is her birthday.',
        exampleTr: 'Bu akşam annemi aramalıyım; doğum günü (kendi vicdani kararım).',
      },
      {
        formType: 'Dışsal Kural (Have to)',
        subject: 'I-You-We-They (have to) / He-She-It (has to)',
        formula: 'Subject + have to / has to + V1',
        exampleEn: 'All international travelers have to show their passports.',
        exampleTr: 'Tüm uluslararası yolcular pasaportlarını göstermek zorundadır (yasal kural).',
      },
      {
        formType: 'Tavsiye (Should)',
        subject: 'Tüm Özneler',
        formula: 'Subject + should / shouldn’t + V1',
        exampleEn: 'You should back up your database every evening.',
        exampleTr: 'Her akşam veritabanınızı yedeklemelisiniz (tavsiye).',
      },
      {
        formType: 'Kesin Yasak (Mustn’t)',
        subject: 'Tüm Özneler',
        formula: 'Subject + mustn’t + V1 (YASAKTIR!)',
        exampleEn: 'You mustn’t take photographs inside the courtroom.',
        exampleTr: 'Duruşma salonunun içinde fotoğraf çekmeniz kesinlikle yasaktır.',
      },
      {
        formType: 'Gerek Yok (Don’t have to)',
        subject: 'don’t have to / doesn’t have to',
        formula: 'Subject + don’t/doesn’t have to + V1 (İsteğe bağlı)',
        exampleEn: 'You don’t have to print the ticket; showing the QR code is enough.',
        exampleTr: 'Bileti yazdırmak zorunda değilsiniz; QR kodu göstermek yeterlidir.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • MUSTN’T vs DON’T HAVE TO',
        title: '1. Sınavların En Tehlikeli Tuzağı: Yasak vs. Zorunsuzluk',
        explanationTr:
          '• Mustn’t = YASAK (Yaparsan ceza alırsın veya tehlikeli).\n• Don’t have to = ZORUNLU DEĞİL (İster yap ister yapma, serbestsin).\nÖrnek: "You mustn’t enter this room" (Bu odaya girmen yasak!). "You don’t have to enter this room" (Bu odaya girmek zorunda değilsin, dışarıda da bekleyebilirsin).',
        formula: 'Mustn’t = Forbidden (Yasak)  |  Don’t have to = Not necessary (Gerek yok)',
        examples: [
          {
            en: 'Museum admission is completely free today, so you don’t have to buy a ticket.',
            tr: 'Müze girişi bugün tamamen ücretsiz, bu yüzden bilet almak zorunda değilsiniz (gerek yok).',
            note: 'Bilet almak yasak değil, sadece gerek yok; bu yüzden "don’t have to" kullanılır.',
          },
          {
            en: 'You mustn’t touch the ancient artifacts on display.',
            tr: 'Sergilenen antik eserlere dokunmanız yasaktır.',
            note: 'Zarar vermemek için kesin yasak; bu yüzden "mustn’t" kullanılır.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • GEÇMİŞ ZAMAN ZORUNLULUĞU',
        title: '2. "Must" Yardımcı Fiilinin Geçmiş Zamanı Yoktur!',
        explanationTr:
          '"Must" yardımcı fiilinin geçmiş zaman biçimi (musted diye bir kelime!) YOKTUR. Geçmişte bir zorunluluktan ("-mek zorundaydım") bahsederken zorunlu olarak "HAD TO + V1" kullanılır!',
        formula: 'Geçmişte Zorunluluk: Subject + had to + V1',
        examples: [
          {
            en: 'Because the flight was cancelled, we had to stay at an airport hotel.',
            tr: 'Uçuş iptal edildiği için bir havalimanı otelinde kalmak zorunda kaldık.',
            note: 'Geçmişteki zorunluluk "had to" ile ifade edilir; "must" geçmişte kullanılamaz.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Mustn’t Telaffuzunda "t" Harfi Düşer',
        examples: 'Mustn’t telaffuzu: /ˈmʌsnt/ ("t" harfi okunmaz)',
        noteTr: 'Sözlü İngilizcede "t" harfi yutulur.',
      },
    ],
    signalWords: [
      {
        word: 'prohibited / forbidden / not allowed',
        meaningTr: 'yasaklanmış / izin verilmeyen',
        positionRule: 'Eş anlamlı olarak "mustn’t" gerektirir.',
        sampleEn: 'Smoking is prohibited here = You mustn’t smoke here.',
      },
      {
        word: 'optional / unnecessary',
        meaningTr: 'isteğe bağlı / gereksiz',
        positionRule: '"Don’t have to" ile eşanlamlıdır.',
        sampleEn: 'Attendance is optional = You don’t have to attend.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Yesterday I must work late.',
        right: 'Yesterday I had to work late.',
        whyTr: '"Must" geçmiş zamanda kullanılamaz; geçmişteki zorunluluklar için "had to" kullanılır.',
      },
      {
        wrong: 'You mustn’t come if you are busy.',
        right: 'You don’t have to come if you are busy.',
        whyTr: '"Meşgulsen gelmen yasak" denmez, "gelmek zorunda değilsin" (don’t have to) denir.',
      },
      {
        wrong: 'He don’t have to go.',
        right: 'He doesn’t have to go.',
        whyTr: '3. tekil şahıslarda (He/She/It) olumsuzluk "doesn’t have to" olur.',
      },
    ],
  },

  'a2-6': {
    nodeId: 'a2-6',
    overviewTr:
      'Miktar Belirleyiciler (Quantifiers: Some, Any, Much, Many, A lot of, A few vs. Few, A little vs. Little) ve Belgisiz Zamirler (Someone, Anything, Nowhere), nesnelerin miktarını tam sayı vermeden ifade eder. En hayati ayrım Sayılabilen (Countable: kitaplar, elmalar) ile Sayılamayan (Uncountable: su, para, bilgi) isimler arasındadır. Ayrıca "a few / a little" (az ama yeterli: olumlu) ile "few / little" (yok denecek kadar az, yetersiz: olumsuz) arasındaki harf farkı anlamı 180 derece değiştirir!',
    timelineVisual: 'Yetersiz / Neredeyse Yok: [ Few / Little ] ──▶ Az Ama Yeterli: [ A Few / A Little ] ──▶ Çok: [ A Lot Of / Many / Much ]',
    conjugationRows: [
      {
        formType: 'Olumlu Cümlede (Some)',
        subject: 'Sayılabilen Çoğul & Sayılamayan',
        formula: 'some + plural / uncountable',
        exampleEn: 'We received some valuable feedback from users.',
        exampleTr: 'Kullanıcılardan bazı değerli geri bildirimler aldık.',
      },
      {
        formType: 'Olumsuz & Soruda (Any)',
        subject: 'Sayılabilen Çoğul & Sayılamayan',
        formula: 'not... any / any...?',
        exampleEn: 'Do you have any questions before we conclude?',
        exampleTr: 'Bitirmeden önce herhangi bir sorunuz var mı?',
      },
      {
        formType: 'Çokluk - Sayılamayan (Much)',
        subject: 'Sadece Sayılamayan (Uncountable)',
        formula: 'much + uncountable (genellikle - ve ?)',
        exampleEn: 'We don’t have much time left before the deadline.',
        exampleTr: 'Son teslim tarihinden önce fazla vaktimiz kalmadı.',
      },
      {
        formType: 'Çokluk - Sayılabilen (Many)',
        subject: 'Sadece Çoğul Sayılabilen',
        formula: 'many + plural noun',
        exampleEn: 'Many researchers attended the symposium.',
        exampleTr: 'Pek çok araştırmacı sempozyuma katıldı.',
      },
      {
        formType: 'Her İkisinde de (A lot of)',
        subject: 'Sayılabilen Çoğul & Sayılamayan',
        formula: 'a lot of + plural / uncountable (özellikle +)',
        exampleEn: 'She has a lot of experience in cybersecurity.',
        exampleTr: 'Siber güvenlik alanında çok fazla deneyimi var.',
      },
    ],
    detailedRuleBlocks: [
      {
        badge: 'BÖLÜM 1 • A FEW vs FEW & A LITTLE vs LITTLE',
        title: '1. "A" Harfinin Yarattığı Hayati Fark: Pozitif vs. Negatif Anlam',
        explanationTr:
          '• A FEW (Sayılabilen) & A LITTLE (Sayılamayan): "Az ama yeterli" anlamına gelir, olumlu bir tondur.\n• FEW (Sayılabilen) & LITTLE (Sayılamayan): Başına "a" almadığında "yok denecek kadar az, yetersiz" anlamına gelir ve cümleye gizli bir olumsuzluk katar!',
        formula: 'a few / a little = az ama yeterli (+)  |  few / little = neredeyse hiç, yetersiz (-)',
        examples: [
          {
            en: 'I have a few friends in London, so I can stay with them. (Pozitif: arkadaşlarım var)',
            tr: 'Londra’da birkaç arkadaşım var, bu yüzden onlarda kalabilirim.',
            note: '"A few" yeterli sayıda arkadaş olduğunu belirtir.',
          },
          {
            en: 'He has few friends in London, so he feels lonely. (Negatif: neredeyse hiç arkadaşı yok)',
            tr: 'Londra’da neredeyse hiç arkadaşı yok, bu yüzden yalnız hissediyor.',
            note: '"Few" yetersizliği ve yalnızlığı vurgular.',
          },
        ],
      },
      {
        badge: 'BÖLÜM 2 • BELGİSİZ ZAMİRLER VE TEKİLLİK',
        title: '2. Someone, Anybody, Nobody, Everything: Her Zaman TEKİL Fiil Alır!',
        explanationTr:
          'Türkçe düşününce "Herkes biliyor" derken herkes çoğul gibi gelir. Ancak İngilizcede -one, -body, -thing ile biten TÜM belgisiz zamirler gramerce 3. TEKİL ŞAHIS (He/She/It) kabul edilir ve fiile "-s" takısı getirir!',
        formula: 'Everyone / Somebody / Nobody + V-s (Tekil fiil!)',
        examples: [
          {
            en: 'Everybody wants to succeed, but nobody is willing to take risks.',
            tr: 'Herkes başarılı olmak ister (wants), ancak hiç kimse risk almaya istekli değildir (is).',
            note: 'Hem "everybody" hem "nobody" tekil fiil çekimi ("wants", "is") aldı.',
          },
        ],
      },
    ],
    spellingAndEdgeCases: [
      {
        rule: 'Kibar Teklif ve İstek Sorularında "Any" Değil "Some" Kullanılır',
        examples: 'Would you like some coffee? / Can I borrow some money?',
        noteTr: 'Soru olmasına rağmen ikram veya olumlu cevap beklenen ricalarda "some" kullanılır.',
      },
    ],
    signalWords: [
      {
        word: 'hardly any / almost no',
        meaningTr: 'neredeyse hiç',
        positionRule: 'Olumsuzluk katar.',
        sampleEn: 'There is hardly any milk left in the fridge.',
      },
    ],
    turkishTraps: [
      {
        wrong: 'Everybody are ready for the meeting.',
        right: 'Everybody is ready for the meeting.',
        whyTr: '"Everybody" çoğul anlam taşısa da gramer olarak tekildir; "are" değil "is" alır.',
      },
      {
        wrong: 'I don’t have many money.',
        right: 'I don’t have much money.',
        whyTr: '"Money" (para) sayılamaz bir isimdir; "many" ile değil "much" ile kullanılır.',
      },
      {
        wrong: 'Nobody didn’t come to the presentation.',
        right: 'Nobody came to the presentation.',
        whyTr: '"Nobody" zaten cümleyi olumsuz yapar; ikinci bir olumsuzluk ("didn’t") eklenemez.',
      },
    ],
  },
};
