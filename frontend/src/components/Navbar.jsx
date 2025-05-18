import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';
import { AuthContext } from '../context/AuthContext';
import MonedaIcon from '../assets/monedaoronav.png';
import { Search, User, Menu, X } from 'lucide-react';

const Navbar = ({ onLoginClick, onRegisterClick, onSearch }) => {
  const navigate = useNavigate();
  const { isAuthenticated, registrado, logout, monedas } = useContext(AuthContext);

  const [query, setQuery] = useState('');
  const timeoutRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => navigate(isAuthenticated ? '/usuario' : '/');
  const handleLogout = () => { logout(); navigate('/'); };
  const handlePuntosTienda = () => navigate('/puntosTienda');
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (onSearch) onSearch(value.trim());
    }, 300);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logoJOLIblanco} alt="logo" className="logo-img" onClick={handleLogoClick} />
        <div className="desktop-links">
          <a href="/nosotros" className="navbar-link large-link">¿Quiénes somos?</a>
          <a href="/contacto" className="navbar-link large-link">Contacto</a>
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar equipos o ligas..."
            className="search-input"
            value={query}
            onChange={handleChange}
          />
        </div>

        <div className="desktop-buttons">
          {!isAuthenticated ? (
            <>
              <button className="btn btn-light custom-btn" onClick={onLoginClick}>Acceder</button>
              {!registrado && (
                <button className="btn btn-light custom-btn" onClick={onRegisterClick}>Registrarse</button>
              )}
            </>
          ) : (
            <>
              <div className="monedas-info">
                <img src={MonedaIcon} alt="Moneda" />
                <span>{monedas}</span>
              </div>

              <div className="user-menu">
                <button onClick={toggleMenu} className="btn btn-light custom-btn" aria-label="Menú usuario">
                  <User size={24} />
                </button>
                {menuOpen && (
                  <ul className="menu-dropdown">
                    <li className="menu-item" onClick={() => { navigate('/datosCuenta'); setMenuOpen(false); }}>Mi Cuenta</li>
                    <li className="menu-item" onClick={() => { handlePuntosTienda(); setMenuOpen(false); }}>Tienda de puntos</li>
                    <li className="menu-item logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Cerrar sesión</li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Botón hamburguesa para móvil */}
        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Abrir menú móvil">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú colapsable móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <a href="/nosotros" className="mobile-link">¿Quiénes somos?</a>
          <a href="/contacto" className="mobile-link">Contacto</a>
          {!isAuthenticated ? (
            <>
              <button className="mobile-link" onClick={onLoginClick}>Acceder</button>
              {!registrado && <button className="mobile-link" onClick={onRegisterClick}>Registrarse</button>}
            </>
          ) : (
            <>
              <div className="mobile-link">Monedas: {monedas}</div>
              <button className="mobile-link" onClick={() => { navigate('/datosCuenta'); setIsMobileMenuOpen(false); }}>Mi Cuenta</button>
              <button className="mobile-link" onClick={() => { handlePuntosTienda(); setIsMobileMenuOpen(false); }}>Tienda de puntos</button>
              <button className="mobile-link logout" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Cerrar sesión</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
