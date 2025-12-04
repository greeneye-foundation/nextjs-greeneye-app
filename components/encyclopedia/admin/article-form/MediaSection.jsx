"use client";

import React, { useState, useEffect } from 'react';
import { mediaAPI } from '@/lib/api/encyclopedia';

const MediaSection = ({ formData, updateFormData }) => {
  const [uploadType, setUploadType] = useState('image');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load existing media when component mounts
  useEffect(() => {
    if (formData.slug) {
      loadExistingMedia();
    }
  }, [formData.slug]);

  const loadExistingMedia = async () => {
    try {
      const response = await mediaAPI.getByArticle(formData.slug);
      if (response.success) {
        setMediaItems(response.data);
      }
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getInstagramId = (url) => {
    const regExp = /instagram.com\/(p|reel)\/([A-Za-z0-9_-]+)/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  };

  // Handle file upload to backend
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (mediaItems.filter(m => m.type === 'image').length + files.length > 10) {
      alert('Maximum 10 images allowed per article.');
      return;
    }

    if (!formData.slug) {
      alert('Please save the article first before uploading images.');
      return;
    }

    setUploading(true);

    try {
      const formDataObj = new FormData();
      
      files.forEach(file => {
        formDataObj.append('images', file);
      });

      // Add metadata
      formDataObj.append('type', 'image');
      formDataObj.append('altText', JSON.stringify({ en: '', hi: '', zh: '', ar: '' }));

      const response = await mediaAPI.uploadMedia(formData.slug, formDataObj);

      if (response.success) {
        // Reload media list
        await loadExistingMedia();
        alert(`${files.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Add YouTube video
  const addYouTubeVideo = async () => {
    const videoId = getYouTubeId(youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    if (!formData.slug) {
      alert('Please save the article first before adding videos.');
      return;
    }

    setUploading(true);

    try {
      const response = await mediaAPI.addMedia(formData.slug, {
        type: 'youtube_video',
        videoId: videoId,
        url: youtubeUrl
      });

      if (response.success) {
        await loadExistingMedia();
        setYoutubeUrl('');
        alert('YouTube video added successfully!');
      }
    } catch (error) {
      console.error('Error adding video:', error);
      alert(`Failed to add video: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Add Instagram reel
  const addInstagramReel = async () => {
    const postId = getInstagramId(instagramUrl);
    if (!postId) {
      alert('Invalid Instagram URL. Please enter a valid Instagram post or reel URL.');
      return;
    }

    if (!formData.slug) {
      alert('Please save the article first before adding Instagram content.');
      return;
    }

    setUploading(true);

    try {
      const response = await mediaAPI.addMedia(formData.slug, {
        type: 'instagram_reel',
        url: instagramUrl
      });

      if (response.success) {
        await loadExistingMedia();
        setInstagramUrl('');
        alert('Instagram reel added successfully!');
      }
    } catch (error) {
      console.error('Error adding reel:', error);
      alert(`Failed to add reel: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Remove media item
  const removeMedia = async (mediaId) => {
    const confirmed = confirm('Are you sure you want to delete this media?');
    if (!confirmed) return;

    try {
      const response = await mediaAPI.deleteMedia(mediaId);
      
      if (response.success) {
        setMediaItems(mediaItems.filter(m => m._id !== mediaId));
        if (selectedMedia?._id === mediaId) {
          setSelectedMedia(null);
        }
        alert('Media deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      alert(`Failed to delete media: ${error.message}`);
    }
  };

  // Update media details
  const updateMediaDetails = async (mediaId, updates) => {
    try {
      const response = await mediaAPI.updateMedia(mediaId, updates);
      
      if (response.success) {
        setMediaItems(mediaItems.map(m => 
          m._id === mediaId ? { ...m, ...updates } : m
        ));
        if (selectedMedia?._id === mediaId) {
          setSelectedMedia({ ...selectedMedia, ...updates });
        }
      }
    } catch (error) {
      console.error('Error updating media:', error);
      alert(`Failed to update media: ${error.message}`);
    }
  };

  const imageCount = mediaItems.filter(m => m.type === 'image').length;
  const videoCount = mediaItems.filter(m => m.type !== 'image').length;

  return (
    <div className="media-section">
      <h3 className="section-title">
        <i className="fas fa-images"></i>
        Media Gallery
      </h3>
      <p className="section-description">
        Add images, YouTube videos, and Instagram reels to your article. Maximum 10 images allowed.
      </p>

      {/* Media Type Selector */}
      <div className="upload-type-tabs">
        <button
          type="button"
          className={`type-tab ${uploadType === 'image' ? 'active' : ''}`}
          onClick={() => setUploadType('image')}
        >
          <i className="fas fa-image"></i>
          Upload Images ({imageCount}/10)
        </button>
        <button
          type="button"
          className={`type-tab ${uploadType === 'youtube' ? 'active' : ''}`}
          onClick={() => setUploadType('youtube')}
        >
          <i className="fab fa-youtube"></i>
          YouTube Video
        </button>
        <button
          type="button"
          className={`type-tab ${uploadType === 'instagram' ? 'active' : ''}`}
          onClick={() => setUploadType('instagram')}
        >
          <i className="fab fa-instagram"></i>
          Instagram Reel
        </button>
      </div>

      {/* Upload Area */}
      <div className="upload-area">
        {uploadType === 'image' && (
          <div className="image-upload">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={imageCount >= 10}
            />
            <label htmlFor="image-upload" className={`upload-box ${imageCount >= 10 ? 'disabled' : ''}`}>
              <i className="fas fa-cloud-upload-alt"></i>
              <h4>Upload Images</h4>
              <p>Click to browse or drag and drop</p>
              <small>JPG, PNG, WebP • Max 5MB each • {imageCount}/10 used</small>
            </label>
          </div>
        )}

        {uploadType === 'youtube' && (
          <div className="url-input-group">
            <div className="input-with-icon">
              <i className="fab fa-youtube"></i>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube video URL (e.g., https://youtube.com/watch?v=...)"
              />
            </div>
            <button
              type="button"
              className="btn-add"
              onClick={addYouTubeVideo}
              disabled={!youtubeUrl}
            >
              <i className="fas fa-plus"></i>
              Add Video
            </button>
          </div>
        )}

        {uploadType === 'instagram' && (
          <div className="url-input-group">
            <div className="input-with-icon">
              <i className="fab fa-instagram"></i>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="Paste Instagram post/reel URL (e.g., https://instagram.com/p/...)"
              />
            </div>
            <button
              type="button"
              className="btn-add"
              onClick={addInstagramReel}
              disabled={!instagramUrl}
            >
              <i className="fas fa-plus"></i>
              Add Reel
            </button>
          </div>
        )}
      </div>

      {/* Media Grid */}
      {mediaItems.length > 0 && (
        <div className="media-grid">
          <h4 className="grid-title">
            <i className="fas fa-images"></i>
            Media Items ({mediaItems.length})
          </h4>
          <div className="grid-items">
            {mediaItems.map(media => (
              <div
                key={media._id}
                className={`media-item ${selectedMedia?._id === media._id ? 'selected' : ''}`}
                onClick={() => setSelectedMedia(media)}
              >
                {media.isFeatured && (
                  <div className="featured-badge">
                    <i className="fas fa-star"></i>
                    Featured
                  </div>
                )}

                <div className="media-type-badge">
                  {media.type === 'image' && <i className="fas fa-image"></i>}
                  {media.type === 'youtube_video' && <i className="fab fa-youtube"></i>}
                  {media.type === 'instagram_reel' && <i className="fab fa-instagram"></i>}
                </div>

                <div className="media-preview">
                  {media.type === 'image' && (
                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${media.url}`} alt={media.altText?.en || 'Preview'} />
                  )}
                  {media.type === 'youtube_video' && (
                    <img src={media.thumbnail} alt="YouTube thumbnail" />
                  )}
                  {media.type === 'instagram_reel' && (
                    <div className="instagram-preview">
                      <i className="fab fa-instagram"></i>
                      <span>Instagram Post</span>
                    </div>
                  )}
                </div>

                <div className="media-actions">
                  {media.type === 'image' && !media.isFeatured && (
                    <button
                      type="button"
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeatured(media._id);
                      }}
                      title="Set as featured"
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  )}
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMedia(media._id);
                    }}
                    title="Remove"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Details Editor */}
      {selectedMedia && (
        <div className="media-details">
          <h4 className="details-title">
            <i className="fas fa-edit"></i>
            Edit Media Details
          </h4>

          <div className="details-content">
            <div className="details-preview">
              {selectedMedia.type === 'image' && (
                <img src={selectedMedia.url} alt={selectedMedia.altText?.en || 'Preview'} />
              )}
              {selectedMedia.type === 'youtube_video' && (
                <img src={selectedMedia.thumbnail} alt="YouTube thumbnail" />
              )}
              {selectedMedia.type === 'instagram_reel' && (
                <div className="instagram-preview-large">
                  <i className="fab fa-instagram"></i>
                  <p>Instagram Post</p>
                </div>
              )}
            </div>

            <div className="details-form">
              {selectedMedia.type === 'image' && (
                <div className="form-group">
                  <label className="form-label">Alt Text (for SEO & accessibility)</label>
                  <input
                    type="text"
                    value={selectedMedia.altText?.en || ''}
                    onChange={(e) => updateAltText(selectedMedia._id, e.target.value)}
                    placeholder="Describe the image for screen readers..."
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Caption</label>
                <textarea
                  value={selectedMedia.caption || ''}
                  onChange={(e) => updateCaption(selectedMedia._id, e.target.value)}
                  placeholder="Add a caption for this media..."
                  rows={3}
                />
              </div>

              {selectedMedia.type !== 'image' && (
                <div className="form-group">
                  <label className="form-label">URL</label>
                  <input
                    type="text"
                    value={selectedMedia.url}
                    readOnly
                    className="readonly"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {mediaItems.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-images"></i>
          <h4>No Media Added Yet</h4>
          <p>Upload images or add YouTube/Instagram content to enhance your article.</p>
        </div>
      )}

      <style jsx>{`
        .media-section {
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

        .upload-type-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .type-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
        }

        .type-tab:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .type-tab.active {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .upload-area {
          margin-bottom: 2rem;
        }

        .upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          border: 2px dashed rgba(159, 211, 86, 0.5);
          border-radius: 12px;
          background: rgba(159, 211, 86, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .upload-box:hover:not(.disabled) {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.1);
        }

        .upload-box.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-box i {
          font-size: 3rem;
          color: var(--lime-spark);
          margin-bottom: 1rem;
        }

        .upload-box h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--evergreen);
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .upload-box p {
          color: rgba(47, 60, 59, 0.7);
          margin-bottom: 0.5rem;
        }

        .upload-box small {
          color: rgba(47, 60, 59, 0.6);
          font-size: 0.875rem;
        }

        .url-input-group {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .input-with-icon {
          flex: 1;
          position: relative;
        }

        .input-with-icon i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(47, 60, 59, 0.5);
          font-size: 1.2rem;
        }

        .input-with-icon input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Open Sans', sans-serif;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .btn-add {
          padding: 0.75rem 1.5rem;
          background: var(--lime-spark);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .btn-add:hover:not(:disabled) {
          background: #7fb83e;
          transform: translateY(-2px);
        }

        .btn-add:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .media-grid {
          margin-bottom: 2rem;
        }

        .grid-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .grid-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .media-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .media-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .media-item.selected {
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.2);
        }

        .featured-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background: var(--yellow-sun);
          color: var(--evergreen);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .media-type-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .media-preview {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .media-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .instagram-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #E1306C;
        }

        .instagram-preview i {
          font-size: 3rem;
        }

        .media-actions {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          display: flex;
          gap: 0.25rem;
          z-index: 2;
        }

        .action-btn {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: var(--lime-spark);
        }

        .action-btn.delete:hover {
          background: #e74c3c;
        }

        .media-details {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .details-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .details-content {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1.5rem;
        }

        .details-preview {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 1;
        }

        .details-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .instagram-preview-large {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #E1306C;
        }

        .instagram-preview-large i {
          font-size: 4rem;
        }

        .details-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Open Sans', sans-serif;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .form-group input.readonly {
          background: #f8f9fa;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(47, 60, 59, 0.5);
        }

        .empty-state i {
          font-size: 4rem;
          color: rgba(159, 211, 86, 0.3);
          margin-bottom: 1rem;
        }

        .empty-state h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--evergreen);
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        @media (max-width: 768px) {
          .grid-items {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .details-content {
            grid-template-columns: 1fr;
          }

          .details-preview {
            max-width: 250px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default MediaSection;
