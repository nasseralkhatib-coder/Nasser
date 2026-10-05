import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Send, 
  User, 
  Phone,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react';
import { Language, PageId } from '../types';
import { ThemeMode, themeOptions } from '../theme';
import { siteContent } from '../data/translations';
import { branchOffices } from '../data/products';

interface ContactPageProps {
  lang: Language;
  currentTheme: ThemeMode;
  onNavigate: (page: PageId) => void;
  customPhone?: string;
  customLandline?: string;
  customEmail?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  lang,
  currentTheme,
  onNavigate,
}) => {
  const content = siteContent[lang];
  const activeTheme = themeOptions[currentTheme];

  const targetEmail = 'nasser.alkhatib@kemizone.com';

  const [formState, setFormState] = useState({
    name: '',
    address: '',
    mobile: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (field: 'name' | 'address' | 'mobile' | 'message', value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim() || !formState.address.trim() || !formState.mobile.trim() || !formState.message.trim()) {
      setValidationError(
        lang === 'ar'
          ? 'يرجى تعبئة كافة الحقول المطلوبة (الاسم، العنوان، الموبايل، ونص الرسالة).'
          : 'Please fill in all required fields (Name, Address, Mobile, and Message).'
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const emailSubject = `[طلب تواصل عبر موقع كميزون] من: ${formState.name} - ${formState.address}`;
    const emailBody = [
      '====================================================',
      'طلب تواصل واستفسار جديد عبر موقع شركة كميزون كميكال التجارية',
      '====================================================',
      '',
      `الاسم الكريم: ${formState.name}`,
      `العنوان / المدينة / المنطقة الصناعية: ${formState.address}`,
      `رقم الموبايل / الجوال: ${formState.mobile}`,
      '',
      'نص الرسالة والاستفسار:',
      '----------------------------------------------------',
      formState.message,
      '',
      '====================================================',
      `البريد الإلكتروني المعتمد للمتابعة: ${targetEmail}`,
      '===================================================='
    ].join('\n');

    // 1. Direct real email delivery to nasser.alkhatib@kemizone.com via FormSubmit Gateway
    try {
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: emailSubject,
          'الاسم الكريم': formState.name,
          'العنوان والمدينة': formState.address,
          'رقم الموبايل': formState.mobile,
          'نص الرسالة والاستفسار': formState.message,
          _template: 'table',
        }),
      });
    } catch (err) {
      console.warn('Direct FormSubmit email dispatch:', err);
    }

    // 2. Dispatch to server backend endpoint
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact-page-inquiry',
          recipient: targetEmail,
          subject: emailSubject,
          data: {
            name: formState.name,
            address: formState.address,
            mobile: formState.mobile,
            message: formState.message,
            sentAt: new Date().toISOString(),
          },
        }),
      });
    } catch (err) {
      console.warn('Backend email notification logged:', err);
    }

    // 3. Trigger mailto client as supplementary dispatch
    try {
      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className={`min-h-screen pt-44 sm:pt-48 pb-20 transition-colors ${activeTheme.bg}`}>
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <span>{lang === 'ar' ? 'التواصل مع إدارة كميزون' : 'Contact Kemizone Management'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {lang === 'ar' ? 'نموذج التواصل وطلب التوريد' : 'Contact & Sourcing Inquiry Form'}
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {lang === 'ar'
              ? 'تلتزم شركة كميزون كميكال التجارية بتأمين وتوريد كافة المواد الكيميائية الأساسية والخاصة لمصانعكم في المملكة والخليج بأعلى جودة وتوصيل مباشر. يرجى تعبئة النموذج أدناه وسيقوم فريقنا بالتواصل معكم فوراً.'
              : 'Kemizone Chemical Commercial .Co supplies essential and specialty raw chemicals tailored precisely to your factory requirements across KSA and GCC. Please submit your inquiry below.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Contact Form (Primary) + Company & Operations Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0">
                <Send className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === 'ar' ? 'نموذج التواصل المباشر' : 'Direct Contact Form'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'ar' 
                    ? 'يتم إرسال كافة الطلبات مباشرة إلى إدارة '
                    : 'Inquiries are transmitted directly to Management'}
                </p>
              </div>
            </div>

            {isSuccess ? (
              <div className="py-8 px-6 text-center space-y-5 bg-emerald-50/80 rounded-2xl border border-emerald-300">
                <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {lang === 'ar' ? 'تم إرسال رسالتكم بنجاح!' : 'Your message has been sent successfully!'}
                  </h3>
                  <p className="text-slate-700 text-sm max-w-lg mx-auto leading-relaxed">
                    {lang === 'ar'
                      ? 'شكراً لتواصلكم مع شركة كميزون كميكال التجارية. تم توجيه رسالتكم وتفاصيل طلبكم إلى الإدارة. سيقوم فريقنا بالتواصل معكم عبر رقم الجوال المرفق في أسرع وقت ممكن.'
                      : 'Thank you for contacting Kemizone Chemical Commercial .Co. Your inquiry and request details have been routed to Management. Our team will reach out to your mobile number shortly.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-200 text-right max-w-md mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-800">{lang === 'ar' ? 'الاسم:' : 'Name:'}</span>
                    <span>{formState.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-800">{lang === 'ar' ? 'العنوان:' : 'Address:'}</span>
                    <span>{formState.address}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="font-semibold text-slate-800">{lang === 'ar' ? 'الموبايل:' : 'Mobile:'}</span>
                    <span dir="ltr">{formState.mobile}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {validationError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {validationError}
                  </div>
                )}

                {/* 1. Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4 text-emerald-700" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب اسمك الكريم أو اسم مسؤول المشتريات' : 'Enter your name or procurement representative'}
                      className="w-full pr-10 pl-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* 2. Address Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {lang === 'ar' ? 'العنوان / المدينة / المنطقة الصناعية *' : 'Address / City / Industrial Area *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formState.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={lang === 'ar' ? 'الرياض - المنطقة الصناعية الثانية، جدة، الخرج...' : 'Riyadh 2nd Industrial City, Jeddah, Dammam...'}
                      className="w-full pr-10 pl-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* 3. Mobile Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {lang === 'ar' ? 'رقم الموبايل / الجوال *' : 'Mobile / WhatsApp Number *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4 text-emerald-700" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formState.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder={lang === 'ar' ? '05xxxxxxxx أو +966xxxxxxxxx' : '05xxxxxxxx or +966xxxxxxxxx'}
                      className="w-full pr-10 pl-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all text-slate-900 font-medium"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* 4. Message Text Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {lang === 'ar' ? 'نص الرسالة / الاستفسار والمواد المطلوبة *' : 'Message Text / Sourcing Inquiry *'}
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 right-3.5 pointer-events-none text-slate-400">
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب نص رسالتك بالتفصيل، نوع المواد الكيميائية المطلوبة، الكميات التقديرية، أو أي متطلبات فنية ترغب بالاستفسار عنها...' : 'Write your inquiry, required chemicals, estimated quantities, or technical requirements...'}
                      className="w-full pr-10 pl-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all text-slate-900 font-medium resize-y"
                    />
                  </div>
                </div>

                {/* Dispatch notice & Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{lang === 'ar' ? 'جارٍ إرسال الرسالة...' : 'Sending inquiry...'}</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-emerald-200" />
                        <span>{lang === 'ar' ? 'إرسال الرسالة إلى الإدارة' : 'Submit Inquiry to Management'}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center mt-3">
                    {lang === 'ar'
                      ? 'يتم تسليم رسالتكم تلقائياً ومباشرة إلى الإدارة'
                      : 'Your message will be automatically delivered directly to Management'}
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Headquarters & Logistics Overview Information (No phone/email displayed) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-8 sm:p-9 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {lang === 'ar' ? 'المقر الرئيسي (الرياض)' : 'Corporate Headquarters (Riyadh)'}
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">
                    {lang === 'ar' ? 'شركة كميزون كميكال التجارية' : 'Kemizone Chemical Commercial .Co'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">{content.contact.addressLabel}</span>
                    <span className="text-white font-medium">{branchOffices[0].address[lang]}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">{lang === 'ar' ? 'ساعات العمل الرسمية:' : 'Working Hours:'}</span>
                    <span className="text-white">{branchOffices[0].workingHours[lang]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                <span>{lang === 'ar' ? 'المقر الرئيسي: الرياض • التغطية الميدانية: كافة مدن ومحافظات المملكة ودول مجلس التعاون الخليجي' : 'Headquarters: Riyadh • Logistics coverage: All Saudi industrial zones & GCC'}</span>
              </div>
            </div>

            {/* Quality & Logistics Assurance Card */}
            <div className="p-7 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 text-slate-700">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{lang === 'ar' ? 'ضمانات التوريد المعتمدة' : 'Verified Supply Standards'}</span>
              </h4>

              <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                  <span>{lang === 'ar' ? 'توفير شهادات التحليل المخبري (COA) وبطاقات السلامة (MSDS) مع كل شحنة' : 'Provision of Certificates of Analysis (COA) & MSDS with every delivery'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                  <span>{lang === 'ar' ? 'تعبئة قياسية صناعية أصلية: أكياس 25 كغ للمساحيق وبراميل 200 لتر وخزانات IBC للسوائل' : 'Original industrial packaging: 25kg bags, 200L drums, and IBC tanks'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                  <span>{lang === 'ar' ? 'إمكانية استيراد وتأمين مواد كيميائية خاصة غير مدرجة بالكتالوج بناءً على طلبكم' : 'Direct custom import and sourcing for unlisted specialty chemicals upon request'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Regional Branches Network (Riyadh HQ, Jeddah, Dammam - Clean addresses without phone/email) */}
        <div className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
              {content.branches.sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'مواقع ومستودعات كميزون الميدانية' : 'Field Branches & Warehouses'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar' ? 'للتواصل وطلب التوريد لأي من هذه المدن، يرجى تعبئة النموذج أعلاه' : 'To request chemical deliveries for any location, please submit the form above'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchOffices.map((b) => (
              <div 
                key={b.id}
                className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      {b.city[lang]}
                    </h4>
                    {b.isHQ && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {content.branches.hqBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-900 mb-2">
                    {b.title[lang]}
                  </p>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {b.address[lang]}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{b.workingHours[lang]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
