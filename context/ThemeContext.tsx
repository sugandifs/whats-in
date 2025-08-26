import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme | "system") => void;
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeContext must be used within a ThemeProvider"
    );
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "@app_theme";

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] =
    useState<ColorScheme>("light");
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when system theme changes (only if using system theme)
  useEffect(() => {
    if (isSystemTheme && systemColorScheme) {
      setColorSchemeState(systemColorScheme);
    }
  }, [systemColorScheme, isSystemTheme]);

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (storedTheme === "system" || storedTheme === null) {
        // Use system theme
        setIsSystemTheme(true);
        setColorSchemeState(systemColorScheme || "light");
      } else if (storedTheme === "light" || storedTheme === "dark") {
        // Use specific theme
        setIsSystemTheme(false);
        setColorSchemeState(storedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error);
      // Fallback to system theme
      setIsSystemTheme(true);
      setColorSchemeState(systemColorScheme || "light");
    } finally {
      setIsLoading(false);
    }
  };

  const setColorScheme = async (scheme: ColorScheme | "system") => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);

      if (scheme === "system") {
        setIsSystemTheme(true);
        setColorSchemeState(systemColorScheme || "light");
      } else {
        setIsSystemTheme(false);
        setColorSchemeState(scheme);
      }
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const value: ThemeContextType = {
    colorScheme,
    setColorScheme,
    isSystemTheme,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
