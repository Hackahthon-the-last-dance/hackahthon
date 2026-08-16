import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MailCheck } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { fetchUsersByEmail } from '../api/users.js';
import Card from '../components/shared/Card.jsx';
import Input from '../components/shared/Input.jsx';
import Button from '../components/shared/Button.jsx';
import ErrorState from '../components/shared/ErrorState.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error | sent

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setFieldError(t('auth.errors.emailRequired'));
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setFieldError(t('auth.errors.emailInvalid'));
      return;
    }
    setFieldError(null);
    setStatus('loading');
    try {
      await fetchUsersByEmail(email.trim());
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mx-auto flex max-w-[420px] flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-strong">
          <MailCheck size={26} />
        </div>
        <h1 className="text-2xl font-bold text-text">{t('auth.forgotPassword.successTitle')}</h1>
        <p className="text-sm text-text-secondary">
          {t('auth.forgotPassword.successDescription', { email })}
        </p>
        <Button variant="secondary" onClick={() => setStatus('idle')}>
          {t('auth.forgotPassword.sendAnother')}
        </Button>
        <Link to="/login" className="text-sm font-semibold text-primary">
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[420px] flex-col gap-6 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">{t('auth.forgotPassword.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('auth.forgotPassword.subtitle')}</p>
      </div>

      {status === 'error' ? (
        <ErrorState description={t('auth.errors.network')} onRetry={() => setStatus('idle')} />
      ) : (
        <Card>
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <Input
              label={t('auth.forgotPassword.email')}
              name="email"
              type="email"
              icon={Mail}
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldError}
            />
            <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
              {t('auth.forgotPassword.submit')}
            </Button>
          </form>
        </Card>
      )}

      <p className="text-center text-sm text-text-secondary">
        <Link to="/login" className="font-semibold text-primary">
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </p>
    </div>
  );
}
