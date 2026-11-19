'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppFloatingButton() {
  const [minimized, setMinimized] = useState(false);

  const whatsappUrl =
    'https://wa.me/923001234567?text=Hi%20STYLONE!%20I%20would%20like%20a%20free%20consultation%20regarding%20anti-hairfall%20and%20botanical%20products.';

  return (
    <aside
      aria-label="WhatsApp live chat support"
      className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2 group select-none pointer-events-auto"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#064e3b] hover:bg-[#047857] text-white shadow-xl shadow-emerald-950/25 border border-emerald-600 transition-all duration-200 active:scale-95 group/btn cursor-pointer"
        aria-label="Consult with a Hair & Skin Specialist on WhatsApp"
      >
        {/* Animated Active Specialist Pulse */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white" />
        </span>

        {/* WhatsApp Icon */}
        <MessageCircle size={18} className="fill-current text-white shrink-0" />

        {/* Text */}
        <div className="flex flex-col text-left">
          <span className="text-[11px] sm:text-xs font-black tracking-wide text-white leading-tight">
            Consult Specialist
          </span>
          <span className="text-[9px] text-emerald-200 font-bold hidden sm:inline leading-none mt-0.5">
            Free Dermatologist Advice
          </span>
        </div>
      </a>
    </aside>
  );
}
