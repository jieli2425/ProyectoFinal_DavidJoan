import React, { useState } from 'react';
import '../../css/ApuestaPopup.css'; 
import logoJOLIazul from '../assets/LogoJOLIazul.png';

const ApuestaPopup = ({ partido, onClose, onApostar, actualizarUsuario }) => {
  const [monedasApostadas, setMonedasApostadas] = useState(0);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');
  const usuarioData = localStorage.getItem('usuario');
  const usuario = usuarioData ? JSON.parse(usuarioData) : null;

  const handleApuesta = async (eleccion) => {
    if (!token) {
      setError("No se ha encontrado token de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!usuario || !usuario._id) {
      setError("No se ha encontrado usuario autenticado. Por favor, inicia sesión.");
      return;
    }

    if (monedasApostadas <= 0) {
      setError("Debes apostar al menos 1 moneda");
      return;
    }

    if (!Number.isInteger(Number(monedasApostadas))) {
      setError("La cantidad debe ser un número entero");
      return;
    }

    const confirmar = window.confirm(`¿Estás seguro de que quieres apostar ${monedasApostadas} monedas por ${eleccion === 'local' ? partido.equipoLocal : eleccion === 'visitante' ? partido.equipoVisitante : 'empate'}?`);
    
    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch('/api/apuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          usuarioId: usuario._id,
          partidoId: partido._id,
          eleccion,
          monedasApostadas: parseInt(monedasApostadas)
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar apuesta');
      }
      
      actualizarUsuario(data.monedasRestantes);
      onApostar();
      onClose();
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