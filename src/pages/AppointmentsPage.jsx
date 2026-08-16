// Appointments & Healthcare Locations Discovery Page with Integrated Leaflet Map
import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Video, CheckCircle2 } from 'lucide-react';
import AppointmentCard from '../components/appointments/AppointmentCard';
import AppointmentModal from '../components/appointments/AppointmentModal';
import HealthMap from '../components/map/HealthMap';
import DirectionsModal from '../components/map/DirectionsModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { IMAGES } from '../constants/images';
import { useApp } from '../context/AppContext';

export default function AppointmentsPage() {
  const { appointments, clinics, userLocation } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'map'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [activeDirectionsClinic, setActiveDirectionsClinic] = useState(null);

  const upcomingApts = appointments.filter((a) => {
    const isPast = new Date(a.date) < new Date(new Date().setHours(0, 0, 0, 0));
    return !isPast && a.status !== 'Cancelled';
  });

  const pastApts = appointments.filter((a) => {
    const isPast = new Date(a.date) < new Date(new Date().setHours(0, 0, 0, 0));
    return isPast || a.status === 'Past';
  });

  const handleOpenDirectionsForApt = (apt) => {
    const matchedClinic = clinics.find((c) => c.id === apt.clinicId) || clinics[0];
    setActiveDirectionsClinic(matchedClinic);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Appointments & Care Locations
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Book clinical consultations, telehealth sessions, and explore nearby medical facilities.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingApt(null);
            setIsModalOpen(true);
          }}
        >
          Book Consultation
        </Button>
      </div>

      {/* Tabs: Upcoming / Past / Interactive Map */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'upcoming' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'upcoming' ? 700 : 500,
            fontSize: '0.9375rem',
            cursor: 'pointer',
          }}
        >
          Upcoming Visits ({upcomingApts.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'past' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'past' ? 700 : 500,
            fontSize: '0.9375rem',
            cursor: 'pointer',
          }}
        >
          Past History ({pastApts.length})
        </button>

        <button
          onClick={() => setActiveTab('map')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'map' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'map' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'map' ? 700 : 500,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <MapPin size={16} />
          <span>Interactive Clinic Map</span>
        </button>
      </div>

      {/* Content based on Tab */}
      {activeTab === 'upcoming' && (
        <>
          {upcomingApts.length === 0 ? (
            <EmptyState
              illustration={IMAGES.emptyStates.appointments}
              title="No upcoming doctor appointments."
              description="Stay proactive with regular preventative health check-ups and specialist consults."
              actionText="Schedule Appointment"
              onAction={() => {
                setEditingApt(null);
                setIsModalOpen(true);
              }}
              actionIcon={Plus}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {upcomingApts.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onEdit={(a) => {
                    setEditingApt(a);
                    setIsModalOpen(true);
                  }}
                  onOpenDirections={handleOpenDirectionsForApt}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'past' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {pastApts.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onEdit={(a) => {
                setEditingApt(a);
                setIsModalOpen(true);
              }}
              onOpenDirections={handleOpenDirectionsForApt}
            />
          ))}
        </div>
      )}

      {/* Dedicated Interactive Leaflet Map Section (Requirement #4) */}
      {activeTab === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <HealthMap />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          initialApt={editingApt}
          onClose={() => {
            setIsModalOpen(false);
            setEditingApt(null);
          }}
        />
      )}

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
