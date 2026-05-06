import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Camera, Lock, Bell, Globe, Shield, AlertTriangle, X } from 'lucide-react';

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track" />
    </label>
  );
}

// H3 fix — Revoke Sessions confirmation modal
function RevokeModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:999,
      background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        background:'var(--card-bg)', border:'1px solid var(--border)',
        borderRadius:16, padding:28, maxWidth:400, width:'90%',
        boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'var(--status-red-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <AlertTriangle size={20} style={{ color:'var(--status-red)' }} />
          </div>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--text-primary)' }}>
            Revoke All Sessions?
          </h3>
        </div>
        <p style={{ fontSize:13.5, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:8 }}>
          This will sign out all other devices immediately. Any unsaved work on those devices will be lost.
        </p>
        <p style={{ fontSize:13, color:'var(--accent)', fontWeight:500, marginBottom:24 }}>
          ✓ You will remain logged in on this device.
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Shield size={13} /> Revoke All Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { theme, toggle } = useTheme();
  const [notifs, setNotifs]     = useState({ email:true, push:false, alerts:true, reports:true });
  const [twofa,  set2fa]        = useState(false);
  const [defRegion, setDefRegion] = useState('North');
  const [defCat, setDefCat]     = useState('Electronics');
  const [showRevoke, setShowRevoke] = useState(false); // H3 fix

  return (
    <div>
      {/* H3 — Revoke Sessions confirmation */}
      {showRevoke && (
        <RevokeModal
          onConfirm={() => { alert('All other sessions have been revoked.'); setShowRevoke(false); }}
          onCancel={() => setShowRevoke(false)}
        />
      )}

      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity:0 }}>Settings</h1>
        <p className="page-subtitle fade-up" style={{ opacity:0, animationDelay:'.08s' }}>
          Manage your profile, security, and preferences
        </p>
      </div>

      {/* ── Profile ─────────────────────────────────────────────────── */}
      <div className="settings-section fade-up" style={{ opacity:0, animationDelay:'.1s' }}>
        <div className="settings-section-header">
          <Camera size={14} style={{ color:'var(--text-muted)' }} /> Profile
        </div>
        <div style={{ padding:'24px 24px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24, paddingBottom:24, borderBottom:'1px solid var(--border-subtle)' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent), var(--accent-2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, fontFamily:'var(--font-display)', color:'white' }}>AS</div>
              <button style={{ position:'absolute', bottom:-2, right:-2, width:24, height:24, borderRadius:'50%', background:'var(--accent)', border:'2px solid var(--card-bg)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <Camera size={10} color="white" />
              </button>
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--text-primary)' }}>Alex Stevens</p>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>alex.stevens@company.com</p>
              <span className="badge badge-info" style={{ marginTop:6 }}>Admin</span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 20px', marginBottom:20 }}>
            {[
              { label:'Full Name',     value:'Alex Stevens',             type:'text'  },
              { label:'Email Address', value:'alex.stevens@company.com', type:'email' },
              { label:'Phone Number',  value:'+1 (555) 234-5678',        type:'tel'   },
              { label:'Company',       value:'RetailPro Inc.',           type:'text'  },
            ].map(f => (
              <div key={f.label}>
                <label className="input-label">{f.label}</label>
                <input className="input-field" type={f.type} defaultValue={f.value} />
              </div>
            ))}
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>

      {/* ── Security ────────────────────────────────────────────────── */}
      <div className="settings-section fade-up" style={{ opacity:0, animationDelay:'.15s' }}>
        <div className="settings-section-header">
          <Lock size={14} style={{ color:'var(--text-muted)' }} /> Security
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Password</div>
            <div className="settings-desc">Last changed 42 days ago</div>
          </div>
          <button className="btn btn-secondary btn-sm"><Lock size={12} /> Change Password</button>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Two-Factor Authentication</div>
            <div className="settings-desc">{twofa ? 'Active — Authenticator app enabled' : 'Disabled — Recommended for account security'}</div>
          </div>
          <ToggleSwitch checked={twofa} onChange={set2fa} />
        </div>
        <div className="settings-row" style={{ alignItems:'flex-start' }}>
          <div>
            <div className="settings-label">Active Sessions</div>
            <div className="settings-desc">2 devices currently signed in</div>
            {/* H10 fix — info note so users understand the action */}
            <div style={{ fontSize:12, color:'var(--accent)', marginTop:5, fontWeight:500 }}>
              ℹ️ This will sign out all other devices. You will remain logged in here.
            </div>
          </div>
          {/* H3 fix — opens confirmation modal */}
          <button className="btn btn-danger btn-sm" onClick={() => setShowRevoke(true)}>
            <Shield size={12} /> Revoke All
          </button>
        </div>
      </div>

      {/* ── Preferences ─────────────────────────────────────────────── */}
      <div className="settings-section fade-up" style={{ opacity:0, animationDelay:'.2s' }}>
        <div className="settings-section-header">
          <Globe size={14} style={{ color:'var(--text-muted)' }} /> Preferences
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Theme</div>
            <div className="settings-desc">Choose light or dark interface</div>
          </div>
          <div className="theme-toggle">
            <button className={`theme-btn${theme==='light'?' active':''}`} onClick={() => toggle('light')}>☀️</button>
            <button className={`theme-btn${theme==='dark'?' active':''}`}  onClick={() => toggle('dark')}>🌙</button>
          </div>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Default Region</div>
            <div className="settings-desc">Filter data by this region by default</div>
          </div>
          <select className="filter-select" value={defRegion} onChange={e => setDefRegion(e.target.value)}>
            {['All','North','South','East','West'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Default Category</div>
            <div className="settings-desc">Default category view across reports</div>
          </div>
          <select className="filter-select" value={defCat} onChange={e => setDefCat(e.target.value)}>
            {['All','Electronics','Fashion','Groceries','Sports','Beauty'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Notifications ───────────────────────────────────────────── */}
      <div className="settings-section fade-up" style={{ opacity:0, animationDelay:'.25s' }}>
        <div className="settings-section-header">
          <Bell size={14} style={{ color:'var(--text-muted)' }} /> Notifications
        </div>
        {[
          { key:'email',   label:'Email Notifications',        desc:'Receive daily digest via email'                   },
          { key:'push',    label:'Push Notifications',         desc:'Browser push alerts for critical events'          },
          { key:'alerts',  label:'Stock Alert Notifications',  desc:'Notify when items reach critical threshold'       },
          { key:'reports', label:'Report Ready Notifications', desc:'Notify when scheduled reports are generated'      },
        ].map(n => (
          <div key={n.key} className="settings-row">
            <div>
              <div className="settings-label">{n.label}</div>
              <div className="settings-desc">{n.desc}</div>
            </div>
            <ToggleSwitch checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]:v }))} />
          </div>
        ))}
      </div>
    </div>
  );
}
