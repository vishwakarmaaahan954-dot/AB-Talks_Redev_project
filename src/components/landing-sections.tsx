import {
  ArrowRight,
  Flame,
  Trophy,
  Users,
  GitCommitHorizontal,
  Megaphone,
  Code2,
  GitBranch,
  Lock,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/glass-card";
import { Reveal, SectionHeading } from "@/components/reveal";
import { AnimatedCounter, LiveCounter } from "@/components/animated-counter";
import { ProgressRing } from "@/components/progress-ring";
import {
  achievements,
  activity,
  leaderboard,
  milestones,
  platformStats,
  student,
  todayStats,
  whyCards,
  journeySteps,
} from "@/data/abtalks";
import { useInView, useScrollProgress } from "@/hooks/use-motion";
import * as Icons from "lucide-react";

/* ---------------- Why ---------------- */

export function WhySection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="Why ABTalks"
        title={
          <>
            You don't need another course. You need{" "}
            <span className="text-primary">proof that you're learning.</span>
          </>
        }
        subtitle="Certificates pile up. Evidence compounds. ABTalks turns 60 ordinary days into something a recruiter can read in two minutes."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
        {whyCards.map((card, i) => {
          const Icon =
            (Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon] || Icons.Sparkles;
          return (
            <Reveal key={card.title} delay={i * 90}>
              <GlassCard tilt className="h-full p-6 lg:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <span className="label-mono">{card.tag}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold lg:text-[22px]">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Journey ---------------- */

export function JourneySection() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const fill = Math.min(100, Math.max(0, (progress - 0.15) * 190));

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="How the 60-day challenge works"
        title={
          <>
            Learn <span className="text-muted-foreground">→</span> Build{" "}
            <span className="text-muted-foreground">→</span> Prove{" "}
            <span className="text-muted-foreground">→</span> Share
          </>
        }
        subtitle="Every day you get one task. You build it, commit it to GitHub, and post your progress. Sixty repetitions later you have a public learning record instead of a promise."
      />

      <div ref={ref} className="relative mt-12 lg:mt-16">
        {/* vertical line on mobile, horizontal on desktop */}
        <div className="absolute top-0 bottom-0 left-[19px] w-px bg-border lg:top-[38px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto">
          <div
            className="journey-fill h-full w-full grad-primary"
            style={
              {
                clipPath: `inset(0 0 ${100 - fill}% 0)`,
                transition: "clip-path 0.2s linear",
                "--rest": `${100 - fill}%`,
              } as React.CSSProperties
            }
          />
        </div>

        <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
          {journeySteps.map((step, i) => {
            const Icon =
              (Icons as unknown as Record<string, Icons.LucideIcon>)[step.icon] || Icons.Sparkles;
            const reached = fill > i * 25;
            return (
              <Reveal as="li" key={step.num} delay={i * 100} className="relative pl-14 lg:pl-0">
                <span
                  className={`absolute left-0 grid h-10 w-10 place-items-center rounded-full border transition-all duration-500 lg:relative lg:mb-6 ${
                    reached
                      ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_24px_-6px_var(--color-primary)]"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <p className="label-mono">{step.num}</p>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Live stats ---------------- */

const todayIcons = [GitCommitHorizontal, Megaphone, Users];

export function StatsSection() {
  return (
    <section id="challenge" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="Live platform activity"
        title="A challenge that thousands of students are already inside."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
        <GlassCard className="p-6 lg:p-8">
          <p className="label-mono">All time</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {platformStats.map((stat) => (
              <div key={stat.label}>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="block text-[28px] leading-none font-bold sm:text-[32px]"
                />
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(6px,1fr))] gap-1">
            {activity.map((level, i) => (
              <span
                key={i}
                className="h-6 rounded-[3px]"
                style={{
                  background:
                    level === 0
                      ? "color-mix(in oklab, var(--color-foreground) 8%, transparent)"
                      : `color-mix(in oklab, var(--color-primary) ${level * 18}%, transparent)`,
                }}
              />
            ))}
          </div>
          <p className="label-mono mt-3">Community commit activity · last 40 days</p>
        </GlassCard>

        <GlassCard className="p-6 lg:p-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <p className="label-mono">Today</p>
          </div>
          <ul className="mt-6 space-y-5">
            {todayStats.map((stat, i) => {
              const Icon = todayIcons[i]!;
              return (
                <li key={stat.label} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <LiveCounter
                      value={stat.value}
                      drift={stat.drift}
                      className="block text-xl font-bold"
                    />
                    <p className="truncate text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </div>
    </section>
  );
}

/* ---------------- Progress visualisation ---------------- */

export function ProgressSection() {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);
  const pct = Math.round((student.currentDay / student.totalDays) * 100);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="Progress visualisation"
        title="Sixty days, one visible line of evidence."
        subtitle="Every completed day fills the ring, advances the timeline, and adds another square to your public activity record."
      />

      <div ref={ref} className="mt-10 grid gap-4 lg:grid-cols-[auto_1fr] lg:gap-6">
        <GlassCard className="flex items-center justify-center p-8">
          <ProgressRing value={visible ? pct : 0} size={190}>
            <span className="num-display block text-4xl font-bold">{student.currentDay}</span>
            <span className="label-mono mt-1 block">of {student.totalDays} days</span>
          </ProgressRing>
        </GlassCard>

        <GlassCard className="p-6 lg:p-8">
          <div className="flex items-baseline justify-between">
            <p className="label-mono">60-day timeline</p>
            <p className="num-display text-sm font-semibold text-primary">{pct}% complete</p>
          </div>

          <div className="relative mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full grad-primary shadow-[0_0_18px_-2px_var(--color-primary)]"
                style={{
                  width: visible ? `${pct}%` : "0%",
                  transition: "width 1.6s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </div>
            <ol className="mt-5 flex justify-between">
              {milestones.map((m, i) => {
                const reached = student.currentDay >= m.day;
                return (
                  <li key={m.day} className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={`h-3 w-3 rounded-full border transition-all duration-500 ${
                        reached
                          ? "border-primary bg-primary shadow-[0_0_14px_var(--color-primary)]"
                          : "border-border bg-surface"
                      }`}
                      style={{ transitionDelay: `${i * 120}ms` }}
                    />
                    <span className="label-mono text-[9px]">
                      Day {String(m.day).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{m.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-8 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
            {Array.from({ length: 60 }).map((_, i) => {
              const done = i < student.currentDay;
              return (
                <span
                  key={i}
                  className="aspect-square rounded-[3px] transition-all duration-500"
                  style={{
                    background: done
                      ? "color-mix(in oklab, var(--color-primary) 55%, transparent)"
                      : "color-mix(in oklab, var(--color-foreground) 7%, transparent)",
                    opacity: visible ? 1 : 0.2,
                    transitionDelay: `${i * 14}ms`,
                  }}
                />
              );
            })}
          </div>
          <p className="label-mono mt-3">Your day-by-day completion grid</p>
        </GlassCard>
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */

export function AchievementsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="Achievement system"
        title="Badges that mean something specific."
        subtitle="Each badge maps to real evidence — a streak survived, a milestone crossed, work made public. Nothing here is decorative."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, i) => (
          <Reveal key={a.id} delay={i * 60}>
            <GlassCard
              className={`h-full p-5 lg:p-6 ${a.unlocked ? "" : "opacity-70"}`}
              spotlight={a.unlocked}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl ${
                    a.unlocked
                      ? "border border-primary/30 bg-primary/12"
                      : "border border-border bg-secondary grayscale"
                  }`}
                >
                  {a.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold">{a.title}</h3>
                  <p className="label-mono mt-0.5 text-[10px]">{a.requirement}</p>
                </div>
                {a.unlocked ? (
                  <Trophy className="ml-auto h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                ) : (
                  <Lock
                    className="ml-auto h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{a.meaning}</p>
              {!a.unlocked && typeof a.progress === "number" && (
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-primary/60"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                  <p className="label-mono mt-2 text-[10px]">{a.progress}% there</p>
                </div>
              )}
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Leaderboard ---------------- */

export function LeaderboardSection() {
  return (
    <section id="leaderboard" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="Leaderboard"
        title="Competitive, but never out of reach."
        subtitle="You are always shown the next rank you can realistically take — not just the top of the table."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <GlassCard className="p-5 lg:p-7">
          <div className="flex items-center justify-between">
            <p className="label-mono">Global builders</p>
            <span className="label-mono text-[10px]">Streak</span>
          </div>
          <ol className="mt-4 space-y-1.5">
            {leaderboard.map((row, i) => (
              <li
                key={row.rank}
                className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition-all duration-300 hover:border-border hover:bg-secondary/60"
                style={{ animation: `pop-in 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both` }}
              >
                <span
                  className={`num-display w-7 shrink-0 text-sm font-bold ${
                    row.rank <= 3 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {String(row.rank).padStart(2, "0")}
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold">
                  {row.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{row.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{row.college}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
                  <Flame className="h-4 w-4 text-flame" aria-hidden="true" />
                  {row.streak}
                </span>
              </li>
            ))}
          </ol>
        </GlassCard>

        <GlassCard className="flex flex-col justify-center p-6 lg:p-8">
          <p className="label-mono">Your position</p>
          <p className="num-display mt-3 text-6xl leading-none font-bold">#{student.rank}</p>
          <div className="mt-5 flex items-center gap-2">
            <Flame className="animate-flame h-5 w-5 text-flame" aria-hidden="true" />
            <span className="num-display text-lg font-bold">{student.streak} day streak</span>
          </div>
          <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/8 p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">↑ {student.daysToNextRank} days</span> to
              reach #{student.nextRank}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Rank moves with consistency, not raw volume.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ---------------- Recruiter value ---------------- */

export function RecruiterSection() {
  const { ref, visible } = useInView<HTMLDivElement>(0.25);
  const stats = [
    { icon: Flame, label: "Day Streak", value: student.streak + 30 },
    { icon: Code2, label: "Projects", value: student.projects },
    { icon: GitBranch, label: "Commits", value: student.commits },
    { icon: Megaphone, label: "Public Posts", value: student.posts },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Your edge with recruiters"
            title={
              <>
                A resume tells recruiters what you know.
                <span className="mt-2 block text-primary">
                  Your 60-day journey shows them how you work.
                </span>
              </>
            }
            subtitle="Hiring teams cannot verify a skills list. They can verify 60 commits, 60 posts, and a streak that survived exam week."
          />
          <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
            {["Consistency", "Building", "Public Proof"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={80}>
          <GlassCard tilt className="p-6 lg:p-8" as="article">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl grad-primary text-lg font-bold text-primary-foreground">
                {student.initials}
              </span>
              <div className="min-w-0">
                <h3 className="font-display truncate text-xl font-bold tracking-tight">
                  {student.name.toUpperCase()}
                </h3>
                <p className="truncate text-sm text-muted-foreground">
                  {student.role} · {student.college}
                </p>
              </div>
              <span className="label-mono ml-auto hidden shrink-0 rounded-full border border-primary/30 px-2.5 py-1 text-[9px] text-primary sm:block">
                Verified
              </span>
            </div>

            <div ref={ref} className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
                  <s.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <p className="num-display mt-2 text-2xl font-bold">
                    <AnimatedCounter value={s.value} />
                  </p>
                  <p className="text-[12px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {student.metrics.map((m, i) => (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                    <span className="num-display text-sm font-bold text-primary">{m.value}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full grad-primary"
                      style={{
                        width: visible ? `${m.value}%` : "0%",
                        transition: `width 1.3s cubic-bezier(0.16,1,0.3,1) ${i * 140}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <Reveal>
        <GlassCard spotlight className="px-6 py-12 text-center lg:px-16 lg:py-20">
          <span className="pointer-events-none absolute inset-x-10 -top-24 h-48 rounded-full bg-primary/15 blur-[90px]" />
          <p className="label-mono">Ready when you are</p>
          <h2 className="mt-4 text-3xl leading-[1.1] font-bold sm:text-4xl lg:text-5xl">
            Ready to build in public?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Start your 60-day journey, show your work, and turn consistency into proof.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton to="/dashboard">START YOUR 60-DAY JOURNEY</MagneticButton>
          </div>
          <p className="mt-10 border-t border-border pt-8 text-lg font-semibold sm:text-xl">
            Your next 60 days could change your career.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              to="/day/$day"
              params={{ day: String(todayTask.day) }}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
            >
              START YOUR JOURNEY
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

export function MagneticButton({
  to,
  children,
}: {
  to: "/dashboard" | "/";
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 10}px, ${
          ((e.clientY - r.top) / r.height - 0.5) * 8
        }px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
      className="group inline-flex min-h-13 items-center gap-2 liquid-glass-btn px-7 text-sm font-bold tracking-wide shadow-xl transition-[transform,box-shadow] duration-300 active:scale-[0.98]"
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
