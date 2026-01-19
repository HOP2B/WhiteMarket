import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const login = (userData: any) => {
    // Not needed with Clerk
  };

  const logout = () => {
    signOut();
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
