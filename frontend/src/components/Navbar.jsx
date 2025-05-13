import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, registrado, logout } = useContext(AuthContext);

  const handleLogoClick = () => {
    navigate('/');
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
        <a href="/futbol" className="navbar-link">Fútbol</a>
        <a href="/basquet" className="navbar-link">Básquet</a>
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
          <button className="btn btn-light custom-btn" onClick={handleLogout}>Cerrar sesión</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
