import { Link } from 'react-router-dom';
import { Droplet, Moon, Dumbbell, Pill, ListChecks, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/shared/Card.jsx';

const PREVIEW_ITEMS = [
  { key: 'water', icon: Droplet },
  { key: 'sleep', icon: Moon },
  { key: 'workout', icon: Dumbbell },
  { key: 'medication', icon: Pill },
  { key: 'tasks', icon: ListChecks },
];

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col gap-16 py-10">
      <section className="gradient-brand relative overflow-hidden rounded-3xl px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {t('home.hero.eyebrow')}
        </p>
        <h1 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          {t('home.hero.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/90 sm:text-lg">
          {t('home.hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-primary shadow-lg transition-transform duration-150 hover:scale-[1.03]"
          >
            {t('home.hero.getStarted')}
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-6 py-3.5 text-base font-bold text-white transition-colors duration-150 hover:bg-white/10"
          >
            <ShoppingBag size={18} />
            {t('home.hero.exploreStore')}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-center text-xl font-bold text-text">{t('home.preview.title')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PREVIEW_ITEMS.map(({ key, icon: Icon }) => (
            <Card key={key} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success-soft text-success-strong">
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-text">{t(`home.preview.${key}.label`)}</span>
              <span className="text-xs text-text-muted">{t(`home.preview.${key}.hint`)}</span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
