"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

const navItems = [
  { href: '/promoter', label: 'Dashboard', icon: 'LayoutDashboard' as const },
  { href: '/promoter/gigs', label: 'Available Gigs', icon: 'List' as const },
  { href: '/promoter/bookings', label: 'My Bookings', icon: 'CheckSquare' as const },
  { href: '/promoter/live', label: 'Live Gig', icon: 'RadioTower' as const },
  { href: '/promoter/reports', label: 'Reports & Briefs', icon: 'FileText' as const },
  { href: '/promoter/feedback', label: 'Submit Feedback', icon: 'MessageSquare' as const },
];

export default function PromoterLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={navItems} title="Promoter Dashboard" requiredRole="promoter">
      {children}
    </DashboardLayout>
  );
}
