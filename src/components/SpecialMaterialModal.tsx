import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  Phone, 
  FlaskConical, 
  DollarSign, 
  FileText,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';

interface SpecialMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SpecialMaterialModal: React.FC<SpecialMaterialModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    materialName: '',
    expectedPrice: '',
    application: '',
    description: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.contactPerson || !formData.phone || !formData.materialName) {
      setErrorMsg(lang === 'ar' ? 'يرجى تعبئة الحقول الأساسية المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const emailSubject = `طلب توفير مادة كيميائية خاصة - ${formData.companyName} (${formData.materialName})`;
    
    // Prepare formatted text body for email
    const emailBody = [
      '====================================================',
      'طلب توفير مادة كيميائية خاصة عبر موقع شركة كميزون',
      '====================================================',
      '',
      `اسم المصنع / الشركة: ${formData.companyName}`,
      `المسؤول للتواصل: ${formData.contactPerson}`,
      `رقم الجوال / الهاتف: ${formData.phone}`,
      `المادة المطلوبة: ${formData.materialName}`,
      `السعر المتوقع: ${formData.expectedPrice || 'غير محدد'}`,
      `التطبيق الصناعي: ${formData.application || 'غير محدد'}`,
      '',
      'المواصفات والمتطلبات الفنية:',
      '----------------------------------------------------',
      formData.description || 'لا توجد ملاحظات إضافية',
      '',
      '====================================================',
      'الموجه إليه: الإدارة (Management)',
      'البريد الرسمي: nasser.alkhatib@kemizone.com',
      '====================================================',
    ].join('\n');

    // 1. Submit through official channel:
    try {
      // Create FormData payload for FormSubmit
      const formSubmitData = new FormData();
      formSubmitData.append('_subject', emailSubject);
      formSubmitData.append('اسم المصنع أو الشركة', formData.companyName);
      formSubmitData.append('المسؤول للتواصل', formData.contactPerson);
      formSubmitData.append('رقم الهاتف للتواصل', formData.phone);
      formSubmitData.append('المادة المطلوبة', formData.materialName);
      formSubmitData.append('السعر المتوقع', formData.expectedPrice || 'غير محدد');
      formSubmitData.append('التطبيق الصناعي', formData.application || 'غير محدد');
      formSubmitData.append('المواصفات والمتطلبات الفنية', formData.description || 'لا يوجد');
      formSubmitData.append('_template', 'table');
      formSubmitData.append('_captcha', 'false');

      // Send exclusively to official Kemizone email
      await fetch('https://formsubmit.co/ajax/nasser.alkhatib@kemizone.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formSubmitData,
      });
    } catch (err) {
      console.warn('FormSubmit dispatch notification:', err);
    }

    // 2. Also log to internal backend API
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'special-material-request',
          recipient: 'nasser.alkhatib@kemizone.com',
          subject: emailSubject,
          data: formData,
        }),
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      materialName: '',
      expectedPrice: '',
      application: '',
      description: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-12 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className={`absolute top-5 ${lang === 'ar' ? 'left-5' : 'right-5'} p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/40 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{lang === 'ar' ? 'خدمة الاستيراد والتوريد المخصص' : 'Custom Chemical Sourcing Service'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'ar' ? 'طلب مادة كيميائية خاصة' : 'Request a Special Chemical Material'}
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-lg">
            {lang === 'ar'
              ? 'إذا كانت المادة غير متوفرة في الكتالوج، يرجى تعبئة النموذج لتأمينها مباشرة عبر شبكتنا العالمية.'
              : 'If the chemical is not in our catalog, fill out this form and our technical sourcing team will secure it.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="text-center py-12 px-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-700" />
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {lang === 'ar' ? 'تم استلام وإرسال طلب المادة بنجاح!' : 'تم استلام وإرسال طلب المادة بنجاح!'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'تم إرسال وتوجيه طلبكم مباشرة إلى الإدارة. سيتواصل معكم فريقنا خلال وقت وجيز لتقديم المواصفات الفنية وعرض السعر.'
                    : 'تم إرسال وتوجيه طلبكم مباشرة إلى الإدارة. سيتواصل معكم فريقنا خلال وقت وجيز لتقديم المواصفات الفنية وعرض السعر.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Factory Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'ar' ? 'اسم المصنع أو الشركة *' : 'Factory / Company Name *'}</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'مثال: مصنع الرياض للدهانات' : 'e.g. Riyadh Paints Factory'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'ar' ? 'اسم المسؤول للتواصل *' : 'Contact Person Name *'}</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'الاسم الثلاثي أو الصفة' : 'Full Name & Designation'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'ar' ? 'رقم الجوال / الموبايل *' : 'Mobile / Phone Number *'}</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all text-start"
                  />
                </div>

                {/* Requested Chemical Material Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'ar' ? 'اسم المادة الكيميائية المطلوبة *' : 'Requested Chemical Material *'}</span>
                  </label>
                  <input
                    type="text"
                    name="materialName"
                    required
                    value={formData.materialName}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'اسم المادة أو كود CAS' : 'Chemical name or CAS number'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Expected Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'ar' ? 'السعر المتوقع بالطن أو الكيلو' : 'Expected Price (Per Ton / Kg)'}</span>
                  </label>
                  <input
                    type="text"
                    name="expectedPrice"
                    value={formData.expectedPrice}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'مثال: 1800 دولار للطن أو بالريال' : 'e.g. $1800/MT or target budget'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all"
                  />
                </div>

                {/* Industrial Application */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === 'ar' ? 'التطبيق الصناعي للمادة' : 'Industrial Application'}</span>
                  </label>
                  <input
                    type="text"
                    name="application"
                    value={formData.application}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'مثال: صناعة المنظفات، دهانات واجهات...' : 'e.g. Detergents, Exterior Paints, Resins...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all"
                  />
                </div>
              </div>

              {/* Description & Technical Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === 'ar' ? 'وصف تفصيلي للمتطلبات والمواصفات' : 'Detailed Specifications & Requirements'}</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'اذكر النقاء المطلوب، اللزوجة، التعبئة المفضلة (25 كغ أو 200 لتر)، وأي مواصفات خاصة...' : 'State required purity, viscosity, preferred packaging (25kg or 200L), and certificates...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting 
                      ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                      : (lang === 'ar' ? 'إرسال' : 'Send')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
