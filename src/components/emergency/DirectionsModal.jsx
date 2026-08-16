import { useState } from 'react';
import { Car, Bus, Footprints, Phone, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';

const MODES = [
  { id: 'driving', icon: Car, key: 'drive' },
  { id: 'transit', icon: Bus, key: 'transit' },
  { id: 'walking', icon: Footprints, key: 'walk' },
];

export default function DirectionsModal({ isOpen, onClose, clinic }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('driving');

  if (!clinic) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${clinic.name} ${clinic.address}`
  )}&travelmode=${mode}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('emergency.directions.titlePrefix')} ${clinic.name}`}
      subtitle={`${clinic.address} • ${clinic.distanceMiles} mi`}
      maxWidthClassName="max-w-[520px]"
    >
      <div className="flex flex-col gap-5">
        <div className="flex gap-1 rounded-xl bg-input p-1">
          {MODES.map(({ id, icon: Icon, key }) => {
            const selected = mode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                  selected ? 'bg-surface text-primary shadow-sm' : 'text-text-secondary'
                }`}
              >
                <Icon size={17} />
                {t(`emergency.directions.${key}`)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" icon={ExternalLink} iconPosition="right" className="w-full">
              {t('emergency.directions.openInMaps')}
            </Button>
          </a>
          <a href={`tel:${clinic.phone}`}>
            <Button variant="secondary" icon={Phone}>
              {clinic.phone}
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}
