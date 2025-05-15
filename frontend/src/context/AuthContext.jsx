import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000'; // Añadir URL base del backend

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState('');
  const [monedas, setMonedas] = useState(0); // Añadir el estado para las monedas
  const [registrado, setRegistrado] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombre');
    const registradoGuardado = localStorage.getItem('registrado') === 'true';
    const isAdminGuardado = localStorage.getItem('isAdmin') === 'true';

    if (token) {
      setIsAuthenticated(true);
      if (nombreGuardado) setNombre(nombreGuardado);
      if (isAdminGuardado) setIsAdmin(true);

      // Realizar la consulta al backend para obtener las monedas del usuario
      fetch(`${API_URL}/api/usuarios/perfil`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        if (data.monedas) {
          setMonedas(data.monedas);
        }
      })
      .catch(error => console.error('Error obteniendo el perfil:', error));
    }

    setRegistrado(registradoGuardado);
  }, []);

  const login = (token, nombre, isAdmin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('isAdmin', isAdmin);
    setIsAuthenticated(true);
    setNombre(nombre);
    setIsAdmin(isAdmin);

    // Realizar la consulta al backend para obtener las monedas del usuario al hacer login
    fetch(`${API_URL}/api/usuarios/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      if (data.monedas) {
        setMonedas(data.monedas);
      }
    })
    .catch(error => console.error('Error obteniendo el perfil:', error));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setNombre('');
    setMonedas(0); // Limpiar las monedas al cerrar sesión
    setIsAdmin(false);
  };

  const registro = (token, nombre) => {
    localStorage.setItem('registrado', 'true');
    setRegistrado(true);
    login(token, nombre, false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, registrado, login, logout, registro, nombre, monedas, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
