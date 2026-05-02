import React, { useState } from 'react';
import { RefreshCw, Eye, Filter } from 'lucide-react';
import { alertsData } from '../data/mockData';

const sevConfig = {
  critical: { label: 'Critical', badgeCls: 'badge-danger',  strip: 'var(--status-red)',    bg: 'var(--status-red-light)'    },
  warning:  { label: 'Warning',  badgeCls: 'badge-warning', strip: 'var(--status-orange)', bg: 'var(--status-orange-light)' },
  stable:   { label: 'Stable',   badgeCls: 'badge-success', strip: 'var(--status-green)',  bg: 'var(--status-green-light)'  },
};

export default function Alerts() {
  const [catFilter, setCatFilter] = useState('All');
  const [sevFilter, setSevFilter] = useState('All');
  const [regFilter, setRegFilter] = useState('All');

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

  const summaryCards = [
    { key: 'critical', emoji: '🔴', label: 'Critical', color: 'var(--status-red)',    strip: 'var(--status-red)'    },
    { key: 'warning',  emoji: '🟠', label: 'Warning',  color: 'var(--status-orange)', strip: 'var(--status-orange)' },
    { key: 'stable',   emoji: '🟢', label: 'Stable',   color: 'var(--status-green)',  strip: 'var(--status-green)'  },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity: 0 }}>Alerts</h1>
        <p className="page-subtitle fade-up" style={{ opacity: 0, animationDelay: '.08s' }}>
          Stock alerts and inventory risk monitoring
        </p>
      </div>

      {/* ── Summary cards + filters on same row ───────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 16, marginBottom: 24, flexWrap: 'wrap',
      }}>

        {/* Summary cards — colored top strip, NO dot */}
        {summaryCards.map((s, i) => (
          <div
            key={s.key}
            className="card fade-up"
            style={{
              opacity: 0, animationDelay: `${0.05 + i * 0.07}s`,
              padding: 0, overflow: 'hidden', minWidth: 120,
              position: 'relative',
            }}
          >
            {/* Colored top strip */}
            <div style={{
              height: 4, background: s.strip,
              borderRadius: '12px 12px 0 0',
            }} />
            <div style={{
              padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 24,
                  fontWeight: 800, color: s.color, lineHeight: 1,
                }}>
                  {counts[s.key]}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Filters — moved to the right of the summary cards */}
        <div
          className="fade-up"
          style={{
            opacity: 0, animationDelay: '.2s',
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}
        >
          <Filter size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

          <select
            className="filter-select"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            {['All','Electronics','Fashion','Groceries','Sports','Beauty','Home & Garden','Appliances']
              .map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            className="filter-select"
            value={sevFilter}
            onChange={e => setSevFilter(e.target.value)}
          >
            {['All','Critical','Warning','Stable'].map(s => <option key={s}>{s}</option>)}
          </select>

          <select
            className="filter-select"
            value={regFilter}
            onChange={e => setRegFilter(e.target.value)}
          >
            {['All','North','South','East','West'].map(r => <option key={r}>{r}</option>)}
          </select>

          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Row count */}
      <div style={{
        fontSize: 12, color: 'var(--text-muted)',
        marginBottom: 12,
      }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {alertsData.length} alerts
      </div>

      {/* ── Alerts Table ─────────────────────────────────────────────── */}
      <div className="card fade-up" style={{ opacity: 0, animationDelay: '.25s' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Region</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Shortage Date</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div style={{ fontSize: 32 }}>🎉</div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        No alerts match your filters
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Try adjusting the filters above
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(alert => (
                  <tr key={alert.id}>
                    <td style={{ fontWeight: 600 }}>{alert.product}</td>
                    <td><span className="badge badge-info">{alert.category}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{alert.region}</td>
                    <td>
                      <span className={`badge ${sevConfig[alert.severity].badgeCls}`}>
                        {alert.stockStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 56 }}>
                          <div className="progress-fill" style={{
                            width: `${Math.min((alert.stock / 200) * 100, 100)}%`,
                            background:
                              alert.severity === 'critical' ? 'var(--status-red)'   :
                              alert.severity === 'warning'  ? 'var(--status-orange)' :
                              'var(--status-green)',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: alert.severity === 'critical' ? 'var(--status-red)' : 'var(--text-primary)',
                        }}>
                          {alert.stock}
                        </span>
                      </div>
                    </td>
                    <td style={{
                      color: alert.shortageDate === '—' ? 'var(--text-muted)' : 'var(--status-orange)',
                      fontWeight: alert.shortageDate !== '—' ? 600 : 400,
                    }}>
                      {alert.shortageDate}
                    </td>
                    <td>
                      <span className={`badge ${sevConfig[alert.severity].badgeCls}`}>
                        {sevConfig[alert.severity].label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {alert.severity !== 'stable' ? (
                          <button className="btn btn-danger btn-sm">
                            <RefreshCw size={11} /> Reorder
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-sm">
                            <Eye size={11} /> Monitor
                          </button>
                        )}
                        <button className="btn btn-secondary btn-sm">
                          <Eye size={11} /> Insights
                        </button>
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
