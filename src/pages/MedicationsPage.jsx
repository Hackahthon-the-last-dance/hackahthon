// Medications Schedule & Inventory Management Page
import React, { useState } from 'react';
import { Plus, Pill, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import MedicationCard from '../components/medications/MedicationCard';
import MedicationModal from '../components/medications/MedicationModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { IMAGES } from '../constants/images';
import { useApp } from '../context/AppContext';

export default function MedicationsPage() {
  const { medications } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const takenCount = medications.filter((m) => m.status === 'taken').length;
  const lowStockCount = medications.filter((m) => m.remainingPills <= m.refillThreshold).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Medication Schedule & Refills
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Daily prescribed doses, nutritional supplements, and automated inventory alerts.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingMed(null);
            setIsModalOpen(true);
          }}
        >
          Add Medication
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DOSES TAKEN TODAY</span>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0 0' }}>
            {takenCount} / {medications.length} Complete
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>REFILL ALERTS</span>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: lowStockCount > 0 ? 'var(--accent-amber)' : 'var(--primary)', margin: '4px 0 0' }}>
            {lowStockCount > 0 ? `⚠️ ${lowStockCount} Low Stock` : 'All Stocked ✓'}
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ADHERENCE RATE</span>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 0' }}>
            96% (Last 30 Days)
          </p>
        </div>
      </div>

      {/* Medications Grid or Empty State */}
      {medications.length === 0 ? (
        <EmptyState
          illustration={IMAGES.emptyStates.medications}
          title="No medications currently scheduled."
          description="Keep your prescriptions, vitamins, and minerals organized in one place."
          actionText="Add First Medication"
          onAction={() => {
            setEditingMed(null);
            setIsModalOpen(true);
          }}
          actionIcon={Plus}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {medications.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              onEdit={(m) => {
                setEditingMed(m);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <MedicationModal
          isOpen={isModalOpen}
          initialMed={editingMed}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMed(null);
          }}
        />
      )}
    </div>
  );
}
