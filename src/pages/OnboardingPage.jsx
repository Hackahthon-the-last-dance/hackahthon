// Onboarding Page: 4-Step Interactive Personalization Flow with Visual Cards
import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Moon,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import Button from '../components/common/Button';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { IMAGES } from '../constants/images';
import { useApp } from '../context/AppContext';

export default function OnboardingPage() {
  const { user, completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState(['hydration', 'cardio', 'sleep']);

  const goals = [
    { id: 'hydration', label: 'Optimal Hydration', desc: 'Drink 8+ glasses of water daily', icon: Droplets, color: '#0284c7' },
    { id: 'cardio', label: 'Daily Movement & Cardio', desc: '30 min active movement with 5 min minimum wins', icon: Flame, color: '#ea580c' },
    { id: 'sleep', label: 'Restorative Sleep Cycle', desc: '7.5+ hours of restorative sleep', icon: Moon, color: '#6366f1' },
    { id: 'mindfulness', label: 'Mindful Stress Reduction', desc: 'Diaphragmatic breathwork & calm focus', icon: Heart, color: '#0d9488' },
  ];

  const toggleGoal = (id) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(selectedGoals);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
        className="animate-slide-up"
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                STEP {currentStep} OF 3
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Personalizing HealthFlow
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  width: '28px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: step <= currentStep ? 'var(--primary)' : 'var(--bg-input)',
                  transition: 'background var(--trans-fast)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Goals */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                What are your core health focuses?
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Select the pillars you want HealthFlow to track and optimize first.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {goals.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                const Icon = g.icon;
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-card)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all var(--trans-fast)',
                    }}
                    className="card-hoverable"
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        color: g.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {g.label}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        {g.desc}
                      </p>
                    </div>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        border: isSelected ? 'none' : '2px solid var(--border-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                    >
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Minimum Win Concept */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Meet the "Minimum Win" Philosophy
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Health habits fail when people demand perfection. HealthFlow keeps streaks alive even on your busiest days.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--accent-amber-light)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={24} color="var(--accent-amber)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  How Recovery Mode Works
                </h4>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                If you cannot complete a 30-minute cardio run today, simply claim your <strong>5-minute movement stretch</strong>. It logs as a Minimum Win, rescues your streak from breaking, and keeps your Health Momentum above 80%.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>100%</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Zero Shaming</p>
              </div>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>2 min</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Micro Starts</p>
              </div>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>Saved</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Streaks Rescued</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Ready */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }} className="animate-fade-in">
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={36} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                You're Ready for Momentum Flow!
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '480px', marginTop: '6px' }}>
                We have initialized your baseline Health Momentum at 82%. Complete your first habit to see it climb!
              </p>
            </div>
          </div>
        )}

        {/* Bottom Next / Back Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          {currentStep > 1 ? (
            <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleNext}
          >
            {currentStep === 3 ? 'Launch My Dashboard' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
}
