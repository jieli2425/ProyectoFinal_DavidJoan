import React from 'react';
import '../../css/footer.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
      <img src={logoJOLIblanco} alt="logo" className="logo-img" />
        <p> © 2025 JOLIBet.  Todos los derechos reservados.</p>
        
      </div>
    </footer>
  );
};

export default Footer;
