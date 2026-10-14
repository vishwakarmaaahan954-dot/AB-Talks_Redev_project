import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function TopProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setProgress(15);

      const t1 = setTimeout(() => setProgress(45), 150);
      const t2 = setTimeout(() => setProgress(75), 350);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setProgress((prev) => (prev > 0 ? 100 : prev));
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-emerald-400 to-teal-300 shadow-[0_0_12px_oklch(0.735_0.157_156_/_80%)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
