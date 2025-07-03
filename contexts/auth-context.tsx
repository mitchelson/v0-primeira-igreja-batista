"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AUTH_CONFIG } from "@/lib/constants";

// Senha hardcoded para acesso às áreas protegidas
const SENHA_ADMIN = AUTH_CONFIG.ADMIN_PASSWORD;

type AuthContextType = {
  readonly isAuthenticated: boolean;
  readonly login: (password: string) => boolean;
  readonly logout: () => void;
  readonly isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    try {
      const auth = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === SENHA_ADMIN) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, "true");
      } catch (error) {
        console.error("Erro ao salvar autenticação:", error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao remover autenticação:", error);
    }
    router.push("/");
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      isLoading,
    }),
    [isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
