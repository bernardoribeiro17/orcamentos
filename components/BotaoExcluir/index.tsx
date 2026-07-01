'use client'

type AcaoExcluir = () => void | Promise<void>

export default function BotaoExcluir({
  acao,
  mensagem = 'Tem certeza que deseja excluir?',
}: {
  acao: AcaoExcluir
  mensagem?: string
}) {
  return (
    <form
      action={acao}
      onSubmit={(evento) => {
        if (!confirm(mensagem)) {
          evento.preventDefault()
        }
      }}
    >
      <button type="submit" className="btn btn-sm btn-outline-danger">
        Excluir
      </button>
    </form>
  )
}
