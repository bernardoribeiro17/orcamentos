import ClienteForm from '../ClienteForm'
import { criarCliente } from '../actions'

export default function NovoClientePage() {
  return (
    <div>
      <h1 className="h3 mb-3">Novo cliente</h1>
      <ClienteForm acao={criarCliente} />
    </div>
  )
}
