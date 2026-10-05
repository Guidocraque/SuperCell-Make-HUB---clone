import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  seedCatalogoIfEmpty,
  getCatalogo,
  getCatalogoItem,
  saveCatalogoItem,
  updateCatalogoItem,
  savePedido,
  updatePedido,
  getPedido,
  getPedidos,
  saveProposta,
  getProposta,
  getPropostaByToken,
  getPropostas,
} from './server/firestoreDb';
import { interpretarPedidoComGemini } from './server/geminiService';
import { calcularPropostaBackend } from './server/propostaCalculator';
import { enviarNotificacaoAlunoResend } from './server/resendService';
import { verifyAdminRequest } from './server/adminAuth';
import { CatalogoItem, ItemProposta, Pedido, Proposta, PropostaPublica } from './src/types/proposta';

dotenv.config();

const app = express();
const PORT = 3000;
const CLOUD_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : null;

app.use(express.json());

// Middleware de CORS para permitir que webapps externas (como Vercel) comuniquem com o backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Função auxiliar para determinar o URL público base da aplicação
function getAppBaseUrl(req: express.Request): string {
  let url = '';
  if (process.env.APP_BASE_URL && process.env.APP_BASE_URL.trim() !== '') {
    url = process.env.APP_BASE_URL.trim();
  } else if (process.env.APP_URL && process.env.APP_URL.trim() !== '') {
    url = process.env.APP_URL.trim();
  } else {
    const host = req.get('host') || 'supercell-make-hub.ai.studio';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    return `${protocol}://${host}`;
  }

  // Se o URL antigo estiver guardado em env/cache, normalizar para supercell-make-hub.ai.studio
  if (url.includes('super-cell-make-hub-clone.vercel.app')) {
    url = 'https://supercell-make-hub.ai.studio';
  }

  // Garantir sempre protocolo https:// se não fornecido
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

// Normalizador seguro de dados da proposta para garantir URLs absolutos válidos
function normalizeProposta(proposta: Proposta | null, req: express.Request): Proposta | null {
  if (!proposta) return null;
  const baseUrl = getAppBaseUrl(req);
  let link = proposta.linkAcesso;
  if (!link || link.includes('super-cell-make-hub-clone.vercel.app') || !link.includes('/proposta/')) {
    link = `${baseUrl}/proposta/${proposta.token}`;
  } else if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
    link = `https://${link}`;
  }
  return {
    ...proposta,
    linkAcesso: link,
  };
}

// -------------------------------------------------------------
// INICIALIZAÇÃO DA BASE DE DADOS FIRESTORE
// -------------------------------------------------------------
seedCatalogoIfEmpty().catch((err) => {
  console.error('Erro na inicialização do catálogo Firestore:', err);
});

// -------------------------------------------------------------
// ROTAS PÚBLICAS DA LANDING PAGE
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Supercell Make HUB Propostas API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    emailAlunoConfigured: Boolean(process.env.EMAIL_ALUNO),
    adminUidConfigured: Boolean(process.env.ADMIN_UID),
  });
});

// Obter catálogo público ativo
app.get('/api/catalogo', async (req, res) => {
  try {
    const itens = await getCatalogo(true);
    res.json(itens);
  } catch (error: any) {
    console.error('Erro ao consultar catálogo:', error);
    res.status(500).json({ error: 'Erro ao carregar catálogo de serviços.' });
  }
});

// Submissão do formulário público "Pedido de Proposta"
// Validação estrita no backend e proteção contra spam
const recentSubmissions = new Map<string, number>();

