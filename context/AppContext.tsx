import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  gigs: any[];
  setGigs: (gigs: any[]) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  return (
    <AppContext.Provider value={{ gigs, setGigs, messages, setMessages }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
