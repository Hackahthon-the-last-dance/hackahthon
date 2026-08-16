// Reusable Skeleton Loader Components for Async Data Loading
import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Skeleton width="48px" height="48px" borderRadius="var(--radius-md)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton width="60%" height="16px" />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
      <Skeleton width="100%" height="24px" />
      <Skeleton width="80%" height="14px" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '320px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="180px" height="20px" />
        <Skeleton width="90px" height="16px" />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '12px' }}>
        {[40, 75, 55, 90, 65, 80, 70].map((h, i) => (
          <Skeleton key={i} width="100%" height={`${h}%`} borderRadius="var(--radius-xs)" />
        ))}
      </div>
    </div>
  );
}
