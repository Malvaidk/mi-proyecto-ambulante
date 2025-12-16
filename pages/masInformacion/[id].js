import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header"; 
import Footer from "../../components/Footer"; 
import { PlayCircle } from 'lucide-react'; 

export default function DocumentalPage() {
  const router = useRouter();
  const { id } = router.query;

  const [documental, setDocumental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setDocumental(null);
        console.log(id);
        const res = await fetch(`/api/getDocumentalById?id=${id}`);
      
        if (!res.ok) {
           throw new Error("Error al obtener datos");
        }

        const data = await res.json();
        setDocumental(data);

      } catch (err) {
        console.error("Error fetching documental:", err);
        setDocumental(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  if (loading) return (
    <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      Cargando...
    </div>
  );
  
  if (!documental) return (
    <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
      <h1>Documental no encontrado</h1>
      <Link href="/" style={{marginTop: '20px', textDecoration:'underline'}}>Volver al inicio</Link>
    </div>
  );

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
              src={documental.imagen || "/images/placeholder-wide.jpg"}
              alt={documental.titulo}
              className="movie-hero-img"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "/images/placeholder-wide.jpg"; 
              }}
            />
          </div>
          
          {/* Botón de Trailer */}
          <div className="trailer-btn-row">
            {documental.url_descarga ? (
              <a href={documental.url_descarga} target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', gap:'8px', textDecoration:'none', color:'inherit'}}>
                <PlayCircle size={18} />
                <span>Ver Tráiler</span>
              </a>
            ) : (
              <span style={{opacity:0.5, display:'flex', alignItems:'center', gap:'8px'}}>
                 <PlayCircle size={18} /> Sin Tráiler
              </span>
            )}
          </div>

          {/* 4. GRID DE CONTENIDO */}
          <div className="movie-content-grid">
            
            {/* --- COLUMNA IZQUIERDA --- */}
            <aside>
              <div style={{ marginBottom: '20px' }}>
                <span className="label-small">DIRECCIÓN</span>
                <span className="value-text">{documental.director}</span>
              </div>

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

            {/* --- COLUMNA CENTRAL --- */}
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

            {/* --- COLUMNA DERECHA --- */}
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
                 <span className="label-small">ENLACES</span>
                 {documental.url_descarga ? (
                   <a href={documental.url_descarga} target="_blank" rel="noopener noreferrer" className="download-link">
                     Ver Material / Video
                   </a>
                 ) : (
                   <span style={{color:'#999', fontSize:'0.9rem'}}>No disponible</span>
                 )}
              </div>
            </aside>

          </div>

          <div className="credits-bar">
             Mostrar Créditos ⌄
          </div>

          <div style={{ padding: '60px 0', textAlign: 'center' }}>
             <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Contenido relacionado</h2>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}