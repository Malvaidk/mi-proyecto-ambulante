import Link from 'next/link';

const menuItems = [
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Programas', href: '/programas' },
  { name: 'Calendario', href: '/calendario' },
  { name: 'Películas', href: '/peliculas' },
  { name: 'Blog', href: '/blog' },
  { name: 'Aliados', href: '/aliados' },
];

export default function Header() {
  return (
    <header className="header-container">
      <div className="nav-wrapper">
        
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <span className="logo-text">Ambulante</span>
          </Link>
        </div>

        {/* Menú */}
        <nav className="main-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Idioma */}
        <div className="language-selector">
          <Link href="?locale=en-US">
            <span className="lang-link">EN</span>
          </Link>
          <span className="lang-active">ES</span>
        </div>
      </div>
    </header>
  );
}