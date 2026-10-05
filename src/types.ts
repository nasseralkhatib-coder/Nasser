export type Language = 'ar' | 'en';

export type PageId = 
  | 'home'
  | 'about'
  | 'products'
  | 'industries'
  | 'quality'
  | 'supply-chain'
  | 'branches'
  | 'contact';

export interface ChemicalProduct {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  category: string; // matches Category id
  casNumber?: string;
  formula?: string;
  appearance: {
    en: string;
    ar: string;
  };
  packaging: {
    en: string;
    ar: string;
  };
  applications: {
    en: string[];
    ar: string[];
  };
  featured?: boolean;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ProductCategory {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  iconName: string;
  count: number;
}

export interface Industry {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  iconName: string;
  keyChemicals: {
    en: string[];
    ar: string[];
  };
  accentColor?: string;
}

export interface BranchOffice {
  id: string;
  city: {
    en: string;
    ar: string;
  };
  title: {
    en: string;
    ar: string;
  };
  isHQ?: boolean;
  address: {
    en: string;
    ar: string;
  };
  phone?: string;
  email?: string;
  workingHours: {
    en: string;
    ar: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}
