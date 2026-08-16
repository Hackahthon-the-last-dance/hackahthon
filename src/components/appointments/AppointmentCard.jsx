// Appointment Card with Auto-Status (Upcoming vs Past), Video Link, Map Linking, Edit & Cancel
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Edit2,
  Trash2,
  MoreVertical,
  Navigation,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ImageWithFallback from '../common/ImageWithFallback';
import ConfirmModal from '../common/ConfirmModal';
import { IMAGES } from '../../constants/images';
import { useApp } from '../../context/AppContext';

export default function AppointmentCard({ appointment, onEdit, onOpenDirections }) {
  const { deleteAppointment, addToast } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Automatically determine if upcoming or past based on date
  const isPast = new Date(appointment.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const effectiveStatus = isPast ? 'Past' : (appointment.status || 'Upcoming');
  const isVideo = appointment.type === 'Video Call';

  const handleCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      deleteAppointment(appointment.id);
      setIsCancelling(false);
      setShowCancelModal(false);
    }, 300);
  };

  const handleJoinVideo = () => {
    addToast(`Connecting to secure encrypted telehealth room with ${appointment.doctorName}...`, 'info');
  };

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: effectiveStatus === 'Upcoming' ? '1.5px solid var(--primary-300)' : '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          position: 'relative',
        }}
        className="card-hoverable animate-slide-up"
      >
        {/* Header: Doctor Avatar, Name, Specialty, Status Chip, Options */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0 }}>
              <ImageWithFallback
                src={appointment.doctorAvatar || IMAGES.avatars.drChen}
                fallbackSrc={IMAGES.fallbackAvatar}
                alt={appointment.doctorName}
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <Badge variant={effectiveStatus === 'Upcoming' ? 'primary' : 'neutral'} size="sm">
                  {effectiveStatus}
                </Badge>
                <Badge variant={isVideo ? 'info' : 'success'} size="sm" icon={isVideo ? Video : MapPin}>
                  {appointment.type}
                </Badge>
              </div>

              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {appointment.doctorName}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, margin: '2px 0 0' }}>
                {appointment.specialty}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="Appointment options"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '160px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  zIndex: 20,
                }}
                className="animate-scale-in"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(appointment);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  className="menu-item-hover"
                >
                  <Edit2 size={14} />
                  <span>Reschedule</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowCancelModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--accent-rose)',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  className="menu-item-hover"
                >
                  <Trash2 size={14} />
                  <span>Cancel Visit</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date, Time & Clinic Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', backgroundColor: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {appointment.date} at {appointment.time}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {appointment.clinicName}
            </span>
          </div>
        </div>

        {/* Purpose & Doctor Notes */}
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {appointment.purpose}
          </p>
          {appointment.notes && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.4 }}>
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
          {isVideo ? (
            <Button
              variant="primary"
              size="sm"
              icon={Video}
              onClick={handleJoinVideo}
              style={{ flex: 1 }}
            >
              Join Video Room
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={Navigation}
              onClick={() => onOpenDirections && onOpenDirections(appointment)}
              style={{ flex: 1 }}
            >
              View Map & Directions
            </Button>
          )}

          <a href={`tel:${appointment.phone || '+15559113000'}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm" icon={Phone}>
              Call Clinic
            </Button>
          </a>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <ConfirmModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
          loading={isCancelling}
          title="Cancel Appointment?"
          message={`Are you sure you want to cancel your scheduled session with ${appointment.doctorName} on ${appointment.date}?`}
          confirmText="Yes, Cancel Appointment"
        />
      )}
    </>
  );
}
