export type Perfil = 'admin' | 'operador'

export interface Usuario {
  id: number
  email: string
  nomeCompleto: string
  perfil: Perfil
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}
