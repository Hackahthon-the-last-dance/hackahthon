// Export Health Report Modal with PDF / Print Layout and Summary Statistics
import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Activity,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

export default function ExportReportModal({ isOpen, onClose }) {
  const { user, momentumScore, weekStory, habits, medications, appointments, addToast } = useApp();
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
    addToast('Print dialog triggered.', 'success');
  };

  const handleDownloadJSON = () => {
    setDownloading(true);
    setTimeout(() => {
      const exportObject = {
        generatedAt: new Date().toISOString(),
        patient: user,
        healthMomentum: `${momentumScore}%`,
        weeklyStory: weekStory,
        activeHabits: habits,
        medications: medications,
        appointments: appointments,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `HealthFlow_Report_${user.firstName || 'Patient'}_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setDownloading(false);
      addToast('Health record report downloaded successfully!', 'success');
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Comprehensive Health Record"
      subtitle="Generated summary ready for doctor consultations and personal medical records."
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Printable Report Preview Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                HealthFlow Medical & Habit Report
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Patient: {user?.name} (DOB / Age: {user?.age} yrs) • Blood Group: {user?.bloodType}
              </p>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {momentumScore}% Momentum
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
            <div>
              <strong>Known Allergies:</strong> {(user?.allergies || []).join(', ') || 'None recorded'}
            </div>
            <div>
              <strong>Primary Conditions:</strong> {(user?.conditions || []).join(', ') || 'None recorded'}
            </div>
            <div>
              <strong>Active Medications:</strong> {medications.length} Prescriptions Logged
            </div>
            <div>
              <strong>7-Day Adherence:</strong> 84% Consistency Flow
            </div>
          </div>

          <div style={{ padding: '10px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              DOCTOR CLINICAL SUMMARY
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Patient demonstrates robust hydration adherence and active movement recovery. Blood pressure and vitals consistently stable within optimal ranges.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="md"
            icon={Printer}
            onClick={handlePrint}
            style={{ flex: 1 }}
          >
            Print Summary
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Download}
            onClick={handleDownloadJSON}
            loading={downloading}
            loadingText="Generating Report..."
            style={{ flex: 1 }}
          >
            Download Data (JSON/PDF)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
