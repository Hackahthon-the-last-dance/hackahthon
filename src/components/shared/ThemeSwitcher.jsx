import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useTranslation } from '../../context/I18nContext.jsx';

const OPTIONS = [
  { mode: 'light', icon: Sun },
  { mode: 'dark', icon: Moon },
  { mode: 'system', icon: Monitor },
];

export default function ThemeSwitcher({ className = '' }) {
  const { mode, setThemeMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      role="radiogroup"
      aria-label={t('common.theme.toggle')}
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted p-1 ${className}`}
    >
      {OPTIONS.map(({ mode: optionMode, icon: Icon }) => {
        const active = mode === optionMode;
        return (
          <button
            key={optionMode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(`common.theme.${optionMode}`)}
            title={t(`common.theme.${optionMode}`)}
            onClick={() => setThemeMode(optionMode)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ${
              active
                ? 'bg-primary text-text-inverse shadow-sm'
                : 'text-text-muted hover:bg-hover hover:text-text'
            }`}
          >
            <Icon size={16} strokeWidth={2.25} />
          </button>
        );
      })}
    </div>
  );
}
