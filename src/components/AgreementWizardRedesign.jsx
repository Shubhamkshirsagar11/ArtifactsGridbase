import { useState } from 'react'

// Each screen is a standalone design comp (.dc.html) served from /public with its
// shared support.js runtime alongside. The sidebar switches the iframe between them.
const SCREENS = [
  { label: 'Setup', file: 'setup.dc.html' },
  { label: 'Classifications', file: 'classifications.dc.html' },
  { label: 'Wages', file: 'wages.dc.html' },
  { label: 'Benefits', file: 'benefits.dc.html' },
  { label: 'Mapping', file: 'mapping.dc.html' },
  { label: 'Review', file: 'review.dc.html' },
  { label: 'Custom Basis Panel', file: 'custom-basis-panel.dc.html' },
]

const ACCENT = '#EE7B3D'

export default function AgreementWizardRedesign() {
  const [active, setActive] = useState(SCREENS[0].file)

  return (
    <div style={{ height: 'calc(100vh - 44px)', display: 'flex' }}>
      {/* Sidebar — list of design screens */}
      <aside style={{
        width: 232,
        flexShrink: 0,
        background: '#111827',
        borderRight: '1px solid #1F2937',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{
          padding: '16px 16px 10px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: '#6B7280',
        }}>
          Wizard Designs
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 8px 12px', gap: 2 }}>
          {SCREENS.map((screen, i) => {
            const isActive = active === screen.file
            return (
              <button
                key={screen.file}
                onClick={() => setActive(screen.file)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: 7,
                  cursor: 'pointer',
                  background: isActive ? ACCENT : 'transparent',
                  color: isActive ? '#fff' : '#9CA3AF',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#1F2937' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  borderRadius: '50%',
                  fontSize: 11,
                  fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#1F2937',
                  color: isActive ? '#fff' : '#9CA3AF',
                }}>
                  {i + 1}
                </span>
                {screen.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main — selected design renders here */}
      <iframe
        key={active}
        src={`/agreement-wizard-redesign/${encodeURIComponent(active)}`}
        title="Agreement Wizard Redesign"
        style={{ flex: 1, height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
