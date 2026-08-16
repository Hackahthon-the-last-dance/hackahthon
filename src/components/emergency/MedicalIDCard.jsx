import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, Edit2 } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../shared/Button.jsx';
import Badge from '../shared/Badge.jsx';

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return value.split(',').map((v) => v.trim());
  return [];
}

export default function MedicalIDCard() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const allergies = toList(currentUser?.allergies);
  const conditions = toList(currentUser?.conditions);
  const contact = currentUser?.emergencyContact;

  return (
    <div className="card-hoverable card flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-soft text-danger">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text">{t('emergency.medicalId.title')}</h3>
            <span className="text-xs text-text-muted">{t('emergency.medicalId.subtitle')}</span>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={Edit2} onClick={() => navigate('/profile')}>
          {t('emergency.medicalId.edit')}
        </Button>
      </div>

      <div className="rounded-lg bg-input p-3">
        <span className="text-[0.72rem] font-bold text-text-muted">{t('emergency.medicalId.bloodType').toUpperCase()}</span>
        <p className="mt-0.5 text-xl font-extrabold text-danger">
          {currentUser?.bloodType || t('emergency.medicalId.notSet')}
        </p>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-bold text-text-muted">
          {t('emergency.medicalId.allergies').toUpperCase()}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {allergies.length > 0 ? (
            allergies.map((a) => (
              <Badge key={a} variant="danger">
                {a}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-text-muted">{t('emergency.medicalId.noneListed')}</span>
          )}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-bold text-text-muted">
          {t('emergency.medicalId.conditions').toUpperCase()}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {conditions.length > 0 ? (
            conditions.map((c) => (
              <Badge key={c} variant="warning">
                {c}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-text-muted">{t('emergency.medicalId.noneListed')}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-input p-3.5">
        <div>
          <span className="text-[0.72rem] font-bold text-text-muted">
            {t('emergency.medicalId.emergencyContact').toUpperCase()}
          </span>
          <h5 className="text-sm font-bold text-text">
            {contact?.name ?? t('emergency.medicalId.notSet')}
            {contact?.relation ? ` (${contact.relation})` : ''}
          </h5>
          {contact?.phone && <span className="text-sm text-text-secondary">{contact.phone}</span>}
        </div>
        {contact?.phone && (
          <a href={`tel:${contact.phone}`}>
            <Button variant="secondary" size="sm" icon={Phone}>
              {t('emergency.medicalId.callContact')}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
