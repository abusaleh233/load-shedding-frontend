"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaymentHistory } from "@/services/payment.service";
import type { Payment } from "@/types/api";

const TERMINAL_STATUSES = new Set(["SUCCEEDED", "FAILED", "REFUNDED"]);
const POLL_INTERVAL_MS = 2_500;
const TIMEOUT_MS = 45_000; // Stripe's webhook normally lands in 1-2s; this is a generous ceiling

/**
 * Stripe redirects the browser back to STRIPE_SUCCESS_URL the instant the
 * customer finishes paying — but the backend only learns the payment
 * actually succeeded a moment later, asynchronously, via the
 * payment_intent.succeeded webhook (see load-shedding-api's
 * payment.service.ts). So this page can't just trust the redirect; it has
 * to poll /payments/history until the matching Payment (found by
 * stripeCheckoutSessionId) shows a terminal status.
 */
export function usePaymentStatus(sessionId: string | null) {
  const [isTimedOut, setIsTimedOut] = useState(false);

  const query = useQuery({
    queryKey: ["payments", "history", "for-session", sessionId],
    queryFn: () => getPaymentHistory({ limit: 50 }),
    enabled: !!sessionId,
    refetchInterval: (q) => {
      const payment = findPayment(q.state.data?.payments, sessionId);
      return payment && TERMINAL_STATUSES.has(payment.status) ? false : POLL_INTERVAL_MS;
    },
  });

  const payment = findPayment(query.data?.payments, sessionId);
  const isResolved = !!payment && TERMINAL_STATUSES.has(payment.status);

  useEffect(() => {
    if (!sessionId || isResolved) return;
    const timer = setTimeout(() => setIsTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [sessionId, isResolved]);

  return {
    payment,
    isResolved,
    isTimedOut: isTimedOut && !isResolved,
    isLoading: query.isLoading,
  };
}

function findPayment(payments: Payment[] | undefined, sessionId: string | null): Payment | undefined {
  if (!payments || !sessionId) return undefined;
  return payments.find((p) => p.stripeCheckoutSessionId === sessionId);
}
