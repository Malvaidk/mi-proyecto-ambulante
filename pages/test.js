import { getConnection } from "../lib/conection"; // Nota los dos puntos ".." para salir de "pages" e ir a "lib"

export default function TestPage({ peliculas, error }) {
  // Esta parte se ejecuta en el navegador (Cliente)
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>🎬 Prueba de Conexión a Base de Datos</h1>

      {error && (
        <div style={{ color: "red", padding: "10px", border: "1px solid red", marginBottom: "20px" }}>
          <strong>Error de conexión:</strong> {error}
        </div>
      )}

      {peliculas && peliculas.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {peliculas.map((peli) => (
            <div key={peli.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
              <h2 style={{ margin: "0 0 10px 0" }}>{peli.titulo}</h2>
              <p><strong>Director:</strong> {peli.director}</p>
              <p><strong>Temáticas:</strong> {peli.tematicas}</p>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>No se encontraron películas. (Revisa si la vista vw_detallepelicula tiene datos)</p>
      )}
    </div>
  );
}

// Esta función SOLO se ejecuta en el servidor (Backend)
export async function getServerSideProps() {
  try {
    const pool = await getConnection();
    // Usamos la vista que ya existe en tu BD
    const [rows] = await pool.query("SELECT * FROM vw_detallepelicula LIMIT 5");

    // Next.js necesita que los datos sean serializables (JSON)
    // Convertimos a JSON y de vuelta para evitar errores con objetos extraños de MySQL
    const peliculas = JSON.parse(JSON.stringify(rows));

    return {
      props: {
        peliculas,
        error: null,
      },
    };
  } catch (err) {
    console.error("Error en getServerSideProps:", err);
    return {
      props: {
        peliculas: [],
        error: err.message, // Enviamos el mensaje de error al componente para verlo en pantalla
      },
    };
  }
}