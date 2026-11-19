import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] animate-shimmer',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
