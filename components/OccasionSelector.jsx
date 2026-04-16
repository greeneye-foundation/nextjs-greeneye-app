import React from 'react';

const occasions = [
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "anniversary", label: "Anniversary", emoji: "💍" },
  { value: "wedding", label: "Wedding", emoji: "💒" },
  { value: "memorial", label: "Memorial", emoji: "🕊️" },
  { value: "corporate", label: "Corporate", emoji: "🏢" },
  { value: "holiday", label: "Holiday", emoji: "🎄" },
  { value: "just-because", label: "Just Because", emoji: "💚" },
  { value: "earth-day", label: "Earth Day", emoji: "🌍" },
];

const ADOPT_OCCASIONS = ['birthday', 'just-because', 'earth-day'];

const OccasionSelector = ({ value, onChange, required = false, adoptMode = false }) => {
  const filteredOccasions = adoptMode
    ? occasions.filter(o => ADOPT_OCCASIONS.includes(o.value))
    : occasions;

  const handleSelect = (occasionValue) => {
    onChange({ target: { name: 'occasion', value: occasionValue } });
  };

  return (
    <div className="ge-occasion">
      <div className="ge-occasion__grid">
        {filteredOccasions.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`ge-occasion__item${value === o.value ? ' ge-occasion__item--active' : ''}`}
            onClick={() => handleSelect(o.value)}
          >
            <span className="ge-occasion__emoji">{o.emoji}</span>
            <span className="ge-occasion__label">{o.label}</span>
          </button>
        ))}
      </div>
      {required && !value && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
          tabIndex={-1}
        />
      )}
    </div>
  );
};

export default OccasionSelector;
