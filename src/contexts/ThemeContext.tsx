import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Lấy theme từ localStorage hoặc system preference
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Kiểm tra system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Lưu theme vào localStorage
    localStorage.setItem('theme-mode', themeMode);
    
    // Cập nhật class trên body với transition
    document.body.className = themeMode;
    
    // Cập nhật CSS variables với transition mượt mà
    const root = document.documentElement;
    
    // Thêm transition cho tất cả CSS variables
    root.style.setProperty('--theme-transition', 'all 0.3s ease-in-out');
    
    if (themeMode === 'dark') {
      // Dark mode variables
      root.style.setProperty('--yahoo-bg', '#0f0f0f');
      root.style.setProperty('--yahoo-bg-secondary', '#1a1a1a');
      root.style.setProperty('--yahoo-bg-tertiary', '#2d2d2d');
      root.style.setProperty('--yahoo-text', '#ffffff');
      root.style.setProperty('--yahoo-text-secondary', '#b0b0b0');
      root.style.setProperty('--yahoo-text-tertiary', '#808080');
      root.style.setProperty('--yahoo-border', '#404040');
      root.style.setProperty('--yahoo-border-light', '#2a2a2a');
      root.style.setProperty('--yahoo-primary', '#7206f7');
      root.style.setProperty('--yahoo-primary-hover', '#5a05c7');
      root.style.setProperty('--yahoo-success', '#52c41a');
      root.style.setProperty('--yahoo-warning', '#faad14');
      root.style.setProperty('--yahoo-error', '#ff4d4f');
      root.style.setProperty('--yahoo-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--yahoo-shadow-light', '0 2px 8px rgba(0, 0, 0, 0.2)');
      root.style.setProperty('--yahoo-overlay', 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--yahoo-card-bg', '#1f1f1f');
      root.style.setProperty('--yahoo-input-bg', '#2a2a2a');
      root.style.setProperty('--yahoo-hover-bg', '#2d2d2d');
    } else {
      // Light mode variables
      root.style.setProperty('--yahoo-bg', '#ffffff');
      root.style.setProperty('--yahoo-bg-secondary', '#f8f9fa');
      root.style.setProperty('--yahoo-bg-tertiary', '#f1f3f4');
      root.style.setProperty('--yahoo-text', '#1a1a1a');
      root.style.setProperty('--yahoo-text-secondary', '#666666');
      root.style.setProperty('--yahoo-text-tertiary', '#999999');
      root.style.setProperty('--yahoo-border', '#e1e5e9');
      root.style.setProperty('--yahoo-border-light', '#f0f0f0');
      root.style.setProperty('--yahoo-primary', '#7206f7');
      root.style.setProperty('--yahoo-primary-hover', '#5a05c7');
      root.style.setProperty('--yahoo-success', '#52c41a');
      root.style.setProperty('--yahoo-warning', '#faad14');
      root.style.setProperty('--yahoo-error', '#ff4d4f');
      root.style.setProperty('--yahoo-shadow', '0 4px 12px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--yahoo-shadow-light', '0 2px 8px rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--yahoo-overlay', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--yahoo-card-bg', '#ffffff');
      root.style.setProperty('--yahoo-input-bg', '#ffffff');
      root.style.setProperty('--yahoo-hover-bg', '#f5f5f5');
    }
  }, [themeMode]);

  // Lắng nghe thay đổi system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext }; 