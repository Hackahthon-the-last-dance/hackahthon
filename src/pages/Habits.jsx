import { useState } from 'react';
import { Droplet, Moon, Dumbbell, Trash2 } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useWellness } from '../context/WellnessContext.jsx';
import { todayISO, lastNDays } from '../utils/date.js';
import Button from '../components/shared/Button.jsx';
import Input from '../components/shared/Input.jsx';
import HabitCard from '../components/shared/HabitCard.jsx';

const WORKOUT_TYPES = ['pushups', 'running', 'walking', 'gym', 'stretching'];
const WORKOUT_UNITS = ['reps', 'minutes', 'km'];

export default function Habits() {
  const { t, locale } = useTranslation();
  const {
    water,
    sleep,
    workouts,
    addWater,
    setWaterGoal,
    logSleep,
    setSleepTarget,
    addWorkout,
    removeWorkout,
  } = useWellness();

  const today = todayISO();
  const todayWaterMl = water.log[today] ?? 0;
  const waterPercent = (todayWaterMl / water.goalMl) * 100;

  const [goalDraft, setGoalDraft] = useState(water.goalMl);
  const [bedtimeDraft, setBedtimeDraft] = useState(sleep.bedtime);
  const [wakeTimeDraft, setWakeTimeDraft] = useState(sleep.wakeTime);
  const [targetDraft, setTargetDraft] = useState(sleep.targetHours);
  const [hoursDraft, setHoursDraft] = useState(sleep.log[today] ?? '');

  const [workoutForm, setWorkoutForm] = useState({ type: 'pushups', value: '', unit: 'reps' });

  const week = lastNDays(7);

  const handleLogSleep = (event) => {
    event.preventDefault();
    const hours = Number(hoursDraft);
    if (!hours) return;
    logSleep({ hours, bedtime: bedtimeDraft, wakeTime: wakeTimeDraft });
  };

  const handleAddWorkout = (event) => {
    event.preventDefault();
    const value = Number(workoutForm.value);
    if (!value) return;
    addWorkout({ type: workoutForm.type, value, unit: workoutForm.unit });
    setWorkoutForm((f) => ({ ...f, value: '' }));
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">{t('habits.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('habits.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <HabitCard
          icon={Droplet}
          title={t('habits.water.title')}
          subtitle={t('habits.water.progress', {
            current: (todayWaterMl / 1000).toFixed(1),
            goal: (water.goalMl / 1000).toFixed(1),
          })}
          progressPercent={waterPercent}
        >
          <Button variant="primary" size="sm" onClick={() => addWater()}>
            {t('habits.water.add', { amount: water.incrementMl })}
          </Button>
          <div className="flex items-end gap-2 border-t border-border pt-4">
            <Input
              label={t('habits.water.goalLabel')}
              name="waterGoal"
              type="number"
              value={goalDraft}
              onChange={(event) => setGoalDraft(event.target.value)}
            />
            <Button variant="secondary" size="sm" onClick={() => setWaterGoal(Number(goalDraft) || water.goalMl)}>
              {t('habits.water.saveGoal')}
            </Button>
          </div>
        </HabitCard>

        <HabitCard icon={Moon} title={t('habits.sleep.title')}>
          <form onSubmit={handleLogSleep} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label={t('habits.sleep.bedtime')}
                name="bedtime"
                type="time"
                value={bedtimeDraft}
                onChange={(event) => setBedtimeDraft(event.target.value)}
              />
              <Input
                label={t('habits.sleep.wakeTime')}
                name="wakeTime"
                type="time"
                value={wakeTimeDraft}
                onChange={(event) => setWakeTimeDraft(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label={t('habits.sleep.target')}
                name="target"
                type="number"
                value={targetDraft}
                onChange={(event) => {
                  setTargetDraft(event.target.value);
                  setSleepTarget(Number(event.target.value) || sleep.targetHours);
                }}
              />
              <Input
                label={t('habits.sleep.hoursSlept')}
                name="hoursSlept"
                type="number"
                value={hoursDraft}
                onChange={(event) => setHoursDraft(event.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="sm">
              {t('habits.sleep.log')}
            </Button>
          </form>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-xs font-semibold text-text-muted">{t('habits.sleep.weekly')}</p>
            <div className="flex items-end gap-1.5" style={{ height: 60 }}>
              {week.map((dateISO) => {
                const hours = sleep.log[dateISO] ?? 0;
                const heightPercent = Math.min(100, (hours / (sleep.targetHours || 8)) * 100);
                return (
                  <div key={dateISO} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-primary-soft"
                        style={{ height: `${heightPercent}%`, backgroundColor: hours ? undefined : 'transparent' }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted">
                      {new Date(`${dateISO}T00:00:00`).toLocaleDateString(locale, { weekday: 'narrow' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </HabitCard>

        <HabitCard icon={Dumbbell} title={t('habits.workout.title')}>
          <form onSubmit={handleAddWorkout} className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">{t('habits.workout.type')}</label>
              <select
                value={workoutForm.type}
                onChange={(event) => setWorkoutForm((f) => ({ ...f, type: event.target.value }))}
                className="h-11 w-full rounded-lg border border-border-strong bg-input px-3 text-sm text-text focus:border-primary focus:outline-none"
              >
                {WORKOUT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`habits.workout.types.${type}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label={t('habits.workout.value')}
                name="value"
                type="number"
                value={workoutForm.value}
                onChange={(event) => setWorkoutForm((f) => ({ ...f, value: event.target.value }))}
              />
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text">{t('habits.workout.unit')}</label>
                <select
                  value={workoutForm.unit}
                  onChange={(event) => setWorkoutForm((f) => ({ ...f, unit: event.target.value }))}
                  className="h-11 w-full rounded-lg border border-border-strong bg-input px-3 text-sm text-text focus:border-primary focus:outline-none"
                >
                  {WORKOUT_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {t(`habits.workout.units.${unit}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" variant="primary" size="sm">
              {t('habits.workout.save')}
            </Button>
          </form>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            {workouts.length === 0 ? (
              <p className="text-xs text-text-muted">{t('habits.workout.empty')}</p>
            ) : (
              workouts.slice(0, 6).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
                  <span className="text-sm text-text">
                    {t(`habits.workout.types.${entry.type}`)} — {entry.value} {t(`habits.workout.units.${entry.unit}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeWorkout(entry.id)}
                    aria-label={t('common.actions.delete')}
                    className="text-text-muted hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </HabitCard>
      </div>
    </div>
  );
}
