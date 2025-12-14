import { useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.id);
        router.push("/dashboard"); 
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Iniciar Sesión - Ambulante</title>
      </Head>

      <Header />

      <main className="login-wrapper">
        <div className="login-card">
          
          {/* Encabezado dentro de la tarjeta */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <span className="super-header">Comunidad</span>
            <h1 style={{ fontSize: '2rem', margin: '5px 0 10px 0', fontWeight: '900', lineHeight: '1' }}>
              Bienvenid@
            </h1>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>
              Ingresa tus datos para continuar.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="text"
                className="form-input"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-black" 
              style={{ width: '100%', fontSize: '0.9rem', padding: '14px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? "VERIFICANDO..." : "ENTRAR"}
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}