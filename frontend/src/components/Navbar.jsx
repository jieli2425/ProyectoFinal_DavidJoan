import React from 'react';
import '../../css/navbar.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';

const Navbar = ({ onLoginClick, onRegisterClick }) => (
  <nav className="navbar">
    <div className="navbar-left">
      <img src={logoJOLIblanco} alt="logo" className="logo-img" />
      
    </div>

    <div className="navbar-center">
      <a href="/futbol" className="navbar-link">Fútbol</a>
      <a href="/basquet" className="navbar-link">Básquet</a>
    </div>

    <div className="navbar-right">
      <button className="btn btn-light custom-btn" onClick={onLoginClick}>Acceder</button>
      <button className="btn btn-light custom-btn" onClick={onRegisterClick}>Registrarse</button>
    </div>
  </nav>
);

export default Navbar;
