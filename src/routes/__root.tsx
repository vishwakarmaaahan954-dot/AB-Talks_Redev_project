import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../components/theme-provider";
import { RetroTV404 } from "../components/retro-tv-404";
import { useNetworkStatus } from "../hooks/use-network-status";
import { TopProgressBar } from "../components/top-progress-bar";
import { SpringoAI } from "../components/springo-ai";
import { AuthProvider } from "../lib/auth-context";

function NotFoundComponent() {
  return (
    <RetroTV404
      title="404 — Page Not Found"
      subtitle="The URL you are looking for has been moved or does not exist."
    />
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <RetroTV404
      title="Signal Interrupted"
      subtitle="An unexpected error occurred while loading this page."
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ABTalks — Build Your Edge" },
      {
        name: "description",
        content:
          "ABTalks is a 60-day public build challenge: learn, build, prove and share your work every day.",
      },
      { name: "author", content: "ABTalks" },
      { name: "theme-color", content: "#121212" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Dela+Gothic+One&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isOnline = useNetworkStatus();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TopProgressBar />
          {/* Network offline screen fallback */}
          {!isOnline ? (
            <RetroTV404
              isOffline
              title="Network Connection Lost"
              subtitle="You are currently offline. Please check your internet connection."
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <Outlet />
              <SpringoAI />
            </>
          )}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
