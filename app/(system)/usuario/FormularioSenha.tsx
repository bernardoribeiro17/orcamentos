'use client'

import { useActionState, useEffect, useRef } from 'react'
import { notify } from '@/components/Notify'
import { redefinirSenha } from './actions'

export default function FormularioSenha() {
  const [state, formAction] = useActionState(redefinirSenha, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.sucesso) {
      notify(state.sucesso)
      formRef.current?.reset()
    }
    if (state?.error) notify(state.error, 'danger')
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Alterar senha</h2>

        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="senhaAtual" className="form-label">
              Senha atual
            </label>
            <input
              id="senhaAtual"
              name="senhaAtual"
              type="password"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="novaSenha" className="form-label">
              Nova senha
            </label>
            <input
              id="novaSenha"
              name="novaSenha"
              type="password"
              className="form-control"
              minLength={6}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="confirmarSenha" className="form-label">
              Confirmar nova senha
            </label>
            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              className="form-control"
              minLength={6}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Alterar senha
        </button>
      </div>
    </form>
  )
}
