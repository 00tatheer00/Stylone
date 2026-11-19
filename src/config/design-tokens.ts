/**
 * STYLONE Design Tokens — GREEN THEME
 *
 * Central design system configuration.
 * All visual constants referenced across the application.
 * Easily adjustable — change here, reflected everywhere.
 */

export const colors = {
  /** Primary mint-green background */
  background: {
    primary: '#F0FAF0',
    secondary: '#E0F2E0',
  },
  /** Text colors */
  text: {
    primary: '#1A2E1A',
    secondary: '#3D5A3D',
    muted: '#6B8A6B',
    inverse: '#FFFFFF',
  },
  /** Brand accents — GREEN */
  accent: {
    primary: '#22C55E',
    secondary: '#86EFAC',
    hover: '#16A34A',
  },
  /** UI surfaces */
  surface: {
    white: '#FFFFFF',
    card: '#FFFFFF',
    border: '#C6E7C6',
    borderLight: '#DCF0DC',
  },
  /** Semantic */
  semantic: {
    success: '#15803D',
    error: '#DC2626',
    warning: '#D97706',
    info: '#2563EB',
  },
} as const;

export const typography = {
  /** Font families — referencing CSS custom properties */
  family: {
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
  },
  /** Type scale (rem) */
  size: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  /** Font weights */
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  /** Line heights */
  leading: {
    tight: '1.2',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },
  /** Letter spacing */
  tracking: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.2em',
  },
} as const;

export const spacing = {
  /** Page gutters by breakpoint */
  gutter: {
    mobile: '1rem',    // 16px
    tablet: '2rem',    // 32px
    desktop: '4rem',   // 64px
  },
  /** Section vertical spacing */
  section: {
    sm: '2rem',
    md: '4rem',
    lg: '6rem',
  },
  /** Container max-width */
  container: '1280px',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(26, 46, 26, 0.05)',
  md: '0 2px 8px -2px rgba(26, 46, 26, 0.08)',
  lg: '0 4px 16px -4px rgba(26, 46, 26, 0.1)',
  xl: '0 8px 32px -8px rgba(26, 46, 26, 0.12)',
  green: '0 4px 20px -4px rgba(34, 197, 94, 0.25)',
  greenLg: '0 8px 32px -6px rgba(34, 197, 94, 0.3)',
} as const;

export const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;
