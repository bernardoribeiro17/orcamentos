'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { notify } from '@/components/Notify'
import { formatarMoeda } from '@/lib/format'
import { SITUACOES_ORCAMENTO, type Orcamento, type OrcamentoPayload } from '@/types/orcamentos'
import type { Cliente } from '@/types/clientes'
import type { Produto } from '@/types/produtos'

type LinhaItem = {
  chave: number
  produtoId: number
  quantidade: number
  precoUnitario?: number
}

let proximaChave = 1

type AcaoSalvar = (dados: OrcamentoPayload) => Promise<{ error?: string } | undefined>

export default function OrcamentoForm({
  clientes,
  produtos,
  orcamento,
  acao,
}: {
  clientes: Cliente[]
  produtos: Produto[]
  orcamento?: Orcamento
  acao: AcaoSalvar
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [erro, setErro] = useState<string>()

  const [clienteId, setClienteId] = useState(orcamento?.clienteId ?? clientes[0]?.id ?? 0)
  const [situacao, setSituacao] = useState(orcamento?.situacao ?? 'pendente')
  const [valorDesconto, setValorDesconto] = useState(orcamento?.valorDesconto ?? 0)
  const [validoAte, setValidoAte] = useState(orcamento?.validoAte?.slice(0, 10) ?? '')
  const [observacoes, setObservacoes] = useState(orcamento?.observacoes ?? '')

  const [itens, setItens] = useState<LinhaItem[]>(() => {
    if (orcamento?.itens.length) {
      return orcamento.itens.map((item) => ({
        chave: proximaChave++,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitarioRegistro,
      }))
    }
    return [{ chave: proximaChave++, produtoId: produtos[0]?.id ?? 0, quantidade: 1 }]
  })

  const precoDoProduto = useCallback(
    (produtoId: number): number => {
      return produtos.find((p) => p.id === produtoId)?.precoUnitario ?? 0
    },
    [produtos],
  )

  const subtotal = useMemo(() => {
    return itens.reduce((soma, item) => {
      const preco = item.precoUnitario ?? precoDoProduto(item.produtoId)
      return soma + preco * item.quantidade
    }, 0)
  }, [itens, precoDoProduto])

  const total = Math.max(0, subtotal - valorDesconto)

  function adicionarItem() {
    setItens((atual) => [
      ...atual,
      { chave: proximaChave++, produtoId: produtos[0]?.id ?? 0, quantidade: 1 },
    ])
  }

  function removerItem(chave: number) {
    setItens((atual) => atual.filter((item) => item.chave !== chave))
  }

  function atualizarItem(chave: number, campo: keyof LinhaItem, valor: number | undefined) {
    setItens((atual) =>
      atual.map((item) => (item.chave === chave ? { ...item, [campo]: valor } : item)),
    )
  }

  function salvar() {
    setErro(undefined)

    if (!clienteId) {
      setErro('Selecione um cliente.')
      return
    }
    if (itens.length === 0) {
      setErro('Inclua pelo menos um item no orçamento.')
      return
    }
    if (itens.some((item) => !item.produtoId || item.quantidade <= 0)) {
      setErro('Verifique os itens: produto e quantidade são obrigatórios.')
      return
    }

    const payload: OrcamentoPayload = {
      clienteId,
      situacao,
      valorDesconto,
      validoAte: validoAte || undefined,
      observacoes: observacoes || undefined,
      itens: itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    }

    startTransition(async () => {
      const resultado = await acao(payload)
      if (resultado?.error) {
        setErro(resultado.error)
        notify(resultado.error, 'danger')
      }
    })
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        {erro && (
          <div className="alert alert-danger" role="alert">
            {erro}
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Cliente *</label>
            <select
              className="form-select"
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
            >
              <option value={0} disabled>
                Selecione...
              </option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Situação</label>
            <select
              className="form-select"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value as typeof situacao)}
            >
              {SITUACOES_ORCAMENTO.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Desconto (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              value={valorDesconto}
              onChange={(e) => setValorDesconto(Number(e.target.value))}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Válido até</label>
            <input
              type="date"
              className="form-control"
              value={validoAte}
              onChange={(e) => setValidoAte(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Observações</label>
            <textarea
              className="form-control"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h6 mb-0">Itens do orçamento</h2>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={adicionarItem}>
            + Adicionar item
          </button>
        </div>

        <div className="table-responsive mb-3">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Produto</th>
                <th style={{ width: '120px' }}>Quantidade</th>
                <th style={{ width: '160px' }}>Preço unitário</th>
                <th className="text-end" style={{ width: '140px' }}>
                  Total
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => {
                const preco = item.precoUnitario ?? precoDoProduto(item.produtoId)
                return (
                  <tr key={item.chave}>
                    <td>
                      <select
                        className="form-select"
                        value={item.produtoId}
                        onChange={(e) => atualizarItem(item.chave, 'produtoId', Number(e.target.value))}
                      >
                        {produtos.map((produto) => (
                          <option key={produto.id} value={produto.id}>
                            {produto.nome}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0.0001"
                        step="0.0001"
                        className="form-control"
                        value={item.quantidade}
                        onChange={(e) =>
                          atualizarItem(item.chave, 'quantidade', Number(e.target.value))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        placeholder={formatarMoeda(precoDoProduto(item.produtoId))}
                        value={item.precoUnitario ?? ''}
                        onChange={(e) =>
                          atualizarItem(
                            item.chave,
                            'precoUnitario',
                            e.target.value === '' ? undefined : Number(e.target.value),
                          )
                        }
                      />
                    </td>
                    <td className="text-end">{formatarMoeda(preco * item.quantidade)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removerItem(item.chave)}
                        disabled={itens.length === 1}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mb-4">
          <div style={{ minWidth: '260px' }}>
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{formatarMoeda(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Desconto</span>
              <span>- {formatarMoeda(valorDesconto)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold border-top mt-1 pt-1">
              <span>Total</span>
              <span>{formatarMoeda(total)}</span>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary" onClick={salvar} disabled={pending}>
            {pending ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => router.push('/orcamentos')}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
