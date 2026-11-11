import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export class TtsService {
  static async speak(text: string) {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Web Speech API fallback for maximum compatibility
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        return;
      }

      // iOS & Android native Speech
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.85,
      });
    } catch (e) {
      console.warn('TTS Hatası:', e);
    }
  }

  static async stop() {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      } else {
        await Speech.stop();
      }
    } catch {}
  }
}
