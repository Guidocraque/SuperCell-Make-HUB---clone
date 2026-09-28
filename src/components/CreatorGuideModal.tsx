import React from 'react';
import { X, BookOpen, Download, Palette, Users, Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface CreatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreating: () => void;
}

export const CreatorGuideModal: React.FC<CreatorGuideModalProps> = ({
  isOpen,
  onClose,
  onStartCreating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="callout-gradient p-6 sm:p-8 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-display">
            CREATOR WORKBOOK
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-2">
            Your Art. In Our Games.
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 font-body mt-1 max-w-md">
            Supercell Make offers fans a legitimate pathway to see their own designs integrated into massive global games.
          </p>
        </div>

        {/* Steps Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#1E1B2E] border border-gray-800 space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black font-display flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-black text-white font-display text-sm">Download 3D Templates</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Grab official high-poly and low-poly 3D models of characters like Clancy, Mortis, or Clash towers. Formats include .FBX and .BLEND.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#1E1B2E] border border-gray-800 space-y-2">
              <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-black font-display flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-black text-white font-display text-sm">Design &amp; Model</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Concept 2D turnaround views or sculpt directly in Blender, ZBrush, or Procreate. Keep textures sharp and silhouettes unmistakable!
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#1E1B2E] border border-gray-800 space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-black font-display flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-black text-white font-display text-sm">Community Voting</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Submit before the countdown timer expires. Rally fans and players to vote for your skin to reach the Finalist bracket.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#1E1B2E] border border-gray-800 space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-black font-black font-display flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-black text-white font-display text-sm">Winner Selection</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Supercell Game Artists and Directors pick the grand winner among finalists. Winner receives cash rewards and immortalization in-game!
              </p>
            </div>
          </div>

          {/* Quick FAQ answering objections */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
            <h4 className="text-xs font-black text-white font-display uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Frequently Asked Questions
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <p>
                <strong className="text-white block font-display">Do I need to be a professional 3D artist?</strong>
                No! Many past winners submitted strong 2D concept turnarounds, and our 3D team collaborated to bring them into the game engine.
              </p>
              <p>
                <strong className="text-white block font-display">How does voting work?</strong>
                Anyone logged in with a Supercell ID can cast 1 vote per creation. Submissions hitting 250+ votes become official Finalists.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onStartCreating();
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:opacity-90 active:scale-95 text-white font-black py-3 rounded-full text-xs font-display flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Submit a Skin Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
