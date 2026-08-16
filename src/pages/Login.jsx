import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/shared/Card.jsx';
import Input from '../components/shared/Input.jsx';
import Button from '../components/shared/Button.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveErrorKey(error) {
  if (error?.code === 'invalid_credentials') return 'invalidCredentials';
  if (error?.message === 'network') return 'network';
  return 'generic';
}

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = t('auth.errors.emailRequired');
    else if (!EMAIL_RE.test(form.email)) errors.email = t('auth.errors.emailInvalid');
    if (!form.password) errors.password = t('auth.errors.passwordRequired');
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(location.state?.from ?? '/dashboard', { replace: true });
    } catch (error) {
      setSubmitError(t(`auth.errors.${resolveErrorKey(error)}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[420px] flex-col gap-6 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">{t('auth.login.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('auth.login.subtitle')}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
              <AlertCircle size={16} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <Input
            label={t('auth.login.email')}
            name="email"
            type="email"
            icon={Mail}
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm((f) => ({ ...f, email: event.target.value }))}
            error={fieldErrors.email}
          />

          <Input
            label={t('auth.login.password')}
            name="password"
            type="password"
            icon={Lock}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm((f) => ({ ...f, password: event.target.value }))}
            error={fieldErrors.password}
          />

          <div className="-mt-1 text-right">
            <Link to="/forgot-password" className="text-sm font-semibold text-primary">
              {t('auth.login.forgotPassword')}
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {t('auth.login.submit')}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-text-secondary">
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="font-semibold text-primary">
          {t('auth.login.createAccount')}
        </Link>
      </p>
    </div>
  );
}
