// Mostrado automaticamente pelo Next enquanto as páginas async do grupo
// (system) buscam dados no servidor (ex.: dashboard, listagens).
export default function SystemLoading() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
      <p className="text-muted mt-3 mb-0">Carregando...</p>
    </div>
  )
}
