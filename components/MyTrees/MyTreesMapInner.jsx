// components/MyTrees/MyTreesMapInner.jsx - Client-only Leaflet map with user's tree markers
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Fix Leaflet default marker icons (same as ForestMapInner.jsx)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src || markerIcon,
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  shadowUrl: markerShadow.src || markerShadow,
});

/**
 * FitBounds - Auto-fits map bounds to user's tree locations
 * @param {Object} props
 * @param {Array} props.trees - Array of trees with valid coordinates
 */
function FitBounds({ trees }) {
  const map = useMap();
  useEffect(() => {
    if (trees.length > 0) {
      const bounds = L.latLngBounds(
        trees.map((t) => [t.location.coordinates[1], t.location.coordinates[0]])
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [trees, map]);
  return null;
}

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * MyTreesMapInner - Renders a 300px Leaflet map with the user's tree markers
 * @param {Object} props
 * @param {Array} props.trees - Array of tree objects with trackingId, treeName, species, plantedAt, location, plantName, status
 */
export default function MyTreesMapInner({ trees }) {
  // Filter trees with valid GeoJSON coordinates
  const validTrees = (trees || []).filter(
    (tree) =>
      tree.location &&
      tree.location.coordinates &&
      tree.location.coordinates.length === 2 &&
      typeof tree.location.coordinates[0] === 'number' &&
      typeof tree.location.coordinates[1] === 'number'
  );

  if (validTrees.length === 0) {
    return (
      <div className="ge-mytrees__map-loading">
        No tree locations available yet
      </div>
    );
  }

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      />
      <FitBounds trees={validTrees} />
      <MarkerClusterGroup>
        {validTrees.map((tree) => (
          <Marker
            key={tree.trackingId}
            position={[tree.location.coordinates[1], tree.location.coordinates[0]]}
          >
            <Popup>
              <div>
                <p style={{ fontWeight: 600, margin: '0 0 4px' }}>
                  {tree.treeName || tree.plantName || tree.species || 'Your Tree'}
                </p>
                {tree.species && (
                  <p style={{ fontSize: '0.85em', color: '#666', margin: '0 0 4px' }}>
                    {tree.species}
                  </p>
                )}
                <p style={{ fontSize: '0.85em', color: '#666', margin: '0 0 6px' }}>
                  Status: {tree.status || 'Planted'}
                </p>
                {tree.plantedAt && (
                  <p style={{ fontSize: '0.8em', color: '#999', margin: '0 0 6px' }}>
                    Planted: {formatDate(tree.plantedAt)}
                  </p>
                )}
                <a
                  href={`/track/${tree.trackingId}`}
                  style={{ color: '#1B5E3A', fontWeight: 600, fontSize: '0.85em' }}
                >
                  Track this tree &rarr;
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
