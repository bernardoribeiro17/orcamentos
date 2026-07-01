import Link from 'next/link'
import { apiServerFetch } from '@/lib/api-server'
import { formatarData, formatarMoeda } from '@/lib/format'
import { SITUACOES_ORCAMENTO, type Orcamento } from '@/types/orcamentos'

const CORES_SITUACAO: Record<string, string> = {
  pendente: 'bg-warning text-dark',
  enviado: 'bg-info text-dark',
  aprovado: 'bg-success',
  rejeitado: 'bg-danger',
  cancelado: 'bg-secondary',
}

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string; situacao?: string }>
}) {
  const { mes, ano, situacao } = await searchParams

  const params = new URLSearchParams()
  if (mes) params.set('mes', mes)
  if (ano) params.set('ano', ano)
  if (situacao) params.set('situacao', situacao)

  const res = await apiServerFetch(`/orcamentos${params.size ? `?${params}` : ''}`)
  if (!res.ok) throw new Error('Falha ao carregar orçamentos')
  const orcamentos: Orcamento[] = await res.json()

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Orçamentos</h1>
        <Link href="/orcamentos/novo" className="btn btn-primary">
          Novo orçamento
        </Link>
      </div>

      <form className="row g-2 mb-3" method="get">
        <div className="col-md-2">
          <input
            type="number"
            name="mes"
            min="1"
            max="12"
            className="form-control"
            placeholder="Mês"
            defaultValue={mes}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="ano"
            className="form-control"
            placeholder="Ano"
            defaultValue={ano}
          />
        </div>
        <div className="col-md-4">
          <select name="situacao" className="form-select" defaultValue={situacao ?? ''}>
            <option value="">Todas as situações</option>
            {SITUACOES_ORCAMENTO.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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
              <th>#</th>
              <th>Cliente</th>
              <th>Situação</th>
              <th className="text-end">Total</th>
              <th>Válido até</th>
              <th>Criado em</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((orcamento) => (
              <tr key={orcamento.id}>
                <td>{orcamento.id}</td>
                <td>{orcamento.cliente?.nome ?? `Cliente ${orcamento.clienteId}`}</td>
                <td>
                  <span className={`badge ${CORES_SITUACAO[orcamento.situacao] ?? 'bg-secondary'}`}>
                    {orcamento.situacao}
                  </span>
                </td>
                <td className="text-end">{formatarMoeda(orcamento.total)}</td>
                <td>{formatarData(orcamento.validoAte)}</td>
                <td>{formatarData(orcamento.criadoEm)}</td>
                <td className="text-end">
                  <Link href={`/orcamentos/${orcamento.id}`} className="btn btn-sm btn-outline-primary">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {orcamentos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
