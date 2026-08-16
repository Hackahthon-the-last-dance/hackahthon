import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function ImageWithFallback({ src, alt = '', className = '', loading = 'lazy', ...props }) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-input ${className}`}>
      {!loaded && !errored && <div className="skeleton-shimmer absolute inset-0" />}

      {errored || !src ? (
        <div className="absolute inset-0 flex items-center justify-center text-text-muted">
          <ImageOff size={28} strokeWidth={1.5} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            setLoaded(true);
          }}
          className={`block h-full w-full object-cover transition-opacity duration-[250ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  );
}
