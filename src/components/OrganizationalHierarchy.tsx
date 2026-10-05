import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Truck, 
  Laptop, 
  Megaphone, 
  UserCheck 
} from 'lucide-react';
import { Language } from '../types';

interface PersonNode {
  id: string;
  name: string;
  role: string;
  isVacant?: boolean;
}

interface DepartmentData {
  id: string;
  title: string;
  manager: PersonNode;
  members: PersonNode[];
  staffCountText: string;
}

interface OrgChartData {
  mainTitle: string;
  subTitle: string;
  badge: string;
  totalEmployeesCount: string;
  totalEmployeesLabel: string;
  departmentsCount: string;
  departmentsLabel: string;
  gm: PersonNode;
  dgm: PersonNode;
  ceo: PersonNode;
  bizDev: {
    title: string;
    manager: PersonNode;
    officer: PersonNode;
  };
  finance: {
    title: string;
    cfo: PersonNode;
    accountants: PersonNode[];
  };
  departments: DepartmentData[];
}

const defaultArabicData: OrgChartData = {
  mainTitle: 'الهيكل التنظيمي لشركة كميزون كميكال التجارية',
  subTitle: 'شركة كميزون كميكال التجارية',
  badge: '2026',
  totalEmployeesCount: '38',
  totalEmployeesLabel: 'إجمالي الكادر',
  departmentsCount: '8',
  departmentsLabel: 'الأقسام',
  gm: {
    id: 'gm',
    name: 'وليد الرميح',
    role: 'المدير العام',
  },
  dgm: {
    id: 'dgm',
    name: 'عبدالله السيف',
    role: 'نائب المدير العام',
  },
  ceo: {
    id: 'ceo',
    name: 'نديم الخطيب',
    role: 'المدير التنفيذي',
  },
  bizDev: {
    title: 'إدارة تطوير الأعمال والشركات',
    manager: {
      id: 'bd_mgr',
      name: 'ناصر الخطيب',
      role: 'مدير تطوير الأعمال والشركات',
    },
    officer: {
      id: 'bd_off',
      name: 'عمر يحيى',
      role: 'موظف تطوير أعمال',
    },
  },
  finance: {
    title: 'قسم الإدارة المالية',
    cfo: {
      id: 'cfo',
      name: 'توفيق السيد',
      role: 'المدير المالي',
    },
    accountants: [
      { id: 'acc_1', name: 'رضا طلبة', role: 'محاسب' },
      { id: 'acc_2', name: 'أحمد حسن', role: 'محاسب' },
      { id: 'acc_3', name: 'بشير النافع', role: 'محاسب' },
    ],
  },
  departments: [
    {
      id: 'sales',
      title: 'قسم المبيعات',
      staffCountText: '7 موظفين',
      manager: { id: 'sales_mgr', name: 'غسان زيد', role: 'مدير المبيعات' },
      members: [
        { id: 'sales_1', name: 'صالح الطاهر', role: 'مندوب مبيعات' },
        { id: 'sales_2', name: 'عمرو منصور', role: 'مندوب مبيعات' },
        { id: 'sales_3', name: 'جهاد قطيفان', role: 'مندوب مبيعات' },
        { id: 'sales_4', name: 'قصي حميدي', role: 'مندوب مبيعات' },
        { id: 'sales_5', name: 'محمود غيتي', role: 'مندوب مبيعات' },
        { id: 'sales_6', name: 'مهان عظيم', role: 'مندوب مبيعات' },
      ],
    },
    {
      id: 'marketing',
      title: 'قسم التسويق',
      staffCountText: '3 موظفين',
      manager: { id: 'mkt_mgr', name: 'حسام المحمدي', role: 'مدير التسويق' },
      members: [
        { id: 'mkt_1', name: 'نادر حطاب', role: 'موظف تسويق' },
        { id: 'mkt_2', name: 'قصي حميدي', role: 'موظف تسويق' },
      ],
    },
    {
      id: 'pr',
      title: 'قسم العلاقات العامة',
      staffCountText: '2 موظفين',
      manager: { id: 'pr_mgr', name: 'أحمد العتيبي', role: 'مدير العلاقات العامة' },
      members: [
        { id: 'pr_1', name: 'سليمان العنزي', role: 'موظف علاقات عامة' },
      ],
    },
    {
      id: 'hr',
      title: 'قسم الموارد البشرية',
      staffCountText: '3 موظفين',
      manager: { id: 'hr_mgr', name: 'نورا اليامي', role: 'مدير الموارد البشرية' },
      members: [
        { id: 'hr_1', name: 'خديجة الجيزاني', role: 'موظف موارد بشرية' },
        { id: 'hr_2', name: 'حصة الدوسري', role: 'موظف موارد بشرية' },
      ],
    },
    {
      id: 'it',
      title: 'قسم تكنولوجيا المعلومات',
      staffCountText: '2 موظفين',
      manager: { id: 'it_mgr', name: 'مروان المانع', role: 'مدير تكنولوجيا المعلومات' },
      members: [
        { id: 'it_1', name: 'وحيد الدسوقي', role: 'أخصائي تكنولوجيا المعلومات' },
      ],
    },
    {
      id: 'supply',
      title: 'قسم التخزين والتوريد',
      staffCountText: '12 موظف وسائق',
      manager: { id: 'sup_mgr', name: 'حمد الراجح', role: 'مدير التخزين والتوريد' },
      members: [
        { id: 'sup_1', name: 'شفيق إسلام', role: 'موظف توريد' },
        { id: 'sup_2', name: 'وجيه خوخار', role: 'موظف توريد' },
        { id: 'sup_3', name: 'علي شودري', role: 'موظف توريد' },
        { id: 'sup_drivers', name: 'سائقين', role: 'عدد 8' },
      ],
    },
  ],
};

