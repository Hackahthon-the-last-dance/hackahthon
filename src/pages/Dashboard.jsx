import { Link } from 'react-router-dom';
import { Droplet, Moon, Activity as ActivityIcon, CheckSquare, Plus, Check } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWellness } from '../context/WellnessContext.jsx';
import { todayISO } from '../utils/date.js';
import Card from '../components/shared/Card.jsx';
import Button from '../components/shared/Button.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

function greetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { water, sleep, workouts, getRemindersForDate, isTaskDone, toggleTaskDone } = useWellness();

  const today = todayISO();
  const todayWaterMl = water.log[today] ?? 0;
  const sleepHours = sleep.log[today];
  const workoutsToday = workouts.filter((w) => w.date === today);
  const remindersToday = getRemindersForDate(today);
  const completedReminders = remindersToday.filter((r) => isTaskDone(r.id, today));

  const waterDone = todayWaterMl >= water.goalMl;
  const sleepDone = typeof sleepHours === 'number';
  const workoutDone = workoutsToday.length > 0;

  const totalTasks = remindersToday.length + 3;
  const doneTasks = completedReminders.length + [waterDone, sleepDone, workoutDone].filter(Boolean).length;

  const stats = [
    { icon: Droplet, label: t('dashboard.stats.water'), value: `${(todayWaterMl / 1000).toFixed(1)} / ${(water.goalMl / 1000).toFixed(1)} L` },
    { icon: Moon, label: t('dashboard.stats.sleep'), value: sleepDone ? `${sleepHours}h / ${sleep.targetHours}h` : `— / ${sleep.targetHours}h` },
    { icon: ActivityIcon, label: t('dashboard.stats.activity'), value: `${workoutsToday.length}` },
    { icon: CheckSquare, label: t('dashboard.stats.tasks'), value: `${doneTasks} / ${totalTasks}` },
  ];

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">
          {t(`dashboard.greeting.${greetingKey()}`, { name: currentUser?.name?.split(' ')[0] ?? '' })}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <stat.icon size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-muted">{stat.label}</p>
              <p className="truncate text-lg font-extrabold text-text">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">{t('dashboard.todaysPlan.title')}</h2>
          <Link to="/reminders">
            <Button variant="secondary" size="sm" icon={Plus}>
              {t('dashboard.todaysPlan.addReminder')}
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { key: 'water', done: waterDone, label: t('dashboard.todaysPlan.waterTask') },
            { key: 'sleep', done: sleepDone, label: t('dashboard.todaysPlan.sleepTask') },
            { key: 'workout', done: workoutDone, label: t('dashboard.todaysPlan.workoutTask') },
          ].map((item) => (
            <Link
              key={item.key}
              to="/habits"
              className="card flex items-center gap-3 p-3.5 transition-colors duration-150 hover:border-primary"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  item.done ? 'border-success-strong bg-success-strong text-white' : 'border-border-strong'
                }`}
              >
                {item.done && <Check size={14} strokeWidth={3} />}
              </span>
              <span className={`text-sm font-semibold ${item.done ? 'text-text-muted line-through' : 'text-text'}`}>
                {item.label}
              </span>
            </Link>
          ))}

          {remindersToday.map((reminder) => {
            const done = isTaskDone(reminder.id, today);
            return (
              <button
                key={reminder.id}
                type="button"
                onClick={() => toggleTaskDone(reminder.id, today)}
                className="card flex items-center gap-3 p-3.5 text-left transition-colors duration-150 hover:border-primary"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    done ? 'border-success-strong bg-success-strong text-white' : 'border-border-strong'
                  }`}
                >
                  {done && <Check size={14} strokeWidth={3} />}
                </span>
                <span className={`text-sm font-semibold ${done ? 'text-text-muted line-through' : 'text-text'}`}>
                  {reminder.name}
                </span>
                <span className="ml-auto text-xs text-text-muted">{reminder.time}</span>
              </button>
            );
          })}

          {remindersToday.length === 0 && (
            <EmptyState
              icon={CheckSquare}
              title={t('common.states.empty')}
              description={t('dashboard.todaysPlan.empty')}
            />
          )}
        </div>
      </section>
    </div>
  );
}
