export interface Cliente {
  id: number
  nome: string
  documento: string | null
  email: string | null
  telefone: string | null
  observacoes: string | null
  usuarioCriadorId: number | null
  criadoEm: string
  atualizadoEm: string
}

export interface ClientePayload {
  nome: string
  documento?: string
  email?: string
  telefone?: string
  observacoes?: string
}
