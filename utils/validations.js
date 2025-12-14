export function validatePelicula(form) {
    const errors = {};
    const currentYear = new Date().getFullYear();
  
    /* ===== CAMPOS BÁSICOS ===== */
    if (!form.titulo?.trim()) {
      errors.titulo = "El título es obligatorio";
    }
  
    if (!form.duracion || Number(form.duracion) <= 0) {
      errors.duracion = "La duración debe ser mayor a 0";
    }
  
    if (
      !form.anioPub ||
      form.anioPub.length !== 4 ||
      Number(form.anioPub) > currentYear
    ) {
      errors.anioPub = "Año inválido";
    }
  
    if (!form.sinopsis?.trim()) {
      errors.sinopsis = "La sinopsis es obligatoria";
    }
  
    /* ===== URLS ===== */
    const urlRegex = /^https?:\/\/.+/;
  
    if (form.imagen && !urlRegex.test(form.imagen)) {
      errors.imagen = "URL de imagen inválida";
    }
  
    if (form.descarga && !urlRegex.test(form.descarga)) {
      errors.descarga = "URL de descarga inválida";
    }
  
    /* ===== RELACIONES ===== */
    if (!form.director) {
      errors.director = "Selecciona un director";
    }
  
    if (!form.idEdicion) {
      errors.idEdicion = "Selecciona una edición";
    }
  
    if (!Array.isArray(form.idiomas) || form.idiomas.length === 0) {
      errors.idiomas = "Selecciona al menos un idioma";
    }
  
    if (!Array.isArray(form.tematicas) || form.tematicas.length === 0) {
      errors.tematicas = "Selecciona al menos una temática";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  