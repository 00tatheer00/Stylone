'use client';

import { useState } from 'react';
import { Container } from '@/components/ui';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Demo only — no actual subscription
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-14 md:py-20 bg-gradient-to-br from-[#166534] via-[#15803D] to-[#14532D] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-300/10 rounded-full blur-2xl" />

      <Container>
        <div className="max-w-xl mx-auto text-center relative z-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Stay in the Loop
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed">
            Be the first to know about new arrivals, exclusive offers and beauty tips.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3"
            noValidate
          >
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                placeholder="Enter your email"
                className={cn(
                  'w-full px-4 py-3 rounded-[var(--radius-md)] bg-white/10 border',
                  'text-sm text-white placeholder:text-white/40',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                  'transition-colors',
                  status === 'error'
                    ? 'border-[var(--color-error)]'
                    : 'border-white/15',
                )}
                aria-label="Email address for newsletter"
                aria-invalid={status === 'error'}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-[var(--color-accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-green)] transition-all duration-300 whitespace-nowrap active:scale-[0.97]"
            >
              <Send size={14} />
              Subscribe
            </button>
          </form>

          {/* Feedback */}
          {status === 'error' && errorMsg && (
            <p className="mt-3 text-xs text-red-300">{errorMsg}</p>
          )}
          {status === 'success' && (
            <p className="mt-3 text-xs text-green-300">
              Demo subscription received! (This is a UI demonstration — no real subscription was created.)
            </p>
          )}

          <p className="mt-5 text-[10px] text-white/30">
            UI demonstration only. No data is stored or transmitted.
          </p>
        </div>
      </Container>
    </section>
  );
}

export { Newsletter };
