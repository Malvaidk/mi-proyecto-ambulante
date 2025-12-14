"use client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
// import withRole from "@/utils/withRole"; <-- ELIMINADO
import Header from "../../components/Header"; 
import Footer from "../../components/Footer"; 
import { PlayCircle } from 'lucide-react'; 

export default function DocumentalPage() { // Ahora exportamos directamente la función
  const router = useRouter();
  const { id } = router.query;

  const [documental, setDocumental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/getDocumentalById?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setDocumental(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>Cargando...</div>;
  if (!documental) return <p>No encontrado</p>;

  return (
    <>
      <Head>
        <title>{documental.titulo} | Ambulante</title>
      </Head>

      <Header />

      <main style={{ paddingTop: '100px', backgroundColor: 'white' }}>
        
        <div className="movie-container">
          
          {/* 1. BREADCRUMBS */}
          <div className="breadcrumbs">
            {/* Cambié el link de "dashboard" a "programacion" o la lista pública para que tenga sentido */}
            <Link href="/programa">← Atrás</Link>
            <span>/</span>
            <Link href="/">Inicio</Link>
            <span>/</span>
            <span>Películas</span>
          </div>

          {/* 2. TÍTULO */}
          <h1 className="movie-title">{documental.titulo}</h1>

          {/* 3. HERO IMAGE */}
          <div className="movie-hero-container">
            <img
              src={documental.url_imagen || "/images/placeholder-wide.jpg"}
              alt={documental.titulo}
              className="movie-hero-img"
            />
          </div>
          
          <div className="trailer-btn-row">
            <PlayCircle size={18} />
            <span>Ver Tráiler</span>
          </div>

          {/* 4. GRID DE CONTENIDO (3 COLUMNAS) */}
          <div className="movie-content-grid">
            
            {/* --- COLUMNA IZQUIERDA: SPECS --- */}
            <aside>
              <div style={{ marginBottom: '20px' }}>
                <span className="label-small">DIRECCIÓN</span>
                <span className="value-text">{documental.director}</span>
              </div>

              {/* Caja Gris */}
              <div className="specs-box">
                <div className="specs-item">
                  <span className="label-small">DURACIÓN</span>
                  <span className="value-text" style={{marginBottom:0}}>{documental.duracion} min</span>
                </div>

                <div className="specs-item" style={{ marginTop: '20px' }}>
                   <span className="label-small">PAÍSES</span>
                   <span className="value-text" style={{marginBottom:0}}>México</span>
                </div>

                <div className="specs-item" style={{ marginTop: '20px' }}>
                   <span className="label-small">AÑO</span>
                   <span className="value-text" style={{marginBottom:0}}>{documental.anio_publicacion}</span>
                </div>

                <div className="specs-item" style={{ marginTop: '20px' }}>
                   <span className="label-small">IDIOMAS</span>
                   <span className="value-text" style={{marginBottom:0}}>{documental.idiomas}</span>
                </div>
              </div>
            </aside>

            {/* --- COLUMNA CENTRAL: INFO --- */}
            <section>
              <h2 className="section-header">Sinopsis</h2>
              <p className="body-text">{documental.sinopsis}</p>

              {documental.semblanza && (
                <>
                  <h2 className="section-header">Semblanza</h2>
                  <p className="body-text">{documental.semblanza}</p>
                </>
              )}

              <h2 className="section-header">Festivales y Premios</h2>
              <div className="laurels-container">
                 {documental.premios_ganados ? (
                    <p>{documental.premios_ganados}</p>
                 ) : (
                    <span>Selección Oficial Ambulante 2025</span>
                 )}
                 <div style={{ width: '100%', height: '1px', backgroundColor: '#eee', marginTop:'20px'}}></div>
              </div>
            </section>

            {/* --- COLUMNA DERECHA: META --- */}
            <aside>
              <div style={{ marginBottom: '40px' }}>
                 <span className="label-small">TEMÁTICAS</span>
                 <span className="meta-tag">
                    {documental.tematicas || "Documental"}
                 </span>
              </div>

              <div style={{ marginBottom: '40px' }}>
                 <span className="label-small">INICIATIVAS</span>
                 <div className="iniciativa-row">
                    <span className="red-dot"></span>
                    <span>{documental.iniciativa || "Gira Ambulante"}</span>
                 </div>
              </div>

              <div>
                 <span className="label-small">DESCARGAS</span>
                 {documental.url_descarga ? (
                   <a href={documental.url_descarga} target="_blank" className="download-link">
                     Ver / Descargar Stills
                   </a>
                 ) : (
                   <span style={{color:'#999', fontSize:'0.9rem'}}>No disponible</span>
                 )}
              </div>
            </aside>

          </div>

          {/* 5. BARRA DE CRÉDITOS */}
          <div className="credits-bar">
             Mostrar Créditos ⌄
          </div>

          {/* 6. RELACIONADO */}
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
             <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Contenido relacionado</h2>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}