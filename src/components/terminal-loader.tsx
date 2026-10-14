import { useTheme } from "./theme-provider";

export function TerminalLoader({
  message = "Loading...",
  fullScreen = false,
}: {
  message?: string;
  fullScreen?: boolean;
}) {
  const { theme } = useTheme();

  const content = (
    <div className="terminal-loader shadow-2xl">
      <div className="terminal-header">
        <div className="terminal-title">Status</div>
        <div className="terminal-controls">
          <div className="control close" />
          <div className="control minimize" />
          <div className="control maximize" />
        </div>
      </div>
      <div className="text">{message}</div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        aria-live="polite"
        aria-label="Loading page"
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${
          theme === "light"
            ? "bg-background/90 backdrop-blur-md"
            : "bg-black/90 backdrop-blur-md"
        }`}
      >
        {content}
        <p className="mt-4 text-xs font-mono text-muted-foreground animate-pulse">
          ABTalks · Fetching public proof data...
        </p>
      </div>
    );
  }

  return content;
}
