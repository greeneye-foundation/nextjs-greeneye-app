"use client";

import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/constants/encyclopedia';

const ContentSection = ({ formData, updateFormData, errors }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showPreview, setShowPreview] = useState(false);

  // Calculate word count
  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Handle content change
  const handleContentChange = (lang, value) => {
    updateFormData('content', {
      ...formData.content,
      [lang]: value
    });
  };

  // Insert formatting
  const insertFormatting = (format) => {
    const textarea = document.getElementById(`content-${selectedLanguage}`);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const currentContent = formData.content[selectedLanguage] || '';

    let newText = '';
    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        newText = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        newText = `- ${selectedText || 'List item'}`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      default:
        newText = selectedText;
    }

    const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
    handleContentChange(selectedLanguage, newContent);
  };

  return (
    <div className="content-section">
      <h3 className="section-title">
        <i className="fas fa-file-text"></i>
        Article Content
      </h3>
      <p className="section-description">
        Write the main content for your article. Markdown formatting is supported. English content is required.
      </p>

      {/* Language Tabs */}
      <div className="language-tabs">
        {SUPPORTED_LANGUAGES.map(lang => (
          <button
            key={lang.code}
            type="button"
            className={`lang-tab ${selectedLanguage === lang.code ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(lang.code)}
          >
            <span className="lang-flag">{lang.flag}</span>
            <span className="lang-name">{lang.name}</span>
            {lang.code === 'en' && <span className="required-badge">Required</span>}
            {formData.content[lang.code] && (
              <span className="word-count-badge">
                {getWordCount(formData.content[lang.code])} words
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertFormatting('bold')}
            title="Bold (Ctrl+B)"
          >
            <i className="fas fa-bold"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertFormatting('italic')}
            title="Italic (Ctrl+I)"
          >
            <i className="fas fa-italic"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertFormatting('heading')}
            title="Heading"
          >
            <i className="fas fa-heading"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertFormatting('list')}
            title="Bullet List"
          >
            <i className="fas fa-list-ul"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => insertFormatting('link')}
            title="Insert Link"
          >
            <i className="fas fa-link"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
            title="Toggle Preview"
          >
            <i className="fas fa-eye"></i>
            <span>Preview</span>
          </button>
        </div>

        <div className="toolbar-stats">
          <span className="stat-item">
            <i className="fas fa-font"></i>
            {getWordCount(formData.content[selectedLanguage])} words
          </span>
          <span className="stat-item">
            <i className="fas fa-text-height"></i>
            {(formData.content[selectedLanguage] || '').length} characters
          </span>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="editor-container">
        {!showPreview ? (
          <div className="editor-wrapper">
            <textarea
              id={`content-${selectedLanguage}`}
              value={formData.content[selectedLanguage] || ''}
              onChange={(e) => handleContentChange(selectedLanguage, e.target.value)}
              placeholder={`Write your article content in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...\n\nMarkdown supported:\n**bold**, *italic*, ## Headings, - Lists, [links](url)`}
              className={selectedLanguage === 'en' && errors.contentEn ? 'error' : ''}
            />
            {selectedLanguage === 'en' && errors.contentEn && (
              <span className="error-message">{errors.contentEn}</span>
            )}
          </div>
        ) : (
          <div className="preview-wrapper">
            <div className="preview-label">
              <i className="fas fa-eye"></i>
              Preview
            </div>
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{
                __html: (formData.content[selectedLanguage] || 'No content yet...')
                  // Escape raw HTML first to prevent XSS
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  // Then apply markdown transforms on the escaped string
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                  .replace(/^- (.*$)/gm, '<li>$1</li>')
                  // Only allow http/https URLs to prevent javascript: attacks
                  .replace(/\[(.*?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </div>
        )}
      </div>

      {/* Content Guidelines */}
      <div className="content-guidelines">
        <h4>
          <i className="fas fa-lightbulb"></i>
          Content Writing Guidelines
        </h4>
        <ul>
          <li>Aim for at least 500 words for better SEO and comprehensive coverage</li>
          <li>Break content into sections with headings (##) for better readability</li>
          <li>Use bullet points (-) for lists and key information</li>
          <li>Add links to credible sources and related articles</li>
          <li>Write in clear, accessible language suitable for general audiences</li>
          <li>Include specific, actionable information relevant to the topic</li>
        </ul>
      </div>

      {/* Translation Status */}
      <div className="translation-status">
        <h4>Content Translation Status:</h4>
        <div className="status-grid">
          {SUPPORTED_LANGUAGES.map(lang => {
            const wordCount = getWordCount(formData.content[lang.code]);
            return (
              <div key={lang.code} className="status-item">
                <span className="status-flag">{lang.flag}</span>
                <span className="status-lang">{lang.name}</span>
                <span className={`status-badge ${wordCount > 0 ? 'complete' : 'pending'}`}>
                  {wordCount > 0 ? (
                    <><i className="fas fa-check"></i> {wordCount} words</>
                  ) : (
                    <><i className="fas fa-times"></i> No content</>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .content-section {
          max-width: 1000px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--evergreen);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Montserrat', sans-serif;
        }

        .section-description {
          color: rgba(47, 60, 59, 0.7);
          margin-bottom: 2rem;
        }

        .language-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .lang-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
        }

        .lang-tab:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .lang-tab.active {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .lang-flag {
          font-size: 1.2rem;
        }

        .required-badge {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .lang-tab.active .required-badge {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .word-count-badge {
          background: rgba(159, 211, 86, 0.2);
          color: var(--evergreen);
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .lang-tab.active .word-count-badge {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .editor-toolbar {
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 8px 8px 0 0;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-bottom: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 0.25rem;
          padding-right: 1rem;
          border-right: 1px solid rgba(159, 211, 86, 0.3);
        }

        .toolbar-group:last-of-type {
          border-right: none;
        }

        .toolbar-btn {
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          color: var(--evergreen);
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .toolbar-btn:hover {
          background: rgba(159, 211, 86, 0.1);
          border-color: var(--lime-spark);
        }

        .toolbar-btn.active {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .toolbar-stats {
          margin-left: auto;
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .editor-container {
          margin-bottom: 2rem;
        }

        .editor-wrapper,
        .preview-wrapper {
          position: relative;
        }

        .editor-wrapper textarea {
          width: 100%;
          min-height: 500px;
          padding: 1.5rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 0 0 8px 8px;
          font-size: 1rem;
          font-family: 'Open Sans', sans-serif;
          line-height: 1.8;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .editor-wrapper textarea:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .editor-wrapper textarea.error {
          border-color: #e74c3c;
        }

        .error-message {
          display: block;
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .preview-wrapper {
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 0 0 8px 8px;
          min-height: 500px;
        }

        .preview-label {
          background: rgba(159, 211, 86, 0.1);
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: var(--evergreen);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(159, 211, 86, 0.2);
        }

        .preview-content {
          padding: 1.5rem;
          line-height: 1.8;
          color: var(--charcoal-bark);
        }

        .preview-content :global(h2) {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--evergreen);
          margin: 1.5rem 0 1rem 0;
          font-family: 'Montserrat', sans-serif;
        }

        .preview-content :global(strong) {
          font-weight: 700;
          color: var(--evergreen);
        }

        .preview-content :global(em) {
          font-style: italic;
        }

        .preview-content :global(li) {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
          list-style: disc;
        }

        .preview-content :global(a) {
          color: var(--lime-spark);
          text-decoration: underline;
        }

        .preview-content :global(a:hover) {
          color: var(--evergreen);
        }

        .content-guidelines {
          background: #e8f5e9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .content-guidelines h4 {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .content-guidelines ul {
          margin: 0;
          padding-left: 1.5rem;
          color: rgba(47, 60, 59, 0.8);
        }

        .content-guidelines li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .translation-status {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .translation-status h4 {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
        }

        .status-flag {
          font-size: 1.2rem;
        }

        .status-lang {
          flex: 1;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
        }

        .status-badge.complete {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        @media (max-width: 768px) {
          .editor-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-group {
            border-right: none;
            border-bottom: 1px solid rgba(159, 211, 86, 0.3);
            padding-bottom: 0.5rem;
            padding-right: 0;
          }

          .toolbar-group:last-of-type {
            border-bottom: none;
          }

          .toolbar-stats {
            margin-left: 0;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(159, 211, 86, 0.3);
          }

          .editor-wrapper textarea,
          .preview-wrapper {
            min-height: 400px;
          }

          .status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ContentSection;
