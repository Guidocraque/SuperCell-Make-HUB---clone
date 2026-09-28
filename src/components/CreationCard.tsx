import React from 'react';
import { Heart, Trophy, Award, CheckCircle2 } from 'lucide-react';
import { Creation } from '../types';

interface CreationCardProps {
  creation: Creation;
  hasVoted: boolean;
  onVote: (creationId: string) => void;
  onClick: (creation: Creation) => void;
}

export const CreationCard: React.FC<CreationCardProps> = ({
  creation,
  hasVoted,
  onVote,
  onClick,
}) => {
  return (
    <article
      onClick={() => onClick(creation)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Visual Thumbnail Area */}
      <div className="relative aspect-4/3 sm:aspect-square bg-gray-900 overflow-hidden">
        <img
          src={creation.thumbnail}
          alt={creation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {creation.isWinner && (
            <span className="bg-amber-400 text-black text-[11px] font-black uppercase px-2.5 py-1 rounded-full font-display flex items-center gap-1 shadow-md">
              <Trophy className="w-3 h-3 fill-black" />
              Winner
            </span>
          )}
          {creation.isFinalist && !creation.isWinner && (
            <span className="bg-purple-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full font-display flex items-center gap-1 shadow-md">
              <Award className="w-3 h-3" />
              Finalist
            </span>
          )}
          {creation.isStaffPick && (
            <span className="bg-pink-500 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full font-display flex items-center gap-1 shadow-md">
              Staff Pick
            </span>
          )}
        </div>

        {/* Game Tag Badge (Top Right) */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/60 backdrop-blur-md text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 font-display">
            {creation.game}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider font-display">
            {creation.character}
          </p>
          <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight truncate">
            {creation.title}
          </h3>
        </div>
      </div>

      {/* Card Footer / Details & Vote Button */}
      <div className="p-3 sm:p-4 flex items-center justify-between gap-2 bg-white">
        {/* Creator Info */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={creation.creator.avatar}
            alt={creation.creator.name}
            className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate font-display">
              {creation.creator.name}
            </p>
            <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 text-indigo-500" />
              <span>{creation.creator.badge || 'Creator'}</span>
            </p>
          </div>
        </div>

        {/* Vote Button with Live Counter */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(creation.id);
          }}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black font-display transition-all cursor-pointer ${
            hasVoted
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
              : 'bg-gray-100 hover:bg-rose-500 hover:text-white text-gray-800 active:scale-95'
          }`}
          title={hasVoted ? 'You voted for this skin' : 'Vote for this skin'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              hasVoted ? 'fill-rose-500 text-rose-500' : 'group-hover:text-current'
            }`}
          />
          <span>{creation.votes}</span>
        </button>
      </div>
    </article>
  );
};
