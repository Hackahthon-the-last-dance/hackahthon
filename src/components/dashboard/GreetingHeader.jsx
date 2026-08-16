// Greeting Header with Dynamic Time-of-Day, Date, and Quick Log Action
import React from 'react';
import { Sparkles, Plus, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function GreetingHeader({ onOpenQuickLog }) {
  const { user } = useApp();

  // Compute greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} />
            {formattedDate}
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {getGreeting()}, {user?.firstName || 'Firdavs'} 👋
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Here is your personalized preventive health pulse and habit momentum for today.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onOpenQuickLog}
        >
          Log Daily Vitals
        </Button>
      </div>
    </div>
  );
}
