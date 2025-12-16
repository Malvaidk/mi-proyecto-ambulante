"use client"
import { useRouter } from "next/router";
import withRole from '@/utils/withRole';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useEffect, useState } from "react";

import styles from './Dashboard.module.css';

function Dashboard() { 
  const router = useRouter();
  
  // Estados de Películas (Existentes)
  const [movies, setMovies] = useState([]);
  const [years, setYears] = useState([]); 
  
  // --- NUEVOS ESTADOS PARA REPORTES ---
  const [reportType, setReportType] = useState('tematica'); 
  const [reportValue, setReportValue] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const handleAddtittle = () => {
     router.push("/dashboard/addTittle"); 
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
        return;
      }
      
      setMovies(data.movies);
      if(years.length === 0 && data.availableYears){
        setYears(data.availableYears);
      }
      
    } catch (error) {
      console.log("Error al obtener datos:", error);
    }
  };
  
  useEffect(() => {
    fetch(`/api/getDocumentals`) 
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setYears(data.availableYears || []);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // --- LÓGICA PARA GENERAR REPORTES ---
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!reportValue) return alert("Por favor ingresa un valor para buscar.");

    setLoadingReport(true);
    setReportData([]);

    try {
      const res = await fetch(`/api/reports?tipo=${reportType}&valor=${reportValue}`);
      const data = await res.json();

      if (res.ok) {
        if (data.length === 0) alert("No se encontraron resultados.");
        setReportData(data);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error reporte:", error);
      alert("Error de conexión al generar reporte.");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
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

        {/* --- NUEVA SECCIÓN: REPORTES AVANZADOS (Stored Procedures) --- */}
        <section className={styles.reportSection}>
          <h3 className={styles.sectionTitle}>Reportes y Estadísticas</h3>
          
          <div className={styles.reportCard}>
            <form onSubmit={handleGenerateReport} className={styles.reportForm}>
              
              <div className={styles.formGroup}>
                <label>Tipo de Reporte:</label>
                <select 
                  value={reportType} 
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setReportData([]); 
                    setReportValue('');
                  }}
                  className={styles.reportSelect}
                >
                  <option value="tematica">Conteo por Temática</option>
                  <option value="edicion">Películas por Num. Edición</option>
                  <option value="director">Duración Total Director (CURP)</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{flex: 1}}>
                <label>
                  {reportType === 'tematica' && "Nombre de la Temática (ej. Justicia):"}
                  {reportType === 'edicion' && "Número de Edición (ej. 14, 18):"}
                  {reportType === 'director' && "CURP del Director:"}
                </label>
                <input 
                  type={reportType === 'edicion' ? "number" : "text"}
                  className={styles.reportInput}
                  value={reportValue}
                  onChange={(e) => setReportValue(e.target.value)}
                  placeholder={reportType === 'director' ? 'Ej: MOOV98...' : 'Ingresa valor...'}
                />
              </div>

              <button type="submit" className={styles.reportBtn} disabled={loadingReport}>
                {loadingReport ? "Generando..." : "Generar Reporte"}
              </button>
            </form>

            {/* TABLA DE RESULTADOS DEL REPORTE */}
            {reportData.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      {/* Generamos encabezados dinámicos basados en los datos */}
                      {Object.keys(reportData[0]).map((key) => (
                        <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, i) => (
                          <td key={i}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Ediciones anteriores */}
        <section className={styles.editionsList}>
          <h3 className={styles.sectionTitle}>Filtrar por Edición (Año)</h3>
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

        {/* Histórico de películas */}
        <section className={styles.moviesHistory}>
          <h3 className={styles.sectionTitle}>Documentales Programados</h3>
          
          <div className={styles.moviesGrid}>
            
            {/* Tarjeta Agregar Nuevo */}
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