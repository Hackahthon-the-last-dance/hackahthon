// Dashboard Command Center: Greeting, Health Momentum, Recovery Banner, Today Focus, AI Insights, and Week Strip
import React, { useState } from 'react';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import MomentumCard from '../components/dashboard/MomentumCard';
import RecoveryBanner from '../components/dashboard/RecoveryBanner';
import TodayFocusCard from '../components/dashboard/TodayFocusCard';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import WeekStrip from '../components/dashboard/WeekStrip';
import QuickLogModal from '../components/dashboard/QuickLogModal';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import Button from '../components/common/Button';
import { Plus, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { habits, setCurrentRoute } = useApp();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const activeHabits = habits.filter((h) => !h.isPaused).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Dynamic Greeting Header */}
      <GreetingHeader onOpenQuickLog={() => setIsQuickLogOpen(true)} />

      {/* 2. Recovery Banner (appears when habit missed/at risk) */}
      <RecoveryBanner />

      {/* 3. Top Grid: Health Momentum + Today's Focus */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <MomentumCard />
        <TodayFocusCard onOpenQuickLog={() => setIsQuickLogOpen(true)} />
      </div>

      {/* 4. AI Insight Contextual Recommendation */}
      <AIInsightCard />

      {/* 5. 7-Day Visual Story & Day-by-Day Strip */}
      <WeekStrip />

      {/* 6. Active Habits Quick List & Management */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Daily Habit Stream
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your active micro-routines for sustained health momentum
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingHabit(null);
                setIsHabitModalOpen(true);
              }}
            >
              Add Habit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setCurrentRoute('habits')}
            >
              View All ({habits.length})
            </Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {activeHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={(h) => {
                setEditingHabit(h);
                setIsHabitModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Log Modal */}
      {isQuickLogOpen && (
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
        />
      )}

      {/* Habit Create/Edit Modal */}
      {isHabitModalOpen && (
        <HabitModal
          isOpen={isHabitModalOpen}
          initialHabit={editingHabit}
          onClose={() => {
            setIsHabitModalOpen(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}
