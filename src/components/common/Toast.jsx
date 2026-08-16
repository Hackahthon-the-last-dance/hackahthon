// Animated Toast & Snackbar System with Progress Bar and Dismiss Actions
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={20} color="var(--accent-emerald)" />,
    error: <AlertCircle size={20} color="var(--accent-rose)" />,
    warning: <AlertTriangle size={20} color="var(--accent-amber)" />,
    info: <Info size={20} color="var(--accent-blue)" />,
  };

  const borderColors = {
    success: 'var(--accent-emerald)',
    error: 'var(--accent-rose)',
    warning: 'var(--accent-amber)',
    info: 'var(--accent-blue)',
  };

  return (
    <div
      style={{
        pointerEvents: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderLeft: `4px solid ${borderColors[toast.type] || 'var(--primary)'}`,
        borderTop: '1px solid var(--border-card)',
        borderRight: '1px solid var(--border-card)',
        borderBottom: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
      className="animate-slide-up"
      role="alert"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div style={{ flexShrink: 0 }}>{icons[toast.type] || icons.info}</div>
        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
          {toast.message}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick();
              onDismiss();
            }}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--primary)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-light)',
            }}
          >
            {toast.action.label}
          </button>
        )}

        <button
          onClick={onDismiss}
          style={{
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
