// Today's Focus Card with Interactive Quick Actions: Hydration +1, Movement Minimum Win, Sleep Logging
import React, { useState } from 'react';
import {
  Droplets,
  Flame,
  Moon,
  Plus,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function TodayFocusCard({ onOpenQuickLog }) {
  const {
    todayVitals,
    addWaterGlass,
    quickLogMovement,
    habits,
    completeMinimumWin,
    toggleHabitCompletion,
  } = useApp();

  const [movementLoading, setMovementLoading] = useState(false);

  // Find movement habit
  const movementHabit = habits.find((h) => h.category === 'movement');
  const isMovementDone = movementHabit ? movementHabit.completed : (todayVitals.movementMinutes || 0) >= 30;

  const handleCompleteMovementWin = () => {
    setMovementLoading(true);
    setTimeout(() => {
      quickLogMovement(5);
      if (movementHabit) {
        completeMinimumWin(movementHabit.id);
      }
      setMovementLoading(false);
    }, 400);
  };

  const waterGlasses = todayVitals.waterGlasses || 5;
  const isWaterDone = waterGlasses >= 8;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
      className="card-hoverable"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Today's Focus
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Daily core vitals and instant micro-wins
          </p>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-light)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          Active Focus
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. Hydration Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-blue-light)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Droplets size={22} />
            </div>

            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                💧 Hydration
              </span>
              <span style={{ fontSize: '0.8125rem', color: isWaterDone ? 'var(--accent-emerald)' : 'var(--text-secondary)', fontWeight: 600 }}>
                {waterGlasses} / 8 glasses {isWaterDone && '✓ Goal reached!'}
              </span>
            </div>
          </div>

          <Button
            variant={isWaterDone ? 'subtle' : 'primary'}
            size="sm"
            icon={Plus}
            onClick={addWaterGlass}
          >
            + Add
          </Button>
        </div>

        {/* 2. Movement Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-amber-light)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Flame size={22} />
            </div>

            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                🏃 Movement
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Minimum Win: <strong style={{ color: 'var(--text-primary)' }}>5 min</strong> stretch
              </span>
            </div>
          </div>

          <Button
            variant={isMovementDone ? 'success' : 'primary'}
            size="sm"
            icon={isMovementDone ? CheckCircle2 : Sparkles}
            onClick={handleCompleteMovementWin}
            loading={movementLoading}
            loadingText="Saving..."
          >
            {isMovementDone ? 'Completed' : 'Complete'}
          </Button>
        </div>

        {/* 3. Sleep Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-indigo-light)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Moon size={22} />
            </div>

            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                😴 Restorative Sleep
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>7h 20m</strong> • Score: 82/100
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenQuickLog}
          >
            Edit Log
          </Button>
        </div>
      </div>
    </div>
  );
}
