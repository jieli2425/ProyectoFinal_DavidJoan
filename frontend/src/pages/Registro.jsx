import React, { useState } from 'react';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username })
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2>Registro</h2>
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Crear Cuenta</button>
    </div>
  );
};

export default Registro;