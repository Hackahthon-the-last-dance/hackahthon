// Medication Card with Scheduled Actions: Taken, Skipped, Refill, Edit & Delete
import React, { useState } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Info,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ConfirmModal from '../common/ConfirmModal';
import { useApp } from '../../context/AppContext';

export default function MedicationCard({ medication, onEdit }) {
  const { markMedicationStatus, refillMedication, deleteMedication } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLowStock = medication.remainingPills <= medication.refillThreshold;
  const isTaken = medication.status === 'taken';
  const isSkipped = medication.status === 'skipped';

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteMedication(medication.id);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }, 300);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: isTaken
            ? '1.5px solid var(--accent-emerald)'
            : isLowStock
            ? '1.5px solid var(--accent-amber)'
            : '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
        }}
        className="card-hoverable animate-slide-up"
      >
        {/* Card Header: Pill icon, Name, Dosage, Menu */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isTaken ? 'var(--accent-emerald-light)' : 'var(--accent-blue-light)',
                color: isTaken ? 'var(--accent-emerald)' : 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Pill size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Badge
                  variant={isTaken ? 'success' : isSkipped ? 'danger' : 'info'}
                  size="sm"
                >
                  {isTaken ? 'Taken' : isSkipped ? 'Skipped' : 'Scheduled'}
                </Badge>
                {medication.takenAt && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    at {medication.takenAt}
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {medication.name}
              </h4>
            </div>
          </div>

          {/* Action Menu */}
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
              aria-label="Medication menu"
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
                    onEdit(medication);
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
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    refillMedication(medication.id, 30);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--primary)',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  className="menu-item-hover"
                >
                  <Plus size={14} />
                  <span>Refill +30 Pills</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowDeleteModal(true);
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
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Dosage Detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
              DOSAGE & FORM
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {medication.dosage} ({medication.form})
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
              SCHEDULED TIME
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="var(--primary)" /> {medication.scheduledTime}
            </span>
          </div>
        </div>

        {/* Instructions */}
        {medication.instructions && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Instructions:</strong> {medication.instructions}
          </p>
        )}

        {/* Inventory & Low Stock Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
          <span style={{ color: isLowStock ? 'var(--accent-amber)' : 'var(--text-muted)', fontWeight: isLowStock ? 700 : 500 }}>
            {isLowStock ? '⚠️ Low Inventory: ' : 'Inventory: '}
            <strong style={{ color: 'var(--text-primary)' }}>{medication.remainingPills}</strong> pills remaining
          </span>

          {isLowStock && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => refillMedication(medication.id, 30)}
            >
              Refill +30
            </Button>
          )}
        </div>

        {/* Action Controls: Taken / Skipped */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant={isTaken ? 'success' : 'primary'}
            size="md"
            icon={CheckCircle2}
            onClick={() => markMedicationStatus(medication.id, isTaken ? 'pending' : 'taken')}
            style={{ flex: 2 }}
          >
            {isTaken ? 'Taken ✓' : 'Mark Taken'}
          </Button>

          <Button
            variant={isSkipped ? 'danger' : 'secondary'}
            size="md"
            icon={XCircle}
            onClick={() => markMedicationStatus(medication.id, isSkipped ? 'pending' : 'skipped')}
            style={{ flex: 1 }}
          >
            {isSkipped ? 'Skipped' : 'Skip'}
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={isDeleting}
          title={`Remove "${medication.name}"?`}
          message="This medication will be removed from your active daily schedule."
          confirmText="Remove Medication"
        />
      )}
    </>
  );
}
