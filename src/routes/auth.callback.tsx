import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Terminal, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Authenticating — ABTalks OAuth 2.0" },
      { name: "description", content: "Completing OAuth 2.0 PKCE authentication handshake for ABTalks." },
    ],
  }),
  component: AuthCallbackPage,
});

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING OAUTH 2.0 PKCE HANDSHAKE...",
  ]);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current || typeof window === "undefined") return;
    handledRef.current = true;

    const processAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get("code") || undefined;
        let state = urlParams.get("state") || undefined;
        const error = urlParams.get("error") || undefined;
        const errorDescription = urlParams.get("error_description") || undefined;

        // Check hash parameters if implicit or token flow
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (!code && hashParams.has("access_token")) {
            code = hashParams.get("access_token") || undefined;
          }
          if (!state && hashParams.has("state")) {
            state = hashParams.get("state") || undefined;
          }
        }

        setLogs((prev) => [...prev, "PARSING URL PARAMETERS & VERIFYING ANTI-CSRF TOKEN..."]);

        // Small pause for visual feedback
        await new Promise((r) => setTimeout(r, 600));

        setLogs((prev) => [...prev, "VALIDATING SECURE STATE & VERIFIER AGAINST CACHE..."]);
        await new Promise((r) => setTimeout(r, 500));

        const result = await handleOAuthCallback({
          code,
          state,
          error,
          error_description: errorDescription,
        });

        if (result.success && result.user) {
          setLogs((prev) => [
            ...prev,
            `IDENTITY VERIFIED: ${result.user?.name.toUpperCase()} (${result.user?.provider.toUpperCase()})`,
            "BUILDER PROFILE HYDRATED. REDIRECTING TO DASHBOARD...",
          ]);
          setStatus("success");
          setTimeout(() => {
            navigate({ to: result.returnTo || "/dashboard" });
          }, 900);
        } else {
          setStatus("error");
          setErrorMessage(result.error || "OAuth authentication could not be completed.");
          setLogs((prev) => [
            ...prev,
            `HANDSHAKE FAILED: ${result.error || "Authentication denied"}`,
          ]);
        }
      } catch (err: unknown) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Unexpected authentication failure";
        setErrorMessage(msg);
        setLogs((prev) => [...prev, `FATAL ERROR: ${msg}`]);
      }
    };

    processAuth();
  }, [handleOAuthCallback, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6">
      <AmbientBackdrop />

      {/* Main Status Container */}
      <div className="card-surface glass-panel relative w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

        {/* Status Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-lg">
          {status === "loading" && (
            <RefreshCw className="h-7 w-7 text-primary animate-spin" />
          )}
          {status === "success" && (
            <ShieldCheck className="h-7 w-7 text-emerald-400 animate-pop-in" />
          )}
          {status === "error" && (
            <AlertCircle className="h-7 w-7 text-destructive animate-pop-in" />
          )}
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">
            {status === "loading" && "Authenticating with OAuth 2.0"}
            {status === "success" && "Authentication Successful!"}
            {status === "error" && "Authentication Failed"}
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {status === "loading" && "Securing authorization tokens and verifying builder credentials."}
            {status === "success" && "Welcome aboard. You are now verified and logged in."}
            {status === "error" && (errorMessage || "The authorization request could not be completed.")}
          </p>
        </div>

        {/* Retro Terminal Logs Display */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/90 bg-black/60 p-4 font-mono text-[11px] shadow-inner">
          <div className="flex items-center gap-1.5 pb-2.5 border-b border-border/40 text-muted-foreground text-[10px]">
            <Terminal className="h-3 w-3 text-primary" />
            <span>ABTALKS_AUTH_PROTOCOL // PKCE</span>
          </div>
          <div className="mt-2.5 space-y-1.5 min-h-[90px]">
            {logs.map((log) => (
              <p
                key={log}
                className={`truncate ${
                  log.includes("FAILED") || log.includes("ERROR")
                    ? "text-rose-400"
                    : log.includes("VERIFIED") || log.includes("HYDRATED")
                    ? "text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                &gt; {log}
              </p>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6">
          {status === "success" && (
            <Link
              to="/dashboard"
              className="golden-glow-btn h-12 w-full flex items-center justify-center"
            >
              <span className="golden-glow-btn-inner text-sm font-extrabold flex items-center justify-center gap-2">
                Continue to Dashboard
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )}

          {status === "error" && (
            <div className="flex flex-col gap-2.5">
              <Link
                to="/login"
                className="golden-glow-btn h-12 w-full flex items-center justify-center"
              >
                <span className="golden-glow-btn-inner text-sm font-extrabold flex items-center justify-center gap-2">
                  Return to Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                to="/"
                className="text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

