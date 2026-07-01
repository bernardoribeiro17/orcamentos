import Header from '@/components/Header'
import Navegacao from '@/components/Navegacao'
import Footer from '@/components/Footer'

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navegacao />
      <main className="system-main container py-4">{children}</main>
      <Footer />
    </div>
  );
}
