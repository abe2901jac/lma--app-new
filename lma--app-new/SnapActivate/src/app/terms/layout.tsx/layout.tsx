import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-10 sm:pt-24">
       <div className="w-full max-w-4xl relative">
        <Button asChild variant="ghost" size="icon" className="absolute -top-10 left-0 sm:-top-16">
            <Link href="/sign-up">
                <ChevronLeft />
                <span className="sr-only">Back to sign up</span>
            </Link>
        </Button>
        <div className="flex justify-center mb-8">
            <Logo className="h-16" />
        </div>
        {children}
       </div>
    </main>
  );
}
