import { useTranslation } from '../../context/I18nContext.jsx';

export default function PageSuspenseFallback() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm font-medium text-text-muted">{t('common.states.loading')}</p>
    </div>
  );
}
