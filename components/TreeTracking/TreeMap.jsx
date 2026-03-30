import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

const TreeMapInner = dynamic(() => import('./TreeMapInner'), {
  ssr: false,
  loading: () => <div className="tree-map-loading">Loading map...</div>
});

export default function TreeMap({ lat, lng, treeName, expandable = true }) {
  const [expanded, setExpanded] = useState(false);

  if (!lat || !lng) return null;

  return (
    <>
      <div className="tree-map-compact">
        <TreeMapInner lat={lat} lng={lng} treeName={treeName} height="200px" zoom={15} />
        {expandable && (
          <button className="tree-map-expand-btn" onClick={() => setExpanded(true)} aria-label="Expand map">
            <Maximize2 size={18} />
          </button>
        )}
      </div>
      {expanded && (
        <div className="tree-map-fullscreen" role="dialog" aria-modal="true" aria-label="Tree location map">
          <button className="tree-map-close-btn" onClick={() => setExpanded(false)} aria-label="Close map">
            <X size={24} />
          </button>
          <TreeMapInner lat={lat} lng={lng} treeName={treeName} height="100vh" zoom={15} />
        </div>
      )}
    </>
  );
}
