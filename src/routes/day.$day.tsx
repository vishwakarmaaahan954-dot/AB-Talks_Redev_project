import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Circle,
  Clock,
  Code2,
  Flame,
  Github,
  Linkedin,
  Share2,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  GitBranch,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { ProgressBar } from "@/components/progress-ring";
import { student, todayTask } from "@/data/abtalks";

export const Route = createFileRoute("/day/$day")({
  head: ({ params }) => {
    const dayNum = params?.day || String(todayTask.day);
    const dayTitle = `Day ${dayNum} — ${todayTask.title} | ABTalks`;
    const dayDesc = `Day ${dayNum} of the ABTalks 60-day challenge: build daily, commit to GitHub, and share your progress on LinkedIn.`;
    return {
      meta: [
        { title: dayTitle },
        { name: "description", content: dayDesc },
        { property: "og:title", content: dayTitle },
        { property: "og:description", content: dayDesc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DayPage,
});

const isUrl = (value: string, host: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol.startsWith("http") && url.hostname.includes(host);
  } catch {
    return false;
  }
};

function FieldState({ value, valid, hint }: { value: string; valid: boolean; hint: string }) {
  if (!value.trim()) return <p className="mt-2 text-[12px] text-muted-foreground">{hint}</p>;
  return valid ? (
    <p className="mt-2 flex items-center gap-1.5 text-[12px] text-primary">
      <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" /> Looks valid
    </p>
  ) : (
    <p className="mt-2 flex items-center gap-1.5 text-[12px] text-destructive">
      <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" /> That doesn't look like a valid
      URL
    </p>
  );
}

const inputClass =
  "min-h-12 w-full rounded-2xl border border-input bg-surface px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60";

function DayPage() {
  const { day } = Route.useParams();
  const dayNumber = Number(day) || todayTask.day;

  const [repo, setRepo] = useState("");
  const [commit, setCommit] = useState("");
  const [post, setPost] = useState("");
  const [checked, setChecked] = useState<string[]>(
    todayTask.requirements.filter((r) => r.done).map((r) => r.id),
  );
  const [completed, setCompleted] = useState(false);

  const repoValid = isUrl(repo, "github.com");
  const commitValid = isUrl(commit, "github.com");
  const postValid = isUrl(post, "linkedin.com");
  const githubDone = repoValid && commitValid;
  const canSubmit = githubDone && postValid;

  const steps = useMemo(
    () => [
      { label: "BUILD", icon: Code2, done: checked.length === todayTask.requirements.length },
      { label: "COMMIT", icon: GitBranch, done: githubDone },
      { label: "POST", icon: Linkedin, done: postValid },
      { label: "SUBMIT", icon: Share2, done: completed },
    ],
    [checked.length, githubDone, postValid, completed],
  );

  const requirementPct = Math.round((checked.length / todayTask.requirements.length) * 100);

  return (
    <div className="relative min-h-screen">
      <AmbientBackdrop />
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16 sm:px-6 lg:pt-32">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Dashboard
        </Link>

        {/* header */}
        <header className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <p className="label-mono">Challenge day</p>
            <h1 className="num-display mt-1 text-3xl font-bold sm:text-4xl">
              DAY {dayNumber} <span className="text-muted-foreground">/ {student.totalDays}</span>
            </h1>
          </div>
          <div className="glass-panel flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2">
            <Flame className="animate-flame h-4 w-4 text-flame" aria-hidden="true" />
            <span className="num-display text-sm font-bold">{student.streak} DAY STREAK</span>
          </div>
        </header>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <p className="label-mono">Today's progress</p>
            <p className="num-display text-sm font-semibold text-primary">
              {steps.filter((s) => s.done).length} / 4 steps
            </p>
          </div>
          <ProgressBar value={(steps.filter((s) => s.done).length / 4) * 100} className="mt-2" />
        </div>

        {/* flow */}
        <ol className="mt-6 grid grid-cols-4 gap-2">
          {steps.map((step) => (
            <li
              key={step.label}
              className={`rounded-2xl border p-3 text-center transition-colors duration-500 ${
                step.done ? "border-primary/35 bg-primary/10" : "border-border bg-surface/70"
              }`}
            >
              <step.icon
                className={`mx-auto h-4 w-4 ${step.done ? "text-primary" : "text-muted-foreground"}`}
                aria-hidden="true"
              />
              <span className="label-mono mt-2 block text-[9px]">{step.label}</span>
            </li>
          ))}
        </ol>

        {/* task */}
        <GlassCard className="mt-6 p-6 lg:p-8">
          <span className="label-mono">Task · Day {dayNumber}</span>
          <h2 className="mt-3 text-2xl leading-tight font-bold sm:text-3xl">{todayTask.title}</h2>
          {todayTask.description.map((para) => (
            <p key={para} className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <dt className="label-mono flex items-center gap-1.5 text-[10px]">
                <TrendingUp className="h-3 w-3" aria-hidden="true" /> Difficulty
              </dt>
              <dd className="mt-1.5 font-semibold">{todayTask.difficulty}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <dt className="label-mono flex items-center gap-1.5 text-[10px]">
                <Clock className="h-3 w-3" aria-hidden="true" /> Estimated time
              </dt>
              <dd className="mt-1.5 font-semibold">{todayTask.time}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <dt className="label-mono flex items-center gap-1.5 text-[10px]">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> Reward
              </dt>
              <dd className="mt-1.5 font-semibold">+{todayTask.xp} XP</dd>
            </div>
          </dl>

          <ul className="mt-5 flex flex-wrap gap-2">
            {todayTask.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-[12px] text-muted-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* requirements */}
        <GlassCard className="mt-4 p-6 lg:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <p className="label-mono">Requirements</p>
            <p className="num-display text-sm font-semibold text-primary">{requirementPct}%</p>
          </div>
          <ProgressBar value={requirementPct} className="mt-3" />
          <ul className="mt-4 space-y-2">
            {todayTask.requirements.map((req) => {
              const isChecked = checked.includes(req.id);
              return (
                <li key={req.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setChecked((prev) =>
                        prev.includes(req.id)
                          ? prev.filter((id) => id !== req.id)
                          : [...prev, req.id],
                      )
                    }
                    aria-pressed={isChecked}
                    className={`flex min-h-13 w-full items-center gap-3 rounded-2xl border px-4 text-left text-[15px] transition-all ${
                      isChecked
                        ? "border-primary/30 bg-primary/8"
                        : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    {isChecked ? (
                      <CircleCheck
                        className="animate-pop-in h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="h-5 w-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span className={isChecked ? "text-muted-foreground" : ""}>{req.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        {/* submissions */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2.5">
              <Github className="h-5 w-5" aria-hidden="true" />
              <h3 className="text-base font-bold">GitHub proof</h3>
              {githubDone && (
                <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-primary">
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
                </span>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="repo" className="label-mono block">
                  Repository URL
                </label>
                <input
                  id="repo"
                  type="url"
                  inputMode="url"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="https://github.com/you/portfolio-hero"
                  className={`mt-2 ${inputClass}`}
                />
                <FieldState
                  value={repo}
                  valid={repoValid}
                  hint="Paste the repository holding today's work."
                />
              </div>
              <div>
                <label htmlFor="commit" className="label-mono block">
                  Commit URL
                </label>
                <input
                  id="commit"
                  type="url"
                  inputMode="url"
                  value={commit}
                  onChange={(e) => setCommit(e.target.value)}
                  placeholder="https://github.com/you/portfolio-hero/commit/8f2c41a"
                  className={`mt-2 ${inputClass}`}
                />
                <FieldState
                  value={commit}
                  valid={commitValid}
                  hint="Link the exact commit you pushed today."
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2.5">
              <Linkedin className="h-5 w-5" aria-hidden="true" />
              <h3 className="text-base font-bold">LinkedIn proof</h3>
              {postValid && (
                <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-primary">
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" /> Submitted
                </span>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="post" className="label-mono block">
                LinkedIn post URL
              </label>
              <input
                id="post"
                type="url"
                inputMode="url"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="https://linkedin.com/posts/you-day-12"
                className={`mt-2 ${inputClass}`}
              />
              <FieldState
                value={post}
                valid={postValid}
                hint="Public post only — recruiters should be able to open it."
              />
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
              <p className="label-mono">What to write</p>
              <ul className="mt-2.5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
                <li>· What you built today, in one line.</li>
                <li>· One thing that broke and how you fixed it.</li>
                <li>· A screenshot and your repo link.</li>
              </ul>
            </div>
          </GlassCard>
        </div>

        {/* submit */}
        <GlassCard className="mt-4 p-6 lg:p-8">
          {completed ? (
            <div className="relative text-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-1/3 -top-6 h-24 rounded-full bg-primary/20 blur-3xl"
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute top-6 h-1.5 w-1.5 rounded-full bg-primary"
                  style={{
                    left: `${18 + i * 16}%`,
                    animation: `spark-rise 1.6s ease-out ${i * 0.14}s both`,
                  }}
                />
              ))}
              <p className="animate-pop-in num-display text-3xl font-bold">
                DAY {dayNumber} COMPLETE 🎉
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
                  <Flame className="h-4 w-4" aria-hidden="true" /> +1 Day Streak
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" aria-hidden="true" /> +{todayTask.xp} XP
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm font-semibold">
                  🏅 Consistency Starter unlocked
                </span>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                ✓ GitHub verified · ✓ LinkedIn submitted
              </p>
              <Link
                to="/dashboard"
                className="group mt-6 inline-flex min-h-13 items-center gap-2 rounded-2xl grad-primary px-6 text-sm font-bold text-primary-foreground"
              >
                BACK TO DASHBOARD
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          ) : (
            <>
              <p className="label-mono">Submit day {dayNumber}</p>
              <ul className="mt-4 space-y-2">
                {[
                  { label: "Repository URL", ok: repoValid },
                  { label: "Commit URL", ok: commitValid },
                  { label: "LinkedIn post URL", ok: postValid },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5 text-sm">
                    {item.ok ? (
                      <CircleCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                    )}
                    <span className={item.ok ? "text-muted-foreground" : ""}>
                      {item.label} {item.ok ? "" : "still missing"}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => setCompleted(true)}
                className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl grad-primary text-sm font-bold tracking-wide text-primary-foreground shadow-[0_16px_40px_-18px_var(--color-primary)] transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-none disabled:bg-secondary disabled:text-muted-foreground disabled:shadow-none"
              >
                {canSubmit ? "SUBMIT DAY " + dayNumber : "ADD BOTH PROOFS TO SUBMIT"}
                {canSubmit && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
              <p className="mt-3 text-center text-[12px] text-muted-foreground">
                Days can be submitted until 11:59 PM IST. Missing a day resets the streak, not your
                record.
              </p>
            </>
          )}
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
}
