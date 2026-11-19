'use client';

import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const dotSizeMap = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
};

const gapMap = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
};

function LoadingIndicator({
  size = 'md',
  className,
  label = 'Loading...',
}: LoadingIndicatorProps) {
  return (
    <div
      className={cn('flex items-center justify-center', gapMap[size], className)}
      role="status"
      aria-label={label}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'rounded-full bg-[var(--color-accent)]',
            dotSizeMap[size],
          )}
          style={{
            animation: `bounce-dots 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { LoadingIndicator };
export type { LoadingIndicatorProps };
