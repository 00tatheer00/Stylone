import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-md)] bg-[var(--color-border-light)]',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
