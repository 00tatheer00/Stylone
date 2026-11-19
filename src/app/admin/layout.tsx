'use client';

import { Suspense, useState } from 'react';
import { AdminSidebar, AdminTopbar } from '@/components/admin';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0faf2] text-[var(--color-text-primary)]">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <Suspense fallback={<aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-[#091b0f] z-30" />}>
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </Suspense>

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <AdminTopbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Advisory Demo Banner */}
        <div className="bg-gradient-to-r from-[#091b0f] via-[#0b2113] to-[#0d2e1a] text-white px-4 sm:px-8 py-2.5 text-xs flex items-center justify-between gap-3 shrink-0 border-b border-emerald-900/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <p className="leading-tight">
              <strong className="font-bold text-emerald-400">STYLONE Business Suite:</strong>{' '}
              Operating in isolated demonstration mode. Real database mutations and courier APIs will be activated in later integration phases.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 hover:text-white uppercase tracking-wider shrink-0"
          >
            <span>Customer Boutique</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
