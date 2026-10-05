import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FlaskConical, 
  FileText, 
  Layers, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  Sparkles, 
  Package, 
  Info,
  Palette,
  Boxes,
  Droplets
} from 'lucide-react';
import { Language, ChemicalProduct } from '../types';
import { siteContent } from '../data/translations';
import { productCategories } from '../data/products';
import { useChemicalProducts } from '../hooks/useChemicalProducts';

interface ProductsCatalogProps {
  lang: Language;
  onRequestQuote: (productName?: string) => void;
  onRequestTDS: (product: ChemicalProduct) => void;
}

export const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
  lang,
  onRequestQuote,
  onRequestTDS,
}) => {
  const content = siteContent[lang];
  const { products, totalCount } = useChemicalProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  }, [searchQuery, selectedCategory]);

  return (
    <section id="products" className="py-20 bg-slate-950 relative border-t border-slate-800">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.products.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.products.heading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {content.products.subheading}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl mb-10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-teal-400" />
              </div>
              <input
                type="text"
                id="chemical-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={content.products.searchPlaceholder}
                className="w-full ps-10 pe-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 end-0 pe-3 flex items-center text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>
                {lang === 'ar'
                  ? `عرض ${filteredProducts.length} من إجمالي ${totalCount} مادة كيميائية`
                  : `Showing ${filteredProducts.length} of ${totalCount} chemical items`}
              </span>
            </div>

          </div>

          {/* Category Filter Pills (8 categories across 2 rows of 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {productCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 border text-start ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/25'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white border-slate-700/60'
                  }`}
                >
                  <span className="truncate">{cat.name[lang]}</span>
                  {cat.id !== 'all' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-teal-900/40 text-teal-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid: 4 items per row on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="bg-slate-900/70 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-teal-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg group relative overflow-hidden"
                >
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header: CAS tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {product.casNumber && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 border border-slate-700">
                          CAS: {product.casNumber}
                        </span>
                      )}
                    </div>

                    {/* Chemical Name */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                      {product.name[lang]}
                    </h3>

                    {/* Secondary name in other language */}
                    <p className="text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800" dir={lang === 'ar' ? 'ltr' : 'rtl'}>
                      {lang === 'ar' ? product.name.en : product.name.ar}
                    </p>

                    {/* Technical Specifications */}
                    <div className="space-y-2 mb-5 text-xs">
                      {product.purity && (
                        <div className="flex items-start gap-2">
                          <span className="text-slate-400 font-semibold shrink-0">
                            {content.products.purityLabel}
                          </span>
                          <span className="text-slate-200 font-medium" dir="ltr">
                            {product.purity}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 font-semibold shrink-0">
                          {content.products.packagingLabel}
                        </span>
                        <span className="text-slate-300">
                          {product.packaging[lang]}
                        </span>
                      </div>

                      <div className="text-slate-400 pt-1">
                        <span className="font-semibold block mb-1.5 text-slate-300">
                          {content.products.applicationsLabel}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.applications[lang].map((app, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                    <button
                      id={`quote-btn-${product.id}`}
                      onClick={() => onRequestQuote(product.name[lang])}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10 cursor-pointer transition-all"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>{content.products.inquireBtn}</span>
                    </button>

                    <button
                      id={`tds-btn-${product.id}`}
                      onClick={() => onRequestTDS(product)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-teal-400 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title={content.products.requestTDS}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>TDS / MSDS</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 font-medium mb-4 max-w-md mx-auto">
              {content.products.noProductsFound}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
            >
              {lang === 'ar' ? 'إعادة ضبط البحث' : 'Reset Search'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
