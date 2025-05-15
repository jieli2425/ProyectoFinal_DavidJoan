import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginPopup from '../components/LoginPopup';
import '../../css/home.css';

const AdminHome = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [apuestas, setApuestas] = useState([]);

  useEffect(() => {
    fetch('/api/admin/usuarios')
      .then(res => res.json())
      .then(setUsuarios);

    fetch('/api/admin/apuestas')
      .then(res => res.json())
      .then(setApuestas);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModificarMonedas = (userId) => {
    const nuevasMonedas = prompt('Introduce la nueva cantidad de monedas:');
    if (nuevasMonedas !== null) {
      fetch(`/api/admin/usuarios/${userId}/monedas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monedas: parseInt(nuevasMonedas, 10) }),
      })
      .then(() => {
        // Refresh usuarios
        return fetch('/api/admin/usuarios').then(res => res.json()).then(setUsuarios);
      });
    }
  };

  const handleEliminarApuesta = (apuestaId) => {
    if (window.confirm('¿Estás seguro de eliminar esta apuesta?')) {
      fetch(`/api/admin/apuestas/${apuestaId}`, { method: 'DELETE' })
      .then(() => {
        // Refresh apuestas
        return fetch('/api/admin/apuestas').then(res => res.json()).then(setApuestas);
      });
    }
  };

  return (
    <div>
      <Navbar />

      <div className="home-content">
        <h1>Panel de Administración</h1>

        <div className="ligas-grid">
          <div className="liga-card" onClick={() => scrollToSection('usuarios')}>
            <h3>Gestionar Usuarios</h3>
          </div>
          <div className="liga-card" onClick={() => scrollToSection('monedas')}>
            <h3>Gestionar Monedas</h3>
          </div>
          <div className="liga-card" onClick={() => scrollToSection('apuestas')}>
            <h3>Gestionar Apuestas</h3>
          </div>
        </div>

        {/* Gestión de Usuarios */}
        <div id="usuarios">
          <h2>Usuarios Registrados</h2>
          <table border="1" cellPadding="8">
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

        {/* Gestión de Monedas */}
        <div id="monedas">
          <h2>Modificar Monedas</h2>
          <table border="1" cellPadding="8">
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
                    <button onClick={() => handleModificarMonedas(u._id)}>Modificar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gestión de Apuestas */}
        <div id="apuestas">
          <h2>Apuestas de Usuarios</h2>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Partido</th>
                <th>Apuesta</th>
                <th>Monedas Apostadas</th>
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
                    <button onClick={() => handleEliminarApuesta(a._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminHome;