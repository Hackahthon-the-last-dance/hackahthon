// Medical ID Card displaying vital emergency medical records
import React from 'react';
import {
  ShieldCheck,
  User,
  Phone,
  AlertCircle,
  Heart,
  FileText,
  Edit2,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useApp } from '../../context/AppContext';

export default function MedicalIDCard({ onEditProfile }) {
  const { user } = useApp();

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
        gap: '18px',
      }}
      className="card-hoverable"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Official Medical ID
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Accessible by emergency responders & paramedics
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Edit2}
          onClick={onEditProfile}
        >
          Edit ID
        </Button>
      </div>

      {/* Grid of Medical Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        <div style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>BLOOD TYPE</span>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)', margin: '2px 0 0' }}>
            {user?.bloodType || 'O+'}
          </p>
        </div>

        <div style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>AGE / GENDER</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
            {user?.age || 28} yrs (M)
          </p>
        </div>

        <div style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>HEIGHT / WEIGHT</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
            {user?.height || '182 cm'} • {user?.weight || '76 kg'}
          </p>
        </div>
      </div>

      {/* Allergies & Medical Conditions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            KNOWN ALLERGIES & SENSITIVITIES
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(user?.allergies || ['Penicillin', 'Peanuts (Mild)']).map((a, i) => (
              <Badge key={i} variant="danger" size="sm">
                ⚠️ {a}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            PRIMARY MEDICAL CONDITIONS
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(user?.conditions || ['Mild Seasonal Asthma']).map((c, i) => (
              <Badge key={i} variant="warning" size="sm">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Emergency Contact & Insurance */}
      <div
        style={{
          padding: '14px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            PRIMARY EMERGENCY CONTACT
          </span>
          <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>
            {user?.emergencyContact?.name} ({user?.emergencyContact?.relation})
          </h5>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {user?.emergencyContact?.phone}
          </span>
        </div>

        <a href={`tel:${user?.emergencyContact?.phone}`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm" icon={Phone}>
            Call Contact
          </Button>
        </a>
      </div>
    </div>
  );
}
