import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, Zap, ClipboardList, Ticket, Phone, FolderKanban, BookOpen, Building2, Landmark, Truck, Users, Calculator, FileSpreadsheet, Settings, UserCog, Plug, Search, Upload, FileText, Eye, Replace, X, MapPin, ExternalLink, Download, Trash2, MoreHorizontal, CloudUpload, Info } from "lucide-react";

const NAV_SECTIONS = [
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

const TABS = ["Details", "Wages", "Benefits", "Documents"];

const MAPPING_DATA = [
  { internal: "General Foreman", union: "11:General Foreman" },
  { internal: "Foreman", union: "11:Foreman" },
  { internal: "Lead Lineman", union: "11:Head Lineman" },
  { internal: "Journeyman Lineman", union: null, expandable: true, children: [
    { union: "11:Journeyman Lineman" },
    { union: "11:Journeyman Traffic Signal Tech." },
  ]},
  { internal: "Apprentice 7", union: "12:Apprentice 7th Period" },
  { internal: "Apprentice 6", union: "12:Apprentice 6th Period" },
  { internal: "Apprentice 5", union: "12:Apprentice 5th Period" },
  { internal: "Apprentice 4", union: "12:Apprentice 4th Period" },
  { internal: "Apprentice 3", union: "12:Apprentice 3rd Period" },
  { internal: "Apprentice 2", union: "12:Apprentice 2nd Period" },
  { internal: "Apprentice 1", union: "12:Apprentice 1st Period" },
  { internal: "Equipment Operator", union: null, expandable: true, children: [
    { union: "13:Equipment Op A" },
    { union: "13:Equipment Op B" },
  ]},
  { internal: "Groundman / Driver", union: null, expandable: true, children: [
    { union: "13:Driver Groundman" },
    { union: "13:Driver Groundman-Inexp." },
  ]},
];

const WAGES_DATA = [
  { internal: "General Foreman", union: "11:General Foreman", st: "$71.96", ot: "$107.94", dt: "$143.92" },
  { internal: "Foreman", union: "11:Foreman", st: "$67.77", ot: "$101.66", dt: "$135.54" },
  { internal: "Lead Lineman", union: "11:Head Lineman", st: "$64.77", ot: "$97.16", dt: "$129.54" },
  { internal: "Journeyman Lineman", union: "11:Journeyman Lineman", st: "$59.88", ot: "$89.82", dt: "$119.76" },
  { internal: "Journeyman Lineman", union: "11:Journeyman Traffic Signal Tech.", st: "$59.88", ot: "$89.82", dt: "$119.76" },
  { internal: "Journeyman Lineman", union: "11:Substation Technician", st: "$59.88", ot: "$89.82", dt: "$119.76" },
  { internal: "Apprentice 7", union: "12:Apprentice 7th Period", st: "$53.97", ot: "$80.96", dt: "$107.94" },
  { internal: "Apprentice 6", union: "12:Apprentice 6th Period", st: "$50.97", ot: "$76.46", dt: "$101.94" },
  { internal: "Apprentice 5", union: "12:Apprentice 5th Period", st: "$47.98", ot: "$71.97", dt: "$95.96" },
  { internal: "Apprentice 4", union: "12:Apprentice 4th Period", st: "$44.98", ot: "$67.47", dt: "$89.96" },
  { internal: "Apprentice 3", union: "12:Apprentice 3rd Period", st: "$41.98", ot: "$62.97", dt: "$83.96" },
  { internal: "Apprentice 2", union: "12:Apprentice 2nd Period", st: "$38.98", ot: "$58.47", dt: "$77.96" },
  { internal: "Apprentice 1", union: "12:Apprentice 1st Period", st: "$35.98", ot: "$53.97", dt: "$71.96" },
  { internal: "Equipment Operator", union: "13:Equipment Op A", st: "$50.97", ot: "$76.46", dt: "$101.94" },
  { internal: "Equipment Operator", union: "13:Equipment Op B", st: "$44.98", ot: "$67.47", dt: "$89.96" },
  { internal: "Groundman / Driver", union: "13:Driver Groundman", st: "$35.37", ot: "$53.05", dt: "$70.74" },
  { internal: "Groundman / Driver", union: "13:Driver Groundman-Inexp.", st: "$27.79", ot: "$41.69", dt: "$55.58" },
  { internal: null, union: "13:Flagman", st: "$24.50", ot: "$36.75", dt: "$49.00" },
];

const BENEFITS_DATA = [
  { package: "Union Dues", rateOfPay: "% of gross", liableParty: "Employee", amount: "3%" },
  { package: "Administrative Maintenance Fund", rateOfPay: "% of gross", liableParty: "Employer", amount: "0.20%" },
  { package: "Apprenticeship Dues", rateOfPay: "% of gross", liableParty: "Employer", amount: "1.50%" },
  { package: "Line Construction Benefit Fund", rateOfPay: "Per hour", liableParty: "Employer", amount: "$7.50" },
  { package: "Line Construction Health Reimbursement Account", rateOfPay: "Per hour", liableParty: "Employer", amount: "Class-specific", classSpecific: true, children: [
    { classification: "Foreman", amount: "$3.75" },
    { classification: "General Foreman", amount: "$3.75" },
    { classification: "Head Lineman", amount: "$3.50" },
    { classification: "Journeyman Lineman", amount: "$3.25" },
    { classification: "Apprentice 7th Period", amount: "$2.75" },
    { classification: "Apprentice 6th Period", amount: "$2.50" },
    { classification: "Apprentice 5th Period", amount: "$2.25" },
    { classification: "Apprentice 4th Period", amount: "$2.00" },
    { classification: "Equipment Op A", amount: "$2.50" },
    { classification: "Equipment Op B", amount: "$2.00" },
    { classification: "Driver Groundman", amount: "$1.75" },
  ]},
  { package: "National Electrical Annuity Plan", rateOfPay: "% of gross", liableParty: "Employer", amount: "25%" },
  { package: "National Electrical Benefit Fund", rateOfPay: "% of gross", liableParty: "Employer", amount: "3%" },
  { package: "National Labor-Management Cooperation Committee", rateOfPay: "Per hour", liableParty: "Employer", amount: "$0.01" },
  { package: "IBEW Pension Benefit Fund", rateOfPay: "Per hour", liableParty: "Employer", amount: "$12.00" },
  { package: "Health & Welfare", rateOfPay: "Per hour", liableParty: "Employer", amount: "$15.25" },
];

const CUSTOMER_DOCS = [
  { name: "Letter_of_Assent_PowerGrid_2025.pdf", type: "Letter of Assent", size: "245 KB", uploadedBy: "Ben Glatt", uploadedAt: "Mar 12, 2025" },
  { name: "COI_PowerGrid_Services_2025.pdf", type: "Certificate of Insurance", size: "1.2 MB", uploadedBy: "Ben Glatt", uploadedAt: "Feb 28, 2025" },
  { name: "Safety_Orientation_Completion.pdf", type: "Safety Documentation", size: "892 KB", uploadedBy: "Sarah Chen", uploadedAt: "Jan 15, 2025" },
  { name: "Drug_Testing_Policy_Acknowledgment.pdf", type: "Compliance", size: "156 KB", uploadedBy: "Ben Glatt", uploadedAt: "Jan 10, 2025" },
  { name: "Subcontractor_Agreement_LU2_2024.pdf", type: "Agreement", size: "2.1 MB", uploadedBy: "Sarah Chen", uploadedAt: "Dec 05, 2024" },
];

function InfoTooltip({ text }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const showTip = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    }
    setVisible(true);
  };

  return (
    <div style={{ display: "inline-flex" }}>
      <button
        ref={btnRef}
        onMouseEnter={showTip}
        onMouseLeave={() => setVisible(false)}
        className="text-gray-300 transition-colors"
        style={{ cursor: "pointer", lineHeight: 0 }}
      >
        <Info size={15} />
      </button>
      {visible && (
        <div style={{
          position: "fixed", top: pos.top, left: pos.left, transform: "translate(-50%, -100%)",
          background: "#111827", color: "white", fontSize: "12px", lineHeight: "1.4",
          padding: "6px 10px", borderRadius: "6px", whiteSpace: "nowrap", zIndex: 9999,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          {text}
          <div style={{
            position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: "8px", height: "8px", background: "#111827",
          }} />
        </div>
      )}
    </div>
  );
}

function UploadModal({ isOpen, onClose }) {
  const [dragOver, setDragOver] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full" style={{ maxWidth: "480px" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Upload Document</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 transition-colors" style={{ cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Document Type</label>
            <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white" style={{ appearance: "none", outline: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }} onFocus={(e) => e.target.style.borderColor = "#9CA3AF"} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}>
              <option>Select a type...</option>
              <option>Letter of Assent</option>
              <option>Certificate of Insurance</option>
              <option>Safety Documentation</option>
              <option>Compliance</option>
              <option>Agreement</option>
              <option>Other</option>
            </select>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => setDragOver(false)}
            className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-10 transition-colors"
            style={{ borderColor: dragOver ? "#F4722B" : "#E5E7EB", background: dragOver ? "#FFF7ED" : "#FAFAFA" }}
          >
            <CloudUpload size={28} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-600 mb-1">Drag and drop your file here, or</p>
            <button className="text-sm font-medium transition-colors" style={{ color: "#F4722B", cursor: "pointer" }}>browse files</button>
            <p className="text-xs text-gray-400 mt-2">PDF, DOCX, XLSX, or images up to 50 MB</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-200 transition-colors" style={{ cursor: "pointer" }}>Cancel</button>
          <button className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors" style={{ background: "#111827", cursor: "pointer" }}>Upload</button>
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc, onView }) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <tr
      className="border-t border-gray-100 transition-colors"
      style={{ background: hovered ? "#f9f9fb" : "white" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#FEF2F2" }}>
            <FileText size={13} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{doc.size}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#F3F4F6", color: "#374151" }}>{doc.type}</span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{doc.uploadedBy}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{doc.uploadedAt}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end" ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1 rounded transition-colors"
            style={{ color: hovered ? "#6B7280" : "#D1D5DB", cursor: "pointer" }}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", right: 0, background: "white",
              border: "1px solid #E5E7EB", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 50, padding: "4px", minWidth: "140px",
            }}>
              {[
                { icon: Eye, label: "View", action: onView },
                { icon: Download, label: "Download" },
                { icon: Trash2, label: "Delete", danger: true },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => { setMenuOpen(false); item.action && item.action(); }}
                    className="w-full flex items-center gap-2 text-sm text-left px-2.5 py-1.5 rounded transition-colors"
                    style={{ color: item.danger ? "#EF4444" : "#374151", cursor: "pointer" }}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

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

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 px-3 mb-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function Tab({ label, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative pb-3 text-sm transition-colors"
      style={{
        color: isActive ? "#111827" : hovered ? "#374151" : "#9CA3AF",
        fontWeight: isActive ? 600 : 400,
      }}
    >
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "6px",
          background: !isActive && hovered ? "rgba(228,227,232,0.5)" : "transparent",
          transition: "background 150ms",
        }}
      >
        {label}
      </span>
      {isActive && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "2px", background: "#F4722B", borderRadius: "1px" }}
        />
      )}
    </button>
  );
}

