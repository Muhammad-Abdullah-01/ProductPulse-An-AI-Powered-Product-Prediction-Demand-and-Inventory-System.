import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate auth — replace with real auth call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-primary)',
    }}>

      {/* ── LEFT — Brand panel ───────────────────────────────────────────── */}
      <div style={{
        background: 'var(--accent)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '-5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', filter: 'blur(32px)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 380, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, marginBottom: 48,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={22} color="white" />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
              color: 'white', letterSpacing: '-0.5px',
            }}>ProductPulse</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
            color: 'white', lineHeight: 1.2, letterSpacing: '-0.8px', marginBottom: 16,
          }}>
            Welcome back to your<br />demand intelligence hub
          </h2>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            Sign in to access your dashboards, forecasts, alerts, and reports — all powered by AI.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 40, textAlign: 'left' }}>
            {[
              '📈  AI demand forecasting with 91% accuracy',
              '⚠️  Real-time stock alerts & reorder triggers',
              '📑  One-click PDF & Excel report exports',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.1)', borderRadius: 10,
                padding: '10px 16px', fontSize: 13, color: 'white',
              }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — Form ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 48px',
        background: 'var(--bg-primary)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 8,
            }}>Sign in</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--status-red-light)', border: '1px solid var(--status-red)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20,
              fontSize: 13, color: 'var(--status-red)',
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: 12.5, fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: 7,
              }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'var(--card-bg)', border: '1.5px solid var(--border)',
                  borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px',
                    background: 'var(--card-bg)', border: '1.5px solid var(--border)',
                    borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                    color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'var(--accent-2)' : 'var(--accent)',
                color: 'white', border: 'none', borderRadius: 10,
                fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(26,122,58,0.35)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Signing in…
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Social */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Google', icon: '🌐' },
              { label: 'Microsoft', icon: '🪟' },
            ].map(s => (
              <button key={s.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10,
                background: 'var(--card-bg)', border: '1.5px solid var(--border)',
                fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600,
                color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 28, lineHeight: 1.6 }}>
            By signing in you agree to our{' '}
            <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
          div[style*="background: 'var(--accent)'"][style*="display: 'flex'"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
