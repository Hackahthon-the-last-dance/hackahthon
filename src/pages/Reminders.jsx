import { useMemo, useState } from 'react';
import { Plus, Bell } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useWellness } from '../context/WellnessContext.jsx';
import { todayISO, isReminderDueOn } from '../utils/date.js';
import Button from '../components/shared/Button.jsx';
import Input from '../components/shared/Input.jsx';
import Modal from '../components/shared/Modal.jsx';
import ConfirmModal from '../components/shared/ConfirmModal.jsx';
import ReminderCard from '../components/shared/ReminderCard.jsx';
import Calendar from '../components/shared/Calendar.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const EMPTY_FORM = { name: '', time: '09:00', repeat: 'daily', days: [], startDate: todayISO(), endDate: '' };

export default function Reminders() {
  const { t } = useTranslation();
  const { reminders, addReminder, updateReminder, deleteReminder } = useWellness();

  const [modalState, setModalState] = useState(null); // null | { mode: 'add'|'edit', reminder? }
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalState({ mode: 'add' });
  };

  const openEdit = (reminder) => {
    setForm({ ...reminder, endDate: reminder.endDate ?? '' });
    setModalState({ mode: 'edit', reminder });
  };

  const closeModal = () => setModalState(null);

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      time: form.time,
      repeat: form.repeat,
      days: form.repeat === 'weekly' ? form.days : [],
      startDate: form.startDate || todayISO(),
      endDate: form.endDate || null,
    };

    if (modalState.mode === 'edit') {
      updateReminder(modalState.reminder.id, payload);
    } else {
      addReminder(payload);
    }
    closeModal();
  };

  const remindersForSelectedDate = useMemo(
    () => reminders.filter((r) => isReminderDueOn(r, selectedDate)),
    [reminders, selectedDate]
  );

  const getCountForDate = (dateISO) => reminders.filter((r) => isReminderDueOn(r, dateISO)).length;

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text">{t('reminders.title')}</h1>
          <p className="mt-1 text-sm text-text-secondary">{t('reminders.subtitle')}</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAdd}>
          {t('reminders.add')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {reminders.length === 0 ? (
            <EmptyState icon={Bell} description={t('reminders.empty')} />
          ) : (
            reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onEdit={() => openEdit(reminder)}
                onDelete={() => setDeleteTarget(reminder)}
              />
            ))
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">
            {t('reminders.calendarTitle')}
          </h2>
          <Calendar getCountForDate={getCountForDate} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          {remindersForSelectedDate.length > 0 && (
            <div className="flex flex-col gap-2">
              {remindersForSelectedDate.map((r) => (
                <div key={r.id} className="card flex items-center justify-between p-3 text-sm">
                  <span className="font-semibold text-text">{r.name}</span>
                  <span className="text-text-muted">{r.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={Boolean(modalState)}
        onClose={closeModal}
        title={modalState?.mode === 'edit' ? t('reminders.form.titleEdit') : t('reminders.form.titleAdd')}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t('reminders.form.name')}
            name="name"
            placeholder={t('reminders.form.namePlaceholder')}
            required
            value={form.name}
            onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('reminders.form.time')}
              name="time"
              type="time"
              required
              value={form.time}
              onChange={(event) => setForm((f) => ({ ...f, time: event.target.value }))}
            />
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">{t('reminders.form.repeat')}</label>
              <select
                value={form.repeat}
                onChange={(event) => setForm((f) => ({ ...f, repeat: event.target.value }))}
                className="h-11 w-full rounded-lg border border-border-strong bg-input px-3 text-sm text-text focus:border-primary focus:outline-none"
              >
                {['once', 'daily', 'weekly'].map((option) => (
                  <option key={option} value={option}>
                    {t(`reminders.form.repeatOptions.${option}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.repeat === 'weekly' && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">{t('reminders.form.days')}</label>
              <div className="flex flex-wrap gap-2">
                {DAY_ORDER.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ${
                      form.days.includes(day)
                        ? 'border-primary bg-primary text-text-inverse'
                        : 'border-border-strong text-text-secondary hover:bg-hover'
                    }`}
                  >
                    {t(`reminders.form.dayLabels.${day}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('reminders.form.startDate')}
              name="startDate"
              type="date"
              required
              value={form.startDate}
              onChange={(event) => setForm((f) => ({ ...f, startDate: event.target.value }))}
            />
            <Input
              label={t('reminders.form.endDate')}
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={(event) => setForm((f) => ({ ...f, endDate: event.target.value }))}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {t('reminders.form.save')}
          </Button>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteReminder(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title={t('reminders.deleteTitle')}
        message={t('reminders.deleteMessage')}
      />
    </div>
  );
}
