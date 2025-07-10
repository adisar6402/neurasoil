import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'dashboard': 'Dashboard',
    'predictions': 'Predictions',
    'alerts': 'Alerts',
    'history': 'History',
    'soil.moisture': 'Soil Moisture',
    'ph.level': 'pH Level',
    'temperature': 'Temperature',
    'soil.pressure': 'Soil Pressure',
    'welcome.title': 'Welcome to NeuraSoil',
    'welcome.subtitle': 'Monitor your soil health with AI-powered predictions',
    'welcome.credit': 'Built by Abdulrahman Adisa Amuda – Africa Deep Tech 2025',
    'system.status': 'System Status: Online',
    'last.reading': 'Last sensor reading: 30 seconds ago',
    'run.prediction': 'Run Prediction',
    'export.data': 'Export Data',
    'view.trends': 'View Trends',
    'settings': 'Settings',
    'critical.moisture': 'Critical Soil Moisture Level',
    'low.moisture': 'Low Soil Moisture Detected',
    'immediate.irrigation': 'Immediate irrigation required',
    'increase.irrigation': 'Increase irrigation frequency',
  },
  yo: {
    'dashboard': 'Ojú-iwé',
    'predictions': 'Àwọn Àsọtẹ́lẹ̀',
    'alerts': 'Àwọn Ìfèsílẹ̀',
    'history': 'Ìtàn',
    'soil.moisture': 'Omi Inú Ilẹ̀',
    'ph.level': 'Ìwọ̀n pH',
    'temperature': 'Ìgbóná',
    'soil.pressure': 'Títẹ̀ Ilẹ̀',
    'welcome.title': 'Káàbọ̀ sí NeuraSoil',
    'welcome.subtitle': 'Ṣe àkíyèsí ìlera ilẹ̀ rẹ pẹ̀lú àwọn àsọtẹ́lẹ̀ AI',
    'welcome.credit': 'Tí Abdulrahman Adisa Amuda kọ́ – Africa Deep Tech 2025',
    'system.status': 'Ipò Ètò: Ní ayélujára',
    'last.reading': 'Kíkà sensọ̀ kẹ́yìn: ìṣẹ́jú àádọ́ta sẹ́yìn',
    'run.prediction': 'Ṣe Àsọtẹ́lẹ̀',
    'export.data': 'Gbé Dátà Jáde',
    'view.trends': 'Wo Àwọn Ìtẹ̀síwájú',
    'settings': 'Àwọn Ètò',
    'critical.moisture': 'Ipò Omi Ilẹ̀ Tó Ṣòro',
    'low.moisture': 'Omi Ilẹ̀ Kékeré Tí a Rí',
    'immediate.irrigation': 'Irin-omi kánkán ni a nílò',
    'increase.irrigation': 'Mú irin-omi púpọ̀ sí i',
  },
  ha: {
    'dashboard': 'Allunan Baiyanai',
    'predictions': 'Hasashen',
    'alerts': 'Faɗakarwa',
    'history': 'Tarihi',
    'soil.moisture': 'Ruwan Ƙasa',
    'ph.level': 'Matsayin pH',
    'temperature': 'Yanayin Zafi',
    'soil.pressure': 'Matsawar Ƙasa',
    'welcome.title': 'Maraba da zuwa NeuraSoil',
    'welcome.subtitle': 'Kula da lafiyar ƙasarku da hasashen AI',
    'welcome.credit': 'Wanda Abdulrahman Adisa Amuda ya gina – Africa Deep Tech 2025',
    'system.status': 'Matsayin Tsarin: Yana aiki',
    'last.reading': 'Karatun na'ura ta ƙarshe: daƙiƙa 30 da suka wuce',
    'run.prediction': 'Yi Hasashe',
    'export.data': 'Fitar da Bayanai',
    'view.trends': 'Duba Yanayin Ci gaba',
    'settings': 'Saitunan',
    'critical.moisture': 'Matsayin Ruwan Ƙasa Mai Muhimmanci',
    'low.moisture': 'An Gano Ƙarancin Ruwan Ƙasa',
    'immediate.irrigation': 'Ana buƙatar ban ruwa nan da nan',
    'increase.irrigation': 'Ƙara yawan ban ruwa',
  },
  sw: {
    'dashboard': 'Dashibodi',
    'predictions': 'Ubashiri',
    'alerts': 'Arifa',
    'history': 'Historia',
    'soil.moisture': 'Unyevu wa Ardhi',
    'ph.level': 'Kiwango cha pH',
    'temperature': 'Joto',
    'soil.pressure': 'Shinikizo la Ardhi',
    'welcome.title': 'Karibu NeuraSoil',
    'welcome.subtitle': 'Fuatilia afya ya ardhi yako kwa kutumia ubashiri wa AI',
    'welcome.credit': 'Imeundwa na Abdulrahman Adisa Amuda – Africa Deep Tech 2025',
    'system.status': 'Hali ya Mfumo: Inaendelea',
    'last.reading': 'Usomaji wa mwisho wa sensor: dakika 30 zilizopita',
    'run.prediction': 'Endesha Ubashiri',
    'export.data': 'Hamisha Data',
    'view.trends': 'Ona Mienendo',
    'settings': 'Mipangilio',
    'critical.moisture': 'Kiwango cha Hatari cha Unyevu wa Ardhi',
    'low.moisture': 'Unyevu Mdogo wa Ardhi Umegunduliwa',
    'immediate.irrigation': 'Umwagiliaji wa haraka unahitajika',
    'increase.irrigation': 'Ongeza mzunguko wa umwagiliaji',
  },
  fr: {
    'dashboard': 'Tableau de Bord',
    'predictions': 'Prédictions',
    'alerts': 'Alertes',
    'history': 'Historique',
    'soil.moisture': 'Humidité du Sol',
    'ph.level': 'Niveau pH',
    'temperature': 'Température',
    'soil.pressure': 'Pression du Sol',
    'welcome.title': 'Bienvenue sur NeuraSoil',
    'welcome.subtitle': 'Surveillez la santé de votre sol avec des prédictions IA',
    'welcome.credit': 'Développé par Abdulrahman Adisa Amuda – Africa Deep Tech 2025',
    'system.status': 'État du Système: En ligne',
    'last.reading': 'Dernière lecture du capteur: il y a 30 secondes',
    'run.prediction': 'Lancer Prédiction',
    'export.data': 'Exporter Données',
    'view.trends': 'Voir Tendances',
    'settings': 'Paramètres',
    'critical.moisture': 'Niveau Critique d\'Humidité du Sol',
    'low.moisture': 'Faible Humidité du Sol Détectée',
    'immediate.irrigation': 'Irrigation immédiate requise',
    'increase.irrigation': 'Augmenter la fréquence d\'irrigation',
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('neurasoil-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('neurasoil-language', lang);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};