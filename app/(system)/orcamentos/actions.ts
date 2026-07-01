'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'
import { mensagemDeErro } from '@/lib/erros'
import type { OrcamentoPayload } from '@/types/orcamentos'

export type OrcamentoActionState = {
  error?: string
} | undefined

export async function criarOrcamento(dados: OrcamentoPayload): Promise<OrcamentoActionState> {
  const res = await apiServerFetch('/orcamentos', {
    method: 'POST',
    body: JSON.stringify(dados),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível salvar o orçamento.') }
  }

  revalidatePath('/orcamentos')
  redirect('/orcamentos')
}

export async function atualizarOrcamento(
  id: number,
  dados: OrcamentoPayload,
): Promise<OrcamentoActionState> {
  const res = await apiServerFetch(`/orcamentos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível atualizar o orçamento.') }
  }

  revalidatePath('/orcamentos')
  redirect('/orcamentos')
}
