'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type LoginActionState = {
  error?: string
}

export async function login(
  _prevState: LoginActionState | undefined,
  formData: FormData,
): Promise<LoginActionState> {
  const emailRaw = formData.get('email')
  const senhaRaw = formData.get('password')

  if (typeof emailRaw !== 'string' || typeof senhaRaw !== 'string') {
    return { error: 'Dados do formulário inválidos.' }
  }

  const email = emailRaw.trim()
  const senha = senhaRaw

  if (!email || !senha) {
    return { error: 'Preencha email e senha.' }
  }

  const backendApiUrl = process.env.BACKEND_API_URL

  let response: Response
  try {
    response = await fetch(`${backendApiUrl}/autenticacao/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
  } catch {
    // API fora do ar, DNS falhou, etc. — não deixa a exceção estourar pro usuário.
    return { error: 'Não foi possível conectar ao servidor. Tente novamente em instantes.' }
  }

  if (!response.ok) {
    return { error: 'Credenciais inválidas' }
  }

  let data: { accessToken?: string }
  try {
    data = await response.json()
  } catch {
    return { error: 'Resposta inválida do servidor.' }
  }

  if (!data.accessToken) {
    return { error: 'Resposta inválida do servidor.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('jwt-token', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  redirect('/home')
}