const defaultEnglishData: OrgChartData = {
  mainTitle: 'Organizational Structure',
  subTitle: 'Kemizone Chemical Commercial .Co',
  badge: '2026',
  totalEmployeesCount: '38',
  totalEmployeesLabel: 'Total Team',
  departmentsCount: '8',
  departmentsLabel: 'Departments',
  gm: {
    id: 'gm',
    name: 'Waleed Al-Rumaih',
    role: 'General Manager (GM)',
  },
  dgm: {
    id: 'dgm',
    name: 'Abdulla Alsaif',
    role: 'Deputy General Manager (DGM)',
  },
  ceo: {
    id: 'ceo',
    name: 'Nadeem Al khatib',
    role: 'Chief Executive Officer (CEO)',
  },
  bizDev: {
    title: 'Business Development & Partnerships',
    manager: {
      id: 'bd_mgr',
      name: 'Nasser Al khatib',
      role: 'Business Development Manager',
    },
    officer: {
      id: 'bd_off',
      name: 'Omar Yahya',
      role: 'Business Development Officer',
    },
  },
  finance: {
    title: 'Finance & Accounts',
    cfo: {
      id: 'cfo',
      name: 'Tawfiq Alsaid',
      role: 'Chief Financial Officer (CFO)',
    },
    accountants: [
      { id: 'acc_1', name: 'Reda Tolba', role: 'Accountant' },
      { id: 'acc_2', name: 'Ahmad Hasan', role: 'Accountant' },
      { id: 'acc_3', name: 'Basher Alnafee', role: 'Accountant' },
    ],
  },
  departments: [
    {
      id: 'sales',
      title: 'Sales Department',
      staffCountText: '7 Members',
      manager: { id: 'sales_mgr', name: 'Ghsan Zaid', role: 'Sales Manager' },
      members: [
        { id: 'sales_1', name: 'Saleh Altaher', role: 'Sales Representative' },
        { id: 'sales_2', name: 'Amro Mansur', role: 'Sales Representative' },
        { id: 'sales_3', name: 'Jehad Qtifan', role: 'Sales Representative' },
        { id: 'sales_4', name: 'Qusai Humaidi', role: 'Sales Representative' },
        { id: 'sales_5', name: 'Mahmud Gyati', role: 'Sales Representative' },
        { id: 'sales_6', name: 'Muhan Azem', role: 'Sales Representative' },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing Department',
      staffCountText: '3 Members',
      manager: { id: 'mkt_mgr', name: 'Husam Almuhamadi', role: 'Marketing Manager' },
      members: [
        { id: 'mkt_1', name: 'Nader Hattab', role: 'Marketing Officer' },
        { id: 'mkt_2', name: 'Qusai Humaidi', role: 'Marketing Officer' },
      ],
    },
    {
      id: 'pr',
      title: 'Public Relations Department',
      staffCountText: '2 Members',
      manager: { id: 'pr_mgr', name: 'Ahmed Al-Otaibi', role: 'Public Relations Manager' },
      members: [
        { id: 'pr_1', name: 'Suliman Alanizi', role: 'Public Relations Officer' },
      ],
    },
    {
      id: 'hr',
      title: 'Human Resources',
      staffCountText: '3 Members',
      manager: { id: 'hr_mgr', name: 'Nora alyami', role: 'HR Manager' },
      members: [
        { id: 'hr_1', name: 'Khadija Aljezani', role: 'HR Officer' },
        { id: 'hr_2', name: 'Hosa Aldosari', role: 'HR Officer' },
      ],
    },
    {
      id: 'it',
      title: 'Information Technology',
      staffCountText: '2 Members',
      manager: { id: 'it_mgr', name: 'Marwan Almanee', role: 'IT Manager' },
      members: [
        { id: 'it_1', name: 'Wahed Aldosoqi', role: 'IT Systems Specialist' },
      ],
    },
    {
      id: 'supply',
      title: 'Storage & Supply Department',
      staffCountText: '12 Staff & Drivers',
      manager: { id: 'sup_mgr', name: 'Hamad Al rajeh', role: 'Storage & Supply Manager' },
      members: [
        { id: 'sup_1', name: 'Shafiq Islam', role: 'Supply Officer' },
        { id: 'sup_2', name: 'Wajeh Kokar', role: 'Supply Officer' },
        { id: 'sup_3', name: 'Ali Shodri', role: 'Supply Officer' },
        { id: 'sup_drivers', name: 'Drivers', role: 'Count 8' },
      ],
    },
  ],
};

const arToEnDictionary: Record<string, string> = {
  'شاغر': 'Vacant',
  'الإدارة العليا': 'Top Management',
  'وليد الرميح': 'Waleed Al-Romaih',
  'المدير العام': 'General Manager',
  'نائب المدير العام': 'Deputy General Manager',
  'نديم الخطيب': 'Nadeem Al khatib',
  'المدير التنفيذي': 'Chief Executive Officer',
  'ناصر الخطيب': 'Nasser Al khatib',
  'مدير تطوير الأعمال والشركات': 'Business Development Manager',
  'موظف تطوير أعمال': 'Business Development Officer',
  'إدارة تطوير الأعمال والشركات': 'Business Development & Partnerships',
  'قسم الإدارة المالية': 'Finance & Accounts Department',
  'المدير المالي': 'Chief Financial Officer',
  'محاسب': 'Accountant',
  'رضا طلبة': 'Reda Tolba',
  'قسم المبيعات': 'Sales Department',
  'مدير قسم المبيعات': 'Sales Department Manager',
  'مدير المبيعات': 'Sales Department Manager',
  'مندوب مبيعات': 'Sales Representative',
  'صالح': 'Saleh',
  'عمرو': 'Amro',
  'قسم التسويق': 'Marketing Department',
  'مدير قسم التسويق': 'Marketing Department Manager',
  'مدير التسويق': 'Marketing Department Manager',
  'موظف تسويق': 'Marketing Officer',
  'قسم العلاقات العامة': 'Public Relations Department',
  'مدير قسم العلاقات العامة': 'Public Relations Department Manager',
  'مدير العلاقات العامة': 'Public Relations Department Manager',
  'أحمد العتيبي': 'Ahmed Al-Otaibi',
  'موظف علاقات عامة': 'Public Relations Officer',
  'قسم الموارد البشرية': 'Human Resources Department',
  'مدير قسم الموارد البشرية': 'Human Resources Department Manager',
  'مدير الموارد البشرية': 'Human Resources Department Manager',
  'موظف موارد بشرية': 'HR Officer',
  'قسم تقنية المعلومات': 'Information Technology Department',
  'مدير قسم تقنية المعلومات': 'IT Department Manager',
  'مدير تقنية المعلومات': 'IT Department Manager',
  'أخصائي تقنية المعلومات': 'IT Systems Specialist',
  'قسم التخزين والتوريد': 'Storage & Supply Department',
  'مدير قسم التخزين والتوريد': 'Storage & Supply Department Manager',
  'مدير التخزين والتوريد': 'Storage & Supply Department Manager',
  'عبدالله السيف': 'Abdulla Alsaif',
  'عمر يحيى': 'Omar Yahya',
  'توفيق السيد': 'Tawfiq Alsaid',
  'أحمد حسن': 'Ahmad Hasan',
  'بشير النافع': 'Basher Alnafee',
  'غسان زيد': 'Ghsan Zaid',
  'صالح الطاهر': 'Saleh Altaher',
  'عمرو منصور': 'Amro Mansur',
  'جهاد قطيفان': 'Jehad Qtifan',
  'قصي حميدي': 'Qusai Humaidi',
  'محمود غيتي': 'Mahmud Gyati',
  'مهان عظيم': 'Muhan Azem',
  'حسام المحمدي': 'Husam Almuhamadi',
  'نادر حطاب': 'Nader Hattab',
  'سليمان العنزي': 'Suliman Alanizi',
  'نورا اليامي': 'Nora alyami',
  'خديجة الجيزاني': 'Khadija Aljezani',
  'حصة الدوسري': 'Hosa Aldosari',
  'مروان المانع': 'Marwan Almanee',
  'وحيد الدسوقي': 'Wahed Aldosoqi',
  'حمد الراجح': 'Hamad Al rajeh',
  'شفيق إسلام': 'Shafiq Islam',
  'وجيه خوخار': 'Wajeh Kokar',
  'علي شودري': 'Ali Shodri',
  'سائقين': 'Drivers',
  'قسم تكنولوجيا المعلومات': 'Information Technology',
  'أخصائي تكنولوجيا المعلومات': 'IT Systems Specialist',
};

const arabicToLatinMap: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h'
};

