import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Warehouse,
  ShieldCheck
} from 'lucide-react';
import { Language, PageId, BranchOffice } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { branchOffices } from '../data/products';

interface BranchesPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const BranchesPage: React.FC<BranchesPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Warehouse className="w-4 h-4 text-emerald-600" />
          <span>{content.branches.sectionBadge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {content.branches.heading}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          {content.branches.subheading}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {branchOffices.map((b) => (
            <div 
              key={b.id}
              className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {b.city[lang]}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {b.title[lang]}
                      </span>
                    </div>
                  </div>

                  {b.isHQ && (
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                      {content.branches.hqBadge}
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">{content.branches.addressLabel}</span>
                      <span>{b.address[lang]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">{content.branches.hoursLabel}</span>
                      <span>{b.workingHours[lang]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'طلب توريد وتواصل مع إدارة الفرع' : 'Request Supply & Contact Branch'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
