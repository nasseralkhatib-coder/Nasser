import React, { useState } from 'react';
import { Play, Pause, Video, Maximize2, ShieldCheck, Sparkles, Volume2, VolumeX, Eye, Camera } from 'lucide-react';
import { Language } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { useStoredImage } from '../hooks/useStoredImage';
import { ImageUploadButton } from './ImageUploadButton';
import { resolveAssetUrl } from '../utils/assetUrl';

interface WarehouseDroneSpotlightProps {
  lang: Language;
  currentTheme: ThemeMode;
  onExploreProducts: () => void;
}

export const WarehouseDroneSpotlight: React.FC<WarehouseDroneSpotlightProps> = ({
  lang,
  currentTheme,
  onExploreProducts,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const { imageSrc } = useStoredImage('warehouse_drone_spotlight', '');
  const activeTheme = themeOptions[currentTheme];

  return (
    <div className="rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border-4 border-slate-800 relative group">
      
      {/* Simulation Screen Header */}
      <div className="bg-slate-900/90 px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-red-400">
              {lang === 'ar' ? 'تصوير درون المستودع' : 'DRONE CAM 01 - INVENTORY INSPECTION'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30 hidden sm:inline">
            {lang === 'ar' ? 'سعة تخزين آمنة ومعيارية' : 'Safety Stacking Compliant'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ImageUploadButton
            imageKey="warehouse_drone_spotlight"
            defaultSrc=""
            labelAr={lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
            variant="floating"
          />
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        
        {/* Background Warehouse Footage Simulation or Placeholder */}
        {imageSrc ? (
          <img 
            src={resolveAssetUrl(imageSrc)} 
            alt="Kemizone Warehouse"
            className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <Camera className="w-10 h-10 text-emerald-400 mb-2 opacity-80" />
            <p className="text-sm font-bold text-white mb-1">
              {lang === 'ar' ? 'لم يتم رفع صورة للمستودع والدرون بعد' : 'No warehouse/drone image uploaded yet'}
            </p>
            <p className="text-xs text-emerald-400/90 font-medium">
              {lang === 'ar' ? 'انقر على زر "تغيير الصورة" بالأعلى لرفع صورة المستودع والدرون' : 'Click "Change Image" above to upload'}
            </p>
          </div>
        )}

        {/* HUD Scanner Visual Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Crosshair Viewfinder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-48 h-40 sm:h-48 border border-emerald-400/30 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
          <div className="w-8 sm:w-12 h-8 sm:h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Top Left Telemetry HUD */}
        <div className="absolute top-4 left-4 font-mono text-[10px] sm:text-[11px] text-emerald-400/90 space-y-1 bg-slate-950/70 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm border border-emerald-500/20">
          <div>ALTITUDE: 1.85m</div>
          <div>STATUS: TIER INSPECTION OK</div>
          <div>DRUMS: 4-LAYER STACK COMPLIANT</div>
          <div>BAGS: 10-LAYER STACK COMPLIANT</div>
        </div>

        {/* Top Right Scan Result */}
        <div className="absolute top-4 right-4 font-mono text-[10px] sm:text-[11px] text-white space-y-1 bg-slate-950/70 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm border border-slate-700 text-end">
          <div className="text-emerald-400 font-bold">KEMIZONE LOGISTICS</div>
          <div className="text-slate-300">{lang === 'ar' ? 'فحص تخزين المواد الخام' : 'Raw Materials Safety Inspection'}</div>
          <div className="text-xs text-emerald-400 font-bold">100% VERIFIED</div>
        </div>

        {/* Bottom Info Bar Overlay */}
        <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 p-3 sm:p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
          <div className="text-center sm:text-start">
            <h4 className="font-bold text-xs sm:text-sm text-white">
              {lang === 'ar' ? 'فيديو جولة درون في مستودعات شركة كميزون' : 'Kemizone Warehouse Autonomous Drone Inspection'}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300">
              {lang === 'ar' 
                ? 'ارتفاعات تخزين مثالية ومطابقة لاشتراطات السلامة (أقصى ارتفاع 4 براميل و 10 أكياس).' 
                : 'Safety-compliant moderate storage heights: max 4 tiers of drums and 10 layers of bags.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExploreProducts}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTheme.buttonClass} shadow cursor-pointer transition-colors`}
            >
              {lang === 'ar' ? 'استعراض المواد المتوفرة' : 'Browse Stock Catalog'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
