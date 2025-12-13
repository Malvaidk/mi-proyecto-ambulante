import { getConnection } from "../../lib/connection";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { title, year, director, country, presentationDate } = req.body;

  if (!title || !year || !director || !country || !presentationDate) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const conn = await getConnection();

  try {
    await conn.beginTransaction();

    // ================= DIRECTOR =================
    const [dirRows] = await conn.execute(
      "SELECT idDirector FROM director WHERE dir_name = ?",
      [director]
    );

    let directorId;
    if (dirRows.length > 0) {
      directorId = dirRows[0].idDirector;
    } else {
      const [dirResult] = await conn.execute(
        "INSERT INTO director (dir_name) VALUES (?)",
        [director]
      );
      directorId = dirResult.insertId;
    }

    // ================= COUNTRY =================
    const [countryRows] = await conn.execute(
      "SELECT idCountry FROM country WHERE coun_name = ?",
      [country]
    );

    let countryId;
    if (countryRows.length > 0) {
      countryId = countryRows[0].idCountry;
    } else {
      const [countryResult] = await conn.execute(
        "INSERT INTO country (coun_name) VALUES (?)",
        [country]
      );
      countryId = countryResult.insertId;
    }

    // ================= DOCUMENTAL =================
    const [docResult] = await conn.execute(
      `INSERT INTO documental 
       (doc_title, doc_year, idDirector, idCountry)
       VALUES (?, ?, ?, ?)`,
      [title, year, directorId, countryId]
    );

    const documentalId = docResult.insertId;

    // ================= DATE DOCUMENTAL =================
    await conn.execute(
      `INSERT INTO dateDocumental 
       (idDocumental, dd_presentationDate)
       VALUES (?, ?)`,
      [documentalId, presentationDate]
    );

    await conn.commit();

    res.status(200).json({
      message: "Documental y fecha de presentación agregados correctamente"
    });

  } catch (error) {
    await conn.rollback();
    console.error("ERROR:", error);
    res.status(500).json({ message: "Error al guardar el documental" });
  }
}
