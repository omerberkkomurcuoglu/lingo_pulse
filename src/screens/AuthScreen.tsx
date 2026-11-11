import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { authService, AuthUser } from '../services/auth';

interface Props {
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthScreen: React.FC<Props> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [displayName, setDisplayName] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    authService.getServerUrl().then(setServerUrl);
  }, []);

  const handleSubmit = async (customUser?: string, customPass?: string) => {
    const u = (customUser ?? username).trim();
    const p = customPass ?? password;
    if (!u || !p) {
      setErrorMsg('Lütfen kullanıcı adı ve şifre girin.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    try {
      if (serverUrl.trim()) {
        await authService.setServerUrl(serverUrl.trim());
      }

      if (mode === 'login' || customUser) {
        const res = await authService.login(u, p);
        if (res.ok && res.user) {
          onAuthenticated(res.user);
        } else {
          setErrorMsg(res.error || 'Giriş yapılamadı.');
        }
      } else {
        const res = await authService.register(u, p, displayName.trim() || u);
        if (res.ok && res.user) {
          onAuthenticated(res.user);
        } else {
          setErrorMsg(res.error || 'Kayıt oluşturulamadı.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={st.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={st.card}>
          {/* Brand Header */}
          <View style={st.brandHeader}>
            <View style={st.logoWrap}>
              <Ionicons name="pulse" size={24} color={C.voltInk} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={st.brandRow}>
                <Text style={st.brandTitle}>LINGO</Text>
                <View style={st.voltPill}>
                  <Text style={st.voltPillText}>PULSE</Text>
                </View>
              </View>
              <Text style={st.brandSub}>AKADEMİK İNGİLİZCE • 15K KELİME & GRAMER</Text>
            </View>
          </View>

          {/* Mode Switcher */}
          <View style={st.modeRow}>
            <TouchableOpacity
              style={[st.modeBtn, mode === 'login' && st.modeBtnActive]}
              onPress={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="log-in-outline"
                size={15}
                color={mode === 'login' ? C.voltInk : C.t2}
              />
              <Text style={[st.modeBtnText, mode === 'login' && st.modeBtnTextActive]}>
                Giriş Yap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[st.modeBtn, mode === 'register' && st.modeBtnActive]}
              onPress={() => {
                setMode('register');
                setUsername('');
                setPassword('');
                setErrorMsg(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-add-outline"
                size={15}
                color={mode === 'register' ? C.voltInk : C.t2}
              />
              <Text style={[st.modeBtnText, mode === 'register' && st.modeBtnTextActive]}>
                Yeni Hesap Oluştur
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMsg && (
            <View style={st.errBanner}>
              <Ionicons name="alert-circle" size={16} color={C.rose} />
              <Text style={st.errText}>{errorMsg}</Text>
            </View>
          )}

          {/* Inputs */}
          {mode === 'register' && (
            <View style={st.fieldGroup}>
              <Text style={st.label}>GÖRÜNEN ADINIZ</Text>
              <View style={st.inputWrap}>
                <Ionicons name="id-card-outline" size={16} color={C.t3} />
                <TextInput
                  style={st.input}
                  placeholder="Örn: Berk"
                  placeholderTextColor={C.t3}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>
            </View>
          )}

          <View style={st.fieldGroup}>
            <Text style={st.label}>KULLANICI ADI</Text>
            <View style={st.inputWrap}>
              <Ionicons name="person-outline" size={16} color={C.t3} />
              <TextInput
                style={st.input}
                placeholder="admin"
                placeholderTextColor={C.t3}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={st.fieldGroup}>
            <Text style={st.label}>ŞİFRE</Text>
            <View style={st.inputWrap}>
              <Ionicons name="lock-closed-outline" size={16} color={C.t3} />
              <TextInput
                style={st.input}
                placeholder="••••••"
                placeholderTextColor={C.t3}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Primary Submit Button */}
          <TouchableOpacity
            style={st.submitBtn}
            onPress={() => handleSubmit()}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator size="small" color={C.voltInk} />
            ) : (
              <>
                <Ionicons
                  name={mode === 'login' ? 'flash' : 'rocket'}
                  size={17}
                  color={C.voltInk}
                />
                <Text style={st.submitBtnText}>
                  {mode === 'login' ? 'Hesaba Giriş Yap' : 'Hesabı Oluştur & Başla'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* 1-Click Quick Admin Card */}
          <View style={st.adminBox}>
            <View style={st.adminHeader}>
              <View style={st.adminBadge}>
                <Ionicons name="shield-checkmark" size={13} color={C.emerald} />
                <Text style={st.adminBadgeText}>HAZIR ADMİN HESABI</Text>
              </View>
              <Text style={st.adminCreds}>admin / admin</Text>
            </View>
            <Text style={st.adminDesc}>
              Gemini API anahtarınız, API sunucu adresiniz ve tüm başarımlarınız{' '}
              <Text style={{ color: C.volt, fontWeight: '800' }}>admin</Text> hesabınıza tanımlanmış
              ve PostgreSQL veritabanına kaydedilmiştir.
            </Text>
            <TouchableOpacity
              style={st.adminQuickBtn}
              onPress={() => {
                setMode('login');
                setUsername('admin');
                setPassword('admin');
                handleSubmit('admin', 'admin');
              }}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Ionicons name="key" size={15} color={C.emerald} />
              <Text style={st.adminQuickBtnText}>Tek Tıkla Admin Hesabına Gir (admin / admin)</Text>
            </TouchableOpacity>
          </View>

          {/* API Server Config Toggle */}
          <TouchableOpacity
            style={st.serverToggle}
            onPress={() => setShowServerConfig(!showServerConfig)}
            activeOpacity={0.75}
          >
            <Ionicons name="server-outline" size={14} color={C.t3} />
            <Text style={st.serverToggleText}>
              API Sunucu Adresi ({serverUrl || 'http://localhost:3001'})
            </Text>
            <Ionicons
              name={showServerConfig ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={C.t3}
            />
          </TouchableOpacity>

          {showServerConfig && (
            <View style={st.serverBox}>
              <Text style={st.label}>DOCKER / POSTGRESQL API SUNUCU ADRESİ</Text>
              <View style={st.inputWrap}>
                <Ionicons name="globe-outline" size={16} color={C.cyan} />
                <TextInput
                  style={st.input}
                  placeholder="http://localhost:3001"
                  placeholderTextColor={C.t3}
                  value={serverUrl}
                  onChangeText={setServerUrl}
                  autoCapitalize="none"
                />
              </View>
              <View style={st.presetRow}>
                <TouchableOpacity
                  style={st.presetChip}
                  onPress={() => setServerUrl('http://localhost:3001')}
                >
                  <Text style={st.presetChipText}>Web: localhost:3001</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={st.presetChip}
                  onPress={() => setServerUrl(process.env.EXPO_PUBLIC_LAN_API_URL || 'http://localhost:3001')}
                >
                  <Text style={st.presetChipText}>Mobil LAN / IP</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: C.borderStrong,
    ...C.shadow.md,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  logoWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: C.volt,
    justifyContent: 'center',
    alignItems: 'center',
    ...C.shadow.glow(C.volt),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandTitle: {
    color: C.t1,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  voltPill: {
    backgroundColor: C.voltSoft,
    borderWidth: 1,
    borderColor: C.voltBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voltPillText: {
    color: C.volt,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  brandSub: {
    color: C.t3,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 3,
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: C.elevated,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  modeBtnActive: {
    backgroundColor: C.volt,
  },
  modeBtnText: {
    color: C.t2,
    fontSize: 12,
    fontWeight: '800',
  },
  modeBtnTextActive: {
    color: C.voltInk,
    fontWeight: '900',
  },
  errBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.roseSoft,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.35)',
    padding: 11,
    borderRadius: 12,
    marginBottom: 14,
  },
  errText: {
    color: C.rose,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    color: C.t3,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: C.input,
    borderRadius: 14,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: C.borderStrong,
  },
  input: {
    flex: 1,
    color: C.t1,
    fontSize: 14,
    paddingVertical: 11,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.volt,
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 4,
    ...C.shadow.glow(C.volt),
  },
  submitBtnText: {
    color: C.voltInk,
    fontSize: 14,
    fontWeight: '900',
  },
  adminBox: {
    marginTop: 18,
    backgroundColor: C.elevated,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 153, 0.30)',
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.emeraldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  adminBadgeText: {
    color: C.emerald,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  adminCreds: {
    color: C.t1,
    fontSize: 11,
    fontWeight: '900',
  },
  adminDesc: {
    color: C.t2,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  adminQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: C.emeraldSoft,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 153, 0.45)',
    paddingVertical: 10,
    borderRadius: 12,
  },
  adminQuickBtnText: {
    color: C.emerald,
    fontSize: 12,
    fontWeight: '900',
  },
  serverToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
  },
  serverToggleText: {
    color: C.t3,
    fontSize: 11,
    fontWeight: '700',
  },
  serverBox: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  presetChip: {
    flex: 1,
    backgroundColor: C.elevated,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderStrong,
  },
  presetChipText: {
    color: C.cyan,
    fontSize: 10,
    fontWeight: '800',
  },
});

