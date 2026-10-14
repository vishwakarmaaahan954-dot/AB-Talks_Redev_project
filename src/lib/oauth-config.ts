/**
 * ABTalks OAuth 2.0 & PKCE Configuration
 * 
 * Supports both GitHub OAuth 2.0 and Google OAuth 2.0 with PKCE (Proof Key for Code Exchange).
 * When VITE_GITHUB_CLIENT_ID or VITE_GOOGLE_CLIENT_ID are configured in environment variables,
 * live OAuth redirection to the providers is performed.
 * A developer-friendly sandbox mode with full OAuth consent preview is provided when credentials
 * are being set up.
 */

export type OAuthProvider = "github" | "google";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: "github" | "google" | "email";
  githubUsername?: string;
  streak: number;
  currentDay: number;
  loggedIn: boolean;
  joinedAt: string;
  isFirstTime: boolean;
  accessToken?: string;
  providerData?: Record<string, unknown>;
}

export interface ProviderConfig {
  name: string;
  clientId: string;
  authorizeUrl: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  scopes: string[];
  responseType: string;
}

export const OAUTH_PROVIDERS: Record<OAuthProvider, ProviderConfig> = {
  github: {
    name: "GitHub",
    clientId: (typeof import.meta !== "undefined" && import.meta.env?.VITE_GITHUB_CLIENT_ID) || "",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    scopes: ["read:user", "user:email", "repo"],
    responseType: "code",
  },
  google: {
    name: "Google",
    clientId: (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || "",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: ["openid", "profile", "email"],
    responseType: "code",
  },
};

export const DEMO_BUILDERS: Record<OAuthProvider, Omit<AuthUser, "loggedIn" | "joinedAt" | "streak" | "currentDay" | "isFirstTime">> = {
  github: {
    id: "gh_builder_42819",
    name: "Sudarsh Vimal",
    email: "sudarsh.vimal@github.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    provider: "github",
    githubUsername: "sudarshvimal",
    providerData: {
      login: "sudarshvimal",
      bio: "Fullstack dev & open-source builder. #ABTalks 60-day challenge participant.",
      public_repos: 24,
      followers: 182,
    },
  },
  google: {
    id: "goog_builder_91823",
    name: "Aahan Sharma",
    email: "aahan.builder@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    provider: "google",
    providerData: {
      email_verified: true,
      locale: "en",
    },
  },
};

/**
 * Returns the current application's OAuth callback URI
 */
export function getOAuthCallbackUri(): string {
  if (typeof window === "undefined") {
    return "/auth/callback";
  }
  return `${window.location.origin}/auth/callback`;
}

/**
 * Checks whether an OAuth provider has a valid Client ID configured
 */
export function isOAuthProviderConfigured(provider: OAuthProvider, customClientId?: string): boolean {
  if (customClientId && customClientId.trim().length > 0) return true;
  const config = OAUTH_PROVIDERS[provider];
  return Boolean(config && config.clientId && config.clientId.trim().length > 0);
}

/**
 * Generates a high-entropy cryptographically secure random string
 */
export function generateRandomString(length = 40): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
    return Array.from(array, (b) => charset[b % charset.length]).join("");
  }
  // Fallback
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Generates a PKCE code challenge from a code verifier (SHA-256)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return verifier;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export interface StoredOAuthState {
  state: string;
  codeVerifier: string;
  provider: OAuthProvider;
  returnTo: string;
  createdAt: number;
  customClientId?: string;
}

const STORAGE_KEY = "abtalks_oauth_state";

/**
 * Saves OAuth state in sessionStorage with timestamp to guard against CSRF attacks
 */
export function saveOAuthState(oauthState: StoredOAuthState): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(oauthState));
  } catch (e) {
    console.error("Failed to store OAuth state in sessionStorage:", e);
  }
}

/**
 * Retrieves and validates the stored OAuth state
 */
export function getOAuthState(): StoredOAuthState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredOAuthState;
    // Expire state after 15 minutes to prevent replay attacks
    const isExpired = Date.now() - parsed.createdAt > 15 * 60 * 1000;
    if (isExpired) {
      clearOAuthState();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Clears OAuth state after callback handling
 */
export function clearOAuthState(): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear OAuth state:", e);
  }
}

/**
 * Constructs the authorization URL for GitHub or Google OAuth 2.0
 */
export async function buildOAuthAuthorizationUrl(
  provider: OAuthProvider,
  options?: { returnTo?: string; customClientId?: string; forcePrompt?: boolean }
): Promise<{ url: string; state: string; codeVerifier: string }> {
  const config = OAUTH_PROVIDERS[provider];
  const clientId = options?.customClientId?.trim() || config.clientId;
  const redirectUri = getOAuthCallbackUri();
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Persist state for verification upon callback
  saveOAuthState({
    state,
    codeVerifier,
    provider,
    returnTo: options?.returnTo || "/dashboard",
    createdAt: Date.now(),
    customClientId: options?.customClientId,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: config.responseType,
    scope: config.scopes.join(" "),
    state,
  });

  if (provider === "google") {
    params.set("code_challenge", codeChallenge);
    params.set("code_challenge_method", "S256");
    params.set("access_type", "offline");
    if (options?.forcePrompt) {
      params.set("prompt", "consent select_account");
    }
  } else if (provider === "github") {
    params.set("allow_signup", "true");
  }

  const url = `${config.authorizeUrl}?${params.toString()}`;
  return { url, state, codeVerifier };
}

