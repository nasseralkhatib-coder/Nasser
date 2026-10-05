import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Award, 
  CheckCircle2, 
  Truck, 
  Microscope, 
  Building2, 
  Handshake 
} from 'lucide-react';
import { Language } from '../types';
import { siteContent } from '../data/translations';

interface AboutSectionProps {
  lang: Language;
  onRequestQuote: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  lang,
  onRequestQuote,
}) => {
  const content = siteContent[lang];

  return (
    <section id="about" className="py-20 bg-slate-900 relative overflow-hidden border-t border-slate-800">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.about.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.about.heading}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full" />
        </div>

        {/* Narrative & Milestone Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
              {content.about.paragraph1}
            </p>
            <p>
              {content.about.paragraph2}
            </p>

            {/* Quality Seals */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm font-medium">
                <Award className="w-5 h-5 text-teal-400 shrink-0" />
                <span>ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>SASO Certified</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm font-medium">
                <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>HAZMAT Compliant</span>
              </div>
            </div>
          </div>

          {/* Interactive Vision & Mission Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-teal-500/20 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0 text-teal-400">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {content.about.visionTitle}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {content.about.visionText}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-emerald-500/20 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {content.about.missionTitle}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {content.about.missionText}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4 Core Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.about.values.map((val, idx) => {
            const icons = [Award, Truck, ShieldCheck, Handshake];
            const CurrentIcon = icons[idx % icons.length];

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {val.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
