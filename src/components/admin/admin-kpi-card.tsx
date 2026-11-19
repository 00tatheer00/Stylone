import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AdminKPICardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export function AdminKPICard({
  label,
  value,
  change,
  trend,
  timeframe,
  icon: Icon,
}: AdminKPICardProps) {
  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[var(--color-border-dark)]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="font-heading text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {value}
        </p>

        <div className="flex items-center gap-2 text-xs pt-1">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold text-[11px] px-1.5 py-0.2 rounded ${
              trend === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend === 'down'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {trend === 'neutral' && <Minus size={12} />}
            <span>{change}</span>
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] truncate">
            {timeframe}
          </span>
        </div>
      </div>
    </div>
  );
}