function translateOrTransliterate(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (arToEnDictionary[trimmed]) {
    return arToEnDictionary[trimmed];
  }
  if (!/[\u0600-\u06FF]/.test(trimmed)) {
    return trimmed;
  }
  const words = trimmed.split(/\s+/);
  return words.map(word => {
    if (arToEnDictionary[word]) return arToEnDictionary[word];
    const latin = word.split('').map(char => arabicToLatinMap[char] || char).join('');
    return latin.charAt(0).toUpperCase() + latin.slice(1);
  }).join(' ');
}

function syncArabicEditToEnglish(prevEn: OrgChartData, newAr: OrgChartData): OrgChartData {
  return {
    ...prevEn,
    totalEmployeesCount: newAr.totalEmployeesCount,
    departmentsCount: newAr.departmentsCount,
    badge: newAr.badge === defaultArabicData.badge ? defaultEnglishData.badge : translateOrTransliterate(newAr.badge),
    mainTitle: newAr.mainTitle === defaultArabicData.mainTitle ? defaultEnglishData.mainTitle : translateOrTransliterate(newAr.mainTitle),
    subTitle: newAr.subTitle === defaultArabicData.subTitle ? defaultEnglishData.subTitle : translateOrTransliterate(newAr.subTitle),
    gm: {
      ...prevEn.gm,
      name: translateOrTransliterate(newAr.gm.name),
      role: translateOrTransliterate(newAr.gm.role),
      isVacant: newAr.gm.name === 'شاغر' || !!newAr.gm.isVacant,
    },
    dgm: {
      ...prevEn.dgm,
      name: translateOrTransliterate(newAr.dgm.name),
      role: translateOrTransliterate(newAr.dgm.role),
      isVacant: newAr.dgm.name === 'شاغر' || !!newAr.dgm.isVacant,
    },
    ceo: {
      ...prevEn.ceo,
      name: translateOrTransliterate(newAr.ceo.name),
      role: translateOrTransliterate(newAr.ceo.role),
      isVacant: newAr.ceo.name === 'شاغر' || !!newAr.ceo.isVacant,
    },
    bizDev: {
      ...prevEn.bizDev,
      title: translateOrTransliterate(newAr.bizDev.title),
      manager: {
        ...prevEn.bizDev.manager,
        name: translateOrTransliterate(newAr.bizDev.manager.name),
        role: translateOrTransliterate(newAr.bizDev.manager.role),
      },
      officer: {
        ...prevEn.bizDev.officer,
        name: translateOrTransliterate(newAr.bizDev.officer.name),
        role: translateOrTransliterate(newAr.bizDev.officer.role),
        isVacant: newAr.bizDev.officer.name === 'شاغر' || !!newAr.bizDev.officer.isVacant,
      },
    },
    finance: {
      ...prevEn.finance,
      title: translateOrTransliterate(newAr.finance.title),
      cfo: {
        ...prevEn.finance.cfo,
        name: translateOrTransliterate(newAr.finance.cfo.name),
        role: translateOrTransliterate(newAr.finance.cfo.role),
        isVacant: newAr.finance.cfo.name === 'شاغر' || !!newAr.finance.cfo.isVacant,
      },
      accountants: newAr.finance.accountants.map((acc, idx) => ({
        ...(prevEn.finance.accountants[idx] || acc),
        name: translateOrTransliterate(acc.name),
        role: translateOrTransliterate(acc.role),
        isVacant: acc.name === 'شاغر' || !!acc.isVacant,
      })),
    },
    departments: newAr.departments.map((dept, dIdx) => {
      const enDept = prevEn.departments[dIdx] || dept;
      return {
        ...enDept,
        title: translateOrTransliterate(dept.title),
        staffCountText: dept.staffCountText.replace(/موظفين|موظف وسائق/g, 'Employees'),
        manager: {
          ...enDept.manager,
          name: translateOrTransliterate(dept.manager.name),
          role: translateOrTransliterate(dept.manager.role),
          isVacant: dept.manager.name === 'شاغر' || !!dept.manager.isVacant,
        },
        members: dept.members.map((mem, mIdx) => {
          const enMem = enDept.members[mIdx] || mem;
          return {
            ...enMem,
            name: translateOrTransliterate(mem.name),
            role: translateOrTransliterate(mem.role),
            isVacant: mem.name === 'شاغر' || !!mem.isVacant,
          };
        }),
      };
    }),
  };
}

