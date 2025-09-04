"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

// This is a generic layout for non-role-specific pages that still need the dashboard shell.
// We provide an empty navItems array because there's no specific role navigation.
const navItems: any[] = [];

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  // We don't require a specific role to view the help page, so we omit `requiredRole`.
  // The DashboardLayout will still require a user to be logged in.
  return (
    <DashboardLayout navItems={navItems} title="Help & User Guide">
      {children}
    </DashboardLayout>
  );
}
