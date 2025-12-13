"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withRole from "@/utils/withRole";

function DocumentalDetail() {
    const[datesToDelete,setDatesToDelete]=useState([])
    const [form, setForm] = useState({
        title: "",
        year: "",
        director: "",
        country: "",
        dates: [],
       
      });
  const router = useRouter();
  const { id } = router.query;
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  async function handleSave() {
    const res = await fetch("/api/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form })
    });
  
    if (res.ok) alert("Documental actualizado");
    else alert("Error al actualizar");
  }
  function handleRemoveDate(date) {
    setForm(prev => ({
      ...prev,
      dates: prev.dates.filter(d => d !== date),
    }));
  
    setDatesToDelete(prev => [...prev, date]);
  }
  async function handleDelete() {
    const confirmDelete = confirm(
      "¿Estás seguro de eliminar este documental? Esta acción no se puede deshacer."
    );
  
    if (!confirmDelete) return;
  
    const res = await fetch(`/api/deleteDocumental?id=${id}`, {
      method: "DELETE"
    });
  
    if (res.ok) {
      alert("Documental eliminado");
      router.push("/dashboard");
    } else {
      alert("Error al eliminar documental");
    }
  }
  
  
  function handleRestoreDate(date) {
    setDatesToDelete(prev => prev.filter(d => d !== date));
  
    setForm(prev => ({
      ...prev,
      dates: [...prev.dates, date],
    }));
  }
  
  
  
  useEffect(() => {
    if (!id) return;
  
    fetch(`/api/getDocumentalById?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setDoc(data);
        setForm({

          title: data.title,
          year: data.year,
          director: data.director,
          country: data.country,
          dates: data.dates
        });
        setLoading(false);
      });
  }, [id]);
  

  if (loading) return <p>Cargando...</p>;
  if (!doc) return <p>No encontrado</p>;

  return (
    
    <div>
         <h2 onClick={() => router.push("/dashboard")}>← Regresar</h2>
        <input
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
        value={form.year}
        onChange={e => setForm({ ...form, year: e.target.value })}
        />

        <input
        value={form.director}
        onChange={e => setForm({ ...form, director: e.target.value })}
        />

        <input
        value={form.country}
        onChange={e => setForm({ ...form, country: e.target.value })}
        />
        <input
            type="date"
            onChange={e =>
                setForm({
                ...form,
                dates: [...form.dates, e.target.value]
                })
            }
            />

<ul>
  {form.dates.map((d, i) => (
    <li key={i}>
      {d}
      <button onClick={() => handleRemoveDate(d)}>
        Quitar
      </button>
    </li>
  ))}
</ul>

{datesToDelete !=undefined && (
  <>
    <h4>Fechas eliminadas</h4>
    <ul>
      {datesToDelete.map((d, i) => (
        <li key={i}>
          {d}
          <button onClick={() => handleRestoreDate(d)}>
            Restaurar
          </button>
        </li>
      ))}
    </ul>
  </>
)}

            <button onClick={handleSave}>
                Guardar cambios
            </button>
            <button
  style={{ background: "red", color: "white" }}
  onClick={handleDelete}
>
  Eliminar documental
</button>


    </div>
  );
}

export default withRole(DocumentalDetail, ["admin_documentales"]);
