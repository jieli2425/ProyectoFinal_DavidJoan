import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MonedaIcon from '../assets/monedaoronav.png';
import '../../css/puntosTienda.css';
import { AuthContext } from '../context/AuthContext';

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Error decodificando JWT:', e);
    return null;
  }
}

const PuntosTienda = () => {
  const [canjeados, setCanjeados] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const { setMonedas } = useContext(AuthContext);

  const packs = [
    { id: 1, puntos: 1000 },
    { id: 2, puntos: 5000 },
    { id: 3, puntos: 10000 },
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      if (decoded) {
        setUserId(decoded.userId || decoded._id || null);
        setToken(storedToken);
      } else {
        console.warn('Token inválido');
      }
    } else {
      console.warn('Faltan datos: usuario o token no encontrados.');
    }
  }, []);

  const handleCanjear = async (id) => {
    const selectedPack = packs.find((pack) => pack.id === id);
    if (!canjeados.includes(id) && userId && token) {
      try {
        const response = await fetch(`/api/usuarios/${userId}/sumar-monedas`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ puntos: selectedPack.puntos }),
        });

        if (response.ok) {
          const data = await response.json();
          setCanjeados([...canjeados, id]);
          if (data.nuevasMonedas !== undefined) {
            setMonedas(data.nuevasMonedas);
          }
        } else {
          console.error('Error al actualizar los puntos');
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    } else {
      console.warn('Faltan datos: usuario o token no encontrados.');
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
                <img src={MonedaIcon} alt="Moneda" className="moneda-icon" />
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
