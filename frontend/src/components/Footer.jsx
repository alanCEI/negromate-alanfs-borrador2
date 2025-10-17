import { useTheme } from '@/context/ThemeContext';
import '@/css/components/Footer.css';

const Footer = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <footer className="footer">
            <div className="container footer-container">
                <hr className="footer-divider" />
                <div className="footer-content">
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} Negromate Creatives. Todos los derechos reservados.</p>
                    <div className="footer-links">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-button"
                        >
                            Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
                        </button>
                         <a href="https://www.instagram.com/negromatecreatives/" target="_blank" rel="noopener noreferrer">
                           Instagram
                        </a>
                         <a href="https://www.behance.net/soyyowyow/" target="_blank" rel="noopener noreferrer">
                            Behance
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
