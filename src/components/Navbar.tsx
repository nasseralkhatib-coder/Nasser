import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Menu, 
  X, 
  Phone, 
  FileText, 
  Settings2, 
  Mail, 
  Clock, 
  Sparkles, 
  ChevronDown,
  Download
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { KemizoneLogo } from './KemizoneLogo';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  lang: Language;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onToggleLanguage: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  customPhone?: string;
  customLandline?: string;
  customEmail?: string;
  onOpenDownloadCenter?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  currentPage,
  onNavigate,
  onToggleLanguage,
  currentTheme,
  onSelectTheme,
  customPhone,
  customLandline,
  customEmail,
  onOpenDownloadCenter,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 7 Core Navigation Tabs (Branches removed from top bar, Quality and Supply Chain restored and prominent)
  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: content.nav.home },
    { id: 'about', label: content.nav.about },
    { id: 'products', label: content.nav.products },
    { id: 'industries', label: content.nav.industries },
    { id: 'quality', label: content.nav.quality },
    { id: 'supply-chain', label: content.nav.supplyChain },
    { id: 'contact', label: content.nav.contact },
  ];

  const handlePageClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${activeTheme.bgHeader}`}
    >
      {/* 1. Top Utility Bar with Mobile & Landline */}
      <div className="border-b text-xs py-1.5 px-3 sm:px-6 lg:px-8 bg-slate-900 text-slate-100 border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs truncate">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400 truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'ar' 
                  ? 'شركة كميزون كميكال التجارية - توريد وتوزيع المواد الكيميائية' 
                  : 'Kemizone Chemical Commercial .Co - Industrial Raw Materials'}
              </span>
            </span>

            <span className="hidden xl:flex items-center gap-1 text-slate-300 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'ar' ? 'السبت - الخميس: 9:00 ص - 6:00 م' : 'Sat - Thu: 9:00 AM - 6:00 PM'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {customPhone && (
              <a 
                href={`tel:${customPhone}`} 
                className="flex items-center gap-1 hover:text-white transition-colors font-medium text-[11px] sm:text-xs text-slate-200"
                dir="ltr"
                title={lang === 'ar' ? 'الجوال' : 'Mobile'}
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">{customPhone}</span>
              </a>
            )}

            {customLandline && (
              <a 
                href={`tel:${customLandline}`} 
                className="hidden md:flex items-center gap-1 hover:text-white transition-colors font-medium text-[11px] sm:text-xs text-slate-300"
                dir="ltr"
                title={lang === 'ar' ? 'الهاتف الأرضي' : 'Landline'}
              >
                <span className="text-slate-400 text-[10px]">{lang === 'ar' ? 'هاتف:' : 'Tel:'}</span>
                <span>{customLandline}</span>
              </a>
            )}

            {/* Download Center Trigger */}
            {onOpenDownloadCenter && (
              <button
                id="download-center-nav-btn"
                onClick={onOpenDownloadCenter}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm border border-emerald-600"
                title={lang === 'ar' ? 'تحميل ملفات الموقع للاستضافة والسورس كود' : 'Download Website & Code'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'تحميل الموقع (ZIP)' : 'Download (ZIP)'}</span>
                <span className="sm:hidden">{lang === 'ar' ? 'تحميل' : 'Download'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              id="lang-switcher-btn"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation & Branding Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Prominent Official Brand Logo & Identity */}
          <button
            onClick={() => handlePageClick('home')}
            id="brand-logo-btn"
            className="flex items-center gap-2.5 sm:gap-3 group text-start cursor-pointer focus:outline-none shrink-0"
          >
            {/* Official Kemizone Logo */}
            <div className="relative bg-white rounded-xl p-1 sm:p-1.5 shadow-sm border border-slate-200 flex items-center justify-center transition-all group-hover:border-emerald-600 shrink-0">
              <KemizoneLogo className="h-8 sm:h-10 md:h-11 w-auto" />
            </div>

            {/* Corporate Name */}
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-xs sm:text-sm lg:text-base font-extrabold text-emerald-950 tracking-normal truncate">
                {lang === 'ar' ? 'شركة كميزون كميكال التجارية' : 'Kemizone Chemical Commercial .Co'}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold hidden md:block truncate">
                {lang === 'ar' ? 'توريد وتوزيع المواد الكيميائية الصناعية' : 'Industrial & Specialty Chemical Raw Materials'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 ms-4 xl:ms-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-slate-200 shadow-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`p-3 rounded-xl text-xs sm:text-sm font-bold text-start transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {onOpenDownloadCenter && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDownloadCenter();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>{lang === 'ar' ? 'تحميل ملفات الموقع والاستضافة (ZIP)' : 'Download Website & Code (ZIP)'}</span>
              </button>
            )}

            <button
              onClick={() => handlePageClick('contact')}
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تواصل وتنسيق اجتماع شخصي' : 'Connect & Schedule Meeting'}</span>
            </button>

            {customPhone && (
              <a
                href={`tel:${customPhone}`}
                className="w-full py-2 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                dir="ltr"
              >
                {lang === 'ar' ? `جوال: ${customPhone}` : `Mobile: ${customPhone}`}
              </a>
            )}
            {customLandline && (
              <a
                href={`tel:${customLandline}`}
                className="w-full py-2 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                dir="ltr"
              >
                {lang === 'ar' ? `هاتف أرضي: ${customLandline}` : `Landline: ${customLandline}`}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
