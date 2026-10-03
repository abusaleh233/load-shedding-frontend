import Link from "next/link";
import { Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { DemoLogin } from "@/components/auth/demo-login";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-lg font-semibold">Grid Control</h1>
          <p className="text-sm text-muted-foreground">Load Shedding &amp; Power Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your admin, operator, or consumer account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
            <DemoLogin />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
