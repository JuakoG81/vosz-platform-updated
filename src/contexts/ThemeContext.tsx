/**
 * ThemeProvider - Context para manejo global del tema
 * Gestiona el tema claro/oscuro, persistencia en localStorage y detección automática
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { themeTokens, Theme } from '../lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Verificar localStorage primero
    const savedTheme = localStorage.getItem('vosz-theme') as Theme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Si no hay preferencia guardada, usar la preferencia del sistema
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return defaultTheme;
  });

  const isDark = theme === 'dark';

  // Aplicar variables CSS al documento
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const tokens = themeTokens[newTheme];
    
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Aplicar/Quitar la clase dark al elemento html
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Cambiar tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('vosz-theme', newTheme);
    applyTheme(newTheme);
  };

  // Toggle entre temas
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Detectar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar automáticamente si no hay preferencia guardada
      const savedTheme = localStorage.getItem('vosz-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Escuchar cambios en la preferencia del sistema
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Aplicar tema inicial
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};