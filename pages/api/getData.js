import { getConnection } from "@/lib/connectionAdmin";

export default async function handler(req, res) {
  try {

    const conn = await getConnection();

  
    const [directors] = await conn.execute(`
      SELECT nombre AS director
      FROM participantes
      ORDER BY director
    `);
    const [editions] = await conn.execute(`
      SELECT idEdicion AS edicion, numEdicion
      FROM ediciones 
      ORDER BY idEdicion
    `);
    const[prizes]=  await conn.execute(`
    SELECT nombre AS premio,idFesPrem AS idPremio
    FROM fespremios
    ORDER BY premio
  `);
  const[languages]=  await conn.execute(`
  SELECT idIdioma, idioma
  FROM idiomas
  ORDER BY idioma
`);
const[topics]=  await conn.execute(`
SELECT idTematica,tematica
FROM tematicas
ORDER BY tematica
`);

    
    res.status(200).json({
      directors: directors,
      editions:editions,
      prizes:prizes,
      languages:languages,
      topics:topics
      
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la consulta" });
  }
}
