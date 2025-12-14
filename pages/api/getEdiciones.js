import { getConnection } from "@/lib/connection";

export default async function handler(req, res) {
  try {
    const conn = await getConnection();
    const { year } = req.query;
    console.log(year)

    let query = `
      SELECT * from vw_edicion_detalle
    `;

    const params = [];

 
    if (year) {
      query += " WHERE anio = ?";
      params.push(year);
    }

   

    const [rows] = await conn.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Edición no encontrada" });
    }

    res.status(200).json(rows);

  } catch (error) {
    console.error("Error al obtener ediciones:", error);
    res.status(500).json({ message: "Error al obtener ediciones" });
  }
}
