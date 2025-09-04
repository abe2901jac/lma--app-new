"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ZolaChat } from "@/components/zola-chat";

const navItems = [
  { href: '/brand', label: 'Dashboard', icon: 'LayoutDashboard' as const },
  { href: '/brand/book', label: 'Book Campaign', icon: 'PlusSquare' as const },
  { href: '/brand/campaigns', label: 'My Campaigns', icon: 'Package' as const },
  { href: '/brand/assets', label: 'Brand Assets', icon: 'Upload' as const },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={navItems} title="Brand Dashboard" requiredRole="brand">
      {children}
      <ZolaChat />
    </DashboardLayout>
  );
}
