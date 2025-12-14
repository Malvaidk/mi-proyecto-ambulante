"use client"
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useEffect, useState } from "react";

export default function GiraPage() {
  const years = Array.from({ length: 12 }, (_, i) => 2025 - i); 
  const [movies, setMovies] = useState([]);
  const [ediciones, setEdiciones] = useState([]);

 // const [years, setYears] = useState([]);
  const handleYearClick =  async (year) => {
    console.log("Año seleccionado:", year);
    fetchDataByYear(year);
  };
  const fetchDataByYear = async (year) => {
    try {
      const [resMovies, resEdiciones] = await Promise.all([
        fetch(`/api/getDocumentals?year=${year}`),
        fetch(`/api/getEdiciones?year=${year}`)
      ]);
  
      const dataMovies = await resMovies.json();
      const dataEdiciones = await resEdiciones.json();
  
    
      if (!dataMovies.movies || dataMovies.movies.length === 0) {
        setMovies([]);
      } else {
        setMovies(dataMovies.movies);
      }
  
      setEdiciones(dataEdiciones[0]|| []);
  

      if (years.length === 0 && dataMovies.availableYears) {
        setYears(dataMovies.availableYears);
      }
  
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };
  

  
  useEffect(() => {
    fetch(`/api/getDocumentals?year=2024`)
      .then(res => {
        console.log("Raw response:", res);
        return res.json();
      })
      .then(data => {
        console.log("Parsed data:", data);
        setMovies(data.movies);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);
  

 

  return (
    <div className="page-wrapper">
      <Head>
        <title>Gira - Ambulante</title>
      </Head>

      <Header />

      <main className="main-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="back-link">← Atras Programas</span>
          <span className="separator">/</span>
          <span className="current">Gira de Documentales</span>
        </div>

        {/* Intro */}
        <section className="gira-intro">
          <h4 className="super-header">Ambulante Gira de Documentales</h4>
          <h1 className="main-title">El festival de cine documental de mayor alcance en México</h1>
          
          <div className="intro-text-columns">
            <p>
              La Gira es nuestro proyecto más icónico [...]
            </p>
            <p>
              A lo largo de veinte años [...]
            </p>
          </div>
        </section>

        {/* Ediciones anteriores */}
        <section className="editions-list">
          <h3>Ediciones anteriores</h3>
          <div className="years-grid">
            {years.map((year) => (
              <div
                key={year}
                className="year-card"
                onClick={() => handleYearClick(year)}
              >
                <span>Gira {year}</span>
                <span className="arrow-icon">↗</span>
              </div>
            ))}
          </div>
        </section>


       
        {ediciones && (
  <section className="current-edition">
    <div className="edition-info">

      <h2>{ediciones.titulo_edicion}</h2>

      <p className="dates">
       {ediciones.fechas_y_estados}
      </p>

      <p className="edition-desc">
        {ediciones.concepto}
      </p>

      <div className="action-buttons">
        {ediciones.programaUrl && (
          <a
            href={currentEdition.programaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-transparent"
          >
            Descargar programa
          </a>
        )}

        <button
          className="btn-transparent"
          onClick={() => handleYearClick(currentEdition.anio)}
        >
          Ver catálogo de películas
        </button>
      </div>

    </div>
  </section>
)}


        {/* Histórico de películas */}
        <section className="movies-history">
          <h3>Histórico de películas programadas</h3>
          <div className="movies-grid">
            {movies.map((movie, idx) => (
              <div key={idx} className="movie-card">
                 <Link href={`/masInformacion/${movie.idPelicula }`}>
                <div className="movie-poster-placeholder"></div>
                <div className="movie-details">
                  <h4>{movie.titulo}</h4>
                  <p className="director">{movie.director}</p>
                  <p className="meta">{movie.anioPub}</p>
                  <p className="meta">{movie.country}</p>
                  <span className="link-details">Ver detalles</span>
                </div>
                </Link>
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
