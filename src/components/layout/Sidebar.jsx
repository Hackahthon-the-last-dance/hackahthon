// Desktop & Tablet Collapsible Sidebar Navigation
import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Activity,
  Pill,
  Calendar,
  Sparkles,
  ShieldAlert,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageWithFallback from '../common/ImageWithFallback';
import { IMAGES } from '../../constants/images';

export default function Sidebar() {
  const { currentRoute, setCurrentRoute, habits, medications, appointments, user } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Compute live pending badges
  const pendingHabitsCount = habits.filter((h) => !h.completed && !h.isPaused).length;
  const pendingMedsCount = medications.filter((m) => m.status === 'pending').length;
  const upcomingAptsCount = appointments.filter((a) => a.status === 'Upcoming').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'My Habits', icon: CheckSquare, badge: pendingHabitsCount > 0 ? pendingHabitsCount : null },
    { id: 'health', label: 'Health Vitals', icon: Activity },
    { id: 'medications', label: 'Medications', icon: Pill, badge: pendingMedsCount > 0 ? pendingMedsCount : null, badgeVariant: 'warning' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: upcomingAptsCount > 0 ? upcomingAptsCount : null },
    { id: 'insights', label: 'Insights & Story', icon: Sparkles },
    { id: 'emergency', label: 'Emergency & Care', icon: ShieldAlert, isSpecial: true },
  ];

  const secondaryNavItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarWidth = isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width var(--trans-smooth), min-width var(--trans-smooth)',
        zIndex: 60,
        overflowX: 'hidden',
      }}
      className="desktop-sidebar"
    >
      {/* Top Header & Brand */}
      <div>
        <div
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0 12px' : '0 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setCurrentRoute('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                minWidth: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Activity size={22} />
            </div>

            {!isCollapsed && (
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Health<span style={{ color: 'var(--primary)' }}>Flow</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-2px' }}>
                  PREVENTIVE CARE OS
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Main Navigation List */}
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {!isCollapsed && (
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                padding: '0 8px 6px',
                textTransform: 'uppercase',
              }}
            >
              Navigation
            </span>
          )}

          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentRoute(item.id)}
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: isCollapsed ? '12px 0' : '10px 14px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive
                    ? item.isSpecial
                      ? 'var(--accent-rose-light)'
                      : 'var(--primary-light)'
                    : 'transparent',
                  color: isActive
                    ? item.isSpecial
                      ? 'var(--accent-rose)'
                      : 'var(--primary)'
                    : item.isSpecial
                    ? 'var(--accent-rose)'
                    : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all var(--trans-fast)',
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} color={item.isSpecial ? 'var(--accent-rose)' : undefined} />

                {!isCollapsed && (
                  <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge !== null && item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: item.badgeVariant === 'warning' ? 'var(--accent-amber-light)' : 'var(--primary-light)',
                      color: item.badgeVariant === 'warning' ? 'var(--accent-amber)' : 'var(--primary)',
                      border: '1px solid currentColor',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile, Settings & Collapse Toggle */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {secondaryNavItems.map((item) => {
          const isActive = currentRoute === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentRoute(item.id)}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: isCollapsed ? '12px 0' : '10px 14px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--trans-fast)',
              }}
              className="sidebar-nav-item"
            >
              <Icon size={20} />
              {!isCollapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
            </button>
          );
        })}

        {/* User Mini Card */}
        {!isCollapsed && (
          <div
            onClick={() => setCurrentRoute('profile')}
            style={{
              marginTop: '8px',
              padding: '10px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <ImageWithFallback
                src={user?.avatar || IMAGES.avatars.firdavs}
                fallbackSrc={IMAGES.fallbackAvatar}
                alt={user?.name || 'User'}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Firdavs'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Blood Group {user?.bloodType || 'O+'}</p>
            </div>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
