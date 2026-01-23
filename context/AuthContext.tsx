import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";

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
  const { user, isLoaded } = useUser();
  const { signOut, user: clerkUser } = useClerk();
  const [userRole, setUserRole] = useState<"freelancer" | "client" | null>(
    null,
  );
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Load user preferences and role from localStorage or API
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // Load from localStorage first
          const savedRole = localStorage.getItem(`userRole_${user.id}`);
          const savedPreferences = localStorage.getItem(
            `userPreferences_${user.id}`,
          );
          const savedProfileCompleted = localStorage.getItem(
            `profileCompleted_${user.id}`,
          );

          if (savedRole) {
            setUserRole(savedRole as "freelancer" | "client");
          } else {
            // If no role set, prompt user to choose
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
            // New users haven't completed their profile
            setProfileCompleted(false);
          }

          // Upsert user to Supabase
          try {
            await supabase.from("users").upsert({
              id: user.id,
              name: user.username || user.fullName || "Unknown User",
              email: user.emailAddresses[0]?.emailAddress || "",
              avatar: user.imageUrl || "/default-avatar.jpg",
            });
            console.log("User upserted to Supabase");
          } catch (err) {
            console.error("Error upserting user to Supabase:", err);
          }

          // In a real app, you might fetch additional user data from your API here
          // const userData = await getUserById(user.id);
          // setUserRole(userData.role);
          // setUserPreferences(userData.preferences);
        } catch (err) {
          console.error("Error loading user data:", err);
          setError("Failed to load user data");
        } finally {
          setIsLoading(false);
        }
      };

      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

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
      localStorage.removeItem(`userRole_${user?.id}`);
      localStorage.removeItem(`userPreferences_${user?.id}`);
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Failed to logout");
    }
  };

  const updateUserRole = async (role: "freelancer" | "client") => {
    try {
      setUserRole(role);
      if (user) {
        localStorage.setItem(`userRole_${user.id}`, role);
        // In a real app, update this in your database
        // await updateUserRole(user.id, role);
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
      if (user) {
        localStorage.setItem(
          `userPreferences_${user.id}`,
          JSON.stringify(updatedPreferences),
        );
        // In a real app, update this in your database
        // await updateUserPreferences(user.id, updatedPreferences);
      }
    } catch (err) {
      console.error("Error updating user preferences:", err);
      setError("Failed to update preferences");
    }
  };

  const refreshUser = async () => {
    try {
      // In a real app, refetch user data from API
      // const freshUserData = await getUserById(user.id);
      // Update local state with fresh data
      console.log("User data refreshed");
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
    if (user) {
      localStorage.setItem(`profileCompleted_${user.id}`, String(completed));
    }
  };

  const isEmailVerified =
    user?.emailAddresses?.[0]?.verification?.status === "verified";

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
