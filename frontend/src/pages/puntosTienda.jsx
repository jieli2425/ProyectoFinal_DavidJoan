import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MonedaIcon from '../assets/monedaoronav.png';
import '../../css/puntosTienda.css';

const PuntosTienda = () => {
  const [canjeados, setCanjeados] = useState([]);

  const packs = [
    { id: 1, puntos: 1000 },
    { id: 2, puntos: 5000 },
    { id: 3, puntos: 10000 },
  ];

  const handleCanjear = (id) => {
    if (!canjeados.includes(id)) {
      setCanjeados([...canjeados, id]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="puntos-tienda-container">
        <div className="puntos-tienda-content">
          <h1 className="puntos-tienda-title">Tienda de Puntos</h1>
          <div className="packs-container">
            {packs.map((pack) => (
              <div className="pack-card" key={pack.id}>
                <h2>{pack.puntos.toLocaleString()} puntos</h2>
                <img
                  src={MonedaIcon}
                  alt="Moneda"
                  className="moneda-icon"
                />
                <button
                  className="btn-canjear"
                  onClick={() => handleCanjear(pack.id)}
                  disabled={canjeados.includes(pack.id)}
                >
                  {canjeados.includes(pack.id) ? 'Canjeado' : 'Canjear'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PuntosTienda;
