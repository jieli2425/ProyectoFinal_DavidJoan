import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/panelAdmin.css';

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
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener usuarios');
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchApuestas = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/apuestas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener apuestas');
      setApuestas(data);
    } catch (err) {
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar el usuario');
      setUsuarios(usuarios.filter(u => u._id !== id));
    } catch (err) {
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
      setError(err.message);
    }
  };

  const handleEliminarApuesta = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/apuestas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar la apuesta');
      setApuestas(apuestas.filter(a => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-panel">
          <h1 className="admin-title">Panel de Administrador</h1>
          {error && <p className="admin-error">{error}</p>}

          <section className="admin-section">
            <h2 className="section-title"> Gestión de usuarios</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Monedas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario._id}>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.monedas}</td>
                      <td>
                        <button className="btn btn-delete" onClick={() => handleEliminarUsuario(usuario._id)}>
                          Eliminar
                        </button>
                        <button className="btn btn-edit" onClick={() => {
                          const nuevasMonedas = prompt('Introduce nuevas monedas:', usuario.monedas);
                          if (nuevasMonedas !== null) {
                            handleModificarMonedas(usuario._id, Number(nuevasMonedas));
                          }
                        }}>
                          Modificar monedas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <h2 className="section-title">Gestión de apuestas</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Partido</th>
                    <th>Resultado Apostado</th>
                    <th>Monedas</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {apuestas.map(apuesta => (
                    <tr key={apuesta._id}>
                      <td>{apuesta.usuarioNombre}</td>
                      <td>{apuesta.equipoLocal} vs {apuesta.equipoVisitante}</td>
                      <td>{apuesta.resultadoApostado}</td>
                      <td>{apuesta.monedas}</td>
                      <td>{apuesta.estado}</td>
                      <td>
                        <button className="btn btn-delete" onClick={() => handleEliminarApuesta(apuesta._id)}>
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
