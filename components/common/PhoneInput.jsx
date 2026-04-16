import { useState, useRef, useEffect } from 'react';

// Inline SVG flags — lightweight, consistent across all platforms
const FLAGS = {
  IN: (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, display: 'block' }}>
      <rect width="20" height="4.67" fill="#FF9933"/>
      <rect y="4.67" width="20" height="4.67" fill="#FFFFFF"/>
      <rect y="9.33" width="20" height="4.67" fill="#138808"/>
      <circle cx="10" cy="7" r="1.8" fill="none" stroke="#000080" strokeWidth="0.4"/>
      <circle cx="10" cy="7" r="0.4" fill="#000080"/>
    </svg>
  ),
  // Add more flags here as you expand:
  // US: (
  //   <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, display: 'block' }}>
  //     <rect width="20" height="14" fill="#B22234"/>
  //     <rect y="1.08" width="20" height="1.08" fill="#FFF"/>
  //     <rect y="3.23" width="20" height="1.08" fill="#FFF"/>
  //     <rect y="5.38" width="20" height="1.08" fill="#FFF"/>
  //     <rect y="7.54" width="20" height="1.08" fill="#FFF"/>
  //     <rect y="9.69" width="20" height="1.08" fill="#FFF"/>
  //     <rect y="11.85" width="20" height="1.08" fill="#FFF"/>
  //     <rect width="8" height="7.54" fill="#3C3B6E"/>
  //   </svg>
  // ),
};

// Country list — India first, easy to extend
const COUNTRIES = [
  { code: 'IN', dial: '+91', name: 'India' },
  // { code: 'US', dial: '+1', name: 'United States' },
  // { code: 'GB', dial: '+44', name: 'United Kingdom' },
  // { code: 'AE', dial: '+971', name: 'UAE' },
];

/**
 * PhoneInput — Country code selector with flag + dial code prefix
 *
 * @param {string} value — Full E.164 value (e.g., "+919876543210")
 * @param {function} onChange — Called with full E.164 string
 * @param {string} name — Form field name
 * @param {string} placeholder — Placeholder for the number part (default: "XXXXX XXXXX")
 * @param {boolean} required — HTML required attribute
 * @param {boolean} disabled — HTML disabled attribute
 * @param {string} className — Additional CSS class
 */
export default function PhoneInput({
  value = '',
  onChange,
  name = 'phone',
  placeholder = 'XXXXX XXXXX',
  required = false,
  disabled = false,
  className = ''
}) {
  // Parse initial country from value
  const getInitialCountry = () => {
    if (!value) return COUNTRIES[0];
    const match = COUNTRIES.find(c => value.startsWith(c.dial));
    return match || COUNTRIES[0];
  };

  const [country, setCountry] = useState(getInitialCountry);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localNumber, setLocalNumber] = useState(() => {
    if (!value) return '';
    const c = getInitialCountry();
    return value.startsWith(c.dial) ? value.slice(c.dial.length) : value.replace(/^\+\d{1,3}/, '');
  });
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync if value changes externally
  useEffect(() => {
    if (!value) { setLocalNumber(''); return; }
    const c = COUNTRIES.find(c => value.startsWith(c.dial)) || COUNTRIES[0];
    setCountry(c);
    setLocalNumber(value.startsWith(c.dial) ? value.slice(c.dial.length) : value);
  }, [value]);

  const handleNumberChange = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    setLocalNumber(digits);
    // Emit full E.164 value
    const fullValue = digits ? `${country.dial}${digits}` : '';
    if (onChange) {
      // Create synthetic event-like object for compatibility with handleChange(e) patterns
      onChange({ target: { name, value: fullValue } });
    }
  };

  const handleCountrySelect = (c) => {
    setCountry(c);
    setDropdownOpen(false);
    // Re-emit with new country code
    const fullValue = localNumber ? `${c.dial}${localNumber}` : '';
    if (onChange) {
      onChange({ target: { name, value: fullValue } });
    }
  };

  return (
    <div className={`ge-phone-input ${disabled ? 'ge-phone-input--disabled' : ''} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="ge-phone-input__country"
        onClick={() => !disabled && COUNTRIES.length > 1 && setDropdownOpen(!dropdownOpen)}
        disabled={disabled}
        aria-label="Select country code"
      >
        <span className="ge-phone-input__flag">{FLAGS[country.code]}</span>
        <span className="ge-phone-input__dial">{country.dial}</span>
        {COUNTRIES.length > 1 && (
          <span className="ge-phone-input__chevron">{dropdownOpen ? '\u25B2' : '\u25BC'}</span>
        )}
      </button>

      {dropdownOpen && COUNTRIES.length > 1 && (
        <ul className="ge-phone-input__dropdown">
          {COUNTRIES.map((c) => (
            <li
              key={c.code}
              className={`ge-phone-input__option ${c.code === country.code ? 'ge-phone-input__option--active' : ''}`}
              onClick={() => handleCountrySelect(c)}
            >
              <span className="ge-phone-input__flag">{FLAGS[c.code]}</span>
              <span>{c.name}</span>
              <span className="ge-phone-input__dial">{c.dial}</span>
            </li>
          ))}
        </ul>
      )}

      <input
        type="tel"
        className="ge-phone-input__number"
        name={name}
        value={localNumber}
        onChange={handleNumberChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        inputMode="numeric"
      />
    </div>
  );
}
