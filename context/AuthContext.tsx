import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../config/firebase";
import ApiService from "../services/api";

interface AuthContextType {
  currentUser: User | null;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update Firebase profile
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Create user profile in MongoDB
    try {
      await ApiService.createProfile({
        firstName,
        lastName,
        preferences: {},
      });
      console.log("User profile created in MongoDB");
    } catch (error) {
      console.error("Failed to create user profile:", error);
      // Don't throw here - user is still created in Firebase
    }

    return userCredential;
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // If user logged in, ensure profile exists in MongoDB
      if (user) {
        try {
          await ApiService.getProfile();
          console.log("User profile exists in MongoDB");
        } catch (error) {
          console.log("Creating user profile in MongoDB...");
          try {
            const [firstName, lastName] = (
              user.displayName || ""
            ).split(" ");
            await ApiService.createProfile({
              firstName: firstName || "",
              lastName: lastName || "",
              preferences: {},
            });
          } catch (profileError) {
            console.error("Failed to create profile:", profileError);
          }
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
