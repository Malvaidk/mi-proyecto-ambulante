import { getConnection } from "../../lib/connectionAdmin"; 
export default async function handler(req, res) {
  const { tipo, valor } = req.query;

  if (!tipo || !valor) {
    return res.status(400).json({ message: "Faltan parámetros (tipo y valor)" });
  }

  try {
    const pool = await getConnection();
    
    let query = "";
    let params = [valor];

    switch (tipo) {
      case "edicion":
        params = [parseInt(valor)]; 
        query = "CALL sp_ObtenerPeliculasPorEdicion(?)";
        break;

      case "director":
        query = "CALL sp_DuracionTotalDirector(?)";
        break;
      
      case "tematica":
        query = "CALL sp_ConteoPorTematica(?)";
        break;

      default:
        return res.status(400).json({ message: "Tipo de reporte no válido" });
    }

    const [results] = await pool.query(query, params);

    const datosLimpios = results[0];

    if (!datosLimpios || datosLimpios.length === 0) {
      return res.status(200).json([]); 
    }

    res.status(200).json(datosLimpios);

  } catch (error) {
    console.error("❌ Error en API Reports:", error);
    
    if (error.code === 'ER_SP_DOES_NOT_EXIST') {
      return res.status(500).json({ 
        message: "Error crítico: Los procedimientos almacenados no existen en la Base de Datos. Ejecuta el script SQL en Workbench." 
      });
    }

    res.status(500).json({ message: "Error interno: " + error.message });
  }
}