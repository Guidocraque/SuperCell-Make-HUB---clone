import React, { useState } from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

interface CookieBannerProps {
  onLearnMore?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onLearnMore }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    personalisation: false,
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Sticky Bottom Banner matching Screenshot & HTML */}
      <aside
        aria-label="Cookie consent"
        className="sticky bottom-0 z-40 bg-[#0f0f11] text-white p-4 border-t border-gray-800 shadow-2xl"
      >
        <div className="max-w-md mx-auto space-y-3">
          <p className="text-[11px] leading-tight text-gray-300 font-body">
            We use cookies to enable site functionality, personalisation and analytics, but it's up to you! Click "Manage Cookies" to adjust preferences.{' '}
            <a
              href="#cookie-policy"
              onClick={(e) => {
                e.preventDefault();
                setShowManageModal(true);
              }}
              className="text-blue-400 underline font-medium cursor-pointer"
            >
              Learn more »
            </a>
          </p>

          <div className="flex flex-col gap-2 pt-1 font-display">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#2563eb] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Accept All Cookies
            </button>
            <button
              onClick={() => setShowManageModal(true)}
              className="text-xs font-semibold text-gray-300 hover:text-white py-1 transition-colors cursor-pointer text-center"
            >
              Manage Cookies
            </button>
          </div>
        </div>
      </aside>

      {/* Manage Cookies Preferences Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#14121F] border border-gray-800 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowManageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h3 className="text-lg font-black font-display">Cookie Preferences</h3>
            </div>

            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              Supercell uses cookies to analyze site traffic, remember your preferences, and deliver personalized gaming campaigns. You can adjust your consent below.
            </p>

            <div className="space-y-4 mb-6 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <div>
                  <p className="font-bold font-display text-white">Strictly Necessary</p>
                  <p className="text-gray-400 text-[11px]">Required for Supercell ID login and security.</p>
                </div>
                <span className="text-indigo-400 font-bold text-[11px]">Always Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <div>
                  <p className="font-bold font-display text-white">Personalisation &amp; Voting</p>
                  <p className="text-gray-400 text-[11px]">Remembers voted creations and game categories.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.personalisation}
                  onChange={(e) =>
                    setPreferences({ ...preferences, personalisation: e.target.checked })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <div>
                  <p className="font-bold font-display text-white">Analytics &amp; Performance</p>
                  <p className="text-gray-400 text-[11px]">Helps Supercell optimize submission loading speeds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowManageModal(false);
                  setIsOpen(false);
                }}
                className="flex-1 bg-[#2563eb] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs font-display cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                onClick={() => {
                  setShowManageModal(false);
                  setIsOpen(false);
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl text-xs font-display cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
