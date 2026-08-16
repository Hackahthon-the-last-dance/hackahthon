// Create and Edit Habit Modal with Minimum Win Configuration
import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Flame,
  Moon,
  HeartHandshake,
  SunDim,
  Activity,
  Sparkles,
  Check,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useApp } from '../../context/AppContext';

export default function HabitModal({ isOpen, onClose, initialHabit = null }) {
  const { addHabit, editHabit } = useApp();

  const isEditing = Boolean(initialHabit);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('movement');
  const [target, setTarget] = useState('30');
  const [unit, setUnit] = useState('minutes');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('Morning');
  
  // Minimum Win
  const [minWinTitle, setMinWinTitle] = useState('5-Minute Micro Start');
  const [minWinTime, setMinWinTime] = useState('5 min');
  const [minWinDesc, setMinWinDesc] = useState('Complete a gentle 5-minute introductory session.');
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialHabit) {
      setTitle(initialHabit.title || '');
      setCategory(initialHabit.category || 'movement');
      setTarget(String(initialHabit.target || 1));
      setUnit(initialHabit.unit || 'times');
      setFrequency(initialHabit.frequency || 'daily');
      setTimeOfDay(initialHabit.timeOfDay || 'Morning');
      if (initialHabit.minimumWin) {
        setMinWinTitle(initialHabit.minimumWin.title || '');
        setMinWinTime(initialHabit.minimumWin.timeRequired || '5 min');
        setMinWinDesc(initialHabit.minimumWin.description || '');
      }
    } else {
      setTitle('');
      setCategory('movement');
      setTarget('30');
      setUnit('minutes');
      setFrequency('daily');
      setTimeOfDay('Morning');
      setMinWinTitle('5-Minute Micro Start');
      setMinWinTime('5 min');
      setMinWinDesc('Complete a gentle 5-minute introductory session.');
    }
    setErrors({});
  }, [initialHabit, isOpen]);

  const categories = [
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: '#0284c7' },
    { id: 'movement', label: 'Movement', icon: Flame, color: '#ea580c' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: '#6366f1' },
    { id: 'mindfulness', label: 'Mindfulness', icon: HeartHandshake, color: '#0d9488' },
    { id: 'recovery', label: 'Recovery', icon: SunDim, color: '#8b5cf6' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Habit title is required.';
    if (!target || Number(target) <= 0) newErrors.target = 'Valid target number required.';
    if (!minWinTitle.trim()) newErrors.minWinTitle = 'Minimum win title is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const selectedCat = categories.find((c) => c.id === category);
      const habitPayload = {
        title: title.trim(),
        category,
        color: selectedCat?.color || '#0d9488',
        target: Number(target),
        unit: unit.trim() || 'times',
        frequency,
        timeOfDay,
        minimumWin: {
          title: minWinTitle.trim(),
          timeRequired: minWinTime.trim() || '5 min',
          description: minWinDesc.trim(),
          value: Math.max(1, Math.round(Number(target) * 0.2)),
        },
      };

      if (isEditing && initialHabit) {
        editHabit(initialHabit.id, habitPayload);
      } else {
        addHabit(habitPayload);
      }

      setSaving(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Health Habit' : 'Create New Health Habit'}
      subtitle="Define your daily target and set an achievable Minimum Win to protect your streak."
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title */}
        <Input
          label="Habit Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Morning Mobility & Cardio"
          error={errors.title}
          required
        />

        {/* Category Pill Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Category
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? `1.5px solid ${cat.color}` : '1px solid var(--border-card)',
                    backgroundColor: isSelected ? `${cat.color}15` : 'var(--bg-input)',
                    color: isSelected ? cat.color : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all var(--trans-fast)',
                  }}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Value & Unit */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Daily Target Goal"
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="30"
            error={errors.target}
            required
          />

          <Input
            label="Measurement Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g., minutes, glasses, reps"
            required
          />
        </div>

        {/* Time of Day & Frequency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Time of Day
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-input)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Throughout Day">Throughout Day</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-input)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="weekends">Weekends Only</option>
            </select>
          </div>
        </div>

        {/* Minimum Win Section (Crucial requirement) */}
        <div
          style={{
            backgroundColor: 'var(--accent-amber-light)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recovery Protocol / Minimum Win
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
            When life gets busy, what is the smallest non-negotiable step to save this streak?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <Input
              label="Minimum Win Action"
              value={minWinTitle}
              onChange={(e) => setMinWinTitle(e.target.value)}
              placeholder="e.g., 5-min stretch"
              error={errors.minWinTitle}
            />

            <Input
              label="Time Needed"
              value={minWinTime}
              onChange={(e) => setMinWinTime(e.target.value)}
              placeholder="e.g., 5 min"
            />
          </div>

          <Input
            label="Brief Guidance / Description"
            value={minWinDesc}
            onChange={(e) => setMinWinDesc(e.target.value)}
            placeholder="e.g., Perform gentle dynamic spine stretches."
          />
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button variant="secondary" onClick={onClose} disabled={saving} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            loadingText={isEditing ? 'Updating...' : 'Creating...'}
            icon={Check}
            style={{ flex: 1 }}
          >
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
