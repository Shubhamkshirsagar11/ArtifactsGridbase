import { useState, useMemo } from "react";

// ============================================================
// WORK ORDER DETAIL PAGE — Unit-Price Example
// View a single work order, add CUs, track completion
// ============================================================

// --- Sample CU Library items (from CHELCO OH Distribution 2026) ---
const CU_LIBRARY = [
  { id: "CU-001", code: "OH-101", description: "Install 45' Class 3 Wood Pole", unit: "EA", laborHrs: 4.5, materialCost: 285, allInPrice: 1420 },
  { id: "CU-002", code: "OH-102", description: "Install 50' Class 2 Wood Pole", unit: "EA", laborHrs: 5.0, materialCost: 340, allInPrice: 1650 },
  { id: "CU-003", code: "OH-103", description: "Install 55' Class 1 Wood Pole", unit: "EA", laborHrs: 5.5, materialCost: 410, allInPrice: 1890 },
  { id: "CU-004", code: "OH-110", description: "Remove Existing Wood Pole", unit: "EA", laborHrs: 2.5, materialCost: 0, allInPrice: 580 },
  { id: "CU-005", code: "OH-201", description: "Install 8' Crossarm Assembly (Single)", unit: "EA", laborHrs: 1.5, materialCost: 145, allInPrice: 520 },
  { id: "CU-006", code: "OH-202", description: "Install 10' Crossarm Assembly (Double)", unit: "EA", laborHrs: 2.0, materialCost: 210, allInPrice: 680 },
  { id: "CU-007", code: "OH-301", description: "String 1/0 ACSR Primary (per 100ft)", unit: "100FT", laborHrs: 1.8, materialCost: 95, allInPrice: 440 },
  { id: "CU-008", code: "OH-302", description: "String 4/0 ACSR Primary (per 100ft)", unit: "100FT", laborHrs: 2.0, materialCost: 125, allInPrice: 510 },
  { id: "CU-009", code: "OH-401", description: "Install 25kVA Transformer", unit: "EA", laborHrs: 3.0, materialCost: 680, allInPrice: 1380 },
  { id: "CU-010", code: "OH-402", description: "Install 50kVA Transformer", unit: "EA", laborHrs: 3.5, materialCost: 920, allInPrice: 1720 },
  { id: "CU-011", code: "OH-501", description: "Install Service Drop (0-100ft)", unit: "EA", laborHrs: 1.5, materialCost: 85, allInPrice: 390 },
  { id: "CU-012", code: "OH-502", description: "Install Service Drop (100-200ft)", unit: "EA", laborHrs: 2.0, materialCost: 140, allInPrice: 510 },
  { id: "CU-013", code: "OH-601", description: "Install Guy Wire + Anchor", unit: "EA", laborHrs: 2.0, materialCost: 175, allInPrice: 590 },
  { id: "CU-014", code: "OH-701", description: "Install Cutout + Lightning Arrester", unit: "EA", laborHrs: 1.0, materialCost: 120, allInPrice: 340 },
  { id: "CU-015", code: "OH-801", description: "Transfer Existing Facilities (per pole)", unit: "EA", laborHrs: 3.0, materialCost: 0, allInPrice: 690 },
  { id: "CU-016", code: "OH-901", description: "Install Meter Can + Socket", unit: "EA", laborHrs: 1.5, materialCost: 110, allInPrice: 420 },
];

// --- Sample work order ---
const WORK_ORDER = {
  id: "WO-48291",
  projectId: "PRJ-2026-028",
  projectName: "CHELCO OH Distribution — 2026 Unit Contract",
  customer: "CHELCO",
  location: "Pole 47-A12",
  region: "District 3",
  description: "Replace 45' Class 3 wood pole + transfer existing facilities",
  status: "In Progress",
  crew: "Abbott Crew",
  foreman: "Mike Abbott",
  createdDate: "2026-01-15",
  assignedDate: "2026-01-16",
  startedDate: "2026-01-20",
  completedDate: null,
  cuLibrary: "CHELCO OH Distribution 2026",
  pricingModel: "All-In",
  notes: "Customer requested priority on this pole — visible lean. Coordinate with cable TV for transfer.",
};

// --- CUs added to this WO (with completion tracking, grouped by pole #) ---
const INITIAL_WO_CUS = [
  { lineId: 1, cuId: "CU-004", code: "OH-110", description: "Remove Existing Wood Pole", unit: "EA", qty: 1, originalQty: 1, unitPrice: 580, fn: "Remove", complete: true, completedDate: "2026-01-20", completedBy: "Mike Abbott", redLine: false, redLineNote: "", poleNumber: "47-A12" },
  { lineId: 2, cuId: "CU-001", code: "OH-101", description: "Install 45' Class 3 Wood Pole", unit: "EA", qty: 1, originalQty: 1, unitPrice: 1420, fn: "Install", complete: true, completedDate: "2026-01-20", completedBy: "Mike Abbott", redLine: false, redLineNote: "", poleNumber: "47-A12" },
  { lineId: 3, cuId: "CU-015", code: "OH-801", description: "Transfer Existing Facilities (per pole)", unit: "EA", qty: 1, originalQty: 1, unitPrice: 690, fn: "Transfer", complete: true, completedDate: "2026-01-21", completedBy: "Mike Abbott", redLine: false, redLineNote: "", poleNumber: "47-A12" },
  { lineId: 4, cuId: "CU-005", code: "OH-201", description: "Install 8' Crossarm Assembly (Single)", unit: "EA", qty: 2, originalQty: 3, unitPrice: 520, fn: "Install", complete: true, completedDate: "2026-01-21", completedBy: "Tom Hornback", redLine: true, redLineNote: "Only 2 crossarms needed — existing arm in good condition", poleNumber: "47-A12" },
  { lineId: 5, cuId: "CU-007", code: "OH-301", description: "String 1/0 ACSR Primary (per 100ft)", unit: "100FT", qty: 3, originalQty: 3, unitPrice: 440, fn: "Install", complete: false, completedDate: null, completedBy: null, redLine: false, redLineNote: "", poleNumber: "47-A13" },
  { lineId: 6, cuId: "CU-014", code: "OH-701", description: "Install Cutout + Lightning Arrester", unit: "EA", qty: 2, originalQty: 2, unitPrice: 340, fn: "Install", complete: false, completedDate: null, completedBy: null, redLine: false, redLineNote: "", poleNumber: "47-A13" },
  { lineId: 7, cuId: "CU-013", code: "OH-601", description: "Install Guy Wire + Anchor", unit: "EA", qty: 0, originalQty: 2, unitPrice: 590, fn: "Install", complete: false, completedDate: null, completedBy: null, redLine: true, redLineNote: "Eliminated — soil conditions unsuitable for anchors, using brace pole instead", poleNumber: "47-A12" },
  { lineId: 8, cuId: "CU-011", code: "OH-501", description: "Install Service Drop (0-100ft)", unit: "EA", qty: 1, originalQty: 1, unitPrice: 390, fn: "Install", complete: false, completedDate: null, completedBy: null, redLine: false, redLineNote: "", poleNumber: "47-A14" },
];

// --- Vendor costs on this WO ---
const COST_CATEGORIES = [
  { id: "materials", label: "Materials", color: "#2563EB" },
  { id: "subcontractor", label: "Subcontractor", color: "#7C3AED" },
  { id: "rental", label: "Equipment Rental", color: "#D97706" },
  { id: "permits", label: "Permits / Fees", color: "#059669" },
  { id: "other", label: "Other", color: "#6B7280" },
];

const INITIAL_VENDOR_COSTS = [
  { id: 1, vendor: "Anixter Power Solutions", description: "45' Class 3 Wood Pole", category: "materials", amount: 285, markup: 0, billable: true, invoiceNumber: "ANX-88412", invoiceDate: "2026-01-18", status: "paid", hasAttachment: true },
  { id: 2, vendor: "Anixter Power Solutions", description: "8' Crossarm Assembly (x2) + hardware", category: "materials", amount: 290, markup: 0, billable: true, invoiceNumber: "ANX-88412", invoiceDate: "2026-01-18", status: "paid", hasAttachment: true },
  { id: 3, vendor: "Graybar Electric", description: "1/0 ACSR conductor — 300ft spool", category: "materials", amount: 285, markup: 0, billable: true, invoiceNumber: "GB-2026-1147", invoiceDate: "2026-01-22", status: "submitted", hasAttachment: true },
  { id: 4, vendor: "Sunbelt Rentals", description: "45-ton crane rental — 1 day", category: "rental", amount: 1200, markup: 15, billable: true, invoiceNumber: "SBR-44091", invoiceDate: "2026-01-20", status: "submitted", hasAttachment: false },
  { id: 5, vendor: "ABC Flagging Services", description: "Traffic control — pole replacement (6 hrs)", category: "subcontractor", amount: 480, markup: 10, billable: true, invoiceNumber: "ABC-3821", invoiceDate: "2026-01-20", status: "pending", hasAttachment: false },
];

