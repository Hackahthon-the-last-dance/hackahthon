// HealthFlow Landing Page with Hero Visuals, Interactive Teasers, and Direct Auth Entry
import React, { useState } from 'react';
import {
  Activity,
  Sparkles,
  ShieldAlert,
  Droplets,
  Flame,
  Moon,
  Pill,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon as MoonIcon,
  Play,
  Heart,
} from 'lucide-react';
import Button from '../components/common/Button';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { IMAGES } from '../constants/images';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setCurrentRoute, theme, toggleTheme, login } = useApp();

  const handleDemoAccess = () => {
    login({ email: 'firdavs@healthflow.app', name: 'Firdavs Abdurazzakov' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Landing Navbar */}
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Activity size={24} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            Health<span style={{ color: 'var(--primary)' }}>Flow</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            ariaLabel="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} color="#fbbf24" /> : <MoonIcon size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => setCurrentRoute('auth')}
          >
            Sign In
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleDemoAccess}
          >
            Live Demo
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '64px 32px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Hero Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', padding: '6px 14px', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(13, 148, 136, 0.25)', borderRadius: 'var(--radius-full)' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
                THE INTELLIGENT PREVENTIVE HEALTH OS
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              Preventive care powered by <span style={{ color: 'var(--primary)' }}>habit momentum</span>.
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              HealthFlow bridges daily lifestyle habits and clinical healthcare. Build sustainable streaks with resilient Minimum Wins, track medications, and discover nearest emergency care in seconds.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleDemoAccess}
              >
                Launch Live App (Firdavs Demo)
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => setCurrentRoute('auth')}
              >
                Create Free Account
              </Button>
            </div>

            {/* Social Trust Metrics */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>84%</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Avg Adherence Rate</p>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-subtle)' }} />
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>100%</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Deterministic Engine</p>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-subtle)' }} />
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>&lt; 5s</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Emergency SOS Dispatch</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card with Overlay Pills */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-card)',
                height: '460px',
                position: 'relative',
              }}
            >
              <ImageWithFallback
                src={IMAGES.heroHealthcare}
                fallbackSrc={IMAGES.fallbackHealthcare}
                alt="HealthFlow Preventive Medicine"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Floating Live Metric Card */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-xl)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
              className="animate-slide-up"
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Activity size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HEALTH MOMENTUM</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  82% Flow Score
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section style={{ padding: '64px 32px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            PRODUCT CAPABILITIES
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
            Built for everyday resilience & clinical clarity
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px', textAlign: 'left' }}>
            <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Deterministic Momentum Engine</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Zero random scores. Calculated in real-time based on today's habit completion, 7-day consistency, vitals, and recovery wins.
              </p>
            </div>

            <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-amber-light)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Minimum Win Recovery Mode</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                When life interferes, complete a gentle 5-minute minimum win to protect streaks and maintain psychological momentum.
              </p>
            </div>

            <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interactive Clinic Discovery</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Real Leaflet OpenStreetMap integration to locate nearby hospitals, urgent care centers, and 24/7 pharmacies with directions.
              </p>
            </div>

            <div className="card card-hoverable" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-rose-light)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>One-Tap Emergency SOS</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Immediate crisis broadcast that shares verified GPS coordinates, blood group, and emergency contacts with local responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '32px', backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          © 2026 HealthFlow Inc. Built for hackathon excellence with zero compromise on functionality.
        </p>
      </footer>
    </div>
  );
}
