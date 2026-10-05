import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FlaskConical, 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  Sparkles, 
  Package, 
  Info,
  Phone,
  Building2,
  PlusCircle
} from 'lucide-react';
import { Language, ChemicalProduct, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { productCategories } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SpecialMaterialModal } from '../components/SpecialMaterialModal';
import { useChemicalProducts } from '../hooks/useChemicalProducts';
import { EditChemicalModal } from '../components/EditChemicalModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { BatchImageUploaderModal } from '../components/BatchImageUploaderModal';
import { RotateCcw, Upload } from 'lucide-react';

interface ProductsPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSpecialMaterialOpen, setIsSpecialMaterialOpen] = useState(false);

  const { 
    products, 
    deleteProduct, 
    updateProduct, 
    addProduct, 
    resetToDefaultProducts, 
    isDev,
    totalCount 
  } = useChemicalProducts();

  const [editingProduct, setEditingProduct] = useState<ChemicalProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ChemicalProduct | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch = 
        product.name.en.toLowerCase().includes(query) ||
        product.name.ar.toLowerCase().includes(query) ||
        (product.casNumber && product.casNumber.toLowerCase().includes(query)) ||
        product.applications.en.some((app) => app.toLowerCase().includes(query)) ||
        product.applications.ar.some((app) => app.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Special Material Modal */}
      <SpecialMaterialModal
        isOpen={isSpecialMaterialOpen}
        onClose={() => setIsSpecialMaterialOpen(false)}
        lang={lang}
      />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <FlaskConical className="w-4 h-4 text-emerald-800" />
            <span>{content.products.sectionBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {content.products.heading}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
            {content.products.subheading}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsSpecialMaterialOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ar' ? 'أطلب مادة خاصة غير متوفرة بالكتالوج' : 'Request a Specialty Unlisted Material'}</span>
            </button>

            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-600 font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'ar' ? 'رفع وتثبيت كافة صور المواد (37 صورة)' : 'Batch Upload All 37 Chemical Images'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Filter Controls */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={content.products.searchPlaceholder}
                className={`w-full py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all ${
                  lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'
                }`}
              />
            </div>

            {/* Clear Filter Button */}
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء الفلاتر' : 'Reset Filters'}
              </button>
            )}
          </div>

          {/* Category Filter Pills (Arranged across two rows so all categories are fully visible) */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2.5 ps-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تصنيفات المواد الكيميائية:' : 'Chemical Categories:'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {productCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-2 border text-start ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-emerald-50/80 text-slate-700 hover:text-emerald-900 border-slate-200'
                    }`}
                  >
                    <span className="truncate">{cat.name[lang]}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dev Mode Toolbar - Strictly visible on development screen only */}
        {isDev && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-md flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-emerald-300">
                {lang === 'ar' 
                  ? 'شاشة تطوير التطبيق: إدارة وحذف وتعديل المواد الكيميائية نشطة' 
                  : 'Dev Environment: Chemical Material Management Active'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsEditModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? '+ إضافة مادة كيميائية جديدة' : '+ Add New Material'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(lang === 'ar' ? 'هل تود استعادة قائمة المواد الأصلية؟' : 'Reset to default chemical products?')) {
                    resetToDefaultProducts();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                title={lang === 'ar' ? 'استعادة الكتالوج الأصلي' : 'Reset to defaults'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'ar' ? 'استعادة الافتراضي' : 'Reset'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Count & Specifications summary */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>
            {lang === 'ar' 
              ? `عرض ${filteredProducts.length} من إجمالي ${totalCount} مادة كيميائية متوفرة مع الصور والمواصفات` 
              : `Showing ${filteredProducts.length} of ${totalCount} raw chemical materials with images & specs`}
          </span>
          <span className="text-emerald-800 font-semibold">
            {lang === 'ar' ? 'تعبئة قياسية: أكياس 25 كغ أو براميل 200 لتر' : 'Packaging: 25kg bags or 200L drums only'}
          </span>
        </div>

        {/* Products Grid: 4 items per row on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setIsEditModalOpen(true);
                }}
                onDelete={(p) => {
                  setDeletingProduct(p);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-3xl bg-white border border-emerald-200 p-8 mb-16">
            <FlaskConical className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {lang === 'ar' ? 'لم يتم العثور على نتائج مطابقة' : 'No Chemical Matches Found'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              {content.products.noProductsFound}
            </p>
            <button
              onClick={() => setIsSpecialMaterialOpen(true)}
              className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow cursor-pointer transition-colors"
            >
              {lang === 'ar' ? 'طلب هذه المادة وتأمينها خصيصاً لمصنعك' : 'Request Custom Sourcing For Your Factory'}
            </button>
          </div>
        )}

        {/* Modals for Dev Mode Chemical Editing & Deleting */}
        <EditChemicalModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={(updated) => updateProduct(updated)}
          lang={lang}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProduct(null);
          }}
          product={deletingProduct}
          onConfirm={(id) => deleteProduct(id)}
          lang={lang}
        />

        {/* Batch Image Uploader Modal */}
        <BatchImageUploaderModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          products={products}
          lang={lang}
        />

        {/* Global Sourcing Specialty Material Request Box */}
        <div className="rounded-3xl p-8 bg-emerald-50/70 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-emerald-950">
              {lang === 'ar' ? 'هل تحتاج مادة كيميائية خام خاصة غير مدرجة في الكتالوج؟' : 'Need a Specialty Chemical Not Listed Above?'}
            </h3>
            <p className="text-sm text-slate-700 max-w-2xl">
              {lang === 'ar'
                ? 'تمتلك شركة كميزون شبكة توريد دولية واسعة مع كبرى المصانع الكيميائية في آسيا وأوروبا والشرق الأوسط، ويمكننا استيراد وتأمين أي مادة خام خاصة وفق المواصفات والأسعار المطلوبة لمصنعك وتسليمها مع كافة وثائقها وشهادات التحليل المخبري.'
                : 'Kemizone maintains direct manufacturing partnerships worldwide to source and import bespoke chemicals tailored precisely to your factory requirements.'}
            </p>
          </div>

          <button
            onClick={() => setIsSpecialMaterialOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm whitespace-nowrap shadow cursor-pointer transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ar' ? 'أطلب مادة خاصة الآن' : 'Request Special Material Now'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
