import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <ShieldAlert className="h-10 w-10 text-destructive" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Your role can&apos;t open this page</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This section is restricted to a different role. If you think that&apos;s wrong, ask an administrator to
          check your account.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to my dashboard</Link>
      </Button>
    </div>
  );
}
