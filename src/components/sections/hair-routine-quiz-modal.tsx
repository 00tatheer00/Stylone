'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, ShoppingBag, RotateCcw } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { products } from '@/data/products';

interface HairRoutineQuizModalProps {
  open: boolean;
  onClose: () => void;
}

export function HairRoutineQuizModal({ open, onClose }: HairRoutineQuizModalProps) {
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState('');
  const [scalpType, setScalpType] = useState('');
  const [washFreq, setWashFreq] = useState('');
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();
  const toast = useToast();

  if (!open) return null;

  const handleReset = () => {
    setStep(1);
    setConcern('');
    setScalpType('');
    setWashFreq('');
    setAdded(false);
  };

  const handleAddPrescription = () => {
    // Add Shampoo
    const shampoo = products.find((p) => p.slug === 'herbal-anti-hairfall-biotin-shampoo') || products[0];
    const serum = products.find((p) => p.slug === 'rosemary-caffeine-scalp-growth-serum') || products[1];

    addItem({
      id: shampoo.id,
      productId: shampoo.id,
      name: shampoo.name,
      price: shampoo.price,
      image: shampoo.image,
      slug: shampoo.slug,
      quantity: 1,
    });

    setTimeout(() => {
      addItem({
        id: serum.id,
        productId: serum.id,
        name: serum.name,
        price: 2250, // bundled special price
        image: serum.image,
        slug: serum.slug,
        variantName: 'Custom Quiz Protocol (15% Off)',
        quantity: 1,
      });
    }, 100);

    setAdded(true);
    toast.success('Your personalized hairfall regimen was added to your bag!', 'Regimen Prescribed');
    setTimeout(() => {
      onClose();
      handleReset();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="30-Second Hairfall Routine Finder"
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 overflow-hidden space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                AI Hair Analysis
              </p>
              <h3 className="font-heading font-black text-base text-slate-900 leading-tight">
                30-Second Hairfall Routine Finder
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close quiz modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Dots */}
        {step <= 3 && (
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Step {step} of 3</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-emerald-800' : s < step ? 'w-3 bg-emerald-400' : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-heading font-black text-lg text-slate-900">
                What is your primary hair concern?
              </h4>
              <p className="text-xs text-slate-500">
                Select the main issue you want to resolve over the next 30 days.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'hairfall', title: 'Excessive Hair Fall & Shower Shedding', desc: 'Losing chunks in shower, widening part' },
                { id: 'thinning', title: 'Slow Growth & Thinning Hairline', desc: 'Baby hairs not growing, sluggish follicles' },
                { id: 'dandruff', title: 'Stubborn Scalp Dandruff & Itching', desc: 'White flakes, dry itchy irritation' },
                { id: 'damaged', title: 'Brittle, Chemically Damaged Hair', desc: 'Rough breakage from dyes & heating' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setConcern(opt.id);
                    setStep(2);
                  }}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-700 hover:bg-[#f6faf7] text-left transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <p className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800">
                      {opt.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <ArrowRight size={15} className="text-slate-300 group-hover:text-emerald-700 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-heading font-black text-lg text-slate-900">
                What is your scalp condition?
              </h4>
              <p className="text-xs text-slate-500">
                Helps us determine the optimal botanical base formulation.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'oily', title: 'Oily & Sebum Prone', desc: 'Hair gets greasy within 24 hours of shampooing' },
                { id: 'normal', title: 'Balanced Normal Scalp', desc: 'Comfortable scalp for 2–3 days without oiliness' },
                { id: 'dry', title: 'Dry, Tight & Sensitive Scalp', desc: 'Prone to tightness, dryness, and itchiness' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setScalpType(opt.id);
                    setStep(3);
                  }}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-700 hover:bg-[#f6faf7] text-left transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <p className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800">
                      {opt.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <ArrowRight size={15} className="text-slate-300 group-hover:text-emerald-700 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-heading font-black text-lg text-slate-900">
                How often do you wash your hair?
              </h4>
              <p className="text-xs text-slate-500">
                Tailors the concentration of active cold-pressed rosemary.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'daily', title: 'Daily or Every Alternate Day' },
                { id: 'normal', title: '2 to 3 Times a Week (Recommended)' },
                { id: 'rare', title: 'Once a Week' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setWashFreq(opt.id);
                    setStep(4);
                  }}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-700 hover:bg-[#f6faf7] text-left transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between group"
                >
                  <p className="font-heading font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800">
                    {opt.title}
                  </p>
                  <ArrowRight size={15} className="text-slate-300 group-hover:text-emerald-700 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PRESCRIPTION RESULT */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Personalized Clinical Prescription
              </span>
              <h4 className="font-heading font-black text-lg text-slate-900">
                Botanical Anti-Hairfall &amp; Regrowth Ritual
              </h4>
              <p className="text-xs text-slate-600">
                Clinically formulated to arrest your hair shedding and awaken dormant follicles within 14–30 days.
              </p>
            </div>

            {/* Prescribed Pair */}
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#f8faf9] border border-slate-200 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop&q=80"
                    alt="Herbal Shampoo"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-black uppercase text-emerald-800">Step 1 • Daily Cleanse</span>
                  <p className="font-black text-xs text-slate-900 truncate">Herbal Anti-Hairfall Biotin Shampoo (300ml)</p>
                  <p className="text-[11px] font-bold text-slate-600">Rs. 1,850</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f8faf9] border border-slate-200 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop&q=80"
                    alt="Rosemary Serum"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-black uppercase text-emerald-800">Step 2 • Night Regrowth</span>
                  <p className="font-black text-xs text-slate-900 truncate">Rosemary &amp; Caffeine Scalp Serum (50ml)</p>
                  <p className="text-[11px] font-bold text-slate-600">Rs. 2,650</p>
                </div>
              </div>
            </div>

            {/* Pricing & Add Button */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Bundle Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-xl text-slate-900">
                      Rs. 3,850
                    </span>
                    <span className="text-xs text-slate-400 line-through">Rs. 4,500</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                  Free Express Delivery
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddPrescription}
                className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                  added ? 'bg-emerald-600' : 'bg-emerald-800 hover:bg-emerald-900'
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} className="stroke-[3]" />
                    <span>Prescription Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    <span>Add Custom Routine to Bag (Rs. 3,850)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center justify-center gap-1 cursor-pointer pt-1"
              >
                <RotateCcw size={12} />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
