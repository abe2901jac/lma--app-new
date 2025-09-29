"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"
import * as Icons from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type IconName = keyof typeof Icons;

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: {
    href: string;
    label: string;
    icon: IconName;
  }[];
  title: string;
  requiredRole?: 'admin' | 'brand' | 'promoter';
}

const Icon = ({ name, ...props }: { name: IconName } & React.ComponentProps<"svg">) => {
  const LucideIcon = Icons[name] as React.FC<React.ComponentProps<"svg">>;
  if (!LucideIcon) {
    return null; 
  }
  return <LucideIcon {...props} />;
};


export function DashboardLayout({ children, navItems, title, requiredRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { userData, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!userData || (requiredRole && userData.role !== requiredRole))) {
      router.push('/');
    }
  }, [userData, loading, router, requiredRole]);

  if (loading || !userData || (requiredRole && userData.role !== requiredRole)) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Logo className="h-24 animate-pulse" />
        </div>
     )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="p-2 flex justify-center">
            <Logo className="w-32" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href}>
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
          <div className="hidden md:block">
            <UserNav />
          </div>
        </header>
        <main className="p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}