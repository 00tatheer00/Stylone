'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/* ─── Reusable animation presets ─── */

export function fadeInUp(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay,
      ease: 'power2.out',
    },
  );
}

export function staggerFadeIn(
  parent: Element,
  childSelector: string,
  stagger = 0.1,
) {
  return gsap.fromTo(
    parent.querySelectorAll(childSelector),
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    },
  );
}

export function scaleIn(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { scale: 0.92, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay,
      ease: 'back.out(1.4)',
    },
  );
}

export function parallax(element: gsap.TweenTarget, speed = 50) {
  return gsap.to(element, {
    y: speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element as Element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

export function hoverLift(element: HTMLElement) {
  const enter = () => {
    gsap.to(element, {
      y: -4,
      scale: 1.02,
      boxShadow: '0 8px 24px -6px rgba(34, 197, 94, 0.2)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };
  const leave = () => {
    gsap.to(element, {
      y: 0,
      scale: 1,
      boxShadow: '0 1px 2px 0 rgba(26, 46, 26, 0.05)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mouseenter', enter);
  element.addEventListener('mouseleave', leave);

  return () => {
    element.removeEventListener('mouseenter', enter);
    element.removeEventListener('mouseleave', leave);
  };
}
