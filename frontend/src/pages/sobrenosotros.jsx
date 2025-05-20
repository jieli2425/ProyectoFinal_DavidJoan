import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/terminos.css';

const SobreNosotros = () => {
    return (
        <>
            <Navbar />
            <main className="terminos-container">
                <h1>Sobre Nosotros</h1>
                <p>
                    En <strong>JOLIbet</strong>, vivimos y respiramos deporte. Somos una plataforma especializada en <strong>apuestas deportivas</strong> centrada en dos de las disciplinas más apasionantes: el <strong>fútbol</strong> y el <strong>baloncesto</strong>. Nuestro objetivo es ofrecerte una experiencia de juego emocionante, segura y responsable.
                </p>

                <h2>¿Quiénes somos?</h2>
                <p>
                    JOLIbet nace de la pasión por el deporte y la tecnología. Somos un equipo joven, dinámico y comprometido con brindarte una plataforma fiable donde puedas disfrutar de tus competiciones favoritas con total transparencia.
                </p>

                <h2>Nuestra misión</h2>
                <p>
                    Queremos revolucionar el mundo de las apuestas deportivas ofreciendo cuotas competitivas, un entorno fácil de usar y herramientas que permiten jugar de forma responsable. En JOLIbet, el usuario está en el centro de todo lo que hacemos.
                </p>

                <h2>¿Por qué elegirnos?</h2>
                <ul>
                    <li>📱 Plataforma moderna y responsive.</li>
                    <li>🔐 Seguridad y protección de datos garantizada.</li>
                    <li>⚽ Fútbol y 🏀 baloncesto como especialidad principal.</li>
                    <li>💬 Soporte personalizado y cercano.</li>
                    <li>🎁 Promociones y bonos exclusivos para nuestros usuarios.</li>
                </ul>

                <h2>Compromiso con el juego responsable</h2>
                <p>
                    Fomentamos el uso responsable de nuestra plataforma. Si alguna vez sientes que el juego deja de ser una diversión, te ofrecemos recursos de ayuda y la opción de autolimitar tu actividad.
                </p>

                <h2>Únete a la comunidad JOLIbet</h2>
                <p>
                    Miles de usuarios ya forman parte de nuestra comunidad. ¿Y tú? Vive la emoción del deporte con nosotros. ¡Tu pasión, tu juego, tu apuesta!
                </p>
            </main>
            <Footer />
        </>
    );
};

export default SobreNosotros;
