// Notification Drawer for Alerts, Habit Reminders, Refills, and AI Insights
import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Calendar,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function NotificationDrawer({ isOpen, onClose }) {
  const { setCurrentRoute, medications, habits, appointments, addToast } = useApp();

  // Compute dynamic notifications
  const pendingMeds = medications.filter((m) => m.status === 'pending');
  const lowStockMeds = medications.filter((m) => m.remainingPills <= m.refillThreshold);
  const upcomingApt = appointments.find((a) => a.status === 'Upcoming');

  const notifications = [
    ...(upcomingApt
      ? [
          {
            id: 'notif-apt',
            title: `Upcoming Consultation: ${upcomingApt.doctorName}`,
            description: `${upcomingApt.date} at ${upcomingApt.time} (${upcomingApt.type})`,
            icon: Calendar,
            iconColor: 'var(--primary)',
            category: 'appointment',
            route: 'appointments',
            actionText: 'View Details',
          },
        ]
      : []),
    ...lowStockMeds.map((m) => ({
      id: `notif-stock-${m.id}`,
      title: `Refill Alert: ${m.name}`,
      description: `Only ${m.remainingPills} pills remaining (Threshold: ${m.refillThreshold}).`,
      icon: Pill,
      iconColor: 'var(--accent-amber)',
      category: 'medication',
      route: 'medications',
      actionText: 'Refill Now',
    })),
    ...pendingMeds.map((m) => ({
      id: `notif-med-${m.id}`,
      title: `Scheduled Dose: ${m.name} (${m.dosage})`,
      description: `Scheduled for ${m.scheduledTime}. ${m.instructions}`,
      icon: Pill,
      iconColor: 'var(--accent-blue)',
      category: 'medication',
      route: 'medications',
      actionText: 'Mark Taken',
    })),
    {
      id: 'notif-streak',
      title: 'Habit Momentum Protection Active',
      description: 'You have a 14-day hydration streak! Claim minimum wins to keep it safe.',
      icon: Sparkles,
      iconColor: 'var(--accent-emerald)',
      category: 'habit',
      route: 'habits',
      actionText: 'Check Habits',
    },
  ];

  const handleAction = (notif) => {
    onClose();
    setCurrentRoute(notif.route);
    addToast(`Navigating to ${notif.title}`, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications & Health Alerts"
      subtitle="Stay informed on scheduled medications, clinic visits, and habit alerts."
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={40} color="var(--accent-emerald)" style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>You are all caught up!</p>
            <p style={{ fontSize: '0.875rem' }}>No pending alerts or low-stock medication warnings.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '16px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background var(--trans-fast)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: notif.iconColor,
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Icon size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', margin: 0 }}>
                    {notif.title}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 8px' }}>
                    {notif.description}
                  </p>
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => handleAction(notif)}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {notif.actionText}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
