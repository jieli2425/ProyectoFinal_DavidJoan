import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';
import { AuthContext } from '../context/AuthContext';
import MonedaIcon from '../assets/monedaoronav.png';
import { Search } from 'lucide-react';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, registrado, logout, monedas } = useContext(AuthContext);

  const handleLogoClick = () => {
    navigate(isAuthenticated ? '/usuario' : '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePuntosTienda = () => {
    navigate('/puntosTienda');
  };

  // Estado y referencias para buscador
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const timeoutRef = useRef(null);

  const fetchResults = async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await fetch(`/api/partidos/search?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Error en la búsqueda');
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error(error);
      setResults([]);
      setShowResults(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchResults(value.trim());
    }, 300);
  };

  const handleSelect = (item) => {
    setQuery(item.competicion || `${item.equipoLocal} vs ${item.equipoVisitante}`);
    setShowResults(false);
    if (item._id) {
      navigate(`/partido/${item._id}`);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 150);
  };

  // Menú desplegable
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={logoJOLIblanco}
          alt="logo"
          className="logo-img"
          onClick={handleLogoClick}
        />
        <a href="/futbol" className="navbar-link large-link">Fútbol</a>
        <a href="/basquet" className="navbar-link large-link">Básquet</a>
      </div>

      <div className="navbar-right">
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar equipos o ligas..."
            className="search-input"
            value={query}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => query && setShowResults(true)}
            autoComplete="off"
          />
          {showResults && results.length > 0 && (
            <ul
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #ccc',
                maxHeight: '200px',
                overflowY: 'auto',
                margin: 0,
                padding: 0,
                listStyle: 'none',
                zIndex: 1000,
              }}
            >
              {results.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  style={{ padding: '6px 8px', cursor: 'pointer' }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {item.competicion ? item.competicion : `${item.equipoLocal} vs ${item.equipoVisitante}`}
                </li>
              ))}
            </ul>
          )}
        </div>

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

            {/* Icono de usuario/menu */}
            <div className="user-menu">
              <button
                className="btn btn-light custom-btn"
                onClick={toggleMenu}
                style={{ fontSize: '1.2rem', padding: '4px 10px' }}
              >
                ☰
              </button>
              {menuOpen && (
                <ul className="menu-dropdown">
                  <li className="menu-item" onClick={() => { handlePuntosTienda(); setMenuOpen(false); }}>
                    Tienda de puntos
                  </li>
                  <li className="menu-item logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                    Cerrar sesión
                  </li>
                </ul>
              )}
            </div>

          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
