export type SituacaoOrcamento = 'pendente' | 'enviado' | 'aprovado' | 'rejeitado' | 'cancelado'

export const SITUACOES_ORCAMENTO: SituacaoOrcamento[] = [
  'pendente',
  'enviado',
  'aprovado',
  'rejeitado',
  'cancelado',
]

export interface ItemOrcamento {
  id: number
  produtoId: number
  nomeProdutoRegistro: string
  precoUnitarioRegistro: number
  quantidade: number
  totalLinha: number
}

export interface Orcamento {
  id: number
  clienteId: number
  cliente?: {
    id: number
    nome: string
    documento: string | null
    email: string | null
    telefone: string | null
  }
  usuarioAutorId: number
  usuarioAutor?: {
    id: number
    nomeCompleto: string
    email: string
  }
  situacao: SituacaoOrcamento
  subtotal: number
  valorDesconto: number
  total: number
  validoAte: string | null
  observacoes: string | null
  criadoEm: string
  atualizadoEm: string
  itens: ItemOrcamento[]
}

export interface ItemOrcamentoPayload {
  produtoId: number
  quantidade: number
  precoUnitario?: number
}

export interface OrcamentoPayload {
  clienteId: number
  valorDesconto?: number
  validoAte?: string
  observacoes?: string
  situacao?: SituacaoOrcamento
  itens: ItemOrcamentoPayload[]
}
