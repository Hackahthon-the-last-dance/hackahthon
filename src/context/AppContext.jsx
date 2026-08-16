// HealthFlow Central Application Context
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  StorageService,
  calculateDeterministicMomentum,
  INITIAL_TODAY_VITALS,
} from '../services/storage';
import {
  INITIAL_USER,
  INITIAL_HABITS,
  INITIAL_WEEK_STORY,
  INITIAL_MEDICATIONS,
  INITIAL_CLINICS,
  INITIAL_APPOINTMENTS,
  INITIAL_AI_INSIGHTS,
} from '../services/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation / Route state
  const [currentRoute, setCurrentRoute] = useState(() => {
    const auth = StorageService.getAuthSession();
    if (!auth || !auth.isAuthenticated) return 'landing';
    const onboardingDone = StorageService.isOnboardingCompleted();
    if (!onboardingDone) return 'onboarding';
    return 'dashboard';
  });

  // Global Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000, action = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration, action }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Theme Management
  const [theme, setThemeState] = useState(() => StorageService.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    StorageService.setTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Auth & Session
  const [authSession, setAuthSessionState] = useState(() => StorageService.getAuthSession());
  const [user, setUserState] = useState(() => StorageService.getUser());
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(() => StorageService.isOnboardingCompleted());

  const login = useCallback((credentials) => {
    const session = { isAuthenticated: true, token: 'jwt_' + Date.now(), email: credentials.email };
    StorageService.setAuthSession(session);
    setAuthSessionState(session);
    
    // Update user info if different
    if (credentials.name) {
      const updatedUser = { ...user, name: credentials.name, email: credentials.email };
      setUserState(updatedUser);
      StorageService.setUser(updatedUser);
    }

    addToast(`Welcome back, ${user.firstName || 'Firdavs'}!`, 'success');
    setCurrentRoute('dashboard');
  }, [user, addToast]);

  const register = useCallback((formData) => {
    const session = { isAuthenticated: true, token: 'jwt_' + Date.now(), email: formData.email };
    const newUser = {
      ...INITIAL_USER,
      name: formData.name || 'New Member',
      firstName: (formData.name || 'Member').split(' ')[0],
      email: formData.email,
    };
    StorageService.setAuthSession(session);
    StorageService.setUser(newUser);
    setAuthSessionState(session);
    setUserState(newUser);
    setIsOnboardingCompleted(false);
    StorageService.setOnboardingCompleted(false);
    
    addToast('Account created successfully! Let\'s tailor your health flow.', 'success');
    setCurrentRoute('onboarding');
  }, [addToast]);

  const completeOnboarding = useCallback((selectedGoals = []) => {
    setIsOnboardingCompleted(true);
    StorageService.setOnboardingCompleted(true);
    addToast('🎉 Your personalized HealthFlow dashboard is ready!', 'success');
    setCurrentRoute('dashboard');
  }, [addToast]);

  const logout = useCallback(() => {
    StorageService.clearSession();
    setAuthSessionState({ isAuthenticated: false });
    addToast('You have been logged out safely.', 'info');
    setCurrentRoute('landing');
  }, [addToast]);

  const updateProfile = useCallback((updatedFields) => {
    setUserState((prev) => {
      const merged = { ...prev, ...updatedFields };
      StorageService.setUser(merged);
      return merged;
    });
    addToast('Profile updated successfully.', 'success');
  }, [addToast]);

  // Core Data States
  const [habits, setHabitsState] = useState(() => StorageService.getHabits());
  const [weekStory, setWeekStoryState] = useState(() => StorageService.getWeekStory());
  const [todayVitals, setTodayVitalsState] = useState(() => StorageService.getTodayVitals());
  const [medications, setMedicationsState] = useState(() => StorageService.getMedications());
  const [clinics, setClinicsState] = useState(() => StorageService.getClinics());
  const [appointments, setAppointmentsState] = useState(() => StorageService.getAppointments());
  const [aiInsights, setAiInsightsState] = useState(() => StorageService.getInsights());

  // Selected Day in Week Strip (for detailed day inspection)
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = INITIAL_WEEK_STORY[INITIAL_WEEK_STORY.length - 1];
    return today;
  });

  // Deterministic Momentum Score (Reacts to habits, vitals, week trends, recovery)
  const momentumScore = useMemo(() => {
    return calculateDeterministicMomentum({
      habits,
      weekStory,
      todayVitals,
    });
  }, [habits, weekStory, todayVitals]);

  // Fire celebratory micro-confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0d9488', '#14b8a6', '#3b82f6', '#10b981', '#fbbf24'],
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  // Habit Actions
  const toggleHabitCompletion = useCallback((habitId) => {
    setHabitsState((prev) => {
      const updated = prev.map((h) => {
        if (h.id === habitId) {
          const nextCompleted = !h.completed;
          if (nextCompleted) {
            triggerCelebration();
          }
          return {
            ...h,
            completed: nextCompleted,
            currentValue: nextCompleted ? h.target : 0,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      });
      StorageService.setHabits(updated);
      return updated;
    });

    const targetHabit = habits.find((h) => h.id === habitId);
    if (targetHabit && !targetHabit.completed) {
      addToast(`Completed: ${targetHabit.title} (+Momentum)`, 'success');
    } else {
      addToast('Habit marked as incomplete.', 'info');
    }
  }, [habits, triggerCelebration, addToast]);

  const completeMinimumWin = useCallback((habitId) => {
    setHabitsState((prev) => {
      const updated = prev.map((h) => {
        if (h.id === habitId) {
          triggerCelebration();
          return {
            ...h,
            completed: true,
            recoveryClaimedToday: true,
            currentValue: h.minimumWin ? h.minimumWin.value : h.target,
            streak: h.streak + 1,
          };
        }
        return h;
      });
      StorageService.setHabits(updated);
      return updated;
    });

    const habit = habits.find((h) => h.id === habitId);
    const winTitle = habit?.minimumWin?.title || 'Minimum Win';
    addToast(`🎉 Minimum Win "${winTitle}" achieved! Momentum preserved.`, 'success');
  }, [habits, triggerCelebration, addToast]);

  const addHabit = useCallback((newHabitData) => {
    const id = 'habit-' + Date.now();
    const habit = {
      id,
      title: newHabitData.title,
      category: newHabitData.category || 'wellness',
      icon: newHabitData.icon || 'Flame',
      color: newHabitData.color || '#0d9488',
      target: Number(newHabitData.target) || 1,
      unit: newHabitData.unit || 'times',
      currentValue: 0,
      completed: false,
      minimumWin: newHabitData.minimumWin || {
        title: 'Micro Start (2 min)',
        description: 'Complete a 2-minute introductory session.',
        value: 1,
        timeRequired: '2 min',
      },
      streak: 0,
      bestStreak: 0,
      frequency: newHabitData.frequency || 'daily',
      timeOfDay: newHabitData.timeOfDay || 'Anytime',
      isPaused: false,
      history: {},
    };

    setHabitsState((prev) => {
      const updated = [...prev, habit];
      StorageService.setHabits(updated);
      return updated;
    });
    addToast(`Habit "${habit.title}" created successfully!`, 'success');
  }, [addToast]);

  const editHabit = useCallback((id, updatedFields) => {
    setHabitsState((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, ...updatedFields } : h));
      StorageService.setHabits(updated);
      return updated;
    });
    addToast('Habit updated.', 'success');
  }, [addToast]);

  const deleteHabit = useCallback((id) => {
    setHabitsState((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      StorageService.setHabits(updated);
      return updated;
    });
    addToast('Habit deleted.', 'info');
  }, [addToast]);

  const pauseHabit = useCallback((id) => {
    setHabitsState((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, isPaused: !h.isPaused } : h));
      StorageService.setHabits(updated);
      return updated;
    });
    const habit = habits.find((h) => h.id === id);
    addToast(habit?.isPaused ? 'Habit resumed.' : 'Habit paused.', 'info');
  }, [habits, addToast]);

  // Vitals Actions
  const addWaterGlass = useCallback(() => {
    setTodayVitalsState((prev) => {
      const nextGlasses = Math.min(16, (prev.waterGlasses || 0) + 1);
      const updated = { ...prev, waterGlasses: nextGlasses };
      StorageService.setTodayVitals(updated);
      return updated;
    });

    // Also update water habit if present
    setHabitsState((prev) => {
      const updated = prev.map((h) => {
        if (h.category === 'hydration') {
          const nextVal = Math.min(h.target, h.currentValue + 1);
          return {
            ...h,
            currentValue: nextVal,
            completed: nextVal >= h.target,
          };
        }
        return h;
      });
      StorageService.setHabits(updated);
      return updated;
    });

    addToast('💧 Hydration logged (+1 glass)', 'success');
  }, [addToast]);

  const quickLogMovement = useCallback((minutes = 5) => {
    setTodayVitalsState((prev) => {
      const nextMinutes = (prev.movementMinutes || 0) + minutes;
      const updated = { ...prev, movementMinutes: nextMinutes };
      StorageService.setTodayVitals(updated);
      return updated;
    });

    // Mark movement habit minimum win or completion
    setHabitsState((prev) => {
      const updated = prev.map((h) => {
        if (h.category === 'movement') {
          return {
            ...h,
            currentValue: Math.min(h.target, h.currentValue + minutes),
            completed: h.currentValue + minutes >= h.target,
            recoveryClaimedToday: true,
          };
        }
        return h;
      });
      StorageService.setHabits(updated);
      return updated;
    });

    triggerCelebration();
    addToast(`🏃 Logged ${minutes} min of movement!`, 'success');
  }, [triggerCelebration, addToast]);

  const updateVitals = useCallback((vitalsData) => {
    setTodayVitalsState((prev) => {
      const updated = { ...prev, ...vitalsData };
      StorageService.setTodayVitals(updated);
      return updated;
    });
    addToast('Daily vitals saved.', 'success');
  }, [addToast]);

  // Medication Actions
  const addMedication = useCallback((newMedData) => {
    const id = 'med-' + Date.now();
    const med = {
      id,
      name: newMedData.name,
      dosage: newMedData.dosage,
      form: newMedData.form || 'Tablet',
      frequency: newMedData.frequency || 'Daily',
      scheduledTime: newMedData.scheduledTime || '09:00 AM',
      status: 'pending',
      takenAt: null,
      prescribedFor: newMedData.prescribedFor || 'Health optimization',
      remainingPills: Number(newMedData.remainingPills) || 30,
      totalPills: Number(newMedData.totalPills) || 30,
      refillThreshold: Number(newMedData.refillThreshold) || 7,
      instructions: newMedData.instructions || 'Take with water.',
    };

    setMedicationsState((prev) => {
      const updated = [...prev, med];
      StorageService.setMedications(updated);
      return updated;
    });
    addToast(`Medication "${med.name}" added.`, 'success');
  }, [addToast]);

  const editMedication = useCallback((id, updatedFields) => {
    setMedicationsState((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
      StorageService.setMedications(updated);
      return updated;
    });
    addToast('Medication updated.', 'success');
  }, [addToast]);

  const deleteMedication = useCallback((id) => {
    setMedicationsState((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      StorageService.setMedications(updated);
      return updated;
    });
    addToast('Medication removed from schedule.', 'info');
  }, [addToast]);

  const markMedicationStatus = useCallback((id, status) => {
    setMedicationsState((prev) => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = prev.map((m) => {
        if (m.id === id) {
          const isTaken = status === 'taken';
          const newRemaining = isTaken ? Math.max(0, m.remainingPills - 1) : m.remainingPills;
          return {
            ...m,
            status,
            takenAt: isTaken ? nowTime : null,
            remainingPills: newRemaining,
          };
        }
        return h;
      });
      StorageService.setMedications(updated);
      return updated;
    });

    if (status === 'taken') {
      addToast('Medication marked as taken.', 'success');
    } else if (status === 'skipped') {
      addToast('Medication marked as skipped.', 'info');
    } else {
      addToast('Reminder snoozed for 30 minutes.', 'info');
    }
  }, [addToast]);

  const refillMedication = useCallback((id, addedPills = 30) => {
    setMedicationsState((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, remainingPills: m.remainingPills + Number(addedPills) } : m
      );
      StorageService.setMedications(updated);
      return updated;
    });
    addToast(`Refilled pills (+${addedPills}). Inventory updated!`, 'success');
  }, [addToast]);

  // Appointments Actions
  const addAppointment = useCallback((newAptData) => {
    const id = 'apt-' + Date.now();
    const apt = {
      id,
      doctorName: newAptData.doctorName,
      doctorAvatar: newAptData.doctorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      specialty: newAptData.specialty || 'General Care',
      clinicName: newAptData.clinicName || 'City Central Medical Center',
      clinicAddress: newAptData.clinicAddress || '450 Sutter Health Way',
      clinicId: newAptData.clinicId || 'clinic-1',
      date: newAptData.date,
      time: newAptData.time || '10:00 AM',
      type: newAptData.type || 'In-Person',
      status: 'Upcoming',
      purpose: newAptData.purpose || 'Health Consultation',
      notes: newAptData.notes || 'Routine appointment.',
      phone: newAptData.phone || '+1 (555) 911-3000',
    };

    setAppointmentsState((prev) => {
      const updated = [apt, ...prev];
      StorageService.setAppointments(updated);
      return updated;
    });
    addToast(`Appointment booked with ${apt.doctorName}!`, 'success');
  }, [addToast]);

  const editAppointment = useCallback((id, updatedFields) => {
    setAppointmentsState((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
      StorageService.setAppointments(updated);
      return updated;
    });
    addToast('Appointment updated.', 'success');
  }, [addToast]);

  const deleteAppointment = useCallback((id) => {
    setAppointmentsState((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      StorageService.setAppointments(updated);
      return updated;
    });
    addToast('Appointment cancelled.', 'info');
  }, [addToast]);

  // Geolocation & Emergency Maps
  const [userLocation, setUserLocation] = useState({
    lat: 37.7880,
    lng: -122.4075,
    address: 'Downtown San Francisco, CA',
    isSimulated: true,
  });
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'requesting'
  const [selectedClinic, setSelectedClinic] = useState(null);

  const requestUserLocation = useCallback(() => {
    setLocationPermission('requesting');
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      addToast('Geolocation is not supported by your browser. Using manual search.', 'warning');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: 'Current Device Location',
          isSimulated: false,
        };
        setUserLocation(coords);
        setLocationPermission('granted');
        addToast('📍 Location verified! Showing nearest medical facilities.', 'success');
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err);
        setLocationPermission('denied');
        addToast('Location access was not granted. Manual clinic search is active.', 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [addToast]);

  // Emergency SOS Trigger
  const [sosActive, setSosActive] = useState(false);
  const triggerEmergencySOS = useCallback(() => {
    setSosActive(true);
    addToast('🚨 EMERGENCY PROTOCOL TRIGGERED. Notifying contacts and preparing 911 dispatch.', 'error', 8000);
  }, [addToast]);

  const cancelEmergencySOS = useCallback(() => {
    setSosActive(false);
    addToast('Emergency protocol safely cancelled.', 'info');
  }, [addToast]);

  // Factory Reset / Data Export
  const resetEntireApplication = useCallback(() => {
    StorageService.resetAllData();
    setUserState(INITIAL_USER);
    setHabitsState(INITIAL_HABITS);
    setWeekStoryState(INITIAL_WEEK_STORY);
    setMedicationsState(INITIAL_MEDICATIONS);
    setAppointmentsState(INITIAL_APPOINTMENTS);
    setTodayVitalsState(INITIAL_TODAY_VITALS);
    setAiInsightsState(INITIAL_AI_INSIGHTS);
    setAuthSessionState({ isAuthenticated: true });
    setIsOnboardingCompleted(true);
    addToast('HealthFlow demo state reset to factory fresh defaults.', 'info');
    setCurrentRoute('dashboard');
  }, [addToast]);

  const value = {
    // Navigation
    currentRoute,
    setCurrentRoute,

    // Toasts
    toasts,
    addToast,
    removeToast,

    // Theme
    theme,
    toggleTheme,

    // Auth
    user,
    authSession,
    login,
    register,
    logout,
    updateProfile,
    isOnboardingCompleted,
    completeOnboarding,

    // Habits & Momentum
    habits,
    momentumScore,
    toggleHabitCompletion,
    completeMinimumWin,
    addHabit,
    editHabit,
    deleteHabit,
    pauseHabit,

    // 7-day Story
    weekStory,
    selectedDay,
    setSelectedDay,

    // Vitals
    todayVitals,
    addWaterGlass,
    quickLogMovement,
    updateVitals,

    // Medications
    medications,
    addMedication,
    editMedication,
    deleteMedication,
    markMedicationStatus,
    refillMedication,

    // Clinics & Map
    clinics,
    selectedClinic,
    setSelectedClinic,
    userLocation,
    locationPermission,
    requestUserLocation,

    // Appointments
    appointments,
    addAppointment,
    editAppointment,
    deleteAppointment,

    // Emergency
    sosActive,
    triggerEmergencySOS,
    cancelEmergencySOS,

    // AI Insights
    aiInsights,

    // Maintenance
    resetEntireApplication,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
