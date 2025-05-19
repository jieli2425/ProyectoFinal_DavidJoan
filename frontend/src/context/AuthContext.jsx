import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const API_URL = 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState('');
  const [monedas, setMonedas] = useState(0);
  const [registrado, setRegistrado] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true); // Para evitar setState si componente desmontado

  useEffect(() => {
    isMounted.current = true;

    const verificarUsuario = async () => {
      setLoading(true);

      const token = localStorage.getItem('token');
      const nombreGuardado = localStorage.getItem('nombre');
      const registradoGuardado = localStorage.getItem('registrado') === 'true';

      setRegistrado(registradoGuardado);

      if (token) {
        try {
          const resVerificar = await fetch(`${API_URL}/api/auth/verificar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (!resVerificar.ok) throw new Error('Token inválido o error servidor');

          const dataVerificar = await resVerificar.json();

          if (dataVerificar.isAdmin !== undefined) {
            if (!isMounted.current) return;

            setIsAuthenticated(true);
            setNombre(nombreGuardado);
            setIsAdmin(dataVerificar.isAdmin);

            const resPerfil = await fetch(`${API_URL}/api/usuarios/perfil`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!resPerfil.ok) throw new Error('Error al obtener perfil');

            const dataPerfil = await resPerfil.json();

            if (!isMounted.current) return;

            setMonedas(dataPerfil.monedas || 0);

          } else {
            // No hagas logout automático, solo limpia estado localmente
            if (!isMounted.current) return;
            setIsAuthenticated(false);
            setNombre('');
            setIsAdmin(false);
            setMonedas(0);
          }
        } catch (error) {
          console.error('Error en la verificación:', error);
          // No llamar logout automático para evitar deslogueos no deseados
          if (!isMounted.current) return;
          setIsAuthenticated(false);
          setNombre('');
          setIsAdmin(false);
          setMonedas(0);
        }
      } else {
        if (!isMounted.current) return;
        setIsAuthenticated(false);
        setNombre('');
        setIsAdmin(false);
        setMonedas(0);
      }

      if (isMounted.current) setLoading(false);
    };

    verificarUsuario();

    return () => {
      isMounted.current = false; // Limpieza para no setear estado si desmontado
    };
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