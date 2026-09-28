import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { Creation, GameType, CategoryFilter } from '../types';
import { CreationCard } from './CreationCard';

interface ExploreSectionProps {
  creations: Creation[];
  votedIds: string[];
  onVote: (id: string) => void;
  onSelectCreation: (creation: Creation) => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  creations,
  votedIds,
  onVote,
  onSelectCreation,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>('All Games');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('FEATURED');
  const [forceEmptyState, setForceEmptyState] = useState(false);

  // Filter logic
  const filteredCreations = useMemo(() => {
    if (forceEmptyState) return [];

    let list = [...creations];

    // Filter by game
    if (selectedGame !== 'All Games') {
      list = list.filter((item) => item.game === selectedGame);
    }

    // Filter by category
    if (selectedCategory === 'WINNERS') {
      list = list.filter((item) => item.isWinner);
    } else if (selectedCategory === 'FINALISTS') {
      list = list.filter((item) => item.isFinalist);
    } else if (selectedCategory === 'STAFF PICKS') {
      list = list.filter((item) => item.isStaffPick);
    } else if (selectedCategory === 'MOST VOTED') {
      list = list.sort((a, b) => b.votes - a.votes);
    } else if (selectedCategory === 'MOST RECENT') {
      list = list.reverse();
    }

    return list;
  }, [creations, selectedGame, selectedCategory, forceEmptyState]);

  const handleShowAll = () => {
    setSelectedGame('All Games');
    setSelectedCategory('FEATURED');
    setForceEmptyState(false);
  };

  return (
    <section aria-labelledby="explore-heading" className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Header bar: Title & Show All */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-display" id="explore-heading">
            Explore
          </h2>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-display">
            {filteredCreations.length} Creations
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between previewing the exact screenshot empty state and showing the gallery */}
          <button
            onClick={() => setForceEmptyState(!forceEmptyState)}
            className="text-[11px] font-bold text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-full border border-dashed border-gray-300 hover:border-gray-500 transition-colors cursor-pointer font-display"
            title="Toggle between Empty state view (as in screenshot) and live submissions"
          >
            {forceEmptyState ? 'Show Gallery' : 'Preview Empty State'}
          </button>

          <button
            onClick={handleShowAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-full transition cursor-pointer font-display"
          >
            Show all
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Dropdown Filter Selectors (Matching screenshot grid-cols-2) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
        {/* ALL GAMES Filter */}
        <div className="relative">
          <select
            value={selectedGame}
            onChange={(e) => {
              setSelectedGame(e.target.value as GameType);
              setForceEmptyState(false);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 border-none rounded-xl py-3 px-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-800 appearance-none focus:ring-2 focus:ring-black cursor-pointer font-display transition-colors"
          >
            <option value="All Games">ALL GAMES</option>
            <option value="Brawl Stars">Brawl Stars</option>
            <option value="Clash Royale">Clash Royale</option>
            <option value="Clash of Clans">Clash of Clans</option>
            <option value="Hay Day">Hay Day</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-600">
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* FEATURED Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as CategoryFilter);
              setForceEmptyState(false);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 border-none rounded-xl py-3 px-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-800 appearance-none focus:ring-2 focus:ring-black cursor-pointer font-display transition-colors"
          >
            <option value="FEATURED">FEATURED</option>
            <option value="WINNERS">Winners</option>
            <option value="FINALISTS">Finalists</option>
            <option value="MOST VOTED">Most Voted</option>
            <option value="MOST RECENT">Most Recent</option>
            <option value="STAFF PICKS">Staff Picks</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-600">
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Content Area: Creations Grid OR Empty State from Screenshot */}
      {filteredCreations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCreations.map((creation) => (
            <CreationCard
              key={creation.id}
              creation={creation}
              hasVoted={votedIds.includes(creation.id)}
              onVote={onVote}
              onClick={onSelectCreation}
            />
          ))}
        </div>
      ) : (
        /* Empty State for Explore (Verbatim from Screenshot) */
        <div className="py-16 text-center px-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-400 max-w-xs mx-auto leading-relaxed">
            It seems like we don't have what you're looking for... yet.
          </p>
          <button
            onClick={handleShowAll}
            className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline font-display cursor-pointer"
          >
            Reset filters to view all submissions
          </button>
        </div>
      )}
    </section>
  );
};
