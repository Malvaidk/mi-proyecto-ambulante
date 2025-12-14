"use client";
import { useState } from "react";
import withRole from "@/utils/withRole";
import { useRouter } from "next/router";

function AgregarPelicula() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    
    titulo: "",
    duracion: "",
    anioPub: "",
    sinopsis: "",
    imagen: "",
    iniciativa: "",
    descarga: "",
    idEdicion: "",
    director: ""
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      pelicula: {
        ...form
      },
      idiomas: [1, 2],
      tematicas: [3, 5],
      premios: [2],
      participantes: [
        { curp: form.director, rol: "Director" }
      ]
    };

    const res = await fetch("/api/addTittle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <form onSubmit={handleSubmit} className="form-pelicula">
     
      <input
        placeholder="Título"
        value={form.titulo}
        onChange={e => handleChange("titulo", e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Duración (min)"
        value={form.duracion}
        onChange={e => handleChange("duracion", e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Año de publicación"
        value={form.anioPub}
        onChange={e => handleChange("anioPub", e.target.value)}
        required
      />

      <textarea
        placeholder="Sinopsis"
        value={form.sinopsis}
        onChange={e => handleChange("sinopsis", e.target.value)}
        rows={4}
        required
      />

      <input
        type="url"
        placeholder="URL de la imagen"
        value={form.imagen}
        onChange={e => handleChange("imagen", e.target.value)}
      />

      <input
        placeholder="Iniciativa (ej. Gira Ambulante)"
        value={form.iniciativa}
        onChange={e => handleChange("iniciativa", e.target.value)}
      />

      <input
        type="url"
        placeholder="URL de descarga / visualización"
        value={form.descarga}
        onChange={e => handleChange("descarga", e.target.value)}
      />

      <input
        type="number"
        placeholder="ID de edición"
        value={form.idEdicion}
        onChange={e => handleChange("idEdicion", e.target.value)}
        required
      />

      <input
        placeholder="CURP del director"
        value={form.director}
        onChange={e => handleChange("director", e.target.value)}
        required
      />

      <button type="submit">
        Guardar película
      </button>
    </form>
  );
}

export default withRole(AgregarPelicula, ["admin_documentales"]);
