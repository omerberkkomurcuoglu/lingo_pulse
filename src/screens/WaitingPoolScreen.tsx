import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, FlatList,
  Image, ActivityIndicator, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { WordItem } from '../data/words';
import { dbService } from '../services/db';
import { TtsService } from '../services/tts';

interface Props {
  onRefreshStats: () => void;
  onStartQuiz: () => void;
  onNavigateToLearn: () => void;
}

type PoolTab = 'waiting' | 'mastered' | 'known';

export const WaitingPoolScreen: React.FC<Props> = ({ onRefreshStats, onStartQuiz, onNavigateToLearn }) => {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [tab, setTab] = useState<PoolTab>('waiting');

  const load = async (t: PoolTab = tab) => {
    setLoading(true);
    setExpandedId(null);
    const data = await dbService.getWordsByStatus(t);
    setWords(data);
    setLoading(false);
  };

  useEffect(() => { load(tab); }, [tab]);

  const approve = async (w: WordItem) => {
    setWords(p => p.filter(x => x.id !== w.id));
    dbService.updateWordStatus(w.id, 'mastered').then(() => onRefreshStats()).catch(() => {});
  };
  const undo = async (w: WordItem) => {
    setWords(p => p.filter(x => x.id !== w.id));
    dbService.updateWordStatus(w.id, 'unseen').then(() => onRefreshStats()).catch(() => {});
  };

  if (loading) return <View style={st.center}><ActivityIndicator size="large" color={C.volt} /></View>;

  return (
    <View style={st.root}>
      {/* Neo-Bento Hero Header */}
      <View style={st.bentoHeader}>
        <View style={st.headerInfo}>
          <View style={st.tagPill}>
            <Ionicons name="layers" size={11} color={C.amber} />
            <Text style={st.tagText}>ÖĞRENME HAVUZU</Text>
          </View>
          <Text style={st.title}>Kelimelerim</Text>
          <Text style={st.subtitle}>{words.length} kelime • {tab === 'waiting' ? 'öğrenilecek' : tab === 'mastered' ? 'öğrenilen' : 'zaten bildiğin'}</Text>
        </View>
        {tab === 'waiting' && words.length >= 1 && (
          <TouchableOpacity style={st.quizCta} onPress={onStartQuiz} activeOpacity={0.85}>
            <Ionicons name="game-controller" size={16} color={C.voltInk} />
            <Text style={st.quizCtaText}>Arenaya Gir</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={st.tabsRow}>
        {([['waiting', 'Öğrenilecek', 'layers'], ['mastered', 'Öğrenilen', 'checkmark-done'], ['known', 'Biliyorum', 'flash']] as const).map(([k, label, icon]) => (
          <TouchableOpacity key={k} style={[st.tabBtn, tab === k && st.tabBtnActive]} onPress={() => setTab(k)} activeOpacity={0.85}>
            <Ionicons name={icon as any} size={14} color={tab === k ? C.voltInk : C.t2} />
            <Text style={[st.tabText, tab === k && st.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {words.length === 0 ? (
        <View style={st.empty}>
          <View style={st.emptyIconWrap}>
            <Ionicons name="layers-outline" size={44} color={C.volt} />
          </View>
          <Text style={st.emptyTitle}>{tab === 'waiting' ? 'Havuz Şu An Boş' : 'Henüz Kelime Yok'}</Text>
          <Text style={st.emptySub}>Keşfet ekranında öğrenmek istediğin kelimelerde "Öğren" butonuna dokunarak buraya ekleyebilirsin.</Text>
          <TouchableOpacity style={st.emptyCta} onPress={onNavigateToLearn} activeOpacity={0.85}>
            <Ionicons name="flash" size={16} color={C.voltInk} />
            <Text style={st.emptyCtaText}>Kelime Keşfetmeye Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={words}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={{ padding: 14, paddingBottom: 40, gap: 10 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS !== 'web'}
          renderItem={({ item }) => {
            const open = expandedId === item.id;
            const lc = C.lvl[item.level] || C.volt;

            return (
              <View style={[st.wordCard, open && st.wordCardOpen]}>
                <TouchableOpacity style={st.row} onPress={() => setExpandedId(open ? null : item.id)} activeOpacity={0.75}>
                  <Image source={{ uri: item.imageUrl }} style={st.thumb} />
                  <View style={{ flex: 1 }}>
                    <View style={st.wordTitleRow}>
                      <Text style={st.wordName}>{item.word}</Text>
                      <View style={[st.lvlMiniBadge, { borderColor: `${lc}55`, backgroundColor: `${lc}18` }]}>
                        <Text style={[st.lvlMiniText, { color: lc }]}>{item.level}</Text>
                      </View>
                    </View>
                    <Text style={st.wordTr} numberOfLines={1}>{item.translation}</Text>
                  </View>
                  <TouchableOpacity style={st.miniSpeak} onPress={() => TtsService.speak(item.word)}>
                    <Ionicons name="volume-high" size={16} color={C.volt} />
                  </TouchableOpacity>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={C.t3} />
                </TouchableOpacity>

                {open && (
                  <View style={st.expanded}>
                    <View style={st.sep} />
                    {item.mnemonicHint ? (
                      <View style={st.mnRow}>
                        <Ionicons name="bulb" size={14} color={C.amber} />
                        <Text style={st.mnText}>{item.mnemonicHint}</Text>
                      </View>
                    ) : null}
                    {item.sampleEn ? (
                      <View style={st.exCard}>
                        <Text style={st.exEn}>"{item.sampleEn}"</Text>
                        <Text style={st.exTr}>{item.sampleTr}</Text>
                      </View>
                    ) : null}
                    <View style={st.cardActions}>
                      <TouchableOpacity style={st.undoBtn} onPress={() => undo(item)}>
                        <Ionicons name="arrow-undo" size={14} color={C.t2} />
                        <Text style={st.undoText}>{tab === 'waiting' ? 'Desteye Döndür' : 'Listeden Çıkar'}</Text>
                      </TouchableOpacity>
                      {tab !== 'mastered' && (
                        <TouchableOpacity style={st.approveBtn} onPress={() => approve(item)}>
                          <Ionicons name="checkmark-circle" size={16} color={C.voltInk} />
                          <Text style={st.approveText}>Ustalaştım (+25 XP)</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' },

  bentoHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 14, marginTop: 12, marginBottom: 4,
    padding: 16, borderRadius: 22,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.borderStrong,
  },
  headerInfo: { flex: 1, paddingRight: 10 },
  tagPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    backgroundColor: C.amberSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7, marginBottom: 6,
  },
  tagText: { color: C.amber, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  title: { color: C.t1, fontSize: 20, fontWeight: '900' },
  subtitle: { color: C.t2, fontSize: 12, marginTop: 2, fontWeight: '500' },
  quizCta: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#E06D53', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15,
  },
  quizCtaText: { color: '#141413', fontSize: 13, fontWeight: '900' },

  tabsRow: { flexDirection: 'row', gap: 8, marginHorizontal: 14, marginTop: 8, marginBottom: 2 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14, backgroundColor: '#1C1B1A', borderWidth: 1, borderColor: '#2C2B29' },
  tabBtnActive: { backgroundColor: '#F4F1EA', borderColor: '#F4F1EA' },
  tabText: { color: '#8A857E', fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: '#141413', fontWeight: '900' },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIconWrap: {
    width: 84, height: 84, borderRadius: 26,
    backgroundColor: 'rgba(104, 166, 145, 0.15)', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(78, 135, 116, 0.30)',
  },
  emptyTitle: { color: '#F4F1EA', fontSize: 23, fontWeight: '900', marginBottom: 8 },
  emptySub: { color: '#9E9A93', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 290 },
  emptyCta: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E06D53', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16,
  },
  emptyCtaText: { color: '#141413', fontSize: 14, fontWeight: '900' },

  wordCard: {
    backgroundColor: C.card, borderRadius: 18, borderWidth: 1.5, borderColor: C.borderStrong, overflow: 'hidden',
  },
  wordCardOpen: { borderColor: C.voltBorder },
  row: { flexDirection: 'row', alignItems: 'center', padding: 13, gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.elevated },
  wordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordName: { color: C.t1, fontSize: 17, fontWeight: '900' },
  lvlMiniBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  lvlMiniText: { fontSize: 9, fontWeight: '900' },
  wordTr: { color: C.t2, fontSize: 13, marginTop: 2, fontWeight: '600' },
  miniSpeak: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: C.voltSoft, borderWidth: 1, borderColor: C.voltBorder,
    justifyContent: 'center', alignItems: 'center',
  },

  expanded: { paddingHorizontal: 14, paddingBottom: 14 },
  sep: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  mnRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.amberSoft, padding: 11, borderRadius: 12, marginBottom: 10,
  },
  mnText: { flex: 1, color: C.amber, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  exCard: { backgroundColor: C.elevated, borderRadius: 12, padding: 12, marginBottom: 12 },
  exEn: { color: C.t1, fontSize: 13, fontWeight: '600', marginBottom: 4 },
  exTr: { color: C.t2, fontSize: 12, fontStyle: 'italic' },

  cardActions: { flexDirection: 'row', gap: 10 },
  undoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 11, paddingHorizontal: 14, borderRadius: 13,
    backgroundColor: C.elevated, borderWidth: 1, borderColor: C.borderStrong,
  },
  undoText: { color: C.t2, fontSize: 12, fontWeight: '700' },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 11, borderRadius: 13, backgroundColor: C.emerald,
  },
  approveText: { color: C.voltInk, fontSize: 13, fontWeight: '900' },
});
