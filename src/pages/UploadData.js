import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const previewData = [
  { id: 'P001', product: 'Wireless Earbuds Pro', cat: 'Electronics', region: 'North', sales: 482,  month: 'Mar 2024' },
  { id: 'P002', product: 'Winter Jacket XL',     cat: 'Fashion',     region: 'South', sales: 213,  month: 'Mar 2024' },
  { id: 'P003', product: 'Organic Olive Oil',    cat: 'Groceries',   region: 'East',  sales: 889,  month: 'Mar 2024' },
  { id: 'P004', product: 'Running Shoes M10',    cat: 'Sports',      region: 'West',  sales: 344,  month: 'Mar 2024' },
  { id: 'P005', product: 'Vitamin C Serum',      cat: 'Beauty',      region: 'North', sales: 671,  month: 'Mar 2024' },
  { id: 'P006', product: 'Coffee Maker Deluxe',  cat: 'Appliances',  region: 'East',  sales: 128,  month: 'Mar 2024' },
];

const validationIssues = [
  {
    type: 'error',
    icon: XCircle,
    color: 'var(--status-red)',
    bg: 'var(--status-red-light)',
    msg: '3 rows with missing "Region" values (rows 14, 28, 52)',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    color: 'var(--status-orange)',
    bg: 'var(--status-orange-light)',
    msg: '"Date" column format inconsistent — MM/DD/YYYY and YYYY-MM-DD both found',
  },
  {
    type: 'success',
    icon: CheckCircle,
    color: 'var(--status-green)',
    bg: 'var(--status-green-light)',
    msg: 'All 1,204 product IDs matched to master catalog',
  },
];

export default function UploadData() {
  const [file,    setFile]    = useState(null);
  const [dragging,setDragging]= useState(false);
  const [prog,    setProg]    = useState(0);
  const [proc,    setProc]    = useState(false);
  const [done,    setDone]    = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => { if (f) { setFile(f); setProg(0); setDone(false); } };

  const handleProcess = () => {
    setProc(true);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 3;
      setProg(Math.min(Math.round(p), 100));
      if (p >= 100) { clearInterval(iv); setProc(false); setDone(true); }
    }, 120);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-greeting fade-up" style={{ opacity: 0 }}>Upload Data</h1>
        <p className="page-subtitle fade-up" style={{ opacity: 0, animationDelay: '.08s' }}>
          Import CSV or Excel files to feed the AI prediction engine
        </p>
      </div>

      {/* Main layout — left: uploader, right: validation panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Dropzone card */}
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.1s' }}>
            <div className="card-header">
              <div>
                <div className="card-title">Import File</div>
                <div className="card-subtitle">Drag & drop or click to browse</div>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <div
                className={`dropzone${dragging ? ' drag-over' : ''}`}
                style={{ marginBottom: 0 }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => inputRef.current.click()}
              >
                <input
                  ref={inputRef} type="file" accept=".csv,.xlsx,.xls"
                  hidden onChange={e => handleFile(e.target.files[0])}
                />
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px', fontSize: 26,
                }}>📤</div>

                {file ? (
                  <>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      {(file.size / 1024).toFixed(1)} KB · Click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                      Drag & drop your file here
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Supports CSV, Excel (.xlsx, .xls) · Max 50 MB
                    </p>
                  </>
                )}
              </div>

              {/* Progress + Upload button */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(proc || done) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {done ? 'Processing complete' : 'Processing…'}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{prog}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${prog}%`,
                        background: done ? 'var(--status-green)' : 'var(--accent)',
                      }} />
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                  disabled={!file || proc}
                  onClick={handleProcess}
                >
                  <Upload size={15} />
                  {proc ? 'Processing…' : done ? '✓ Processed' : 'Upload & Process'}
                </button>
              </div>
            </div>
          </div>

          {/* Data Preview — shown after file selected */}
          {(file || done) && (
            <div className="card fade-up" style={{ opacity: 0, animationDelay: '.05s' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Data Preview</div>
                  <div className="card-subtitle">Showing first 6 of 1,204 rows</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{file?.name || 'data.csv'}</span>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Region</th>
                      <th>Sales</th>
                      <th>Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map(row => (
                      <tr key={row.id}>
                        <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{row.id}</span></td>
                        <td style={{ fontWeight: 500 }}>{row.product}</td>
                        <td><span className="badge badge-info">{row.cat}</span></td>
                        <td>{row.region}</td>
                        <td><strong>{row.sales.toLocaleString()}</strong></td>
                        <td style={{ color: 'var(--text-muted)' }}>{row.month}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Validation Results */}
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.15s' }}>
            <div className="card-header">
              <div className="card-title">Validation Results</div>
            </div>
            <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {validationIssues.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    background: v.bg, border: `1px solid ${v.color}22`,
                  }}>
                    <Icon size={16} style={{ color: v.color, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {v.msg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accepted Formats */}
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.2s' }}>
            <div className="card-header">
              <div className="card-title">Accepted Formats</div>
            </div>
            <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { fmt: 'CSV',          ext: '.csv',  desc: 'Comma-separated values'  },
                { fmt: 'Excel',        ext: '.xlsx', desc: 'Microsoft Excel workbook' },
                { fmt: 'Legacy Excel', ext: '.xls',  desc: 'Older Excel format'       },
              ].map(f => (
                <div key={f.fmt} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 11,
                    padding: '3px 7px', background: 'var(--bg-tertiary)',
                    borderRadius: 5, color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}>{f.ext}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{f.fmt}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