function DocumentLink({ name, dates, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-3 py-2.5 px-3 text-left transition-colors"
      style={{
        borderRadius: "8px",
        background: hovered ? "rgba(228,227,232,0.35)" : "transparent",
      }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#FEF2F2" }}>
        <FileText size={14} style={{ color: "#EF4444" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
        <div className="text-xs text-gray-400 mt-0.5">{dates}</div>
      </div>
      <ExternalLink size={14} className="flex-shrink-0" style={{ color: hovered ? "#6B7280" : "#D1D5DB" }} />
    </button>
  );
}

function SlideOverPanel({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} style={{ transition: "opacity 200ms" }} />
      <div className="relative w-full max-w-2xl bg-white shadow-xl flex flex-col" style={{ animation: "slideIn 200ms ease-out" }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function DetailsCard({ title, description, fileName, dates, onView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="rounded-lg border border-gray-200 bg-white" style={{ padding: "20px 24px" }}>
      <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-sm text-gray-500 mb-4">{description}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#FEF2F2" }}>
            <FileText size={14} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <div className="text-sm text-gray-900 truncate" style={{ maxWidth: "400px" }}>{fileName}</div>
            <div className="text-xs text-gray-400 mt-0.5">{dates}</div>
          </div>
        </div>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onView}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: hovered ? "#111827" : "#6B7280" }}
        >
          <span>View</span>
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}

function DocTableRow({ doc, onView }) {
  const [hovered, setHovered] = useState(false);
  const isExpired = doc.status === "expired";
  return (
    <tr
      className="border-t border-gray-100 transition-colors cursor-pointer"
      style={{ background: hovered ? "#f9f9fb" : "white" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: "#FEF2F2" }}>
            <FileText size={13} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <div className={`text-sm font-medium ${isExpired ? "text-gray-400" : "text-gray-900"}`}>{doc.type}</div>
            <div className="text-xs text-gray-400 truncate" style={{ maxWidth: "280px" }}>{doc.file}</div>
          </div>
        </div>
      </td>
      <td className={`px-4 py-3 text-sm ${isExpired ? "text-gray-400" : "text-gray-600"}`}>{doc.agreement}</td>
      <td className={`px-4 py-3 text-sm ${isExpired ? "text-gray-400" : "text-gray-600"}`}>{doc.start}</td>
      <td className={`px-4 py-3 text-sm ${isExpired ? "text-red-400" : "text-gray-600"}`}>{doc.end}</td>
      <td className="px-4 py-3">
        {isExpired ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200">
            Expired
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <ExternalLink size={14} style={{ color: hovered ? "#6B7280" : "#D1D5DB" }} />
      </td>
    </tr>
  );
}

function JurisdictionLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-1.5 text-sm transition-colors"
      style={{
        color: hovered ? "#111827" : "#6B7280",
      }}
    >
      <span>View on Map</span>
      <ExternalLink size={13} />
    </button>
  );
}

