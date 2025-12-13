import withRole from "../../utils/withRole";
import { useState } from "react";

export default function register() {
 
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    async function handleRegister(e) {
        e.preventDefault();
      
        fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              role: "admin_documentales"
            })
          });
          
      
        }
    
  
    return (
      <div>
        <h1>Registrar</h1>
  
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
  
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
  
        <button onClick={handleRegister}>Agregar</button>
      </div>
    );
  }




