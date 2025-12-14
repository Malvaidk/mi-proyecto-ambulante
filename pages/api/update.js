import { getConnection } from "../../lib/connectionAdmin";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { id, title, year, director, country, dates } = req.body;
    const conn = await getConnection();

    // DIRECTOR
    const [dir] = await conn.execute(
      "SELECT idDirector FROM director WHERE dir_name = ?",
      [director]
    );

    let directorId = dir.length
      ? dir[0].idDirector
      : (await conn.execute(
          "INSERT INTO director (dir_name) VALUES (?)",
          [director]
        ))[0].insertId;

    // PAÍS
    const [cty] = await conn.execute(
      "SELECT idCountry FROM country WHERE coun_name = ?",
      [country]
    );

    let countryId = cty.length
      ? cty[0].idCountry
      : (await conn.execute(
          "INSERT INTO country (coun_name) VALUES (?)",
          [country]
        ))[0].insertId;

    // DOCUMENTAL
    await conn.execute(
      `UPDATE documental
       SET doc_title=?, doc_year=?, idDirector=?, idCountry=?
       WHERE doc_id=?`,
      [title, year, directorId, countryId, id]
    );

    // FECHAS (simple: borrar y volver a insertar)
    await conn.execute(
      "DELETE FROM dateDocumental WHERE idDocumental=?",
      [id]
    );

    for (const d of dates) {
      await conn.execute(
        "INSERT INTO dateDocumental (idDocumental, dd_presentationDate) VALUES (?, ?)",
        [id, d]
      );
    }

    res.status(200).json({ message: "Actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar" });
  }
}
