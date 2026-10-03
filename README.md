# Grid Control — Load Shedding & Power Management Frontend

Next.js (App Router, TypeScript) frontend for the [load-shedding-power-management-api](../load-shedding-api) backend.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **shadcn/ui** primitives (hand-placed in `src/components/ui`, not fetched via the CLI, so no network access was needed to scaffold them — same output either way)
- **TanStack React Query v5** for all server state — no data-fetching logic lives directly in components, only in `src/hooks/*`
- **Axios** with interceptors (`src/services/api-client.ts`) for auth-token attachment and automatic refresh-on-401
- **React Hook Form + Zod** for forms, with validators in `src/lib/validators/*` mirroring the backend's own Zod schemas
- **Zustand** (`src/stores/auth-store.ts`) for client-side session state
- **Framer Motion** for the public marketing pages' scroll-reveal and hero animations (`src/components/marketing/reveal.tsx`, `animated-counter.tsx`) — the authenticated dashboard intentionally stays animation-light; motion is a marketing-site choice, not a dashboard one

## Getting started

```bash
npm install
cp .env.local.example .env.local
# edit .env.local: point NEXT_PUBLIC_API_BASE_URL at your backend
npm run dev
```

Open `http://localhost:3000` — you'll be redirected to `/login`. Use one of the backend's seeded accounts:

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@powergrid.gov.bd | Admin123! |
| OPERATOR | operator@powergrid.gov.bd | Operator123! |
| CONSUMER | consumer@gmail.com | Consumer123! |

## How auth + routing fit together

1. **`src/lib/token-storage.ts`** — the only place the real JWTs live (in `localStorage`). Also sets two small, non-sensitive cookies (`lsp_session`, `lsp_role`) purely so edge middleware can make a fast routing decision — see the comment at the top of that file for why this is a UX layer, not the security boundary.
2. **`src/middleware.ts`** — runs at the edge before any `/admin`, `/operator`, or `/consumer` route renders; redirects to `/login` (no session) or `/unauthorized` (wrong role) based on those cookies.
3. **`src/components/layout/role-guard.tsx`** — client-side defense-in-depth wrapping each protected page; shows a loading skeleton while the Zustand store hydrates from `localStorage`, and does the same redirect logic middleware does, for the moments middleware's coarse path-matching isn't precise enough.
4. **`src/services/api-client.ts`** — every actual API call. The backend's own `authenticate` + `authorize` middleware is the *real* security boundary; both layers above are just about not showing the wrong UI shell.

## Deploying to Vercel

No special configuration needed — Vercel has first-class, zero-config Next.js support (unlike the Express backend, which needed the `api/index.ts` serverless-handler workaround). Just:

```bash
vercel --prod
```

or connect the repo in the Vercel dashboard. Set `NEXT_PUBLIC_API_BASE_URL` (and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, if using Google login) in **Project Settings → Environment Variables** to your deployed backend's URL (e.g. `https://load-shedding-api.vercel.app/api/v1`) — anything prefixed `NEXT_PUBLIC_` is baked in at build time, so a change here needs a redeploy to take effect, not just a runtime env var update.

## Pages implemented

**Public marketing site** (`(marketing)` route group — `Navbar` + `Footer` shell, Framer Motion scroll-reveal throughout):
- `/` — home: animated circuit-grid hero, live-feeling stat counters, bento-grid feature overview, "how it works," role breakdown
- `/about` — project story, engineering principles actually enforced by the backend, tech stack
- `/services` — six core services in an alternating left-right layout
- `/load-management` — deep dive on the scheduling engine, with a custom animated diagram illustrating the overlap-conflict rejection and why a plain check-then-insert isn't race-safe
- `/schedules` — consumer-facing explainer with an illustrative (non-live) sample week view
- `/contact` — a form that simulates submission client-side (toast + reset); there's no backend endpoint wired up to actually deliver these messages, since that wasn't part of the API this frontend consumes

**Authenticated app** (unchanged from before, `(auth)` and `(dashboard)` route groups):
- `/login`, `/register` — auth, including Google Sign-In (needs `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set — see `.env.local.example`)
- `/consumer` — live outages (polls every 30s), `/consumer/bills` — pay an unpaid bill via Stripe Checkout, `/consumer/payments` — payment history
- `/operator/substations`, `/operator/areas` — full CRUD (also reused by ADMIN)
- `/operator/outages` — report + resolve outages (status dropdown per row), delete (ADMIN only)
- `/operator`, `/operator/schedules`, `/operator/schedules/new` — the schedule engine's overlap-conflict error surfaces verbatim from the backend's 409 response
- `/operator/bills` — create bills for consumers, mark overdue/cancelled, delete (ADMIN only)
- `/admin`, `/admin/payments` (all payments), `/admin/audit-logs`, `/admin/users` (role change + delete)
- `/payment/success`, `/payment/cancel` — Stripe redirect targets; success page polls `/payments/history` until the webhook-driven status lands (SUCCEEDED/FAILED), since the redirect happens before the backend's async webhook confirms anything

Note: `/` used to be a client-side redirect to `/login` or the caller's dashboard. It's now the public marketing homepage instead — logging in still routes straight to the right dashboard (`ROLE_HOME` in `use-auth.ts`), but visiting `/` directly (or clicking the logo) no longer force-redirects a signed-in user away from the marketing site; the navbar just swaps "Sign in" for a "Dashboard" button.

## What's not built yet

- Consumer-facing "report an emergency" button — the backend allows CONSUMER to report `EMERGENCY` outages, and `OutageForm` already has a `restrictToEmergency` prop ready for this, it's just not wired into the Consumer dashboard yet.
- Toggling between light/dark theme — the app ships dark-only (`className="dark"` is hardcoded in `app/layout.tsx`); no theme switcher.
- A real backend endpoint for the `/contact` form — it's currently a convincing client-side simulation only.

Say which of these matters most and I'll build it next.
