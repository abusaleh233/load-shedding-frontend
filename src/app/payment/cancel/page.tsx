import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <XCircle className="h-12 w-12 text-muted-foreground" />
          <CardTitle>Payment cancelled</CardTitle>
          <CardDescription>You closed the checkout before it completed. No charge was made.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/consumer/bills">Back to my bills</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
