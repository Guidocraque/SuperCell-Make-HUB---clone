// Tipos e Interfaces do Módulo de Pedidos de Proposta com IA (Supercell Make HUB)

export type UnidadeVenda = 'unidade' | 'hora' | 'pacote';

export interface CatalogoItem {
  id: string;
  nome: string;
  descricao: string;
  unidadeVenda: UnidadeVenda;
  precoCentimos: number; // Ex: 45000 = 450,00 €
  moeda: 'EUR';
  ativo: boolean;
  condicoes?: string;
  isDemonstracao: boolean;
}

export type EstadoPedido =
  | 'Recebido'
  | 'Em análise'
  | 'Necessita de revisão'
  | 'Proposta criada'
  | 'Erro';

export interface ItemInterpretadoIA {
  catalogoId: string;
  quantidade: number | null;
  evidencia: string;
}

export interface InterpretacaoIA {
  resumo: string;
  itens: ItemInterpretadoIA[];
  prazoPedido: string | null;
  informacaoEmFalta: string[];
  necessitaRevisao: boolean;
  motivoRevisao: string | null;
}

export interface Pedido {
  id: string;
  nome: string;
  email: string;
  textoOriginal: string;
  dataCriacao: string;
  dataAtualizacao: string;
  estado: EstadoPedido;
  interpretacao?: InterpretacaoIA | null;
  informacaoEmFalta?: string[];
  motivoRevisao?: string | null;
  propostaId?: string | null;
  erroProcessamento?: string | null;
}

export type EstadoNotificacao =
  | 'Por enviar'
  | 'Aceite pelo serviço'
  | 'Falhou'
  | 'Não configurado';

export interface NotificacaoAluno {
  estado: EstadoNotificacao;
  emailDestino?: string;
  identificadorServico?: string;
  dataTentativa?: string;
  erro?: string;
}

export interface ItemProposta {
  catalogoId?: string;
  nome: string;
  descricao: string;
  unidadeVenda: UnidadeVenda;
  quantidade: number;
  precoUnitarioCentimos: number;
  subtotalCentimos: number;
  evidencia?: string;
}

export interface Proposta {
  id: string;
  numeroProposta: string; // Ex: PROP-2026-0001
  pedidoId: string;
  dataCriacao: string;
  dataValidade: string; // 15 dias de demonstração
  resumoAmbito: string;
  itens: ItemProposta[];
  totalCentimos: number;
  condicoes: string;
  token: string;
  linkAcesso: string;
  notificacaoAluno: NotificacaoAluno;
  isDemonstracao: boolean;
  comentarioAdmin?: string;
  precoAjustadoManualmente?: boolean;
}

// Proposta limpa para consulta pública por token (sem expor PII como o email do cliente)
export interface PropostaPublica {
  numeroProposta: string;
  dataCriacao: string;
  dataValidade: string;
  resumoAmbito: string;
  itens: ItemProposta[];
  totalCentimos: number;
  condicoes: string;
  isDemonstracao: boolean;
  comentarioAdmin?: string;
  precoAjustadoManualmente?: boolean;
  contactosNegocio: {
    nome: string;
    email: string;
    agendamentoUrl: string;
  };
}
