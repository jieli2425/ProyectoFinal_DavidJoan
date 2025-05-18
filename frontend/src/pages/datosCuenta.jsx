import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/datosCuenta.css';

const DatosCuenta = () => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No has iniciado sesión.');
        return;
      }

      try {
        const response = await fetch('/api/usuarios/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Error al obtener los datos');
        }

        setUsuario(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDatosUsuario();
  }, []);

  return (
    <>
      <Navbar />

      <main className="datos-cuenta-container">
        <h2>Mi cuenta</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!usuario && !error && <p>Cargando datos de tu cuenta...</p>}

        {usuario && (
          <div className="datos-info">
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Monedas:</strong> {usuario.monedas}</p>
            <p><strong>Admin:</strong> {usuario.isAdmin ? 'Sí' : 'No'}</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default DatosCuenta;
