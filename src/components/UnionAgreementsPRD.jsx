import { useState } from 'react'

// Self-contained document artifacts served from /public. Tabs switch the iframe.
const DOCS = [
  { label: 'PRD', file: 'prd.html' },
  { label: 'Visual Walkthrough', file: 'visual-walkthrough.html' },
  { label: 'PRD (PDF)', file: 'prd.pdf' },
]

export default function UnionAgreementsPRD() {
  const [active, setActive] = useState(DOCS[0].file)

  return (
    <div style={{ height: 'calc(100vh - 44px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '6px 12px',
        background: '#1F2937',
        borderBottom: '1px solid #374151',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {DOCS.map(doc => (
          <button
            key={doc.file}
            onClick={() => setActive(doc.file)}
            style={{
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 500,
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              background: active === doc.file ? '#EE7B3D' : 'transparent',
              color: active === doc.file ? '#fff' : '#9CA3AF',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {doc.label}
          </button>
        ))}
      </div>
      <iframe
        src={`/union-agreements-prd/${encodeURIComponent(active)}`}
        title="Union Agreements PRD"
        style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
