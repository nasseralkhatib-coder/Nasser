import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Language } from '../types';
import { siteContent } from '../data/translations';

interface ContactSectionProps {
  lang: Language;
  customPhone?: string;
  customEmail?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  customPhone = '+966 13 898 5544',
  customEmail = 'info@kemizone.com',
}) => {
  const content = siteContent[lang];
  const [sentSuccess, setSentSuccess] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipient = 'nasser.alkhatib@kemizone.com';
    const emailSubject = `[موقع كميزون] استفسار تواصل جديد: ${formState.subject || formState.name}`;
    const emailBody = [
      '====================================================',
      'رسالة واستفسار تواصل جديد عبر موقع كميزون الرسمي',
      '====================================================',
      '',
      `الاسم: ${formState.name}`,
      `البريد الإلكتروني للعميل: ${formState.email}`,
      `رقم الهاتف / الجوال: ${formState.phone || 'غير مسجل'}`,
      `الموضوع: ${formState.subject}`,
      '',
      'نص الرسالة والاستفسار:',
      '----------------------------------------------------',
      formState.message,
      '',
      '====================================================',
      'الموجه إليه: الإدارة (Management)',
      '===================================================='
    ].join('\n');

    // Direct FormSubmit email delivery to nasser.alkhatib@kemizone.com
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: emailSubject,
          'الاسم الكريم': formState.name,
          'البريد الإلكتروني': formState.email,
          'رقم الهاتف': formState.phone,
          'الموضوع': formState.subject,
          'نص الرسالة والاستفسار': formState.message,
          _template: 'table',
        }),
      }).catch((err) => console.warn('Direct FormSubmit error:', err));
    } catch {
      // ignore
    }

    // Post to server backend
    try {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact-general-inquiry',
          recipient,
          subject: emailSubject,
          data: formState,
        }),
      }).catch((err) => console.warn('Email dispatch log:', err));
    } catch {
      // ignore
    }

    // Trigger mail client
    try {
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    } catch {
      // ignore
    }

    setSentSuccess(true);
    setFormState({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setTimeout(() => {
      setSentSuccess(false);
    }, 10000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 relative border-t border-slate-800">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.contact.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.contact.heading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {content.contact.subheading}
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Direct Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-800">
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>{content.contact.hqTitle}</span>
              </h3>

              {/* Phone Channel */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                    {content.contact.callUs}
                  </span>
                  <a
                    href={`tel:${customPhone}`}
                    className="text-base font-bold text-white hover:text-teal-400 transition-colors font-mono"
                    dir="ltr"
                  >
                    {customPhone}
                  </a>
                </div>
              </div>

              {/* Email Channel */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                    {content.contact.emailUs}
                  </span>
                  <a
                    href={`mailto:${customEmail}`}
                    className="text-base font-bold text-white hover:text-cyan-400 transition-colors font-mono"
                  >
                    {customEmail}
                  </a>
                </div>
              </div>

              {/* Physical Location */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                    {content.contact.visitUs}
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {lang === 'ar'
                      ? 'شارع الأمير تركي، حي اليرموك، الخبر 34424، المملكة العربية السعودية'
                      : 'Prince Turki Street, Al Yarmouk District, Al-Khobar 34424, Saudi Arabia'}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 pt-2 border-t border-slate-850">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                    {lang === 'ar' ? 'ساعات العمل الرسمية' : 'Business Hours'}
                  </span>
                  <p className="text-sm text-slate-200">
                    {lang === 'ar'
                      ? 'السبت - الخميس: 9:00 ص - 6:00 م'
                      : 'Saturday - Thursday: 9:00 AM - 6:00 PM'}
                  </p>
                </div>
              </div>

            </div>

            {/* Quality Commitment badge */}
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-teal-400 shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'يتم التعامل مع جميع الاستفسارات التجارية وسعارات المصانع بسرية واحترافية تامة.'
                  : 'All commercial plant requirements and contract inquiries are handled under strict confidentiality.'}
              </span>
            </div>

          </div>

          {/* Inquiry Form Column */}
          <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              <span>{content.contact.formTitle}</span>
            </h3>

            {sentSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">
                  {content.contact.sentSuccess}
                </h4>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {lang === 'ar'
                    ? 'تم إرسال رسالتكم وموجهة مباشرة إلى إدارة التسويق وتطوير الأعمال: nasser.alkhatib@kemizone.com'
                    : 'Your message has been received and routed directly to: nasser.alkhatib@kemizone.com'}
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/40">
                    Recipient: nasser.alkhatib@kemizone.com
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {content.contact.nameField} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Your name'}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {content.contact.emailField} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {content.contact.phoneField}
                    </label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+966 5X XXX XXXX"
                      dir="ltr"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {content.contact.subjectField} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder={lang === 'ar' ? 'استفسار توريد / عينات' : 'Supply contract / samples'}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {content.contact.messageField} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder={lang === 'ar' ? 'اكتب تفاصيل استفسارك أو طلبك هنا...' : 'Describe your specific requirements...'}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-teal-400 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{content.contact.sendBtn}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
