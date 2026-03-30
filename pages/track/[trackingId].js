// pages/track/[trackingId].js - Public tree tracking page
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import Head from 'next/head';
import TreeHeader from '@/components/TreeTracking/TreeHeader';
import TreeTimeline from '@/components/TreeTracking/TreeTimeline';
import TreeMap from '@/components/TreeTracking/TreeMap';
import ShareButton from '@/components/TreeTracking/ShareButton';
import TreeNameForm from '@/components/TreeTracking/TreeNameForm';
import { showNotification } from '@/components/Notification';
import { Download, Loader, X } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale || 'en'}.json`),
      locale: locale || 'en',
    },
  };
}

export default function TrackTreePage() {
  const router = useRouter();
  const { trackingId } = router.query;
  const t = useTranslations('treeTracking');

  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Fetch tree data
  useEffect(() => {
    if (!trackingId) return;

    const fetchTree = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `${API_BASE}/api/trees/track/${trackingId}`
        );
        if (response.data.success) {
          setTree(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [trackingId]);

  // Certificate download handler
  const handleDownloadCert = useCallback(async () => {
    if (!tree) return;
    setDownloading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/api/trees/${tree.trackingId}/certificate`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `GreenEye-Certificate-${tree.certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showNotification('Failed to download certificate', 'error');
    } finally {
      setDownloading(false);
    }
  }, [tree]);

  // Escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && lightboxPhoto) {
        setLightboxPhoto(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto]);

  // Build share URL
  const shareUrl = tree
    ? `${SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/track/${tree.trackingId}`
    : '';

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>{t('title')} | GreenEye Foundation</title>
        </Head>
        <div className="tracking-page">
          <div className="tracking-container" style={{ paddingTop: '48px', textAlign: 'center' }}>
            <Loader size={32} className="spin" style={{ color: '#2A7A4E' }} />
            <p style={{ marginTop: '16px', color: '#7A8583' }}>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !tree) {
    return (
      <>
        <Head>
          <title>{t('errorState.heading')} | GreenEye Foundation</title>
        </Head>
        <div className="tracking-page">
          <div className="tracking-container">
            <div className="tracking-error">
              <h2>{t('errorState.heading')}</h2>
              <p>{t('errorState.body')}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{tree.treeName || t('title')} | GreenEye Foundation</title>
        <meta
          name="description"
          content={`Track the journey of ${tree.treeName || 'your tree'} with GreenEye Foundation`}
        />
      </Head>

      <div className="tracking-page">
        <TreeHeader tree={tree} />

        <div className="tracking-container">
          {/* Action bar: Share + Download Certificate */}
          <div
            className="tracking-action-bar"
            style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}
          >
            <ShareButton trackingUrl={shareUrl} />
            <button
              className="download-cert-btn"
              onClick={handleDownloadCert}
              disabled={downloading}
            >
              {downloading ? (
                <Loader size={18} className="spin" />
              ) : (
                <Download size={18} />
              )}
              {t('downloadCertificate')}
            </button>
          </div>

          {/* Tree naming */}
          <TreeNameForm
            treeId={tree.trackingId}
            currentName={tree.treeName}
            onSave={(name) => setTree({ ...tree, treeName: name })}
          />

          {/* Pre-planting message for early statuses */}
          {['PAID', 'PLANT_SELECTED', 'PLANTING_SCHEDULED'].includes(tree.status) && (
            <div className="pre-planting-message">{t('prePlanting')}</div>
          )}

          {/* Timeline */}
          <TreeTimeline
            milestones={tree.milestones}
            currentStatus={tree.status}
            expectedPlantingDate={tree.expectedPlantingDate}
            onPhotoClick={(url) => setLightboxPhoto(url)}
          />

          {/* Map (only if coordinates exist) */}
          {tree.location?.coordinates?.length === 2 && (
            <div className="tree-map-section">
              <h3>{t('viewOnMap')}</h3>
              {/* CRITICAL: Swap GeoJSON [lng,lat] to Leaflet [lat,lng] */}
              <TreeMap
                lat={tree.location.coordinates[1]}
                lng={tree.location.coordinates[0]}
                treeName={tree.treeName || tree.plantName}
              />
              <p className="sr-only">
                Located at {tree.location.coordinates[1]}, {tree.location.coordinates[0]}
              </p>
            </div>
          )}
        </div>

        {/* Photo Lightbox */}
        {lightboxPhoto && (
          <div
            className="photo-lightbox"
            onClick={() => setLightboxPhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            <button
              className="photo-lightbox-close"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxPhoto}
              alt="Tree planting photo"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}
