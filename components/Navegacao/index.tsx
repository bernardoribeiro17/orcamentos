'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(auth)/logout/actions'

const LINKS = [
  { href: '/home', label: 'Início' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/orcamentos', label: 'Orçamentos' },
  { href: '/usuario', label: 'Meu perfil' },
]

export default function Navegacao() {
  const pathname = usePathname()

  return (
    <nav className="system-nav">
      <div className="container d-flex align-items-center justify-content-between flex-wrap py-2">
        <ul className="nav">
          {LINKS.map((link) => {
            const ativo = pathname?.startsWith(link.href)
            return (
              <li key={link.href} className="nav-item">
                <Link href={link.href} className={`nav-link ${ativo ? 'ativo' : ''}`}>
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <form action={logout}>
          <button type="submit" className="btn btn-outline-secondary btn-sm">
            Sair
          </button>
        </form>
      </div>
    </nav>
  )
}
