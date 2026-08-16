// Image Component with Fallback, Lazy Loading, and Aspect Ratio
import React, { useState } from 'react';
import { IMAGES } from '../../constants/images';

export default function ImageWithFallback({
  src,
  fallbackSrc = IMAGES.fallbackHealthcare,
  alt = 'HealthFlow image',
  style = {},
  className = '',
  loading = 'lazy',
  ...props
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imgSrc = error || !src ? fallbackSrc : src;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-input)',
        ...style,
      }}
      className={className}
    >
      {!loaded && (
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity var(--trans-base)',
          display: 'block',
        }}
        {...props}
      />
    </div>
  );
}
