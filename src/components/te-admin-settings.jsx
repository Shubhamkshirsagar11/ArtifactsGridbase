import { useState } from "react";

// ============================================================
// T&E BID TEMPLATE — ADMIN SETTINGS
// Manages: Non-Union Wage Table, Labor Burden %, Overhead Defaults
// Versioning: Snapshot-on-save with timestamped archive
// ============================================================

const TABS = [
  { id: "wages", label: "Non-Union Wages" },
  { id: "burden", label: "Labor Burden" },
  { id: "overhead", label: "Overhead Defaults" },
];

// --- Sample data ---
const WAGE_CATEGORIES = {
  "Distribution": ["DIST-Foreman", "DIST-General Foreman", "DIST-Lineman A", "DIST-Lineman B", "DIST-Lineman C", "DIST-Apprentice A", "DIST-Apprentice B", "DIST-Groundman Dist Trans", "DIST-Operations Manager", "DIST-Operator"],
  "Transmission": ["TMN-Foreman", "TMN-General Foreman", "TMN-Lineman A", "TMN-Lineman B", "TMN-Lineman C", "TMN-Apprentice 1", "TMN-Apprentice 2", "TMN-Apprentice 7", "TMN-Apprentice B", "TMN-Equipment Operator", "TMN-Groundman Dist Trans"],
  "Underground": ["UG-Foreman", "UG-Underground General Fore", "UG-Underground Lineman A", "UG-Underground Lineman B", "UG-Underground Operator", "UG-Underground Groundman", "UG-Equipment Operator", "UG-Apprentice A", "UG-Coordinator", "UG-Fiber Splicer"],
  "Vegetation": ["VV-Vegetation Foreman", "VV-General Foreman", "VV-Coordinator", "VV-Trimmer Operator", "VV-Trimmer Operator A", "VV-Trimmer Operator B", "VV-Trimmer Operator C", "VV-Groundman Veg only", "VV-Lineman C", "VV-Safety Specialist", "VV-Driver"],
  "Other": ["FS-Driver", "DD-Coordinator", "DD-Equipment Operator"],
};

const INITIAL_WAGES = {
  "DIST-Foreman": 42.50, "DIST-General Foreman": 48.00, "DIST-Lineman A": 38.50, "DIST-Lineman B": 34.00, "DIST-Lineman C": 30.00,
  "DIST-Apprentice A": 22.00, "DIST-Apprentice B": 18.50, "DIST-Groundman Dist Trans": 24.00, "DIST-Operations Manager": 55.00, "DIST-Operator": 36.00,
  "TMN-Foreman": 44.00, "TMN-General Foreman": 50.00, "TMN-Lineman A": 40.00, "TMN-Lineman B": 35.50, "TMN-Lineman C": 31.50,
  "TMN-Apprentice 1": 20.00, "TMN-Apprentice 2": 22.50, "TMN-Apprentice 7": 28.00, "TMN-Apprentice B": 19.50, "TMN-Equipment Operator": 36.50, "TMN-Groundman Dist Trans": 25.00,
  "UG-Foreman": 43.50, "UG-Underground General Fore": 49.00, "UG-Underground Lineman A": 39.50, "UG-Underground Lineman B": 34.50,
  "UG-Underground Operator": 36.00, "UG-Underground Groundman": 23.00, "UG-Equipment Operator": 35.00, "UG-Apprentice A": 21.50, "UG-Coordinator": 33.00, "UG-Fiber Splicer": 41.00,
  "VV-Vegetation Foreman": 38.00, "VV-General Foreman": 44.50, "VV-Coordinator": 30.00, "VV-Trimmer Operator": 27.00,
  "VV-Trimmer Operator A": 28.50, "VV-Trimmer Operator B": 26.00, "VV-Trimmer Operator C": 24.50, "VV-Groundman Veg only": 20.00,
  "VV-Lineman C": 29.00, "VV-Safety Specialist": 33.50, "VV-Driver": 24.00,
  "FS-Driver": 26.00, "DD-Coordinator": 32.00, "DD-Equipment Operator": 34.50,
};

