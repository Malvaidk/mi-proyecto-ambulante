import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header"; 
import Footer from "../../components/Footer"; 
import { PlayCircle, ChevronDown, ChevronUp } from 'lucide-react'; 

export default function DocumentalPage() {
  const router = useRouter();
  const { id } = router.query;

  const [documental, setDocumental] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/getDocumentalById?id=${id}`);
        if (!res.ok) throw new Error("Error al obtener datos");
        const data = await res.json();
        setDocumental(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const parseCreditos = (creditosStr) => {
    if (!creditosStr) return [];
    return creditosStr.split('|||').map((item, index) => {
        const [rol, nombre] = item.split(':::');
        return { rol: rol?.toUpperCase(), nombre, id: index };
    });
  };

  if (loading) return <div style={{height: '100vh', display:'grid', placeItems:'center'}}>Cargando...</div>;
  if (!documental) return <div>No encontrado</div>;

  const listaCreditos = parseCreditos(documental.lista_creditos);

  return (
    <>
      <Head><title>{documental.titulo} | Ambulante</title></Head>
      <Header />

      <main style={{ paddingTop: '100px', backgroundColor: 'white' }}>
        <div className="movie-container">
          
          {/* Breadcrumbs y Título */}
          <div className="breadcrumbs">
            <Link href="/programa">← Atrás</Link><span>/</span><Link href="/">Inicio</Link><span>/</span><span>Películas</span>
          </div>
          <h1 className="movie-title">{documental.titulo}</h1>

          {/* Imagen Hero */}
          <div className="movie-hero-container">
            <img src={documental.imagen || "/images/placeholder-wide.jpg"} alt={documental.titulo} className="movie-hero-img" onError={(e)=>{e.target.src="/images/placeholder-wide.jpg"}} />
          </div>
          
          {/* Botón Trailer */}
          <div className="trailer-btn-row">
            {documental.url_trailer && (
              <a href={documental.url_trailer} target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', gap:'8px', textDecoration:'none', color:'inherit'}}>
                <PlayCircle size={18} /><span>Ver Tráiler</span>
              </a>
            )}
          </div>

          {/* Grid de contenido */}
          <div className="movie-content-grid">
            <aside>
              <div style={{ marginBottom: '20px' }}>
                <span className="label-small">DIRECCIÓN</span>
                <span className="value-text">{documental.director}</span>
              </div>
              <div className="specs-box">
                <div className="specs-item"><span className="label-small">DURACIÓN</span><span className="value-text">{documental.duracion} min</span></div>
                <div className="specs-item" style={{ marginTop: '20px' }}><span className="label-small">PAÍSES</span><span className="value-text">México</span></div>
                <div className="specs-item" style={{ marginTop: '20px' }}><span className="label-small">AÑO</span><span className="value-text">{documental.anioPub}</span></div>
                <div className="specs-item" style={{ marginTop: '20px' }}><span className="label-small">IDIOMAS</span><span className="value-text">{documental.idiomas}</span></div>
              </div>
            </aside>

            <section>
              <h2 className="section-header">Sinopsis</h2>
              <p className="body-text">{documental.sinopsis}</p>
              {documental.semblanza && <><h2 className="section-header">Semblanza</h2><p className="body-text">{documental.semblanza}</p></>}
              <h2 className="section-header">Festivales y Premios</h2>
              <div className="laurels-container">
                 <p>{documental.premios_ganados || "Selección Oficial Ambulante 2025"}</p>
                 <div style={{ width: '100%', height: '1px', backgroundColor: '#eee', marginTop:'20px'}}></div>
              </div>
            </section>

            <aside>
              <div style={{ marginBottom: '40px' }}><span className="label-small">TEMÁTICAS</span><span className="meta-tag">{documental.tematicas}</span></div>
              <div style={{ marginBottom: '40px' }}><span className="label-small">INICIATIVAS</span><div className="iniciativa-row"><span className="red-dot"></span><span>{documental.iniciativa || "Gira Ambulante"}</span></div></div>
              <div><span className="label-small">ENLACES</span>
                 {documental.url_descarga ? (
                   <a href={documental.url_descarga} target="_blank" rel="noopener noreferrer" className="download-link">Ver Material / Video</a>
                 ) : <span style={{color:'#999', fontSize:'0.9rem'}}>No disponible</span>}
              </div>
            </aside>
          </div>

          {/* --- SECCIÓN DE CRÉDITOS DINÁMICA --- */}
          <div 
            className="credits-bar" 
            onClick={() => setShowCredits(!showCredits)}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                {showCredits ? "Ocultar Créditos" : "Mostrar Créditos Completos"} 
                {showCredits ? "⌃" : "⌄"}
             </div>

             {/* Lista desplegable */}
             {showCredits && (
                <div className="credits-list-container" style={{ marginTop: '20px', width: '100%', maxWidth: '800px', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {listaCreditos.length > 0 ? listaCreditos.map((credito) => (
                        <div key={credito.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#888', display: 'block' }}>{credito.rol}</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{credito.nombre}</span>
                        </div>
                    )) : (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>No hay información de créditos extra.</p>
                    )}
                </div>
             )}
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