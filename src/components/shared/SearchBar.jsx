import { Search, X } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';

export default function SearchBar({ value, onChange, placeholder, className = '' }) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 transition-colors duration-150 focus-within:border-primary ${className}`}
    >
      <Search size={16} className="shrink-0 text-text-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? t('common.actions.search')}
        aria-label={placeholder ?? t('common.actions.search')}
        className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('common.actions.close')}
          className="shrink-0 text-text-muted transition-colors duration-150 hover:text-text"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