app.post('/api/pedidos', async (req, res) => {
  try {
    const { nome, email, pedido: textoPedido } = req.body;

    // 1. Validação de formato e tamanho
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 100) {
      return res.status(400).json({
        error: 'O campo Nome é obrigatório e deve ter entre 2 e 100 caracteres.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 120) {
      return res.status(400).json({
        error: 'Por favor introduza um endereço de email com formato válido.',
      });
    }

    if (!textoPedido || typeof textoPedido !== 'string' || textoPedido.trim().length < 10 || textoPedido.trim().length > 3000) {
      return res.status(400).json({
        error: 'O campo Pedido é obrigatório e deve conter entre 10 e 3000 caracteres detalhando a sua necessidade.',
      });
    }

    // 2. Proteção básica contra cliques e submissões repetidas (mesmo email/texto nos últimos 15 segundos)
    const clientKey = `${email.trim().toLowerCase()}_${textoPedido.trim().slice(0, 40)}`;
    const lastSub = recentSubmissions.get(clientKey);
    const now = Date.now();
    if (lastSub && now - lastSub < 15000) {
      return res.status(429).json({
        error: 'Submissão duplicada detetada. O seu pedido já foi recebido há poucos segundos.',
      });
    }
    recentSubmissions.set(clientKey, now);

    // 3. Registo inicial obrigatório no Cloud Firestore ANTES de qualquer serviço externo
    const pedidoId = crypto.randomUUID();
    const agora = new Date().toISOString();

    const novoPedido: Pedido = {
      id: pedidoId,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      textoOriginal: textoPedido.trim(),
      dataCriacao: agora,
      dataAtualizacao: agora,
      estado: 'Recebido',
      interpretacao: null,
      informacaoEmFalta: [],
      motivoRevisao: null,
      propostaId: null,
      erroProcessamento: null,
    };

    await savePedido(novoPedido);
    console.log(`[Pedido ${pedidoId}] Guardado com sucesso no Firestore.`);

    // 4. Execução assíncrona da interpretação com Gemini e cálculo de proposta
    const baseUrl = getAppBaseUrl(req);
    const catalogoAtivo = await getCatalogo(true);

    try {
      await updatePedido(pedidoId, { estado: 'Em análise' });

      // Interpretação com modelo Gemini (structured JSON)
      const interpretacao = await interpretarPedidoComGemini(novoPedido.textoOriginal, catalogoAtivo);

      console.log(`[Pedido ${pedidoId}] Interpretação IA concluída:`, interpretacao.resumo);

      if (interpretacao.necessitaRevisao) {
        // Pedido necessita de revisão humana
        await updatePedido(pedidoId, {
          estado: 'Necessita de revisão',
          interpretacao,
          informacaoEmFalta: interpretacao.informacaoEmFalta,
          motivoRevisao: interpretacao.motivoRevisao || 'O pedido contém dúvidas ou serviços que requerem validação manual.',
        });
      } else {
        // Cálculo da proposta no código backend com os preços do catálogo
        const calculo = await calcularPropostaBackend(pedidoId, interpretacao, catalogoAtivo, baseUrl);

        if (calculo.sucesso && calculo.proposta) {
          const proposta = calculo.proposta;

          // Enviar notificação por email exclusivamente ao aluno (Resend)
          const notificacao = await enviarNotificacaoAlunoResend(proposta);
          proposta.notificacaoAluno = notificacao;

          // Guardar a proposta no Firestore
          await saveProposta(proposta);

          // Atualizar o pedido para "Proposta criada"
          await updatePedido(pedidoId, {
            estado: 'Proposta criada',
            interpretacao,
            propostaId: proposta.id,
            informacaoEmFalta: [],
            motivoRevisao: null,
          });

          console.log(`[Pedido ${pedidoId}] Proposta criada com sucesso (${proposta.numeroProposta}). Notificação: ${notificacao.estado}`);
        } else {
          await updatePedido(pedidoId, {
            estado: 'Necessita de revisão',
            interpretacao,
            motivoRevisao: calculo.motivoRevisao || 'Não foi possível validar todos os itens para cálculo automático.',
          });
        }
      }
    } catch (geminiError: any) {
      console.error(`[Pedido ${pedidoId}] Erro no processamento Gemini/Cálculo:`, geminiError);
      await updatePedido(pedidoId, {
        estado: 'Erro',
        erroProcessamento: geminiError?.message || 'Falha na comunicação com o serviço de Inteligência Artificial.',
      });
    }

    // 5. Resposta ao cliente — Mensagem estrita conforme requisito
    return res.status(201).json({
      sucesso: true,
      mensagem: 'O seu pedido foi recebido com sucesso.',
      pedidoId,
    });
  } catch (error: any) {
    console.error('Erro na rota POST /api/pedidos:', error);
    return res.status(500).json({
      error: 'Ocorreu um erro ao registar o seu pedido. Por favor tente novamente.',
    });
  }
});

// Consulta pública e segura de proposta individual por token
app.get('/api/propostas/:token', async (req, res) => {
  try {
    const tokenParam = (req.params.token || '').trim();
    if (!tokenParam || tokenParam.length < 3) {
      return res.status(400).json({ error: 'Identificador de proposta inválido.' });
    }

    const proposta = await getPropostaByToken(tokenParam);
    if (!proposta) {
      return res.status(404).json({
        error: 'Proposta não encontrada. Verifique se o link está correto ou se o prazo de validade expirou.',
      });
    }

    // Construção de objeto público seguro (sem expor o email do cliente nem dados internos de sistema)
    const propostaPublica: PropostaPublica = {
      numeroProposta: proposta.numeroProposta,
      dataCriacao: proposta.dataCriacao,
      dataValidade: proposta.dataValidade,
      resumoAmbito: proposta.resumoAmbito,
      itens: proposta.itens,
      totalCentimos: proposta.totalCentimos,
      condicoes: proposta.condicoes,
      isDemonstracao: proposta.isDemonstracao,
      comentarioAdmin: proposta.comentarioAdmin || undefined,
      precoAjustadoManualmente: proposta.precoAjustadoManualmente || undefined,
      contactosNegocio: {
        nome: 'Supercell Make HUB (Clone Pedagógico)',
        email: 'ggcaa1@iscte-iul.pt',
        agendamentoUrl: 'https://cal.com/guilherme_carapinha_real',
      },
    };

    res.json(propostaPublica);
  } catch (error: any) {
    console.error('Erro ao consultar proposta por token:', error);
    res.status(500).json({ error: 'Erro ao carregar os dados da proposta.' });
  }
});

// -------------------------------------------------------------
// ÁREA PRIVADA DE ADMINISTRAÇÃO (/api/admin/*)
// -------------------------------------------------------------

// Verificar sessão e permissões do utilizador
app.get('/api/admin/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authResult = await verifyAdminRequest(authHeader);
  res.json(authResult);
});

