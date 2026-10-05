import { ChemicalProduct, ProductCategory, Industry, BranchOffice } from '../types';
import customProductsJson from './customProducts.json';

export const productCategories: ProductCategory[] = [
  {
    "id": "all",
    "name": {
      "en": "All Chemical Products",
      "ar": "جميع المواد الكيميائية"
    },
    "description": {
      "en": "Full catalog of 37 industrial raw materials and specialty chemicals",
      "ar": "الكتالوج الشامل لـ 37 مادة كيميائية وخامات صناعية معتمدة"
    },
    "iconName": "LayoutGrid",
    "count": 37
  },
  {
    "id": "cellulose-polymers",
    "name": {
      "en": "Cellulose Ethers & Polymer Powders",
      "ar": "إيثرات السليلوز وبودرة البوليمر"
    },
    "description": {
      "en": "HPMC, HEC, MHEC, HEMC, and Redispersible Polymer Powder (RDP)",
      "ar": "هيدروكسي بروبيل HPMC، وسليلوز HEC، وMHEC، وHEMC، وبودرة البوليمر RDP"
    },
    "iconName": "Layers",
    "count": 5
  },
  {
    "id": "polymers-emulsions",
    "name": {
      "en": "Polymer Emulsions & Resins",
      "ar": "المستحلبات والبوليمرات السائلة"
    },
    "description": {
      "en": "Styrene Acrylic, Copolymer Emulsion, and PVA Homo-Polymer emulsions",
      "ar": "ستيرين أكريليك، مستحلب كوبوليمر (Copolymer Emulsion)، وهوموبوليمر بولي فينيل أسيتات"
    },
    "iconName": "Layers",
    "count": 3
  },
  {
    "id": "solvents-coalescents",
    "name": {
      "en": "Industrial Solvents & Coalescents",
      "ar": "المذيبات الصناعية والمندمجات"
    },
    "description": {
      "en": "IPA, Xylene, Butyl Acetate, Ethanol, Methanol, Ethyl Acetate, White Spirit, Ester Alcohol",
      "ar": "آيزوبروبيل، زايلين، بيوتيل أسيتات، إيثانول، ميثانول، إيثيل أسيتات، وايت سبيريت، إستر الكحول"
    },
    "iconName": "Sparkles",
    "count": 8
  },
  {
    "id": "pigments-colorants",
    "name": {
      "en": "Pigments & Colorants",
      "ar": "الأصباغ وثاني أكسيد التيتانيوم"
    },
    "description": {
      "en": "Titanium Dioxide, Iron Oxides, Organic Pigments, In-Organic Pigments, Carbon Black",
      "ar": "ثاني أكسيد التيتانيوم، أكسيد الحديد، أصباغ عضوية، أصباغ غير عضوية، وأسود الكربون"
    },
    "iconName": "Palette",
    "count": 5
  },
  {
    "id": "fillers-minerals",
    "name": {
      "en": "Fillers & Industrial Minerals",
      "ar": "المواد المالئة والمعدنية"
    },
    "description": {
      "en": "Calcined Kaolin, Barium Sulfate, Talc Powder, Mica Powder, Bentonite, Fumed Silica",
      "ar": "كاولين مكلسن، كبريتات الباريوم، بودرة التلك، بودرة الميكا، بنتونايت، وفيومد سيليكا"
    },
    "iconName": "Boxes",
    "count": 6
  },
  {
    "id": "additives-modifiers",
    "name": {
      "en": "Specialty Additives & Modifiers",
      "ar": "المضافات الفنية والمعدلات"
    },
    "description": {
      "en": "Anti-foams, Dispersing Agent, Anti-skin MEKO, Zinc Stearate, DBLO Linseed Oil",
      "ar": "مضادات الرغوة، عوامل التشتيت، مانع القشرة ميكو، ستيارات الزنك، وزيت الكتان المغلي DBLO"
    },
    "iconName": "FlaskConical",
    "count": 5
  },
  {
    "id": "specialty-chemicals",
    "name": {
      "en": "Anti-Corrosive & Specialty Chemicals",
      "ar": "المثبطات والكيماويات التخصصية"
    },
    "description": {
      "en": "Zinc Dust, Zinc Phosphate, SHMP, SMBS, and Citric Acid",
      "ar": "غبار الزنك، فوسفات الزنك، سداسي ميتافوسفات SHMP، ميتابيسلفيت SMBS، وحمض الستريك"
    },
    "iconName": "ShieldCheck",
    "count": 5
  }
];

