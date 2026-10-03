"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { usePaymentStatus } from "@/hooks/use-payment-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    amount / 100
  );
}

/**
 * useSearchParams() opts the component it's called in out of static
 * rendering unless wrapped in <Suspense> — Next.js enforces this at build
 * time (`next build` fails otherwise), because without it the whole page
 * would have to become fully dynamic just to read one query param. See the
 * default export below for the boundary.
 */
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();
  const { payment, isResolved, isTimedOut } = usePaymentStatus(sessionId);

  // Once we know the payment resolved, the Bill this paid is now PAID on
  // the backend — invalidate so the Bills page doesn't show stale UNPAID
  // data if the user navigates there next.
  useEffect(() => {
    if (isResolved) {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    }
  }, [isResolved, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <StatusIcon status={payment?.status} isTimedOut={isTimedOut} />
          <CardTitle>{statusHeadline(payment?.status, isTimedOut)}</CardTitle>
          <CardDescription>{statusDescription(payment?.status, isTimedOut, !sessionId)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {payment && (
            <div className="rounded-md border border-border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-data font-medium">{formatAmount(payment.amount, payment.currency)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={
                    payment.status === "SUCCEEDED"
                      ? "font-medium text-emerald-500"
                      : payment.status === "FAILED"
                        ? "font-medium text-destructive"
                        : "font-medium"
                  }
                >
                  {payment.status}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-data text-xs">{payment.id.slice(0, 8)}</span>
              </div>
            </div>
          )}

          <Button asChild className="w-full">
            <Link href="/consumer/bills">Back to my bills</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusIcon({ status, isTimedOut }: { status?: string; isTimedOut: boolean }) {
  if (status === "SUCCEEDED") return <CheckCircle2 className="h-12 w-12 text-emerald-500" />;
  if (status === "FAILED") return <XCircle className="h-12 w-12 text-destructive" />;
  if (isTimedOut) return <AlertTriangle className="h-12 w-12 text-amber-500" />;
  return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
}

function statusHeadline(status: string | undefined, isTimedOut: boolean) {
  if (status === "SUCCEEDED") return "Payment successful";
  if (status === "FAILED") return "Payment failed";
  if (isTimedOut) return "Still processing";
  return "Confirming your payment…";
}

function statusDescription(status: string | undefined, isTimedOut: boolean, missingSession: boolean) {
  if (missingSession) return "No checkout session was found in the URL.";
  if (status === "SUCCEEDED") return "Your bill has been marked as paid.";
  if (status === "FAILED") return "Stripe reported this payment did not go through. You can try again from My Bills.";
  if (isTimedOut) {
    return "This is taking longer than usual. Check My Bills in a moment — the payment may still confirm shortly.";
  }
  return "Stripe confirmed your checkout — we're waiting on the final confirmation from the payment processor.";
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