function MappingRow({ row }) {
  const [hovered, setHovered] = useState(false);
  const hasChildren = row.expandable && row.children;
  const unions = hasChildren ? row.children.map((c) => c.union) : row.union ? [row.union] : [];

  return (
    <tr
      className="border-t border-gray-100 transition-colors"
      style={{ background: hovered ? "#f9f9fb" : "white" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {row.internal}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {unions.join(", ")}
      </td>
    </tr>
  );
}

function CustomSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500">{label}</span>}
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm bg-white"
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "5px 10px 5px 14px",
            color: "#374151",
            fontWeight: 500,
            cursor: "pointer",
            minWidth: 0,
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{selected.label}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }}>
            <path d="M3 4.5L6 7.5L9 4.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
              zIndex: 50,
              minWidth: "180px",
              padding: "4px",
              overflow: "hidden",
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              const isHovered = hovered === i;
              const statusColors = {
                active: "#059669",
                upcoming: "#D97706",
                expired: "#9CA3AF",
              };
              const sc = opt.status ? statusColors[opt.status] : null;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full flex items-center justify-between text-sm text-left"
                  style={{
                    padding: "7px 10px",
                    borderRadius: "6px",
                    color: isSelected ? "#111827" : "#374151",
                    fontWeight: isSelected ? 500 : 400,
                    background: isHovered ? "#f4f4f5" : "transparent",
                    cursor: "pointer",
                    border: "none",
                    transition: "background 100ms",
                  }}
                >
                  <span className="flex items-center gap-2" style={{ whiteSpace: "nowrap" }}>
                    {opt.displayLabel || opt.label}
                    {sc && (
                      <span style={{ fontSize: "12px", fontWeight: 500, color: sc }}>
                        {opt.status.charAt(0).toUpperCase() + opt.status.slice(1)}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginLeft: "8px" }}>
                      <path d="M3 7.5L5.5 10L11 4" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function WageRow({ row, isFirstInGroup, isLastInGroup }) {
  const [hovered, setHovered] = useState(false);
  const isUnmapped = !row.internal;
  return (
    <tr
      className="border-t border-gray-100 transition-colors"
      style={{ background: hovered ? "#f9f9fb" : "white" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="px-4 py-3 text-sm font-medium">
        {isUnmapped ? (
          <span className="text-gray-400 font-normal" style={{ fontStyle: "italic" }}>Not mapped</span>
        ) : isFirstInGroup ? (
          <span className="text-gray-900">{row.internal}</span>
        ) : (
          <span className="text-gray-300">{row.internal}</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{row.union}</td>
      <td className="px-4 py-3 text-sm text-gray-700 tabular-nums text-right">{row.st}</td>
      <td className="px-4 py-3 text-sm text-gray-700 tabular-nums text-right">{row.ot}</td>
      <td className="px-4 py-3 text-sm text-gray-700 tabular-nums text-right">{row.dt}</td>
    </tr>
  );
}

function BenefitRow({ row }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasChildren = row.classSpecific && row.children;

  return (
    <>
      <tr
        className="border-t border-gray-100 transition-colors"
        style={{ background: hovered ? "#f9f9fb" : "white", cursor: hasChildren ? "pointer" : "default" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.package}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{row.rateOfPay}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{row.liableParty}</td>
        <td className="px-4 py-3 text-sm text-gray-700 tabular-nums text-right">
          <div className="flex items-center justify-end gap-2">
            <span>{row.amount}</span>
            {hasChildren && (
              <ChevronRight
                size={14}
                className="text-gray-400 flex-shrink-0 transition-transform"
                style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            )}
          </div>
        </td>
      </tr>
      {expanded && row.children.map((child, ci) => (
        <tr key={ci} className="border-t border-gray-100" style={{ background: "white" }}>
          <td className="py-2.5 text-sm text-gray-500" style={{ paddingLeft: "32px", paddingRight: "16px" }}>
            {child.classification}
          </td>
          <td className="px-4 py-2.5 text-sm text-gray-700" />
          <td className="px-4 py-2.5 text-sm text-gray-700" />
          <td className="px-4 py-2.5 text-sm text-gray-700 tabular-nums text-right">{child.amount}</td>
        </tr>
      ))}
    </>
  );
}

function InfoRow({ label, value, noBorder }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${noBorder ? "" : "border-b border-gray-100"}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export default function GridbaseDetailView() {
  const [activeId, setActiveId] = useState("agreements");
  const [expanded, setExpanded] = useState(["unions"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Details");
  const [viewingDoc, setViewingDoc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState("lu2");
  const [selectedDate, setSelectedDate] = useState("2025-08-31");

  const toggleExpand = (id) => {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col" style={{ height: "100vh", width: "100%", background: "#F9FAFB", fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css');`}</style>

      {/* Top bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center flex-shrink-0 z-10">
        <div className="flex items-center h-full">
          <div className={`flex items-center justify-between px-3 h-full transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: "#fafafa", borderRight: "1px solid #E5E7EB" }}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#4D4D4D" }}>
                    <Zap size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#4D4D4D" }}>Gridbase</div>
                    <div className="text-[11px]" style={{ color: "#9CA3AF" }}>PowerGrid Services</div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
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
            <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">Data</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">Unions</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">Agreements</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-medium text-gray-900">LU 2</span>
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
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeId === item.id || (item.children && item.children.some(c => c.id === activeId));
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.children) {
                            setSidebarOpen(true);
                            setExpanded(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
                          } else {
                            setActiveId(item.id);
                          }
                        }}
                        className="p-2.5 transition-colors"
                        style={{
                          borderRadius: "6px",
                          ...(isActive ? { color: "#F4722B" } : { color: "#4D4D4D" }),
                        }}
                        title={item.label}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-y-auto">
            {/* Page header */}
            <div className="px-6 pt-6">
              <div className="mb-1">
                <h1 className="text-xl font-semibold text-gray-900">Local Union 2</h1>
              </div>
              <p className="text-sm text-gray-500">St. Louis, Missouri</p>

              {/* Tabs */}
              <div className="flex items-center gap-6 mt-6 border-b border-gray-200">
                {TABS.map((tab) => (
                  <Tab
                    key={tab}
                    label={tab}
                    isActive={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-6 py-6">
              {activeTab === "Details" && (
                <div>
                  {/* Contact Info + Jurisdiction row */}
                  <div className="flex gap-6">
                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Contact Info</h3>
                      </div>
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-500" style={{ width: "120px" }}>HQ</td>
                              <td className="px-4 py-3 text-sm text-gray-900">St. Louis, MO</td>
                            </tr>
                            <tr className="border-t border-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-500">Phone</td>
                              <td className="px-4 py-3 text-sm text-gray-900">(314) 555-0142</td>
                            </tr>
                            <tr className="border-t border-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-500">Website</td>
                              <td className="px-4 py-3 text-sm text-blue-600">ibew2.org</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Jurisdiction */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Jurisdiction</h3>
                        <JurisdictionLink />
                      </div>
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-500" style={{ width: "120px" }}>State</td>
                              <td className="px-4 py-3 text-sm text-gray-900">Missouri</td>
                            </tr>
                            <tr className="border-t border-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-500">Counties</td>
                              <td className="px-4 py-3 text-sm text-gray-900">14</td>
                            </tr>
                            <tr className="border-t border-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-500">District</td>
                              <td className="px-4 py-3 text-sm text-gray-900">IBEW District 6</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Key Documents table */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Key Documents</h3>
                    </div>
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: "#f9f9fb" }}>
                            <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Document</th>
                            <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Agreement</th>
                            <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Effective</th>
                            <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Expires</th>
                            <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Status</th>
                            <th className="px-4 py-2.5" style={{ width: "60px" }} />
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { type: "Union Contract", agreement: "LU 2", file: "IO_apprvd_Power-Comm_24-27_with_map_and_counties.pdf", start: "10/10/2022", end: "03/14/2026", status: "active" },
                            { type: "Wages & Benefits", agreement: "LU 2", file: "MO_Valley_wages_24-27_1_.pdf", start: "12/08/2024", end: "12/08/2026", status: "active" },
                            { type: "Union Contract", agreement: "LU 2", file: "IO_apprvd_Power-Comm_20-24.pdf", start: "06/01/2020", end: "10/09/2022", status: "expired" },
                            { type: "Wages & Benefits", agreement: "LU 2", file: "MO_Valley_wages_20-24.pdf", start: "06/01/2020", end: "12/07/2024", status: "expired" },
                          ].map((doc, i) => (
                            <DocTableRow
                              key={i}
                              doc={doc}
                              onView={() => setViewingDoc({ title: doc.type, file: doc.file })}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Wages" && (
                <div>
                  {/* Header with selectors */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Wages</h3>
                    <div className="flex items-center gap-4">
                      <CustomSelect
                        label="Agreement:"
                        value={selectedAgreement}
                        onChange={setSelectedAgreement}
                        options={[
                          { value: "lu2", label: "LU 2 Wage Agreement" },
                        ]}
                      />
                      <CustomSelect
                        label="Effective Period:"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        options={[
                          { value: "2026-08-31", label: "08/31/2025 – 08/31/2026 (Upcoming)", displayLabel: "08/31/2025 – 08/31/2026", status: "upcoming" },
                          { value: "2025-08-31", label: "08/31/2024 – 08/31/2025 (Active)", displayLabel: "08/31/2024 – 08/31/2025", status: "active" },
                          { value: "2024-08-31", label: "08/31/2023 – 08/31/2024 (Expired)", displayLabel: "08/31/2023 – 08/31/2024", status: "expired" },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Wages table */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#f9f9fb" }}>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Internal Classification</th>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Union Classification</th>
                          <th className="text-right text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>ST Wage</th>
                          <th className="text-right text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>OT Wage</th>
                          <th className="text-right text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>DT Wage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WAGES_DATA.map((row, i) => {
                          const prevInternal = i > 0 ? WAGES_DATA[i - 1].internal : "__none__";
                          const isFirstInGroup = !row.internal || row.internal !== prevInternal;
                          const nextInternal = i < WAGES_DATA.length - 1 ? WAGES_DATA[i + 1].internal : "__none__";
                          const isLastInGroup = !row.internal || row.internal !== nextInternal;
                          return (
                            <WageRow key={i} row={row} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "Benefits" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Benefits</h3>
                    <div className="flex items-center gap-4">
                      <CustomSelect
                        label="Agreement:"
                        value={selectedAgreement}
                        onChange={setSelectedAgreement}
                        options={[
                          { value: "lu2", label: "LU 2 Wage Agreement" },
                        ]}
                      />
                      <CustomSelect
                        label="Effective Period:"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        options={[
                          { value: "2026-08-31", label: "08/31/2025 – 08/31/2026 (Upcoming)", displayLabel: "08/31/2025 – 08/31/2026", status: "upcoming" },
                          { value: "2025-08-31", label: "08/31/2024 – 08/31/2025 (Active)", displayLabel: "08/31/2024 – 08/31/2025", status: "active" },
                          { value: "2024-08-31", label: "08/31/2023 – 08/31/2024 (Expired)", displayLabel: "08/31/2023 – 08/31/2024", status: "expired" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#f9f9fb" }}>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Package</th>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Rate of Pay</th>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Liable Party</th>
                          <th className="text-right text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BENEFITS_DATA.map((row, i) => (
                          <BenefitRow key={i} row={row} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "Documents" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">Documents</h3>
                      <InfoTooltip text="Documents uploaded here are visible to all users in your organization." />
                    </div>
                    <button
                      onClick={() => setShowUpload(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors"
                      style={{ background: "#111827", cursor: "pointer" }}
                    >
                      <Upload size={14} />
                      Upload
                    </button>
                  </div>

                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#f9f9fb" }}>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Document</th>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Type</th>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Uploaded By</th>
                          <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Date</th>
                          <th className="px-4 py-2.5" style={{ width: "48px" }} />
                        </tr>
                      </thead>
                      <tbody>
                        {CUSTOMER_DOCS.map((doc, i) => (
                          <DocRow
                            key={i}
                            doc={doc}
                            onView={() => setViewingDoc({ title: doc.type, file: doc.name })}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document slide-over panel */}
      <SlideOverPanel
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        title={viewingDoc?.title || ""}
      >
        <div className="flex flex-col items-center justify-center h-full" style={{ background: "#F8FAFC" }}>
          <div className="text-center">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: "#FEF2F2" }}>
              <FileText size={24} style={{ color: "#EF4444" }} />
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">{viewingDoc?.file}</div>
            <div className="text-xs text-gray-400">PDF viewer will render here</div>
          </div>
        </div>
      </SlideOverPanel>
      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </div>
  );
}
