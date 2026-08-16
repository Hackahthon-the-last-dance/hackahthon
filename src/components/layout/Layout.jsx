import { Outlet, Link } from 'react-router-dom';
import { HeartPulse, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar.jsx';
import AIScheduleAssistant from '../shared/AIScheduleAssistant.jsx';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Layout() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      <main className="page-container flex-1 animate-fade-in">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-[1360px] grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-text">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-white">
                <HeartPulse size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold">{t('common.brand')}</span>
            </Link>
            <p className="max-w-xs text-sm text-text-secondary">{t('common.footer.tagline')}</p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-success-strong">
              <ShieldCheck size={15} />
              {t('common.footer.trustBadge')}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-text">{t('common.footer.productsTitle')}</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              <li><Link to="/dashboard" className="hover:text-primary">{t('common.nav.dashboard')}</Link></li>
              <li><Link to="/habits" className="hover:text-primary">{t('common.nav.habits')}</Link></li>
              <li><Link to="/reminders" className="hover:text-primary">{t('common.nav.reminders')}</Link></li>
              <li><Link to="/progress" className="hover:text-primary">{t('common.nav.progress')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-text">{t('common.footer.resourcesTitle')}</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              <li><Link to="/store" className="hover:text-primary">{t('common.nav.store')}</Link></li>
              <li><Link to="/emergency" className="hover:text-primary">{t('common.nav.emergency')}</Link></li>
              <li><Link to="/about" className="hover:text-primary">{t('common.nav.about')}</Link></li>
              <li><Link to="/cart" className="hover:text-primary">{t('common.nav.cart')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-text">{t('common.footer.contactTitle')}</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-text-muted" />
                <span>{t('common.footer.address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-text-muted" />
                <a href="tel:+15550009111" className="hover:text-primary">{t('common.footer.phone')}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-text-muted" />
                <a href="mailto:hello@healthflow.app" className="hover:text-primary">{t('common.footer.email')}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-text-muted sm:flex-row sm:px-6 lg:px-8">
            <span>© {year} {t('common.brand')}. {t('common.footer.rights')}</span>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-text">{t('common.footer.legal')}</Link>
              <Link to="/about" className="hover:text-text">{t('common.footer.privacy')}</Link>
              <Link to="/emergency" className="hover:text-text">{t('common.nav.emergency')}</Link>
            </div>
          </div>
        </div>
      </footer>

      {isAuthenticated && <AIScheduleAssistant />}
    </div>
  );
}
