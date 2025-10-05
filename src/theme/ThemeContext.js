import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

const ThemeContext = createContext({
  isDark: false,
  toggleDark: () => {},
});

export function ThemeProvider({ children }) {
  const systemScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const value = useMemo(() => ({
    isDark,
    toggleDark: () => setIsDark(v => !v),
  }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeToggle() {
  return useContext(ThemeContext);
}


