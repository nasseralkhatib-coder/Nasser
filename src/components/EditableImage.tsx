import React, { useState } from 'react';
import { useStoredImage } from '../hooks/useStoredImage';
import { FlaskConical, Camera } from 'lucide-react';
import { ImageUploadButton } from './ImageUploadButton';
import { isStudioDevEnvironment } from '../utils/envUtils';
import { resolveAssetUrl } from '../utils/assetUrl';

interface EditableImageProps {
  imageKey: string;
  defaultSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  labelAr?: string;
  labelEn?: string;
  placeholderType?: 'black' | 'standard';
  productName?: string;
  productFormula?: string;
  objectFit?: 'cover' | 'contain';
  onErrorFallback?: string;
  showChangeButton?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  imageKey,
  defaultSrc,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full overflow-hidden',
  labelAr = 'تغيير الصورة',
  labelEn = 'Change Image',
  placeholderType = 'standard',
  productName,
  productFormula,
  objectFit = 'cover',
  onErrorFallback,
  showChangeButton = true,
}) => {
  const { imageSrc, isCustom } = useStoredImage(imageKey, defaultSrc);
  const [hasError, setHasError] = useState(false);

  // If user uploaded custom image, reset error
  React.useEffect(() => {
    setHasError(false);
  }, [imageSrc]);

  const showFallback = !imageSrc || (hasError && !isCustom);

  return (
    <div className={`relative group/editable-img ${containerClassName}`}>
      {/* Change Image Button - Prominently accessible on top of the image in dev environment only */}
      {showChangeButton && isStudioDevEnvironment() && (
        <div className="absolute top-3 left-3 z-30 pointer-events-auto">
          <ImageUploadButton
            imageKey={imageKey}
            defaultSrc={defaultSrc}
            labelAr={labelAr}
            labelEn={labelEn}
            variant="floating"
          />
        </div>
      )}

      {/* Render Image or Black Placeholder */}
      {!showFallback ? (
        <img
          src={resolveAssetUrl(imageSrc)}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`${className} ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          onError={() => {
            const resolvedFallback = onErrorFallback ? resolveAssetUrl(onErrorFallback) : null;
            if (resolvedFallback && !isCustom && imageSrc !== resolvedFallback) {
              // try fallback
            } else {
              setHasError(true);
            }
          }}
        />
      ) : placeholderType === 'black' ? (
        <div className="w-full h-full min-h-[140px] bg-slate-950 flex flex-col items-center justify-center p-4 text-white text-center border border-dashed border-slate-700">
          <FlaskConical className="w-7 h-7 text-emerald-400 mb-1" />
          {productName && (
            <span className="text-xs font-bold text-slate-200 tracking-wider truncate max-w-full px-2">
              {productName}
            </span>
          )}
          {productFormula && (
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {productFormula}
            </span>
          )}
          <span className="text-[11px] text-emerald-400 font-bold mt-2 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            انقر على &ldquo;رفع صورة&rdquo; بالأعلى
          </span>
        </div>
      ) : (
        <div className="w-full h-full min-h-[220px] bg-slate-950 border-2 border-dashed border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mb-3">
            <Camera className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-sm font-bold text-white mb-1">مساحة مخصصة لرفع صورتك الجديدة</span>
          <span className="text-xs font-medium text-emerald-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700">
            اضغط على زر &ldquo;{labelAr}&rdquo; بالأعلى لاختيار وحفظ الصورة
          </span>
        </div>
      )}
    </div>
  );
};

