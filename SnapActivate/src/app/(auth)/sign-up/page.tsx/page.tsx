"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createUser } from '@/services/userService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function SignUpFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const initialRole = searchParams.get('type') === 'admin' ? 'admin' : 'promoter';
  const [role, setRole] = useState(initialRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showAdminOption = searchParams.get('type') === 'admin';

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const email = data.email as string;
    const password = data.password as string;
    
    if (data.role === 'promoter') {
      data.status = 'pending';
    } else {
      data.status = 'approved';
    }
    
    toast({
      title: "Creating your account...",
      description: "Please wait a moment.",
    });

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const { password: _, ...userData } = data;
        const newUser = await createUser(user.uid, userData);

        if (newUser) {
            toast({
                title: "Sign up successful!",
                description: "Redirecting to your new dashboard...",
            });
            // The AuthProvider will handle the redirect
        } else {
            throw new Error("Could not save user data.");
        }
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Sign up failed",
            description: error.message || "Could not create your account. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card>
    <CardHeader className="items-center">
        <Logo className="h-12"/>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Join SnapActivate today.</CardDescription>
    </CardHeader>
    <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" name="email" type="email" placeholder="m@example.com" required />
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" name="password" type="password" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select name="role" onValueChange={setRole} defaultValue={role}>
                <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="promoter">Promoter</SelectItem>
                    <SelectItem value="brand">Brand / Client</SelectItem>
                    {showAdminOption && <SelectItem value="admin">Admin</SelectItem>}
                </SelectContent>
                </Select>
            </div>
        </div>

        {role === 'brand' && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" placeholder="e.g., FizzCo Inc." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tradingAs">Trading As</Label>
                    <Input id="tradingAs" name="tradingAs" placeholder="e.g., FizzCo" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+27 12 345 6789" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="companyType">Company Type</Label>
                    <Select name="companyType">
                        <SelectTrigger id="companyType">
                            <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fmcg">FMCG</SelectItem>
                            <SelectItem value="alcohol">Alcohol</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="banking">Banking</SelectItem>
                            <SelectItem value="cellular">Cellular Networks</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="province">Area/Province</Label>
                    <Select name="province">
                        <SelectTrigger id="province">
                        <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gauteng">Gauteng</SelectItem>
                            <SelectItem value="western-cape">Western Cape</SelectItem>
                            <SelectItem value="kzn">KZN</SelectItem>
                            <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                            <SelectItem value="limpopo">Limpopo</SelectItem>
                            <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                            <SelectItem value="north-west">North West</SelectItem>
                            <SelectItem value="free-state">Free State</SelectItem>
                            <SelectItem value="northern-cape">Northern Cape</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="logo-upload">Upload Company Logo</Label>
                    <label htmlFor="logo-upload-input" className="flex flex-col items-center justify-center w-full h-10 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                        <div className="flex flex-row items-center justify-center gap-2">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                        </div>
                        <input id="logo-upload-input" name="logo" type="file" className="hidden" accept="image/png, image/jpeg"/>
                    </label>
                </div>
            </div>
            <div className="space-y-3 pt-2">
               <Label className="text-sm font-semibold">Payment Plan</Label>
                <RadioGroup name="paymentPlan" defaultValue="standard" className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <RadioGroupItem value="standard" id="standard" className="mt-1" />
                        <Label htmlFor="standard" className="font-normal">
                            <span className="font-semibold text-foreground">Standard Plan</span>
                            <p className="text-xs text-muted-foreground">Brands/Clients are billed on the day of the booking and will receive an Invoice that has to be paid on the day of the booking to secure booking.</p>
                         </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                        <RadioGroupItem value="elite" id="elite" className="mt-1" />
                        <Label htmlFor="elite" className="font-normal">
                            <span className="font-semibold text-foreground">Elite Plan</span>
                            <p className="text-xs text-muted-foreground">Brands/Clients can request a CE and payment terms can be negotiated after receiving their PO.</p>
                        </Label>
                    </div>
                </RadioGroup>
               <Separator />
               <p className="text-xs text-muted-foreground pt-2">Should the Activation/Event be cancelled within 24 hours of the start of the campaign, a 100% cancellation fee applies.</p>
            </div>
          </div>
        )}
        
        <div className="pt-2 space-y-4">
          <p className="px-1 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our
            <br />
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
        </form>
    </CardContent>
    </Card>
  );
}

// React Suspense is required for useSearchParams()
export default function SignUpPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <SignUpFormComponent />
        </React.Suspense>
    )
}
