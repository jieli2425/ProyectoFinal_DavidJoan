import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [registrado, setRegistrado] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const nombreGuardado = localStorage.getItem('nombre');
        const registradoGuardado = localStorage.getItem('registrado') === 'true';
        const isAdminGuardado = localStorage.getItem('isAdmin') === 'true';

        const resVerificar = await fetch(`${API_URL}/api/auth/verificar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const dataVerificar = await resVerificar.json();

        if (dataVerificar.isAdmin !== undefined) {
          setIsAuthenticated(true);
          setNombre(nombreGuardado);
          setIsAdmin(isAdminGuardado);
          setRegistrado(registradoGuardado);

          const resPerfil = await fetch(`${API_URL}/api/usuarios/perfil`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const dataPerfil = await resPerfil.json();

          if (dataPerfil.monedas) setMonedas(dataPerfil.monedas);
        } else {
          throw new Error('Datos de usuario inválidos');
        }
      } catch (error) {
        console.error('Error en la verificación:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  const login = (token, nombre, isAdmin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    setIsAuthenticated(true);
    setNombre(nombre);
    setIsAdmin(isAdmin);

    fetch(`${API_URL}/api/usuarios/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
        if (data._id) {
        localStorage.setItem('usuario', JSON.stringify(data));
      }
      })
      .catch(error => console.error('Error obteniendo el perfil:', error));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('registrado');
    setIsAuthenticated(false);
    setNombre('');
    setMonedas(0);
    setIsAdmin(false);
    setRegistrado(false);
  };

  const registro = (token, nombre) => {
    localStorage.setItem('registrado', 'true');
    setRegistrado(true);
    login(token, nombre, false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        registrado,
        login,
        logout,
        registro,
        nombre,
        monedas,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);