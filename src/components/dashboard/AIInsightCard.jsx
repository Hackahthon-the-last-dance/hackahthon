// Dynamic Contextual AI Insight Card with Functional Micro-Interactions
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Droplets, X } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function AIInsightCard() {
  const { aiInsights, addWaterGlass, setCurrentRoute, addToast } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  const activeInsight = aiInsights[0] || {
    id: 'insight-1',
    title: 'Hydration Velocity Insight',
    description: 'You usually complete your water goal before 4 PM. Doing so boosts your focus metrics by 18%.',
    impact: '+18% Afternoon Focus',
    actionText: 'Drink Water (+250ml)',
    actionType: 'add_water',
  };

  if (dismissed) return null;

  const handleAction = () => {
    if (activeInsight.actionType === 'add_water') {
      addWaterGlass();
      setActionDone(true);
      setTimeout(() => setActionDone(false), 3000);
    } else if (activeInsight.actionType === 'view_recovery') {
      setCurrentRoute('habits');
    } else {
      addToast('AI recommendation applied to your daily schedule.', 'success');
      setActionDone(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--primary-light)',
        border: '1px solid rgba(13, 148, 136, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
      }}
      className="animate-slide-up"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} />
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AI PREVENTIVE INSIGHT
            </span>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {activeInsight.title}
            </h4>
          </div>
        </div>

        <button
          onClick={() => {
            setDismissed(true);
            addToast('Insight dismissed for today.', 'info');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Dismiss insight"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
        "{activeInsight.description}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            backgroundColor: 'var(--bg-surface)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(13, 148, 136, 0.2)',
          }}
        >
          Impact: {activeInsight.impact}
        </span>

        <Button
          variant={actionDone ? 'success' : 'primary'}
          size="sm"
          icon={actionDone ? Check : Droplets}
          onClick={handleAction}
        >
          {actionDone ? 'Done ✓' : activeInsight.actionText || 'Apply Recommendation'}
        </Button>
      </div>
    </div>
  );
}
