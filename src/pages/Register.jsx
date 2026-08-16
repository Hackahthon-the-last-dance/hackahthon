import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/shared/Card.jsx';
import Input from '../components/shared/Input.jsx';
import Button from '../components/shared/Button.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveErrorKey(error) {
  if (error?.code === 'email_exists') return 'emailExists';
  if (error?.message === 'network') return 'network';
  return 'generic';
}

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = t('auth.errors.nameRequired');
    if (!form.email.trim()) errors.email = t('auth.errors.emailRequired');
    else if (!EMAIL_RE.test(form.email)) errors.email = t('auth.errors.emailInvalid');
    if (!form.password) errors.password = t('auth.errors.passwordRequired');
    else if (form.password.length < 6) errors.password = t('auth.errors.passwordTooShort');
    if (form.confirmPassword !== form.password) errors.confirmPassword = t('auth.errors.passwordMismatch');
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setSubmitError(t(`auth.errors.${resolveErrorKey(error)}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[420px] flex-col gap-6 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">{t('auth.register.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('auth.register.subtitle')}</p>
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
            label={t('auth.register.name')}
            name="name"
            icon={User}
            required
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            error={fieldErrors.name}
          />

          <Input
            label={t('auth.register.email')}
            name="email"
            type="email"
            icon={Mail}
            required
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            error={fieldErrors.email}
          />

          <Input
            label={t('auth.register.password')}
            name="password"
            type="password"
            icon={Lock}
            required
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            error={fieldErrors.password}
          />

          <Input
            label={t('auth.register.confirmPassword')}
            name="confirmPassword"
            type="password"
            icon={Lock}
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            error={fieldErrors.confirmPassword}
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {t('auth.register.submit')}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-text-secondary">
        {t('auth.register.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-primary">
          {t('auth.register.logIn')}
        </Link>
      </p>
    </div>
  );
}
