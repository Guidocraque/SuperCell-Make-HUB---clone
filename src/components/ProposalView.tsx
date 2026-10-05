import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PropostaPublica } from '../types/proposta';
import {
  FileText,
  Calendar,
  Clock,
  Mail,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

export interface ProposalViewProps {
  token: string;
  onBackToHome?: () => void;
  isModal?: boolean;
  onClose?: () => void;
  initialProposta?: PropostaPublica | null;
}

function converterParaPropostaPublica(docData: any): PropostaPublica {
  return {
    numeroProposta: docData.numeroProposta || 'PROP-DEMO',
    dataCriacao: docData.dataCriacao || new Date().toISOString(),
    dataValidade: docData.dataValidade || new Date().toISOString(),
    resumoAmbito: docData.resumoAmbito || 'Proposta comercial de serviços.',
    itens: docData.itens || [],
    totalCentimos: docData.totalCentimos || 0,
    condicoes: docData.condicoes || '',
    isDemonstracao: docData.isDemonstracao ?? true,
    comentarioAdmin: docData.comentarioAdmin || undefined,
    precoAjustadoManualmente: docData.precoAjustadoManualmente || undefined,
    contactosNegocio: {
      nome: 'Supercell Make HUB (Clone Pedagógico)',
      email: 'ggcaa1@iscte-iul.pt',
      agendamentoUrl: 'https://cal.com/guilherme_carapinha_real',
    },
  };
}

export function ProposalView({
  token,
  onBackToHome,
  isModal = false,
  onClose,
  initialProposta,
}: ProposalViewProps) {
  const [proposta, setProposta] = useState<PropostaPublica | null>(() => initialProposta || null);
  const [loading, setLoading] = useState(() => !initialProposta);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Se a proposta já foi fornecida diretamente, renderizar de imediato
    if (initialProposta) {
      setProposta(initialProposta);
      setLoading(false);
      return;
    }

    // Definir robots noindex para privacidade
    const metaTag = document.createElement('meta');
    metaTag.name = 'robots';
    metaTag.content = 'noindex, nofollow';
    document.head.appendChild(metaTag);

    async function carregarProposta() {
      try {
        setLoading(true);
        setError(null);
        const cleanToken = (token || '')
          .trim()
          .replace(/^#+/, '')
          .replace(/^\/+/, '')
          .replace(/\/+$/, '')
          .split('?')[0]
          .split('#')[0];

        if (!cleanToken) {
          throw new Error('Identificador da proposta em falta.');
        }

        // Tentativa 1: API REST do Backend Local (/api/propostas/:token)
        try {
          const res = await fetch(`/api/propostas/${encodeURIComponent(cleanToken)}`);
          if (res.ok) {
            const text = await res.text();
            if (text.trim().startsWith('{')) {
              const data = JSON.parse(text);
              if (data && data.numeroProposta) {
                setProposta(data);
                return;
              }
            }
          }
        } catch (apiErr) {
          console.warn('API local falhou ou devolveu HTML, a tentar alternativas...', apiErr);
        }

        // Tentativa 2: Consulta direta ao Cloud Firestore (Multi-estratégia resiliente e pública)
        try {
          // A) Por campo 'token'
          const q = query(collection(db, 'propostas'), where('token', '==', cleanToken));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setProposta(converterParaPropostaPublica(snap.docs[0].data()));
            return;
          }

          // B) Por ID de documento direto
          const docSnap = await getDoc(doc(db, 'propostas', cleanToken));
          if (docSnap.exists()) {
            setProposta(converterParaPropostaPublica(docSnap.data()));
            return;
          }

          // C) Por 'numeroProposta' (ex: PROP-2026-0002)
          const qNum = query(collection(db, 'propostas'), where('numeroProposta', '==', cleanToken));
          const snapNum = await getDocs(qNum);
          if (!snapNum.empty) {
            setProposta(converterParaPropostaPublica(snapNum.docs[0].data()));
            return;
          }

          // D) Por 'pedidoId'
          const qPed = query(collection(db, 'propostas'), where('pedidoId', '==', cleanToken));
          const snapPed = await getDocs(qPed);
          if (!snapPed.empty) {
            setProposta(converterParaPropostaPublica(snapPed.docs[0].data()));
            return;
          }

          // E) Varrimento de segurança para correspondência insensível a maiúsculas/minúsculas
          const allSnap = await getDocs(collection(db, 'propostas'));
          for (const d of allSnap.docs) {
            const docData = d.data();
            if (
              docData.token === cleanToken ||
              d.id === cleanToken ||
              docData.numeroProposta === cleanToken ||
              docData.pedidoId === cleanToken ||
              (docData.token && docData.token.toLowerCase() === cleanToken.toLowerCase())
            ) {
              setProposta(converterParaPropostaPublica(docData));
              return;
            }
          }
        } catch (fsErr) {
          console.warn('Consulta direta ao Firestore encontrou aviso, a tentar fallback remoto:', fsErr);
        }

        // Tentativa 3: API Backend do Google AI Studio
        if (typeof window !== 'undefined' && !window.location.host.includes('supercell-make-hub.ai.studio')) {
          try {
            const remoteUrl = `https://supercell-make-hub.ai.studio/api/propostas/${encodeURIComponent(cleanToken)}`;
            const resRemote = await fetch(remoteUrl);
            if (resRemote.ok) {
              const textRemote = await resRemote.text();
              if (textRemote.trim().startsWith('{')) {
                const dataRemote = JSON.parse(textRemote);
                if (dataRemote && dataRemote.numeroProposta) {
                  setProposta(dataRemote);
                  return;
                }
              }
            }
          } catch (remoteErr) {
            console.warn('API remota supercell-make-hub.ai.studio falhou:', remoteErr);
          }
        }

        throw new Error('Proposta não encontrada. Verifique se o link está correto ou se o prazo de validade expirou.');
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar a proposta.');
      } finally {
        setLoading(false);
      }
    }

    carregarProposta();

    return () => {
      metaTag.remove();
    };
  }, [token, initialProposta]);

  const handleCopyLink = () => {
    const safeUrl = window.location.origin
      ? `${window.location.origin}/proposta/${token}`
      : `https://supercell-make-hub.ai.studio/proposta/${token}`;
    navigator.clipboard.writeText(safeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatEuro = (centimos: number) => {
    const euros = centimos / 100;
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(euros);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Barra superior de navegação / retrocesso */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {isModal ? (
            <button
              onClick={() => {
                if (onClose) onClose();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Painel Admin</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onBackToHome) {
                  onBackToHome();
                } else {
                  window.location.href = '/';
                }
              }}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Make HUB</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white text-xs font-medium border border-indigo-700/50 transition-colors"
              title="Copiar link permanente desta proposta"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Imprimir ou guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-semibold">
              Proposta Comercial
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="text-center py-24">
              <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm">A carregar proposta com segurança...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-8 text-center max-w-lg mx-auto">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Proposta Inacessível</h2>
              <p className="text-red-200 text-sm leading-relaxed mb-6">{error}</p>
              <button
                onClick={() => {
                  if (onBackToHome) onBackToHome();
                  else window.location.href = '/';
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Voltar à página inicial
              </button>
            </div>
          )}

          {proposta && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* Faixa Didática */}
              {proposta.isDemonstracao && (
                <div className="bg-amber-950/60 border-b border-amber-500/30 px-6 py-2.5 text-xs text-amber-200 flex items-center justify-center gap-2 text-center">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Exercício Didático:</strong> Esta é uma proposta de demonstração com preços e condições fictícias, calculada através do catálogo de serviços do projeto pedagógico.
                  </span>
                </div>
              )}

              {/* Cabeçalho da Proposta */}
              <div className="p-6 sm:p-10 border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base">
                        S
                      </div>
                      <span className="font-extrabold text-lg text-white tracking-tight">
                        Supercell Make HUB
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Serviços de Arte 3D, Modelação Low-Poly e Mentoria Técnica
                    </p>
                  </div>

                  <div className="text-left sm:text-right bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Referência da Proposta
                    </span>
                    <span className="text-xl font-mono font-bold text-indigo-400 block">
                      {proposta.numeroProposta}
                    </span>
                    <div className="mt-2 text-xs text-slate-400 flex flex-col gap-0.5 sm:items-end">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Emissão: {formatDate(proposta.dataCriacao)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Válida até: {formatDate(proposta.dataValidade)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resumo do Âmbito */}
                <div className="mt-8 bg-slate-950/60 rounded-xl p-5 border border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Resumo do Âmbito
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {proposta.resumoAmbito}
                  </p>
                </div>

                {/* Comentário / Parecer do Administrador */}
                {proposta.comentarioAdmin && (
                  <div className="mt-5 bg-indigo-950/50 rounded-xl p-5 border border-indigo-500/40 shadow-inner">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      Comentário &amp; Parecer do Administrador
                    </h3>
                    <p className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                      {proposta.comentarioAdmin}
                    </p>
                  </div>
                )}
              </div>

              {/* Tabela de Produtos / Serviços */}
              <div className="p-6 sm:p-10">
                <h3 className="text-base font-bold text-white mb-4">
                  Itens e Serviços Orçamentados
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                        <th className="py-3 px-3">Serviço / Produto</th>
                        <th className="py-3 px-3 text-center">Qtd.</th>
                        <th className="py-3 px-3 text-center">Unidade</th>
                        <th className="py-3 px-3 text-right">Preço Unitário</th>
                        <th className="py-3 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {proposta.itens.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-3 max-w-sm">
                            <div className="font-semibold text-slate-100 mb-0.5">
                              {item.nome}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {item.descricao}
                            </div>
                          </td>
                          <td className="py-4 px-3 text-center font-semibold text-slate-200">
                            {item.quantidade}
                          </td>
                          <td className="py-4 px-3 text-center text-xs text-slate-400 capitalize">
                            {item.unidadeVenda}
                          </td>
                          <td className="py-4 px-3 text-right text-slate-300 font-mono text-xs">
                            {formatEuro(item.precoUnitarioCentimos)}
                          </td>
                          <td className="py-4 px-3 text-right font-bold text-slate-100 font-mono text-sm">
                            {formatEuro(item.subtotalCentimos)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bloco de Totais */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <span className="block font-medium text-slate-300 mb-0.5">Condições de Faturação:</span>
                    <span>Valores em euros líquidos calculados diretamente com base no catálogo comercial.</span>
                  </div>

                  <div className="w-full sm:w-auto bg-slate-950 p-5 rounded-2xl border border-indigo-900/40 text-right sm:min-w-[260px]">
                    <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                      Total sem IVA
                    </span>
                    <span className="text-3xl font-extrabold font-mono text-indigo-300 block">
                      {formatEuro(proposta.totalCentimos)}
                    </span>
                    {proposta.precoAjustadoManualmente && (
                      <span className="inline-block mt-2 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-600/30 px-2 py-0.5 rounded-full font-medium">
                        Preço revisto pela Administração
                      </span>
                    )}
                  </div>
                </div>

                {/* Condições e Validade */}
                <div className="mt-8 p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Condições Gerais &amp; Validade da Proposta
                  </div>
                  <p className="leading-relaxed">{proposta.condicoes}</p>
                </div>

                {/* Contactos do Negócio */}
                {proposta.contactosNegocio && (
                  <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
                    <div>
                      <span className="block font-semibold text-slate-200">
                        {proposta.contactosNegocio.nome}
                      </span>
                      <span>Dúvidas ou agendamento de reuniões técnicas de acompanhamento:</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${proposta.contactosNegocio.email}`}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{proposta.contactosNegocio.email}</span>
                      </a>
                      <span className="text-slate-600">|</span>
                      <a
                        href={proposta.contactosNegocio.agendamentoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Marcar no Cal.com</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Rodapé institucional */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <p>
          Supercell Make HUB — Exercício Prático de Aprendizagem de IA &amp; Propostas Digitais.
        </p>
      </footer>
    </div>
  );
}
