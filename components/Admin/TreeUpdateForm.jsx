// components/Admin/TreeUpdateForm.jsx - Single-screen tree update form for field staff
import { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { showNotification } from '@/components/Notification';
import GPSCapture from './GPSCapture';
import PhotoUpload from './PhotoUpload';

const STATUS_ORDER = ['PAID', 'PLANT_SELECTED', 'PLANTING_SCHEDULED', 'PLANTED', 'GROWING'];

const STATUS_LABELS = {
  PAID: 'Paid',
  PLANT_SELECTED: 'Plant Selected',
  PLANTING_SCHEDULED: 'Planting Scheduled',
  PLANTED: 'Planted',
  GROWING: 'Growing'
};

/**
 * TreeUpdateForm - Mobile-first single-screen update form.
 * Full-screen on mobile, side panel on desktop.
 * @param {Object} tree - Tree object from API
 * @param {Function} onClose - Callback to close form and refresh list
 */
function TreeUpdateForm({ tree, onClose }) {
  const { getAuthHeaders } = useAuth();

  // Form state
  const [status, setStatus] = useState(tree.status || 'PAID');
  const [notes, setNotes] = useState('');
  const [species, setSpecies] = useState(tree.species || '');
  const [expectedPlantingDate, setExpectedPlantingDate] = useState(
    tree.expectedPlantingDate
      ? new Date(tree.expectedPlantingDate).toISOString().split('T')[0]
      : ''
  );
  const [gpsCoords, setGpsCoords] = useState(() => {
    const coords = tree.location?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      return { latitude: coords[1], longitude: coords[0] };
    }
    return null;
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Forward-only status transitions
  const currentIndex = STATUS_ORDER.indexOf(tree.status);
  const availableStatuses = STATUS_ORDER.slice(currentIndex >= 0 ? currentIndex : 0);

  // Existing photos from the tree's milestones
  const existingPhotos = (tree.milestones || []).reduce((urls, milestone) => {
    if (milestone.photos && milestone.photos.length) {
      return [...urls, ...milestone.photos.map((p) => p.url || p)];
    }
    return urls;
  }, []);

  const handleGPSCapture = (coords) => {
    setGpsCoords(coords);
  };

  const handlePhotoSelect = (files) => {
    setPhotoFiles(files);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Step 1: Upload photos first if any selected
      if (photoFiles.length > 0) {
        setUploadingPhotos(true);
        const formData = new FormData();
        photoFiles.forEach((file) => {
          formData.append('photos', file);
        });

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/admin/${tree._id}/photos`,
          formData,
          {
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setUploadingPhotos(false);
      }

      // Step 2: Update tree details
      const updateBody = {
        status,
        notes: notes.trim() || undefined,
        species: species.trim() || undefined,
        expectedPlantingDate: expectedPlantingDate || undefined
      };

      if (gpsCoords) {
        updateBody.latitude = gpsCoords.latitude;
        updateBody.longitude = gpsCoords.longitude;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/admin/${tree._id}/update`,
        updateBody,
        { headers: getAuthHeaders() }
      );

      showNotification('Tree updated successfully', 'success');
      if (onClose) onClose();
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to update tree. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
      setUploadingPhotos(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="tree-update-backdrop" onClick={handleClose} />

      {/* Form panel */}
      <div className="tree-update-overlay">
        {/* Header */}
        <div className="tree-update-header">
          <div>
            <h3>{tree.trackingId}</h3>
            <div className="tree-info-row">
              <span>
                {tree.recipientName && <><strong>To:</strong> {tree.recipientName}</>}
                {tree.senderName && <> &middot; <strong>From:</strong> {tree.senderName}</>}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="tree-update-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current status badge */}
        <div style={{ marginBottom: 24 }}>
          <span className={`tree-status-badge ${tree.status}`}>
            {STATUS_LABELS[tree.status] || tree.status}
          </span>
        </div>

        {/* Status dropdown - forward only */}
        <div className="tree-form-group">
          <label htmlFor="tree-status">Update Status</label>
          <select
            id="tree-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {availableStatuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>
        </div>

        {/* Photo upload */}
        <div className="tree-form-group">
          <label>Photos</label>
          <PhotoUpload
            onUpload={handlePhotoSelect}
            existingPhotos={existingPhotos}
            maxPhotos={5}
          />
        </div>

        {/* GPS capture */}
        <div className="tree-form-group">
          <label>Location</label>
          <GPSCapture
            onCapture={handleGPSCapture}
            initialCoords={gpsCoords}
          />
        </div>

        {/* Notes textarea */}
        <div className="tree-form-group">
          <label htmlFor="tree-notes">Notes</label>
          <textarea
            id="tree-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add update notes..."
            maxLength={500}
          />
          <div className="char-counter">{notes.length}/500</div>
        </div>

        {/* Species input */}
        <div className="tree-form-group">
          <label htmlFor="tree-species">Species</label>
          <input
            id="tree-species"
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g., Neem, Peepal, Banyan"
          />
        </div>

        {/* Expected planting date */}
        <div className="tree-form-group">
          <label htmlFor="tree-planting-date">Expected Planting Date</label>
          <input
            id="tree-planting-date"
            type="date"
            value={expectedPlantingDate}
            onChange={(e) => setExpectedPlantingDate(e.target.value)}
          />
        </div>

        {/* Save button - sticky at bottom */}
        <button
          type="button"
          className="tree-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader size={18} />
              {uploadingPhotos ? 'Uploading Photos...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save size={18} />
              Save Update
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default TreeUpdateForm;
