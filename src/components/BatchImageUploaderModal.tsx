import React, { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles, X, Image as ImageIcon, Check, Loader2, RefreshCw } from 'lucide-react';
import { ChemicalProduct, Language } from '../types';
import { setStoredImage } from '../utils/imageStore';
import { processHighResImage } from '../utils/imageProcess';

interface BatchImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ChemicalProduct[];
  lang: Language;
  onSuccess?: () => void;
}

interface MatchedItem {
  file: File;
  previewUrl: string;
  matchedProductId: string;
  matchedProductName: string;
}

interface UnmatchedItem {
  file: File;
  previewUrl: string;
}

// Ordered standard products list for 1..37 number matching
const ORDERED_PRODUCT_IDS = [
  'hpmc', 'hec', 'mhec', 'hemc', 'bentonite', 'rdp', 'ester-alcohol',
  'iron-oxide', 'organic-pigments', 'inorganic-pigment', 'titanium', 'calcined-kaolin',
  'anti-foams', 'dispersing-agent', 'shmp', 'smbs', 'anti-skin', 'zinc-dust',
  'zinc-phosphate', 'fumed-silica', 'zinc-stearate', 'carbon-black', 'dblo',
  'barium-sulfate', 'styrene-acrylic', 'copolymer-emulsion', 'homo-polymer',
  'ipa', 'xylene', 'butyl-acetate', 'ethanol', 'methanol', 'ethyl-acetate',
  'white-spirit', 'talc', 'mica', 'citric-acid'
];

export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // strip tashkeel
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[^a-z0-9\u0600-\u06FF]/g, ' ')
    .trim();
}

