import { notFound } from 'next/navigation'
import { apiServerFetch } from '@/lib/api-server'
import type { Cliente } from '@/types/clientes'
import ClienteForm from '../ClienteForm'
import { atualizarCliente } from '../actions'

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await apiServerFetch(`/clientes/${id}`)

  if (res.status === 404) notFound()
  if (!res.ok) throw new Error('Falha ao carregar cliente')

  const cliente: Cliente = await res.json()
  const acao = atualizarCliente.bind(null, cliente.id)

  return (
    <div>
      <h1 className="h3 mb-3">Editar cliente</h1>
      <ClienteForm cliente={cliente} acao={acao} />
    </div>
  )
}
