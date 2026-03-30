// components/Admin/GPSCapture.jsx - GPS coordinate capture with Leaflet mini map preview
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Check } from 'lucide-react';

const GPSMapPreview = dynamic(() => import('./GPSMapPreview'), { ssr: false });

/**
 * GPSCapture component for capturing GPS coordinates via browser geolocation
 * or manual entry, with a Leaflet mini map preview.
 *
 * @param {Object} props
 * @param {Function} props.onCapture - Callback with { latitude, longitude }
 * @param {{ latitude: number, longitude: number }} [props.initialCoords] - Pre-existing coordinates
 */
export default function GPSCapture({ onCapture, initialCoords }) {
  const [coords, setCoords] = useState(initialCoords || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCapture = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const captured = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoords(captured);
        setLoading(false);
        if (onCapture) onCapture(captured);
      },
      (err) => {
        setError(`Failed to get location: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onCapture]);

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        type="button"
        onClick={handleCapture}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: coords ? '#E8F5E9' : '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
      >
        {coords ? <Check size={16} color="#2E7D32" /> : <MapPin size={16} />}
        {loading ? 'Capturing GPS...' : coords ? 'GPS Captured' : 'Capture GPS Location'}
      </button>

      {error && (
        <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px' }}>{error}</p>
      )}

      {coords && (
        <>
          <div style={{ borderRadius: '6px', overflow: 'hidden', marginTop: '8px', height: '150px' }}>
            <GPSMapPreview lat={coords.latitude} lng={coords.longitude} />
          </div>
          <p style={{ fontSize: '13px', color: '#2E7D32', marginTop: '4px' }}>
            <Check size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Lat: {coords.latitude.toFixed(6)}, Lng: {coords.longitude.toFixed(6)}
          </p>
        </>
      )}
    </div>
  );
}
