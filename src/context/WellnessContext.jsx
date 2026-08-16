import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState.js';
import { todayISO, lastNDays, isReminderDueOn } from '../utils/date.js';

const WellnessContext = createContext(null);

const DEFAULT_WATER = { goalMl: 2000, incrementMl: 250, log: {} };
const DEFAULT_SLEEP = { targetHours: 8, bedtime: '23:00', wakeTime: '07:00', log: {} };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function WellnessProvider({ children }) {
  const [water, setWater] = useLocalStorageState('hf_water', DEFAULT_WATER);
  const [sleep, setSleep] = useLocalStorageState('hf_sleep', DEFAULT_SLEEP);
  const [workouts, setWorkouts] = useLocalStorageState('hf_workouts', []);
  const [reminders, setReminders] = useLocalStorageState('hf_reminders', []);
  const [completedTaskIds, setCompletedTaskIds] = useLocalStorageState('hf_task_completions', {});

  const addWater = useCallback(
    (ml = water.incrementMl, dateISO = todayISO()) => {
      setWater((w) => ({ ...w, log: { ...w.log, [dateISO]: (w.log[dateISO] ?? 0) + ml } }));
    },
    [water.incrementMl, setWater]
  );

  const setWaterGoal = useCallback((goalMl) => setWater((w) => ({ ...w, goalMl })), [setWater]);

  const logSleep = useCallback(
    ({ hours, bedtime, wakeTime }, dateISO = todayISO()) => {
      setSleep((s) => ({
        ...s,
        bedtime: bedtime ?? s.bedtime,
        wakeTime: wakeTime ?? s.wakeTime,
        log: { ...s.log, [dateISO]: hours },
      }));
    },
    [setSleep]
  );

  const setSleepTarget = useCallback((targetHours) => setSleep((s) => ({ ...s, targetHours })), [setSleep]);

  const addWorkout = useCallback(
    ({ type, value, unit }, dateISO = todayISO()) => {
      setWorkouts((list) => [{ id: uid(), type, value, unit, date: dateISO }, ...list]);
    },
    [setWorkouts]
  );

  const removeWorkout = useCallback((id) => setWorkouts((list) => list.filter((w) => w.id !== id)), [setWorkouts]);

  const addReminder = useCallback(
    (data) => {
      const reminder = { id: uid(), createdAt: todayISO(), ...data };
      setReminders((list) => [reminder, ...list]);
      return reminder;
    },
    [setReminders]
  );

  const updateReminder = useCallback(
    (id, data) => setReminders((list) => list.map((r) => (r.id === id ? { ...r, ...data } : r))),
    [setReminders]
  );

  const deleteReminder = useCallback(
    (id) => setReminders((list) => list.filter((r) => r.id !== id)),
    [setReminders]
  );

  const toggleTaskDone = useCallback(
    (taskId, dateISO = todayISO()) => {
      setCompletedTaskIds((map) => {
        const dayMap = { ...(map[dateISO] ?? {}) };
        dayMap[taskId] = !dayMap[taskId];
        return { ...map, [dateISO]: dayMap };
      });
    },
    [setCompletedTaskIds]
  );

  const isTaskDone = useCallback(
    (taskId, dateISO = todayISO()) => Boolean(completedTaskIds[dateISO]?.[taskId]),
    [completedTaskIds]
  );

  const getRemindersForDate = useCallback(
    (dateISO) => reminders.filter((r) => isReminderDueOn(r, dateISO)),
    [reminders]
  );

  const value = useMemo(
    () => ({
      water,
      sleep,
      workouts,
      reminders,
      addWater,
      setWaterGoal,
      logSleep,
      setSleepTarget,
      addWorkout,
      removeWorkout,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleTaskDone,
      isTaskDone,
      getRemindersForDate,
      lastNDays,
    }),
    [
      water,
      sleep,
      workouts,
      reminders,
      addWater,
      setWaterGoal,
      logSleep,
      setSleepTarget,
      addWorkout,
      removeWorkout,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleTaskDone,
      isTaskDone,
      getRemindersForDate,
    ]
  );

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
}

export function useWellness() {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error('useWellness must be used within WellnessProvider');
  return ctx;
}
