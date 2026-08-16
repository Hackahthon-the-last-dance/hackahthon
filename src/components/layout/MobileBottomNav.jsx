// Mobile Bottom Navigation Bar with Quick Emergency Access
import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileBottomNav() {
  const { currentRoute, setCurrentRoute, habits, appointments } = useApp();

  const pendingHabits = habits.filter((h) => !h.completed && !h.isPaused).length;
  const upcomingApts = appointments.filter((a) => a.status === 'Upcoming').length;

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckSquare, badge: pendingHabits > 0 ? pendingHabits : null },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'appointments', label: 'Care', icon: Calendar, badge: upcomingApts > 0 ? upcomingApts : null },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-height)',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
      }}
      className="mobile-bottom-nav"
    >
      {items.map((item) => {
        const isActive = currentRoute === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentRoute(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        );
      })}

      {/* Quick Emergency Floating Trigger Button */}
      <button
        onClick={() => setCurrentRoute('emergency')}
        style={{
          position: 'absolute',
          top: '-24px',
          right: '16px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-rose)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
          border: '3px solid var(--bg-surface)',
          cursor: 'pointer',
        }}
        title="Emergency SOS"
        aria-label="Emergency SOS"
      >
        <ShieldAlert size={22} />
      </button>
    </div>
  );
}
