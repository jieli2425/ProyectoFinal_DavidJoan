import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/terminos.css';
import { Link } from 'react-router-dom';


const Terminos = () => {
    return (
        <>
            <Navbar />
            <main className="terminos-container">
                <h1>TÉRMINOS Y CONDICIONES DE USO DE JOLIbet</h1>
                <p><em>Fecha de última actualización: 15 de mayo de 2025</em></p>
                <p>
                    Bienvenido/a a JOLIbet, una plataforma online de apuestas deportivas especializadas en fútbol.
                    Antes de utilizar nuestros servicios, te recomendamos leer detenidamente los siguientes términos y condiciones.
                    Al acceder y usar JOLIbet, aceptas estar sujeto a estos términos.
                </p>

                <h2>1. Aceptación de los términos</h2>
                <p>
                    Al registrarte y/o usar la plataforma JOLIbet, aceptas cumplir con estos Términos y Condiciones, así como con la legislación aplicable.
                    Si no estás de acuerdo con alguna parte, no utilices nuestros servicios.
                </p>

                <h2>2. Requisitos para usar JOLIbet</h2>
                <ul>
                    <li>Debes ser mayor de edad según la legislación de tu país (generalmente 18 años o más).</li>
                    <li>Debes registrarte con información veraz, completa y actualizada.</li>
                    <li>Solo puedes tener una cuenta activa.</li>
                    <li>No está permitido usar la plataforma para actividades fraudulentas o ilegales.</li>
                </ul>

                <h2>3. Registro y seguridad de la cuenta</h2>
                <ul>
                    <li>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
                    <li>Cualquier actividad realizada desde tu cuenta se considerará autorizada por ti.</li>
                    <li>Debes notificarnos inmediatamente si sospechas que tu cuenta ha sido comprometida.</li>
                </ul>

                <h2>4. Depósitos y retiros</h2>
                <ul>
                    <li>Para apostar, debes depositar fondos en tu cuenta siguiendo los métodos disponibles.</li>
                    <li>Los retiros están sujetos a verificaciones de seguridad y cumplimiento normativo.</li>
                    <li>Nos reservamos el derecho de solicitar documentos para verificar tu identidad antes de procesar retiros.</li>
                </ul>

                <h2>5. Apuestas y pagos</h2>
                <ul>
                    <li>Las apuestas son vinculantes y no se pueden cancelar una vez confirmadas.</li>
                    <li>Los pagos se calcularán según las cuotas vigentes al momento de hacer la apuesta.</li>
                    <li>JOLIbet se reserva el derecho de cancelar apuestas en caso de error técnico o irregularidades.</li>
                </ul>

                <h2>6. Responsabilidad y riesgos</h2>
                <ul>
                    <li>Apostar implica riesgos. Puedes perder la totalidad del dinero apostado.</li>
                    <li>JOLIbet no se hace responsable de pérdidas o daños derivados del uso de la plataforma.</li>
                    <li>Te recomendamos apostar de forma responsable y buscar ayuda si tienes problemas con el juego.</li>
                </ul>

                <h2>7. Propiedad intelectual</h2>
                <p>
                    Todo el contenido de JOLIbet, incluyendo logos, diseños, textos y software, está protegido por derechos de propiedad intelectual.
                    Queda prohibida la copia, distribución o uso no autorizado del contenido.
                </p>

                <h2>8. Modificaciones de los términos</h2>
                <p>
                    JOLIbet puede modificar estos términos en cualquier momento, notificando a los usuarios mediante la plataforma o correo electrónico.
                    El uso continuado de la plataforma implica aceptación de las modificaciones.
                </p>

                <h2>9. Política de privacidad</h2>
                <p>
                    Tratamos tus datos personales conforme a nuestra <Link to="/politica">Política de Privacidad</Link>.
                </p>
            </main>
            <Footer />
        </>
    );
};

export default Terminos;

