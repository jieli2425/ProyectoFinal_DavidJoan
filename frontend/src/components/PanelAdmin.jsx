import React, { useState, useEffect } from 'react';

const PanelAdmin = () => {
  const [partidos, setPartidos] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState('');
  const [equipoVisitante, setEquipoVisitante] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    fetch('/api/admin/partidos')
      .then(res => res.json())
      .then(data => setPartidos(data));
  }, []);

  const crearPartido = async () => {
    const res = await fetch('/api/admin/partidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipoLocal, equipoVisitante, fecha })
    });
    const data = await res.json();
    if (data._id) {
      setPartidos([...partidos, data]);
    }
  };

  const eliminarPartido = async (id) => {
    const res = await fetch(`/api/admin/partidos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPartidos(partidos.filter(p => p._id !== id));
    }
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <div>
        <h3>Crear Partido</h3>
        <input
          value={equipoLocal}
          onChange={e => setEquipoLocal(e.target.value)}
          placeholder="Equipo Local"
        />
        <input
          value={equipoVisitante}
          onChange={e => setEquipoVisitante(e.target.value)}
          placeholder="Equipo Visitante"
        />
        <input
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          placeholder="Fecha"
        />
        <button onClick={crearPartido}>Crear Partido</button>
      </div>
      
      <div>
        <h3>Partidos Existentes</h3>
        <ul>
          {partidos.map(partido => (
            <li key={partido._id}>
              {partido.equipoLocal} vs {partido.equipoVisitante}
              <button onClick={() => eliminarPartido(partido._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PanelAdmin;