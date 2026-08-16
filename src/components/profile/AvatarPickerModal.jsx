// Avatar Picker Modal with Curated Wellness Presets and Custom Photo Support
import React, { useState } from 'react';
import { User, Check, Upload, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import ImageWithFallback from '../common/ImageWithFallback';
import { IMAGES } from '../../constants/images';
import { useApp } from '../../context/AppContext';

export default function AvatarPickerModal({ isOpen, onClose }) {
  const { user, updateProfile } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || IMAGES.avatars.firdavs);
  const [customUrl, setCustomUrl] = useState('');

  const presets = [
    { id: 'firdavs', label: 'Default', url: IMAGES.avatars.firdavs },
    { id: 'preset1', label: 'Wellness 1', url: IMAGES.avatars.preset1 },
    { id: 'preset2', label: 'Wellness 2', url: IMAGES.avatars.preset2 },
    { id: 'preset3', label: 'Wellness 3', url: IMAGES.avatars.preset3 },
    { id: 'preset4', label: 'Wellness 4', url: IMAGES.avatars.preset4 },
    { id: 'drChen', label: 'Clinical', url: IMAGES.avatars.drChen },
  ];

  const handleSave = () => {
    const finalUrl = customUrl.trim() || selectedAvatar;
    updateProfile({ avatar: finalUrl });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Profile Picture"
      subtitle="Select a high-quality wellness avatar or enter a custom image link."
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Current Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}>
            <ImageWithFallback
              src={customUrl.trim() || selectedAvatar}
              fallbackSrc={IMAGES.fallbackAvatar}
              alt="Avatar Preview"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Live Preview</span>
        </div>

        {/* Preset Avatars Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Curated Avatars
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {presets.map((preset) => {
              const isSelected = selectedAvatar === preset.url && !customUrl.trim();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(preset.url);
                    setCustomUrl('');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-card)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                    <ImageWithFallback
                      src={preset.url}
                      alt={preset.label}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {preset.label}
                  </span>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Image URL Input */}
        <Input
          label="Or Custom Image URL"
          placeholder="https://images.unsplash.com/..."
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} icon={Check} style={{ flex: 1 }}>
            Save Avatar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
