import React, { useState } from 'react';

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      onClose(true);
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button onClick={handleLogin}>Entrar</button>
      <button onClick={() => onClose(false)}>Cerrar</button>
    </div>
  );
};

export default LoginPopup;