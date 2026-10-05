import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ChemicalProduct, Language } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ChemicalProduct | null;
  onConfirm: (id: string) => void;
  lang: Language;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  lang,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden p-6"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {lang === 'ar' ? 'تأكيد حذف المادة الكيميائية' : 'Confirm Chemical Deletion'}
        </h3>

        <p className="text-sm text-slate-300 mb-2 leading-relaxed">
          {lang === 'ar'
            ? `هل أنت متأكد من رغبتك في حذف مادة:`
            : `Are you sure you want to permanently delete:`}
        </p>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-emerald-400 mb-4">
          {product.name[lang] || product.name.ar || product.name.en}
          {product.casNumber && (
            <span className="block text-xs font-mono text-slate-400 mt-1" dir="ltr">
              CAS: {product.casNumber}
            </span>
          )}
        </div>

        <p className="text-xs text-rose-300/80 mb-6 bg-rose-950/30 p-2.5 rounded-xl border border-rose-900/40">
          {lang === 'ar'
            ? 'سيتم حذف هذه المادة بالكامل (الصورة، الوصف، والمواصفات). هذا الخيار نشط في شاشة التطوير فقط.'
            : 'The entire material, its picture, description and specs will be removed. Available in dev screen only.'}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-sm font-semibold transition-colors"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm(product.id);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{lang === 'ar' ? 'نعم، حذف المادة' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
