export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export function formatarData(data: string | Date | null | undefined): string {
  if (!data) return '-'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(data))
}

export function formatarDataHora(data: string | Date | null | undefined): string {
  if (!data) return '-'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(data),
  )
}
