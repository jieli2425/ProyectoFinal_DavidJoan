import React from 'react';
import '../../css/ApuestaPopup.css'; 
import logoJOLIazul from '../assets/LogoJOLIazul.png';

const ApuestaPopup = ({ partido, onClose, onApostar }) => {
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

        <div className="apuesta-opciones">
          <button onClick={() => onApostar('local')} className="apuesta-btn">Gana {partido.equipoLocal}</button>
          <button onClick={() => onApostar('empate')} className="apuesta-btn">Empate</button>
          <button onClick={() => onApostar('visitante')} className="apuesta-btn">Gana {partido.equipoVisitante}</button>
          <button onClick={() => onApostar('local')} className="apuesta-btn">Gana {partido.equipoLocal}</button>
          <button onClick={() => onApostar('empate')} className="apuesta-btn">Empate</button>
          <button onClick={() => onApostar('visitante')} className="apuesta-btn">Gana {partido.equipoVisitante}</button>
        </div>
      </div>
    </div>
  );
};

export default ApuestaPopup;
