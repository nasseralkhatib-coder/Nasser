import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Truck, 
  Microscope, 
  Building2, 
  Handshake,
  CheckCircle2,
  FileCheck,
  Boxes,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { getCustomFleetImage } from '../utils/customImage';
import { EditableImage } from '../components/EditableImage';
import { OrganizationalHierarchy } from '../components/OrganizationalHierarchy';

interface AboutPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];
  const isDark = currentTheme === 'industrial-dark';
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [fleetImg, setFleetImg] = useState<string>(getCustomFleetImage);

  useEffect(() => {
    const handleUpdate = () => setFleetImg(getCustomFleetImage());
    window.addEventListener('kemizone_image_updated', handleUpdate);
    return () => window.removeEventListener('kemizone_image_updated', handleUpdate);
  }, []);

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Hero Banner for About Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 border shadow-sm bg-emerald-50 text-emerald-800 border-emerald-200">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{content.about.sectionBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            {lang === 'ar' 
              ? 'شركة كميزون كميكال التجارية: إرث من الثقة والريادة الكيميائية' 
              : 'Kemizone Chemical Commercial .Co: Legacy of Chemical Excellence & Trust'}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {content.about.paragraph1}
          </p>
        </div>
      </div>

      {/* Main Narrative & Real-World Operations Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        
        {/* Story & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-7 rounded-3xl bg-white border border-emerald-100 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mb-3 flex items-center gap-2.5">
                <span className="w-2.5 h-7 rounded-full bg-emerald-600 inline-block" />
                {lang === 'ar' ? 'مسيرة الريادة والشراكة الصناعية' : 'Pioneering Industrial Supply'}
              </h2>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-4">
                {content.about.paragraph2}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {lang === 'ar'
                  ? 'تمتلك الشركة بنية تحتية لوجستية متقدمة في المدن الصناعية الكبرى (الرياض، جدة، والدمام)، تتيح لنا تلبية الاحتياجات العاجلة والتعاقدات طويلة الأجل لمصانع الدهانات، البناء، المنظفات، ومعالجة المياه والنفط والغاز.'
                  : 'We operate advanced logistics and storage facilities in major industrial centers (Riyadh, Jeddah, Dammam), fulfilling both urgent spot demands and strategic long-term supply agreements.'}
              </p>
            </div>

            {/* Vision & Mission Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950 mb-2">
                  {content.about.visionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {content.about.visionText}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200">
                <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center mb-4 shadow-sm">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-teal-950 mb-2">
                  {content.about.missionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {content.about.missionText}
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlight Image 1: Drone In Moderate Warehouse */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-100 group">
              <EditableImage
                imageKey="about_warehouse_drone"
                defaultSrc=""
                alt="Kemizone Moderate Height Chemical Warehouse Logistics with Inspection Drone"
                className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                containerClassName="w-full relative"
                labelAr="رفع صورة المستودع والدرون"
                labelEn="Upload Warehouse Image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-bold uppercase tracking-wider mb-2 w-max">
                  {lang === 'ar' ? 'رقابة لوجستية ذكية' : 'Smart Logistics & Storage'}
                </span>
                <h4 className="text-lg font-bold text-white mb-1">
                  {lang === 'ar' ? 'مستودعات كيميائية بارتفاعات معيارية آمنة' : 'Safety-Standard Storage Facilities'}
                </h4>
                <p className="text-xs text-slate-200">
                  {lang === 'ar' 
                    ? 'أقصى 4 طبقات براميل و10 طبقات أكياس مع مسارات فحص بطائرات درون لتتبع شحنات المواد الخام' 
                    : 'Max 4-tier drum stacking and 10-layer bag pallets with autonomous drone inspection'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Realistic Imagery Showcase (Fleet & Docking Operations) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              {lang === 'ar' ? 'أسطولنا اللوجستي ومرافق الموانئ' : 'Logistics Fleet & Port Infrastructure'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'جاهزية توريد فورية لكافة مصانع المملكة' : 'Rapid Distribution Infrastructure Across KSA'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Image 2: Fleet of Trucks */}
            <div className="rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-md group flex flex-col justify-between h-full">
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
                <EditableImage
                  imageKey="about_fleet"
                  defaultSrc=""
                  alt="Kemizone Chemical Distribution Fleet and Warehouse"
                  className="w-full h-full object-contain block transition-transform duration-700 group-hover:scale-[1.02]"
                  containerClassName="w-full h-full relative"
                  labelAr="رفع صورة أسطول التوزيع"
                  labelEn="Upload Fleet Image"
                  objectFit="contain"
                  onErrorFallback=""
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow pointer-events-none">
                  {lang === 'ar' ? 'أسطول التوزيع الوطني' : 'National Fleet'}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-2">
                    {lang === 'ar' ? 'أسطول شاحنات مجهز ومخصص للمواد الكيميائية' : 'Specialized Chemical Transportation Fleet'}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {lang === 'ar'
                      ? 'أسطول شاحنات حديث يحمل شعار "شركة كميزون كميكال التجارية" مجهز بنظم تتبع GPS وسائقين مدربين لنقل وتوصيل المواد الخام السائلة والجافة بأمان تام إلى الرياض، جدة، الخبر، والجبيل.'
                      : 'A dedicated fleet bearing the Kemizone Chemical Commercial .Co brand, equipped with telemetry GPS and certified chemical transport handlers connecting all major industrial zones.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-800 pt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                    {lang === 'ar' ? '✓ تسليم في الموعد (JIT)' : '✓ Just-in-Time Delivery'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                    {lang === 'ar' ? '✓ تغطية لكافة المدن الصناعية' : '✓ Full KSA Industrial Coverage'}
                  </span>
                </div>
              </div>
            </div>

            {/* Image 3: Containers at Dock / Warehouse */}
            <div className="rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-md group flex flex-col justify-between h-full">
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
                <EditableImage
                  imageKey="about_containers"
                  defaultSrc=""
                  alt="Kemizone ISO Tankers and Shipping Containers at Terminal"
                  className="w-full h-full object-contain block transition-transform duration-700 group-hover:scale-[1.02]"
                  containerClassName="w-full h-full relative"
                  labelAr="رفع صورة الحاويات والموانئ"
                  labelEn="Upload Containers Image"
                  objectFit="contain"
                  onErrorFallback=""
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-teal-700/90 text-white text-xs font-bold shadow pointer-events-none">
                  {lang === 'ar' ? 'استيراد وشحن دولي' : 'Global Import Hub'}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-emerald-950 mb-2">
                    {lang === 'ar' ? 'استقبال الحاويات وشحنات الاستيراد المباشرة' : 'Direct Maritime Imports & ISO Tank Ingestion'}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {lang === 'ar'
                      ? 'أرصفة تفريغ مجهزة لاستقبال الحاويات الكاملة وصهاريج الكيماويات من كبرى الموانئ (ميناء الملك عبدالعزيز بالدمام وميناء جدة الإسلامي) مباشرة إلى ساحات ومستودعات كميزون.'
                      : 'Dedicated docks and transshipment yards processing full shipping containers and liquid bulk ISO tanks directly from major Saudi port gateways into Kemizone hubs.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-teal-800 pt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200">
                    {lang === 'ar' ? '✓ سعات استيعابية ضخمة' : '✓ High Volume Capacity'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200">
                    {lang === 'ar' ? '✓ استقرار دائم في سلاسل الإمداد' : '✓ Uninterrupted Supply Assurance'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Organizational Hierarchy Chart & Image Display (High Resolution) */}
          <OrganizationalHierarchy lang={lang} />
        </div>

        {/* Core Pillars / Corporate Values */}
        <div className="bg-emerald-50/50 rounded-3xl p-8 sm:p-12 border border-emerald-100 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
              {lang === 'ar' ? 'قيم العمل المؤسسي' : 'Our Operating Principles'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              {lang === 'ar' ? 'أركان الثقة التي نبني عليها شركتنا' : 'Pillars of Trust & Corporate Integrity'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            {content.about.values.map((val, idx) => {
              const icons = [ShieldCheck, Truck, Microscope, Handshake];
              const CurrentIcon = icons[idx % icons.length];

              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-start"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CurrentIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950 mb-3">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA to Products & Quote */}
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-800 text-white text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold">
              {lang === 'ar' ? 'هل تبحث عن مادة كيميائية محددة لمصنعك؟' : 'Looking for Specific Chemical Raw Materials?'}
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              {lang === 'ar'
                ? 'تصفح كتالوج منتجاتنا الكيميائية الشامل أو تواصل مباشرة مع فريق المبيعات الفنية للحصول على عرض سعر فوري.'
                : 'Explore our complete chemical products catalog or request an official quotation tailored to your factory production volumes.'}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-sm transition-colors shadow flex items-center gap-2 cursor-pointer"
              >
                <span>{content.nav.products}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'تنسيق اجتماع عمل مباشر' : 'Schedule Business Meeting'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
