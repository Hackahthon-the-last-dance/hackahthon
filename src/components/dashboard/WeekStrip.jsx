// Interactive 7-Day Week Strip & Daily Drilldown Inspector
import React, { useState } from 'react';
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  Droplets,
  Moon,
  Flame,
  Smile,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function WeekStrip() {
  const { weekStory, selectedDay, setSelectedDay } = useApp();
  const [drilldownModalDay, setDrilldownModalDay] = useState(null);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setDrilldownModalDay(day);
  };

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
        gap: '18px',
      }}
      className="card-hoverable"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Your Week in Flow
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Click any day to inspect full biomarker logs and habit timeline
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            Best Day: Wednesday (100%)
          </span>
        </div>
      </div>

      {/* 7-Day Horizontal Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {weekStory.map((day) => {
          const isSelected = selectedDay?.date === day.date;
          const isToday = day.dayShort === 'Sun';

          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 6px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected
                  ? 'var(--primary-light)'
                  : isToday
                  ? 'var(--bg-input)'
                  : 'var(--bg-input)',
                border: isSelected
                  ? '2px solid var(--primary)'
                  : isToday
                  ? '1.5px dashed var(--primary)'
                  : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all var(--trans-fast)',
                gap: '8px',
              }}
              className="card-hoverable"
              title={`Click to inspect ${day.dayName}`}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                {day.dayShort}
              </span>

              {/* Progress Bar Column */}
              <div
                style={{
                  width: '12px',
                  height: '54px',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${day.completionRate}%`,
                    backgroundColor:
                      day.completionRate >= 90
                        ? 'var(--accent-emerald)'
                        : day.completionRate >= 75
                        ? 'var(--primary)'
                        : 'var(--accent-amber)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'height 0.6s ease',
                  }}
                />
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {day.completionRate}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Quick Inspector Summary Box */}
      {selectedDay && (
        <div
          style={{
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                SELECTED DAY
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {selectedDay.dayName}
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Droplets size={15} color="var(--accent-blue)" /> {selectedDay.waterGlasses} glasses
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Moon size={15} color="var(--accent-indigo)" /> {selectedDay.sleepDuration}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={15} color="var(--accent-amber)" /> {selectedDay.movementMinutes} min movement
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDrilldownModalDay(selectedDay)}
          >
            View Full Day Story
          </Button>
        </div>
      )}

      {/* Full Day Drilldown Modal */}
      {drilldownModalDay && (
        <Modal
          isOpen={Boolean(drilldownModalDay)}
          onClose={() => setDrilldownModalDay(null)}
          title={`${drilldownModalDay.dayName} Health Story`}
          subtitle={`Completion Rate: ${drilldownModalDay.completionRate}% • Mood: ${drilldownModalDay.mood}`}
          maxWidth="520px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                DAILY SUMMARY & HIGHLIGHTS
              </h5>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                "{drilldownModalDay.highlights}"
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--accent-blue-light)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)' }}>HYDRATION</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {drilldownModalDay.waterGlasses} / 8 Glasses
                </p>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--accent-indigo-light)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>SLEEP</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {drilldownModalDay.sleepDuration} (Score {drilldownModalDay.sleepScore})
                </p>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--accent-amber-light)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>MOVEMENT</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {drilldownModalDay.movementMinutes} Minutes Active
                </p>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--accent-emerald-light)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>HABITS MET</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {drilldownModalDay.habitsCompleted} / {drilldownModalDay.totalHabits} Completed
                </p>
              </div>
            </div>

            {drilldownModalDay.recoveryUsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--accent-amber-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent-amber)' }}>
                <ShieldCheck size={18} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  Recovery Minimum Win was claimed on this day to protect streak momentum!
                </span>
              </div>
            )}

            <Button variant="primary" onClick={() => setDrilldownModalDay(null)}>
              Close Story View
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
