import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [registrado, setRegistrado] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 NUEVO estado de carga

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombre');
    const registradoGuardado = localStorage.getItem('registrado') === 'true';

    if (token) {
      fetch(`${API_URL}/api/auth/verificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
        .then(response => response.json())
        .then(data => {
          if (data.isAdmin !== undefined) {
            setIsAuthenticated(true);
            setNombre(nombreGuardado);
            setIsAdmin(data.isAdmin);

            return fetch(`${API_URL}/api/usuarios/perfil`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          } else {
            throw new Error('Datos de usuario inválidos');
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.monedas) {
            setMonedas(data.monedas);
          }
        })
        .catch(error => {
          console.error('Error en la verificación:', error);
          logout();
        })
        .finally(() => setLoading(false)); // ✅ Marcamos que terminó la carga
    } else {
      setLoading(false); // ✅ No hay token, pero terminamos de cargar
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
    setMonedas(0);
    setIsAdmin(false);
  };

  const registro = (token, nombre) => {
    localStorage.setItem('registrado', 'true');
    setRegistrado(true);
    login(token, nombre, false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      registrado,
      login,
      logout,
      registro,
      nombre,
      monedas,
      isAdmin,
      loading // 👈 Exponemos el estado loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
