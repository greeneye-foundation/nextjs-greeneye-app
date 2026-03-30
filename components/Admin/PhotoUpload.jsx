// components/Admin/PhotoUpload.jsx - Camera-first photo upload with preview
import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';

/**
 * PhotoUpload component for field staff to capture/upload tree photos.
 * @param {Function} onUpload - Callback with array of File objects when files are selected
 * @param {Array} existingPhotos - Array of existing S3 photo URLs
 * @param {number} maxPhotos - Maximum number of photos allowed (default 5)
 */
function PhotoUpload({ onUpload, existingPhotos = [], maxPhotos = 5 }) {
  const [previews, setPreviews] = useState([]); // { file, previewUrl }
  const fileInputRef = useRef(null);

  const totalPhotos = existingPhotos.length + previews.length;
  const canAddMore = totalPhotos < maxPhotos;

  const handleButtonClick = () => {
    if (!canAddMore) return;
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Calculate how many more we can add
    const slotsAvailable = maxPhotos - totalPhotos;
    const filesToAdd = files.slice(0, slotsAvailable);

    const newPreviews = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);

    // Notify parent with all selected files
    if (onUpload) {
      onUpload(updatedPreviews.map((p) => p.file));
    }

    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleRemovePreview = (index) => {
    const removed = previews[index];
    if (removed.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);

    // Notify parent with updated files
    if (onUpload) {
      onUpload(updatedPreviews.map((p) => p.file));
    }
  };

  return (
    <div>
      {/* Hidden file input - camera first on mobile */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Visible upload button */}
      <button
        type="button"
        className="photo-upload-btn"
        onClick={handleButtonClick}
        disabled={!canAddMore}
      >
        <Camera size={18} />
        {canAddMore ? 'Add Photo' : 'Max Photos Reached'}
      </button>

      <div className="photo-count-info">
        {totalPhotos} of {maxPhotos} photos
      </div>

      {/* Thumbnail grid */}
      {(existingPhotos.length > 0 || previews.length > 0) && (
        <div className="photo-previews">
          {/* Existing photos from server */}
          {existingPhotos.map((url, index) => (
            <div key={`existing-${index}`} className="photo-preview-item">
              <img
                src={url}
                alt={`Tree photo ${index + 1}`}
                className="photo-preview-thumb"
              />
            </div>
          ))}

          {/* New preview thumbnails */}
          {previews.map((preview, index) => (
            <div key={`new-${index}`} className="photo-preview-item">
              <img
                src={preview.previewUrl}
                alt={`New photo ${index + 1}`}
                className="photo-preview-thumb"
              />
              <button
                type="button"
                className="photo-remove-btn"
                onClick={() => handleRemovePreview(index)}
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;
