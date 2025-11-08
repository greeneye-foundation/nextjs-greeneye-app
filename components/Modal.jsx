"use client";
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Modal = ({ isOpen, onClose, title, contentUrl, content }) => {
  const [modalContent, setModalContent] = useState(content || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && contentUrl && !content) {
      setLoading(true);
      fetch(contentUrl)
        .then(res => res.text())
        .then(data => {
          setModalContent(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading content:', err);
          setModalContent('Error loading content. Please try again.');
          setLoading(false);
        });
    }
  }, [isOpen, contentUrl, content]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-content">
          {loading ? (
            <div className="modal-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading...</p>
            </div>
          ) : (
            <ReactMarkdown>{modalContent}</ReactMarkdown>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
