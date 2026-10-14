import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { CTASection } from "@/components/landing-sections";
import { TestimonialsSection } from "@/components/testimonials";
import { LiveCounter, AnimatedCounter } from "@/components/animated-counter";
import {
  Flame,
  Trophy,
  Target,
  ArrowRight,
  Sparkles,
  Users,
  Terminal,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { platformStats, leaderboard } from "@/data/abtalks";

const title = "ABTalks — Build Your Edge in 60 Days";
const description =
  "A 60-day public build challenge for Indian college students. Build daily, commit to GitHub, share on LinkedIn, and turn consistency into proof.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const featureCards = [
  {
    href: "/days",
    icon: Target,
    tag: "DAYS",
    title: "The 60-Day Days",
    desc: "Why build daily? Daily task specs, streak rules, dual GitHub & LinkedIn proof verification.",
    badge: "60 Days",
  },
  {
    href: "/how-it-works",
    icon: Terminal,
    tag: "WORKFLOW",
    title: "How It Works",
    desc: "The 4-stage daily rhythm: Unlock Task → Build & Commit → Post Proof → Gain Rank.",
    badge: "Step-by-Step",
  },
  {
    href: "/leaderboard",
    icon: Trophy,
    tag: "RANKINGS",
    title: "Public Leaderboard",
    desc: "See top college builders across India, active streaks, and verified GitHub commit logs.",
    badge: "Live Rank",
  },
  {
    href: "/about",
    icon: Users,
    tag: "RECRUITERS",
    title: "About & Hiring Pipeline",
    desc: "How hiring managers use ABTalks to evaluate proof of execution over traditional resumes.",
    badge: "Hiring Partners",
  },
] as const;

function Landing() {
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="relative min-h-screen">
      <AmbientBackdrop />
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6">
        {/* Concise High-Impact Hero */}
        <Hero />

        <TestimonialsSection />

        {/* Quick Navigation Hub Grid */}
        <section className="mt-12 sm:mt-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label-mono text-primary font-bold">Explore Platform</p>
              <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Everything You Need to Build Proof
              </h2>
            </div>
            <Link
              to="/days"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              View Full Days Rules <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} to={card.href} className="group block">
                  <GlassCard
                    tilt
                    className="h-full p-6 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_12px_30px_-10px_oklch(0.735_0.157_156_/_20%)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {card.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Live Impact & Leaderboard Spotlight */}
        <section className="mt-16 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/80 to-background p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-extrabold text-primary">
                <Flame className="h-3.5 w-3.5 fill-primary/30 animate-flame text-primary" />
                <span>Live Builder Ecosystem</span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Real-Time Proof, Not Resume Promises.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Join over {(platformStats[0]?.value ?? 12482).toLocaleString()} active students
                committing code daily across India.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                  <div className="num-display text-xl font-extrabold text-primary sm:text-2xl">
                    <AnimatedCounter value={platformStats[0]?.value ?? 12482} suffix="+" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">Active Builders</div>
                </div>
                <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                  <div className="num-display text-xl font-extrabold text-foreground sm:text-2xl">
                    <AnimatedCounter value={platformStats[1]?.value ?? 847291} suffix="+" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">Commits Logged</div>
                </div>
                <div className="rounded-2xl border border-border/80 bg-background/60 p-3 text-center">
                  <div className="num-display text-xl font-extrabold text-emerald-400 sm:text-2xl">
                    98.4%
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">GitHub Verified</div>
                </div>
              </div>
            </div>

            {/* Top 3 Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                  Top Streak Leaders
                </span>
                <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline">
                  Full Leaderboard →
                </Link>
              </div>

              {top3.map((builder, i) => (
                <div
                  key={builder.name}
                  className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/70 p-3.5 backdrop-blur-md transition-all hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-xs font-black text-primary">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{builder.name}</p>
                      <p className="text-[11px] text-muted-foreground">{builder.college}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    <Flame className="h-3 w-3 fill-primary/30" />
                    {builder.streak}d streak
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
