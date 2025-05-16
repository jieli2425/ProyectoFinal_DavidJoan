import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/terminos.css'; // Usamos el mismo estilo de contenedor

const Contacto = () => {
    return (
        <>
            <Navbar />
            <main className="terminos-container">
                <h1>Contacto</h1>
                <p>
                    En <strong>JOLIbet</strong>, valoramos mucho tu opinión y estamos aquí para ayudarte. Si tienes alguna pregunta, sugerencia o necesitas asistencia, no dudes en ponerte en contacto con nosotros.
                </p>

                <h2>Correo electrónico</h2>
                <p>
                    Para soporte general o consultas sobre tu cuenta, escríbenos a: <a href="mailto:soporte@jolibet.com">soporte@jolibet.com</a>
                </p>

                <h2>Dirección</h2>
                <p>
                    JOLIbet S.L.<br />
                    Calle Valencia, nº 530<br />
                    08923 Barcelona, España
                </p>

                <h2>Horario de atención</h2>
                <p>
                    Lunes a viernes: 9:00 - 18:00<br />
                    Sábados y domingos: Atención limitada por email
                </p>

                

                  <h2>Formulario de contacto</h2>
                <form className="mt-4">
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" placeholder="ej:Lamine Yamal" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input type="email" className="form-control" id="email" placeholder="fcbarcelona@ejemplo.com" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mensaje" className="form-label">Mensaje</label>
                        <textarea className="form-control" id="mensaje" rows="5" placeholder="Escribe tu mensaje aquí..." required></textarea>
                    </div>

                    <button type="submit" className="btn custom-btn">Enviar mensaje</button>

                </form>
            </main>
            <Footer />
        </>
    );
};

export default Contacto;
