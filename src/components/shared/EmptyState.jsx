import { useTranslation } from '../../context/I18nContext.jsx';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  const { t } = useTranslation();

  return (
    <div className={`card flex flex-col items-center gap-3 p-10 text-center ${className}`}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
          <Icon size={22} strokeWidth={2} />
        </div>
      )}
      <h3 className="text-lg font-bold text-text">{title ?? t('common.states.empty')}</h3>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
