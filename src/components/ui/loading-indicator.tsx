import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

function LoadingIndicator({
  size = 'md',
  className,
  label = 'Loading...',
}: LoadingIndicatorProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      role="status"
      aria-label={label}
    >
      <Loader2
        className="animate-spin text-[var(--color-accent)]"
        size={sizeMap[size]}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { LoadingIndicator };
export type { LoadingIndicatorProps };
