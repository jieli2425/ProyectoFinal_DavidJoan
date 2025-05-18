import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Futbol from './pages/Futbol'; 
import ResetPassword from './pages/resetpassword';
import HomeUsuario from './pages/HomeUsuario';
import PuntosTienda from './pages/puntosTienda';
import DatosCuenta from './pages/datosCuenta';
import Terminos from './pages/terminos';
import Politica from './pages/politica';
import SobreNosotros from './pages/sobrenosotros';
import Contacto from './pages/contacto';
import { AuthProvider } from './context/AuthContext';
import PreguntarEmail from './pages/preguntaremail';
import ProtectedRoute from './components/ProtectedRoute';
// import AdminHome from './components/AdminHome';
// import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/futbol" element={<Futbol />} />

        <Route
          path="/usuario"
          element={
            <ProtectedRoute>
              <HomeUsuario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/puntosTienda"
          element={
            <ProtectedRoute>
              <PuntosTienda />
            </ProtectedRoute>
          }
        />

        <Route
          path="/datosCuenta"
          element={
            <ProtectedRoute>
              <DatosCuenta />
            </ProtectedRoute>
          }
        />

        {/* Rutas públicas */}
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/politica" element={<Politica />} />
        <Route path="/nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/preguntar-email" element={<PreguntarEmail />} />
        <Route path="/recuperar-contrasena" element={<ResetPassword />} />

        {/* <Route path="/admin" element={<ProtectedAdminRoute><AdminHome /></ProtectedAdminRoute>} /> */}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
