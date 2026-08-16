// Emergency & Urgent Care Hub: SOS Trigger, Explicit Geolocation ER Finder, Medical ID
import React from 'react';
import { ShieldAlert, Phone, MapPin, Heart, AlertCircle, Radio } from 'lucide-react';
import EmergencySOS from '../components/emergency/EmergencySOS';
import MedicalIDCard from '../components/emergency/MedicalIDCard';
import NearbyERFinder from '../components/emergency/NearbyERFinder';
import { useApp } from '../context/AppContext';

export default function EmergencyPage() {
  const { setCurrentRoute } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--accent-rose)', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={32} />
          Emergency & Urgent Care Hub
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Immediate crisis response, live medical ID access, and nearest 24/7 emergency facility discovery.
        </p>
      </div>

      {/* SOS Protocol Banner */}
      <EmergencySOS />

      {/* Split: Medical ID + Nearby ER Finder */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <MedicalIDCard onEditProfile={() => setCurrentRoute('profile')} />
        <NearbyERFinder />
      </div>
    </div>
  );
}
