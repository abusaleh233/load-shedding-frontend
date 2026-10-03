"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GOOGLE_CONFIGURED = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function RegisterForm() {
  const { register: registerUser, isRegistering, loginWithGoogle, isGoogleLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterInput) => registerUser(data);

  const handleGoogleSuccess = (credential: CredentialResponse) => {
    if (!credential.credential) {
      toast.error("Google didn't return a credential — please try again.");
      return;
    }
    loginWithGoogle(credential.credential);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jane Doe" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@gmail.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" placeholder="01700000000" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isRegistering || isGoogleLoggingIn}>
          {isRegistering && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      {GOOGLE_CONFIGURED && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            {isGoogleLoggingIn ? (
              <Button variant="outline" className="w-full" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </Button>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google sign-in failed — please try again.")}
                theme="filled_black"
                shape="rectangular"
                width="100%"
                text="signup_with"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
