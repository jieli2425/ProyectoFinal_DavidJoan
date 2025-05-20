import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../css/registro.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Registro = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nie, setNie] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edadError, setEdadError] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);

  const validarEdad = (fecha) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      setEdadError('Debes tener al menos 18 años');
    } else {
      setEdadError('');
    }
  };

  const handleFechaNacimiento = (e) => {
    const fecha = e.target.value;
    setFechaNacimiento(fecha);
    validarEdad(fecha);
  };

  const handleRegister = async () => {
    if (edadError) {
      alert('No puedes registrarte si no tienes 18 años');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        nombre,
        email,
        emailConfirm,
        password,
        passwordConfirm,
        nie,
        fechaNacimiento,
        isAdmin
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Cuenta creada correctamente');
      navigate('/');
    } else {
      alert(data.msg || data.message);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="registro-container">
        <h2>Registro</h2>
        <input className="registro-input" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="registro-input" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input className="registro-input" placeholder="NIE" value={nie} onChange={e => setNie(e.target.value)} />

        <input type="date" className="registro-input" value={fechaNacimiento} onChange={handleFechaNacimiento} />
        {edadError && <p className="registro-error">{edadError}</p>}

        <input className="registro-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="registro-input" placeholder="Confirmar Email" value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} />

        <input type="password" className="registro-input" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="password" className="registro-input" placeholder="Confirmar Contraseña" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />

        <label>
          <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
          ¿Registrar como administrador?
        </label>

        <button className="registro-button" onClick={handleRegister}>Crear Cuenta</button>
      </div>

      <Footer />
    </div>
  );
};

export default Registro;