// Listagem de todos os pedidos e propostas
app.get('/api/admin/pedidos', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  try {
    const pedidos = await getPedidos();
    const propostas = await getPropostas();

    const propostasMap = new Map<string, Proposta>();
    propostas.forEach((p) => {
      propostasMap.set(p.id, p);
      propostasMap.set(p.pedidoId, p);
    });

    const listaCompleta = pedidos.map((ped) => {
      const prop = ped.propostaId ? propostasMap.get(ped.propostaId) : propostasMap.get(ped.id);
      return {
        ...ped,
        proposta: normalizeProposta(prop || null, req),
      };
    });

    res.json({ pedidos: listaCompleta });
  } catch (error: any) {
    console.error('Erro na listagem administrativa de pedidos:', error);
    res.status(500).json({ error: 'Erro ao carregar lista de pedidos.' });
  }
});

// Detalhe de um pedido específico
app.get('/api/admin/pedidos/:id', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  try {
    const pedido = await getPedido(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    let proposta: Proposta | null = null;
    if (pedido.propostaId) {
      const rawProp = await getProposta(pedido.propostaId);
      proposta = normalizeProposta(rawProp, req);
    }

    res.json({ pedido, proposta });
  } catch (error: any) {
    console.error('Erro ao consultar detalhe do pedido:', error);
    res.status(500).json({ error: 'Erro ao consultar pedido.' });
  }
});

