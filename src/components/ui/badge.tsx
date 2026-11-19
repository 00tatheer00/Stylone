import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--color-accent-secondary)]/30 text-[var(--color-text-primary)] border-[var(--color-accent-secondary)]',
  success:
    'bg-green-50 text-green-700 border-green-200',
  warning:
    'bg-amber-50 text-[var(--color-warning)] border-amber-200',
  error:
    'bg-red-50 text-[var(--color-error)] border-red-200',
  info:
    'bg-blue-50 text-[var(--color-info)] border-blue-200',
};

function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5',
        'text-xs font-medium border',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
