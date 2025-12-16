"use client"
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Testimonial from '../components/Testimonial'; 
import { useEffect, useState } from "react";

const editionsData = {
  2025: {
    theme: "Oleajes",
    fechas: "Del 2 de abril al 18 de junio | Ciudad de México, Baja California, Veracruz y Yucatán",
    descripcion: "Oleajes se presenta como un concepto que nos permite explorar tanto las fuerzas dinámicas que han moldeado al cine documental durante las últimas dos décadas, como las corrientes actuales que impulsan su futuro. Los oleajes nos invitan a sentir el vaivén entre lo viejo y lo nuevo.",
    poster: "https://i.postimg.cc/KzTVwGfL/image.webp",
    videoId: "zjgYRyROiCM",
    news1: { img: "https://i.postimg.cc/mDGfb1PB/image-2.webp", text: "Clase magistral con Gael García Bernal en Yucatán." },
    news2: { img: "https://i.postimg.cc/C10Xyy2Y/image-3.webp", text: "Rodrigo Guardiola y Ángel Mosqueda en función de Zoé: Panoramas." }
  },
  2024: {
    theme: "Contemplación",
    fechas: "Del 10 de abril al 26 de mayo | CDMX, Veracruz, Michoacán, Querétaro",
    descripcion: "El tema de esta edición fue la Contemplación. Si afirmamos que no hay mejor comprensión que la que se pone en práctica, estaremos de acuerdo en que la contemplación es más que una simple reflexión pasiva: se trata de un tipo de meditación sobre la acción que conduce irremediablemente al compromiso activo y participativo en el ámbito público; es decir, al acto político.",
    poster: "https://i.postimg.cc/wT4Tz1vM/image-4.webp", 
    videoId: "kfCGUeohvIc",
    news1: { img: "https://i.postimg.cc/kg8rHGRT/image-5.webp", text: "Inauguración en el Teatro de la Ciudad." },
    news2: { img: "https://i.postimg.cc/zDP9XKns/image-6.webp", text: "Tatiana Huezo, directora de 'El Eco'." }
  },
  2023: {
    theme: "El encanto de la fisura",
    fechas: "Del 19 de agosto al 8 de octubre | CDMX, Chihuahua, Aguascalientes, Veracruz y Michoacán",
    descripcion: "El tema de esta edición fue el encanto de la fisura. Pensamos que las transformaciones no se prometen, se viven. Sin ninguna certeza pero rebosantes de deseos, los convocamos a convertir este festival de cine documental en un espacio para habitar la mirada del otro, de las otras, como parte de una estrategia de comprensión y supervivencia.",
    poster: "https://i.postimg.cc/T3vNp9hS/image-7.webp",
    videoId: "E8o_4QNnWqU",
    news1: { img: "https://i.postimg.cc/1RNLX4Jt/image-8.webp", text: "Función de 'La danza de los mirlos' en Plaza Xallitic, en Veracruz." },
    news2: { img: "https://i.postimg.cc/htKw2sgS/image-9.webp", text: "Ludovic Bonleux, director de 'Toshkua'." }
  },
  2022: {
    theme: "Resonancias",
    fechas: "31 de agosto al 9 de octubre | Ciudad de México, Michoacán, Aguascalientes, Chihuahua y Veracruz",
    descripcion: "Resonancias, el concepto central de la Gira de Documentales 2022, coloca el campo sonoro como eje articulador de nuestra programación",
    poster: "https://i.postimg.cc/7hsCjXdk/image-10.webp",
    videoId: "XkySOSQ4vxE",
    news1: { img: "https://i.postimg.cc/HsNc2Zb8/image-11.webp", text: "Función Inaugural Ambulante en Teatro Esperanza Iris." },
    news2: { img: "https://i.postimg.cc/mrYPTTJK/image-12.webp", text: "Xun Sero, director de 'Mamá'." }
  },
  2021: {
    theme: "Ecologías del cine",
    fechas: "3 de noviembre al 15 de diciembre | Oaxaca, Veracruz, Aguascalientes, Michoacán y Ciudad de México",
    descripcion: "Ecologías del cine, el tema central de la Gira, hace referencia al papel que las imágenes en movimiento pueden jugar respecto a la explotación del medio ambiente. A través de la tierra y el territorio, como horizontes de sentido y pivotes de la acción colectiva, buscamos amplificar las historias de defensores en la primera línea de una crisis climática que desplaza cuerpos, trastoca los medios de subsistencia de comunidades y evidencia la inequidad con que se distribuyen los efectos negativos del extractivismo.",
    poster: "https://i.postimg.cc/FRPsKzZM/image-13.webp",
    videoId: "loxZ-ofTHF4",
    news1: { img: "https://i.postimg.cc/HWhkDJjD/image-14.webp", text: "Función inaugural en la exedra de la Plaza Patria en Aguascalientes." },
    news2: { img: "https://i.postimg.cc/9Q3X0vdX/image-15.webp", text: "Néstor Bravo, Yareli Rivera y Daniela Niniz Rojas, equipo de 'Tsihueri, el que fue valiente'." }
  },
  2020: {
    theme: "Festival en línea",
    fechas: "29 de abril al 28 de mayo | Festival en línea",
    descripcion: "Celebramos 15 años de apoyar y difundir el cine documental como dispositivo de transformación cultural y social en México y Centroamérica. En medio de una pandemia nos adaptamos a la situación con #AmbulanteEnCasa, un festival en línea que acompañó al espectador durante la cuarentena decretada en respuesta a la crisis sanitaria en el país. Con funciones y estrenos disponibles durante 24 horas, así como sesiones de preguntas y respuestas, conversatorios nocturnos con cineastas e invitados especiales, junto con encuentros temáticos.",
    poster: "https://i.postimg.cc/gjCpwZ6g/image-16.webp",
    videoId: "hUwpG2LStIE",
    news1: { img: "https://i.postimg.cc/TYbGzCZ7/image-17.webp", text: "Conferencia con Paulina Suárez, directora de Ambulante; Diego Luna y Gael García Bernal, co fundadores de Ambulante." },
    news2: { img: "https://i.postimg.cc/mgN4DhZS/image-18.webp", text: "María Sojob, directora de 'Tote_Abuelo'." }
  },
  2019: {
    theme: "Gira 2019",
    fechas: "21 de febrero al 16 de mayo | Veracruz, Querétaro, Puebla, Coahuila, Jalisco, Chihuahua, Oaxaca y CDMX ",
    descripcion: "El concepto temático de la Gira 2019, Ilusiones ópticas, reanima una conversación central para el cine documental: su vocación como evidencia visible y como tecnología que genera un juego de percepción, de magia e ilusionismo.",
    poster: "https://i.postimg.cc/Gmr2zWHj/image-19.webp",
    videoId: "zwjMZNjTwRU",
    news1: { img: "https://i.postimg.cc/mrgrW73W/image-20.webp", text: "Equipo de voluntaries en Ambulante Jalisco." },
    news2: { img: "https://i.postimg.cc/SK1xSjVG/image-21.webp", text: "Luna Marán, directora de 'Tío Yim'." }
  },
  2018: {
    theme: "No intenso agora",
    fechas: "8 de marzo al 17 de mayo | Oaxaca, Veracruz, Michoacán, Puebla, Jalisco, Querétaro, Chihuahua y CDMX",
    descripcion: "Nuestro deseo, más que comprender la naturaleza de estos tiempos, es descubrir qué hacemos ante ellos, de dónde viene la fuerza que nos lleva a reconstruirnos y cómo experimentamos este intenso presente, parafraseando el título del documental de João Moreira Salles, 'No intenso agora', el cual nos hemos apropiado como emblema de esta Gira: El intenso ahora. En esta edición renovamos la convicción de que reunirnos a ver cine en plazas públicas, parques, teatros y museos nos permitirá reconstruir colectivamente nuestro momento presente.",
    poster: "https://i.postimg.cc/cH80dhvy/image-22.webp",
    videoId: "wKk2EdbYDrk",
    news1: { img: "https://i.postimg.cc/4ykZyccP/image-23.webp", text: "Función inaugural en Jalisco, 'Ayotzinapa, el paso de la tortuga'." },
    news2: { img: "https://i.postimg.cc/ryxMbh67/image-24.webp", text: "Alberto Arnaut, director de 'Hasta los dientes'." }
  },
  2017: {
    theme: "Ambulante Ideas",
    fechas: "23 de marzo al 25 de mayo | CDMX, Oaxaca, Chihuahua, Baja California, Jalisco, Michoacán, Puebla, Coahuila, Querétaro y Veracruz",
    descripcion: "Bajo el sello Ambulante Ideas, diseñamos funciones seguidas de charlas entre directores, especialistas, académicos y activistas que buscan reactivar el potencial del cine para incidir en la realidad.",
    poster: "https://i.postimg.cc/C1bXvQZG/image-25.webp",
    videoId: "LchQI7i7Vo0",
    news1: { img: "https://i.postimg.cc/05dhDhRW/image-26.webp", text: "Función inaugural, 'No soy tu negro' en el Teatro Macedonio Alcalá, Oaxaca." },
    news2: { img: "https://i.postimg.cc/XNzdHYbL/image-27.webp", text: "Lucía Gajá, directora de 'Batallas íntimas'." }
  },
  2016: {
    theme: "Gira 2016",
    fechas: "31 de marzo al 2 de junio | CDMX, Oaxaca, Puebla, Coahuila, Michoacán, Jalisco, Baja California y Veracruz",
    descripcion: "A través de la programación de la Gira 2016, retomamos todas aquellas historias que nos refieren a esta colectividad y que extienden las fronteras de nuestro ser para combinarse con las de los demás.",
    poster: "https://i.postimg.cc/nrjjbqJs/image-28.webp",
    videoId: "E4pik_GsZ_w",
    news1: { img: "https://i.postimg.cc/sxkBV1fy/image-29.webp", text: "Función de inauguración 'Sonita' en Plaza de la República en CDMX." },
    news2: { img: "https://i.postimg.cc/bNnDm0LY/image-30.webp", text: "Maya Goded, directora de 'Plaza de la soledad'." }
  },
  2015: {
    theme: "¡Oh 10!",
    fechas: "29 de enero al 3 de mayo | Distrito Federal, Guerrero, Morelos, Puebla, Veracruz, Zacatecas, Coahuila, Michoacán, Chiapas, Jalisco, Baja California y Oaxaca",
    descripcion: "En el marco de una edición del décimo aniversario, el asombro fue el eje temático de la programación y lo asumimos como una actitud ante el cine y ante la vida, como una forma de seguir reinventándonos como público y como festival, y una herramienta indispensable para generar proyectos creativos.",
    poster: "https://i.postimg.cc/CdpK3t7v/image-31.webp",
    videoId: "q7fRFMU-tAk",
    news1: { img: "https://i.postimg.cc/sfvTK28v/image-32.webp", text: "Intervención de arte urbano #Ambulante2015 hecha en colaboración con el Fideicomiso Centro Histórico de la Ciudad de México, Chachacha y Habitajes." },
    news2: { img: "https://i.postimg.cc/L8MvH3sq/image-33.webp", text: "Gael García Bernal, socio fundador de Ambulante A.C" }
  },
  2014: {
    theme: "Descubrir. Compartir. Transformar.",
    fechas: "30 de enero al 4 de mayo | Distrito Federal, Guerrero, Zacatecas, Puebla, Veracruz, Nuevo León, Coahuila, Michoacán, Chiapas, Vive Latino, Jalisco, Baja California y Oaxaca",
    descripcion: "Si la liberación -como acción transformadora- fue precisamente el tema de nuestra pasada edición, este año queremos ir más allá y nos hemos propuesto repensar la noción de 'tiempo' en y desde el cine documental, en sus múltiples modalidades, expresiones y significados. El 'tiempo', que es por naturaleza ambulante, nos permite plantearnos el cine documental como un cronoscopio a través del cual observamos su paso, incidimos en su curso y arrojamos luz sobre sus efectos en el mundo.",
    poster: "https://i.postimg.cc/7PGN0WCF/image-34.webp",
    videoId: "MWPKTcQz66k",
    news1: { img: "https://i.postimg.cc/9FytNwYJ/image-35.webp", text: "Función inaugural en CDMX." },
    news2: { img: "https://i.postimg.cc/dVvmMQWd/image-36.webp", text: "Mike Lerner, director del documental 'Pussy Riot: una plegaria punk'." }
  },
};