export const defaultChemicalProducts: ChemicalProduct[] = customProductsJson as unknown as ChemicalProduct[];

export const chemicalProducts: ChemicalProduct[] =
  Array.isArray(customProductsJson) && customProductsJson.length > 0
    ? (customProductsJson as unknown as ChemicalProduct[])
    : defaultChemicalProducts;

export const industriesData: Industry[] = [
  {
    id: 'paints-coatings',
    title: { en: 'Paints, Resins & Architectural Coatings', ar: 'الدهانات والراتنجات والطلاءات المعمارية' },
    description: {
      en: 'Cellulose ethers (HPMC, HEC, MHEC, HEMC), Titanium dioxide, Styrene Acrylic, iron oxides, MEKO, and Ester Alcohol.',
      ar: 'إيثرات السليلوز (HPMC, HEC, MHEC)، ثاني أكسيد التيتانيوم، ستيرين أكريليك، أكسيد الحديد، مانع القشرة، وإستر الكحول.',
    },
    iconName: 'Palette',
    keyChemicals: {
      en: ['HPMC / HEC', 'Titanium Dioxide', 'Styrene Acrylic', 'Ester Alcohol', 'Anti-skin MEKO', 'Zinc Phosphate'],
      ar: ['HPMC / HEC', 'ثاني أكسيد التيتانيوم', 'ستيرين أكريليك', 'إستر الكحول', 'مانع القشرة ميكو', 'فوسفات الزنك'],
    },
    accentColor: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'construction-chemicals',
    title: { en: 'Construction Chemicals & Dry Mortars', ar: 'كيماويات البناء والملاط الجاف' },
    description: {
      en: 'Redispersible polymer powder (RDP), HPMC/HEMC thickeners, bentonite clay, calcined kaolin, and fumed silica.',
      ar: 'مسحوق البوليمر RDP، مغلظات HPMC وHEMC، طين البنتونايت، الكاولين المكلسن، والفيومد سيليكا.',
    },
    iconName: 'Building',
    keyChemicals: {
      en: ['RDP Polymer Powder', 'HPMC Cellulose', 'Bentonite Clay', 'Talc Powder', 'Fumed Silica'],
      ar: ['بودرة RDP', 'سليلوز HPMC', 'طين بنتونايت', 'بودرة التلك', 'فيومد سيليكا'],
    },
    accentColor: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'detergents-cleaning',
    title: { en: 'Detergents & Industrial Cleaning', ar: 'المنظفات والكيماويات التخصصية' },
    description: {
      en: 'Citric acid, SHMP water softener, SMBS, anti-foams, and cellulose thickeners.',
      ar: 'حمض الستريك ملح الليمون، سداسي ميتافوسفات SHMP، ميتابيسلفيت SMBS، مضادات الرغوة، وإيثرات السليلوز.',
    },
    iconName: 'Sparkles',
    keyChemicals: {
      en: ['Citric Acid', 'SHMP Builder', 'SMBS', 'Anti-foams', 'HEC Thickener'],
      ar: ['حمض الستريك', 'سداسي ميتافوسفات SHMP', 'ميتابيسلفيت SMBS', 'مضادات الرغوة', 'سليلوز HEC'],
    },
    accentColor: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'plastics-polymers',
    title: { en: 'Plastics, Masterbatches & Inks', ar: 'البلاستيك والماسترباتش والأحبار' },
    description: {
      en: 'Carbon black, zinc stearate, fumed silica, titanium dioxide, and fast-evaporating ester solvents.',
      ar: 'أسود الكربون، ستيارات الزنك، فيومد سيليكا، ثاني أكسيد التيتانيوم، ومذيبات الإستر للطباعة.',
    },
    iconName: 'Boxes',
    keyChemicals: {
      en: ['Carbon Black', 'Zinc Stearate', 'Titanium Dioxide', 'Ethyl Acetate', 'IPA Solvent'],
      ar: ['أسود الكربون', 'ستيارات الزنك', 'ثاني أكسيد التيتانيوم', 'إيثيل أسيتات', 'كحول الآيزوبروبيل'],
    },
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'adhesives-sealants',
    title: { en: 'Adhesives, Glues & Sealants', ar: 'المواد اللاصقة والغراء ومانعات التسرب' },
    description: {
      en: 'Homo-polymer PVA, co-polymer emulsions, fumed silica, RDP, and butyl acetate.',
      ar: 'غراء هوموبوليمر بولي فينيل أسيتات، كوبوليمر، فيومد سيليكا، بودرة RDP، وبيوتيل أسيتات.',
    },
    iconName: 'Layers',
    keyChemicals: {
      en: ['Homo-Polymer PVA', 'Co-Polymer Emulsion', 'Fumed Silica', 'Butyl Acetate', 'DBLO Linseed Oil'],
      ar: ['هوموبوليمر PVA', 'مستحلب كوبوليمر', 'فيومد سيليكا', 'بيوتيل أسيتات', 'زيت الكتان DBLO'],
    },
    accentColor: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'solvents-thinners',
    title: { en: 'Industrial Solvents & Thinners', ar: 'المذيبات الصناعية ومخففات الطلاء' },
    description: {
      en: 'Pure aromatic and aliphatic solvents: xylene, white spirit, butyl acetate, IPA, ethanol, and methanol.',
      ar: 'مذيبات هيدروكربونية وكحولية نقية: الزايلين، الوايت سبيريت، بيوتيل أسيتات، الآيزوبروبيل، الإيثانول، والميثانول.',
    },
    iconName: 'FlaskConical',
    keyChemicals: {
      en: ['Xylene', 'White Spirit', 'Butyl Acetate', 'IPA Isopropanol', 'Methanol', 'Ethanol'],
      ar: ['الزايلين', 'الوايت سبيريت', 'بيوتيل أسيتات', 'الآيزوبروبيل', 'الميثانول', 'الإيثانول'],
    },
    accentColor: 'from-sky-500 to-blue-700',
  },
];

