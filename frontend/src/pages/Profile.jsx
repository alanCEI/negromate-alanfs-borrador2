import { useState } from 'react';
import Login from '@/components/Login';
import Register from '@/components/Register';
import '@/css/pages/Profile.css';

const Profile = () => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <section className="section profile-page">
            <div className="container profile-container">
                <div className="w-full max-w-md">
                    <div className="profile-toggle-buttons">
                        <button
                            onClick={() => setShowLogin(true)}
                            className={`toggle-button ${showLogin ? 'active' : ''}`}
                        >
                            Iniciar Sesión
                        </button>
                         <button
                            onClick={() => setShowLogin(false)}
                            className={`toggle-button ${!showLogin ? 'active' : ''}`}
                        >
                            Registrarse
                        </button>
                    </div>
                    {showLogin ? <Login /> : <Register />}
                </div>
            </div>
        </section>
    );
};

export default Profile;
