import { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  { id: 'night',    label: 'Night',     emoji: '🌑' },
  { id: 'carbon',   label: 'Carbon',    emoji: '⚫' },
  { id: 'midnight', label: 'Midnight',  emoji: '🔵' },
  { id: 'sunset',   label: 'Sunset',    emoji: '🟠' },
  { id: 'stealth',  label: 'Stealth',   emoji: '🟢' },
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