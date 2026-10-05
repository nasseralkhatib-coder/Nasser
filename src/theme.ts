export type ThemeMode = 'logo-brand';

export interface ThemeColors {
  id: ThemeMode;
  name: { en: string; ar: string };
  badgeText: { en: string; ar: string };
  dotColor: string;
  bg: string;
  bgCard: string;
  bgSubtle: string;
  bgHeader: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentHover: string;
  accentBadgeBg: string;
  accentBadgeText: string;
  accentBadgeBorder: string;
  buttonClass: string;
  tagClass: string;
  statNumber: string;
}

export const themeOptions: Record<ThemeMode, ThemeColors> = {
  // Official Kemizone Brand: Clean white bg, dark green (#065f46 / #064e3b emerald-800/900)
  'logo-brand': {
    id: 'logo-brand',
    name: { en: 'Kemizone Dark Green', ar: 'أخضر كميزون الغامق الرسمي' },
    badgeText: { en: 'Dark Green', ar: 'الأخضر الغامق' },
    dotColor: 'bg-emerald-800',
    bg: 'bg-white',
    bgCard: 'bg-white',
    bgSubtle: 'bg-emerald-50/50',
    bgHeader: 'bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm',
    border: 'border-emerald-100',
    borderStrong: 'border-emerald-800',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-800',
    textMuted: 'text-slate-600',
    accentPrimary: 'bg-emerald-800 hover:bg-emerald-900 text-white',
    accentHover: 'hover:text-emerald-900',
    accentBadgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accentBadgeText: 'text-emerald-900',
    accentBadgeBorder: 'border-emerald-300',
    buttonClass: 'bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all duration-200 shadow-sm hover:shadow',
    tagClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    statNumber: 'text-emerald-800',
  },
};
