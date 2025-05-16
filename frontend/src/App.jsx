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
// import AdminHome from './components/AdminHome';


// import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/futbol" element={<Futbol />} />
        <Route path="/usuario" element={<HomeUsuario />} />
        {/* <Route path="/admin" element={<ProtectedAdminRoute><AdminHome /></ProtectedAdminRoute>} /> */}
        <Route path="/puntosTienda" element={<PuntosTienda />} />
        <Route path="/datosCuenta" element={<DatosCuenta />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/politica" element={<Politica />} />
        <Route path="/nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/recuperar-contrasena" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
