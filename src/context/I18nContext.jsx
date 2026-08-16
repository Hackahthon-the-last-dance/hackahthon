import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ru from '../locales/ru/index.js';
import en from '../locales/en/index.js';
import uz from '../locales/uz/index.js';

const I18nContext = createContext(null);
const STORAGE_KEY = 'hf_locale';
const SUPPORTED = ['ru', 'en', 'uz'];
const DICTIONARIES = { ru, en, uz };

function detectDefaultLocale() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED.includes(stored)) return stored;
  const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browserLang) ? browserLang : 'en';
}

function resolvePath(dict, key) {
  return key.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), dict);
}

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detectDefaultLocale);

  const setLocale = useCallback((next) => {
    if (!SUPPORTED.includes(next)) return;
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const primary = resolvePath(DICTIONARIES[locale], key);
      if (typeof primary === 'string') return interpolate(primary, vars);

      const fallback = resolvePath(DICTIONARIES.en, key);
      if (typeof fallback === 'string') {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] missing key "${key}" for locale "${locale}", falling back to en`);
        }
        return interpolate(fallback, vars);
      }

      if (import.meta.env.DEV) {
        console.warn(`[i18n] missing key "${key}" in every locale`);
      }
      return key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, supportedLocales: SUPPORTED }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
