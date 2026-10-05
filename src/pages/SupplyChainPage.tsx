import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Warehouse, 
  Ship, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Building2,
  FileCheck,
  ShieldCheck,
  PackageCheck,
  Layers
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { branchOffices } from '../data/products';
import { getCustomFleetImage } from '../utils/customImage';
import { EditableImage } from '../components/EditableImage';

interface SupplyChainPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const SupplyChainPage: React.FC<SupplyChainPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
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

  const supplyPoints = content.supplyChain?.points || [
    {
      title: lang === 'ar' ? 'مستودعات مركزية مجهزة بمساحات شاسعة' : 'State-of-the-Art Regional Warehouses',
      desc: lang === 'ar' 
        ? 'طاقات تخزينية كبرى في المنطقة الشرقية (الدمام)، المنطقة الوسطى (الرياض)، والمنطقة الغربية (جدة).' 
        : 'Expansive storage hubs in Eastern Province (Dammam), Central Region (Riyadh), and Western Province (Jeddah).',
    },
    {
      title: lang === 'ar' ? 'أسطول نقل متخصص ومؤهل' : 'Specialized Chemical Fleet',
      desc: lang === 'ar' 
        ? 'شاحنات نقل مجهزة للكيماويات الصلبة (أكياس 25 كغ) والسائلة (براميل 200 لتر) مع سائقين حاصلين على رخص نقل المواد المعتمدة.' 
        : 'Dedicated transport units for dry palletized chemicals and liquid drums with trained logistics personnel.',
    },
    {
      title: lang === 'ar' ? 'علاقات توريد مباشرة مع عمالقة الصناعة' : 'Global Direct Sourcing Network',
      desc: lang === 'ar' 
        ? 'شراكات تمتد لعقود مع منتجي الكيماويات في آسيا، أوروبا، والشرق الأوسط لتأمين استقرار الأسعار والكميات.' 
        : 'Long-standing direct manufacturing alliances across Asia, Europe, and GCC ensuring pricing stability.',
    },
    {
      title: lang === 'ar' ? 'إدارة مخزون ذكية للتسليم عند الطلب (JIT)' : 'Just-In-Time (JIT) Inventory Management',
      desc: lang === 'ar' 
        ? 'برامج توريد مرحلي دقيقة لتخفيف أعباء التخزين عن المصانع وتأمين استمرارية الإنتاج بنسبة التزام 100%.' 
        : 'Scheduled phased deliveries reducing inventory carrying costs for our industrial manufacturing partners.',
    },
  ];

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          <Truck className="w-4 h-4 text-emerald-800" />
          <span>{content.supplyChain?.sectionBadge || (lang === 'ar' ? 'سلسلة التوريد والتوزيع' : 'Supply Chain & Logistics')}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {content.supplyChain?.heading || (lang === 'ar' ? 'تغطية جغرافية شاملة واستجابة فائقة السرعة' : 'Strategic GCC Reach with Rapid Turnaround')}
        </h1>
        
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          {content.supplyChain?.subheading || (lang === 'ar' 
            ? 'شبكة لوجستية متطورة تضمن وصول شحناتكم الكيميائية بأعلى معايير الأمان وفي الموعد المحدد بنسبة دقة 100%.' 
            : 'A resilient distribution network engineered to deliver your chemical requirements securely and without delays.')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Showcase: Fleet & Port Operations (Two equal columns, identical image dimensions and text box dimensions) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch">
          
          {/* 1. Cars / Small Vehicles Field Fleet */}
          <div className="rounded-3xl overflow-hidden bg-white border border-emerald-200 shadow-md group flex flex-col justify-between">
            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
              <EditableImage
                imageKey="supply_chain_cars"
                defaultSrc=""
                alt="Kemizone Distribution Fleet and Cars"
                className="w-full h-full object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
                containerClassName="w-full h-full relative"
                labelAr="رفع صورة أسطول السيارات"
                labelEn="Upload Cars Image"
                objectFit="contain"
                onErrorFallback=""
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {lang === 'ar' ? 'الأسطول الميداني والسيارات' : 'Dedicated Field Fleet & Distribution'}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">
                    {lang === 'ar' ? 'دقة الالتزام 100%' : '100% Delivery Accuracy'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {lang === 'ar' ? 'شركة كميزون كميكال التجارية - مرافق التوزيع والأسطول الميداني' : 'Kemizone Chemical Commercial .Co - Distribution Fleet & Warehouses'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'ar'
                    ? 'أسطول سيارات وشاحنات مجهز ومخصص للتوزيع الميداني السريع ونقل المواد الكيميائية الصلبة والسائلة مباشرة إلى مصانع العملاء وفق جداول توريد دقيقة ومنضبطة.'
                    : 'Modern field fleet equipped for rapid on-site distribution of chemical raw materials directly to manufacturing facilities across KSA and GCC with scheduled dispatch.'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Containers / Direct Import Large Trucks */}
          <div className="rounded-3xl overflow-hidden bg-white border border-emerald-200 shadow-md group flex flex-col justify-between">
            <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
              <EditableImage
                imageKey="supply_chain_containers"
                defaultSrc=""
                alt="Kemizone Direct Maritime Import and Containers"
                className="w-full h-full object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
                containerClassName="w-full h-full relative"
                labelAr="رفع صورة الحاويات"
                labelEn="Upload Containers Image"
                objectFit="contain"
                onErrorFallback=""
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ship className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {lang === 'ar' ? 'استيراد مباشر وشاحنات الحاويات الكبيرة' : 'Direct Import & Container Haulage'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {lang === 'ar' ? 'استيراد مباشر عبر الموانئ ومستودعات التخزين' : 'Direct Maritime Import & Port Ingestion'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'ar'
                    ? 'عمليات شحن بحري ونقل مباشر للحاويات والشاحنات الكبيرة من الموانئ إلى مستودعاتنا ومصانع العملاء لضمان استقرار سلاسل الإمداد ومنع توقف خطوط الإنتاج.'
                    : 'Direct container transshipment and heavy haulage from commercial ports directly to our storage facilities and factory production lines.'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Pillars of Supply Chain */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {lang === 'ar' ? 'ركائز سلسلة الإمداد المتقدمة في كميزون' : 'Core Supply Chain Pillars'}
            </h3>
            <p className="text-slate-600 text-sm">
              {lang === 'ar' ? 'منظومة عمل متكاملة ترتكز على الجودة والسرعة والأمان' : 'Integrated operations built on quality, velocity, and occupational safety'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supplyPoints.map((point, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm relative group hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm">
                    0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {point.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {point.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'جاهزية لوجستية تامة' : 'Full Operational Readiness'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Hubs & Warehouse Network Details */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200 shadow-sm mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {lang === 'ar' ? 'شبكة الفروع والمستودعات الإقليمية' : 'Regional Branch & Warehouse Network'}
            </h3>
            <p className="text-sm text-slate-600">
              {lang === 'ar' ? 'تغطية ميدانية مباشرة للمناطق الصناعية الرئيسية في المملكة (الرياض، جدة، الدمام)' : 'Direct on-the-ground support for major industrial zones across the Kingdom (Riyadh, Jeddah, Dammam)'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchOffices.map((branch) => (
              <div 
                key={branch.id}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      {branch.city[lang]}
                    </h4>
                    {branch.isHQ && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {lang === 'ar' ? 'المقر الرئيسي' : 'HQ'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mb-2">
                    {branch.title[lang]}
                  </p>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {branch.address[lang]}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-200 text-slate-600 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{branch.workingHours[lang]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sourcing Call to Action */}
        <div className="rounded-3xl p-8 bg-emerald-50/80 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
            {lang === 'ar'
              ? 'فريق المبيعات والتوريد الميداني في كميزون جاهز لتنسيق كميات التوريد الأسبوعية أو الشهرية بما يلائم خطط الإنتاج لمصنعكم.'
              : 'Our sales and logistics managers coordinate recurring bulk deliveries aligned with your factory production schedule.'}
          </p>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm whitespace-nowrap shadow cursor-pointer transition-colors flex items-center gap-2 shrink-0"
          >
            <span>{lang === 'ar' ? 'تواصل مع إدارة التوريد' : 'Contact Supply Management'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
