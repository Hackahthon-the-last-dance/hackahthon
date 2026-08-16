// Profile Page: Personal, Clinical, Emergency Contact, and Avatar Information
import React from 'react';
import ProfileForm from '../components/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
          Patient Profile & Medical Identity
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your personal details, emergency responders Medical ID, and biometric parameters.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
