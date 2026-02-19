'use client';

import { useState } from 'react';

import { MobileSidebar, PortalSidebar } from '@/components/layout/portal-sidebar';
import { PortalTopbar } from '@/components/layout/portal-topbar';

/**
 * Client shell that wires the portal sidebar (desktop + mobile) and topbar together.
 */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar — fixed, z-20 */}
      <PortalSidebar />

      {/* Mobile sidebar drawer — z-50 */}
      <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Topbar — fixed, z-30, offset by sidebar on lg+ */}
      <PortalTopbar onMobileMenuOpen={() => setMobileSidebarOpen(true)} />

      {/* Page content — offset top by topbar height (4rem), left by sidebar on lg+ */}
      <div className="lg:pl-64 pt-16">
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
