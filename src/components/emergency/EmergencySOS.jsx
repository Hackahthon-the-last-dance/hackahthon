// Emergency SOS Protocol Component with 1-Tap Trigger, Emergency Contacts Dispatch, and 911 Direct Dial
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Phone,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  Volume2,
} from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function EmergencySOS() {
  const { user, userLocation, triggerEmergencySOS, cancelEmergencySOS, sosActive, addToast } = useApp();
  const [countdown, setCountdown] = useState(null);
  const [alertDispatched, setAlertDispatched] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setAlertDispatched(true);
      triggerEmergencySOS();
    }
    return () => clearTimeout(timer);
  }, [countdown, triggerEmergencySOS]);

  const handleStartSOS = () => {
    setCountdown(5);
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    addToast('Emergency countdown cancelled.', 'info');
  };

  const handleResetSOS = () => {
    setAlertDispatched(false);
    cancelEmergencySOS();
  };

  return (
    <div
      style={{
        backgroundColor: sosActive ? 'var(--accent-rose-light)' : 'var(--bg-surface)',
        border: sosActive ? '2px solid var(--accent-rose)' : '1px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: sosActive ? '0 0 25px rgba(244, 63, 94, 0.3)' : 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
        position: 'relative',
        transition: 'all var(--trans-smooth)',
      }}
    >
      {/* SOS Center Pulse Button */}
      {countdown !== null ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} className="animate-scale-in">
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              boxShadow: '0 0 0 15px rgba(244, 63, 94, 0.3)',
              animation: 'pulseGlow 1s infinite',
            }}
          >
            {countdown}
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
              Dispatching Emergency Alert in {countdown}s...
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Broadcasting your location ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}) to emergency contacts.
            </p>
          </div>
          <Button variant="secondary" size="lg" onClick={handleCancelCountdown} icon={X}>
            Cancel Alert
          </Button>
        </div>
      ) : alertDispatched || sosActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} className="animate-scale-in">
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)',
            }}
          >
            <Radio size={40} className="animate-pulse" />
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
              🚨 EMERGENCY PROTOCOL ACTIVE
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', maxWidth: '480px', marginTop: '4px' }}>
              Your emergency contacts ({user?.emergencyContact?.name || 'Aziza Karimova'}) have received your live location and critical Medical ID details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:911" style={{ textDecoration: 'none' }}>
              <Button variant="danger" size="lg" icon={Phone}>
                Call 911 Immediately
              </Button>
            </a>
            <Button variant="secondary" size="lg" onClick={handleResetSOS}>
              Stand Down / Resolve SOS
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
          <button
            onClick={handleStartSOS}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '6px solid var(--accent-rose-light)',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)',
              transition: 'transform var(--trans-fast), box-shadow var(--trans-fast)',
            }}
            className="card-hoverable"
            title="Press and hold or tap to initiate Emergency SOS"
          >
            <ShieldAlert size={42} />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', marginTop: '2px' }}>
              SOS
            </span>
          </button>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              One-Tap Emergency Alert Protocol
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '4px auto 0' }}>
              Instantly notifies your primary emergency contact (<strong>{user?.emergencyContact?.name}</strong>) with your live GPS coordinates, allergies, and blood type.
            </p>
          </div>

          {/* Direct 911 / 112 Hotline Quick Action */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:911" style={{ textDecoration: 'none' }}>
              <Button variant="danger" size="md" icon={Phone}>
                Call 911 (Emergency)
              </Button>
            </a>
            <a href={`tel:${user?.emergencyContact?.phone || '+15552345678'}`} style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="md" icon={Phone}>
                Call {user?.emergencyContact?.name || 'Contact'} ({user?.emergencyContact?.phone})
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
