import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/Admin.css';

const API_URL = 'http://localhost:5000';

const AdminHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [apuestas, setApuestas] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/', { replace: true });
      return;
    }

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    fetch(`${API_URL}/api/admin/usuarios`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar usuarios');
        return res.json();
      })
      .then(setUsuarios)
      .catch(err => {
        console.error('Error cargando usuarios:', err);
        setError('Error al cargar los usuarios');
      });


    fetch(`${API_URL}/api/admin/apuestas`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar apuestas');
        return res.json();
      })
      .then(setApuestas)
      .catch(err => {
        console.error('Error cargando apuestas:', err);
        setError('Error al cargar las apuestas');
      });
  }, [isAuthenticated, isAdmin, navigate]);

  const handleModificarMonedas = async (userId) => {
    const nuevasMonedas = prompt('Introduce la nueva cantidad de monedas:');
    if (nuevasMonedas === null || isNaN(nuevasMonedas)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/usuarios/${userId}/monedas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ monedas: parseInt(nuevasMonedas, 10) })
      });

      if (!res.ok) throw new Error('Error al modificar monedas');

      // Recargar usuarios
      const usuariosRes = await fetch(`${API_URL}/api/admin/usuarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const nuevosUsuarios = await usuariosRes.json();
      setUsuarios(nuevosUsuarios);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al modificar las monedas');
    }
  };

  const handleEliminarApuesta = async (apuestaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta apuesta?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/apuestas/${apuestaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Error al eliminar apuesta');

      // Recargar apuestas
      const apuestasRes = await fetch(`${API_URL}/api/admin/apuestas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const nuevasApuestas = await apuestasRes.json();
      setApuestas(nuevasApuestas);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar la apuesta');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-container">
      <Navbar />
      
      <div className="admin-content">
        <h1 className="admin-title">Panel de Administración</h1>

        <div className="admin-cards">
          <div className="admin-card" onClick={() => document.getElementById('usuarios').scrollIntoView({ behavior: 'smooth' })}>
            <h3>Gestionar Usuarios</h3>
            <span className="card-count">{usuarios.length} usuarios</span>
          </div>
          <div className="admin-card" onClick={() => document.getElementById('monedas').scrollIntoView({ behavior: 'smooth' })}>
            <h3>Gestionar Monedas</h3>
            <span className="card-count">Control de saldo</span>
          </div>
          <div className="admin-card" onClick={() => document.getElementById('apuestas').scrollIntoView({ behavior: 'smooth' })}>
            <h3>Gestionar Apuestas</h3>
            <span className="card-count">{apuestas.length} apuestas</span>
          </div>
        </div>

        <section id="usuarios" className="admin-section">
          <h2>Usuarios Registrados</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Monedas</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u._id}>
                    <td>{u._id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.monedas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="monedas" className="admin-section">
          <h2>Modificar Monedas</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Monedas</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u._id}>
                    <td>{u._id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.monedas}</td>
                    <td>
                      <button 
                        className="admin-button"
                        onClick={() => handleModificarMonedas(u._id)}
                      >
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="apuestas" className="admin-section">
          <h2>Apuestas de Usuarios</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Partido</th>
                  <th>Apuesta</th>
                  <th>Monedas</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {apuestas.map(a => (
                  <tr key={a._id}>
                    <td>{a._id}</td>
                    <td>{a.usuarioNombre}</td>
                    <td>{a.equipoLocal} vs {a.equipoVisitante}</td>
                    <td>{a.resultadoApostado}</td>
                    <td>{a.monedas}</td>
                    <td>
                      <span className={`estado-${a.estado}`}>
                        {a.estado}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="admin-button delete"
                        onClick={() => handleEliminarApuesta(a._id)}
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

      <Footer />
    </div>
  );
};

export default AdminHome;