import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";
import { getUserById } from "../api/mockApi";

interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  currency: string;
}

interface AuthContextType {
  user: any;
  userRole: "freelancer" | "client" | null;
  userPreferences: UserPreferences;
  isEmailVerified: boolean;
  isLoading: boolean;
  error: string | null;
  profileCompleted: boolean;
  login: (userData: any) => void;
  logout: () => void;
  updateUserRole: (role: "freelancer" | "client") => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setProfileCompleted: (completed: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  theme: "light",
  language: "mn",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  currency: "MNT",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [userRole, setUserRole] = useState<"freelancer" | "client" | null>(
    null,
  );
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Load user preferences and role from localStorage or API
  useEffect(() => {
    if (clerkUser && isLoaded) {
      const loadUserData = async () => {
        try {
          // Step 1: Persist user data from Clerk to database (upsert to ensure sync)
          await supabase.from("users").upsert({
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || "Unknown User",
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            avatar: clerkUser.imageUrl || "/default-avatar.jpg",
          });
          console.log("User upserted to Supabase");

          // Step 2: Fetch user data from database
          const userData = await getUserById(clerkUser.id);
          setUser(userData);

          // Step 3: Load from localStorage
          const savedRole = localStorage.getItem(`userRole_${clerkUser.id}`);
          const savedPreferences = localStorage.getItem(
            `userPreferences_${clerkUser.id}`,
          );
          const savedProfileCompleted = localStorage.getItem(
            `profileCompleted_${clerkUser.id}`,
          );

          if (savedRole) {
            setUserRole(savedRole as "freelancer" | "client");
          } else {
            setUserRole(null);
          }

          if (savedPreferences) {
            setUserPreferences({
              ...defaultPreferences,
              ...JSON.parse(savedPreferences),
            });
          }

          if (savedProfileCompleted) {
            setProfileCompleted(savedProfileCompleted === "true");
          } else {
            setProfileCompleted(false);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          setError("Failed to load user data");
        } finally {
          setIsLoading(false);
        }
      };

      loadUserData();
    } else if (isLoaded) {
      // User is not authenticated
      setUser(null);
      setIsLoading(false);
    }
  }, [clerkUser, isLoaded]);

  const login = (userData: any) => {
    // Not needed with Clerk, but can be used for additional logic
    console.log("User logged in:", userData);
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut();
      // Clear local data
      setUserRole(null);
      setUserPreferences(defaultPreferences);
      if (clerkUser) {
        localStorage.removeItem(`userRole_${clerkUser.id}`);
        localStorage.removeItem(`userPreferences_${clerkUser.id}`);
        localStorage.removeItem(`profileCompleted_${clerkUser.id}`);
      }
      setUser(null);
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Failed to logout");
    }
  };

  const updateUserRole = async (role: "freelancer" | "client") => {
    try {
      setUserRole(role);
      if (clerkUser) {
        localStorage.setItem(`userRole_${clerkUser.id}`, role);
        // In a real app, update this in your database
        // await updateUserRole(clerkUser.id, role);
      }
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role");
    }
  };

  const updateUserPreferences = async (
    preferences: Partial<UserPreferences>,
  ) => {
    try {
      const updatedPreferences = { ...userPreferences, ...preferences };
      setUserPreferences(updatedPreferences);
      if (clerkUser) {
        localStorage.setItem(
          `userPreferences_${clerkUser.id}`,
          JSON.stringify(updatedPreferences),
        );
        // In a real app, update this in your database
        // await updateUserPreferences(clerkUser.id, updatedPreferences);
      }
    } catch (err) {
      console.error("Error updating user preferences:", err);
      setError("Failed to update preferences");
    }
  };

  const refreshUser = async () => {
    try {
      if (clerkUser) {
        // Fetch fresh user data from database
        const freshUserData = await getUserById(clerkUser.id);
        setUser(freshUserData);
        console.log("User data refreshed");
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError("Failed to refresh user data");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleSetProfileCompleted = (completed: boolean) => {
    setProfileCompleted(completed);
    if (clerkUser) {
      localStorage.setItem(
        `profileCompleted_${clerkUser.id}`,
        String(completed),
      );
    }
  };

  const isEmailVerified =
    clerkUser?.emailAddresses?.[0]?.verification?.status === "verified";

  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        userPreferences,
        isEmailVerified,
        isLoading,
        error,
        profileCompleted,
        login,
        logout,
        updateUserRole,
        updateUserPreferences,
        refreshUser,
        clearError,
        setProfileCompleted: handleSetProfileCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
