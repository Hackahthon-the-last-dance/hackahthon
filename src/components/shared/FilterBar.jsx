import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import Button from './Button.jsx';

/**
 * groups: [{ key, label, options: [{ value, label }] }]
 * active: { [groupKey]: value }
 * sortOptions: [{ value, label }]
 */
export default function FilterBar({
  groups = [],
  active = {},
  onChange,
  sortOptions = [],
  sortValue,
  onSortChange,
  className = '',
}) {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount = Object.values(active).filter(Boolean).length;

  const content = (
    <div className="flex flex-wrap items-center gap-3">
      {groups.map((group) => (
        <div key={group.key} className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {group.label}
          </label>
          <select
            value={active[group.key] ?? ''}
            onChange={(event) => onChange(group.key, event.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-2.5 text-sm text-text focus:border-primary focus:outline-none"
          >
            <option value="">{t('common.actions.viewAll')}</option>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {sortOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('common.actions.sort')}
          </label>
          <select
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-2.5 text-sm text-text focus:border-primary focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      <div className="hidden md:block">{content}</div>

      <div className="md:hidden">
        <Button variant="secondary" size="sm" icon={SlidersHorizontal} onClick={() => setDrawerOpen(true)}>
          {t('common.actions.filters')}
          {activeCount > 0 && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-text-inverse">
              {activeCount}
            </span>
          )}
        </Button>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-end bg-black/50"
            onClick={(event) => event.target === event.currentTarget && setDrawerOpen(false)}
          >
            <div className="animate-slide-up flex max-h-[80vh] w-full flex-col gap-4 overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text">{t('common.actions.filters')}</h3>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t('common.actions.close')}
                  className="text-text-muted"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-4">{content}</div>
              <Button variant="primary" onClick={() => setDrawerOpen(false)} className="mt-2 w-full">
                {t('common.actions.confirm')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
