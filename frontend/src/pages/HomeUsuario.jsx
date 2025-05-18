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

  return (
    <div>
      <Navbar onRegisterClick={() => window.location.href = '/registro'} />

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
          {partidosPremierLeague.map(p => (
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
          {partidosChampionsLeague.map(p => (
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

        
      </div>

      <Footer />
    </div>
  );
};

export default HomeUsuario;
