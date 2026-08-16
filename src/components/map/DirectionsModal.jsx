// Directions & Transit Modal for Clinic Navigation
import React, { useState } from 'react';
import {
  Navigation,
  Car,
  Bus,
  Footprints,
  Phone,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function DirectionsModal({ isOpen, onClose, clinic, userLocation }) {
  const [transitMode, setTransitMode] = useState('driving'); // 'driving' | 'transit' | 'walking'

  if (!clinic) return null;

  const travelTimes = {
    driving: `${Math.max(3, Math.round(clinic.distanceMiles * 3.2))} mins`,
    transit: `${Math.max(8, Math.round(clinic.distanceMiles * 7.5))} mins`,
    walking: `${Math.max(10, Math.round(clinic.distanceMiles * 18))} mins`,
  };

  const steps = {
    driving: [
      `Depart from ${userLocation?.address || 'Current Location'} heading east.`,
      `In 0.3 miles, turn right onto Market St / Mission Blvd.`,
      `Continue straight for ${clinic.distanceMiles} miles.`,
      `Arrive at ${clinic.name} (${clinic.address}) on the right. Parking available in building garage.`,
    ],
    transit: [
      `Walk 2 minutes to the nearest rapid transit stop.`,
      `Take Line 14 / Express Bus toward Downtown Medical District.`,
      `Ride 4 stops and disembark at 5th & Market Station.`,
      `Walk 150 feet north to ${clinic.name} main entrance.`,
    ],
    walking: [
      `Head northeast along pedestrian greenway.`,
      `Cross safely at the pedestrian intersection on 4th Ave.`,
      `Follow designated health corridor for ${clinic.distanceMiles} miles.`,
      `Arrive at clinic entrance on the right.`,
    ],
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    clinic.address + ' ' + clinic.name
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Directions to ${clinic.name}`}
      subtitle={`${clinic.address} • ${clinic.distanceMiles} miles away`}
      maxWidth="580px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            gap: '4px',
          }}
        >
          {[
            { id: 'driving', label: 'Drive', icon: Car, time: travelTimes.driving },
            { id: 'transit', label: 'Transit', icon: Bus, time: travelTimes.transit },
            { id: 'walking', label: 'Walk', icon: Footprints, time: travelTimes.walking },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = transitMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setTransitMode(mode.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--trans-fast)',
                }}
              >
                <Icon size={18} />
                <span>{mode.label}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({mode.time})</span>
              </button>
            );
          })}
        </div>

        {/* Turn-by-Turn Simulated Steps */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Clock size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Estimated Route (~{travelTimes[transitMode]})
            </span>
          </div>

          {steps[transitMode].map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', flex: 1 }}
          >
            <Button
              variant="primary"
              size="md"
              icon={ExternalLink}
              iconPosition="right"
              style={{ width: '100%' }}
            >
              Open in Native Maps
            </Button>
          </a>

          <a href={`tel:${clinic.phone}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="md" icon={Phone}>
              Call {clinic.phone}
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}
