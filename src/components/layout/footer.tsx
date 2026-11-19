import Link from 'next/link';
import { Container } from '@/components/ui';
import { siteConfig } from '@/config';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/icons/social-icons';
import { Sparkles, ShieldCheck, Heart, Mail } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Skincare', href: '/category/skincare' },
    { label: 'Makeup', href: '/category/makeup' },
    { label: 'Haircare', href: '/category/haircare' },
    { label: 'Beauty Accessories', href: '/category/beauty-accessories' },
    { label: 'Personal Care', href: '/category/personal-care' },
  ],
  customerService: [
    { label: 'Track Order', href: '/account/orders' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Return & Exchange', href: '/returns' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
  ],
  about: [
    { label: 'About STYLONE', href: '/about' },
    { label: 'Authenticity Guarantee', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0b1f11] via-[#08170c] to-[#040d06] text-white mt-auto border-t border-emerald-900/40">
      {/* Main footer */}
      <div className="py-14 md:py-18">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-xs">
                  <Sparkles size={16} />
                </div>
                <span className="font-heading text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-green-100 to-emerald-300 bg-clip-text text-transparent">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="mt-4 text-sm text-emerald-100/70 leading-relaxed max-w-xs">
                Pakistan&apos;s luxury sanctuary for skincare rituals, certified makeup, and radiant beauty wellness. Delivered nationwide with care.
              </p>

              {/* Trust Badges */}
              <div className="flex items-center gap-2 mt-4 text-xs text-emerald-300/80">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>100% Genuine Brands • COD Available</span>
              </div>

              {/* Social */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="#"
                  className="p-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-800/40 transition-all duration-300 hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramIcon width={16} height={16} />
                </a>
                <a
                  href="#"
                  className="p-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-800/40 transition-all duration-300 hover:scale-105"
                  aria-label="Facebook"
                >
                  <FacebookIcon width={16} height={16} />
                </a>
                <a
                  href="#"
                  className="p-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-800/40 transition-all duration-300 hover:scale-105"
                  aria-label="Twitter"
                >
                  <TwitterIcon width={16} height={16} />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-1.5">
                <span>Collections</span>
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-100/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
                Client Care
              </h3>
              <ul className="space-y-3">
                {footerLinks.customerService.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-100/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About & Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
                Headquarters
              </h3>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-100/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-900/60 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 mb-1">
                  <Mail size={14} />
                  <span className="font-semibold">Concierge Support</span>
                </div>
                <p className="text-emerald-100/60">support@stylone.pk</p>
                <p className="text-emerald-100/40 text-[11px] mt-0.5">Mon - Sat: 9 AM to 8 PM PKT</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-emerald-900/40 py-5 bg-[#030904]">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/50">
            <p className="flex items-center gap-1.5">
              <span>&copy; 2026 {siteConfig.name}. Handcrafted with</span>
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span>in Pakistan.</span>
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-emerald-300 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-emerald-300 transition-colors">
                Terms of Use
              </Link>
              <span>•</span>
              <Link href="/shipping" className="hover:text-emerald-300 transition-colors">
                Shipping Rates
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
