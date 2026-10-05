import React, { useState } from 'react';
import { ChemicalProduct, Language } from '../types';
import { 
  Package, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Layers, 
  FlaskConical,
  Pencil,
  Trash2,
  Video
} from 'lucide-react';
import { useStoredImage } from '../hooks/useStoredImage';
import { ImageUploadButton } from './ImageUploadButton';
import { resolveAssetUrl } from '../utils/assetUrl';
import { isDevEnvironment } from '../utils/envHelper';

interface ProductCardProps {
  product: ChemicalProduct;
  lang: Language;
  onSelectProduct?: (product: ChemicalProduct) => void;
  onEdit?: (product: ChemicalProduct) => void;
  onDelete?: (product: ChemicalProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onSelectProduct,
  onEdit,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { imageSrc, isCustom } = useStoredImage(`product_${product.id}`, product.imageUrl);
  const isDev = isDevEnvironment();

  // Reset imgError if imageSrc or product.imageUrl changes
  React.useEffect(() => {
    setImgError(false);
    setRetryCount(0);
  }, [imageSrc, product.imageUrl]);

  // Determine if liquid or powder to show packaging icon
  const isLiquid = product.packaging.en.toLowerCase().includes('drum') || 
                   product.packaging.en.toLowerCase().includes('200l') ||
                   product.packaging.ar.includes('براميل') ||
                   product.packaging.ar.includes('200 لتر');

  const hasVideo = Boolean(product.videoUrl);
  const currentImage = imageSrc || product.imageUrl || `/images/uploads/uploaded_product_${product.id}.jpg`;
  const hasValidImage = !!currentImage && !imgError;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgEl = e.currentTarget;
    if (retryCount === 0) {
      setRetryCount(1);
      const cleanPath = (currentImage || '').replace(/^(\.\/|\/)+/, '');
      if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        imgEl.src = '/' + cleanPath;
      } else {
        imgEl.src = './' + cleanPath;
      }
    } else {
      setImgError(true);
    }
  };

  return (
    <div className="group rounded-3xl bg-white border border-emerald-100 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      <div>
        {/* Product Media - Pure white background without any dark sidebars */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-white border-b border-slate-100 flex items-center justify-center p-2">
          {hasVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <video 
                src={resolveAssetUrl(product.videoUrl!)} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-rose-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-20">
                <Video className="w-2.5 h-2.5" />
                <span>VIDEO</span>
              </div>
            </div>
          ) : hasValidImage ? (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <img 
                src={resolveAssetUrl(currentImage!)} 
                alt={product.name[lang]} 
                referrerPolicy="no-referrer"
                loading="lazy"
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105 block mx-auto"
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2 border border-emerald-100">
                <FlaskConical className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="text-xs font-bold text-slate-800 tracking-wider truncate max-w-full px-2">
                {product.name[lang]}
              </span>
            </div>
          )}

          {/* Top Floating Badge for Packaging (25kg or 200L) */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 pointer-events-none z-10">
            <Package className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{isLiquid ? '200L' : '25KG'}</span>
          </div>

          {/* DEV-ONLY CONTROLS (Delete & Edit) - Strictly visible in development screen only */}
          {isDev && (
            <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-emerald-500/40 shadow-lg">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  title={lang === 'ar' ? 'تعديل بيانات أو صورة المادة (بيئة التطوير)' : 'Edit material / media (Dev mode)'}
                  className="p-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product);
                  }}
                  title={lang === 'ar' ? 'حذف المادة الكيميائية بالكامل (بيئة التطوير)' : 'Delete material completely (Dev mode)'}
                  className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* CAS Number Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {isLiquid 
                ? (lang === 'ar' ? 'سائل / مستحلب' : 'Liquid / Emulsion') 
                : (lang === 'ar' ? 'مسحوق / حبيبات' : 'Powder / Granules')}
            </span>
            {product.casNumber && (
              <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200" dir="ltr">
                CAS: {product.casNumber}
              </span>
            )}
          </div>

          {/* Chemical Name - Fully shown on 2 lines with consistent height, NO ellipses or cutting words */}
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors mb-2 leading-snug min-h-[2.85rem] flex items-center break-words">
            {product.name[lang]}
          </h3>

          {/* Appearance Description - fully readable and expanded */}
          <div className="mb-3 text-xs text-slate-700 leading-relaxed bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-900 font-bold block mb-0.5">
              {lang === 'ar' ? 'المظهر:' : 'Appearance:'}
            </span>
            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
              {product.appearance[lang]}
            </p>
          </div>

          {/* Packaging Spec - 100% full text display, zero truncation, zero overflow */}
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] mb-1">
              <Package className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{lang === 'ar' ? 'التعبئة:' : 'Packaging:'}</span>
            </div>
            <p className="font-bold text-emerald-950 text-xs leading-relaxed break-words">
              {product.packaging[lang]}
            </p>
          </div>

          {/* Applications list */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
              {lang === 'ar' ? 'أبرز الاستخدامات والتطبيقات:' : 'Key Applications:'}
            </span>
            <div className="flex flex-wrap gap-1">
              {product.applications[lang].slice(0, 3).map((app, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium truncate max-w-full"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
