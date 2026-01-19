import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
