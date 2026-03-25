import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, ChevronLeft, Zap, ClipboardList, Ticket, Phone, FolderKanban, BookOpen, Building2, Landmark, Truck, Users, Calculator, FileSpreadsheet, Settings, UserCog, Plug, Search, Plus, X, MoreHorizontal, Pencil, Trash2, GripVertical, Building, CreditCard, Shield, Key, FileText, Wrench, DollarSign, Map, LayoutList, ArrowLeft } from "lucide-react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const FONT_STACK = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const COLORS = {
  orange: "#F4722B",
  sidebarBg: "#fafafa",
  navText: "#4D4D4D",
  navHover: "rgba(228,227,232,0.5)",
  pageBackground: "#F9FAFB",
  border: "#E5E7EB",
  columnHeader: "#2B333B",
  tableHeaderBg: "#f9f9fb",
  tableRowHover: "#f9f9fb",
  tooltipBg: "#111827",
};

// ─── MAIN APP NAV ───────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { label: "Storm", items: [
    { id: "events", label: "Events", icon: Zap },
    { id: "roster-verification", label: "Roster Verification", icon: ClipboardList },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "callout", label: "Callout", icon: Phone },
  ]},
  { label: "Bluesky", items: [
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "units-library", label: "Units Library", icon: BookOpen },
  ]},
  { label: "Data", items: [
    { id: "unions", label: "Unions", icon: Landmark, children: [{ id: "agreements", label: "Agreements" }, { id: "jurisdictional-map", label: "Jurisdictional Map" }] },
    { id: "organizations", label: "Organizations", icon: Building2, children: [{ id: "utilities", label: "Utilities" }, { id: "contractors", label: "Contractors" }, { id: "brokers", label: "Brokers" }] },
    { id: "equipment", label: "Equipment", icon: Truck, children: [{ id: "fleet", label: "Fleet" }, { id: "fuel-cost", label: "Fuel Cost" }, { id: "toll-charges", label: "Toll Charges" }] },
    { id: "personnel", label: "Personnel", icon: Users },
  ]},
  { label: "Tools", items: [
    { id: "calculators", label: "Calculators", icon: Calculator },
    { id: "bid-estimates", label: "Bid Estimates", icon: FileSpreadsheet },
  ]},
  { label: "Settings", items: [
    { id: "account", label: "Account", icon: Settings },
    { id: "users", label: "Users", icon: UserCog },
    { id: "integrations", label: "Integrations", icon: Plug },
  ]},
];

// ─── SETTINGS NAV ───────────────────────────────────────────────────────────
const SETTINGS_SECTIONS = [
  { label: "Account", items: [
    { id: "general", label: "General", icon: Building },
    { id: "members", label: "Members", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ]},
  { label: "Configuration", items: [
    { id: "classifications", label: "Classifications", icon: LayoutList },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "equipment-costs", label: "Equipment Costs", icon: DollarSign },
    { id: "admin-mapping", label: "Admin Mapping", icon: Map },
    { id: "te-bid-template", label: "T&E Bid Template", icon: Calculator },
  ]},
  { label: "Integrations", items: [
    { id: "connected-apps", label: "Connected Apps", icon: Plug },
    { id: "api-keys", label: "API Keys", icon: Key },
  ]},
];

// ─── SAMPLE CLASSIFICATIONS DATA ────────────────────────────────────────────
const CLASSIFICATIONS = [
  { id: 1, name: "General Foreman", code: "GF", category: "Supervision", sortOrder: 1, active: true },
  { id: 2, name: "Foreman", code: "FM", category: "Supervision", sortOrder: 2, active: true },
  { id: 3, name: "Lead Lineman", code: "LL", category: "Journeyman", sortOrder: 3, active: true },
  { id: 4, name: "Journeyman Lineman", code: "JL", category: "Journeyman", sortOrder: 4, active: true },
  { id: 5, name: "Apprentice 7th Period", code: "A7", category: "Apprentice", sortOrder: 5, active: true },
  { id: 6, name: "Apprentice 6th Period", code: "A6", category: "Apprentice", sortOrder: 6, active: true },
  { id: 7, name: "Apprentice 5th Period", code: "A5", category: "Apprentice", sortOrder: 7, active: true },
  { id: 8, name: "Apprentice 4th Period", code: "A4", category: "Apprentice", sortOrder: 8, active: true },
  { id: 9, name: "Apprentice 3rd Period", code: "A3", category: "Apprentice", sortOrder: 9, active: true },
  { id: 10, name: "Apprentice 2nd Period", code: "A2", category: "Apprentice", sortOrder: 10, active: true },
  { id: 11, name: "Apprentice 1st Period", code: "A1", category: "Apprentice", sortOrder: 11, active: true },
  { id: 12, name: "Equipment Operator", code: "EO", category: "Operator", sortOrder: 12, active: true },
  { id: 13, name: "Groundman / Driver", code: "GD", category: "Groundman", sortOrder: 13, active: true },
  { id: 14, name: "Cable Splicer", code: "CS", category: "Journeyman", sortOrder: 14, active: false },
];

