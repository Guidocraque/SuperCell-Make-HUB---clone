import React, { useState } from 'react';
import { X, Upload, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { Creation, GameType, SupercellUser } from '../types';

interface CreateSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupercellUser | null;
  onRequireLogin: () => void;
  onSubmitCreation: (creation: Creation) => void;
}

const PRESET_ART_OPTIONS = [
  {
    label: 'Cyber Mech Concept',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Samurai Folklore',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Arcane Castle Tower',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Neon Brawler',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  },
];

export const CreateSkinModal: React.FC<CreateSkinModalProps> = ({
  isOpen,
  onClose,
  user,
  onRequireLogin,
  onSubmitCreation,
}) => {
  const [title, setTitle] = useState('');
  const [game, setGame] = useState<GameType>('Brawl Stars');
  const [character, setCharacter] = useState('Clancy');
  const [description, setDescription] = useState('');
  const [toolInput, setToolInput] = useState('Blender, Procreate');
  const [imageUrl, setImageUrl] = useState(PRESET_ART_OPTIONS[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }
    if (!title.trim()) return;

    const newCreation: Creation = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      game,
      character: character.trim() || 'Hero',
      creator: {
        name: user.username,
        avatar: user.avatar,
        badge: 'Verified Maker',
      },
      votes: 1,
      isFinalist: false,
      badgeType: 'Popular',
      thumbnail: imageUrl,
      imageAlt: `${title} preview artwork`,
      accentColor: '#6366f1',
      description: description.trim() || 'A fresh community skin idea submitted to Supercell Make.',
      toolsUsed: toolInput.split(',').map((t) => t.trim()),
      createdAt: 'Just now',
      polyCount: '3,500 tris',
    };

    onSubmitCreation(newCreation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl my-auto relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between shrink-0 bg-[#1A1828]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white leading-tight">
                Submit Your Skin Creation
              </h2>
              <p className="text-[11px] text-gray-400">Share your original design with the Supercell Community</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {!user && (
            <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-700/60 flex items-center justify-between gap-3 text-xs">
              <span className="text-purple-200">
                You need a Supercell ID to publish creations to Make.
              </span>
              <button
                type="button"
                onClick={onRequireLogin}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-full font-display shrink-0"
              >
                Log In
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 font-display">GAME</label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value as GameType)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Brawl Stars">Brawl Stars</option>
                <option value="Clash Royale">Clash Royale</option>
                <option value="Clash of Clans">Clash of Clans</option>
                <option value="Hay Day">Hay Day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 font-display">CHARACTER</label>
              <input
                type="text"
                required
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                placeholder="e.g. Clancy, Mortis, Tower"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 font-display">SKIN TITLE</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyber Ronin Clancy"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 font-display">
              CONCEPT ARTWORK / THUMBNAIL
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_ART_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(opt.url)}
                  className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                    imageUrl === opt.url ? 'border-indigo-500 ring-2 ring-indigo-400' : 'border-gray-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white p-0.5 truncate font-display">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or enter custom image URL"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 font-display">DESCRIPTION &amp; LORE</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your skin design, weapon effects, super animation idea..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 font-display">TOOLS USED</label>
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              placeholder="e.g. Blender, ZBrush, Photoshop"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 active:scale-95 text-white font-bold py-2.5 rounded-full text-xs font-display flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Publish to Supercell Make</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
