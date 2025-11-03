// components/AQIWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

const AQIWidget = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const router = useRouter();
  const widgetRef = useRef(null);
  const t = useTranslations('aqiWidget');

  // AQI Color and Category based on standard ranges
  const getAQIInfo = (aqi) => {
    if (aqi <= 50) {
      return { category: 'Good', color: '#00e400', bgColor: 'rgba(0, 228, 0, 0.1)', textColor: '#006400' };
    } else if (aqi <= 100) {
      return { category: 'Moderate', color: '#ffff00', bgColor: 'rgba(255, 255, 0, 0.1)', textColor: '#8B8000' };
    } else if (aqi <= 150) {
      return { category: 'Unhealthy for Sensitive Groups', color: '#ff7e00', bgColor: 'rgba(255, 126, 0, 0.1)', textColor: '#CC6600' };
    } else if (aqi <= 200) {
      return { category: 'Unhealthy', color: '#ff0000', bgColor: 'rgba(255, 0, 0, 0.1)', textColor: '#CC0000' };
    } else if (aqi <= 300) {
      return { category: 'Very Unhealthy', color: '#8f3f97', bgColor: 'rgba(143, 63, 151, 0.1)', textColor: '#6B2E71' };
    } else {
      return { category: 'Hazardous', color: '#7e0023', bgColor: 'rgba(126, 0, 35, 0.1)', textColor: '#7e0023' };
    }
  };

  // Click outside to close expanded view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);

  // Fetch AQI data
  const fetchAQI = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Using WAQI (World Air Quality Index) API
            const WAQI_TOKEN = process.env.NEXT_PUBLIC_WAQI_TOKEN || 'demo';

            try {
              const response = await fetch(
                `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${WAQI_TOKEN}`
              );
              const data = await response.json();

              if (data.status === 'ok') {
                setAqiData({
                  aqi: data.data.aqi,
                  city: data.data.city.name,
                  dominentpol: data.data.dominentpol,
                  time: data.data.time.s,
                  iaqi: data.data.iaqi || {},
                  attributions: data.data.attributions || []
                });
                setCity(data.data.city.name);
              } else {
                throw new Error('Unable to fetch AQI data');
              }
            } catch (err) {
              // Fallback to a default city if API fails
              await fetchDefaultCity();
            }
            setLoading(false);
          },
          async (err) => {
            // If geolocation is denied, use default city
            await fetchDefaultCity();
            setLoading(false);
          }
        );
      } else {
        await fetchDefaultCity();
        setLoading(false);
      }
    } catch (err) {
      setError('Unable to load air quality data');
      setLoading(false);
    }
  };

  const fetchDefaultCity = async () => {
    try {
      const WAQI_TOKEN = process.env.NEXT_PUBLIC_WAQI_TOKEN || 'demo';
      const response = await fetch(
        `https://api.waqi.info/feed/jaipur/?token=${WAQI_TOKEN}`
      );
      const data = await response.json();

      if (data.status === 'ok') {
        setAqiData({
          aqi: data.data.aqi,
          city: data.data.city.name,
          dominentpol: data.data.dominentpol,
          time: data.data.time.s,
          iaqi: data.data.iaqi || {},
          attributions: data.data.attributions || []
        });
        setCity(data.data.city.name);
      }
    } catch (err) {
      setError('Unable to load air quality data');
    }
  };

  // Handle initial activation
  const handleActivate = () => {
    setIsActivated(true);
    fetchAQI();
  };

  // Auto-refresh data every 30 minutes after activation
  useEffect(() => {
    if (isActivated && aqiData) {
      const interval = setInterval(fetchAQI, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isActivated, aqiData]);

  // Show initial button if not activated
  if (!isActivated) {
    return (
      <div className="aqi-widget" ref={widgetRef}>
        <button className="aqi-activate-btn" onClick={handleActivate}>
          <i className="fas fa-wind"></i>
          <span>{t('activateButton')}</span>
        </button>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="aqi-widget" ref={widgetRef}>
        <div className="aqi-widget-compact">
          <div className="aqi-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Don't show widget if error or no data
  if (error || !aqiData) {
    return null;
  }

  const aqiInfo = getAQIInfo(aqiData.aqi);

  return (
    <div className={`aqi-widget ${isExpanded ? 'expanded' : ''}`} ref={widgetRef}>
      <div className="aqi-widget-compact" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="aqi-badge" style={{ backgroundColor: aqiInfo.color }}>
          <div className="aqi-value">{aqiData.aqi}</div>
          <div className="aqi-label">AQI</div>
        </div>
        <div className="aqi-info">
          <div className="aqi-city">{city}</div>
          <div className="aqi-category" style={{ color: aqiInfo.textColor }}>
            {aqiInfo.category}
          </div>
        </div>
        <button
          className="aqi-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <i className={`fas fa-chevron-${isExpanded ? 'down' : 'up'}`}></i>
        </button>
      </div>

      {isExpanded && (
        <div className="aqi-widget-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="aqi-details">
            <div className="aqi-header">
              <h4>
                <i className="fas fa-wind"></i> {t('airQualityDetails')}
              </h4>
              <button
                className="aqi-close-btn"
                onClick={() => setIsExpanded(false)}
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="pollutants-grid">
              {aqiData.iaqi.pm25 && (
                <div className="pollutant-item">
                  <span className="pollutant-label">PM2.5</span>
                  <span className="pollutant-value">{aqiData.iaqi.pm25.v}</span>
                </div>
              )}
              {aqiData.iaqi.pm10 && (
                <div className="pollutant-item">
                  <span className="pollutant-label">PM10</span>
                  <span className="pollutant-value">{aqiData.iaqi.pm10.v}</span>
                </div>
              )}
              {aqiData.iaqi.o3 && (
                <div className="pollutant-item">
                  <span className="pollutant-label">O₃</span>
                  <span className="pollutant-value">{aqiData.iaqi.o3.v}</span>
                </div>
              )}
              {aqiData.iaqi.no2 && (
                <div className="pollutant-item">
                  <span className="pollutant-label">NO₂</span>
                  <span className="pollutant-value">{aqiData.iaqi.no2.v}</span>
                </div>
              )}
              {aqiData.iaqi.so2 && (
                <div className="pollutant-item">
                  <span className="pollutant-label">SO₂</span>
                  <span className="pollutant-value">{aqiData.iaqi.so2.v}</span>
                </div>
              )}
              {aqiData.iaqi.co && (
                <div className="pollutant-item">
                  <span className="pollutant-label">CO</span>
                  <span className="pollutant-value">{aqiData.iaqi.co.v}</span>
                </div>
              )}
            </div>

            {aqiData.dominentpol && (
              <div className="dominant-pollutant">
                <i className="fas fa-exclamation-circle"></i>
                {t('dominantPollutant')}: <strong>{aqiData.dominentpol.toUpperCase()}</strong>
              </div>
            )}

            <div className="aqi-help-section">
              <p className="aqi-help-text">
                <i className="fas fa-leaf"></i>
                {t('helpText')}
              </p>
              <button
                className="btn-improve-aqi"
                onClick={() => router.push('/donate')}
              >
                <i className="fas fa-seedling"></i>
                {t('supportButton')}
              </button>
            </div>

            <div className="aqi-updated">
              <i className="fas fa-clock"></i> {t('updated')}: {new Date(aqiData.time).toLocaleString()}
            </div>

            {aqiData.attributions && aqiData.attributions.length > 0 && (
              <div className="aqi-attribution">
                <small>
                  {t('dataSource')}: {aqiData.attributions[0]?.name || 'WAQI'}
                </small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AQIWidget;
