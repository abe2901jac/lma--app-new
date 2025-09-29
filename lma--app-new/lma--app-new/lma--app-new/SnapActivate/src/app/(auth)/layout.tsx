"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignUp = pathname.includes('/sign-up');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="w-full max-w-md relative">
        <Button asChild variant="ghost" size="icon" className="absolute -top-14 left-0">
            <Link href={isSignUp ? "/" : "/sign-up"}>
                <ChevronLeft />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        {children}
       </div>
    </main>
  );
}
