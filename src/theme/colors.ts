export const C = {
  // LingoPulse — Warm Carbon & Editorial Matte Katmanları
  bg: '#0D0D0C',
  surface: '#141413',
  card: '#1C1B1A',
  cardAlt: '#1F1E1C',
  elevated: '#252321',
  input: '#181716',

  // İnce Mat Çerçeveler
  border: '#2C2B29',
  borderSubtle: '#262523',
  borderStrong: '#363432',
  borderActive: 'rgba(224, 109, 83, 0.45)',
  glass: 'rgba(20, 20, 19, 0.90)',
  glassStrong: 'rgba(28, 27, 26, 0.96)',

  // Pulse Terra Cotta / Coral — Ana Vurgu
  terra: '#E06D53',
  terraHover: '#E87A61',
  terraSoft: 'rgba(224, 109, 83, 0.15)',
  terraBorder: 'rgba(224, 109, 83, 0.30)',
  coral: '#E06D53',
  coralSoft: 'rgba(224, 109, 83, 0.15)',
  coralBorder: 'rgba(224, 109, 83, 0.30)',
  rose: '#E06D53',
  roseSoft: 'rgba(224, 109, 83, 0.15)',

  // Warm Ochre / Amber Gold — İkincil Vurgu
  gold: '#D4A359',
  goldSoft: 'rgba(212, 163, 89, 0.15)',
  goldBorder: 'rgba(212, 163, 89, 0.30)',
  orange: '#D4A359',
  orangeSoft: 'rgba(212, 163, 89, 0.15)',
  amber: '#D4A359',
  amberSoft: 'rgba(212, 163, 89, 0.15)',

  // Editorial Sage Green — Başarı & Tamamlanma Vurgusu
  sage: '#68A691',
  sageDark: '#4E8774',
  sageSoft: 'rgba(104, 166, 145, 0.15)',
  sageBorder: 'rgba(78, 135, 116, 0.30)',
  sageText: '#88C2AE',
  green: '#68A691',
  greenLight: '#88C2AE',
  greenSoft: 'rgba(104, 166, 145, 0.15)',
  greenBorder: 'rgba(78, 135, 116, 0.30)',
  volt: '#68A691',
  voltDark: '#4E8774',
  voltSoft: 'rgba(104, 166, 145, 0.15)',
  voltBorder: 'rgba(78, 135, 116, 0.30)',
  voltInk: '#141413',
  emerald: '#68A691',
  emeraldSoft: 'rgba(104, 166, 145, 0.15)',

  // Muted Slate Teal & Warm Clay
  teal: '#7A9A95',
  tealSoft: 'rgba(122, 154, 149, 0.15)',
  clay: '#B89278',
  claySoft: 'rgba(184, 146, 120, 0.15)',

  // Pulse Purple & Sky Cyan (Vurgu)
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  purpleSoft: 'rgba(139, 92, 246, 0.15)',
  purpleGlow: 'rgba(139, 92, 246, 0.35)',

  brand: '#E06D53',
  brandDark: '#C9553C',
  brandSoft: 'rgba(224, 109, 83, 0.15)',
  brandGlow: 'rgba(224, 109, 83, 0.40)',
  brandMuted: 'rgba(224, 109, 83, 0.10)',

  cyan: '#7A9A95',
  cyanSoft: 'rgba(122, 154, 149, 0.14)',

  // Tipografi — Sıcak Krem & Mat Kömür Skalası
  w: '#F4F1EA',
  t1: '#F4F1EA',
  t2: '#D5D0C8',
  t3: '#9E9A93',
  t4: '#8A857E',
  t5: '#6E6A64',

  // CEFR Seviye Renkleri (Editoryal Mat Palet)
  lvl: {
    A1: '#68A691', // Sage Green
    A2: '#D4A359', // Warm Ochre
    B1: '#E06D53', // Terra Cotta
    B2: '#7A9A95', // Muted Slate Teal
    C1: '#B89278', // Warm Clay
    C2: '#D4A359', // Grandmaster Gold
  } as Record<string, string>,

  gradient: {
    dark: ['rgba(13, 13, 12, 0.25)', 'rgba(28, 27, 26, 0.35)', '#1C1B1A'] as string[],
    brand: ['#E06D53', '#C9553C'] as string[],
    pulse: ['#E06D53', '#D4A359'] as string[],
    purple: ['#8B5CF6', '#7C3AED'] as string[],
    emerald: ['#68A691', '#4E8774'] as string[],
  },

  shadow: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 20 },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 10,
    }),
  },
};
