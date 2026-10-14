# ABTalks Route Map

This file documents the current route structure of the application and the main pages available in the project.

## Main Routes

- `/` — Landing page
  - File: `src/routes/index.tsx`
  - Purpose: Public landing page for ABTalks challenge

- `/about` — About page
  - File: `src/routes/about.tsx`
  - Purpose: Mission, values, recruiter context, testimonials

- `/days` — Days page
  - File: `src/routes/days.tsx`
  - Purpose: The 60-day program overview and rules

- `/dashboard` — Dashboard page
  - File: `src/routes/dashboard.tsx`
  - Purpose: User progress, streaks, tasks, proofs, achievements

- `/how-it-works` — How It Works page
  - File: `src/routes/how-it-works.tsx`
  - Purpose: Explains the step-by-step workflow of the challenge

- `/leaderboard` — Leaderboard page
  - File: `src/routes/leaderboard.tsx`
  - Purpose: Community ranking and progress tracking

- `/login` — Login page
  - File: `src/routes/login.tsx`
  - Purpose: Authentication entry flow with GitHub & Google OAuth 2.0 PKCE and email credentials

- `/auth/callback` — OAuth 2.0 callback route
  - File: `src/routes/auth.callback.tsx`
  - Purpose: Handles OAuth 2.0 authorization code and state validation from GitHub and Google

- `/day/$day` — Dynamic daily challenge route
  - File: `src/routes/day.$day.tsx`
  - Purpose: Individual day task details for a given day number

## Route Tree Summary

```text
__root__
├── /
├── /about
├── /days
├── /dashboard
├── /how-it-works
├── /leaderboard
├── /login
├── /auth/callback
└── /day/$day
```

## Notes

- The app uses TanStack Router.
- The generated route metadata is stored in `src/routeTree.gen.ts`.
- Route links are defined in `src/components/navbar.tsx` and used throughout the app.
