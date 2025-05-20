import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ApuestaPopup from '../components/ApuestaPopup';
import '../../css/home.css';
import banderaEspaña from '../assets/banderaespaña.png';
import banderaInglaterra from '../assets/banderainglaterra.png';
import banderaUE from '../assets/banderaue.png';
import laliga from '../assets/laliga.png';
import premierleague from '../assets/premierleague.png';
import championsleague from '../assets/championsleague.png';
import futbolicono from '../assets/logofutbol.png';

const HomeUsuario = () => {
  const [apuestaOpen, setApuestaOpen] = useState(false);

  const [partidos, setPartidos] = useState([]);
  const [partidosPremierLeague, setPartidosPremierLeague] = useState([]);
  const [partidosChampionsLeague, setPartidosChampionsLeague] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const usuarioData = localStorage.getItem('usuario');
  const usuario = usuarioData ? JSON.parse(usuarioData) : null;

  const [monedas, setMonedas] = useState(usuario?.monedas || 0);

  const actualizarUsuario = (nuevasMonedas) => {
    setMonedas(nuevasMonedas);
    const usuarioActualizado = { ...usuario, monedas: nuevasMonedas };
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  };

  const refrescarApuestas = () => {
    console.log('Apuestas refrescadas');
    fetch('/api/partidos')
      .then(res => res.json())
      .then(setPartidos);
  };

const fechaInicioPremier = new Date('2025-05-12T17:00:00.000+00:00');
const fechaFinPremier = new Date('2025-05-20T17:00:00.000+00:00');
const fechaInicioChampions = new Date('2025-05-06T19:00:00.000+00:00');
const fechaFinChampions = new Date('2025-05-31T19:00:00.000+00:00');

const partidosPremierFiltrados = partidosPremierLeague.filter(p => {
  const fecha = new Date(p.fecha);
  return (
    p.competicion === 'Premier League' &&
    fecha >= fechaInicioPremier &&
    fecha <= fechaFinPremier
  );
});

const partidosChampionsFiltrados = partidosChampionsLeague.filter(p => {
  const fecha = new Date(p.fecha);
  return (
    (p.competicion === 'UEFA Champions League' || p.competicion === 'Champions League') &&
    fecha >= fechaInicioChampions &&
    fecha <= fechaFinChampions
  );
});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    fetch('/api/partidos', { headers })
      .then(res => res.json())
      .then(setPartidos);

    fetch('/api/partidos/premier-league', { headers })
      .then(res => res.json())
      .then(setPartidosPremierLeague);

    fetch('/api/partidos/champions-league', { headers })
      .then(res => res.json())
      .then(setPartidosChampionsLeague);
  }, []);

  const partidosFutbol = partidos.filter(p => p.deporte === 'futbol');

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApostarClick = (partido) => {
    setPartidoSeleccionado(partido);
    setApuestaOpen(true);
  };

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

  return (
    <div>
      <Navbar onRegisterClick={() => window.location.href = '/registro'} onSearch={handleSearch} />

      {/* Popup de apuesta */}
      {apuestaOpen && (
        <ApuestaPopup
          partido={partidoSeleccionado}
          onClose={() => {
            setApuestaOpen(false);
            setPartidoSeleccionado(null);
          }}
          onApostar={refrescarApuestas}
          actualizarUsuario={actualizarUsuario}
        />
      )}

      <div className="home-content">

        {/* Mostrar resultados de búsqueda si hay */}
        {searchResults.length > 0 && searchQuery ? (
          <div style={{ marginBottom: '1rem' }}>
            <h2>Resultados de búsqueda para: "{searchQuery}"</h2>
            {searchResults.map(item => (
              <div key={item._id} className="partido-card" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  onClick={() => handleApostarClick(item)}
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
                  <button
                    className="btn btn-light btn-sm apostar-btn"
                    onClick={() => handleApostarClick(p)}
                  >
                    Apostar
                  </button>
                </div>
              ))}
            </div>

            <div id="premier-league">
              <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
                Premier League
                <img src={premierleague} alt="Logo Premier" style={{ height: '24px', marginLeft: '10px' }} />
              </h2>
              {partidosPremierFiltrados.map(p => (
                <div key={p._id} className="partido-card">
                  <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
                  <input
                    type="text"
                    className="hora-input"
                    value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    readOnly
                  />
                  <button
                    className="btn btn-light btn-sm apostar-btn"
                    onClick={() => handleApostarClick(p)}
                  >
                    Apostar
                  </button>
                </div>
              ))}
            </div>

            <div id="champions-league">
              <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
                Champions League
                <img src={championsleague} alt="Logo Champions" style={{ height: '24px', marginLeft: '10px' }} />
              </h2>
              {partidosChampionsFiltrados.map(p => (
                <div key={p._id} className="partido-card">
                  <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
                  <input
                    type="text"
                    className="hora-input"
                    value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    readOnly
                  />
                  <button
                    className="btn btn-light btn-sm apostar-btn"
                    onClick={() => handleApostarClick(p)}
                  >
                    Apostar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default HomeUsuario;
