// Authentication Page (Register & Login with validation, password reveal, and demo quick-fill)
import React, { useState } from 'react';
import { Activity, Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const { login, register, setCurrentRoute } = useApp();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDemoFill = () => {
    setEmail('firdavs@healthflow.app');
    setPassword('healthflow2026');
    setName('Firdavs Abdurazzakov');
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) newErrors.email = 'Email address is required.';
    else if (!email.includes('@')) newErrors.email = 'Enter a valid email address.';

    if (!password.trim()) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';

    if (isRegisterMode && !name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (isRegisterMode) {
        register({ name: name.trim(), email: email.trim(), password });
      } else {
        login({ email: email.trim(), password, name: name.trim() });
      }
      setLoading(false);
    }, 600);
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
          maxWidth: '460px',
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
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setCurrentRoute('landing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={24} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              Health<span style={{ color: 'var(--primary)' }}>Flow</span>
            </span>
          </button>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {isRegisterMode ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isRegisterMode
              ? 'Start building resilient health habits today.'
              : 'Sign in to access your habits, medications, and momentum.'}
          </p>
        </div>

        {/* Demo 1-Click Quick Fill Helper */}
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px dashed rgba(13, 148, 136, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '0.8125rem', color: 'var(--primary-text)' }}>
            <strong>Demo Mode:</strong> Pre-fill Firdavs account
          </div>
          <Button variant="subtle" size="sm" onClick={handleDemoFill}>
            Fill Demo
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegisterMode && (
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Firdavs Abdurazzakov"
              error={errors.name}
              required
              icon={User}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="firdavs@healthflow.app"
            error={errors.email}
            required
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
            icon={Lock}
          />

          {!isRegisterMode && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => alert('Demo password reset link has been simulated.')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            loadingText={isRegisterMode ? 'Creating Account...' : 'Signing in...'}
            icon={ArrowRight}
            iconPosition="right"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isRegisterMode ? 'Register & Continue' : 'Sign In'}
          </Button>
        </form>

        {/* Toggle Login / Register */}
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isRegisterMode ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrors({});
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrors({});
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
