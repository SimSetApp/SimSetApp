import { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  { id: 'liquid',   label: 'Liquid',   color: '#0A84FF' },
  { id: 'night',    label: 'Night',    color: '#1aff54' },
  { id: 'carbon',   label: 'Carbon',   color: '#ebebeb' },
  { id: 'midnight', label: 'Midnight', color: '#3399ff' },
  { id: 'sunset',   label: 'Sunset',   color: '#ff9c1a' },
  { id: 'stealth',  label: 'Stealth',  color: '#00d4d4' },
  { id: 'nova',     label: 'Nova',     color: '#9933ff' },
  { id: 'graphite', label: 'Graphite', color: '#8ba3c0' },
  { id: 'ember',    label: 'Ember',    color: '#e8484e' },
  { id: 'forest',   label: 'Forest',   color: '#26c474' },
  { id: 'cobalt',   label: 'Cobalt',   color: '#7a8cf5' },
  { id: 'magma',    label: 'Magma',    color: '#e05ce0' },
];

const ThemeContext = createContext({
  theme: 'liquid',
  setTheme: () => {},
  mode: 'light',
  setMode: () => {},
  toggleMode: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('app-theme');
    return THEMES.find(t => t.id === stored)?.id ?? 'liquid';
  });
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem('app-mode');
    return stored === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    THEMES.forEach(t => document.documentElement.classList.remove(`theme-${t.id}`));
    document.documentElement.classList.remove('mode-light', 'mode-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    if (theme === 'liquid') {
      document.documentElement.classList.add(`mode-${mode}`);
      document.documentElement.classList.toggle('dark', mode === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-mode', mode);
  }, [theme, mode]);

  const isDark = theme === 'liquid' ? mode === 'dark' : true;
  const toggleMode = () => setMode(m => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode, toggleMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);