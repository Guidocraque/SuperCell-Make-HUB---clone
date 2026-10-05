import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logoutFirebase } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CatalogoItem, EstadoPedido, Pedido, Proposta } from '../types/proposta';
import { ProposalView } from './ProposalView';
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  LogOut,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertTriangle,
  Send,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Filter,
  FileText,
  Package,
  Layers,
  Info,
  Clock,
  Mail,
  Copy,
  Check,
  Database,
  MessageSquare,
  DollarSign,
  Calculator,
  Tag,
} from 'lucide-react';

export interface ManualItemState {
  catalogoId: string;
  nomePersonalizado: string;
  descricaoPersonalizada: string;
  quantidade: number;
  unidadeVenda: 'unidade' | 'hora' | 'pacote';
  precoUnitarioEuros: string;
  isCustom: boolean;
}

interface PedidoComProposta extends Pedido {
  proposta?: Proposta | null;
}

interface AdminViewProps {
  onNavigate?: (url: string) => void;
  onBackToHome?: () => void;
}

export function AdminView({ onNavigate, onBackToHome }: AdminViewProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUidConfigured, setAdminUidConfigured] = useState(true);
  const [configuredUid, setConfiguredUid] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  // Estados dos dados administrativos
  const [activeTab, setActiveTab] = useState<'pedidos' | 'catalogo' | 'diagnostico'>('pedidos');
  const [pedidos, setPedidos] = useState<PedidoComProposta[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedDbId, setCopiedDbId] = useState(false);

  // Estados de teste do Resend
  const [isTestingResend, setIsTestingResend] = useState(false);
  const [testResendResult, setTestResendResult] = useState<string | null>(null);
  const [testResendError, setTestResendError] = useState<string | null>(null);

  // Modal de Detalhe do Pedido
  const [selectedPedido, setSelectedPedido] = useState<PedidoComProposta | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Modal de Pré-visualização / Ficha Completa da Proposta Integrada
  const [previewingProposta, setPreviewingProposta] = useState<Proposta | null>(null);

  // Modal de Resolução / Aprovação Manual
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualItems, setManualItems] = useState<ManualItemState[]>([]);
  const [manualResumo, setManualResumo] = useState('');
  const [manualComentario, setManualComentario] = useState('');
  const [manualPrecoTotal, setManualPrecoTotal] = useState('0.00');
  const [manualPrecoCustomizado, setManualPrecoCustomizado] = useState(false);

  // Modal de Adicionar/Editar Item no Catálogo
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogItemToEdit, setCatalogItemToEdit] = useState<CatalogoItem | null>(null);
  const [catFormNome, setCatFormNome] = useState('');
  const [catFormDesc, setCatFormDesc] = useState('');
  const [catFormUnidade, setCatFormUnidade] = useState<'unidade' | 'hora' | 'pacote'>('unidade');
  const [catFormPrecoEuros, setCatFormPrecoEuros] = useState('100.00');
  const [catFormCondicoes, setCatFormCondicoes] = useState('');
  const [catFormAtivo, setCatFormAtivo] = useState(true);

  // Observador de estado de autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await verificarPermissaoAdmin(user);
      } else {
        setIsAdmin(false);
        setAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const verificarPermissaoAdmin = async (user: User) => {
    setAuthChecking(true);
    try {
      const token = await user.getIdToken(true); // Forçar renovação do token
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setIsAdmin(Boolean(data.isAdmin));
      setAdminUidConfigured(Boolean(data.adminUidConfigured));
      setConfiguredUid(data.configuredUid || null);
      setAuthMessage(data.message || null);

      if (data.isAdmin) {
        await carregarDadosAdmin(token);
      }
    } catch (err: any) {
      console.error('Erro ao verificar status de administrador:', err);
      setIsAdmin(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const carregarDadosAdmin = async (token?: string) => {
    setLoadingData(true);
    try {
      const authToken = token || (await currentUser?.getIdToken());
      if (!authToken) return;

      const [resPedidos, resCat] = await Promise.all([
        fetch('/api/admin/pedidos', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/catalogo', { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);

      if (resPedidos.ok) {
        const pData = await resPedidos.json();
        setPedidos(pData.pedidos || []);
      }

      if (resCat.ok) {
        const cData = await resCat.json();
        setCatalogo(cData || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      alert('Erro no login Google: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await logoutFirebase();
    setSelectedPedido(null);
  };

  const copyUidToClipboard = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 3000);
    }
  };

  const copyDbIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedDbId(true);
    setTimeout(() => setCopiedDbId(false), 3000);
  };

  const getSafeProposalUrl = (proposta: Proposta) => {
    // 1. Prioridade: Se o browser tiver window.location.origin (seja localhost, Vercel ou ai.studio), construir link direto
    if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin}/proposta/${proposta.token}`;
    }
    // 2. Se a proposta tiver linkAcesso guardado
    if (proposta.linkAcesso && !proposta.linkAcesso.includes('super-cell-make-hub-clone.vercel.app')) {
      let l = proposta.linkAcesso.trim();
      if (!l.startsWith('http://') && !l.startsWith('https://')) {
        l = `https://${l}`;
      }
      return l;
    }
    return `https://supercell-make-hub.ai.studio/proposta/${proposta.token}`;
  };

  const handleCopyProposalLink = (proposta: Proposta) => {
    const url = getSafeProposalUrl(proposta);
    navigator.clipboard.writeText(url);
    setCopiedToken(proposta.token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleOpenProposalInHub = (proposta: Proposta) => {
    if (onNavigate) {
      onNavigate(`/proposta/${proposta.token}`);
    } else {
      window.location.href = `/proposta/${proposta.token}`;
    }
  };

  const handleTestResend = async () => {
    setIsTestingResend(true);
    setTestResendResult(null);
    setTestResendError(null);
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch('/api/admin/test-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar email de teste via Resend.');
      setTestResendResult(data.mensagem || 'Email de teste enviado com sucesso!');
    } catch (err: any) {
      setTestResendError(err.message || 'Erro ao testar envio do Resend.');
    } finally {
      setIsTestingResend(false);
    }
  };

  // Ações sobre o pedido
  const handleReprocessar = async (pedidoId: string) => {
    setIsProcessingAction(true);
    setActionFeedback(null);
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/reprocessar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no reprocessamento.');

      setActionFeedback('Pedido reprocessado com sucesso!');
      await carregarDadosAdmin();
      // Atualizar pedido selecionado
      const atualizado = pedidos.find((p) => p.id === pedidoId);
      if (atualizado) setSelectedPedido(atualizado);
    } catch (err: any) {
      setActionFeedback('Erro: ' + err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleReenviarNotificacao = async (pedidoId: string) => {
    setIsProcessingAction(true);
    setActionFeedback(null);
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/reenviar-notificacao`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no envio da notificação.');

      setActionFeedback(
        data.notificacao?.estado === 'Aceite pelo serviço'
          ? 'Notificação aceite com sucesso pelo Resend!'
          : `Notificação: ${data.notificacao?.estado} (${data.notificacao?.erro || ''})`
      );
      await carregarDadosAdmin();
    } catch (err: any) {
      setActionFeedback('Erro: ' + err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Funções auxiliares para o modal de resolução e aprovação manual
  const calcularSomaItens = (items: ManualItemState[]) => {
    return items.reduce((acc, it) => {
      const p = parseFloat(it.precoUnitarioEuros) || 0;
      const q = it.quantidade || 0;
      return acc + p * q;
    }, 0);
  };

  const handleUpdateItem = (index: number, updates: Partial<ManualItemState>) => {
    const updated = [...manualItems];
    updated[index] = { ...updated[index], ...updates };
    setManualItems(updated);

    if (!manualPrecoCustomizado) {
      const newSum = calcularSomaItens(updated);
      setManualPrecoTotal(newSum.toFixed(2));
    }
  };

  const handleCatalogSelect = (index: number, catId: string) => {
    const catItem = catalogo.find((c) => c.id === catId);
    if (!catItem) return;
    const updated = [...manualItems];
    updated[index] = {
      ...updated[index],
      catalogoId: catItem.id,
      nomePersonalizado: catItem.nome,
      descricaoPersonalizada: catItem.descricao,
      unidadeVenda: catItem.unidadeVenda,
      precoUnitarioEuros: (catItem.precoCentimos / 100).toFixed(2),
      isCustom: false,
    };
    setManualItems(updated);

    if (!manualPrecoCustomizado) {
      const newSum = calcularSomaItens(updated);
      setManualPrecoTotal(newSum.toFixed(2));
    }
  };

  const handleAddCatalogItem = () => {
    const catItem = catalogo[0];
    const newItem: ManualItemState = {
      catalogoId: catItem?.id || 'servico-modelacao-3d-brawler',
      nomePersonalizado: catItem?.nome || 'Modelação 3D de Personagem/Skin (Low-Poly)',
      descricaoPersonalizada: catItem?.descricao || '',
      quantidade: 1,
      unidadeVenda: catItem?.unidadeVenda || 'unidade',
      precoUnitarioEuros: catItem ? (catItem.precoCentimos / 100).toFixed(2) : '450.00',
      isCustom: false,
    };
    const updated = [...manualItems, newItem];
    setManualItems(updated);
    if (!manualPrecoCustomizado) {
      const newSum = calcularSomaItens(updated);
      setManualPrecoTotal(newSum.toFixed(2));
    }
  };

  const handleAddCustomItem = () => {
    const newItem: ManualItemState = {
      catalogoId: 'custom',
      nomePersonalizado: 'Serviço Personalizado',
      descricaoPersonalizada: 'Trabalho sob medida ajustado pelo administrador.',
      quantidade: 1,
      unidadeVenda: 'unidade',
      precoUnitarioEuros: '150.00',
      isCustom: true,
    };
    const updated = [...manualItems, newItem];
    setManualItems(updated);
    if (!manualPrecoCustomizado) {
      const newSum = calcularSomaItens(updated);
      setManualPrecoTotal(newSum.toFixed(2));
    }
  };

  const handleRemoveManualItem = (index: number) => {
    const updated = manualItems.filter((_, i) => i !== index);
    setManualItems(updated);
    if (!manualPrecoCustomizado) {
      const newSum = calcularSomaItens(updated);
      setManualPrecoTotal(newSum.toFixed(2));
    }
  };

  const handleRecalcularPrecoPelosItens = () => {
    const sum = calcularSomaItens(manualItems);
    setManualPrecoTotal(sum.toFixed(2));
    setManualPrecoCustomizado(false);
  };

  // Abrir modal de resolução manual
  const openManualModal = (p: PedidoComProposta) => {
    setSelectedPedido(p);
    setManualResumo(p.interpretacao?.resumo || p.textoOriginal.slice(0, 150));
    setManualComentario(p.proposta?.comentarioAdmin || '');

    let initialItems: ManualItemState[] = [];
    if (p.proposta?.itens && p.proposta.itens.length > 0) {
      initialItems = p.proposta.itens.map((it) => {
        const cat = catalogo.find((c) => c.id === it.catalogoId);
        return {
          catalogoId: it.catalogoId || (cat?.id ?? 'servico-modelacao-3d-brawler'),
          nomePersonalizado: it.nome,
          descricaoPersonalizada: it.descricao || '',
          quantidade: it.quantidade,
          unidadeVenda: it.unidadeVenda || 'unidade',
          precoUnitarioEuros: (it.precoUnitarioCentimos / 100).toFixed(2),
          isCustom: !it.catalogoId || it.catalogoId === 'item-personalizado',
        };
      });
    } else if (p.interpretacao?.itens && p.interpretacao.itens.length > 0) {
      initialItems = p.interpretacao.itens.map((it) => {
        const cat = catalogo.find((c) => c.id === it.catalogoId) || catalogo[0];
        return {
          catalogoId: cat?.id || (catalogo[0]?.id ?? 'servico-modelacao-3d-brawler'),
          nomePersonalizado: cat?.nome || 'Modelação 3D de Personagem/Skin (Low-Poly)',
          descricaoPersonalizada: cat?.descricao || '',
          quantidade: it.quantidade && it.quantidade > 0 ? it.quantidade : 1,
          unidadeVenda: cat?.unidadeVenda || 'unidade',
          precoUnitarioEuros: cat ? (cat.precoCentimos / 100).toFixed(2) : '450.00',
          isCustom: false,
        };
      });
    }

    if (initialItems.length === 0) {
      const defaultCat = catalogo[0];
      initialItems = [
        {
          catalogoId: defaultCat?.id || 'servico-modelacao-3d-brawler',
          nomePersonalizado: defaultCat?.nome || 'Modelação 3D de Personagem/Skin (Low-Poly)',
          descricaoPersonalizada: defaultCat?.descricao || '',
          quantidade: 1,
          unidadeVenda: defaultCat?.unidadeVenda || 'unidade',
          precoUnitarioEuros: defaultCat ? (defaultCat.precoCentimos / 100).toFixed(2) : '450.00',
          isCustom: false,
        },
      ];
    }

    setManualItems(initialItems);

    if (p.proposta?.totalCentimos) {
      setManualPrecoTotal((p.proposta.totalCentimos / 100).toFixed(2));
      setManualPrecoCustomizado(Boolean(p.proposta.precoAjustadoManualmente));
    } else {
      const sum = initialItems.reduce((acc, it) => acc + (parseFloat(it.precoUnitarioEuros) || 0) * it.quantidade, 0);
      setManualPrecoTotal(sum.toFixed(2));
      setManualPrecoCustomizado(false);
    }

    setIsManualModalOpen(true);
  };

  const handleSalvarAprovacaoManual = async () => {
    if (!selectedPedido) return;
    setIsProcessingAction(true);
    try {
      const token = await currentUser?.getIdToken();

      const precoFinal = parseFloat(manualPrecoTotal);
      if (isNaN(precoFinal) || precoFinal < 0) {
        throw new Error('Por favor insira um preço total válido (número igual ou superior a 0).');
      }

      const itensFormatados = manualItems.map((it) => ({
        catalogoId: it.isCustom ? undefined : it.catalogoId,
        nomePersonalizado: it.nomePersonalizado,
        descricaoPersonalizada: it.descricaoPersonalizada,
        quantidade: it.quantidade,
        unidadeVenda: it.unidadeVenda,
        precoUnitarioEuros: it.precoUnitarioEuros,
      }));

      const res = await fetch(`/api/admin/pedidos/${selectedPedido.id}/aprovar-manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itens: itensFormatados,
          resumoAmbito: manualResumo,
          comentarioAdmin: manualComentario,
          precoTotalPersonalizado: precoFinal,
          precoAjustadoManualmente: manualPrecoCustomizado,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao aprovar proposta manualmente.');

      setIsManualModalOpen(false);
      await carregarDadosAdmin();
      setActionFeedback('Proposta configurada, calculada e aprovada com sucesso!');

      if (data.proposta) {
        setSelectedPedido((prev) => (prev ? { ...prev, estado: 'Proposta criada', proposta: data.proposta } : null));
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Gestão de catálogo
  const openNewCatalogItem = () => {
    setCatalogItemToEdit(null);
    setCatFormNome('');
    setCatFormDesc('');
    setCatFormUnidade('unidade');
    setCatFormPrecoEuros('100.00');
    setCatFormCondicoes('');
    setCatFormAtivo(true);
    setIsCatalogModalOpen(true);
  };

  const openEditCatalogItem = (item: CatalogoItem) => {
    setCatalogItemToEdit(item);
    setCatFormNome(item.nome);
    setCatFormDesc(item.descricao);
    setCatFormUnidade(item.unidadeVenda);
    setCatFormPrecoEuros((item.precoCentimos / 100).toFixed(2));
    setCatFormCondicoes(item.condicoes || '');
    setCatFormAtivo(item.ativo);
    setIsCatalogModalOpen(true);
  };

  const handleSaveCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await currentUser?.getIdToken();
      const payload = {
        nome: catFormNome,
        descricao: catFormDesc,
        unidadeVenda: catFormUnidade,
        precoEuros: catFormPrecoEuros,
        condicoes: catFormCondicoes,
        ativo: catFormAtivo,
      };

      let res;
      if (catalogItemToEdit) {
        res = await fetch(`/api/admin/catalogo/${catalogItemToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/catalogo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao guardar item no catálogo.');
      }

      setIsCatalogModalOpen(false);
      await carregarDadosAdmin();
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const handleToggleItemAtivo = async (item: CatalogoItem) => {
    try {
      const token = await currentUser?.getIdToken();
      await fetch(`/api/admin/catalogo/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ativo: !item.ativo }),
      });
      await carregarDadosAdmin();
    } catch (err: any) {
      alert('Erro ao alterar estado do item: ' + err.message);
    }
  };

  const formatEuro = (centimos?: number) => {
    if (centimos === undefined || centimos === null) return '—';
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(centimos / 100);
  };

  const getEstadoBadge = (estado: EstadoPedido) => {
    switch (estado) {
      case 'Recebido':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">Recebido</span>;
      case 'Em análise':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">Em análise</span>;
      case 'Necessita de revisão':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/50">Necessita de revisão</span>;
      case 'Proposta criada':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">Proposta criada</span>;
      case 'Erro':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700/50">Erro</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">{estado}</span>;
    }
  };

  const getNotificacaoBadge = (proposta?: Proposta | null) => {
    if (!proposta || !proposta.notificacaoAluno) {
      return <span className="text-xs text-slate-500">—</span>;
    }
    const st = proposta.notificacaoAluno.estado;
    switch (st) {
      case 'Aceite pelo serviço':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/40">Aceite pelo serviço</span>;
      case 'Falhou':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-950 text-red-300 border border-red-800/40" title={proposta.notificacaoAluno.erro}>Falhou</span>;
      case 'Não configurado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950 text-amber-300 border border-amber-800/40" title={proposta.notificacaoAluno.erro}>Não configurado</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400">Por enviar</span>;
    }
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (statusFilter === 'Todos') return true;
    return p.estado === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white flex flex-col">
      {/* Cabeçalho da Administração */}
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Painel de Administração
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Área Privada
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Supercell Make HUB — Gestão de Pedidos e Propostas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBackToHome ? onBackToHome() : (window.location.href = '/'))}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Voltar ao Site
            </button>

            {currentUser && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-200">{currentUser.displayName || currentUser.email}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 px-2.5 py-1.5 rounded-lg transition-colors"
                  title="Terminar sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Banner de Modo de Aula Obrigatório */}
      <div className="bg-indigo-950/70 border-b border-indigo-500/30 py-2.5 px-4 text-center text-xs text-indigo-200">
        <span className="font-bold text-white">Modo de aula:</span> as notificações são enviadas apenas para o email do aluno. Os clientes não recebem emails.
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Caso 1: A verificar sessão */}
        {authChecking && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">A verificar autenticação com o Firebase...</p>
          </div>
        )}

        {/* Caso 2: Não autenticado com Google */}
        {!authChecking && !currentUser && (
          <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Reservado</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Apenas utilizadores autorizados podem aceder a este painel administrativo. Inicie sessão com a sua conta Google para validar as credenciais no Firebase.
            </p>
            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-md flex items-center justify-center gap-3 transition-colors text-sm"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>Iniciar sessão com Google</span>
            </button>
          </div>
        )}

        {/* Caso 3: Autenticado mas sem privilégio de ADMIN (ou ADMIN_UID não configurado) */}
        {!authChecking && currentUser && !isAdmin && (
          <div className="max-w-xl mx-auto my-10 bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">
              Autorização de Administrador Pendente
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed text-center mb-6">
              Iniciou sessão com sucesso como <strong>{currentUser.email}</strong>, mas a sua conta ainda não tem permissões ativas de administrador no sistema.
            </p>

            {authMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200">
                <span className="font-semibold block mb-0.5">Diagnóstico do Servidor:</span>
                <p>{authMessage}</p>
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  1. O seu Firebase UID (Conta Google atual):
                </span>
                <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                  <code className="text-xs font-mono text-indigo-300 break-all select-all">
                    {currentUser.uid}
                  </code>
                  <button
                    onClick={copyUidToClipboard}
                    className="shrink-0 p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
                    title="Copiar UID"
                  >
                    {copiedUid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  2. Valor lido no servidor (ADMIN_UID nos Secrets):
                </span>
                <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                  <code className="text-xs font-mono text-slate-300 break-all">
                    {configuredUid ? configuredUid : '(vazio ou não configurado nos Secrets)'}
                  </code>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1 leading-relaxed">
                <p>
                  <strong>Como resolver passo a passo:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>Clique no ícone de cópia ao lado do seu Firebase UID acima.</li>
                  <li>No painel lateral do AI Studio, abra <strong>Settings &gt; Secrets</strong>.</li>
                  <li>Defina o secret <strong>ADMIN_UID</strong> com exatamente esse valor (sem aspas adicionais).</li>
                  <li>Clique no botão <strong>“Verificar Novamente”</strong> abaixo.</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => verificarPermissaoAdmin(currentUser)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verificar Novamente</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Terminar Sessão
              </button>
            </div>
          </div>
        )}

        {/* Caso 4: Utilizador Autenticado e Autorizado como ADMIN */}
        {!authChecking && currentUser && isAdmin && (
          <div>
            {/* Abas e Controlos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'pedidos'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Pedidos de Proposta</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-950/60 font-mono">
                    {pedidos.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('catalogo')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'catalogo'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Gestão do Catálogo</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-950/60 font-mono">
                    {catalogo.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('diagnostico')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'diagnostico'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Base de Dados &amp; Resend</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => carregarDadosAdmin()}
                  disabled={loadingData}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 font-semibold transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                  <span>Atualizar Dados</span>
                </button>

                {activeTab === 'catalogo' && (
                  <button
                    onClick={openNewCatalogItem}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Produto/Serviço</span>
                  </button>
                )}
              </div>
            </div>

            {/* ABA 1: PEDIDOS */}
            {activeTab === 'pedidos' && (
              <div>
                {/* Filtro por estado */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs">
                  <span className="text-slate-400 flex items-center gap-1 mr-1">
                    <Filter className="w-3.5 h-3.5" />
                    Filtrar:
                  </span>
                  {['Todos', 'Recebido', 'Em análise', 'Necessita de revisão', 'Proposta criada', 'Erro'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        statusFilter === st
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {pedidosFiltrados.length === 0 ? (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Nenhum pedido encontrado com o filtro selecionado.</p>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 bg-slate-950/60">
                            <th className="py-3 px-4">Data</th>
                            <th className="py-3 px-4">Cliente</th>
                            <th className="py-3 px-4">Resumo do Pedido</th>
                            <th className="py-3 px-4 text-center">Estado do Pedido</th>
                            <th className="py-3 px-4 text-right">Valor Proposta</th>
                            <th className="py-3 px-4 text-center">Notificação ao Aluno</th>
                            <th className="py-3 px-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {pedidosFiltrados.map((p) => {
                            const dateStr = new Date(p.dataCriacao).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            return (
                              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap font-mono">
                                  {dateStr}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-slate-200">{p.nome}</div>
                                  <div className="text-xs text-slate-400 font-mono">{p.email}</div>
                                </td>
                                <td className="py-3.5 px-4 max-w-xs">
                                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                    {p.interpretacao?.resumo || p.textoOriginal}
                                  </p>
                                </td>
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  {getEstadoBadge(p.estado)}
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-slate-200 whitespace-nowrap">
                                  {formatEuro(p.proposta?.totalCentimos)}
                                </td>
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  {getNotificacaoBadge(p.proposta)}
                                </td>
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => setSelectedPedido(p)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                      title="Ver Detalhe do Pedido"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>

                                    {p.proposta && (
                                      <>
                                        <button
                                          onClick={() => setPreviewingProposta(p.proposta!)}
                                          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
                                          title="Ver Ficha da Proposta"
                                        >
                                          <FileText className="w-4 h-4" />
                                        </button>

                                        <button
                                          onClick={() => handleCopyProposalLink(p.proposta!)}
                                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors"
                                          title="Copiar Link da Proposta"
                                        >
                                          {copiedToken === p.proposta.token ? (
                                            <Check className="w-4 h-4 text-emerald-400" />
                                          ) : (
                                            <Copy className="w-4 h-4" />
                                          )}
                                        </button>

                                        <a
                                          href={getSafeProposalUrl(p.proposta!)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 transition-colors"
                                          title="Abrir Proposta em Novo Separador"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </a>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ABA 2: GESTÃO DO CATÁLOGO */}
            {activeTab === 'catalogo' && (
              <div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 bg-slate-950/60">
                          <th className="py-3 px-4">Nome do Serviço / Produto</th>
                          <th className="py-3 px-4 text-center">Unidade</th>
                          <th className="py-3 px-4 text-right">Preço Unitário</th>
                          <th className="py-3 px-4 text-center">Estado</th>
                          <th className="py-3 px-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {catalogo.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 px-4 max-w-md">
                              <div className="font-semibold text-slate-100 mb-0.5">{item.nome}</div>
                              <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {item.descricao}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center text-xs capitalize text-slate-300 font-medium">
                              {item.unidadeVenda}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                              {formatEuro(item.precoCentimos)}
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleItemAtivo(item)}
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                                  item.ativo
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                                }`}
                              >
                                {item.ativo ? 'Ativo' : 'Inativo'}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => openEditCatalogItem(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Editar Item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: DIAGNÓSTICO BASE DE DADOS FIRESTORE & RESEND */}
            {activeTab === 'diagnostico' && (
              <div className="space-y-6">
                {/* Cartão 1: Cloud Firestore */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span>Base de Dados Cloud Firestore</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                            Ativa e Operacional
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Projeto: <span className="font-mono text-slate-300">augmented-nation-gvr20</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://console.firebase.google.com/project/augmented-nation-gvr20/firestore/databases/ai-studio-supercellmakehub-e338dec3-004e-4d2e-ab7f-b091302586af/data"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Direto no Firebase Console</span>
                      </a>
                    </div>
                  </div>

                  {/* Alerta explicativo do seletor de base de dados */}
                  <div className="my-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Porque é que o Firebase Console parece vazio à primeira vista?</span>
                    </div>
                    <p>
                      Na consola oficial do Firebase, a página do Cloud Firestore abre por omissão a base de dados padrão chamada <strong>(default)</strong>.
                    </p>
                    <p>
                      Este projeto utiliza uma base de dados provisionada com ID dedicado:
                    </p>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 font-mono text-[11px] text-amber-100 flex items-center justify-between gap-2">
                      <span className="truncate">ai-studio-supercellmakehub-e338dec3-004e-4d2e-ab7f-b091302586af</span>
                      <button
                        onClick={() => copyDbIdToClipboard('ai-studio-supercellmakehub-e338dec3-004e-4d2e-ab7f-b091302586af')}
                        className="shrink-0 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] flex items-center gap-1 transition-colors"
                      >
                        {copiedDbId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDbId ? 'Copiado!' : 'Copiar ID'}</span>
                      </button>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 pt-1">
                      <li>Acede a <a href="https://console.firebase.google.com/project/augmented-nation-gvr20/firestore" target="_blank" rel="noreferrer" className="underline text-indigo-400">console.firebase.google.com</a>.</li>
                      <li>No topo da página do Cloud Firestore, repara no seletor suspenso que diz <code>(default)</code> ou <code>(padrão)</code>.</li>
                      <li>Clica no seletor e escolhe a base de dados <code>ai-studio-supercellmakehub-e338dec3-004e-4d2e-ab7f-b091302586af</code>.</li>
                      <li>Verás de imediato as 3 coleções abaixo com todos os dados salvos em tempo real!</li>
                    </ol>
                  </div>

                  {/* Sumário das Coleções em Tempo Real */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs uppercase text-slate-400 font-bold mb-1">Coleção /catalogo</div>
                      <div className="text-2xl font-mono font-bold text-white">{catalogo.length} itens</div>
                      <div className="text-xs text-slate-400 mt-1">Serviços e produtos comerciais ativos no HUB</div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs uppercase text-slate-400 font-bold mb-1">Coleção /pedidos</div>
                      <div className="text-2xl font-mono font-bold text-indigo-400">{pedidos.length} pedidos</div>
                      <div className="text-xs text-slate-400 mt-1">Registos de clientes (incluindo Tiago Mendes)</div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs uppercase text-slate-400 font-bold mb-1">Coleção /propostas</div>
                      <div className="text-2xl font-mono font-bold text-emerald-400">
                        {pedidos.filter((p) => p.proposta).length} emitidas
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Propostas orçamentais calculadas pela IA</div>
                    </div>
                  </div>
                </div>

                {/* Cartão 2: Notificações por Email (Resend) */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span>Notificações por Email (Resend)</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                            Modo de Aula
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Serviço de envio para o aluno responsável pelo projeto
                        </p>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={handleTestResend}
                        disabled={isTestingResend}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
                      >
                        <Send className={`w-3.5 h-3.5 ${isTestingResend ? 'animate-spin' : ''}`} />
                        <span>{isTestingResend ? 'A Enviar Email de Teste...' : 'Enviar Email de Teste Agora'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback do Teste */}
                  {testResendResult && (
                    <div className="my-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3 animate-fade-in">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-sm mb-0.5">Envio Concluído!</span>
                        <p>{testResendResult}</p>
                        <p className="mt-1 text-slate-300">
                          ⚠️ <strong>Importante:</strong> Se não vires o email na Caixa de Entrada, verifica a pasta de <strong>Lixo Eletrónico (Spam)</strong> ou o separador 'Outros' no Outlook / email institucional!
                        </p>
                      </div>
                    </div>
                  )}

                  {testResendError && (
                    <div className="my-4 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3 animate-fade-in">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-sm mb-0.5">Erro no Envio Resend:</span>
                        <p>{testResendError}</p>
                      </div>
                    </div>
                  )}

                  {/* Configurações Atuais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs uppercase text-slate-400 font-bold mb-1">Destinatário Aluno (EMAIL_ALUNO)</div>
                      <div className="text-sm font-mono font-semibold text-slate-200">ggcaa1@iscte-iul.pt</div>
                      <div className="text-xs text-slate-400 mt-1">Definido nos Secrets do servidor</div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs uppercase text-slate-400 font-bold mb-1">Remetente Oficial Resend</div>
                      <div className="text-sm font-mono font-semibold text-slate-200">onboarding@resend.dev</div>
                      <div className="text-xs text-slate-400 mt-1">Domínio de testes oficial do Resend</div>
                    </div>
                  </div>

                  {/* Informações Cruciais sobre entrega do Resend */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>Porque é que o email pode não aparecer na Caixa de Entrada?</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                      <li>
                        <strong className="text-slate-200">Pasta de Lixo Eletrónico (Junk / Spam):</strong> Como o envio provém de <code>onboarding@resend.dev</code> (domínio partilhado gratuito do Resend), filtros institucionais como o <strong>Microsoft Exchange do ISCTE (@iscte-iul.pt)</strong> classificam automaticamente a mensagem como <em>Lixo Eletrónico</em>. Abre a pasta de Lixo Eletrónico e marca a mensagem como "Não é lixo".
                      </li>
                      <li>
                        <strong className="text-slate-200">Regra de Segurança do Resend Free:</strong> No plano gratuito do Resend (sem domínio personalizado verificado com registos DNS DKIM/SPF), o Resend <strong>apenas entrega emails para o endereço com o qual a conta Resend foi registada</strong>. Se te registaste com outro email (por exemplo <code>gui.carapinha@gmail.com</code>), deves alterar a variável <code>EMAIL_ALUNO</code> para esse email nos Secrets.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: DETALHE DO PEDIDO */}
      {selectedPedido && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedPedido(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-indigo-400">Ficha do Pedido</span>
              {getEstadoBadge(selectedPedido.estado)}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Pedido de {selectedPedido.nome}
            </h3>

            {actionFeedback && (
              <div className="mb-4 p-3 rounded-lg bg-indigo-950 border border-indigo-500/40 text-xs text-indigo-200">
                {actionFeedback}
              </div>
            )}

            {/* Texto original */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Texto Original Submetido:
              </span>
              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedPedido.textoOriginal}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
                <span>Email de contacto: <strong className="text-slate-300">{selectedPedido.email}</strong></span>
              </div>
            </div>

            {/* Interpretação da IA */}
            {selectedPedido.interpretacao && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-900/40 mb-5">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                  Interpretação Estruturada (Gemini)
                </span>
                <p className="text-sm text-slate-200 mb-3">
                  <strong>Resumo:</strong> {selectedPedido.interpretacao.resumo}
                </p>

                {selectedPedido.interpretacao.itens?.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-medium text-slate-400 block mb-1">Itens Identificados no Catálogo:</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedPedido.interpretacao.itens.map((it, idx) => (
                        <li key={idx} className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="font-semibold text-white">{it.catalogoId}</span> — Qtd: {it.quantidade ?? 'indeterminada'}
                          <div className="text-slate-400 text-[11px] mt-0.5"><em>"{it.evidencia}"</em></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPedido.interpretacao.informacaoEmFalta?.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200">
                    <span className="font-bold block mb-1">Questões por esclarecer / Fora do catálogo:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {selectedPedido.interpretacao.informacaoEmFalta.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Motivo de revisão ou erro */}
            {selectedPedido.motivoRevisao && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl mb-5 text-xs text-amber-200">
                <span className="font-bold block mb-0.5">Motivo de Revisão Manual:</span>
                <p>{selectedPedido.motivoRevisao}</p>
              </div>
            )}

            {selectedPedido.erroProcessamento && (
              <div className="bg-red-950/40 border border-red-500/40 p-3.5 rounded-xl mb-5 text-xs text-red-200">
                <span className="font-bold block mb-0.5">Erro no Processamento:</span>
                <p>{selectedPedido.erroProcessamento}</p>
              </div>
            )}

            {/* Proposta Associada */}
            {selectedPedido.proposta && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                      Proposta Emitida: {selectedPedido.proposta.numeroProposta}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-white font-mono">
                    {formatEuro(selectedPedido.proposta.totalCentimos)}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                  <span>Notificação ao Aluno:</span>
                  {getNotificacaoBadge(selectedPedido.proposta)}
                </div>

                {selectedPedido.proposta.comentarioAdmin && (
                  <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 mb-4 text-xs">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Comentário do Administrador:
                    </span>
                    <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{selectedPedido.proposta.comentarioAdmin}</p>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 mb-4 font-mono text-[11px] text-slate-300 break-all flex items-center justify-between gap-2">
                  <span className="truncate">{getSafeProposalUrl(selectedPedido.proposta!)}</span>
                  <button
                    onClick={() => handleCopyProposalLink(selectedPedido.proposta!)}
                    className="shrink-0 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedToken === selectedPedido.proposta.token ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPreviewingProposta(selectedPedido.proposta!)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-indigo-600/30"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Ficha Completa da Proposta</span>
                  </button>

                  <a
                    href={getSafeProposalUrl(selectedPedido.proposta!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir em Nova Aba</span>
                  </a>
                </div>
              </div>
            )}

            {/* Barra de Ações */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleReprocessar(selectedPedido.id)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessingAction ? 'animate-spin' : ''}`} />
                <span>Repetir Processamento IA</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedPedido.proposta && (
                  <button
                    onClick={() => handleReenviarNotificacao(selectedPedido.id)}
                    disabled={isProcessingAction}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reenviar Notificação</span>
                  </button>
                )}

                <button
                  onClick={() => openManualModal(selectedPedido)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  Resolver e Aprovar Manualmente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVER / APROVAR MANUALMENTE */}
      {isManualModalOpen && selectedPedido && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-indigo-400">Painel de Decisão Comercial</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aprovação &amp; Orçamento da Proposta</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Defina os serviços orçamentados, altere livremente o preço final e adicione comentários ou observações personalizadas para o cliente/aluno.
            </p>

            {/* 1. Resumo do Âmbito da Proposta */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Resumo do Âmbito da Proposta:
              </label>
              <textarea
                rows={2}
                value={manualResumo}
                onChange={(e) => setManualResumo(e.target.value)}
                placeholder="Ex: Modelação de skin temática e texturização compatível com Supercell..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 2. Comentário / Observações do Administrador */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Comentário / Observações do Administrador (Visível na Ficha):
                </label>
                <span className="text-[11px] text-slate-400">Opcional</span>
              </div>
              <textarea
                rows={3}
                value={manualComentario}
                onChange={(e) => setManualComentario(e.target.value)}
                placeholder="Escreva aqui observações técnicas, condições especiais, nota de desconto aplicado ou mensagem para o aluno/cliente..."
                className="w-full px-3.5 py-2.5 bg-indigo-950/20 border border-indigo-700/50 rounded-xl text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Este comentário será exibido num bloco destacado na proposta pública e incluído no email do aluno.
              </p>
            </div>

            {/* 3. Bloco de Preço Total da Proposta */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/50 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Preço Total da Proposta (€ sem IVA)
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Pode escrever diretamente qualquer valor para alterar o preço final, em vez de depender apenas das opções do catálogo.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {manualPrecoCustomizado ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/40 font-semibold">
                      Preço manual personalizado
                    </span>
                  ) : (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 font-semibold">
                      Calculado dos itens
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleRecalcularPrecoPelosItens}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                    title="Repor soma exata dos itens da tabela"
                  >
                    <Calculator className="w-3 h-3" />
                    Recalcular pelos itens
                  </button>
                </div>
              </div>

              <div className="relative max-w-xs mt-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-indigo-400 font-bold text-base pointer-events-none">
                  €
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={manualPrecoTotal}
                  onChange={(e) => {
                    setManualPrecoTotal(e.target.value);
                    setManualPrecoCustomizado(true);
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border-2 border-indigo-500 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
                />
              </div>
            </div>

            {/* 4. Itens e Serviços Orçamentados */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Itens e Serviços Orçamentados ({manualItems.length})
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddCatalogItem}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-950/50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Item do Catálogo
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-950/50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Item com Preço Livre
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {manualItems.map((item, idx) => {
                  const subtotalItem = (parseFloat(item.precoUnitarioEuros) || 0) * (item.quantidade || 0);

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        {item.isCustom ? (
                          <div className="flex-1 w-full">
                            <input
                              type="text"
                              value={item.nomePersonalizado}
                              onChange={(e) => handleUpdateItem(idx, { nomePersonalizado: e.target.value })}
                              placeholder="Nome do serviço personalizado..."
                              className="w-full bg-slate-900 border border-purple-600/50 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        ) : (
                          <div className="flex-1 w-full">
                            <select
                              value={item.catalogoId}
                              onChange={(e) => handleCatalogSelect(idx, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-indigo-500"
                            >
                              {catalogo.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nome} ({formatEuro(c.precoCentimos)})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                            <span className="text-[10px] text-slate-400">Qtd:</span>
                            <input
                              type="number"
                              min={1}
                              value={item.quantidade}
                              onChange={(e) =>
                                handleUpdateItem(idx, { quantidade: Math.max(1, parseInt(e.target.value, 10) || 1) })
                              }
                              className="w-12 bg-transparent text-xs text-white font-bold text-center focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                            <span className="text-[10px] text-slate-400">€/un:</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.precoUnitarioEuros}
                              onChange={(e) => handleUpdateItem(idx, { precoUnitarioEuros: e.target.value })}
                              className="w-20 bg-transparent text-xs font-mono text-indigo-300 font-bold focus:outline-none"
                            />
                          </div>

                          <div className="text-right min-w-[70px] text-xs font-mono font-bold text-white pr-1">
                            {formatEuro(Math.round(subtotalItem * 100))}
                          </div>

                          {manualItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveManualItem(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                              title="Remover este item"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Ações Finais do Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-mono">
                Total Final: <strong className="text-base text-white">{formatEuro(Math.round((parseFloat(manualPrecoTotal) || 0) * 100))}</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={handleSalvarAprovacaoManual}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isProcessingAction ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>A aprovar e emitir...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Gerar e Aprovar Proposta</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR / EDITAR ITEM NO CATÁLOGO */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveCatalogItem}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {catalogItemToEdit ? 'Editar Item do Catálogo' : 'Novo Produto / Serviço'}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Serviço/Produto *</label>
                <input
                  type="text"
                  required
                  value={catFormNome}
                  onChange={(e) => setCatFormNome(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição Comercial *</label>
                <textarea
                  rows={3}
                  required
                  value={catFormDesc}
                  onChange={(e) => setCatFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unidade de Venda *</label>
                  <select
                    value={catFormUnidade}
                    onChange={(e: any) => setCatFormUnidade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="unidade">Unidade</option>
                    <option value="hora">Hora</option>
                    <option value="pacote">Pacote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preço em Euros (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={catFormPrecoEuros}
                    onChange={(e) => setCatFormPrecoEuros(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Condições ou Limitações Relevantes</label>
                <input
                  type="text"
                  value={catFormCondicoes}
                  onChange={(e) => setCatFormCondicoes(e.target.value)}
                  placeholder="Ex: Entrega em .FBX; requer arte conceptual prévia"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-form-ativo"
                  checked={catFormAtivo}
                  onChange={(e) => setCatFormAtivo(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="cat-form-ativo" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Disponível para seleção e cálculo de propostas (Ativo)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Guardar no Catálogo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: FICHA DA PROPOSTA EMITIDA (VISUALIZAÇÃO COMPLETA NO HUB) */}
      {previewingProposta && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-y-auto">
          <ProposalView
            token={previewingProposta.token}
            initialProposta={{
              numeroProposta: previewingProposta.numeroProposta,
              dataCriacao: previewingProposta.dataCriacao,
              dataValidade: previewingProposta.dataValidade,
              resumoAmbito: previewingProposta.resumoAmbito,
              itens: previewingProposta.itens,
              totalCentimos: previewingProposta.totalCentimos,
              condicoes: previewingProposta.condicoes,
              isDemonstracao: previewingProposta.isDemonstracao,
              comentarioAdmin: previewingProposta.comentarioAdmin,
              precoAjustadoManualmente: previewingProposta.precoAjustadoManualmente,
              contactosNegocio: {
                nome: 'Supercell Make HUB (Clone Pedagógico)',
                email: 'ggcaa1@iscte-iul.pt',
                agendamentoUrl: 'https://cal.com/guilherme_carapinha_real',
              },
            }}
            isModal={true}
            onClose={() => setPreviewingProposta(null)}
            onBackToHome={() => setPreviewingProposta(null)}
          />
        </div>
      )}
    </div>
  );
}
