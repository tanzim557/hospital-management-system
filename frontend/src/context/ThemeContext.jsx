import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  ROYAL: 'royal'
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('medicore_theme');
    if (!stored || stored === 'emerald') {
      return THEMES.LIGHT;
    }
    if (Object.values(THEMES).includes(stored)) {
      return stored;
    }
    return THEMES.LIGHT;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medicore_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === THEMES.LIGHT) return THEMES.DARK;
      if (prev === THEMES.DARK) return THEMES.ROYAL;
      return THEMES.LIGHT;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
