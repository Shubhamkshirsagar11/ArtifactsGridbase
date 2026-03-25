import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, Zap, ClipboardList, Ticket, Phone, FolderKanban, BookOpen, Building2, Landmark, Truck, Users, Calculator, FileSpreadsheet, Settings, UserCog, Plug, Search, Check, MoreHorizontal } from "lucide-react";

const ORG_TREE = {
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


const unions = [
  { name: "LU 2", state: "Missouri", contract: "Expires 08/31/2026", contractOk: true, wages: "Expires 08/31/2025", wagesOk: false, mapping: "Complete" },
  { name: "LU 9", state: "Illinois", contract: "Expires 12/15/2026", contractOk: true, wages: "Expires 12/15/2026", wagesOk: true, mapping: "Complete" },
  { name: "LU 42", state: "Connecticut", contract: "Expired 03/01/2025", contractOk: false, wages: "Expired 03/01/2025", wagesOk: false, mapping: "Incomplete" },
  { name: "LU 104S", state: "Massachusetts", contract: "Expires 06/30/2026", contractOk: true, wages: "Expires 06/30/2026", wagesOk: true, mapping: "Complete" },
  { name: "LU 1049", state: "New York", contract: "Expires 05/31/2027", contractOk: true, wages: "Expires 05/31/2026", wagesOk: true, mapping: "Complete" },
];

function NavItem({ item, activeId, onSelect, expanded, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const [hoveredChild, setHoveredChild] = useState(null);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded.includes(item.id);
  const isActive = activeId === item.id;
  const isParentActive = hasChildren && item.children.some(c => c.id === activeId);
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

// Gather all selectable org IDs from the tree (includes holding company)
function getAllOrgIds() {
  const ids = [ORG_TREE.id]; // holding company as standalone entity
  for (const sub of ORG_TREE.children) {
    ids.push(sub.id);
    if (sub.children) sub.children.forEach(gc => ids.push(gc.id));
  }
  return ids;
}

function getGroupIds(sub) {
  const ids = [sub.id];
  if (sub.children) sub.children.forEach(gc => ids.push(gc.id));
  return ids;
}

function OrgCheckbox({ checked, indeterminate, onChange, label, isBold, indent = 0, hovered, onHover, onLeave }) {
  return (
    <button
      onClick={onChange}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors"
      style={{
        borderRadius: "6px",
        paddingLeft: `${10 + indent * 16}px`,
        paddingRight: "10px",
        color: isBold ? "#293037" : "#4D4D4D",
        fontWeight: isBold ? 500 : 400,
        ...(hovered ? { background: "rgba(228,227,232,0.5)" } : {}),
      }}
    >
      {/* Custom checkbox */}
      <span
        className="flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: checked || indeterminate ? "none" : "1.5px solid #D1D5DB",
          background: checked || indeterminate ? "#F4722B" : "white",
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && !checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 5H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function OrgSwitcher({ selectedOrgs, onChangeOrgs, isOpen, onToggle }) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const ref = useRef(null);
  const searchRef = useRef(null);

  const allIds = getAllOrgIds();

  useEffect(() => {
    if (isOpen && searchRef.current) searchRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onToggle(false);
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onToggle]);

  // Auto-expand groups that have selections
  useEffect(() => {
    if (isOpen) {
      const toExpand = [];
      for (const sub of ORG_TREE.children) {
        const groupIds = getGroupIds(sub);
        if (groupIds.some(id => selectedOrgs.has(id)) && !expandedGroups.includes(sub.id)) {
          toExpand.push(sub.id);
        }
      }
      if (toExpand.length) setExpandedGroups(prev => [...prev, ...toExpand]);
    }
  }, [isOpen]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const q = search.toLowerCase();

  const filterChildren = (children) => {
    if (!children) return [];
    return children.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const childMatch = c.children && c.children.some(gc => gc.name.toLowerCase().includes(q));
      return nameMatch || childMatch;
    });
  };

  const filteredSubs = filterChildren(ORG_TREE.children);
  const showAll = !q || "all organizations".includes(q);

  // Selection helpers
  const allChecked = allIds.every(id => selectedOrgs.has(id));
  const allIndeterminate = !allChecked && allIds.some(id => selectedOrgs.has(id));

  const toggleAll = () => {
    if (allChecked) {
      onChangeOrgs(new Set());
    } else {
      onChangeOrgs(new Set(allIds));
    }
  };

  const toggleGroupCheck = (sub) => {
    const groupIds = getGroupIds(sub);
    const allInGroupChecked = groupIds.every(id => selectedOrgs.has(id));
    const next = new Set(selectedOrgs);
    if (allInGroupChecked) {
      groupIds.forEach(id => next.delete(id));
    } else {
      groupIds.forEach(id => next.add(id));
    }
    onChangeOrgs(next);
  };

  const toggleSingle = (id) => {
    const next = new Set(selectedOrgs);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChangeOrgs(next);
  };

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
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Org list */}
        <div className="max-h-80 overflow-y-auto py-1 px-1.5">
          {/* All Organizations */}
          {showAll && (
            <OrgCheckbox
              checked={allChecked}
              indeterminate={allIndeterminate}
              onChange={toggleAll}
              label="All Organizations"
              isBold
              hovered={hoveredId === "all"}
              onHover={() => setHoveredId("all")}
              onLeave={() => setHoveredId(null)}
            />
          )}

          {showAll && (
            <div className="h-px bg-gray-100 mx-1.5 my-1" />
          )}

          {/* Holding company as standalone corporate entity */}
          {(!q || ORG_TREE.name.toLowerCase().includes(q) || "corporate".includes(q)) && (
            <OrgCheckbox
              checked={selectedOrgs.has(ORG_TREE.id)}
              onChange={() => toggleSingle(ORG_TREE.id)}
              label={ORG_TREE.name}
              isBold
              hovered={hoveredId === ORG_TREE.id}
              onHover={() => setHoveredId(ORG_TREE.id)}
              onLeave={() => setHoveredId(null)}
            />
          )}

          {/* Division groups */}
          {filteredSubs.map((sub) => {
            const isExpanded = expandedGroups.includes(sub.id) || q.length > 0;
            const subMatch = sub.name.toLowerCase().includes(q);
            const filteredGrandchildren = sub.children
              ? sub.children.filter(gc => !q || gc.name.toLowerCase().includes(q) || subMatch)
              : [];
            const groupIds = getGroupIds(sub);
            const groupAllChecked = groupIds.every(id => selectedOrgs.has(id));
            const groupIndeterminate = !groupAllChecked && groupIds.some(id => selectedOrgs.has(id));
            const groupHovered = hoveredId === `${sub.id}-header`;

            return (
              <div key={sub.id} className="mb-0.5">
                {/* Group header row — checkbox + expand */}
                <div
                  className="flex items-center transition-colors"
                  style={{
                    borderRadius: "6px",
                    ...(groupHovered ? { background: "rgba(228,227,232,0.3)" } : {}),
                  }}
                  onMouseEnter={() => setHoveredId(`${sub.id}-header`)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Checkbox for the whole group */}
                  <button
                    onClick={() => toggleGroupCheck(sub)}
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 34, height: 34 }}
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: groupAllChecked || groupIndeterminate ? "none" : "1.5px solid #D1D5DB",
                        background: groupAllChecked || groupIndeterminate ? "#F4722B" : "white",
                      }}
                    >
                      {groupAllChecked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {groupIndeterminate && !groupAllChecked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2.5 5H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                  </button>

                  {/* Clickable label area — expands/collapses */}
                  <button
                    onClick={() => toggleGroup(sub.id)}
                    className="flex-1 flex items-center justify-between py-2 pr-2.5 text-sm text-left"
                    style={{ color: "#293037", fontWeight: 500 }}
                  >
                    <span className="truncate">{sub.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-gray-400">{groupIds.length}</span>
                      {isExpanded
                        ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                        : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                      }
                    </span>
                  </button>
                </div>

                {/* Expanded: individual entities */}
                {isExpanded && (
                  <div className="mb-1">
                    {/* Parent org itself */}
                    <OrgCheckbox
                      checked={selectedOrgs.has(sub.id)}
                      onChange={() => toggleSingle(sub.id)}
                      label={sub.name}
                      indent={1}
                      hovered={hoveredId === sub.id}
                      onHover={() => setHoveredId(sub.id)}
                      onLeave={() => setHoveredId(null)}
                    />
                    {/* Child entities */}
                    {filteredGrandchildren.map((gc) => (
                      <OrgCheckbox
                        key={gc.id}
                        checked={selectedOrgs.has(gc.id)}
                        onChange={() => toggleSingle(gc.id)}
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

function CollapsedIcon({ item, activeId, onSelect, setSidebarOpen, setExpanded }) {
  const [hovered, setHovered] = useState(false);
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

export default function GridbaseSidebar() {
  const [activeId, setActiveId] = useState("agreements");
  const [expanded, setExpanded] = useState(["unions", "equipment"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Initialize with all of PowerGrid Distribution selected
  const [selectedOrgs, setSelectedOrgs] = useState(() => {
    const initial = new Set();
    const dist = ORG_TREE.children.find(c => c.id === "pg-distribution");
    if (dist) {
      initial.add(dist.id);
      if (dist.children) dist.children.forEach(gc => initial.add(gc.id));
    }
    return initial;
  });
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);

  // Helper to get display label for selection
  const allIds = getAllOrgIds();
  const getOrgLabel = () => {
    if (selectedOrgs.size === 0) return "No Selection";
    if (selectedOrgs.size === allIds.length) return "All Organizations";
    // Check if it's exactly one full group
    for (const sub of ORG_TREE.children) {
      const groupIds = getGroupIds(sub);
      if (groupIds.length === selectedOrgs.size && groupIds.every(id => selectedOrgs.has(id))) {
        return `All ${sub.name}`;
      }
    }
    // Check if it's a single org
    if (selectedOrgs.size === 1) {
      const id = [...selectedOrgs][0];
      if (id === ORG_TREE.id) return ORG_TREE.name;
      for (const sub of ORG_TREE.children) {
        if (sub.id === id) return sub.name;
        if (sub.children) for (const gc of sub.children) {
          if (gc.id === id) return gc.name;
        }
      }
    }
    return `${selectedOrgs.size} organizations`;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col" style={{ height: "100vh", width: "100%", background: "#F9FAFB", fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css');`}</style>
      {/* Top bar — full width */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center flex-shrink-0 z-10">
        <div className="flex items-center h-full">
          {/* Logo area with toggle inside */}
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
                    selectedOrgs={selectedOrgs}
                    onChangeOrgs={setSelectedOrgs}
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
            <span className="text-gray-400">Data</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400">Unions</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-medium text-gray-900">Agreements</span>
          </div>
        </div>

      </div>

      {/* Sidebar + content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — light gray background */}
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

        {/* Main content — white */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Page header */}
            <div className="mb-5">
              <h1 className="text-xl font-semibold text-gray-900">Agreements</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your unions and their data.</p>
            </div>

            {/* Search + action buttons row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 w-72">
                  <Search size={14} className="text-gray-400" />
                  <span>Search unions...</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#f9f9fb" }} className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Union</th>
                    <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Contract</th>
                    <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Wages & Benefits</th>
                    <th className="text-left text-xs font-medium px-4 py-2.5" style={{ color: "#2B333B" }}>Mapping</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {unions.map((union, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0 cursor-pointer transition-colors" style={{ background: "white" }} onMouseEnter={e => e.currentTarget.style.background = "#f9f9fb"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{union.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{union.state}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${union.contractOk ? "text-gray-700" : "text-red-500"}`}>{union.contract}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${union.wagesOk ? "text-gray-700" : "text-red-500"}`}>{union.wages}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${union.mapping === "Complete" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                          <span className={`w-1 h-1 rounded-full ${union.mapping === "Complete" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {union.mapping}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
