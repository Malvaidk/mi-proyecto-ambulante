import { getConnection } from "../../lib/connectionAdmin"; // Usamos Admin obligatoriamente

export default async function handler(req, res) {
  const { tipo, valor } = req.query;

  if (!tipo || !valor) {
    return res.status(400).json({ message: "Faltan parámetros (tipo y valor)" });
  }

  try {
    const pool = await getConnection();
    
    let query = "";
    let params = [valor];

    // Selección de Procedimiento
    switch (tipo) {
      case "edicion":
        // Aseguramos que sea número para evitar conflictos con el SP
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

    /* IMPORTANTE: Usamos .query() en lugar de .execute() 
       para Stored Procedures, ya que maneja mejor los múltiples 
       result sets que devuelven los procedimientos.
    */
    const [results] = await pool.query(query, params);

    // Los SP devuelven: [ [FilasResultado], [PaqueteOk] ]
    // Tomamos el primer elemento que contiene los datos reales.
    const datosLimpios = results[0];

    // Verificar si vino vacío
    if (!datosLimpios || datosLimpios.length === 0) {
      return res.status(200).json([]); // Devolvemos array vacío, no error
    }

    res.status(200).json(datosLimpios);

  } catch (error) {
    console.error("❌ Error en API Reports:", error);
    
    // Verificamos si el error es que el SP no existe
    if (error.code === 'ER_SP_DOES_NOT_EXIST') {
      return res.status(500).json({ 
        message: "Error crítico: Los procedimientos almacenados no existen en la Base de Datos. Ejecuta el script SQL en Workbench." 
      });
    }

    res.status(500).json({ message: "Error interno: " + error.message });
  }
}