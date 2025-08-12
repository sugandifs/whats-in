import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import LoginSignupPage from "./login";

function RootLayoutNav() {
  const { currentUser, loading } = useAuth();
  const colorScheme = useColorScheme();

  // Show loading screen while checking auth state
  if (loading) {
    return null;
  }

  // If no user is authenticated, show login page
  if (!currentUser) {
    return (
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <LoginSignupPage />
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  // If user is authenticated, show the main app with tabs
  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
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
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
