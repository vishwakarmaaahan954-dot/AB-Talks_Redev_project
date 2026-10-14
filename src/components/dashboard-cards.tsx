import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CircleCheck,
  Circle,
  Clock,
  Flame,
  Github,
  Linkedin,
  Lock,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  ExternalLink,
  CheckCircle2,
  Send,
  AlertCircle,
  Edit3,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { ProgressBar, ProgressRing } from "@/components/progress-ring";
import { achievements, leaderboard, student, todayTask } from "@/data/abtalks";
import type { DashboardStateId } from "@/data/abtalks";
import { useInView, useReducedMotion } from "@/hooks/use-motion";
import { Tilt3DCard } from "@/components/tilt-3d-card";
import { useAuth } from "@/hooks/use-auth";

/* ---------- Streak ---------- */

export function StreakCard({ streak, best }: { streak: number; best: number }) {
  const isZero = streak === 0;
  return (
    <Tilt3DCard>
      <GlassCard className="p-6">
        <div className="flex items-start justify-between">
          <p className="label-mono">Current streak</p>
          <Flame
            className={`h-5 w-5 ${isZero ? "text-muted-foreground" : "animate-flame text-flame"}`}
            aria-hidden="true"
          />
        </div>
        <div className="relative mt-4 flex items-end gap-3">
          {!isZero && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 left-2 h-24 w-24 rounded-full bg-flame/20 blur-2xl"
            />
          )}
          <span className="num-display text-6xl leading-none font-bold">{streak}</span>
          <span className="label-mono pb-1.5">day{streak === 1 ? "" : "s"}</span>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-muted-foreground border-t border-border/60 pt-3">
          <span>
            Personal Best: <strong className="text-foreground">{best} days</strong>
          </span>
          <span className="h-3 w-px bg-border" />
          <span>
            Grace freezes: <strong className="text-foreground">1 remaining</strong>
          </span>
        </div>
      </GlassCard>
    </Tilt3DCard>
  );
}

/* ---------- Challenge progress ---------- */

