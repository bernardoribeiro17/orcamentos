'use client'

// Error boundary do grupo (system). Captura falhas das páginas internas
// (ex.: API fora do ar, erro de rede) sem derrubar o layout global —
// o usuário continua vendo cabeçalho, menu e rodapé, só o conteúdo muda.
import { useEffect } from 'react'

export default function SystemError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
      <div className="mb-3" style={{ fontSize: '2.5rem' }}>
        ⚠️
      </div>
      <h1 className="h4 mb-2">Não foi possível carregar esta página</h1>
      <p className="text-muted mb-4" style={{ maxWidth: '420px' }}>
        Houve um problema ao buscar os dados no servidor. Verifique sua conexão ou tente
        novamente em instantes.
      </p>
      <button type="button" className="btn btn-primary" onClick={() => reset()}>
        Tentar novamente
      </button>
    </div>
  )
}
