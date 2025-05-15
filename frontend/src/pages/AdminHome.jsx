import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

const AdminHome = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [apuestas, setApuestas] = useState([]);
  const { isAdmin } = useAuth();
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verificar`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        if (!data.isAdmin) {
          alert('Acceso denegado');
          navigate('/');
        }
      } catch (error) {
        console.error('Error al verificar admin:', error);
        navigate('/');
      }
    };

    // Verificar si hay token y si es admin
    if (!token || !isAdmin) {
      navigate('/');
      return;
    }

    verificarAdmin();
    cargarUsuarios();
    cargarApuestas();
  }, [navigate, token, isAdmin]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Error al cargar usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        const res = await fetch(`${API_URL}/api/usuarios/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Error al eliminar usuario');
        await cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const modificarMonedas = async (id) => {
    const nuevasMonedas = prompt('Introduce la nueva cantidad de monedas:');
    if (nuevasMonedas !== null) {
      try {
        const res = await fetch(`${API_URL}/api/usuarios/monedas`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuarioId: id, nuevasMonedas: parseInt(nuevasMonedas) })
        });
        if (!res.ok) throw new Error('Error al modificar monedas');
        await cargarUsuarios();
      } catch (error) {
        console.error('Error al modificar monedas:', error);
      }
    }
  };

  const cargarApuestas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/apuestas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Error al cargar apuestas');
      const data = await res.json();
      setApuestas(data);
    } catch (error) {
      console.error('Error al cargar apuestas:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#1D3F5B]">Panel de Administración</h1>

        {/* GESTIÓN DE USUARIOS */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#1D3F5B]">Usuarios</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-[#1D3F5B] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Monedas</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.monedas}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => modificarMonedas(u._id)}
                        className="bg-[#1D3F5B] hover:bg-[#2C5C82] text-white px-3 py-1 rounded mr-2 transition-colors duration-200"
                      >
                        Editar monedas
                      </button>
                      <button
                        onClick={() => eliminarUsuario(u._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#1D3F5B]">Apuestas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-[#1D3F5B] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-left">Partido</th>
                  <th className="px-4 py-3 text-left">Cantidad</th>
                  <th className="px-4 py-3 text-left">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apuestas.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{a.usuario?.nombre} ({a.usuario?.email})</td>
                    <td className="px-4 py-3">
                      {a.partido?.equipoLocal} vs {a.partido?.equipoVisitante}
                    </td>
                    <td className="px-4 py-3">{a.cantidad}</td>
                    <td className="px-4 py-3">{a.resultado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminHome; 