import React from 'react';
import { X, Sparkles, PlusCircle, HelpCircle, Info, Flame, Trophy, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { SupercellUser } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupercellUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenCreate: () => void;
  onOpenMeeting: () => void;
  onSelectNav: (nav: string) => void;
  onOpenGuide: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onOpenLogin,
  onLogout,
  onOpenCreate,
  onOpenMeeting,
  onSelectNav,
  onOpenGuide,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="bg-[#14121F] border-l border-gray-800 text-white w-4/5 max-w-sm h-full flex flex-col p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg text-white">SUPERCELL</span>
            <span className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
              MAKE
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status */}
        <div className="py-4 border-b border-gray-800">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-gray-900"
                />
                <div>
                  <p className="font-black text-white font-display text-sm">{user.username}</p>
                  <p className="text-[11px] text-purple-400">Supercell ID Connected</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full text-xs font-bold text-gray-400 hover:text-white py-1.5 rounded-lg bg-gray-900 text-center"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white font-bold py-3 rounded-2xl text-xs font-display flex items-center justify-center gap-2 shadow-md"
            >
              <span>Log In with Supercell ID</span>
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="py-4 space-y-1 font-display flex-1 overflow-y-auto">
          <button
            onClick={() => {
              onSelectNav('explore');
              onClose();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-gray-200 hover:bg-white/10 text-sm flex items-center justify-between"
          >
            <span>Explore</span>
            <span className="text-xs text-gray-500">Creations</span>
          </button>

          <button
            onClick={() => {
              onSelectNav('campaigns');
              onClose();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-gray-200 hover:bg-white/10 text-sm flex items-center justify-between"
          >
            <span>Campaigns</span>
            <span className="text-[10px] bg-pink-500/20 text-pink-300 font-extrabold px-2 py-0.5 rounded-full">
              Clancy Japan
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenMeeting();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-emerald-200 bg-emerald-950/50 border border-emerald-500/30 text-sm flex items-center justify-between my-1"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>Marcar Reunião</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded">
              Cal.com
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenCreate();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-white bg-indigo-600/30 border border-indigo-500/30 text-sm flex items-center gap-2 my-2"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Submit a Skin</span>
          </button>

          <button
            onClick={() => {
              onSelectNav('help');
              onClose();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-gray-200 hover:bg-white/10 text-sm flex items-center justify-between"
          >
            <span>FAQ &amp; Chatbot</span>
            <HelpCircle className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenGuide();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-gray-200 hover:bg-white/10 text-sm flex items-center justify-between"
          >
            <span>About Supercell Make</span>
            <Info className="w-4 h-4 text-gray-500" />
          </button>

          <a
            href="https://supercell.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-3 py-2.5 rounded-xl font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between mt-2"
          >
            <span>Site Oficial Supercell</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800 text-[11px] text-gray-500 space-y-1">
          <p className="text-amber-400/90 font-semibold">⚠️ Modelo didático / Não oficial</p>
          <p>© Supercell Make. Brawl Stars, Clash Royale e Clash of Clans são marcas da Supercell Oy.</p>
        </div>
      </div>
    </div>
  );
};
