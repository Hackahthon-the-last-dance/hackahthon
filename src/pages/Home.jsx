import { Link } from 'react-router-dom';
import {
  Droplet,
  Moon,
  Dumbbell,
  Pill,
  ListChecks,
  ArrowRight,
  ShoppingBag,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Clock,
  Users,
  Ambulance,
  Activity,
  Sprout,
  Sparkles,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/shared/Card.jsx';
import Button from '../components/shared/Button.jsx';
import { HEALTH_TIPS } from '../data/tips.js';

const PREVIEW_ITEMS = [
  { key: 'water', icon: Droplet },
  { key: 'sleep', icon: Moon },
  { key: 'workout', icon: Dumbbell },
  { key: 'medication', icon: Pill },
  { key: 'tasks', icon: ListChecks },
];

const FEATURES = [
  { key: 'habits', icon: Activity, variant: 'success' },
  { key: 'reminders', icon: Clock, variant: 'primary' },
  { key: 'emergency', icon: Ambulance, variant: 'danger' },
  { key: 'store', icon: ShoppingBag, variant: 'warning' },
  { key: 'progress', icon: Sprout, variant: 'success' },
  { key: 'medicalId', icon: ShieldCheck, variant: 'primary' },
];

const STEPS = [
  { key: 'create', icon: Users },
  { key: 'track', icon: HeartPulse },
  { key: 'improve', icon: Sparkles },
];

const TESTIMONIALS = [
  { key: 'one', name: 'Dilbar', role: 'Healthy habits tracker', initials: 'D', color: '#2FA84F' },
  { key: 'two', name: 'Jasur', role: 'Reminder power user', initials: 'J', color: '#30AFFF' },
  { key: 'three', name: 'Malika', role: 'Emergency-ready parent', initials: 'M', color: '#F97316' },
];

const STATS = [
  { key: 'facilities', value: '120+', icon: Stethoscope },
  { key: 'products', value: '350+', icon: ShoppingBag },
  { key: 'users', value: '12k+', icon: Users },
  { key: 'rating', value: '4.9★', icon: ShieldCheck },
];

function FeatureIcon({ variant, children }) {
  const colorMap = {
    success: 'bg-success-soft text-success-strong',
    primary: 'bg-primary-soft text-primary',
    danger: 'bg-danger-soft text-danger',
    warning: 'bg-warning-soft text-warning',
  };
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[variant]}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col gap-16 py-10 sm:gap-24 sm:py-14">
      <section className="gradient-brand relative overflow-hidden rounded-3xl px-6 py-16 text-center text-white sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {t('home.hero.eyebrow')}
        </p>
        <h1 className="font-display relative mx-auto mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          {t('home.hero.title')}
        </h1>
        <p className="relative mx-auto mt-5 max-w-xl text-base text-white/90 sm:text-lg">
          {t('home.hero.subtitle')}
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-primary shadow-lg transition-transform duration-150 hover:scale-[1.03]"
          >
            {t('home.hero.getStarted')}
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/emergency"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-6 py-3.5 text-base font-bold text-white transition-colors duration-150 hover:bg-white/10"
          >
            <Ambulance size={18} />
            {t('home.hero.emergency')}
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ key, value, icon: Icon }) => (
            <Card key={key} className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-text">{value}</p>
                <p className="text-xs font-semibold text-text-muted">{t(`home.stats.${key}`)}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('home.features.eyebrow')}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-text sm:text-3xl">{t('home.features.title')}</h2>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">{t('home.features.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, variant }) => (
            <Card key={key} hoverable className="flex flex-col gap-3 p-5">
              <FeatureIcon variant={variant}>
                <Icon size={22} />
              </FeatureIcon>
              <div>
                <h3 className="text-base font-bold text-text">{t(`home.features.${key}.title`)}</h3>
                <p className="mt-1 text-sm text-text-secondary">{t(`home.features.${key}.description`)}</p>
              </div>
              <Link
                to={key === 'store' ? '/store' : key === 'emergency' ? '/emergency' : key === 'medicalId' ? '/profile' : `/${key}`}
                className="mt-auto"
              >
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                  {t('common.actions.learnMore')}
                  <ArrowRight size={14} />
                </span>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('home.howItWorks.eyebrow')}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-text sm:text-3xl">{t('home.howItWorks.title')}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map(({ key, icon: Icon }, index) => (
            <div key={key} className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-white shadow-lg">
                  <Icon size={26} />
                </div>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-text text-[11px] font-extrabold text-text-inverse">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-base font-bold text-text">{t(`home.howItWorks.${key}.title`)}</h3>
              <p className="max-w-xs text-sm text-text-secondary">{t(`home.howItWorks.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('home.preview.title')}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-text">{t('home.preview.subtitle')}</h2>
          </div>
          <Link to="/register" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">
            {t('home.preview.cta')}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PREVIEW_ITEMS.map(({ key, icon: Icon }) => (
            <Card key={key} hoverable className="flex flex-col items-center gap-2 text-center p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success-strong">
                <Icon size={22} strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-text">{t(`home.preview.${key}.label`)}</span>
              <span className="text-xs text-text-muted">{t(`home.preview.${key}.hint`)}</span>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('home.tips.eyebrow')}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-text">{t('home.tips.title')}</h2>
            <p className="mt-1 text-sm text-text-secondary">{t('home.tips.subtitle')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HEALTH_TIPS.map((tip) => (
            <Card key={tip.id} hoverable className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: `${tip.color}1A`, color: tip.color }}
                >
                  {tip.tag}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
                  <Clock size={12} />
                  {tip.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-text">{tip.title}</h3>
              <p className="line-clamp-3 text-sm text-text-secondary">{tip.summary}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map(({ key, name, role, initials, color }) => (
            <Card key={key} className="flex flex-col gap-4 p-6">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-text-secondary">{t(`home.testimonials.${key}.quote`)}</p>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{name}</p>
                  <p className="text-xs text-text-muted">{role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="gradient-brand relative overflow-hidden rounded-3xl p-8 text-center text-white sm:p-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{t('home.cta.title')}</h2>
          <p className="mt-3 text-sm text-white/85 sm:text-base">{t('home.cta.subtitle')}</p>
          <form
            className="mt-7 flex max-w-md flex-col gap-3 sm:mx-auto sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              const email = event.currentTarget.email?.value;
              if (email) event.currentTarget.reset();
            }}
          >
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white/95 px-4">
              <Mail size={16} className="shrink-0 text-primary" />
              <input
                name="email"
                type="email"
                required
                placeholder={t('home.cta.emailPlaceholder')}
                className="h-11 w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <Button type="submit" variant="secondary" size="lg" className="shrink-0 !bg-white !text-primary">
              {t('home.cta.subscribe')}
            </Button>
          </form>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/75">
            <CheckCircle2 size={13} />
            {t('home.cta.privacy')}
          </p>
        </div>
      </section>
    </div>
  );
}
