import React, { useState, useEffect } from 'react';
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

const Futbol = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    fetch('/api/partidos')
      .then(res => res.json())
      .then(setPartidos);
  }, []);

  // Solo partidos de fútbol
  const partidosFutbol = partidos.filter(p => p.deporte === 'futbol');

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar onLoginClick={() => setLoginOpen(true)} onRegisterClick={() => window.location.href = '/registro'} />
      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}

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

        {/* Partidos de cada liga */}

        <div id="liga-espanola">
          <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
            Liga EA SPORTS
            <img src={laliga} alt="Logo EA Sports" style={{ height: '24px', marginLeft: '10px' }} />
          </h2>

          {partidosFutbol.map(p => (
            <div key={p._id} className="partido-card">
              <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
              <input type="text" className="hora-input" value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} readOnly />
              <button className="btn btn-light btn-sm apostar-btn">Apostar</button>
            </div>
          ))}
        </div>

        <div id="premier-league">
          <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
            Premier League
            <img src={premierleague} alt="Logo EA Sports" style={{ height: '24px', marginLeft: '10px' }} />
          </h2>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Equipo Local</th>
                <th>Equipo Visitante</th>
                <th>Fecha</th>
                <th>Apostar</th>
              </tr>
            </thead>
            <tbody>
              {partidosFutbol.map(p => (
                <div key={p._id} className="partido-card">
                  <span className="partido-equipos">{p.equipoLocal} vs {p.equipoVisitante}</span>
                  <input type="text" className="hora-input" value={new Date(p.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} readOnly />
                  <button className="btn btn-light btn-sm apostar-btn">Apostar</button>
                </div>
              ))}
            </tbody>
          </table>
        </div>

        <div id="champions-league">
          <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
            Champions League
            <img src={championsleague} alt="Logo Champions" style={{ height: '24px', marginLeft: '10px' }} />
          </h2>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Equipo Local</th>
                <th>Equipo Visitante</th>
                <th>Fecha</th>
                <th>Apostar</th>
              </tr>
            </thead>
            <tbody>
              {partidosFutbol.map(p => (
                p.competicion === 'Champions League' && (
                  <tr key={p._id}>
                    <td>{p.equipoLocal}</td>
                    <td>{p.equipoVisitante}</td>
                    <td>{new Date(p.fecha).toLocaleString()}</td>
                    <td><button>Apostar</button></td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Footer al final */}
      <Footer />
    </div>
  );
};

export default Futbol;
