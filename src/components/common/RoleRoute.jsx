import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppSettings } from '../../context/AppSettingsContext';

const RoleRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const { t } = useAppSettings();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {t('common.loading')}
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;
