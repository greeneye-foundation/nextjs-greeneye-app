// components/Forest/ForestMap.jsx - Dynamic wrapper for ForestMapInner (no SSR)
import dynamic from 'next/dynamic';

const ForestMapInner = dynamic(() => import('./ForestMapInner'), {
  ssr: false,
  loading: () => <div className="forest-loading">Loading map...</div>,
});

/**
 * ForestMap - Wraps ForestMapInner with dynamic import to prevent SSR
 * @param {Object} props
 * @param {Array} props.trees - Array of tree objects to display on the map
 */
export default function ForestMap({ trees }) {
  return (
    <div className="forest-map-container">
      <ForestMapInner trees={trees} />
    </div>
  );
}
