"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useEncyclopedia } from '@/context/EncyclopediaContext';
import { SUPPORTED_LANGUAGES } from '@/lib/constants/encyclopedia';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, changeLanguage, getCurrentLanguage } = useEncyclopedia();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = getCurrentLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className="language-switcher-compact" ref={dropdownRef}>
        <button
          className="language-button-compact"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Language"
        >
          <span className="language-flag">{currentLang.flag}</span>
          <span className="language-code">{currentLang.code.toUpperCase()}</span>
          <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="language-dropdown">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.nativeName}</span>
                {language === lang.code && <i className="fas fa-check"></i>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <i className="fas fa-globe"></i>
        <span className="language-text">{currentLang.nativeName}</span>
        <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <div className="language-info">
                <span className="language-name">{lang.name}</span>
                <span className="language-native">{lang.nativeName}</span>
              </div>
              {language === lang.code && <i className="fas fa-check"></i>}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .language-switcher,
        .language-switcher-compact {
          position: relative;
          display: inline-block;
        }

        .language-button,
        .language-button-compact {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--white);
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          color: var(--charcoal-bark);
        }

        .language-button-compact {
          padding: 0.4rem 0.75rem;
        }

        .language-button:hover,
        .language-button-compact:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .language-flag {
          font-size: 1.2rem;
        }

        .language-code {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .language-text {
          font-size: 0.95rem;
        }

        .fa-chevron-down {
          font-size: 0.75rem;
          transition: transform 0.3s ease;
        }

        .fa-chevron-down.rotate {
          transform: rotate(180deg);
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: var(--white);
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .language-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          text-align: left;
        }

        .language-option:hover {
          background: rgba(159, 211, 86, 0.1);
        }

        .language-option.active {
          background: rgba(159, 211, 86, 0.15);
        }

        .language-option .language-flag {
          font-size: 1.5rem;
        }

        .language-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .language-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--charcoal-bark);
        }

        .language-native {
          font-size: 0.8rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .language-option .fa-check {
          color: var(--lime-spark);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .language-dropdown {
            right: auto;
            left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
