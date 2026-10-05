import crypto from 'crypto';
import { CatalogoItem, InterpretacaoIA, ItemProposta, Proposta } from '../src/types/proposta';
import { getNextProposalNumber } from './firestoreDb';

export interface CalculoResultado {
  sucesso: boolean;
  proposta?: Proposta;
  motivoRevisao?: string;
}

export async function calcularPropostaBackend(
  pedidoId: string,
  interpretacao: InterpretacaoIA,
  catalogoAtivo: CatalogoItem[],
  baseUrl: string
): Promise<CalculoResultado> {
  // Se a IA determinou que necessita de revisão ou não encontrou itens
  if (interpretacao.necessitaRevisao) {
    return {
      sucesso: false,
      motivoRevisao: interpretacao.motivoRevisao || 'O pedido contém pontos ambíguos ou serviços que requerem validação humana.',
    };
  }

  if (!interpretacao.itens || interpretacao.itens.length === 0) {
    return {
      sucesso: false,
      motivoRevisao: 'Nenhum produto ou serviço do catálogo ativo foi identificado no pedido.',
    };
  }

  // Mapear catálogo por ID para consulta rápida e segura
  const catalogoMap = new Map<string, CatalogoItem>();
  catalogoAtivo.forEach((c) => catalogoMap.set(c.id, c));

  const itensCalculados: ItemProposta[] = [];
  let totalCentimos = 0;

  for (const itemInt of interpretacao.itens) {
    const itemCatalogo = catalogoMap.get(itemInt.catalogoId);

    // Validação 1: O identificador existe e está ativo no catálogo
    if (!itemCatalogo || !itemCatalogo.ativo) {
      return {
        sucesso: false,
        motivoRevisao: `O item "${itemInt.catalogoId}" não existe ou não está ativo no catálogo comercial.`,
      };
    }

    // Validação 2: Quantidade válida e positiva
    const qtd = itemInt.quantidade;
    if (typeof qtd !== 'number' || qtd <= 0 || isNaN(qtd)) {
      return {
        sucesso: false,
        motivoRevisao: `A quantidade para o item "${itemCatalogo.nome}" não pôde ser determinada com segurança.`,
      };
    }

    // Cálculo exato no backend em cêntimos
    const precoUnitarioCentimos = Math.round(itemCatalogo.precoCentimos);
    const subtotalCentimos = Math.round(qtd * precoUnitarioCentimos);
    totalCentimos += subtotalCentimos;

    // Guarda uma cópia imutável dos dados e condições do catálogo no momento da emissão
    itensCalculados.push({
      catalogoId: itemCatalogo.id,
      nome: itemCatalogo.nome,
      descricao: itemCatalogo.descricao,
      unidadeVenda: itemCatalogo.unidadeVenda,
      quantidade: qtd,
      precoUnitarioCentimos,
      subtotalCentimos,
      evidencia: itemInt.evidencia,
    });
  }

  const token = crypto.randomBytes(24).toString('hex');
  const numeroProposta = await getNextProposalNumber();
  const agora = new Date();
  const dataValidade = new Date(agora.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 dias

  let cleanBaseUrl = (baseUrl || '').trim();
  if (!cleanBaseUrl || cleanBaseUrl.includes('super-cell-make-hub-clone.vercel.app')) {
    cleanBaseUrl = 'https://supercell-make-hub.ai.studio';
  }
  if (!cleanBaseUrl.startsWith('http://') && !cleanBaseUrl.startsWith('https://')) {
    cleanBaseUrl = `https://${cleanBaseUrl}`;
  }
  const normalizedBaseUrl = cleanBaseUrl.endsWith('/') ? cleanBaseUrl.slice(0, -1) : cleanBaseUrl;
  const linkAcesso = `${normalizedBaseUrl}/proposta/${token}`;

  const proposta: Proposta = {
    id: crypto.randomUUID(),
    numeroProposta,
    pedidoId,
    dataCriacao: agora.toISOString(),
    dataValidade: dataValidade.toISOString(),
    resumoAmbito: interpretacao.resumo,
    itens: itensCalculados,
    totalCentimos,
    condicoes:
      'Proposta elaborada com base no catálogo oficial de serviços de arte 3D do Supercell Make HUB. Validade de 15 dias a contar da data de emissão. Valores apresentados líquidos (Total sem IVA). Este é um documento pedagógico de demonstração.',
    token,
    linkAcesso,
    notificacaoAluno: {
      estado: 'Por enviar',
    },
    isDemonstracao: true,
  };

  return {
    sucesso: true,
    proposta,
  };
}
