'use client';

import { useState } from 'react';
import {
  Container,
  SectionHeading,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  Separator,
  LoadingIndicator,
} from '@/components/ui';
import { siteConfig } from '@/config';
import {
  Sparkles,
  Droplets,
  Palette,
  Scissors,
  Star,
  Heart,
} from 'lucide-react';

function FoundationShowcase() {
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);

  const handleLoadingDemo = (id: string) => {
    setLoadingBtn(id);
    setTimeout(() => setLoadingBtn(null), 2000);
  };

  return (
    <main className="flex-1">
      {/* ── Hero / Wordmark ───────────────────────────────── */}
      <section className="bg-[var(--color-bg-secondary)] py-16 md:py-24 lg:py-32">
        <Container className="text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">
            Foundation Preview
          </p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {siteConfig.name}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {siteConfig.categories.map((cat) => (
              <Badge key={cat} variant="default">
                {cat}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Color Palette ─────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Brand Colors"
            subtitle="The STYLONE palette — fresh botanical green, radiant and accessible."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Mint BG', color: '#F0FAF0', text: 'dark' },
              { name: 'Sage BG', color: '#E0F2E0', text: 'dark' },
              { name: 'Forest Text', color: '#1A2E1A', text: 'light' },
              { name: 'Emerald Accent', color: '#22C55E', text: 'light' },
              { name: 'Mint Accent', color: '#86EFAC', text: 'dark' },
              { name: 'White', color: '#FFFFFF', text: 'dark' },
            ].map((swatch) => (
              <div key={swatch.name} className="text-center">
                <div
                  className="h-20 md:h-24 rounded-2xl border border-[var(--color-border-light)] flex items-end justify-center pb-2 shadow-2xs"
                  style={{ backgroundColor: swatch.color }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: swatch.text === 'light' ? '#fff' : '#1A2E1A',
                    }}
                  >
                    {swatch.color}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-[var(--color-text-muted)]">
                  {swatch.name}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Typography ────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Typography"
            subtitle="Playfair Display for headings, Inter for body — editorial yet highly readable."
          />
          <div className="space-y-6 max-w-2xl">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Heading 1
              </p>
              <h1>The Art of Beauty</h1>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Heading 2
              </p>
              <h2>Premium Skincare Collection</h2>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Heading 3
              </p>
              <h3>Discover Your Routine</h3>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Heading 4
              </p>
              <h4>New Arrivals This Season</h4>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Body Text
              </p>
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                Discover STYLONE&apos;s curated selection of premium skincare,
                makeup, haircare, and beauty accessories. Every product is
                carefully sourced, inspected, and delivered with the care your
                skin deserves.
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Small / Muted Text
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Free shipping on orders above Rs. 3,000 across Pakistan.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Buttons ───────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Buttons"
            subtitle="All variants, sizes, and states."
          />
          <div className="space-y-8">
            {/* Variants */}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Variants
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Sizes
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                States
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button disabled>Disabled</Button>
                <Button
                  isLoading={loadingBtn === 'demo'}
                  onClick={() => handleLoadingDemo('demo')}
                >
                  {loadingBtn === 'demo' ? 'Loading...' : 'Click to Load'}
                </Button>
                <Button variant="outline" fullWidth className="max-w-xs">
                  Full Width
                </Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                With Icons
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">
                  <Heart size={16} />
                  Add to Wishlist
                </Button>
                <Button variant="outline">
                  <Star size={16} />
                  Rate Product
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Form Inputs ───────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Form Elements"
            subtitle="Text inputs, text areas, selects, and labels — accessible and consistent."
          />
          <div className="max-w-md space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" required>
                Full Name
              </Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="error-demo">With Error</Label>
              <Input
                id="error-demo"
                error="This field is required"
                placeholder="Something went wrong..."
              />
              <p className="text-xs text-[var(--color-error)]">
                This field is required
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="disabled-demo">Disabled</Label>
              <Input
                id="disabled-demo"
                disabled
                placeholder="Cannot edit"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category">
                <option value="">Select a category</option>
                {siteConfig.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Badges ────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Badges"
            subtitle="Semantic status indicators."
          />
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
            <Badge variant="error">Out of Stock</Badge>
            <Badge variant="info">New Arrival</Badge>
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Cards ─────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Cards"
            subtitle="Content containers with hover effects."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Droplets,
                title: 'Skincare',
                description:
                  'Premium cleansers, serums, moisturizers and treatments for every skin type.',
              },
              {
                icon: Palette,
                title: 'Makeup',
                description:
                  'Foundations, lipsticks, eye palettes and more from top brands.',
              },
              {
                icon: Scissors,
                title: 'Haircare',
                description:
                  'Shampoos, conditioners, treatments and styling essentials.',
              },
              {
                icon: Sparkles,
                title: 'Beauty Accessories',
                description:
                  'Brushes, tools, mirrors and organisers to complete your routine.',
              },
              {
                icon: Heart,
                title: 'Personal Care',
                description:
                  'Body care, fragrances and self-care essentials for daily use.',
              },
              {
                icon: Star,
                title: 'New Arrivals',
                description:
                  'Freshly curated additions to our premium beauty catalogue.',
              },
            ].map((item) => (
              <Card key={item.title} hover>
                <CardHeader>
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] flex items-center justify-center mb-3">
                    <item.icon
                      size={20}
                      className="text-[var(--color-accent)]"
                    />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Skeletons & Loading ────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Loading States"
            subtitle="Skeleton placeholders and spinning indicators."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Skeleton Card
              </p>
              <Card>
                <Skeleton className="h-40 w-full mb-4 rounded-[var(--radius-md)]" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-9 w-28" />
              </Card>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                Loading Indicators
              </p>
              <div className="flex flex-col items-start gap-6">
                <div className="flex items-center gap-4">
                  <LoadingIndicator size="sm" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Small
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <LoadingIndicator size="md" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Medium
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <LoadingIndicator size="lg" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Large
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* ── Responsive Demo ───────────────────────────────── */}
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            title="Responsive Layout"
            subtitle="Resize your browser to see columns adapt from 1 → 2 → 3 across breakpoints."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center justify-center text-sm text-[var(--color-text-muted)]"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-[var(--color-bg-secondary)] py-8 mt-auto">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-heading text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
              {siteConfig.name}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Phase 1 — Foundation Preview
            </p>
          </div>
        </Container>
      </footer>
    </main>
  );
}

export { FoundationShowcase };
