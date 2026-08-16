import { Bell, Repeat, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';

export default function ReminderCard({ reminder, onEdit, onDelete }) {
  const { t } = useTranslation();

  const repeatText =
    reminder.repeat === 'weekly'
      ? reminder.days.map((d) => t(`reminders.form.dayLabels.${d}`)).join(', ')
      : t(`reminders.form.repeatOptions.${reminder.repeat}`);

  return (
    <div className="card flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Bell size={18} strokeWidth={2} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text">{reminder.name}</h4>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
            <span>{reminder.time}</span>
            <span className="flex items-center gap-1">
              <Repeat size={12} />
              {repeatText}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label={t('common.actions.edit')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors duration-150 hover:bg-hover hover:text-text"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={t('common.actions.delete')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors duration-150 hover:bg-danger-soft hover:text-danger"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
