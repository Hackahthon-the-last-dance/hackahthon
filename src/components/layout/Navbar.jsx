import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import ThemeSwitcher from '../shared/ThemeSwitcher.jsx';
import LanguageSwitcher from '../shared/LanguageSwitcher.jsx';

const PUBLIC_LINKS = [
  { to: '/', key: 'home' },
  { to: '/store', key: 'store' },
  { to: '/tools', key: 'tools' },
  { to: '/about', key: 'about' },
  { to: '/emergency', key: 'emergency' },
];

const AUTHED_LINKS = [
  { to: '/dashboard', key: 'dashboard' },
  { to: '/habits', key: 'habits' },
  { to: '/reminders', key: 'reminders' },
  { to: '/progress', key: 'progress' },
  { to: '/store', key: 'store' },
  { to: '/tools', key: 'tools' },
  { to: '/emergency', key: 'emergency' },
];

function navLinkClass({ isActive }) {
  return `rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
    isActive ? 'bg-primary-soft text-primary' : 'text-text-secondary hover:bg-hover hover:text-text'
  }`;
}

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isAuthenticated ? AUTHED_LINKS : PUBLIC_LINKS;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-text" onClick={() => setMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-white">
            <HeartPulse size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-extrabold">{t('common.brand')}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {t(`common.nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/cart"
            aria-label={t('common.nav.cart')}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-hover hover:text-text"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-text-inverse">
                {itemCount}
              </span>
            )}
          </Link>
          <ThemeSwitcher />
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="ml-1 flex items-center gap-2">
              <Link
                to="/profile"
                aria-label={t('common.nav.profile')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-text-secondary transition-colors duration-150 hover:bg-hover"
              >
                <UserIcon size={16} />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-hover hover:text-danger"
                aria-label={t('common.nav.logout')}
                title={t('common.nav.logout')}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <Link to="/login" className="rounded-full px-3 py-2 text-sm font-semibold text-text-secondary hover:text-text">
                {t('common.nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-text-inverse shadow-sm hover:bg-primary-hover"
              >
                {t('common.nav.register')}
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-text lg:hidden"
          aria-label={t('common.nav.menu')}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-slide-up border-t border-border bg-surface px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? 'bg-primary-soft text-primary' : 'text-text-secondary hover:bg-hover'
                  }`
                }
              >
                {t(`common.nav.${link.key}`)}
              </NavLink>
            ))}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-hover"
            >
              {t('common.nav.cart')}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-hover"
                >
                  {t('common.nav.profile')}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-danger hover:bg-hover"
                >
                  {t('common.nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-hover"
                >
                  {t('common.nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-text-inverse"
                >
                  {t('common.nav.register')}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
