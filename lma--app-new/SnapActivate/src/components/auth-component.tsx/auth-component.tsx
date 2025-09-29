"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from './ui/separator';

export function AuthComponent() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Sign in to your account or create a new one.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/sign-in/promoter">Promoter Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in/brand">Brand/Client Sign In</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/sign-in/admin">Admin Sign In</Link>
            </Button>
        </div>
        <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-sm text-muted-foreground">OR</span>
        </div>
         <Button asChild variant="outline">
            <Link href="/sign-up">Sign Up</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
