"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withRole from "@/utils/withRole";
import FormPelicula from "@/components/FormPelicula";

function EditarDocumental() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const handleDelete = async () => {
    const ok = confirm(
      "¿Estás seguro de eliminar este documental?\nEsta acción no se puede deshacer."
    );
  
    if (!ok) return;
  
    const res = await fetch(`/api/deleteDocumental?id=${id}`, {
      method: "DELETE"
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.message || "Error al eliminar");
      return;
    }
  
    alert(data.message);
    router.push("/dashboard"); // o donde listes todos
  };
  
  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch("/api/getData").then(r => r.json()),
      fetch(`/api/getDocumentalById?id=${id}`).then(r => r.json())
    ]).then(([catalogs, doc]) => {
      setData(catalogs);
      setInitialForm({
        titulo: doc.titulo,
        duracion: doc.duracion,
        anioPub: doc.anio_publicacion,
        sinopsis: doc.sinopsis,
        imagen: doc.url_imagen,
        iniciativa: doc.iniciativa,
        descarga: doc.url_descarga,
        idEdicion: doc.edicion_presentada,
        director: doc.director,
        idiomas: doc.idiomas,
        tematicas: doc.tematicas,
        premios: doc.premios_ganados,
        idiomasIds: doc.idiomasIds,
         tematicasIds: doc.tematicasIds,
        premiosIds: doc.premiosIds
      });
    });
  }, [id]);

  const handleUpdate = async form => {
    const res = await fetch(`/api/update?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
    
  };

  if (!data || !initialForm) return <p>Cargando...</p>;

  return (
    <div>
      <section className="documental-actions">
          <button onClick={() => router.push("/dashboard")}>
            ← Volver al dashboard
          </button>
        </section>
    <FormPelicula
      initialData={initialForm}
      data={data}
      onSubmit={handleUpdate}
      submitText="Actualizar documental"
    />
    <button
  onClick={handleDelete}
  style={{ background: "#c62828", color: "white" }}
>
  Eliminar
</button>

    </div>
  );
}

export default withRole(EditarDocumental, ["admin_documentales"]);
