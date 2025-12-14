"use client"
import { useRouter } from "next/router";
import withRole from '@/utils/withRole';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useEffect, useState } from "react";

function dashboard() {
    const router = useRouter();
  //const years = Array.from({ length: 12 }, (_, i) => 2025 - i); 
  const [movies, setMovies] = useState([]);
  let [years,setYears]=useState([]);
  const handleadd = () => {

    const newYear = prompt("Ingrese el año");
  
    if (!newYear) return;
  
    if (!/^\d{4}$/.test(newYear)) {
      alert("Año inválido");
      return;
    }
  
    // Verificar si ya existe
    if (years.includes(newYear)) {
      alert("Ese año ya existe");
      return;
    }
    setYears([...years, newYear]);
    console.log(years);
    console.log(newYear);
  };
  const handleAddtittle=()=>{
     router.push("/dashboard/addTittle");
  }
  const handleEditTittle=(movie)=>{
    router.push(`dashboard/addTittle/${movie}`);
  }
  const handleYearClick =  async (year) => {
    console.log("Año seleccionado:", year);
    fetchDataByYear(year);
  };
  const fetchDataByYear = async (year) => {
    try {
      const res = await fetch(`/api/getDocumentals?year=${year}`);
      const data = await res.json()
    
      if(!data.movies || data.movies.length === 0){
        setMovies([]);
        setYears([...years]);
        return;
      }
      
      console.log("Datos recibidos:", data);
      setMovies(data.movies);
      if(years.length===0){
      setYears(data.availableYears);
    }
    else{
        setYears([...years])
    }
    
     
      
      
    } catch (error) {
      console.log("Error al obtener datos:", error);
    }
  };
  
  useEffect(() => {
    fetch(`/api/getDocumentals?id=`)
      .then(res => {
        console.log("Raw response:", res);
        return res.json();
      })
      .then(data => {
        console.log("Parsed data:", data.movies);
        setMovies(data.movies);
        setYears(data.availableYears);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);
  

 

  return (
    <div className="page-wrapper">
     

      <main className="main-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="back-link">← Atras Programas</span>
          <span className="separator">/</span>
          <span className="current">Gira de Documentales</span>
        </div>

        {/* Intro */}
        <section className="gira-intro">
          <h4 className="super-header">Administrar giras de documentales</h4>
          {/*<h1 className="main-tittle">El festival de cine documental de mayor alcance en México</h1>*/}
        </section>

        {/* Ediciones anteriores */}
        <section className="editions-list">
          <h3>Ediciones anteriores</h3>
          <div className="years-grid">
          <div
                key="agregar"
                className="year-card"
                onClick={() => handleadd()}
              >
                <span>Agregar año</span>
                <span className="arrow-icon">↗</span>
              </div>
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


       

        {/* Histórico de películas */}
        <section className="movies-history">
          <h3>Histórico de películas programadas</h3>
          <div className="movies-grid">
            
          <div key={0} className="movie-card" onClick={() => handleAddtittle()}>
                <div className="movie-poster-placeholder">+</div>
                <div className="movie-details">
                  <h4>Agregar titulo</h4>
                  <p className="director">"agregar director"</p>
                  <p className="meta">agregar año</p>
                  <p className="meta">agregar cidudad</p>
                  <span className="link-details">Ver detalles</span>
                </div>
              </div>
            {movies.map((movie, idx) => (

              <div key={idx}  className="movie-card">
                <Link href={`/dashboard/documentales/${movie.idPelicula }`}>
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
export default withRole(dashboard, ["admin_documentales"]);