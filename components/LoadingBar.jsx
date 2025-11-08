"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const LoadingBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <>
      <div className="loading-bar-overlay">
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
          <p>Loading...</p>
        </div>
      </div>
      <div className="loading-bar"></div>
    </>
  );
};

export default LoadingBar;
