import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Futbol from './pages/Futbol'; 
import Basquet from './pages/Basquet';
import HomeUsuario from './pages/HomeUsuario';
import { AuthProvider } from './context/AuthContext';
import AdminHome from './pages/AdminHome';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/futbol" element={<Futbol />} />
        <Route path="/basquet" element={<Basquet />} />
        <Route path="/usuario" element={<HomeUsuario />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