interface OrganizationalHierarchyProps {
  lang: Language;
}

export const OrganizationalHierarchy: React.FC<OrganizationalHierarchyProps> = ({ lang }) => {
  const [hierarchyLang, setHierarchyLang] = useState<Language>(lang);

  // Load datasets
  const [arData] = useState<OrgChartData>(() => {
    try {
      const saved = localStorage.getItem('kz_org_chart_data_ar_v4');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultArabicData;
  });

  const [enData] = useState<OrgChartData>(() => {
    try {
      const saved = localStorage.getItem('kz_org_chart_data_en_v4');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultEnglishData;
  });

  // Keep in sync if lang changes from outer prop initially
  useEffect(() => {
    setHierarchyLang(lang);
  }, [lang]);

  const isAr = hierarchyLang === 'ar';
  const currentData = isAr ? arData : enData;

  return (
    <section 
      id="org-hierarchy" 
      className="mt-16 pt-12 border-t-2 border-emerald-100/90 scroll-mt-24"
    >
      {/* Container with clean white corporate framing */}
      <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-6 sm:p-8 lg:p-10 border-b border-emerald-100 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Title (subTitle removed completely as requested) */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentData.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                <span className="text-emerald-900 block">
                  {currentData.mainTitle}
                </span>
              </h2>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              {/* Stat 1: Total Employees */}
              <div className="px-5 py-3 rounded-2xl bg-white border-2 border-emerald-600 text-slate-900 shadow-sm text-center min-w-[130px] flex-1 sm:flex-initial">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-800 leading-none">
                  {currentData.totalEmployeesCount}
                </span>
                <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider block mt-1">
                  {currentData.totalEmployeesLabel}
                </span>
              </div>

              {/* Stat 2: Total Departments */}
              <div className="px-5 py-3 rounded-2xl bg-white border-2 border-emerald-600 text-slate-900 shadow-sm text-center min-w-[130px] flex-1 sm:flex-initial">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-800 leading-none">
                  {currentData.departmentsCount}
                </span>
                <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider block mt-1">
                  {currentData.departmentsLabel}
                </span>
              </div>
            </div>

          </div>

          {/* Controls Bar: Language Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>{isAr ? 'المخطط التنظيمي المعتمد' : 'Certified Organizational Chart'}</span>
            </div>

            {/* Language Switcher */}
            <div className="inline-flex rounded-xl p-1 bg-emerald-50 border border-emerald-200">
              <button
                type="button"
                onClick={() => setHierarchyLang('ar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hierarchyLang === 'ar'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setHierarchyLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hierarchyLang === 'en'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                English
              </button>
            </div>

          </div>

        </div>

        {/* Chart Content Area - Crisp White Background */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto bg-white">
          <div className="min-w-[960px] max-w-6xl mx-auto py-6 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* LEVEL 1: GENERAL MANAGER (Top Executive) */}
            <div className="flex flex-col items-center">
              <div className="w-80 rounded-2xl bg-white text-slate-900 p-5 shadow-md border-2 border-emerald-600 text-center relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  {isAr ? 'الإدارة العليا' : 'Top Management'}
                </div>
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-2">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  {currentData.gm.name}
                </h4>
                <p className="text-xs font-bold text-emerald-800 mt-0.5">
                  {currentData.gm.role}
                </p>
              </div>

              {/* Vertical Stem */}
              <div className="w-0.5 h-8 bg-emerald-600"></div>
            </div>

            {/* LEVEL 2: LEADERSHIP WING (CEO & DEPUTY GM) */}
            <div className="flex flex-col items-center">
              {/* Horizontal Bar */}
              <div className="w-96 h-0.5 bg-emerald-600"></div>

              {/* Stems to nodes */}
              <div className="w-96 flex justify-between">
                <div className="w-0.5 h-6 bg-emerald-600"></div>
                <div className="w-0.5 h-6 bg-emerald-600"></div>
              </div>

              <div className="w-full max-w-2xl flex justify-between gap-8 px-4">
                {/* Deputy GM */}
                <div className="flex-1 rounded-2xl bg-white border-2 border-emerald-600 p-4 shadow-sm text-center">
                  <h5 className="text-base font-extrabold text-slate-900">
                    {currentData.dgm.name}
                  </h5>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    {currentData.dgm.role}
                  </p>
                </div>

                {/* CEO */}
                <div className="flex-1 rounded-2xl bg-white border-2 border-emerald-600 p-4 shadow-sm text-center">
                  <h5 className="text-base font-extrabold text-slate-900">
                    {currentData.ceo.name}
                  </h5>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    {currentData.ceo.role}
                  </p>
                </div>
              </div>

              {/* Vertical Stem from CEO to Strategic Divisions */}
              <div className="w-0.5 h-7 bg-emerald-600"></div>
            </div>

            {/* LEVEL 3: STRATEGIC DIVISIONS (Business Development & Finance) - Compact & Scaled */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl h-0.5 bg-emerald-600"></div>

              <div className="w-full max-w-2xl flex justify-around">
                <div className="w-0.5 h-5 bg-emerald-600"></div>
                <div className="w-0.5 h-5 bg-emerald-600"></div>
              </div>

              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5 px-3">
                
                {/* Division 1: Business Development & Partnerships (Compact) */}
                <div className="rounded-2xl bg-white border-2 border-emerald-500 p-3.5 shadow-sm space-y-2.5 flex flex-col items-center text-center">
                  
                  {/* Header */}
                  <div className="w-full flex items-center justify-center gap-1.5 pb-1.5 border-b border-emerald-100 text-center">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 text-center">
                      {currentData.bizDev.title}
                    </h4>
                  </div>

                  {/* Manager: Nasser Al khatib */}
                  <div className="w-full p-2 rounded-xl bg-white border border-emerald-300 shadow-2xs flex flex-col items-center justify-center text-center">
                    <span className="text-xs sm:text-[13px] font-black text-slate-900 block text-center">
                      {currentData.bizDev.manager.name}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold block text-center mt-0.5">
                      {currentData.bizDev.manager.role}
                    </span>
                  </div>

                  {/* Officer: Omar Yahya */}
                  <div className="max-w-[200px] w-full py-1.5 px-2.5 rounded-lg bg-white border border-emerald-200 flex flex-col items-center justify-center text-center shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-900 block text-center">
                      {currentData.bizDev.officer.name}
                    </span>
                    <span className="text-[9px] text-emerald-800 font-semibold block text-center">
                      {currentData.bizDev.officer.role}
                    </span>
                  </div>
                </div>

                {/* Division 2: Finance & Accounts (Compact) */}
                <div className="rounded-2xl bg-white border-2 border-emerald-500 p-3.5 shadow-sm space-y-2.5 flex flex-col items-center text-center">
                  
                  {/* Header */}
                  <div className="w-full flex items-center justify-center gap-1.5 pb-1.5 border-b border-emerald-100 text-center">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                      <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 text-center">
                      {currentData.finance.title}
                    </h4>
                  </div>

                  {/* CFO: Tawfiq Alsaid */}
                  <div className="w-full p-2 rounded-xl bg-white border border-emerald-300 shadow-2xs flex flex-col items-center justify-center text-center">
                    <span className="text-xs sm:text-[13px] font-black text-slate-900 block text-center">
                      {currentData.finance.cfo.name}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold block text-center mt-0.5">
                      {currentData.finance.cfo.role}
                    </span>
                  </div>

                  {/* Accountants Grid (3 Accountants) */}
                  <div className="w-full grid grid-cols-3 gap-1.5">
                    {currentData.finance.accountants.map((acc) => (
                      <div 
                        key={acc.id}
                        className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-2xs flex flex-col items-center justify-center text-center"
                      >
                        <span className="text-[10px] font-bold text-slate-900 block text-center truncate w-full">
                          {acc.name}
                        </span>
                        <span className="text-[9px] text-emerald-800 font-semibold block text-center truncate w-full">
                          {acc.role}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* Vertical Stem into Operational Grid */}
              <div className="w-0.5 h-7 bg-emerald-600"></div>
            </div>

            {/* LEVEL 4: 6 CORE OPERATIONAL DEPARTMENTS */}
            <div className="flex flex-col items-center">
              <div className="w-full h-0.5 bg-emerald-600"></div>

              {/* Stems to 6 departments */}
              <div className="w-full grid grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="w-0.5 h-6 bg-emerald-600"></div>
                  </div>
                ))}
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                {currentData.departments.map((dept, deptIdx) => {
                  const deptIcons = [Briefcase, Megaphone, ShieldCheck, Users, Laptop, Truck];
                  const DeptIcon = deptIcons[deptIdx % deptIcons.length];

                  return (
                    <div 
                      key={dept.id}
                      className="rounded-2xl bg-white border border-emerald-300 p-3.5 shadow-sm space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        {/* Department Title */}
                        <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100">
                          <DeptIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                          <h5 className="text-xs font-black text-slate-900">
                            {dept.title}
                          </h5>
                        </div>

                        {/* Department Staff List */}
                        <div className="space-y-1.5 pt-2">
                          {/* Department Manager */}
                          <div className="p-2.5 rounded-xl bg-white border-2 border-emerald-600/90 shadow-sm text-center">
                            <div className="space-y-0.5 py-0.5">
                              {dept.manager.name && dept.manager.name !== (isAr ? 'شاغر' : 'Vacant') ? (
                                <h6 className="text-xs sm:text-[13px] font-black text-slate-950 tracking-tight block">
                                  {dept.manager.name}
                                </h6>
                              ) : null}
                              <p className="text-[11px] font-extrabold text-emerald-800 tracking-tight block leading-tight">
                                {dept.manager.role}
                              </p>
                            </div>
                          </div>

                          {/* Divider to separate Manager from Employees */}
                          <div className="flex items-center gap-1.5 py-0.5">
                            <div className="h-px bg-emerald-200 flex-1"></div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                              {isAr ? 'فريق العمل' : 'Staff'}
                            </span>
                            <div className="h-px bg-emerald-200 flex-1"></div>
                          </div>

                          {/* Members */}
                          {dept.members.map((member) => (
                            <div 
                              key={member.id}
                              className="p-1.5 rounded-lg bg-white border border-emerald-200 text-slate-900 shadow-xs text-[10px]"
                            >
                              <span className="font-bold text-slate-900 block">{member.name}</span>
                              <span className="text-emerald-800">{member.role}</span>
                            </div>
                          ))}

                        </div>
                      </div>

                      {/* Staff count footer per department */}
                      <div className="pt-1.5 border-t border-slate-100 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 block text-center">
                          {dept.staffCountText}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
