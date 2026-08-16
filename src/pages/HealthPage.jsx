// Health Vitals Hub: Hydration, Sleep, Cardiovascular Biomarkers, and Activity
import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Moon,
  Flame,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  Smile,
} from 'lucide-react';
import Button from '../components/common/Button';
import QuickLogModal from '../components/dashboard/QuickLogModal';
import MetricChart from '../components/insights/MetricChart';
import { useApp } from '../context/AppContext';

export default function HealthPage() {
  const { todayVitals, addWaterGlass, updateVitals, weekStory, habits } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const waterGlasses = todayVitals.waterGlasses || 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Biomarkers & Health Vitals
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Daily physiological metrics logged for preventive longevity and clinical tracking.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsLogModalOpen(true)}
        >
          Log Daily Biomarkers
        </Button>
      </div>

      {/* 4 Core Vital Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Hydration */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={22} />
            </div>
            <Button variant="subtle" size="sm" icon={Plus} onClick={addWaterGlass}>
              +1 Glass
            </Button>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HYDRATION INTAKE</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {waterGlasses} / 8 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>glasses</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {(waterGlasses * 0.25).toFixed(1)} Liters / 2.0L Target
            </p>
          </div>
        </div>

        {/* Sleep */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-indigo-light)', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-light)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              Restorative
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RESTFUL SLEEP</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              7h 20m <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>logged</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Quality Index: 82/100 (Deep sleep: 1h 45m)
            </p>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-rose-light)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              Optimal
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RESTING HEART RATE</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {todayVitals.heartRate || 68} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>BPM</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              BP: {todayVitals.bloodPressure || '118/76'} mmHg
            </p>
          </div>
        </div>

        {/* Daily Energy State */}
        <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-amber-light)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smile size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', backgroundColor: 'var(--accent-amber-light)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              Logged Today
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ENERGY & MOOD</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {todayVitals.mood || 'Focused'} 🎯
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Autonomic balance: High coherence
            </p>
          </div>
        </div>
      </div>

      {/* SVG Multi-Day Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-split-2">
        <MetricChart
          title="Hydration Intake Trajectory"
          subtitle="Glasses of clean water logged across past 7 days"
          data={weekStory.map((d) => ({ dayShort: d.dayShort, dayName: d.dayName, value: d.waterGlasses }))}
          metricKey="value"
          unit="glasses"
          color="var(--accent-blue)"
          targetLine={8}
          targetLabel="8 Glass Goal"
        />

        <MetricChart
          title="Daily Physical Movement Flow"
          subtitle="Active minutes per day"
          data={weekStory.map((d) => ({ dayShort: d.dayShort, dayName: d.dayName, value: d.movementMinutes }))}
          metricKey="value"
          unit="min"
          color="var(--accent-amber)"
          targetLine={30}
          targetLabel="30 Min Goal"
        />
      </div>

      {/* Quick Log Modal */}
      {isLogModalOpen && (
        <QuickLogModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
        />
      )}
    </div>
  );
}
