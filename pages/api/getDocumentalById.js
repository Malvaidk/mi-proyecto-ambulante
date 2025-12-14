import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  const { id } = req.query;
  const conn = await getConnection();

  const [rows] = await conn.execute(
    `
    SELECT * FROM vw_DetallePelicula WHERE id= ?;
    `,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json(null);
  }

 
  // Agrupar fechas
  const documental = {
    id: rows[0].id,
    titulo: rows[0].titulo,
    anio_publicacion: rows[0].anio_publicacion,
    director: rows[0].director,
    sinopsis: rows[0].sinopsis,
    url_image: rows[0].sinopsis,
    iniciativa: rows[0].iniativa,
    url_descarga:  rows[0].url_descarga,
    edicion_presentada: rows[0].edicion_presentada,
    idiomas: rows[0].idiomas,
    tematicas: rows[0].tematicas,
    premios_ganados: rows[0].premios_ganados
  };

  res.status(200).json(documental);
}
