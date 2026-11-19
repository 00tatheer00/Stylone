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
    <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:border-emerald-300 hover:shadow-[var(--shadow-green)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
          {label}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-100 to-green-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          {value}
        </p>

        <div className="flex items-center gap-2 text-xs pt-1">
          <span
            className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? 'bg-emerald-100 text-emerald-800'
                : trend === 'down'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {trend === 'neutral' && <Minus size={12} />}
            <span>{change}</span>
          </span>
          <span className="text-[11px] text-stone-400 truncate">
            {timeframe}
          </span>
        </div>
      </div>
    </div>
  );
}
