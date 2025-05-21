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
      await fetch('/api/apuestas/resolver-finalizadas', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
    const interval = setInterval(fetchApuestas, 30000);
    return () => clearInterval(interval);
  } else {
    setLoading(false);
  }
}, [usuario?._id]);

const handleBorrarFinalizadas = async () => {
    try {
      const res = await fetch(`/api/apuestas/finalizadas/${usuario._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Error al borrar apuestas finalizadas');
      
      const pendientes = apuestas.filter(a => a.resultado === 'pendiente');
      setApuestas(pendientes);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al borrar las apuestas finalizadas');
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          width: '100%',
          maxWidth: '800px'
        }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Mis Apuestas</h2>
          {loading ? (
            <p>Cargando apuestas...</p>
          ) : apuestas.length === 0 ? (
            <p>No has realizado ninguna apuesta.</p>
          ) : (
            <>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {apuestas.map((apuesta) => (
                <li key={apuesta._id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                  <p><strong>Partido:</strong> {apuesta.partido?.equipoLocal} vs {apuesta.partido?.equipoVisitante}</p>
                  <p><strong>Fecha:</strong> {new Date(apuesta.partido?.fecha).toLocaleString()}</p>
                  <p><strong>Elección:</strong> {apuesta.eleccion}</p>
                  <p><strong>Monedas apostadas:</strong> {apuesta.monedasApostadas}</p>
                  <p><strong>Resultado:</strong> {apuesta.resultado === 'pendiente' ? 'Pendiente' : apuesta.resultado === 'ganada' ? 'Ganada' : 'Perdida'}</p>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={handleBorrarFinalizadas}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Borrar Apuestas
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MisApuestas;