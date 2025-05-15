import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminHome = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-home">
      <h1>Panel de Administración</h1>
      <div className="admin-content">
        <p>Bienvenido al panel de administración</p>
        {/* Aquí irá el contenido del panel de administración */}
      </div>
    </div>
  );
};

export default AdminHome; 