import React, { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';

interface NotificationBannerProps {
  onViewAnnouncement: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ onViewAnnouncement }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Platform Announcement" className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white text-xs px-4 py-2 border-b border-indigo-800/40 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="bg-pink-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider font-display shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            NEW
          </span>
          <p className="truncate font-medium text-purple-100">
            Tower Skins for Clash Royale have been added to Make!
          </p>
          <button
            onClick={onViewAnnouncement}
            className="hidden sm:inline-flex items-center gap-0.5 font-bold text-pink-300 hover:text-pink-200 underline underline-offset-2 shrink-0 cursor-pointer font-display"
          >
            Explore guidelines
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-purple-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
