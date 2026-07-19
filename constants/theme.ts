import { Platform } from 'react-native';

// Binance Brand Colors
const primaryYellow = '#FCD535';
const primaryYellowActive = '#F0B90B';
const primaryYellowDisabled = '#3A3A1F';
const inkBlack = '#181A20';
const bodyGrayDark = '#EAECEF';
const mutedGray = '#707A8A';
const mutedGrayStrong = '#929AA5';
const borderLight = '#EAECEF';
const borderDark = '#2B3139';
const canvasLight = '#FFFFFF';
const canvasDark = '#0B0E11';
const cardDark = '#1E2329';
const cardElevatedDark = '#2B3139';
const softLight = '#FAFAFA';
const strongLight = '#F5F5F5';
const tradingUpGreen = '#0ECB81';
const tradingDownRed = '#F6465D';

export const Colors = {
  light: {
    text: inkBlack,
    background: canvasLight,
    card: canvasLight,
    border: borderLight,
    tint: primaryYellowActive,
    icon: mutedGray,
    tabIconDefault: mutedGray,
    tabIconSelected: primaryYellowActive,
    success: tradingUpGreen,
    warning: primaryYellowActive,
    danger: tradingDownRed,
    
    // Custom Binance specific tokens accessible via theme hook
    primary: primaryYellow,
    primaryActive: primaryYellowActive,
    primaryDisabled: primaryYellowDisabled,
    onPrimary: inkBlack,
    ink: inkBlack,
    body: inkBlack,
    muted: mutedGray,
    mutedStrong: mutedGrayStrong,
    hairline: borderLight,
    surfaceElevated: strongLight,
    surfaceSoft: softLight,
    onDark: '#FFFFFF',
    tradingUp: tradingUpGreen,
    tradingDown: tradingDownRed,
  },
  dark: {
    text: bodyGrayDark,
    background: canvasDark,
    card: cardDark,
    border: borderDark,
    tint: primaryYellow,
    icon: mutedGray,
    tabIconDefault: mutedGray,
    tabIconSelected: primaryYellow,
    success: tradingUpGreen,
    warning: primaryYellowActive,
    danger: tradingDownRed,

    // Custom Binance specific tokens accessible via theme hook
    primary: primaryYellow,
    primaryActive: primaryYellowActive,
    primaryDisabled: primaryYellowDisabled,
    onPrimary: inkBlack,
    ink: inkBlack,
    body: bodyGrayDark,
    muted: mutedGray,
    mutedStrong: mutedGrayStrong,
    hairline: borderDark,
    surfaceElevated: cardElevatedDark,
    surfaceSoft: cardDark,
    onDark: '#FFFFFF',
    tradingUp: tradingUpGreen,
    tradingDown: tradingDownRed,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Courier New',
  },
  android: {
    sans: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'sans-serif',
    mono: 'monospace',
  },
});

export const Rounded = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  pill: 9999,
  full: 9999,
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 80,
};

export const Typography = {
  heroDisplay: {
    fontFamily: Fonts.sans,
    fontSize: 64,
    fontWeight: '700' as const,
    lineHeight: 70,
    letterSpacing: -1,
  },
  displayLg: {
    fontFamily: Fonts.sans,
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  displayMd: {
    fontFamily: Fonts.sans,
    fontSize: 40,
    fontWeight: '600' as const,
    lineHeight: 46,
    letterSpacing: -0.3,
  },
  displaySm: {
    fontFamily: Fonts.sans,
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 38,
    letterSpacing: 0,
  },
  titleLg: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 31,
    letterSpacing: 0,
  },
  titleMd: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 27,
    letterSpacing: 0,
  },
  titleSm: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  numberDisplay: {
    fontFamily: Fonts.mono,
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.3,
  },
  numberMd: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  numberSm: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 19,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 17,
    letterSpacing: 0,
  },
  button: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 0,
  },
  navLink: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
};
