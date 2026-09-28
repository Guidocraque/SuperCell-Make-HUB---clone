import React, { useState } from 'react';
import { X, Shield, ArrowRight, Check, Sparkles } from 'lucide-react';
import { SupercellUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: SupercellUser) => void;
  isVotePrompt?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isVotePrompt = false,
}) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'prompt' | 'email' | 'code'>('prompt');
  const [code, setCode] = useState(['', '', '', '', '', '']);

  if (!isOpen) return null;

  const handleQuickDemoLogin = (username = 'BrawlArtist_99') => {
    const demoUser: SupercellUser = {
      id: 'sc-id-99812',
      username,
      email: `${username.toLowerCase()}@supercell.id`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      gameAccounts: [
        { game: 'Brawl Stars', tag: '#2YGP908', level: 64 },
        { game: 'Clash Royale', tag: '#89LQU8', level: 14 },
        { game: 'Clash of Clans', tag: '#V809CR', level: 12 },
      ],
      votedCreations: ['kit-futurista'],
      myCreations: [],
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('code');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const username = email.split('@')[0] || 'SupercellCreator';
    handleQuickDemoLogin(username);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-purple-600/25 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mb-5 shadow-lg">
          <span className="text-white font-black text-2xl font-display">S</span>
        </div>

        {step === 'prompt' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest font-display">
                SUPERCELL ID
              </span>
              <h2 className="text-2xl font-black font-display text-white mt-1">
                Join the community!
              </h2>
            </div>

            {/* Verbatim quote from Section 6 */}
            <p className="text-sm text-gray-300 font-body leading-relaxed">
              To start voting on Creations, log in with your Supercell ID. If you don't have a Supercell ID, you can create one in any Supercell game.
            </p>

            <div className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800 flex items-center gap-3 text-xs text-gray-300">
              <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>
                One account for Brawl Stars, Clash Royale, Clash of Clans &amp; Supercell Make.
              </span>
            </div>

            <div className="space-y-2 pt-2 font-display">
              <button
                onClick={() => setStep('email')}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:opacity-90 active:scale-98 text-white font-black py-3 rounded-full text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Log In with Supercell ID</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickDemoLogin('CommunityArtist_7')}
                className="w-full bg-white/10 hover:bg-white/20 active:scale-98 text-gray-200 font-bold py-3 rounded-full text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Instant Demo Login (BrawlArtist)</span>
              </button>
            </div>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <h2 className="text-xl font-black font-display text-white">Enter your Email</h2>
              <p className="text-xs text-gray-400 mt-1">
                We will send you a 6-digit verification code to log in.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 font-display">
                SUPERCELL ID EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('prompt')}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-full text-xs font-display flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Send Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <h2 className="text-xl font-black font-display text-white">Verification Code</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter the 6 digits sent to <span className="text-white font-medium">{email || 'your email'}</span>.
              </p>
            </div>

            <div className="flex gap-2 justify-center py-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  defaultValue={idx + 1}
                  className="w-10 h-12 text-center text-lg font-bold bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-full text-xs font-display flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Confirm &amp; Log In</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
