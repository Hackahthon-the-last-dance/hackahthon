import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'hf_theme';

function resolveSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredMode() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    mode === 'system' ? resolveSystemTheme() : mode
  );

  useEffect(() => {
    const next = mode === 'system' ? resolveSystemTheme() : mode;
    setResolvedTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const next = resolveSystemTheme();
      setResolvedTheme(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [mode]);

  const setThemeMode = useCallback((next) => {
    setMode(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const active = current === 'system' ? resolveSystemTheme() : current;
      return active === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const value = useMemo(
    () => ({ mode, theme: resolvedTheme, setThemeMode, toggleTheme }),
    [mode, resolvedTheme, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
