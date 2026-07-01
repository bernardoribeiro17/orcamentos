'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'
import { mensagemDeErro } from '@/lib/erros'

export type ProdutoActionState = {
  error?: string
}

function lerPayload(formData: FormData) {
  const nome = String(formData.get('nome') ?? '').trim()
  const codigoSku = String(formData.get('codigoSku') ?? '').trim()
  const descricao = String(formData.get('descricao') ?? '').trim()
  const unidade = String(formData.get('unidade') ?? '').trim()
  const precoUnitario = Number(formData.get('precoUnitario'))
  const ativo = formData.get('ativo') === 'on'

  return { nome, codigoSku, descricao, unidade, precoUnitario, ativo }
}

export async function criarProduto(
  _prevState: ProdutoActionState | undefined,
  formData: FormData,
): Promise<ProdutoActionState> {
  const { nome, codigoSku, descricao, unidade, precoUnitario, ativo } = lerPayload(formData)

  if (!nome) {
    return { error: 'Informe o nome do produto.' }
  }
  if (Number.isNaN(precoUnitario) || precoUnitario < 0) {
    return { error: 'Informe um preço válido.' }
  }

  const res = await apiServerFetch('/produtos', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      precoUnitario,
      codigoSku: codigoSku || undefined,
      descricao: descricao || undefined,
      unidade: unidade || undefined,
      ativo,
    }),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível salvar o produto.') }
  }

  revalidatePath('/produtos')
  redirect('/produtos')
}

export async function atualizarProduto(
  id: number,
  _prevState: ProdutoActionState | undefined,
  formData: FormData,
): Promise<ProdutoActionState> {
  const { nome, codigoSku, descricao, unidade, precoUnitario, ativo } = lerPayload(formData)

  if (!nome) {
    return { error: 'Informe o nome do produto.' }
  }
  if (Number.isNaN(precoUnitario) || precoUnitario < 0) {
    return { error: 'Informe um preço válido.' }
  }

  const res = await apiServerFetch(`/produtos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      nome,
      precoUnitario,
      codigoSku: codigoSku || undefined,
      descricao: descricao || undefined,
      unidade: unidade || undefined,
      ativo,
    }),
  })

  if (!res.ok) {
    return { error: await mensagemDeErro(res, 'Não foi possível atualizar o produto.') }
  }

  revalidatePath('/produtos')
  redirect('/produtos')
}

export async function excluirProduto(id: number) {
  const res = await apiServerFetch(`/produtos/${id}`, { method: 'DELETE' })
  if (res.ok) {
    revalidatePath('/produtos')
  }
}
