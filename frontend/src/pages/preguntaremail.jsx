import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'http://localhost:5000';

const PreguntarEmail = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg('');

  try {
    const res = await fetch(`${API_URL}/api/auth/solicitar-reset`, {  // URL backend fija aquí
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || 'Error al buscar el usuario');
    }

    navigate(`/recuperar-contrasena?token=${data.token}`);
  } catch (err) {
    setMsg(err.message || 'Error al enviar el formulario');
  }
};
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div className="terminos-container" style={{ maxWidth: '500px' }}>
          <h2 style={{ textAlign: 'center' }}>Introduce tu email</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              className="custom-btn"
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
              }}
            >
              Continuar
            </button>
          </form>
          {msg && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{msg}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreguntarEmail;
