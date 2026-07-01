import { apiServerFetch } from '@/lib/api-server'
import { formatarMoeda } from '@/lib/format'
import type {
  OrcamentoPorMes,
  OrcamentoPorStatus,
  ResumoDashboard,
  TopCliente,
  TopProduto,
  ValorOrcadoPorMes,
} from '@/types/dashboard'

const NOMES_MES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const CORES_SITUACAO: Record<string, string> = {
  pendente: 'bg-warning',
  enviado: 'bg-info',
  aprovado: 'bg-success',
  rejeitado: 'bg-danger',
  cancelado: 'bg-secondary',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>
}) {
  const { ano: anoParam } = await searchParams
  const anoAtual = new Date().getFullYear()
  const anoInformado = anoParam ? Number(anoParam) : NaN
  const ano = Number.isInteger(anoInformado) ? anoInformado : anoAtual

  const [resResumo, resStatus, resPorMes, resValorPorMes, resTopClientes, resTopProdutos] =
    await Promise.all([
      apiServerFetch('/dashboard/resumo'),
      apiServerFetch('/dashboard/orcamentos-por-status'),
      apiServerFetch(`/dashboard/orcamentos-por-mes?ano=${ano}`),
      apiServerFetch(`/dashboard/valor-orcado-por-mes?ano=${ano}`),
      apiServerFetch('/dashboard/top-clientes-orcamentos?limit=10'),
      apiServerFetch('/dashboard/top-produtos-orcados?limit=10'),
    ])

  if (
    !resResumo.ok ||
    !resStatus.ok ||
    !resPorMes.ok ||
    !resValorPorMes.ok ||
    !resTopClientes.ok ||
    !resTopProdutos.ok
  ) {
    throw new Error('Falha ao carregar dados do dashboard')
  }

  const resumo: ResumoDashboard = await resResumo.json()
  const porStatus: OrcamentoPorStatus[] = await resStatus.json()
  const porMes: OrcamentoPorMes[] = await resPorMes.json()
  const valorPorMes: ValorOrcadoPorMes[] = await resValorPorMes.json()
  const topClientes: TopCliente[] = await resTopClientes.json()
  const topProdutos: TopProduto[] = await resTopProdutos.json()

  const maxOrcamentosMes = Math.max(1, ...porMes.map((m) => m.total))
  const maxValorMes = Math.max(1, ...valorPorMes.map((m) => m.total))
  const maxStatus = Math.max(1, ...porStatus.map((s) => s.total))

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 mb-0">Dashboard</h1>

        <form className="d-flex gap-2" method="get">
          <select name="ano" defaultValue={ano} className="form-select" style={{ width: '120px' }}>
            {[anoAtual, anoAtual - 1, anoAtual - 2].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-outline-primary">
            Aplicar
          </button>
        </form>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card card-kpi shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small">Total de orçamentos</p>
              <p className="h2 mb-0">{resumo.totalOrcamentos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-kpi shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small">Total de clientes</p>
              <p className="h2 mb-0">{resumo.totalClientes}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-kpi shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1 small">Produtos ativos</p>
              <p className="h2 mb-0">{resumo.totalProdutosAtivos}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Orçamentos por situação</h2>
              {porStatus.map((item) => (
                <div key={item.situacao} className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span className="text-capitalize">{item.situacao}</span>
                    <span>{item.total}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${CORES_SITUACAO[item.situacao] ?? 'bg-primary'}`}
                      style={{ width: `${(item.total / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Orçamentos por mês ({ano})</h2>
              <div className="d-flex align-items-end gap-1" style={{ height: '160px' }}>
                {porMes.map((item) => (
                  <div key={item.mes} className="flex-fill text-center">
                    <div
                      className="barra-grafico mx-auto"
                      style={{
                        height: `${Math.max(4, (item.total / maxOrcamentosMes) * 130)}px`,
                        width: '70%',
                      }}
                      title={`${item.total} orçamento(s)`}
                    />
                    <small className="text-muted">{NOMES_MES[item.mes - 1]}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Valor orçado por mês ({ano})</h2>
              <div className="d-flex align-items-end gap-1" style={{ height: '160px' }}>
                {valorPorMes.map((item) => (
                  <div key={item.mes} className="flex-fill text-center">
                    <div
                      className="barra-grafico mx-auto"
                      style={{
                        backgroundColor: 'var(--cor-destaque)',
                        height: `${Math.max(4, (item.total / maxValorMes) * 130)}px`,
                        width: '70%',
                      }}
                      title={formatarMoeda(item.total)}
                    />
                    <small className="text-muted">{NOMES_MES[item.mes - 1]}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Top clientes</h2>
              <ol className="ps-3 mb-0">
                {topClientes.map((cliente) => (
                  <li key={cliente.clienteId}>
                    {cliente.nome} <span className="text-muted">({cliente.totalOrcamentos})</span>
                  </li>
                ))}
                {topClientes.length === 0 && <p className="text-muted small">Sem dados.</p>}
              </ol>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Top produtos</h2>
              <ol className="ps-3 mb-0">
                {topProdutos.map((produto) => (
                  <li key={produto.produtoId}>
                    {produto.nome}{' '}
                    <span className="text-muted">({produto.totalOcorrencias})</span>
                  </li>
                ))}
                {topProdutos.length === 0 && <p className="text-muted small">Sem dados.</p>}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
