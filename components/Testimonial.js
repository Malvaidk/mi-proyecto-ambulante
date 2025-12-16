import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      quote: "Mi amor por el cine fue lo que me llevó a ese teatro donde vivía Apolonia.",
      author: "Viveros Alvarado Bryan Dalziel",
      role: "Director de Audiencias"
    },
    {
      id: 2,
      quote: "El documental es una ventana necesaria a realidades que, de otro modo, permanecerían invisibles para nosotros.",
      author: "Malvaez Sánchez Diego",
      role: "Coordinador de Producción"
    },
    {
      id: 3,
      quote: "Cada historia proyectada en Ambulante resuena como un eco poderoso de nuestras propias búsquedas y esperanzas.",
      author: "Castillo Suriano Cindy Karen",
      role: "Gestora Cultural"
    },
    {
      id: 4,
      quote: "Descubrir nuevas narrativas me ha permitido reconectar con la esencia humana más profunda y empática.",
      author: "Montes Martinez William Emir",
      role: "Voluntario Senior"
    },
    {
      id: 5,
      quote: "La gira no solo lleva cine, lleva conversaciones urgentes que tienen el poder de transformar comunidades enteras.",
      author: "Rebolledo Dominguez Arturo",
      role: "Programador Invitado"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="testimonial-grid">
          
          {/* Columna Izquierda: Título y Navegación */}
          <div className="testimonial-title-col">
            <h2 className="testimonial-title">
              Un encuentro<br />
              emocionante<br />
              y significativo
            </h2>
            <div className="testimonial-nav">
              <button onClick={prevTestimonial} className="nav-btn">
                <ArrowLeft size={28} />
              </button>
              <button onClick={nextTestimonial} className="nav-btn">
                <ArrowRight size={28} />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Cita y Autor Dinámicos */}
          <div className="testimonial-quote-col fade-in">
            <span className="quote-mark">“</span>
            
            <p className="testimonial-quote" style={{minHeight: '120px'}}>
              {current.quote}
            </p>
            
            <div className="author-info">
              <div className="author-avatar">
                <User size={40} color="#999" /> 
              </div>
              <div className="author-details">
                <h5>@{current.author}</h5>
                <p>{current.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Puntos de Paginación Dinámicos */}
        <div className="testimonial-pagination">
          {testimonials.map((_, index) => (
            <div 
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
}