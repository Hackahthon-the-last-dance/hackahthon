// Health Momentum Card with Reactive SVG Ring Gauge and Category Pillars
import React, { useState } from 'react';
import {
  TrendingUp,
  Droplets,
  Moon,
  Flame,
  Heart,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function MomentumCard() {
  const { momentumScore, todayVitals, habits } = useApp();
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // SVG Gauge calculations
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (momentumScore / 100) * circumference;

  const getMomentumTier = (score) => {
    if (score >= 90) return { label: 'Peak Vitality 🔥', color: 'var(--accent-emerald)', bg: 'var(--accent-emerald-light)' };
    if (score >= 75) return { label: 'Optimal Flow ⚡', color: 'var(--primary)', bg: 'var(--primary-light)' };
    if (score >= 60) return { label: 'Steady Progress 🌱', color: 'var(--accent-blue)', bg: 'var(--accent-blue-light)' };
    return { label: 'Recovery Mode Needed 🛡️', color: 'var(--accent-amber)', bg: 'var(--accent-amber-light)' };
  };

  const tier = getMomentumTier(momentumScore);

  const pillars = [
    {
      id: 'water',
      label: 'Water',
      icon: Droplets,
      color: '#0284c7',
      status: `${todayVitals.waterGlasses || 0}/8 glasses`,
      isDone: (todayVitals.waterGlasses || 0) >= 8,
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon,
      color: '#6366f1',
      status: '7h 20m logged',
      isDone: true,
    },
    {
      id: 'movement',
      label: 'Movement',
      icon: Flame,
      color: '#ea580c',
      status: `${todayVitals.movementMinutes || 0}/30 mins`,
      isDone: (todayVitals.movementMinutes || 0) >= 30,
    },
    {
      id: 'mindfulness',
      label: 'Mindfulness',
      icon: Heart,
      color: '#0d9488',
      status: 'Completed',
      isDone: true,
    },
  ];

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
        position: 'relative',
        overflow: 'hidden',
      }}
      className="card-hoverable"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Health Momentum
            </h3>
            <button
              onClick={() => setShowFormulaModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="View Momentum Formula Breakdown"
              aria-label="View Momentum Formula Breakdown"
            >
              <Info size={16} />
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time composite score based on consistency, recovery & vitals
          </p>
        </div>

        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: tier.color,
            backgroundColor: tier.bg,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Main Score Center Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '24px',
          padding: '12px 0',
        }}
      >
        {/* Animated Circular Gauge */}
        <div style={{ position: 'relative', width: radius * 2, height: radius * 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              stroke="var(--bg-input)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="var(--primary)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                strokeLinecap: 'round',
              }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {momentumScore}%
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
              MOMENTUM
            </span>
          </div>
        </div>

        {/* Pillar Status Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            flex: 1,
            minWidth: '240px',
          }}
        >
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    color: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                    {p.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: p.isDone ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Transparency Modal */}
      {showFormulaModal && (
        <Modal
          isOpen={showFormulaModal}
          onClose={() => setShowFormulaModal(false)}
          title="Health Momentum Formula Engine"
          subtitle="How your score is calculated deterministically with zero artificial randomness."
          maxWidth="520px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--primary)', margin: 0, fontWeight: 700 }}>
                Score = (Habits 40%) + (7-Day Consistency 25%) + (Vitals 20%) + (Recovery Wins 15%)
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600 }}>1. Daily Habits Today</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>40 pts max</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Proportion of active daily health habits completed before midnight.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '6px' }}>
                <span style={{ fontWeight: 600 }}>2. 7-Day Consistency Factor</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>25 pts max</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Averaged consistency streak over the past week to reward sustained momentum.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '6px' }}>
                <span style={{ fontWeight: 600 }}>3. Vitals & Biomarkers</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>20 pts max</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Logged hydration volume (8 glasses goal), restorative sleep (7.5h), and physical movement.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '6px' }}>
                <span style={{ fontWeight: 600 }}>4. Recovery Mode & Minimum Wins</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>15 pts max</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Completing a micro-win (e.g. 5-min stretch instead of 30 min) rescues streak momentum!
              </p>
            </div>

            <Button variant="primary" onClick={() => setShowFormulaModal(false)} style={{ marginTop: '12px' }}>
              Got It
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
