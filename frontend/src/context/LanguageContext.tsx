import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'mahasetu_lang_pref';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar
    'gov.state': 'Government of Maharashtra',
    'gov.portal': 'MahaSetu — Unified Government Services',
    'gov.motto': 'One Setu, Many Services • Direct, Seamless & Secure',
    // Nav Links
    'nav.home': 'Home',
    'nav.departments': 'Departments',
    'nav.documents': 'Documents',
    'nav.grievances': 'Grievances',
    'nav.help': 'Help & Support',
    'nav.login': 'Login / Register',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.logout': 'Sign Out',
    'nav.admin': 'Admin Portal',
    // Search
    'search.placeholder': 'Search government services, departments, certificates...',
    'search.action': 'Search Services'
  },
  hi: {
    // Top Bar
    'gov.state': 'महाराष्ट्र सरकार',
    'gov.portal': 'महासेतु — एकीकृत सरकारी सेवा पोर्टल',
    'gov.motto': 'एक सेतु, अनेक सेवाएं • प्रत्यक्ष, सुगम और सुरक्षित',
    // Nav Links
    'nav.home': 'मुख्य पृष्ठ',
    'nav.departments': 'सरकारी विभाग',
    'nav.documents': 'दस्तावेज़',
    'nav.grievances': 'शिकायत निवारण',
    'nav.help': 'सहायता और समर्थन',
    'nav.login': 'लॉगिन / पंजीकरण',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉग आउट',
    'nav.admin': 'प्रशासक पोर्टल',
    // Search
    'search.placeholder': 'सरकारी सेवाएं, विभाग, प्रमाण पत्र खोजें...',
    'search.action': 'खोजें'
  },
  mr: {
    // Top Bar
    'gov.state': 'महाराष्ट्र शासन',
    'gov.portal': 'महासेतू — एकात्मिक शासकीय सेवा पोर्टल',
    'gov.motto': 'एक सेतू, अनेक सेवा • थेट, सुलभ आणि सुरक्षित',
    // Nav Links
    'nav.home': 'मुख्यपृष्ठ',
    'nav.departments': 'शासकीय विभाग',
    'nav.documents': 'दस्तऐवज',
    'nav.grievances': 'तक्रार निवारण',
    'nav.help': 'मदत व माहिती',
    'nav.login': 'प्रवेश / नोंदणी',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.profile': 'माझे प्रोफाईल',
    'nav.logout': 'बाहेर पडा',
    'nav.admin': 'प्रशासक पोर्टल',
    // Search
    'search.placeholder': 'शासकीय सेवा, विभाग, प्रमाणपत्रे शोधा...',
    'search.action': 'सेवा शोधा'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi' || saved === 'mr') return saved;
    } catch {}
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'hi' : prev === 'hi' ? 'mr' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
