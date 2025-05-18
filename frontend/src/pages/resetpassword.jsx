import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/terminos.css';

const API_URL = 'http://localhost:5000';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMsg('Token inválido o no proporcionado');
      return;
    }

    if (newPassword !== repeatPassword) {
      setMsg('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setMsg('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/');
      } else {
        setMsg(data.msg || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setMsg('Error de servidor');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <div className="terminos-container" style={{ maxWidth: '500px' }}>
          <h2 style={{ textAlign: 'center' }}>Restablecer contraseña</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <input
              type="password"
              placeholder="Repetir contraseña"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
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
              Enviar
            </button>
          </form>
          {msg && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{msg}</p>}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
