"use client"
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { useEffect, useState } from "react";

export default function GiraPage() {
  const years = Array.from({ length: 12 }, (_, i) => 2025 - i); 
  const [movies, setMovies] = useState([]);
 // const [years, setYears] = useState([]);
  const handleYearClick =  async (year) => {
    console.log("Año seleccionado:", year);
    fetchDataByYear(year);
  };
  const fetchDataByYear = async (year) => {
    try {
      const res = await fetch(`/api/getDocumentals?year=${year}`);
      const data = await res.json();
      console.log("Datos recibidos:", data);
      setMovies(data.rows);
      setYears(data.avaiableYears);
      console.log(data.years);
    } catch (error) {
      console.log("Error al obtener datos:", error);
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


        {/* Edición actual */}
        <section className="current-edition">
          <div className="edition-info">
            <h2>20ª edición</h2>
            <p className="dates">Del 2 de abril al 15 de junio [...]</p>
            <p className="edition-desc">
              Oleajes se presenta como un concepto [...]
            </p>
            <div className="action-buttons">
              <button className="btn-transparent">Descargar programas</button>
              <button className="btn-transparent">Ver catálogo de películas</button>
            </div>
          </div>
        </section>

        {/* Histórico de películas */}
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
