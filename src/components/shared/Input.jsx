import { useState } from 'react';
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
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="flex items-center gap-1 text-sm font-semibold text-text">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative flex w-full items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-text-muted">
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
          className={`w-full rounded-lg border bg-input text-[0.9375rem] text-text outline-none transition-colors duration-150 focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? 'border-[1.5px] border-danger' : 'border-border-strong'
          } py-3 ${Icon ? 'pl-[42px]' : 'pl-3.5'} ${isPassword ? 'pr-[42px]' : 'pr-3.5'}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 flex items-center p-1 text-text-muted"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-1 text-[0.8125rem] text-danger">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <span className="text-[0.8125rem] text-text-muted">{helperText}</span>
      ) : null}
    </div>
  );
}
