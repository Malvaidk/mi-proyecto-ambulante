import { useState, useEffect } from "react";

export default function FormPelicula({ initialData, data, onSubmit, submitText }) {
  const [form, setForm] = useState({
    titulo: "",
    duracion: "",
    anioPub: "",
    sinopsis: "",
    imagen: "",
    descarga: "",
    idEdicion: "",
    director: "", 
    idiomasIds: [],
    tematicasIds: [],
    premiosIds: []
  });

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* Lógica para agregar/quitar elementos de las listas */
  const handleAddItem = (selectId, listName) => {
    const select = document.getElementById(selectId);
    if (!select) return;
    const value = parseInt(select.value);
    
    if (!value) return; 

    if (form[listName]?.includes(value)) {
      alert("Ya agregaste este elemento.");
      return;
    }

    setForm({
      ...form,
      [listName]: [...(form[listName] || []), value]
    });
    
    select.value = ""; 
  };

  const handleRemoveItem = (idToRemove, listName) => {
    setForm({
      ...form,
      [listName]: form[listName].filter(id => id !== idToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Helpers para mostrar nombres en los chips
  const getNombre = (list, id, idKey) => list?.find(item => item[idKey] === id)?.nombre || list?.find(item => item[idKey] === id)?.idioma || "Cargando...";

  // Evitar error si data es null
  const safeData = data || {};

  return (
    <form onSubmit={handleSubmit} className="form-admin">
      
      {/* --- DATOS BÁSICOS --- */}
      <div className="form-group">
        <label>Título:</label>
        <input type="text" name="titulo" value={form.titulo || ""} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Duración (min):</label>
        <input type="text" name="duracion" value={form.duracion || ""} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Año Publicación:</label>
        <input type="number" name="anioPub" value={form.anioPub || ""} onChange={handleChange} />
      </div>

      <div className="form-group full-width">
        <label>Sinopsis:</label>
        <textarea name="sinopsis" rows="3" value={form.sinopsis || ""} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>URL Imagen:</label>
        <input type="url" name="imagen" value={form.imagen || ""} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Link Video/Descarga:</label>
        <input type="text" name="descarga" value={form.descarga || ""} onChange={handleChange} />
      </div>

      {/* --- SELECTOR DE DIRECTOR --- */}
      <div className="form-group full-width">
        <label>Director:</label>
        <select name="director" value={form.director || ""} onChange={handleChange} required>
          <option value="">-- Selecciona director --</option>
          {(safeData.directores || []).map((d) => (
            <option key={d.curp} value={d.director}>{d.director}</option>
          ))}
        </select>
      </div>

      {/* --- SELECTOR DE EDICIÓN --- */}
      <div className="form-group full-width">
        <label>Edición:</label>
        <select name="idEdicion" value={form.idEdicion || ""} onChange={handleChange} required>
          <option value="">-- Selecciona edición --</option>
          {(safeData.ediciones || []).map((e) => (
            <option key={e.idEdicion} value={e.idEdicion}>
              Edición {e.numEdicion} ({new Date(e.fechaInicio).getFullYear()})
            </option>
          ))}
        </select>
      </div>

      <hr style={{ gridColumn: '1 / -1', margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

      {/* --- IDIOMAS --- */}
      <div className="form-group full-width">
        <h4>Idiomas</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select id="selIdioma">
            <option value="">-- Agregar idioma --</option>
            {(safeData.idiomas || []).map(i => (
              <option key={i.idIdioma} value={i.idIdioma}>{i.idioma}</option>
            ))}
          </select>
          <button type="button" onClick={() => handleAddItem("selIdioma", "idiomasIds")}>+</button>
        </div>
        <ul style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
          {form.idiomasIds?.map(id => (
            <li key={id} style={{ background:'#eee', padding:'2px 8px', borderRadius:'10px' }}>
              {getNombre(safeData.idiomas, id, 'idIdioma')}
              <button type="button" onClick={() => handleRemoveItem(id, "idiomasIds")} style={{marginLeft:'5px', color:'red', border:'none'}}>x</button>
            </li>
          ))}
        </ul>
      </div>

      {/* --- SECCIÓN TEMÁTICAS --- */}
      <div className="form-group full-width">
        <h4>Temáticas</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select id="selTematica">
            <option value="">-- Agregar temática --</option>
            {(safeData.tematicas || []).map(t => (
              <option key={t.idTematica} value={t.idTematica}>
                {t.nombre || t.tematica} 
              </option>
            ))}
          </select>
          <button type="button" onClick={() => handleAddItem("selTematica", "tematicasIds")}>+</button>
        </div>
        
        <ul style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
          {form.tematicasIds?.map(id => {
            // Buscamos el item en la lista
            const item = safeData.tematicas?.find(t => t.idTematica === id);
            // Mostramos el texto correcto
            const texto = item ? (item.nombre || item.tematica) : "Cargando...";
            
            return (
              <li key={id} style={{ background:'#eee', padding:'2px 8px', borderRadius:'10px' }}>
                {texto}
                <button type="button" onClick={() => handleRemoveItem(id, "tematicasIds")} style={{marginLeft:'5px', color:'red', border:'none'}}>x</button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- PREMIOS (fespremios) --- */}
      <div className="form-group full-width">
        <h4>Premios / Festivales</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select id="selPremio">
            <option value="">-- Agregar premio --</option>
            {(safeData.premios || []).map(p => (
              <option key={p.idFesPrem} value={p.idFesPrem}>{p.nombre}</option>
            ))}
          </select>
          <button type="button" onClick={() => handleAddItem("selPremio", "premiosIds")}>+</button>
        </div>
        <ul style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
          {form.premiosIds?.map(id => (
            <li key={id} style={{ background:'#eee', padding:'2px 8px', borderRadius:'10px' }}>
              {getNombre(safeData.premios, id, 'idFesPrem')}
              <button type="button" onClick={() => handleRemoveItem(id, "premiosIds")} style={{marginLeft:'5px', color:'red', border:'none'}}>x</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" style={{ marginTop: '20px', padding:'15px', background:'black', color:'white', border:'none', cursor:'pointer' }}>
        {submitText || "Guardar Cambios"}
      </button>

    </form>
  );
}