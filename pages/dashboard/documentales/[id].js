"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withRole from "@/utils/withRole";
import FormPelicula from "@/components/FormPelicula";

function EditarDocumental() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = confirm(
      "¿ESTÁS SEGURO?\n\nEsta acción eliminará la película y todas sus relaciones (idiomas, temas, etc).\nNo se puede deshacer."
    );
  
    if (!ok) return;
  
    try {
      const res = await fetch(`/api/deleteDocumental?id=${id}`, {
        method: "DELETE"
      });
    
      const data = await res.json();
    
      if (!res.ok) {
        throw new Error(data.message || "Error desconocido");
      }
    
      alert("Eliminado con éxito.");
      router.push("/dashboard");
      
    } catch (error) {
      alert("No se pudo eliminar: " + error.message);
    }
  };
  
  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch("/api/getData").then(r => r.json()),
      fetch(`/api/getDocumentalById?id=${id}`).then(r => r.json())
    ]).then(([catalogs, doc]) => {
      if (!doc || doc.message) {
        console.error("Error cargando documental:", doc);
        return;
      }

      console.log("Datos recibidos de la API:", doc); 

      setData(catalogs);
      setInitialForm({
        titulo: doc.titulo,
        duracion: doc.duracion,
        anioPub: doc.anioPub,      
        sinopsis: doc.sinopsis,
        imagen: doc.imagen,         
        iniciativa: doc.iniciativa,
        descarga: doc.descarga,     
        idEdicion: doc.idEdicion,   
        
        director: doc.nombre_director || doc.director, 

        idiomasIds: doc.idiomasIds || [],
        tematicasIds: doc.tematicasIds || [],
        premiosIds: doc.premiosIds || []
      });
    }).catch(err => console.error("Error en Promise.all:", err));
  }, [id]);

  const handleUpdate = async form => {
    try {
      const res = await fetch(`/api/update?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const resData = await res.json();
      if(res.ok) {
        alert("¡Documental actualizado con éxito!");
      } else {
        alert("Error: " + resData.message);
      }
    } catch (error) {
      alert("Error de conexión al actualizar");
    }
  };

  if (!data || !initialForm) return (
    <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      Cargando editor...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <main className="admin-page-container">
        
        {/* CABECERA ADMIN */}
        <section className="admin-header">
          <div>
            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Editando Documental
            </span>
            <h1 className="admin-title">{initialForm.titulo}</h1>
          </div>
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Volver al Dashboard
          </button>
        </section>

        {/* TARJETA DEL FORMULARIO */}
        <div className="edit-card">
          <FormPelicula
            initialData={initialForm}
            data={data}
            onSubmit={handleUpdate}
            submitText="Guardar Cambios"
          />
        </div>

        {/* ZONA DE PELIGRO */}
        <div className="danger-zone">
          <div className="danger-text">
            <h4>Eliminar Documental</h4>
            <p>Esta acción borrará permanentemente el documental y no se puede deshacer.</p>
          </div>
          <button
            onClick={handleDelete}
            className="btn-delete"
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar definitivamente"}
          </button>
        </div>

      </main>
    </div>
  );
}

export default withRole(EditarDocumental, ["admin_documentales"]);