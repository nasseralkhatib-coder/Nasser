import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { Language, BranchOffice } from '../types';
import { siteContent } from '../data/translations';
import { branchOffices } from '../data/products';

interface BranchesSectionProps {
  lang: Language;
  onContactBranch: (branch: BranchOffice) => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({
  lang,
  onContactBranch,
}) => {
  const content = siteContent[lang];
  const [selectedBranchId, setSelectedBranchId] = useState<string>('riyadh-hq');

  const selectedBranch = branchOffices.find((b) => b.id === selectedBranchId) || branchOffices[0];

  return (
    <section id="branches" className="py-20 bg-slate-900 relative border-t border-slate-800 overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.branches.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.branches.heading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {content.branches.subheading}
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {branchOffices.map((branch) => {
            const isSelected = branch.id === selectedBranchId;
            return (
              <button
                key={branch.id}
                id={`branch-tab-${branch.id}`}
                onClick={() => setSelectedBranchId(branch.id)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20 scale-105'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Building2 className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-teal-400'}`} />
                <span>{branch.city[lang]}</span>
                {branch.isHQ && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-teal-900/40 text-teal-950' : 'bg-teal-500/20 text-teal-400'
                  }`}>
                    {content.branches.hqBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Branch Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details Column */}
          <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {selectedBranch.city[lang]}
                </span>
                {selectedBranch.isHQ && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{content.branches.hqBadge}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                {selectedBranch.title[lang]}
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                {/* Address */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                      {content.branches.addressLabel}
                    </span>
                    <span>{selectedBranch.address[lang]}</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800/80">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                      {content.branches.hoursLabel}
                    </span>
                    <span>{selectedBranch.workingHours[lang]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                id="contact-selected-branch-btn"
                onClick={() => onContactBranch(selectedBranch)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{content.branches.contactBranch}</span>
              </button>
            </div>
          </div>

          {/* Regional Geographic Visual Map Display */}
          <div className="lg:col-span-6 bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
            
            {/* Map Decorative Grid Backdrop */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'شبكة الفروع والمستودعات في المملكة' : 'Saudi Arabia Logistics Network'}</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  {lang === 'ar' ? 'مستودعات ومراكز توزيع نشطة' : 'Active Logistics Hubs'}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-3">
                {lang === 'ar'
                  ? 'انتشار استراتيجي يربط الموانئ بالمدن الصناعية'
                  : 'Strategic Proximity Connecting Ports to Industrial Cities'}
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {lang === 'ar'
                  ? 'تتيح مراكز ومستودعات كميزون في الدمام والمنطقة الشرقية سرعة استلام وتخليص الشحنات الكيميائية من موانئ الخليج، بينما يخدم المقر الرئيسي في الرياض مصانع المنطقة الوسطى، وفرع جدة يغطي الساحل الغربي وميناء جدة الإسلامي.'
                  : 'Kemizone hubs in Dammam and the Eastern Province expedite imports from Arabian Gulf ports, while Riyadh HQ serves Central industrial plants and Jeddah manages Western Province supply.'}
              </p>

              {/* Graphical Network Nodes Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                {branchOffices.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                      b.id === selectedBranchId
                        ? 'bg-slate-800 border border-teal-500/40 text-white'
                        : 'hover:bg-slate-850 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${b.id === selectedBranchId ? 'bg-teal-400 animate-ping' : 'bg-slate-600'}`} />
                      <span className="font-semibold text-sm text-slate-200">
                        {b.city[lang]}
                      </span>
                    </div>
                    <span className="text-xs text-teal-400 font-medium">
                      {b.isHQ ? (lang === 'ar' ? 'المقر الرئيسي' : 'HQ') : (lang === 'ar' ? 'مركز توزيع معتمد' : 'Logistics Hub')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{lang === 'ar' ? 'فروعنا المعتمدة: الرياض • جدة • الدمام' : 'Certified Branches: Riyadh • Jeddah • Dammam'}</span>
              <span className="text-teal-400 font-bold">100% Reliable</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
