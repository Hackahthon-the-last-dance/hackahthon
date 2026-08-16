// Habits Management Page with Filtering, Creation, Streaks, and Minimum Win Recoveries
import React, { useState } from 'react';
import { Plus, Sparkles, Filter, CheckCircle2, Flame, Droplets, Moon, HeartHandshake, SunDim } from 'lucide-react';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { IMAGES } from '../constants/images';
import { useApp } from '../context/AppContext';

export default function HabitsPage() {
  const { habits } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const categories = [
    { id: 'all', label: 'All Habits' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'movement', label: 'Movement' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'recovery', label: 'Recovery' },
  ];

  const filteredHabits = habits.filter((h) =>
    activeCategory === 'all' ? true : h.category === activeCategory
  );

  const completedToday = habits.filter((h) => h.completed).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Summary Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Health Habits & Streaks
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Build steady adherence with daily targets and resilient Minimum Wins.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
        >
          Create New Habit
        </Button>
      </div>

      {/* Habits Stat Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMPLETED TODAY</span>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0 0' }}>
            {completedToday} / {habits.length} Done
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOP STREAK</span>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={22} /> {longestStreak} Days
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECOVERY PROTOCOL</span>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 0' }}>
            Protected (100%)
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: activeCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-card)',
              backgroundColor: activeCategory === cat.id ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: activeCategory === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--trans-fast)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Habits Grid or Empty State */}
      {filteredHabits.length === 0 ? (
        <EmptyState
          illustration={IMAGES.emptyStates.habits}
          title="Your health journey starts here."
          description="Choose one small habit and let's build from there. Minimum wins keep you resilient."
          actionText="Create First Habit"
          onAction={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
          actionIcon={Plus}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={(h) => {
                setEditingHabit(h);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Habit Create / Edit Modal */}
      {isModalOpen && (
        <HabitModal
          isOpen={isModalOpen}
          initialHabit={editingHabit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}