export function matchFilenameToProductId(filename: string): string | null {
  const cleanName = filename.toLowerCase();
  const normalized = normalizeText(filename);

  // 1. Direct ID match
  for (const id of ORDERED_PRODUCT_IDS) {
    if (cleanName.includes(id)) return id;
  }

  // 2. Check numbered prefix or suffix (e.g. 01, 1, 01_, 01., 37)
  const numberMatch = filename.match(/(?:^|[^0-9])([0-3]?[0-9])(?:[^0-9]|$)/);
  if (numberMatch) {
    const num = parseInt(numberMatch[1], 10);
    if (num >= 1 && num <= ORDERED_PRODUCT_IDS.length) {
      // Only match if the filename has a strong indicator or is mostly number
      if (filename.startsWith(String(num)) || filename.startsWith(num < 10 ? `0${num}` : String(num))) {
        return ORDERED_PRODUCT_IDS[num - 1];
      }
    }
  }

  // 3. Cellulose family
  if (cleanName.includes('hpmc') || normalized.includes('هيدروكسي بروبيل')) return 'hpmc';
  if (cleanName.includes('mhec') || normalized.includes('ميثيل هيدروكسي')) return 'mhec';
  if (cleanName.includes('hemc') || normalized.includes('هيدروكسي ايثيل ميثيل')) return 'hemc';
  if (cleanName.includes('hec') || normalized.includes('هيدروكسي ايثيل')) return 'hec';

  // 4. Minerals & Clays
  if (cleanName.includes('bento') || normalized.includes('بنتونايت') || normalized.includes('بنتونيت')) return 'bentonite';
  if (cleanName.includes('calcined') || cleanName.includes('kaolin') || normalized.includes('كاولين')) return 'calcined-kaolin';
  if (cleanName.includes('talc') || normalized.includes('تلك') || normalized.includes('التلك')) return 'talc';
  if (cleanName.includes('mica') || normalized.includes('ميكا') || normalized.includes('الميكا')) return 'mica';
  if (cleanName.includes('fumed') || cleanName.includes('silica') || cleanName.includes('aerosil') || normalized.includes('فيومد') || normalized.includes('سيليكا')) return 'fumed-silica';
  if (cleanName.includes('bari') || normalized.includes('باريوم') || normalized.includes('سلفات')) return 'barium-sulfate';

  // 5. Polymers & Resins
  if (cleanName.includes('rdp') || normalized.includes('ردي بي') || (normalized.includes('بوليمر') && normalized.includes('بودره'))) return 'rdp';
  if (cleanName.includes('styrene') || cleanName.includes('acrylic') || normalized.includes('ستيرين') || normalized.includes('اكريليك')) return 'styrene-acrylic';
  if (cleanName.includes('copolymer') || normalized.includes('كوبوليمر')) return 'copolymer-emulsion';
  if (cleanName.includes('homo') || cleanName.includes('pva') || normalized.includes('هوموبوليمر') || normalized.includes('هومو')) return 'homo-polymer';

  // 6. Pigments
  if (cleanName.includes('titanium') || normalized.includes('تيتانيوم') || normalized.includes('روتيل')) return 'titanium';
  if (cleanName.includes('carbon') || cleanName.includes('black') || normalized.includes('كربون') || normalized.includes('اسود الكربون')) return 'carbon-black';
  if (cleanName.includes('iron') || cleanName.includes('oxide') || normalized.includes('اكسيد الحديد') || normalized.includes('حديد')) return 'iron-oxide';
  if (cleanName.includes('inorganic') || cleanName.includes('inorgan') || normalized.includes('غير عضويه')) return 'inorganic-pigment';
  if (cleanName.includes('organic') || normalized.includes('عضويه') || normalized.includes('اصباغ')) return 'organic-pigments';

  // 7. Zinc compounds
  if (cleanName.includes('zincdust') || (cleanName.includes('zinc') && cleanName.includes('dust')) || normalized.includes('غبار الزنك') || normalized.includes('مسحوق الزنك')) return 'zinc-dust';
  if (cleanName.includes('zincphos') || (cleanName.includes('zinc') && cleanName.includes('phos')) || normalized.includes('فوسفات الزنك')) return 'zinc-phosphate';
  if (cleanName.includes('zincstear') || (cleanName.includes('zinc') && cleanName.includes('stear')) || normalized.includes('ستيارات الزنك') || normalized.includes('ستيرات الزنك')) return 'zinc-stearate';

  // 8. Solvents
  if (cleanName.includes('butyl') || normalized.includes('بيوتيل')) return 'butyl-acetate';
  if (cleanName.includes('ethyl') || normalized.includes('ايثيل اسيتات')) return 'ethyl-acetate';
  if (cleanName.includes('whitespirit') || cleanName.includes('mineral spirit') || normalized.includes('وايت سبيريت') || normalized.includes('وايت سبيرت') || normalized.includes('كيروسين')) return 'white-spirit';
  if (cleanName.includes('xylene') || normalized.includes('زايلين') || normalized.includes('زيلين')) return 'xylene';
  if (cleanName.includes('methanol') || normalized.includes('ميثانول')) return 'methanol';
  if (cleanName.includes('ethanol') || normalized.includes('ايثانول')) return 'ethanol';
  if (cleanName.includes('ipa') || cleanName.includes('isoprop') || normalized.includes('ايزوبروبيل') || normalized.includes('ايزو بروبيل')) return 'ipa';

  // 9. Additives & Special chemicals
  if (cleanName.includes('antifoam') || cleanName.includes('defoamer') || normalized.includes('مانع رغوه') || normalized.includes('مضاد رغوه') || normalized.includes('رغوه')) return 'anti-foams';
  if (cleanName.includes('dispers') || normalized.includes('تشتيت') || normalized.includes('مشتت')) return 'dispersing-agent';
  if (cleanName.includes('ester') || cleanName.includes('texanol') || normalized.includes('استر') || normalized.includes('تكسانول')) return 'ester-alcohol';
  if (cleanName.includes('shmp') || normalized.includes('ميتافوسفات')) return 'shmp';
  if (cleanName.includes('smbs') || normalized.includes('ميتابيسلفيت')) return 'smbs';
  if (cleanName.includes('antiskin') || cleanName.includes('meko') || normalized.includes('مانع قشره') || normalized.includes('قشره')) return 'anti-skin';
  if (cleanName.includes('dblo') || cleanName.includes('linseed') || normalized.includes('بذره الكتان') || normalized.includes('بذر الكتان') || normalized.includes('كتان')) return 'dblo';
  if (cleanName.includes('citric') || normalized.includes('ستريك') || normalized.includes('ليمون')) return 'citric-acid';

  return null;
}

