// LocalStorage Persistence & Deterministic Health Momentum Engine
import {
  INITIAL_USER,
  INITIAL_HABITS,
  INITIAL_WEEK_STORY,
  INITIAL_MEDICATIONS,
  INITIAL_CLINICS,
  INITIAL_APPOINTMENTS,
  INITIAL_AI_INSIGHTS,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'hf_user_session',
  AUTH: 'hf_auth_status',
  HABITS: 'hf_habits',
  WEEK_STORY: 'hf_week_story',
  MEDICATIONS: 'hf_medications',
  CLINICS: 'hf_clinics',
  APPOINTMENTS: 'hf_appointments',
  INSIGHTS: 'hf_ai_insights',
  VITALS: 'hf_today_vitals',
  THEME: 'hf_theme_preference',
  NOTIFICATIONS: 'hf_notification_inbox',
  ONBOARDING: 'hf_onboarding_completed',
  EMERGENCY_LOGS: 'hf_emergency_sos_logs',
};

// Safe JSON parser
function getStoredItem(key, fallbackValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallbackValue;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallbackValue;
  }
}

function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Initial Today's Vitals
export const INITIAL_TODAY_VITALS = {
  waterGlasses: 5,
  waterTarget: 8,
  sleepHours: 7.33, // 7h 20m
  sleepScore: 82,
  movementMinutes: 0,
  movementTarget: 30,
  heartRate: 68,
  bloodPressure: '118/76',
  mood: 'Focused',
  loggedAt: new Date().toISOString(),
};

export const StorageService = {
  // Auth & Session
  getUser: () => getStoredItem(STORAGE_KEYS.USER, INITIAL_USER),
  setUser: (user) => setStoredItem(STORAGE_KEYS.USER, user),
  
  getAuthSession: () => getStoredItem(STORAGE_KEYS.AUTH, { isAuthenticated: true, token: 'demo-jwt-firdavs' }),
  setAuthSession: (auth) => setStoredItem(STORAGE_KEYS.AUTH, auth),
  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // Onboarding
  isOnboardingCompleted: () => getStoredItem(STORAGE_KEYS.ONBOARDING, true),
  setOnboardingCompleted: (val) => setStoredItem(STORAGE_KEYS.ONBOARDING, val),

  // Habits
  getHabits: () => getStoredItem(STORAGE_KEYS.HABITS, INITIAL_HABITS),
  setHabits: (habits) => setStoredItem(STORAGE_KEYS.HABITS, habits),

  // 7-Day History
  getWeekStory: () => getStoredItem(STORAGE_KEYS.WEEK_STORY, INITIAL_WEEK_STORY),
  setWeekStory: (story) => setStoredItem(STORAGE_KEYS.WEEK_STORY, story),

  // Medications
  getMedications: () => getStoredItem(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS),
  setMedications: (meds) => setStoredItem(STORAGE_KEYS.MEDICATIONS, meds),

  // Clinics
  getClinics: () => getStoredItem(STORAGE_KEYS.CLINICS, INITIAL_CLINICS),
  setClinics: (clinics) => setStoredItem(STORAGE_KEYS.CLINICS, clinics),

  // Appointments
  getAppointments: () => getStoredItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
  setAppointments: (apts) => setStoredItem(STORAGE_KEYS.APPOINTMENTS, apts),

  // Insights
  getInsights: () => getStoredItem(STORAGE_KEYS.INSIGHTS, INITIAL_AI_INSIGHTS),
  setInsights: (insights) => setStoredItem(STORAGE_KEYS.INSIGHTS, insights),

  // Vitals
  getTodayVitals: () => getStoredItem(STORAGE_KEYS.VITALS, INITIAL_TODAY_VITALS),
  setTodayVitals: (vitals) => setStoredItem(STORAGE_KEYS.VITALS, vitals),

  // Theme
  getTheme: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  setTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),

  // Export Data for User
  exportAllData: () => {
    const data = {};
    Object.keys(STORAGE_KEYS).forEach((k) => {
      data[k] = getStoredItem(STORAGE_KEYS[k], null);
    });
    return JSON.stringify(data, null, 2);
  },

  // Reset demo data back to factory clean state
  resetAllData: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

/**
 * Deterministic Health Momentum Calculator
 * 
 * Formula breakdown:
 * - 40% Habit completion rate today
 * - 25% 7-day consistency average
 * - 20% Vitals logged (Water, Sleep, Movement minimum win)
 * - 15% Recovery actions & active streak resilience
 */
export function calculateDeterministicMomentum({
  habits = [],
  weekStory = [],
  todayVitals = {},
}) {
  if (!habits || habits.length === 0) return 78;

  const activeHabits = habits.filter((h) => !h.isPaused);
  if (activeHabits.length === 0) return 70;

  // 1. Today habit completion (0 - 40 points)
  const completedHabits = activeHabits.filter((h) => h.completed);
  const habitCompletionRate = completedHabits.length / activeHabits.length;
  const habitScore = habitCompletionRate * 40;

  // 2. 7-Day Consistency (0 - 25 points)
  const days = weekStory && weekStory.length > 0 ? weekStory : INITIAL_WEEK_STORY;
  const avgWeekRate = days.reduce((sum, d) => sum + (d.completionRate || 80), 0) / days.length;
  const consistencyScore = (avgWeekRate / 100) * 25;

  // 3. Vitals & Hydration & Sleep (0 - 20 points)
  let vitalsScore = 0;
  const water = todayVitals.waterGlasses || 0;
  if (water >= 8) vitalsScore += 8;
  else if (water >= 5) vitalsScore += 6;
  else if (water >= 2) vitalsScore += 3;

  const sleep = todayVitals.sleepHours || 7;
  if (sleep >= 7.5) vitalsScore += 7;
  else if (sleep >= 6.5) vitalsScore += 5;
  else if (sleep >= 5) vitalsScore += 3;

  const movement = todayVitals.movementMinutes || 0;
  if (movement >= 30) vitalsScore += 5;
  else if (movement >= 5) vitalsScore += 3; // Minimum win recognized!

  // 4. Recovery actions bonus (0 - 15 points)
  // For each completed Minimum Win or recovered streak
  const recoveryWinsCount = activeHabits.filter((h) => h.recoveryClaimedToday).length;
  const streakBonus = Math.min(10, activeHabits.reduce((acc, h) => acc + (h.streak > 5 ? 2 : 1), 0));
  const recoveryScore = Math.min(15, streakBonus + recoveryWinsCount * 5);

  const total = Math.round(habitScore + consistencyScore + vitalsScore + recoveryScore);
  return Math.min(100, Math.max(15, total));
}
