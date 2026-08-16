import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Phone, ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { CLINICS } from '../../data/clinics.js';
import Button from '../shared/Button.jsx';
import Badge from '../shared/Badge.jsx';
import SearchBar from '../shared/SearchBar.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import DirectionsModal from './DirectionsModal.jsx';

const CATEGORIES = ['all', 'emergency', 'hospital', 'primary_care', 'urgent_care', 'pharmacy', 'specialist'];

function readToken(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export default function HealthMap() {
  const { t } = useTranslation();
  const { status: geoStatus, location, requestLocation } = useGeolocation();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
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
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [location?.lat ?? 37.788, location?.lng ?? -122.4075],
      zoom: 13,
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
      map.setView([location.lat, location.lng], 13);
    }

    const primaryColor = readToken('--color-primary', '#0F828C');
    const dangerColor = readToken('--color-danger', '#E5484D');

    filteredClinics.forEach((clinic) => {
      const isSelected = selectedClinic?.id === clinic.id;
      const color = clinic.emergencyCapable ? dangerColor : primaryColor;
      const size = isSelected ? 38 : 32;

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;background:${color};color:#fff;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.25);"><div style="transform:rotate(45deg);font-size:13px;font-weight:bold;">${
          clinic.emergencyCapable ? '+' : '⚕'
        }</div></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const marker = L.marker([clinic.lat, clinic.lng], { icon });
      marker.on('click', () => {
        setSelectedClinic(clinic);
        map.flyTo([clinic.lat, clinic.lng], 15, { duration: 0.8 });
      });
      marker.bindPopup(
        `<strong>${clinic.name}</strong><br/><span style="font-size:12px;">${clinic.address}</span><br/><span style="font-size:12px;">★ ${clinic.rating} (${clinic.reviewsCount}) &middot; ${clinic.distanceMiles} mi</span>`
      );
      group.addLayer(marker);
    });
  }, [filteredClinics, selectedClinic, location]);

  const handleCardClick = (clinic) => {
    setSelectedClinic(clinic);
    mapInstanceRef.current?.flyTo([clinic.lat, clinic.lng], 15, { duration: 0.8 });
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
              category === cat
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border text-text-secondary hover:bg-hover'
            }`}
          >
            {t(`emergency.map.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <div className="flex max-h-[540px] flex-col gap-3 overflow-y-auto pr-1">
          <span className="text-sm font-bold text-text">
            {t('emergency.map.nearbyCount', { count: filteredClinics.length })}
          </span>

          {filteredClinics.length === 0 ? (
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
                  }}
                >
                  {t('emergency.map.clearFilters')}
                </Button>
              }
            />
          ) : (
            filteredClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;
              return (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => handleCardClick(clinic)}
                  className={`card-hoverable card flex flex-col gap-2 p-4 text-left ${
                    isSelected ? 'border-primary bg-primary-soft/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5">
                        {clinic.emergencyCapable ? (
                          <Badge variant="danger" icon={ShieldAlert}>
                            24/7 ER
                          </Badge>
                        ) : (
                          <Badge variant="primary">{clinic.category.replace('_', ' ')}</Badge>
                        )}
                        <span className="text-xs font-bold text-warning">
                          &#9733; {clinic.rating} ({clinic.reviewsCount})
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-text">{clinic.name}</h4>
                    </div>
                    <span className="shrink-0 rounded-md bg-input px-2 py-1 text-xs font-bold text-primary">
                      {clinic.distanceMiles} mi
                    </span>
                  </div>

                  <p className="flex items-center gap-1 text-xs text-text-secondary">
                    <MapPin size={13} className="text-text-muted" />
                    {clinic.address}
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-xs font-semibold text-success-strong">&#9679; {clinic.openStatus}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDirectionsClinic(clinic);
                      }}
                      className="flex items-center gap-1 rounded-md bg-primary-soft px-2 py-1 text-xs font-bold text-primary"
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

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border shadow-sm">
          <div ref={mapContainerRef} className="h-full min-h-[420px] w-full" />

          {selectedClinic && (
            <div className="animate-slide-up absolute bottom-4 left-4 right-4 z-[400] flex max-w-[460px] items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-xl">
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-text">{selectedClinic.name}</h4>
                <p className="mt-0.5 text-xs text-text-muted">
                  {selectedClinic.address} &middot; {selectedClinic.distanceMiles} mi
                </p>
                <div className="mt-2 flex gap-2">
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
