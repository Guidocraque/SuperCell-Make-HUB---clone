import React from 'react';
import { X, Trophy, Download, Calendar, CheckCircle, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onSubmitSkin: () => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  onClose,
  onSubmitSkin,
}) => {
  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col">
        {/* Header Visual */}
        <div className="relative h-48 sm:h-56 bg-gray-900 shrink-0 overflow-hidden">
          <img
            src={campaign.bannerImage}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14121F] via-[#14121F]/60 to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black p-2 rounded-full text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-pink-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-display">
                {campaign.game}
              </span>
              <span className="text-amber-300 text-xs font-bold font-display">
                {campaign.character} Campaign
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              {campaign.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#1E1B2E] border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-display block">Grand Prize</span>
              <span className="text-sm font-black text-amber-400 font-display flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-4 h-4" />
                {campaign.prize}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1E1B2E] border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-display block">Timeline</span>
              <span className="text-sm font-bold text-gray-200 font-display flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                {campaign.deadline}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1E1B2E] border border-gray-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-gray-400 uppercase font-display block">Submissions</span>
              <span className="text-sm font-bold text-indigo-300 font-display flex items-center gap-1.5 mt-0.5">
                <Layers className="w-4 h-4" />
                {campaign.submissionsCount} community designs
              </span>
            </div>
          </div>

          {/* Campaign Brief */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white font-display uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Creative Brief &amp; Theme
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-body">
              {campaign.description}
            </p>
            <ul className="space-y-2 pt-1 text-xs text-gray-300">
              {campaign.brief.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Guidelines & Rules */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#1A1828] border border-gray-800">
            <h3 className="text-xs font-black text-white font-display uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Rules &amp; Technical Requirements
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {campaign.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Asset Download & Submit Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                alert(`Starting download for ${campaign.character} 3D Asset Toolkit (.blend, .fbx, UV Texture maps, Rig files)`);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-full text-xs font-display flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download 3D Rig &amp; Assets (.blend)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onSubmitSkin();
              }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-black py-3 rounded-full text-xs font-display flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <span>Submit Skin to this Campaign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
