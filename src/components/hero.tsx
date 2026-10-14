import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { WorkspaceVisual } from "./workspace-visual";
import { Tilt3DCard } from "./tilt-3d-card";
import { heroPhrases, platformStats } from "@/data/abtalks";
import { useIsDesktop, useReducedMotion, useScrollProgress } from "@/hooks/use-motion";

function RotatingPhrase() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % heroPhrases.length;
      });
    }, 2800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative inline-grid h-[1.25em] overflow-hidden align-bottom">
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap px-1">
        {heroPhrases.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      {heroPhrases.map((phrase, i) => {
        const isActive = i === index;
        const isPrev = i === prevIndex;
        if (!isActive && !isPrev) return null;

        return (
          <span
            key={phrase}
            aria-hidden={!isActive}
            className="col-start-1 row-start-1 whitespace-nowrap text-primary px-1 font-bold"
            style={{
              animation: isActive
                ? "slide-up-blur-in 0.6s cubic-bezier(0.16,1,0.3,1) both"
                : "slide-up-blur-out 0.5s cubic-bezier(0.16,1,0.3,1) both",
              zIndex: isActive ? 2 : 1,
            }}
          >
            {phrase}
          </span>
        );
      })}
    </span>
  );
}

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const isDesktop = useIsDesktop();

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:pt-40 lg:pb-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div className="relative z-10">
          <div className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
            <span className="label-mono text-[10px]">60-day public build challenge</span>
          </div>

          <h1 className="mt-6 text-[clamp(2.6rem,11vw,4rem)] leading-[0.96] font-bold lg:text-[4.4rem]">
            <span className="text-gradient block">BUILD YOUR</span>
            <span className="block">EDGE.</span>
          </h1>

          <p className="font-display mt-5 text-2xl font-semibold sm:text-3xl">
            Build <RotatingPhrase />
          </p>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            ABTalks is an exciting 60-day challenge helping students code every day, share real
            proof on GitHub and LinkedIn, track streaks, get AI guidance, and build verified
            job-ready portfolios!
          </p>

          <dl className="mt-9 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:gap-6">
            {platformStats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dd>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="block text-xl leading-none font-bold sm:text-2xl"
                  />
                </dd>
                <dt className="mt-1.5 truncate text-[11px] text-muted-foreground sm:text-xs">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          <p className="mt-6 flex items-center gap-2 text-[13px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Every day is verified by a GitHub commit and a public post.
          </p>
        </div>

        <div className="relative lg:pl-4">
          <Tilt3DCard maxTilt={10}>
            <WorkspaceVisual progress={isDesktop ? progress : 0} />
          </Tilt3DCard>
        </div>
      </div>

    </section>
  );
}
