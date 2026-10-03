"use client";

import { useState } from "react";
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@gridcontrol.dev" },
  { icon: Phone, label: "Phone", value: "+880 1XXX-XXXXXX" },
  { icon: MapPin, label: "Based in", value: "Dhaka, Bangladesh" },
];

/**
 * This form is intentionally client-side only — there's no backend
 * endpoint wired up to actually deliver these messages (that wasn't part
 * of the API this frontend consumes). It simulates a submission with a
 * short delay and a success toast, which is enough for a portfolio demo,
 * but don't rely on it to actually reach anyone. Wiring a real "contact"
 * endpoint (e.g. emailing via a transactional-email provider) would be a
 * small, separate backend addition if this ever needs to be real.
 */
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent — thanks for reaching out.");
      e.currentTarget.reset();
    }, 900);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Let&apos;s talk.</h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Questions about the project, the architecture, or just want to say hi — the form below reaches me
          directly.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal delay={0.1} className="space-y-4">
          {CONTACT_INFO.map((item) => (
            <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="font-data mt-1 text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="What's this about?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} placeholder="Tell me a bit more…" required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send message
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
