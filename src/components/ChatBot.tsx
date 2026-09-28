import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, ShieldCheck, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { SUGGESTED_QUESTIONS, answerFromLocalKnowledge } from '../data/faqData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatBotProps {
  embedded?: boolean;
  onOpenMeeting?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ embedded = false, onOpenMeeting }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Olá! Sou o assistente oficial do **Supercell Make**. Posso responder a qualquer dúvida sobre este website, como participar em competições e campanhas, regras para submissão de skins e detalhes sobre os jogos integrados (Brawl Stars, Clash Royale, Clash of Clans e Hay Day). O que gostarias de saber?',
      timestamp: 'Agora'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server-side /api/chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      let botReply = '';

      if (response.ok) {
        const data = await response.json();
        if (data.reply && !data.fallback) {
          botReply = data.reply;
        } else {
          // Use guaranteed local grounding knowledge
          botReply = answerFromLocalKnowledge(query);
        }
      } else {
        // Fallback to grounded local knowledge
        botReply = answerFromLocalKnowledge(query);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      const fallbackReply = answerFromLocalKnowledge(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'Histórico reiniciado! Pergunta-me qualquer coisa sobre as competições de skins do Supercell Make ou sobre os jogos Brawl Stars, Clash Royale e Clash of Clans.',
        timestamp: 'Agora'
      }
    ]);
  };

  return (
    <div className={`bg-[#14121F] border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl ${embedded ? 'h-[580px] sm:h-[620px]' : 'h-full'}`}>
      {/* Bot Header */}
      <div className="p-4 sm:p-5 bg-[#1A1828] border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1A1828] rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black font-display text-white">
                Supercell Make Bot
              </h3>
              <span className="bg-purple-900/60 text-purple-300 text-[10px] font-extrabold px-2 py-0.2 rounded-full font-display border border-purple-700/50">
                Assistente Oficial
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Responde exclusivamente sobre este website e jogos</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          title="Limpar conversa"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Questions Chips */}
      <div className="p-2.5 bg-[#12101B] border-b border-gray-800/80 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] font-bold font-display text-gray-300 hover:text-white bg-white/5 hover:bg-indigo-600/30 border border-gray-800 hover:border-indigo-500/50 px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white font-display'
                  : 'bg-purple-900/70 text-purple-200 border border-purple-700/40'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs shadow-md'
                  : 'bg-[#1E1B2E] border border-gray-800 text-gray-200 rounded-tl-xs shadow-sm'
              }`}
            >
              {/* Simple Markdown Renderer for bolding and bullet lists */}
              <div className="whitespace-pre-line space-y-1">
                {msg.text.split('\n').map((line, lIdx) => {
                  // Replace **bold** with strong tag
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={lIdx} className={line.startsWith('•') ? 'pl-2 text-indigo-200' : ''}>
                      {parts.map((p, pIdx) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return (
                            <strong key={pIdx} className="text-white font-bold">
                              {p.slice(2, -2)}
                            </strong>
                          );
                        }
                        return p;
                      })}
                    </p>
                  );
                })}
              </div>

              {/* Quick schedule action if message discusses meetings/Cal.com/Guilherme */}
              {msg.sender === 'bot' && (msg.text.includes('Cal.com') || msg.text.includes('reunião') || msg.text.includes('Guilherme Carapinha')) && (
                <div className="mt-3 pt-2.5 border-t border-gray-700/60 flex flex-wrap items-center gap-2">
                  {onOpenMeeting && (
                    <button
                      type="button"
                      onClick={onOpenMeeting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition font-display"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Marcar Reunião no Cal.com</span>
                    </button>
                  )}
                  <a
                    href="https://cal.com/guilherme_carapinha_real"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-medium rounded-xl transition"
                  >
                    <span>cal.com/guilherme_carapinha_real</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <span
                className={`text-[9px] mt-1.5 block ${
                  msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-gray-500 text-left'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-900/70 border border-purple-700/40 flex items-center justify-center shrink-0 mt-0.5 text-purple-200">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#1E1B2E] border border-gray-800 rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-gray-400 font-medium ml-1">A consultar regulamentos...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-[#1A1828] border-t border-gray-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pergunta sobre as competições, regras 3D ou jogos..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white p-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
        <p className="text-[10px] text-gray-500 text-center mt-2">
          O bot responde exclusivamente com conteúdos do Supercell Make, regras de eventos e jogos associados.
        </p>
      </div>
    </div>
  );
};
