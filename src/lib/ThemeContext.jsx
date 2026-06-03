import { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  { id: 'night',    label: 'Night',    color: '#1aff54' },
  { id: 'carbon',   label: 'Carbon',   color: '#ebebeb' },
  { id: 'midnight', label: 'Midnight', color: '#3399ff' },
  { id: 'sunset',   label: 'Sunset',   color: '#ff9c1a' },
  { id: 'stealth',  label: 'Stealth',  color: '#00d4d4' },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('app-theme');
    return THEMES.find(t => t.id === stored)?.id ?? 'night';
  });

  useEffect(() => {
    // Remove all theme classes then apply the current one
    THEMES.forEach(t => document.documentElement.classList.remove(`theme-${t.id}`));
    document.documentElement.classList.add(`theme-${theme}`);
    // Keep 'dark' class always on so shadcn dark-mode tokens fire
    document.documentElement.classList.add('dark');
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Legacy compat — everything is "dark"
  const isDark = true;
  const toggle = () => {};

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);