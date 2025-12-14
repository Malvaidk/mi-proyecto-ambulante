"use client"
import { useRouter } from "next/router";
import withRole from '@/utils/withRole';
// import Head from 'next/head'; // Opcional si lo usas
import Link from 'next/link';
// import Header from '@/components/Header'; // Descomenta si tienes el componente
import Footer from '@/components/Footer';
import { useEffect, useState } from "react";

// Importamos los estilos
import styles from './Dashboard.module.css';

function Dashboard() { // Cambié a mayúscula "Dashboard" (convención React)
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [years, setYears] = useState([]); // Corregido let -> const

  const handleAddtittle = () => {
     router.push("/dashboard/addTittle"); // Asegúrate que esta ruta es correcta según tus carpetas
  }

  const handleYearClick = async (year) => {
    console.log("Año seleccionado:", year);
    fetchDataByYear(year);
  };

  const fetchDataByYear = async (year) => {
    try {
      const res = await fetch(`/api/getDocumentals?year=${year}`);
      const data = await res.json()
    
      if(!data.movies || data.movies.length === 0){
        setMovies([]);
        // setYears([...years]); // No es necesario resetear years aquí si ya existen
        return;
      }
      
      console.log("Datos recibidos:", data);
      setMovies(data.movies);
      
      // Solo actualizamos los años si están vacíos al principio
      if(years.length === 0 && data.availableYears){
        setYears(data.availableYears);
      }
      
    } catch (error) {
      console.log("Error al obtener datos:", error);
    }
  };
  
  useEffect(() => {
    // Carga inicial (quizás quieras pasarle el año actual o dejarlo vacío para traer todo)
    fetch(`/api/getDocumentals`) 
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setYears(data.availableYears || []);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);
  

  return (
    <div className={styles.pageWrapper}>
      {/* <Header />  <-- Descomenta si quieres que se vea el header */}

      <main className={styles.mainContent}>
        
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span className={styles.backLink} onClick={() => router.push('/')}>← Inicio</span>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>Dashboard Administrativo</span>
        </div>

        {/* Intro */}
        <section className={styles.giraIntro}>
          <h4 className={styles.superHeader}>Gestión de Contenido</h4>
          <h1 className={styles.mainTitle}>Gira de Documentales</h1>
        </section>

        {/* Ediciones anteriores (Botones de años) */}
        <section className={styles.editionsList}>
          <h3 className={styles.sectionTitle}>Filtrar por Edición</h3>
          <div className={styles.yearsGrid}>
            {years.length > 0 ? years.map((year) => (
              <div
                key={year}
                className={styles.yearCard}
                onClick={() => handleYearClick(year)}
              >
                <span>Gira {year}</span>
                <span className={styles.arrowIcon}>↗</span>
              </div>
            )) : <p>Cargando ediciones...</p>}
          </div>
        </section>

        {/* Histórico de películas (Grid) */}
        <section className={styles.moviesHistory}>
          <h3 className={styles.sectionTitle}>Documentales Programados</h3>
          
          <div className={styles.moviesGrid}>
            
            {/* Tarjeta Especial: Agregar Nuevo */}
            <div 
              className={`${styles.movieCard} ${styles.addCard}`} 
              onClick={handleAddtittle}
            >
              <div className={styles.plusIcon}>+</div>
              <div className={styles.addText}>Agregar Nueva Película</div>
            </div>

            {/* Lista de Películas */}
            {movies.map((movie, idx) => (
              <div key={idx} className={styles.movieCard}>
                <Link href={`/dashboard/documentales/${movie.idPelicula}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Poster (Si tienes URL de imagen úsala, si no, placeholder) */}
                  {movie.imagen ? (
                    <div 
                        className={styles.posterPlaceholder} 
                        style={{ 
                            backgroundImage: `url(${movie.imagen})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}
                    />
                  ) : (
                    <div className={styles.posterPlaceholder}>
                        <span style={{color: '#888'}}>Sin Imagen</span>
                    </div>
                  )}

                  <div className={styles.movieDetails}>
                    <h4 className={styles.movieTitle}>{movie.titulo}</h4>
                    <p className={styles.director}>{movie.director}</p>
                    
                    <div style={{marginTop: 'auto'}}>
                        <p className={styles.meta}>📅 {movie.anioPub} | ⏱ {movie.duracion} min</p>
                        <div className={styles.linkDetails}>Editar / Detalles →</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.centerButton}>
             <button className={styles.btnTransparent} onClick={() => fetchDataByYear('')}>Ver todo el catálogo</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default withRole(Dashboard, ["admin_documentales"]);