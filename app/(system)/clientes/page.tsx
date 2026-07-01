import Link from 'next/link'
import { apiServerFetch } from '@/lib/api-server'
import BotaoExcluir from '@/components/BotaoExcluir'
import type { Cliente } from '@/types/clientes'
import { excluirCliente } from './actions'

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; documento?: string }>
}) {
  const { nome, documento } = await searchParams

  const params = new URLSearchParams()
  if (nome) params.set('nome', nome)
  if (documento) params.set('documento', documento)

  const res = await apiServerFetch(`/clientes${params.size ? `?${params}` : ''}`)
  if (!res.ok) throw new Error('Falha ao carregar clientes')
  const clientes: Cliente[] = await res.json()

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Clientes</h1>
        <Link href="/clientes/novo" className="btn btn-primary">
          Novo cliente
        </Link>
      </div>

      <form className="row g-2 mb-3" method="get">
        <div className="col-md-5">
          <input
            type="text"
            name="nome"
            className="form-control"
            placeholder="Buscar por nome"
            defaultValue={nome}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="documento"
            className="form-control"
            placeholder="Buscar por documento"
            defaultValue={documento}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-outline-primary w-100">
            Filtrar
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-hover bg-white align-middle">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Documento</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.documento ?? '-'}</td>
                <td>{cliente.email ?? '-'}</td>
                <td>{cliente.telefone ?? '-'}</td>
                <td className="d-flex gap-2 justify-content-end">
                  <Link href={`/clientes/${cliente.id}`} className="btn btn-sm btn-outline-primary">
                    Editar
                  </Link>
                  <BotaoExcluir acao={excluirCliente.bind(null, cliente.id)} />
                </td>
              </tr>
            ))}

            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
