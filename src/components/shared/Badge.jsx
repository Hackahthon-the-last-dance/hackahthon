const VARIANT_CLASSES = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success-strong',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-muted text-text-secondary',
};

export default function Badge({ children, variant = 'primary', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
