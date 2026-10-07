# Grid Control — Load Shedding & Power Management Frontend

Next.js (App Router, TypeScript) frontend for the [https://load-shedding-api.vercel.app/](https:load-shedding-api.vercel.app/) backend.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **shadcn/ui** primitives (hand-placed in `src/components/ui`, not fetched via the CLI, so no network access was needed to scaffold them — same output either way)
- **TanStack React Query v5** for all server state — no data-fetching logic lives directly in components, only in `src/hooks/*`
- **Axios** with interceptors (`src/services/api-client.ts`) for auth-token attachment and automatic refresh-on-401
- **React Hook Form + Zod** for forms, with validators in `src/lib/validators/*` mirroring the backend's own Zod schemas
- **Zustand** (`src/stores/auth-store.ts`) for client-side session state
- **Framer Motion** for the public marketing pages' scroll-reveal and hero animations (`src/components/marketing/reveal.tsx`, `animated-counter.tsx`) — the authenticated dashboard intentionally stays animation-light; motion is a marketing-site choice, not a dashboard one

## Getting started



| Role | Email | Password |
|---|---|---|
| ADMIN | admin@powergrid.gov.bd | Admin123! |
| OPERATOR | operator@powergrid.gov.bd | Operator123! |
| CONSUMER | consumer@gmail.com | Consumer123! |

