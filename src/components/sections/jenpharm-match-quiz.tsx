'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';

export function JenpharmMatchQuiz() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <Container>
        <div className="bg-[#064e3b] text-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-heading text-2xl sm:text-4xl font-black tracking-tight flex items-center justify-center gap-2">
              <span>Find Your Perfect Match</span>
            </h2>

            <p className="text-xs sm:text-base text-emerald-100 font-medium leading-relaxed">
              Take the guessing out of the equation! Tell us a few things about your hair and skin concerns and we&apos;ll pair you with the perfect match of STYLONE botanical solutions to support you.
            </p>

            <div className="pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-[#064e3b] hover:bg-emerald-50 font-black text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer uppercase"
              >
                Free Hair &amp; Skin Analysis
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