export function ChallengeProgress({ day, total }: { day: number; total: number }) {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);
  const pct = Math.round((day / total) * 100);

  return (
    <GlassCard className="p-6">
      <div ref={ref} className="flex items-center gap-6">
        <ProgressRing value={visible ? pct : 0} size={104} stroke={8}>
          <span className="num-display block text-xl font-bold">{pct}%</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="label-mono">Challenge progress</p>
          <p className="num-display mt-1 text-2xl font-bold">
            Day {day} <span className="text-muted-foreground">/ {total}</span>
          </p>
          <ProgressBar value={pct} animate={visible} className="mt-4" />
          <p className="mt-2 text-[13px] text-muted-foreground">
            {total - day} days left in your challenge
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

/* ---------- Today's task ---------- */

export function TaskCard({ day = 1, locked = false }: { day?: number; locked?: boolean }) {
  return (
    <GlassCard tilt className="p-6 lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono">Today · Day {day}</span>
        <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          <Target className="h-3 w-3" aria-hidden="true" />
          In progress
        </span>
      </div>

      <h2 className="mt-4 text-2xl leading-tight font-bold">{todayTask.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{todayTask.summary}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-3.5">
          <dt className="label-mono flex items-center gap-1.5 text-[10px]">
            <TrendingUp className="h-3 w-3" aria-hidden="true" /> Difficulty
          </dt>
          <dd className="mt-1.5 text-sm font-semibold">{todayTask.difficulty}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3.5">
          <dt className="label-mono flex items-center gap-1.5 text-[10px]">
            <Clock className="h-3 w-3" aria-hidden="true" /> Est. time
          </dt>
          <dd className="mt-1.5 text-sm font-semibold">{todayTask.time}</dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-2">
        {todayTask.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-[12px] text-muted-foreground"
          >
            {skill}
          </li>
        ))}
      </ul>

      {locked ? (
        <p className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          Finish onboarding to unlock Day 1.
        </p>
      ) : (
        <Link
          to="/day/$day"
          params={{ day: String(day) }}
          className="group mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl grad-primary text-sm font-bold tracking-wide text-primary-foreground shadow-[0_16px_40px_-18px_var(--color-primary)] transition-transform active:scale-[0.99]"
        >
          VIEW TODAY'S TASK
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </GlassCard>
  );
}

/* ---------- Submission status ---------- */

export function SubmissionStatus({
  day,
  github = false,
  linkedin = false,
  onProofUpdate,
}: {
  day: number;
  github?: boolean;
  linkedin?: boolean;
  onProofUpdate?: (proofs: { github: boolean; linkedin: boolean }) => void;
}) {
  const storageKey = `abtalks_proof_day_${day}`;
  const { user } = useAuth();
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubSubmitted, setGithubSubmitted] = useState(github);
  const [linkedinSubmitted, setLinkedinSubmitted] = useState(linkedin);
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [isEditingLinkedin, setIsEditingLinkedin] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [linkedinError, setLinkedinError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Load saved proof submissions from localStorage for current day
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.githubUrl) {
          setGithubUrl(parsed.githubUrl);
          setGithubSubmitted(true);
        }
        if (parsed.linkedinUrl) {
          setLinkedinUrl(parsed.linkedinUrl);
          setLinkedinSubmitted(true);
        }
      } else {
        setGithubSubmitted(github);
        setLinkedinSubmitted(linkedin);
      }
    } catch {
      setGithubSubmitted(github);
      setLinkedinSubmitted(linkedin);
    }
  }, [day, github, linkedin, storageKey]);

  const saveState = (gUrl: string, gSubmitted: boolean, lUrl: string, lSubmitted: boolean) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          day,
          githubUrl: gUrl,
          githubSubmitted: gSubmitted,
          linkedinUrl: lUrl,
          linkedinSubmitted: lSubmitted,
          updatedAt: new Date().toISOString(),
        }),
      );
      if (onProofUpdate) {
        onProofUpdate({ github: gSubmitted, linkedin: lSubmitted });
      }
    } catch (err) {
      console.error("Failed to save proof submission state:", err);
    }
  };

  const submitGithub = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = githubUrl.trim();
    if (!trimmed) {
      setGithubError("Please paste a valid GitHub commit link.");
      return;
    }

    const isValidGithub = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/i.test(
      trimmed,
    );
    if (!isValidGithub || trimmed.toLowerCase().startsWith("javascript:")) {
      setGithubError(
        "Please paste a valid HTTPS GitHub link (e.g., https://github.com/username/repo/commit/...)",
      );
      return;
    }

    setGithubError("");
    setGithubSubmitted(true);
    setIsEditingGithub(false);
    saveState(trimmed, true, linkedinUrl, linkedinSubmitted);

    if (linkedinSubmitted || linkedin) {
      setShowSuccessToast(true);
    }
  };

  const submitLinkedin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = linkedinUrl.trim();
    if (!trimmed) {
      setLinkedinError("Please paste a valid LinkedIn post link.");
      return;
    }

    const isValidLinkedin =
      /^https:\/\/(www\.)?linkedin\.com\/(in|posts|feed|company)\/[A-Za-z0-9_-]+/i.test(trimmed);
    if (!isValidLinkedin || trimmed.toLowerCase().startsWith("javascript:")) {
      setLinkedinError(
        "Please paste a valid HTTPS LinkedIn post link (e.g., https://www.linkedin.com/posts/...)",
      );
      return;
    }

    setLinkedinError("");
    setLinkedinSubmitted(true);
    setIsEditingLinkedin(false);
    saveState(githubUrl, githubSubmitted, trimmed, true);

    if (githubSubmitted || github) {
      setShowSuccessToast(true);
    }
  };

  const count = (githubSubmitted ? 1 : 0) + (linkedinSubmitted ? 1 : 0);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="label-mono">Today's Proof Submission</p>
          <h3 className="mt-1 text-base font-bold">Submit Your Evidence for Day {day}</h3>
        </div>
        <span
          className={`num-display shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${
            count === 2
              ? "bg-primary/20 text-primary border border-primary/30"
              : count === 1
                ? "bg-warning/20 text-warning border border-warning/30"
                : "bg-secondary text-muted-foreground border border-border"
          }`}
        >
          {count} / 2 Verified
        </span>
      </div>

      {showSuccessToast && (
        <div className="animate-pop-in mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/15 p-4 text-primary">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Day {day} Proof Completed!</p>
              <p className="text-xs text-muted-foreground">
                Your streak has been updated and recorded.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessToast(false)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {/* GitHub Commit Submission Card */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            githubSubmitted
              ? "border-primary/40 bg-primary/8 shadow-[0_0_20px_-8px_var(--color-primary)]"
              : "border-border bg-background/50"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
                <Github className="h-4.5 w-4.5 text-foreground" />
              </span>
              <div>
                <p className="text-sm font-bold">1. GitHub Commit URL</p>
                <p className="text-xs text-muted-foreground">
                  {githubSubmitted ? "Commit link verified" : "Paste link to today's GitHub commit"}
                </p>
              </div>
            </div>
            {githubSubmitted && !isEditingGithub ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                <CircleCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
                <Circle className="h-3.5 w-3.5" /> Pending
              </span>
            )}
          </div>

          {githubSubmitted && !isEditingGithub ? (
            <div className="mt-3.5 flex items-center justify-between gap-2 rounded-xl border border-primary/20 bg-background/70 px-3.5 py-2.5 text-xs">
              <a
                href={githubUrl || "https://github.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-primary hover:underline truncate min-w-0"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{githubUrl || "Commit Submitted"}</span>
              </a>
              <button
                type="button"
                onClick={() => setIsEditingGithub(true)}
                className="flex items-center gap-1 shrink-0 text-muted-foreground hover:text-foreground font-semibold"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
          ) : (
            <form onSubmit={submitGithub} className="mt-3.5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repo/commit/a1b2c3d..."
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setGithubError("");
                  }}
                  className="w-full rounded-xl border border-border bg-background/80 px-3.5 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-1.5 liquid-glass-btn px-4.5 py-2 text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit
                </button>
              </div>
              {githubError && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                  <AlertCircle className="h-3 w-3" /> {githubError}
                </p>
              )}
              {user?.githubUsername && !githubUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setGithubUrl(`https://github.com/${user.githubUsername}/abtalks-60day/commit/main`)
                  }
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  <Sparkles className="h-3 w-3" /> Use @{user.githubUsername} repository pattern
                </button>
              )}
            </form>
          )}
        </div>

        {/* LinkedIn Post Submission Card */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            linkedinSubmitted
              ? "border-primary/40 bg-primary/8 shadow-[0_0_20px_-8px_var(--color-primary)]"
              : "border-border bg-background/50"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
                <Linkedin className="h-4.5 w-4.5 text-foreground" />
              </span>
              <div>
                <p className="text-sm font-bold">2. LinkedIn Post URL</p>
                <p className="text-xs text-muted-foreground">
                  {linkedinSubmitted ? "Post link verified" : "Paste link to today's LinkedIn post"}
                </p>
              </div>
            </div>
            {linkedinSubmitted && !isEditingLinkedin ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                <CircleCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[11px] font-semibold text-warning">
                <Circle className="h-3.5 w-3.5" /> Pending
              </span>
            )}
          </div>

          {linkedinSubmitted && !isEditingLinkedin ? (
            <div className="mt-3.5 flex items-center justify-between gap-2 rounded-xl border border-primary/20 bg-background/70 px-3.5 py-2.5 text-xs">
              <a
                href={linkedinUrl || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-primary hover:underline truncate min-w-0"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{linkedinUrl || "Post Submitted"}</span>
              </a>
              <button
                type="button"
                onClick={() => setIsEditingLinkedin(true)}
                className="flex items-center gap-1 shrink-0 text-muted-foreground hover:text-foreground font-semibold"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
          ) : (
            <form onSubmit={submitLinkedin} className="mt-3.5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://www.linkedin.com/posts/activity-71234567..."
                  value={linkedinUrl}
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value);
                    setLinkedinError("");
                  }}
                  className="w-full rounded-xl border border-border bg-background/80 px-3.5 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-1.5 liquid-glass-btn px-4.5 py-2 text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit
                </button>
              </div>
              {linkedinError && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                  <AlertCircle className="h-3 w-3" /> {linkedinError}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <p className="mt-4 text-[12px] text-muted-foreground leading-relaxed">
        {count === 2
          ? "✅ Both GitHub and LinkedIn proofs submitted! Your Day " +
            day +
            " progress is fully verified."
          : "Submit both proof links above to lock in your Day " + day + " streak."}
      </p>
    </GlassCard>
  );
}

