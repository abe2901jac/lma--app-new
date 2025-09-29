import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'SnapActivate',
  description: 'The ultimate platform for field marketing excellence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <AuthProvider>
            {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}