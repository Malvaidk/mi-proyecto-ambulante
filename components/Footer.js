import Link from 'next/link';
import { ArrowRight, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* TOP SECTION: 4 COLUMNAS */}
        <div className="footer-top">
          
          <div className="footer-col">
            <h5>Sobre</h5>
            <ul>
              <li><Link href="#">Festival</Link></li>
              <li><Link href="#">Ambulante Más Allá</Link></li>
              <li><Link href="#">Ambulante Presenta</Link></li>
              <li><Link href="#">Colaboradores</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Voluntarios</h5>
            <ul>
              <li><Link href="#">Ambulante Gira 2025</Link></li>
              <li><Link href="#">Ambulante Abierto</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Información</h5>
            <ul>
              <li><Link href="#">Noticias</Link></li>
              <li><Link href="#">Aviso de Privacidad</Link></li>
              <li><Link href="#">Términos de Uso</Link></li>
              <li><Link href="#">Prensa</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contáctanos</h5>
            <p>Suscríbete al boletín</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Ingresa tu correo" className="newsletter-input" />
              <ArrowRight size={16} color="black" />
            </div>
            <span className="phone-number">+52 (55) 5555 5555</span>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="footer-bottom">
          <div className="header-logo" style={{ fontSize: '1.2rem' }}>AMBULANTE</div>
          
          <div>
            <div className="social-icons">
               <Instagram size={18} color="black" />
               <Twitter size={18} color="black" />
               <Facebook size={18} color="black" />
               <Youtube size={18} color="black" />
            </div>
            <p className="address-text">ESCOM IPN</p>
          </div>
        </div>

      </div>
    </footer>
  );
}