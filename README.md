# 🌟 Lingo Pulse

> **Yapay Zeka Destekli, Kişiselleştirilmiş İngilizce Öğrenme ve Pratik Platformu**  
> *AI-Powered Interactive English Learning & Practice Platform (Mobile & Web)*

---

## 📌 Proje Hakkında

**Lingo Pulse**, geleneksel ezber yöntemlerinin ötesine geçerek kullanıcıların İngilizceyi pratik yaparak, interaktif quizler çözerek ve yapay zeka ile diyalog kurarak kalıcı şekilde öğrenmelerini sağlayan modern bir dil öğrenme uygulamasıdır. 

Hem mobil cihazlarda (iOS & Android) hem de web üzerinde çalışan Lingo Pulse; A1'den C2'ye kadar 36 detaylı gramer konusunu, dinamik kelime havuzunu, konuşma pratiği yapabileceğiniz yapay zeka asistanını ve kişisel gelişim istatistiklerini tek bir çatıda toplar.

---

## ✨ Temel Özellikler

- 🤖 **Gemini AI Destekli Chat & Asistan**: Gerçek zamanlı İngilizce sohbet, anlık gramer kontrolü ve kişiye özel açıklamalar.
- 📚 **A1-C2 Kapsamlı Gramer Müfredatı**:
  - 6 seviyede (A1, A2, B1, B2, C1, C2) toplam 36 derinlemesine konu.
  - Cümle formülleri, yaygın hatalar (common mistakes), ipuçları ve mini testler.
- 🎯 **Akıllı AI Quiz Motoru**: Gemini API kullanılarak dinamik olarak üretilen, kullanıcının seviyesine uyarlanan çoktan seçmeli testler.
- 📇 **İnteraktif Kelime Akışı (Learn Feed)**: Hızlı kart geçişleri, kelime detayları ve kullanım örnekleri.
- 🔊 **Doğal Telaffuz (Text-to-Speech)**: `expo-speech` altyapısı ile her kelimenin ve cümlenin anında doğru sesletimi.
- ⏳ **Akıllı Bekleme Havuzu (Waiting Pool)**: Öğrenilen ve tekrar edilmesi gereken kelimelerin spaced-repetition mantığıyla takibi.
- 📊 **Detaylı İstatistikler & İlerleme**: Öğrenme serisi (streak), başarı oranları ve seviye ilerleme grafikleri.
- 🔒 **Güvenli Mimari**: Tüm API anahtarları ve veritabanı bağlantıları ortam değişkenleriyle (`.env`) korunur.

---

## 🛠️ Kullanılan Teknolojiler

### Mobil & Web (Frontend)
- **Framework**: [React Native](https://reactnative.dev/) (v0.88) & [Expo SDK 58](https://expo.dev/)
- **Dil**: TypeScript 6
- **UI & Güvenli Alan**: `react-native-safe-area-context`, `@expo/vector-icons`, `@expo/html-elements`
- **Ses & Telaffuz**: `expo-speech`
- **Yerel Depolama**: `@react-native-async-storage/async-storage`
- **Web Desteği**: `react-native-web`

### Sunucu & Veritabanı (Backend)
- **Sunucu**: Node.js & [Express 5](https://expressjs.com/)
- **Veritabanı**: PostgreSQL (`pg`) & Supabase entegrasyonu
- **CORS**: `cors` middleware

### Yapay Zeka (AI)
- **Model**: Google [Gemini API](https://ai.google.dev/) (Quiz üretimi, serbest konuşma koçluğu, dilbilgisi açıklamaları)

---

## 📁 Proje Dizin Yapısı

```plaintext
lingo-pulse/
├── src/
│   ├── data/
│   │   ├── grammar/           # A1'den C2'ye 36 detaylı gramer konusu
│   │   ├── grammarCurriculum.ts
│   │   ├── grammarPool.ts
│   │   └── words.ts           # Zengin kelime veritabanı
│   ├── screens/
│   │   ├── AuthScreen.tsx     # Giriş & Sunucu bağlantı ekranı
│   │   ├── ChatScreen.tsx     # Gemini AI İngilizce Sohbet ekranı
│   │   ├── GeminiQuizScreen.tsx # Yapay zeka destekli interaktif quiz
│   │   ├── GrammarScreen.tsx  # Gramer konu anlatımları ve testler
│   │   ├── LearnFeedScreen.tsx# Kelime öğrenme akışı
│   │   ├── StatsAndSettingsScreen.tsx # Profil ve istatistikler
│   │   └── WaitingPoolScreen.tsx # Tekrar havuzu
│   ├── services/
│   │   ├── auth.ts            # Kimlik doğrulama servisi
│   │   ├── db.ts              # API ve yerel veri yönetimi
│   │   ├── gemini.ts          # Gemini AI entegrasyonu
│   │   └── tts.ts             # Metin okuma (Text-to-Speech) servisi
│   └── theme/
│       └── colors.ts          # Renk paleti ve tasarım tokenları
├── server.js                  # Express backend & PostgreSQL sunucusu
├── App.tsx                    # Ana navigasyon ve uygulama kabuğu
├── .env.example               # Örnek ortam değişkenleri şablonu
└── package.json
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/omerberkkomurcuoglu/lingo_pulse.git
cd lingo_pulse
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Hazırlayın
Proje kök dizinindeki `.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```
Ardından `.env` dosyasını açıp kendi **Gemini API Key** ve veritabanı bilgilerinizi girin:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### 4. Backend Sunucusunu Başlatın
```bash
npm run server
```

### 5. Uygulamayı Başlatın (Expo)
Farklı ortamlarda çalıştırmak için aşağıdaki komutlardan birini kullanabilirsiniz:

- **Web Tarayıcısında**:
  ```bash
  npm run web
  ```
- **Expo Go (Mobil Cihaz / iOS / Android)**:
  ```bash
  npm start
  ```
- **Tünel Modunda (Farklı ağlardaki fiziksel cihazlar için)**:
  ```bash
  npm run tunnel
  ```

---

## 🔒 Güvenlik

Bu projede gizli anahtarlar ve veritabanı şifreleri kaynak kod içerisine gömülmez. Tüm hassas yapılandırmalar `.env` dosyasında tutulur ve `.gitignore` sayesinde Git takibine dahil edilmez.

---

## 📄 Lisans

Bu proje kişisel gelişim ve eğitim amaçlı geliştirilmiştir. Tüm hakları saklıdır.
