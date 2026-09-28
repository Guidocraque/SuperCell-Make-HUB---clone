import React, { useState } from 'react';
import { ArrowRight, Trophy, Sparkles, Flame, Eye } from 'lucide-react';
import { Campaign } from '../types';

interface HeroSectionProps {
  featuredCampaign: Campaign;
  onViewCampaign: (campaign: Campaign) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredCampaign,
  onViewCampaign,
  onExploreClick,
}) => {
  const [activeTab, setActiveTab] = useState<'spotlight' | 'campaign'>('spotlight');

  return (
    <section aria-label="Featured Highlight" className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Tab Switcher on top for quick switching */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setActiveTab('spotlight')}
          className={`text-xs font-bold px-3 py-1 rounded-full transition-all cursor-pointer font-display ${
            activeTab === 'spotlight'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Community Spotlight
        </button>
        <button
          onClick={() => setActiveTab('campaign')}
          className={`text-xs font-bold px-3 py-1 rounded-full transition-all cursor-pointer font-display flex items-center gap-1.5 ${
            activeTab === 'campaign'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          Active Challenge: Clancy
        </button>
      </div>

      {/* Large Dark Hero Visual Card */}
      <div className="w-full bg-[#1e1e24] rounded-3xl min-h-[380px] sm:min-h-[420px] p-6 sm:p-10 flex flex-col justify-end text-white shadow-xl relative overflow-hidden transition-all duration-500 border border-gray-800/80">
        {/* Ambient Glowing Blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 -left-10 w-64 h-64 bg-pink-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 3D Visual Backdrop Art / Watermark */}
        <div className="absolute top-4 right-4 sm:right-10 opacity-30 sm:opacity-50 pointer-events-none">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-dashed border-purple-400/40 animate-spin" style={{ animationDuration: '30s' }}></div>
            <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 rotate-12 blur-xs"></div>
            <Trophy className="absolute w-16 h-16 sm:w-24 sm:h-24 text-amber-300 drop-shadow-xl" />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 space-y-4 max-w-2xl">
          {activeTab === 'spotlight' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase font-display text-purple-200 border border-white/10">
                  COMMUNITY SPOTLIGHT
                </span>
                <span className="text-xs text-gray-400 font-medium">Brawl Stars • Clash Royale • CoC</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight font-display text-white">
                Create &amp; Share with the Supercell Community
              </h1>

              <p className="text-sm sm:text-base text-gray-300 font-body max-w-lg leading-relaxed">
                Supercell Make is where fans become creators. Vote for the next skins to be permanently built into Brawl Stars, Clash Royale, and Clash of Clans.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onExploreClick}
                  className="bg-white hover:bg-gray-100 text-black font-display font-black text-xs sm:text-sm px-6 py-3 rounded-full transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Explore Community Skins
                </button>
                <button
                  onClick={() => onViewCampaign(featuredCampaign)}
                  className="bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-white font-display font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Featured Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-pink-500/30 text-pink-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase font-display border border-pink-400/30">
                  <Sparkles className="w-3 h-3 text-pink-300" />
                  PRIORITY CAMPAIGN
                </span>
                <span className="text-xs text-amber-300 font-extrabold font-display">
                  {featuredCampaign.prize}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight font-display text-white">
                {featuredCampaign.title}
              </h2>

              <p className="text-sm sm:text-base text-gray-300 font-body max-w-lg leading-relaxed">
                {featuredCampaign.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onViewCampaign(featuredCampaign)}
                  className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-90 text-white font-display font-black text-xs sm:text-sm px-7 py-3 rounded-full transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>View Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('spotlight')}
                  className="text-xs text-gray-400 hover:text-white px-3 py-2 cursor-pointer font-display"
                >
                  Back to Spotlight
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
