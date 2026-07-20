import { createContext, useContext, type ReactNode } from "react";

type AuthSessionContextValue = {
  isAuthenticated: boolean;
};

const authSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

type AuthSessionProviderProps = AuthSessionContextValue & {
  children: ReactNode;
};

export function AuthSessionProvider({ children, isAuthenticated }: AuthSessionProviderProps) {
  return (
    <authSessionContext.Provider value={{ isAuthenticated }}>
      {children}
    </authSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(authSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
