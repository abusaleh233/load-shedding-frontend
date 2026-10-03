import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CreditCard,
  Radio,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { GridBackground } from "@/components/marketing/grid-background";
import { Reveal } from "@/components/marketing/reveal";
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: 3, suffix: "", label: "Substations wired in" },
  { value: 6, suffix: "", label: "Feeder areas tracked" },
  { value: 30, suffix: "s", label: "Live outage refresh" },
  { value: 100, suffix: "%", label: "Conflict-free scheduling" },
];

const FEATURES = [
  {
    icon: Radio,
    title: "Live outage tracking",
    description:
      "Reported and in-progress outages, refreshed every 30 seconds off a Redis-cached feed so the dashboard never hammers the database.",
    span: "md:col-span-2",
  },
  {
    icon: CalendarClock,
    title: "Conflict-free scheduling",
    description: "A Postgres advisory lock closes the race condition a naive overlap check misses under load.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Admin, Operator, and Consumer see exactly the surface area their role should touch — nothing more.",
    span: "",
  },
  {
    icon: CreditCard,
    title: "Stripe-backed billing",
    description:
      "Checkout Sessions and a webhook-verified payment flow keep bill status and payment records in lockstep.",
    span: "md:col-span-2",
  },
];

const STEPS = [
  {
    title: "Report",
    description: "An outage gets logged — scheduled maintenance from an operator, or an emergency from anyone on the grid.",
  },
  {
    title: "Coordinate",
    description: "Operators plan shedding windows per area; the scheduling engine rejects anything that overlaps.",
  },
  {
    title: "Resolve",
    description: "Status moves from reported to in-progress to resolved, with every step recorded to an audit trail.",
  },
];

const ROLES = [
  {
    icon: Users,
    title: "Consumers",
    description: "Check live outages in your area, review bills, and pay them without leaving the dashboard.",
  },
  {
    icon: Wrench,
    title: "Operators",
    description: "Manage substations and areas, plan schedules, report outages, and issue bills.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    description: "Full oversight — every user, every payment, every action recorded in the audit log.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <GridBackground />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-28 text-center sm:pt-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-signal-pulse rounded-full bg-primary" />
              Load Shedding &amp; Power Management System
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              See the grid <span className="text-primary">before</span> it goes dark.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              Coordinate outages, load-shedding schedules, and consumer billing from one control room — built on a
              scheduling engine that mathematically can&apos;t double-book an area, and role-based access that keeps
              admins, operators, and consumers each on the surface they need.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/load-management">See how scheduling works</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="text-center">
                <div className="font-data text-3xl font-semibold text-primary sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Features (bento grid) ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Every piece the grid needs, none of the parts it doesn&apos;t.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08} className={feature.span}>
              <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From report to resolved.</h2>
          </Reveal>
          <div className="relative mt-14 grid gap-10 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" aria-hidden />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12} className="relative">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-background font-data text-lg font-semibold text-primary">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Who it's for ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">One platform, three vantage points.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {ROLES.map((role, i) => (
            <Reveal key={role.title} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-border p-6">
                <role.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{role.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-primary/30 bg-primary/5 px-8 py-16 text-center">
            <Activity className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to see your grid in one place?
            </h2>
            <p className="max-w-md text-muted-foreground">
              Create an account and get a live view of outages, schedules, and bills in under a minute.
            </p>
            <Button asChild size="lg">
              <Link href="/register">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
