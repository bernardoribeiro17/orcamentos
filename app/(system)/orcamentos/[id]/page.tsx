import { notFound } from 'next/navigation'
import { apiServerFetch } from '@/lib/api-server'
import type { Cliente } from '@/types/clientes'
import type { Produto } from '@/types/produtos'
import type { Orcamento } from '@/types/orcamentos'
import OrcamentoForm from '../OrcamentoForm'
import { atualizarOrcamento } from '../actions'

export default async function EditarOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [resOrcamento, resClientes, resProdutos] = await Promise.all([
    apiServerFetch(`/orcamentos/${id}`),
    apiServerFetch('/clientes'),
    apiServerFetch('/produtos'),
  ])

  if (resOrcamento.status === 404) notFound()
  if (!resOrcamento.ok || !resClientes.ok || !resProdutos.ok) {
    throw new Error('Falha ao carregar orçamento')
  }

  const orcamento: Orcamento = await resOrcamento.json()
  const clientes: Cliente[] = await resClientes.json()
  const produtos: Produto[] = await resProdutos.json()

  const acao = atualizarOrcamento.bind(null, orcamento.id)

  return (
    <div>
      <h1 className="h3 mb-3">Editar orçamento #{orcamento.id}</h1>
      <OrcamentoForm clientes={clientes} produtos={produtos} orcamento={orcamento} acao={acao} />
    </div>
  )
}
