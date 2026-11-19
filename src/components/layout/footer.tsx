import Link from 'next/link';
import { Container } from '@/components/ui';
import { siteConfig } from '@/config';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/icons/social-icons';

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
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'FAQs', href: '/faq' },
  ],
  about: [
    { label: 'About STYLONE', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

function Footer() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-white mt-auto">
      {/* Main footer */}
      <div className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <span className="font-heading text-2xl font-bold tracking-tight">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xs">
                Pakistan&apos;s destination for premium beauty — carefully curated
                skincare, makeup, haircare and beauty essentials.
              </p>
              {/* Social */}
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="#"
                  className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  aria-label="Instagram (placeholder)"
                >
                  <InstagramIcon width={16} height={16} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  aria-label="Facebook (placeholder)"
                >
                  <FacebookIcon width={16} height={16} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  aria-label="Twitter (placeholder)"
                >
                  <TwitterIcon width={16} height={16} />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                Shop
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.customerService.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                About
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.about.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Contact
                </h3>
                <p className="text-sm text-white/60">
                  support@stylone.pk
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              &copy; 2026 {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Terms
              </Link>
              <Link href="/shipping" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Shipping
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export { Footer };
