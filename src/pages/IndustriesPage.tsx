import React from 'react';
import { 
  Building2, 
  Paintbrush, 
  Sparkles, 
  Droplets, 
  Flame, 
  Boxes, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Users,
  Phone
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { industriesData } from '../data/products';

interface IndustriesPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const getIndustryIcon = (id: string) => {
    switch (id) {
      case 'paints-coatings': return Paintbrush;
      case 'construction-infrastructure': return Building2;
      case 'detergents-hygiene': return Sparkles;
      case 'water-environment': return Droplets;
      case 'oil-gas-petrochem': return Flame;
      case 'plastics-polymers': return Boxes;
      default: return Building2;
    }
  };

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          <Building2 className="w-4 h-4 text-emerald-800" />
          <span>{content.industries.sectionBadge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {content.industries.heading}
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          {content.industries.subheading}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Industries Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {industriesData.map((ind) => {
            const IconComponent = getIndustryIcon(ind.id);

            return (
              <div 
                key={ind.id}
                className="rounded-3xl bg-white border border-emerald-100 p-8 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-6">
                    <IconComponent className="w-7 h-7 text-emerald-800" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {ind.title[lang]}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    {ind.description[lang]}
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <span className="text-xs font-bold text-emerald-950 block mb-2">
                      {content.industries.keySupplied}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {ind.keyChemicals[lang].map((chem, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{chem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* In-Person Meeting Technical Consultation Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {lang === 'ar' ? 'هل تمتلك مصنعاً أو خط إنتاج جديد؟' : 'Starting a New Chemical Formulation or Plant?'}
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'فريق المهندسين والكيميائيين المتخصصين في شركة كيميزون مستعد للاجتماع المباشر بمقر مصنعكم لمراجعة متطلبات المواد الخام واقتراح أنسب الحلول.'
                : 'Our technical chemical consultants are ready to meet directly at your manufacturing plant to discuss bespoke raw material supply.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تنسيق زيارة ميدانية واجتماع' : 'Schedule On-Site Meeting'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