/* ---------- Achievements strip ---------- */

export function AchievementStrip() {
  const [selectedAchievement, setSelectedAchievement] = useState<(typeof achievements)[0] | null>(
    null,
  );
  const [isHovered, setIsHovered] = useState(false);
  const reduced = useReducedMotion();
  const achievementList = [...achievements, ...achievements, ...achievements];

  // Keydown listener for Escape key to close modal
  useEffect(() => {
    if (!selectedAchievement) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAchievement(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAchievement]);

  return (
    <section aria-label="Achievements" className="overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <p className="label-mono">Achievements</p>
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        </div>
        <p className="label-mono text-[10px]">
          {achievements.filter((a) => a.unlocked).length} / {achievements.length} unlocked
        </p>
      </div>

      {/* Automatic Moving Marquee Container with Framer Motion 60fps */}
      <div
        className="group relative mt-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex w-max gap-3.5 px-2 pb-2"
          animate={reduced || isHovered ? {} : { x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 42,
            repeat: Infinity,
          }}
        >
          {achievementList.map((a, idx) => (
            <motion.div
              key={`${a.id}-${idx}`}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={() => setSelectedAchievement(a)}
              className={`card-surface group/achieve relative w-[176px] shrink-0 cursor-pointer p-4 transition-colors duration-300 ${
                a.unlocked
                  ? "border border-primary/30 hover:border-primary"
                  : "opacity-65 hover:opacity-100 border border-border"
              }`}
            >
              {/* Top Badge shine highlight on unlocked */}
              {a.unlocked && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl text-xl transition-transform duration-300 group-hover/achieve:scale-110 group-hover/achieve:rotate-6 ${
                    a.unlocked
                      ? "border border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                      : "border border-border bg-secondary grayscale"
                  }`}
                >
                  {a.emoji}
                </span>

                {a.unlocked ? (
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-400/30">
                    Unlocked
                  </span>
                ) : (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                    Locked
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-snug font-bold text-foreground group-hover/achieve:text-primary transition-colors">
                {a.title}
              </p>
              <p className="label-mono mt-1 text-[9px] leading-relaxed normal-case text-muted-foreground">
                {a.requirement}
              </p>

              {!a.unlocked && typeof a.progress === "number" && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/80 to-emerald-400/80 transition-all duration-500"
                    style={{ width: `${a.progress}%` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          onClick={() => setSelectedAchievement(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card-surface relative w-full max-w-sm overflow-hidden rounded-3xl border border-primary/40 p-6 shadow-2xl animate-pop-in bg-background/95 backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between">
              <span
                className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl ${
                  selectedAchievement.unlocked
                    ? "border-2 border-amber-400/60 bg-amber-400/20 shadow-[0_0_25px_rgba(251,191,36,0.35)]"
                    : "border border-border bg-secondary grayscale"
                }`}
              >
                {selectedAchievement.emoji}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <h4 className="mt-4 text-lg font-black text-foreground">{selectedAchievement.title}</h4>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              Requirement: {selectedAchievement.requirement}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/90 bg-secondary/50 p-3.5 rounded-2xl border border-border/80 italic">
              "{selectedAchievement.meaning}"
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground font-semibold">
                Status:{" "}
                {selectedAchievement.unlocked
                  ? "Unlocked 🎉"
                  : `In Progress (${selectedAchievement.progress || 0}%)`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="liquid-glass-btn px-4 py-1.5 text-xs font-bold text-primary-foreground rounded-xl"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Leaderboard preview ---------- */

export function LeaderboardPreview({ streak = 0 }: { streak?: number }) {
  return (
    <GlassCard className="p-6">
      <p className="label-mono">Your standing</p>
      <div className="mt-4 flex items-end gap-4">
        <span className="num-display text-5xl leading-none font-bold">#{student.rank}</span>
        <span className="flex items-center gap-1.5 pb-1 text-sm font-semibold">
          <Flame className="h-4 w-4 text-flame" aria-hidden="true" />
          {streak} day{streak === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-4 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm">
        <span className="font-semibold text-primary">{student.daysToNextRank} days</span> to reach #
        {student.nextRank}
      </p>

      <ul className="mt-5 space-y-2 border-t border-border pt-4">
        {leaderboard.slice(0, 3).map((row) => (
          <li key={row.rank} className="flex items-center gap-3 text-sm">
            <span className="num-display w-6 text-muted-foreground">
              {String(row.rank).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate">{row.name}</span>
            <span className="flex items-center gap-1 font-semibold">
              <Flame className="h-3.5 w-3.5 text-flame" aria-hidden="true" />
              {row.streak}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/leaderboard"
        className="group mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
      >
        VIEW LEADERBOARD
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </GlassCard>
  );
}

/* ---------- State-specific notices ---------- */

export function StateNotice({ state }: { state: DashboardStateId }) {
  if (state === "missed") {
    return (
      <GlassCard className="p-5" spotlight={false}>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary">
            <Zap className="h-5 w-5 text-warning" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">Your streak ended at 11 days.</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Today is a fresh start. Eleven days of work is still on your record — commit once
              today and the counter begins climbing again.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (state === "first-day") {
    return (
      <GlassCard className="p-5" spotlight={false}>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12">
            <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">Day 1 of 60 starts now.</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Finish today's task, push one commit, post once. That is the whole loop.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (state === "empty") {
    return (
      <GlassCard className="p-6" spotlight={false}>
        <p className="label-mono">Set up your profile</p>
        <p className="mt-3 font-semibold">Three steps before Day 1 unlocks.</p>
        <ol className="mt-4 space-y-2.5">
          {[
            { label: "Connect your GitHub username", done: true },
            { label: "Add your LinkedIn profile", done: false },
            { label: "Pick your challenge track", done: false },
          ].map((step) => (
            <li
              key={step.label}
              className="flex min-h-12 items-center gap-3 rounded-2xl border border-border bg-surface px-4 text-sm"
            >
              {step.done ? (
                <CircleCheck className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
              ) : (
                <Circle className="h-4.5 w-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <span className={step.done ? "text-muted-foreground line-through" : ""}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </GlassCard>
    );
  }

  return null;
}
