import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/terminos.css';

const Politica = () => {
    return (
        <>
            <Navbar />
            <main className="terminos-container">
                <h1>POLÍTICA DE PRIVACIDAD DE JOLIbet</h1>
                <p><em>Fecha de última actualización: 15 de mayo de 2025</em></p>

                <p>
                    En JOLIbet, respetamos y protegemos tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tus datos personales cuando utilizas nuestros servicios.
                </p>

                <h2>1. Responsable del tratamiento</h2>
                <p>
                    La empresa JOLIbet, con domicilio en carrer València, 530, Barcelona, España, es responsable del tratamiento de tus datos personales.
                </p>

                <h2>2. Datos que recopilamos</h2>
                <p>Podemos recopilar y tratar los siguientes datos personales:</p>
                <ul>
                    <li>Datos de identificación: nombre, apellidos, fecha de nacimiento, DNI/NIE o documento equivalente.</li>
                    <li>Datos de contacto: dirección postal, correo electrónico, teléfono.</li>
                    <li>Datos de registro y acceso: nombre de usuario, contraseña, historial de accesos.</li>
                    <li>Datos financieros: información sobre pagos, depósitos y retiros.</li>
                    <li>Datos de uso: información sobre tus apuestas, preferencias y actividad en la plataforma.</li>
                    <li>Datos técnicos: dirección IP, tipo de navegador, dispositivo desde el que accedes.</li>
                </ul>

                <h2>3. Finalidades del tratamiento</h2>
                <p>Tus datos serán utilizados para:</p>
                <ul>
                    <li>Gestionar tu cuenta y la prestación de los servicios de apuestas.</li>
                    <li>Verificar tu identidad para cumplir con la legislación aplicable.</li>
                    <li>Procesar pagos y retiros.</li>
                    <li>Mejorar la plataforma y personalizar tu experiencia.</li>
                    <li>Enviarte comunicaciones relacionadas con el servicio, ofertas y promociones (con tu consentimiento).</li>
                    <li>Cumplir con obligaciones legales y fiscales.</li>
                </ul>

                <h2>4. Base legal para el tratamiento</h2>
                <ul>
                    <li>La ejecución del contrato de prestación de servicios.</li>
                    <li>El cumplimiento de obligaciones legales.</li>
                    <li>Tu consentimiento previo para comunicaciones comerciales.</li>
                    <li>Nuestro interés legítimo en mejorar el servicio y prevenir fraudes.</li>
                </ul>

                <h2>5. Conservación de los datos</h2>
                <p>
                    Conservaremos tus datos personales durante el tiempo necesario para cumplir con las finalidades mencionadas y según lo exigido por la ley.
                </p>

                <h2>6. Seguridad de los datos</h2>
                <p>
                    Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra accesos no autorizados, pérdida o alteración.
                </p>

                <h2>7. Derechos de los usuarios</h2>
                <p>Puedes ejercer tus derechos en cualquier momento:</p>
                <ul>
                    <li>Derecho de acceso, rectificación o supresión de tus datos.</li>
                    <li>Derecho a limitar u oponerte al tratamiento.</li>
                    <li>Derecho a la portabilidad de tus datos.</li>
                    <li>Derecho a retirar tu consentimiento para comunicaciones comerciales.</li>
                    <li>Derecho a presentar una reclamación ante la autoridad de control.</li>
                </ul>
                <p>
                    Para ejercer estos derechos, contacta con nosotros en: <a href="mailto:privacidad@jolibet.com">privacidad@jolibet.com</a>
                </p>

                <h2>8. Comunicación de datos a terceros</h2>
                <p>
                    No vendemos ni cedemos tus datos a terceros sin tu consentimiento, salvo obligaciones legales o proveedores que colaboran en la prestación del servicio con garantías de confidencialidad.
                </p>

                <h2>9. Cookies y tecnologías similares</h2>
                <p>
                    Utilizamos cookies para mejorar la experiencia de usuario y analizar el uso de la plataforma. Puedes configurar tu navegador para bloquearlas o eliminarlas.
                </p>

                <h2>10. Cambios en la política de privacidad</h2>
                <p>
                    Nos reservamos el derecho de modificar esta política. Las actualizaciones se publicarán en esta página y, cuando sea relevante, te notificaremos.
                </p>
            </main>
            <Footer />
        </>
    );
};

export default Politica;
