// Story-driven Weekly Health Story & Narrative Analytics
import React, { useState } from 'react';
import {
  TrendingUp,
  Droplets,
  Moon,
  Flame,
  Star,
  Award,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import MetricChart from './MetricChart';
import { useApp } from '../../context/AppContext';

export default function WeeklyStoryView({ onOpenExportReport }) {
  const { weekStory, habits, selectedDay, setSelectedDay } = useApp();
  const [activeDrilldownDay, setActiveDrilldownDay] = useState(null);

  const bestDay = weekStory.reduce((prev, curr) =>
    (curr.completionRate > prev.completionRate ? curr : prev), weekStory[0]
  );

  const comparisonStats = [
    {
      label: 'Hydration Volume',
      value: '7.8 gls/day',
      trend: '↑ 24%',
      trendPositive: true,
      icon: Droplets,
      color: 'var(--accent-blue)',
      bg: 'var(--accent-blue-light)',
    },
    {
      label: 'Sleep Duration',
      value: '7h 35m avg',
      trend: '↑ 42 min',
      trendPositive: true,
      icon: Moon,
      color: 'var(--accent-indigo)',
      bg: 'var(--accent-indigo-light)',
    },
    {
      label: 'Movement Target',
      value: '5 / 7 days',
      trend: '↑ 14%',
      trendPositive: true,
      icon: Flame,
      color: 'var(--accent-amber)',
      bg: 'var(--accent-amber-light)',
    },
    {
      label: 'Momentum Stability',
      value: '84% Composite',
      trend: '↑ 6 pts',
      trendPositive: true,
      icon: Sparkles,
      color: 'var(--accent-emerald)',
      bg: 'var(--accent-emerald-light)',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Narrative Story Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-surface) 100%)',
          border: '1px solid rgba(13, 148, 136, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Badge variant="primary" size="sm" icon={Award}>
              WEEKLY STORY REVIEW
            </Badge>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Aug 10 — Aug 16, 2026</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            You sustained an 84% average momentum flow this week.
          </h2>

          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Your strongest anchor was <strong>Hydration Consistency</strong>, and claiming your Minimum Win on Thursday protected your 11-day movement streak without losing momentum.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={FileText}
          onClick={onOpenExportReport}
        >
          Export Medical Report
        </Button>
      </div>

      {/* Comparison Trend Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {comparisonStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
              className="card-hoverable"
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                  {stat.label}
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  {stat.value}
                </h4>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: stat.trendPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    marginTop: '2px',
                  }}
                >
                  {stat.trend} vs previous week
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlights Split: Best Day & Strongest Habit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-split-2">
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--accent-amber)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-amber-light)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Star size={26} />
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
              BEST DAY OF THE WEEK
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {bestDay.dayName} (100% Score)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              9 glasses of water, 8h 10m sleep, 50 min active exercise.
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Droplets size={26} />
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              STRONGEST ANCHOR HABIT
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              Hydration (14-Day Streak)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              100% adherence rate across all 7 days with zero misses.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 7-Day Clickable Timeline */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Inspect Day-by-Day Progression
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Click any day below to inspect notes, sleep metrics, and recovery actions
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {weekStory.map((day) => {
            const isBest = day.date === bestDay.date;
            return (
              <button
                key={day.date}
                onClick={() => setActiveDrilldownDay(day)}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-input)',
                  border: isBest ? '1.5px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all var(--trans-fast)',
                }}
                className="card-hoverable"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {day.dayShort}
                  </span>
                  {isBest && <Star size={14} color="var(--accent-amber)" fill="var(--accent-amber)" />}
                </div>

                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {day.completionRate}%
                </span>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>💧 {day.waterGlasses} glasses</span>
                  <span>😴 {day.sleepDuration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Multi-Metric Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-split-2">
        <MetricChart
          title="Daily Hydration (Glasses)"
          subtitle="7-Day water intake progression vs 8 glass target"
          data={weekStory.map((d) => ({ dayShort: d.dayShort, dayName: d.dayName, value: d.waterGlasses }))}
          metricKey="value"
          unit="glasses"
          color="var(--accent-blue)"
          targetLine={8}
          targetLabel="8 Glass Goal"
        />

        <MetricChart
          title="Daily Movement (Minutes)"
          subtitle="Active minutes per day vs 30-min goal"
          data={weekStory.map((d) => ({ dayShort: d.dayShort, dayName: d.dayName, value: d.movementMinutes }))}
          metricKey="value"
          unit="min"
          color="var(--accent-amber)"
          targetLine={30}
          targetLabel="30 Min Goal"
        />
      </div>

      {/* Day Story Drilldown Modal */}
      {activeDrilldownDay && (
        <Modal
          isOpen={Boolean(activeDrilldownDay)}
          onClose={() => setActiveDrilldownDay(null)}
          title={`${activeDrilldownDay.dayName} Full Story`}
          subtitle={`Overall Adherence: ${activeDrilldownDay.completionRate}% • Mood State: ${activeDrilldownDay.mood}`}
          maxWidth="520px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-lg)' }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                DAILY STORY HIGHLIGHTS
              </h5>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                "{activeDrilldownDay.highlights}"
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Water Consumed</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--accent-blue)' }}>
                  {activeDrilldownDay.waterGlasses} / 8 Glasses
                </p>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sleep & Recovery</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--accent-indigo)' }}>
                  {activeDrilldownDay.sleepDuration} (Score {activeDrilldownDay.sleepScore})
                </p>
              </div>
            </div>

            {activeDrilldownDay.recoveryUsed && (
              <div style={{ padding: '12px', backgroundColor: 'var(--accent-amber-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
                <ShieldCheck size={20} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Minimum Win was claimed on this day to protect streak momentum!
                </span>
              </div>
            )}

            <Button variant="primary" onClick={() => setActiveDrilldownDay(null)}>
              Close Story
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
