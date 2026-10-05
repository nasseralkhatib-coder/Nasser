import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  FlaskConical, 
  Package, 
  AlertCircle,
  Film,
  Check,
  Languages,
  Loader2,
  ArrowLeftRight
} from 'lucide-react';
import { ChemicalProduct, Language } from '../types';
import { productCategories } from '../data/products';
import { resolveAssetUrl } from '../utils/assetUrl';
import { processHighResImage } from '../utils/imageProcess';
import { setStoredImage, removeStoredImage } from '../utils/imageStore';
import { translateText, TranslationField } from '../utils/translator';

interface EditChemicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ChemicalProduct | null;
  onSave: (product: ChemicalProduct) => void;
  lang: Language;
}

export const EditChemicalModal: React.FC<EditChemicalModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  lang,
}) => {
  const isNew = !product;

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('binders-resins-polymers');
  const [casNumber, setCasNumber] = useState('');
  const [appearanceAr, setAppearanceAr] = useState('');
  const [appearanceEn, setAppearanceEn] = useState('');
  const [packagingAr, setPackagingAr] = useState('أكياس 25 كغ');
  const [packagingEn, setPackagingEn] = useState('25kg bags');
  const [applicationsAr, setApplicationsAr] = useState('');
  const [applicationsEn, setApplicationsEn] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Smart Auto-Translation states
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const userEditingRef = useRef<{ field: string; lang: 'ar' | 'en' } | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual or triggered translation for an individual field
  const handleTranslateSingle = async (
    field: 'name' | 'appearance' | 'packaging' | 'applications',
    from: 'ar' | 'en'
  ) => {
    const to: 'ar' | 'en' = from === 'ar' ? 'en' : 'ar';
    const fieldKey = `${field}_${from}`;
    setTranslatingField(fieldKey);

    try {
      if (field === 'name') {
        const sourceText = from === 'ar' ? nameAr : nameEn;
        if (!sourceText.trim()) return;
        const res = await translateText(sourceText, from, to, 'name');
        if (res) {
          if (to === 'en') setNameEn(res);
          else setNameAr(res);
        }
      } else if (field === 'appearance') {
        const sourceText = from === 'ar' ? appearanceAr : appearanceEn;
        if (!sourceText.trim()) return;
        const res = await translateText(sourceText, from, to, 'appearance');
        if (res) {
          if (to === 'en') setAppearanceEn(res);
          else setAppearanceAr(res);
        }
      } else if (field === 'packaging') {
        const sourceText = from === 'ar' ? packagingAr : packagingEn;
        if (!sourceText.trim()) return;
        const res = await translateText(sourceText, from, to, 'packaging');
        if (res) {
          if (to === 'en') setPackagingEn(res);
          else setPackagingAr(res);
        }
      } else if (field === 'applications') {
        const sourceText = from === 'ar' ? applicationsAr : applicationsEn;
        if (!sourceText.trim()) return;
        const res = await translateText(sourceText, from, to, 'applications');
        if (res) {
          if (to === 'en') setApplicationsEn(res);
          else setApplicationsAr(res);
        }
      }
    } catch (err) {
      console.warn('Translation error:', err);
    } finally {
      setTranslatingField(null);
    }
  };

  // Debounced auto-translation as user types
  const triggerDebouncedTranslate = (
    field: 'name' | 'appearance' | 'packaging' | 'applications',
    from: 'ar' | 'en',
    value: string
  ) => {
    if (!autoTranslate || !value.trim()) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (userEditingRef.current?.field === field && userEditingRef.current?.lang === from) {
        handleTranslateSingle(field, from);
      }
    }, 850);
  };

  // Translate all fields in one click
  const handleTranslateAll = async (direction: 'ar-to-en' | 'en-to-ar') => {
    setTranslatingField('all');
    try {
      const from: 'ar' | 'en' = direction === 'ar-to-en' ? 'ar' : 'en';
      const to: 'ar' | 'en' = direction === 'ar-to-en' ? 'en' : 'ar';

      const tasks: Promise<any>[] = [];
      if (from === 'ar') {
        if (nameAr.trim()) {
          tasks.push(translateText(nameAr, 'ar', 'en', 'name').then(res => res && setNameEn(res)).catch(() => {}));
        }
        if (appearanceAr.trim()) {
          tasks.push(translateText(appearanceAr, 'ar', 'en', 'appearance').then(res => res && setAppearanceEn(res)).catch(() => {}));
        }
        if (packagingAr.trim()) {
          tasks.push(translateText(packagingAr, 'ar', 'en', 'packaging').then(res => res && setPackagingEn(res)).catch(() => {}));
        }
        if (applicationsAr.trim()) {
          tasks.push(translateText(applicationsAr, 'ar', 'en', 'applications').then(res => res && setApplicationsEn(res)).catch(() => {}));
        }
      } else {
        if (nameEn.trim()) {
          tasks.push(translateText(nameEn, 'en', 'ar', 'name').then(res => res && setNameAr(res)).catch(() => {}));
        }
        if (appearanceEn.trim()) {
          tasks.push(translateText(appearanceEn, 'en', 'ar', 'appearance').then(res => res && setAppearanceAr(res)).catch(() => {}));
        }
        if (packagingEn.trim()) {
          tasks.push(translateText(packagingEn, 'en', 'ar', 'packaging').then(res => res && setPackagingAr(res)).catch(() => {}));
        }
        if (applicationsEn.trim()) {
          tasks.push(translateText(applicationsEn, 'en', 'ar', 'applications').then(res => res && setApplicationsAr(res)).catch(() => {}));
        }
      }
      await Promise.allSettled(tasks);
    } finally {
      setTranslatingField(null);
    }
  };

  useEffect(() => {
    setIsSavedSuccess(false);
    if (product) {
      setNameAr(product.name.ar || '');
      setNameEn(product.name.en || '');
      setCategory(product.category || 'binders-resins-polymers');
      setCasNumber(product.casNumber || '');
      setAppearanceAr(product.appearance?.ar || '');
      setAppearanceEn(product.appearance?.en || '');
      setPackagingAr(product.packaging?.ar || 'أكياس 25 كغ');
      setPackagingEn(product.packaging?.en || '25kg bags');
      setApplicationsAr((product.applications?.ar || []).join('، '));
      setApplicationsEn((product.applications?.en || []).join(', '));
      setImageUrl(product.imageUrl || '');
      setVideoUrl(product.videoUrl || '');
      setImagePreview(product.imageUrl || null);
      if (product.videoUrl) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    } else {
      // Defaults for adding new chemical material
      setNameAr('');
      setNameEn('');
      setCategory('binders-resins-polymers');
      setCasNumber('');
      setAppearanceAr('مسحوق كيميائي نقي عالي الجودة');
      setAppearanceEn('High purity chemical raw material');
      setPackagingAr('أكياس 25 كغ');
      setPackagingEn('25kg industrial bags');
      setApplicationsAr('صناعة الدهانات، مواد البناء والتشييد');
      setApplicationsEn('Paints & coatings, construction chemicals');
      setImageUrl('');
      setVideoUrl('');
      setImagePreview(null);
      setMediaType('image');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setVideoUrl(dataUrl);
        setMediaType('video');
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      // Process full image with high resolution and crisp uncropped edges
      const dataUrl = await processHighResImage(file);
      setImageUrl(dataUrl);
      setImagePreview(dataUrl);
      setMediaType('image');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImageUrl(dataUrl);
        setImagePreview(dataUrl);
        setMediaType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const trimmedAr = nameAr.trim();
    const trimmedEn = nameEn.trim();

    // If one is empty, use the other so user is never blocked
    const finalNameAr = trimmedAr || trimmedEn || (lang === 'ar' ? 'مادة كيميائية جديدة' : 'New Chemical Material');
    const finalNameEn = trimmedEn || trimmedAr || 'New Chemical Material';

    const appsAr = applicationsAr
      .split(/[،,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const appsEn = applicationsEn
      .split(/[،,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedId = product?.id || `custom-chem-${Date.now()}`;
    const finalImageUrl = mediaType === 'image' ? (imageUrl.trim() || undefined) : undefined;
    const finalVideoUrl = mediaType === 'video' ? (videoUrl.trim() || undefined) : undefined;

    // 1. Immediately persist image to disk & IndexedDB
    let savedDiskPath: string | undefined;
    if (finalImageUrl) {
      try {
        savedDiskPath = await setStoredImage(`product_${generatedId}`, finalImageUrl);
      } catch (err) {
        console.warn('Could not store image in imageStore:', err);
      }
    } else if (mediaType !== 'image' && product?.id) {
      try {
        await removeStoredImage(`product_${generatedId}`);
      } catch {
        // ignore
      }
    }

    const effectiveImageUrl = savedDiskPath || finalImageUrl;

    // 2. Broadcast image updated event to ensure all components and hook instances sync immediately
    window.dispatchEvent(
      new CustomEvent('kz-image-updated', {
        detail: { key: `product_${generatedId}`, dataUrl: effectiveImageUrl || null, publicPath: savedDiskPath },
      })
    );

    const updated: ChemicalProduct = {
      ...(product || {}),
      id: generatedId,
      name: {
        ar: finalNameAr,
        en: finalNameEn,
      },
      category,
      casNumber: casNumber.trim() || undefined,
      appearance: {
        ar: appearanceAr.trim() || 'مادة كيميائية صناعية عالية الجودة',
        en: appearanceEn.trim() || 'High quality industrial chemical',
      },
      packaging: {
        ar: packagingAr.trim() || 'أكياس 25 كغ',
        en: packagingEn.trim() || '25kg bags',
      },
      applications: {
        ar: appsAr.length > 0 ? appsAr : (product?.applications?.ar || ['استخدامات صناعية متعددة']),
        en: appsEn.length > 0 ? appsEn : (product?.applications?.en || ['Industrial applications']),
      },
      imageUrl: effectiveImageUrl,
      videoUrl: finalVideoUrl,
      featured: product?.featured ?? false,
    };

    onSave(updated);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden my-8"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {lang === 'ar' 
                  ? 'شاشة تطوير التطبيق - التحكم بالمواد' 
                  : 'Dev Mode - Chemical Material Editor'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isNew 
                ? (lang === 'ar' ? 'إضافة مادة كيميائية جديدة' : 'Add New Chemical Material')
                : (lang === 'ar' ? `تعديل مادة: ${product?.name?.ar || ''}` : `Edit: ${product?.name?.en || ''}`)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'التعديلات والحذف تظهر في بيئة التطوير وتثبت بشكل كامل، ولا تظهر أي أزرار تحكم للزوار أو عند تحميل الموقع.'
                : 'Changes are saved persistently. Editor buttons are hidden on shared links and downloaded sites.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Smart AI Translation Bar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold flex items-center gap-2 text-emerald-300">
                  <span>{lang === 'ar' ? 'الترجمة التلقائية الذكية' : 'Smart Auto-Translation'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {lang === 'ar' ? 'عربي ⇄ إنجليزي' : 'AR ⇄ EN'}
                  </span>
                  {translatingField && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-normal animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{lang === 'ar' ? 'جاري الترجمة الفورية...' : 'Translating live...'}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'عند تعديل أي حقل بالعربية يُترجم تلقائياً للإنجليزية، وعند التعديل بالإنجليزية يُترجم للعربية.'
                    : 'Changes in Arabic automatically translate to English, and English changes automatically update Arabic.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleTranslateAll('ar-to-en')}
                disabled={translatingField !== null}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 hover:border-emerald-500/40 transition-all cursor-pointer disabled:opacity-50"
                title={lang === 'ar' ? 'ترجمة كافة الحقول من العربية إلى الإنجليزية' : 'Translate all fields from Arabic to English'}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'ترجمة كل الحقول (عربي ← إنجليزي)' : 'Translate All (AR → EN)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTranslateAll('en-to-ar')}
                disabled={translatingField !== null}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 hover:border-emerald-500/40 transition-all cursor-pointer disabled:opacity-50"
                title={lang === 'ar' ? 'ترجمة كافة الحقول من الإنجليزية إلى العربية' : 'Translate all fields from English to Arabic'}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'ترجمة كل الحقول (إنجليزي ← عربي)' : 'Translate All (EN → AR)'}</span>
              </button>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-300">
                  {lang === 'ar' ? 'تلقائي فوري' : 'Live Auto'}
                </span>
              </label>
            </div>
          </div>

          {/* Section 1: Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'اسم المادة بالعربية *' : 'Chemical Name (Arabic) *'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('name', 'ar')}
                  disabled={translatingField !== null || !nameAr.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة الاسم إلى الإنجليزية' : 'Translate name to English'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'name_ar' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للإنجليزي ⇄' : 'To English ⇄')}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => {
                  const val = e.target.value;
                  setNameAr(val);
                  userEditingRef.current = { field: 'name', lang: 'ar' };
                  triggerDebouncedTranslate('name', 'ar', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'name' && userEditingRef.current?.lang === 'ar' && nameAr.trim()) {
                    handleTranslateSingle('name', 'ar');
                  }
                }}
                placeholder="مثال: ثاني أكسيد التيتانيوم روتيل"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'اسم المادة بالإنجليزية *' : 'Chemical Name (English) *'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('name', 'en')}
                  disabled={translatingField !== null || !nameEn.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة الاسم إلى العربية' : 'Translate name to Arabic'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'name_en' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للعربي ⇄' : 'To Arabic ⇄')}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => {
                  const val = e.target.value;
                  setNameEn(val);
                  userEditingRef.current = { field: 'name', lang: 'en' };
                  triggerDebouncedTranslate('name', 'en', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'name' && userEditingRef.current?.lang === 'en' && nameEn.trim()) {
                    handleTranslateSingle('name', 'en');
                  }
                }}
                placeholder="e.g. Titanium Dioxide Rutile"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none text-left"
              />
            </div>
          </div>

          {/* Section 2: Category & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {lang === 'ar' ? 'التصنيف الصناعي *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                {productCategories.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-200 mb-1">
                {lang === 'ar' ? 'رقم التسجيل الدولي (CAS No)' : 'CAS Registry Number'}
              </label>
              <input
                type="text"
                value={casNumber}
                onChange={(e) => setCasNumber(e.target.value)}
                placeholder="مثال: 13463-67-7"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none text-left font-mono"
              />
            </div>
          </div>

          {/* Section 3: Appearance & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'شرح ووصف المظهر بالعربية' : 'Appearance / Description (Arabic)'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('appearance', 'ar')}
                  disabled={translatingField !== null || !appearanceAr.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة المظهر إلى الإنجليزية' : 'Translate appearance to English'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'appearance_ar' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للإنجليزي ⇄' : 'To English ⇄')}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={appearanceAr}
                onChange={(e) => {
                  const val = e.target.value;
                  setAppearanceAr(val);
                  userEditingRef.current = { field: 'appearance', lang: 'ar' };
                  triggerDebouncedTranslate('appearance', 'ar', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'appearance' && userEditingRef.current?.lang === 'ar' && appearanceAr.trim()) {
                    handleTranslateSingle('appearance', 'ar');
                  }
                }}
                placeholder="مثال: مسحوق أبيض ناعم ناصع البياض بنقاوة عالية وتغطية فائقة"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'شرح ووصف المظهر بالإنجليزية' : 'Appearance / Description (English)'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('appearance', 'en')}
                  disabled={translatingField !== null || !appearanceEn.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة المظهر إلى العربية' : 'Translate appearance to Arabic'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'appearance_en' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للعربي ⇄' : 'To Arabic ⇄')}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={appearanceEn}
                onChange={(e) => {
                  const val = e.target.value;
                  setAppearanceEn(val);
                  userEditingRef.current = { field: 'appearance', lang: 'en' };
                  triggerDebouncedTranslate('appearance', 'en', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'appearance' && userEditingRef.current?.lang === 'en' && appearanceEn.trim()) {
                    handleTranslateSingle('appearance', 'en');
                  }
                }}
                placeholder="e.g. Pure white powder with superior opacity and high weatherability"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-none text-left"
              />
            </div>
          </div>

          {/* Section 4: Packaging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'التعبئة (عربي)' : 'Packaging (Arabic)'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('packaging', 'ar')}
                  disabled={translatingField !== null || !packagingAr.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة التعبئة إلى الإنجليزية' : 'Translate packaging to English'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'packaging_ar' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للإنجليزي ⇄' : 'To English ⇄')}</span>
                </button>
              </div>
              <input
                type="text"
                value={packagingAr}
                onChange={(e) => {
                  const val = e.target.value;
                  setPackagingAr(val);
                  userEditingRef.current = { field: 'packaging', lang: 'ar' };
                  triggerDebouncedTranslate('packaging', 'ar', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'packaging' && userEditingRef.current?.lang === 'ar' && packagingAr.trim()) {
                    handleTranslateSingle('packaging', 'ar');
                  }
                }}
                placeholder="مثال: أكياس 25 كغ أو براميل 200 لتر"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'التعبئة (إنجليزي)' : 'Packaging (English)'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('packaging', 'en')}
                  disabled={translatingField !== null || !packagingEn.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة التعبئة إلى العربية' : 'Translate packaging to Arabic'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'packaging_en' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للعربي ⇄' : 'To Arabic ⇄')}</span>
                </button>
              </div>
              <input
                type="text"
                value={packagingEn}
                onChange={(e) => {
                  const val = e.target.value;
                  setPackagingEn(val);
                  userEditingRef.current = { field: 'packaging', lang: 'en' };
                  triggerDebouncedTranslate('packaging', 'en', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'packaging' && userEditingRef.current?.lang === 'en' && packagingEn.trim()) {
                    handleTranslateSingle('packaging', 'en');
                  }
                }}
                placeholder="e.g. 25kg multi-layer bags or 200L steel drums"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none text-left"
              />
            </div>
          </div>

          {/* Section 5: Applications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'أبرز الاستخدامات والتطبيقات (افصل بينها بفاصلة)' : 'Key Applications (Arabic, comma separated)'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('applications', 'ar')}
                  disabled={translatingField !== null || !applicationsAr.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة التطبيقات إلى الإنجليزية' : 'Translate applications to English'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'applications_ar' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للإنجليزي ⇄' : 'To English ⇄')}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={applicationsAr}
                onChange={(e) => {
                  const val = e.target.value;
                  setApplicationsAr(val);
                  userEditingRef.current = { field: 'applications', lang: 'ar' };
                  triggerDebouncedTranslate('applications', 'ar', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'applications' && userEditingRef.current?.lang === 'ar' && applicationsAr.trim()) {
                    handleTranslateSingle('applications', 'ar');
                  }
                }}
                placeholder="مثال: دهانات مائية، طلاءات صناعية، بلاستيك، أحبار"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-200">
                  {lang === 'ar' ? 'الاستخدامات بالإنجليزي (افصل بينها بفاصلة)' : 'Key Applications (English, comma separated)'}
                </label>
                <button
                  type="button"
                  onClick={() => handleTranslateSingle('applications', 'en')}
                  disabled={translatingField !== null || !applicationsEn.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 cursor-pointer"
                  title={lang === 'ar' ? 'ترجمة التطبيقات إلى العربية' : 'Translate applications to Arabic'}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{translatingField === 'applications_en' ? (lang === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (lang === 'ar' ? 'ترجم للعربي ⇄' : 'To Arabic ⇄')}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={applicationsEn}
                onChange={(e) => {
                  const val = e.target.value;
                  setApplicationsEn(val);
                  userEditingRef.current = { field: 'applications', lang: 'en' };
                  triggerDebouncedTranslate('applications', 'en', val);
                }}
                onBlur={() => {
                  if (autoTranslate && userEditingRef.current?.field === 'applications' && userEditingRef.current?.lang === 'en' && applicationsEn.trim()) {
                    handleTranslateSingle('applications', 'en');
                  }
                }}
                placeholder="e.g. Architectural paints, Industrial coatings, Masterbatch, Plastics"
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none text-left"
              />
            </div>
          </div>

          {/* Section 6: Media (Image or Video) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'وسائط المادة (صورة أو فيديو)' : 'Material Media (Image or Video)'}</span>
              </span>

              {/* Media Type Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    mediaType === 'image'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'صورة' : 'Image'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    mediaType === 'video'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'فيديو' : 'Video'}</span>
                </button>
              </div>
            </div>

            {mediaType === 'image' ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'رفع صورة من جهازك' : 'Upload Image from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="text-slate-500 text-xs">{lang === 'ar' ? 'أو' : 'or'}</div>

                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder={lang === 'ar' ? 'ضع رابط صورة مباشر (URL)' : 'Paste Image URL'}
                    dir="ltr"
                    className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {imagePreview && (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-3">
                    <img
                      src={resolveAssetUrl(imagePreview)}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain block mx-auto"
                      onError={() => setImagePreview(null)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-900 text-white text-xs z-10"
                      title="حذف الصورة"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 cursor-pointer transition-colors">
                    <Film className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'رفع ملف فيديو من جهازك (MP4 / WebM)' : 'Upload Video File'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="text-slate-500 text-xs">{lang === 'ar' ? 'أو' : 'or'}</div>

                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder={lang === 'ar' ? 'ضع رابط فيديو مباشر (MP4 / WebM URL)' : 'Paste direct Video URL'}
                    dir="ltr"
                    className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {videoUrl && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black border border-slate-800">
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-900 text-white text-xs"
                      title="إلغاء الفيديو"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-semibold transition-colors"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-xl ${
                isSavedSuccess ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500'
              } text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer`}
            >
              {isSavedSuccess ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  <span>{lang === 'ar' ? 'تم حفظ التعديل بنجاح!' : 'Saved Successfully!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ المادة الكيميائية' : 'Save Material'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
