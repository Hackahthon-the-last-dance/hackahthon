export default function HabitCard({ icon: Icon, title, subtitle, progressPercent, children, action, className = '' }) {
  const clampedPercent = Math.max(0, Math.min(100, progressPercent ?? 0));

  return (
    <div className={`card flex flex-col gap-4 p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-soft text-success-strong">
              <Icon size={18} strokeWidth={2} />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-text">{title}</h3>
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>

      {typeof progressPercent === 'number' && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      )}

      {children}
    </div>
  );
}
