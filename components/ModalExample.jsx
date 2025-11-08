"use client";
import React, { useState } from 'react';
import Modal from './Modal';

/**
 * Example component showing how to use the Modal component
 * You can use this pattern anywhere in your application
 */
const ModalExample = () => {
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Modal Component Examples</h2>
      <p>Click the buttons below to see different modal examples:</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {/* Example 1: Load content from file */}
        <button
          onClick={() => setTermsModalOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--lime-spark)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Terms & Conditions
        </button>

        {/* Example 2: Load different file */}
        <button
          onClick={() => setPrivacyModalOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--evergreen)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Privacy Policy
        </button>

        {/* Example 3: Custom inline content */}
        <button
          onClick={() => setCustomModalOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3498DB',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Custom Content
        </button>
      </div>

      {/* Modal for Terms & Conditions */}
      <Modal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Terms and Conditions"
        contentUrl="/content/terms-and-conditions.md"
      />

      {/* Modal for Privacy Policy */}
      <Modal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy"
        contentUrl="/content/privacy-policy.md"
      />

      {/* Modal with custom inline content */}
      <Modal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        title="Custom Content Example"
        content={`
# Welcome to GreenEye Foundation

This is an example of **custom inline content** in the modal.

## Features
- You can use markdown formatting
- Lists work perfectly
- **Bold** and *italic* text
- Links like [this](https://greeneye.foundation)

## Code Example
\`\`\`javascript
const modal = {
  isOpen: true,
  title: "My Modal",
  content: "Hello World"
};
\`\`\`

You can pass content directly as a prop instead of loading from a file!
        `}
      />

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f4f6f5', borderRadius: '8px' }}>
        <h3>Usage Examples:</h3>

        <h4>1. Load content from file:</h4>
        <pre style={{ background: 'white', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Terms and Conditions"
  contentUrl="/content/terms-and-conditions.md"
/>`}
        </pre>

        <h4>2. Use custom inline content:</h4>
        <pre style={{ background: 'white', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Custom Title"
  content="Your **markdown** content here"
/>`}
        </pre>

        <h4>3. In a link (like register page):</h4>
        <pre style={{ background: 'white', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setTermsModalOpen(true);
  }}
>
  Terms and Conditions
</a>`}
        </pre>
      </div>
    </div>
  );
};

export default ModalExample;
