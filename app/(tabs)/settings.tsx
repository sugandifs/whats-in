import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Header } from "@/components/ui/Header";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  TouchableOpacity,
} from "react-native";

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { themedColors, theme } = useThemedStyles();
  const { colorScheme, setColorScheme, isSystemTheme } =
    useThemeContext();
  const [logoutConfirmVisible, setLogoutConfirmVisible] =
    useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Failed to logout:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleThemeToggle = (value: boolean) => {
    setColorScheme(value ? "dark" : "light");
  };

  const settingSections = [
    {
      title: "Appearance",
      items: [
        {
          id: "theme",
          title: "Dark Mode",
          subtitle: isSystemTheme
            ? "Following system settings"
            : `Using ${colorScheme} theme`,
          icon: "moon" as const,
          type: "switch" as const,
          value: colorScheme === "dark",
          onToggle: handleThemeToggle,
        },
        {
          id: "system-theme",
          title: "Use System Theme",
          subtitle: "Automatically switch between light and dark",
          icon: "phone-portrait" as const,
          type: "switch" as const,
          value: isSystemTheme,
          onToggle: (value: boolean) => {
            setColorScheme(value ? "system" : colorScheme);
          },
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          id: "profile",
          title: "Edit Profile",
          subtitle: "Update your personal information",
          icon: "person" as const,
          type: "navigation" as const,
          onPress: () => router.push("/profile"),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          themedColors.text === "#1A1A21"
            ? "dark-content"
            : "light-content"
        }
      />

      <Header title="Settings" subtitle="Manage your preferences" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <ThemedView
          style={{
            marginHorizontal: theme.spacing.lg,
            marginVertical: theme.spacing.lg,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: themedColors.backgroundSecondary,
            borderWidth: 1,
            borderColor: themedColors.border,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <ThemedView
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: themedColors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.lg,
              }}
            >
              <ThemedText style={{ fontSize: 24, color: "white" }}>
                {currentUser?.displayName?.charAt(0) ||
                  currentUser?.email?.charAt(0) ||
                  "U"}
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{ flex: 1, backgroundColor: "transparent" }}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 18 }}
              >
                {currentUser?.displayName || "User"}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  opacity: 0.7,
                  marginTop: 2,
                }}
              >
                {currentUser?.email}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <ThemedView
            key={section.title}
            style={{
              marginHorizontal: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
            }}
          >
            <ThemedText
              type="subtitle"
              style={{
                fontSize: 16,
                marginBottom: theme.spacing.md,
                opacity: 0.8,
              }}
            >
              {section.title}
            </ThemedText>

            <ThemedView
              style={{
                backgroundColor: themedColors.backgroundSecondary,
                borderRadius: theme.borderRadius.lg,
                borderWidth: 1,
                borderColor: themedColors.border,
                overflow: "hidden",
              }}
            >
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: theme.spacing.lg,
                    borderBottomWidth:
                      itemIndex < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: themedColors.border,
                  }}
                  onPress={
                    item.type === "navigation"
                      ? item.onPress
                      : undefined
                  }
                  disabled={item.type === "switch"}
                >
                  <ThemedView
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${themedColors.primary}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: theme.spacing.lg,
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={themedColors.primary}
                    />
                  </ThemedView>

                  <ThemedView
                    style={{ flex: 1, backgroundColor: "transparent" }}
                  >
                    <ThemedText type="defaultSemiBold">
                      {item.title}
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 14,
                        opacity: 0.7,
                        marginTop: 2,
                      }}
                    >
                      {item.subtitle}
                    </ThemedText>
                  </ThemedView>

                  {item.type === "switch" && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{
                        false: themedColors.backgroundTertiary,
                        true: themedColors.primary,
                      }}
                      thumbColor={
                        item.value
                          ? "white"
                          : themedColors.textSecondary
                      }
                    />
                  )}

                  {item.type === "navigation" && (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={themedColors.textSecondary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        ))}

        {/* Logout Section */}
        <ThemedView
          style={{
            marginHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.xxl,
          }}
        >
          <ActionButton
            title="Sign Out"
            icon="log-out"
            variant="outline"
            onPress={() => setLogoutConfirmVisible(true)}
            style={{
              borderColor: themedColors.error,
              backgroundColor: `${themedColors.error}10`,
            }}
          />
        </ThemedView>

        {/* App Info */}
        <ThemedView
          style={{
            alignItems: "center",
            paddingBottom: 100,
            backgroundColor: "transparent",
          }}
        >
          <ThemedText
            style={{
              fontSize: 12,
              opacity: 0.5,
              textAlign: "center",
            }}
          >
            what's in v1.0.0{"\n"}
            made with warmth
          </ThemedText>
        </ThemedView>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        visible={logoutConfirmVisible}
        onClose={() => setLogoutConfirmVisible(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your recipes and pantry."
        confirmText="Sign Out"
        cancelText="Cancel"
        destructive
      />
    </SafeAreaView>
  );
}
