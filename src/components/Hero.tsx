import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  FlaskConical, 
  Play, 
  Boxes, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { Language } from '../types';
import { siteContent } from '../data/translations';

interface HeroProps {
  lang: Language;
  onExploreProducts: () => void;
  onRequestQuote: () => void;
  onPlayVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExploreProducts,
  onRequestQuote,
  onPlayVideo,
}) => {
  const content = siteContent[lang];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-slate-950"
    >
      {/* Dynamic Background Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial ambient glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />

        {/* Subtle Chemical Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Decorative Hexagonal Molecular Ring */}
        <svg className="absolute top-20 right-10 w-96 h-96 opacity-15 text-teal-400 hidden lg:block" viewBox="0 0 200 200" fill="none" stroke="currentColor">
          <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" strokeWidth="1.5" strokeDasharray="6,6" />
          <circle cx="100" cy="10" r="6" fill="currentColor" />
          <circle cx="180" cy="55" r="6" fill="currentColor" />
          <circle cx="180" cy="145" r="6" fill="currentColor" />
          <circle cx="100" cy="190" r="6" fill="currentColor" />
          <circle cx="20" cy="145" r="6" fill="currentColor" />
          <circle cx="20" cy="55" r="6" fill="currentColor" />
          <path d="M100,60 L140,85 L140,135 L100,160 L60,135 L60,85 Z" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Heritage Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-semibold shadow-inner mb-6 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>{content.hero.badge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2] max-w-5xl mx-auto mb-6">
          <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
            {content.hero.titleHighlight}
          </span>{' '}
          <span>{content.hero.titleRest}</span>
        </h1>

        {/* Sub-headline / Corporate Bio */}
        <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          {content.hero.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16">
          <button
            id="hero-explore-products-btn"
            onClick={onExploreProducts}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>{content.hero.ctaPrimary}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>

          <button
            id="hero-request-quote-btn"
            onClick={onRequestQuote}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold text-base shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Boxes className="w-5 h-5 text-teal-400" />
            <span>{content.hero.ctaSecondary}</span>
          </button>

          <button
            id="hero-play-video-btn"
            onClick={onPlayVideo}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white font-medium text-base transition-all cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <span>{lang === 'ar' ? 'فيديو تعريفي' : 'Corporate Video'}</span>
          </button>
        </div>

        {/* Industrial Highlights Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto pt-6 border-t border-slate-800/70">
          
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-4xl font-extrabold text-teal-400 mb-1" dir="ltr">
              {content.hero.stat1Number}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {content.hero.stat1Label}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 mb-1" dir="ltr">
              {content.hero.stat2Number}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {content.hero.stat2Label}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400 mb-1" dir="ltr">
              {content.hero.stat3Number}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {content.hero.stat3Label}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-4xl font-extrabold text-teal-300 mb-1" dir="ltr">
              {content.hero.stat4Number}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {content.hero.stat4Label}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
