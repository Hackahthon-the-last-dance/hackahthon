// Reusable Accessible Input Component with Password Toggle and Error Support
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }} className={className}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--accent-rose)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={18} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            padding: `12px 14px 12px ${Icon ? '42px' : '14px'}`,
            paddingRight: isPassword ? '42px' : '14px',
            fontSize: '0.9375rem',
            background: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: error ? '1.5px solid var(--accent-rose)' : '1px solid var(--border-input)',
            borderRadius: 'var(--radius-md)',
            transition: 'border-color var(--trans-fast), box-shadow var(--trans-fast)',
            outline: 'none',
          }}
          className="healthflow-input"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)', fontSize: '0.8125rem' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{helperText}</span>
      ) : null}
    </div>
  );
}
