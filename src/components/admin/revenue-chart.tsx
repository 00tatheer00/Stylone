'use client';

import { useState } from 'react';
import { adminRevenueHistory } from '@/data/admin-demo';
import { formatPKR } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

export function RevenueChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const data = adminRevenueHistory;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-light)] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border-light)]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[var(--color-accent)]" />
            <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
              Revenue Trajectory (PKR)
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            12-month trailing gross sales and consignment volume
          </p>
        </div>

        {/* Selected Data Point Highlight */}
        <div className="text-left sm:text-right">
          {hoveredIndex !== null ? (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
                {data[hoveredIndex].month} 2026
              </span>
              <p className="text-base font-bold text-[var(--color-text-primary)]">
                {formatPKR(data[hoveredIndex].revenue)}
                <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-2">
                  ({data[hoveredIndex].orders} orders)
                </span>
              </p>
            </div>
          ) : (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
                Annual Total
              </span>
              <p className="text-base font-bold text-[var(--color-text-primary)]">
                {formatPKR(data.reduce((acc, d) => acc + d.revenue, 0))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="relative pt-6 pb-2">
        <div className="grid grid-cols-12 gap-1.5 sm:gap-3 items-end h-48 sm:h-56">
          {data.map((item, idx) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar */}
                <div className="w-full relative flex items-end justify-center">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-[3px] transition-all duration-300 ${
                      isHovered
                        ? 'bg-[var(--color-accent)] shadow-sm'
                        : 'bg-stone-800 hover:bg-stone-700'
                    }`}
                  />
                </div>

                {/* X-axis label */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs transition-colors ${
                    isHovered
                      ? 'font-bold text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-border-light)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] flex-wrap gap-2">
        <span>Average order value: Rs. 3,870</span>
        <span>Peak month: December (Rs. 3.15M)</span>
        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono text-[10px]">
          Demo Revenue Model
        </span>
      </div>
    </div>
  );
}
