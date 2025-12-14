import Link from 'next/link';
import { Search, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        
        {/* LOGO */}
        <Link href="/" className="header-logo">
          AMBULANTE
        </Link>

        {/* NAVEGACIÓN CENTRAL */}
        <nav className="header-nav">
          <Link href="/festival" className="nav-link">Festival</Link>
          {/* Este tiene la clase especial para el fondo negro */}
          <Link href="/programa" className="nav-link active-btn">Programa</Link> 
          <Link href="/contenido" className="nav-link">Contenido</Link>
          <Link href="/prensa" className="nav-link">Prensa</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/aliados" className="nav-link">Aliados</Link>
        </nav>

        {/* UTILIDADES (DERECHA) */}
        <div className="header-utils">
          <div className="lang-selector">
            <Globe size={14} />
            <span>Español</span>
          </div>
          <Search size={16} className="search-icon" />
        </div>

      </div>
    </header>
  );
}