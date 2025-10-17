import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-message">Cargando...</div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default ProtectedRoute;
