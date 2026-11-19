import { Container } from '@/components/ui';
import { Sparkles, Truck } from 'lucide-react';

interface AnnouncementBarProps {
  message?: string;
}

function AnnouncementBar({
  message = 'FREE EXPRESS DELIVERY ACROSS PAKISTAN ON ORDERS OVER RS. 2,500 • 100% HALAL BOTANICALS',
}: AnnouncementBarProps) {
  return (
    <div className="bg-[#064e3b] text-emerald-100 py-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs relative overflow-hidden border-b border-emerald-900/60 select-none">
      <Container>
        <div className="flex items-center justify-center gap-2 text-center truncate">
          <Truck size={14} className="text-emerald-300 shrink-0" />
          <span className="truncate">{message}</span>
        </div>
      </Container>
    </div>
  );
}

export { AnnouncementBar };
