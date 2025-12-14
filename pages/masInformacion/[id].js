"use client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withRole from "@/utils/withRole";

function DocumentalPage() {
  const router = useRouter();
  const { id } = router.query;

  const [documental, setDocumental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/getDocumentalById?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setDocumental({
          id,
          titulo: data.titulo,
          duracion: data.duracion,
          anio_publicacion: data.anio_publicacion,
          director: data.director,
          sinopsis: data.sinopsis, // 👈 ojo aquí (tenías sipnosis)
          url_imagen: data.url_imagen,
          iniciativa: data.iniciativa,
          url_descarga: data.url_descarga,
          edicion_presentada: data.edicion_presentada,
          idiomas: data.idiomas,
          tematicas: data.tematicas,
          premios_ganados: data.premios_ganados,
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!documental) return <p>No encontrado</p>;

  return (
    <>
      <Head>
        <title>{documental.titulo} | Ambulante</title>
      </Head>

      <main className="documental-page">
        {/* VOLVER */}
        <section className="documental-actions">
          <button onClick={() => router.push("/")}>
            ← Volver al dashboard
          </button>
        </section>

        {/* HERO */}
        <section className="documental-hero">
          <img
            src={documental.url_imagen}
            alt={documental.titulo}
            className="documental-poster"
          />

          <div className="documental-hero-info">
            <span className="initiative">{documental.iniciativa}</span>
            <h1>{documental.titulo}</h1>

            <p className="meta">
              {documental.anio_publicacion} · {documental.duracion} min
            </p>

            <p className="director">
              Dir. {documental.director}
            </p>

            <a
              href={documental.url_descarga}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Ver / Descargar
            </a>
          </div>
        </section>

        {/* SINOPSIS */}
        <section className="documental-section">
          <h2>Sinopsis</h2>
          <p>{documental.sinopsis}</p>
        </section>

        {/* FICHA TÉCNICA */}
        <section className="documental-section">
          <h2>Ficha técnica</h2>
          <ul className="ficha-tecnica">
            <li><strong>Año:</strong> {documental.anio_publicacion}</li>
            <li><strong>Duración:</strong> {documental.duracion} minutos</li>
            <li><strong>Director:</strong> {documental.director}</li>
            <li><strong>Idiomas:</strong> {documental.idiomas}</li>
            <li><strong>Edición presentada:</strong> {documental.edicion_presentada}</li>
          </ul>
        </section>

        {/* TEMÁTICAS */}
        <section className="documental-section">
          <h2>Temáticas</h2>
          <p>{documental.tematicas}</p>
        </section>

        {/* PREMIOS */}
        <section className="documental-section">
          <h2>Premios y festivales</h2>
          <p>{documental.premios_ganados}</p>
        </section>
      </main>
    </>
  );
}

export default DocumentalPage();