export default function GiraPage() {

  const [selectedYear, setSelectedYear] = useState(2025); 
  const [years, setYears] = useState(Array.from({ length: 12 }, (_, i) => 2025 - i));
  const [movies, setMovies] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const getEditionInfo = (year) => {
    const editionNumber = 20 - (2025 - year);
    const data = editionsData[year] || {
      theme: `Gira ${year}`,
      fechas: "Fechas por confirmar | Recorrido nacional",
      descripcion: `Información sobre la Gira de Documentales realizada en el año ${year}. Un recorrido por lo mejor del cine documental.`,
      poster: "/images/placeholder-poster.jpg",
      videoId: "zjgYRyROiCM",
      news1: { img: "/images/placeholder.jpg", text: `Evento destacado de ${year}` },
      news2: { img: "/images/placeholder.jpg", text: `Actividad especial de ${year}` }
    };

    return { ...data, number: editionNumber };
  };

  const currentInfo = getEditionInfo(selectedYear);

  const fetchDataByYear = async (year) => {
    try {
      const res = await fetch(`/api/getDocumentals?year=${year}`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      
      const data = await res.json();
      setMovies(data.movies || []);
      
      if (data.availableYears) setYears(data.availableYears);
      
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setMovies([]); 
    }
  };

  const handleYearClick = async (year) => {
    console.log("Año seleccionado:", year);
    setSelectedYear(year);
    setIsPlaying(false); 
    await fetchDataByYear(year);
  };
  
  useEffect(() => {
    fetchDataByYear(2025);
  }, []);

  return (
    <div>
      <Head>
        <title>Gira {selectedYear} - Ambulante</title>
      </Head>

      <Header />

      <main>
        {/* --- SECCIÓN 1: HERO & CAJA ROSA --- */}
        <section className="hero-section container">
          <h4 className="super-header">Ambulante Gira de Documentales</h4>
          <h1 className="main-title">El festival de cine documental de mayor alcance en México</h1>
          
          <div className="pink-box">
          La Gira es nuestro proyecto más icónico, el festival de cine documental con mayor alcance en México y un espacio de exhibición itinerante único en el mundo. En cada edición viajamos por diferentes estados del país con un programa de películas que recoge lo más relevante del documental nacional e internacional. A lo largo de veinte años, la Gira ha recorrido miles de kilómetros de nuestro territorio con una intención central: crear un encuentro emocionante y significativo entre el cine documental y su público a través de proyecciones, mediaciones, conversatorios, sesiones de preguntas y respuestas con los realizadores, talleres, clases magistrales y ¡mucho más!
          </div>

          <div className="hero-image-container">
             <img src="https://i.postimg.cc/tCsRTPB8/ambulante1.png" alt="Ambulante Hero" className="hero-img" />
          </div>
        </section>

        {/* --- SECCIÓN 2: PESTAÑAS DE AÑOS --- */}
        <section className="editions-section container">
          <h3>Ediciones anteriores</h3>
          <div className="years-pills">
            {years?.map((year) => (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={`year-pill ${selectedYear === year ? 'active' : ''}`}
              >
                Gira {year}
              </button>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN 3: EDICIÓN DINÁMICA (Aquí está el cambio principal) --- */}
        <section className="current-edition-section container">
          
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>
            {currentInfo.number}ª edición ({selectedYear})
          </h2>
          
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
             {currentInfo.fechas}
          </p>
          
          <p style={{ color: '#666', maxWidth: '800px', marginBottom: '30px' }}>
            {currentInfo.descripcion}
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
             <button className="btn-black">Conoce el programa →</button>
             <button style={{ padding: '12px 30px', border: '1px solid black', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                Actividades en vivo
             </button>
          </div>

          {/* Grid visual (Poster izq, Video der) */}
          <div className="edition-grid">
             {/* Item Izquierdo: Poster Dinámico */}
             <div className="poster-card">
                <img src={currentInfo.poster} alt={`Poster ${selectedYear}`} className="poster-img" /> 
                <h3 className="poster-title">{currentInfo.theme}</h3>
             </div>

             {/* Item Derecho: Video y Noticias Dinámicas */}
             <div>
                <div className="video-card" style={{ overflow: 'hidden' }}>
                  {!isPlaying ? (
                    <div onClick={() => setIsPlaying(true)} style={{ cursor: 'pointer', width: '100%', height: '100%', position: 'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <img 
                        src={`https://img.youtube.com/vi/${currentInfo.videoId}/maxresdefault.jpg`} 
                        alt="Video Cover" 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                      />
                      <div className="play-icon" style={{ zIndex: 10 }}>▶</div>
                      <span style={{ position: 'absolute', bottom: '15px', left: '15px', color: 'white', fontWeight: 'bold', zIndex: 10 }}>
                        Trailer {selectedYear}
                      </span>
                    </div>
                  ) : (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${currentInfo.videoId}?autoplay=1`} 
                      title="Video" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                
                <div className="news-mini-grid">
                   <div className="news-item">
                      <img 
                        src={currentInfo.news1.img} 
                        alt="Noticia 1" 
                        style={{width:'100%', height:'100%', objectFit:'cover'}} 
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=Ambulante'}}
                      />
                      <span style={{position:'absolute', bottom:5, left:5, background:'white', padding:'2px 5px', fontSize:'10px', fontWeight:'bold'}}>
                        {currentInfo.news1.text}
                      </span>
                   </div>
                   <div className="news-item">
                      <img 
                        src={currentInfo.news2.img} 
                        alt="Noticia 2" 
                        style={{width:'100%', height:'100%', objectFit:'cover'}} 
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=Ambulante'}}
                      />
                      <span style={{position:'absolute', bottom:5, left:5, background:'white', padding:'2px 5px', fontSize:'10px', fontWeight:'bold'}}>
                        {currentInfo.news2.text}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* --- SECCIÓN 4: HISTÓRICO DE PELÍCULAS --- */}
        <section className="history-section">
          <div className="container">
            <h2 style={{ marginBottom: '30px', fontSize: '1.8rem' }}>Histórico de películas {selectedYear}</h2>
            
            <div className="movies-mosaic">
              {movies?.length > 0 ? (
                movies.slice(0, 5).map((movie, idx) => (
                  <Link 
                    href={`/masInformacion/${movie.idPelicula || movie.id}`} 
                    key={movie.idPelicula || movie.id || idx}
                    className={`movie-card ${idx === 0 ? 'featured' : ''}`}
                  >
                      <img 
                        src={movie.imagen || "https://via.placeholder.com/600x900?text=Sin+Imagen"} 
                        alt={movie.titulo} 
                        className="movie-bg"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://via.placeholder.com/600x900?text=No+Disponible";
                        }}
                      />
                      <div className="movie-info-overlay">
                        <h3 style={{ margin: 0, fontSize: idx === 0 ? '1.5rem' : '1rem' }}>{movie.titulo}</h3>
                        <p style={{ margin: '5px 0 0', fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>
                          {movie.director}
                        </p>
                        {idx === 0 && (
                           <span style={{ marginTop: '10px', display: 'inline-block', border: '1px solid white', padding: '5px 10px', fontSize: '0.7rem' }}>
                             Ver detalles
                           </span>
                        )}
                      </div>
                  </Link>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <p>No hay películas registradas para la edición {selectedYear}.</p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
               <button className="btn-black">Ver todo el catálogo →</button>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 5: TESTIMONIOS --- */}
        <Testimonial />
              
      </main>
      <Footer />
    </div>
  );
}