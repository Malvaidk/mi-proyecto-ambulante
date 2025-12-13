import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  const { id } = req.query;
  const conn = await getConnection();

  const [rows] = await conn.execute(
    `
    SELECT 
      d.idDoc,
      d.doc_title AS title,
      d.doc_year AS year,
      dr.dir_name AS director,
      c.coun_name AS country,
      dd.dd_presentationDate AS presentationDate
    FROM documental d
    JOIN director dr ON d.idDirector = dr.idDirector
    JOIN country c ON d.idCountry = c.idCountry
    LEFT JOIN dateDocumental dd ON d.idDoc = dd.idDocumental
    WHERE d.idDoc = ?
    `,
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json(null);
  }
  console.log("nueva consulta")
  console.log(rows);
 
  // Agrupar fechas
  const documental = {
    idDoc: rows[0].idDoc,
    title: rows[0].title,
    year: rows[0].year,
    director: rows[0].director,
    country: rows[0].country,
    dates: rows
      .map(r => r.presentationDate)
      .filter(Boolean)
  };

  res.status(200).json(documental);
}
