"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { signInUser } from '@/services/userService';
import { useState } from 'react';

export default function PromoterSignInPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { success, error } = await signInUser(email, password, 'promoter');

    if (success) {
      toast({
        title: "Sign in successful!",
        description: "Redirecting to your promoter dashboard...",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error || "Please check your credentials and try again.",
      });
    }
     setIsSubmitting(false);
  };

  return (
    <Card>
    <CardHeader className="items-center">
        <Logo className="h-12"/>
        <CardTitle>Promoter Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
    </CardHeader>
    <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input id="email-signin" name="email" type="email" placeholder="promoter1@example.com" required />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password-signin">Password</Label>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Input id="password-signin" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    </CardContent>
    </Card>
  );
}
