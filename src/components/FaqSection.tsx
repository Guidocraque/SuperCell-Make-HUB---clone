import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, HelpCircle, Sparkles, MessageCircleQuestion, Layers, BookOpen, Calendar as CalendarIcon, ExternalLink, Mail, User } from 'lucide-react';
import { FAQ_ITEMS, FAQ_CATEGORIES, FaqItem } from '../data/faqData';
import { ChatBot } from './ChatBot';

interface FaqSectionProps {
  onOpenMeeting?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenMeeting }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  // Filter FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq-section" aria-labelledby="faq-heading" className="px-4 sm:px-6 py-12 max-w-7xl mx-auto border-t border-gray-100">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-black uppercase px-3 py-1 rounded-full font-display">
          <HelpCircle className="w-3.5 h-3.5" />
          Centro de Ajuda &amp; Dúvidas
        </span>
        <h2 id="faq-heading" className="text-2xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-body">
          Tudo o que precisas de saber sobre as competições de skins, orçamentos técnicos 3D, votação da comunidade e jogos integrados.
        </p>
      </div>

      {/* Main Grid: FAQs on the Left (or full width) and ChatBot on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Search, Categories, and Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por Clancy, polígonos, votação, Supercell ID..."
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold font-display px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <article
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:border-gray-300 transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-display">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 font-display leading-snug">
                          {faq.question}
                        </h3>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-gray-600'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-body border-t border-gray-100 pt-3 bg-gray-50/50">
                        <p>{faq.answer}</p>

                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
                          {faq.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-medium bg-white text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 font-medium">
                  Nenhuma pergunta encontrada com o termo "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todas');
                  }}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline font-display cursor-pointer"
                >
                  Ver todas as perguntas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Chat Bot and Cal.com Meeting Scheduler Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cal.com Meeting Scheduler Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 border border-indigo-900/60 shadow-lg text-white space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-display border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sincronização Cal.com
              </span>
              <span className="text-[11px] text-gray-400 font-mono">15 / 30 / 45 min</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black font-display tracking-tight text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span>Marcar Reunião &amp; Contacto</span>
              </h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Agenda uma sessão de mentoria 3D ou esclarecimento com o organizador. Sincronizado automaticamente com o Cal.com e calendário Outlook.
              </p>
            </div>

            {/* Contact details line */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  Cal.com:
                </span>
                <span className="font-mono font-bold text-white text-[11px]">Guilherme Carapinha_real</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-800/80 pt-1.5">
                <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Outlook:
                </span>
                <a
                  href="mailto:ggcaa1@iscte-iul.pt?subject=Reuniao%20Supercell%20Make"
                  className="font-mono text-blue-300 hover:text-blue-200 text-[11px] underline"
                >
                  ggcaa1@iscte-iul.pt
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenMeeting}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all font-display flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Marcar Reunião</span>
              </button>

              <a
                href="https://cal.com/guilherme_carapinha_real"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition font-display flex items-center gap-1"
                title="Abrir página oficial no Cal.com"
              >
                <span>Cal.com</span>
                <ExternalLink className="w-3 h-3 text-gray-300" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 font-display">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Chatbot Supercell Make</span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium">Disponível 24/7</span>
          </div>

          {/* Embedded ChatBot Component */}
          <ChatBot embedded={true} onOpenMeeting={onOpenMeeting} />
        </div>
      </div>
    </section>
  );
};
