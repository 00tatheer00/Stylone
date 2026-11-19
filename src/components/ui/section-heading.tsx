import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

function SectionHeading({
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
