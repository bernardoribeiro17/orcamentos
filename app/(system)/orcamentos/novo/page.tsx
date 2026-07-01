import { apiServerFetch } from '@/lib/api-server'
import type { Cliente } from '@/types/clientes'
import type { Produto } from '@/types/produtos'
import OrcamentoForm from '../OrcamentoForm'
import { criarOrcamento } from '../actions'

export default async function NovoOrcamentoPage() {
  const [resClientes, resProdutos] = await Promise.all([
    apiServerFetch('/clientes'),
    apiServerFetch('/produtos?ativo=true'),
  ])

  if (!resClientes.ok || !resProdutos.ok) {
    throw new Error('Falha ao carregar dados para o orçamento')
  }

  const clientes: Cliente[] = await resClientes.json()
  const produtos: Produto[] = await resProdutos.json()

  return (
    <div>
      <h1 className="h3 mb-3">Novo orçamento</h1>
      <OrcamentoForm clientes={clientes} produtos={produtos} acao={criarOrcamento} />
    </div>
  )
}
