import { Container } from '@/components/ui';
import { Sparkles, Truck } from 'lucide-react';

interface AnnouncementBarProps {
  message?: string;
}

function AnnouncementBar({
  message = 'ORDER ABOVE RS. 2,500 & WIN AN IPHONE 18 PRO! • FREE SAMPLE + FREE SHIPPING ON EVERY ORDER',
}: AnnouncementBarProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 text-white py-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs relative overflow-hidden border-b border-emerald-700/40 select-none">
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      <Container>
        <div className="flex items-center justify-center gap-2 text-center truncate">
          <Truck size={14} className="text-emerald-300 shrink-0" />
          <span className="truncate">{message}</span>
          <Sparkles size={13} className="text-amber-300 shrink-0 hidden sm:inline" />
        </div>
      </Container>
    </div>
  );
}

export { AnnouncementBar };
