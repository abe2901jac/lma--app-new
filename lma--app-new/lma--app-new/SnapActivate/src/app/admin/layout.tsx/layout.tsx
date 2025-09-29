"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' as const },
  { href: '/admin/promoters', label: 'Promoters', icon: 'Users' as const },
  { href: '/admin/campaigns', label: 'Campaigns', icon: 'Package' as const },
  { href: '/admin/reports', label: 'Reports', icon: 'FileText' as const },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard" requiredRole="admin">
      {children}
    </DashboardLayout>
  );
}
