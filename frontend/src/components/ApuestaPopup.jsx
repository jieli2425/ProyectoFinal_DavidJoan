import React from 'react';
import '../../css/ApuestaPopup.css'; // Usamos el mismo archivo, puedes separarlo si quieres
import '../assets/LogoJOLIAzul.png'; // Puedes usar otro icono si lo prefieres

const ApuestaPopup = ({ partido, onClose, onApostar }) => {
  const handleClosePopup = (e) => {
    if (e.target.classList.contains('login-popup-container')) {
      onClose();
    }
  };

  return (
    <div className="login-popup-container" onClick={handleClosePopup}>
      <div className="apuesta-popup" onClick={(e) => e.stopPropagation()}>
        <h2>Realizar Apuesta</h2>
        <div className="partido-card">
          <span className="partido-equipos">{partido.equipoLocal} vs {partido.equipoVisitante}</span>
          <input
            type="text"
            className="hora-input"
            value={new Date(partido.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            readOnly
          />
        </div>

        <div className="apuesta-opciones">
          <button onClick={() => onApostar('local')} className="login-btn">Gana {partido.equipoLocal}</button>
          <button onClick={() => onApostar('empate')} className="login-btn">Empate</button>
          <button onClick={() => onApostar('visitante')} className="login-btn">Gana {partido.equipoVisitante}</button>
        </div>
      </div>
    </div>
  );
};

export default ApuestaPopup;
