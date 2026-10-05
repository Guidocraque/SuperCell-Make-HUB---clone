import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2, AlertCircle, FileText, Clock, Shield } from 'lucide-react';

export function PedidoPropostaSection() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [pedido, setPedido] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage(null);

    // Validações no frontend
    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();
    const trimmedPedido = pedido.trim();

    if (!trimmedNome || trimmedNome.length < 2) {
      setErrorMessage('Por favor introduza o seu nome (mínimo de 2 caracteres).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage('Por favor introduza um endereço de email válido.');
      return;
    }

    if (!trimmedPedido || trimmedPedido.length < 10) {
      setErrorMessage('Por favor descreva o seu pedido com pelo menos 10 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: trimmedNome,
          email: trimmedEmail,
          pedido: trimmedPedido,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível submeter o pedido.');
      }

      setSucesso(true);
      setNome('');
      setEmail('');
      setPedido('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro de comunicação ao enviar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pedido-proposta" className="py-16 bg-slate-900 border-t border-b border-slate-800 text-white relative overflow-hidden">
      {/* Detalhes de iluminação subtis do tema Make HUB */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Serviços de Arte 3D &amp; Criação
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pedido de proposta
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Descreva o que necessita para a sua criação ou campanha no Make HUB. O nosso sistema analisa o seu pedido e gera uma proposta orçamental instantânea com base no catálogo de serviços.
          </p>
        </div>

        {sucesso ? (
          <div className="bg-slate-800/90 border border-emerald-500/40 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              O seu pedido foi recebido com sucesso.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              A nossa equipa e o sistema de avaliação técnica estão a analisar as especificações do seu conceito. O seu registo ficou guardado com segurança.
            </p>
            <button
              onClick={() => setSucesso(false)}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-600"
            >
              Submeter outro pedido
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
            noValidate
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Campo 1: Nome */}
              <div>
                <label htmlFor="proposta-nome" className="block text-sm font-semibold text-slate-200 mb-2">
                  Nome <span className="text-indigo-400">*</span>
                </label>
                <input
                  id="proposta-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={loading}
                  placeholder="O seu nome ou do seu estúdio"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
                  required
                />
              </div>

              {/* Campo 2: Email */}
              <div>
                <label htmlFor="proposta-email" className="block text-sm font-semibold text-slate-200 mb-2">
                  Email <span className="text-indigo-400">*</span>
                </label>
                <input
                  id="proposta-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="exemplo@email.com"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Campo 3: Pedido */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="proposta-pedido" className="block text-sm font-semibold text-slate-200">
                  Pedido <span className="text-indigo-400">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {pedido.length}/3000 carateres
                </span>
              </div>
              <textarea
                id="proposta-pedido"
                rows={5}
                value={pedido}
                onChange={(e) => setPedido(e.target.value)}
                disabled={loading}
                placeholder="Exemplo: Preciso da modelação 3D de um Brawler low-poly (até 4.000 triângulos para Brawl Stars), uma folha de conceito 2D com vistas ortogonais e 2 horas de mentoria técnica para preparar a submissão no Make HUB..."
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm leading-relaxed disabled:opacity-50 resize-y"
                required
              />
            </div>

            {/* Nota de privacidade e proteção de dados */}
            <div className="flex items-start gap-2.5 text-xs text-slate-400 mb-6 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Os dados fornecidos são utilizados estritamente para analisar e responder ao seu pedido de proposta comercial. Não é necessário criar conta nem iniciar sessão para pedir orçamento.
              </span>
            </div>

            {/* Botão de submissão */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Interpretação automática instantânea via catálogo comercial</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-600/50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A processar o pedido...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Pedir proposta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
