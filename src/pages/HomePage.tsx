import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  Truck, 
  Sparkles,
  Phone,
  CheckCircle2,
  Package,
  FlaskConical,
  Award,
  Clock,
  Users
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { industriesData, branchOffices } from '../data/products';
import { getCustomFleetImage, setCustomFleetImage } from '../utils/customImage';
import { useStoredImage } from '../hooks/useStoredImage';
import { persistedImages } from '../data/persistedImages';
import { getStoredImage, getAllStoredImages } from '../utils/imageStore';
import { resolveAssetUrl } from '../utils/assetUrl';

/**
 * Permanently Fixed Hero Visual - strictly non-editable with ZERO change options
 * as specifically requested by user.
 * Renders the original, certified corporate visual of Kemizone Chemical fleet & logistics.
 */
const HeroFixedVisual: React.FC<{ lang: Language }> = ({ lang }) => {
  const defaultStaticFallback = persistedImages['home_hero_cars'] || '/images/kemizone-hero-fleet.jpg';
  const { imageSrc } = useStoredImage('home_hero_cars', defaultStaticFallback);
  const [imgError, setImgError] = useState(false);

  // Auto-sync the hero image from user browser storage directly to project disk files for permanent publishing
  useEffect(() => {
    let timer: any;
    let isMounted = true;

    async function syncHeroImageToDisk() {
      try {
        let candidate: string | null = null;
        if (imageSrc && typeof imageSrc === 'string' && imageSrc.startsWith('data:image')) {
          candidate = imageSrc;
        } else {
          candidate = await getStoredImage('home_hero_cars');
          if (!candidate || !candidate.startsWith('data:image')) {
            candidate = await getStoredImage('kemizone_cars_image');
          }
          if (!candidate || !candidate.startsWith('data:image')) {
            try {
              candidate = localStorage.getItem('kz_img_home_hero_cars') ||
                          localStorage.getItem('kemizone_cars_image') ||
                          localStorage.getItem('home_hero_cars') ||
                          localStorage.getItem('kz_img_kemizone_cars_image');
            } catch {}
          }
          if (!candidate || !candidate.startsWith('data:image')) {
            const all = await getAllStoredImages();
            if (all['home_hero_cars']) candidate = all['home_hero_cars'];
            else if (all['kemizone_cars_image']) candidate = all['kemizone_cars_image'];
          }
        }

        if (candidate && typeof candidate === 'string' && candidate.startsWith('data:image')) {
          const resp = await fetch('/api/sync-hero-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: candidate }),
          });
          if (resp.ok) {
            console.log('[Kemizone] Hero image successfully saved to project files!');
            return true;
          }
        }
      } catch (err) {
        console.warn('[Kemizone] Hero sync check:', err);
      }
      return false;
    }

    syncHeroImageToDisk().then((done) => {
      if (!done && isMounted) {
        timer = setInterval(async () => {
          const ok = await syncHeroImageToDisk();
          if (ok && timer) clearInterval(timer);
        }, 2000);
      }
    });

    const triggerSync = () => { syncHeroImageToDisk(); };
    window.addEventListener('focus', triggerSync);
    window.addEventListener('visibilitychange', triggerSync);
    window.addEventListener('kz-image-updated', triggerSync);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
      window.removeEventListener('focus', triggerSync);
      window.removeEventListener('visibilitychange', triggerSync);
      window.removeEventListener('kz-image-updated', triggerSync);
    };
  }, [imageSrc]);

  const displaySrc = imageSrc || defaultStaticFallback || '/images/kemizone-hero-fleet.jpg';

  if (displaySrc && !imgError) {
    return (
      <div className="w-full relative">
        <img
          src={resolveAssetUrl(displaySrc)}
          alt="Kemizone Chemical Commercial .Co Facility and Fleet"
          onError={() => setImgError(true)}
          className="w-full h-auto max-h-[460px] object-cover block mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 p-8 text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Corporate Chemical Distribution Badge */}
      <div className="relative z-10 flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-wide">
              {lang === 'ar' ? 'أسطول النقل اللوجستي وسلسلة الإمداد الكيميائي' : 'Logistics Fleet & Chemical Supply Chain'}
            </h4>
            <p className="text-[11px] text-emerald-300/80 font-medium">
              {lang === 'ar' ? 'شركة كميزون كميكال التجارية • Kemizone Chemical' : 'Kemizone Chemical Commercial .Co'}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
          {lang === 'ar' ? 'اعتماد 100%' : '100% Certified'}
        </span>
      </div>

      {/* High-Tech Fleet & Storage Visual Representation */}
      <div className="relative z-10 grid grid-cols-3 gap-3 my-6">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-center">
          <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white block">
            {lang === 'ar' ? 'مستودعات مركزية' : 'Central Hubs'}
          </span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">
            {lang === 'ar' ? 'الرياض • جدة • الدمام' : 'Riyadh • Jeddah • Dammam'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-center">
          <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-2">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white block">
            {lang === 'ar' ? 'أسطول شاحنات مجهز' : 'Equipped Fleet'}
          </span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">
            {lang === 'ar' ? 'شاحنات نقل وسوائل 200L' : '25KG & 200L Delivery'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-center">
          <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-900/50 flex items-center justify-center text-emerald-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white block">
            {lang === 'ar' ? 'معايير ADR وCOA' : 'ADR & COA Safety'}
          </span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">
            {lang === 'ar' ? 'نقل آمن وشهادات سلامة' : 'Safety Certified Transport'}
          </span>
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-emerald-500/20 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {lang === 'ar' ? 'جاهزية التوريد الفوري لكافة المصانع' : 'Instant supply readiness for all factories'}
        </span>
        <span className="font-mono text-emerald-400 font-bold text-[11px]" dir="ltr">
          KEMIZONE LOGISTICS
        </span>
      </div>
    </div>
  );
};

interface HomePageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
  customPhone?: string;
  customLandline?: string;
  customEmail?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  currentTheme,
  onNavigate,
  customPhone = '+966 50 482 2515',
  customLandline = '+966 13 512 2036',
  customEmail = 'nasser.alkhatib@kemizone.com',
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [fleetImg, setFleetImg] = useState<string>(getCustomFleetImage);

  useEffect(() => {
    const handleUpdate = () => setFleetImg(getCustomFleetImage());
    window.addEventListener('kemizone_image_updated', handleUpdate);
    return () => window.removeEventListener('kemizone_image_updated', handleUpdate);
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${activeTheme.bg}`}>

      {/* 1. HERO SECTION */}
      <section className="relative pt-44 sm:pt-48 pb-20 overflow-hidden border-b border-emerald-100/80">
        
        {/* Ambient background decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left/Main Column: Headlines & Call to Actions */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{content.hero.badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.2]">
                <span className="text-emerald-700 block">
                  {content.hero.titleHighlight}
                </span>
                <span className="text-slate-900 font-extrabold text-2xl sm:text-4xl lg:text-5xl block mt-2">
                  {content.hero.titleRest}
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                {content.hero.description}
              </p>

              {/* Action Buttons: View Products & Request Special Material */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => onNavigate('products')}
                  className={`px-6 py-3.5 rounded-xl ${activeTheme.buttonClass} text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer`}
                >
                  <span>{content.hero.ctaPrimary}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: Hero Visual - Permanently Fixed as requested by user (No change option) */}
            <div className="lg:col-span-6 flex items-start justify-center pt-0.5">
              <div className="relative w-full max-w-2xl mx-auto flex items-start justify-center">
                <HeroFixedVisual lang={lang} />
              </div>
            </div>

          </div>

          {/* Key Indicators Bar - Distributed on a single line across the entire page from right to left */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
              
              {/* Box 1: 15+ Years */}
              <div className={`p-4 sm:p-5 rounded-2xl ${activeTheme.bgSubtle} border ${activeTheme.border} shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group`}>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <span className={`block text-2xl sm:text-3xl font-black ${activeTheme.statNumber} leading-none mb-1`}>
                    {content.hero.stat1Number}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-snug block">
                    {content.hero.stat1Label}
                  </span>
                </div>
              </div>

              {/* Box 2: 40+ Chemical Materials */}
              <div className={`p-4 sm:p-5 rounded-2xl ${activeTheme.bgSubtle} border ${activeTheme.border} shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group`}>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <span className={`block text-2xl sm:text-3xl font-black ${activeTheme.statNumber} leading-none mb-1`}>
                    {content.hero.stat2Number}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-snug block">
                    {content.hero.stat2Label}
                  </span>
                </div>
              </div>

              {/* Box 3: 4 Regional Branches */}
              <div className={`p-4 sm:p-5 rounded-2xl ${activeTheme.bgSubtle} border ${activeTheme.border} shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group`}>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <span className={`block text-2xl sm:text-3xl font-black ${activeTheme.statNumber} leading-none mb-1`}>
                    {content.hero.stat3Number}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-snug block">
                    {content.hero.stat3Label}
                  </span>
                </div>
              </div>

              {/* Box 4: 100% Commitment to Delivery */}
              <div className={`p-4 sm:p-5 rounded-2xl ${activeTheme.bgSubtle} border ${activeTheme.border} shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group`}>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <span className={`block text-2xl sm:text-3xl font-black ${activeTheme.statNumber} leading-none mb-1`}>
                    {content.hero.stat4Number}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-snug block">
                    {content.hero.stat4Label}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. CORPORATE PROFILE & OPERATIONAL ADVANTAGES */}
      <section className={`py-16 ${activeTheme.bg} border-b ${activeTheme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-emerald-900 text-white shadow-xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ar' ? 'معايير الإمداد والتوزيع' : 'Supply Standards'}</span>
                </div>
                
                <h3 className="text-2xl font-black leading-snug">
                  {lang === 'ar' 
                    ? 'توريد كيميائي موثوق يخدم كبرى القطاعات التحويلية' 
                    : 'Dependable Chemical Supply Powering Regional Industry'}
                </h3>
                
                <p className="text-emerald-100/90 text-sm leading-relaxed">
                  {lang === 'ar'
                    ? 'نحرص في شركة كميزون كميكال التجارية على تزويد مصانع الدهانات والبناء والمنظفات والبلاستيك والمذيبات بأجود المواد الخام المعتمدة، مع الالتزام التام بالتوصيل في الموعد المحدد بنسبة 100%.'
                    : 'Kemizone Chemical Commercial .Co supplies paints, construction, detergent, plastic, and solvent manufacturers with certified raw materials, maintaining 100% on-time delivery accuracy.'}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs font-semibold text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'تعبئة قياسية معتمدة: 25 كغ للمواد الجافة و200 لتر للسوائل' : 'Standard packaging: 25kg bags & 200L drums'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'فروع ومستودعات استراتيجية في الرياض، جدة، والدمام' : 'Strategic hubs in Riyadh, Jeddah & Dammam'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'شهادات تحليل مخبري COA وبيانات سلامة المواد MSDS كاملة' : 'Full Certificates of Analysis (COA) & MSDS'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className={`text-xs font-bold uppercase tracking-wider ${activeTheme.accentBadgeText} block`}>
                {lang === 'ar' ? 'نبذة عن الشركة' : 'About Kemizone'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {lang === 'ar' 
                  ? 'خبرة تمتد لأكثر من 15 عاماً في تجارة وتوريد المواد الكيميائية'
                  : 'Over 15 Years of Chemical Distribution Heritage'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {content.about.paragraph1}
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {content.about.paragraph2}
              </p>

              <div className="pt-3 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className={`px-5 py-2.5 rounded-xl ${activeTheme.tagClass} font-bold text-sm border transition-colors flex items-center gap-1.5 cursor-pointer`}
                >
                  <span>{lang === 'ar' ? 'تعرف على قصة وتاريخ كميزون' : 'Read Full Company Profile'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('supply-chain')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  {content.nav.supplyChain}
                </button>
                <button
                  onClick={() => {
                    onNavigate('about');
                    setTimeout(() => {
                      document.getElementById('org-hierarchy')?.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 font-bold text-sm border border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'ar' ? 'الهرم الوظيفي للشركة (38 موظفاً)' : 'Company Org Structure (38 Team)'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. INDUSTRIES WE SERVE */}
      <section className="py-20 bg-white border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
              {content.industries.sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              {content.industries.heading}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {content.industries.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {industriesData.slice(0, 6).map((ind) => (
              <div 
                key={ind.id}
                className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/80 transition-all group cursor-pointer"
                onClick={() => onNavigate('industries')}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950 mb-2">
                  {ind.title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {ind.description[lang]}
                </p>
                <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 group-hover:underline">
                  <span>{lang === 'ar' ? 'عرض الكيماويات الموردة' : 'View Key Chemicals'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('industries')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'استكشاف جميع القطاعات الصناعية' : 'Explore All Industries'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. QUALITY & COMPLIANCE PREVIEW */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-2">
              {content.quality.sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              {content.quality.heading}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              {content.quality.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {content.quality.cards.map((card, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-emerald-800/80 border border-emerald-700/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center mb-4 text-emerald-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('quality')}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-colors inline-flex items-center gap-2 cursor-pointer shadow"
            >
              <span>{lang === 'ar' ? 'تفاصيل معايير الجودة والسلامة' : 'Quality & Safety Procedures'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. LOGISTICS & REGIONAL HUBS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
              {content.branches.sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {content.branches.heading}
            </h2>
            <p className="text-slate-600 text-sm">
              {content.branches.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {branchOffices.map((b) => (
              <div 
                key={b.id}
                className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-emerald-950">
                      {b.city[lang]}
                    </span>
                    {b.isHQ && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {content.branches.hqBadge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 mb-2">
                    {b.title[lang]}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {b.address[lang]}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{b.workingHours[lang]}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
