import { WordItem } from '../data/words';
import { dbService } from './db';

export interface QuizQuestion {
  sentence: string;          // İngilizce boşluklu cümle, örn: "He made a huge [_____] to finish the marathon."
  sentenceTr: string;        // Cümlenin Türkçe çevirisi
  targetWord: WordItem;      // Doğru olan kelime
  options: WordItem[];       // 5 şık (hepsi bekleme listesinden veya dengeli dağıtılmış)
  hint?: string;             // Gemini'nin verdiği ipucu / bağlam açıklaması
  isAiGenerated: boolean;    // Gemini ile mi üretildi yoksa yerel mi
}

interface BankSentence {
  sentence: string;
  sentenceTr: string;
  hint?: string;
}

export class GeminiService {
  // Arena soru havuzundan (PostgreSQL) bu kelimeye ait kayıtlı cümleleri getir
  static async fetchBank(wordId: number): Promise<BankSentence[]> {
    try {
      const res = await dbService.api(`/api/quiz/bank?wordId=${wordId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.questions)) return data.questions;
      }
    } catch {}
    return [];
  }

  // Üretilen cümleyi soru havuzuna (PostgreSQL) kaydet
  static async saveToBank(
    word: WordItem,
    q: BankSentence,
    source: 'gemini' | 'local'
  ): Promise<void> {
    try {
      await dbService.api('/api/quiz/bank/save', {
        method: 'POST',
        body: JSON.stringify({
          wordId: word.id,
          word: word.word,
          sentence: q.sentence,
          sentenceTr: q.sentenceTr,
          hint: q.hint || '',
          source,
        }),
      });
    } catch {}
  }

  // allWords: şıklarda kullanılacak ÖĞRENİLMİŞ/görülmüş kelimeler (yeni kelime çıkmasın).
  // fallbackWords: şık sayısı 3'ün altında kalırsa mecburen tamamlamak için tüm kelimeler.
  static async generateQuestion(
    waitingWords: WordItem[],
    allWords: WordItem[],
    fallbackWords: WordItem[] = []
  ): Promise<QuizQuestion | null> {
    if (waitingWords.length === 0) {
      return null;
    }

    // 1. Bekleme havuzundan rastgele bir hedef kelime seç
    const targetIndex = Math.floor(Math.random() * waitingWords.length);
    const targetWord = waitingWords[targetIndex];

    // 2. 5 seçenek oluştur (öncelik diğer bekleme kelimeleri, yetmezse genel kelimeler)
    const optionsSet = new Set<number>([targetWord.id]);
    const options: WordItem[] = [targetWord];

    // Diğer bekleme kelimelerini karıştırıp ekle
    const shuffledWaiting = [...waitingWords].filter(w => w.id !== targetWord.id).sort(() => Math.random() - 0.5);
    for (const w of shuffledWaiting) {
      if (options.length < 5) {
        optionsSet.add(w.id);
        options.push(w);
      }
    }

    // 5'e tamamlanmadıysa öğrenilmiş / görülmüş kelimelerden tamamla
    if (options.length < 5) {
      const shuffledAll = [...allWords].filter(w => !optionsSet.has(w.id)).sort(() => Math.random() - 0.5);
      for (const w of shuffledAll) {
        if (options.length < 5) {
          optionsSet.add(w.id);
          options.push(w);
        }
      }
    }

    // Yine de en az 3 şık yoksa (kullanıcının çok az kelimesi var) mecburen diğer kelimelerle tamamla
    if (options.length < 3) {
      const shuffledFallback = [...fallbackWords].filter(w => !optionsSet.has(w.id)).sort(() => Math.random() - 0.5);
      for (const w of shuffledFallback) {
        if (options.length < 3) {
          optionsSet.add(w.id);
          options.push(w);
        }
      }
    }

    // Seçenekleri rastgele karıştır
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    // 2.5 Soru havuzu: kelime için yeterli kayıtlı cümle varsa çoğunlukla havuzdan rastgele sor
    const bank = await GeminiService.fetchBank(targetWord.id);
    if (bank.length >= 2 && Math.random() < 0.6) {
      const picked = bank[Math.floor(Math.random() * bank.length)];
      return {
        sentence: picked.sentence,
        sentenceTr: picked.sentenceTr,
        targetWord,
        options: shuffledOptions,
        hint: picked.hint,
        isAiGenerated: true,
      };
    }

    // 3. Kullanıcının kayıtlı Gemini API anahtarı var mı kontrol et
    const apiKey = await dbService.getGeminiApiKey();

    if (apiKey) {
      try {
        const optionWords = shuffledOptions.map(o => o.word).join(', ');
        const prompt = `You are an expert English language tutor. 
The student is learning English and needs to practice the target word "${targetWord.word}" (meaning: ${targetWord.translation}).
The 5 available options on screen are: [${optionWords}].

Task:
1. Create a natural, engaging CEFR ${targetWord.level} English sentence where the target word "${targetWord.word}" fits into a blank marked exactly as [_____].
2. Provide the Turkish translation of that sentence with the blank as [_____].
3. Provide a brief encouraging tip in Turkish explaining why "${targetWord.word}" is the right choice.

Respond ONLY with pure JSON without markdown code fences:
{
  "sentence": "Sentence with [_____]",
  "sentenceTr": "Türkçe çeviri ile [_____]",
  "hint": "Kısa Türkçe açıklama"
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            // Markdown kod bloklarını temizle
            const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.sentence && parsed.sentence.includes('[_____]')) {
              GeminiService.saveToBank(
                targetWord,
                { sentence: parsed.sentence, sentenceTr: parsed.sentenceTr, hint: parsed.hint },
                'gemini'
              );
            }
            return {
              sentence: parsed.sentence,
              sentenceTr: parsed.sentenceTr,
              targetWord,
              options: shuffledOptions,
              hint: parsed.hint,
              isAiGenerated: true,
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API isteği başarısız oldu, yerel cümle motoru devreye giriyor:', err);
      }
    }

    // 4. Gemini anahtarı yoksa veya hata verirse: Güvenilir Akıllı Yerel Boşluk Doldurma
    const regex = new RegExp(`\\b${targetWord.word}\\b`, 'gi');
    let sentence = targetWord.sampleEn;
    if (regex.test(sentence)) {
      sentence = sentence.replace(new RegExp(`\\\\b${targetWord.word}\\\\b`, 'gi'), '[_____]');
      GeminiService.saveToBank(
        targetWord,
        { sentence, sentenceTr: targetWord.sampleTr, hint: `İpucu: "${targetWord.translation}" anlamına gelen kelimeyi bulmalısın.` },
        'local'
      );
    } else {
      sentence = `In daily life, it is important to [_____] when facing great challenges.`;
    }

    return {
      sentence,
      sentenceTr: targetWord.sampleTr,
      targetWord,
      options: shuffledOptions,
      hint: `İpucu: "${targetWord.translation}" anlamına gelen kelimeyi bulmalısın.`,
      isAiGenerated: false,
    };
  }
}
