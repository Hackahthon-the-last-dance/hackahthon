import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from '../../context/I18nContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, status } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  if (status === 'restoring') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-medium text-text-muted">{t('common.states.loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
