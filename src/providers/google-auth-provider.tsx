"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * If NEXT_PUBLIC_GOOGLE_CLIENT_ID isn't set, render children unwrapped
 * instead of crashing the whole app — Google login becomes unavailable
 * (the button component checks for this too, see login-form.tsx) but
 * everything else keeps working. Useful for anyone who clones this
 * without having set up Google OAuth credentials yet.
 */
export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>;
  }
  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
}
