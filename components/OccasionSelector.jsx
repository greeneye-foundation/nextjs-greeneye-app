"use client";
import React from 'react';
import { motion } from 'framer-motion';

const occasions = [
  {
    value: "birthday",
    label: "Birthday",
    icon: "fas fa-birthday-cake",
    color: "#FF6B9D"
  },
  {
    value: "anniversary",
    label: "Anniversary",
    icon: "fas fa-heart",
    color: "#E74C3C"
  },
  {
    value: "wedding",
    label: "Wedding",
    icon: "fas fa-ring",
    color: "#F39C12"
  },
  {
    value: "memorial",
    label: "Memorial",
    icon: "fas fa-dove",
    color: "#95A5A6"
  },
  {
    value: "corporate",
    label: "Corporate Gift",
    icon: "fas fa-briefcase",
    color: "#3498DB"
  },
  {
    value: "holiday",
    label: "Holiday",
    icon: "fas fa-gifts",
    color: "#27AE60"
  },
  {
    value: "just-because",
    label: "Just Because",
    icon: "fas fa-star",
    color: "#9B59B6"
  }
];

const OccasionSelector = ({ value, onChange, required = false }) => {
  const handleSelect = (occasionValue) => {
    // Create a synthetic event to match the existing form handling
    const syntheticEvent = {
      target: {
        name: 'occasion',
        value: occasionValue
      }
    };
    onChange(syntheticEvent);
  };

  return (
    <div className="occasion-selector">
      <div className="occasion-grid">
        {occasions.map((occasion, index) => (
          <motion.button
            key={occasion.value}
            type="button"
            className={`occasion-card ${value === occasion.value ? 'selected' : ''}`}
            onClick={() => handleSelect(occasion.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              '--occasion-color': occasion.color
            }}
          >
            <div className="occasion-icon-wrapper">
              <i className={occasion.icon}></i>
            </div>
            <span className="occasion-label">{occasion.label}</span>
            {value === occasion.value && (
              <motion.div
                className="occasion-checkmark"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <i className="fas fa-check"></i>
              </motion.div>
            )}
          </motion.button>
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
