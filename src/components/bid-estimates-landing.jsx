import { useState, useMemo, useEffect, useRef } from "react";

// ============================================================
// BID ESTIMATES — LANDING PAGE
// The main list view when a user clicks "Bid Estimates" in the nav.
// Shows all saved bid estimates with filters, status tracking,
// and a "+ New Estimate" action to create from a template.
// ============================================================

// --- Sample Data ---
const BIDS = [
  {
    id: "BID-2026-019",
    name: "KU Distribution Overhead — Spring 2026",
    templateType: "T&E",
    customer: "Kentucky Utilities",
    status: "Draft",
    totalRevenue: 487200,
    netMargin: 18.4,
    crews: 3,
    duration: "8 weeks",
    createdBy: "Ben Glatt",
    createdAt: "2026-02-28",
    updatedAt: "2026-03-01",
  },
  {
    id: "BID-2026-018",
    name: "AEP Transmission Line Rebuild — Segment 4",
    templateType: "T&E",
    customer: "AEP (American Electric Power)",
    status: "Submitted",
    totalRevenue: 1245000,
    netMargin: 22.1,
    crews: 6,
    duration: "14 weeks",
    createdBy: "Ben Glatt",
    createdAt: "2026-02-20",
    updatedAt: "2026-02-25",
  },
  {
    id: "BID-2026-017",
    name: "Duke Energy Veg Mgmt — Q2 Cycle",
    templateType: "T&E",
    customer: "Duke Energy",
    status: "Won",
    totalRevenue: 312400,
    netMargin: 15.7,
    crews: 4,
    duration: "6 weeks",
    createdBy: "Ben Glatt",
    createdAt: "2026-02-14",
    updatedAt: "2026-02-22",
  },
  {
    id: "BID-2026-016",
    name: "CenterPoint Storm Standby Rate Sheet",
    templateType: "T&E",
    customer: "CenterPoint Energy",
    status: "Won",
    totalRevenue: 0,
    netMargin: 24.3,
    crews: null,
    duration: "Ongoing",
    createdBy: "Ben Glatt",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-10",
  },
  {
    id: "BID-2026-015",
    name: "PPL Underground — Phase 2 Duct Bank",
    templateType: "T&E",
    customer: "PPL",
    status: "Lost",
    totalRevenue: 890000,
    netMargin: 12.1,
    crews: 5,
    duration: "20 weeks",
    createdBy: "Ben Glatt",
    createdAt: "2026-02-05",
    updatedAt: "2026-02-18",
  },
  {
    id: "BID-2026-014",
    name: "Eversource Distribution — Emergency Rates",
    templateType: "T&E",
    customer: "Eversource",
    status: "Submitted",
    totalRevenue: 0,
    netMargin: 26.8,
    crews: null,
    duration: "Ongoing",
    createdBy: "Ben Glatt",
    createdAt: "2026-01-28",
    updatedAt: "2026-02-15",
  },
  {
    id: "BID-2026-013",
    name: "TECO Vegetation — Annual Contract Renewal",
    templateType: "T&E",
    customer: "TECO",
    status: "Draft",
    totalRevenue: 224800,
    netMargin: 16.9,
    crews: 2,
    duration: "52 weeks",
    createdBy: "Ben Glatt",
    createdAt: "2026-01-22",
    updatedAt: "2026-02-28",
  },
  {
    id: "BID-2025-042",
    name: "Georgia Power Storm Response — Rate Update",
    templateType: "T&E",
    customer: "Georgia Power",
    status: "Archived",
    totalRevenue: 0,
    netMargin: 21.5,
    crews: null,
    duration: "Ongoing",
    createdBy: "Ben Glatt",
    createdAt: "2025-12-15",
    updatedAt: "2026-01-10",
  },
  {
    id: "BID-2025-041",
    name: "Alabama Power Distribution Maintenance",
    templateType: "T&E",
    customer: "Alabama Power",
    status: "Archived",
    totalRevenue: 178500,
    netMargin: 14.2,
    crews: 2,
    duration: "10 weeks",
    createdBy: "Ben Glatt",
    createdAt: "2025-12-08",
    updatedAt: "2025-12-20",
  },
];

// --- Components ---

function NewEstimateButton({ onClick }) {
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
      New Estimate
    </button>
  );
}

function NewEstimateModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  const templates = [
    { type: "T&E", label: "T&E Bid Sheet", desc: "Hourly labor + daily equipment rates with full P&L projection", disabled: false },
    { type: "Lump Sum", label: "Lump Sum Estimate", desc: "Fixed-price project bid with milestone billing", disabled: true },
    { type: "Unit Price", label: "Unit Price Bid", desc: "Per-CU unit pricing from your CU library", disabled: true },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 12, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>New Estimate</h2>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0 0" }}>Choose a template to get started</p>
        </div>

        {/* Template options */}
        <div style={{ padding: "8px" }}>
          {templates.map(item => (
            <button
              key={item.type}
              onClick={() => !item.disabled && onSelect(item.type)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", textAlign: "left",
                padding: "12px 14px", border: "none", borderRadius: 8,
                cursor: item.disabled ? "default" : "pointer",
                background: "transparent",
              }}
              onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ opacity: item.disabled ? 0.4 : 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{item.desc}</div>
              </div>
              {item.disabled ? (
                <span style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", background: "#F3F4F6", padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0, marginLeft: 12 }}>Soon</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginLeft: 12 }}>
                  <path d="M6 4l4 4-4 4" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
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
          placeholder="Search estimates..."
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

function RowActionsMenu({ bid, isOpen, onToggle, onClose }) {
  const actions = [
    { label: "Open", icon: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7zm10 3a3 3 0 100-6 3 3 0 000 6z", action: "open" },
    { label: "Duplicate", icon: "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2v-2M4 16V4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2z", action: "duplicate" },
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{ border: "none", cursor: "pointer", color: isOpen ? "#374151" : "#9CA3AF", padding: 4, borderRadius: 4, background: isOpen ? "#F3F4F6" : "none" }}
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
          {actions.map((item, i) =>
            item.type === "divider" ? (
              <div key={`div-${i}`} style={{ height: 1, background: "#F3F4F6", margin: "4px 0" }} />
            ) : (
              <button
                key={item.action}
                onClick={e => { e.stopPropagation(); onClose(); alert(`${item.label}: ${bid.name}`); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "8px 10px", border: "none", borderRadius: 6,
                  fontSize: 13, color: item.danger ? "#DC2626" : "#374151",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = item.danger ? "#FEF2F2" : "#F9FAFB"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                  <path d={item.icon} />
                </svg>
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function BidTable({ bids, sortField, sortDir, onSort }) {
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
            <SortHeader field="name">Estimate</SortHeader>
            <SortHeader field="customer">Customer</SortHeader>
            <SortHeader field="updatedAt">Updated</SortHeader>
            <th style={{ padding: "10px 16px", width: 48, background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }} />
          </tr>
        </thead>
        <tbody>
          {bids.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: "60px 16px", textAlign: "center" }}>
                <div style={{ color: "#9CA3AF", fontSize: 14 }}>No estimates match your filters</div>
                <div style={{ color: "#D1D5DB", fontSize: 12, marginTop: 4 }}>Try adjusting your search or filters</div>
              </td>
            </tr>
          ) : (
            bids.map((bid, i) => {
              return (
                <tr
                  key={bid.id}
                  style={{
                    borderBottom: i < bids.length - 1 ? "1px solid #F3F4F6" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Name + ID */}
                  <td style={{ padding: "12px 16px", maxWidth: 320 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 2, lineHeight: 1.3 }}>
                      {bid.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{bid.id}</div>
                  </td>

                  {/* Customer */}
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>
                    {bid.customer}
                  </td>

                  {/* Updated */}
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
                    {new Date(bid.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 8px", textAlign: "center" }}>
                    <RowActionsMenu
                      bid={bid}
                      isOpen={openMenuId === bid.id}
                      onToggle={() => setOpenMenuId(openMenuId === bid.id ? null : bid.id)}
                      onClose={() => setOpenMenuId(null)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Footer */}
      {bids.length > 0 && (
        <div style={{ padding: "10px 16px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
            {bids.length} estimate{bids.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
export default function BidEstimatesLanding() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [showNewModal, setShowNewModal] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredBids = useMemo(() => {
    let result = [...BIDS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }

    // Sort
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
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <NewEstimateModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSelect={(type) => { setShowNewModal(false); alert(`Opening ${type} template...`); }}
      />
      {/* App shell header */}
      <div style={{ borderBottom: "1px solid #E5E7EB", padding: "10px 24px", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#111827", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>G</span>
          </div>
          <span style={{ fontWeight: 600, color: "#111827" }}>Gridbase</span>
        </div>
        <span style={{ color: "#D1D5DB" }}>›</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>Bid Estimates</span>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>Bid Estimates</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Build and manage project bid estimates</p>
          </div>
          <NewEstimateButton onClick={() => setShowNewModal(true)} />
        </div>

        {/* Search */}
        <SearchBar
          search={search}
          onSearchChange={setSearch}
        />

        {/* Table */}
        <BidTable
          bids={filteredBids}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}
