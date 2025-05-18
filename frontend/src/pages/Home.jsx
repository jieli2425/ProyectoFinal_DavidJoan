import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import para navegar desde Home
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginPopup from '../components/LoginPopup';
import '../../css/home.css';
import banderaEspaña from '../assets/banderaespaña.png';
import banderaInglaterra from '../assets/banderainglaterra.png';
import banderaUE from '../assets/banderaue.png';
import laliga from '../assets/laliga.png';
import premierleague from '../assets/premierleague.png';
import championsleague from '../assets/championsleague.png';
import futbolicono from '../assets/logofutbol.png';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [partidosPremierLeague, setPartidosPremierLeague] = useState([]);
  const [partidosChampionsLeague, setPartidosChampionsLeague] = useState([]);

  // Estados para resultados de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/partidos')
      .then(res => res.json())
      .then(setPartidos);

    fetch('/api/partidos/premier-league')
      .then(res => res.json())
      .then(setPartidosPremierLeague);

    fetch('/api/partidos/champions-league')
      .then(res => res.json())
      .then(setPartidosChampionsLeague);
  }, []);

  const partidosFutbol = partidos.filter(p => p.deporte === 'futbol');
  const partidosBasquet = partidos.filter(p => p.deporte === 'basquet');

  // Función para manejar búsqueda desde Navbar
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/partidos/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error en la búsqueda');
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    }
  };

  // Función para cuando seleccionas un partido buscado
  const handleSelectSearchResult = (item) => {
    setSearchQuery('');
    setSearchResults([]);
    if (item._id) {
      navigate(`/partido/${item._id}`);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => window.location.href = '/registro'}
        onSearch={handleSearch} // PASAMOS la función al Navbar
      />
      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}

      <div className="home-content">
        {/* Si hay resultados de búsqueda, los mostramos */}
        {searchResults.length > 0 && searchQuery ? (
          <div style={{ marginBottom: '1rem' }}>
            <h2>Resultados de búsqueda para: "{searchQuery}"</h2>


            {searchResults.map(item => (
              <div
                key={item._id}
                className="partido-card"
              // quitamos el onClick para evitar conflicto con el botón apostar
              >
                <span className="partido-equipos">
                  {item.equipoLocal && item.equipoVisitante
                    ? `${item.equipoLocal} vs ${item.equipoVisitante}`
                    : item.competicion}
                </span>
                <input
                  type="text"
                  className="hora-input"
                  value={new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  readOnly
                />
                <button
                  className="btn btn-light btn-sm apostar-btn"
                  onClick={() => setLoginOpen(true)}
                >
                  Apostar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="ligas-grid">
              <div className="liga-card" onClick={() => scrollToSection('liga-espanola')}>
                <img src={banderaEspaña} alt="España" className="liga-img" />
                <img src={futbolicono} alt="Pelota de Futbol" className="liga-icon" />
                <h3>Liga EA Sports</h3>
              </div>
              <div className="liga-card" onClick={() => scrollToSection('premier-league')}>
                <img src={banderaInglaterra} alt="Inglaterra" className="liga-img" />
                <img src={futbolicono} alt="Pelota de Futbol" className="liga-icon" />
                <h3>Premier League</h3>
              </div>
              <div className="liga-card" onClick={() => scrollToSection('champions-league')}>
                <img src={banderaUE} alt="Champions" className="liga-img" />
                <img src={futbolicono} alt="Pelota de Futbol" className="liga-icon" />
                <h3>Champions League</h3>
              </div>
            </div>

            {/* Partidos de cada liga */}

            <div id="liga-espanola">
              <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
                Liga EA SPORTS
                <img src={laliga} alt="Logo EA Sports" style={{ height: '24px', marginLeft: '10px' }} />
              </h2>

              {partidosFutbol.map(p => (
                <div key={p._id} className="partido-card">
                  <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
                  <input
                    type="text"
                    className="hora-input"
                    value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    readOnly
                  />
                  <button className="btn btn-light btn-sm apostar-btn" onClick={() => setLoginOpen(true)}>Apostar</button>
                </div>
              ))}
            </div>

            <div id="premier-league">
              <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
                Premier League
                <img src={premierleague} alt="Logo EA Sports" style={{ height: '24px', marginLeft: '10px' }} />
              </h2>
              {partidosPremierLeague.map(p => (
                <div key={p._id} className="partido-card">
                  <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
                  <input
                    type="text"
                    className="hora-input"
                    value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    readOnly
                  />
                  <button className="btn btn-light btn-sm apostar-btn" onClick={() => setLoginOpen(true)}>Apostar</button>
                </div>
              ))}
            </div>

            <div id="champions-league">
              <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
                Champions League
                <img src={championsleague} alt="Logo Champions" style={{ height: '24px', marginLeft: '10px' }} />
              </h2>
              {partidosChampionsLeague.map(p => (
                <div key={p._id} className="partido-card">
                  <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
                  <input
                    type="text"
                    className="hora-input"
                    value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    readOnly
                  />
                  <button className="btn btn-light btn-sm apostar-btn" onClick={() => setLoginOpen(true)}>Apostar</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer al final */}
      <Footer />
    </div>
  );
};

export default Home;
