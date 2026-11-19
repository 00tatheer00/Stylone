'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui';

interface ActiveIngredient {
  name: string;
  scientificName: string;
  purpose: string;
  description: string;
  image: string;
  badge: string;
  targetProduct: string;
}

const actives: ActiveIngredient[] = [
  {
    name: 'Cold-Pressed Red Onion Extract',
    scientificName: 'Allium Cepa Seed Extract',
    purpose: 'Root Strengthening & Anti-Fall',
    description: 'Enriched with sulfur and quercetin flavonoids. Deeply nourishes hair roots, accelerates collagen synthesis, and dramatically arrests excessive hair shedding.',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop&q=80',
    badge: 'Herbal Star',
    targetProduct: 'Anti-Hairfall Biotin Shampoo',
  },
  {
    name: 'Pure Steam-Distilled Rosemary Oil',
    scientificName: 'Rosmarinus Officinalis Leaf Oil',
    purpose: 'Follicle Reactivation & Microcirculation',
    description: 'Clinically proven to dilate micro-capillaries around dormant hair bulbs. Stimulates dense, new baby hair growth without greasy residue or scalp drying.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80',
    badge: 'Clinical Powerhouse',
    targetProduct: 'Rosemary Scalp Growth Serum',
  },
  {
    name: 'Therapeutic Biotin B7 & Peptides',
    scientificName: 'Biotinoyl Tripeptide-1 + Keratin',
    purpose: 'Strand Density & Thickness',
    description: 'The fundamental biological building block of resilient hair strands. Coats cuticle fissures, prevents split ends, and creates instant fuller strand volume.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80',
    badge: 'Bio-Active',
    targetProduct: 'Herbal Shampoo & Scalp Duo',
  },
  {
    name: 'Organic Neem & Tea Tree Extract',
    scientificName: 'Melaleuca Alternifolia + Azadirachta',
    purpose: 'Scalp Detox & Anti-Dandruff',
    description: 'Purifies scalp fungal flora, dissolves chronic sebum crystallization, and soothes itchy scalp flakes for an optimal hair growth environment.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&q=80',
    badge: 'Purifying Detox',
    targetProduct: 'Neem Anti-Dandruff Shampoo',
  },
];

export function BotanicalIngredientsShowcase() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-emerald-900/10">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>THERAPEUTIC BOTANICAL FORMULATIONS</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            What Powers Our Star Formulations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
            100% cold-pressed plant extracts and bio-identical peptides — zero sulfates, parabens, silicones, or artificial filler dyes.
          </p>
        </div>

        {/* 4 Actives Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {actives.map((item) => (
            <div
              key={item.name}
              className="group bg-[#f9fbf9] rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-700 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Thumbnail with Badge */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 260px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-emerald-900/90 text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {item.badge}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                    {item.purpose}
                  </p>
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 leading-snug mt-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 italic mt-0.5">
                    {item.scientificName}
                  </p>
                  <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Found in Link */}
              <div className="pt-4 mt-4 border-t border-slate-200/70 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                <span className="truncate">Key active in {item.targetProduct}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
