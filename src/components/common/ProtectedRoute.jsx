import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppSettings } from '../../context/AppSettingsContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { t } = useAppSettings();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
