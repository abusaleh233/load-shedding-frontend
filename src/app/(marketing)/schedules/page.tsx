import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CalendarDays, ListFilter } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["06:00", "10:00", "14:00", "18:00", "22:00"];

// Purely illustrative sample data for the mock week-view below — not live data.
const SAMPLE_WINDOWS: Record<string, number[]> = {
  Mon: [2],
  Wed: [1, 2],
  Thu: [3],
  Sat: [0],
};

const HIGHLIGHTS = [
  {
    icon: CalendarDays,
    title: "See what's planned for your area",
    description: "Every upcoming schedule for your feeder zone, in order, with the reason behind each one.",
  },
  {
    icon: Bell,
    title: "Know before it happens",
    description: "Planned windows show up ahead of time — no surprise blackouts for anything that was scheduled.",
  },
  {
    icon: ListFilter,
    title: "Filter by status",
    description: "Planned, active, completed, or cancelled — operators can filter the same way when planning ahead.",
  },
];

export default function PublicSchedulesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Know when the power&apos;s going out.</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Planned load-shedding windows aren&apos;t a surprise here — every schedule is visible to the consumers in
          the area it affects, ahead of time.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-data text-xs text-muted-foreground">SAMPLE WEEK — Gulshan Feeder Zone</p>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Illustrative</span>
          </div>
          <div className="grid grid-cols-[3rem_repeat(7,1fr)] gap-1 text-center">
            <div />
            {DAYS.map((day) => (
              <div key={day} className="pb-2 text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {HOURS.map((hour, rowIndex) => (
              <Fragment key={hour}>
                <div className="font-data pr-2 text-right text-xs text-muted-foreground">{hour}</div>
                {DAYS.map((day) => {
                  const active = SAMPLE_WINDOWS[day]?.includes(rowIndex);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={active ? "h-8 rounded-md bg-primary/70" : "h-8 rounded-md bg-muted/50"}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-3 w-3 rounded-sm bg-primary/70" />
            Planned shedding window
          </div>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((item, i) => (
          <Reveal key={item.title} delay={0.08 * i}>
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Sign in to see the real, live schedule for your area.</p>
          <Button asChild>
            <Link href="/login">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
