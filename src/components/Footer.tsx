import React from 'react';
import { ExternalLink, GraduationCap, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectNav: (nav: string) => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectNav, onOpenGuide }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 pt-12 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Disclaimer Card in Footer */}
        <div className="bg-gray-800/80 rounded-2xl p-5 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm font-display flex items-center gap-2">
                <span>Declaração de Fins Didáticos</span>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  Modelo Académico / Não Oficial
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-2xl font-body leading-relaxed">
                Este website foi desenvolvido unicamente como demonstração prática e estudo didático de interface de utilizador. Não representa, não substitui e não possui ligação oficial ou patrocínio da Supercell Oy.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://supercell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs rounded-xl shadow-xs transition-all font-display"
            >
              <span>Site Oficial Supercell</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://make.supercell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs rounded-xl transition-all font-display"
            >
              <span>Supercell Make Oficial</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Footer Navigation & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-wider text-white">
                SUPERCELL
              </span>
              <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded font-display">
                MAKE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-body">
              A plataforma onde a arte da comunidade ganha vida dentro dos jogos mobile mais jogados do mundo.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-display">Navegação</h4>
            <ul className="text-xs space-y-1.5 text-gray-300 font-body">
              <li>
                <button
                  onClick={() => onSelectNav('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explorar Criações
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('campaigns')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Campanhas Ativas &amp; Encerradas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('create')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Criar Nova Skin
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('proposta')}
                  className="hover:text-indigo-400 text-indigo-300 font-semibold transition-colors cursor-pointer"
                >
                  Pedir Proposta (IA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('help')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ &amp; Chatbot
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('admin')}
                  className="hover:text-purple-400 text-purple-300 font-semibold transition-colors cursor-pointer"
                >
                  Painel de Administração
                </button>
              </li>
            </ul>
          </div>

          {/* Creator Resources */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-display">Criadores</h4>
            <ul className="text-xs space-y-1.5 text-gray-300 font-body">
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Guia de Modelação 3D
                </button>
              </li>
              <li>
                <a
                  href="https://supercell.com/en/our-games/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Jogos Supercell
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://supercell.com/en/safe-and-fair-play/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Política de Fair Play
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* External Official Sites */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-display">Ligações Oficiais</h4>
            <ul className="text-xs space-y-1.5 text-gray-300 font-body">
              <li>
                <a
                  href="https://supercell.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  supercell.com (Site Oficial)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://make.supercell.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  make.supercell.com (Supercell Make)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://supercell.com/en/support/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  Suporte Oficial Supercell
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Modelo Didático Experimental — Inspirado no Supercell Make.</p>
          <p className="flex items-center gap-1">
            Brawl Stars, Clash Royale, Clash of Clans e Hay Day são marcas registadas da Supercell Oy.
          </p>
        </div>

      </div>
    </footer>
  );
};
