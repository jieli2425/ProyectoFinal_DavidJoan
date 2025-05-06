import React from 'react';

const Navbar = ({ onLoginClick, onRegisterClick }) => (
  <nav>
    <h1>Apuestas Deportivas</h1>
    <button onClick={onLoginClick}>Acceder</button>
    <button onClick={onRegisterClick}>Registrarse</button>
  </nav>
);

export default Navbar;