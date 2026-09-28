import React, { useState } from 'react';
import { X, Heart, Share2, Award, Trophy, Check, MessageSquare, Send, Sparkles, Box } from 'lucide-react';
import { Creation } from '../types';

interface CreationDetailModalProps {
  creation: Creation | null;
  onClose: () => void;
  hasVoted: boolean;
  onVote: (id: string) => void;
}

export const CreationDetailModal: React.FC<CreationDetailModalProps> = ({
  creation,
  onClose,
  hasVoted,
  onVote,
}) => {
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Insane concept! The animations for the super kick look so fluid.',
    'I would instantly buy this skin in Brawl Stars if it gets chosen!',
    'The color palette and Japanese folklore motifs are spot-on.'
  ]);

  if (!creation) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([commentText, ...comments]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between shrink-0 bg-[#1A1828]">
          <div className="flex items-center gap-3">
            <span className="bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full font-display">
              {creation.game}
            </span>
            <span className="text-gray-400 text-xs font-medium">
              Hero: <strong className="text-white">{creation.character}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Share creation"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Visual Display */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/10 sm:aspect-16/9 flex items-center justify-center border border-gray-800">
            <img
              src={creation.thumbnail}
              alt={creation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14121F] via-transparent to-transparent"></div>

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              {creation.isWinner && (
                <span className="bg-amber-400 text-black text-xs font-black uppercase px-3 py-1 rounded-full font-display flex items-center gap-1 shadow-lg">
                  <Trophy className="w-3.5 h-3.5 fill-black" />
                  Winner
                </span>
              )}
              {creation.isFinalist && !creation.isWinner && (
                <span className="bg-purple-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full font-display flex items-center gap-1 shadow-lg">
                  <Award className="w-3.5 h-3.5" />
                  Finalist
                </span>
              )}
            </div>

            {/* Title & Vote in image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-display">
                  {creation.character} Skin
                </p>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {creation.title}
                </h2>
              </div>

              {/* Big Vote CTA */}
              <button
                onClick={() => onVote(creation.id)}
                className={`px-5 py-2.5 rounded-full font-display font-black text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 ${
                  hasVoted
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-white hover:bg-gray-100 text-black'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasVoted ? 'fill-white' : ''}`} />
                <span>{creation.votes} {hasVoted ? 'Voted' : 'Vote'}</span>
              </button>
            </div>
          </div>

          {/* Creator Profile Lockup */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1E1B2E] border border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src={creation.creator.avatar}
                alt={creation.creator.name}
                className="w-11 h-11 rounded-full border-2 border-purple-500 bg-gray-900"
              />
              <div>
                <p className="font-black text-white font-display text-sm sm:text-base">
                  {creation.creator.name}
                </p>
                <p className="text-xs text-purple-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {creation.creator.badge || 'Verified Community Artist'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-gray-400 block font-medium">Created</span>
              <span className="text-xs font-bold text-gray-200 font-display">{creation.createdAt}</span>
            </div>
          </div>

          {/* Description & Technical Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-display">
              Concept Details
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-body">
              {creation.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-display block">Polygon Count</span>
                <span className="text-xs font-bold text-indigo-300 font-display flex items-center gap-1 mt-0.5">
                  <Box className="w-3.5 h-3.5" />
                  {creation.polyCount || '3,800 tris'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-display block">Software Used</span>
                <span className="text-xs font-bold text-white font-display mt-0.5 truncate block">
                  {creation.toolsUsed.join(', ')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 uppercase font-display block">Current Status</span>
                <span className="text-xs font-bold text-amber-300 font-display mt-0.5 block">
                  {creation.badgeType}
                </span>
              </div>
            </div>
          </div>

          {/* Community Feedback / Comments */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-black text-white font-display">
                Community Feedback ({comments.length})
              </h4>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Cheer on this artist or give feedback..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold font-display cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {comments.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#1A1828] border border-gray-800/80 text-xs text-gray-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white font-display">Player_#{1024 + i}</span>
                    <span className="text-[10px] text-gray-500">Just now</span>
                  </div>
                  <p>{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
