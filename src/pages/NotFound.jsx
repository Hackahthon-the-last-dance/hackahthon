import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import Button from '../components/shared/Button.jsx';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Compass size={28} strokeWidth={2} />
      </div>
      <span className="font-display text-6xl font-extrabold text-text">404</span>
      <h1 className="text-2xl font-bold text-text">{t('common.notFound.title')}</h1>
      <p className="max-w-sm text-text-secondary">{t('common.notFound.description')}</p>
      <Button variant="primary" className="mt-2" onClick={() => navigate('/')}>
        {t('common.actions.goHome')}
      </Button>
    </div>
  );
}
