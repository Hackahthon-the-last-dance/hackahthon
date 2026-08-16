// Interactive Habit Card with Completion Animation, Streak, Minimum Win Action, and Edit/Delete Menu
import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Flame,
  MoreVertical,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Droplets,
  Moon,
  HeartHandshake,
  SunDim,
  Activity,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ConfirmModal from '../common/ConfirmModal';
import { useApp } from '../../context/AppContext';

export default function HabitCard({ habit, onEdit }) {
  const { toggleHabitCompletion, completeMinimumWin, deleteHabit, pauseHabit } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteHabit(habit.id);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }, 300);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'hydration': return Droplets;
      case 'movement': return Flame;
      case 'sleep': return Moon;
      case 'mindfulness': return HeartHandshake;
      case 'recovery': return SunDim;
      default: return Activity;
    }
  };

  const Icon = getCategoryIcon(habit.category);

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: habit.completed
            ? '1.5px solid var(--accent-emerald)'
            : habit.isPaused
            ? '1px dashed var(--border-card)'
            : '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: habit.completed ? '0 4px 12px rgba(16, 185, 129, 0.12)' : 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          transition: 'all var(--trans-base)',
          opacity: habit.isPaused ? 0.6 : 1,
        }}
        className="card-hoverable animate-slide-up"
      >
        {/* Card Header: Icon, Title, Category Badge, Menu */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: habit.color ? `${habit.color}18` : 'var(--primary-light)',
                color: habit.color || 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {habit.category}
                </span>
                {habit.isPaused && <Badge variant="warning" size="sm">Paused</Badge>}
              </div>

              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {habit.title}
              </h4>
            </div>
          </div>

          {/* Action Menu Trigger */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
              }}
              aria-label="Habit options"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '160px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  zIndex: 20,
                }}
                className="animate-scale-in"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(habit);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  className="menu-item-hover"
                >
                  <Edit2 size={14} />
                  <span>Edit Habit</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    pauseHabit(habit.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  className="menu-item-hover"
                >
                  {habit.isPaused ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                  <span>{habit.isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDeleteModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--accent-rose)',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  className="menu-item-hover"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress & Target Detail */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {habit.streak} Day Streak
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              (Best: {habit.bestStreak || habit.streak}d)
            </span>
          </div>

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Target: <strong>{habit.target} {habit.unit}</strong>
          </span>
        </div>

        {/* Minimum Win CTA Box */}
        {habit.minimumWin && !habit.completed && !habit.isPaused && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', display: 'block' }}>
                MINIMUM WIN
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {habit.minimumWin.title} ({habit.minimumWin.timeRequired})
              </span>
            </div>

            <Button
              variant="subtle"
              size="sm"
              icon={Sparkles}
              onClick={() => completeMinimumWin(habit.id)}
            >
              Claim Win
            </Button>
          </div>
        )}

        {/* Completion Toggle Button */}
        <button
          onClick={() => toggleHabitCompletion(habit.id)}
          disabled={habit.isPaused}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: habit.completed ? 'var(--accent-emerald-light)' : 'var(--bg-input)',
            border: habit.completed ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
            color: habit.completed ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: habit.isPaused ? 'not-allowed' : 'pointer',
            transition: 'all var(--trans-fast)',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: habit.completed ? 'var(--accent-emerald)' : 'transparent',
              border: habit.completed ? 'none' : '2px solid var(--border-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            {habit.completed && <Check size={14} strokeWidth={3} />}
          </div>
          <span>{habit.completed ? 'Completed Today ✓' : 'Mark Complete'}</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={isDeleting}
          title={`Delete "${habit.title}"?`}
          message="Are you sure you want to remove this habit? Your streak history will be cleared."
          confirmText="Delete Habit"
        />
      )}
    </>
  );
}
