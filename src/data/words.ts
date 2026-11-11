export interface WordItem {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  sampleEn: string;
  sampleTr: string;
  mnemonicHint: string;
  imageUrl: string;
}

export type WordStatus = 'unseen' | 'known' | 'waiting' | 'mastered';

export interface UserWordProgress {
  wordId: number;
  status: WordStatus;
  waitingAddedAt?: string;
  masteredAt?: string;
  reviewCount: number;
  lastReviewedAt?: string;
}

// 1. Aşama Zengin Çekirdek Veri Seti (CEFR A1 - B2 seviyelerinde anımsatıcı görseller ve hafıza kancalarıyla)
export const INITIAL_VOCABULARY: WordItem[] = [
  {
    id: 1,
    word: 'Achieve',
    phonetic: '/əˈtʃiːv/',
    translation: 'Başarmak, elde etmek',
    partOfSpeech: 'verb',
    level: 'B1',
    sampleEn: 'She worked hard to achieve her lifelong dreams.',
    sampleTr: 'Hayat boyu kurduğu hayalleri başarmak için çok çalıştı.',
    mnemonicHint: 'Zirveye bayrak diken dağcıyı düşün; hedefe ulaşıp başardı.',
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    word: 'Brave',
    phonetic: '/breɪv/',
    translation: 'Cesur, yiğit',
    partOfSpeech: 'adjective',
    level: 'A2',
    sampleEn: 'The brave firefighter rescued the cat from the tree.',
    sampleTr: 'Cesur itfaiyeci kediyi ağaçtan kurtardı.',
    mnemonicHint: '"Braveheart" filmi gibi; alevlerin arasına korkusuzca giren biri.',
    imageUrl: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    word: 'Curious',
    phonetic: '/ˈkjʊəriəs/',
    translation: 'Meraklı, öğrenmeye hevesli',
    partOfSpeech: 'adjective',
    level: 'A2',
    sampleEn: 'Children are naturally curious about the world around them.',
    sampleTr: 'Çocuklar etraflarındaki dünya hakkında doğal olarak meraklıdır.',
    mnemonicHint: 'Büyüteçle karıncaları inceleyen meraklı bir çocuk gözü.',
    imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    word: 'Discover',
    phonetic: '/dɪˈskʌvər/',
    translation: 'Keşfetmek, bulmak',
    partOfSpeech: 'verb',
    level: 'A2',
    sampleEn: 'Scientists hope to discover new treatments for the disease.',
    sampleTr: 'Bilim insanları hastalık için yeni tedaviler keşfetmeyi umuyor.',
    mnemonicHint: 'Eski bir harita ve pusulayla bilinmeyen bir adayı bulan kaşif.',
    imageUrl: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    word: 'Effort',
    phonetic: '/ˈefət/',
    translation: 'Çaba, gayret, emek',
    partOfSpeech: 'noun',
    level: 'B1',
    sampleEn: 'Success requires patience, continuous effort, and focus.',
    sampleTr: 'Başarı sabır, sürekli çaba ve odaklanma gerektirir.',
    mnemonicHint: 'Ağır bir kayayı yokuş yukarı ter dökerek iten sporcu.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    word: 'Fluently',
    phonetic: '/ˈfluːəntli/',
    translation: 'Akıcı bir şekilde (konuşmak)',
    partOfSpeech: 'adverb',
    level: 'B1',
    sampleEn: 'After one year in London, she speaks English fluently.',
    sampleTr: 'Londra\'da geçen bir yıldan sonra akıcı bir şekilde İngilizce konuşuyor.',
    mnemonicHint: 'Su gibi akıp giden bir nehir (Fluent -> Akışkan).',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    word: 'Grateful',
    phonetic: '/ˈɡreɪtfʊl/',
    translation: 'Minnettar, şükran duyan',
    partOfSpeech: 'adjective',
    level: 'B1',
    sampleEn: 'I am deeply grateful for all your support and guidance.',
    sampleTr: 'Tüm desteğin ve rehberliğin için son derece minnettarım.',
    mnemonicHint: 'Elini kalbine götürüp içtenlikle teşekkür eden bir yüz.',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 8,
    word: 'Hesitate',
    phonetic: '/ˈhezɪteɪt/',
    translation: 'Tereddüt etmek, duraksamak',
    partOfSpeech: 'verb',
    level: 'B2',
    sampleEn: 'Do not hesitate to ask if you have any questions.',
    sampleTr: 'Herhangi bir sorunuz olursa sormaktan çekinmeyin/tereddüt etmeyin.',
    mnemonicHint: 'Kavşakta sağa mı sola mı döneceğini bilemeyip bekleyen sürücü.',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 9,
    word: 'Inspire',
    phonetic: '/ɪnˈspaɪər/',
    translation: 'İlham vermek, esinlendirmek',
    partOfSpeech: 'verb',
    level: 'B1',
    sampleEn: 'Her speech will inspire thousands of young entrepreneurs.',
    sampleTr: 'Onun konuşması binlerce genç girişimciye ilham verecek.',
    mnemonicHint: 'Kafasında parlayan parlak bir ampul ve fırçayla resim çizen ressam.',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 10,
    word: 'Journey',
    phonetic: '/ˈdʒɜːni/',
    translation: 'Yolculuk, seyahat, serüven',
    partOfSpeech: 'noun',
    level: 'A2',
    sampleEn: 'Learning a language is an exciting lifelong journey.',
    sampleTr: 'Dil öğrenmek hayat boyu süren heyecan verici bir yolculuktur.',
    mnemonicHint: 'Uçsuz bucaksız dağlara doğru giden açık bir tren rayı ve sırt çantası.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 11,
    word: 'Knowledge',
    phonetic: '/ˈnɒlɪdʒ/',
    translation: 'Bilgi, ilim',
    partOfSpeech: 'noun',
    level: 'A2',
    sampleEn: 'Knowledge is power when put into practical action.',
    sampleTr: 'Bilgi, pratik eyleme dönüştürüldüğünde güçtür.',
    mnemonicHint: 'Tavanına kadar kitaplarla dolu büyüleyici bir antik kütüphane.',
    imageUrl: 'https://images.unsplash.com/photo-1507842229451-79b1be88688e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 12,
    word: 'Magnificent',
    phonetic: '/mæɡˈnɪfɪsənt/',
    translation: 'Görkemli, muhteşem, harikulade',
    partOfSpeech: 'adjective',
    level: 'B2',
    sampleEn: 'The view from the top of the canyon was magnificent.',
    sampleTr: 'Kanyonun tepesinden manzara muhteşemdi.',
    mnemonicHint: 'Gün batımında altın gibi parlayan heybetli bir kale veya saray.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 13,
    word: 'Negotiate',
    phonetic: '/nɪˈɡəʊʃieɪt/',
    translation: 'Müzakere etmek, pazarlık yapmak',
    partOfSpeech: 'verb',
    level: 'B2',
    sampleEn: 'They managed to negotiate a better salary contract.',
    sampleTr: 'Daha iyi bir maaş sözleşmesi için müzakere etmeyi başardılar.',
    mnemonicHint: 'Masanın iki ucunda el sıkışan takım elbiseli iki iş ortağı.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 14,
    word: 'Overcome',
    phonetic: '/ˌəʊvəˈkʌm/',
    translation: 'Üstesinden gelmek, yenmek',
    partOfSpeech: 'verb',
    level: 'B1',
    sampleEn: 'Together we can overcome any difficult obstacle.',
    sampleTr: 'Birlikte her zorlu engelin üstesinden gelebiliriz.',
    mnemonicHint: 'Yüksek bir engelin üstünden zıplayıp diğer tarafa geçen atlet.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 15,
    word: 'Persist',
    phonetic: '/pəˈsɪst/',
    translation: 'Israr etmek, yılmamak, azimle sürdürmek',
    partOfSpeech: 'verb',
    level: 'B2',
    sampleEn: 'If you persist with your studies, fluency will come.',
    sampleTr: 'Çalışmalarına azimle devam edersen, akıcılık gelecektir.',
    mnemonicHint: 'Betonu yarıp yeşeren inatçı küçük bir filiz çiçeği.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 16,
    word: 'Reliable',
    phonetic: '/rɪˈlaɪəbl/',
    translation: 'Güvenilir, itimat edilir',
    partOfSpeech: 'adjective',
    level: 'B1',
    sampleEn: 'He is a very reliable teammate who never misses a deadline.',
    sampleTr: 'Asla teslim tarihini kaçırmayan çok güvenilir bir takım arkadaşıdır.',
    mnemonicHint: 'Tıkır tıkır çalışan sağlam bir İsviçre saati çarkı.',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 17,
    word: 'Subtle',
    phonetic: '/ˈsʌtl/',
    translation: 'İnce, göze çarpmayan, ustaca',
    partOfSpeech: 'adjective',
    level: 'B2',
    sampleEn: 'There is a subtle difference between these two shades of blue.',
    sampleTr: 'Bu iki mavi tonu arasında ince/belirsiz bir fark var.',
    mnemonicHint: 'Tabloda ustaca yapılmış gizli ve zarif bir fırça darbesi.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 18,
    word: 'Thrive',
    phonetic: '/θraɪv/',
    translation: 'Gelişmek, serpilmek, çok başarılı olmak',
    partOfSpeech: 'verb',
    level: 'B2',
    sampleEn: 'Plants thrive when given sufficient sunlight and fresh water.',
    sampleTr: 'Bitkiler yeterli güneş ışığı ve temiz su aldıklarında serpilir/gelişir.',
    mnemonicHint: 'Güneş ışığında yemyeşil yapraklarını gökyüzüne açan bereketli bir ağaç.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 19,
    word: 'Unique',
    phonetic: '/juːˈniːk/',
    translation: 'Eşsiz, benzersiz, tek',
    partOfSpeech: 'adjective',
    level: 'A2',
    sampleEn: 'Every individual has a unique fingerprint and personality.',
    sampleTr: 'Her bireyin eşsiz bir parmak izi ve kişiliği vardır.',
    mnemonicHint: 'Mikroskop altındaki birbirine hiç benzemeyen kusursuz kar tanesi.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 20,
    word: 'Vulnerable',
    phonetic: '/ˈvʌlnərəbl/',
    translation: 'Savunmasız, kırılgan, hassas',
    partOfSpeech: 'adjective',
    level: 'B2',
    sampleEn: 'Newborn birds are extremely vulnerable to winter predators.',
    sampleTr: 'Yeni doğmuş kuşlar kış avcılarına karşı son derece savunmasızdır.',
    mnemonicHint: 'Yuvada annesini bekleyen narin ve minik yavru kuş.',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 21,
    word: 'Ancient',
    phonetic: '/ˈeɪnʃənt/',
    translation: 'Antik, çok eski, kadim',
    partOfSpeech: 'adjective',
    level: 'A2',
    sampleEn: 'Rome is full of ancient ruins and historical monuments.',
    sampleTr: 'Roma antik kalıntılar ve tarihi anıtlarla doludur.',
    mnemonicHint: 'Piramitler ve bin yıllık sütunlar.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 22,
    word: 'Brilliant',
    phonetic: '/ˈbrɪliənt/',
    translation: 'Parlak, zekice, harika',
    partOfSpeech: 'adjective',
    level: 'B1',
    sampleEn: 'She came up with a brilliant solution to the software bug.',
    sampleTr: 'Yazılım hatasına harika/zekice bir çözüm buldu.',
    mnemonicHint: 'Göz kamaştıran elmas ışıltısı.',
    imageUrl: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 23,
    word: 'Comfortable',
    phonetic: '/ˈkʌmftəbl/',
    translation: 'Rahat, konforlu',
    partOfSpeech: 'adjective',
    level: 'A1',
    sampleEn: 'These new running shoes are soft and comfortable.',
    sampleTr: 'Bu yeni koşu ayakkabıları yumuşak ve rahat.',
    mnemonicHint: 'Şömine başında yumuşacık bir koltuğa gömülmüş kedi.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 24,
    word: 'Dangerous',
    phonetic: '/ˈdeɪndʒərəs/',
    translation: 'Tehlikeli',
    partOfSpeech: 'adjective',
    level: 'A1',
    sampleEn: 'It is dangerous to drive in heavy fog without lights.',
    sampleTr: 'Yoğun siste ışıksız araç kullanmak tehlikelidir.',
    mnemonicHint: 'Sarı-siyah uyarı levhası ve fırtınalı uçurum.',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 25,
    word: 'Essential',
    phonetic: '/ɪˈsenʃl/',
    translation: 'Temel, zorunlu, vazgeçilmez',
    partOfSpeech: 'adjective',
    level: 'B1',
    sampleEn: 'Drinking clean water is essential for human health.',
    sampleTr: 'Temiz su içmek insan sağlığı için vazgeçilmezdir/esastır.',
    mnemonicHint: 'Çölde hayatta kalmak için tek su matarası.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 26,
    word: 'Faithful',
    phonetic: '/ˈfeɪθfʊl/',
    translation: 'Sadık, vefakar, bağlı',
    partOfSpeech: 'adjective',
    level: 'B1',
    sampleEn: 'The faithful golden retriever stayed by his owner\'s side.',
    sampleTr: 'Sadık golden retriever sahibinin yanından hiç ayrılmadı.',
    mnemonicHint: 'Sahibinin gözünün içine sevgiyle bakan sadık bir köpek.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 27,
    word: 'Gather',
    phonetic: '/ˈɡæðər/',
    translation: 'Toplanmak, bir araya getirmek',
    partOfSpeech: 'verb',
    level: 'A2',
    sampleEn: 'Friends gather around the campfire to sing acoustic songs.',
    sampleTr: 'Arkadaşlar şarkı söylemek için kamp ateşinin etrafında toplandı.',
    mnemonicHint: 'Ateşin etrafında el ele oturan dostlar.',
    imageUrl: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 28,
    word: 'Harmonious',
    phonetic: '/hɑːˈməʊniəs/',
    translation: 'Uyumlu, ahenkli',
    partOfSpeech: 'adjective',
    level: 'B2',
    sampleEn: 'The choir produced a rich and harmonious sound.',
    sampleTr: 'Koro zengin ve ahenkli bir ses çıkardı.',
    mnemonicHint: 'Senfoni orkestrasının kusursuz çaldığı kemanlar.',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 29,
    word: 'Incredible',
    phonetic: '/ɪnˈkredəbl/',
    translation: 'İnanılmaz, olağanüstü',
    partOfSpeech: 'adjective',
    level: 'A2',
    sampleEn: 'She told us an incredible true story about her jungle trek.',
    sampleTr: 'Bize orman yürüyüşü hakkında inanılmaz gerçek bir hikaye anlattı.',
    mnemonicHint: 'Kuzey ışıklarının (Aurora) gökyüzündeki dansı.',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 30,
    word: 'Joyful',
    phonetic: '/ˈdʒɔɪfʊl/',
    translation: 'Neşeli, sevinç dolu',
    partOfSpeech: 'adjective',
    level: 'A2',
    sampleEn: 'The festival was filled with joyful laughter and music.',
    sampleTr: 'Festival neşeli kahkahalar ve müzikle doluydu.',
    mnemonicHint: 'Renkli konfetiler altında dans eden mutlu insanlar.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
  }
];
