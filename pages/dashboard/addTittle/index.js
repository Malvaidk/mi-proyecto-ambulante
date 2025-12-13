"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withRole from "@/utils/withRole";

function AgregarDocumental() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [country, setCountry] = useState("");
  const [presentationDate, setPresentationDate] = useState("");

  const [directorsList, setDirectorsList] = useState([]);
  const [countriesList, setCountriesList] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/getData")
      .then(res => res.json())
      .then(data => {
        setDirectorsList(data.directors);
        setCountriesList(data.countries);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title,year,director,country);
    if (!title || !year || !director || !country) {
       
      alert("Todos los campos son obligatorios");
      return;
    }

    const res = await fetch("/api/addTittle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, year, director, country, presentationDate }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Documental agregado correctamente");
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2 onClick={() => router.push("/dashboard")}>← Regresar</h2>
      <h1>Agregar Documental</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          placeholder="Año"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <label>Fecha de presentación:</label>
        <input
        type="date"
        value={presentationDate}
        onChange={e => setPresentationDate(e.target.value)}
        />


        {/* DIRECTOR */}
        <label>Director existente:</label>
        <select
          onChange={e => setDirector(e.target.value)}
          value=""
        >
          <option value="">Selecciona uno</option>
          {directorsList.map(d => (
            <option key={d.idDirector} value={d.director}>
              {d.director}
            </option>
          ))}
        </select>

        <p>O escribe un nuevo director:</p>
        <input
          placeholder="Nuevo director"
          onChange={e => setDirector(e.target.value)}
        />

        {/* PAÍS */}
        <label>País existente:</label>
        <select
          onChange={e => setCountry(e.target.value)}
          value=""
        >
          <option value="">Selecciona uno</option>
          {countriesList.map(c => (
            <option key={c.idCountry} value={c.country}>
              {c.country}
            </option>
          ))}
        </select>

        <p>O escribe un nuevo país:</p>
        <input
          placeholder="Nuevo país"
          onChange={e => setCountry(e.target.value)}
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default withRole(AgregarDocumental, ["admin_documentales"]);
