import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, Download, Upload, X, Plus, FileSpreadsheet, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

// ============================================================
// CU LIBRARY MODULE
// Two views managed by state:
//   "list"  → Landing page with table of all CU libraries
//   "setup" → New Library setup & import flow (3-step wizard)
// ============================================================

// ============================================================
// SHARED CONSTANTS
// ============================================================

const WORK_TYPES = [
  "OH Distribution",
  "OH Transmission",
  "Underground (URD)",
  "Lighting",
  "Vegetation Management",
  "Make-Ready",
  "Communications",
  "Substation",
];

const DEFAULT_FUNCTIONS = [
  { id: "install", label: "Install", checked: true },
  { id: "remove", label: "Remove", checked: true },
  { id: "transfer", label: "Transfer", checked: false },
  { id: "conversion", label: "Conversion", checked: false },
  { id: "thirdparty", label: "Third-Party Transfer", checked: false },
];

const DEFAULT_FUNCTION_IDS = new Set(DEFAULT_FUNCTIONS.map(f => f.id));

const COMMON_CONDITIONS = [
  { id: "hot", label: "Hot (Energized)" },
  { id: "cold", label: "Cold (De-energized)" },
  { id: "overhead", label: "Overhead" },
  { id: "underground", label: "Underground" },
  { id: "single_phase", label: "Single-Phase" },
  { id: "three_phase", label: "Three-Phase" },
];

const DEFAULT_CONDITION_IDS = new Set(COMMON_CONDITIONS.map(c => c.id));

const SAMPLE_ORGS = [
  "CHELCO", "Entergy", "Duke Energy", "Georgia Power (GPC)", "AEP/APCO",
  "Central Georgia EMC", "Baldwin EMC", "Wiregrass", "CAEC", "Covington Electric",
];

const PRICING_LABELS = {
  labor_dollars: "Labor-Only ($)",
  allin_dollars: "All-In ($)",
  manhours: "Man-Hours",
};

// --- Sample data for list view ---
const LIBRARIES = [
  {
    id: "CUL-001",
    name: "CHELCO 2026 OH Distribution",
    customer: "CHELCO",
    workType: "OH Distribution",
    pricingModel: "labor_dollars",
    unitCount: 312,
    effectiveDate: "2026-01-01",
    expirationDate: "2028-12-31",
    updatedAt: "2026-02-28",
  },
  {
    id: "CUL-002",
    name: "Entergy 2026 OH Distribution",
    customer: "Entergy",
    workType: "OH Distribution",
    pricingModel: "manhours",
    unitCount: 8007,
    effectiveDate: "2026-01-01",
    expirationDate: "2027-12-31",
    updatedAt: "2026-02-25",
  },
  {
    id: "CUL-003",
    name: "Georgia Power OH Distribution",
    customer: "Georgia Power (GPC)",
    workType: "OH Distribution",
    pricingModel: "labor_dollars",
    unitCount: 949,
    effectiveDate: "2025-07-01",
    expirationDate: "2027-06-30",
    updatedAt: "2026-02-20",
  },
  {
    id: "CUL-004",
    name: "Duke Energy Veg Management",
    customer: "Duke Energy",
    workType: "Vegetation Management",
    pricingModel: "allin_dollars",
    unitCount: 186,
    effectiveDate: "2026-01-01",
    expirationDate: "2026-12-31",
    updatedAt: "2026-02-18",
  },
  {
    id: "CUL-005",
    name: "CTEC Underground Residential",
    customer: "CTEC",
    workType: "Underground (URD)",
    pricingModel: "labor_dollars",
    unitCount: 79,
    effectiveDate: "2025-10-01",
    expirationDate: "2027-09-30",
    updatedAt: "2026-02-10",
  },
  {
    id: "CUL-006",
    name: "AEP/APCO OH Transmission",
    customer: "AEP/APCO",
    workType: "OH Transmission",
    pricingModel: "manhours",
    unitCount: 524,
    effectiveDate: "2025-06-01",
    expirationDate: "2027-05-31",
    updatedAt: "2026-01-30",
  },
  {
    id: "CUL-007",
    name: "Wiregrass OH Distribution 2025",
    customer: "Wiregrass",
    workType: "OH Distribution",
    pricingModel: "labor_dollars",
    unitCount: 410,
    effectiveDate: "2025-01-01",
    expirationDate: "2027-12-31",
    updatedAt: "2026-01-15",
  },
  {
    id: "CUL-008",
    name: "WST-Charter Fiber/Electric",
    customer: "WST-Charter",
    workType: "Communications",
    pricingModel: "allin_dollars",
    unitCount: 142,
    effectiveDate: "2025-09-01",
    expirationDate: "2026-08-31",
    updatedAt: "2025-12-22",
  },
  {
    id: "CUL-009",
    name: "Baldwin EMC Make-Ready",
    customer: "Baldwin EMC",
    workType: "Make-Ready",
    pricingModel: "labor_dollars",
    unitCount: 67,
    effectiveDate: "2025-11-01",
    expirationDate: "2026-10-31",
    updatedAt: "2025-12-10",
  },
];

