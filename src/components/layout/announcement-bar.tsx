import { Container } from '@/components/ui';
import { Sparkles, Truck } from 'lucide-react';

interface AnnouncementBarProps {
  message?: string;
}

function AnnouncementBar({
  message = '🌿 100% Herbal & Sulfate-Free Shampoos & Glow Serums — Free Express Delivery Nationwide on Rs. 3,000+',
}: AnnouncementBarProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 text-white py-2 text-xs sm:text-sm font-medium tracking-wide shadow-xs relative overflow-hidden border-b border-emerald-600/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      <Container>
        <div className="flex items-center justify-center gap-2 text-center truncate">
          <Truck size={14} className="text-emerald-300 shrink-0 hidden sm:inline" />
          <span className="truncate">{message}</span>
          <Sparkles size={13} className="text-amber-300 shrink-0 hidden sm:inline animate-pulse" />
        </div>
      </Container>
    </div>
  );
}

export { AnnouncementBar };
