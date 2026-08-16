// Settings Page: Dark Mode, Notification Controls, Privacy, and Data Management
import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Volume2,
  Download,
  RefreshCw,
  LogOut,
  Check,
  Shield,
} from 'lucide-react';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';

export default function SettingsPage() {
  const { theme, toggleTheme, logout, resetEntireApplication, addToast } = useApp();

  const [medNotifs, setMedNotifs] = useState(true);
  const [habitNotifs, setHabitNotifs] = useState(true);
  const [weeklyReportNotifs, setWeeklyReportNotifs] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [analyticsShare, setAnalyticsShare] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExportJSON = () => {
    const data = StorageService.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HealthFlow_Complete_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Complete application backup exported.', 'success');
  };

  const handleConfirmReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      resetEntireApplication();
      setIsResetting(false);
      setShowResetModal(false);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
          Preferences & System Settings
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure appearance, alert frequencies, privacy settings, and device backups.
        </p>
      </div>

      {/* 1. Appearance & Theme */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Dark Mode Appearance
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Currently active: <strong>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</strong>
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={theme === 'dark' ? Sun : Moon}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        </Button>
      </div>

      {/* 2. Notifications & Alerts */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={20} color="var(--primary)" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Notification & Reminder Preferences
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Medication & Prescription Reminders
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Alert at scheduled pill times with low stock warnings
              </span>
            </div>
            <input
              type="checkbox"
              checked={medNotifs}
              onChange={(e) => {
                setMedNotifs(e.target.checked);
                addToast('Medication notification settings updated.', 'info');
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Daily Habit Momentum Check-ins
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Afternoon nudge if hydration or movement is below target
              </span>
            </div>
            <input
              type="checkbox"
              checked={habitNotifs}
              onChange={(e) => {
                setHabitNotifs(e.target.checked);
                addToast('Habit check-in settings updated.', 'info');
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Auditory Feedback & Celebration Sounds
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Subtle haptic and audio chime on habit completion
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => {
                setSoundEnabled(e.target.checked);
                addToast('Sound feedback setting updated.', 'info');
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </label>
        </div>
      </div>

      {/* 3. Privacy, Data Export & Maintenance */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={20} color="var(--primary)" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Privacy, Backups & Account Actions
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleExportJSON}
          >
            Export Complete Backup (.JSON)
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={RefreshCw}
            onClick={() => setShowResetModal(true)}
          >
            Reset Demo Data to Default
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={LogOut}
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <ConfirmModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleConfirmReset}
          loading={isResetting}
          title="Reset HealthFlow to Factory Demo State?"
          message="All habit logs, custom entries, and modified appointments will be restored to the initial showcase dataset."
          confirmText="Yes, Reset Data"
        />
      )}
    </div>
  );
}
