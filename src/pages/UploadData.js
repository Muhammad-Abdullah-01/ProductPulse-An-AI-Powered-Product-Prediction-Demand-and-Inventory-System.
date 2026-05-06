import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const ACCEPTED_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];
const ACCEPTED_EXT = ['.csv', '.xlsx', '.xls'];

const previewData = [
  { id: 'P001', product: 'Wireless Earbuds Pro', cat: 'Electronics', region: 'North', sales: 482,  month: 'Mar 2025' },
  { id: 'P002', product: 'Winter Jacket XL',     cat: 'Fashion',     region: 'South', sales: 213,  month: 'Mar 2025' },
  { id: 'P003', product: 'Organic Olive Oil',    cat: 'Groceries',   region: 'East',  sales: 889,  month: 'Mar 2025' },
  { id: 'P004', product: 'Running Shoes M10',    cat: 'Sports',      region: 'West',  sales: 344,  month: 'Mar 2025' },
  { id: 'P005', product: 'Vitamin C Serum',      cat: 'Beauty',      region: 'North', sales: 671,  month: 'Mar 2025' },
  { id: 'P006', product: 'Coffee Maker Deluxe',  cat: 'Appliances',  region: 'East',  sales: 128,  month: 'Mar 2025' },
];

// Only shown AFTER a file is selected (H9 fix — no static mock errors)
const validationResults = [
  { type: 'error',   icon: XCircle,       color: 'var(--status-red)',    bg: 'var(--status-red-light)',    msg: '3 rows with missing "Region" values (rows 14, 28, 52)' },
  { type: 'warning', icon: AlertTriangle, color: 'var(--status-orange)', bg: 'var(--status-orange-light)', msg: 'Date format inconsistent — some dates use 01/25/2025, others use 2025-01-25. Please standardise before uploading.' },
  { type: 'success', icon: CheckCircle,   color: 'var(--status-green)',  bg: 'var(--status-green-light)',  msg: 'All 1,204 product IDs matched to master catalog' },
];

export default function UploadData() {
  const [file,      setFile]      = useState(null);
  const [dragging,  setDragging]  = useState(false);
  const [prog,      setProg]      = useState(0);
  const [proc,      setProc]      = useState(false);
  const [done,      setDone]      = useState(false);
  const [typeError, setTypeError] = useState('');
  const inputRef   = useRef();
  const intervalRef = useRef(null);

  // H5 fix — validate file type on drop AND on picker
  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXT.includes(ext) && !ACCEPTED_TYPES.includes(f.type)) {
      setTypeError(`"${f.name}" is not a supported format. Please upload a .csv, .xlsx, or .xls file.`);
      setFile(null);
      return;
    }
    setTypeError('');
    setFile(f);
    setProg(0);
    setDone(false);
  };

  const handleProcess = () => {
    setProc(true);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 8 + 3;
      setProg(Math.min(Math.round(p), 100));
      if (p >= 100) {
        clearInterval(intervalRef.current);
        setProc(false);
        setDone(true);
      }
    }, 120);
  };

  // H3 fix — cancel upload in progress
  const handleCancel = () => {
    clearInterval(intervalRef.current);
    setProc(false);
    setProg(0);
    setFile(null);
    setDone(false);
  };

  return (
    <div>
      <div className="page-header">
        {/* H2 fix — title matches sidebar label */}
        <h1 className="page-greeting fade-up" style={{ opacity: 0 }}>Upload Data</h1>
        <p className="page-subtitle fade-up" style={{ opacity: 0, animationDelay: '.08s' }}>
          Import CSV or Excel files to feed the AI prediction engine
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.1s' }}>
            <div className="card-header">
              <div>
                <div className="card-title">Upload Data File</div>
                <div className="card-subtitle">Drag & drop or click to browse</div>
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>

              {/* Type error banner */}
              {typeError && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--status-red-light)', border: '1px solid var(--status-red)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 14,
                  fontSize: 13, color: 'var(--status-red)',
                }}>
                  <XCircle size={15} style={{ flexShrink: 0 }} />
                  {typeError}
                  <button onClick={() => setTypeError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-red)' }}>
                    <X size={14} />
                  </button>
                </div>
              )}

              <div
                className={`dropzone${dragging ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => inputRef.current.click()}
              >
                <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" hidden
                  onChange={e => handleFile(e.target.files[0])} />

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
                    {/* H6 fix — accepted formats shown in-context inside dropzone */}
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Accepted: <strong>.csv, .xlsx, .xls</strong> · Max 50 MB
                    </p>
                  </>
                )}
              </div>

              {/* Progress + action buttons */}
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

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn btn-primary"
                    disabled={!file || proc}
                    onClick={handleProcess}
                    style={{ opacity: (!file || proc) ? 0.6 : 1 }}
                  >
                    <Upload size={15} />
                    {proc ? 'Processing…' : done ? '✓ Processed' : 'Upload & Process'}
                  </button>

                  {/* H3 fix — Cancel button during processing */}
                  {proc && (
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      <X size={14} /> Cancel
                    </button>
                  )}

                  {/* H3 fix — Reset after done */}
                  {done && (
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Upload Another
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview table */}
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
                      <th>Product ID</th><th>Product Name</th><th>Category</th>
                      <th>Region</th><th>Sales</th><th>Month</th>
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

        {/* ── RIGHT ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* H9 fix — Validation only shown after file is selected */}
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.15s' }}>
            <div className="card-header">
              <div className="card-title">Validation Results</div>
            </div>
            <div style={{ padding: '0 16px 20px' }}>
              {!file ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '24px 0', gap: 8, color: 'var(--text-muted)', textAlign: 'center',
                }}>
                  <span style={{ fontSize: 24 }}>📋</span>
                  <p style={{ fontSize: 13, lineHeight: 1.5 }}>
                    Upload a file to see validation results.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {validationResults.map((v, i) => {
                    const Icon = v.icon;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '12px 14px', borderRadius: 10,
                        background: v.bg, border: `1px solid ${v.color}33`,
                      }}>
                        <Icon size={16} style={{ color: v.color, flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {v.msg}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Accepted Formats */}
          <div className="card fade-up" style={{ opacity: 0, animationDelay: '.2s' }}>
            <div className="card-header">
              <div className="card-title">Accepted Formats</div>
            </div>
            <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { fmt: 'CSV',          ext: '.csv',  desc: 'Comma-separated values'   },
                { fmt: 'Excel',        ext: '.xlsx', desc: 'Microsoft Excel workbook'  },
                { fmt: 'Legacy Excel', ext: '.xls',  desc: 'Older Excel format (97–03)' },
              ].map(f => (
                <div key={f.fmt} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 11, padding: '3px 7px',
                    background: 'var(--bg-tertiary)', borderRadius: 5,
                    color: 'var(--text-muted)', border: '1px solid var(--border)',
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