const INITIAL_BURDEN = {
  workersComp: 0.92,
  benefits: 5.40,
  payrollTax: 8.18,
};

const INITIAL_OVERHEAD = {
  generalOverhead: 12.0,
  glInsurance: 0,
  supplies: 85.50,
  telephone: 0,
  postage: 15.50,
  newHireUniform: 30.00,
  safety: 25.50,
  incidentRepairs: 13.50,
  tools: 132.50,
  otherJobCosts: 19.50,
  equipRepairsMaint: 625.00,
};

// No version history data needed for v1 — archive happens silently in the data layer

// --- Utility ---
function fmt(n) { return "$" + (n || 0).toFixed(2); }

// --- Components ---
function TabBar({ activeTab, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E5E7EB" }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: activeTab === tab.id ? 600 : 500,
            color: activeTab === tab.id ? "#111827" : "#6B7280",
            background: "none",
            border: "none",
            borderBottom: activeTab === tab.id ? "2px solid #111827" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ title, description, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0, marginBottom: 4 }}>{title}</h3>
        {description && <p style={{ fontSize: 12, color: "#6B7280", margin: 0, maxWidth: 560, lineHeight: 1.5 }}>{description}</p>}
      </div>
      {right}
    </div>
  );
}

function InfoBanner({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, marginBottom: 20 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7.5" stroke="#2563EB" />
        <text x="8" y="11.5" textAnchor="middle" fontSize="10" fill="#2563EB" fontWeight="600">i</text>
      </svg>
      <span style={{ fontSize: 12, color: "#1E40AF", lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

// --- Save Confirmation Modal ---
function SaveConfirmModal({ section, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Update {section}?</h3>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: "0 0 8px 0" }}>
          This will save your changes as the new defaults. The previous values will be archived automatically.
        </p>
        <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 20px 0" }}>
          Existing bids are not affected — they keep the rates they were created with. Only new bids will use the updated defaults.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: "#111827", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Save & Update Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Wage Table Tab ---
function WageTableTab() {
  const [wages, setWages] = useState({ ...INITIAL_WAGES });
  const [expandedCats, setExpandedCats] = useState(Object.keys(WAGE_CATEGORIES));
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleCat = (cat) => {
    setExpandedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const startEdit = (classif) => {
    setEditingCell(classif);
    setEditValue(wages[classif]?.toFixed(2) || "0.00");
  };

  const saveEdit = (classif) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      setWages(prev => ({ ...prev, [classif]: val }));
      setHasChanges(true);
    }
    setEditingCell(null);
  };

  const filteredCategories = searchQuery
    ? Object.fromEntries(
        Object.entries(WAGE_CATEGORIES)
          .map(([cat, items]) => [cat, items.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))])
          .filter(([, items]) => items.length > 0)
      )
    : WAGE_CATEGORIES;

  const totalClassifications = Object.values(WAGE_CATEGORIES).flat().length;

  return (
    <div>
      <SectionHeader
        title="Non-Union Default Wage Rates"
        description="Base hourly wage rates used as defaults when creating new T&E bid estimates. These rates seed the Labor Rate Builder — estimators can adjust per-bid."
        right={
          <div style={{ display: "flex", gap: 8 }}>
            {hasChanges && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6, fontSize: 11, fontWeight: 500, color: "#92400E" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706" }} />
                Unsaved changes
              </span>
            )}
          </div>
        }
      />

      <InfoBanner>
        When you save changes, the current rates are archived automatically. Existing bids keep their original rates — only new bids use the updated defaults.
      </InfoBanner>

      {/* Search */}
      <div style={{ marginBottom: 16, position: "relative" }}>
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder={`Search ${totalClassifications} classifications...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: 320, padding: "8px 12px 8px 34px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#111827", outline: "none" }}
        />
      </div>

      {/* Wage Table by Category */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        {Object.entries(filteredCategories).map(([category, classifications], catIdx) => {
          const isExpanded = expandedCats.includes(category);
          return (
            <div key={category}>
              {catIdx > 0 && <div style={{ borderTop: "1px solid #E5E7EB" }} />}
              {/* Category header */}
              <div
                onClick={() => toggleCat(category)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 16px", background: "#F9FAFB", cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                    <path d="M4.5 2.5L8 6L4.5 9.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{category}</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{classifications.length} classifications</span>
                </div>
                {/* avg removed — low signal */}
              </div>

              {/* Classification rows */}
              {isExpanded && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      <th style={{ padding: "6px 16px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6" }}>Classification</th>
                      <th style={{ padding: "6px 16px", textAlign: "right", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F3F4F6", width: 140 }}>Base Rate ($/hr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classifications.map((classif) => {
                      const stWage = wages[classif] || 0;
                      const isEditing = editingCell === classif;
                      return (
                        <tr key={classif} style={{ borderBottom: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "8px 16px", fontSize: 13, color: "#374151" }}>
                            {classif.split("-").slice(1).join("-") || classif}
                            <span style={{ fontSize: 10, color: "#D1D5DB", marginLeft: 6 }}>{classif.split("-")[0]}</span>
                          </td>
                          <td style={{ padding: "8px 16px", textAlign: "right" }}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => saveEdit(classif)}
                                onKeyDown={e => { if (e.key === "Enter") saveEdit(classif); if (e.key === "Escape") setEditingCell(null); }}
                                autoFocus
                                style={{ width: 80, padding: "4px 8px", border: "1px solid #3B82F6", borderRadius: 4, fontSize: 13, textAlign: "right", fontFamily: "monospace", outline: "none", background: "#EFF6FF" }}
                              />
                            ) : (
                              <span
                                onClick={() => startEdit(classif)}
                                style={{ fontSize: 13, fontFamily: "monospace", color: "#111827", cursor: "pointer", padding: "4px 8px", borderRadius: 4, transition: "background 0.1s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {fmt(stWage)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {/* Save bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
        <button
          disabled={!hasChanges}
          onClick={() => { setWages({ ...INITIAL_WAGES }); setHasChanges(false); }}
          style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: hasChanges ? "pointer" : "not-allowed", opacity: hasChanges ? 1 : 0.4 }}
        >
          Discard
        </button>
        <button
          disabled={!hasChanges}
          onClick={() => setShowConfirm(true)}
          style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: hasChanges ? "#111827" : "#9CA3AF", border: "none", borderRadius: 8, cursor: hasChanges ? "pointer" : "not-allowed" }}
        >
          Save Changes
        </button>
      </div>

      {showConfirm && (
        <SaveConfirmModal
          section="Non-Union Wages"
          onConfirm={() => { setShowConfirm(false); setHasChanges(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// --- Labor Burden Tab ---
function LaborBurdenTab() {
  const [burden, setBurden] = useState({ ...INITIAL_BURDEN });
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateBurden = (key, val) => {
    setBurden(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
    setHasChanges(true);
  };

  const totalBurden = burden.workersComp + burden.benefits + burden.payrollTax;
  const sampleWage = 38.50;
  const loadedCost = sampleWage * (1 + totalBurden / 100);

  return (
    <div>
      <SectionHeader
        title="Labor Burden Percentages"
        description="These percentages are applied to the base wage for each classification to calculate the loaded labor cost. They're used in the Rate Builder step of every T&E bid."
      />

      <InfoBanner>
        Burden rates are applied as: Loaded Cost = Base Wage + (Wage × Workers' Comp %) + (Wage × Benefits %) + (Wage × Payroll Tax %). For union labor, benefits come from the union agreement data instead of this percentage.
      </InfoBanner>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Burden inputs */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#F9FAFB", padding: "10px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", minHeight: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Burden Components</span>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { key: "workersComp", label: "Workers' Compensation", desc: "State-mandated insurance rate. Varies by state and risk classification." },
              { key: "benefits", label: "Benefits (Non-Union)", desc: "Health, dental, vision, 401k match. Only applies to non-union labor — union benefits are pulled from agreement data." },
              { key: "payrollTax", label: "Payroll Taxes", desc: "FICA (6.2%), Medicare (1.45%), FUTA, SUTA combined." },
            ].map((item, i) => (
              <div key={item.key} style={{ marginBottom: i < 2 ? 20 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{item.label}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="text"
                      value={burden[item.key]}
                      onChange={e => updateBurden(item.key, e.target.value)}
                      style={{ width: 64, padding: "6px 8px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontFamily: "monospace", textAlign: "right", color: "#111827", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                    />
                    <span style={{ fontSize: 13, color: "#6B7280" }}>%</span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            ))}

            {/* Total */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Total Burden Rate</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{totalBurden.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#F9FAFB", padding: "10px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Live Preview</span>
            <span style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sample: DIST-Lineman A @ {fmt(sampleWage)}/hr</span>
          </div>
          <div style={{ padding: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  { label: "Base Wage", value: sampleWage, isBold: false },
                  { label: `Workers' Comp (${burden.workersComp}%)`, value: sampleWage * burden.workersComp / 100, isBold: false, indent: true },
                  { label: `Benefits (${burden.benefits}%)`, value: sampleWage * burden.benefits / 100, isBold: false, indent: true },
                  { label: `Payroll Tax (${burden.payrollTax}%)`, value: sampleWage * burden.payrollTax / 100, isBold: false, indent: true },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px 0", fontSize: 12, color: row.indent ? "#6B7280" : "#374151", paddingLeft: row.indent ? 16 : 0 }}>{row.label}</td>
                    <td style={{ padding: "8px 0", fontSize: 12, fontFamily: "monospace", color: row.indent ? "#6B7280" : "#111827", textAlign: "right" }}>{fmt(row.value)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "12px 0 8px", fontSize: 13, fontWeight: 600, color: "#111827" }}>Loaded Cost</td>
                  <td style={{ padding: "12px 0 8px", fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#111827", textAlign: "right" }}>{fmt(loadedCost)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: 12, padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#6B7280" }}>Burden multiplier</span>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: "#374151" }}>{(1 + totalBurden / 100).toFixed(4)}×</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#6B7280" }}>Burden $ per hour</span>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: "#374151" }}>{fmt(loadedCost - sampleWage)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
        <button disabled={!hasChanges} onClick={() => { setBurden({ ...INITIAL_BURDEN }); setHasChanges(false); }} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: hasChanges ? "pointer" : "not-allowed", opacity: hasChanges ? 1 : 0.4 }}>
          Discard
        </button>
        <button disabled={!hasChanges} onClick={() => setShowConfirm(true)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: hasChanges ? "#111827" : "#9CA3AF", border: "none", borderRadius: 8, cursor: hasChanges ? "pointer" : "not-allowed" }}>
          Save Changes
        </button>
      </div>

      {showConfirm && (
        <SaveConfirmModal
          section="Labor Burden"
          onConfirm={() => { setShowConfirm(false); setHasChanges(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// --- Overhead Defaults Tab ---
function OverheadDefaultsTab() {
  const [overhead, setOverhead] = useState({ ...INITIAL_OVERHEAD });
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateOH = (key, val) => {
    setOverhead(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
    setHasChanges(true);
  };

  const totalWeeklyFixed = overhead.supplies + overhead.telephone + overhead.postage + overhead.newHireUniform + overhead.safety + overhead.incidentRepairs + overhead.tools + overhead.otherJobCosts + overhead.equipRepairsMaint;

  return (
    <div>
      <SectionHeader
        title="Default Overhead Assumptions"
        description="These values pre-fill the P&L overhead section when creating a new bid estimate. Estimators can adjust them per-bid."
      />

      <InfoBanner>
        Overhead defaults help estimators start from a reasonable baseline. Revenue-based percentages apply to projected weekly revenue. Fixed weekly costs are summed into a weekly overhead total.
      </InfoBanner>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Revenue-based */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#F9FAFB", padding: "10px 16px", borderBottom: "1px solid #E5E7EB" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>% of Revenue</span>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { key: "generalOverhead", label: "General Overhead", desc: "G&A, management, office lease, shared services" },
              { key: "glInsurance", label: "General Liability Insurance", desc: "GL policy premium allocated to projects" },
            ].map((item, i) => (
              <div key={item.key} style={{ marginBottom: i === 0 ? 20 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{item.label}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="text"
                      value={overhead[item.key]}
                      onChange={e => updateOH(item.key, e.target.value)}
                      style={{ width: 64, padding: "6px 8px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontFamily: "monospace", textAlign: "right", color: "#111827", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                    />
                    <span style={{ fontSize: 13, color: "#6B7280" }}>%</span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly fixed costs */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#F9FAFB", padding: "10px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Weekly Fixed Costs</span>
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "monospace", color: "#374151" }}>{fmt(totalWeeklyFixed)}/wk</span>
          </div>
          <div style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  { key: "supplies", label: "Supplies" },
                  { key: "telephone", label: "Telephone" },
                  { key: "postage", label: "Postage" },
                  { key: "newHireUniform", label: "New Hire / Uniform" },
                  { key: "safety", label: "Safety" },
                  { key: "incidentRepairs", label: "Incident Repairs" },
                  { key: "tools", label: "Tools" },
                  { key: "otherJobCosts", label: "Other Job Costs" },
                  { key: "equipRepairsMaint", label: "Equipment Repairs & Maint" },
                ].map((item) => (
                  <tr key={item.key} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px 16px", fontSize: 13, color: "#374151" }}>{item.label}</td>
                    <td style={{ padding: "8px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>$</span>
                        <input
                          type="text"
                          value={overhead[item.key]}
                          onChange={e => updateOH(item.key, e.target.value)}
                          style={{ width: 72, padding: "4px 6px", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 13, fontFamily: "monospace", textAlign: "right", color: "#111827", outline: "none" }}
                          onFocus={e => e.target.style.borderColor = "#3B82F6"}
                          onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
        <button disabled={!hasChanges} onClick={() => { setOverhead({ ...INITIAL_OVERHEAD }); setHasChanges(false); }} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: hasChanges ? "pointer" : "not-allowed", opacity: hasChanges ? 1 : 0.4 }}>
          Discard
        </button>
        <button disabled={!hasChanges} onClick={() => setShowConfirm(true)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: hasChanges ? "#111827" : "#9CA3AF", border: "none", borderRadius: 8, cursor: hasChanges ? "pointer" : "not-allowed" }}>
          Save Changes
        </button>
      </div>

      {showConfirm && (
        <SaveConfirmModal
          section="Overhead Defaults"
          onConfirm={() => { setShowConfirm(false); setHasChanges(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
// ============================================================
// Main Component
// ============================================================
export default function TEAdminSettings() {
  const [activeTab, setActiveTab] = useState("wages");

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#fff", minHeight: "100vh" }}>
      {/* App shell header */}
      <div style={{ borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#111827", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>G</span>
          </div>
          <span style={{ fontWeight: 600, color: "#111827" }}>Gridbase</span>
        </div>
        <span style={{ color: "#D1D5DB" }}>›</span>
        <span style={{ color: "#6B7280" }}>Admin Settings</span>
        <span style={{ color: "#D1D5DB" }}>›</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>T&E Bid Template</span>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>T&E Bid Template Settings</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Manage default rates and assumptions used when creating new T&E bid estimates</p>
        </div>

        {/* Tabs */}
        <TabBar activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        <div style={{ paddingTop: 24 }}>
          {activeTab === "wages" && <WageTableTab />}
          {activeTab === "burden" && <LaborBurdenTab />}
          {activeTab === "overhead" && <OverheadDefaultsTab />}
        </div>
      </div>
    </div>
  );
}
