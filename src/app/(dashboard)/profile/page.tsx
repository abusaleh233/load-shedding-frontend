"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { RoleGuard } from "@/components/layout/role-guard";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileFormValues {
  name: string;
  phone: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfileContent() {
  const { data: user, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({ defaultValues: { name: "", phone: "" } });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: user.phone ?? "" });
    }
  }, [user, reset]);

  if (isLoading || !user) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate({ name: data.name, phone: data.phone || undefined });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">My profile</h2>
        <p className="text-sm text-muted-foreground">Your account details across the whole platform.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </CardDescription>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <Badge variant="secondary">{user.role}</Badge>
            {user.isVerified && (
              <span className="flex items-center gap-1 text-xs text-emerald-500">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Edit details</CardTitle>
            <CardDescription>Email and role can&apos;t be changed here — contact an admin if either needs to change.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name", { required: "Name is required", minLength: 2 })} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="01700000000" {...register("phone")} />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Member since</p>
                <p className="font-data mt-1">{format(new Date(user.createdAt), "PP")}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Account status</p>
                <p className="mt-1">
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "OPERATOR", "CONSUMER"]}>
      <ProfileContent />
    </RoleGuard>
  );
}
