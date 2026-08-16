// Profile Form for Editing Patient Info, Medical ID, and Emergency Contacts
import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, Heart, Check, Camera } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import ImageWithFallback from '../common/ImageWithFallback';
import AvatarPickerModal from './AvatarPickerModal';
import { IMAGES } from '../../constants/images';
import { useApp } from '../../context/AppContext';

export default function ProfileForm() {
  const { user, updateProfile } = useApp();

  const [name, setName] = useState(user?.name || 'Firdavs Abdurazzakov');
  const [email, setEmail] = useState(user?.email || 'firdavs@healthflow.app');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 349-8821');
  const [age, setAge] = useState(String(user?.age || 28));
  const [bloodType, setBloodType] = useState(user?.bloodType || 'O+');
  const [height, setHeight] = useState(user?.height || '182 cm');
  const [weight, setWeight] = useState(user?.weight || '76 kg');
  const [allergies, setAllergies] = useState((user?.allergies || ['Penicillin', 'Peanuts (Mild)']).join(', '));
  const [conditions, setConditions] = useState((user?.conditions || ['Mild Seasonal Asthma']).join(', '));
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || 'Aziza Karimova');
  const [emergencyRelation, setEmergencyRelation] = useState(user?.emergencyContact?.relation || 'Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '+1 (555) 234-5678');
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        firstName: name.trim().split(' ')[0],
        email: email.trim(),
        phone: phone.trim(),
        age: Number(age) || 28,
        bloodType,
        height: height.trim(),
        weight: weight.trim(),
        allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
        conditions: conditions.split(',').map((s) => s.trim()).filter(Boolean),
        emergencyContact: {
          name: emergencyName.trim(),
          relation: emergencyRelation.trim(),
          phone: emergencyPhone.trim(),
        },
      });
      setSaving(false);
    }, 400);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Avatar Section */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
              <ImageWithFallback
                src={user?.avatar || IMAGES.avatars.firdavs}
                fallbackSrc={IMAGES.fallbackAvatar}
                alt={user?.name || 'User'}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(true)}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: '2px solid var(--bg-surface)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Change avatar photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {user?.name || 'Firdavs Abdurazzakov'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '2px 0 8px' }}>
              Primary Account Holder • Blood Group {user?.bloodType || 'O+'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Camera}
              onClick={() => setShowAvatarPicker(true)}
            >
              Change Photo
            </Button>
          </div>
        </div>

        {/* Personal Contact Details */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Personal & Contact Information
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
            />

            <Input
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>

        {/* Medical ID & Clinical Metrics */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Emergency Medical ID & Biomarkers
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Blood Group
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
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
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <Input
              label="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="182 cm"
            />

            <Input
              label="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="76 kg"
            />
          </div>

          <Input
            label="Known Allergies (Comma separated)"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Penicillin, Peanuts, Latex"
          />

          <Input
            label="Primary Medical Conditions (Comma separated)"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g. Mild Seasonal Asthma, Hypertension"
          />
        </div>

        {/* Emergency Contact */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Emergency Contact Person
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Input
              label="Contact Full Name"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder="e.g. Aziza Karimova"
            />

            <Input
              label="Relationship"
              value={emergencyRelation}
              onChange={(e) => setEmergencyRelation(e.target.value)}
              placeholder="e.g. Spouse, Parent, Sibling"
            />

            <Input
              label="Emergency Phone"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              icon={Phone}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Check}
            loading={saving}
            loadingText="Saving Profile..."
          >
            Save Profile & Medical ID
          </Button>
        </div>
      </form>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPickerModal
          isOpen={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </>
  );
}