// ─── ORG HIERARCHY (for permissions) ────────────────────────────────────────
const ORGS = [
  { id: "powergrid", name: "PowerGrid Services", type: "holding" },
  { id: "pg-distribution", name: "PowerGrid Distribution", type: "division", children: [
    { id: "electralines", name: "ElectraLines" },
    { id: "gridtech", name: "GridTech" },
    { id: "james-plc", name: "James Power Line Construction" },
  ]},
  { id: "pg-transmission", name: "PowerGrid Transmission", type: "division", children: [
    { id: "apex-transmission", name: "Apex Transmission" },
    { id: "southern-line", name: "Southern Line Services" },
  ]},
  { id: "pg-vegetation", name: "PowerGrid Vegetation", type: "division", children: [
    { id: "clearpath", name: "ClearPath Tree Services" },
    { id: "greenline", name: "GreenLine Vegetation" },
  ]},
  { id: "premium-uc", name: "Premium Utility Contractor", type: "division", children: [
    { id: "coastal-electric", name: "Coastal Electric Works" },
    { id: "sunbelt-power", name: "Sunbelt Power Services" },
  ]},
];

// Modules that can be permissioned
const MODULES = [
  { section: "Storm", items: [
    { id: "events", label: "Events" },
    { id: "roster-verification", label: "Roster Verification" },
    { id: "tickets", label: "Tickets" },
    { id: "callout", label: "Callout" },
  ]},
  { section: "Bluesky", items: [
    { id: "projects", label: "Projects" },
    { id: "units-library", label: "Units Library" },
  ]},
  { section: "Data", items: [
    { id: "unions", label: "Unions" },
    { id: "organizations", label: "Organizations" },
    { id: "equipment", label: "Equipment" },
    { id: "personnel", label: "Personnel" },
  ]},
  { section: "Tools", items: [
    { id: "calculators", label: "Calculators" },
    { id: "bid-estimates", label: "Bid Estimates" },
  ]},
  { section: "Settings", items: [
    { id: "settings", label: "Settings" },
  ]},
];

