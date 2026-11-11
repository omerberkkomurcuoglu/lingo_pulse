import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { C } from '../theme/colors';
import { dbService } from '../services/db';
import { authService } from '../services/auth';

interface ChatRoom {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  participants: number;
}

interface GrammarMistake {
  wrong: string;
  right: string;
  ruleTitle: string;
  explanationTr: string;
}

interface WordBreakdownItem {
  word: string;
  tr: string;
  pos: string;
}

interface InspectionResult {
  originalText: string;
  hasErrors: boolean;
  correctedEn: string;
  naturalAlternativeEn: string;
  translationTr: string;
  mistakes: GrammarMistake[];
  wordBreakdown: WordBreakdownItem[];
  isAi?: boolean;
}

interface ChatMessage {
  id: number | string;
  roomId: string;
  sender: string;
  senderBadge: string;
  originalText: string;
  correctedText: string;
  translationTr: string;
  mistakes: GrammarMistake[];
  createdAt: string;
}

const SAMPLE_TEST_SENTENCES = [
  { label: '💬 "Let\'s talk about travel & hobbies!"', text: "Hello! Let's talk about travel and our favorite hobbies." },
  { label: '🎓 "Can you explain Present Perfect?"', text: "Can you explain when to use Present Perfect Tense with simple examples?" },
  { label: '💼 "Job Interview Practice"', text: "Can we do a short job interview practice? Please ask me the first question." },
  { label: '⚠️ "hello ı are omer"', text: 'hello ı are omer' },
  { label: '⚠️ "i am agree with you"', text: 'i am agree with you' },
  { label: '⚠️ "she dont likes coffee"', text: 'she dont likes coffee' },
];

