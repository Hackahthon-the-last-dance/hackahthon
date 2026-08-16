import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClassName = 'max-w-[540px]',
  showCloseButton = true,
  footer,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="animate-fade-in fixed inset-0 z-[999] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`animate-scale-in flex max-h-[90vh] w-full ${maxWidthClassName} flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              {title && <h3 className="text-xl font-bold text-text">{title}</h3>}
              {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
            </div>

            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                ariaLabel="Close modal"
                icon={X}
                className="text-text-muted"
              />
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border bg-input px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
