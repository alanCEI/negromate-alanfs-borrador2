import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GuestRoute = () => {
    const { user, loading } = useAuth();

     if (loading) {
        return (
             <div className="loading-message">Cargando...</div>
        );
    }

    // Si el usuario está logueado, lo redirigimos al carrito
    return user ? <Navigate to="/cart" replace /> : <Outlet />;
};

export default GuestRoute;