export const BatchImageUploaderModal: React.FC<BatchImageUploaderModalProps> = ({
  isOpen,
  onClose,
  products,
  lang,
  onSuccess,
}) => {
  const [matchedFiles, setMatchedFiles] = useState<Record<string, MatchedItem>>({});
  const [unmatchedFiles, setUnmatchedFiles] = useState<UnmatchedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    setIsProcessing(true);
    const files = Array.from(fileList);
    const newMatched: Record<string, MatchedItem> = { ...matchedFiles };
    const newUnmatched: UnmatchedItem[] = [...unmatchedFiles];

    for (const file of files) {
      const prodId = matchFilenameToProductId(file.name);
      const previewUrl = URL.createObjectURL(file);
      
      if (prodId) {
        const prod = products.find((p) => p.id === prodId);
        newMatched[prodId] = {
          file,
          previewUrl,
          matchedProductId: prodId,
          matchedProductName: prod ? prod.name[lang] : prodId,
        };
      } else {
        newUnmatched.push({ file, previewUrl });
      }
    }

    setMatchedFiles(newMatched);
    setUnmatchedFiles(newUnmatched);
    setIsProcessing(false);
  }, [products, lang, matchedFiles, unmatchedFiles]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleManualAssign = (unmatchedIndex: number, prodId: string) => {
    const item = unmatchedFiles[unmatchedIndex];
    if (!item || !prodId) return;

    const prod = products.find((p) => p.id === prodId);
    setMatchedFiles((prev) => ({
      ...prev,
      [prodId]: {
        file: item.file,
        previewUrl: item.previewUrl,
        matchedProductId: prodId,
        matchedProductName: prod ? prod.name[lang] : prodId,
      },
    }));

    setUnmatchedFiles((prev) => prev.filter((_, idx) => idx !== unmatchedIndex));
  };

  const handleSaveAll = async () => {
    const items: MatchedItem[] = Object.values(matchedFiles);
    if (items.length === 0) return;

    setIsSaving(true);
    setSaveMessage(lang === 'ar' ? 'جاري معالجة وحفظ الصور على السيرفر والقرص...' : 'Processing and saving images to disk...');

    try {
      const payloadFiles: { name: string; productId: string; dataUrl: string }[] = [];

      for (const item of items) {
        const optimizedDataUrl = await processHighResImage(item.file);
        payloadFiles.push({
          name: item.file.name,
          productId: item.matchedProductId,
          dataUrl: optimizedDataUrl,
        });

        // Also save to client imageStore / IndexedDB
        try {
          await setStoredImage(`product_${item.matchedProductId}`, optimizedDataUrl);
        } catch {}
      }

      setSaveMessage(lang === 'ar' ? 'جاري تثبيت الصور في ملفات المشروع وتحديث حزم التنزيل...' : 'Persisting to files & building hosting zip...');

      const response = await fetch('/api/batch-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: payloadFiles }),
      });

      const resData = await response.json();

      if (resData.success) {
        setSaveSuccess(true);
        setSaveMessage(
          lang === 'ar'
            ? `تم بنجاح تثبيت ${resData.count} صورة في ملفات الموقع والكتالوج وحزمة الاستضافة!`
            : `Successfully persisted ${resData.count} images to project files & hosting package!`
        );

        // Notify catalog to reload
        window.dispatchEvent(new CustomEvent('kz-products-changed'));

        if (onSuccess) onSuccess();

        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 3000);
      } else {
        throw new Error(resData.error || 'Failed to save');
      }
    } catch (err: any) {
      console.error('Batch upload failed:', err);
      setSaveMessage(lang === 'ar' ? `حدث خطأ أثناء الحفظ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const totalMatched = Object.keys(matchedFiles).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-5xl w-full p-6 sm:p-8 my-8 relative max-h-[90vh] flex flex-col"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'رفع وتثبيت كافة صور الكتالوج الـ 37 دفعة واحدة' : 'Batch Upload All 37 Chemical Images'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ar'
                  ? 'اسحب وأفلت جميع الصور الـ 37 دفعة واحدة، سيقوم النظام بالتعرف التلقائي على مسمى كل مادة وربطها وحفظها نهائياً.'
                  : 'Drag & drop all 37 product images. Each image will be automatically matched, saved to disk, and packaged.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="my-4 shrink-0">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50/90 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">
              {lang === 'ar' ? 'اضغط لاختيار الـ 37 صورة، أو اسحبها وأفلتها هنا' : 'Click to select all 37 images, or drag & drop here'}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'يدعم صور البراميل والأكياس والجوالين بصيغ (JPG, PNG, WebP) بالأسماء العربية أو الإنجليزية أو الأرقام'
                : 'Supports (JPG, PNG, WebP) with Arabic or English names or product indices'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
            />
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              {lang === 'ar' ? 'حالة المطابقة:' : 'Matching Status:'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
              <Check className="w-3.5 h-3.5" />
              {lang === 'ar' ? `تم التعرف على ${totalMatched} من أصل ${products.length} مادة` : `${totalMatched} of ${products.length} matched`}
            </span>
          </div>

          {unmatchedFiles.length > 0 && (
            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {lang === 'ar' ? `${unmatchedFiles.length} صورة تحتاج لتحديد المادة يدوياً أدناه` : `${unmatchedFiles.length} files need manual selection below`}
            </span>
          )}
        </div>

        {/* Unmatched Files Section (if any) */}
        {unmatchedFiles.length > 0 && (
          <div className="mb-3 p-3 bg-amber-50/70 border border-amber-200 rounded-2xl shrink-0 max-h-[160px] overflow-y-auto">
            <h5 className="text-xs font-bold text-amber-900 mb-2">
              {lang === 'ar' ? 'صور لم يتم التعرف عليها تلقائياً - اختر المادة المناسبة لكل صورة:' : 'Unrecognized images - Select the material for each:'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {unmatchedFiles.map((unmatched, idx) => (
                <div key={idx} className="bg-white p-2 rounded-xl border border-amber-200 flex items-center gap-2">
                  <img src={unmatched.previewUrl} alt="" className="w-9 h-9 rounded object-cover border" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 truncate" title={unmatched.file.name}>
                      {unmatched.file.name}
                    </p>
                    <select
                      className="text-[10px] w-full mt-1 p-1 rounded border border-slate-300 bg-slate-50 font-medium"
                      defaultValue=""
                      onChange={(e) => handleManualAssign(idx, e.target.value)}
                    >
                      <option value="" disabled>
                        {lang === 'ar' ? '-- اختر المادة --' : '-- Select Material --'}
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name[lang]} ({p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matched Products Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {products.map((p) => {
              const matched = matchedFiles[p.id];
              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                    matched
                      ? 'bg-emerald-50/80 border-emerald-300'
                      : 'bg-slate-50/60 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {matched ? (
                      <img src={matched.previewUrl} alt="" className="w-full h-full object-contain" />
                    ) : p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="w-full h-full object-contain opacity-50" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {p.name[lang]}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">
                      {p.id}
                    </p>
                    {matched ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{matched.file.name}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {lang === 'ar' ? 'بانتظار الصورة' : 'Pending file'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message / Feedback */}
        {saveMessage && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 ${
              saveSuccess
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                : isSaving
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={totalMatched === 0 || isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
              totalMatched > 0 && !isSaving
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:shadow-emerald-600/35 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'ar' ? 'جاري الحفظ والتثبيت على السيرفر...' : 'Saving & Persisting...'}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? `تثبيت وحفظ ${totalMatched} صورة في الكتالوج والاستضافة الآن`
                    : `Persist ${totalMatched} Images to Catalog & Hosting Now`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
