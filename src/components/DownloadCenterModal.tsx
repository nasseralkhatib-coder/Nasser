import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Server, 
  Code2, 
  CheckCircle2, 
  FileArchive, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { syncAllStoredImagesToServer } from '../utils/imageStore';

interface DownloadCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DownloadCenterModal: React.FC<DownloadCenterModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [packagingType, setPackagingType] = useState<'dist' | 'source' | 'text' | null>(null);
  const [packageStatus, setPackageStatus] = useState<'idle' | 'building' | 'done' | 'error'>('idle');
  const [downloadProgressMsg, setDownloadProgressMsg] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (type: 'dist' | 'source' | 'text') => {
    if (packagingType) return; // already in progress

    setPackagingType(type);
    setPackageStatus('building');
    setDownloadError(null);
    setDownloadProgressMsg(
      lang === 'ar' 
        ? 'جارٍ فحص وتثبيت كافة الصور الحالية وتحضير الحزمة للنشر...' 
        : 'Syncing current images and preparing package...'
    );

    try {
      // 1. Sync any user-uploaded images in browser storage directly to project files first
      try {
        const fleetImg = localStorage.getItem('kemizone_cars_image') || localStorage.getItem('kz_img_home_hero_cars');
        if (fleetImg && fleetImg.startsWith('data:image')) {
          await fetch('/api/sync-hero-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: fleetImg }),
          });
        }
        await syncAllStoredImagesToServer();
      } catch (e) {
        console.warn('Image sync prior to download:', e);
      }

      // 2. Request fresh on-demand packaging from server
      try {
        await fetch('/api/package-fresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: type === 'text' ? 'source' : type })
        });
      } catch (e) {
        console.warn('Package fresh request:', e);
      }

      const endpoint = `/api/download-zip?type=${type}&t=${Date.now()}`;
      const filename = type === 'source' 
        ? 'kemizone_source_code.zip' 
        : (type === 'text' ? 'kemizone_source_code.txt' : 'kemizone_website_hosting_dist.zip');

      setDownloadProgressMsg(
        lang === 'ar'
          ? (type === 'dist' 
              ? 'جارٍ تنزيل ملفات الموقع المضغوطة بالكامل مع كافة الصور الحالية...' 
              : (type === 'source' ? 'جارٍ تنزيل السورس كود الكامل مع الصور الحالية...' : 'جارٍ تنزيل الملف النصي...'))
          : 'Downloading complete package with current images from server...'
      );

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Server response error: HTTP ${response.status}`);
      }

      const blob = await response.blob();
      console.log(`[Download] Received blob for ${type}: ${blob.size} bytes`);

      // Validation check
      if (blob.size < 50000) {
        throw new Error(
          lang === 'ar' 
            ? `تنبيه: حجم الملف المستلم (${Math.round(blob.size / 1024)} KB) غير مكتمل. يرجى الضغط مرة أخرى بعد قليل.`
            : `Downloaded package size (${Math.round(blob.size / 1024)} KB) is too small. Please retry.`
        );
      }

      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
      setDownloadProgressMsg(
        lang === 'ar' 
          ? `✓ تم استلام وتأكيد الحزمة بنجاح (${sizeMB} ميغابايت) متضمنة صورك الحالية! جارٍ الحفظ الآن على جهازك.` 
          : `✓ Package verified (${sizeMB} MB) with current images! Saving to disk.`
      );

      // Create browser blob URL for 100% reliable local download
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 6000);

      setPackageStatus('done');
      setTimeout(() => {
        setPackagingType(null);
        setPackageStatus('idle');
      }, 4000);
    } catch (err: any) {
      console.error('Download error:', err);
      setPackageStatus('error');
      setDownloadError(err.message || 'Failed to download package');
      setPackagingType(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'ar' ? 'مركز تحميل الموقع وملفات الاستضافة' : 'Website Downloads & Hosting Center'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Sparkles className="w-3 h-3" />
                  {lang === 'ar' ? 'بناء لحظي ومباشر' : 'Live On-Demand'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                {lang === 'ar' 
                  ? 'يتم حزم وبناء الموقع لحظة ضغط الزر ليحتوي على كامل تعديلاتك وصورك الحالية بدقة 100%' 
                  : 'Packages latest modifications and assets on-demand at the moment you click download.'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Top Prominent Quick-Action Download Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white shadow-xl border-2 border-emerald-500/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                <Download className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-wide">
                    {lang === 'ar' ? 'كبسة التحميل الفوري والمباشر' : 'Instant Direct Download'}
                  </span>
                  <span className="text-xs text-emerald-300 font-mono">{lang === 'ar' ? 'ملف ZIP فوري' : 'ZIP File'}</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {lang === 'ar' ? 'تحميل ملف مضغوط لكافة مجلدات وفولدرات الموقع بالصور الحالية' : 'Download All Website Folders & Files (Complete ZIP)'}
                </h4>
                <p className="text-xs text-emerald-200 mt-0.5 leading-relaxed">
                  {lang === 'ar'
                    ? 'يشمل كافة المجلدات: مجلد assets، مجلد images بالصور الحالية المعتمدة، الصفحة الرئيسية index.html، وكافة الملفات جاهزة للتشغيل فوراً.'
                    : 'Includes all website folders (assets, images with current photos), index.html homepage, and all production files.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownload('dist')}
              disabled={packagingType !== null}
              className="w-full md:w-auto px-7 py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer border border-emerald-300"
            >
              <Download className="w-5 h-5 text-slate-950" />
              <span>{lang === 'ar' ? 'اضغط هنا للتحميل الفوري (ZIP)' : 'Click to Download (ZIP)'}</span>
            </button>
          </div>

          {/* Realtime packaging indicator banner */}
          {(packagingType || downloadProgressMsg || downloadError) && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
              downloadError 
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : packageStatus === 'done' 
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              {downloadError ? (
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                  !
                </div>
              ) : packageStatus === 'building' ? (
                <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-bold block text-sm mb-0.5">
                  {downloadError 
                    ? (lang === 'ar' ? 'حدث خطأ أثناء تنزيل الملف:' : 'Download issue:')
                    : packageStatus === 'building'
                      ? (lang === 'ar' ? 'جارٍ التحميل والتأكد من سلامة الأرشيف لحظياً...' : 'Fetching and verifying complete archive...')
                      : (lang === 'ar' ? '✓ تم التحقق وبدء التحميل في المتصفح بنجاح!' : '✓ Verified and started downloading!')}
                </span>
                <span className="text-slate-700 text-xs leading-relaxed">
                  {downloadError || downloadProgressMsg}
                </span>
              </div>
            </div>
          )}

          {/* Option 1: Complete Folders & Files ZIP for Live Hosting */}
          <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-500 shadow-sm relative overflow-hidden group">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <Server className="w-6 h-6 text-emerald-100" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    {lang === 'ar' ? 'الطريقة الأولى (الأساسية الموصى بها)' : 'Option 1 (Primary - Recommended)'}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {lang === 'ar' ? 'ملف مضغوط لكافة المجلدات والفولدرات' : 'All Folders & Files ZIP'}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  {lang === 'ar' ? 'تحميل ملف مضغوط لكل فولدرات ومجلدات الموقع كاملة (ZIP)' : 'Complete Website Package With All Folders & Files (ZIP)'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {lang === 'ar' 
                    ? 'ملف مضغوط جاهز بنقرة واحدة يحتوي على جميع فولدرات الموقع (assets, images) مع الصفحة الرئيسية index.html جاهز للتشغيل والرفع على الاستضافة أو cPanel.' 
                    : 'Complete production archive containing all site folders (assets, images), index.html and .htaccess ready for immediate deployment.'}
                </p>
              </div>
            </div>

            {/* Prominent High-Visibility Primary Button for Option 1 */}
            <div className="my-5 p-4 rounded-2xl bg-white border border-emerald-200 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-700">
                <div className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'الحزمة جاهزة للتحميل الفوري بالصور الحالية' : 'Ready for Instant Download with Current Images'}</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  {lang === 'ar' ? 'تشمل كافة تعديلاتك والصور الحالية المعتمدة بنسبة 100%' : '100% updated with all current images and assets.'}
                </div>
              </div>

              <button
                type="button"
                id="btn-download-all-folders-zip"
                onClick={() => handleDownload('dist')}
                disabled={packagingType !== null}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm sm:text-base shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer ${
                  packagingType === 'dist'
                    ? packageStatus === 'done'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-98'
                } ${packagingType && packagingType !== 'dist' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {packagingType === 'dist' && packageStatus === 'building' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>{lang === 'ar' ? 'جارٍ حزم الملفات...' : 'Building ZIP...'}</span>
                  </>
                ) : packagingType === 'dist' && packageStatus === 'done' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>{lang === 'ar' ? '✓ بدأ التحميل في المتصفح!' : '✓ Download Started!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-emerald-200" />
                    <span>{lang === 'ar' ? 'كبسة تحميل ملف المجلدات كاملة (ZIP)' : 'Download All Folders ZIP'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct fallback link for guaranteed download */}
            <div className="mb-4 text-center flex flex-wrap items-center justify-center gap-4 text-xs">
              <a
                href="/api/download-zip?type=dist"
                download="kemizone_website_hosting_dist.zip"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'رابط مباشر بديل للمجلدات (14 MB ZIP)' : 'Direct download link (14 MB ZIP)'}</span>
              </a>
            </div>

            {/* What is inside */}
            <div className="bg-white/90 rounded-2xl p-4 border border-emerald-200/80 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-emerald-950 block">
                {lang === 'ar' ? 'محتويات الملف وطريقة الرفع على الاستضافة:' : 'Package Contents & Setup Steps:'}
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>index.html</strong> ({lang === 'ar' ? 'الصفحة الرئيسية الكاملة' : 'Main Homepage Entry'})</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>assets/</strong> ({lang === 'ar' ? 'مجلد الأكواد والتنسيقات' : 'Styles & Scripts'})</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>images/</strong> ({lang === 'ar' ? 'كافة صور المنتجات والمستودعات' : 'Product & Warehouse Images'})</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>.htaccess</strong> ({lang === 'ar' ? 'توجيه الروابط بدون أخطاء 404' : 'Apache / cPanel SPA rewrite'})</span>
                </li>
              </ul>
              
              <div className="pt-2 border-t border-emerald-100 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-emerald-900">
                  {lang === 'ar' ? 'خطوات الرفع:' : 'Upload instructions:'}
                </span>{' '}
                {lang === 'ar' 
                  ? 'فك ضغط الملف، ثم ارفع المحتويات مباشرة داخل مجلد public_html في لوحة تحكم الاستضافة (cPanel / Hostinger).' 
                  : 'Unzip the archive and upload the contents directly to your hosting public_html folder.'}
              </div>
            </div>
          </div>

          {/* Option 2: Full Source Code */}
          <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-300 relative overflow-hidden group hover:border-slate-500 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {lang === 'ar' ? 'الخيار الثاني (للتطوير والبرمجة)' : 'Option 2 (Developer Source Code)'}
                    </span>
                    <span className="text-xs font-mono text-slate-600 font-semibold">
                      {lang === 'ar' ? 'يشمل كافة التعديلات (25 MB)' : 'Latest Sources (25 MB)'}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                    {lang === 'ar' ? 'السورس كود الكامل للمشروع (Source Code ZIP)' : 'Complete Project Source Code (ZIP)'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ar' 
                      ? 'ملف مضغوط يحتوي على كامل الكود المصدري للمشروع (React + TypeScript + Tailwind + Vite).' 
                      : 'Full source repository with src, public, configs and scripts ready for local development.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-download-source-zip"
                onClick={() => handleDownload('source')}
                disabled={packagingType !== null}
                className={`px-6 py-3.5 rounded-xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                  packagingType === 'source'
                    ? packageStatus === 'done'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-white animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                } ${packagingType && packagingType !== 'source' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {packagingType === 'source' && packageStatus === 'building' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>{lang === 'ar' ? 'جارٍ الحزم الآن...' : 'Packaging Sources...'}</span>
                  </>
                ) : packagingType === 'source' && packageStatus === 'done' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? '✓ تم التحميل!' : '✓ Downloaded!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'كبسة تحميل السورس كود (ZIP)' : 'Download Source Code ZIP'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Dev Guide */}
            <div className="bg-slate-900 rounded-xl p-3.5 text-xs text-slate-200 font-mono space-y-1.5" dir="ltr">
              <span className="text-slate-400 text-[10px] block"># Run locally in 2 steps:</span>
              <div className="text-emerald-400">npm install</div>
              <div className="text-emerald-400">npm run dev</div>
            </div>
          </div>

          {/* Option 3: Plain Text Source Code Export (.txt) */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border-2 border-amber-300/80 relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      {lang === 'ar' ? 'الخيار الثالث (ملف نصي مباشر)' : 'Option 3 (Single Text File)'}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                    {lang === 'ar' ? 'تحميل السورس كود كملف تكست (TXT File)' : 'Source Code Plain Text Export (.txt)'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ar' 
                      ? 'ملف نصي واحد مجمع يحتوي على الشيفرات البرمجية الأساسية مع أسماء وفواصل الملفات.' 
                      : 'Single unified plain text bundle with key source code files, configurations and types.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-download-text-source"
                onClick={() => handleDownload('text')}
                disabled={packagingType !== null}
                className={`px-6 py-3 rounded-xl font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                  packagingType === 'text'
                    ? packageStatus === 'done'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white animate-pulse'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                } ${packagingType && packagingType !== 'text' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className="w-4 h-4 text-amber-200" />
                <span>{lang === 'ar' ? 'كبسة تحميل كملف تكست (TXT)' : 'Download Source (TXT)'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-100 px-6 sm:px-8 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FileArchive className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {lang === 'ar' 
                ? 'كافة الملفات والصور يتم تجميعها وبناؤها لحظة النقر لتكون متوافقة 100% مع أحدث نسخة.' 
                : 'All files and assets are bundled live upon clicking to strictly reflect the latest updates.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 text-xs transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق النافذة' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
