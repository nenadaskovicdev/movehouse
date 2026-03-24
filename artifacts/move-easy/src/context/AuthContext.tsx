import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { AuthUser } from "@workspace/api-client-react";
import { getMe, logout as apiLogout } from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getMe({ credentials: "include" }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const setUser = useCallback(
    (newUser: AuthUser | null) => {
      queryClient.setQueryData(["auth", "me"], newUser);
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await apiLogout({ credentials: "include" });
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
