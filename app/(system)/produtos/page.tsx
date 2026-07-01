import Link from 'next/link'
import { apiServerFetch } from '@/lib/api-server'
import { formatarMoeda } from '@/lib/format'
import BotaoExcluir from '@/components/BotaoExcluir'
import type { Produto } from '@/types/produtos'
import { excluirProduto } from './actions'

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; ativo?: string }>
}) {
  const { nome, ativo } = await searchParams

  const params = new URLSearchParams()
  if (nome) params.set('nome', nome)
  if (ativo) params.set('ativo', ativo)

  const res = await apiServerFetch(`/produtos${params.size ? `?${params}` : ''}`)
  if (!res.ok) throw new Error('Falha ao carregar produtos')
  const produtos: Produto[] = await res.json()

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Produtos</h1>
        <Link href="/produtos/novo" className="btn btn-primary">
          Novo produto
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
        <div className="col-md-3">
          <select name="ativo" className="form-select" defaultValue={ativo ?? ''}>
            <option value="">Todos os produtos</option>
            <option value="true">Apenas ativos</option>
            <option value="false">Apenas inativos</option>
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
              <th>SKU</th>
              <th>Nome</th>
              <th>Unidade</th>
              <th className="text-end">Preço</th>
              <th>Situação</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.codigoSku ?? '-'}</td>
                <td>{produto.nome}</td>
                <td>{produto.unidade}</td>
                <td className="text-end">{formatarMoeda(produto.precoUnitario)}</td>
                <td>
                  <span className={`badge ${produto.ativo ? 'bg-success' : 'bg-secondary'}`}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="d-flex gap-2 justify-content-end">
                  <Link href={`/produtos/${produto.id}`} className="btn btn-sm btn-outline-primary">
                    Editar
                  </Link>
                  <BotaoExcluir acao={excluirProduto.bind(null, produto.id)} />
                </td>
              </tr>
            ))}

            {produtos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
