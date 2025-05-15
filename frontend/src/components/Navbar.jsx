import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';
import { AuthContext } from '../context/AuthContext';
import MonedaIcon from '../assets/monedaoronav.png';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, registrado, logout, monedas } = useContext(AuthContext);

  const handleLogoClick = () => {
    // Si está logeado, navegar a la página de usuario
    navigate(isAuthenticated ? '/usuario' : '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={logoJOLIblanco}
          alt="logo"
          className="logo-img"
          onClick={handleLogoClick}
        />
      </div>

      <div className="navbar-center">
        {isAuthenticated ? (
          <>
            <a href="/futbol" className="navbar-link">Fútbol</a>
            <a href="/basquet" className="navbar-link">Básquet</a>
          </>
        ) : (
          <>
            <a href="/futbol" className="navbar-link">Fútbol</a>
            <a href="/basquet" className="navbar-link">Básquet</a>
          </>
        )}
      </div>

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <button className="btn btn-light custom-btn" onClick={onLoginClick}>Acceder</button>
            {!registrado && (
              <button className="btn btn-light custom-btn" onClick={onRegisterClick}>Registrarse</button>
            )}
          </>
        ) : (
          <>
            <div className="monedas-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={MonedaIcon} alt="Moneda" style={{ width: '20px', height: '20px' }} />
              <span>{monedas}</span>
            </div>
            <button className="btn btn-light custom-btn" onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
