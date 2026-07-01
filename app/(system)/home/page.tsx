import Link from 'next/link'

export default function Home() {
	return (
		<div>
			<h1 className="h3 mb-2">Olá!</h1>
			<p className="text-muted">
				Bem-vindo ao sistema de orçamentos. Use o menu acima para gerenciar
				produtos, clientes e orçamentos, ou veja o resumo no{' '}
				<Link href="/dashboard">dashboard</Link>.
			</p>
		</div>
	)
}
