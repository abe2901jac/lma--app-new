import { AuthComponent } from "@/components/auth-component";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo className="h-20" />
        <p className="mt-4 text-lg tracking-tight text-foreground/80">
          From Booking to Reporting - All in One App.
        </p>
      </div>
      <AuthComponent />
    </main>
  );
}