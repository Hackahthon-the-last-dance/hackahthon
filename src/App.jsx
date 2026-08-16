// HealthFlow Main Application Routing and Frame Assembly
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import NotificationDrawer from './components/layout/NotificationDrawer';
import ToastContainer from './components/common/Toast';
import QuickLogModal from './components/dashboard/QuickLogModal';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import HealthPage from './pages/HealthPage';
import MedicationsPage from './pages/MedicationsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmergencyPage from './pages/EmergencyPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function MainLayout() {
  const { currentRoute, authSession } = useApp();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  // If on public Landing, Auth, or Onboarding screen, show standalone full-width page
  if (currentRoute === 'landing' || !authSession?.isAuthenticated) {
    if (currentRoute === 'auth') return <AuthPage />;
    return <LandingPage />;
  }

  if (currentRoute === 'onboarding') {
    return <OnboardingPage />;
  }

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'habits':
        return <HabitsPage />;
      case 'health':
        return <HealthPage />;
      case 'medications':
        return <MedicationsPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'emergency':
        return <EmergencyPage />;
      case 'insights':
        return <InsightsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Navbar */}
        <Navbar
          onOpenQuickLog={() => setIsQuickLogOpen(true)}
          onOpenNotifications={() => setIsNotifsOpen(true)}
        />

        {/* Page Container */}
        <main className="page-container animate-fade-in">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Global Quick Vitals Log Modal */}
      {isQuickLogOpen && (
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
        />
      )}

      {/* Global Notification Drawer */}
      {isNotifsOpen && (
        <NotificationDrawer
          isOpen={isNotifsOpen}
          onClose={() => setIsNotifsOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
