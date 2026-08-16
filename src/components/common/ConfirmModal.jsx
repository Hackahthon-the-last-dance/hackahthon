// Reusable Confirmation Modal for Destructive & Important Actions
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="440px"
      showCloseButton={!loading}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '8px 0' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: variant === 'danger' ? 'var(--accent-rose-light)' : 'var(--accent-amber-light)',
            color: variant === 'danger' ? 'var(--accent-rose)' : 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', width: '100%', gap: '12px', marginTop: '12px' }}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            loadingText="Processing..."
            style={{ flex: 1 }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
