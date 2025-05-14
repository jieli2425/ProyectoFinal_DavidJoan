import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [apuestas, setApuestas] = useState([]);
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const verificarAdmin = async () => {
      const res = await fetch('/api/auth/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();
      if (data.role !== 'admin') {
        alert('Acceso denegado');
        navigate('/');
      }
    };

    verificarAdmin();
    cargarUsuarios();
    cargarApuestas();
  }, [navigate, token]);

  const cargarUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      cargarUsuarios();
    }
  };

  const modificarMonedas = async (id) => {
    const nuevasMonedas = prompt('Introduce la nueva cantidad de monedas:');
    if (nuevasMonedas !== null) {
      await fetch('/api/usuarios/monedas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: id, nuevasMonedas: parseInt(nuevasMonedas) })
      });
      cargarUsuarios();
    }
  };

  // Cargar apuestas
  const cargarApuestas = async () => {
    const res = await fetch('/api/apuestas');
    const data = await res.json();
    setApuestas(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      {/* GESTIÓN DE USUARIOS */}
      <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
      <table className="table-auto border-collapse border border-gray-400 mb-6 w-full">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Nombre</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">Monedas</th>
            <th className="border border-gray-400 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id}>
              <td className="border border-gray-400 p-2">{u.nombre}</td>
              <td className="border border-gray-400 p-2">{u.email}</td>
              <td className="border border-gray-400 p-2">{u.monedas}</td>
              <td className="border border-gray-400 p-2">
                <button
                  onClick={() => modificarMonedas(u._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar monedas
                </button>
                <button
                  onClick={() => eliminarUsuario(u._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Apuestas</h2>
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Usuario</th>
            <th className="border border-gray-400 p-2">Partido</th>
            <th className="border border-gray-400 p-2">Cantidad</th>
            <th className="border border-gray-400 p-2">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {apuestas.map((a) => (
            <tr key={a._id}>
              <td className="border border-gray-400 p-2">{a.usuario?.nombre} ({a.usuario?.email})</td>
              <td className="border border-gray-400 p-2">
                {a.partido?.equipoLocal} vs {a.partido?.equipoVisitante}
              </td>
              <td className="border border-gray-400 p-2">{a.cantidad}</td>
              <td className="border border-gray-400 p-2">{a.resultado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;