// Reusable High-Performance Button Component
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'subtle'
  size = 'md', // 'sm' | 'md' | 'lg' | 'icon'
  loading = false,
  loadingText,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  title,
  ariaLabel,
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--trans-fast)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.65 : 1,
    position: 'relative',
    border: '1px solid transparent',
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '0.8125rem', gap: '6px' },
    md: { padding: '10px 18px', fontSize: '0.9375rem', gap: '8px' },
    lg: { padding: '14px 24px', fontSize: '1.0625rem', gap: '10px', borderRadius: 'var(--radius-lg)' },
    icon: { width: '40px', height: '40px', padding: '0', borderRadius: 'var(--radius-md)' },
  };

  const variantStyles = {
    primary: {
      background: 'var(--primary)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'var(--bg-hover)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-card)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1.5px solid var(--primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'var(--accent-rose)',
      color: '#ffffff',
    },
    success: {
      background: 'var(--accent-emerald)',
      color: '#ffffff',
    },
    subtle: {
      background: 'var(--primary-light)',
      color: 'var(--primary)',
    },
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      title={title || (typeof children === 'string' ? children : undefined)}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      className={`healthflow-btn ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
        </>
      )}
    </button>
  );
}
