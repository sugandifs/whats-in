import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={22} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mealprep"
        options={{
          title: "Meal Planner",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={22} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={22} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: "Pantry",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={22} name="utensils" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: "Grocery",
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              size={22}
              name="shopping-cart"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="generate-recipe"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen name="recipe/[id]" options={{ href: null }} />
      <Tabs.Screen name="edit-recipe/[id]" options={{ href: null }} />
      <Tabs.Screen name="create-meal" options={{ href: null }} />
    </Tabs>
  );
}
