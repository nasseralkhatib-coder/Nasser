import React from 'react';
import { 
  Truck, 
  Warehouse, 
  Globe2, 
  Clock, 
  ShieldCheck, 
  Boxes, 
  CheckCircle2 
} from 'lucide-react';
import { Language } from '../types';
import { siteContent } from '../data/translations';

interface SupplyChainSectionProps {
  lang: Language;
}

export const SupplyChainSection: React.FC<SupplyChainSectionProps> = ({
  lang,
}) => {
  const content = siteContent[lang];

  return (
    <section id="supply-chain" className="py-20 bg-slate-950 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.supplyChain.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.supplyChain.heading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {content.supplyChain.subheading}
          </p>
        </div>

        {/* 4 Pillars of Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {content.supplyChain.points.map((pt, idx) => {
            const icons = [Warehouse, Truck, Globe2, Clock];
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 shadow-lg group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {pt.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Logistics Capabilities Matrix Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Boxes className="w-6 h-6 text-teal-400" />
              <span>
                {lang === 'ar'
                  ? 'قدرات التخزين والتعبئة المتعددة لشركة كميزون'
                  : 'Kemizone Multi-Modal Chemical Storage & Packing'}
              </span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'توفر كميزون كميات مرنة تناسب كافة أحجام المصانع: من أكياس 25 كغ متعددة الطبقات، وبراميل سعة 200 لتر، وخزانات IBC سعة 1000 لتر، وحتى التوريد المباشر عبر صهاريج النقل السائب.'
                : 'Kemizone accommodates flexible delivery volumes for all plant scales: from 25kg multi-wall bags, 200L drums, 1000L IBC totes, up to dedicated bulk road tankers.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['25kg Multi-layer Bags', '200L Steel & HDPE Drums', '1000L IBC Containers', 'Bulk Road Tankers', 'Climate-Controlled Storage'].map((spec, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 text-center flex flex-col items-center justify-center">
            <div className="text-4xl font-extrabold text-teal-400 mb-1" dir="ltr">
              24-48h
            </div>
            <div className="text-sm font-semibold text-white mb-2">
              {lang === 'ar' ? 'متوسط سرعة التوصيل الإقليمي' : 'Average Regional Dispatch'}
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'ar' 
                ? 'للمدن الصناعية الكبرى بالمملكة بفضل انتشار فروعنا' 
                : 'Across major industrial zones in Saudi Arabia via our branch network'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
