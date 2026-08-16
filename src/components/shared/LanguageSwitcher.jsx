import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t, supportedLocales } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('common.language.label')}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 text-sm font-semibold text-text transition-colors duration-150 hover:bg-hover"
      >
        <Globe size={15} strokeWidth={2.25} />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('common.language.label')}
          className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
        >
          {supportedLocales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-text transition-colors duration-150 hover:bg-hover"
              >
                <span>{t(`common.language.${code}`)}</span>
                {locale === code && <Check size={14} className="text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