// --- Status config ---
const WO_STATUS_CONFIG = {
  "Unassigned": { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB", dot: "#9CA3AF" },
  "Assigned":   { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE", dot: "#3B82F6" },
  "In Progress": { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A", dot: "#F59E0B" },
  "QC Review":  { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE", dot: "#8B5CF6" },
  "Complete":   { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0", dot: "#10B981" },
};

const WO_STATUS_FLOW = ["Unassigned", "Assigned", "In Progress", "QC Review", "Complete"];


// ============================================================
// SIDEBAR (shared)
// ============================================================
const NAV_SECTIONS = [
  { label: "MAIN", items: [
    { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
    { id: "calculator", label: "Calculator", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  ]},
  { label: "STORM", items: [
    { id: "events", label: "Events", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ]},
  { label: "BLUESKY", items: [
    { id: "projects", label: "Projects", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    { id: "work-orders", label: "Work Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { id: "bid-estimates", label: "Bid Estimates", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
    { id: "timesheets", label: "Timesheets", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", disabled: true },
  ]},
  { label: "DATA", items: [
    { id: "unions", label: "Unions", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "organizations", label: "Organizations", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: "equipment", label: "Equipment", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
    { id: "personnel", label: "Personnel", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "unit-library", label: "Unit Library", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  ]},
];

function SidebarNavItem({ item, active }) {
  const [hovered, setHovered] = useState(false);
  const d = item.disabled;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 12px", marginBottom: 1, borderRadius: 8, fontSize: 13, transition: "all 0.15s",
        color: d ? "#4B5563" : active ? "#fff" : hovered ? "#fff" : "#9CA3AF",
        background: active ? "rgba(255,255,255,0.1)" : hovered && !d ? "rgba(255,255,255,0.05)" : "transparent",
        cursor: d ? "default" : "pointer", opacity: d ? 0.45 : 1 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={item.icon} /></svg>
      <span>{item.label}</span>
      {d && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, color: "#4B5563", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 3 }}>SOON</span>}
    </div>
  );
}

function Sidebar() {
  return (
    <div style={{ width: 220, minWidth: 220, height: "100vh", background: "#030712", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 40 }}>
      <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#030712", fontSize: 13, fontWeight: 800 }}>G</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Gridbase</span>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "4px 8px" }}>
        {NAV_SECTIONS.map(s => (
          <div key={s.label} style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 12px", marginBottom: 6 }}>{s.label}</div>
            {s.items.map(item => <SidebarNavItem key={item.id} item={item} active={item.id === "work-orders"} />)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#D1D5DB" }}>BG</span>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>Ben Glatt</div>
          <div style={{ fontSize: 10, color: "#6B7280" }}>Admin</div>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// SMALL COMPONENTS
// ============================================================
function Badge({ text, config }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: config.text, background: config.bg, border: `1px solid ${config.border}` }}>
    {config.dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: config.dot }} />}
    {text}
  </span>;
}

function TabButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 0", fontSize: 13, fontWeight: active ? 600 : 500,
      color: active ? "#111827" : "#6B7280", background: "none", border: "none",
      borderBottom: active ? "2px solid #111827" : "2px solid transparent",
      cursor: "pointer", marginRight: 24, transition: "all 0.15s",
    }}>{label}</button>
  );
}

function SummaryField({ label, value, editing, onChange, type, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
      {editing && onChange ? (
        type === "textarea" ? (
          <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={3}
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #3B82F6", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
        ) : type === "select" ? (
          <select value={value || ""} onChange={e => onChange(e.target.value)}
            style={{ padding: "6px 10px", border: "1px solid #3B82F6", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", background: "#fff" }}>
            {(options || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <input type={type || "text"} value={value || ""} onChange={e => onChange(e.target.value)}
            style={{ width: "100%", padding: "6px 10px", border: "1px solid #3B82F6", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box" }} />
        )
      ) : (
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{value || "—"}</div>
      )}
    </div>
  );
}

function fmt(num) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
}


// ============================================================
// WO HEADER
// ============================================================
function WOHeader({ wo, editing, setEditing, editData, setEditData, onSave }) {
  const display = editing ? editData : wo;
  const sc = WO_STATUS_CONFIG[display.status];
  const currentIdx = WO_STATUS_FLOW.indexOf(display.status);
  const ed = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));
  const [expanded, setExpanded] = useState(false);

  // Auto-expand when editing
  const isOpen = editing || expanded;

  return (
    <div style={{ background: "#fff", border: editing ? "1px solid #3B82F6" : "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 20, transition: "border-color 0.15s" }}>
      {/* Top row — always visible */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, cursor: editing ? "default" : "pointer" }} onClick={() => { if (!editing) setExpanded(e => !e); }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#2563EB", fontFamily: "monospace", letterSpacing: "-0.02em" }}>{display.id}</span>
            <Badge text={display.status} config={sc} />
            <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4, color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0" }}>Unit-Price</span>
          </div>
          {editing ? (
            <input value={editData.description} onChange={e => ed("description", e.target.value)}
              style={{ fontSize: 18, fontWeight: 600, color: "#111827", border: "1px solid #3B82F6", borderRadius: 6, padding: "4px 10px", width: "100%", outline: "none", boxSizing: "border-box" }} />
          ) : (
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>{wo.description}</h1>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#6B7280", marginTop: editing ? 6 : 0 }}>
            <span style={{ cursor: "pointer", color: "#2563EB" }} onClick={e => { e.stopPropagation(); alert("← Navigate to project"); }}>{wo.projectName}</span>
            {!isOpen && (
              <span style={{ color: "#D1D5DB" }}>·</span>
            )}
            {!isOpen && (
              <span style={{ color: "#9CA3AF", fontSize: 12 }}>{wo.crew || "Unassigned"} · {wo.location} · {wo.region}</span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 16, alignItems: "center" }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 6, color: "#6B7280", background: "#fff", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { onSave(editData); setEditing(false); }}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, color: "#fff", background: "#111827", cursor: "pointer" }}>Save</button>
            </>
          ) : (
            <>
              <button onClick={() => { setEditData({ ...wo }); setEditing(true); setExpanded(true); }}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 6, color: "#374151", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit
              </button>
              <button onClick={() => setExpanded(e => !e)}
                style={{ padding: "6px 10px", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6, color: "#6B7280", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable details */}
      {isOpen && (
        <div style={{ marginTop: 16 }}>
          {/* Status pipeline — dots + lines */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16, padding: "0 8px" }}>
            {WO_STATUS_FLOW.map((s, i) => {
              const isCurrent = s === display.status;
              const isPast = i < currentIdx;
              const isLast = i === WO_STATUS_FLOW.length - 1;
              const cfg = WO_STATUS_CONFIG[s];
              const dotColor = isPast ? "#10B981" : isCurrent ? cfg.dot : "#D1D5DB";
              const lineColor = isPast ? "#10B981" : "#E5E7EB";
              return (
                <div key={s} style={{ display: "flex", alignItems: "flex-start", flex: isLast ? "0 0 auto" : 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}>
                    <div style={{
                      width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10, borderRadius: "50%",
                      background: isPast ? "#10B981" : isCurrent ? dotColor : "#fff",
                      border: `2px solid ${dotColor}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isCurrent ? `0 0 0 3px ${cfg.bg}` : "none",
                      transition: "all 0.2s",
                    }}>
                      {isPast && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M2.5 6l2.5 2.5 4.5-5" /></svg>}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: isCurrent ? 600 : 500, marginTop: 6, whiteSpace: "nowrap",
                      color: isCurrent ? cfg.text : isPast ? "#059669" : "#9CA3AF",
                    }}>{s}</div>
                  </div>
                  {!isLast && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", paddingTop: isCurrent ? 6 : 4 }}>
                      <div style={{ flex: 1, height: 2, background: lineColor, borderRadius: 1 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary fields — editable row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16 }}>
            <SummaryField label="Location" value={editing ? editData.location : wo.location} editing={editing} onChange={v => ed("location", v)} />
            <SummaryField label="Region" value={editing ? editData.region : wo.region} editing={editing}
              onChange={v => ed("region", v)} type="select" options={["District 1", "District 2", "District 3", "District 4", "District 5"]} />
            <SummaryField label="Crew" value={editing ? editData.crew : (wo.crew || "Unassigned")} editing={editing}
              onChange={v => ed("crew", v)} type="select" options={["Abbott Crew", "Hornback Crew", "Martinez Crew", "Unassigned"]} />
            <SummaryField label="Foreman" value={editing ? editData.foreman : (wo.foreman || "—")} editing={editing} onChange={v => ed("foreman", v)} />
            <SummaryField label="Status" value={editing ? editData.status : wo.status} editing={editing}
              onChange={v => ed("status", v)} type="select" options={WO_STATUS_FLOW} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16, marginTop: 4 }}>
            <SummaryField label="CU Library" value={wo.cuLibrary} />
            <SummaryField label="Created" value={fmtDate(wo.createdDate)} />
            <SummaryField label="Assigned" value={fmtDate(wo.assignedDate)} />
            <SummaryField label="Started" value={fmtDate(wo.startedDate)} />
            <SummaryField label="Pricing" value={wo.pricingModel} />
          </div>

          {/* Notes — editable */}
          {editing ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Notes</div>
              <textarea value={editData.notes || ""} onChange={e => ed("notes", e.target.value)} rows={3} placeholder="Add a note..."
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #3B82F6", borderRadius: 6, fontSize: 12, color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5 }} />
            </div>
          ) : wo.notes ? (
            <div style={{ marginTop: 8, padding: "10px 14px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Note: </span>{wo.notes}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}


// ============================================================
// CU KPIs
// ============================================================
function CUKPIs({ cus }) {
  const activeCus = cus.filter(c => c.qty > 0);
  const eliminatedCus = cus.filter(c => c.qty === 0 && c.redLine);
  const totalLines = activeCus.length;
  const totalQty = activeCus.reduce((s, c) => s + c.qty, 0);
  const completedLines = activeCus.filter(c => c.complete).length;
  const completedQty = activeCus.filter(c => c.complete).reduce((s, c) => s + c.qty, 0);
  const totalValue = activeCus.reduce((s, c) => s + c.qty * c.unitPrice, 0);
  const completedValue = activeCus.filter(c => c.complete).reduce((s, c) => s + c.qty * c.unitPrice, 0);
  const pctComplete = totalQty > 0 ? Math.round(completedQty / totalQty * 100) : 0;
  const redLineCount = cus.filter(c => c.redLine).length;
  const originalValue = cus.reduce((s, c) => s + (c.originalQty || c.qty) * c.unitPrice, 0);
  const valueDelta = totalValue - originalValue;

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>CU Lines</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#111827" }}>{totalLines}{eliminatedCus.length > 0 && <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 500, marginLeft: 6 }}>({eliminatedCus.length} eliminated)</span>}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{completedLines} complete · {totalLines - completedLines} remaining</div>
      </div>
      <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Units (Qty)</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#111827" }}>{completedQty}<span style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}> / {totalQty}</span></div>
        <div style={{ marginTop: 6 }}>
          <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${pctComplete}%`, height: "100%", background: "#10B981", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 10, color: "#059669", fontWeight: 500, marginTop: 3 }}>{pctComplete}% complete</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>WO Value (Revised)</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmt(totalValue)}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
          {valueDelta !== 0
            ? <>{fmt(completedValue)} billable · <span style={{ color: valueDelta < 0 ? "#EF4444" : "#059669" }}>{valueDelta < 0 ? "" : "+"}{fmt(valueDelta)} vs original</span></>
            : <>{fmt(completedValue)} billable</>
          }
        </div>
      </div>
      {redLineCount > 0 && (
        <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #FDE68A", borderRadius: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Red Lines</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#D97706" }}>{redLineCount}</div>
          <div style={{ fontSize: 11, color: "#92400E", marginTop: 4 }}>
            {cus.filter(c => c.redLine && c.qty > 0 && c.qty !== c.originalQty).length} qty changed · {eliminatedCus.length} eliminated
          </div>
        </div>
      )}
    </div>
  );
}


// ============================================================
// RED LINE MODAL — initiate a red line change on a CU line
// ============================================================
function RedLineModal({ cu, onClose, onConfirm }) {
  const [action, setAction] = useState("adjust"); // "adjust" or "eliminate"
  const [newQty, setNewQty] = useState(cu.qty);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (!note.trim()) return;
    onConfirm({
      lineId: cu.lineId,
      newQty: action === "eliminate" ? 0 : newQty,
      note: note.trim(),
    });
    onClose();
  };

  const isValid = note.trim().length > 0 && (action === "eliminate" || (newQty !== cu.qty && newQty >= 0));
  const qtyDelta = action === "eliminate" ? -cu.qty : newQty - cu.qty;
  const valueDelta = qtyDelta * cu.unitPrice;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 480, background: "#fff", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 51, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Red Line Change</h3>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Adjust or eliminate a CU on this work order</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
        </div>

        {/* CU info */}
        <div style={{ padding: "14px 20px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{cu.code}</span>
            <span style={{ fontSize: 13, color: "#111827" }}>{cu.description}</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>Unit: <span style={{ fontWeight: 500, color: "#374151" }}>{cu.unit}</span></span>
            <span style={{ fontSize: 11, color: "#6B7280" }}>Current Qty: <span style={{ fontWeight: 500, color: "#374151" }}>{cu.qty}</span></span>
            <span style={{ fontSize: 11, color: "#6B7280" }}>Unit Price: <span style={{ fontWeight: 500, color: "#374151" }}>{fmt(cu.unitPrice)}</span></span>
          </div>
        </div>

        {/* Action selection */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>What Changed?</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { id: "adjust", label: "Adjust Quantity", desc: "Change the qty for this CU" },
              { id: "eliminate", label: "Eliminate Unit", desc: "Remove this CU entirely (qty → 0)" },
            ].map(opt => (
              <button key={opt.id} onClick={() => setAction(opt.id)} style={{
                flex: 1, padding: "10px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                border: action === opt.id ? "2px solid #D97706" : "1px solid #E5E7EB",
                background: action === opt.id ? "#FFFBEB" : "#fff",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: action === opt.id ? "#92400E" : "#374151" }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: action === opt.id ? "#B45309" : "#9CA3AF", marginTop: 2 }}>{opt.desc}</div>
              </button>
            ))}
          </div>

          {/* Qty input (only for adjust) */}
          {action === "adjust" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>New Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="number" min="0" max="999" value={newQty}
                  onChange={e => setNewQty(Math.max(0, parseInt(e.target.value) || 0))}
                  style={{ width: 80, padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 15, fontWeight: 600, textAlign: "center", outline: "none", fontVariantNumeric: "tabular-nums" }}
                  onFocus={e => e.target.style.borderColor = "#D97706"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                {newQty !== cu.qty && (
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    <span style={{ textDecoration: "line-through", color: "#9CA3AF" }}>{cu.qty}</span>
                    <span style={{ margin: "0 4px" }}>→</span>
                    <span style={{ fontWeight: 600, color: "#D97706" }}>{newQty}</span>
                    <span style={{ marginLeft: 8, color: valueDelta < 0 ? "#EF4444" : "#059669", fontWeight: 500 }}>
                      ({valueDelta < 0 ? "−" : "+"}{fmt(Math.abs(valueDelta))})
                    </span>
                  </div>
                )}
                {newQty === cu.qty && (
                  <div style={{ fontSize: 11, color: "#D97706" }}>Enter a different qty than the current value</div>
                )}
              </div>
            </div>
          )}

          {/* Eliminate preview */}
          {action === "eliminate" && (
            <div style={{ marginBottom: 16, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#991B1B", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                This will set qty to 0 and mark as eliminated
              </div>
              <div style={{ fontSize: 11, color: "#7F1D1D", marginTop: 4 }}>
                Value removed: <span style={{ fontWeight: 600 }}>{fmt(cu.qty * cu.unitPrice)}</span> ({cu.qty} × {fmt(cu.unitPrice)})
              </div>
            </div>
          )}

          {/* Note (required) */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
              Reason for Change <span style={{ color: "#EF4444" }}>*</span>
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder={action === "eliminate" ? "e.g., Soil conditions unsuitable for anchors — using brace pole instead" : "e.g., Only 2 crossarms needed — existing arm in good condition"}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = "#D97706"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>This note will appear on the CU line and in the red line audit trail.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", gap: 8, background: "#F9FAFB" }}>
          <button onClick={onClose}
            style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 6, color: "#6B7280", background: "#fff", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleConfirm} disabled={!isValid}
            style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, cursor: isValid ? "pointer" : "not-allowed",
              color: "#fff", background: isValid ? "#D97706" : "#D1D5DB", transition: "all 0.15s" }}>
            {action === "eliminate" ? "Eliminate Unit" : "Apply Red Line"}
          </button>
        </div>
      </div>
    </>
  );
}


// ============================================================
// CU TABLE — grouped by pole number
// ============================================================
function CURow({ cu, isLast, onToggleComplete, onRemoveCU, onRedLine, visibleCols }) {
  const isEliminated = cu.redLine && cu.qty === 0;
  const isQtyChanged = cu.redLine && cu.qty > 0 && cu.qty !== cu.originalQty;
  const isRedLineAdd = cu.redLine && !cu.originalQty;
  const rowBg = isEliminated ? "#FEF2F2" : cu.complete ? "#FAFFF9" : isQtyChanged ? "#FFFBEB08" : "transparent";
  const hoverBg = isEliminated ? "#FEF2F2" : cu.complete ? "#FAFFF9" : "#F9FAFB";
  const v = visibleCols;

  return (
    <tr key={cu.lineId}
      style={{ borderBottom: isLast ? "none" : "1px solid #F3F4F6", background: rowBg, opacity: isEliminated ? 0.6 : 1 }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; }}
      onMouseLeave={e => { e.currentTarget.style.background = rowBg; }}>
      {/* Completion checkbox — always visible */}
      <td style={{ padding: "8px 12px", textAlign: "center" }}>
        {isEliminated ? (
          <div style={{ width: 20, height: 20, borderRadius: 4, border: "2px solid #EF4444", background: "#EF4444",
            display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6" /></svg>
          </div>
        ) : (
          <div onClick={() => cu.qty > 0 && onToggleComplete(cu.lineId)}
            style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${cu.complete ? "#059669" : "#D1D5DB"}`, background: cu.complete ? "#059669" : "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: cu.qty > 0 ? "pointer" : "default", transition: "all 0.15s" }}>
            {cu.complete && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M2.5 6l2.5 2.5 4.5-5" /></svg>}
          </div>
        )}
      </td>
      {/* CU Code */}
      {v.cuCode && <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, color: isEliminated ? "#9CA3AF" : "#2563EB", fontFamily: "monospace", textDecoration: isEliminated ? "line-through" : "none" }}>{cu.code}</td>}
      {/* Description + red line note — always visible */}
      <td style={{ padding: "8px 12px" }}>
        <div style={{ fontSize: 13, color: isEliminated ? "#9CA3AF" : cu.complete ? "#6B7280" : "#111827", textDecoration: isEliminated ? "line-through" : "none" }}>{cu.description}</div>
        {cu.redLine && cu.redLineNote && (
          <div style={{ fontSize: 11, color: "#92400E", marginTop: 3, display: "flex", alignItems: "flex-start", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {cu.redLineNote}
          </div>
        )}
      </td>
      {/* Unit */}
      {v.unit && <td style={{ padding: "8px 12px", fontSize: 11, color: isEliminated ? "#D1D5DB" : "#6B7280", textAlign: "center" }}>{cu.unit}</td>}
      {/* Qty */}
      {v.qty && (
        <td style={{ padding: "8px 12px", textAlign: "center" }}>
          {isEliminated ? (
            <div>
              <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>{cu.originalQty}</span>
              <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, marginLeft: 4 }}>0</span>
            </div>
          ) : isQtyChanged ? (
            <div>
              <div style={{ fontSize: 10, color: "#9CA3AF", textDecoration: "line-through", lineHeight: 1 }}>{cu.originalQty}</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#D97706", fontVariantNumeric: "tabular-nums" }}>{cu.qty}</span>
            </div>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", fontVariantNumeric: "tabular-nums" }}>{cu.qty}</span>
          )}
        </td>
      )}
      {/* Unit Price */}
      {v.unitPrice && <td style={{ padding: "8px 12px", fontSize: 13, color: isEliminated ? "#D1D5DB" : "#374151", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(cu.unitPrice)}</td>}
      {/* Line Total */}
      {v.lineTotal && (
        <td style={{ padding: "8px 12px", textAlign: "right" }}>
          {isEliminated ? (
            <div>
              <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>{fmt(cu.originalQty * cu.unitPrice)}</span>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#EF4444" }}>$0</div>
            </div>
          ) : isQtyChanged ? (
            <div>
              <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>{fmt(cu.originalQty * cu.unitPrice)}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#D97706", fontVariantNumeric: "tabular-nums" }}>{fmt(cu.qty * cu.unitPrice)}</div>
            </div>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmt(cu.qty * cu.unitPrice)}</span>
          )}
        </td>
      )}
      {/* Status */}
      {v.status && (
        <td style={{ padding: "8px 12px", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            {isEliminated ? (
              <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA" }}>Eliminated</span>
            ) : cu.complete ? (
              <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0" }}>Complete</span>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: "#D97706", background: "#FFFBEB", border: "1px solid #FDE68A" }}>Pending</span>
            )}
            {(isQtyChanged || isRedLineAdd) && (
              <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 4, color: "#92400E", background: "#FEF3C7", border: "1px solid #FDE68A" }}>RED LINE</span>
            )}
          </div>
        </td>
      )}
      {/* Completed Date */}
      {v.completed && (
        <td style={{ padding: "8px 12px", fontSize: 12, color: "#6B7280" }}>
          {cu.complete && cu.completedDate ? fmtDate(cu.completedDate) : <span style={{ color: "#D1D5DB" }}>—</span>}
        </td>
      )}
      {/* Completed By */}
      {v.completedBy && (
        <td style={{ padding: "8px 12px", fontSize: 12, color: "#374151" }}>
          {cu.complete && cu.completedBy ? cu.completedBy : <span style={{ color: "#D1D5DB" }}>—</span>}
        </td>
      )}
      {/* Actions — always visible */}
      <td style={{ padding: "8px 12px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          {!cu.complete && !isEliminated && !cu.redLine && (
            <button onClick={() => onRedLine(cu)} title="Red Line — adjust qty or eliminate"
              style={{ background: "none", border: "1px solid transparent", borderRadius: 4, cursor: "pointer", color: "#D1D5DB", padding: "2px 4px", lineHeight: 1, display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 500, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#D97706"; e.currentTarget.style.borderColor = "#FDE68A"; e.currentTarget.style.background = "#FFFBEB"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#D1D5DB"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "none"; }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              RL
            </button>
          )}
          {!cu.complete && !isEliminated && (
            <button onClick={() => onRemoveCU(cu.lineId)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", fontSize: 14, padding: 2, lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = "#EF4444"} onMouseLeave={e => e.currentTarget.style.color = "#D1D5DB"}
              title="Remove CU">×</button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Column definitions for the CU table — id, label, default visibility
const CU_COLUMNS = [
  { id: "cuCode", label: "CU Code", width: 80, align: "left", defaultOn: true },
  { id: "unit", label: "Unit", width: 50, align: "center", defaultOn: true },
  { id: "qty", label: "Qty", width: 90, align: "center", defaultOn: true },
  { id: "unitPrice", label: "Unit Price", width: 90, align: "right", defaultOn: true },
  { id: "lineTotal", label: "Line Total", width: 100, align: "right", defaultOn: true },
  { id: "status", label: "Status", width: 110, align: "center", defaultOn: true },
  { id: "completed", label: "Completed", width: 90, align: "left", defaultOn: true },
  { id: "completedBy", label: "Completed By", width: 100, align: "left", defaultOn: true },
];

function CUTable({ cus, onToggleComplete, onRemoveCU, onUpdateQty, onRedLine, filter }) {
  const filtered = filter === "all" ? cus :
    filter === "complete" ? cus.filter(c => c.complete) :
    filter === "remaining" ? cus.filter(c => !c.complete && c.qty > 0) :
    filter === "redline" ? cus.filter(c => c.redLine) :
    cus;

  // Group filtered CUs by pole number
  const poleGroups = useMemo(() => {
    const groups = {};
    const order = [];
    filtered.forEach(cu => {
      const pole = cu.poleNumber || "Unassigned";
      if (!groups[pole]) {
        groups[pole] = [];
        order.push(pole);
      }
      groups[pole].push(cu);
    });
    return order.map(pole => ({ pole, cus: groups[pole] }));
  }, [filtered]);

  const [collapsedPoles, setCollapsedPoles] = useState({});
  const togglePole = (pole) => setCollapsedPoles(prev => ({ ...prev, [pole]: !prev[pole] }));

  // Column visibility state
  const [visibleCols, setVisibleCols] = useState(() => {
    const init = {};
    CU_COLUMNS.forEach(c => { init[c.id] = c.defaultOn; });
    return init;
  });
  const [showColPicker, setShowColPicker] = useState(false);

  const toggleCol = (colId) => setVisibleCols(prev => ({ ...prev, [colId]: !prev[colId] }));

  // Dynamic colSpan: checkbox(1) + description(1) + actions(1) = 3 always-on, plus toggled columns
  const visibleCount = 3 + CU_COLUMNS.filter(c => visibleCols[c.id]).length;

  const ThCell = ({ children, width, align }) => (
    <th style={{ padding: "8px 12px", textAlign: align || "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #E5E7EB", width: width || "auto" }}>{children}</th>
  );

  return (
    <div>
      {/* Column picker */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, position: "relative" }}>
        <button onClick={() => setShowColPicker(p => !p)}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", fontSize: 12, fontWeight: 500, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
          Columns
        </button>
        {showColPicker && (
          <>
            <div onClick={() => setShowColPicker(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
            <div style={{ position: "absolute", top: 34, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "8px 4px", zIndex: 100, minWidth: 180 }}>
              <div style={{ padding: "4px 12px 8px", fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Toggle Columns</div>
              {CU_COLUMNS.map(col => (
                <label key={col.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", cursor: "pointer", borderRadius: 4, fontSize: 13, color: "#374151" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <input type="checkbox" checked={visibleCols[col.id]} onChange={() => toggleCol(col.id)}
                    style={{ accentColor: "#111827", width: 14, height: 14 }} />
                  {col.label}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            <ThCell width={40} align="center">✓</ThCell>
            {visibleCols.cuCode && <ThCell width={80}>CU Code</ThCell>}
            <ThCell>Description</ThCell>
            {visibleCols.unit && <ThCell width={50} align="center">Unit</ThCell>}
            {visibleCols.qty && <ThCell width={90} align="center">Qty</ThCell>}
            {visibleCols.unitPrice && <ThCell width={90} align="right">Unit Price</ThCell>}
            {visibleCols.lineTotal && <ThCell width={100} align="right">Line Total</ThCell>}
            {visibleCols.status && <ThCell width={110} align="center">Status</ThCell>}
            {visibleCols.completed && <ThCell width={90}>Completed</ThCell>}
            {visibleCols.completedBy && <ThCell width={100}>Completed By</ThCell>}
            <ThCell width={80} align="center"></ThCell>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={visibleCount} style={{ padding: "40px 16px", textAlign: "center" }}>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>{filter === "complete" ? "No completed units yet" : filter === "remaining" ? "All units are complete!" : filter === "redline" ? "No red line changes on this work order" : "No CUs added to this work order yet"}</div>
              {filter === "all" && <div style={{ color: "#D1D5DB", fontSize: 12, marginTop: 4 }}>Click "+ Add CU" to add compatible units from the library</div>}
            </td></tr>
          ) : poleGroups.map((group, gi) => {
            const isCollapsed = collapsedPoles[group.pole];
            const poleCus = group.cus;
            const activePole = poleCus.filter(c => c.qty > 0);
            const poleValue = activePole.reduce((s, c) => s + c.qty * c.unitPrice, 0);
            const isLastGroup = gi === poleGroups.length - 1;

            return [
              // Pole group header row
              <tr key={`pole-${group.pole}`}
                onClick={() => togglePole(group.pole)}
                style={{
                  background: "#F1F5F9", cursor: "pointer",
                  borderBottom: isCollapsed && isLastGroup ? "none" : "1px solid #E2E8F0",
                }}>
                <td colSpan={visibleCount} style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Chevron */}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"
                      style={{ transition: "transform 0.15s", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)", flexShrink: 0 }}>
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                    {/* Pole icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M12 2v20M8 6h8M7 10h10" />
                    </svg>
                    {/* Pole label */}
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                      Pole {group.pole}
                    </span>
                    {/* Pole subtotal — pushed right */}
                    <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#374151", fontVariantNumeric: "tabular-nums" }}>
                      {fmt(poleValue)}
                    </span>
                  </div>
                </td>
              </tr>,
              // CU rows under this pole (hidden when collapsed)
              ...(!isCollapsed ? poleCus.map((cu, ci) => (
                <CURow key={cu.lineId} cu={cu} isLast={ci === poleCus.length - 1 && isLastGroup}
                  onToggleComplete={onToggleComplete} onRemoveCU={onRemoveCU} onRedLine={onRedLine} visibleCols={visibleCols} />
              )) : []),
            ];
          })}
        </tbody>
      </table>
      {/* Footer totals */}
      {cus.length > 0 && (
        <div style={{ padding: "10px 12px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{filtered.length} line{filtered.length !== 1 ? "s" : ""} · {filtered.reduce((s, c) => s + c.qty, 0)} units · {poleGroups.length} pole{poleGroups.length !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>Total: {fmt(filtered.reduce((s, c) => s + c.qty * c.unitPrice, 0))}</span>
        </div>
      )}
      </div>
    </div>
  );
}


// ============================================================
// ADD CU MODAL — search library, pick CU, set qty
// ============================================================
const CU_FUNCTIONS = [
  { id: "Install",  label: "Install",  bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  { id: "Remove",   label: "Remove",   bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  { id: "Transfer", label: "Transfer", bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
];

// Get current week boundaries (Saturday–Friday)
function getCurrentWeekBounds() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Saturday start: how many days back to the most recent Saturday
  const daysSinceSat = day === 6 ? 0 : day + 1;
  const sat = new Date(today);
  sat.setDate(today.getDate() - daysSinceSat);
  sat.setHours(0, 0, 0, 0);
  const fri = new Date(sat);
  fri.setDate(sat.getDate() + 6);
  fri.setHours(23, 59, 59, 999);
  const toISO = d => d.toISOString().slice(0, 10);
  return { min: toISO(sat), max: toISO(fri) };
}

function AddCUModal({ onClose, onAdd, existingCodes, existingPoles }) {
  const [search, setSearch] = useState("");
  const [stagedRows, setStagedRows] = useState([]);
  // Track new poles created within this session so they appear in pole dropdowns for subsequent rows
  const [sessionPoles, setSessionPoles] = useState([]);

  const weekBounds = useMemo(() => getCurrentWeekBounds(), []);
  const allPoles = [...existingPoles, ...sessionPoles.filter(p => !existingPoles.includes(p))];

  const filtered = useMemo(() => {
    if (!search) return CU_LIBRARY;
    const q = search.toLowerCase();
    return CU_LIBRARY.filter(cu => cu.code.toLowerCase().includes(q) || cu.description.toLowerCase().includes(q));
  }, [search]);

  // Add a CU from the library as a new staged row
  const handleStage = (cu) => {
    const rowId = Date.now() + Math.random();
    // Default function: infer from description
    let defaultFn = "Install";
    const descLower = cu.description.toLowerCase();
    if (descLower.includes("remove") || descLower.includes("retire")) defaultFn = "Remove";
    else if (descLower.includes("transfer")) defaultFn = "Transfer";

    setStagedRows(prev => [...prev, {
      rowId,
      cuId: cu.id,
      code: cu.code,
      description: cu.description,
      unit: cu.unit,
      allInPrice: cu.allInPrice,
      qty: 1,
      fn: null,
      completedDate: "",
      note: "",
      showNote: false,
      poleNumber: "",
      isNewPole: allPoles.length === 0,
      newPoleValue: "",
    }]);
  };

  const updateRow = (rowId, field, value) => {
    setStagedRows(prev => prev.map(r => {
      if (r.rowId !== rowId) return r;
      const updated = { ...r, [field]: value };
      // Handle pole switching
      if (field === "poleNumber" && value === "__new__") {
        updated.isNewPole = true;
        updated.poleNumber = "";
        updated.newPoleValue = "";
      } else if (field === "poleNumber") {
        updated.isNewPole = false;
      }
      return updated;
    }));
  };

  const removeRow = (rowId) => {
    setStagedRows(prev => prev.filter(r => r.rowId !== rowId));
  };

  // When a user finishes typing a new pole, register it for other rows
  const commitNewPole = (rowId) => {
    const row = stagedRows.find(r => r.rowId === rowId);
    if (row && row.newPoleValue.trim() && !allPoles.includes(row.newPoleValue.trim()) && !sessionPoles.includes(row.newPoleValue.trim())) {
      setSessionPoles(prev => [...prev, row.newPoleValue.trim()]);
    }
  };

  const activePoleForRow = (row) => row.isNewPole ? row.newPoleValue.trim() : row.poleNumber;

  const allRowsValid = stagedRows.length > 0 && stagedRows.every(r => activePoleForRow(r) && r.fn && r.qty >= 1);

  const totalValue = stagedRows.reduce((s, r) => s + r.allInPrice * r.qty, 0);

  const handleAddAll = () => {
    if (!allRowsValid) return;
    stagedRows.forEach(r => {
      onAdd({
        cuId: r.cuId,
        code: r.code,
        description: r.description,
        unit: r.unit,
        qty: r.qty,
        unitPrice: r.allInPrice,
        poleNumber: activePoleForRow(r),
        fn: r.fn,
        completedDate: r.completedDate || null,
        note: r.note || "",
      });
    });
    onClose();
  };

  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  const stagedCodeCounts = {};
  stagedRows.forEach(r => { stagedCodeCounts[r.code] = (stagedCodeCounts[r.code] || 0) + 1; });

  const handleClose = () => {
    if (stagedRows.length > 0) {
      setShowDiscardWarning(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(94vw, 960px)", maxHeight: "92vh", background: "#fff", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 51, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Discard warning banner */}
        {showDiscardWarning && (
          <div style={{ padding: "14px 24px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#92400E" }}>You have {stagedRows.length} unsaved unit{stagedRows.length !== 1 ? "s" : ""}</div>
              <div style={{ fontSize: 12, color: "#B45309", marginTop: 2 }}>Closing will discard all staged units. Are you sure?</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowDiscardWarning(false)}
                style={{ padding: "10px 18px", fontSize: 13, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 8, color: "#374151", background: "#fff", cursor: "pointer", minHeight: 44 }}>
                Keep Editing
              </button>
              <button onClick={onClose}
                style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 8, color: "#fff", background: "#DC2626", cursor: "pointer", minHeight: 44 }}>
                Discard & Close
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: 0 }}>Add Compatible Units</h3>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>CHELCO OH Distribution 2026 · 312 units · Tap units below to stage them</div>
          </div>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#9CA3AF", padding: 6, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Search */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input type="text" placeholder="Search by CU code or description..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 12px 12px 38px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 15, color: "#111827", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
        </div>

        {/* CU Library List */}
        <div style={{ flex: stagedRows.length > 0 ? "0 0 auto" : 1, overflow: "auto", maxHeight: stagedRows.length > 0 ? 240 : 400, borderBottom: stagedRows.length > 0 ? "1px solid #E5E7EB" : "none" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No CUs match "{search}"</div>
          ) : filtered.map(cu => {
            const alreadyOnWO = existingCodes.includes(cu.code);
            const stagedCount = stagedCodeCounts[cu.code] || 0;
            return (
              <div key={cu.id} onClick={() => handleStage(cu)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 24px",
                  cursor: "pointer", transition: "all 0.1s", minHeight: 48,
                  background: "transparent", borderBottom: "1px solid #F3F4F6",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F0F9FF"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {/* Plus icon */}
                <div style={{ width: 28, height: 28, borderRadius: 8, border: "1px dashed #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#9CA3AF" }}>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10" /></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{cu.code}</span>
                    <span style={{ fontSize: 14, color: "#111827" }}>{cu.description}</span>
                    {alreadyOnWO && <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 6px", borderRadius: 4 }}>ON WO</span>}
                    {stagedCount > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: "#2563EB", background: "#EFF6FF", padding: "2px 6px", borderRadius: 4 }}>+{stagedCount} staged</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Unit: {cu.unit} · Labor: {cu.laborHrs}hrs · Material: ${cu.materialCost}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmt(cu.allInPrice)}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>all-in</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Staged rows table */}
        {stagedRows.length > 0 && (
          <div style={{ flexShrink: 0, overflow: "auto", maxHeight: 300 }}>
            <div style={{ padding: "12px 24px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Staged Units ({stagedRows.length})
              </div>
              <button onClick={() => setStagedRows([])}
                style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: "6px 8px", minHeight: 36 }}>
                Clear all
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={{ padding: "6px 12px 6px 24px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em" }}>CU</th>
                  <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pole</th>
                  <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em" }}>Function</th>
                  <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em" }}>Completed</th>
                  <th style={{ padding: "6px 12px", textAlign: "center", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", width: 70 }}>Qty</th>
                  <th style={{ padding: "6px 12px", textAlign: "right", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", width: 90 }}>Total</th>
                  <th style={{ width: 44 }} />
                </tr>
              </thead>
              <tbody>
                {stagedRows.map((row, i) => {
                  const rowPole = activePoleForRow(row);
                  return (
                    <React.Fragment key={row.rowId}>
                    <tr style={{ borderBottom: (!row.showNote && i < stagedRows.length - 1) ? "1px solid #F3F4F6" : "none" }}>
                      {/* CU code + description + note toggle */}
                      <td style={{ padding: "10px 12px 10px 24px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{row.code}</span>
                          <span style={{ fontSize: 13, color: "#374151", maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.description}</span>
                          <button onClick={() => updateRow(row.rowId, "showNote", !row.showNote)} title={row.showNote ? "Hide note" : "Add note"}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", flexShrink: 0, color: row.note ? "#2563EB" : "#D1D5DB", minWidth: 28, minHeight: 28, justifyContent: "center", borderRadius: 4 }}
                            onMouseEnter={e => { if (!row.note) e.currentTarget.style.color = "#9CA3AF"; }} onMouseLeave={e => { if (!row.note) e.currentTarget.style.color = "#D1D5DB"; }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                          </button>
                        </div>
                        {row.note && !row.showNote && (
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3, fontStyle: "italic", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {row.note}
                          </div>
                        )}
                      </td>
                      {/* Pole */}
                      <td style={{ padding: "8px 12px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {!row.isNewPole ? (
                            <select
                              value={row.poleNumber || ""}
                              onChange={e => updateRow(row.rowId, "poleNumber", e.target.value)}
                              style={{ padding: "8px 8px", border: `1px solid ${!rowPole ? "#EF4444" : "#E5E7EB"}`, borderRadius: 6, fontSize: 13, color: row.poleNumber ? "#111827" : "#9CA3AF", outline: "none", background: "#fff", maxWidth: 140, minHeight: 38 }}>
                              <option value="" disabled>Select pole</option>
                              {allPoles.map(p => (
                                <option key={p} value={p}>Pole {p}</option>
                              ))}
                              <option value="__new__">+ New Pole</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter pole #"
                              value={row.newPoleValue}
                              onChange={e => updateRow(row.rowId, "newPoleValue", e.target.value)}
                              onBlur={() => commitNewPole(row.rowId)}
                              style={{ width: 110, padding: "8px 8px", border: `1px solid ${!rowPole ? "#EF4444" : "#E5E7EB"}`, borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", minHeight: 38, boxSizing: "border-box" }} />
                          )}
                        </div>
                      </td>
                      {/* Function */}
                      <td style={{ padding: "8px 12px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {CU_FUNCTIONS.map(f => (
                            <button key={f.id}
                              onClick={() => updateRow(row.rowId, "fn", f.id)}
                              style={{
                                padding: "6px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: "pointer",
                                transition: "all 0.1s", minHeight: 36,
                                border: `1px solid ${row.fn === f.id ? f.border : !row.fn ? "#FECACA" : "#E5E7EB"}`,
                                color: row.fn === f.id ? f.text : "#9CA3AF",
                                background: row.fn === f.id ? f.bg : "#fff",
                              }}>
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      {/* Completed Date */}
                      <td style={{ padding: "8px 12px", verticalAlign: "middle" }}>
                        <input type="date"
                          value={row.completedDate || ""}
                          min={weekBounds.min}
                          max={weekBounds.max}
                          onChange={e => updateRow(row.rowId, "completedDate", e.target.value)}
                          style={{ padding: "8px 8px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: row.completedDate ? "#111827" : "#9CA3AF", outline: "none", background: "#fff", minHeight: 38, boxSizing: "border-box", width: 130 }}
                          onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                      </td>
                      {/* Qty */}
                      <td style={{ padding: "8px 12px", textAlign: "center", verticalAlign: "middle" }}>
                        <input type="number" min="1" value={row.qty}
                          onChange={e => updateRow(row.rowId, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ width: 56, padding: "8px 6px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 14, fontWeight: 500, textAlign: "center", outline: "none", minHeight: 38, boxSizing: "border-box" }}
                          onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                      </td>
                      {/* Total */}
                      <td style={{ padding: "8px 12px", textAlign: "right", verticalAlign: "middle", fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                        {fmt(row.allInPrice * row.qty)}
                      </td>
                      {/* Remove */}
                      <td style={{ padding: "8px 8px", verticalAlign: "middle" }}>
                        <button onClick={() => removeRow(row.rowId)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", fontSize: 18, padding: 6, lineHeight: 1, minWidth: 36, minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#EF4444"} onMouseLeave={e => e.currentTarget.style.color = "#D1D5DB"}>
                          ×
                        </button>
                      </td>
                    </tr>
                    {/* Note row */}
                    {row.showNote && (
                      <tr style={{ borderBottom: i < stagedRows.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                        <td colSpan={7} style={{ padding: "0 12px 10px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            <input type="text"
                              placeholder="Add a note for this unit (optional)"
                              value={row.note}
                              onChange={e => updateRow(row.rowId, "note", e.target.value)}
                              autoFocus
                              style={{ flex: 1, padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", background: "#FAFAFA", boxSizing: "border-box" }}
                              onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer — Add All button */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #E5E7EB", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          {stagedRows.length > 0 ? (
            <>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                {stagedRows.length} unit{stagedRows.length !== 1 ? "s" : ""} staged
                {!allRowsValid && (
                  <span style={{ color: "#EF4444", fontWeight: 500, marginLeft: 8 }}>
                    — select pole & function for each row
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                  {fmt(totalValue)}
                </div>
                <button onClick={handleAddAll} disabled={!allRowsValid}
                  style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 8, color: "#fff", background: allRowsValid ? "#111827" : "#D1D5DB", cursor: allRowsValid ? "pointer" : "not-allowed", minHeight: 44 }}>
                  Add {stagedRows.length} Unit{stagedRows.length !== 1 ? "s" : ""} to WO
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, fontSize: 13, color: "#9CA3AF" }}>Tap a CU above to stage it — you can add multiple units at once</div>
          )}
        </div>
      </div>
    </>
  );
}


// ============================================================
// CHANGE ORDERS TAB
// ============================================================
const CO_STATUS_FLOW = ["Draft", "Submitted", "Approved", "In Progress", "Complete", "Rejected"];
const CO_STATUS_CONFIG = {
  Draft:       { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" },
  Submitted:   { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  Approved:    { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  "In Progress": { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
  Complete:    { bg: "#ECFDF5", text: "#047857", border: "#6EE7B7" },
  Rejected:    { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
};

const INITIAL_CHANGE_ORDERS = [
  {
    id: "CO-001",
    description: "Replace brace pole instead of guy wire + anchor",
    reason: "Soil conditions at Pole 47-A12 unsuitable for screw anchors — rocky subsurface discovered during excavation. Brace pole required for structural support.",
    billingType: "unit-price",
    status: "Approved",
    submittedDate: "2026-01-21",
    approvedDate: "2026-01-22",
    approvedBy: "CHELCO — David Barnes (Field Engineer)",
    cus: [
      { lineId: 1, code: "OH-103", description: "Install 55' Class 1 Wood Pole (Brace)", unit: "EA", qty: 1, unitPrice: 1890 },
      { lineId: 2, code: "OH-201", description: "Install 8' Crossarm Assembly (Single)", unit: "EA", qty: 1, unitPrice: 520 },
    ],
    teHours: null,
    notes: "Brace pole replaces the 2 guy wire + anchor assemblies that were eliminated via red line.",
  },
  {
    id: "CO-002",
    description: "Emergency tree removal — leaning oak obstructing pole access",
    reason: "Large oak tree leaning toward pole, preventing safe bucket truck access. Not on original staking sheet. Required removal before pole work could proceed.",
    billingType: "te",
    status: "Complete",
    submittedDate: "2026-01-20",
    approvedDate: "2026-01-20",
    approvedBy: "CHELCO — David Barnes (verbal approval, confirmed via email)",
    cus: null,
    teHours: [
      { classification: "Foreman", hours: 2, rate: 95 },
      { classification: "Journeyman Lineman", hours: 4, rate: 85 },
    ],
    notes: "Tree crew dispatched same day. 2-person team, chainsaw + chipper. Debris hauled to CHELCO disposal site.",
  },
];

function ChangeOrderKPIs({ changeOrders }) {
  const total = changeOrders.length;
  const approved = changeOrders.filter(co => ["Approved", "In Progress", "Complete"].includes(co.status)).length;
  const pending = changeOrders.filter(co => ["Draft", "Submitted"].includes(co.status)).length;
  const totalValue = changeOrders.reduce((s, co) => {
    if (co.billingType === "unit-price" && co.cus) return s + co.cus.reduce((cs, cu) => cs + cu.qty * cu.unitPrice, 0);
    if (co.billingType === "te" && co.teHours) return s + co.teHours.reduce((hs, h) => hs + h.hours * h.rate, 0);
    return s;
  }, 0);

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      {[
        { label: "Change Orders", value: total, sub: `${approved} approved · ${pending} pending` },
        { label: "CO Value", value: fmt(totalValue), sub: `${changeOrders.filter(co => co.billingType === "te").length} T&E · ${changeOrders.filter(co => co.billingType === "unit-price").length} unit-price` },
      ].map((kpi, i) => (
        <div key={i} style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{kpi.label}</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{kpi.value}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}

function ChangeOrderCard({ co }) {
  const sc = CO_STATUS_CONFIG[co.status] || CO_STATUS_CONFIG.Draft;
  const [expanded, setExpanded] = useState(false);

  const coValue = co.billingType === "unit-price" && co.cus
    ? co.cus.reduce((s, cu) => s + cu.qty * cu.unitPrice, 0)
    : co.billingType === "te" && co.teHours
    ? co.teHours.reduce((s, h) => s + h.hours * h.rate, 0)
    : 0;

  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, marginBottom: 12, overflow: "hidden" }}>
      {/* Card header — always visible */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"
          style={{ transition: "transform 0.15s", transform: expanded ? "rotate(90deg)" : "none" }}>
          <path d="M4 2l4 4-4 4" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{co.id}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#111827", flex: 1 }}>{co.description}</span>
        <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: sc.text, background: sc.bg, border: `1px solid ${sc.border}` }}>{co.status}</span>
        <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4, color: co.billingType === "te" ? "#7C3AED" : "#047857", background: co.billingType === "te" ? "#F5F3FF" : "#ECFDF5", border: `1px solid ${co.billingType === "te" ? "#DDD6FE" : "#A7F3D0"}` }}>
          {co.billingType === "te" ? "T&E" : "Unit-Price"}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums", minWidth: 70, textAlign: "right" }}>{fmt(coValue)}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid #F3F4F6", padding: "16px 16px 16px 40px" }}>
          {/* Reason */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Reason</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{co.reason}</div>
          </div>

          {/* Approval info */}
          <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Submitted</div>
              <div style={{ fontSize: 12, color: "#374151" }}>{fmtDate(co.submittedDate)}</div>
            </div>
            {co.approvedDate && <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Approved</div>
              <div style={{ fontSize: 12, color: "#374151" }}>{fmtDate(co.approvedDate)}</div>
            </div>}
            {co.approvedBy && <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Approved By</div>
              <div style={{ fontSize: 12, color: "#374151" }}>{co.approvedBy}</div>
            </div>}
          </div>

          {/* CU lines (unit-price CO) */}
          {co.billingType === "unit-price" && co.cus && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>CU Lines</div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      {["CU Code", "Description", "Unit", "Qty", "Unit Price", "Total"].map((h, i) => (
                        <th key={i} style={{ padding: "6px 10px", textAlign: i >= 3 ? "right" : "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {co.cus.map((cu, i) => (
                      <tr key={cu.lineId} style={{ borderBottom: i < co.cus.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                        <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{cu.code}</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, color: "#111827" }}>{cu.description}</td>
                        <td style={{ padding: "8px 10px", fontSize: 11, color: "#6B7280" }}>{cu.unit}</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, fontWeight: 500, color: "#111827", textAlign: "right" }}>{cu.qty}</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, color: "#374151", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(cu.unitPrice)}</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(cu.qty * cu.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "6px 10px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>CO Total: {fmt(co.cus.reduce((s, cu) => s + cu.qty * cu.unitPrice, 0))}</span>
                </div>
              </div>
            </div>
          )}

          {/* T&E hours (T&E CO) */}
          {co.billingType === "te" && co.teHours && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>T&E Hours</div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      {["Classification", "Hours", "Rate", "Total"].map((h, i) => (
                        <th key={i} style={{ padding: "6px 10px", textAlign: i >= 1 ? "right" : "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {co.teHours.map((h, i) => (
                      <tr key={i} style={{ borderBottom: i < co.teHours.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                        <td style={{ padding: "8px 10px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{h.classification}</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, color: "#374151", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{h.hours}</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, color: "#374151", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(h.rate)}/hr</td>
                        <td style={{ padding: "8px 10px", fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(h.hours * h.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "6px 10px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>CO Total: {fmt(co.teHours.reduce((s, h) => s + h.hours * h.rate, 0))}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {co.notes && (
            <div style={{ padding: "10px 14px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>Note: </span>{co.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ============================================================
// VENDOR COSTS TAB
// ============================================================
const VENDOR_COST_STATUS = {
  pending:   { label: "Pending", bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
  submitted: { label: "Submitted", bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  paid:      { label: "Paid", bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
};

function VendorCostKPIs({ costs }) {
  const totalCost = costs.reduce((s, c) => s + c.amount, 0);
  const totalBillable = costs.filter(c => c.billable).reduce((s, c) => s + c.amount * (1 + (c.markup || 0) / 100), 0);
  const pending = costs.filter(c => c.status === "pending").length;
  const categories = [...new Set(costs.map(c => c.category))].length;
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Total Cost</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmt(totalCost)}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{costs.length} line item{costs.length !== 1 ? "s" : ""} · {categories} categor{categories !== 1 ? "ies" : "y"}</div>
      </div>
      <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Billable to Customer</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmt(totalBillable)}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{costs.filter(c => c.billable).length} pass-through · {costs.filter(c => !c.billable).length} absorbed</div>
      </div>
      <div style={{ flex: 1, padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Status</div>
        <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
          {[
            { l: "Pending", c: costs.filter(c => c.status === "pending").length, clr: "#D97706" },
            { l: "Submitted", c: costs.filter(c => c.status === "submitted").length, clr: "#2563EB" },
            { l: "Paid", c: costs.filter(c => c.status === "paid").length, clr: "#059669" },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: s.clr }}>{s.c}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VendorCostsTable({ costs, onRemove }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            {["Vendor", "Description", "Category", "Cost", "Markup", "Billable Amt", "Invoice #", "Status", ""].map((h, i) => (
              <th key={i} style={{ padding: "8px 12px", textAlign: i >= 3 && i <= 5 ? "right" : "left", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", borderBottom: "1px solid #E5E7EB", whiteSpace: "nowrap",
                width: i === 0 ? 160 : i === 1 ? "auto" : i === 2 ? 110 : i === 3 ? 80 : i === 4 ? 60 : i === 5 ? 90 : i === 6 ? 100 : i === 7 ? 80 : 30 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {costs.length === 0 ? (
            <tr><td colSpan={9} style={{ padding: "40px 16px", textAlign: "center" }}>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>No vendor costs added yet</div>
              <div style={{ color: "#D1D5DB", fontSize: 12, marginTop: 4 }}>Click "+ Add Vendor Cost" to record a third-party expense</div>
            </td></tr>
          ) : costs.map((vc, i) => {
            const cat = COST_CATEGORIES.find(c => c.id === vc.category) || COST_CATEGORIES[4];
            const st = VENDOR_COST_STATUS[vc.status] || VENDOR_COST_STATUS.pending;
            const billableAmt = vc.billable ? vc.amount * (1 + (vc.markup || 0) / 100) : 0;
            return (
              <tr key={vc.id} style={{ borderBottom: i < costs.length - 1 ? "1px solid #F3F4F6" : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{vc.vendor}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, color: "#374151", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vc.description}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4, color: cat.color, background: cat.color + "10", border: `1px solid ${cat.color}30` }}>{cat.label}</span>
                </td>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500, color: "#111827", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(vc.amount)}</td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: vc.markup ? "#374151" : "#D1D5DB", textAlign: "right" }}>{vc.markup ? `${vc.markup}%` : "—"}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500, color: vc.billable ? "#059669" : "#D1D5DB", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {vc.billable ? fmt(billableAmt) : "Absorbed"}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#2563EB" }}>{vc.invoiceNumber || "—"}</span>
                    {vc.hasAttachment && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>}
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, color: st.text, background: st.bg, border: `1px solid ${st.border}` }}>{st.label}</span>
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button onClick={() => onRemove(vc.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", fontSize: 14, padding: 2 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#EF4444"} onMouseLeave={e => e.currentTarget.style.color = "#D1D5DB"} title="Remove">×</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {costs.length > 0 && (
        <div style={{ padding: "10px 12px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{costs.length} vendor cost{costs.length !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
            Total: {fmt(costs.reduce((s, c) => s + c.amount, 0))}
          </span>
        </div>
      )}
    </div>
  );
}

function AddVendorCostModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ vendor: "", description: "", category: "materials", amount: "", markup: "", billable: true, invoiceNumber: "", invoiceDate: "", status: "pending" });
  const f = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const canSubmit = form.vendor && form.description && form.amount;

  const Lbl = ({ text, req }) => <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>{text}{req && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}</label>;
  const Inp = ({ value, onChange, placeholder, type, style: s }) => (
    <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box", ...s }}
      onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 560, background: "#fff", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 51, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Add Vendor Cost</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>×</button>
        </div>
        <div style={{ padding: 20, maxHeight: "60vh", overflow: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <Lbl text="Vendor" req /><Inp value={form.vendor} onChange={v => f("vendor", v)} placeholder="e.g., Anixter Power Solutions" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Lbl text="Description" req /><Inp value={form.description} onChange={v => f("description", v)} placeholder="e.g., 45' Class 3 Wood Pole" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <Lbl text="Category" req />
              <select value={form.category} onChange={e => f("category", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", background: "#fff", boxSizing: "border-box" }}>
                {COST_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <Lbl text="Amount" req />
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>$</span>
                <Inp type="number" value={form.amount} onChange={v => f("amount", v)} placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Pass-through toggle */}
          <div style={{ padding: "12px 14px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: form.billable ? 10 : 0 }}>
              <input type="checkbox" checked={form.billable} onChange={e => f("billable", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#2563EB" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Pass through to customer</span>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>— bill this cost to the utility</span>
            </label>
            {form.billable && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 24 }}>
                <div style={{ flex: "0 0 100px" }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 }}>Markup</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Inp type="number" value={form.markup} onChange={v => f("markup", v)} placeholder="0" style={{ width: 60 }} />
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>%</span>
                  </div>
                </div>
                {form.amount && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 4 }}>Billable Amount</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>
                      {fmt(parseFloat(form.amount || 0) * (1 + parseFloat(form.markup || 0) / 100))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <Lbl text="Invoice Number" /><Inp value={form.invoiceNumber} onChange={v => f("invoiceNumber", v)} placeholder="e.g., INV-12345" />
            </div>
            <div>
              <Lbl text="Invoice Date" /><input type="date" value={form.invoiceDate} onChange={e => f("invoiceDate", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ marginBottom: 4 }}>
            <Lbl text="Upload Invoice" />
            <div style={{ border: "2px dashed #E5E7EB", borderRadius: 8, padding: "16px 20px", textAlign: "center", cursor: "pointer" }}
              onClick={() => alert("File upload — coming soon")}>
              <svg style={{ margin: "0 auto 6px", display: "block" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Click to upload or drag and drop</div>
              <div style={{ fontSize: 10, color: "#D1D5DB", marginTop: 2 }}>PDF, JPG, PNG up to 10MB</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", gap: 8, background: "#F9FAFB" }}>
          <button onClick={onClose} style={{ padding: "7px 14px", fontSize: 12, fontWeight: 500, border: "1px solid #E5E7EB", borderRadius: 6, color: "#6B7280", background: "#fff", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { if (canSubmit) { onAdd({ ...form, amount: parseFloat(form.amount), markup: parseFloat(form.markup || 0) }); onClose(); } }}
            style={{ padding: "7px 14px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 6, color: "#fff", background: canSubmit ? "#111827" : "#D1D5DB", cursor: canSubmit ? "pointer" : "default" }}
            disabled={!canSubmit}>Add Vendor Cost</button>
        </div>
      </div>
    </>
  );
}


// ============================================================
// ATTACHMENTS TAB
// ============================================================
const ATTACHMENTS = [
  { id: "att-1", fileName: "WO-48291_Original.pdf", fileType: "pdf", fileSize: "2.4 MB", note: "Original work order packet from CHELCO", uploadedBy: "Sarah Chen", uploadedDate: "2025-12-02", category: "Work Order" },
  { id: "att-2", fileName: "CHELCO_Approval_Email_Nov2025.pdf", fileType: "pdf", fileSize: "340 KB", note: "Prior approval email from CHELCO project manager — authorization to proceed with pole replacements", uploadedBy: "Sarah Chen", uploadedDate: "2025-12-02", category: "Approval" },
  { id: "att-3", fileName: "Pole_47-A12_Before.jpg", fileType: "image", fileSize: "3.1 MB", note: "Pre-work photo — existing pole condition, visible lean", uploadedBy: "Mike Abbott", uploadedDate: "2026-01-13", category: "Photo" },
  { id: "att-4", fileName: "Pole_47-A12_After.jpg", fileType: "image", fileSize: "2.8 MB", note: "Post-work photo — new 45' Class 3 installed", uploadedBy: "Mike Abbott", uploadedDate: "2026-01-21", category: "Photo" },
  { id: "att-5", fileName: "Pole_47-A13_Damage_Report.pdf", fileType: "pdf", fileSize: "1.1 MB", note: "Damage assessment report — woodpecker damage to existing pole", uploadedBy: "Mike Abbott", uploadedDate: "2026-01-15", category: "Report" },
  { id: "att-6", fileName: "Easement_Access_Map.png", fileType: "image", fileSize: "890 KB", note: "Property easement map showing access route for Pole 47-A14", uploadedBy: "Sarah Chen", uploadedDate: "2025-12-10", category: "Map" },
  { id: "att-7", fileName: "Material_Delivery_Receipt.pdf", fileType: "pdf", fileSize: "156 KB", note: "Delivery receipt for poles and crossarm assemblies", uploadedBy: "Sarah Chen", uploadedDate: "2026-01-06", category: "Receipt" },
  { id: "att-8", fileName: "Crew_Safety_Briefing_Jan13.jpg", fileType: "image", fileSize: "1.5 MB", note: "Job site safety briefing photo — tailboard meeting", uploadedBy: "Mike Abbott", uploadedDate: "2026-01-13", category: "Photo" },
];

const FILE_TYPE_ICONS = {
  pdf: { icon: "📄", color: "#DC2626", bg: "#FEF2F2", label: "PDF" },
  image: { icon: "🖼️", color: "#2563EB", bg: "#EFF6FF", label: "Image" },
  doc: { icon: "📝", color: "#7C3AED", bg: "#F5F3FF", label: "Doc" },
};

const CATEGORY_COLORS = {
  "Work Order": { color: "#1F2937", bg: "#F3F4F6" },
  "Approval": { color: "#059669", bg: "#ECFDF5" },
  "Photo": { color: "#2563EB", bg: "#EFF6FF" },
  "Report": { color: "#D97706", bg: "#FFFBEB" },
  "Map": { color: "#7C3AED", bg: "#F5F3FF" },
  "Receipt": { color: "#6B7280", bg: "#F9FAFB" },
};

function AttachmentsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState("uploadedDate");
  const [sortDir, setSortDir] = useState("desc");

  const categories = ["All", ...new Set(ATTACHMENTS.map(a => a.category))];

  const filtered = useMemo(() => {
    let result = [...ATTACHMENTS];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(a => a.fileName.toLowerCase().includes(q) || a.note.toLowerCase().includes(q) || a.uploadedBy.toLowerCase().includes(q));
    }
    if (categoryFilter !== "All") {
      result = result.filter(a => a.category === categoryFilter);
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "uploadedDate") cmp = a.uploadedDate.localeCompare(b.uploadedDate);
      else if (sortField === "fileName") cmp = a.fileName.localeCompare(b.fileName);
      else if (sortField === "fileSize") cmp = parseFloat(a.fileSize) - parseFloat(b.fileSize);
      else if (sortField === "category") cmp = a.category.localeCompare(b.category);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [searchTerm, categoryFilter, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortHeader = ({ field, children, width, align }) => (
    <th
      onClick={() => handleSort(field)}
      style={{ padding: "10px 12px", textAlign: align || "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", userSelect: "none", width: width || "auto", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {children}
        {sortField === field && <span style={{ fontSize: 10 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
      </span>
    </th>
  );

  return (
    <div>
      {/* Upload area */}
      <div style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: "28px 20px", textAlign: "center", marginBottom: 16, background: "#FAFAFA", cursor: "pointer" }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 2 }}>Drop files here or click to upload</div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>PDF, JPG, PNG, DOC — Max 25 MB per file</div>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: 180, padding: "7px 12px", border: "1px solid #D1D5DB", borderRadius: 6, fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, border: "1px solid",
                cursor: "pointer", transition: "all 0.15s",
                background: categoryFilter === cat ? "#111827" : "#fff",
                color: categoryFilter === cat ? "#fff" : "#374151",
                borderColor: categoryFilter === cat ? "#111827" : "#D1D5DB",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>
          {filtered.length} file{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Attachments table */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <SortHeader field="fileName" width="30%">File Name</SortHeader>
              <SortHeader field="category" width="100px">Category</SortHeader>
              <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>Note</th>
              <SortHeader field="fileSize" width="80px" align="right">Size</SortHeader>
              <SortHeader field="uploadedDate" width="110px">Date</SortHeader>
              <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", width: "110px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>Uploaded By</th>
              <th style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", width: "60px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>No attachments match your search</td></tr>
            ) : filtered.map((att, idx) => {
              const fType = FILE_TYPE_ICONS[att.fileType] || FILE_TYPE_ICONS.doc;
              const catColor = CATEGORY_COLORS[att.category] || CATEGORY_COLORS["Receipt"];
              return (
                <tr key={att.id} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, background: fType.bg, flexShrink: 0 }}>
                        {fType.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#1F2937", lineHeight: 1.3 }}>{att.fileName}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{fType.label}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, color: catColor.color, background: catColor.bg }}>
                      {att.category}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#6B7280", lineHeight: 1.4, maxWidth: 280 }}>
                    {att.note}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#6B7280", textAlign: "right" }}>
                    {att.fileSize}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#6B7280" }}>
                    {new Date(att.uploadedDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151" }}>
                    {att.uploadedBy}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #D1D5DB", background: "#fff", fontSize: 11, color: "#374151", cursor: "pointer" }}>
                      ↓
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================
// ACTIVITY LOG
// ============================================================
function ActivityLog() {
  const events = [
    { date: "Jan 21, 2026", user: "Mike Abbott", action: "Marked 2 CUs complete", detail: "OH-201 (x2) — Install 8' Crossarm Assembly" },
    { date: "Jan 21, 2026", user: "Mike Abbott", action: "Marked 1 CU complete", detail: "OH-801 — Transfer Existing Facilities" },
    { date: "Jan 20, 2026", user: "Mike Abbott", action: "Marked 2 CUs complete", detail: "OH-110 — Remove Pole, OH-101 — Install Pole" },
    { date: "Jan 20, 2026", user: "Mike Abbott", action: "Started work on WO", detail: "Status: Assigned → In Progress" },
    { date: "Jan 16, 2026", user: "Ben Glatt", action: "Assigned to Abbott Crew", detail: "Status: Unassigned → Assigned" },
    { date: "Jan 15, 2026", user: "Ben Glatt", action: "Created work order", detail: "WO-48291 — Replace 45' Class 3 wood pole + transfer" },
    { date: "Jan 15, 2026", user: "System", action: "Added 8 CUs from template", detail: "Total value: $7,990" },
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 20px" }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Activity</div>
      <div style={{ position: "relative" }}>
        {events.map((ev, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < events.length - 1 ? 16 : 0, position: "relative" }}>
            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#2563EB" : "#D1D5DB", marginTop: 4 }} />
              {i < events.length - 1 && <div style={{ width: 1, flex: 1, background: "#F3F4F6", marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "#111827" }}>
                <span style={{ fontWeight: 500 }}>{ev.user}</span> <span style={{ color: "#6B7280" }}>{ev.action}</span>
              </div>
              {ev.detail && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{ev.detail}</div>}
              <div style={{ fontSize: 10, color: "#D1D5DB", marginTop: 3 }}>{ev.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================
// MAIN MODULE
// ============================================================
export default function WorkOrderDetailPage() {
  const [wo, setWo] = useState({ ...WORK_ORDER });
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...WORK_ORDER });
  const [cus, setCus] = useState([...INITIAL_WO_CUS]);
  const [vendorCosts, setVendorCosts] = useState([...INITIAL_VENDOR_COSTS]);
  const [changeOrders, setChangeOrders] = useState([...INITIAL_CHANGE_ORDERS]);
  const [activeTab, setActiveTab] = useState("units");
  const [cuFilter, setCuFilter] = useState("all");
  const [showAddCU, setShowAddCU] = useState(false);
  const [showAddVendorCost, setShowAddVendorCost] = useState(false);
  const [redLineCU, setRedLineCU] = useState(null); // CU object being red-lined

  const nextLineId = cus.length > 0 ? Math.max(...cus.map(c => c.lineId)) + 1 : 1;

  const handleToggleComplete = (lineId) => {
    setCus(prev => prev.map(c => c.lineId === lineId ? {
      ...c,
      complete: !c.complete,
      completedDate: !c.complete ? new Date().toISOString().split("T")[0] : null,
      completedBy: !c.complete ? "Mike Abbott" : null,
    } : c));
  };

  const handleRemoveCU = (lineId) => {
    setCus(prev => prev.filter(c => c.lineId !== lineId));
  };

  const handleUpdateQty = (lineId, qty) => {
    setCus(prev => prev.map(c => c.lineId === lineId ? { ...c, qty: Math.max(1, qty) } : c));
  };

  const handleAddCU = ({ cuId, code, description, unit, qty, unitPrice, poleNumber, fn, completedDate, note }) => {
    setCus(prev => [...prev, {
      lineId: nextLineId,
      cuId, code, description, unit, qty, originalQty: qty, unitPrice,
      fn: fn || "Install",
      complete: !!completedDate, completedDate: completedDate || null, completedBy: completedDate ? WORK_ORDER.foreman : null,
      redLine: false, redLineNote: "",
      note: note || "",
      poleNumber: poleNumber || "Unassigned",
    }]);
  };

  const handleAddVendorCost = (cost) => {
    const nextId = vendorCosts.length > 0 ? Math.max(...vendorCosts.map(v => v.id)) + 1 : 1;
    setVendorCosts(prev => [...prev, { ...cost, id: nextId }]);
  };

  const handleRemoveVendorCost = (id) => {
    setVendorCosts(prev => prev.filter(v => v.id !== id));
  };

  const handleRedLineConfirm = ({ lineId, newQty, note }) => {
    setCus(prev => prev.map(c => c.lineId === lineId ? {
      ...c,
      originalQty: c.originalQty ?? c.qty, // preserve first original value
      qty: newQty,
      redLine: true,
      redLineNote: note,
    } : c));
  };

  const existingCodes = cus.map(c => c.code);
  const activeCus = cus.filter(c => c.qty > 0);
  const completedCount = activeCus.filter(c => c.complete).length;
  const remainingCount = activeCus.filter(c => !c.complete).length;
  const redLineCount = cus.filter(c => c.redLine).length;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F9FAFB", minHeight: "100vh", display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ height: 52, borderBottom: "1px solid #E5E7EB", background: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "#9CA3AF" }}>Bluesky</span>
            <span style={{ color: "#D1D5DB" }}>/</span>
            <span style={{ color: "#9CA3AF", cursor: "pointer" }}>Projects</span>
            <span style={{ color: "#D1D5DB" }}>/</span>
            <span style={{ color: "#9CA3AF", cursor: "pointer" }}>{wo.customer}</span>
            <span style={{ color: "#D1D5DB" }}>/</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>{wo.id}</span>
          </div>
          <button onClick={() => alert("← Back to project")}
            style={{ fontSize: 12, color: "#6B7280", background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Project
          </button>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 24px 48px" }}>
          <WOHeader wo={wo} editing={editing} setEditing={setEditing} editData={editData} setEditData={setEditData} onSave={data => setWo(data)} />

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid #E5E7EB", marginBottom: 20 }}>
            <TabButton label="Compatible Units" active={activeTab === "units"} onClick={() => setActiveTab("units")} />
            <TabButton label={`Change Orders (${changeOrders.length})`} active={activeTab === "change-orders"} onClick={() => setActiveTab("change-orders")} />
            <TabButton label={`Vendor Costs (${vendorCosts.length})`} active={activeTab === "vendors"} onClick={() => setActiveTab("vendors")} />
            <TabButton label="Activity" active={activeTab === "activity"} onClick={() => setActiveTab("activity")} />
            <TabButton label="Attachments" active={activeTab === "attachments"} onClick={() => setActiveTab("attachments")} />
          </div>

          {activeTab === "units" && (
            <>
              <CUKPIs cus={cus} />

              {/* Filter bar + Add CU */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { id: "all", label: "All", count: cus.length },
                    { id: "remaining", label: "Remaining", count: remainingCount },
                    { id: "complete", label: "Complete", count: completedCount },
                    ...(redLineCount > 0 ? [{ id: "redline", label: "Red Lines", count: redLineCount }] : []),
                  ].map(f => (
                    <button key={f.id} onClick={() => setCuFilter(f.id)} style={{
                      padding: "4px 12px", fontSize: 12, fontWeight: 500, borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                      border: "1px solid " + (cuFilter === f.id ? "#111827" : "#E5E7EB"),
                      color: cuFilter === f.id ? "#fff" : "#6B7280", background: cuFilter === f.id ? "#111827" : "#fff",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      {f.label}
                      <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{f.count}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddCU(true)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#111827", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10" /></svg>
                  Add CU
                </button>
              </div>

              <CUTable cus={cus} onToggleComplete={handleToggleComplete} onRemoveCU={handleRemoveCU} onUpdateQty={handleUpdateQty} onRedLine={(cu) => setRedLineCU(cu)} filter={cuFilter} />
            </>
          )}

          {activeTab === "change-orders" && (
            <>
              <ChangeOrderKPIs changeOrders={changeOrders} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  {changeOrders.length} change order{changeOrders.length !== 1 ? "s" : ""} on this work order
                </div>
                <button onClick={() => alert("Add Change Order modal — coming soon")}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#111827", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10" /></svg>
                  New Change Order
                </button>
              </div>

              {changeOrders.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#374151", marginBottom: 4 }}>No Change Orders</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF" }}>Change orders document significant scope additions that go beyond red line adjustments.</div>
                </div>
              ) : (
                changeOrders.map(co => <ChangeOrderCard key={co.id} co={co} />)
              )}

              {/* Red line summary callout */}
              {redLineCount > 0 && (
                <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#92400E" }}>This WO also has {redLineCount} red line change{redLineCount !== 1 ? "s" : ""}</div>
                    <div style={{ fontSize: 11, color: "#92400E", marginTop: 2 }}>Red line changes (qty adjustments and eliminations) are tracked on the Compatible Units tab.</div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "vendors" && (
            <>
              <VendorCostKPIs costs={vendorCosts} />

              {/* Add vendor cost bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  {vendorCosts.length} cost {vendorCosts.length === 1 ? "entry" : "entries"} on this work order
                </div>
                <button onClick={() => setShowAddVendorCost(true)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#111827", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10" /></svg>
                  Add Vendor Cost
                </button>
              </div>

              <VendorCostsTable costs={vendorCosts} onRemove={handleRemoveVendorCost} />
            </>
          )}

          {activeTab === "activity" && <ActivityLog />}

          {activeTab === "attachments" && <AttachmentsTab />}
        </div>
      </div>

      {showAddCU && <AddCUModal onClose={() => setShowAddCU(false)} onAdd={handleAddCU} existingCodes={existingCodes} existingPoles={[...new Set(cus.map(c => c.poleNumber).filter(Boolean))]} />}
      {showAddVendorCost && <AddVendorCostModal onClose={() => setShowAddVendorCost(false)} onAdd={handleAddVendorCost} />}
      {redLineCU && <RedLineModal cu={redLineCU} onClose={() => setRedLineCU(null)} onConfirm={handleRedLineConfirm} />}
    </div>
  );
}
