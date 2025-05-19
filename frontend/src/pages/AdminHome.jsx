import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'http://localhost:5000/api';

const PanelAdmin = () => {
  const token = localStorage.getItem('token');
  const [usuarios, setUsuarios] = useState([]);
  const [apuestas, setApuestas] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener usuarios');
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchApuestas = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/apuestas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener apuestas');
      setApuestas(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchApuestas();
  }, []);

  const handleEliminarUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Error al eliminar el usuario');
      setUsuarios(usuarios.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleModificarMonedas = async (id, nuevasMonedas) => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios/${id}/monedas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ monedas: nuevasMonedas })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar monedas');

      setUsuarios(usuarios.map(u => (u._id === id ? data : u)));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEliminarApuesta = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/apuestas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Error al eliminar la apuesta');
      setApuestas(apuestas.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
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
          maxWidth: '1000px'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            Panel de Administrador
          </h1>

          {error && (
            <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
          )}

          {/* Usuarios */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Usuarios</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f1f1f1' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Nombre</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Monedas</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario._id}>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{usuario.nombre}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{usuario.email}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{usuario.monedas}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>
                        <button
                          style={{
                            backgroundColor: '#1D3F5B',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '5px',
                            marginRight: '0.5rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEliminarUsuario(usuario._id)}
                        >
                          Eliminar
                        </button>
                        <button
                          style={{
                            backgroundColor: '#1D3F5B',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            const nuevasMonedas = prompt('Introduce nuevas monedas:', usuario.monedas);
                            if (nuevasMonedas !== null) {
                              handleModificarMonedas(usuario._id, Number(nuevasMonedas));
                            }
                          }}
                        >
                          Modificar monedas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Apuestas */}
          <section>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Apuestas</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f1f1f1' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Usuario</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Partido</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Resultado Apostado</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Monedas</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {apuestas.map(apuesta => (
                    <tr key={apuesta._id}>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{apuesta.usuarioNombre}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>
                        {apuesta.equipoLocal} vs {apuesta.equipoVisitante}
                      </td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{apuesta.resultadoApostado}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{apuesta.monedas}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{apuesta.estado}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>
                        <button
                          style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEliminarApuesta(apuesta._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PanelAdmin;