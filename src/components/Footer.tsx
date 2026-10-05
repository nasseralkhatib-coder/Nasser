import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowUp,
  Globe,
  Sparkles,
  Building2,
  Download
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { branchOffices, productCategories } from '../data/products';
import { KemizoneLogo } from './KemizoneLogo';

interface FooterProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onToggleLanguage: () => void;
  currentTheme: ThemeMode;
  customPhone?: string;
  customEmail?: string;
  onOpenDownloadCenter?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onToggleLanguage,
  currentTheme,
  customPhone = '+966 13 898 5544',
  customEmail = 'info@kemizone.com',
  onOpenDownloadCenter,
}) => {
  const content = siteContent[lang];
  const isDark = currentTheme === 'industrial-dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: content.nav.home },
    { id: 'about', label: content.nav.about },
    { id: 'products', label: content.nav.products },
    { id: 'industries', label: content.nav.industries },
    { id: 'quality', label: content.nav.quality },
    { id: 'supply-chain', label: content.nav.supplyChain },
    { id: 'branches', label: content.nav.branches },
    { id: 'contact', label: content.nav.contact },
  ];

  return (
    <footer 
      id="main-footer" 
      className={`border-t text-sm transition-colors ${
        isDark 
          ? 'bg-slate-950 border-slate-800 text-slate-400' 
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      {/* Top Footer Tier */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="bg-white rounded-2xl p-1.5 sm:p-2 shadow-md border border-slate-700 flex items-center justify-center shrink-0">
                <KemizoneLogo className="h-9 sm:h-11 w-auto" />
              </div>
              <div>
                <span className="text-sm font-bold text-emerald-400 block">
                  {lang === 'ar' ? 'شركة كميزون كميكال التجارية' : 'Kemizone Chemical Commercial .Co'}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {lang === 'ar' ? 'استيراد وتوزيع المواد الخام الصناعية' : 'Industrial & Specialty Chemical Raw Materials'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {content.footer.aboutCompany}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'توريد مواد خام صناعية معتمدة' : 'Certified Industrial Raw Materials'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'اجتماعات واستشارات مبيعات شخصية' : 'Personal Sales Consultations'}</span>
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              {content.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => {
                      onNavigate(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-start cursor-pointer text-slate-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Divisions Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              {content.footer.productDivisions}
            </h4>
            <ul className="space-y-2 text-xs">
              {productCategories.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => {
                      onNavigate('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors block text-start cursor-pointer text-slate-300"
                  >
                    {cat.name[lang]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Hubs & Contact Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              {content.footer.branchesTitle}
            </h4>
            <div className="space-y-2.5 text-xs">
              {branchOffices.map((b) => (
                <div key={b.id} className="pb-2 border-b border-slate-800">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>{b.city[lang]}</span>
                    {b.isHQ && (
                      <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {content.branches.hqBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {b.title[lang]}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onToggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'English Version' : 'النسخة العربية'}</span>
              </button>

              {onOpenDownloadCenter && (
                <button
                  onClick={onOpenDownloadCenter}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs border border-emerald-600 transition-colors cursor-pointer font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{lang === 'ar' ? 'تحميل ملفات الموقع (ZIP)' : 'Download Website (ZIP)'}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            {content.footer.copyright}
          </div>

          <div className="flex items-center gap-4">
            <span>{content.footer.developedWith}</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
