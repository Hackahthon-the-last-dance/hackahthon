// Add and Edit Appointment Modal
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useApp } from '../../context/AppContext';

export default function AppointmentModal({ isOpen, onClose, initialApt = null }) {
  const { addAppointment, editAppointment, clinics } = useApp();
  const isEditing = Boolean(initialApt);

  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinicId, setClinicId] = useState(clinics[0]?.id || 'clinic-1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [type, setType] = useState('In-Person');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialApt) {
      setDoctorName(initialApt.doctorName || '');
      setSpecialty(initialApt.specialty || '');
      setClinicId(initialApt.clinicId || clinics[0]?.id || 'clinic-1');
      setDate(initialApt.date || '');
      setTime(initialApt.time || '10:00 AM');
      setType(initialApt.type || 'In-Person');
      setPurpose(initialApt.purpose || '');
      setNotes(initialApt.notes || '');
    } else {
      setDoctorName('Dr. Sarah Chen, MD');
      setSpecialty('Cardiology & Preventive Care');
      setClinicId(clinics[0]?.id || 'clinic-1');
      // default to next week date
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setDate(d.toISOString().split('T')[0]);
      setTime('10:30 AM');
      setType('In-Person');
      setPurpose('Routine Cardiovascular & Metabolic Wellness Check');
      setNotes('Bring recent bloodwork and log metrics.');
    }
    setErrors({});
  }, [initialApt, isOpen, clinics]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!doctorName.trim()) newErrors.doctorName = 'Doctor name is required.';
    if (!date) newErrors.date = 'Date is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const selectedClinic = clinics.find((c) => c.id === clinicId) || clinics[0];
      const payload = {
        doctorName: doctorName.trim(),
        specialty: specialty.trim() || 'General Medicine',
        clinicName: selectedClinic?.name || 'City Central Medical Center',
        clinicAddress: selectedClinic?.address || '450 Sutter Health Way',
        clinicId,
        date,
        time,
        type,
        purpose: purpose.trim() || 'Health Consultation',
        notes: notes.trim(),
        phone: selectedClinic?.phone || '+1 (555) 911-3000',
      };

      if (isEditing && initialApt) {
        editAppointment(initialApt.id, payload);
      } else {
        addAppointment(payload);
      }

      setSaving(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Reschedule / Edit Appointment' : 'Book New Healthcare Appointment'}
      subtitle="Schedule an in-person clinic visit or encrypted telehealth consultation."
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Doctor / Provider Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          placeholder="e.g., Dr. Sarah Chen, MD"
          error={errors.doctorName}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Medical Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g., Cardiology, Primary Care"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Consultation Mode
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
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
              <option value="In-Person">In-Person Clinic Visit</option>
              <option value="Video Call">Video / Telehealth Call</option>
            </select>
          </div>
        </div>

        {/* Clinic Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Healthcare Facility / Clinic Location
          </label>
          <select
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
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
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.address})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Appointment Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            required
            icon={Calendar}
          />

          <Input
            label="Scheduled Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g., 10:30 AM"
            icon={Clock}
          />
        </div>

        <Input
          label="Purpose of Visit"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., Annual preventive screening, Lipid review"
        />

        <Input
          label="Patient Notes / Fasting Instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Fasting 8 hours prior, arrive 10 min early."
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} disabled={saving} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            loadingText="Scheduling..."
            icon={Check}
            style={{ flex: 1 }}
          >
            {isEditing ? 'Save Changes' : 'Confirm Appointment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
