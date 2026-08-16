// Reusable Empty State Component with Visual Illustration and Action CTA
import React from 'react';
import Button from './Button';

export default function EmptyState({
  illustration,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon,
  actionVariant = 'primary',
  secondaryActionText,
  onSecondaryAction,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--border-card)',
        margin: '16px 0',
      }}
      className="animate-fade-in"
    >
      {illustration && (
        <div style={{ width: '120px', height: '120px', marginBottom: '20px' }}>
          <img
            src={illustration}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--text-secondary)',
          maxWidth: '440px',
          lineHeight: 1.5,
          marginBottom: '24px',
        }}
      >
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionText && onAction && (
          <Button
            variant={actionVariant}
            onClick={onAction}
            icon={ActionIcon}
          >
            {actionText}
          </Button>
        )}

        {secondaryActionText && onSecondaryAction && (
          <Button
            variant="secondary"
            onClick={onSecondaryAction}
          >
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
}
