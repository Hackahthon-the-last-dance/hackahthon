import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/shared/Card.jsx';
import Input from '../components/shared/Input.jsx';
import Button from '../components/shared/Button.jsx';
import ThemeSwitcher from '../components/shared/ThemeSwitcher.jsx';
import LanguageSwitcher from '../components/shared/LanguageSwitcher.jsx';

function toText(value) {
  if (Array.isArray(value)) return value.join(', ');
  return value ?? '';
}

export default function Profile() {
  const { t } = useTranslation();
  const { currentUser, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    bloodType: currentUser?.bloodType ?? '',
    allergies: toText(currentUser?.allergies),
    conditions: toText(currentUser?.conditions),
    contactName: currentUser?.emergencyContact?.name ?? '',
    contactRelation: currentUser?.emergencyContact?.relation ?? '',
    contactPhone: currentUser?.emergencyContact?.phone ?? '',
  });
  const [status, setStatus] = useState('idle'); // idle | saving | error | saved

  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('saving');
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        bloodType: form.bloodType,
        allergies: form.allergies
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        conditions: form.conditions
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        emergencyContact: {
          name: form.contactName,
          relation: form.contactRelation,
          phone: form.contactPhone,
        },
      });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">{t('profile.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('profile.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
            <AlertCircle size={16} />
            <span>{t('profile.errors.generic')}</span>
          </div>
        )}
        {status === 'saved' && (
          <div className="flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2.5 text-sm text-success-strong">
            <CheckCircle2 size={16} />
            <span>{t('profile.saved')}</span>
          </div>
        )}

        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-muted">
            {t('profile.sections.account')}
          </h2>
          <div className="flex flex-col gap-4">
            <Input label={t('profile.fields.name')} name="name" value={form.name} onChange={update('name')} />
            <Input
              label={t('profile.fields.email')}
              name="email"
              type="email"
              value={form.email}
              onChange={update('email')}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-muted">
            {t('profile.sections.medical')}
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              label={t('profile.fields.bloodType')}
              name="bloodType"
              placeholder="O+"
              value={form.bloodType}
              onChange={update('bloodType')}
            />
            <Input
              label={t('profile.fields.allergies')}
              name="allergies"
              value={form.allergies}
              onChange={update('allergies')}
            />
            <Input
              label={t('profile.fields.conditions')}
              name="conditions"
              value={form.conditions}
              onChange={update('conditions')}
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-muted">
            {t('profile.sections.emergencyContact')}
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              label={t('profile.fields.contactName')}
              name="contactName"
              value={form.contactName}
              onChange={update('contactName')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('profile.fields.contactRelation')}
                name="contactRelation"
                value={form.contactRelation}
                onChange={update('contactRelation')}
              />
              <Input
                label={t('profile.fields.contactPhone')}
                name="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={update('contactPhone')}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-muted">
            {t('profile.sections.preferences')}
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-text-muted">{t('profile.theme')}</span>
              <ThemeSwitcher />
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-text-muted">{t('profile.language')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </Card>

        <Button type="submit" variant="primary" size="lg" loading={status === 'saving'} className="w-full">
          {t('profile.save')}
        </Button>
      </form>
    </div>
  );
}