// Repetir processamento IA para um pedido que falhou ou precisa de nova análise
app.post('/api/admin/pedidos/:id/reprocessar', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  const { id } = req.params;
  const pedido = await getPedido(id);
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  try {
    const catalogoAtivo = await getCatalogo(true);
    const baseUrl = getAppBaseUrl(req);

    await updatePedido(id, { estado: 'Em análise', erroProcessamento: null });

    const interpretacao = await interpretarPedidoComGemini(pedido.textoOriginal, catalogoAtivo);

    if (interpretacao.necessitaRevisao) {
      await updatePedido(id, {
        estado: 'Necessita de revisão',
        interpretacao,
        informacaoEmFalta: interpretacao.informacaoEmFalta,
        motivoRevisao: interpretacao.motivoRevisao || 'O pedido necessita de revisão manual.',
      });
      return res.json({ sucesso: true, estado: 'Necessita de revisão', interpretacao });
    }

    const calculo = await calcularPropostaBackend(id, interpretacao, catalogoAtivo, baseUrl);
    if (calculo.sucesso && calculo.proposta) {
      const proposta = calculo.proposta;
      const notificacao = await enviarNotificacaoAlunoResend(proposta);
      proposta.notificacaoAluno = notificacao;

      await saveProposta(proposta);
      await updatePedido(id, {
        estado: 'Proposta criada',
        interpretacao,
        propostaId: proposta.id,
        motivoRevisao: null,
      });

      return res.json({ sucesso: true, estado: 'Proposta criada', proposta });
    } else {
      await updatePedido(id, {
        estado: 'Necessita de revisão',
        interpretacao,
        motivoRevisao: calculo.motivoRevisao,
      });
      return res.json({ sucesso: true, estado: 'Necessita de revisão', motivo: calculo.motivoRevisao });
    }
  } catch (error: any) {
    console.error('Erro ao reprocessar pedido:', error);
    await updatePedido(id, {
      estado: 'Erro',
      erroProcessamento: error?.message || 'Erro ao processar pedido com IA.',
    });
    return res.status(500).json({ error: error?.message || 'Falha no reprocessamento.' });
  }
});

