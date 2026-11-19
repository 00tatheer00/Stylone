'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface ProductAccordionProps {
  product: Product;
}

export function ProductAccordion({ product }: ProductAccordionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    benefits: true,
    ingredients: false,
    howToUse: false,
    specifications: false,
    shipping: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="border-t border-[var(--color-border-light)] divide-y divide-[var(--color-border-light)] mt-8">
      {/* 1. Description */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle('description')}
          className="w-full flex items-center justify-between text-left font-heading text-base font-semibold text-[var(--color-text-primary)]"
        >
          <span>Product Overview</span>
          <ChevronDown
            size={18}
            className={cn('transition-transform duration-200', openSections.description && 'rotate-180')}
          />
        </button>
        {openSections.description && (
          <div className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}
      </div>

      {/* 2. Key Benefits */}
      {product.benefits && product.benefits.length > 0 && (
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('benefits')}
            className="w-full flex items-center justify-between text-left font-heading text-base font-semibold text-[var(--color-text-primary)]"
          >
            <span>Key Benefits</span>
            <ChevronDown
              size={18}
              className={cn('transition-transform duration-200', openSections.benefits && 'rotate-180')}
            />
          </button>
          {openSections.benefits && (
            <div className="mt-3 space-y-2">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Ingredients (Cosmetics Specific) */}
      {product.ingredients && product.ingredients.length > 0 && (
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('ingredients')}
            className="w-full flex items-center justify-between text-left font-heading text-base font-semibold text-[var(--color-text-primary)]"
          >
            <span>Ingredients (INCI)</span>
            <ChevronDown
              size={18}
              className={cn('transition-transform duration-200', openSections.ingredients && 'rotate-180')}
            />
          </button>
          {openSections.ingredients && (
            <div className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p className="font-mono text-xs text-emerald-950 bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl leading-relaxed">
                {product.ingredients.join(', ')}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
                * Please be aware that ingredient lists may change or vary from time to time. Please refer to the ingredient list on the product package you receive for the most up to date list of ingredients.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. How to Use */}
      {product.howToUse && (
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('howToUse')}
            className="w-full flex items-center justify-between text-left font-heading text-base font-semibold text-[var(--color-text-primary)]"
          >
            <span>How to Use</span>
            <ChevronDown
              size={18}
              className={cn('transition-transform duration-200', openSections.howToUse && 'rotate-180')}
            />
          </button>
          {openSections.howToUse && (
            <div className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>{product.howToUse}</p>
            </div>
          )}
        </div>
      )}

      {/* 5. Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('specifications')}
            className="w-full flex items-center justify-between text-left font-heading text-base font-semibold text-[var(--color-text-primary)]"
          >
            <span>Specifications & Details</span>
            <ChevronDown
              size={18}
              className={cn('transition-transform duration-200', openSections.specifications && 'rotate-180')}
            />
          </button>
          {openSections.specifications && (
            <div className="mt-3 text-sm">
              <dl className="divide-y divide-[var(--color-border-light)] text-xs sm:text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-2 flex justify-between gap-4">
                    <dt className="text-[var(--color-text-muted)] font-medium">{key}</dt>
                    <dd className="text-[var(--color-text-primary)] text-right font-medium">{val}</dd>
                  </div>
                ))}
                {product.skinType && (
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[var(--color-text-muted)] font-medium">Suitable Skin Types</dt>
                    <dd className="text-[var(--color-text-primary)] text-right font-medium">
                      {product.skinType.join(', ')}
                    </dd>
                  </div>
                )}
                {product.hairType && (
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[var(--color-text-muted)] font-medium">Suitable Hair Types</dt>
                    <dd className="text-[var(--color-text-primary)] text-right font-medium">
                      {product.hairType.join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      )}

      {/* 6. Shipping & Returns */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle('shipping')}
          className="w-full flex items-center justify-between text-left font-heading text-base font-semibold text-[var(--color-text-primary)]"
        >
          <span>Shipping & Returns (Pakistan)</span>
          <ChevronDown
            size={18}
            className={cn('transition-transform duration-200', openSections.shipping && 'rotate-180')}
          />
        </button>
        {openSections.shipping && (
          <div className="mt-3 text-sm text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
            <p>
              <strong>Standard Delivery:</strong> 2 to 4 business days across major cities in Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and more).
            </p>
            <p>
              <strong>Shipping Rates:</strong> Free delivery on all orders above <strong>Rs. 3,000</strong>. A standard flat rate of Rs. 200 applies for orders below the threshold.
            </p>
            <p>
              <strong>Quality & Inspection:</strong> All products are physically received, unboxed, verified for batch authenticity, stored in climate-controlled conditions, and dispatched by STYLONE directly.
            </p>
            <p>
              <strong>7-Day Returns:</strong> If you receive a damaged, defective, or incorrect product, contact us within 7 days of delivery for a prompt replacement or refund.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
