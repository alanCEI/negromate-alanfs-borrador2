import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Establece 'light' como el tema inicial por defecto si no hay nada en localStorage
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const body = window.document.body;

        // Limpia las clases de tema anteriores para evitar conflictos
        body.classList.remove('light-theme', 'dark-theme');

        // Añade la clase correspondiente al tema actual
        body.classList.add(`${theme}-theme`);

        // Guarda la preferencia en localStorage
        localStorage.setItem('theme', theme);
    }, [theme]); // Este efecto se ejecuta cada vez que el estado 'theme' cambia

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
