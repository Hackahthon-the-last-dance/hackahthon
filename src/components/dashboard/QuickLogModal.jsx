// Quick Vitals & Habit Logging Modal
import React, { useState } from 'react';
import {
  Droplets,
  Moon,
  Flame,
  Heart,
  Smile,
  Activity,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useApp } from '../../context/AppContext';

export default function QuickLogModal({ isOpen, onClose }) {
  const { todayVitals, updateVitals, addToast } = useApp();

  const [water, setWater] = useState(todayVitals.waterGlasses || 5);
  const [sleepHours, setSleepHours] = useState(todayVitals.sleepHours || 7.3);
  const [movementMinutes, setMovementMinutes] = useState(todayVitals.movementMinutes || 0);
  const [heartRate, setHeartRate] = useState(todayVitals.heartRate || 68);
  const [bloodPressure, setBloodPressure] = useState(todayVitals.bloodPressure || '118/76');
  const [mood, setMood] = useState(todayVitals.mood || 'Focused');
  const [saving, setSaving] = useState(false);

  const moods = [
    { label: 'Energetic', icon: '⚡' },
    { label: 'Focused', icon: '🎯' },
    { label: 'Calm', icon: '🌿' },
    { label: 'Fatigued', icon: '🥱' },
    { label: 'Stressed', icon: '🌪️' },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateVitals({
        waterGlasses: Number(water),
        sleepHours: Number(sleepHours),
        movementMinutes: Number(movementMinutes),
        heartRate: Number(heartRate),
        bloodPressure,
        mood,
        loggedAt: new Date().toISOString(),
      });
      setSaving(false);
      onClose();
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Health & Vitals Log"
      subtitle="Update your daily biomarkers to recalibrate health momentum"
      maxWidth="540px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 1. Water Intake */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={16} color="var(--accent-blue)" /> Hydration (Glasses of Water)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setWater(Math.max(0, water - 1))}
              disabled={water <= 0}
            >
              <Minus size={16} />
            </Button>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, minWidth: '48px', textAlign: 'center' }}>
              {water}
            </span>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setWater(Math.min(20, water + 1))}
            >
              <Plus size={16} />
            </Button>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ({water * 250} ml / {(water * 0.25).toFixed(1)} L)
            </span>
          </div>
        </div>

        {/* 2. Sleep & Movement Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Sleep Duration (Hours)"
            type="number"
            step="0.5"
            min="0"
            max="24"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            icon={Moon}
          />

          <Input
            label="Movement (Minutes)"
            type="number"
            step="5"
            min="0"
            max="300"
            value={movementMinutes}
            onChange={(e) => setMovementMinutes(e.target.value)}
            icon={Flame}
          />
        </div>

        {/* 3. Heart Rate & Blood Pressure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Resting Heart Rate (BPM)"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            icon={Heart}
          />

          <Input
            label="Blood Pressure (mmHg)"
            type="text"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="120/80"
            icon={Activity}
          />
        </div>

        {/* 4. Mood Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Daily Energy & Mood State
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {moods.map((m) => {
              const isSelected = mood === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setMood(m.label)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--trans-fast)',
                  }}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} disabled={saving} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            loadingText="Saving Vitals..."
            icon={Check}
            style={{ flex: 1 }}
          >
            Save Vitals
          </Button>
        </div>
      </div>
    </Modal>
  );
}
