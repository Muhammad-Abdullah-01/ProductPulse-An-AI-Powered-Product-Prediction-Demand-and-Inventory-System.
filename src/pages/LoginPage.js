import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  // H9 fix — per-field inline errors
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validate = (field, value) => {
    if (field === 'email') {
      if (!value) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email like name@company.com';
      return '';
    }
    if (field === 'password') {
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
      return '';
    }
    return '';
  };

  const handleBlur = (field, value) => {
    setTouched(p => ({ ...p, [field]: true }));
    setErrors(p => ({ ...p, [field]: validate(field, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailErr = validate('email', email);
    const pwErr    = validate('password', password);
    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: pwErr });
    if (emailErr || pwErr) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const fieldStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    background: 'var(--card-bg)',
    border: `1.5px solid ${touched[field] && errors[field] ? 'var(--status-red)' : 'var(--border)'}`,
    borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
    color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-primary)' }}>

      {/* ── LEFT — Brand panel ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--accent)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-10%', right:'-10%', width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,0.06)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'5%', left:'-5%', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.04)', filter:'blur(32px)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:380, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:48 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <TrendingUp size={22} color="white" />
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:'white', letterSpacing:'-0.5px' }}>ProductPulse</span>
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, color:'white', lineHeight:1.2, letterSpacing:'-0.8px', marginBottom:16 }}>
            Welcome back to your<br />demand intelligence hub
          </h2>
          <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.8)', lineHeight:1.7, marginBottom:40 }}>
            Sign in to access your dashboards, forecasts, alerts, and reports — all powered by AI.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12, textAlign:'left' }}>
            {[
              '📈  AI demand forecasting with 91% accuracy',
              '⚠️  Real-time stock alerts & reorder triggers',
              '📑  One-click PDF & Excel report exports',
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 16px', fontSize:13, color:'white' }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — Form ──────────────────────────────────────────── */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'60px 48px', background:'var(--bg-primary)' }}>
        <div style={{ width:'100%', maxWidth:400 }}>

          {/* H3 fix — back to home link */}
          <button
            onClick={() => navigate('/')}
            style={{
              display:'flex', alignItems:'center', gap:6,
              background:'none', border:'none', cursor:'pointer',
              color:'var(--text-muted)', fontSize:13, fontFamily:'var(--font-body)',
              marginBottom:28, padding:0, transition:'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={14} /> Back to home
          </button>

          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', marginBottom:8 }}>Sign in</h1>
            <p style={{ fontSize:14, color:'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color:'var(--accent)', fontWeight:600, textDecoration:'none' }}>Create one free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>

            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'var(--text-secondary)', marginBottom:7 }}>
                Email address
              </label>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); if (touched.email) setErrors(p => ({ ...p, email: validate('email', e.target.value) })); }}
                onBlur={e => handleBlur('email', e.target.value)}
                placeholder="you@company.com"
                style={fieldStyle('email')}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              />
              {/* H9 fix — inline per-field error */}
              {touched.email && errors.email && (
                <p style={{ fontSize:12, color:'var(--status-red)', marginTop:5, display:'flex', alignItems:'center', gap:5 }}>
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:'var(--text-secondary)' }}>Password</label>
                <a href="#" style={{ fontSize:12.5, color:'var(--accent)', fontWeight:600, textDecoration:'none' }}>Forgot password?</a>
              </div>
              <div style={{ position:'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); if (touched.password) setErrors(p => ({ ...p, password: validate('password', e.target.value) })); }}
                  onBlur={e => handleBlur('password', e.target.value)}
                  placeholder="••••••••"
                  style={{ ...fieldStyle('password'), paddingRight:44 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p style={{ fontSize:12, color:'var(--status-red)', marginTop:5, display:'flex', alignItems:'center', gap:5 }}>
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <input type="checkbox" style={{ accentColor:'var(--accent)', width:15, height:15 }} />
              <span style={{ fontSize:13, color:'var(--text-secondary)' }}>Keep me signed in</span>
            </label>

            {/* H1 fix — spinner button */}
            <button
              type="submit" disabled={loading}
              style={{
                width:'100%', padding:'13px',
                background: loading ? 'var(--accent-2)' : 'var(--accent)',
                color:'white', border:'none', borderRadius:10,
                fontFamily:'var(--font-body)', fontSize:14.5, fontWeight:700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition:'all 0.2s', display:'flex', alignItems:'center',
                justifyContent:'center', gap:8,
                boxShadow:'0 4px 16px rgba(26,122,58,0.35)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {loading ? (
                <>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }} />
                  Signing in…
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
            <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>or continue with</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[{ label:'Google', icon:'🌐' }, { label:'Microsoft', icon:'🪟' }].map(s => (
              <button key={s.label} style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                padding:'10px 16px', borderRadius:10,
                background:'var(--card-bg)', border:'1.5px solid var(--border)',
                fontFamily:'var(--font-body)', fontSize:13.5, fontWeight:600,
                color:'var(--text-primary)', cursor:'pointer', transition:'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >{s.icon} {s.label}</button>
            ))}
          </div>

          <p style={{ fontSize:11.5, color:'var(--text-muted)', textAlign:'center', marginTop:28, lineHeight:1.6 }}>
            By signing in you agree to our{' '}
            <a href="#" style={{ color:'var(--accent)', textDecoration:'none' }}>Terms of Service</a>{' '}and{' '}
            <a href="#" style={{ color:'var(--accent)', textDecoration:'none' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
