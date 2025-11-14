"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useEncyclopedia } from '@/context/EncyclopediaContext';
import { COUNTRIES } from '@/lib/constants/encyclopedia';

const CountrySelector = ({ variant = 'default', onChange }) => {
  const { country, changeCountry, getCurrentCountry } = useEncyclopedia();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const currentCountry = getCurrentCountry();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (countryCode) => {
    changeCountry(countryCode);
    setIsOpen(false);
    setSearchTerm('');
    if (onChange) {
      onChange(countryCode);
    }
  };

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (variant === 'compact') {
    return (
      <div className="country-selector-compact" ref={dropdownRef}>
        <button
          className="country-button-compact"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Country"
        >
          <span className="country-flag">{currentCountry?.flagEmoji || '🌍'}</span>
          <span className="country-code">{currentCountry?.code || 'ALL'}</span>
          <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="country-dropdown">
            <div className="country-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="country-options">
              <button
                className={`country-option ${!country ? 'active' : ''}`}
                onClick={() => handleCountryChange(null)}
              >
                <span className="country-flag">🌍</span>
                <span className="country-name">All Countries</span>
                {!country && <i className="fas fa-check"></i>}
              </button>

              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  className={`country-option ${country === c.code ? 'active' : ''}`}
                  onClick={() => handleCountryChange(c.code)}
                >
                  <span className="country-flag">{c.flagEmoji}</span>
                  <span className="country-name">{c.name}</span>
                  {country === c.code && <i className="fas fa-check"></i>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="country-selector" ref={dropdownRef}>
      <button
        className="country-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Country"
      >
        <i className="fas fa-map-marker-alt"></i>
        <span className="country-text">
          {currentCountry ? currentCountry.name : 'Select Country'}
        </span>
        <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="country-dropdown">
          <div className="country-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="country-options">
            <button
              className={`country-option ${!country ? 'active' : ''}`}
              onClick={() => handleCountryChange(null)}
            >
              <span className="country-flag">🌍</span>
              <div className="country-info">
                <span className="country-name">All Countries</span>
                <span className="country-native">Global Content</span>
              </div>
              {!country && <i className="fas fa-check"></i>}
            </button>

            {filteredCountries.map((c) => (
              <button
                key={c.code}
                className={`country-option ${country === c.code ? 'active' : ''}`}
                onClick={() => handleCountryChange(c.code)}
              >
                <span className="country-flag">{c.flagEmoji}</span>
                <div className="country-info">
                  <span className="country-name">{c.name}</span>
                  <span className="country-native">{c.nativeName}</span>
                </div>
                {country === c.code && <i className="fas fa-check"></i>}
              </button>
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>No countries found</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .country-selector,
        .country-selector-compact {
          position: relative;
          display: inline-block;
        }

        .country-button,
        .country-button-compact {
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

        .country-button-compact {
          padding: 0.4rem 0.75rem;
        }

        .country-button:hover,
        .country-button-compact:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .country-flag {
          font-size: 1.2rem;
        }

        .country-code {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .country-text {
          font-size: 0.95rem;
        }

        .fa-chevron-down {
          font-size: 0.75rem;
          transition: transform 0.3s ease;
        }

        .fa-chevron-down.rotate {
          transform: rotate(180deg);
        }

        .country-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: var(--white);
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          min-width: 280px;
          max-width: 350px;
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

        .country-search {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(159, 211, 86, 0.2);
          background: rgba(159, 211, 86, 0.05);
        }

        .country-search .fa-search {
          color: var(--lime-spark);
          font-size: 0.9rem;
        }

        .country-search input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: 'Open Sans', sans-serif;
          font-size: 0.9rem;
          color: var(--charcoal-bark);
        }

        .country-search input::placeholder {
          color: rgba(47, 60, 59, 0.5);
        }

        .country-options {
          max-height: 300px;
          overflow-y: auto;
        }

        .country-options::-webkit-scrollbar {
          width: 6px;
        }

        .country-options::-webkit-scrollbar-track {
          background: rgba(159, 211, 86, 0.05);
        }

        .country-options::-webkit-scrollbar-thumb {
          background: rgba(159, 211, 86, 0.3);
          border-radius: 3px;
        }

        .country-option {
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

        .country-option:hover {
          background: rgba(159, 211, 86, 0.1);
        }

        .country-option.active {
          background: rgba(159, 211, 86, 0.15);
        }

        .country-option .country-flag {
          font-size: 1.5rem;
        }

        .country-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .country-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--charcoal-bark);
        }

        .country-native {
          font-size: 0.8rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .country-option .fa-check {
          color: var(--lime-spark);
          font-size: 0.9rem;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem 1rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .no-results .fa-search {
          font-size: 2rem;
          opacity: 0.5;
        }

        .no-results p {
          font-size: 0.9rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .country-dropdown {
            right: auto;
            left: 0;
            min-width: 260px;
          }
        }
      `}</style>
    </div>
  );
};

export default CountrySelector;
