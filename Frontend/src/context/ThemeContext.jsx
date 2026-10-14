/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "galimart-theme";

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getStoredTheme);

  useLayoutEffect(() => {
    const theme = darkMode ? "dark" : "light";
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", darkMode);
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme still applies for the current session when storage is unavailable.
    }
  }, [darkMode]);

  const toggleTheme = useCallback(() => setDarkMode((current) => !current), []);
  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
