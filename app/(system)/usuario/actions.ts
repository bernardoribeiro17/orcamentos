'use server'

import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'
import { mensagemDeErro } from '@/lib/erros'

export type PerfilActionState = {
  error?: string
  sucesso?: string
}

export async function atualizarPerfil(
  _prevState: PerfilActionState | undefined,
  formData: FormData,
): Promise<PerfilActionState> {
  const nomeCompleto = String(formData.get('nomeCompleto') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()

  if (!nomeCompleto || !email) {
    return { error: 'Preencha nome e e-mail.' }
  }

  const res = await apiServerFetch('/usuarios/atual', {
    method: 'PATCH',
    body: JSON.stringify({ nomeCompleto, email }),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível atualizar o perfil.') }
  }

  revalidatePath('/usuario')
  return { sucesso: 'Perfil atualizado com sucesso.' }
}

export async function redefinirSenha(
  _prevState: PerfilActionState | undefined,
  formData: FormData,
): Promise<PerfilActionState> {
  const senhaAtual = String(formData.get('senhaAtual') ?? '')
  const novaSenha = String(formData.get('novaSenha') ?? '')
  const confirmarSenha = String(formData.get('confirmarSenha') ?? '')

  if (!senhaAtual || !novaSenha) {
    return { error: 'Preencha a senha atual e a nova senha.' }
  }
  if (novaSenha.length < 6) {
    return { error: 'A nova senha deve ter no mínimo 6 caracteres.' }
  }
  if (novaSenha !== confirmarSenha) {
    return { error: 'A confirmação não corresponde à nova senha.' }
  }

  const res = await apiServerFetch('/usuarios/atual/senha', {
    method: 'PATCH',
    body: JSON.stringify({ senhaAtual, novaSenha }),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível alterar a senha.') }
  }

  return { sucesso: 'Senha alterada com sucesso.' }
}
