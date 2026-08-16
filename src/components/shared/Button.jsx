import { Loader2 } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'gap-1.5 rounded-md px-3 py-1.5 text-[0.8125rem]',
  md: 'gap-2 rounded-lg px-4 py-2.5 text-[0.9375rem]',
  lg: 'gap-2.5 rounded-xl px-6 py-3.5 text-[1.0625rem]',
  icon: 'h-10 w-10 rounded-lg p-0',
};

const ICON_SIZE = { sm: 14, md: 18, lg: 20, icon: 18 };

const VARIANT_CLASSES = {
  primary: 'bg-primary text-text-inverse shadow-sm hover:bg-primary-hover',
  secondary: 'border border-border bg-hover text-text hover:bg-surface-muted',
  outline: 'border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary-soft/20',
  ghost: 'bg-transparent text-text-secondary hover:bg-hover',
  danger: 'bg-danger text-white hover:opacity-90',
  success: 'bg-success-strong text-white hover:opacity-90',
  subtle: 'bg-primary-soft text-primary hover:opacity-90',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
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
  const isInactive = disabled || loading;

  const handleClick = (event) => {
    if (isInactive) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      disabled={isInactive}
      onClick={handleClick}
      title={title || (typeof children === 'string' ? children : undefined)}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={`inline-flex select-none items-center justify-center whitespace-nowrap border border-transparent font-semibold transition-all duration-150 ${
        isInactive ? 'cursor-not-allowed opacity-65' : 'cursor-pointer'
      } ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={ICON_SIZE[size]} />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={ICON_SIZE[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={ICON_SIZE[size]} />}
        </>
      )}
    </button>
  );
}
