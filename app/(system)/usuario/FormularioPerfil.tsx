'use client'

import { useActionState, useEffect } from 'react'
import { notify } from '@/components/Notify'
import type { Usuario } from '@/types/usuario'
import { atualizarPerfil } from './actions'

export default function FormularioPerfil({ usuario }: { usuario: Usuario }) {
  const [state, formAction] = useActionState(atualizarPerfil, undefined)

  useEffect(() => {
    if (state?.sucesso) notify(state.sucesso)
    if (state?.error) notify(state.error, 'danger')
  }, [state])

  return (
    <form action={formAction} className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Dados do perfil</h2>

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nomeCompleto" className="form-label">
              Nome completo
            </label>
            <input
              id="nomeCompleto"
              name="nomeCompleto"
              type="text"
              className="form-control"
              defaultValue={usuario.nomeCompleto}
              required
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
              defaultValue={usuario.email}
              required
            />
          </div>
        </div>

        <p className="text-muted small mt-3 mb-0">
          Perfil de acesso: <strong>{usuario.perfil}</strong>
        </p>

        <button type="submit" className="btn btn-primary mt-3">
          Salvar alterações
        </button>
      </div>
    </form>
  )
}
