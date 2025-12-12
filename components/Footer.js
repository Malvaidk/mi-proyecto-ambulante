import Link from 'next/link';

const footerLinks = [
  { 
    title: 'PARA TI', 
    links: [
      { name: 'Películas', href: '/peliculas' }, 
      { name: 'Calendario', href: '/calendario' }, 
      { name: 'Centro de prensa', href: '/prensa' }
    ] 
  },
  { 
    title: 'PROGRAMAS', 
    links: [
      { name: 'Gira Ambulante', href: '/gira' }, 
      { name: 'Ambulante Más Allá', href: '/mas-alla' }, 
      { name: 'Ambulante Presenta', href: '/presenta' },
      { name: 'Ambulante Ediciones', href: '/ediciones' },
      { name: 'Vivero', href: '/vivero' }
    ] 
  },
  { 
    title: 'INFORMACIÓN', 
    links: [
      { name: 'Directorio', href: '/directorio' }, 
      { name: 'Aviso de Privacidad', href: '/aviso-privacidad' }, 
      { name: 'Contraloría Social', href: '/contraloria' },
      { name: 'Vacantes', href: '/vacantes' }
    ] 
  },
];

export default function Footer() {
  return (
    <footer className="footer-container">
      
      <div className="footer-top-content">
        
        {/* Columnas de enlaces */}
        <div className="footer-links-grid">
          {footerLinks.map((col) => (
            <div key={col.title} className="footer-column">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Contacto y Newsletter */}
        <div className="footer-contact-newsletter">
          <h4>Contáctanos</h4>
          <p>hola@ambulante.org</p>
          <p>+52 (55) 5511 5073</p>
          <p className="address">
            Zacatecas 142-A, Roma Norte, Cuauhtémoc, C.P. 06700, Ciudad de México
          </p>
          
          <div className="newsletter-form">
            <input type="email" placeholder="Suscríbete al newsletter" />
            <button type="submit">&gt;</button>
          </div>
        </div>
        
      </div>

      <div className="footer-bottom-bar">
        <p>© 2024 Ambulante. Todos los derechos reservados</p>
        <p><Link href="/cookies">Manejo de Cookies</Link></p>
      </div>
    </footer>
  );
}