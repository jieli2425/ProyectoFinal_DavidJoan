    import React, { createContext, useContext, useEffect, useState } from 'react';

    export const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [nombre, setNombre] = useState('');
    const [registrado, setRegistrado] = useState(false); // 🔹 NUEVO estado

    useEffect(() => {
        const token = localStorage.getItem('token');
        const nombreGuardado = localStorage.getItem('nombre');
        const registradoGuardado = localStorage.getItem('registrado') === 'true';

        if (token) {
        setIsAuthenticated(true);
        if (nombreGuardado) setNombre(nombreGuardado);
        }

        setRegistrado(registradoGuardado);
    }, []);

    const login = (token, nombre) => {
        localStorage.setItem('token', token);
        localStorage.setItem('nombre', nombre);
        setIsAuthenticated(true);
        setNombre(nombre);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        setIsAuthenticated(false);
        setNombre('');
    };

    const registro = (token, nombre) => {
        localStorage.setItem('registrado', 'true'); // 🔹 Marcar que se ha registrado
        setRegistrado(true);
        // Si también quieres loguearlo directamente:
        login(token, nombre);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, registrado, login, logout, registro, nombre }}>
        {children}
        </AuthContext.Provider>
    );
    };

    export const useAuth = () => useContext(AuthContext);
