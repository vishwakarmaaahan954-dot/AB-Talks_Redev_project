import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  AuthUser,
  OAuthProvider,
  OAUTH_PROVIDERS,
  DEMO_BUILDERS,
  buildOAuthAuthorizationUrl,
  getOAuthState,
  clearOAuthState,
  isOAuthProviderConfigured,
  saveOAuthState,
  generateRandomString,
} from "./oauth-config";

const LOCAL_STORAGE_USER_KEY = "abtalks_user";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithOAuth: (
    provider: OAuthProvider,
    options?: {
      returnTo?: string;
      customClientId?: string;
      forcePrompt?: boolean;
      simulateSandbox?: boolean;
    }
  ) => Promise<{ redirected?: boolean; success?: boolean }>;
  handleOAuthCallback: (params: {
    code?: string;
    state?: string;
    error?: string;
    error_description?: string;
  }) => Promise<{ success: boolean; error?: string; user?: AuthUser; returnTo?: string }>;
  loginWithEmail: (email: string, password?: string) => Promise<AuthUser>;
  registerWithEmail: (name: string, email: string, password?: string) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  isConfigured: (provider: OAuthProvider, customClientId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync auth state from localStorage
  const loadUserFromStorage = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.loggedIn) {
          const formattedUser: AuthUser = {
            id: parsed.id || `user_${Date.now()}`,
            name: parsed.name || "Builder",
            email: parsed.email || "builder@abtalks.dev",
            avatarUrl: parsed.avatarUrl,
            provider: parsed.provider || "email",
            githubUsername: parsed.githubUsername,
            streak: typeof parsed.streak === "number" ? parsed.streak : 0,
            currentDay: typeof parsed.currentDay === "number" ? parsed.currentDay : 1,
            loggedIn: true,
            joinedAt: parsed.joinedAt || new Date().toISOString(),
            isFirstTime: parsed.isFirstTime ?? false,
            accessToken: parsed.accessToken,
            providerData: parsed.providerData,
          };
          setUser(formattedUser);
          return;
        }
      }
      setUser(null);
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
    const handleAuthChange = () => loadUserFromStorage();
    window.addEventListener("abtalks_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("abtalks_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [loadUserFromStorage]);

  const saveUser = useCallback((newUser: AuthUser | null) => {
    if (typeof window === "undefined") return;
    if (newUser) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setUser(null);
    }
    window.dispatchEvent(new Event("abtalks_auth_change"));
  }, []);

  const isConfigured = useCallback((provider: OAuthProvider, customClientId?: string) => {
    return isOAuthProviderConfigured(provider, customClientId);
  }, []);

  /**
   * Initiates the OAuth flow:
   * If a real client ID is configured and sandbox is not forced, redirects to provider.
   * If in sandbox mode or no client ID configured, simulates completion with demo profile.
   */
  const loginWithOAuth = useCallback(
    async (
      provider: OAuthProvider,
      options?: {
        returnTo?: string;
        customClientId?: string;
        forcePrompt?: boolean;
        simulateSandbox?: boolean;
      }
    ) => {
      const configured = isConfigured(provider, options?.customClientId);

      // If configured and not explicitly forcing sandbox, redirect to the real OAuth provider
      if (configured && !options?.simulateSandbox) {
        const { url } = await buildOAuthAuthorizationUrl(provider, options);
        if (typeof window !== "undefined") {
          window.location.href = url;
          return { redirected: true };
        }
      }

      // Fallback / Demo Sandbox Flow:
      // Simulates real OAuth callback by creating state and completing authentication
      const demoData = DEMO_BUILDERS[provider];
      const state = generateRandomString(32);
      saveOAuthState({
        state,
        codeVerifier: generateRandomString(64),
        provider,
        returnTo: options?.returnTo || "/dashboard",
        createdAt: Date.now(),
        customClientId: options?.customClientId,
      });

      const authenticatedUser: AuthUser = {
        ...demoData,
        loggedIn: true,
        streak: user?.streak || 0,
        currentDay: user?.currentDay || 1,
        joinedAt: user?.joinedAt || new Date().toISOString(),
        isFirstTime: !user,
      };

      saveUser(authenticatedUser);
      clearOAuthState();
      return { success: true };
    },
    [isConfigured, saveUser, user]
  );

  /**
   * Handles the return from an OAuth redirect (code, state, errors)
   */
  const handleOAuthCallback = useCallback(
    async (params: {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    }): Promise<{ success: boolean; error?: string; user?: AuthUser; returnTo?: string }> => {
      const { code, state, error, error_description } = params;

      if (error) {
        clearOAuthState();
        return {
          success: false,
          error: error_description || error || "Authentication request was denied or cancelled.",
        };
      }

      const storedState = getOAuthState();
      if (!storedState) {
        return {
          success: false,
          error: "OAuth session expired or invalid state. Please try logging in again.",
        };
      }

      if (state && storedState.state !== state) {
        clearOAuthState();
        return {
          success: false,
          error: "CSRF state validation failed. The authentication response could not be verified.",
        };
      }

      const provider = storedState.provider;
      const demoFallback = DEMO_BUILDERS[provider];

      // In client-only or server environment, hydrate the authenticated user
      const authenticatedUser: AuthUser = {
        id: `${provider}_user_${Date.now()}`,
        name: demoFallback.name,
        email: demoFallback.email,
        avatarUrl: demoFallback.avatarUrl,
        provider,
        githubUsername: demoFallback.githubUsername,
        loggedIn: true,
        streak: user?.streak || 0,
        currentDay: user?.currentDay || 1,
        joinedAt: new Date().toISOString(),
        isFirstTime: true,
        accessToken: code ? `token_${code.substring(0, 16)}` : undefined,
        providerData: {
          ...demoFallback.providerData,
          authCode: code,
          authenticatedWith: provider,
        },
      };

      saveUser(authenticatedUser);
      const returnTo = storedState.returnTo || "/dashboard";
      clearOAuthState();

      return {
        success: true,
        user: authenticatedUser,
        returnTo,
      };
    },
    [saveUser, user]
  );

  const loginWithEmail = useCallback(
    async (email: string): Promise<AuthUser> => {
      const nameGuess = email.split("@")[0] || "Builder";
      const formattedName = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1);
      const authenticatedUser: AuthUser = {
        id: `email_${Date.now()}`,
        name: formattedName,
        email,
        provider: "email",
        loggedIn: true,
        streak: user?.streak || 0,
        currentDay: user?.currentDay || 1,
        joinedAt: user?.joinedAt || new Date().toISOString(),
        isFirstTime: false,
      };
      saveUser(authenticatedUser);
      return authenticatedUser;
    },
    [saveUser, user]
  );

  const registerWithEmail = useCallback(
    async (name: string, email: string): Promise<AuthUser> => {
      const authenticatedUser: AuthUser = {
        id: `email_${Date.now()}`,
        name: name.trim() || "Builder",
        email: email.trim(),
        provider: "email",
        loggedIn: true,
        streak: 0,
        currentDay: 1,
        joinedAt: new Date().toISOString(),
        isFirstTime: true,
      };
      saveUser(authenticatedUser);
      return authenticatedUser;
    },
    [saveUser]
  );

  const logout = useCallback(() => {
    saveUser(null);
    clearOAuthState();
  }, [saveUser]);

  const updateUser = useCallback(
    (updates: Partial<AuthUser>) => {
      if (!user) return;
      const updated = { ...user, ...updates };
      saveUser(updated);
    },
    [saveUser, user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.loggedIn),
      isLoading,
      loginWithOAuth,
      handleOAuthCallback,
      loginWithEmail,
      registerWithEmail,
      logout,
      updateUser,
      isConfigured,
    }),
    [
      user,
      isLoading,
      loginWithOAuth,
      handleOAuthCallback,
      loginWithEmail,
      registerWithEmail,
      logout,
      updateUser,
      isConfigured,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

