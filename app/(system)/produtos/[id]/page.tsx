import { notFound } from 'next/navigation'
import { apiServerFetch } from '@/lib/api-server'
import type { Produto } from '@/types/produtos'
import ProdutoForm from '../ProdutoForm'
import { atualizarProduto } from '../actions'

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await apiServerFetch(`/produtos/${id}`)

  if (res.status === 404) notFound()
  if (!res.ok) throw new Error('Falha ao carregar produto')

  const produto: Produto = await res.json()
  const acao = atualizarProduto.bind(null, produto.id)

  return (
    <div>
      <h1 className="h3 mb-3">Editar produto</h1>
      <ProdutoForm produto={produto} acao={acao} />
    </div>
  )
}
