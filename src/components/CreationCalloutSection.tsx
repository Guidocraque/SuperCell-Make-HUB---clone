import React from 'react';
import { Pencil, Sparkles, BookOpen } from 'lucide-react';

interface CreationCalloutSectionProps {
  onLearnMore: () => void;
  onOpenCreate: () => void;
}

export const CreationCalloutSection: React.FC<CreationCalloutSectionProps> = ({
  onLearnMore,
  onOpenCreate,
}) => {
  return (
    <section
      aria-label="Get Started"
      className="callout-gradient text-white pt-12 sm:pt-16 pb-24 sm:pb-28 px-6 text-center relative overflow-hidden my-4 sm:my-8 rounded-3xl max-w-7xl mx-auto shadow-2xl"
    >
      {/* 3D Pencil/App Icon Representation */}
      <div className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-white/30 backdrop-blur-md p-1 shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-inner relative">
          {/* Stylized pencil graphic */}
          <svg
            className="w-12 h-12 text-white drop-shadow-md transform rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
          </svg>
        </div>
      </div>

      {/* Main Promotional Message */}
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-black max-w-lg mx-auto leading-tight mb-6 font-display text-white drop-shadow-xs">
        Ready to create? Get started by making some awesome skins for your favorite characters!
      </h2>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onLearnMore}
          className="bg-[#6c63ff] hover:bg-[#5b52f0] active:scale-95 text-white font-black text-sm uppercase px-8 py-3.5 rounded-full shadow-lg transition-transform cursor-pointer font-display tracking-wider flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>LEARN MORE</span>
        </button>

        <button
          onClick={onOpenCreate}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 text-white font-bold text-sm uppercase px-6 py-3.5 rounded-full border border-white/30 transition-all cursor-pointer font-display tracking-wider"
        >
          Submit a Concept
        </button>
      </div>

      {/* Bottom Character Graphic Silhouette Overlay (Verbatim from reference) */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-32 opacity-40 pointer-events-none flex items-end justify-center">
        {/* Abstract representation of the horned character */}
        <div className="w-40 h-28 bg-indigo-950 rounded-t-full relative">
          <div className="absolute -top-4 left-4 w-6 h-12 bg-indigo-900 rounded-tl-full rotate-[-25deg]"></div>
          <div className="absolute -top-4 right-4 w-6 h-12 bg-indigo-900 rounded-tr-full rotate-[25deg]"></div>
        </div>
      </div>
    </section>
  );
};
