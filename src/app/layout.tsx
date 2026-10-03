import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { GoogleAuthProvider } from "@/providers/google-auth-provider";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grid Control — Load Shedding & Power Management",
  description:
    "Live outages, schedules, and grid operations for the Load Shedding & Power Management System.",
  icons: {
    icon: "/icon.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${plexSans.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">
        <GoogleAuthProvider>
          <QueryProvider>
            {children}
            <Toaster theme="dark" position="top-right" richColors />
          </QueryProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
