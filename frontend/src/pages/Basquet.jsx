import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginPopup from '../components/LoginPopup';
import '../../css/home.css';
import banderaEEUU from '../assets/banderaeeuu.png';
import NBA from '../assets/nba.png';
import basketicono from '../assets/logobasket.png';

const Basquet = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    fetch('/api/partidos')
      .then(res => res.json())
      .then(setPartidos);
  }, []);

  const partidosBasquet = partidos.filter(p => p.deporte === 'basquet');

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar onLoginClick={() => setLoginOpen(true)} onRegisterClick={() => window.location.href = '/registro'} />
      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}

      <div className="home-content">
        <div className="ligas-grid">
          <div className="liga-card" onClick={() => scrollToSection('nba')}>
            <img src={banderaEEUU} alt="NBA" className="liga-img" />
            <img src={basketicono} alt="Pelota de Baloncesto" className="liga-icon" />
            <h3>NBA</h3>
          </div>
        </div>

        {/* Partidos de la NBA */}
        <div id="nba">
          <h2 style={{ display: 'flex', alignItems: 'center', color: '#1D3F5B' }}>
            NBA
            <img src={NBA} alt="Logo NBA" style={{ height: '24px', marginLeft: '10px' }} />
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
              {partidosBasquet.map(p => (
                <tr key={p._id}>
                  <td>{p.equipoLocal}</td>
                  <td>{p.equipoVisitante}</td>
                  <td>{new Date(p.fecha).toLocaleString()}</td>
                  <td><button>Apostar</button></td>
                </tr>
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

export default Basquet;
