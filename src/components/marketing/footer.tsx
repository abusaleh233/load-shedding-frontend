import Link from "next/link";
import { Zap } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/services", label: "Services" },
      { href: "/load-management", label: "Load Management" },
      { href: "/schedules", label: "Schedules" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Get started" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <Zap className="h-5 w-5 text-primary" />
              Grid Control
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              A load-shedding &amp; power-management platform for coordinating outages, schedules, and billing
              across a real grid.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Grid Control. Built as a portfolio project.</p>
          <p className="font-data">Next.js · Express · PostgreSQL · Redis · Stripe</p>
        </div>
      </div>
    </footer>
  );
}
