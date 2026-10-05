import React from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  Truck, 
  Building2,
  FileText,
  Award,
  ThermometerSnowflake,
  FlaskConical,
  Flame,
  ArrowRight,
  ArrowLeft,
  Phone
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { EditableImage } from '../components/EditableImage';

interface QualityPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const qualityCards = content.quality?.cards || [
    {
      title: lang === 'ar' ? 'شهادات التحليل المخبري (COA)' : 'Certificates of Analysis (COA)',
      desc: lang === 'ar' 
        ? 'كل شحنة تخرج من مستودعاتنا مرفقة بشهادة فحص وتحليل كاملة لكل دفعة توضح نسب النقاوة والخصائص الفيزيائية والكيميائية.'
        : 'Every dispatch is accompanied by full batch test certificates indicating active content, purity, and exact physical properties.',
    },
    {
      title: lang === 'ar' ? 'صحائف بيانات سلامة المواد (MSDS)' : 'Material Safety Data Sheets (MSDS)',
      desc: lang === 'ar'
        ? 'توثيق كيميائي وفني شامل يوضح إرشادات التعامل والتخزين الآمن ومتطلبات الحماية والوقاية الصناعية.'
        : 'Complete technical hazard documentation ensuring safe handling, protective equipment compliance, and industrial storage safety.',
    },
    {
      title: lang === 'ar' ? 'نقل مخصص وتخزين آمن للمواد الكيميائية' : 'Dedicated Transport & Secure Storage',
      desc: lang === 'ar'
        ? 'أسطول شاحنات مجهز ومستودعات مكيفة ومجهزة بنظم تهوية وإطفاء عالي الدقة تضمن الحفاظ على نقاوة وسلامة المنتجات.'
        : 'Climate-controlled, ventilated chemical facilities and dedicated vehicles with trained logistics handlers.',
    },
    {
      title: lang === 'ar' ? 'دقة الالتزام بالتوصيل 100%' : '100% Delivery Commitment Accuracy',
      desc: lang === 'ar'
        ? 'التزام تام بتلبية المواصفات القياسية وجداول التوريد لخطوط إنتاج عملائنا من مختلف المصانع في المملكة والخليج.'
        : 'Full commitment to scheduled delivery and matching exact technical specifications demanded by production lines.',
    },
  ];

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span>{content.quality?.sectionBadge || (lang === 'ar' ? 'الجودة والسلامة الفنية' : 'Quality & Technical Safety')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {content.quality?.heading || (lang === 'ar' ? 'معايير دقيقة في الفحص والمطابقة والسلامة الكيميائية' : 'Precision Quality Assurance & Safe Chemical Logistics')}
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          {content.quality?.description || (lang === 'ar' 
            ? 'ندرك في شركة كميزون كميكال التجارية الأهمية القصوى للدقة والسلامة في التعامل مع المواد الكيميائية، لذا نطبق أدق نظم الفحص المخبري وإجراءات الأمان في كافة مراحل التوريد، التخزين، والتسليم للمصانع.'
            : 'At Kemizone Chemical Commercial .Co, precision and safety are our foundational pillars. We maintain strict quality management protocols across every stage.')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {qualityCards.map((cert, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  {idx === 0 ? <FileCheck className="w-6 h-6" /> :
                   idx === 1 ? <FileText className="w-6 h-6" /> :
                   idx === 2 ? <Truck className="w-6 h-6" /> :
                   <Award className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {cert.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cert.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ar' ? 'معتمد وموثق' : 'Certified & Verified'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Safety Standards & Regulatory Compliance Box */}
        <div className="bg-emerald-50/70 rounded-3xl p-8 sm:p-12 border border-emerald-200 mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <Truck className="w-3.5 h-3.5 text-emerald-800" />
                <span>{lang === 'ar' ? 'معايير التخزين والنقل المعتمدة' : 'Compliant Storage & Transport'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'التزام تام باشتراطات الدفاع المدني والجهات التنظيمية' : 'Full Compliance with Civil Defense & Regulatory Codes'}
              </h2>

              <p className="text-slate-700 text-sm leading-relaxed">
                {lang === 'ar'
                  ? 'تطبق شركة كميزون كميكال التجارية بروتوكولات تخزين متقدمة تلزم بعدم تجاوز الارتفاعات الآمنة للبراميل (200 لتر) والأكياس (25 كغ)، واستخدام طبليات معقمة، ونظم تهوية ومكافحة حريق معتمدة لضمان سلامة العاملين وجودة المواد.'
                  : 'Kemizone Chemical Commercial .Co enforces strict storage limits, sanitised palletization, and accredited industrial safety systems.'}
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-800">
                <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lang === 'ar' ? 'فصل وتصنيف المواد وفق معايير GHS' : 'GHS Chemical Segregation'}</span>
                </li>
                <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lang === 'ar' ? 'سائقون مرخصون لنقل المواد الكيميائية' : 'Certified Chemical Drivers'}</span>
                </li>
                <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lang === 'ar' ? 'مستودعات مجهزة بأنظمة إطفاء ذكية' : 'Automated Fire Suppression'}</span>
                </li>
                <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lang === 'ar' ? 'رقابة الرطوبة ودرجات الحرارة 24/7' : 'Climate & Humidity Control 24/7'}</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-300 bg-slate-900">
                <EditableImage
                  imageKey="quality_control_image"
                  defaultSrc=""
                  alt="Quality control and secure chemical logistics at Kemizone"
                  className="w-full h-80 object-cover"
                  containerClassName="w-full h-full relative"
                  labelAr="رفع صورة مراقبة الجودة"
                  labelEn="Upload Quality Image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quality Action Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'ar' ? 'هل تحتاج شهادات تحليل (COA) أو المواصفات الفنية (TDS) أو صحائف سلامة (MSDS) لمادتكم؟' : 'Need COA, TDS, or MSDS Documentation for Your Factory?'}
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              {lang === 'ar'
                ? 'فريقنا الفني يوفر كافة الوثائق المخبرية وشهادات المطابقة لجميع المواد الكيميائية المسجلة بالكتالوج.'
                : 'Our technical specialists supply complete lab analysis reports and batch data sheets upon request.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm whitespace-nowrap shadow cursor-pointer transition-colors flex items-center gap-2"
          >
            <span>{lang === 'ar' ? 'طلب الوثائق الفنية' : 'Request Technical Documents'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
