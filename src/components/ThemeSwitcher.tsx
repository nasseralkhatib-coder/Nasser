import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface ThemeSwitcherProps {
  currentTheme?: string;
  onSelectTheme?: (theme: any) => void;
  lang: Language;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ lang }) => {
  return (
    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 inline-block ring-2 ring-emerald-400" />
      <span>{lang === 'ar' ? 'الأخضر الداكن المعتمد' : 'Official Dark Green'}</span>
    </div>
  );
};
