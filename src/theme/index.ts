export const colors = {
  background: '#0B0B0F',
  surface: '#15151C',
  surfaceElevated: '#1E1E28',
  border: '#2A2A36',
  primary: '#F26B3A',
  primaryPressed: '#D8562B',
  accent: '#FFD166',
  text: '#F5F1EA',
  textMuted: '#9A93A6',
  textSubtle: '#6C6478',
  success: '#3DD68C',
  error: '#FF5A5F',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
} as const;
