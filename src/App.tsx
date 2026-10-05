import React, { useState, useEffect } from 'react';
import { Language, PageId } from './types';
import { ThemeMode, themeOptions } from './theme';
import { isStudioDevEnvironment } from './utils/envUtils';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DownloadCenterModal } from './components/DownloadCenterModal';
import { syncAllStoredImagesToServer } from './utils/imageStore';

// Multi-Page Views
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { QualityPage } from './pages/QualityPage';
import { SupplyChainPage } from './pages/SupplyChainPage';
import { BranchesPage } from './pages/BranchesPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  // Language state (default Arabic, toggleable to English)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kemizone_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  // Active Multi-Page routing state
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  // Single default brand theme (light green matching logo with white background)
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('logo-brand');

  const customPhone = '+966 50 482 2515';
  const customLandline = '+966 13 512 2036';
  const customEmail = 'nasser.alkhatib@kemizone.com';

  // Download Center Modal state - strictly visible ONLY in Google AI Studio dev/programming environment (iframe)
  const [isDevStudio, setIsDevStudio] = useState(() => isStudioDevEnvironment());
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    setIsDevStudio(isStudioDevEnvironment());
    // In dev studio, automatically sync stored images to project files
    if (isStudioDevEnvironment()) {
      syncAllStoredImagesToServer().catch(() => {});
    }
  }, []);

  // Sync document direction and lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('kemizone_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTheme = themeOptions[currentTheme];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${activeTheme.bg} ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
      
      {/* 1. Universal Top Navbar with Logo, Navigation Tabs & Direct Contact */}
      <Navbar
        lang={lang}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleLanguage={toggleLanguage}
        currentTheme={currentTheme}
        onSelectTheme={(t) => setCurrentTheme(t)}
        customPhone={customPhone}
        customLandline={customLandline}
        customEmail={customEmail}
        onOpenDownloadCenter={isDevStudio ? () => setIsDownloadModalOpen(true) : undefined}
      />

      {/* 2. Main Multi-Page Routed View Container */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
            customPhone={customPhone}
            customLandline={customLandline}
            customEmail={customEmail}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'industries' && (
          <IndustriesPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'quality' && (
          <QualityPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'supply-chain' && (
          <SupplyChainPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'branches' && (
          <BranchesPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            lang={lang}
            currentTheme={currentTheme}
            onNavigate={handleNavigate}
            customPhone={customPhone}
            customLandline={customLandline}
            customEmail={customEmail}
          />
        )}
      </main>

      {/* 3. Universal Footer with GCC branding and direct contact */}
      <Footer
        lang={lang}
        onNavigate={handleNavigate}
        onToggleLanguage={toggleLanguage}
        currentTheme={currentTheme}
        customPhone={customPhone}
        customLandline={customLandline}
        customEmail={customEmail}
        onOpenDownloadCenter={isDevStudio ? () => setIsDownloadModalOpen(true) : undefined}
      />

      {/* 4. Download Center Modal for Hosting Dist & Source Code ZIPs (only in Google AI Studio dev environment) */}
      {isDevStudio && (
        <DownloadCenterModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
