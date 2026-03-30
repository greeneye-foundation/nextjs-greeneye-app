// components/Forest/ForestMapInner.jsx - Client-only Leaflet map with marker clustering
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Fix Leaflet default marker icons (same as TreeMapInner.jsx)
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
 * ForestMapInner - Renders a full-page Leaflet map with clustered tree markers
 * @param {Object} props
 * @param {Array} props.trees - Array of tree objects with trackingId, treeName, species, plantedAt, location, plantName
 */
export default function ForestMapInner({ trees }) {
  // Filter trees with valid coordinates
  const validTrees = (trees || []).filter(
    (tree) =>
      tree.location &&
      tree.location.coordinates &&
      tree.location.coordinates.length === 2 &&
      typeof tree.location.coordinates[0] === 'number' &&
      typeof tree.location.coordinates[1] === 'number'
  );

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
      <MarkerClusterGroup>
        {validTrees.map((tree) => (
          <Marker
            key={tree.trackingId}
            position={[tree.location.coordinates[1], tree.location.coordinates[0]]}
          >
            <Popup>
              <div>
                <p className="forest-popup-name">
                  {tree.treeName || tree.plantName || tree.species || 'Tree'}
                </p>
                <p className="forest-popup-date">
                  Planted: {formatDate(tree.plantedAt)}
                </p>
                <a href={`/track/${tree.trackingId}`} className="forest-popup-link">
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
