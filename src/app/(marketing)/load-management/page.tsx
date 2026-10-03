"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Lock, Timer } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const PRIORITY_LEVELS = [
  { level: "Critical", note: "Hospitals, emergency services — scheduled last, if at all", color: "bg-destructive" },
  { level: "High", note: "Essential commercial and industrial load", color: "bg-amber-500" },
  { level: "Medium", note: "General residential and commercial", color: "bg-primary/70" },
  { level: "Low", note: "First to shed when capacity is tight", color: "bg-muted-foreground/50" },
];

/** Illustrative overlap-conflict diagram: two schedule bars on a shared timeline for one area. */
function OverlapDiagram() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <p className="mb-6 font-data text-xs text-muted-foreground">AREA: Gulshan Feeder Zone (FDR-GLSN-01)</p>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">Schedule A — accepted</span>
            <span className="font-data text-xs text-muted-foreground">08:00 – 11:00</span>
          </div>
          <div className="h-8 w-full overflow-hidden rounded-md bg-muted">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "45%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-md bg-emerald-500/70"
              style={{ marginLeft: "10%" }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="font-medium">Schedule B — rejected (409 Conflict)</span>
            <span className="font-data text-xs text-muted-foreground">09:30 – 12:00</span>
          </div>
          <div className="h-8 w-full overflow-hidden rounded-md bg-muted">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "45%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="h-full rounded-md border-2 border-dashed border-destructive/70 bg-destructive/20"
              style={{ marginLeft: "27.5%" }}
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Schedule conflicts with an existing schedule for this area (08:00 – 11:00). The 90-minute overlap between
          09:30 and 11:00 is what triggers the rejection.
        </span>
      </motion.div>
    </div>
  );
}

export default function LoadManagementPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Timer className="h-3.5 w-3.5 text-primary" />
          The scheduling engine
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Two operators can&apos;t schedule the same blackout twice.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Load management is the part of the system that decides which area loses power, and when. The interesting
          engineering problem isn&apos;t the schedule itself — it&apos;s making sure two people planning at the same
          moment can&apos;t both win.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14">
          <OverlapDiagram />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-20 text-2xl font-semibold tracking-tight">Why a simple check-then-insert isn&apos;t enough</h2>
        <p className="mt-4 text-muted-foreground">
          Under Postgres&apos;s default isolation level, two concurrent requests scheduling the same area can both
          query &quot;is there a conflict?&quot;, both get back <span className="font-data text-sm">no</span>, and
          both insert — because neither transaction can see the other&apos;s uncommitted row yet. By the time both
          commit, the area has two overlapping schedules that were each individually validated as conflict-free.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 flex items-start gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-semibold">The fix: a transaction-scoped advisory lock</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Before checking for a conflict, the transaction acquires a Postgres advisory lock keyed to the area ID.
              A second concurrent request for the same area blocks until the first transaction commits or rolls
              back — so the overlap check that follows always sees a fully up-to-date picture, never a stale
              snapshot. Different areas don&apos;t block each other at all; the lock is scoped per area, not
              global.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-20 text-2xl font-semibold tracking-tight">Priority shapes the order, not just the list</h2>
        <p className="mt-4 text-muted-foreground">
          Every outage and schedule carries a priority level, so operators aren&apos;t just working off a
          chronological queue.
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-8 space-y-3">
          {PRIORITY_LEVELS.map((p) => (
            <div key={p.level} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <span className={`h-3 w-3 shrink-0 rounded-full ${p.color}`} />
              <span className="w-20 shrink-0 font-medium">{p.level}</span>
              <span className="text-sm text-muted-foreground">{p.note}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
