import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GiraPage() {
  // Datos simulados para las ediciones pasadas
  const years = Array.from({ length: 12 }, (_, i) => 2025 - i); 

  // Datos simulados para las películas
  const movies = [
    { title: "Apolonia, Apolonia", director: "Lea Glob", year: "2022", country: "Dinamarca, Polonia..." },
    { title: "Familia de medianoche", director: "Luke Lorentzen", year: "2018", country: "Estados Unidos, México" },
    { title: "Nothing Compares", director: "Kathryn Ferguson", year: "2022", country: "Irlanda, Reino Unido" },
    { title: "Tempestad", director: "Tatiana Huezo", year: "2016", country: "México" },
  ];

  return (
    <div className="page-wrapper">
      <Head>
        <title>Gira - Ambulante</title>
      </Head>

      <Header />

      <main className="main-content">
        {/* Navegación tipo "Miga de pan" */}
        <div className="breadcrumb">
          <span className="back-link">← Atras Programas</span>
          <span className="separator">/</span>
          <span className="current">Gira de Documentales</span>
        </div>

        {/* Sección Hero: Título y Texto a dos columnas */}
        <section className="gira-intro">
          <h4 className="super-header">Ambulante Gira de Documentales</h4>
          <h1 className="main-title">El festival de cine documental de mayor alcance en México</h1>
          
          <div className="intro-text-columns">
            <p>
              La Gira es nuestro proyecto más icónico, el festival de cine documental con mayor alcance en México y un espacio de exhibición itinerante único en el mundo. En cada edición viajamos por diferentes estados del país con un programa de películas que recoge lo más relevante del documental nacional e internacional.
            </p>
            <p>
              A lo largo de veinte años, la Gira ha recorrido miles de kilómetros de nuestro territorio con una intención central: crear un encuentro emocionante y significativo entre el cine documental y su público a través de proyecciones, mediaciones, conversatorios, sesiones de preguntas y respuestas con los realizadores, talleres, clases magistrales y ¡mucho más!
            </p>
          </div>
        </section>

        {/* Grid de Ediciones Anteriores */}
        <section className="editions-list">
          <h3>Ediciones anteriores</h3>
          <div className="years-grid">
            {years.map((year) => (
              <div key={year} className="year-card">
                <span>Gira {year}</span>
                <span className="arrow-icon">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sección Destacada: Edición Actual (Fondo gris) */}
        <section className="current-edition">
          <div className="edition-info">
            <h2>20ª edición</h2>
            <p className="dates">Del 2 de abril al 15 de junio | Ciudad de México, Baja California, Querétaro, Veracruz y Yucatán</p>
            <p className="edition-desc">
              Oleajes se presenta como un concepto que nos permite explorar tanto las fuerzas dinámicas que han moldeado al cine documental durante las últimas dos décadas, como las corrientes actuales que impulsan su futuro.
            </p>
            <div className="action-buttons">
              <button className="btn-transparent">Descargar programas</button>
              <button className="btn-transparent">Ver catálogo de películas</button>
            </div>
          </div>
        </section>

        {/* Histórico de Películas */}
        <section className="movies-history">
          <h3>Histórico de películas programadas</h3>
          <div className="movies-grid">
            {movies.map((movie, idx) => (
              <div key={idx} className="movie-card">
                <div className="movie-poster-placeholder"></div>
                <div className="movie-details">
                  <h4>{movie.title}</h4>
                  <p className="director">{movie.director}</p>
                  <p className="meta">{movie.year}</p>
                  <p className="meta">{movie.country}</p>
                  <span className="link-details">Ver detalles</span>
                </div>
              </div>
            ))}
          </div>
          <div className="center-button">
             <button className="btn-transparent">Ver todo el catálogo</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}