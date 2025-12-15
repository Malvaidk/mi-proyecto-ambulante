"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withRole from "@/utils/withRole";
import FormPelicula from "@/components/FormPelicula";
// Asegúrate de importar Header si quieres mantener la navegación global, 
// o déjalo sin Header para una vista admin más limpia.
import Header from "../../../components/Header"; 

function EditarDocumental() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para feedback visual

  const handleDelete = async () => {
    const ok = confirm(
      "¿ESTÁS SEGURO?\n\nEliminar este documental es irreversible. Se borrará de todas las giras y catálogos."
    );
  
    if (!ok) return;
    
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/deleteDocumental?id=${id}`, {
        method: "DELETE"
      });
    
      const responseData = await res.json();
    
      if (!res.ok) {
        alert(responseData.message || "Error al eliminar");
        setIsDeleting(false);
        return;
      }
    
      alert("Documental eliminado correctamente.");
      router.push("/dashboard"); 
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };
  
  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch("/api/getData").then(r => r.json()),
      fetch(`/api/getDocumentalById?id=${id}`).then(r => r.json())
    ]).then(([catalogs, doc]) => {
      // Si la API devuelve error o no encuentra el doc, doc.titulo será undefined
      if (!doc || doc.message) {
        console.error("Error cargando documental:", doc);
        return;
      }

      console.log("Datos recibidos de la API:", doc); // MIRA LA CONSOLA DEL NAVEGADOR

      setData(catalogs);
      setInitialForm({
        // 1. Datos Directos (Nombres idénticos a la Base de Datos)
        titulo: doc.titulo,
        duracion: doc.duracion,
        anioPub: doc.anioPub,       // Antes tenías: doc.anio_publicacion
        sinopsis: doc.sinopsis,
        imagen: doc.imagen,         // Antes tenías: doc.url_imagen
        iniciativa: doc.iniciativa,
        descarga: doc.descarga,     // Antes tenías: doc.url_descarga
        idEdicion: doc.idEdicion,   // Antes tenías: doc.edicion_presentada
        
        // 2. El director (Nombre que viene del JOIN en la API)
        director: doc.nombre_director || doc.director, 

        // 3. Arrays de IDs para las listas (Chips)
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
        // Opcional: router.push('/dashboard');
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
      <Head>
        <title>Editar: {initialForm.titulo} | Admin</title>
      </Head>

      <Header />

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