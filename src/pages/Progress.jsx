import { useMemo } from 'react';
import { Droplet, Moon, Dumbbell, CheckSquare } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useWellness } from '../context/WellnessContext.jsx';
import { lastNDays, isReminderDueOn } from '../utils/date.js';
import Card from '../components/shared/Card.jsx';
import ProgressCard from '../components/shared/ProgressCard.jsx';

export default function Progress() {
  const { t } = useTranslation();
  const { water, sleep, workouts, reminders, isTaskDone } = useWellness();

  const week = lastNDays(7);

  const { waterPercent, sleepPercent, workoutPercent, tasksPercent, overallPercent } = useMemo(() => {
    const waterDays = week.filter((d) => (water.log[d] ?? 0) >= water.goalMl).length;
    const sleepDays = week.filter((d) => typeof sleep.log[d] === 'number').length;
    const workoutDays = week.filter((d) => workouts.some((w) => w.date === d)).length;

    let dueCount = 0;
    let doneCount = 0;
    week.forEach((d) => {
      reminders.forEach((r) => {
        if (isReminderDueOn(r, d)) {
          dueCount += 1;
          if (isTaskDone(r.id, d)) doneCount += 1;
        }
      });
    });

    const water_ = (waterDays / 7) * 100;
    const sleep_ = (sleepDays / 7) * 100;
    const workout_ = (workoutDays / 7) * 100;
    const tasks_ = dueCount > 0 ? (doneCount / dueCount) * 100 : 0;

    return {
      waterPercent: water_,
      sleepPercent: sleep_,
      workoutPercent: workout_,
      tasksPercent: tasks_,
      overallPercent: Math.round((water_ + sleep_ + workout_ + tasks_) / 4),
    };
  }, [week, water.log, water.goalMl, sleep.log, workouts, reminders, isTaskDone]);

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">{t('progress.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('progress.subtitle')}</p>
      </div>

      <Card className="gradient-brand flex items-center justify-between text-white">
        <span className="text-base font-bold">{t('progress.summary', { percent: overallPercent })}</span>
        <span className="text-3xl font-extrabold">{overallPercent}%</span>
      </Card>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-muted">
          {t('progress.weeklyOverview')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProgressCard icon={Droplet} label={t('progress.water')} percent={waterPercent} />
          <ProgressCard icon={Moon} label={t('progress.sleep')} percent={sleepPercent} />
          <ProgressCard icon={Dumbbell} label={t('progress.workouts')} percent={workoutPercent} />
          <ProgressCard icon={CheckSquare} label={t('progress.tasks')} percent={tasksPercent} />
        </div>
      </section>
    </div>
  );
}
