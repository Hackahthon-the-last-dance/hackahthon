// Top Navigation Bar with Search, Quick Log Action, Notifications, Theme Switcher, and User Profile Menu
import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import ImageWithFallback from '../common/ImageWithFallback';
import { IMAGES } from '../../constants/images';

export default function Navbar({ onOpenQuickLog, onOpenNotifications }) {
  const {
    currentRoute,
    setCurrentRoute,
    theme,
    toggleTheme,
    user,
    logout,
    resetEntireApplication,
    habits,
    medications,
    appointments,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across habits, medications, and appointments
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const matchedHabits = habits
      .filter((h) => h.title.toLowerCase().includes(query) || h.category.toLowerCase().includes(query))
      .map((h) => ({ type: 'Habit', title: h.title, route: 'habits', icon: Activity }));

    const matchedMeds = medications
      .filter((m) => m.name.toLowerCase().includes(query) || m.prescribedFor.toLowerCase().includes(query))
      .map((m) => ({ type: 'Medication', title: m.name, route: 'medications', icon: Activity }));

    const matchedApts = appointments
      .filter((a) => a.doctorName.toLowerCase().includes(query) || a.specialty.toLowerCase().includes(query))
      .map((a) => ({ type: 'Appointment', title: `${a.doctorName} (${a.specialty})`, route: 'appointments', icon: Activity }));

    return [...matchedHabits, ...matchedMeds, ...matchedApts].slice(0, 6);
  }, [searchQuery, habits, medications, appointments]);

  const handleSelectSearchResult = (result) => {
    setCurrentRoute(result.route);
    setSearchQuery('');
    setIsSearchOpen(false);
    addToast(`Navigated to ${result.type}: ${result.title}`, 'info');
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Mobile Brand & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '480px' }}>
        <button
          onClick={() => setCurrentRoute('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          className="mobile-brand-link"
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Activity size={20} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            Health<span style={{ color: 'var(--primary)' }}>Flow</span>
          </span>
        </button>

        {/* Search Bar with Autocomplete Dropdown */}
        <div style={{ position: 'relative', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              border: '1px solid var(--border-input)',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search habits, meds, doctors..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
                zIndex: 100,
              }}
              className="animate-slide-up"
            >
              <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                SEARCH RESULTS ({searchResults.length})
              </div>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'left',
                    borderBottom: i === searchResults.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'background var(--trans-fast)',
                  }}
                  className="search-item-hover"
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{res.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{res.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Quick Log, Notifications, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Log Action CTA */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenQuickLog}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <span className="hide-on-mobile">Quick Log</span>
        </Button>

        {/* Notifications Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenNotifications}
          ariaLabel="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={19} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
            }}
          />
        </Button>

        {/* Theme Toggle (Light / Dark) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          ariaLabel={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} />}
        </Button>

        {/* User Profile Avatar Dropdown */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px 4px 4px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-hover)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
            aria-expanded={isProfileMenuOpen}
            aria-label="User account menu"
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
              <ImageWithFallback
                src={user?.avatar || IMAGES.avatars.firdavs}
                fallbackSrc={IMAGES.fallbackAvatar}
                alt={user?.name || 'User Avatar'}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }} className="hide-on-mobile">
              {user?.firstName || 'Firdavs'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '230px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '8px',
                zIndex: 100,
              }}
              className="animate-scale-in"
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {user?.name || 'Firdavs Abdurazzakov'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'firdavs@healthflow.app'}
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentRoute('profile');
                  setIsProfileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                }}
                className="menu-item-hover"
              >
                <User size={16} />
                <span>My Health Profile</span>
              </button>

              <button
                onClick={() => {
                  setCurrentRoute('settings');
                  setIsProfileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                }}
                className="menu-item-hover"
              >
                <Settings size={16} />
                <span>Preferences & Settings</span>
              </button>

              <button
                onClick={() => {
                  resetEntireApplication();
                  setIsProfileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--accent-amber)',
                  textAlign: 'left',
                }}
                className="menu-item-hover"
              >
                <RefreshCw size={16} />
                <span>Reset Demo State</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '6px 0' }} />

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--accent-rose)',
                  textAlign: 'left',
                }}
                className="menu-item-hover"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
