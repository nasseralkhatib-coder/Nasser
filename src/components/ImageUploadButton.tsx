import React, { useRef, useState } from 'react';
import { Upload, Check, RotateCcw, Image as ImageIcon, Camera } from 'lucide-react';
import { useStoredImage } from '../hooks/useStoredImage';
import { isStudioDevEnvironment } from '../utils/envUtils';

interface ImageUploadButtonProps {
  imageKey: string;
  defaultSrc?: string;
  labelAr?: string;
  labelEn?: string;
  variant?: 'floating' | 'bar' | 'compact';
  className?: string;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  imageKey,
  defaultSrc,
  labelAr = 'تغيير الصورة',
  labelEn = 'Change Image',
  variant = 'floating',
  className = '',
}) => {
  // Lock images and completely remove image change option on published/live site
  if (!isStudioDevEnvironment()) {
    return null;
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isCustom, uploadImage, resetImage } = useStoredImage(imageKey, defaultSrc);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saved'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    try {
      await uploadImage(file);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Upload failed', err);
      setStatus('idle');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await resetImage();
    setStatus('idle');
  };

  if (variant === 'bar') {
    return (
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`w-full bg-slate-900/95 backdrop-blur-md text-white py-2 px-3.5 flex items-center justify-between gap-2 border-b border-emerald-500/30 text-xs z-30 ${className}`}
      >
        <div className="flex items-center gap-1.5 font-bold truncate">
          <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{labelAr}</span>
          {isCustom && (
            <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded font-mono">
              مُخصصة
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>{status === 'uploading' ? 'جارٍ التحميل...' : status === 'saved' ? '✓ تم الحفظ' : 'تحميل صورة جديدة'}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {isCustom && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="استعادة الصورة الأصلية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Floating variant (default)
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className={`z-30 flex items-center gap-1.5 select-none ${className}`}
    >
      <label 
        className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-lg border backdrop-blur-md transition-all group ${
          status === 'saved'
            ? 'bg-emerald-700/95 border-emerald-400'
            : status === 'uploading'
            ? 'bg-amber-600/95 border-amber-300'
            : 'bg-slate-950/85 hover:bg-emerald-700 border-white/25 hover:border-emerald-400'
        }`}
        title="انقر لاختيار صورة من جهازك وتغييرها فوراً"
      >
        {status === 'saved' ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-medium">تم الحفظ بنجاح</span>
          </>
        ) : status === 'uploading' ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white font-medium">جارٍ الحفظ...</span>
          </>
        ) : (
          <>
            <Camera className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white transition-colors shrink-0" />
            <span className="whitespace-nowrap font-medium text-slate-100 group-hover:text-white">{labelAr}</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {isCustom && (
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-rose-800 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/30 hover:border-rose-400 backdrop-blur-md shadow-lg transition-colors flex items-center gap-1 cursor-pointer"
          title="استعادة الصورة الافتراضية"
        >
          <RotateCcw className="w-3 h-3 text-rose-300 shrink-0" />
          <span className="hidden sm:inline">استعادة الأصل</span>
        </button>
      )}
    </div>
  );
};