export const branchOffices: BranchOffice[] = [
  {
    id: 'riyadh-hq',
    city: { en: 'Riyadh', ar: 'الرياض' },
    title: { en: 'Corporate Headquarters & Central Distribution Hub', ar: 'المقر الرئيسي والمركز اللوجستي العام' },
    isHQ: true,
    address: {
      en: 'Second Industrial City, Al Kharj Road, Riyadh, Kingdom of Saudi Arabia',
      ar: 'المدينة الصناعية الثانية، طريق الخرج، الرياض، المملكة العربية السعودية',
    },
    workingHours: {
      en: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
      ar: 'السبت - الخميس: 9:00 صباحاً - 6:00 مساءً',
    },
    coordinates: { lat: 24.6877, lng: 46.7219 },
  },
  {
    id: 'jeddah-branch',
    city: { en: 'Jeddah', ar: 'جدة' },
    title: { en: 'Western Region Branch & Port Logistics Hub', ar: 'فرع المنطقة الغربية والخدمات اللوجستية لميناء جدة' },
    isHQ: false,
    address: {
      en: 'First Industrial City, South Jeddah, Kingdom of Saudi Arabia',
      ar: 'المدينة الصناعية الأولى، جنوب جدة، المملكة العربية السعودية',
    },
    workingHours: {
      en: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
      ar: 'السبت - الخميس: 9:00 صباحاً - 6:00 مساءً',
    },
    coordinates: { lat: 21.4858, lng: 39.1925 },
  },
  {
    id: 'dammam-branch',
    city: { en: 'Dammam', ar: 'الدمام' },
    title: { en: 'Eastern Province Branch & Chemical Logistics Hub', ar: 'فرع المنطقة الشرقية ومركز الإمداد اللوجستي' },
    isHQ: false,
    address: {
      en: 'Second Industrial City, Dammam, Kingdom of Saudi Arabia',
      ar: 'المدينة الصناعية الثانية، الدمام، المملكة العربية السعودية',
    },
    workingHours: {
      en: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
      ar: 'السبت - الخميس: 9:00 صباحاً - 6:00 مساءً',
    },
    coordinates: { lat: 26.4207, lng: 50.0888 },
  },
];
