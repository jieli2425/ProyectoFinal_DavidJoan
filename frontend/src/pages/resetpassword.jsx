import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      setMsg('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/'); // redirige al menú principal
      } else {
        setMsg(data.msg || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setMsg('Error de servidor');
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
        <h2>Restablecer contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Enviar
          </button>
        </form>
        {msg && <p style={{ color: 'red', marginTop: '10px' }}>{msg}</p>}
      </div>

      <Footer />
    </>
  );
};

export default ResetPassword;
