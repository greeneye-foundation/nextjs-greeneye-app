"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, COUNTRIES } from '@/lib/constants/encyclopedia';

const EncyclopediaContext = createContext();

export function EncyclopediaProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('encyclopedia_language');
    const savedCountry = localStorage.getItem('encyclopedia_country');

    if (savedLanguage && SUPPORTED_LANGUAGES.find(l => l.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }

    if (savedCountry && COUNTRIES.find(c => c.code === savedCountry)) {
      setCountry(savedCountry);
    } else {
      // Auto-detect country based on browser/IP (you can enhance this)
      detectCountry();
    }

    setIsLoading(false);
  }, []);

  // Auto-detect country (basic implementation)
  const detectCountry = async () => {
    try {
      // You can use an IP geolocation API here
      // For now, we'll use a simple browser timezone-based detection
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const timezoneCountryMap = {
        'Asia/Kolkata': 'IND',
        'Asia/Shanghai': 'CHN',
        'Asia/Dubai': 'ARE',
        'America/New_York': 'USA',
        'America/Sao_Paulo': 'BRA'
      };

      const detectedCountry = timezoneCountryMap[timezone] || 'IND';
      setCountry(detectedCountry);
      localStorage.setItem('encyclopedia_country', detectedCountry);
    } catch (error) {
      console.error('Country detection failed:', error);
      setCountry('IND'); // Default to India
    }
  };

  // Change language
  const changeLanguage = (langCode) => {
    if (SUPPORTED_LANGUAGES.find(l => l.code === langCode)) {
      setLanguage(langCode);
      localStorage.setItem('encyclopedia_language', langCode);
    }
  };

  // Change country
  const changeCountry = (countryCode) => {
    if (COUNTRIES.find(c => c.code === countryCode)) {
      setCountry(countryCode);
      localStorage.setItem('encyclopedia_country', countryCode);
    }
  };

  // Get current language object
  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  };

  // Get current country object
  const getCurrentCountry = () => {
    return COUNTRIES.find(c => c.code === country);
  };

  // Get text in current language (utility function)
  const getText = (multiLangObject) => {
    if (!multiLangObject) return '';
    return multiLangObject[language] || multiLangObject.en || '';
  };

  const value = {
    language,
    country,
    changeLanguage,
    changeCountry,
    getCurrentLanguage,
    getCurrentCountry,
    getText,
    isLoading
  };

  return (
    <EncyclopediaContext.Provider value={value}>
      {children}
    </EncyclopediaContext.Provider>
  );
}

// Custom hook to use the encyclopedia context
export function useEncyclopedia() {
  const context = useContext(EncyclopediaContext);
  if (!context) {
    throw new Error('useEncyclopedia must be used within EncyclopediaProvider');
  }
  return context;
}
