import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Futbol from './pages/Futbol'; 
import Basquet from './pages/Basquet';
import HomeUsuario from './pages/HomeUsuario';
import { AuthProvider } from './context/AuthContext'; // ✅ importamos el contexto

const App = () => (
  <AuthProvider> {/* ✅ envolvemos toda la app */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/futbol" element={<Futbol />} /> {/* Página de Fútbol */}
        <Route path="/basquet" element={<Basquet />} /> {/* Página de Básquet */}
        <Route path="/usuario" element={<HomeUsuario />} /> {/* Página de Básquet */}


      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
