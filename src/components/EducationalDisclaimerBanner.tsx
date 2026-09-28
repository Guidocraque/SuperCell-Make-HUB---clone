import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, GraduationCap, X, ChevronDown, ChevronUp } from 'lucide-react';

export const EducationalDisclaimerBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isDismissed) {
    // Show a floating discreet reopen button so the user can always restore the disclaimer if needed
    return (
      <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
        <button
          onClick={() => setIsDismissed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs rounded-full shadow-lg border border-amber-300 transition-transform hover:scale-105"
          title="Ver aviso de projeto didático"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Modelo Didático (Não Oficial)</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Aviso de Projeto Didático"
      className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-gray-950 border-b border-amber-600/30 shadow-xs relative z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Main Notice Information */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-gray-950">
              <GraduationCap className="w-5 h-5 text-gray-950" />
            </div>

            <div className="text-xs sm:text-sm font-body leading-snug">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="bg-black text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider font-display">
                  Fins Didáticos
                </span>
                <span className="font-extrabold text-gray-950 font-display">
                  Aviso Importante:
                </span>
                <span className="text-gray-900 font-medium">
                  Este website é apenas um modelo para fins didáticos e educacionais e <strong>não é o site oficial da Supercell</strong>.
                </span>
              </div>
              <p className="text-[11px] text-gray-800 hidden sm:block mt-0.5">
                Todas as marcas comerciais, personagens e direitos de propriedade intelectual pertencem à Supercell Oy.
              </p>
            </div>
          </div>

          {/* Call-to-Action Hyperlinks & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Primary button leading to the official Supercell site */}
            <a
              href="https://supercell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-gray-900 text-white font-black text-xs rounded-xl shadow-xs hover:shadow-md transition-all font-display hover:-translate-y-0.5"
            >
              <span>Ir para o Site Oficial Supercell</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>

            {/* Direct link to original Supercell Make */}
            <a
              href="https://make.supercell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 bg-black/10 hover:bg-black/20 text-gray-950 font-bold text-xs rounded-xl transition-colors font-display"
              title="Aceder ao portal original Supercell Make"
            >
              <span>Supercell Make Oficial</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-black/10 text-gray-800 hover:text-black transition-colors ml-1"
              aria-label="Ocultar aviso"
              title="Ocultar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
};
