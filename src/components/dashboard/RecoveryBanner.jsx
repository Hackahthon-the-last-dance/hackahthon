// Recovery Mode Banner: Appears when a habit is missed or at risk, allowing 1-click Minimum Win
import React from 'react';
import { ShieldAlert, Sparkles, Check, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function RecoveryBanner() {
  const { habits, completeMinimumWin } = useApp();

  // Find an uncompleted habit that hasn't had recovery claimed yet
  const missedHabit = habits.find((h) => !h.completed && !h.recoveryClaimedToday && !h.isPaused);

  if (!missedHabit || !missedHabit.minimumWin) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--accent-amber-light)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}
      className="animate-slide-up"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-amber)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ShieldAlert size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              RECOVERY PROTOCOL ACTIVE
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Protect your {missedHabit.streak}-day streak</span>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
            Missed {missedHabit.title}? Claim Minimum Win: "{missedHabit.minimumWin.title}"
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            {missedHabit.minimumWin.description} ({missedHabit.minimumWin.timeRequired})
          </p>
        </div>
      </div>

      <Button
        variant="warning"
        size="md"
        icon={Sparkles}
        onClick={() => completeMinimumWin(missedHabit.id)}
      >
        Complete Minimum Win
      </Button>
    </div>
  );
}
