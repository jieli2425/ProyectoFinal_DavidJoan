import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MisApuestas = () => {
  const [apuestas, setApuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
  const fetchApuestas = async () => {
    try {
      const res = await fetch(`/api/apuestas/usuario/${usuario._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Error al obtener apuestas');
      const data = await res.json();
      setApuestas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (usuario && usuario._id) {
    fetchApuestas();
  } else {
    setLoading(false);
  }
}, [usuario]);


  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="mis-apuestas-container" style={{ padding: '2rem' }}>
        <h2>Mis Apuestas</h2>
        {loading ? (
          <p>Cargando apuestas...</p>
        ) : apuestas.length === 0 ? (
          <p>No has realizado ninguna apuesta.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {apuestas.map((apuesta) => (
              <li key={apuesta._id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
                <p><strong>Partido:</strong> {apuesta.partido?.equipoLocal} vs {apuesta.partido?.equipoVisitante}</p>
                <p><strong>Fecha:</strong> {new Date(apuesta.partido?.fecha).toLocaleString()}</p>
                <p><strong>Elección:</strong> {apuesta.eleccion}</p>
                <p><strong>Monedas apostadas:</strong> {apuesta.monedasApostadas}</p>
                <p><strong>Resultado:</strong> {apuesta.resuelta ? (apuesta.ganada ? 'Ganada' : 'Perdida') : 'Pendiente'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MisApuestas;