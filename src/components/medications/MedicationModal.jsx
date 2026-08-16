// Add / Edit Medication Modal
import React, { useState, useEffect } from 'react';
import { Pill, Clock, Check, Plus } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useApp } from '../../context/AppContext';

export default function MedicationModal({ isOpen, onClose, initialMed = null }) {
  const { addMedication, editMedication } = useApp();
  const isEditing = Boolean(initialMed);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState('Tablet');
  const [frequency, setFrequency] = useState('Daily');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [prescribedFor, setPrescribedFor] = useState('');
  const [remainingPills, setRemainingPills] = useState('30');
  const [refillThreshold, setRefillThreshold] = useState('10');
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialMed) {
      setName(initialMed.name || '');
      setDosage(initialMed.dosage || '');
      setForm(initialMed.form || 'Tablet');
      setFrequency(initialMed.frequency || 'Daily');
      setScheduledTime(initialMed.scheduledTime || '08:00 AM');
      setPrescribedFor(initialMed.prescribedFor || '');
      setRemainingPills(String(initialMed.remainingPills || 30));
      setRefillThreshold(String(initialMed.refillThreshold || 10));
      setInstructions(initialMed.instructions || '');
    } else {
      setName('');
      setDosage('');
      setForm('Tablet');
      setFrequency('Daily');
      setScheduledTime('08:00 AM');
      setPrescribedFor('');
      setRemainingPills('30');
      setRefillThreshold('10');
      setInstructions('');
    }
    setErrors({});
  }, [initialMed, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Medication name is required.';
    if (!dosage.trim()) newErrors.dosage = 'Dosage (e.g. 500mg) is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const payload = {
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        frequency,
        scheduledTime,
        prescribedFor: prescribedFor.trim() || 'Health support',
        remainingPills: Number(remainingPills) || 30,
        totalPills: Math.max(Number(remainingPills) || 30, 30),
        refillThreshold: Number(refillThreshold) || 10,
        instructions: instructions.trim() || 'Take with a full glass of water.',
      };

      if (isEditing && initialMed) {
        editMedication(initialMed.id, payload);
      } else {
        addMedication(payload);
      }

      setSaving(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Medication' : 'Add New Medication'}
      subtitle="Track prescriptions, supplements, and automated refill reminders."
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Medication Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Vitamin D3, Metformin, Omega-3"
          error={errors.name}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 2,000 IU, 10mg"
            error={errors.dosage}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Form
            </label>
            <select
              value={form}
              onChange={(e) => setForm(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-input)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            >
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Softgel">Softgel</option>
              <option value="Liquid">Liquid / Drop</option>
              <option value="Inhaler">Inhaler</option>
              <option value="Injection">Injection</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Scheduled Daily Time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            placeholder="e.g., 08:00 AM"
            icon={Clock}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-input)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            >
              <option value="Daily morning">Daily Morning</option>
              <option value="Daily with lunch">Daily with Lunch</option>
              <option value="Daily before bed">Daily before Bed</option>
              <option value="Twice daily">Twice Daily</option>
              <option value="As needed (PRN)">As Needed (PRN)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Current Pill Count"
            type="number"
            value={remainingPills}
            onChange={(e) => setRemainingPills(e.target.value)}
          />

          <Input
            label="Refill Alert Threshold"
            type="number"
            value={refillThreshold}
            onChange={(e) => setRefillThreshold(e.target.value)}
            helperText="Alerts when below this number"
          />
        </div>

        <Input
          label="Prescribed For / Health Purpose"
          value={prescribedFor}
          onChange={(e) => setPrescribedFor(e.target.value)}
          placeholder="e.g., Cardiovascular & Bone health"
        />

        <Input
          label="Special Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Take with food or full glass of water."
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} disabled={saving} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            loadingText={isEditing ? 'Saving...' : 'Adding...'}
            icon={Check}
            style={{ flex: 1 }}
          >
            {isEditing ? 'Save Medication' : 'Add Medication'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
