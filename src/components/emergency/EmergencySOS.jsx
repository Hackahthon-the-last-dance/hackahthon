import { useEffect, useState } from 'react';
import { ShieldAlert, Phone, Radio, X } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../shared/Button.jsx';

export default function EmergencySOS() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const contact = currentUser?.emergencyContact;

  const [countdown, setCountdown] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (countdown === null) return undefined;
    if (countdown === 0) {
      setActive(true);
      setCountdown(null);
      return undefined;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const contactName = contact?.name || t('emergency.medicalId.notSet');

  if (countdown !== null) {
    return (
      <div className="animate-scale-in flex flex-col items-center gap-4 rounded-2xl border-2 border-danger bg-danger-soft p-8 text-center shadow-[0_0_25px_rgba(244,63,94,0.25)]">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-danger text-4xl font-extrabold text-white shadow-[0_0_0_15px_rgba(244,63,94,0.25)]">
          {countdown}
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-danger">
            {t('emergency.sos.dispatchingTitle', { seconds: countdown })}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">{t('emergency.sos.dispatchingDescription')}</p>
        </div>
        <Button variant="secondary" size="lg" icon={X} onClick={() => setCountdown(null)}>
          {t('emergency.sos.cancel')}
        </Button>
      </div>
    );
  }

  if (active) {
    return (
      <div className="animate-scale-in flex flex-col items-center gap-4 rounded-2xl border-2 border-danger bg-danger-soft p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]">
          <Radio size={36} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-danger">{t('emergency.sos.activeTitle')}</h3>
          <p className="mt-1 max-w-md text-sm text-text">
            {t('emergency.sos.activeDescription', { name: contactName })}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:911">
            <Button variant="danger" size="lg" icon={Phone}>
              {t('emergency.sos.call911')}
            </Button>
          </a>
          <Button variant="secondary" size="lg" onClick={() => setActive(false)}>
            {t('emergency.sos.standDown')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col items-center gap-4 p-8 text-center">
      <button
        type="button"
        onClick={() => setCountdown(5)}
        title={t('emergency.sos.startHint')}
        className="card-hoverable flex h-28 w-28 flex-col items-center justify-center rounded-full border-[6px] border-danger-soft bg-danger text-white shadow-[0_8px_24px_rgba(244,63,94,0.35)]"
      >
        <ShieldAlert size={38} />
        <span className="mt-0.5 text-base font-extrabold tracking-wide">{t('emergency.sos.startButton')}</span>
      </button>

      <div>
        <h3 className="text-lg font-extrabold text-text">{t('emergency.sos.idleTitle')}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-text-secondary">{t('emergency.sos.idleDescription')}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <a href="tel:911">
          <Button variant="danger" icon={Phone}>
            {t('emergency.sos.call911')}
          </Button>
        </a>
        {contact?.phone && (
          <a href={`tel:${contact.phone}`}>
            <Button variant="secondary" icon={Phone}>
              {t('emergency.sos.callContact', { name: contact.name })}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
