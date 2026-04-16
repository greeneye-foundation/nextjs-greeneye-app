// components/MyTrees/MyTreesMap.jsx - Dynamic wrapper for MyTreesMapInner (no SSR)
import dynamic from 'next/dynamic';

const MyTreesMapInner = dynamic(() => import('./MyTreesMapInner'), {
  ssr: false,
  loading: () => <div className="ge-mytrees__map-loading">Loading map...</div>,
});

/**
 * MyTreesMap - Wraps MyTreesMapInner with dynamic import to prevent SSR
 * @param {Object} props
 * @param {Array} props.trees - Array of tree objects to display on the map
 */
export default function MyTreesMap({ trees }) {
  return <MyTreesMapInner trees={trees} />;
}
