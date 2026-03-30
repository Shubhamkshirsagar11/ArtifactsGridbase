import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronRight, ChevronDown, Zap, ClipboardList, Ticket, Phone, FolderKanban, BookOpen, Building2, Landmark, Truck, Users, Calculator, FileSpreadsheet, Settings, UserCog, Plug, Search, Plus, Check, MoreHorizontal } from "lucide-react";

// ============================================================
// PROJECTS MODULE — Landing Page + New Project Wizard
// With updated sidebar from GridbaseSidebar prototype
// ============================================================

// ─── TypeScript Interfaces ──────────────────────────────────

interface Project {
  id: string;
  name: string;
  customer: string;
  contractType: string;
  status: string;
  startDate: string;
}

interface CompatibleUnit {
  id: string;
  code: string;
  description: string;
  qty: number;
  unitPrice: number;
  status: string;
  dateEntered: string;
}

interface WorkOrder {
  id: string;
  description: string;
  status: string;
  units: number;
  earnedHours: number;
  assignedTo: string;
  dateCreated: string;
}

interface CULibraryItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  laborHrs: number;
  materialCost: number;
  allInPrice: number;
}

interface StagedUnit extends CULibraryItem {
  qty: number;
}

interface OrgNode {
  id: string;
  name: string;
  location: string;
  children?: OrgNode[];
}

