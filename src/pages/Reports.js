import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Download, FileText, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { reportSummary, miniProfitData, categoryDemand } from '../data/mockData';

// ── Green palette ────────────────────────────────────────────────────────────
const G = {
  1: '#1A7A3A',
  2: '#2D9D5C',
  3: '#4CAF72',
  4: '#76C893',
  5: '#A8DAB5',
};

const TT_STYLE = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text-primary)',
};

const miniDemand = [
  { m: 'J', v: 38 }, { m: 'F', v: 42 }, { m: 'M', v: 39 },
  { m: 'A', v: 48 }, { m: 'M2', v: 52 }, { m: 'J2', v: 46 },
  { m: 'J3', v: 55 }, { m: 'A2', v: 61 },
];
const miniAlerts = [
  { m: 'J', v: 14 }, { m: 'F', v: 22 }, { m: 'M', v: 18 },
  { m: 'A', v: 31 }, { m: 'M2', v: 37 }, { m: 'J2', v: 28 },
  { m: 'J3', v: 24 }, { m: 'A2', v: 37 },
];

const reportTypes = ['Monthly', 'Category', 'Inventory'];

// Green bar shades for category chart
const greenCategoryDemand = categoryDemand.map((c, i) => ({
  ...c,
  color: [G[1], G[2], G[3], G[4], G[5], '#0D5C28'][i] || G[3],
}));

export default function Reports() {
  const [activeType, setActiveType] = useState('Monthly');

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity: 0 }}>Reports</h1>
        <p className="page-subtitle fade-up" style={{ opacity: 0, animationDelay: '.08s' }}>
          Export and analyze business performance reports
        </p>
      </div>

      {/* Summary Cards — with green top accent line */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {reportSummary.map((s, i) => (
          <div
            key={s.label}
            className="card fade-up"
            style={{
              opacity: 0,
              animationDelay: `${0.05 + i * 0.07}s`,
              padding: 20,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Green top accent line — same as KPI cards */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 3, background: 'var(--accent)',
              borderRadius: '12px 12px 0 0',
            }} />
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 10,
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 28,
              fontWeight: 800, letterSpacing: '-1px', color: s.color,
            }}>
              {s.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {s.dir === 'up'
                ? <ArrowUpRight size={13} color="var(--status-green)" />
                : <ArrowDownRight size={13} color="var(--status-red)" />}
              <span style={{
                fontSize: 12,
                color: s.dir === 'up' ? 'var(--status-green)' : 'var(--status-red)',
                fontWeight: 600,
              }}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          {/* Report Type Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {reportTypes.map(t => (
              <button
                key={t}
                className={`btn btn-sm ${activeType === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Mini Charts — all green */}
          <div className="charts-grid-3 fade-up" style={{ opacity: 0, animationDelay: '.15s' }}>
            {[
              { title: 'Profit Trend',  data: miniProfitData, color: G[1], fmt: v => `$${v}K` },
              { title: 'Demand Trend',  data: miniDemand,     color: G[2], fmt: v => `${(v / 10).toFixed(1)}K` },
              { title: 'Alert Trend',   data: miniAlerts,     color: G[3], fmt: v => v },
            ].map(chart => (
              <div key={chart.title} className="card chart-container">
                <div className="card-header" style={{ paddingBottom: 8 }}>
                  <div className="card-title" style={{ fontSize: 12.5 }}>{chart.title}</div>
                  <TrendingUp size={13} style={{ color: chart.color }} />
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={chart.data}>
                    <Line type="monotone" dataKey="v" stroke={chart.color} strokeWidth={2.5} dot={false} />
                    <Tooltip formatter={v => [chart.fmt(v)]} contentStyle={TT_STYLE} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          {/* Category Breakdown — green bars */}
          <div className="card chart-container fade-up" style={{ opacity: 0, animationDelay: '.2s' }}>
            <div className="card-header">
              <div>
                <div className="card-title">Category Breakdown · {activeType}</div>
                <div className="card-subtitle">Units sold by category</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={greenCategoryDemand} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT_STYLE} />
                <Bar dataKey="demand" name="Demand" radius={[4, 4, 0, 0]}>
                  {greenCategoryDemand.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Panel */}
        <div>
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.15s' }}>
            <div className="card-header">
              <div className="card-title">Export Report</div>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="input-label">Report Type</label>
                <select className="filter-select" style={{ width: '100%' }}>
                  <option>Monthly Summary</option>
                  <option>Category Performance</option>
                  <option>Inventory Report</option>
                </select>
              </div>
              <div>
                <label className="input-label">Date Range</label>
                <select className="filter-select" style={{ width: '100%' }}>
                  <option>This Month</option>
                  <option>Last 3 Months</option>
                  <option>YTD</option>
                  <option>Custom</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <button className="btn btn-primary">
                  <Download size={15} /> Export as PDF
                </button>
                <button className="btn btn-secondary">
                  <FileText size={15} /> Export as Excel
                </button>
              </div>
            </div>
          </div>

          {/* Recent Exports */}
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.2s', marginTop: 16 }}>
            <div className="card-header">
              <div className="card-title">Recent Exports</div>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'March_Summary.pdf',  time: '2h ago',   size: '1.4 MB' },
                { name: 'Q1_Category.xlsx',   time: 'Yesterday', size: '842 KB' },
                { name: 'Inventory_Feb.pdf',  time: 'Mar 14',   size: '2.1 MB' },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FileText size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.time} · {f.size}</div>
                  </div>
                  <button className="icon-btn" style={{ width: 28, height: 28 }}>
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