const PERMISSION_LEVELS = ["hidden", "read", "write", "admin"];
const PERMISSION_LABELS = { hidden: "Hidden", read: "Read", write: "Read & Write", admin: "Full Access" };
const PERMISSION_COLORS = {
  hidden: { bg: "#F3F4F6", text: "#9CA3AF", border: "#E5E7EB" },
  read: { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  write: { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  admin: { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
};

// Role definitions
// Owner: set only by Gridbase. Full access, manages Admins and Users.
// Admin: assigned by Owners. Manages Users within their orgs.
// User: assigned by Owners or Admins. Base role with configured permissions.
const ROLES = ["Owner", "Admin", "User"];
const ROLE_COLORS = {
  Owner: { bg: "#111827", text: "#FFFFFF", border: "#111827" },
  Admin: { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  User: { bg: "#F3F4F6", text: "#4B5563", border: "#E5E7EB" },
};

// ─── SAMPLE MEMBERS DATA ────────────────────────────────────────────────────
const MEMBERS = [
  { id: 1, name: "Ben Glatt", email: "ben@powergrid.com", role: "Owner", status: "Active", lastActive: "Just now",
    orgs: ["powergrid", "pg-distribution", "electralines", "gridtech", "james-plc", "pg-transmission", "apex-transmission", "southern-line", "pg-vegetation", "clearpath", "greenline", "premium-uc", "coastal-electric", "sunbelt-power"] },
  { id: 2, name: "Cameron Hayes", email: "cameron@powergrid.com", role: "Admin", status: "Active", lastActive: "2h ago",
    orgs: ["pg-distribution", "electralines", "gridtech", "james-plc"],
    permissions: { events: "admin", "roster-verification": "admin", tickets: "write", callout: "write", unions: "read", organizations: "read", equipment: "read", personnel: "write", calculators: "read", settings: "write" } },
  { id: 3, name: "Summer Wells", email: "summer@powergrid.com", role: "User", status: "Active", lastActive: "1h ago",
    orgs: ["pg-distribution", "electralines", "gridtech", "james-plc"],
    permissions: { unions: "read", personnel: "write", calculators: "read" } },
  { id: 4, name: "Anna Martinez", email: "anna@powergrid.com", role: "User", status: "Active", lastActive: "3h ago",
    orgs: ["pg-distribution", "electralines", "gridtech", "james-plc", "premium-uc", "coastal-electric", "sunbelt-power"],
    permissions: { events: "read", tickets: "read", organizations: "read", equipment: "read", calculators: "write", "bid-estimates": "write" } },
  { id: 5, name: "Adam Briggs", email: "adam@powergrid.com", role: "User", status: "Active", lastActive: "5m ago",
    orgs: ["electralines"],
    permissions: { events: "read", "roster-verification": "write", tickets: "write", callout: "read", personnel: "read", equipment: "read" } },
  { id: 6, name: "Jake Porter", email: "jake@powergrid.com", role: "Admin", status: "Active", lastActive: "30m ago",
    orgs: ["powergrid", "pg-distribution", "electralines", "gridtech", "james-plc", "pg-transmission", "apex-transmission", "southern-line"],
    permissions: { events: "admin", "roster-verification": "admin", tickets: "admin", callout: "admin", organizations: "write", equipment: "read", personnel: "write", calculators: "write", settings: "read" } },
  { id: 7, name: "Lisa Tran", email: "lisa@coastalelectric.com", role: "User", status: "Active", lastActive: "1d ago",
    orgs: ["coastal-electric"],
    permissions: { equipment: "write" } },
  { id: 8, name: "Derek Hall", email: "derek@powergrid.com", role: "User", status: "Invited", lastActive: "—",
    orgs: ["powergrid"], permissions: { events: "read", organizations: "read", equipment: "read" } },
];

// ─── SIDEBAR NAV COMPONENTS ─────────────────────────────────────────────────
function NavItem({ item, activeId, onSelect, expanded, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const [hoveredChild, setHoveredChild] = useState(null);
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
          ...(isActive && !hasChildren ? { color: COLORS.orange, fontWeight: 600 } : { color: COLORS.navText }),
          ...(showParentHover ? { background: COLORS.navHover } : {}),
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="flex-shrink-0" style={{ color: (isActive && !hasChildren) ? COLORS.orange : COLORS.navText }} />
          <span>{item.label}</span>
        </div>
        {hasChildren && (isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />)}
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
                  ...(isChildActive ? { color: COLORS.orange, fontWeight: 600 } : { color: COLORS.navText }),
                  ...(isChildHovered ? { background: COLORS.navHover } : {}),
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

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 px-3 mb-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── SETTINGS NAV ITEM ──────────────────────────────────────────────────────
function SettingsNavItem({ item, isActive, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <button
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
      style={{
        borderRadius: "6px",
        color: isActive ? COLORS.orange : COLORS.navText,
        fontWeight: isActive ? 600 : 400,
        background: !isActive && hovered ? COLORS.navHover : "transparent",
        cursor: "pointer",
        border: "none",
      }}
    >
      <Icon size={16} className="flex-shrink-0" style={{ color: isActive ? COLORS.orange : COLORS.navText }} />
      <span>{item.label}</span>
    </button>
  );
}

// ─── CLASSIFICATIONS PAGE ───────────────────────────────────────────────────
function ClassificationsPage() {
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = CLASSIFICATIONS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(CLASSIFICATIONS.map(c => c.category))];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Classifications</h2>
        <p className="text-sm text-gray-500 mt-1">Manage internal labor classifications used across your organization.</p>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" style={{ width: "260px" }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search classifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
              style={{ outline: "none", border: "none" }}
            />
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors" style={{ cursor: "pointer" }}>
          <Plus size={14} />
          Add Classification
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }} className="border-b border-gray-200">
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader, width: "40%" }}>Name</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader, width: "12%" }}>Code</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader, width: "20%" }}>Category</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader, width: "12%" }}>Order</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader, width: "10%" }}>Status</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cls) => (
              <tr
                key={cls.id}
                className="border-t border-gray-100 transition-colors"
                style={{ background: hoveredRow === cls.id ? COLORS.tableRowHover : "white", cursor: "pointer" }}
                onMouseEnter={() => setHoveredRow(cls.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <GripVertical size={14} className="text-gray-300 flex-shrink-0" style={{ cursor: "grab" }} />
                    <span className="text-sm font-medium text-gray-900">{cls.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500 font-mono">{cls.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{cls.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500 tabular-nums">{cls.sortOrder}</span>
                </td>
                <td className="px-4 py-3">
                  {cls.active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1" style={{ opacity: hoveredRow === cls.id ? 1 : 0, transition: "opacity 100ms" }}>
                    <button className="p-1 rounded text-gray-400 transition-colors" style={{ cursor: "pointer" }}><Pencil size={14} /></button>
                    <button className="p-1 rounded text-gray-400 transition-colors" style={{ cursor: "pointer" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-xs text-gray-400">{filtered.length} classification{filtered.length !== 1 ? "s" : ""}</span>
        <span className="text-xs text-gray-400">Drag rows to reorder</span>
      </div>
    </div>
  );
}

// ─── GENERAL SETTINGS PAGE ──────────────────────────────────────────────────
function GeneralPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">General</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your organization's core settings.</p>
      </div>

      {/* Company info section */}
      <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100" style={{ background: COLORS.tableHeaderBg }}>
          <h3 className="text-sm font-semibold text-gray-900">Organization</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-start gap-12">
            <label className="text-sm text-gray-500 w-40 flex-shrink-0 pt-2">Company Name</label>
            <div className="flex-1">
              <input
                type="text"
                defaultValue="PowerGrid Services"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                style={{ outline: "none", maxWidth: "360px" }}
                onFocus={(e) => e.target.style.borderColor = "#9CA3AF"}
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
              />
            </div>
          </div>
          <div className="flex items-start gap-12">
            <label className="text-sm text-gray-500 w-40 flex-shrink-0 pt-2">Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <Zap size={20} className="text-gray-400" />
              </div>
              <button className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors" style={{ cursor: "pointer" }}>
                Upload
              </button>
            </div>
          </div>
          <div className="flex items-start gap-12">
            <label className="text-sm text-gray-500 w-40 flex-shrink-0 pt-2">Timezone</label>
            <div className="flex-1">
              <select
                defaultValue="ct"
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900 bg-white"
                style={{ outline: "none", appearance: "none", paddingRight: "32px", maxWidth: "360px", width: "100%", backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
              >
                <option value="et">Eastern Time (ET)</option>
                <option value="ct">Central Time (CT)</option>
                <option value="mt">Mountain Time (MT)</option>
                <option value="pt">Pacific Time (PT)</option>
              </select>
            </div>
          </div>
          <div className="flex items-start gap-12">
            <label className="text-sm text-gray-500 w-40 flex-shrink-0 pt-2">Currency</label>
            <div className="flex-1">
              <input
                type="text"
                defaultValue="USD ($)"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                style={{ outline: "none", maxWidth: "360px" }}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors" style={{ cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-100" style={{ background: "#FEF2F2" }}>
          <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Delete Organization</div>
              <div className="text-xs text-gray-500 mt-0.5">Permanently delete this organization and all associated data. This cannot be undone.</div>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg transition-colors" style={{ cursor: "pointer" }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PERMISSION PILL SELECTOR ────────────────────────────────────────────────
function PermissionPill({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const c = PERMISSION_COLORS[value] || PERMISSION_COLORS.hidden;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, cursor: "pointer" }}
      >
        {PERMISSION_LABELS[value]}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 overflow-hidden z-50" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: "130px" }}>
          {PERMISSION_LEVELS.map((level) => {
            const lc = PERMISSION_COLORS[level];
            const isActive = value === level;
            return (
              <button
                key={level}
                onClick={() => { onChange(level); setOpen(false); }}
                onMouseEnter={() => setHovered(level)}
                onMouseLeave={() => setHovered(null)}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors"
                style={{
                  background: hovered === level ? "#F9FAFB" : "white",
                  color: lc.text,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {PERMISSION_LABELS[level]}
                {isActive && <span style={{ color: lc.text }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ROLE SELECTOR ──────────────────────────────────────────────────────────
function RoleSelector({ role, onChange, assignableRoles }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const rc = ROLE_COLORS[role] || ROLE_COLORS.User;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
        style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`, cursor: "pointer" }}
      >
        {role}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 overflow-hidden z-50" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: "150px" }}>
          {/* Owner — display only */}
          <div className="px-3 py-2 text-xs text-gray-300 flex items-center justify-between border-b border-gray-100" style={{ cursor: "not-allowed" }}>
            <span>Owner</span>
            <span className="text-[10px] text-gray-300">Gridbase only</span>
          </div>
          {assignableRoles.map((r) => {
            const c = ROLE_COLORS[r];
            const isActive = role === r;
            return (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false); }}
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
                className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
                style={{
                  background: hovered === r ? "#F9FAFB" : "white",
                  color: c.text,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {r}
                {isActive && <span style={{ color: c.text }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MEMBER DETAIL PAGE (Permissions Matrix) ────────────────────────────────
function MemberDetailPage({ member, onBack }) {
  const [permissions, setPermissions] = useState(() => {
    const p = {};
    MODULES.forEach(section => {
      section.items.forEach(mod => {
        p[mod.id] = member.permissions?.[mod.id] || "hidden";
      });
    });
    return p;
  });

  const [assignedOrgs, setAssignedOrgs] = useState(new Set(member.orgs || []));
  const [orgExpanded, setOrgExpanded] = useState([]);

  const updatePermission = (moduleId, level) => {
    setPermissions(prev => ({ ...prev, [moduleId]: level }));
  };

  const toggleOrg = (orgId) => {
    setAssignedOrgs(prev => {
      const next = new Set(prev);
      if (next.has(orgId)) next.delete(orgId); else next.add(orgId);
      return next;
    });
  };

  const toggleOrgGroup = (org) => {
    const ids = [org.id, ...(org.children || []).map(c => c.id)];
    const allChecked = ids.every(id => assignedOrgs.has(id));
    setAssignedOrgs(prev => {
      const next = new Set(prev);
      ids.forEach(id => allChecked ? next.delete(id) : next.add(id));
      return next;
    });
  };

  const [role, setRole] = useState(member.role);
  const isOwner = role === "Owner";
  const rc = ROLE_COLORS[role] || ROLE_COLORS.User;

  const orgCount = assignedOrgs.size;
  const activeModules = Object.values(permissions).filter(v => v !== "hidden").length;
  const totalModules = Object.keys(permissions).length;

  // Determine which roles the current viewer can assign
  // Owner is set by Gridbase only, so it's not selectable
  const assignableRoles = ["Admin", "User"];

  return (
    <div>
      {/* Header with back arrow */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 transition-colors"
          style={{ cursor: "pointer", background: "none", border: "none" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#111827"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#6B7280"}
        >
          <ArrowLeft size={14} />
          Back to Members
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-base font-medium text-gray-600">{member.name.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{member.email}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors" style={{ cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Role selector + Summary stats */}
      <div className="flex items-center gap-6 mb-6 px-1">
        {/* Role selector */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Role:</span>
          {isOwner ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}>
              Owner
              <span className="text-[10px] font-normal opacity-70 ml-1">Set by Gridbase</span>
            </span>
          ) : (
            <RoleSelector role={role} onChange={setRole} assignableRoles={assignableRoles} />
          )}
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Organizations:</span>
          <span className="font-medium text-gray-900">{orgCount}</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Active Modules:</span>
          <span className="font-medium text-gray-900">{activeModules} of {totalModules}</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Status:</span>
          {member.status === "Active" ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-900">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Invited
            </span>
          )}
        </div>
      </div>

      {/* Two-column layout: Orgs on left, Modules on right */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "280px 1fr" }}>

        {/* LEFT: Organization Access */}
        <div>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100" style={{ background: COLORS.tableHeaderBg }}>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Organization Access</h3>
            </div>
            <div className="py-1">
              {isOwner ? (
                <div className="px-4 py-3 text-sm text-gray-500">Owner has access to all organizations.</div>
              ) : (
                ORGS.map((org) => {
                  const hasChildren = org.children && org.children.length > 0;
                  const isExpanded = orgExpanded.includes(org.id);
                  const childIds = (org.children || []).map(c => c.id);
                  const allChildrenChecked = hasChildren && [org.id, ...childIds].every(id => assignedOrgs.has(id));
                  const someChildrenChecked = hasChildren && [org.id, ...childIds].some(id => assignedOrgs.has(id));
                  const indeterminate = someChildrenChecked && !allChildrenChecked;

                  return (
                    <div key={org.id}>
                      <div className="flex items-center gap-1 px-3 py-1.5">
                        {/* Expand chevron */}
                        {hasChildren ? (
                          <button
                            onClick={() => setOrgExpanded(prev => prev.includes(org.id) ? prev.filter(x => x !== org.id) : [...prev, org.id])}
                            className="p-0.5 flex-shrink-0"
                            style={{ cursor: "pointer", background: "none", border: "none" }}
                          >
                            {isExpanded ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
                          </button>
                        ) : (
                          <span style={{ width: 16 }} />
                        )}

                        {/* Checkbox */}
                        <button
                          onClick={() => hasChildren ? toggleOrgGroup(org) : toggleOrg(org.id)}
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{ width: 16, height: 16, borderRadius: 4, border: (assignedOrgs.has(org.id) || indeterminate) ? "none" : "1.5px solid #D1D5DB", background: (assignedOrgs.has(org.id) && (allChildrenChecked || !hasChildren)) || indeterminate ? COLORS.orange : "white", cursor: "pointer" }}
                        >
                          {(assignedOrgs.has(org.id) && (allChildrenChecked || !hasChildren)) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                          {indeterminate && !(allChildrenChecked) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          )}
                        </button>

                        <span className="text-sm ml-1.5" style={{ fontWeight: 500, color: "#293037" }}>{org.name}</span>
                      </div>

                      {/* Children */}
                      {hasChildren && isExpanded && org.children.map(child => (
                        <div key={child.id} className="flex items-center gap-1 px-3 py-1.5" style={{ paddingLeft: "44px" }}>
                          <button
                            onClick={() => toggleOrg(child.id)}
                            className="flex-shrink-0 flex items-center justify-center"
                            style={{ width: 16, height: 16, borderRadius: 4, border: assignedOrgs.has(child.id) ? "none" : "1.5px solid #D1D5DB", background: assignedOrgs.has(child.id) ? COLORS.orange : "white", cursor: "pointer" }}
                          >
                            {assignedOrgs.has(child.id) && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            )}
                          </button>
                          <span className="text-sm ml-1.5 text-gray-600">{child.name}</span>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Module Permissions */}
        <div>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between" style={{ background: COLORS.tableHeaderBg }}>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Module Permissions</h3>
              {!isOwner && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const p = {};
                      MODULES.forEach(s => s.items.forEach(m => { p[m.id] = "read"; }));
                      setPermissions(p);
                    }}
                    className="text-[10px] font-medium text-gray-500 px-2 py-0.5 rounded border border-gray-200 transition-colors"
                    style={{ cursor: "pointer", background: "white" }}
                  >
                    All Read
                  </button>
                  <button
                    onClick={() => {
                      const p = {};
                      MODULES.forEach(s => s.items.forEach(m => { p[m.id] = "hidden"; }));
                      setPermissions(p);
                    }}
                    className="text-[10px] font-medium text-gray-500 px-2 py-0.5 rounded border border-gray-200 transition-colors"
                    style={{ cursor: "pointer", background: "white" }}
                  >
                    All Hidden
                  </button>
                </div>
              )}
            </div>

            {isOwner ? (
              <div className="px-4 py-3 text-sm text-gray-500">Owner has full access to all modules.</div>
            ) : (
              <div>
                {MODULES.map((section, sIdx) => (
                  <div key={section.section}>
                    {/* Section header */}
                    <div className="px-4 py-2 flex items-center gap-2" style={{ background: sIdx > 0 ? "white" : "white", borderTop: sIdx > 0 ? "1px solid #F3F4F6" : "none" }}>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{section.section}</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Module rows */}
                    {section.items.map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-center justify-between px-4 py-2.5 transition-colors"
                        style={{ borderTop: "1px solid #F9FAFB" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                      >
                        <span className="text-sm text-gray-700">{mod.label}</span>
                        <PermissionPill
                          value={permissions[mod.id]}
                          onChange={(level) => updatePermission(mod.id, level)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBERS LIST PAGE ──────────────────────────────────────────────────────
function MembersPage({ onSelectMember }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [search, setSearch] = useState("");

  // Uses the global ROLE_COLORS constant (Owner / Admin / User)

  const filtered = MEMBERS.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Members</h2>
        <p className="text-sm text-gray-500 mt-1">Manage team members and their access within your organization.</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" style={{ width: "260px" }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent"
              style={{ outline: "none", border: "none" }}
            />
          </div>
          <span className="text-sm text-gray-400">{filtered.length} members</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors" style={{ cursor: "pointer" }}>
          <Plus size={14} />
          Invite Member
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }} className="border-b border-gray-200">
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader }}>Member</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader }}>Role</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader }}>Organizations</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader }}>Status</th>
              <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: COLORS.columnHeader }}>Last Active</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const mrc = ROLE_COLORS[m.role] || ROLE_COLORS.User;
              const orgCountLabel = m.role === "Owner" ? "All" : `${(m.orgs || []).length}`;
              return (
                <tr
                  key={m.id}
                  className="border-t border-gray-100 transition-colors"
                  style={{ background: hoveredRow === m.id ? COLORS.tableRowHover : "white", cursor: "pointer" }}
                  onMouseEnter={() => setHoveredRow(m.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onSelectMember(m)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">{m.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{m.name}</div>
                        <div className="text-xs text-gray-400">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: mrc.bg, color: mrc.text, border: `1px solid ${mrc.border}` }}>{m.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 tabular-nums">{orgCountLabel}</span>
                  </td>
                  <td className="px-4 py-3">
                    {m.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Invited
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{m.lastActive}</td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} className="text-gray-300" />
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

// ─── PLACEHOLDER PAGE ───────────────────────────────────────────────────────
function PlaceholderPage({ title, description }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Wrench size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 mb-1">This section is under construction</p>
        <p className="text-xs text-gray-400">Content for {title} will appear here.</p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function SettingsView() {
  const [activeId, setActiveId] = useState("account");
  const [expanded, setExpanded] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inSettings, setInSettings] = useState(true);
  const [settingsPage, setSettingsPage] = useState("members");
  const [selectedMember, setSelectedMember] = useState(null);

  const toggleExpand = (id) => {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleNavSelect = (id) => {
    if (id === "account") {
      setInSettings(true);
      setActiveId("account");
    } else {
      setInSettings(false);
      setActiveId(id);
    }
  };

  const handleBackFromSettings = () => {
    setInSettings(false);
    setActiveId("events");
    setSelectedMember(null);
  };

  const handleSettingsPageChange = (page) => {
    setSettingsPage(page);
    setSelectedMember(null);
  };

  // Render the appropriate settings content
  const renderSettingsContent = () => {
    switch (settingsPage) {
      case "general":
        return <GeneralPage />;
      case "members":
        if (selectedMember) {
          return <MemberDetailPage member={selectedMember} onBack={() => setSelectedMember(null)} />;
        }
        return <MembersPage onSelectMember={(m) => setSelectedMember(m)} />;
      case "classifications":
        return <ClassificationsPage />;
      case "templates":
        return <PlaceholderPage title="Templates" description="Configure document templates for invoices, estimates, and reports." />;
      case "equipment-costs":
        return <PlaceholderPage title="Equipment Costs" description="Set default hourly and daily rates for equipment types." />;
      case "admin-mapping":
        return <PlaceholderPage title="Admin Mapping" description="Map administrative cost categories to GL codes and billing rules." />;
      case "te-bid-template":
        return <PlaceholderPage title="T&E Bid Template" description="Configure the default template used for Time & Expense bid generation." />;
      case "billing":
        return <PlaceholderPage title="Billing" description="Manage your subscription plan, payment method, and invoices." />;
      case "security":
        return <PlaceholderPage title="Security" description="Configure password policies, two-factor authentication, and audit logging." />;
      case "connected-apps":
        return <PlaceholderPage title="Connected Apps" description="Manage third-party integrations and connected services." />;
      case "api-keys":
        return <PlaceholderPage title="API Keys" description="Create and manage API keys for programmatic access." />;
      default:
        return <ClassificationsPage />;
    }
  };

  // Find current settings page label for breadcrumb
  const baseSettingsLabel = SETTINGS_SECTIONS.flatMap(s => s.items).find(i => i.id === settingsPage)?.label || "Settings";
  const currentSettingsLabel = (settingsPage === "members" && selectedMember) ? selectedMember.name : baseSettingsLabel;

  return (
    <div className="flex flex-col" style={{ height: "100vh", width: "100%", background: COLORS.pageBackground, fontFamily: FONT_STACK }}>
      <style>{`@import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css');`}</style>

      {/* Top bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center flex-shrink-0 z-10">
        <div className="flex items-center h-full">
          <div className={`flex items-center justify-between px-3 h-full transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: COLORS.sidebarBg, borderRight: `1px solid ${COLORS.border}` }}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: COLORS.navText }}>
                    <Zap size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: COLORS.navText }}>Gridbase</div>
                    <div className="text-[11px]" style={{ color: "#9CA3AF" }}>PowerGrid Services</div>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="14" height="12" rx="2" /><line x1="7" y1="3" x2="7" y2="15" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="14" height="12" rx="2" /><line x1="7" y1="3" x2="7" y2="15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Breadcrumbs */}
          {inSettings && (
            <div className="flex items-center gap-2 text-sm ml-6">
              <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">Settings</span>
              <ChevronRight size={14} className="text-gray-300" />
              {selectedMember ? (
                <>
                  <span
                    className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => setSelectedMember(null)}
                  >Members</span>
                  <ChevronRight size={14} className="text-gray-300" />
                  <span className="font-medium text-gray-900">{selectedMember.name}</span>
                </>
              ) : (
                <span className="font-medium text-gray-900">{currentSettingsLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className={`flex flex-col flex-shrink-0 transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: COLORS.sidebarBg, borderRight: `1px solid ${COLORS.border}` }}>
          {sidebarOpen ? (
            <>
              <nav className="flex-1 overflow-y-auto px-2 py-3">
                {inSettings ? (
                  /* Settings sidebar */
                  <>
                    {/* Back button */}
                    <button
                      onClick={handleBackFromSettings}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors mb-3"
                      style={{ borderRadius: "6px", color: COLORS.navText, cursor: "pointer", border: "none", background: "transparent" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = COLORS.navHover}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <ArrowLeft size={16} className="text-gray-400" />
                      <span className="font-medium">Settings</span>
                    </button>

                    <div className="w-full h-px bg-gray-200 mb-3" />

                    {SETTINGS_SECTIONS.map((section, idx) => (
                      <div key={section.label} className={idx > 0 ? "mt-4" : ""}>
                        <SectionLabel label={section.label} />
                        <div className="space-y-0.5">
                          {section.items.map((item) => (
                            <SettingsNavItem
                              key={item.id}
                              item={item}
                              isActive={settingsPage === item.id}
                              onSelect={handleSettingsPageChange}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  /* Regular app sidebar */
                  NAV_SECTIONS.map((section, idx) => (
                    <div key={section.label} className={idx > 0 ? "mt-5" : ""}>
                      <SectionLabel label={section.label} />
                      <div className="space-y-0.5">
                        {section.items.map((item) => (
                          <NavItem key={item.id} item={item} activeId={activeId} onSelect={handleNavSelect} expanded={expanded} onToggle={toggleExpand} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </nav>

              {/* User footer */}
              <div className="px-3 py-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
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
              {inSettings ? (
                <div className="flex flex-col items-center gap-1 w-full px-2">
                  <button
                    onClick={handleBackFromSettings}
                    className="p-2.5 transition-colors"
                    style={{ borderRadius: "6px", color: COLORS.navText }}
                    title="Back to app"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-6 h-px my-2" style={{ background: COLORS.border }} />
                  {SETTINGS_SECTIONS.flatMap(s => s.items).map((item) => {
                    const Icon = item.icon;
                    const isActive = settingsPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSettingsPageChange(item.id)}
                        className="p-2.5 transition-colors"
                        style={{ borderRadius: "6px", color: isActive ? COLORS.orange : COLORS.navText }}
                        title={item.label}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                NAV_SECTIONS.map((section, idx) => (
                  <div key={section.label} className="flex flex-col items-center gap-1 w-full px-2">
                    {idx > 0 && <div className="w-6 h-px my-2" style={{ background: COLORS.border }} />}
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeId === item.id || (item.children && item.children.some(c => c.id === activeId));
                      return (
                        <button key={item.id} onClick={() => { if (item.children) { setSidebarOpen(true); toggleExpand(item.id); } else { handleNavSelect(item.id); }}} className="p-2.5 transition-colors" style={{ borderRadius: "6px", color: isActive ? COLORS.orange : COLORS.navText }} title={item.label}>
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </nav>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-y-auto">
            {inSettings ? (
              <div className="px-8 py-6" style={{ maxWidth: selectedMember ? "1100px" : "900px" }}>
                {renderSettingsContent()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Select a page from the sidebar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
