import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoginPopup from '../components/LoginPopup';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    fetch('/api/partidos')
      .then(res => res.json())
      .then(setPartidos);
  }, []);

  return (
    <div>
      <Navbar onLoginClick={() => setLoginOpen(true)} onRegisterClick={() => window.location.href='/registro'} />
      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}
      <h2>Partidos Disponibles</h2>
      <ul>
        {partidos.map(p => (
          <li key={p._id}>{p.equipoLocal} vs {p.equipoVisitante}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;