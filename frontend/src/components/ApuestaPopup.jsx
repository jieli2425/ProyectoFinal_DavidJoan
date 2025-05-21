import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ApuestaPopup.css'; 
import logoJOLIazul from '../assets/LogoJOLIazul.png';

const ApuestaPopup = ({ partido, onClose, onApostar, actualizarUsuario }) => {
  const navigate = useNavigate(); 
  const [monedasApostadas, setMonedasApostadas] = useState('');
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');
  const usuarioData = localStorage.getItem('usuario');
  const usuario = usuarioData ? JSON.parse(usuarioData) : null;

  const handleApuesta = async (eleccion) => {
    setError("");
    if (!token) {
      setError("No se ha encontrado token de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!usuario || !usuario._id) {
      setError("No se ha encontrado usuario autenticado. Por favor, inicia sesión.");
      return;
    }

    const monedas = parseInt(monedasApostadas, 10);

    if (isNaN(monedas) || monedas <= 0) {
      setError("Debes apostar una cantidad válida y mayor a 0.");
      return;
    }

    if (!Number.isInteger(monedas)) {
      setError("La cantidad debe ser un número entero.");
      return;
    }

    if (monedas > usuario.monedas) {
      setError(`No tienes suficientes monedas. Tienes ${usuario.monedas} disponibles.`);
      return;
    }

    const equipoElegido = eleccion === 'local' ? partido.equipoLocal :
                         eleccion === 'visitante' ? partido.equipoVisitante : 'empate';

    const confirmar = window.confirm(`¿Estás seguro de que quieres apostar ${monedas} monedas por ${equipoElegido}?`);
    
    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch('/api/apuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          usuarioId: usuario._id,
          partidoId: partido._id,
          eleccion,
          monedasApostadas: monedas
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar apuesta');
      }
      
      actualizarUsuario(data.monedasRestantes);

      onApostar();
      onClose();

      navigate('/mis-apuestas'); 

    } catch (error) {
      console.error('Error al apostar:', error);
      setError(error.message || 'Error al conectar con el servidor');
    }
  };

  const handleClosePopup = (e) => {
    if (e.target.classList.contains('login-popup-container')) {
      onClose();
    }
  };

  return (
    <div className="login-popup-container" onClick={handleClosePopup}>
      <div className="apuesta-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar popup">&times;</button>
        <div className="login-logo">
          <img src={logoJOLIazul} alt="logo" className="logo-img" />
        </div>

        <div className="apuesta-partido-card">
          <span className="partido-equipos">{partido.equipoLocal} vs {partido.equipoVisitante}</span>
          <input
            type="text"
            className="hora-input"
            value={new Date(partido.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            readOnly
          />
        </div>

        <input
          type="number"
          placeholder="Monedas a apostar"
          className="monedas-input"
          value={monedasApostadas}
          onChange={(e) => setMonedasApostadas(e.target.value)}
          min={1}
        />

        {error && <p className="error-msg">{error}</p>}

        <div className="apuesta-opciones">
          <button onClick={() => handleApuesta('local')} className="apuesta-btn">Gana {partido.equipoLocal}</button>
          <button onClick={() => handleApuesta('empate')} className="apuesta-btn">Empate</button>
          <button onClick={() => handleApuesta('visitante')} className="apuesta-btn">Gana {partido.equipoVisitante}</button>
        </div>
      </div>
    </div>
  );
};

export default ApuestaPopup;