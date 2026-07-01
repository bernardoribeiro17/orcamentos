'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import type { Cliente } from '@/types/clientes'
import type { ClienteActionState } from './actions'

type AcaoCliente = (
  prevState: ClienteActionState | undefined,
  formData: FormData,
) => Promise<ClienteActionState>

export default function ClienteForm({
  cliente,
  acao,
}: {
  cliente?: Cliente
  acao: AcaoCliente
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
              defaultValue={cliente?.nome}
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="documento" className="form-label">
              Documento
            </label>
            <input
              id="documento"
              name="documento"
              type="text"
              className="form-control"
              placeholder="CPF ou CNPJ"
              defaultValue={cliente?.documento ?? ''}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="telefone" className="form-label">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="text"
              className="form-control"
              defaultValue={cliente?.telefone ?? ''}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              defaultValue={cliente?.email ?? ''}
            />
          </div>

          <div className="col-12">
            <label htmlFor="observacoes" className="form-label">
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              className="form-control"
              rows={3}
              defaultValue={cliente?.observacoes ?? ''}
            />
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <Link href="/clientes" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  )
}
