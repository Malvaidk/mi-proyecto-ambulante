import { getConnection } from "../lib/conection";

export default function TestPage({ peliculas, error }) {
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

export async function getServerSideProps() {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM vw_detallepelicula LIMIT 5");

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
        error: err.message, 
      },
    };
  }
}