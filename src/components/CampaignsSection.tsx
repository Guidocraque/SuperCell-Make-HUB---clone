import React, { useState } from 'react';
import { ChevronRight, Calendar, Award, Users, ArrowUpRight, Lock, CheckCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignsSectionProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
}

export const CampaignsSection: React.FC<CampaignsSectionProps> = ({
  campaigns,
  onSelectCampaign,
}) => {
  // Let user toggle between viewing the exact empty state from screenshot ("0 Open") and all campaigns
  const [viewFilter, setViewFilter] = useState<'all' | 'open_only'>('all');

  const openCampaigns = campaigns.filter((c) => c.status === 'Open');
  const displayedCampaigns = viewFilter === 'open_only' ? [] : campaigns;

  return (
    <section aria-labelledby="campaigns-heading" className="px-4 sm:px-6 py-6 border-t border-gray-100 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-display" id="campaigns-heading">
            Campaigns
          </h2>
          <button
            onClick={() => setViewFilter(viewFilter === 'open_only' ? 'all' : 'open_only')}
            className="text-xs font-bold text-pink-500 hover:text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 transition-colors cursor-pointer font-display"
            title="Click to toggle 0 Open mode"
          >
            {viewFilter === 'open_only' ? '0 Open' : `${openCampaigns.length} Open • ${campaigns.length} Total`}
          </button>
        </div>

        {/* Show all action */}
        <button
          onClick={() => setViewFilter('all')}
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-full transition cursor-pointer font-display"
        >
          Show all
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Campaigns Content: Cards Grid or Empty State from Screenshot */}
      {displayedCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCampaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => onSelectCampaign(camp)}
              className="group bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative h-48 bg-gray-900 overflow-hidden">
                <img
                  src={camp.bannerImage}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14121F] via-[#14121F]/40 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {camp.status === 'Open' ? (
                    <span className="bg-emerald-500 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full font-display shadow-md flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      Open for Submissions
                    </span>
                  ) : (
                    <span className="bg-gray-800/90 text-gray-300 text-[11px] font-black uppercase px-2.5 py-1 rounded-full font-display border border-gray-700 shadow-md flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Campaign Closed
                    </span>
                  )}
                </div>

                {/* Game Pill */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 font-display">
                    {camp.game}
                  </span>
                </div>

                {/* Bottom title inside banner */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-display">
                    {camp.character}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight line-clamp-2">
                    {camp.title}
                  </h3>
                </div>
              </div>

              {/* Campaign Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Prize Pool</span>
                    <span className="font-extrabold text-gray-900 font-display text-right max-w-[65%] truncate">
                      {camp.prize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Submissions</span>
                    <span className="font-bold text-gray-900 font-display">
                      {camp.submissionsCount} designs
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCampaign(camp);
                  }}
                  className="w-full bg-gray-100 hover:bg-black hover:text-white text-gray-900 font-bold font-display text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Campaign</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State for Campaigns (Verbatim from Screenshot) */
        <div className="py-16 text-center px-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-400 max-w-xs mx-auto leading-relaxed">
            It seems like we don't have what you're looking for... yet.
          </p>
          <button
            onClick={() => setViewFilter('all')}
            className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline font-display cursor-pointer"
          >
            Show past &amp; featured campaigns
          </button>
        </div>
      )}
    </section>
  );
};
