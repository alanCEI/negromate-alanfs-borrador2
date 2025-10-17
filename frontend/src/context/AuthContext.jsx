import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            // Aquí podrías validar el token con el backend para asegurar que es válido
            // y obtener los datos frescos del usuario.
            const userData = JSON.parse(localStorage.getItem('userInfo'));
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.auth.login({ email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                setUser(response.data);
                navigate('/cart'); // O a un dashboard de perfil
            }
            return response;
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.auth.register({ username, email, password });
             if (response.data && response.data.token) {
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                setUser(response.data);
                navigate('/cart');
            }
            return response;
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    };
    
    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);