interface NavChild {
  id: string;
  label: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavChild[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface StatusConfig {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
}

interface CULibrary {
  id: string;
  name: string;
  units: number;
  type: string;
}

// --- Sample Projects ---
const PROJECTS_DATA: Project[] = [
  { id: "PRJ-2026-028", name: "CHELCO OH Distribution — 2026 Unit Contract", customer: "CHELCO", contractType: "Unit-Price", status: "Active", startDate: "2026-01-01" },
  { id: "PRJ-2026-027", name: "Georgia Power OH Distribution — Dash/Dot", customer: "Georgia Power", contractType: "Unit-Price", status: "Active", startDate: "2026-01-01" },
  { id: "PRJ-2026-026", name: "Entergy OH Distribution — Master Unit Agreement", customer: "Entergy", contractType: "Unit-Price", status: "Active", startDate: "2026-01-01" },
  { id: "PRJ-2026-032", name: "Wiregrass Electric — 2026 Renewal", customer: "Wiregrass", contractType: "Unit-Price", status: "Active", startDate: "2026-03-01" },
  { id: "PRJ-2026-033", name: "WST-Charter Fiber Make-Ready — Phase 2", customer: "WST-Charter", contractType: "Unit-Price", status: "Active", startDate: "2026-04-15" },
];

// --- Sample Work Orders (keyed by project ID) ---
const WORK_ORDERS: { [key: string]: WorkOrder[] } = {
  "PRJ-2026-028": [
    { id: "WO-4201", description: "Install 3-phase OH primary — Maple St", status: "Complete", units: 14, earnedHours: 86, assignedTo: "Crew A — Abbott", dateCreated: "2026-01-15" },
    { id: "WO-4202", description: "Replace deteriorated poles — Pine Ridge Rd", status: "In Progress", units: 8, earnedHours: 42, assignedTo: "Crew B — Eichberger", dateCreated: "2026-02-03" },
    { id: "WO-4203", description: "Reconductor 1-phase tap — CR 55", status: "In Progress", units: 5, earnedHours: 18, assignedTo: "Crew A — Abbott", dateCreated: "2026-02-20" },
    { id: "WO-4204", description: "New service drops — Lakewood Subdivision", status: "Open", units: 22, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-03-10" },
    { id: "WO-4205", description: "Transformer changeout — Industrial Park", status: "Open", units: 3, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-03-18" },
  ],
  "PRJ-2026-027": [
    { id: "WO-3301", description: "OH primary extension — Peachtree Industrial", status: "In Progress", units: 19, earnedHours: 104, assignedTo: "Crew C — Martinez", dateCreated: "2026-01-10" },
    { id: "WO-3302", description: "Pole replacements — Hwy 78 corridor", status: "In Progress", units: 12, earnedHours: 55, assignedTo: "Crew D — Hornback", dateCreated: "2026-01-22" },
    { id: "WO-3303", description: "URD to OH conversion — Brookhaven", status: "Open", units: 7, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-03-01" },
  ],
  "PRJ-2026-026": [
    { id: "WO-5501", description: "Distribution rebuild — Baton Rouge East", status: "In Progress", units: 31, earnedHours: 220, assignedTo: "Crew E — Johnson", dateCreated: "2026-01-05" },
    { id: "WO-5502", description: "New OH primary — Gonzales service area", status: "In Progress", units: 16, earnedHours: 78, assignedTo: "Crew F — Wilson", dateCreated: "2026-02-01" },
    { id: "WO-5503", description: "Storm hardening — Denham Springs", status: "Open", units: 24, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-03-15" },
    { id: "WO-5504", description: "Reconductor — Walker feeder", status: "Open", units: 9, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-03-20" },
  ],
  "PRJ-2026-032": [
    { id: "WO-6001", description: "OH primary rebuild — Section 12", status: "Open", units: 11, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-03-05" },
  ],
  "PRJ-2026-033": [
    { id: "WO-7001", description: "Make-ready — Pole attachments Phase 2A", status: "Open", units: 18, earnedHours: 0, assignedTo: "Unassigned", dateCreated: "2026-04-15" },
  ],
};

const WO_STATUS_CONFIG: StatusConfig = {
  Open: { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" },
  "In Progress": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  Complete: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
};

// --- Wizard reference data ---
const CUSTOMERS: string[] = [
  "Kentucky Utilities", "AEP (American Electric Power)", "Duke Energy",
  "CHELCO", "Georgia Power", "Entergy", "PPL", "CenterPoint Energy",
  "Eversource", "Alabama Power", "TECO", "WST-Charter", "Wiregrass",
];

const CU_LIBRARIES: CULibrary[] = [
  { id: "lib-1", name: "CHELCO OH Distribution 2026", units: 312, type: "Overhead" },
  { id: "lib-2", name: "Georgia Power OH — Dash/Dot", units: 949, type: "Overhead" },
  { id: "lib-3", name: "Entergy Distribution Master", units: 8007, type: "Overhead" },
  { id: "lib-4", name: "CTEC Underground Residential", units: 79, type: "Underground" },
  { id: "lib-5", name: "WST-Charter Electric + Fiber", units: 142, type: "Mixed" },
  { id: "lib-6", name: "Wiregrass Electric — 2026 Escalated", units: 487, type: "Overhead" },
];

// --- Sample Compatible Units per Work Order ---
const WO_UNITS: { [key: string]: CompatibleUnit[] } = {
  "WO-4201": [
    { id: "CU-101", code: "OH-3P-PRI-01", description: "Install 3-phase primary conductor (per span)", qty: 6, unitPrice: 1420.00, status: "Complete", dateEntered: "2026-01-18" },
    { id: "CU-102", code: "OH-POLE-45-2", description: "Set 45ft Class 2 wood pole", qty: 4, unitPrice: 2180.00, status: "Complete", dateEntered: "2026-01-18" },
    { id: "CU-103", code: "OH-XARM-3P", description: "Install 3-phase crossarm assembly", qty: 4, unitPrice: 685.00, status: "Complete", dateEntered: "2026-01-20" },
  ],
  "WO-4202": [
    { id: "CU-201", code: "OH-POLE-REM", description: "Remove deteriorated pole", qty: 3, unitPrice: 890.00, status: "Complete", dateEntered: "2026-02-05" },
    { id: "CU-202", code: "OH-POLE-45-2", description: "Set 45ft Class 2 wood pole", qty: 3, unitPrice: 2180.00, status: "Complete", dateEntered: "2026-02-05" },
    { id: "CU-203", code: "OH-XFER-CON", description: "Transfer conductor & equipment to new pole", qty: 2, unitPrice: 1560.00, status: "Complete", dateEntered: "2026-02-10" },
  ],
  "WO-4203": [
    { id: "CU-301", code: "OH-1P-REC-01", description: "Reconductor 1-phase primary (per span)", qty: 3, unitPrice: 980.00, status: "Complete", dateEntered: "2026-02-22" },
    { id: "CU-302", code: "OH-TAP-1P", description: "Install 1-phase tap connection", qty: 2, unitPrice: 1240.00, status: "Complete", dateEntered: "2026-02-24" },
  ],
  "WO-4204": [
    { id: "CU-401", code: "OH-SVC-DROP", description: "Install overhead service drop", qty: 12, unitPrice: 425.00, status: "Complete", dateEntered: "2026-03-12" },
    { id: "CU-402", code: "OH-METER-BS", description: "Set meter base & socket", qty: 10, unitPrice: 310.00, status: "Complete", dateEntered: "2026-03-12" },
  ],
  "WO-4205": [
    { id: "CU-501", code: "OH-XFMR-REM", description: "Remove existing transformer", qty: 1, unitPrice: 780.00, status: "Complete", dateEntered: "2026-03-19" },
    { id: "CU-502", code: "OH-XFMR-50", description: "Install 50kVA transformer", qty: 1, unitPrice: 3450.00, status: "Complete", dateEntered: "2026-03-19" },
    { id: "CU-503", code: "OH-XFMR-CON", description: "Connect transformer to primary & secondary", qty: 1, unitPrice: 1120.00, status: "Complete", dateEntered: "2026-03-20" },
  ],
  "WO-3301": [
    { id: "CU-601", code: "OH-3P-PRI-01", description: "Install 3-phase primary conductor (per span)", qty: 8, unitPrice: 1420.00, status: "Complete", dateEntered: "2026-01-12" },
    { id: "CU-602", code: "OH-POLE-50-1", description: "Set 50ft Class 1 wood pole", qty: 6, unitPrice: 2650.00, status: "Complete", dateEntered: "2026-01-14" },
    { id: "CU-603", code: "OH-GUY-DH", description: "Install down-guy with anchor", qty: 5, unitPrice: 580.00, status: "Complete", dateEntered: "2026-01-15" },
  ],
  "WO-3302": [
    { id: "CU-701", code: "OH-POLE-REM", description: "Remove deteriorated pole", qty: 6, unitPrice: 890.00, status: "Complete", dateEntered: "2026-01-24" },
    { id: "CU-702", code: "OH-POLE-45-2", description: "Set 45ft Class 2 wood pole", qty: 6, unitPrice: 2180.00, status: "Complete", dateEntered: "2026-01-26" },
  ],
};

// --- Organization Tree (from GridbaseSidebar) ---
const ORG_TREE: OrgNode = {
  id: "powergrid",
  name: "PowerGrid Services",
  location: "Hartselle, AL",
  children: [
    {
      id: "pg-distribution",
      name: "PowerGrid Distribution",
      location: "Hartselle, AL",
      children: [
        { id: "electralines", name: "ElectraLines", location: "Birmingham, AL" },
        { id: "gridtech", name: "GridTech", location: "Garner, NC" },
        { id: "james-plc", name: "James Power Line Construction", location: "Boerne, TX" },
      ],
    },
    {
      id: "pg-transmission",
      name: "PowerGrid Transmission",
      location: "Hartselle, AL",
      children: [
        { id: "apex-transmission", name: "Apex Transmission", location: "Nashville, TN" },
        { id: "southern-line", name: "Southern Line Services", location: "Atlanta, GA" },
      ],
    },
    {
      id: "pg-vegetation",
      name: "PowerGrid Vegetation",
      location: "Hartselle, AL",
      children: [
        { id: "clearpath", name: "ClearPath Tree Services", location: "Charlotte, NC" },
        { id: "greenline", name: "GreenLine Vegetation", location: "Raleigh, NC" },
      ],
    },
    {
      id: "premium-uc",
      name: "Premium Utility Contractor",
      location: "Boca Raton, FL",
      children: [
        { id: "coastal-electric", name: "Coastal Electric Works", location: "Tampa, FL" },
        { id: "sunbelt-power", name: "Sunbelt Power Services", location: "Orlando, FL" },
      ],
    },
  ],
};

// --- CU Library (for Add CU modal) ---
const CU_LIBRARY: CULibraryItem[] = [
  { id: "CU-L01", code: "OH-101", description: "Install 45' Class 3 Wood Pole", unit: "EA", laborHrs: 4.5, materialCost: 285, allInPrice: 1420 },
  { id: "CU-L02", code: "OH-102", description: "Install 50' Class 2 Wood Pole", unit: "EA", laborHrs: 5.0, materialCost: 340, allInPrice: 1650 },
  { id: "CU-L03", code: "OH-103", description: "Install 55' Class 1 Wood Pole", unit: "EA", laborHrs: 5.5, materialCost: 410, allInPrice: 1890 },
  { id: "CU-L04", code: "OH-110", description: "Remove Existing Wood Pole", unit: "EA", laborHrs: 2.5, materialCost: 0, allInPrice: 580 },
  { id: "CU-L05", code: "OH-201", description: "Install 8' Crossarm Assembly (Single)", unit: "EA", laborHrs: 1.5, materialCost: 145, allInPrice: 520 },
  { id: "CU-L06", code: "OH-202", description: "Install 10' Crossarm Assembly (Double)", unit: "EA", laborHrs: 2.0, materialCost: 210, allInPrice: 680 },
  { id: "CU-L07", code: "OH-301", description: "String 1/0 ACSR Primary (per 100ft)", unit: "100FT", laborHrs: 1.8, materialCost: 95, allInPrice: 440 },
  { id: "CU-L08", code: "OH-302", description: "String 4/0 ACSR Primary (per 100ft)", unit: "100FT", laborHrs: 2.0, materialCost: 125, allInPrice: 510 },
  { id: "CU-L09", code: "OH-401", description: "Install 25kVA Transformer", unit: "EA", laborHrs: 3.0, materialCost: 680, allInPrice: 1380 },
  { id: "CU-L10", code: "OH-402", description: "Install 50kVA Transformer", unit: "EA", laborHrs: 3.5, materialCost: 920, allInPrice: 1720 },
  { id: "CU-L11", code: "OH-501", description: "Install Service Drop (0-100ft)", unit: "EA", laborHrs: 1.5, materialCost: 85, allInPrice: 390 },
  { id: "CU-L12", code: "OH-502", description: "Install Service Drop (100-200ft)", unit: "EA", laborHrs: 2.0, materialCost: 140, allInPrice: 510 },
  { id: "CU-L13", code: "OH-601", description: "Install Guy Wire + Anchor", unit: "EA", laborHrs: 2.0, materialCost: 175, allInPrice: 590 },
  { id: "CU-L14", code: "OH-701", description: "Install Cutout + Lightning Arrester", unit: "EA", laborHrs: 1.0, materialCost: 120, allInPrice: 340 },
  { id: "CU-L15", code: "OH-801", description: "Transfer Existing Facilities (per pole)", unit: "EA", laborHrs: 3.0, materialCost: 0, allInPrice: 690 },
  { id: "CU-L16", code: "OH-901", description: "Install Meter Can + Socket", unit: "EA", laborHrs: 1.5, materialCost: 110, allInPrice: 420 },
];

function fmtCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
}

// --- Add Compatible Units Modal ---
interface AddCUModalProps {
  onClose: () => void;
  onAdd: (units: CompatibleUnit[]) => void;
  existingUnits?: CompatibleUnit[];
}

function AddCUModal({ onClose, onAdd, existingUnits }: AddCUModalProps) {
  const [search, setSearch] = useState<string>("");
  const [staged, setStaged] = useState<StagedUnit[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (searchRef.current) searchRef.current.focus(); }, []);

  const existingCodes = new Set((existingUnits || []).map(u => u.code));

  const filtered = CU_LIBRARY.filter(cu => {
    const q = search.toLowerCase();
    return cu.code.toLowerCase().includes(q) || cu.description.toLowerCase().includes(q);
  });

  const stagedIds = new Set(staged.map(s => s.id));

  const addToStaged = (cu: CULibraryItem): void => {
    if (stagedIds.has(cu.id)) return;
    setStaged([...staged, { ...cu, qty: 1 }]);
  };

  const removeFromStaged = (id: string): void => {
    setStaged(staged.filter(s => s.id !== id));
  };

  const updateStagedQty = (id: string, qty: string): void => {
    setStaged(staged.map(s => s.id === id ? { ...s, qty: Math.max(1, parseInt(qty) || 1) } : s));
  };

  const totalValue = staged.reduce((sum, s) => sum + s.qty * s.allInPrice, 0);

  const handleAdd = (): void => {
    if (!staged.length) return;
    const units = staged.map(s => ({
      id: s.id,
      code: s.code,
      description: s.description,
      qty: s.qty,
      unitPrice: s.allInPrice,
      status: "Complete",
      dateEntered: new Date().toISOString().slice(0, 10),
    }));
    onAdd(units);
    onClose();
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    background: "#fff", borderRadius: 12, width: 720, maxHeight: "85vh",
    display: "flex", flexDirection: "column",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.12)",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Add Compatible Units</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Browse the CU library and stage units to add</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 20, lineHeight: 1, padding: 4 }}>&times;</button>
          </div>

          {/* Search */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
            <Search size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            <input ref={searchRef} type="text" placeholder="Search by code or description..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#111827" }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 14 }}>&times;</button>
            )}
          </div>
        </div>

        {/* CU Library List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          <div style={{ padding: "8px 24px 4px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            CU Library ({filtered.length} units)
          </div>
          {filtered.map(cu => {
            const isStaged = stagedIds.has(cu.id);
            const onWO = existingCodes.has(cu.code);
            return (
              <div key={cu.id}
                onClick={() => !isStaged && addToStaged(cu)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 24px",
                  cursor: isStaged ? "default" : "pointer", borderBottom: "1px solid #F3F4F6",
                  background: isStaged ? "#F0FDF4" : "transparent",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (!isStaged) (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB"; }}
                onMouseLeave={e => { if (!isStaged) (e.currentTarget as HTMLDivElement).style.background = "transparent"; else (e.currentTarget as HTMLDivElement).style.background = "#F0FDF4"; }}>
                {/* Plus icon or check */}
                <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                  background: isStaged ? "#059669" : "#F3F4F6", color: isStaged ? "#fff" : "#9CA3AF", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                  {isStaged ? <Check size={14} /> : <Plus size={14} />}
                </div>
                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#2563EB" }}>{cu.code}</span>
                    <span style={{ fontSize: 13, color: "#111827" }}>{cu.description}</span>
                    {onWO && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#DBEAFE", color: "#1D4ED8" }}>ON WO</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                    {cu.unit} &middot; {cu.laborHrs}h labor &middot; {fmtCurrency(cu.materialCost)} material
                  </div>
                </div>
                {/* Price */}
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", flexShrink: 0 }}>
                  {fmtCurrency(cu.allInPrice)}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: "32px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
              No units match "{search}"
            </div>
          )}
        </div>

        {/* Staged Section */}
        {staged.length > 0 && (
          <div style={{ borderTop: "2px solid #111827" }}>
            <div style={{ padding: "12px 24px 8px", fontSize: 11, fontWeight: 600, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Staged ({staged.length})
            </div>
            <div style={{ maxHeight: 180, overflowY: "auto" }}>
              {staged.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 24px", borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#2563EB" }}>{s.code}</span>
                    <span style={{ fontSize: 13, color: "#111827", marginLeft: 8 }}>{s.description}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: 11, color: "#6B7280" }}>Qty</label>
                    <input type="number" value={s.qty} min={1}
                      onChange={e => updateStagedQty(s.id, e.target.value)}
                      style={{ width: 56, padding: "4px 8px", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6, outline: "none", textAlign: "center" }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", width: 60, textAlign: "right" }}>
                      {fmtCurrency(s.qty * s.allInPrice)}
                    </div>
                    <button onClick={() => removeFromStaged(s.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", fontSize: 16, padding: "0 4px", lineHeight: 1 }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"}>
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFAFA", borderRadius: "0 0 12px 12px" }}>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            {staged.length > 0 ? (
              <span><strong style={{ color: "#111827" }}>{staged.length}</strong> unit{staged.length !== 1 ? "s" : ""} staged &middot; <strong style={{ color: "#111827" }}>{fmtCurrency(totalValue)}</strong> total</span>
            ) : (
              "Click a unit above to stage it"
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose}
              style={{ padding: "8px 16px", background: "#fff", color: "#6B7280", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleAdd}
              disabled={staged.length === 0}
              style={{
                padding: "8px 16px", background: staged.length > 0 ? "#111827" : "#E5E7EB",
                color: staged.length > 0 ? "#fff" : "#9CA3AF",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: staged.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}>
              Add {staged.length || ""} Unit{staged.length !== 1 ? "s" : ""} to WO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Config constants ---
const STATUS_CONFIG: StatusConfig = {
  Active: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  Complete: { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  Archived: { bg: "#F9FAFB", text: "#9CA3AF", border: "#E5E7EB" },
};

const CONTRACT_TYPE_CONFIG: StatusConfig = {
  "T&E": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Unit-Price": { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
  "Lump Sum": { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
};

// --- Navigation sections (updated from GridbaseSidebar) ---
const NAV_SECTIONS: NavSection[] = [
  {
    label: "Storm",
    items: [
      { id: "events", label: "Events", icon: Zap },
      { id: "roster-verification", label: "Roster Verification", icon: ClipboardList },
      { id: "tickets", label: "Tickets", icon: Ticket },
      { id: "callout", label: "Callout", icon: Phone },
    ],
  },
  {
    label: "Bluesky",
    items: [
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "units-library", label: "Units Library", icon: BookOpen },
    ],
  },
  {
    label: "Data",
    items: [
      { id: "unions", label: "Unions", icon: Landmark, children: [{ id: "agreements", label: "Agreements" }, { id: "jurisdictional-map", label: "Jurisdictional Map" }] },
      { id: "organizations", label: "Organizations", icon: Building2, children: [{ id: "utilities", label: "Utilities" }, { id: "contractors", label: "Contractors" }, { id: "brokers", label: "Brokers" }] },
      { id: "equipment", label: "Equipment", icon: Truck, children: [{ id: "fleet", label: "Fleet" }, { id: "fuel-cost", label: "Fuel Cost" }, { id: "toll-charges", label: "Toll Charges" }] },
      { id: "personnel", label: "Personnel", icon: Users },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "calculators", label: "Calculators", icon: Calculator },
      { id: "bid-estimates", label: "Bid Estimates", icon: FileSpreadsheet },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "account", label: "Account", icon: Settings },
      { id: "users", label: "Users", icon: UserCog },
      { id: "integrations", label: "Integrations", icon: Plug },
    ],
  },
];

// ─── Org Switcher Helpers ───────────────────────────────────

function getGroupIds(sub: OrgNode): string[] {
  const ids = [sub.id];
  if (sub.children) sub.children.forEach(gc => ids.push(gc.id));
  return ids;
}

interface OrgRowProps {
  selected: boolean;
  onChange: () => void;
  label: string;
  sublabel?: string;
  indent?: number;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function OrgRow({ selected, onChange, label, sublabel, indent = 0, hovered, onHover, onLeave }: OrgRowProps) {
  return (
    <button
      onClick={onChange}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="w-full flex items-center justify-between text-sm text-left transition-colors"
      style={{
        borderRadius: "8px",
        paddingLeft: `${10 + indent * 14}px`,
        paddingRight: "10px",
        paddingTop: "7px",
        paddingBottom: "7px",
        color: selected ? "#111827" : (indent ? "#4D4D4D" : "#293037"),
        fontWeight: selected ? 500 : (indent ? 400 : 500),
        background: selected ? "#F3F4F6" : (hovered ? "#F9FAFB" : "transparent"),
      }}
    >
      <span className="flex items-center gap-2 truncate min-w-0">
        <span className="truncate">{label}</span>
        {sublabel && (
          <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>{sublabel}</span>
        )}
      </span>
      {selected && (
        <Check size={15} style={{ color: "#111827", flexShrink: 0, marginLeft: 8 }} />
      )}
    </button>
  );
}

interface OrgSwitcherProps {
  selectedOrg: string;
  onSelectOrg: (id: string) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

function OrgSwitcher({ selectedOrg, onSelectOrg, isOpen, onToggle }: OrgSwitcherProps) {
  const [search, setSearch] = useState<string>("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchRef.current) searchRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle(false);
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isOpen) {
      const toExpand: string[] = [];
      for (const sub of ORG_TREE.children || []) {
        const groupIds = getGroupIds(sub);
        const entityId = `${sub.id}-entity`;
        if ((groupIds.includes(selectedOrg) || selectedOrg === entityId) && !expandedGroups.includes(sub.id)) {
          toExpand.push(sub.id);
        }
      }
      if (toExpand.length) setExpandedGroups(prev => [...prev, ...toExpand]);
    }
  }, [isOpen]);

  const toggleGroup = (groupId: string): void => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const selectAndClose = (id: string): void => {
    onSelectOrg(id);
    onToggle(false);
  };

  const q = search.toLowerCase();

  const filterChildren = (children?: OrgNode[]): OrgNode[] => {
    if (!children) return [];
    return children.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const childMatch = c.children && c.children.some(gc => gc.name.toLowerCase().includes(q));
      return nameMatch || childMatch;
    });
  };

  const filteredSubs = filterChildren(ORG_TREE.children);
  const showAll = !q || "all organizations".includes(q);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute left-0 top-full mt-1 z-50" style={{ width: "300px" }}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
        {/* Search */}
        <div className="p-2 border-b border-gray-100">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Org list */}
        <div className="max-h-80 overflow-y-auto py-1 px-1.5">
          {showAll && (
            <OrgRow
              selected={selectedOrg === "all"}
              onChange={() => selectAndClose("all")}
              label="All Organizations"
              hovered={hoveredId === "all"}
              onHover={() => setHoveredId("all")}
              onLeave={() => setHoveredId(null)}
            />
          )}

          {showAll && (
            <div className="h-px bg-gray-100 mx-1.5 my-1" />
          )}

          {(!q || ORG_TREE.name.toLowerCase().includes(q) || "corporate".includes(q)) && (
            <OrgRow
              selected={selectedOrg === ORG_TREE.id}
              onChange={() => selectAndClose(ORG_TREE.id)}
              label={ORG_TREE.name}
              hovered={hoveredId === ORG_TREE.id}
              onHover={() => setHoveredId(ORG_TREE.id)}
              onLeave={() => setHoveredId(null)}
            />
          )}

          {filteredSubs.map((sub) => {
            const isExpanded = expandedGroups.includes(sub.id) || q.length > 0;
            const subMatch = sub.name.toLowerCase().includes(q);
            const filteredGrandchildren = sub.children
              ? sub.children.filter(gc => !q || gc.name.toLowerCase().includes(q) || subMatch)
              : [];
            const childCount = (sub.children ? sub.children.length : 0) + 1;
            const isGroupSelected = selectedOrg === sub.id;
            const groupHovered = hoveredId === `${sub.id}-header`;

            return (
              <div key={sub.id}>
                <button
                  className="w-full flex items-center justify-between text-sm text-left transition-colors"
                  style={{
                    borderRadius: "8px",
                    paddingLeft: "10px",
                    paddingRight: "6px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    color: "#293037",
                    fontWeight: 500,
                    ...(groupHovered ? { background: "#F9FAFB" } : {}),
                  }}
                  onMouseEnter={() => setHoveredId(`${sub.id}-header`)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => toggleGroup(sub.id)}
                >
                  <span className="truncate">{sub.name}</span>
                  <span className="flex items-center gap-1.5 flex-shrink-0">
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}>{childCount}</span>
                    {isExpanded
                      ? <ChevronDown size={14} className="text-gray-400" />
                      : <ChevronRight size={14} className="text-gray-400" />
                    }
                  </span>
                </button>

                {isExpanded && (
                  <div className="mb-0.5">
                    <OrgRow
                      selected={isGroupSelected}
                      onChange={() => selectAndClose(sub.id)}
                      label={sub.name}
                      sublabel="All"
                      indent={1}
                      hovered={hoveredId === `${sub.id}-all`}
                      onHover={() => setHoveredId(`${sub.id}-all`)}
                      onLeave={() => setHoveredId(null)}
                    />
                    {(!q || sub.name.toLowerCase().includes(q) || subMatch) && (
                      <OrgRow
                        selected={selectedOrg === `${sub.id}-entity`}
                        onChange={() => selectAndClose(`${sub.id}-entity`)}
                        label={sub.name}
                        indent={1}
                        hovered={hoveredId === `${sub.id}-entity`}
                        onHover={() => setHoveredId(`${sub.id}-entity`)}
                        onLeave={() => setHoveredId(null)}
                      />
                    )}
                    {filteredGrandchildren.map((gc) => (
                      <OrgRow
                        key={gc.id}
                        selected={selectedOrg === gc.id}
                        onChange={() => selectAndClose(gc.id)}
                        label={gc.name}
                        indent={1}
                        hovered={hoveredId === gc.id}
                        onHover={() => setHoveredId(gc.id)}
                        onLeave={() => setHoveredId(null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!showAll && filteredSubs.length === 0 && (
            <div className="px-3 py-4 text-sm text-gray-400 text-center">No organizations found</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Nav Components ─────────────────────────────────

interface NavItemProps {
  item: NavItem;
  activeId: string;
  onSelect: (id: string) => void;
  expanded: string[];
  onToggle: (id: string) => void;
}

function NavItem({ item, activeId, onSelect, expanded, onToggle }: NavItemProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [hoveredChild, setHoveredChild] = useState<string | null>(null);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded.includes(item.id);
  const isActive = activeId === item.id;
  const Icon = item.icon;
  const showParentHover = hovered && !(isActive && !hasChildren);

  return (
    <div>
      <button
        onClick={() => hasChildren ? onToggle(item.id) : onSelect(item.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
        style={{
          borderRadius: "6px",
          ...(isActive && !hasChildren
            ? { color: "#F4722B", fontWeight: 600 }
            : { color: "#4D4D4D" }),
          ...(showParentHover ? { background: "rgba(228,227,232,0.5)" } : {}),
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="flex-shrink-0" style={{ color: (isActive && !hasChildren) ? "#F4722B" : "#4D4D4D" }} />
          <span>{item.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasChildren && (isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />)}
        </div>
      </button>
      {hasChildren && isExpanded && (
        <div className="mt-0.5 mb-1">
          {item.children.map((child) => {
            const isChildActive = activeId === child.id;
            const isChildHovered = hoveredChild === child.id && !isChildActive;
            return (
              <button
                key={child.id}
                onClick={() => onSelect(child.id)}
                onMouseEnter={() => setHoveredChild(child.id)}
                onMouseLeave={() => setHoveredChild(null)}
                className="w-full text-left pl-10 pr-3 py-1.5 text-sm transition-colors"
                style={{
                  borderRadius: "6px",
                  ...(isChildActive
                    ? { color: "#F4722B", fontWeight: 600 }
                    : { color: "#4D4D4D" }),
                  ...(isChildHovered ? { background: "rgba(228,227,232,0.5)" } : {}),
                }}
              >
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SectionLabelProps {
  label: string;
}

function SectionLabel({ label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 px-3 mb-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

interface CollapsedIconProps {
  item: NavItem;
  activeId: string;
  onSelect: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setExpanded: (fn: (prev: string[]) => string[]) => void;
}

function CollapsedIcon({ item, activeId, onSelect, setSidebarOpen, setExpanded }: CollapsedIconProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const Icon = item.icon;
  const isActive = activeId === item.id || (item.children && item.children.some(c => c.id === activeId));
  return (
    <button
      onClick={() => {
        if (item.children) {
          setSidebarOpen(true);
          setExpanded(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
        } else {
          onSelect(item.id);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-2.5 transition-colors"
      style={{
        borderRadius: "6px",
        ...(isActive
          ? { color: "#F4722B" }
          : { color: "#4D4D4D" }),
        ...(!isActive && hovered ? { background: "rgba(228,227,232,0.5)" } : {}),
      }}
      title={item.label}
    >
      <Icon size={18} />
    </button>
  );
}

// ─── UI Components ──────────────────────────────────────────

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Draft || { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, color: cfg.text, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{status}</span>;
}

interface ContractTypeBadgeProps {
  type: string;
}

function ContractTypeBadge({ type }: ContractTypeBadgeProps) {
  const cfg = CONTRACT_TYPE_CONFIG[type] || CONTRACT_TYPE_CONFIG["T&E"];
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, color: cfg.text, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{type}</span>;
}

interface WOStatusBadgeProps {
  status: string;
}

function WOStatusBadge({ status }: WOStatusBadgeProps) {
  const cfg = WO_STATUS_CONFIG[status] || WO_STATUS_CONFIG.Open;
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, color: cfg.text, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{status}</span>;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#111827", marginBottom: 4 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ display: "block", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{hint}</span>}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <input
      type="text" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 6, outline: "none",
        boxShadow: "none", fontFamily: "inherit",
      }}
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = "#D1D5DB"}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = "#E5E7EB"}
    />
  );
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

function SelectInput({ value, onChange, options, placeholder }: SelectInputProps) {
  return (
    <select
      value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 6, outline: "none",
        fontFamily: "inherit",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
    </select>
  );
}

// ─── Page Views ─────────────────────────────────────────────

interface ProjectTableProps {
  projects: Project[];
  sortField: string | null;
  sortDir: string;
  onSort: (field: string) => void;
  onProjectClick?: (project: Project) => void;
}

function ProjectTable({ projects, sortField, sortDir, onSort, onProjectClick }: ProjectTableProps) {
  const sorted = useMemo(() => {
    const arr = [...projects];
    if (sortField) {
      arr.sort((a, b) => {
        const aVal = a[sortField as keyof Project];
        const bVal = b[sortField as keyof Project];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return arr;
  }, [projects, sortField, sortDir]);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr style={{ background: "#f9f9fb" }} className="border-b border-gray-200">
            <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => onSort("name")}>
              Project {sortField === "name" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => onSort("customer")}>
              Customer {sortField === "customer" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => onSort("contractType")}>
              Contract Type {sortField === "contractType" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => onSort("status")}>
              Status {sortField === "status" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => onSort("startDate")}>
              Start Date {sortField === "startDate" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((proj, idx) => (
            <tr key={idx} className="border-b border-gray-100 last:border-0 cursor-pointer transition-colors" style={{ background: "white" }}
              onClick={() => onProjectClick && onProjectClick(proj)}
              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f9f9fb"}
              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "white"}>
              <td className="px-4 py-3">
                <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{proj.name}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{proj.id}</div>
              </td>
              <td className="px-4 py-3" style={{ fontSize: 13, color: "#111827" }}>{proj.customer}</td>
              <td className="px-4 py-3"><ContractTypeBadge type={proj.contractType} /></td>
              <td className="px-4 py-3"><StatusBadge status={proj.status} /></td>
              <td className="px-4 py-3" style={{ fontSize: 12, color: "#6B7280" }}>
                {proj.startDate
                  ? new Date(proj.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" onClick={e => e.stopPropagation()}><MoreHorizontal size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ProjectsListViewProps {
  onNewProject: () => void;
  onProjectClick: (project: Project) => void;
}

function ProjectsListView({ onNewProject, onProjectClick }: ProjectsListViewProps) {
  const [sortField, setSortField] = useState<string | null>("name");
  const [sortDir, setSortDir] = useState<string>("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return PROJECTS_DATA;
    const q = searchQuery.toLowerCase();
    return PROJECTS_DATA.filter(p =>
      p.name.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage bluesky projects across all contract types.</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 w-96">
            <Search size={14} />
            <input type="text" placeholder="Search by project name, customer, or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#111827" }} />
          </div>
          <button
            onClick={onNewProject}
            style={{
              padding: "8px 14px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#1F2937"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#111827"}
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        <ProjectTable projects={filtered} sortField={sortField} sortDir={sortDir} onSort={handleSort} onProjectClick={onProjectClick} />
      </div>
    </div>
  );
}

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onWOClick: (wo: WorkOrder) => void;
}

function ProjectDetailView({ project, onBack, onWOClick }: ProjectDetailViewProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(WORK_ORDERS[project.id] || []);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newWO, setNewWO] = useState<{ description: string }>({ description: "" });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<string>("asc");

  const handleSort = (field: string): void => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    const arr = [...workOrders];
    if (sortField) {
      arr.sort((a, b) => {
        const aVal = a[sortField as keyof WorkOrder];
        const bVal = b[sortField as keyof WorkOrder];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return arr;
  }, [workOrders, sortField, sortDir]);

  const handleAddWO = (): void => {
    if (!newWO.description) return;
    const nextNum = Math.max(...workOrders.map(w => parseInt(w.id.replace("WO-", ""))), 0) + 1;
    const created: WorkOrder = {
      id: `WO-${nextNum}`,
      description: newWO.description,
      status: "Open",
      units: 0,
      earnedHours: 0,
      assignedTo: "Unassigned",
      dateCreated: new Date().toISOString().split("T")[0],
    };
    setWorkOrders([...workOrders, created]);
    setNewWO({ description: "" });
    setShowAddForm(false);
    if (onWOClick) onWOClick(created);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-5">
          <button onClick={onBack}
            style={{ fontSize: 12, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Projects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
                <StatusBadge status={project.status} />
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{project.customer} &middot; {project.id} &middot; {project.contractType}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 w-80">
            <Search size={14} />
            <input type="text" placeholder="Search work orders..." style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#111827" }} />
          </div>
          <button onClick={() => setShowAddForm(true)}
            style={{ padding: "8px 14px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#1F2937"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#111827"}>
            <Plus size={16} /> Add Work Order
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: 16, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>New Work Order</div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#111827", marginBottom: 4 }}>Description <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="text" value={newWO.description} onChange={e => setNewWO({ ...newWO, description: e.target.value })}
                  placeholder="e.g., Replace deteriorated poles — Section 5"
                  style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 6, outline: "none", fontFamily: "inherit" }} />
              </div>
              <button onClick={handleAddWO}
                style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                Add
              </button>
              <button onClick={() => { setShowAddForm(false); setNewWO({ description: "" }); }}
                style={{ padding: "8px 12px", background: "#fff", color: "#6B7280", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f9f9fb" }} className="border-b border-gray-200">
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("id")}>
                  WO # {sortField === "id" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("description")}>
                  Description {sortField === "description" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("status")}>
                  Status {sortField === "status" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((wo, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0 cursor-pointer transition-colors" style={{ background: "white" }}
                  onClick={() => onWOClick && onWOClick(wo)}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f9f9fb"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "white"}>
                  <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{wo.id}</td>
                  <td className="px-4 py-3">
                    <div style={{ fontSize: 13, color: "#111827" }}>{wo.description}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Created {new Date(wo.dateCreated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  </td>
                  <td className="px-4 py-3"><WOStatusBadge status={wo.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
              {workOrders.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 8 }}>No work orders yet</div>
                    <button onClick={() => setShowAddForm(true)}
                      style={{ fontSize: 12, fontWeight: 500, color: "#2563EB", background: "none", border: "none", cursor: "pointer" }}>
                      + Add your first work order
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface WorkOrderDetailViewProps {
  workOrder: WorkOrder;
  project: Project;
  onBack: () => void;
}

function WorkOrderDetailView({ workOrder, project, onBack }: WorkOrderDetailViewProps) {
  const [units, setUnits] = useState<CompatibleUnit[]>(WO_UNITS[workOrder.id] || []);
  const [woStatus, setWoStatus] = useState<string>(workOrder.status === "Complete" ? "Complete" : "Planned");
  const [showCUModal, setShowCUModal] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<string>("asc");

  const handleSort = (field: string): void => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    const arr = [...units];
    if (sortField) {
      arr.sort((a, b) => {
        const aVal = a[sortField as keyof CompatibleUnit];
        const bVal = b[sortField as keyof CompatibleUnit];
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return arr;
  }, [units, sortField, sortDir]);

  const totalQty = units.reduce((sum, u) => sum + u.qty, 0);
  const totalValue = units.reduce((sum, u) => sum + u.qty * u.unitPrice, 0);

  const handleModalAdd = (newItems: CompatibleUnit[]): void => {
    setUnits([...units, ...newItems]);
  };

  const WO_STATUSES: string[] = ["Planned", "Complete"];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-5">
          <button onClick={onBack}
            style={{ fontSize: 12, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to {project.name}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">{workOrder.id}</h1>
                <div style={{ display: "inline-flex", borderRadius: 6, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                  {WO_STATUSES.map(s => {
                    const active = woStatus === s;
                    const colors = s === "Complete"
                      ? { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" }
                      : { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" };
                    return (
                      <button key={s} onClick={() => setWoStatus(s)}
                        style={{
                          padding: "4px 12px", fontSize: 11, fontWeight: 500, border: "none", cursor: "pointer",
                          background: active ? colors.bg : "#fff",
                          color: active ? colors.text : "#9CA3AF",
                          transition: "all 0.15s",
                        }}>
                        {active && <Check size={10} style={{ marginRight: 4, display: "inline", verticalAlign: "middle" }} />}{s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#111827", marginBottom: 2 }}>{workOrder.description}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{project.customer} &middot; {project.id}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 w-80">
            <Search size={14} />
            <input type="text" placeholder="Search units..." style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#111827" }} />
          </div>
          <button onClick={() => setShowCUModal(true)}
            style={{ padding: "8px 14px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#1F2937"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#111827"}>
            <Plus size={16} /> Add Unit
          </button>
        </div>

        {showCUModal && (
          <AddCUModal
            onClose={() => setShowCUModal(false)}
            onAdd={handleModalAdd}
            existingUnits={units}
          />
        )}

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f9f9fb" }} className="border-b border-gray-200">
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("code")}>
                  CU Code {sortField === "code" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("description")}>
                  Description {sortField === "description" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("qty")}>
                  Qty {sortField === "qty" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("unitPrice")}>
                  Unit Price {sortField === "unitPrice" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Total</th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("dateEntered")}>
                  Date Entered {sortField === "dateEntered" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th className="text-left text-xs font-medium px-4 py-2.5 cursor-pointer" style={{ color: "#2B333B" }} onClick={() => handleSort("status")}>
                  Status {sortField === "status" && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((unit, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0 transition-colors" style={{ background: "white" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#f9f9fb"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "white"}>
                  <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#111827", fontFamily: "monospace" }}>{unit.code}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: "#111827" }}>{unit.description}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: "#111827" }}>{unit.qty}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: "#111827" }}>${unit.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>${(unit.qty * unit.unitPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: "#6B7280" }}>{unit.dateEntered || "—"}</td>
                  <td className="px-4 py-3"><WOStatusBadge status={unit.status} /></td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 8 }}>No units added yet</div>
                    <button onClick={() => setShowCUModal(true)}
                      style={{ fontSize: 12, fontWeight: 500, color: "#2563EB", background: "none", border: "none", cursor: "pointer" }}>
                      + Add your first unit
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
            {units.length > 0 && (
              <tfoot>
                <tr style={{ background: "#f9f9fb", borderTop: "1px solid #E5E7EB" }}>
                  <td className="px-4 py-2.5" style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Totals</td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5" style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{totalQty}</td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5" style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2.5"></td>
                  <td className="px-4 py-2.5"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

interface NewProjectViewProps {
  onCancel: () => void;
  onComplete: (data: Record<string, any>) => void;
}

function NewProjectView({ onCancel, onComplete }: NewProjectViewProps) {
  const [data, setData] = useState<Record<string, string>>({ contractType: "Unit-Price" });
  const canCreate = data.customer && data.name && data.cuLibrary && data.startDate;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="flex-1 p-8 overflow-y-auto">
        <div style={{ maxWidth: 480 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 4 }}>New Project</h2>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 28 }}>Set up a new bluesky project.</p>

          <FormField label="Customer" required>
            <SelectInput value={data.customer || ""} onChange={v => setData({ ...data, customer: v })} options={CUSTOMERS} placeholder="Select a customer..." />
          </FormField>

          <FormField label="CU Library" required hint="The compatible unit library this project will bill against">
            <SelectInput
              value={data.cuLibrary || ""}
              onChange={v => setData({ ...data, cuLibrary: v })}
              options={CU_LIBRARIES.map(lib => `${lib.name} (${lib.units} units)`)}
              placeholder="Select a CU library..."
            />
          </FormField>

          <FormField label="Project Name" required>
            <TextInput value={data.name || ""} onChange={v => setData({ ...data, name: v })} placeholder="e.g., CHELCO OH Distribution — Spring 2026" />
          </FormField>

          <FormField label="Contract Type" required>
            <div style={{ display: "flex", gap: 8 }}>
              {["Unit-Price", "T&E", "Lump Sum"].map(ct => {
                const sel = data.contractType === ct;
                const disabled = ct !== "Unit-Price";
                const cfg = CONTRACT_TYPE_CONFIG[ct];
                return (
                  <button key={ct} onClick={() => { if (!disabled) setData({ ...data, contractType: ct }); }}
                    style={{ flex: 1, padding: "8px 12px", fontSize: 12, fontWeight: sel ? 600 : 400, borderRadius: 6,
                      border: sel ? `2px solid ${cfg.text}` : "1px solid #E5E7EB",
                      background: disabled ? "#F3F4F6" : sel ? cfg.bg : "#fff",
                      color: disabled ? "#D1D5DB" : sel ? cfg.text : "#6B7280",
                      cursor: disabled ? "default" : "pointer", transition: "all 0.15s", textAlign: "center" }}>
                    {ct}{disabled && <span style={{ fontSize: 10, display: "block", color: "#D1D5DB", marginTop: 2 }}>Coming soon</span>}
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField label="Start Date" required>
            <input type="date" value={data.startDate || ""} onChange={e => setData({ ...data, startDate: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#111827", outline: "none", fontFamily: "inherit" }} />
          </FormField>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
            <button onClick={onCancel}
              style={{ padding: "8px 14px", border: "1px solid #E5E7EB", background: "#fff", color: "#111827", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#fff"}>
              Cancel
            </button>
            <button onClick={() => onComplete(data)} disabled={!canCreate}
              style={{ padding: "8px 14px", background: canCreate ? "#111827" : "#D1D5DB", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: canCreate ? "pointer" : "default", transition: "all 0.15s" }}
              onMouseEnter={e => { if (canCreate) (e.currentTarget as HTMLButtonElement).style.background = "#1F2937"; }}
              onMouseLeave={e => { if (canCreate) (e.currentTarget as HTMLButtonElement).style.background = "#111827"; }}>
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Module ────────────────────────────────────────────

export default function ProjectsModule() {
  const [view, setView] = useState<string>("list");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [activeId, setActiveId] = useState<string>("projects");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedOrg, setSelectedOrg] = useState<string>("pg-distribution");
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState<boolean>(false);

  const getOrgLabel = (): string => {
    if (selectedOrg === "all") return "All Organizations";
    if (selectedOrg === ORG_TREE.id) return ORG_TREE.name;
    for (const sub of ORG_TREE.children || []) {
      if (sub.id === selectedOrg) return sub.name;
      if (selectedOrg === `${sub.id}-entity`) return sub.name;
      if (sub.children) for (const gc of sub.children) {
        if (gc.id === selectedOrg) return gc.name;
      }
    }
    return "No Selection";
  };

  const toggleExpand = (id: string): void => {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col" style={{ height: "100vh", width: "100%", background: "#F9FAFB", fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css');`}</style>

      {/* Top bar — full width */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center flex-shrink-0 z-10">
        <div className="flex items-center h-full">
          {/* Logo area with OrgSwitcher */}
          <div className={`flex items-center justify-between px-3 h-full transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: "#fafafa", borderRight: "1px solid #E5E7EB" }}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2.5 relative">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#4D4D4D" }}>
                    <Zap size={14} className="text-white" />
                  </div>
                  <button
                    onClick={() => setOrgSwitcherOpen(prev => !prev)}
                    className="text-left flex items-center gap-1"
                  >
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#4D4D4D" }}>Gridbase</div>
                      <div className="text-[11px] flex items-center gap-1" style={{ color: "#9CA3AF", maxWidth: "130px" }}>
                        <span className="truncate">{getOrgLabel()}</span>
                        <ChevronDown size={10} className="flex-shrink-0" />
                      </div>
                    </div>
                  </button>
                  <OrgSwitcher
                    selectedOrg={selectedOrg}
                    onSelectOrg={setSelectedOrg}
                    isOpen={orgSwitcherOpen}
                    onToggle={setOrgSwitcherOpen}
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Toggle navigation"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="14" height="12" rx="2" />
                    <line x1="7" y1="3" x2="7" y2="15" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Toggle navigation"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="14" height="12" rx="2" />
                    <line x1="7" y1="3" x2="7" y2="15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm ml-6">
            <span className="text-gray-400">Bluesky</span>
            <ChevronRight size={14} className="text-gray-300" />
            {(view === "detail" || view === "wo-detail") && selectedProject ? (
              <>
                <span className="text-gray-400 cursor-pointer" style={{ transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.color = "#111827"}
                  onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.color = "#9CA3AF"}
                  onClick={() => { setView("list"); setSelectedProject(null); setSelectedWO(null); }}>Projects</span>
                <ChevronRight size={14} className="text-gray-300" />
                {view === "wo-detail" && selectedWO ? (
                  <>
                    <span className="text-gray-400 cursor-pointer" style={{ transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.color = "#111827"}
                      onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.color = "#9CA3AF"}
                      onClick={() => { setView("detail"); setSelectedWO(null); }}>{selectedProject.name}</span>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="font-medium text-gray-900">{selectedWO.id}</span>
                  </>
                ) : (
                  <span className="font-medium text-gray-900">{selectedProject.name}</span>
                )}
              </>
            ) : (
              <span className="font-medium text-gray-900">Projects</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar + content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className={`flex flex-col flex-shrink-0 transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: "#fafafa", borderRight: "1px solid #E5E7EB" }}>
          {sidebarOpen ? (
            <>
              <nav className="flex-1 overflow-y-auto px-2 py-3">
                {NAV_SECTIONS.map((section, idx) => (
                  <div key={section.label} className={idx > 0 ? "mt-5" : ""}>
                    <SectionLabel label={section.label} />
                    <div className="space-y-0.5">
                      {section.items.map((item) => (
                        <NavItem key={item.id} item={item} activeId={activeId} onSelect={setActiveId} expanded={expanded} onToggle={toggleExpand} />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="px-3 py-3" style={{ borderTop: "1px solid #E5E7EB" }}>
                <div className="flex items-center gap-2.5 px-2">
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">BG</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">Ben Glatt</div>
                    <div className="text-[11px] text-gray-400 truncate">Admin</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <nav className="flex-1 overflow-y-auto py-3 flex flex-col items-center gap-1">
              {NAV_SECTIONS.map((section, idx) => (
                <div key={section.label} className="flex flex-col items-center gap-1 w-full px-2">
                  {idx > 0 && <div className="w-6 h-px my-2" style={{ background: "#E5E7EB" }} />}
                  {section.items.map((item) => (
                    <CollapsedIcon
                      key={item.id}
                      item={item}
                      activeId={activeId}
                      onSelect={setActiveId}
                      setSidebarOpen={setSidebarOpen}
                      setExpanded={setExpanded}
                    />
                  ))}
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Main content */}
        {view === "list" && <ProjectsListView onNewProject={() => setView("wizard")} onProjectClick={(proj) => { setSelectedProject(proj); setView("detail"); }} />}
        {view === "wizard" && <NewProjectView onCancel={() => setView("list")} onComplete={() => setView("list")} />}
        {view === "detail" && selectedProject && <ProjectDetailView project={selectedProject} onBack={() => { setView("list"); setSelectedProject(null); }} onWOClick={(wo) => { setSelectedWO(wo); setView("wo-detail"); }} />}
        {view === "wo-detail" && selectedProject && selectedWO && <WorkOrderDetailView workOrder={selectedWO} project={selectedProject} onBack={() => { setView("detail"); setSelectedWO(null); }} />}
      </div>
    </div>
  );
}
