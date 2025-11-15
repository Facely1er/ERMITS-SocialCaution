/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, type FC, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme') as Theme;
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (error) {
      console.error('ThemeProvider initialization error:', error);
    }
    return 'light';
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      localStorage.setItem('theme', theme);
      root.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      console.error('ThemeProvider update error:', error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
