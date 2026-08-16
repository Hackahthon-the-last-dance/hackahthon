import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { useTranslation } from '../../context/I18nContext.jsx';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  loading = false,
}) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClassName="max-w-[440px]" showCloseButton={!loading}>
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            variant === 'danger' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'
          }`}
        >
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-xl font-bold text-text">{title}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-text-secondary">{message}</p>

        <div className="mt-3 flex w-full gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
            {t('common.actions.cancel')}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            loadingText={t('common.states.loading')}
            className="flex-1"
          >
            {confirmText ?? t('common.actions.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
