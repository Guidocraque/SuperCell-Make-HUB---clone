import React from 'react';
import { Menu, X, User, Sparkles, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { SupercellUser } from '../types';

interface HeaderProps {
  user: SupercellUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenCreate: () => void;
  onOpenMeeting: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenLogin,
  onLogout,
  onOpenCreate,
  onOpenMeeting,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeNav,
  onSelectNav,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo & Type */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav('explore');
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="Supercell Make Home"
          >
            <span className="font-display font-black text-xl tracking-wider text-black group-hover:text-gray-800 transition-colors">
              SUPERCELL
            </span>
            <span className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs tracking-tight flex items-center justify-center font-display">
              MAKE
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-700 font-display">
            {[
              { id: 'explore', label: 'Explore' },
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'proposta', label: 'Pedir Proposta' },
              { id: 'create', label: 'Create' },
              { id: 'help', label: 'Help' },
              { id: 'about', label: 'About' },
              { id: 'admin', label: 'Admin' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'create') {
                    onOpenCreate();
                  } else {
                    onSelectNav(item.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeNav === item.id
                    ? 'bg-gray-100 text-black font-extrabold'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Action / Supercell ID profile */}
        <div className="flex items-center gap-2.5">
          {/* Schedule Meeting Button */}
          <button
            onClick={onOpenMeeting}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 active:scale-95 px-3 py-1.5 rounded-full transition-all shadow-xs cursor-pointer font-display"
            title="Marcar Reunião sincronizada com Cal.com (Guilherme Carapinha)"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Marcar Reunião</span>
            <span className="text-[9px] bg-emerald-600 text-white font-mono px-1 rounded">Cal.com</span>
          </button>

          {/* Create Button (Desktop) */}
          <button
            onClick={onOpenCreate}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-3.5 py-1.5 rounded-full transition-all shadow-xs cursor-pointer font-display"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit Skin</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded-full border border-gray-200">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-6 h-6 rounded-full border border-indigo-400 bg-white"
                />
                <span className="text-xs font-bold text-gray-900 font-display max-w-[100px] truncate">
                  {user.username}
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-1.5 py-0.2 rounded-full">
                  ID
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="text-xs text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3.5 py-1.5 rounded-full transition cursor-pointer font-display"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-[9px] text-white font-black">
                S
              </div>
              <span className="hidden sm:inline">Supercell Log In</span>
              <span className="sm:hidden">Log In</span>
            </button>
          )}

          {/* Hamburger Navigation Trigger (Mobile) */}
          <button
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
