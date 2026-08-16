import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';
import { useTranslation } from '../../context/I18nContext.jsx';

export default function ErrorState({ title, description, onRetry, className = '' }) {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className={`card flex flex-col items-center gap-3 border-danger/30 bg-danger-soft/40 p-10 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle size={22} strokeWidth={2.25} />
      </div>
      <h3 className="text-lg font-bold text-text">{title ?? t('common.states.error')}</h3>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} className="mt-1">
          {t('common.actions.retry')}
        </Button>
      )}
    </div>
  );
}
