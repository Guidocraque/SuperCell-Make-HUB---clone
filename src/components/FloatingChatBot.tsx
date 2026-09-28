import React, { useState } from 'react';
import { MessageSquare, X, Bot, Sparkles, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { ChatBot } from './ChatBot';

interface FloatingChatBotProps {
  onOpenMeeting: () => void;
}

export const FloatingChatBot: React.FC<FloatingChatBotProps> = ({ onOpenMeeting }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button Dock */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        {!isOpen && (
          <>
            {/* 1. Botão Marcar Reuniões (Sincronizado com Cal.com) */}
            <button
              onClick={onOpenMeeting}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 hover:-translate-y-0.5"
              aria-label="Marcar reunião com sincronização Cal.com"
              title="Marcar Reunião com Guilherme Carapinha (Cal.com)"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-700 animate-pulse"></span>
              </div>
              <div className="text-left">
                <div className="text-xs font-black font-display tracking-tight flex items-center gap-1.5">
                  <span>Marcar Reunião</span>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono font-bold">
                    Cal.com
                  </span>
                </div>
                <div className="text-[10px] text-emerald-100 font-medium leading-none">
                  Guilherme Carapinha
                </div>
              </div>
            </button>

            {/* 2. Botão Perguntar à Inteligência Artificial */}
            <button
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 hover:-translate-y-0.5"
              aria-label="Abrir assistente virtual do Supercell Make"
              title="Perguntar ao Bot de Inteligência Artificial"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-700"></span>
              </div>
              <div className="text-left">
                <div className="text-xs font-black font-display tracking-tight flex items-center gap-1">
                  <span>Perguntar ao Bot</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </div>
                <div className="text-[10px] text-indigo-200 font-medium leading-none">
                  Dúvidas do Make &amp; Jogos
                </div>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Floating Chat Modal / Popup */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] z-50 flex flex-col p-4 sm:p-0 animate-fade-in">
          <div className="relative w-full h-full bg-[#14121F] rounded-3xl shadow-2xl border border-gray-700/80 flex flex-col overflow-hidden">
            {/* Close floating button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Fechar chatbot"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ChatBot inside modal */}
            <div className="flex-1 h-full">
              <ChatBot embedded={false} onOpenMeeting={onOpenMeeting} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
