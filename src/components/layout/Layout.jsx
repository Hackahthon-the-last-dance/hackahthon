import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import AIScheduleAssistant from '../shared/AIScheduleAssistant.jsx';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Layout() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      <main className="page-container flex-1 animate-fade-in">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-text-muted sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} {t('common.brand')}</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-text">{t('common.nav.about')}</Link>
            <Link to="/emergency" className="hover:text-text">{t('common.nav.emergency')}</Link>
          </div>
        </div>
      </footer>

      {isAuthenticated && <AIScheduleAssistant />}
    </div>
  );
}
