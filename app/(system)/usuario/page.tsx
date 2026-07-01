import { apiServerFetch } from '@/lib/api-server'
import type { Usuario } from '@/types/usuario'
import FormularioPerfil from './FormularioPerfil'
import FormularioSenha from './FormularioSenha'

export default async function UsuarioPage() {
  const res = await apiServerFetch('/usuarios/atual')
  if (!res.ok) throw new Error('Falha ao carregar usuário')
  const usuario: Usuario = await res.json()

  return (
    <div>
      <h1 className="h3 mb-3">Meu perfil</h1>
      <FormularioPerfil usuario={usuario} />
      <FormularioSenha />
    </div>
  )
}
