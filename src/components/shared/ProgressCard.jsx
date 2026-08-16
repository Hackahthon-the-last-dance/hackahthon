export default function ProgressCard({ icon: Icon, label, percent, detail, className = '' }) {
  const clampedPercent = Math.max(0, Math.min(100, percent ?? 0));

  return (
    <div className={`card flex flex-col gap-3 p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          {Icon && <Icon size={16} strokeWidth={2.25} />}
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="text-lg font-extrabold text-text">{Math.round(clampedPercent)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {detail && <span className="text-xs text-text-muted">{detail}</span>}
    </div>
  );
}
