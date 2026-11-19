'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Send, Check } from 'lucide-react';
import { Container } from '@/components/ui';
import { useToast } from '@/components/ui';

interface AccordionItem {
  title: string;
  links: { label: string; href: string }[];
}

const accordionSections: AccordionItem[] = [
  {
    title: 'Company',
    links: [
      { label: 'About STYLONE', href: '/shop' },
      { label: 'Our Botanical Science', href: '/shop' },
      { label: 'Contact Us', href: '/account' },
      { label: 'Dermatologist Testing', href: '/shop' },
    ],
  },
  {
    title: 'Shop By',
    links: [
      { label: 'Herbal Shampoos', href: '/category/haircare' },
      { label: 'Active Face & Scalp Serums', href: '/category/skincare' },
      { label: 'Anti-Hairfall Rituals', href: '/category/haircare' },
      { label: 'Beauty Accessories', href: '/category/beauty-accessories' },
    ],
  },
  {
    title: 'Best Seller',
    links: [
      { label: 'Biotin Growth Shampoo', href: '/product/herbal-anti-hairfall-biotin-shampoo' },
      { label: 'Rosemary Scalp Regrowth Elixir', href: '/product/rosemary-caffeine-scalp-growth-serum' },
      { label: 'Neem Anti-Dandruff Shampoo', href: '/product/organic-neem-tea-tree-anti-dandruff-shampoo' },
      { label: 'Hyaluronic Acid Plump Serum', href: '/product/hyaluronic-acid-hydrating-plump-serum' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'Hair Regrowth & Density', href: '/category/haircare' },
      { label: 'Scalp Detoxification', href: '/category/haircare' },
      { label: 'Glass Skin Radiance', href: '/category/skincare' },
      { label: 'Value Bundles & Duos', href: '/shop' },
    ],
  },
  {
    title: 'Compliance & Safety',
    links: [
      { label: '100% Halal Formulation', href: '/shop' },
      { label: 'Sulfate & Paraben Free Guarantee', href: '/shop' },
      { label: 'Privacy Policy', href: '/shop' },
      { label: 'Terms of Service', href: '/shop' },
    ],
  },
  {
    title: 'Support & Help',
    links: [
      { label: 'Track Your Order', href: '/account/orders' },
      { label: 'Cash on Delivery (COD) Info', href: '/checkout' },
      { label: '7-Day Return Guarantee', href: '/shop' },
      { label: 'WhatsApp Customer Care', href: 'https://wa.me/923001234567' },
    ],
  },
];

export function JenpharmFooter() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const toast = useToast();

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.', 'Newsletter');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to STYLONE VIP Offers!', 'Subscribed');
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-10 pb-20 lg:pb-12 text-slate-800">
      <Container>
        {/* Media Endorsements Strip (Sunday Times, HELLO!, etc.) */}
        <div className="border-b border-slate-200 pb-8 mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all font-heading text-lg sm:text-xl font-black tracking-widest text-slate-700">
            <span>SUNDAY TIMES</span>
            <span>HELLO! PAKISTAN</span>
            <span>DAWN LIFESTYLE</span>
            <span>TRIBUNE</span>
          </div>
        </div>

        {/* Newsletter Signup (Jenpharm Style) */}
        <div className="max-w-md mx-auto text-center space-y-3 mb-10">
          <h3 className="font-heading text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Subscribe To Avail Discounts And Offers!
          </h3>
          <p className="text-xs text-slate-500">
            Get exclusive VIP discounts, early access to new drops, and clinical hair care tips.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1b4b8a]"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1b4b8a] hover:bg-[#153a6b] text-white text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              Sign Up Now
            </button>
          </form>
        </div>

        {/* Expandable Accordion Menu (Exact Jenpharm Look) */}
        <div className="border-t border-slate-200 divide-y divide-slate-100 max-w-2xl mx-auto mb-10">
          {accordionSections.map((sec) => {
            const isOpen = openSection === sec.title;
            return (
              <div key={sec.title} className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection(sec.title)}
                  className="w-full flex items-center justify-between text-left font-heading text-sm sm:text-base font-bold text-slate-900 hover:text-[#1b4b8a] transition-colors py-1 cursor-pointer select-none"
                >
                  <span>{sec.title}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 text-slate-400 ${
                      isOpen ? 'rotate-180 text-[#1b4b8a]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="mt-2.5 space-y-2 pl-2 text-xs sm:text-sm text-slate-600 animate-slide-up">
                    {sec.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="hover:text-[#1b4b8a] transition-colors block py-1"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <p>© 2026 STYLONE Laboratories. Handcrafted &amp; Authenticated in Pakistan.</p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-1">
            <Link href="/shop" className="hover:text-[#1b4b8a]">Instagram</Link>
            <span>•</span>
            <Link href="/shop" className="hover:text-[#1b4b8a]">Facebook</Link>
            <span>•</span>
            <Link href="/shop" className="hover:text-[#1b4b8a]">TikTok</Link>
            <span>•</span>
            <Link href="https://wa.me/923001234567" className="hover:text-emerald-600 font-bold">WhatsApp Care</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
