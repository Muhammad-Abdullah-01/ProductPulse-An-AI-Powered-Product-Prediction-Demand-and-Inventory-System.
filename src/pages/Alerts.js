import React, { useState } from 'react';
import { RefreshCw, Eye, Filter, X, AlertTriangle } from 'lucide-react';
import { alertsData } from '../data/mockData';

const sevConfig = {
  critical: { label:'Critical', badgeCls:'badge-danger',  strip:'var(--status-red)',    bg:'var(--status-red-light)'    },
  warning:  { label:'Warning',  badgeCls:'badge-warning', strip:'var(--status-orange)', bg:'var(--status-orange-light)' },
  stable:   { label:'Stable',   badgeCls:'badge-success', strip:'var(--status-green)',  bg:'var(--status-green-light)'  },
};

// H3 — Confirmation modal for Reorder
function ConfirmModal({ product, onConfirm, onCancel }) {
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
          <div style={{ width:40, height:40, borderRadius:10, background:'var(--status-orange-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <AlertTriangle size={20} style={{ color:'var(--status-orange)' }} />
          </div>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--text-primary)' }}>
            Confirm Reorder
          </h3>
        </div>
        <p style={{ fontSize:13.5, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:24 }}>
          Are you sure you want to place a reorder for <strong style={{ color:'var(--text-primary)' }}>{product}</strong>? This will notify your supplier and create a purchase order.
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm}>
            <RefreshCw size={13} /> Confirm Reorder
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Alerts() {
  const [catFilter, setCatFilter] = useState('All');
  const [sevFilter, setSevFilter] = useState('All');
  const [regFilter, setRegFilter] = useState('All');

  // H3 fix — reorder confirmation state
  const [confirmProduct, setConfirmProduct] = useState(null);

  const filtered = alertsData.filter(a => {
    if (catFilter !== 'All' && a.category !== catFilter) return false;
    if (sevFilter !== 'All' && a.severity !== sevFilter.toLowerCase()) return false;
    if (regFilter !== 'All' && a.region !== regFilter) return false;
    return true;
  });

  const counts = {
    critical: alertsData.filter(a => a.severity === 'critical').length,
    warning:  alertsData.filter(a => a.severity === 'warning').length,
    stable:   alertsData.filter(a => a.severity === 'stable').length,
  };

  // H6 fix — active filter chips
  const activeFilters = [
    catFilter !== 'All' && { key:'cat',  label:`Category: ${catFilter}`, clear: () => setCatFilter('All') },
    sevFilter !== 'All' && { key:'sev',  label:`Severity: ${sevFilter}`, clear: () => setSevFilter('All') },
    regFilter !== 'All' && { key:'reg',  label:`Region: ${regFilter}`,   clear: () => setRegFilter('All') },
  ].filter(Boolean);

  const summaryCards = [
    { key:'critical', emoji:'🔴', label:'Critical', color:'var(--status-red)',    strip:'var(--status-red)'    },
    { key:'warning',  emoji:'🟠', label:'Warning',  color:'var(--status-orange)', strip:'var(--status-orange)' },
    { key:'stable',   emoji:'🟢', label:'Stable',   color:'var(--status-green)',  strip:'var(--status-green)'  },
  ];

  return (
    <div>
      {/* H3 — Confirmation modal */}
      {confirmProduct && (
        <ConfirmModal
          product={confirmProduct}
          onConfirm={() => { alert(`Reorder placed for ${confirmProduct}`); setConfirmProduct(null); }}
          onCancel={() => setConfirmProduct(null)}
        />
      )}

      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity:0 }}>Alerts</h1>
        <p className="page-subtitle fade-up" style={{ opacity:0, animationDelay:'.08s' }}>
          Stock alerts and inventory risk monitoring
        </p>
      </div>

      {/* Summary cards + filters on same row */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom: activeFilters.length ? 12 : 24, flexWrap:'wrap' }}>
        {summaryCards.map((s, i) => (
          <div key={s.key} className="card fade-up" style={{ opacity:0, animationDelay:`${0.05+i*0.07}s`, padding:0, overflow:'hidden', minWidth:120 }}>
            <div style={{ height:4, background:s.strip, borderRadius:'12px 12px 0 0' }} />
            <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:22 }}>{s.emoji}</span>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:s.color, lineHeight:1 }}>{counts[s.key]}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ flex:1 }} />

        <div className="fade-up" style={{ opacity:0, animationDelay:'.2s', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <Filter size={14} style={{ color:'var(--text-muted)', flexShrink:0 }} />
          <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {['All','Electronics','Fashion','Groceries','Sports','Beauty','Home & Garden','Appliances'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={sevFilter} onChange={e => setSevFilter(e.target.value)}>
            {['All','Critical','Warning','Stable'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={regFilter} onChange={e => setRegFilter(e.target.value)}>
            {['All','North','South','East','West'].map(r => <option key={r}>{r}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* H6 fix — active filter chips */}
      {activeFilters.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>Active filters:</span>
          {activeFilters.map(f => (
            <div key={f.key} style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'3px 10px', borderRadius:9999,
              background:'var(--accent-light)', border:'1px solid var(--accent)',
              fontSize:12, fontWeight:600, color:'var(--accent)',
            }}>
              {f.label}
              <button onClick={f.clear} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--accent)', display:'flex', alignItems:'center', padding:0 }}>
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => { setCatFilter('All'); setSevFilter('All'); setRegFilter('All'); }}
            style={{ fontSize:12, color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}
          >Clear all</button>
        </div>
      )}

      <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:12 }}>
        Showing <strong style={{ color:'var(--text-primary)' }}>{filtered.length}</strong> of {alertsData.length} alerts
      </div>

      <div className="card fade-up" style={{ opacity:0, animationDelay:'.25s' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th><th>Category</th><th>Region</th>
                <th>Status</th><th>Stock</th><th>Shortage Date</th>
                <th>Severity</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    {/* H10 fix — neutral empty state with actionable message */}
                    <div className="empty-state">
                      <div style={{ fontSize:32 }}>🔍</div>
                      <p style={{ fontWeight:600, color:'var(--text-primary)' }}>
                        No alerts match your current filters
                      </p>
                      <p style={{ fontSize:12, color:'var(--text-muted)', maxWidth:340, textAlign:'center', lineHeight:1.6 }}>
                        Try adjusting the Category, Severity or Region filters above, or{' '}
                        <button onClick={() => { setCatFilter('All'); setSevFilter('All'); setRegFilter('All'); }}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--accent)', fontSize:12, fontWeight:600 }}>
                          clear all filters
                        </button>.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(alert => (
                  <tr key={alert.id}>
                    <td style={{ fontWeight:600 }}>{alert.product}</td>
                    <td><span className="badge badge-info">{alert.category}</span></td>
                    <td style={{ color:'var(--text-secondary)' }}>{alert.region}</td>
                    <td><span className={`badge ${sevConfig[alert.severity].badgeCls}`}>{alert.stockStatus}</span></td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div className="progress-bar" style={{ width:56 }}>
                          <div className="progress-fill" style={{
                            width:`${Math.min((alert.stock/200)*100,100)}%`,
                            background: alert.severity==='critical'?'var(--status-red)':alert.severity==='warning'?'var(--status-orange)':'var(--status-green)',
                          }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:alert.severity==='critical'?'var(--status-red)':'var(--text-primary)' }}>
                          {alert.stock}
                        </span>
                      </div>
                    </td>
                    <td style={{ color:alert.shortageDate==='—'?'var(--text-muted)':'var(--status-orange)', fontWeight:alert.shortageDate!=='—'?600:400 }}>
                      {alert.shortageDate}
                    </td>
                    <td><span className={`badge ${sevConfig[alert.severity].badgeCls}`}>{sevConfig[alert.severity].label}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        {alert.severity !== 'stable' ? (
                          /* H3 fix — confirmation before reorder */
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmProduct(alert.product)}>
                            <RefreshCw size={11} /> Reorder
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-sm"><Eye size={11} /> Monitor</button>
                        )}
                        <button className="btn btn-secondary btn-sm"><Eye size={11} /> Insights</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
