import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import '@/css/components/Form.css'; // Importa el archivo de estilos unificado

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setLoading(true);
        try {
            await register(username, email, password);
        } catch (err) {
            setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container"> {/* Usa la clase unificada */}
            <h2>Crear Cuenta</h2>
             {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                 <div className="form-group">
                    <label htmlFor="register-username">Nombre de Usuario</label>
                    <input
                        id="register-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                        autoComplete="username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="register-password">Contraseña (mín. 6 caracteres)</label>
                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                        autoComplete="new-password"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="button"
                >
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
};

export default Register;
