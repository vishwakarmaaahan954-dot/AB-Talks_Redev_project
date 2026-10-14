import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Menu,
  X,
  Terminal,
  ArrowUpRight,
  User,
  LogOut,
  LayoutDashboard,
  Flame,
  ChevronDown,
  Sparkles,
  Github,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Days", to: "/days" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate({ to: "/" });
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition-all duration-500 ${
          scrolled
            ? "glass-panel border-border/80 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.9)]"
            : "border-transparent bg-transparent backdrop-blur-[2px]"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 min-w-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/35 bg-primary/14">
              <Terminal className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
            </span>
            <span className="font-logo text-xl font-extrabold tracking-[0.12em] text-foreground sm:text-2xl">
              ABTALKS
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <ul className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-foreground font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Items */}
          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />

            {isAuthenticated && user ? (
              /* Logged In Profile Menu Trigger */
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="group flex items-center gap-2.5 rounded-full border border-primary/35 bg-primary/10 p-1 pr-3.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-primary/20 hover:shadow-[0_0_20px_oklch(0.735_0.157_156_/_25%)] focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
                  aria-expanded={userMenuOpen}
                  aria-label="User profile menu"
                >
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-primary-soft font-bold text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400 shadow-sm" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400/70" />
                  </span>
                  <span className="hidden max-w-[110px] truncate text-xs font-extrabold tracking-wide sm:inline-block">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${
                      userMenuOpen ? "rotate-180 text-primary" : "group-hover:text-foreground"
                    }`}
                  />
                </button>

                {/* Animated Glassmorphism & Neomorphism Dropdown Menu */}
                {userMenuOpen && (
                  <div className="animate-pop-in absolute right-0 top-12 z-50 w-72 origin-top-right overflow-hidden rounded-3xl glass-dropdown bg-background/95 p-3.5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all">
                    {/* Specular Highlight Top Edge */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
                    />

                    {/* Subtle Ambient Glow Orbs */}
                    <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-primary/20 blur-3xl opacity-70" />
                    <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-primary/15 blur-3xl opacity-70" />

                    {/* Neomorphic User Header Card */}
                    <div className="relative neo-inset overflow-hidden rounded-2xl border border-primary/30 bg-surface/90 p-3.5 backdrop-blur-xl">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-primary-soft text-sm font-black text-primary-foreground shadow-[0_4px_14px_rgba(0,0,0,0.5)] ring-2 ring-primary/40 overflow-hidden">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(user.name)
                          )}
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-foreground">
                            {user.name}
                          </p>
                          <p className="truncate text-[11px] font-semibold text-muted-foreground">
                            {user.email}
                          </p>
                          {user.provider && user.provider !== "email" && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold text-primary">
                              {user.provider === "github" ? (
                                <Github className="h-2.5 w-2.5" />
                              ) : (
                                <ShieldCheck className="h-2.5 w-2.5" />
                              )}
                              {user.provider === "github"
                                ? user.githubUsername
                                  ? `@${user.githubUsername}`
                                  : "GitHub"
                                : "Google"}{" "}
                              OAuth
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/25 bg-background/80 px-3 py-1.5 shadow-inner">
                        <span className="text-[11px] font-bold text-muted-foreground">
                          Challenge Streak
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-primary">
                          <Flame className="h-3.5 w-3.5 fill-primary/40 animate-flame text-primary" />
                          {user?.streak ?? 0} Day
                          {(user?.streak ?? 0) === 1 ? "" : "s"} 🔥
                        </span>
                      </div>
                    </div>

                    {/* Neomorphic Menu Items */}
                    <div className="relative mt-3 space-y-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="group neo-button flex items-center gap-3 rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2.5 text-xs font-extrabold text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/20 hover:text-foreground hover:translate-x-1"
                      >
                        <div className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-primary/40 bg-primary/20 shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:border-primary">
                          <LayoutDashboard className="h-4 w-4 text-primary" />
                        </div>
                        <span className="flex-1">Dashboard</span>
                        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                          ⌘D
                        </span>
                      </Link>

                      <Link
                        to="/day/$day"
                        params={{ day: String(user?.currentDay ?? 1) }}
                        onClick={() => setUserMenuOpen(false)}
                        className="group neo-button flex items-center gap-3 rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2.5 text-xs font-extrabold text-foreground transition-all duration-200 hover:border-warning/50 hover:bg-warning/20 hover:text-foreground hover:translate-x-1"
                      >
                        <div className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-warning/40 bg-warning/20 shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:border-warning">
                          <Sparkles className="h-4 w-4 text-warning" />
                        </div>
                        <span className="flex-1">
                          Today's Task (Day {user?.currentDay ?? 1})
                        </span>
                        <span className="rounded bg-warning/25 px-1.5 py-0.5 text-[9px] font-extrabold text-warning shadow-sm">
                          NEW
                        </span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="group neo-button flex items-center gap-3 rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2.5 text-xs font-extrabold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/15 hover:text-foreground hover:translate-x-1"
                      >
                        <div className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-border bg-background/90 shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:border-primary/40">
                          <User className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </div>
                        <span className="flex-1">Profile & Settings</span>
                      </Link>

                      <div className="my-2.5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="group neo-button flex w-full items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-extrabold text-destructive transition-all duration-200 hover:border-destructive/60 hover:bg-destructive/25 hover:translate-x-1"
                      >
                        <div className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-destructive/40 bg-destructive/20 shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:border-destructive">
                          <LogOut className="h-4 w-4 text-destructive" />
                        </div>
                        <span className="flex-1">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* First-Time Log In Button */
              <Link to="/login" className="golden-glow-btn">
                <span className="golden-glow-btn-inner font-extrabold px-4 py-2">
                  Log In
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="glass-panel grid h-10 w-10 place-items-center rounded-full lg:hidden"
            >
              {open ? (
                <X className="h-[18px] w-[18px]" aria-hidden="true" />
              ) : (
                <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-x-0 top-16 z-40 origin-top px-3 transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="glass-panel overflow-hidden rounded-3xl p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold border border-primary/30"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 border-t border-border pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    {user.provider && user.provider !== "email" && (
                      <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="h-3 w-3" /> Connected with {user.provider === "github" ? "GitHub" : "Google"}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 text-sm font-semibold text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="golden-glow-btn h-12 w-full"
              >
                <span className="golden-glow-btn-inner text-base font-extrabold">
                  Log In
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