export const ChatScreen: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    {
      id: 'ai-partner',
      title: '🤖 Lingo AI (Canlı Gemini Konuşma Partneri)',
      subtitle: 'Gemini LLM ile dilediğin konuda sohbet et, soru sor, anında konuş & pratik yap',
      badge: 'CANLI LLM',
      participants: 2,
    },
    {
      id: 'partner-emma',
      title: '🇬🇧 Emma (Londra • C1 Partner)',
      subtitle: 'Günlük diyalog, tanışma ve anında gramer kontrolü',
      badge: 'AKTİF PARTNER',
      participants: 2,
    },
    {
      id: 'global-en',
      title: '🌍 Küresel İngilizce Meydanı',
      subtitle: 'Tüm kullanıcılarla canlı İngilizce mesajlaşma',
      badge: 'CANLI ODA',
      participants: 14,
    },
    {
      id: 'partner-liam',
      title: '🎓 Prof. Liam (Oxford Akademik)',
      subtitle: 'Akademik yazışma ve ileri düzey gramer koçu',
      badge: 'AKADEMİK KOÇ',
      participants: 2,
    },
  ]);
  const [activeRoomId, setActiveRoomId] = useState<string>('ai-partner');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState<boolean>(false);

  const [draft, setDraft] = useState<string>('');
  const [inspecting, setInspecting] = useState<boolean>(false);
  const [inspection, setInspection] = useState<InspectionResult | null>(null);
  const [sending, setSending] = useState<boolean>(false);

  // Hangi mesajların Türkçe çevirisi açık?
  const [openTranslations, setOpenTranslations] = useState<Record<string, boolean>>({
    '101': true,
    '1': true,
  });

  const scrollRef = useRef<any>(null);
  const debounceTimer = useRef<any>(null);
  const currentUsername = authService.user?.username || 'admin';

  const speakEn = (text: string) => {
    try {
      Speech.stop();
      Speech.speak(text, { language: 'en-US', rate: 0.92 });
    } catch {}
  };

  const loadRooms = async () => {
    try {
      const res = await dbService.api('/api/chat/rooms');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms(data.rooms);
        }
      }
    } catch {}
  };

  const loadMessages = async (roomId: string) => {
    setLoadingMsgs(true);
    try {
      const res = await dbService.api(`/api/chat/messages?roomId=${encodeURIComponent(roomId)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch {}
    setLoadingMsgs(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    loadMessages(activeRoomId);
  }, [activeRoomId]);

  // Kullanıcı yazarken otomatik (450ms debounce) veya butona basınca gramer & çeviri denetimi
  const runInspection = async (textToInspect: string) => {
    const clean = textToInspect.trim();
    if (!clean) {
      setInspection(null);
      return;
    }
    setInspecting(true);
    try {
      const res = await dbService.api('/api/chat/inspect', {
        method: 'POST',
        body: JSON.stringify({ text: clean }),
      });
      if (res.ok) {
        const data: InspectionResult = await res.json();
        setInspection(data);
      }
    } catch {}
    setInspecting(false);
  };

  const handleDraftChange = (val: string) => {
    setDraft(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!val.trim()) {
      setInspection(null);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      runInspection(val);
    }, 450);
  };

  const handleSendMessage = async (useCorrected: boolean) => {
    const raw = draft.trim();
    if (!raw || sending) return;

    const finalToSend =
      useCorrected && inspection?.correctedEn ? inspection.correctedEn : raw;

    setSending(true);
    try {
      const res = await dbService.api('/api/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          roomId: activeRoomId,
          text: finalToSend,
          useCorrected,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => {
          const next = [...prev];
          if (data.sentMessage) next.push(data.sentMessage);
          if (data.replyMessage) {
            next.push(data.replyMessage);
            setOpenTranslations(t => ({ ...t, [String(data.replyMessage.id)]: true }));
          }
          return next;
        });
        setDraft('');
        setInspection(null);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
      }
    } catch {}
    setSending(false);
  };

  const toggleTranslation = (msgId: number | string) => {
    const key = String(msgId);
    setOpenTranslations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <KeyboardAvoidingView
      style={st.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ÜST ODA & KULLANICI SEÇİCİ */}
      <View style={st.roomsBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.roomsScroll}
        >
          {rooms.map(room => {
            const active = room.id === activeRoomId;
            return (
              <TouchableOpacity
                key={room.id}
                style={[st.roomChip, active && st.roomChipActive]}
                onPress={() => setActiveRoomId(room.id)}
                activeOpacity={0.8}
              >
                <View style={[st.roomDot, { backgroundColor: active ? '#050507' : C.green }]} />
                <Text style={[st.roomChipTitle, active && st.roomChipTitleActive]}>
                  {room.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* HIZLI TEST CÜMLELERİ BAR (Kullanıcının tek tıkla "hello ı are omer" vb. test etmesi için) */}
      <View style={st.quickSamplesWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.quickSamplesScroll}
        >
          <View style={st.quickLabelPill}>
            <Ionicons name="analytics-outline" size={12} color={C.orange} />
            <Text style={st.quickLabelText}>Örnek & Konuşma Başlatıcılar:</Text>
          </View>
          {SAMPLE_TEST_SENTENCES.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={st.sampleChip}
              onPress={() => {
                setDraft(item.text);
                runInspection(item.text);
              }}
              activeOpacity={0.8}
            >
              <Text style={st.sampleChipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* MESAJ AKIŞI */}
      {loadingMsgs ? (
        <View style={st.centerLoader}>
          <ActivityIndicator size="large" color={C.green} />
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={st.messagesScroll}
          contentContainerStyle={st.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => {
            const isMine = msg.sender.toLowerCase() === currentUsername.toLowerCase();
            const isTrOpen = Boolean(openTranslations[String(msg.id)]);
            const hadMistakes =
              msg.mistakes &&
              msg.mistakes.length > 0 &&
              msg.originalText.trim().toLowerCase() !== msg.correctedText.trim().toLowerCase();

            return (
              <View
                key={String(msg.id)}
                style={[st.msgRow, isMine ? st.msgRowMine : st.msgRowOther]}
              >
                <View style={[st.msgBubble, isMine ? st.msgBubbleMine : st.msgBubbleOther]}>
                  {/* Mesaj Üst Bilgisi */}
                  <View style={st.msgHeaderRow}>
                    <View style={st.senderWrap}>
                      <Text style={[st.senderName, isMine && { color: C.greenLight }]}>
                        {isMine ? 'Sen' : msg.sender}
                      </Text>
                      <View style={st.senderBadgePill}>
                        <Text style={st.senderBadgeText}>{msg.senderBadge}</Text>
                      </View>
                    </View>

                    <View style={st.msgActionsRow}>
                      <TouchableOpacity
                        style={st.msgIconBtn}
                        onPress={() => speakEn(msg.correctedText || msg.originalText)}
                        activeOpacity={0.75}
                      >
                        <Ionicons name="volume-high" size={14} color={C.green} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[st.translateTogglePill, isTrOpen && st.translateTogglePillActive]}
                        onPress={() => toggleTranslation(msg.id)}
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name="language"
                          size={12}
                          color={isTrOpen ? '#050507' : C.cyan}
                        />
                        <Text
                          style={[
                            st.translateToggleText,
                            isTrOpen && { color: '#050507', fontWeight: '800' },
                          ]}
                        >
                          {isTrOpen ? 'Çeviri Açık' : 'Çevir'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Ana Mesaj Metni */}
                  <Text style={st.msgMainText}>{msg.originalText}</Text>

                  {/* Eğer gönderilen mesajda hata varsa doğru halini balon içinde göster */}
                  {hadMistakes && (
                    <View style={st.bubbleCorrectionBox}>
                      <View style={st.bubbleCorrectionHeader}>
                        <Ionicons name="checkmark-done-circle" size={14} color={C.green} />
                        <Text style={st.bubbleCorrectionLabel}>DOĞRU İNGİLİZCE HALİ:</Text>
                      </View>
                      <Text style={st.bubbleCorrectionText}>{msg.correctedText}</Text>
                    </View>
                  )}

                  {/* Karşıdaki veya kendi mesajının Türkçe Çevirisi */}
                  {isTrOpen && msg.translationTr ? (
                    <View style={st.bubbleTranslationBox}>
                      <View style={st.bubbleTranslationHeader}>
                        <Ionicons name="globe-outline" size={12} color={C.cyan} />
                        <Text style={st.bubbleTranslationLabel}>TÜRKÇE ÇEVİRİSİ:</Text>
                      </View>
                      <Text style={st.bubbleTranslationText}>🇹🇷 {msg.translationTr}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}

          {sending && (
            <View style={[st.msgRow, st.msgRowOther]}>
              <View
                style={[
                  st.msgBubble,
                  st.msgBubbleOther,
                  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
                ]}
              >
                <ActivityIndicator size="small" color={C.green} />
                <Text style={{ color: C.t2, fontSize: 13, fontWeight: '600' }}>
                  🤖 Lingo AI düşünüyor ve yanıt yazıyor...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* CANLI GRAMER HATASI, DOĞRU CÜMLE VE KELİME ÇEVİRİ DENETLEYİCİ PANELİ */}
      {(inspecting || inspection) && draft.trim().length > 0 && (
        <View style={st.inspectorPanel}>
          <View style={st.inspectorTopHeader}>
            <View style={st.inspectorBadgeRow}>
              <Ionicons
                name={inspection?.hasErrors ? 'construct' : 'shield-checkmark'}
                size={15}
                color={inspection?.hasErrors ? C.orange : C.green}
              />
              <Text
                style={[
                  st.inspectorTitle,
                  { color: inspection?.hasErrors ? C.orange : C.green },
                ]}
              >
                {inspecting
                  ? 'Cümleniz Gramer & Çeviri Açısından Denetleniyor...'
                  : inspection?.hasErrors
                  ? `Gramer & Yazım Düzeltmesi Bulundu (${inspection.mistakes.length} Ders Notu)`
                  : 'Cümleniz Gramer Açısından Doğru!'}
              </Text>
            </View>

            {inspection?.correctedEn && (
              <TouchableOpacity
                style={st.applyCorrectionChip}
                onPress={() => setDraft(inspection.correctedEn)}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles" size={12} color="#050507" />
                <Text style={st.applyCorrectionChipText}>Metne Uygula</Text>
              </TouchableOpacity>
            )}
          </View>

          {inspection && (
            <ScrollView
              style={st.inspectorScroll}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {/* Doğru İngilizce Cümle + Türkçe Çevirisi */}
              <View style={st.correctedCompareBox}>
                <View style={{ flex: 1 }}>
                  <Text style={st.correctedLabel}>✅ DOĞRU İNGİLİZCE CÜMLE:</Text>
                  <Text style={st.correctedEnText}>{inspection.correctedEn}</Text>
                  <Text style={st.correctedTrText}>🇹🇷 Anlamı: {inspection.translationTr}</Text>
                </View>
                <TouchableOpacity
                  style={st.speakCorrectedBtn}
                  onPress={() => speakEn(inspection.correctedEn)}
                >
                  <Ionicons name="volume-high" size={16} color={C.green} />
                </TouchableOpacity>
              </View>

              {/* Tespit Edilen Gramer Hataları ve Nedenleri */}
              {inspection.mistakes && inspection.mistakes.length > 0 && (
                <View style={st.mistakesList}>
                  {inspection.mistakes.map((m, idx) => (
                    <View key={idx} style={st.mistakeCard}>
                      <View style={st.mistakeDiffRow}>
                        <View style={st.wrongPill}>
                          <Text style={st.wrongPillText}>❌ {m.wrong}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={13} color={C.t2} />
                        <View style={st.rightPill}>
                          <Text style={st.rightPillText}>✅ {m.right}</Text>
                        </View>
                        <Text style={st.mistakeRuleTitle}>{m.ruleTitle}</Text>
                      </View>
                      <Text style={st.mistakeExplanation}>{m.explanationTr}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Kelime Kelime Çeviri Kontrolü */}
              {inspection.wordBreakdown && inspection.wordBreakdown.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={st.wordBreakdownRow}
                >
                  {inspection.wordBreakdown.map((wb, i) => (
                    <View key={i} style={st.wordChip}>
                      <Text style={st.wordChipEn}>{wb.word}</Text>
                      <Text style={st.wordChipTr}>{wb.tr}</Text>
                      <Text style={st.wordChipPos}>{wb.pos}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* ALT MESAJ YAZMA VE GÖNDERME BARI */}
      <View style={st.composerBar}>
        <View style={st.inputRow}>
          <TextInput
            style={st.textInput}
            placeholder='İngilizce veya Türkçe yazın (Örn: "hello ı are omer")...'
            placeholderTextColor={C.t3}
            value={draft}
            onChangeText={handleDraftChange}
            multiline
          />

          <TouchableOpacity
            style={st.inspectBtn}
            onPress={() => runInspection(draft)}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={16} color={C.cyan} />
          </TouchableOpacity>
        </View>

        <View style={st.sendButtonsRow}>
          {inspection && inspection.hasErrors && inspection.correctedEn ? (
            <>
              <TouchableOpacity
                style={st.sendCorrectedBtn}
                onPress={() => handleSendMessage(true)}
                disabled={sending}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done" size={16} color="#050507" />
                <Text style={st.sendCorrectedBtnText} numberOfLines={1}>
                  Doğrusunu Gönder (“{inspection.correctedEn}”)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={st.sendRawBtn}
                onPress={() => handleSendMessage(false)}
                disabled={sending}
                activeOpacity={0.8}
              >
                <Text style={st.sendRawBtnText}>Olduğu Gibi</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[st.sendCorrectedBtn, !draft.trim() && { opacity: 0.45 }]}
              onPress={() => handleSendMessage(false)}
              disabled={!draft.trim() || sending}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={15} color="#050507" />
              <Text style={st.sendCorrectedBtnText}>Mesajı Gönder & Çevir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  roomsBar: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  roomsScroll: { gap: 8 },
  roomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.card,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
  },
  roomChipActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  roomDot: { width: 7, height: 7, borderRadius: 4 },
  roomChipTitle: { color: C.t1, fontSize: 12, fontWeight: '700' },
  roomChipTitleActive: { color: '#050507', fontWeight: '800' },

  quickSamplesWrap: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  quickSamplesScroll: { alignItems: 'center', gap: 7 },
  quickLabelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 4,
  },
  quickLabelText: { color: C.orange, fontSize: 11, fontWeight: '800' },
  sampleChip: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 133, 72, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sampleChipText: { color: '#E4E4E7', fontSize: 11, fontWeight: '600' },

  messagesScroll: { flex: 1 },
  messagesContent: { padding: 14, gap: 12, paddingBottom: 20 },

  msgRow: { flexDirection: 'row', width: '100%' },
  msgRowMine: { justifyContent: 'flex-end' },
  msgRowOther: { justifyContent: 'flex-start' },

  msgBubble: {
    maxWidth: '88%',
    borderRadius: 20,
    padding: 13,
    borderWidth: 1,
  },
  msgBubbleMine: {
    backgroundColor: '#17291E',
    borderColor: 'rgba(29, 185, 84, 0.35)',
    borderBottomRightRadius: 6,
  },
  msgBubbleOther: {
    backgroundColor: C.card,
    borderColor: C.border,
    borderBottomLeftRadius: 6,
  },

  msgHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  senderWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  senderName: { color: C.w, fontSize: 12, fontWeight: '800' },
  senderBadgePill: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  senderBadgeText: { color: C.t2, fontSize: 9.5, fontWeight: '700' },

  msgActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  msgIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(29, 185, 84, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  translateTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  translateTogglePillActive: {
    backgroundColor: C.cyan,
    borderColor: C.cyan,
  },
  translateToggleText: { color: C.cyan, fontSize: 10, fontWeight: '700' },

  msgMainText: { color: C.w, fontSize: 14, lineHeight: 20, fontWeight: '500' },

  bubbleCorrectionBox: {
    marginTop: 8,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.35)',
  },
  bubbleCorrectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bubbleCorrectionLabel: { color: C.greenLight, fontSize: 9.5, fontWeight: '800' },
  bubbleCorrectionText: { color: C.w, fontSize: 13, fontWeight: '700', marginTop: 2 },

  bubbleTranslationBox: {
    marginTop: 8,
    backgroundColor: 'rgba(20, 20, 24, 0.75)',
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  bubbleTranslationHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bubbleTranslationLabel: { color: C.cyan, fontSize: 9.5, fontWeight: '800' },
  bubbleTranslationText: { color: '#E4E4E7', fontSize: 12.5, marginTop: 2, lineHeight: 18 },

  // Canlı Gramer & Çeviri Denetleyici Panel
  inspectorPanel: {
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.greenBorder,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    maxHeight: 235,
  },
  inspectorTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inspectorBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  inspectorTitle: { fontSize: 12, fontWeight: '800' },
  applyCorrectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  applyCorrectionChipText: { color: '#050507', fontSize: 11, fontWeight: '800' },

  inspectorScroll: { flexGrow: 0 },
  correctedCompareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.35)',
    marginBottom: 8,
  },
  correctedLabel: { color: C.greenLight, fontSize: 10, fontWeight: '800' },
  correctedEnText: { color: C.w, fontSize: 15, fontWeight: '800', marginTop: 2 },
  correctedTrText: { color: C.cyan, fontSize: 12, fontWeight: '600', marginTop: 3 },
  speakCorrectedBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(29, 185, 84, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  mistakesList: { gap: 6, marginBottom: 8 },
  mistakeCard: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 133, 72, 0.35)',
  },
  mistakeDiffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  wrongPill: {
    backgroundColor: 'rgba(255, 75, 114, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  wrongPillText: { color: C.coral, fontSize: 11, fontWeight: '800' },
  rightPill: {
    backgroundColor: 'rgba(29, 185, 84, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rightPillText: { color: C.greenLight, fontSize: 11, fontWeight: '800' },
  mistakeRuleTitle: { color: C.orange, fontSize: 11, fontWeight: '800' },
  mistakeExplanation: { color: '#D4D4D8', fontSize: 11.5, lineHeight: 16 },

  wordBreakdownRow: { gap: 6, paddingBottom: 4 },
  wordChip: {
    backgroundColor: C.card,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  wordChipEn: { color: C.w, fontSize: 11.5, fontWeight: '800' },
  wordChipTr: { color: C.greenLight, fontSize: 10.5, fontWeight: '700', marginTop: 1 },
  wordChipPos: { color: C.t3, fontSize: 9, marginTop: 1 },

  // Alt Yazma Alanı
  composerBar: {
    backgroundColor: C.surface,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 9,
    color: C.w,
    fontSize: 13.5,
    maxHeight: 76,
    borderWidth: 1,
    borderColor: C.border,
  },
  inspectBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendCorrectedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: C.green,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 13,
  },
  sendCorrectedBtnText: {
    color: '#050507',
    fontSize: 12.5,
    fontWeight: '800',
  },
  sendRawBtn: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 13,
  },
  sendRawBtnText: {
    color: C.t2,
    fontSize: 11.5,
    fontWeight: '700',
  },
});

