import { useTranslation } from '../context/I18nContext.jsx';
import EmergencySOS from '../components/emergency/EmergencySOS.jsx';
import MedicalIDCard from '../components/emergency/MedicalIDCard.jsx';
import HealthMap from '../components/emergency/HealthMap.jsx';

export default function Emergency() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">{t('emergency.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('emergency.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmergencySOS />
        <MedicalIDCard />
      </div>

      <HealthMap />
    </div>
  );
}
