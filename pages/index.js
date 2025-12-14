"use client"
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Testimonial from '../components/Testimonial'; // 1. IMPORTAMOS EL COMPONENTE
import { useEffect, useState } from "react";

export default function GiraPage() {
  const [years, setYears] = useState(Array.from({ length: 12 }, (_, i) => 2025 - i));
  const [movies, setMovies] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleYearClick = async (year) => {
    setSelectedYear(year);
    await fetchDataByYear(year);
  };

  const fetchDataByYear = async (year) => {
    try {
      const res = await fetch(`/api/getDocumentals?year=${year}`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      setMovies(data.movies || []);
      if (data.avaiableYears) setYears(data.avaiableYears);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setMovies([]);
    }
  };
  
  useEffect(() => {
    fetchDataByYear(2024);
  }, []);

  return (
    <div>
      <Head>
        <title>Gira - Ambulante</title>
      </Head>

      <Header />

      <main>
        {/* --- SECCIÓN 1: HERO & CAJA ROSA --- */}
        <section className="hero-section container">
          <h4 className="super-header">Ambulante Gira de Documentales</h4>
          <h1 className="main-title">El festival de cine documental de mayor alcance en México</h1>
          
          <div className="pink-box">
            La Gira es nuestro proyecto más exitoso: el festival de cine documental con mayor alcance en México y un espacio de exhibición único en el mundo. Desde 2005, viaja a lugares que cuentan con poca oferta de cine documental, con el fin de crear una audiencia participativa.
          </div>

          <div className="hero-image-container">
             <img src="https://i.postimg.cc/tCsRTPB8/ambulante1.png" alt="Ambulante Hero" className="hero-img" />
          </div>
        </section>

        {/* --- SECCIÓN 2: PESTAÑAS DE AÑOS --- */}
        <section className="editions-section container">
          <h3>Ediciones anteriores</h3>
          <div className="years-pills">
            {years?.map((year) => (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={`year-pill ${selectedYear === year ? 'active' : ''}`}
              >
                Gira {year}
              </button>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN 3: 20 EDICIÓN (ESTÁTICA/VISUAL) --- */}
        <section className="current-edition-section container">
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>20ª edición</h2>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
             Del 2 de abril al 18 de junio | Ciudad de México, Baja California, Veracruz y Yucatán
          </p>
          <p style={{ color: '#666', maxWidth: '800px', marginBottom: '30px' }}>
          Oleajes se presenta como un concepto que nos permite explorar tanto las fuerzas dinámicas que han moldeado al cine documental durante las últimas dos décadas, como las corrientes actuales que impulsan su futuro. Los oleajes nos invitan a sentir el vaivén entre lo viejo y lo nuevo a través de los movimientos colectivos, las genealogías y las historias que se tejen a través del tiempo.
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
             <button className="btn-black">Conoce el programa →</button>
             <button style={{ padding: '12px 30px', border: '1px solid black', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                Actividades en vivo
             </button>
          </div>

          {/* Grid visual (Poster izq, Video der) */}
          <div className="edition-grid">
             {/* Item Izquierdo: Poster */}
             <div className="poster-card">
                <img src="https://i.postimg.cc/KzTVwGfL/image.webp" alt="Poster" className="poster-img" /> 
                <h3 className="poster-title">Materiales</h3>
             </div>

             {/* Item Derecho: Video y Noticias */}
             <div>
                <div className="video-card" style={{ overflow: 'hidden' }}>
                  {!isPlaying ? (
                    <div onClick={() => setIsPlaying(true)} style={{ cursor: 'pointer', width: '100%', height: '100%', position: 'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <img src="https://img.youtube.com/vi/zjgYRyROiCM/maxresdefault.jpg" alt="Video Cover" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      <div className="play-icon" style={{ zIndex: 10 }}>▶</div>
                      <span style={{ position: 'absolute', bottom: '15px', left: '15px', color: 'white', fontWeight: 'bold', zIndex: 10 }}>Invitados</span>
                    </div>
                  ) : (
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/zjgYRyROiCM?autoplay=1" title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  )}
                </div>
                
                <div className="news-mini-grid">
                   <div className="news-item">
                      <img src="https://i.postimg.cc/mDGfb1PB/image-2.webp" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      <span style={{position:'absolute', bottom:5, left:5, background:'white', padding:'2px 5px', fontSize:'10px', fontWeight:'bold'}}>Clase magistral con Gael García Bernal en Yucatán.</span>
                   </div>
                   <div className="news-item">
                      <img src="https://i.postimg.cc/C10Xyy2Y/image-3.webp" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      <span style={{position:'absolute', bottom:5, left:5, background:'white', padding:'2px 5px', fontSize:'10px', fontWeight:'bold'}}>Rodrigo Guardiola y Ángel Mosqueda, integrantes de Zoé durante la función de Zoé: Panoramas.</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* --- SECCIÓN 4: HISTÓRICO DE PELÍCULAS --- */}
        <section className="history-section">
          <div className="container">
            <h2 style={{ marginBottom: '30px', fontSize: '1.8rem' }}>Histórico de películas programadas</h2>
            
            <div className="movies-mosaic">
              {movies?.length > 0 ? (
                movies.slice(0, 5).map((movie, idx) => (
                  <Link 
                    href={`/masInformacion/${movie.idPelicula}`} 
                    key={movie.idPelicula || idx}
                    className={`movie-card ${idx === 0 ? 'featured' : ''}`}
                  >
                      <img 
                        src={movie.imagen || "/images/placeholder-movie.jpg"} 
                        alt={movie.titulo} 
                        className="movie-bg"
                      />
                      <div className="movie-info-overlay">
                        <h3 style={{ margin: 0, fontSize: idx === 0 ? '1.5rem' : '1rem' }}>{movie.titulo}</h3>
                        <p style={{ margin: '5px 0 0', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>
                          {movie.director}
                        </p>
                        {idx === 0 && (
                           <span style={{ marginTop: '10px', display: 'inline-block', border: '1px solid white', padding: '5px 10px', fontSize: '0.7rem' }}>
                             Ver detalles
                           </span>
                        )}
                      </div>
                  </Link>
                ))
              ) : (
                <p>Cargando o no hay películas...</p>
              )}
              
              {movies?.length > 0 && movies.length < 5 && Array.from({length: 5 - movies.length}).map((_, i) => (
                 <div key={i} className="movie-card" style={{background: '#ddd'}}></div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
               <button className="btn-black">Ver todo el catálogo →</button>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 5: TESTIMONIOS --- */}
        <Testimonial />
              
      </main>
      <Footer />
    </div>
  );
}