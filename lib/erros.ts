// A API devolve erros no formato { mensagem, codigo, detalhes }. Esse helper
// tenta ler isso e cai num texto padrão se a resposta não vier nesse formato.
export async function mensagemDeErro(res: Response, padrao: string): Promise<string> {
  try {
    const corpo = await res.json()
    if (typeof corpo?.mensagem === 'string') {
      return corpo.mensagem
    }
  } catch {
    // resposta sem corpo JSON, segue com a mensagem padrão
  }
  return padrao
}
