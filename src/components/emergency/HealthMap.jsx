import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Clock,
  Timer,
  Stethoscope,
  Star,
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { CLINICS } from '../../data/clinics.js';
import Button from '../shared/Button.jsx';
import Badge from '../shared/Badge.jsx';
import SearchBar from '../shared/SearchBar.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import DirectionsModal from './DirectionsModal.jsx';

const CATEGORIES = ['all', 'emergency', 'hospital', 'primary_care', 'urgent_care', 'pharmacy', 'specialist'];

const CATEGORY_META = {
  emergency: { color: '#E5484D', label: 'emergency' },
  hospital: { color: '#F97316', label: 'hospital' },
  primary_care: { color: '#2FA84F', label: 'primary_care' },
  urgent_care: { color: '#F5A524', label: 'urgent_care' },
  pharmacy: { color: '#30AFFF', label: 'pharmacy' },
  specialist: { color: '#8B5CF6', label: 'specialist' },
};

function readToken(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function distanceToUser(clinic, location) {
  if (!location) return clinic.distanceMiles;
  const R = 3958.8;
  const dLat = ((clinic.lat - location.lat) * Math.PI) / 180;
  const dLng = ((clinic.lng - location.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((location.lat * Math.PI) / 180) * Math.cos((clinic.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isOpenNow(clinic) {
  if (clinic.isOpen24Hours) return true;
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const total = hour * 60 + minutes;
  const closeMatch = clinic.openStatus.match(/(\d{1,2}):(\d{2})/);
  if (!closeMatch) return true;
  const closeTime = Number(closeMatch[1]) * 60 + Number(closeMatch[2]);
  return total < closeTime;
}

export default function HealthMap() {
  const { t } = useTranslation();
  const { status: geoStatus, location, requestLocation } = useGeolocation();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(CLINICS[0]);
  const [directionsClinic, setDirectionsClinic] = useState(null);
  const [manualSearchOpen, setManualSearchOpen] = useState(false);

  const filteredClinics = useMemo(() => {
    return CLINICS.filter((clinic) => {
      const matchesCategory =
        category === 'all'
          ? true
          : category === 'emergency'
          ? clinic.emergencyCapable || clinic.isOpen24Hours
          : clinic.category === category;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        clinic.name.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query) ||
        clinic.specialties.some((s) => s.toLowerCase().includes(query));
      const matchesOpen = !onlyOpen || isOpenNow(clinic);
      return matchesCategory && matchesSearch && matchesOpen;
    });
  }, [category, search, onlyOpen]);

  const sortedClinics = useMemo(() => {
    return [...filteredClinics].sort(
      (a, b) => distanceToUser(a, location) - distanceToUser(b, location)
    );
  }, [filteredClinics, location]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [location?.lat ?? 37.7793, location?.lng ?? -122.4193],
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (location) {
      const primaryColor = readToken('--color-primary', '#0F828C');
      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;background:${primaryColor};border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 6px rgba(15,130,140,0.25);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      group.addLayer(L.marker([location.lat, location.lng], { icon: userIcon }));
      map.setView([location.lat, location.lng], 12);
    }

    sortedClinics.forEach((clinic) => {
      const isSelected = selectedClinic?.id === clinic.id;
      const meta = CATEGORY_META[clinic.category] ?? CATEGORY_META.primary_care;
      const color = meta.color;
      const size = isSelected ? 40 : 33;

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;background:${color};color:#fff;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);${
          isSelected ? `box-shadow:0 0 0 6px ${color}55;` : ''
        }"><div style="transform:rotate(45deg);font-size:13px;font-weight:bold;">${
          clinic.emergencyCapable ? '✚' : '⚕'
        }</div></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const marker = L.marker([clinic.lat, clinic.lng], { icon });
      marker.on('click', () => {
        setSelectedClinic(clinic);
        map.flyTo([clinic.lat, clinic.lng], 14, { duration: 0.8 });
      });
      marker.bindPopup(
        `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:220px;">
          <div style="font-weight:800;font-size:14px;">${clinic.name}</div>
          <div style="font-size:12px;color:#6C8CA3;margin-top:2px;">${clinic.address}</div>
          <div style="display:flex;gap:8px;margin-top:8px;font-size:12px;font-weight:700;">
            <span style="color:#F5A524;">★ ${clinic.rating}</span>
            <span style="color:#2FA84F;">${clinic.isOpen24Hours ? 'Open 24/7' : clinic.openStatus}</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:6px;">
            <span style="background:#30AFFF;color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;text-decoration:none;">${clinic.distanceMiles.toFixed(1)} mi</span>
            <span style="background:#E4F5FF;color:#30AFFF;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;">~${clinic.waitTimeMinutes} min wait</span>
          </div>
        </div>`
      );
      group.addLayer(marker);
    });
  }, [sortedClinics, selectedClinic, location, location?.lat, location?.lng]);

  const handleCardClick = (clinic) => {
    setSelectedClinic(clinic);
    mapInstanceRef.current?.flyTo([clinic.lat, clinic.lng], 14, { duration: 0.8 });
  };

  const showLocationPrompt = geoStatus === 'prompt' && !manualSearchOpen;
  const showDeniedBanner = geoStatus === 'denied';

  return (
    <div className="flex flex-col gap-4">
      {showLocationPrompt && (
        <div className="animate-fade-in flex flex-col items-center gap-3 rounded-xl border border-border bg-input p-5 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Navigation size={20} />
          </div>
          <h4 className="text-base font-bold text-text">{t('emergency.locationPrompt.title')}</h4>
          <p className="max-w-md text-sm text-text-secondary">{t('emergency.locationPrompt.description')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="primary"
              icon={Navigation}
              onClick={requestLocation}
              loading={geoStatus === 'requesting'}
              loadingText={t('emergency.map.locating')}
            >
              {t('emergency.locationPrompt.allow')}
            </Button>
            <Button variant="secondary" onClick={() => setManualSearchOpen(true)}>
              {t('emergency.locationPrompt.searchManually')}
            </Button>
          </div>
        </div>
      )}

      {showDeniedBanner && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <MapPin size={18} className="text-danger" />
            <div>
              <p className="text-sm font-bold text-danger">{t('emergency.locationPrompt.deniedTitle')}</p>
              <p className="text-xs text-text-secondary">{t('emergency.locationPrompt.deniedDescription')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder={t('emergency.map.searchPlaceholder')} className="flex-1" />
        {!showLocationPrompt && geoStatus !== 'granted' && (
          <Button variant="secondary" size="sm" icon={Navigation} onClick={requestLocation}>
            {t('emergency.map.locate')}
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'all'
              ? CLINICS.length
              : CLINICS.filter((c) =>
                  cat === 'emergency'
                    ? c.emergencyCapable || c.isOpen24Hours
                    : c.category === cat
                ).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                category === cat
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border text-text-secondary hover:bg-hover'
              }`}
            >
              {t(`emergency.map.categories.${cat}`)}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  category === cat ? 'bg-primary text-text-inverse' : 'bg-surface-muted text-text-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:bg-hover">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(event) => setOnlyOpen(event.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          <Clock size={13} />
          {t('emergency.map.openNow')}
        </label>
        <span className="text-xs font-semibold text-text-muted">
          {t('emergency.map.nearbyCount', { count: sortedClinics.length })}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        <div className="flex max-h-[620px] flex-col gap-3 overflow-y-auto pr-1">
          {sortedClinics.length === 0 ? (
            <EmptyState
              icon={MapPin}
              description={t('emergency.map.noResults')}
              action={
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setCategory('all');
                    setOnlyOpen(false);
                  }}
                >
                  {t('emergency.map.clearFilters')}
                </Button>
              }
            />
          ) : (
            sortedClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;
              const open = isOpenNow(clinic);
              const meta = CATEGORY_META[clinic.category] ?? CATEGORY_META.primary_care;
              return (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => handleCardClick(clinic)}
                  className={`card-hoverable card flex flex-col gap-2.5 p-4 text-left ${
                    isSelected ? 'border-primary bg-primary-soft/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {clinic.emergencyCapable ? <ShieldAlert size={16} /> : <Stethoscope size={16} />}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-text">{clinic.name}</h4>
                        <span className="flex items-center gap-1 text-xs font-semibold text-warning">
                          <Star size={11} className="fill-warning" />
                          {clinic.rating} ({clinic.reviewsCount})
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-primary-soft px-2 py-1 text-xs font-bold text-primary">
                      {distanceToUser(clinic, location).toFixed(1)} mi
                    </span>
                  </div>

                  <p className="flex items-center gap-1 text-xs text-text-secondary">
                    <MapPin size={13} className="text-text-muted" />
                    <span className="line-clamp-1">{clinic.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {clinic.emergencyCapable && (
                      <Badge variant="danger" icon={ShieldAlert}>
                        {t('emergency.map.er24h')}
                      </Badge>
                    )}
                    <Badge variant="neutral">
                      <Clock size={11} />
                      <span className={open ? 'text-success-strong' : 'text-danger'}>
                        {open ? t('emergency.map.open') : t('emergency.map.closed')} · {clinic.openStatus}
                      </span>
                    </Badge>
                    <Badge variant="info" icon={Timer}>
                      ~{clinic.waitTimeMinutes} min
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {clinic.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                        {s}
                      </span>
                    ))}
                    {clinic.specialties.length > 3 && (
                      <span className="rounded-md px-1 py-0.5 text-[10px] font-semibold text-text-muted">
                        +{clinic.specialties.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <a href={`tel:${clinic.phone}`}>
                      <Button variant="ghost" size="sm" icon={Phone}>
                        {t('emergency.map.call')}
                      </Button>
                    </a>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDirectionsClinic(clinic);
                      }}
                      className="flex items-center gap-1 rounded-md bg-primary-soft px-2.5 py-1.5 text-xs font-bold text-primary transition-colors duration-150 hover:bg-primary-soft/70"
                    >
                      <Navigation size={12} />
                      {t('emergency.map.directions')}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-border shadow-sm">
          <div ref={mapContainerRef} className="h-full min-h-[460px] w-full" />

          <div className="absolute left-3 top-3 z-[400] flex flex-col gap-1.5 rounded-xl border border-border bg-surface/95 p-2.5 shadow-lg backdrop-blur">
            <span className="px-1 text-[10px] font-bold uppercase tracking-wide text-text-muted">
              {t('emergency.map.legend')}
            </span>
            {CATEGORIES.slice(1).map((cat) => (
              <div key={cat} className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-text-secondary">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_META[cat].color }}
                />
                {t(`emergency.map.categories.${cat}`)}
              </div>
            ))}
          </div>

          {selectedClinic && (
            <div className="animate-slide-up absolute bottom-4 left-4 right-4 z-[400] flex max-w-[500px] flex-col gap-2.5 rounded-xl border border-border bg-surface p-4 shadow-xl sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: CATEGORY_META[selectedClinic.category]?.color ?? '#30AFFF' }}
                  >
                    {selectedClinic.emergencyCapable ? <ShieldAlert size={13} /> : <Stethoscope size={13} />}
                  </span>
                  <h4 className="truncate text-sm font-bold text-text">{selectedClinic.name}</h4>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {selectedClinic.address} · {distanceToUser(selectedClinic, location).toFixed(1)} mi · ★{' '}
                  {selectedClinic.rating}
                </p>
                <p className="mt-0.5 text-xs font-semibold">
                  <span className={isOpenNow(selectedClinic) ? 'text-success-strong' : 'text-danger'}>
                    {isOpenNow(selectedClinic) ? t('emergency.map.open') : t('emergency.map.closed')}
                  </span>
                  <span className="text-text-muted"> · {selectedClinic.openStatus} · ~{selectedClinic.waitTimeMinutes} min wait</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" icon={Navigation} onClick={() => setDirectionsClinic(selectedClinic)}>
                  {t('emergency.map.directions')}
                </Button>
                <a href={`tel:${selectedClinic.phone}`}>
                  <Button variant="secondary" size="sm" icon={Phone}>
                    {t('emergency.map.call')}
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <DirectionsModal
        isOpen={Boolean(directionsClinic)}
        clinic={directionsClinic}
        onClose={() => setDirectionsClinic(null)}
      />
    </div>
  );
}
