import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/footer.css';
import logoJOLIblanco from '../assets/LogoJOLIBlanco.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={logoJOLIblanco} alt="logo" className="logo-img" />
        <p>© 2025 JOLIbet. Todos los derechos reservados.</p>
        <p>
          <Link to="/terminos" style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
            Términos y Condiciones
          </Link>
          <br></br>
          <Link to="/politica" style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
            Política de Privacidad
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
