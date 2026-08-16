import { useMemo, useState } from 'react';
import { Scale, Droplet, Flame, Calculator, Info } from 'lucide-react';
import { useTranslation } from '../context/I18nContext.jsx';
import Card from '../components/shared/Card.jsx';
import Button from '../components/shared/Button.jsx';

function BmiResult({ bmi }) {
  const { t } = useTranslation();
  let level = 'normal';
  if (bmi < 18.5) level = 'underweight';
  else if (bmi < 25) level = 'normal';
  else if (bmi < 30) level = 'overweight';
  else level = 'obese';

  const colors = {
    underweight: 'bg-info-soft text-info',
    normal: 'bg-success-soft text-success-strong',
    overweight: 'bg-warning-soft text-warning',
    obese: 'bg-danger-soft text-danger',
  };

  const segments = [
    { min: 14, max: 18.5, color: '#30AFFF', width: '10%' },
    { min: 18.5, max: 25, color: '#2FA84F', width: '27%' },
    { min: 25, max: 30, color: '#F5A524', width: '22%' },
    { min: 30, max: 40, color: '#E5484D', width: '41%' },
  ];

  const position = Math.min(100, Math.max(0, ((bmi - 14) / (40 - 14)) * 100));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-center gap-2 rounded-2xl bg-bg p-5">
        <span className="text-5xl font-extrabold text-text">{bmi.toFixed(1)}</span>
        <span className="pb-1 text-sm font-bold text-text-muted">kg/m²</span>
      </div>

      <div className="relative h-3 w-full rounded-full bg-surface-muted">
        {segments.map((s) => (
          <span
            key={s.min}
            className="absolute top-0 h-full"
            style={{ left: `${((s.min - 14) / 26) * 100}%`, width: s.width, backgroundColor: s.color }}
          />
        ))}
        <span
          className="absolute -top-1 h-5 w-1.5 rounded-full border-2 border-surface bg-text shadow"
          style={{ left: `calc(${position}% - 3px)` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-semibold text-text-muted">
        <span>14</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
        <span className="text-sm font-bold text-text">{t('tools.bmi.category')}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[level]}`}>
          {t(`tools.bmi.levels.${level}`)}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{t('tools.bmi.note')}</p>
    </div>
  );
}

export default function Tools() {
  const { t } = useTranslation();

  const [bmiForm, setBmiForm] = useState({ age: 25, height: 170, weight: 70, gender: 'male' });
  const [waterForm, setWaterForm] = useState({ weight: 70, active: 1 });
  const [calForm, setCalForm] = useState({ age: 25, height: 170, weight: 70, gender: 'male', activity: 1.375 });
  const [showBmi, setShowBmi] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showCal, setShowCal] = useState(false);

  const bmi = useMemo(() => {
    const h = bmiForm.height / 100;
    return bmiForm.weight / (h * h);
  }, [bmiForm]);

  const waterLiters = useMemo(() => {
    const base = waterForm.weight * 0.033;
    return base * (1 + (waterForm.active - 1) * 0.2);
  }, [waterForm]);

  const calories = useMemo(() => {
    const { age, height, weight, gender, activity } = calForm;
    const bmr = gender === 'male' ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    return bmr * activity;
  }, [calForm]);

  const inputClass =
    'w-full rounded-lg border border-border-strong bg-input px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none';
  const labelClass = 'mb-1 block text-xs font-semibold text-text-muted';

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text">{t('tools.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('tools.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">{t('tools.bmi.title')}</h2>
              <p className="text-xs text-text-muted">{t('tools.bmi.hint')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t('tools.age')}</label>
                <input type="number" min={1} max={120} value={bmiForm.age} onChange={(e) => setBmiForm((f) => ({ ...f, age: +e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('tools.bmi.gender')}</label>
                <select value={bmiForm.gender} onChange={(e) => setBmiForm((f) => ({ ...f, gender: e.target.value }))} className={inputClass}>
                  <option value="male">{t('tools.male')}</option>
                  <option value="female">{t('tools.female')}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t('tools.height')} (cm)</label>
                <input type="number" min={50} max={250} value={bmiForm.height} onChange={(e) => setBmiForm((f) => ({ ...f, height: +e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('tools.weight')} (kg)</label>
                <input type="number" min={1} max={300} value={bmiForm.weight} onChange={(e) => setBmiForm((f) => ({ ...f, weight: +e.target.value }))} className={inputClass} />
              </div>
            </div>
          </div>

          <Button variant="primary" icon={Calculator} onClick={() => setShowBmi((v) => !v)}>
            {showBmi ? t('common.actions.hide') : t('tools.calculate')}
          </Button>
          {showBmi && <BmiResult bmi={bmi} />}
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-info-soft text-info">
              <Droplet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">{t('tools.water.title')}</h2>
              <p className="text-xs text-text-muted">{t('tools.water.hint')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className={labelClass}>{t('tools.weight')} (kg)</label>
              <input type="number" min={20} max={300} value={waterForm.weight} onChange={(e) => setWaterForm((f) => ({ ...f, weight: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('tools.water.activity')}</label>
              <select value={waterForm.active} onChange={(e) => setWaterForm((f) => ({ ...f, active: +e.target.value }))} className={inputClass}>
                <option value={1}>{t('tools.water.low')}</option>
                <option value={1.5}>{t('tools.water.medium')}</option>
                <option value={2}>{t('tools.water.high')}</option>
              </select>
            </div>
          </div>

          <Button variant="success" icon={Calculator} onClick={() => setShowWater((v) => !v)}>
            {showWater ? t('common.actions.hide') : t('tools.calculate')}
          </Button>

          {showWater && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-bg p-5">
                <div>
                  <p className="text-3xl font-extrabold text-text">{waterLiters.toFixed(1)} L</p>
                  <p className="text-xs font-semibold text-text-muted">{t('tools.water.daily')}</p>
                </div>
                <Droplet size={36} className="text-info" />
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-muted">
                {[0, 0.25, 0.5, 0.75, 1].map((seg) => (
                  <span key={seg} className="h-full flex-1 border-r border-surface last:border-0" style={{ backgroundColor: `rgba(48,175,255,${0.25 + seg * 0.55})` }} />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">{t('tools.water.note')}</p>
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning-soft text-warning">
              <Flame size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">{t('tools.calories.title')}</h2>
              <p className="text-xs text-text-muted">{t('tools.calories.hint')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t('tools.age')}</label>
                <input type="number" min={1} max={120} value={calForm.age} onChange={(e) => setCalForm((f) => ({ ...f, age: +e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('tools.bmi.gender')}</label>
                <select value={calForm.gender} onChange={(e) => setCalForm((f) => ({ ...f, gender: e.target.value }))} className={inputClass}>
                  <option value="male">{t('tools.male')}</option>
                  <option value="female">{t('tools.female')}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t('tools.height')} (cm)</label>
                <input type="number" min={50} max={250} value={calForm.height} onChange={(e) => setCalForm((f) => ({ ...f, height: +e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('tools.weight')} (kg)</label>
                <input type="number" min={1} max={300} value={calForm.weight} onChange={(e) => setCalForm((f) => ({ ...f, weight: +e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('tools.calories.activity')}</label>
              <select value={calForm.activity} onChange={(e) => setCalForm((f) => ({ ...f, activity: +e.target.value }))} className={inputClass}>
                <option value={1.2}>{t('tools.calories.levels.sedentary')}</option>
                <option value={1.375}>{t('tools.calories.levels.light')}</option>
                <option value={1.55}>{t('tools.calories.levels.moderate')}</option>
                <option value={1.725}>{t('tools.calories.levels.active')}</option>
                <option value={1.9}>{t('tools.calories.levels.veryActive')}</option>
              </select>
            </div>
          </div>

          <Button variant="secondary" icon={Calculator} onClick={() => setShowCal((v) => !v)}>
            {showCal ? t('common.actions.hide') : t('tools.calculate')}
          </Button>

          {showCal && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-bg p-5">
                <div>
                  <p className="text-3xl font-extrabold text-text">{Math.round(calories).toLocaleString()}</p>
                  <p className="text-xs font-semibold text-text-muted">{t('tools.calories.daily')}</p>
                </div>
                <Flame size={36} className="text-warning" />
              </div>
              <p className="flex items-start gap-1.5 text-xs leading-relaxed text-text-secondary">
                <Info size={13} className="mt-0.5 shrink-0 text-text-muted" />
                {t('tools.calories.note')}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
