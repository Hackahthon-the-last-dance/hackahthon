import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { toISODate, todayISO } from '../../utils/date.js';

export default function Calendar({ getCountForDate, selectedDate, onSelectDate }) {
  const { locale, t } = useTranslation();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const weeks = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first grid
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
    while (cells.length % 7 !== 0) cells.push(null);

    const result = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'short' });
    });
  }, [locale]);

  const today = todayISO();

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          aria-label={t('common.actions.back')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-hover"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold capitalize text-text">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          aria-label={t('common.actions.next')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-hover"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-text-muted">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flat().map((date, index) => {
          if (!date) return <div key={index} />;
          const iso = toISODate(date);
          const count = getCountForDate?.(iso) ?? 0;
          const isToday = iso === today;
          const isSelected = iso === selectedDate;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate?.(iso)}
              className={`relative flex h-9 flex-col items-center justify-center rounded-lg text-sm transition-colors duration-150 ${
                isSelected
                  ? 'bg-primary text-text-inverse font-bold'
                  : isToday
                  ? 'bg-primary-soft text-primary font-bold'
                  : 'text-text hover:bg-hover'
              }`}
            >
              {date.getDate()}
              {count > 0 && (
                <span
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${
                    isSelected ? 'bg-text-inverse' : 'bg-primary'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