// ============================================================
// LIST VIEW COMPONENTS
// ============================================================

function NewLibraryButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 16px", fontSize: 13, fontWeight: 600,
        color: "#fff", background: "#111827", border: "none",
        borderRadius: 8, cursor: "pointer",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M7 1v12M1 7h12" />
      </svg>
      New Library
    </button>
  );
}

function SearchBar({ search, onSearchChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ position: "relative", maxWidth: 320 }}>
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search libraries..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#111827", outline: "none" }}
          onFocus={e => e.target.style.borderColor = "#3B82F6"}
          onBlur={e => e.target.style.borderColor = "#E5E7EB"}
        />
      </div>
    </div>
  );
}

function RowActionsMenu({ library, isOpen, onToggle, onClose }) {
  const actions = [
    { label: "Open", icon: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7zm10 3a3 3 0 100-6 3 3 0 000 6z", action: "open" },
    { label: "Duplicate", icon: "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2v-2M4 16V4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z", action: "duplicate" },
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{ background: isOpen ? "#F3F4F6" : "none", border: "none", cursor: "pointer", color: isOpen ? "#374151" : "#9CA3AF", padding: 4, borderRadius: 4 }}
        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#374151"; } }}
        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9CA3AF"; } }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute", right: 0, top: "100%", marginTop: 4,
            width: 180, background: "#fff", borderRadius: 10,
            border: "1px solid #E5E7EB", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 50, overflow: "hidden", padding: "4px",
          }}
        >
          {actions.map((item) => (
            <button
              key={item.action}
              onClick={e => { e.stopPropagation(); onClose(); alert(`${item.label}: ${library.name}`); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "8px 10px", border: "none", borderRadius: 6,
                fontSize: 13, color: "#374151",
                background: "transparent", cursor: "pointer", textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkTypePill({ workType }) {
  const colorMap = {
    "OH Distribution": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    "OH Transmission": { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
    "Underground (URD)": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
    "Vegetation Management": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
    "Make-Ready": { bg: "#FDF4FF", text: "#A21CAF", border: "#F0ABFC" },
    "Communications": { bg: "#ECFEFF", text: "#0E7490", border: "#A5F3FC" },
    "Lighting": { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
    "Substation": { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
  };
  const colors = colorMap[workType] || { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };

  return (
    <span style={{
      display: "inline-block",
      fontSize: 11, fontWeight: 500,
      color: colors.text, background: colors.bg,
      border: `1px solid ${colors.border}`,
      padding: "2px 8px", borderRadius: 4,
      whiteSpace: "nowrap",
    }}>
      {workType}
    </span>
  );
}

function LibraryTable({ libraries, sortField, sortDir, onSort }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const SortHeader = ({ field, children, align }) => {
    const active = sortField === field;
    return (
      <th
        onClick={() => onSort(field)}
        style={{
          padding: "10px 16px", textAlign: align || "left",
          fontSize: 10, fontWeight: 500, color: active ? "#111827" : "#9CA3AF",
          textTransform: "uppercase", letterSpacing: "0.05em",
          cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
          borderBottom: "1px solid #E5E7EB", background: "#F9FAFB",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {children}
          {active && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ transform: sortDir === "desc" ? "rotate(180deg)" : "none" }}>
              <path d="M4 1L7 6H1L4 1Z" />
            </svg>
          )}
        </span>
      </th>
    );
  };

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <SortHeader field="name">Library</SortHeader>
            <SortHeader field="customer">Customer</SortHeader>
            <SortHeader field="workType">Work Type</SortHeader>
            <SortHeader field="unitCount" align="right">Units</SortHeader>
            <SortHeader field="updatedAt">Updated</SortHeader>
            <th style={{ padding: "10px 16px", width: 48, background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }} />
          </tr>
        </thead>
        <tbody>
          {libraries.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "60px 16px", textAlign: "center" }}>
                <div style={{ color: "#9CA3AF", fontSize: 14 }}>No libraries match your search</div>
                <div style={{ color: "#D1D5DB", fontSize: 12, marginTop: 4 }}>Try adjusting your search terms</div>
              </td>
            </tr>
          ) : (
            libraries.map((lib, i) => (
              <tr
                key={lib.id}
                style={{
                  borderBottom: i < libraries.length - 1 ? "1px solid #F3F4F6" : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 16px", maxWidth: 320 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 2, lineHeight: 1.3 }}>
                    {lib.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                    {PRICING_LABELS[lib.pricingModel] || lib.pricingModel}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                  {lib.customer}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <WorkTypePill workType={lib.workType} />
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {lib.unitCount.toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
                  {new Date(lib.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td style={{ padding: "12px 8px", textAlign: "center" }}>
                  <RowActionsMenu
                    library={lib}
                    isOpen={openMenuId === lib.id}
                    onToggle={() => setOpenMenuId(openMenuId === lib.id ? null : lib.id)}
                    onClose={() => setOpenMenuId(null)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {libraries.length > 0 && (
        <div style={{ padding: "10px 16px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
            {libraries.length} librar{libraries.length !== 1 ? "ies" : "y"}
          </span>
        </div>
      )}
    </div>
  );
}

function CULibraryList({ onNewLibrary }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredLibraries = useMemo(() => {
    let result = [...LIBRARIES];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(lib =>
        lib.name.toLowerCase().includes(q) ||
        lib.customer.toLowerCase().includes(q) ||
        lib.workType.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [search, sortField, sortDir]);

  return (
    <>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>CU Libraries</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Manage compatible unit libraries for unit-price contracts</p>
        </div>
        <NewLibraryButton onClick={onNewLibrary} />
      </div>

      <SearchBar search={search} onSearchChange={setSearch} />

      <LibraryTable
        libraries={filteredLibraries}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
      />
    </>
  );
}

// ============================================================
// SETUP VIEW COMPONENTS (3-step wizard)
// ============================================================

function StepIndicator({ currentStep, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 500,
            transition: "all 0.2s",
            ...(i < currentStep
              ? { background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }
              : i === currentStep
                ? { background: "#111827", color: "#fff", border: "1px solid #111827" }
                : { background: "#F3F4F6", color: "#9CA3AF", border: "1px solid #E5E7EB" }
            ),
          }}>
            {i < currentStep ? (
              <CheckCircle style={{ width: 14, height: 14 }} />
            ) : (
              <span style={{ width: 16, textAlign: "center" }}>{i + 1}</span>
            )}
            <span>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight style={{ width: 16, height: 16, color: "#D1D5DB" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// --- Step 1: Library Setup Form ---
function LibrarySetupForm({ config, setConfig, onNext }) {
  const [customFunction, setCustomFunction] = useState("");
  const [customCondition, setCustomCondition] = useState("");
  const [showCustomFn, setShowCustomFn] = useState(false);
  const [showCustomCond, setShowCustomCond] = useState(false);

  const toggleFunction = (id) => {
    setConfig(prev => ({
      ...prev,
      functions: prev.functions.map(f => f.id === id ? { ...f, checked: !f.checked } : f)
    }));
  };

  const addCustomFunction = () => {
    if (customFunction.trim()) {
      setConfig(prev => ({
        ...prev,
        functions: [...prev.functions, { id: customFunction.toLowerCase().replace(/\s+/g, '_'), label: customFunction.trim(), checked: true }]
      }));
      setCustomFunction("");
      setShowCustomFn(false);
    }
  };

  const toggleCondition = (id) => {
    setConfig(prev => ({
      ...prev,
      conditions: prev.conditions.includes(id)
        ? prev.conditions.filter(c => c !== id)
        : [...prev.conditions, id]
    }));
  };

  const addCustomCondition = () => {
    if (customCondition.trim()) {
      const newCond = { id: customCondition.toLowerCase().replace(/\s+/g, '_'), label: customCondition.trim() };
      COMMON_CONDITIONS.push(newCond);
      setConfig(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCond.id]
      }));
      setCustomCondition("");
      setShowCustomCond(false);
    }
  };

  const removeCustomFunction = (id) => {
    setConfig(prev => ({
      ...prev,
      functions: prev.functions.filter(f => f.id !== id)
    }));
  };

  const removeCustomCondition = (id) => {
    // Remove from COMMON_CONDITIONS array
    const idx = COMMON_CONDITIONS.findIndex(c => c.id === id);
    if (idx !== -1) COMMON_CONDITIONS.splice(idx, 1);
    // Remove from config
    setConfig(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c !== id)
    }));
  };

  const selectedFunctions = config.functions.filter(f => f.checked);
  const hasConditions = config.conditions.length > 0;

  // Preview columns
  const previewColumns = [];
  previewColumns.push("CU Code", "Description");
  if (hasConditions) {
    config.conditions.forEach(condId => {
      const condLabel = COMMON_CONDITIONS.find(c => c.id === condId)?.label?.split(" (")[0] || condId;
      selectedFunctions.forEach(fn => {
        previewColumns.push(`${condLabel} ${fn.label}`);
      });
    });
  } else {
    selectedFunctions.forEach(fn => {
      previewColumns.push(fn.label);
    });
  }
  if (config.includeCategory) previewColumns.push("Category");
  if (config.includeUOM) previewColumns.push("UOM");
  if (config.includeOldCode) previewColumns.push("Old Unit Code");

  const inputStyle = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 bg-white";
  const labelStyle = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2";

  const selectCaret = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;
  const selectStyle = {
    width: "100%",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "8px 32px 8px 12px",
    fontSize: 14,
    color: "#111827",
    background: `#fff ${selectCaret} no-repeat right 10px center`,
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    outline: "none",
    cursor: "pointer",
  };
  const selectStyleNarrow = {
    ...selectStyle,
    width: "auto",
    padding: "8px 32px 8px 12px",
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Customer */}
          <div>
            <label className={labelStyle}>Customer</label>
            <select
              value={config.customer}
              onChange={e => setConfig(prev => ({ ...prev, customer: e.target.value }))}
              style={selectStyle}
            >
              <option value="">Select a customer...</option>
              {SAMPLE_ORGS.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>

          {/* Library Name */}
          <div>
            <label className={labelStyle}>Library Name</label>
            <input
              type="text"
              value={config.libraryName}
              onChange={e => setConfig(prev => ({ ...prev, libraryName: e.target.value }))}
              placeholder="e.g., CHELCO 2026 OH Distribution"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
            {config.customer && config.workType && (
              <p className="mt-1 text-xs text-gray-400">
                Suggested: {config.customer} 2026 {config.workType}
              </p>
            )}
          </div>

          {/* Work Type */}
          <div>
            <label className={labelStyle}>Work Type</label>
            <select
              value={config.workType}
              onChange={e => setConfig(prev => ({ ...prev, workType: e.target.value }))}
              style={selectStyle}
            >
              <option value="">Select work type...</option>
              {WORK_TYPES.map(wt => (
                <option key={wt} value={wt}>{wt}</option>
              ))}
            </select>
          </div>

          {/* Pricing Model */}
          <div>
            <label className={labelStyle}>Pricing Model</label>
            <div className="space-y-2">
              {[
                { value: "labor_dollars", label: "Labor-Only (Dollars)", desc: "Unit prices in dollars — utility supplies materials" },
                { value: "allin_dollars", label: "All-In (Dollars)", desc: "Bundled price includes labor + materials" },
                { value: "manhours", label: "Man-Hours Only", desc: "Hours per unit — you'll set labor rates separately" },
              ].map(opt => (
                <label key={opt.value} className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  config.pricingModel === opt.value ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input
                    type="radio"
                    name="pricingModel"
                    value={opt.value}
                    checked={config.pricingModel === opt.value}
                    onChange={e => setConfig(prev => ({ ...prev, pricingModel: e.target.value }))}
                    className="mt-0.5 accent-gray-900"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Effective Date</label>
              <input
                type="date"
                value={config.effectiveDate}
                onChange={e => setConfig(prev => ({ ...prev, effectiveDate: e.target.value }))}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Expiration Date</label>
              <input
                type="date"
                value={config.expirationDate}
                onChange={e => setConfig(prev => ({ ...prev, expirationDate: e.target.value }))}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Escalation */}
          <div>
            <label className={labelStyle}>Annual Escalation</label>
            <div className="flex items-center gap-3">
              <select
                value={config.escalation}
                onChange={e => setConfig(prev => ({ ...prev, escalation: e.target.value }))}
                style={selectStyleNarrow}
              >
                <option value="none">None</option>
                <option value="fixed">Fixed % per year</option>
                <option value="custom">Custom per year</option>
              </select>
              {config.escalation === "fixed" && (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={config.escalationPct}
                    onChange={e => setConfig(prev => ({ ...prev, escalationPct: e.target.value }))}
                    className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                    placeholder="4"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              )}
            </div>
          </div>

          {/* Optional Columns */}
          <div>
            <label className={labelStyle}>Optional Columns</label>
            <div className="space-y-1.5">
              {[
                { key: "includeCategory", label: "Category", desc: "Group units by type (Poles, Conductors, etc.)" },
                { key: "includeUOM", label: "Unit of Measure", desc: "Include if units vary (EA, LF, per 1000 ft). Defaults to EA if not included." },
                { key: "includeOldCode", label: "Old Unit Code", desc: "Map previous/legacy codes to current codes during contract transitions." },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={config[opt.key]}
                    onChange={() => setConfig(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                    className="accent-gray-900 rounded"
                  />
                  <div>
                    <span className={`text-sm ${config[opt.key] ? "text-gray-900 font-medium" : "text-gray-500"}`}>{opt.label}</span>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Functions */}
          <div>
            <label className={labelStyle}>Functions Priced</label>
            <div className="space-y-1.5">
              {config.functions.map(fn => {
                const isCustom = !DEFAULT_FUNCTION_IDS.has(fn.id);
                return (
                  <div key={fn.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <label className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={fn.checked}
                        onChange={() => toggleFunction(fn.id)}
                        className="accent-gray-900 rounded"
                      />
                      <span className={`text-sm ${fn.checked ? "text-gray-900 font-medium" : "text-gray-500"}`}>{fn.label}</span>
                    </label>
                    {isCustom && (
                      <button
                        onClick={() => removeCustomFunction(fn.id)}
                        title="Remove custom function"
                        style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#9CA3AF", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.background = "#FEF2F2"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.background = "none"; }}
                      >
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    )}
                  </div>
                );
              })}
              {showCustomFn ? (
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <input
                    type="text"
                    value={customFunction}
                    onChange={e => setCustomFunction(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomFunction()}
                    placeholder="Function name..."
                    className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                    autoFocus
                  />
                  <button onClick={addCustomFunction} className="text-xs font-medium text-gray-900 hover:text-gray-700">Add</button>
                  <button onClick={() => setShowCustomFn(false)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomFn(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add custom function
                </button>
              )}
            </div>
          </div>

          {/* Pricing Conditions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pricing Conditions</label>
              <div className="group relative">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 bg-gray-900 text-white text-xs rounded-lg p-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  If this utility prices the same unit differently based on conditions (like Hot vs. Cold, or voltage class), select them here. Most co-ops can skip this.
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-2">Optional — skip if one price per function</p>
            <div className="space-y-1.5">
              {COMMON_CONDITIONS.map(cond => {
                const isCustom = !DEFAULT_CONDITION_IDS.has(cond.id);
                return (
                  <div key={cond.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <label className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={config.conditions.includes(cond.id)}
                        onChange={() => toggleCondition(cond.id)}
                        className="accent-gray-900 rounded"
                      />
                      <span className={`text-sm ${config.conditions.includes(cond.id) ? "text-gray-900 font-medium" : "text-gray-500"}`}>{cond.label}</span>
                    </label>
                    {isCustom && (
                      <button
                        onClick={() => removeCustomCondition(cond.id)}
                        title="Remove custom condition"
                        style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#9CA3AF", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.background = "#FEF2F2"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.background = "none"; }}
                      >
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    )}
                  </div>
                );
              })}
              {showCustomCond ? (
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <input
                    type="text"
                    value={customCondition}
                    onChange={e => setCustomCondition(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomCondition()}
                    placeholder="Condition name..."
                    className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                    autoFocus
                  />
                  <button onClick={addCustomCondition} className="text-xs font-medium text-gray-900 hover:text-gray-700">Add</button>
                  <button onClick={() => setShowCustomCond(false)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomCond(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add custom condition
                </button>
              )}
            </div>
          </div>

          {/* Man-Hours Info Note */}
          {config.pricingModel === "manhours" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-medium text-blue-800">Man-hours selected</span>
                  <p className="text-xs text-blue-700 mt-0.5">This library will store man-hours per unit. Labor rates for converting to dollars are managed in the customer's Rate Sheet under their organization record.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview */}
      {selectedFunctions.length > 0 && (
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Template Preview</span>
            <span className="text-xs text-gray-400">— Your generated template will have these columns</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {previewColumns.map((col, i) => (
                    <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap border-b border-gray-200">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const optionalCols = (config.includeCategory ? 1 : 0) + (config.includeUOM ? 1 : 0) + (config.includeOldCode ? 1 : 0);
                  const priceCols = previewColumns.length - 2 - optionalCols;
                  return (
                    <>
                      <tr className="text-gray-400 italic">
                        <td className="px-3 py-2 text-xs border-b border-gray-100">ABC-100</td>
                        <td className="px-3 py-2 text-xs border-b border-gray-100">Crossarm 8ft Wood</td>
                        {Array.from({ length: priceCols }).map((_, i) => (
                          <td key={i} className="px-3 py-2 text-xs border-b border-gray-100 tabular-nums">
                            {config.pricingModel === "manhours" ? "2.50" : "$145.00"}
                          </td>
                        ))}
                        {config.includeCategory && <td className="px-3 py-2 text-xs border-b border-gray-100">Framing</td>}
                        {config.includeUOM && <td className="px-3 py-2 text-xs border-b border-gray-100">EA</td>}
                        {config.includeOldCode && <td className="px-3 py-2 text-xs border-b border-gray-100">OLD-100</td>}
                      </tr>
                      <tr className="text-gray-400 italic">
                        <td className="px-3 py-2 text-xs border-b border-gray-100">ABC-200</td>
                        <td className="px-3 py-2 text-xs border-b border-gray-100">45' Wood Pole Class 4</td>
                        {Array.from({ length: priceCols }).map((_, i) => (
                          <td key={i} className="px-3 py-2 text-xs border-b border-gray-100 tabular-nums">
                            {config.pricingModel === "manhours" ? "8.75" : "$1,847.00"}
                          </td>
                        ))}
                        {config.includeCategory && <td className="px-3 py-2 text-xs border-b border-gray-100">Poles</td>}
                        {config.includeUOM && <td className="px-3 py-2 text-xs border-b border-gray-100">EA</td>}
                        {config.includeOldCode && <td className="px-3 py-2 text-xs border-b border-gray-100">OLD-200</td>}
                      </tr>
                    </>
                  );
                })()}
                <tr className="text-gray-300">
                  <td colSpan={previewColumns.length} className="px-3 py-2 text-xs text-center">
                    ... your units here ...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {selectedFunctions.length} function{selectedFunctions.length !== 1 ? 's' : ''}
          {hasConditions ? ` × ${config.conditions.length} condition${config.conditions.length !== 1 ? 's' : ''} = ${selectedFunctions.length * config.conditions.length} price columns` : ''}
        </p>
        <button
          onClick={onNext}
          disabled={!config.customer || selectedFunctions.length === 0}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Generate Template
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// --- Step 2: Download Template ---
function DownloadTemplate({ config, onNext, onBack }) {
  const selectedFunctions = config.functions.filter(f => f.checked);
  const hasConditions = config.conditions.length > 0;
  const optCols = (config.includeCategory ? 1 : 0) + (config.includeUOM ? 1 : 0) + (config.includeOldCode ? 1 : 0);
  const colCount = 2 + (hasConditions ? selectedFunctions.length * config.conditions.length : selectedFunctions.length) + optCols;

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Your template is ready</h3>
        <p className="text-xs text-gray-500 mb-4">
          {config.customer} — {config.workType || "Unit Library"} — {colCount} columns
        </p>

        <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto mb-4">
          <Download className="w-4 h-4" />
          Download Template (.xlsx)
        </button>

        <div className="text-left bg-gray-50 rounded-lg p-3.5 space-y-2">
          <p className="text-xs font-medium text-gray-700">What to do next:</p>
          <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
            <li>Open the template in Excel</li>
            <li>Copy your unit codes, descriptions, and prices from the utility's file</li>
            <li>Paste into the matching columns — they should line up with what you're used to seeing</li>
            <li>Save and come back here to upload</li>
          </ol>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <span className="font-medium">Tip:</span> The template includes a sample row showing the expected format. Delete it before uploading.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Setup
        </button>
        <button
          onClick={onNext}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Filled Template
        </button>
      </div>
    </div>
  );
}

// --- Step 3: Upload & Preview ---
function UploadPreview({ config, onBack, onFinish }) {
  const [uploaded, setUploaded] = useState(false);
  const selectedFunctions = config.functions.filter(f => f.checked);
  const hasConditions = config.conditions.length > 0;

  const columns = ["CU Code", "Description"];
  if (hasConditions) {
    config.conditions.forEach(condId => {
      const condLabel = COMMON_CONDITIONS.find(c => c.id === condId)?.label?.split(" (")[0] || condId;
      selectedFunctions.forEach(fn => {
        columns.push(`${condLabel} ${fn.label}`);
      });
    });
  } else {
    selectedFunctions.forEach(fn => columns.push(fn.label));
  }
  if (config.includeCategory) columns.push("Category");
  if (config.includeUOM) columns.push("UOM");

  const sampleUnits = [
    { code: "A1.1", desc: "Primary, 1 Phase Single Support 0-5°", prices: [145.00, 178.50, 210.00, 87.00, 107.10, 126.00, 95.00, 117.15, 137.00], uom: "EA", status: "ok" },
    { code: "A1.2", desc: "Primary, 1 Phase Single Support 15-30°", prices: [152.00, 187.00, 220.00, 91.20, 112.20, 132.00, 99.00, 122.00, 143.50], uom: "EA", status: "ok" },
    { code: "A2.1", desc: "Primary, 3 Phase Support 0-5°", prices: [289.00, 356.00, 418.50, 173.40, 213.60, 251.10, 190.00, 234.10, 275.00], uom: "EA", status: "ok" },
    { code: "B1.1", desc: "Secondary, Triplex Neutral Supported 0-5°", prices: [98.00, 120.50, 141.75, 58.80, 72.30, 85.05, 64.00, 78.85, 92.75], uom: "EA", status: "ok" },
    { code: "", desc: "CONDUCTOR SECTION", prices: [0,0,0,0,0,0,0,0,0], uom: "", status: "warning" },
    { code: "C1.1", desc: "1/0 ACSR Conductor - per 1000'", prices: [320.00, 394.00, 463.20, 192.00, 236.40, 277.92, 210.00, 258.70, 304.20], uom: "per 1000 ft", status: "ok" },
    { code: "C1.2", desc: "4/0 ACSR Conductor - per 1000'", prices: [385.00, 474.00, 557.10, 231.00, 284.40, 334.26, 252.50, 311.00, 365.75], uom: "per 1000 ft", status: "ok" },
    { code: "D1.1", desc: "Single Phase Pad Transformer Install", prices: [425.00, 523.00, 615.25, 255.00, 313.80, 369.15, 278.00, 342.50, 402.75], uom: "EA", status: "ok" },
  ];

  const optCols = (config.includeCategory ? 1 : 0) + (config.includeUOM ? 1 : 0) + (config.includeOldCode ? 1 : 0);
  const priceColCount = columns.length - 2 - optCols;

  if (!uploaded) {
    return (
      <div>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => setUploaded(true)}
        >
          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">Drop your filled template here</p>
          <p className="text-xs text-gray-400">or click to browse — .xlsx files only</p>
        </div>
        <div className="mt-4 flex items-center justify-start">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">742 units parsed</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-medium text-amber-700">1 row flagged</span>
        </div>
        <span className="text-xs text-gray-400">Showing first 8 of 742</span>
      </div>

      {/* Preview table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap border-b border-gray-200 w-8"></th>
                {columns.map((col, i) => (
                  <th key={i} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap border-b border-gray-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleUnits.map((unit, ri) => (
                <tr key={ri} className={`${
                  unit.status === "warning" ? "bg-amber-50" : "hover:bg-gray-50"
                } transition-colors`}>
                  <td className="px-3 py-2 border-b border-gray-100">
                    {unit.status === "warning" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <input type="checkbox" defaultChecked className="accent-gray-900 rounded" />
                    )}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 font-medium text-gray-900 font-mono text-xs whitespace-nowrap">
                    {unit.code || <span className="text-amber-600 italic">Missing</span>}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-gray-700 max-w-[200px] truncate">
                    {unit.desc}
                  </td>
                  {unit.prices.slice(0, priceColCount).map((p, pi) => (
                    <td key={pi} className="px-3 py-2 border-b border-gray-100 text-gray-700 tabular-nums text-xs whitespace-nowrap">
                      {p > 0 ? (config.pricingModel === "manhours" ? p.toFixed(2) : `$${p.toFixed(2)}`) :
                       unit.status === "warning" ? <span className="text-amber-500">—</span> : "$0.00"}
                    </td>
                  ))}
                  {config.includeCategory && (
                    <td className="px-3 py-2 border-b border-gray-100 text-gray-500 text-xs">
                      {unit.code ? (unit.code.startsWith("A") || unit.code.startsWith("B") ? "Framing" : unit.code.startsWith("C") ? "Conductor" : "Equipment") : ""}
                    </td>
                  )}
                  {config.includeUOM && (
                    <td className="px-3 py-2 border-b border-gray-100 text-gray-500 text-xs">{unit.uom}</td>
                  )}
                  {config.includeOldCode && (
                    <td className="px-3 py-2 border-b border-gray-100 text-gray-400 text-xs font-mono">
                      {unit.code ? `OLD-${unit.code}` : ""}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning callout */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-medium text-amber-800">1 row looks like a section header, not a unit</p>
          <p className="text-xs text-amber-700 mt-0.5">Row 5: "CONDUCTOR SECTION" — no unit code or prices. Uncheck to exclude, or leave to import as-is.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={onFinish}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm & Create Library
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Setup View Wrapper ---
function CULibrarySetup({ onBackToList }) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    customer: "Entergy",
    libraryName: "Entergy 2026 OH Distribution",
    workType: "OH Distribution",
    pricingModel: "manhours",
    effectiveDate: "2026-01-01",
    expirationDate: "2028-12-31",
    escalation: "none",
    escalationPct: "",
    functions: [...DEFAULT_FUNCTIONS].map(f => ({ ...f, checked: f.id === "install" || f.id === "remove" || f.id === "transfer" })),
    conditions: ["hot", "cold"],
    includeUOM: false,
    includeCategory: false,
    includeOldCode: false,
  });

  const steps = ["Library Setup", "Download Template", "Upload & Preview"];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">New CU Library</h1>
          <p className="text-sm text-gray-500 mt-1">Set up your library details and we'll generate a custom template for your data.</p>
        </div>
        <button
          onClick={onBackToList}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", fontSize: 13, fontWeight: 500,
            color: "#374151", background: "#fff",
            border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.background = "#F9FAFB"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#fff"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Libraries
        </button>
      </div>

      <StepIndicator currentStep={step} steps={steps} />

      {step === 0 && (
        <LibrarySetupForm
          config={config}
          setConfig={setConfig}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <DownloadTemplate
          config={config}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <UploadPreview
          config={config}
          onBack={() => setStep(1)}
          onFinish={onBackToList}
        />
      )}
    </>
  );
}

// ============================================================
// MAIN MODULE — View Router
// ============================================================
export default function CULibraryModule() {
  const [view, setView] = useState("list"); // "list" | "setup"

  // Breadcrumb based on current view
  const breadcrumb = view === "list" ? (
    <span style={{ color: "#111827", fontWeight: 500 }}>CU Libraries</span>
  ) : (
    <>
      <span
        onClick={() => setView("list")}
        style={{ color: "#6B7280", fontWeight: 500, cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.color = "#111827"}
        onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
      >
        CU Libraries
      </span>
      <span style={{ color: "#D1D5DB" }}>›</span>
      <span style={{ color: "#111827", fontWeight: 500 }}>New Library</span>
    </>
  );

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
        {breadcrumb}
      </div>

      {/* Page content */}
      <div style={{ maxWidth: view === "setup" ? 900 : 1120, margin: "0 auto", padding: "24px 24px 48px" }}>
        {view === "list" && (
          <CULibraryList onNewLibrary={() => setView("setup")} />
        )}
        {view === "setup" && (
          <CULibrarySetup onBackToList={() => setView("list")} />
        )}
      </div>
    </div>
  );
}
