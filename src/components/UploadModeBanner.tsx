import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, Sparkles, X, Download, UploadCloud, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';
import { getAllStoredImageKeys, syncAllStoredImagesToServer, exportAllStoredImagesAsJSON, importStoredImagesFromJSON, clearAllStoredImages } from '../utils/imageStore';
import { Language } from '../types';

interface UploadModeBannerProps {
  lang: Language;
}

export const UploadModeBanner: React.FC<UploadModeBannerProps> = ({ lang }) => {
  const [uploadedCount, setUploadedCount] = useState<number>(0);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const refreshCount = async () => {
    const keys = await getAllStoredImageKeys();
    setUploadedCount(keys.length);
  };

  useEffect(() => {
    refreshCount();

    // Auto-sync on load in background to freeze images into project disk
    const timer = setTimeout(() => {
      handleSyncToServer(true);
    }, 1200);

    const handleUpdate = () => {
      refreshCount();
      // Auto save to disk whenever an image changes
      handleSyncToServer(true);
    };

    window.addEventListener('kz-image-updated', handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('kz-image-updated', handleUpdate);
    };
  }, []);

  const handleSyncToServer = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const fleetImg = localStorage.getItem('kemizone_cars_image') || localStorage.getItem('kz_img_home_hero_cars');
      if (fleetImg && fleetImg.startsWith('data:image')) {
        await fetch('/api/sync-hero-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: fleetImg }),
        }).catch(() => {});
      }
      const res = await syncAllStoredImagesToServer();
      if (res.success && res.count > 0) {
        setSyncStatus(lang === 'ar' ? `تم تثبيت ${res.count} صورة في ملفات الموقع للنشر!` : `${res.count} images saved to project files!`);
        setTimeout(() => setSyncStatus(null), 5000);
      } else if (!silent) {
        setSyncStatus(lang === 'ar' ? 'الصور مثبتة ومحفوظة مسبقاً في ملفات الموقع' : 'Images already persisted to project files');
        setTimeout(() => setSyncStatus(null), 4000);
      }
    } catch (err: any) {
      if (!silent) {
        setSyncStatus(lang === 'ar' ? 'تم الحفظ في المتصفح وجار المزامنة' : 'Saved in browser storage');
      }
    } finally {
      if (!silent) setIsSyncing(false);
      refreshCount();
    }
  };

  const handleExportBackup = async () => {
    await exportAllStoredImagesAsJSON();
  };

  const handleClearAll = async () => {
    const confirmMsg = lang === 'ar' 
      ? 'هل أنت متأكد من مسح جميع الصور المخزنة وإعادة كل الأماكن فارغة بانتظار رفع الصور الجديدة؟'
      : 'Are you sure you want to clear all stored images?';
    if (window.confirm(confirmMsg)) {
      await clearAllStoredImages();
      refreshCount();
      setSyncStatus(lang === 'ar' ? 'تم مسح كافة الصور بنجاح' : 'All stored images cleared');
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const res = await importStoredImagesFromJSON(text);
        if (res.success) {
          alert(lang === 'ar' ? `تم استيراد وتثبيت ${res.count} صورة بنجاح!` : `Successfully restored ${res.count} images!`);
          refreshCount();
        }
      }
    };
    input.click();
  };

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 start-4 z-50 p-2.5 rounded-full bg-emerald-800 text-white shadow-xl hover:bg-emerald-900 border border-emerald-500 cursor-pointer flex items-center gap-2 text-xs font-bold transition-all"
        title="إدارة وتثبيت الصور"
      >
        <Camera className="w-4 h-4" />
        <span>{lang === 'ar' ? 'إدارة وتثبيت الصور' : 'Manage Images'}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 start-4 end-4 sm:end-auto sm:max-w-lg z-50 bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-500 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-emerald-400">
                {lang === 'ar' ? 'تثبيت ونشر صور الموقع' : 'Image Persistence & Publish'}
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-500/40">
                {uploadedCount} {lang === 'ar' ? 'صورة مرفوعة' : 'uploaded'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {lang === 'ar'
                ? 'تم تفعيل التثبيت التلقائي للصور في ملفات المشروع حتى تظهر للجميع عند النشر. يمكنك تغيير أي صورة متى شئت عبر زر "رفع / تغيير الصورة" الموجود فوق كل صورة.'
                : 'Automatic persistence is active. Your uploaded images are saved to project files for deployment. You can still change any image anytime via the upload button.'}
            </p>

            {syncStatus && (
              <div className="mt-2 text-xs font-bold text-emerald-300 flex items-center gap-1.5 bg-emerald-950/70 py-1 px-2.5 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{syncStatus}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleSyncToServer(false)}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>
                  {isSyncing
                    ? (lang === 'ar' ? 'جار التثبيت...' : 'Persisting...')
                    : (lang === 'ar' ? 'تثبيت الصور للنشر الآن' : 'Persist for Publish')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleExportBackup}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium cursor-pointer transition-all flex items-center gap-1 border border-slate-700"
                title="تنزيل نسخة احتياطية من كافة الصور المرفوعة"
              >
                <Download className="w-3 h-3 text-slate-300" />
                <span>{lang === 'ar' ? 'نسخ احتياطي (JSON)' : 'Backup (JSON)'}</span>
              </button>

              <button
                type="button"
                onClick={handleImportClick}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium cursor-pointer transition-all flex items-center gap-1 border border-slate-700"
                title="استيراد نسخة صور من ملف JSON"
              >
                <RefreshCw className="w-3 h-3 text-slate-300" />
                <span>{lang === 'ar' ? 'استيراد' : 'Import'}</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 hover:text-white text-xs font-medium cursor-pointer transition-all flex items-center gap-1 border border-rose-800/60"
                title="مسح كافة الصور المخزنة"
              >
                <Trash2 className="w-3 h-3 text-rose-300" />
                <span>{lang === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title="تصغير الشريط"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
