'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Package,
  Truck,
  Users,
  Tag,
  MessageSquare,
  BarChart3,
  Globe,
  ShieldCheck,
  Settings,
  CreditCard,
  Send,
  Boxes,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Core',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: 'Commerce & Catalog',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: Package, badge: '6' },
      { label: 'Products', href: '/admin/products', icon: ShoppingBag },
      { label: 'Categories', href: '/admin/categories', icon: Layers },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes, badge: 'Low' },
    ],
  },
  {
    title: 'Procurement',
    items: [
      { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
    ],
  },
  {
    title: 'Customers & Relations',
    items: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare, badge: '1' },
    ],
  },
  {
    title: 'Marketing & Content',
    items: [
      { label: 'Coupons', href: '/admin/coupons', icon: Tag },
      { label: 'Store Content', href: '/admin/content', icon: Globe },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Operations & Settings',
    items: [
      { label: 'Shipping Rules', href: '/admin/shipping', icon: Send },
      { label: 'Payment Methods', href: '/admin/payments', icon: CreditCard },
      { label: 'Staff & Roles', href: '/admin/staff', icon: ShieldCheck },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-800 shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            STYLONE
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--color-accent)] text-stone-950">
            HQ
          </span>
        </Link>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded text-stone-400 hover:text-white hover:bg-stone-800"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-stone-800" aria-label="Admin Navigation">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors ${
                        active
                          ? 'bg-stone-800 text-white font-semibold shadow-xs'
                          : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          size={16}
                          className={active ? 'text-[var(--color-accent)]' : 'text-stone-400'}
                        />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.badge === 'Low'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-stone-700 text-stone-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Storefront link */}
      <div className="p-4 border-t border-stone-800 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] bg-stone-800/60 hover:bg-stone-800 text-xs text-stone-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe size={15} className="text-[var(--color-accent)]" />
            <span>View Public Boutique</span>
          </span>
          <ExternalLink size={12} className="text-stone-400" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
