"use client";
import { useEffect, useState } from "react";

export default function FormPelicula({
  initialData,
  data,
  onSubmit,
  submitText = "Guardar"
}) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        idiomasIds: initialData.idiomasIds || [],
        tematicasIds: initialData.tematicasIds || [],
        premiosIds: initialData.premiosIds || []
      });
    }
  }, [initialData]);

  if (!form) return <p>Cargando formulario...</p>;

  /* ======================
     HELPERS
  ====================== */

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMulti = (field, value) => {
    if (!Array.isArray(form[field])) return;
    if (!form[field].includes(value)) {
      setForm(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeMulti = (field, value) => {
    if (!Array.isArray(form[field])) return;
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter(v => v !== value)
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  /* ======================
     FORM
  ====================== */

  return (
    <form onSubmit={handleSubmit} className="form-pelicula">

      <h2>{submitText}</h2>

      {/* BÁSICOS */}
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
        placeholder="Año publicación"
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
        placeholder="URL imagen"
        value={form.imagen || ""}
        onChange={e => handleChange("imagen", e.target.value)}
      />

      <input
        placeholder="Iniciativa"
        value={form.iniciativa || ""}
        onChange={e => handleChange("iniciativa", e.target.value)}
      />

      <input
        placeholder="URL descarga"
        value={form.descarga || ""}
        onChange={e => handleChange("descarga", e.target.value)}
      />

      {/* DIRECTOR */}
      <select
        value={form.director}
        onChange={e => handleChange("director", e.target.value)}
        required
      >
        <option value="">Selecciona director</option>
        {data.directors.map(d => (
          <option key={d.curp} value={d.director}>
            {d.director}
          </option>
        ))}
      </select>

      {/* EDICIÓN */}
      <select
        value={form.edicion}
        onChange={e => handleChange("idEdicion", e.target.value)}
        required
      >
        <option value="">Selecciona edición</option>
        {data.editions.map(e => (
          <option key={e.edicion} value={e.edicion}>
            Edición {e.numEdicion}
          </option>
        ))}
      </select>

      {/* IDIOMAS */}
      <h4>Idiomas</h4>
      <select onChange={e => addMulti("idiomasIds", Number(e.target.value))}>
        <option value="">Agregar idioma</option>
        {data.languages.map(i => (
          <option key={i.idIdioma} value={i.idIdioma}>
            {i.idioma}
          </option>
        ))}
      </select>

      <ul>
        {form.idiomasIds.map(id => {
          const idioma = data.languages.find(i => i.idIdioma === id);
          return (
            <li key={id}>
              {idioma?.idioma}
              <button
                type="button"
                onClick={() => removeMulti("idiomasIds", id)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      {/* TEMÁTICAS */}
      <h4>Temáticas</h4>
      <select onChange={e => addMulti("tematicasIds", Number(e.target.value))}>
        <option value="">Agregar temática</option>
        {data.topics.map(t => (
          <option key={t.idTematica} value={t.idTematica}>
            {t.tematica}
          </option>
        ))}
      </select>

      <ul>
        {form.tematicasIds.map(id => {
          const t = data.topics.find(x => x.idTematica === id);
          return (
            <li key={id}>
              {t?.tematica}
              <button
                type="button"
                onClick={() => removeMulti("tematicasIds", id)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      {/* PREMIOS */}
      <h4>Premios</h4>
      <select onChange={e => addMulti("premiosIds", Number(e.target.value))}>
        <option value="">Agregar premio</option>
        {data.prizes.map(p => (
          <option key={p.idPremio} value={p.idPremio}>
            {p.premio}
          </option>
        ))}
      </select>

      <ul>
        {form.premiosIds.map(id => {
          const p = data.prizes.find(x => x.idPremio === id);
          return (
            <li key={id}>
              {p?.premio}
              <button
                type="button"
                onClick={() => removeMulti("premiosIds", id)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <button type="submit">{submitText}</button>
    </form>
  );
}
