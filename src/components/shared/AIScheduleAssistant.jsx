import { useState } from 'react';
import { Sparkles, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useWellness } from '../../context/WellnessContext.jsx';
import { generateScheduleFromPrompt } from '../../api/gemini.js';
import { todayISO } from '../../utils/date.js';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

function resolveErrorKey(error) {
  if (error?.message === 'network') return 'network';
  if (error?.message === 'http_429') return 'quota';
  if (error?.message === 'missing_key') return 'missingKey';
  return 'generic';
}

export default function AIScheduleAssistant() {
  const { t } = useTranslation();
  const { addReminder } = useWellness();

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | results | added
  const [errorKey, setErrorKey] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [promptError, setPromptError] = useState(null);

  const reset = () => {
    setPrompt('');
    setStatus('idle');
    setErrorKey(null);
    setSuggestions([]);
    setSelected({});
    setPromptError(null);
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setPromptError(t('assistant.emptyPromptError'));
      return;
    }
    setPromptError(null);
    setStatus('loading');
    try {
      const results = await generateScheduleFromPrompt(prompt.trim(), todayISO());
      setSuggestions(results);
      setSelected(Object.fromEntries(results.map((_, i) => [i, true])));
      setStatus('results');
    } catch (error) {
      setErrorKey(resolveErrorKey(error));
      setStatus('error');
    }
  };

  const handleAdd = () => {
    suggestions.forEach((reminder, i) => {
      if (selected[i]) addReminder(reminder);
    });
    setStatus('added');
  };

  const repeatSummary = (reminder) => {
    if (reminder.repeat === 'weekly' && reminder.days.length > 0) {
      return reminder.days.map((d) => t(`reminders.form.dayLabels.${d}`)).join(', ');
    }
    return t(`assistant.repeat.${reminder.repeat}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('assistant.fabLabel')}
        title={t('assistant.fabLabel')}
        className="gradient-brand fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform duration-150 hover:scale-110"
      >
        <Sparkles size={22} strokeWidth={2.25} />
      </button>

      <Modal isOpen={open} onClose={close} title={t('assistant.title')} subtitle={t('assistant.subtitle')}>
        {status === 'idle' || status === 'loading' ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={t('assistant.placeholder')}
              rows={4}
              disabled={status === 'loading'}
              className="w-full resize-none rounded-lg border border-border-strong bg-input p-3 text-sm text-text focus:border-primary focus:outline-none"
            />
            {promptError && (
              <div className="flex items-center gap-2 text-sm text-danger">
                <AlertCircle size={14} />
                <span>{promptError}</span>
              </div>
            )}
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={handleGenerate}
              loading={status === 'loading'}
              loadingText={t('assistant.loading')}
              className="w-full"
            >
              {t('assistant.generate')}
            </Button>
            <p className="text-center text-xs text-text-muted">{t('assistant.disclaimer')}</p>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
              <AlertCircle size={22} />
            </div>
            <p className="text-sm text-text-secondary">{t(`assistant.errors.${errorKey}`)}</p>
            <Button variant="primary" size="sm" onClick={() => setStatus('idle')}>
              {t('common.actions.retry')}
            </Button>
          </div>
        ) : status === 'added' ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success-strong">
              <Check size={22} />
            </div>
            <p className="text-sm font-semibold text-text">{t('assistant.added')}</p>
            <Button variant="secondary" size="sm" icon={RotateCcw} onClick={reset}>
              {t('assistant.startOver')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-text">{t('assistant.resultsTitle')}</h3>

            {suggestions.length === 0 ? (
              <p className="text-sm text-text-secondary">{t('assistant.noResults')}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((reminder, i) => (
                  <label
                    key={i}
                    className="card flex cursor-pointer items-center gap-3 p-3.5"
                  >
                    <span
                      onClick={() => setSelected((s) => ({ ...s, [i]: !s[i] }))}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                        selected[i] ? 'border-primary bg-primary text-white' : 'border-border-strong'
                      }`}
                    >
                      {selected[i] && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-text">{reminder.name}</span>
                      <span className="block text-xs text-text-muted">
                        {reminder.time} &middot; {repeatSummary(reminder)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={RotateCcw} onClick={reset}>
                {t('assistant.startOver')}
              </Button>
              {suggestions.length > 0 && (
                <Button variant="primary" size="sm" onClick={handleAdd} className="flex-1">
                  {t('assistant.addSelected')}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
