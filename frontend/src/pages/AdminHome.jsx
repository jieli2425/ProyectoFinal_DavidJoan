import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administrador</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Usuarios</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
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
                  <button
                    className="bg-red-500 text-white px-2 py-1 mr-2 rounded"
                    onClick={() => handleEliminarUsuario(usuario._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-yellow-400 text-black px-2 py-1 rounded"
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
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Apuestas</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Usuario</th>
              <th>Partido</th>
              <th>Resultado Apostado</th>
              <th>Monedas</th>
              <th>Estado</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PanelAdmin;