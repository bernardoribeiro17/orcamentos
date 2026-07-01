'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import type { Produto } from '@/types/produtos'
import type { ProdutoActionState } from './actions'

type AcaoProduto = (
  prevState: ProdutoActionState | undefined,
  formData: FormData,
) => Promise<ProdutoActionState>

export default function ProdutoForm({
  produto,
  acao,
}: {
  produto?: Produto
  acao: AcaoProduto
}) {
  const [state, formAction] = useActionState(acao, undefined)

  return (
    <form action={formAction} className="card shadow-sm border-0">
      <div className="card-body p-4">
        {state?.error && (
          <div className="alert alert-danger" role="alert">
            {state.error}
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">
              Nome *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              className="form-control"
              defaultValue={produto?.nome}
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="codigoSku" className="form-label">
              Código SKU
            </label>
            <input
              id="codigoSku"
              name="codigoSku"
              type="text"
              className="form-control"
              defaultValue={produto?.codigoSku ?? ''}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="unidade" className="form-label">
              Unidade
            </label>
            <input
              id="unidade"
              name="unidade"
              type="text"
              className="form-control"
              placeholder="UN"
              defaultValue={produto?.unidade}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="precoUnitario" className="form-label">
              Preço unitário *
            </label>
            <input
              id="precoUnitario"
              name="precoUnitario"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              defaultValue={produto?.precoUnitario}
              required
            />
          </div>

          <div className="col-md-8">
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <input
              id="descricao"
              name="descricao"
              type="text"
              className="form-control"
              defaultValue={produto?.descricao ?? ''}
            />
          </div>

          <div className="col-12 form-check ms-1">
            <input
              id="ativo"
              name="ativo"
              type="checkbox"
              className="form-check-input"
              defaultChecked={produto?.ativo ?? true}
            />
            <label htmlFor="ativo" className="form-check-label">
              Produto ativo
            </label>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <Link href="/produtos" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  )
}
