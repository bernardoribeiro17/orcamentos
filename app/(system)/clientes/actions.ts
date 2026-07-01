'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'
import { mensagemDeErro } from '@/lib/erros'

export type ClienteActionState = {
  error?: string
}

function lerPayload(formData: FormData) {
  const nome = String(formData.get('nome') ?? '').trim()
  const documento = String(formData.get('documento') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefone = String(formData.get('telefone') ?? '').trim()
  const observacoes = String(formData.get('observacoes') ?? '').trim()

  return { nome, documento, email, telefone, observacoes }
}

export async function criarCliente(
  _prevState: ClienteActionState | undefined,
  formData: FormData,
): Promise<ClienteActionState> {
  const { nome, documento, email, telefone, observacoes } = lerPayload(formData)

  if (!nome) {
    return { error: 'Informe o nome do cliente.' }
  }

  const res = await apiServerFetch('/clientes', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      documento: documento || undefined,
      email: email || undefined,
      telefone: telefone || undefined,
      observacoes: observacoes || undefined,
    }),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível salvar o cliente.') }
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function atualizarCliente(
  id: number,
  _prevState: ClienteActionState | undefined,
  formData: FormData,
): Promise<ClienteActionState> {
  const { nome, documento, email, telefone, observacoes } = lerPayload(formData)

  if (!nome) {
    return { error: 'Informe o nome do cliente.' }
  }

  const res = await apiServerFetch(`/clientes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      nome,
      documento: documento || undefined,
      email: email || undefined,
      telefone: telefone || undefined,
      observacoes: observacoes || undefined,
    }),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível atualizar o cliente.') }
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function excluirCliente(id: number) {
  const res = await apiServerFetch(`/clientes/${id}`, { method: 'DELETE' })
  if (res.ok) {
    revalidatePath('/clientes')
  }
}
