// Reusable Badge Component
import React from 'react';

export default function Badge({
  children,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon: Icon,
  size = 'md', // 'sm' | 'md'
  className = '',
  style = {},
}) {
  const variantClass = `badge-${variant}`;
  const sizeStyle = size === 'sm' ? { fontSize: '0.72rem', padding: '2px 8px' } : {};

  return (
    <span className={`badge ${variantClass} ${className}`} style={{ ...sizeStyle, ...style }}>
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      <span>{children}</span>
    </span>
  );
}
