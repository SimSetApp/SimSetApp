import { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [{ id: 'liquid', label: 'Liquid', color: '#0A84FF' }];

const ThemeContext = createContext({
  theme: 'liquid',
  setTheme: () => {},
  mode: 'light',
  setMode: () => {},
  toggleMode: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem('app-mode');
    return stored === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('mode-light', 'mode-dark');
    document.documentElement.classList.add('theme-liquid', `mode-${mode}`);
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('app-mode', mode);
  }, [mode]);

  const isDark = mode === 'dark';
  const toggleMode = () => setMode(m => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme: 'liquid', setTheme: () => {}, mode, setMode, toggleMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);