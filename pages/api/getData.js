import { getConnection } from "@/lib/connectionAdmin";

export default async function handler(req, res) {
  try {
    
    const conn = await getConnection();

  
    const [directors] = await conn.execute(`
      SELECT dir_name AS director,idDirector as selector
      FROM director
      ORDER BY director 
    `);
    const [countries] = await conn.execute(`
      SELECT coun_name AS country, idCountry as selector
      FROM country
      ORDER BY country 
    `);

    
    res.status(200).json({
      directors: directors,
      countries: countries
      
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la consulta" });
  }
}
