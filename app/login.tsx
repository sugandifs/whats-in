import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const THEME_COLOR = "#FFB902";

export default function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
  });
  const colorScheme = useColorScheme();
  const { signup, login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async () => {
    if (loading) return;

    // Basic validation
    if (isLogin) {
      if (!formData.email.trim() || !formData.password.trim()) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
    } else {
      if (
        !formData.email.trim() ||
        !formData.password.trim() ||
        !formData.firstName.trim() ||
        !formData.lastName.trim()
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters long"
      );
      return;
    }

    // Signup specific validations
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      if (!formData.agreeToTerms) {
        Alert.alert(
          "Error",
          "Please agree to the terms and conditions"
        );
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        await login(formData.email.trim(), formData.password);
        // No need for success alert - user will be automatically redirected
      } else {
        // Handle signup
        await signup(
          formData.email.trim(),
          formData.password,
          formData.firstName.trim(),
          formData.lastName.trim()
        );
        Alert.alert(
          "Success",
          "Account created successfully! Welcome to MealPrep!",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      console.error("Auth error:", error);

      // Handle specific Firebase auth errors
      let errorMessage = "An error occurred. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your connection and try again.";
          break;
        default:
          errorMessage =
            error.message || "An unexpected error occurred.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      "Coming Soon",
      `${provider} login will be available in a future update.`
    );
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      Alert.alert(
        "Reset Password",
        'Please enter your email address first, then tap "Forgot Password" again.',
        [{ text: "OK" }]
      );
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    Alert.alert(
      "Reset Password",
      `A password reset link will be sent to ${formData.email}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Reset Link",
          onPress: () => {
            // TODO: Implement password reset
            Alert.alert(
              "Success",
              "Password reset link sent! Check your email."
            );
          },
        },
      ]
    );
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: formData.email, // Keep email when switching
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      agreeToTerms: false,
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      agreeToTerms: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          colorScheme === "dark" ? "light-content" : "dark-content"
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.appName}>
              what's in
            </ThemedText>
            <ThemedText type="default" style={styles.appTagline}>
              your pantry, your chef
            </ThemedText>
          </ThemedView>

          {/* Form */}
          <ThemedView style={styles.formContainer}>
            {/* Name Fields for Signup */}
            {!isLogin && (
              <ThemedView style={styles.nameRow}>
                <ThemedView
                  style={[
                    styles.formGroup,
                    { flex: 1, marginRight: 8 },
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.formLabel}
                  >
                    First Name *
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        borderColor:
                          colorScheme === "dark" ? "#444" : "#e5e7eb",
                        backgroundColor:
                          colorScheme === "dark" ? "#333" : "#fff",
                        color: colorScheme === "dark" ? "#fff" : "#333",
                      },
                    ]}
                    placeholder="John"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#888" : "#999"
                    }
                    value={formData.firstName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, firstName: text })
                    }
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </ThemedView>

                <ThemedView
                  style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.formLabel}
                  >
                    Last Name *
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        borderColor:
                          colorScheme === "dark" ? "#444" : "#e5e7eb",
                        backgroundColor:
                          colorScheme === "dark" ? "#333" : "#fff",
                        color: colorScheme === "dark" ? "#fff" : "#333",
                      },
                    ]}
                    placeholder="Doe"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#888" : "#999"
                    }
                    value={formData.lastName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, lastName: text })
                    }
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </ThemedView>
              </ThemedView>
            )}

            {/* Email */}
            <ThemedView style={styles.formGroup}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.formLabel}
              >
                Email Address *
              </ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    borderColor:
                      colorScheme === "dark" ? "#444" : "#e5e7eb",
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#fff",
                    color: colorScheme === "dark" ? "#fff" : "#333",
                  },
                ]}
                placeholder="john@example.com"
                placeholderTextColor={
                  colorScheme === "dark" ? "#888" : "#999"
                }
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </ThemedView>

            {/* Password */}
            <ThemedView style={styles.formGroup}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.formLabel}
              >
                Password * {!isLogin && "(min 6 characters)"}
              </ThemedText>
              <ThemedView style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      borderColor:
                        colorScheme === "dark" ? "#444" : "#e5e7eb",
                      backgroundColor:
                        colorScheme === "dark" ? "#333" : "#fff",
                      color: colorScheme === "dark" ? "#fff" : "#333",
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#888" : "#999"
                  }
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colorScheme === "dark" ? "#888" : "#666"}
                  />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            {/* Confirm Password for Signup */}
            {!isLogin && (
              <ThemedView style={styles.formGroup}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Confirm Password *
                </ThemedText>
                <ThemedView style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      {
                        borderColor:
                          colorScheme === "dark" ? "#444" : "#e5e7eb",
                        backgroundColor:
                          colorScheme === "dark" ? "#333" : "#fff",
                        color: colorScheme === "dark" ? "#fff" : "#333",
                      },
                    ]}
                    placeholder="Confirm your password"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#888" : "#999"
                    }
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        confirmPassword: text,
                      })
                    }
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    disabled={loading}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color={colorScheme === "dark" ? "#888" : "#666"}
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            )}

            {/* Terms Agreement for Signup */}
            {!isLogin && (
              <ThemedView style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      agreeToTerms: !formData.agreeToTerms,
                    })
                  }
                  disabled={loading}
                >
                  <ThemedView
                    style={[
                      styles.checkbox,
                      formData.agreeToTerms && styles.checkedCheckbox,
                    ]}
                  >
                    {formData.agreeToTerms && (
                      <Ionicons
                        name={"checkmark" as IoniconsName}
                        size={16}
                        color="white"
                      />
                    )}
                  </ThemedView>
                  <ThemedText type="default" style={styles.termsText}>
                    I agree to the{" "}
                    <ThemedText type="link" style={styles.termsLink}>
                      Terms of Service
                    </ThemedText>{" "}
                    and{" "}
                    <ThemedText type="link" style={styles.termsLink}>
                      Privacy Policy
                    </ThemedText>
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}

            {/* Forgot Password for Login */}
            {isLogin && (
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <ThemedText
                  type="link"
                  style={styles.forgotPasswordText}
                >
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.submitButtonText}
                >
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </ThemedText>
              ) : (
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.submitButtonText}
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </ThemedText>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <ThemedView style={styles.dividerContainer}>
              <ThemedView style={styles.dividerLine} />
              <ThemedText type="default" style={styles.dividerText}>
                or continue with
              </ThemedText>
              <ThemedView style={styles.dividerLine} />
            </ThemedView>

            {/* Social Login Buttons */}
            <ThemedView style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  loading && styles.socialButtonDisabled,
                ]}
                onPress={() => handleSocialLogin("Google")}
                disabled={loading}
              >
                <ThemedText style={styles.socialButtonEmoji}>
                  🔍
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.socialButtonText}
                >
                  Google
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Switch Mode */}
            <ThemedView style={styles.switchModeContainer}>
              <ThemedText type="default" style={styles.switchModeText}>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </ThemedText>
              <TouchableOpacity onPress={switchMode} disabled={loading}>
                <ThemedText
                  type="link"
                  style={[
                    styles.switchModeLink,
                    loading && styles.disabledText,
                  ]}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "transparent",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    opacity: 0.7,
  },
  formContainer: {
    backgroundColor: "transparent",
  },
  formGroup: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "black",
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 52,
  },
  nameRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 52,
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  termsContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(128, 128, 128, 0.3)",
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: THEME_COLOR,
    borderColor: THEME_COLOR,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    opacity: 0.8,
  },
  termsLink: {
    color: THEME_COLOR,
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: THEME_COLOR,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(128, 128, 128, 0.3)",
  },
  dividerText: {
    fontSize: 14,
    opacity: 0.6,
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
    backgroundColor: "transparent",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.3)",
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  socialButtonEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
  },
  switchModeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  switchModeText: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 4,
  },
  switchModeLink: {
    fontSize: 14,
    color: THEME_COLOR,
    fontWeight: "600",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.5,
  },
  devTools: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  devButton: {
    padding: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
  devButtonText: {
    color: "white",
    fontSize: 12,
  },
});
