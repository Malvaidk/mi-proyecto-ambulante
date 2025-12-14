import { useState } from "react";
import { useRouter } from "next/router";
import styles from './addMovie.module.css'; 

export default function AgregarPelicula() {
  const router = useRouter();

  const [form, setForm] = useState({
    titulo: "",
    duracion: "",
    anioPub: "",
    sinopsis: "",
    imagen: "",
    iniciativa: "",
    descarga: "",
    // Ahora estos son textos simples
    numEdicion: "", 
    directorNombre: "",
    idiomas: "",   // Ej: "Español, Inglés"
    tematicas: "", // Ej: "Social, Música"
    premios: ""    // Ej: "Morelia, Cannes"
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    if (!form.titulo || !form.directorNombre || !form.numEdicion) {
      alert("Por favor completa los campos obligatorios (*)");
      return;
    }
  
    try {
      const res = await fetch("/api/addTittle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    
      const responseData = await res.json();
      
      if (res.ok) {
        alert("✅ " + responseData.message);
        router.push('/dashboard');
      } else {
        alert("❌ Error: " + responseData.message);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nueva Película (Ingreso Manual)</h1>
        <button onClick={() => router.push("/dashboard")} className={styles.backButton}>
          ← Cancelar
        </button>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          
          {/* TÍTULO */}
          <div className={styles.fullWidth}>
            <label className={styles.label}>Título Oficial *</label>
            <input
              className={styles.input}
              placeholder="Ej: Híbridos"
              value={form.titulo}
              onChange={e => handleChange("titulo", e.target.value)}
              required
            />
          </div>

          {/* DURACIÓN Y AÑO */}
          <div>
            <label className={styles.label}>Duración (min) *</label>
            <input
              type="number"
              className={styles.input}
              placeholder="90"
              value={form.duracion}
              onChange={e => handleChange("duracion", e.target.value)}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Año de Publicación *</label>
            <input
              type="number"
              className={styles.input}
              placeholder="2024"
              value={form.anioPub}
              onChange={e => handleChange("anioPub", e.target.value)}
              required
            />
          </div>

          {/* SINOPSIS */}
          <div className={styles.fullWidth}>
            <label className={styles.label}>Sinopsis *</label>
            <textarea
              className={styles.textarea}
              value={form.sinopsis}
              onChange={e => handleChange("sinopsis", e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* DIRECTOR Y EDICIÓN (MANUALES) */}
          <div>
            <label className={styles.label}>Nombre del Director *</label>
            <input
              className={styles.input}
              placeholder="Ej: Alfonso Cuarón"
              value={form.directorNombre}
              onChange={e => handleChange("directorNombre", e.target.value)}
              required
            />
            <small style={{fontSize: '0.75rem', color: '#666'}}>Debe estar registrado previamente.</small>
          </div>

          <div>
            <label className={styles.label}>Número de Edición *</label>
            <input
              type="number"
              className={styles.input}
              placeholder="Ej: 19"
              value={form.numEdicion}
              onChange={e => handleChange("numEdicion", e.target.value)}
              required
            />
          </div>

          {/* URLs */}
          <div>
            <label className={styles.label}>URL Imagen</label>
            <input
              type="url"
              className={styles.input}
              value={form.imagen}
              onChange={e => handleChange("imagen", e.target.value)}
            />
          </div>

          <div>
            <label className={styles.label}>URL Descarga</label>
            <input
              type="url"
              className={styles.input}
              value={form.descarga}
              onChange={e => handleChange("descarga", e.target.value)}
            />
          </div>

          <div className={styles.fullWidth}>
             <label className={styles.label}>Iniciativa</label>
             <input
              className={styles.input}
              value={form.iniciativa}
              onChange={e => handleChange("iniciativa", e.target.value)}
            />
          </div>

          {/* CAMPOS MULTIPLES MANUALES */}
          <div className={styles.fullWidth}>
            <h3 className={styles.sectionTitle}>Etiquetas (Separar por comas)</h3>
          </div>

          <div className={styles.fullWidth}>
            <label className={styles.label}>Idiomas</label>
            <input
              className={styles.input}
              placeholder="Ej: Español, Inglés, Maya"
              value={form.idiomas}
              onChange={e => handleChange("idiomas", e.target.value)}
            />
          </div>

          <div className={styles.fullWidth}>
            <label className={styles.label}>Temáticas</label>
            <input
              className={styles.input}
              placeholder="Ej: Social, Medio Ambiente, Música"
              value={form.tematicas}
              onChange={e => handleChange("tematicas", e.target.value)}
            />
          </div>

          <div className={styles.fullWidth}>
            <label className={styles.label}>Premios / Festivales</label>
            <input
              className={styles.input}
              placeholder="Ej: Festival de Cannes, Premio Ariel"
              value={form.premios}
              onChange={e => handleChange("premios", e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Guardar Película
          </button>

        </form>
      </div>
    </div>
  );
}