import { Database, GitBranch, Lock, Radio, ShieldCheck, Zap } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const STACK = [
  { label: "Next.js 14", note: "App Router frontend" },
  { label: "TypeScript", note: "end to end" },
  { label: "Express", note: "REST API" },
  { label: "PostgreSQL", note: "via Prisma" },
  { label: "Redis", note: "cache-aside" },
  { label: "Stripe", note: "Checkout + webhooks" },
  { label: "TanStack Query", note: "server state" },
  { label: "Zustand", note: "session state" },
];

const PRINCIPLES = [
  {
    icon: Lock,
    title: "Role-based, not just role-labeled",
    description:
      "Every endpoint checks the caller's role server-side. The frontend's role guard is a UX convenience — it's never the actual boundary.",
  },
  {
    icon: GitBranch,
    title: "Race conditions taken seriously",
    description:
      "The schedule engine uses a Postgres advisory lock scoped to the transaction, so two operators can't both win an overlap check for the same area at once.",
  },
  {
    icon: Database,
    title: "Soft deletes, audit trails",
    description:
      "Nothing critical is hard-deleted. Every create, update, and delete on a sensitive resource writes an audit log entry inside the same transaction.",
  },
  {
    icon: Radio,
    title: "Caching that knows when to give up",
    description:
      "The live-outages endpoint is Redis-cached with a short TTL, and every mutation that could stale it invalidates the cache immediately.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" />
          About the project
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Built for places where the lights don&apos;t always stay on.
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 space-y-4 text-lg text-muted-foreground">
          <p>
            In a lot of the world, load shedding isn&apos;t an edge case — it&apos;s the normal way a grid stays
            stable when demand outpaces supply. That coordination problem is genuinely interesting: an operator
            needs to plan shedding windows without double-booking an area, a consumer needs to know when their
            power is actually going out, and a utility still needs to bill for what was actually delivered.
          </p>
          <p>
            Grid Control is a full-stack answer to that problem — a Node.js/Express/PostgreSQL API and this
            Next.js frontend, built together as one system rather than a frontend bolted onto a generic backend.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <h2 className="mt-16 text-2xl font-semibold tracking-tight">What the backend actually enforces</h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((principle, i) => (
          <Reveal key={principle.title} delay={0.05 * i}>
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <principle.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <h2 className="mt-16 text-2xl font-semibold tracking-tight">Stack</h2>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-6 flex flex-wrap gap-2">
          {STACK.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
            >
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">{item.note}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 flex items-start gap-3 rounded-xl border border-border bg-card p-6">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            This site is a portfolio project demonstrating a full-stack build — authentication with JWT rotation,
            RBAC, Stripe billing, Redis caching, and a concurrency-safe scheduling engine — rather than a live
            utility deployment.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