// Resolver manualmente um pedido em revisão: admin escolhe itens do catálogo, ajusta preços livremente e adiciona comentários
app.post('/api/admin/pedidos/:id/aprovar-manual', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  const { id } = req.params;
  const { itens, resumoAmbito, comentarioAdmin, precoTotalPersonalizado, precoAjustadoManualmente } = req.body;

  const pedido = await getPedido(id);
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  try {
    const catalogo = await getCatalogo(false);
    const catalogoMap = new Map<string, CatalogoItem>();
    catalogo.forEach((c) => catalogoMap.set(c.id, c));

    const itensCalculados: ItemProposta[] = [];
    let somaCentimosCalculada = 0;

    if (Array.isArray(itens) && itens.length > 0) {
      for (const it of itens) {
        const qtd = parseInt(it.quantidade, 10);
        if (isNaN(qtd) || qtd <= 0) {
          return res.status(400).json({ error: `Quantidade inválida.` });
        }

        // Caso 1: Item do catálogo existente
        if (it.catalogoId && catalogoMap.has(it.catalogoId)) {
          const catItem = catalogoMap.get(it.catalogoId)!;
          let precoUnitarioCentimos = Math.round(catItem.precoCentimos);
          if (it.precoUnitarioEuros !== undefined && it.precoUnitarioEuros !== null && it.precoUnitarioEuros !== '' && !isNaN(Number(it.precoUnitarioEuros))) {
            precoUnitarioCentimos = Math.round(Number(it.precoUnitarioEuros) * 100);
          }
          const subtotalCentimos = Math.round(qtd * precoUnitarioCentimos);
          somaCentimosCalculada += subtotalCentimos;

          itensCalculados.push({
            catalogoId: catItem.id,
            nome: it.nomePersonalizado?.trim() || catItem.nome,
            descricao: it.descricaoPersonalizada?.trim() || catItem.descricao,
            unidadeVenda: catItem.unidadeVenda,
            quantidade: qtd,
            precoUnitarioCentimos,
            subtotalCentimos,
            evidencia: 'Item configurado pelo Administrador.',
          });
        }
        // Caso 2: Item livre / personalizado
        else if (it.nomePersonalizado || it.nome) {
          const nomeItem = (it.nomePersonalizado || it.nome || 'Serviço Personalizado').trim();
          let precoUnitarioCentimos = 0;
          if (it.precoUnitarioEuros !== undefined && it.precoUnitarioEuros !== null && it.precoUnitarioEuros !== '' && !isNaN(Number(it.precoUnitarioEuros))) {
            precoUnitarioCentimos = Math.round(Number(it.precoUnitarioEuros) * 100);
          } else if (it.precoUnitarioCentimos !== undefined) {
            precoUnitarioCentimos = Math.round(Number(it.precoUnitarioCentimos));
          }
          const subtotalCentimos = Math.round(qtd * precoUnitarioCentimos);
          somaCentimosCalculada += subtotalCentimos;

          itensCalculados.push({
            catalogoId: 'item-personalizado',
            nome: nomeItem,
            descricao: it.descricaoPersonalizada?.trim() || 'Serviço/Trabalho com preço livre configurado pelo administrador.',
            unidadeVenda: it.unidadeVenda || 'unidade',
            quantidade: qtd,
            precoUnitarioCentimos,
            subtotalCentimos,
            evidencia: 'Item com preço personalizado adicionado pelo Administrador.',
          });
        }
      }
    }

    // Determinar preço final da proposta (permite override direto do valor pelo admin)
    let totalCentimosFinal = somaCentimosCalculada;
    let precoFoiAjustado = Boolean(precoAjustadoManualmente);

    if (
      precoTotalPersonalizado !== undefined &&
      precoTotalPersonalizado !== null &&
      precoTotalPersonalizado !== '' &&
      !isNaN(Number(precoTotalPersonalizado))
    ) {
      totalCentimosFinal = Math.max(0, Math.round(Number(precoTotalPersonalizado) * 100));
      precoFoiAjustado = true;
    }

    // Se nenhum item foi selecionado mas o admin inseriu um preço direto
    if (itensCalculados.length === 0) {
      if (totalCentimosFinal <= 0) {
        return res.status(400).json({ error: 'Deve selecionar pelo menos um item ou definir um preço válido para a proposta.' });
      }
      itensCalculados.push({
        catalogoId: 'servico-personalizado',
        nome: 'Serviço Personalizado / Orçamento Direto',
        descricao: resumoAmbito?.trim() || 'Pacote de serviços com valor ajustado pelo administrador.',
        unidadeVenda: 'pacote',
        quantidade: 1,
        precoUnitarioCentimos: totalCentimosFinal,
        subtotalCentimos: totalCentimosFinal,
        evidencia: 'Orçamento manual personalizado definido pelo Administrador.',
      });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const baseUrl = getAppBaseUrl(req);
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const linkAcesso = `${normalizedBaseUrl}/proposta/${token}`;
    const agora = new Date();
    const dataValidade = new Date(agora.getTime() + 15 * 24 * 60 * 60 * 1000);

    const novaProposta: Proposta = {
      id: crypto.randomUUID(),
      numeroProposta: `PROP-${agora.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      pedidoId: id,
      dataCriacao: agora.toISOString(),
      dataValidade: dataValidade.toISOString(),
      resumoAmbito: resumoAmbito?.trim() || pedido.interpretacao?.resumo || 'Proposta personalizada configurada na administração.',
      itens: itensCalculados,
      totalCentimos: totalCentimosFinal,
      condicoes:
        'Proposta comercial emitida pelo Supercell Make HUB. Preços sem IVA. Documento didático de demonstração.',
      token,
      linkAcesso,
      notificacaoAluno: { estado: 'Por enviar' },
      isDemonstracao: true,
      comentarioAdmin: comentarioAdmin?.trim() || undefined,
      precoAjustadoManualmente: precoFoiAjustado,
    };

    // Enviar notificação Resend ao aluno
    const notificacao = await enviarNotificacaoAlunoResend(novaProposta);
    novaProposta.notificacaoAluno = notificacao;

    await saveProposta(novaProposta);
    await updatePedido(id, {
      estado: 'Proposta criada',
      propostaId: novaProposta.id,
      motivoRevisao: null,
      informacaoEmFalta: [],
    });

    res.json({ sucesso: true, proposta: novaProposta });
  } catch (error: any) {
    console.error('Erro na aprovação manual da proposta:', error);
    res.status(500).json({ error: error?.message || 'Erro ao aprovar proposta manualmente.' });
  }
});

// Reenviar notificação Resend ao aluno
app.post('/api/admin/pedidos/:id/reenviar-notificacao', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  const pedido = await getPedido(req.params.id);
  if (!pedido || !pedido.propostaId) {
    return res.status(404).json({ error: 'Pedido ou proposta associada não encontrada.' });
  }

  const proposta = await getProposta(pedido.propostaId);
  if (!proposta) {
    return res.status(404).json({ error: 'Proposta não encontrada.' });
  }

  try {
    const notificacao = await enviarNotificacaoAlunoResend(proposta);
    proposta.notificacaoAluno = notificacao;
    await saveProposta(proposta);

    res.json({ sucesso: true, notificacao });
  } catch (error: any) {
    console.error('Erro ao reenviar notificação Resend:', error);
    res.status(500).json({ error: 'Erro ao reenviar email de notificação.' });
  }
});

// Teste direto de envio de notificação Resend (para validar entrega na caixa de correio / spam)
app.post('/api/admin/test-resend', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  try {
    const { emailDestino } = req.body || {};
    const alvo = (typeof emailDestino === 'string' && emailDestino.trim()) || process.env.EMAIL_ALUNO;

    if (!process.env.RESEND_API_KEY) {
      return res.status(400).json({ error: 'Falta configurar RESEND_API_KEY nos Secrets.' });
    }
    if (!alvo) {
      return res.status(400).json({ error: 'Nenhum email de destino configurado (EMAIL_ALUNO vazio).' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const agora = new Date().toLocaleString('pt-PT');
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: alvo,
      subject: `[TESTE] Notificação Make HUB (${agora})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155; max-width: 600px;">
          <h2 style="color: #818cf8; margin-top: 0;">Teste de Notificação com Sucesso! ✉️</h2>
          <p style="color: #e2e8f0; line-height: 1.5;">
            Este email confirma que a integração com o <strong>Resend</strong> está ativa e operacional no <strong>Supercell Make HUB</strong>.
          </p>
          <div style="background-color: #1e293b; padding: 14px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #6366f1;">
            <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Destinatário:</strong> ${alvo}</p>
            <p style="margin: 0; font-size: 13px;"><strong>Data e Hora:</strong> ${agora}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; line-height: 1.4;">
            ⚠️ <em>Nota importante:</em> Como o envio provém de <code>onboarding@resend.dev</code> (domínio de teste do Resend), estes emails vão frequentemente para o <strong>Lixo Eletrónico (Spam)</strong> ou separador "Outros" no Outlook / email institucional (@iscte-iul.pt). Marca este endereço como remetente de confiança para receber sempre as notificações!
          </p>
        </div>
      `,
      text: `Teste de Notificação Make HUB com Sucesso!\nDestinatário: ${alvo}\nData: ${agora}\nVerifique a pasta de Spam/Lixo Eletrónico se não encontrar na caixa de entrada.`,
    });

    if (response.error) {
      return res.status(400).json({
        sucesso: false,
        erro: response.error.message || 'Erro ao enviar via Resend.',
        detalhes: response.error,
      });
    }

    return res.json({
      sucesso: true,
      mensagem: `Email de teste enviado com sucesso para ${alvo}!`,
      id: response.data?.id,
      emailDestino: alvo,
    });
  } catch (err: any) {
    console.error('Erro ao testar envio Resend:', err);
    return res.status(500).json({ error: err.message || 'Erro interno ao comunicar com o Resend.' });
  }
});

// Gestão de catálogo: Listar
app.get('/api/admin/catalogo', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  try {
    const itens = await getCatalogo(false); // todos, inclusive inativos
    res.json(itens);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao carregar catálogo completo.' });
  }
});

// Gestão de catálogo: Criar novo item
app.post('/api/admin/catalogo', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  const { id, nome, descricao, unidadeVenda, precoEuros, condicoes, ativo } = req.body;

  if (!nome || !descricao || !unidadeVenda || precoEuros === undefined) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios do item.' });
  }

  const itemId = id?.trim() || `item-${Date.now()}`;
  const precoCentimos = Math.round(parseFloat(precoEuros) * 100);

  const novoItem: CatalogoItem = {
    id: itemId,
    nome: nome.trim(),
    descricao: descricao.trim(),
    unidadeVenda,
    precoCentimos,
    moeda: 'EUR',
    ativo: ativo !== undefined ? Boolean(ativo) : true,
    condicoes: condicoes?.trim() || '',
    isDemonstracao: true,
  };

  try {
    await saveCatalogoItem(novoItem);
    res.status(201).json(novoItem);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao guardar item no catálogo.' });
  }
});

// Gestão de catálogo: Atualizar item
app.put('/api/admin/catalogo/:id', async (req, res) => {
  const authResult = await verifyAdminRequest(req.headers.authorization);
  if (!authResult.isAdmin) {
    return res.status(403).json({ error: authResult.message || 'Acesso negado.' });
  }

  const { id } = req.params;
  const { nome, descricao, unidadeVenda, precoEuros, condicoes, ativo } = req.body;

  const itemExistente = await getCatalogoItem(id);
  if (!itemExistente) {
    return res.status(404).json({ error: 'Item do catálogo não encontrado.' });
  }

  const atualizacoes: Partial<CatalogoItem> = {};
  if (nome) atualizacoes.nome = nome.trim();
  if (descricao) atualizacoes.descricao = descricao.trim();
  if (unidadeVenda) atualizacoes.unidadeVenda = unidadeVenda;
  if (precoEuros !== undefined) atualizacoes.precoCentimos = Math.round(parseFloat(precoEuros) * 100);
  if (condicoes !== undefined) atualizacoes.condicoes = condicoes.trim();
  if (ativo !== undefined) atualizacoes.ativo = Boolean(ativo);

  try {
    await updateCatalogoItem(id, atualizacoes);
    res.json({ ...itemExistente, ...atualizacoes });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar item do catálogo.' });
  }
});

// -------------------------------------------------------------
// CHATBOT ASSISTENTE (Preservação da funcionalidade existente)
// -------------------------------------------------------------
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const CHAT_SYSTEM_INSTRUCTION = `
You are the official Supercell Make AI Assistant.
Your mission is to answer user questions EXCLUSIVELY about:
1. The Supercell Make website, its features, community creations, and voting system.
2. BUTTON LOCATIONS ON THE WEBSITE:
   - "Submeter Skin" button: Located in the top right corner of the navigation header on Desktop.
   - "Pedir Proposta" button: In the navigation header and dedicated proposal request form section.
   - "Entrar" (Login) button: Located in the top-right header for Supercell ID authentication.
   - "Marcar Reunião" button: Floating at the bottom-right corner and in the header navigation (Cal.com with Guilherme Carapinha_real / ggcaa1@iscte-iul.pt).
3. Specific games: Brawl Stars (4,000 tris max), Clash Royale (Tower skins), Clash of Clans (6,500 tris budget).
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: null,
        fallback: true,
        message: 'No GEMINI_API_KEY configured on server; using local knowledge base.',
      });
    }

    const conversationContents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          conversationContents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'bot') {
          conversationContents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }
    conversationContents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: conversationContents,
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    res.json({ reply: response.text || 'Sem resposta disponível.', fallback: false });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.json({
      reply: null,
      error: 'Failed to process chat message',
      fallback: true,
    });
  }
});

// -------------------------------------------------------------
// SERVIDOR E VITE MIDDLEWARES
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Supercell Make HUB server running on http://0.0.0.0:${PORT}`);
  });

  if (CLOUD_PORT && CLOUD_PORT !== PORT) {
    app.listen(CLOUD_PORT, '0.0.0.0', () => {
      console.log(`Supercell Make HUB server also listening on Cloud Run port ${CLOUD_PORT}`);
    });
  }
}

startServer();
