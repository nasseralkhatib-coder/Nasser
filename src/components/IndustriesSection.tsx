import React from 'react';
import { 
  Paintbrush, 
  Building2, 
  Sparkles, 
  Droplets, 
  Flame, 
  Boxes, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Language } from '../types';
import { siteContent } from '../data/translations';
import { industriesData } from '../data/products';

interface IndustriesSectionProps {
  lang: Language;
  onConsultIndustry: (industryTitle: string) => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({
  lang,
  onConsultIndustry,
}) => {
  const content = siteContent[lang];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const iconMap: Record<string, React.ReactNode> = {
    Paintbrush: <Paintbrush className="w-6 h-6 text-cyan-400" />,
    Building2: <Building2 className="w-6 h-6 text-amber-400" />,
    Sparkles: <Sparkles className="w-6 h-6 text-emerald-400" />,
    Droplets: <Droplets className="w-6 h-6 text-sky-400" />,
    Flame: <Flame className="w-6 h-6 text-rose-400" />,
    Boxes: <Boxes className="w-6 h-6 text-purple-400" />,
  };

  return (
    <section id="industries" className="py-20 bg-slate-900 relative border-t border-slate-800 overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.industries.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.industries.heading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {content.industries.subheading}
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industriesData.map((ind) => {
            return (
              <div
                key={ind.id}
                id={`industry-${ind.id}`}
                className="bg-slate-950/70 hover:bg-slate-950 rounded-2xl border border-slate-800/90 hover:border-teal-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl group"
              >
                <div>
                  {/* Icon & Accent Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {iconMap[ind.iconName] || <Boxes className="w-6 h-6 text-teal-400" />}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {ind.id.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                    {ind.title[lang]}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {ind.description[lang]}
                  </p>

                  {/* Key Chemicals Tag List */}
                  <div className="pt-4 border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-teal-400 block mb-2">
                      {content.industries.keySupplied}
                    </span>
                    <ul className="space-y-1.5">
                      {ind.keyChemicals[lang].map((chem, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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

      </div>
    </section>
  );
};
