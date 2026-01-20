import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AppProvider } from "@/context/AppContext";
import RoleSelector from "@/components/RoleSelector";

function AppContent({ Component, pageProps, router }: AppProps) {
  const { user, userRole, isLoading } = useAuth();

  // Show role selector if user is logged in but hasn't selected a role
  if (user && userRole === null && !isLoading) {
    return <RoleSelector />;
  }

  return <Component {...pageProps} />;
}

export default function App(appProps: AppProps) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppProvider>
            <AppContent {...appProps} />
          </AppProvider>
        </NotificationProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
