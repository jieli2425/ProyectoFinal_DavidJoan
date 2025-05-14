import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState('');
  const [monedas, setMonedas] = useState(0); // Añadir el estado para las monedas
  const [registrado, setRegistrado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombre');
    const registradoGuardado = localStorage.getItem('registrado') === 'true';

    if (token) {
      setIsAuthenticated(true);
      if (nombreGuardado) setNombre(nombreGuardado);

      // Realizar la consulta al backend para obtener las monedas del usuario
      fetch('/api/usuario/perfil', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.monedas) {
          setMonedas(data.monedas); // Asignar las monedas a la variable de estado
        }
      })
      .catch(error => console.error('Error obteniendo el perfil:', error));
    }

    setRegistrado(registradoGuardado);
  }, []);

  const login = (token, nombre) => {
    localStorage.setItem('token', token);
    localStorage.setItem('nombre', nombre);
    setIsAuthenticated(true);
    setNombre(nombre);

    // Realizar la consulta al backend para obtener las monedas del usuario al hacer login
    fetch('/api/usuario/perfil', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.monedas) {
        setMonedas(data.monedas); // Asignar las monedas a la variable de estado
      }
    })
    .catch(error => console.error('Error obteniendo el perfil:', error));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    setIsAuthenticated(false);
    setNombre('');
    setMonedas(0); // Limpiar las monedas al cerrar sesión
  };

  const registro = (token, nombre) => {
    localStorage.setItem('registrado', 'true');
    setRegistrado(true);
    login(token, nombre);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, registrado, login, logout, registro, nombre, monedas }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
