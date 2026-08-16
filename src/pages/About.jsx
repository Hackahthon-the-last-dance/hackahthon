import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import Card from '../components/shared/Card.jsx';

const SECTION_KEYS = ['what', 'problem', 'simple', 'habits'];

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-text">{t('about.title')}</h1>
        <p className="mt-3 text-base text-text-secondary">{t('about.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {SECTION_KEYS.map((key) => (
          <Card key={key}>
            <h2 className="text-lg font-bold text-text">{t(`about.sections.${key}.title`)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {t(`about.sections.${key}.body`)}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 rounded-2xl border border-warning/30 bg-warning-soft p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning text-white">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="font-bold text-text">{t('about.disclaimer.title')}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{t('about.disclaimer.body')}</p>
        </div>
      </div>
    </div>
  );
}
