import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MoreHorizontal, Clock } from 'lucide-react';
import {
  kpiData, profitTrend, categoryDemand, regionalData, recentActivity, topAlerts
} from '../data/mockData';

// ── Green palette ────────────────────────────────────────────────────────────
const G = { 1:'#1A7A3A', 2:'#2D9D5C', 3:'#4CAF72', 4:'#76C893', 5:'#A8DAB5', 6:'#0D5C28' };

const TT_STYLE = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: 8, fontSize: 12,
  color: 'var(--text-primary)',
};

// ── KPI Card — 2-row layout ──────────────────────────────────────────────────
function KpiCard({ card, delay }) {
  return (
    <div className="kpi-card fade-up" style={{ opacity: 0, animationDelay: `${delay}s` }}>
      <div className="kpi-top-row">
        <span className="kpi-label">{card.label}</span>
        <span className="kpi-emoji">{card.icon}</span>
      </div>
      <div className="kpi-bottom-row">
        <span className="kpi-value">{card.value}</span>
        <span className={`kpi-change ${card.changeDir === 'up' && card.id !== 'outofstock' ? 'up' : 'down'}`}>
          {card.changeDir === 'up' ? '↑' : '↓'} {card.change}
        </span>
      </div>
    </div>
  );
}

// ── Status dot colour ────────────────────────────────────────────────────────
const dotColor = sc => ({
  success: G[1], info: G[2], warning: '#D35400',
  danger: '#C0392B', purple: G[3],
}[sc] || G[4]);

function ActivityRow({ item }) {
  const col = dotColor(item.statusType);
  return (
    <tr>
      <td>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:col, flexShrink:0 }} />
          <span style={{ fontWeight:500 }}>{item.type}</span>
        </div>
      </td>
      <td style={{ color:'var(--text-secondary)' }}>
        {item.file || item.model || item.report || item.alert}
      </td>
      <td>
        <span className={`badge badge-${item.statusType}`}>
          <span className="badge-dot" style={{ background:col }} />
          {item.status}
        </span>
      </td>
      <td style={{ color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
        <Clock size={11} /> {item.time}
      </td>
    </tr>
  );
}

// ── Animated Donut — smooth rAF-based easing ─────────────────────────────────
function AnimatedDonut() {
  const [progress, setProgress] = useState(0);
  const rafRef  = useRef(null);
  const startTs = useRef(null);
  const DURATION = 1000; // ms — smooth 1-second draw

  useEffect(() => {
    // ease-out-cubic
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const tick = (ts) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed = ts - startTs.current;
      const t = Math.min(elapsed / DURATION, 1);
      setProgress(easeOut(t) * 100);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    // Small delay so the page layout settles first
    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const greenShades = [G[1], G[2], G[3], G[4]];
  const data = regionalData.map((d, i) => ({
    ...d,
    value: Math.round(d.value * progress / 100),
    color: greenShades[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={62} outerRadius={90}
          startAngle={90} endAngle={-270}
          paddingAngle={3}
          dataKey="value"
          isAnimationActive={false}
        >
          {data.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Pie>
        <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={TT_STYLE} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, paddingTop:12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Dashboard page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const greenCategoryDemand = categoryDemand.map((c, i) => ({
    ...c,
    color: Object.values(G)[i] || G[3],
  }));

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity:0 }}>
          {greeting}, <span>Alex</span> 👋
        </h1>
        <p className="page-subtitle fade-up" style={{ opacity:0, animationDelay:'.08s' }}>
          Monitor trends and inventory insights · Last updated just now
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiData.map((card, i) => (
          <KpiCard key={card.id} card={card} delay={0.05 + i * 0.07} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid" style={{ marginBottom:16 }}>

        {/* Profit Trend */}
        <div className="card chart-container fade-up" style={{ opacity:0, animationDelay:'.15s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Profit Trend</div>
              <div className="card-subtitle">Actual vs Forecast · YTD</div>
            </div>
            <button className="icon-btn" style={{ width:30, height:30 }}>
              <MoreHorizontal size={15} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={profitTrend} margin={{ top:4, right:16, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`} />
              <Tooltip formatter={v=>[`$${(v/1000).toFixed(1)}K`]} contentStyle={TT_STYLE} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:11 }} />
              <Line type="monotone" dataKey="profit"   stroke={G[1]} strokeWidth={2.5} dot={{ r:3, fill:G[1] }} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke={G[4]} strokeWidth={2}   strokeDasharray="5 4" dot={false} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Demand */}
        <div className="card chart-container fade-up" style={{ opacity:0, animationDelay:'.2s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Category Demand</div>
              <div className="card-subtitle">Units this month</div>
            </div>
            <button className="icon-btn" style={{ width:30, height:30 }}>
              <MoreHorizontal size={15} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={greenCategoryDemand} margin={{ top:4, right:16, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT_STYLE} />
              <Bar dataKey="demand" radius={[4,4,0,0]} name="Demand">
                {greenCategoryDemand.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Donut + Alerts */}
      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:16, marginBottom:24 }}>
        <div className="card chart-container fade-up" style={{ opacity:0, animationDelay:'.25s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Regional Distribution</div>
              <div className="card-subtitle">Sales share by region</div>
            </div>
          </div>
          <AnimatedDonut />
        </div>

        <div className="card fade-up" style={{ opacity:0, animationDelay:'.25s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">⚠️ Stock Alerts</div>
              <div className="card-subtitle">Top critical items</div>
            </div>
            <span className="badge badge-danger">{topAlerts.length} active</span>
          </div>
          <div style={{ padding:'0 20px 16px' }}>
            {topAlerts.map((a, i) => (
              <div key={i} className="alert-item">
                <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0,
                  background: a.severity === 'critical' ? 'var(--status-red)' : 'var(--status-orange)' }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{a.product}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>
                    {a.category} · Stock:{' '}
                    <strong style={{ color: a.severity === 'critical' ? 'var(--status-red)' : 'var(--status-orange)' }}>
                      {a.stock}
                    </strong>{' '}
                    / needed: {a.required}
                  </div>
                </div>
                <span className={`badge ${a.severity === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                  {a.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card fade-up" style={{ opacity:0, animationDelay:'.3s' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Recent Activity</div>
            <div className="card-subtitle">Uploads, predictions & reports</div>
          </div>
          <button className="btn btn-secondary btn-sm">View all</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Type</th><th>Description</th><th>Status</th><th>Time</th></tr>
            </thead>
            <tbody>
              {recentActivity.map(item => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
