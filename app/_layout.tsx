import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import LoginSignupPage from "./login";

function RootLayoutNav() {
  const { currentUser, loading } = useAuth();
  const colorScheme = useColorScheme();

  // Create custom navigation theme using your app colors
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background, // app background
      card: Colors.light.backgroundSecondary, // Card/header backgrounds
      text: Colors.light.text, // Text color
      border: Colors.light.border, // Border color
      notification: Colors.light.tint, // Notification badge color
      primary: Colors.light.tint, // Primary accent color
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background, // app background
      card: Colors.dark.backgroundSecondary, // Card/header backgrounds
      text: Colors.dark.text, // Text color
      border: Colors.dark.border, // Border color
      notification: Colors.dark.tint, // Notification badge color
      primary: Colors.dark.tint, // Primary accent color
    },
  };

  const currentTheme =
    colorScheme === "dark" ? customDarkTheme : customLightTheme;

  // Show loading screen while checking auth state
  if (loading) {
    return null;
  }

  // If no user is authenticated, show login page
  if (!currentUser) {
    return (
      <NavigationThemeProvider value={currentTheme}>
        <LoginSignupPage />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </NavigationThemeProvider>
    );
  }

  // If user is authenticated, show the main app with tabs
  return (
    <NavigationThemeProvider value={currentTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          // This ensures all screens use your app background
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
