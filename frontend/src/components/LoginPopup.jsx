import React, { useState } from 'react';
import '../../css/loginPopup.css';
import logoJOLIazul from '../assets/LogoJOLIAzul.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const LoginPopup = ({ onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier.includes('@') ? identifier : undefined,
          username: identifier.includes('@') ? undefined : identifier,
          password
        })
      });

      const data = await res.json();
      if (data.token) {
        login(data.token, data.nombre, data.isAdmin);
        if (data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/usuario');
        }
        onClose(true);
      } else {
        alert(data.msg || data.message);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Error al intentar iniciar sesión');
    }
  };

  const handleClosePopup = (e) => {
    if (e.target.classList.contains('login-popup-container')) {
      onClose(false);
    }
  };

  return (
    <div className="login-popup-container" onClick={handleClosePopup}>
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>
        <div className="login-logo">
          <img src={logoJOLIazul} alt="logo" className="logo-img" />
        </div>
        <h2>Iniciar Sesión</h2>
        <div className="input-wrapper">
          <div className="containerInput">
            <input
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Email o nombre de usuario"
              className="login-input"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="login-input"
            />
          </div>
        </div>

        <div className="buttons-container">
          <button onClick={handleLogin} className="login-btn">Entrar</button>
        </div>
        <div className="links-container">
          <a href="/recuperar-contrasena" className="link">¿Has olvidado tu contraseña?</a>
          <a href="/registro" className="link">¿Nuevo Usuario? Regístrate</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
