import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Ambulante</h1>
        <p className="subtitle">
          Apoyamos el cine documental como un dispositivo de transformación social.
        </p>
        
        <Link href="/nosotros">
          <button className="read-more-button">Leer más</button>
        </Link>
      </div>
      
    </section>
  );
}