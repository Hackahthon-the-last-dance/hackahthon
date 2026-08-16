// Explicit Location Permission Prompt & Nearby ER / Urgent Care Finder
import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Phone,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import DirectionsModal from '../map/DirectionsModal';
import { useApp } from '../../context/AppContext';

export default function NearbyERFinder() {
  const {
    clinics,
    userLocation,
    locationPermission,
    requestUserLocation,
    addToast,
  } = useApp();

  const [searchManual, setSearchManual] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [activeDirectionsClinic, setActiveDirectionsClinic] = useState(null);

  // Filter 24/7 ERs & Urgent Cares
  const emergencyFacilities = React.useMemo(() => {
    return clinics
      .filter((c) => c.emergencyCapable || c.isOpen24Hours)
      .filter((c) => {
        if (!manualQuery.trim()) return true;
        return (
          c.name.toLowerCase().includes(manualQuery.toLowerCase()) ||
          c.address.toLowerCase().includes(manualQuery.toLowerCase())
        );
      });
  }, [clinics, manualQuery]);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Find Nearest 24/7 Emergency & Urgent Care
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Verified facilities with trauma units and rapid diagnostics
          </p>
        </div>

        <Badge variant="danger" size="sm" icon={ShieldAlert}>
          Active ER Registry
        </Badge>
      </div>

      {/* Explicit Location Permission Banner (Requirement #5) */}
      {locationPermission === 'prompt' && !searchManual ? (
        <div
          style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Navigation size={22} />
          </div>

          <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>
            Find nearby help
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
            Allow HealthFlow to access your device coordinates to calculate immediate distance and drive times to the nearest open trauma centers.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
            <Button
              variant="primary"
              size="md"
              icon={Navigation}
              onClick={requestUserLocation}
            >
              Allow Location
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Search}
              onClick={() => setSearchManual(true)}
            >
              Search Manually
            </Button>
          </div>
        </div>
      ) : locationPermission === 'denied' ? (
        <div
          style={{
            backgroundColor: 'var(--accent-rose-light)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="var(--accent-rose)" />
            <div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-rose)', margin: 0 }}>
                Location access is unavailable.
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                Using standard regional facilities. You can search manually by street name or ZIP code below.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSearchManual(true)}
          >
            Manual Search
          </Button>
        </div>
      ) : null}

      {/* Manual Search Bar */}
      {(searchManual || locationPermission === 'granted' || locationPermission === 'denied') && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 18px',
            border: '1px solid var(--border-input)',
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search ER by facility name, address, or specialty..."
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      )}

      {/* Emergency Facility Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {emergencyFacilities.map((facility) => (
          <div
            key={facility.id}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            className="card-hoverable"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Badge variant="danger" size="sm">
                    ● {facility.openStatus}
                  </Badge>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    Est. Wait: {facility.waitTimeMinutes} mins
                  </span>
                </div>

                <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {facility.name}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {facility.address}
                </p>
              </div>

              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0,
                }}
              >
                {facility.distanceMiles} mi
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button
                variant="primary"
                size="sm"
                icon={Navigation}
                onClick={() => setActiveDirectionsClinic(facility)}
                style={{ flex: 1 }}
              >
                Navigate / Directions
              </Button>

              <a href={`tel:${facility.phone}`} style={{ textDecoration: 'none', flex: 1 }}>
                <Button variant="secondary" size="sm" icon={Phone} style={{ width: '100%' }}>
                  Call Emergency Desk
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Directions Modal */}
      {activeDirectionsClinic && (
        <DirectionsModal
          isOpen={Boolean(activeDirectionsClinic)}
          clinic={activeDirectionsClinic}
          userLocation={userLocation}
          onClose={() => setActiveDirectionsClinic(null)}
        />
      )}
    </div>
  );
}
