'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/** Fade-up reveal on scroll */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/** Stagger children on scroll */
export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  stagger = 0.1,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(childSelector),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [childSelector, stagger]);

  return ref;
}

/** GSAP hover lift effect */
export function useHoverLift<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const handleEnter = () => {
      gsap.to(el, {
        y: -4,
        scale: 1.02,
        boxShadow: '0 8px 24px -6px rgba(34, 197, 94, 0.2)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        y: 0,
        scale: 1,
        boxShadow: '0 1px 2px 0 rgba(26, 46, 26, 0.05)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return ref;
}

// Re-export for convenience
export { gsap, ScrollTrigger };
