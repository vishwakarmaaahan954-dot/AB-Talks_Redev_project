import React, { useState } from "react";
import {
  Github,
  Shield,
  Key,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { OAuthProvider, OAUTH_PROVIDERS, DEMO_BUILDERS, getOAuthCallbackUri } from "@/lib/oauth-config";
import { useAuth } from "@/hooks/use-auth";

interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider: OAuthProvider;
  onSuccess: () => void;
}

export function OAuthModal({
  isOpen,
  onClose,
  selectedProvider,
  onSuccess,
}: OAuthModalProps) {
  const { isConfigured, loginWithOAuth } = useAuth();
  const [tab, setTab] = useState<"consent" | "setup">("consent");
  const [copied, setCopied] = useState(false);
  const [customClientId, setCustomClientId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const callbackUri = getOAuthCallbackUri();
  const providerConfig = OAUTH_PROVIDERS[selectedProvider];
  const isLiveConfigured = isConfigured(selectedProvider, customClientId);
  const demoProfile = DEMO_BUILDERS[selectedProvider];

  const handleCopyCallback = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(callbackUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLiveRedirect = async () => {
    setIsSubmitting(true);
    try {
      await loginWithOAuth(selectedProvider, {
        customClientId: customClientId.trim() || undefined,
        simulateSandbox: false,
      });
    } catch (err) {
      console.error("Live OAuth redirect error:", err);
      setIsSubmitting(false);
    }
  };

  const handleSimulateConsent = async () => {
    setIsSubmitting(true);
    try {
      await loginWithOAuth(selectedProvider, {
        simulateSandbox: true,
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Sandbox OAuth error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/30 bg-background/95 p-6 shadow-2xl glass-panel text-foreground sm:p-8">
        {/* Specular Edge Highlight */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

        {/* Header & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/40 bg-primary/15 text-primary">
              {selectedProvider === "github" ? (
                <Github className="h-5 w-5" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight capitalize">
                {providerConfig.name} OAuth 2.0 Authentication
              </h2>
              <p className="text-xs text-muted-foreground">
                PKCE Security Handshake & Authorization Flow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 grid grid-cols-2 rounded-xl bg-secondary/60 p-1">
          <button
            type="button"
            onClick={() => setTab("consent")}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              tab === "consent"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            OAuth Consent Flow
          </button>
          <button
            type="button"
            onClick={() => setTab("setup")}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              tab === "setup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Setup & Client Credentials
          </button>
        </div>

        {tab === "consent" ? (
          /* Consent Preview Screen */
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={demoProfile.avatarUrl}
                  alt={demoProfile.name}
                  className="h-12 w-12 rounded-full border border-primary/40 object-cover shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-sm truncate">{demoProfile.name}</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{demoProfile.email}</p>
                  {demoProfile.githubUsername && (
                    <p className="text-[11px] font-mono text-primary truncate">
                      @{demoProfile.githubUsername}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/80 bg-surface/80 p-4 text-xs">
              <p className="font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Shield className="h-3.5 w-3.5 text-primary" /> Permissions requested by ABTalks:
              </p>
              <ul className="space-y-1.5 pt-1 text-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Verify public profile identity & builder avatar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Access verified email for challenge notifications</span>
                </li>
                {selectedProvider === "github" && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Verify repository commits & public daily challenge proofs</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              {isLiveConfigured ? (
                <button
                  type="button"
                  onClick={handleLiveRedirect}
                  disabled={isSubmitting}
                  className="golden-glow-btn h-12 w-full"
                >
                  <span className="golden-glow-btn-inner text-sm font-extrabold">
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#34d399] border-t-transparent" />
                    ) : (
                      <>
                        Continue with Live {providerConfig.name} OAuth
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSimulateConsent}
                    disabled={isSubmitting}
                    className="golden-glow-btn h-12 w-full"
                  >
                    <span className="golden-glow-btn-inner text-sm font-extrabold">
                      {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#34d399] border-t-transparent" />
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Authorize as {demoProfile.name} (Instant Test)
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </span>
                  </button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Tip: Switch to the <button onClick={() => setTab("setup")} className="text-primary underline">Setup tab</button> to connect your own live Client ID.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Developer Setup Screen */
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                OAuth 2.0 Redirect URI (Callback URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={callbackUri}
                  className="w-full font-mono text-xs rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-foreground select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyCallback}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-bold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Custom Client ID (optional override for testing)
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={
                    selectedProvider === "github"
                      ? "Ov23li..."
                      : "xxxx.apps.googleusercontent.com"
                  }
                  value={customClientId}
                  onChange={(e) => setCustomClientId(e.target.value)}
                  className="w-full font-mono text-xs rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Quick guide */}
            <div className="rounded-2xl border border-border/80 bg-surface/60 p-4 text-xs space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-primary text-[11px]">
                <Info className="h-3.5 w-3.5" /> How to configure live credentials:
              </p>
              {selectedProvider === "github" ? (
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to GitHub Developer Settings → OAuth Apps.</li>
                  <li>Click New OAuth App.</li>
                  <li>Set Authorization callback URL to the URI above.</li>
                  <li>Add <code className="text-primary font-mono">VITE_GITHUB_CLIENT_ID</code> to your <code className="text-primary font-mono">.env</code>.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to Google Cloud Console → APIs & Services → Credentials.</li>
                  <li>Create OAuth 2.0 Web Client ID.</li>
                  <li>Add Authorized Redirect URI with the URI above.</li>
                  <li>Add <code className="text-primary font-mono">VITE_GOOGLE_CLIENT_ID</code> to your <code className="text-primary font-mono">.env</code>.</li>
                </ol>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleLiveRedirect}
                disabled={!customClientId.trim() && !isLiveConfigured}
                className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
              >
                Launch Live OAuth Redirect
              </button>
              <button
                type="button"
                onClick={handleSimulateConsent}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Use Sandbox
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

