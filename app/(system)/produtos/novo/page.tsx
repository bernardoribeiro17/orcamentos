import ProdutoForm from '../ProdutoForm'
import { criarProduto } from '../actions'

export default function NovoProdutoPage() {
  return (
    <div>
      <h1 className="h3 mb-3">Novo produto</h1>
      <ProdutoForm acao={criarProduto} />
    </div>
  )
}
