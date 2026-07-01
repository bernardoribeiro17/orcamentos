import Image from 'next/image'

export default function Header() {
  return (
    <header className="system-header text-white py-2">
      <div className="container d-flex align-items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <span className="fw-semibold">SENAC Orçamentos</span>
      </div>
    </header>
  )
}
