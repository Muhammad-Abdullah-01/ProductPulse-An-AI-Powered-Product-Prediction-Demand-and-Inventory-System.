import React, { useState } from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, AlertCircle, Zap, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { forecastData, genderSales, regionalGrowth, heatmapData, categoryDemand } from '../data/mockData';

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

const aiInsights = [
  { icon: TrendingUp, color: 'var(--accent)',   bg: 'var(--accent-light)',   text: 'Grocery demand rising by 22% over last 30 days — consider increasing stock buffer.' },
  { icon: AlertCircle,color: 'var(--status-red)',bg:'var(--status-red-light)',text: 'Stockout risk detected for Electronics in the North region by May 2.' },
  { icon: Zap,         color: 'var(--accent-2)', bg: 'var(--accent-2-light)', text: 'Fashion category outperforming seasonal forecast by 18% — model recalibration recommended.' },
];

function Heatmap() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(6, 1fr)', gap: 4, minWidth: 420 }}>
        <div />
        {months.map(m => (
          <div key={m} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 4 }}>{m}</div>
        ))}
        {heatmapData.map(row => (
          <React.Fragment key={row.category}>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              {row.category}
            </div>
            {row.values.map(v => {
              const intensity = v.value / 120;
              return (
                <div
                  key={v.month}
                  className="tooltip-wrap"
                  style={{ aspectRatio: '1', borderRadius: 6, background: `rgba(26,122,58,${0.1 + intensity * 0.85})`, minHeight: 32 }}
                >
                  <span className="tooltip-box">{row.category} · {v.month}: {v.value} units</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Low</span>
        {[0.1, 0.3, 0.5, 0.7, 0.95].map(o => (
          <div key={o} style={{ width: 20, height: 12, borderRadius: 3, background: `rgba(26,122,58,${o})` }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>High</span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [month,    setMonth]    = useState('Mar');
  const [category, setCategory] = useState('All');
  const [region,   setRegion]   = useState('All');
  const [compareMode, setCompareMode] = useState('month');

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity: 0 }}>Analytics</h1>
        <p className="page-subtitle fade-up" style={{ opacity: 0, animationDelay: '.08s' }}>
          Deep-dive into demand forecasts and market trends
        </p>
      </div>

      {/* Filters */}
      <div className="filter-bar fade-up" style={{ opacity: 0, animationDelay: '.1s' }}>
        <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'].map(m => <option key={m}>{m}</option>)}
        </select>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          {['All','Electronics','Fashion','Groceries','Sports','Beauty'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={region} onChange={e => setRegion(e.target.value)}>
          {['All','North','South','East','West'].map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="filter-select" style={{ marginLeft: 'auto' }}>
          <option>Jan 1 – Mar 31</option>
          <option>Apr 1 – Jun 30</option>
          <option>Last 12 months</option>
        </select>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`btn btn-sm ${compareMode === 'month' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCompareMode('month')}
          >Month vs Month</button>
          <button
            className={`btn btn-sm ${compareMode === 'region' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCompareMode('region')}
          >Region vs Region</button>
        </div>
      </div>

      {/* Row 1: Demand Forecast + Gender Sales */}
      <div className="charts-grid fade-up" style={{ opacity: 0, animationDelay: '.15s' }}>

        {/* Demand Forecast — green bar + dark green line */}
        <div className="card chart-container">
          <div className="card-header">
            <div>
              <div className="card-title">Demand Forecast</div>
              <div className="card-subtitle">Actual vs Predicted · {category}</div>
            </div>
            <button className="icon-btn" style={{ width: 30, height: 30 }}><MoreHorizontal size={15} /></button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={forecastData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT_STYLE} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="actual" fill={G[5]} stroke={G[3]} strokeWidth={1} radius={[3, 3, 0, 0]} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke={G[1]} strokeWidth={2.5} dot={{ r: 3, fill: G[1] }} name="Predicted" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Sales — two green shades stacked area */}
        <div className="card chart-container">
          <div className="card-header">
            <div>
              <div className="card-title">Gender-Based Sales</div>
              <div className="card-subtitle">Male vs Female · by category</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={genderSales} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT_STYLE} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="male"   stackId="1" fill={G[5]} stroke={G[2]} strokeWidth={2} name="Male"   fillOpacity={0.6} />
              <Area type="monotone" dataKey="female" stackId="1" fill={G[4]} stroke={G[1]} strokeWidth={2} name="Female" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Heatmap + Regional Growth */}
      <div className="charts-grid fade-up" style={{ opacity: 0, animationDelay: '.2s' }}>

        {/* Heatmap — green intensity */}
        <div className="card chart-container">
          <div className="card-header">
            <div>
              <div className="card-title">Category Heatmap</div>
              <div className="card-subtitle">Demand intensity by month</div>
            </div>
          </div>
          <Heatmap />
        </div>

        {/* Regional Growth — four green shades */}
        <div className="card chart-container">
          <div className="card-header">
            <div>
              <div className="card-title">Regional Growth</div>
              <div className="card-subtitle">Quarter-over-quarter</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={regionalGrowth} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT_STYLE} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="q1" fill={G[5]} stroke={G[4]} strokeWidth={1.5} name="Q1" fillOpacity={0.5} />
              <Area type="monotone" dataKey="q2" fill={G[4]} stroke={G[3]} strokeWidth={1.5} name="Q2" fillOpacity={0.5} />
              <Area type="monotone" dataKey="q3" fill={G[3]} stroke={G[2]} strokeWidth={1.5} name="Q3" fillOpacity={0.5} />
              <Area type="monotone" dataKey="q4" fill={G[2]} stroke={G[1]} strokeWidth={1.5} name="Q4" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card fade-up" style={{ opacity: 0, animationDelay: '.25s' }}>
        <div className="card-header">
          <div>
            <div className="card-title">🧠 AI-Generated Insights</div>
            <div className="card-subtitle">Powered by ProductPulse ML engine</div>
          </div>
          <span className="badge badge-info">3 new</span>
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          {aiInsights.map((ins, i) => {
            const Icon = ins.icon;
            return (
              <div key={i} className="insight-item">
                <div className="insight-icon" style={{ background: ins.bg, color: ins.color }}>
                  <Icon size={15} />
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5, flex: 1 }}>
                  {ins.text}
                </p>
                <button className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  <ArrowUpRight size={12} /> View
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
