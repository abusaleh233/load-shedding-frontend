import { Activity, CreditCard, FileText, KeyRound, LayoutDashboard, MapPinned } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    icon: Activity,
    title: "Real-time outage monitoring",
    description:
      "Every reported and in-progress outage in one feed, refreshed every 30 seconds against a Redis-cached endpoint. Consumers see it filtered to their area; operators see the whole grid.",
    points: ["Emergency reports from any authenticated user", "Priority levels from Low to Critical", "Cache invalidated the instant status changes"],
  },
  {
    icon: MapPinned,
    title: "Substation & area management",
    description:
      "The grid's actual topology — substations with capacity and status, and the feeder areas each one serves — kept current by operators and admins.",
    points: ["Capacity and operational status per substation", "Areas linked to exactly one substation", "Referential integrity enforced at the database level"],
  },
  {
    icon: LayoutDashboard,
    title: "Conflict-free scheduling",
    description:
      "Plan a load-shedding window for an area, and the engine checks it against every existing, non-cancelled schedule for that same area before it's allowed to save.",
    points: ["Postgres advisory lock closes the race-condition window", "409 Conflict with the exact clashing time range", "Status lifecycle: planned → active → completed"],
  },
  {
    icon: CreditCard,
    title: "Stripe-backed billing",
    description:
      "Bills get issued per consumer per billing period; paying one kicks off a real Stripe Checkout Session, and a signature-verified webhook is what actually marks it paid.",
    points: ["Webhook signature verified against the raw request body", "Bill and Payment updated in one transaction", "Payment history for consumers, full ledger for admins"],
  },
  {
    icon: KeyRound,
    title: "Role-based access control",
    description:
      "Three roles — Admin, Operator, Consumer — each with a distinct set of permitted actions, enforced independently on both the frontend routing and the backend API.",
    points: ["JWT access + refresh tokens with rotation", "Google Sign-In alongside email/password", "Edge middleware plus a client-side guard, backed by real server checks"],
  },
  {
    icon: FileText,
    title: "Audit logging",
    description:
      "Every create, update, and delete on a sensitive resource writes an entry to an append-only audit log — who did what, to which record, and when.",
    points: ["Written inside the same transaction as the action itself", "Filterable by entity, action, or user", "Admin-only visibility"],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">What the platform actually does.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Six pieces, built together, covering the full loop from an outage being reported to a bill being paid.
        </p>
      </Reveal>

      <div className="mt-20 space-y-20">
        {SERVICES.map((service, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={service.title}
              className={cn("grid items-center gap-10 md:grid-cols-2", reversed && "md:[&>*:first-child]:order-2")}
            >
              <Reveal from={reversed ? "right" : "left"}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-card">
                  <service.icon className="h-16 w-16 text-primary" strokeWidth={1.25} />
                </div>
              </Reveal>
              <Reveal from={reversed ? "left" : "right"} delay={0.1}>
                <h2 className="text-2xl font-semibold tracking-tight">{service.title}</h2>
                <p className="mt-3 text-muted-foreground">{service.description}</p>
                <ul className="mt-5 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
