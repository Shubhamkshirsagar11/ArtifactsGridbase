/**
 * Subsidiary Access Manager — Admin Settings Prototype
 *
 * Purpose: A super admin at a holding company configures per-user,
 * per-subsidiary, per-module access permissions.
 *
 * Access model:
 *   1. Role-based defaults — A user's role determines baseline access
 *      to ALL subsidiaries. Admin/Editor = Full Access. Viewer = Read Only.
 *   2. Granular overrides — Super admin can override per user × subsidiary × module.
 *      Three levels: Full Access | Read Only | No Access.
 *      If no override exists, the role default applies.
 *
 * Key UI elements:
 *   - User selector dropdown (name, email, role)
 *   - Role default banner (communicates inherited baseline)
 *   - Permission matrix (rows = modules, columns = subsidiaries)
 *   - Subsidiary-level bulk controls (above each column)
 *   - Sticky save bar (appears only when changes exist)
 *
 * Critical UX insight: The visual distinction between "default" cells
 * and "overridden" cells answers "what did I explicitly change vs. what's inherited?"
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AccessLevel = "full" | "readonly" | "none";
type Role = "Admin" | "Editor" | "Viewer";
type SubBulk = "default" | "custom" | "none";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface Subsidiary {
  id: number;
  name: string;
  abbr: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 1, name: "Jane Smith", email: "jane@powergrid.com", role: "Editor" },
  { id: 2, name: "Bob Chen", email: "bob@powergrid.com", role: "Viewer" },
  { id: 3, name: "Sarah Johnson", email: "sarah@powergrid.com", role: "Admin" },
];

const SUBSIDIARIES: Subsidiary[] = [
  { id: 2, name: "Premium Utility", abbr: "Premium" },
  { id: 3, name: "CSR", abbr: "CSR" },
  { id: 4, name: "AMPP Electric", abbr: "AMPP" },
];

const MODULES = [
  "Bid Estimates",
  "Roster",
  "Invoice",
  "Timesheet",
  "Equipment",
  "Events",
  "Rate Calculator",
  "Union Management",
  "Settings",
];

const MODULE_ICONS: Record<string, string> = {
  "Bid Estimates": "📊",
  "Roster": "👥",
  "Invoice": "📄",
  "Timesheet": "⏱",
  "Equipment": "🚛",
  "Events": "⚡",
  "Rate Calculator": "🧮",
  "Union Management": "📋",
  "Settings": "⚙️",
};

function getRoleDefault(role: Role): AccessLevel {
  if (role === "Admin" || role === "Editor") return "full";
  return "readonly";
}

function accessLabel(level: AccessLevel): string {
  if (level === "full") return "Full Access";
  if (level === "readonly") return "Read Only";
  return "No Access";
}

// Override map: userId -> subId -> module -> AccessLevel
type OverrideMap = Record<number, Record<number, Record<string, AccessLevel>>>;

function buildInitialOverrides(): OverrideMap {
  return {
    1: {
      // Jane Smith (Editor)
      3: {
        // PowerGrid West
        "Bid Estimates": "readonly",
        Equipment: "readonly",
      },
      4: {
        // PowerGrid South — ALL modules = No Access
        ...Object.fromEntries(MODULES.map((m) => [m, "none" as AccessLevel])),
      },
    },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AccessBadge({
  level,
  isDefault,
  compact,
}: {
  level: AccessLevel;
  isDefault: boolean;
  compact?: boolean;
}) {
  const base = {
    full: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      border: "border-emerald-200",
    },
    readonly: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      border: "border-amber-200",
    },
    none: {
      bg: "bg-gray-50",
      text: "text-gray-400",
      dot: "bg-gray-300",
      border: "border-gray-200",
    },
  }[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium border ${base.bg} ${base.text} ${base.border} ${isDefault ? "opacity-50" : ""}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${base.dot} ${isDefault ? "" : "ring-1 ring-offset-1"}`}
        style={!isDefault ? { ringColor: base.dot } : {}}
      />
      {compact ? "" : accessLabel(level)}
      {isDefault && !compact && (
        <span className="text-[10px] opacity-70 ml-0.5">(default)</span>
      )}
    </span>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const colors = {
    Admin: "bg-violet-50 text-violet-700 border-violet-200",
    Editor: "bg-blue-50 text-blue-700 border-blue-200",
    Viewer: "bg-gray-50 text-gray-500 border-gray-200",
  }[role];
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${colors}`}
    >
      {role}
    </span>
  );
}

// ─── Cell Dropdown ────────────────────────────────────────────────────────────

function CellDropdown({
  value,
  isDefault,
  roleDefault,
  onChange,
}: {
  value: AccessLevel;
  isDefault: boolean;
  roleDefault: AccessLevel;
  onChange: (level: AccessLevel | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const options: { level: AccessLevel | null; label: string }[] = [
    { level: null, label: `Default (${accessLabel(roleDefault)})` },
    { level: "full", label: "Full Access" },
    { level: "readonly", label: "Read Only" },
    { level: "none", label: "No Access" },
  ];

  const colorMap: Record<AccessLevel, { bg: string; hoverBg: string; border: string }> = {
    full: { bg: "bg-emerald-50/60", hoverBg: "hover:bg-emerald-50", border: "border-emerald-200/60" },
    readonly: { bg: "bg-amber-50/60", hoverBg: "hover:bg-amber-50", border: "border-amber-200/60" },
    none: { bg: "bg-gray-50", hoverBg: "hover:bg-gray-100", border: "border-gray-200" },
  };

  const style = colorMap[value];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full h-9 flex items-center justify-between gap-1 rounded px-2.5 text-xs font-medium border transition-all duration-150
          ${style.bg} ${style.border} ${style.hoverBg}
          ${isDefault ? "opacity-50 hover:opacity-80" : ""}
          focus:outline-none focus:ring-2 focus:ring-orange-400/40`}
      >
        <span className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              { full: "bg-emerald-500", readonly: "bg-amber-500", none: "bg-gray-300" }[value]
            } ${!isDefault ? "ring-1 ring-offset-1 ring-current" : ""}`}
          />
          <span
            className={
              { full: "text-emerald-700", readonly: "text-amber-700", none: "text-gray-400" }[value]
            }
          >
            {accessLabel(value)}
          </span>
          {isDefault && (
            <span className="text-[10px] text-gray-400 font-normal">(default)</span>
          )}
        </span>
        {!isDefault && (
          <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" title="Overridden" />
        )}
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400 shrink-0">
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
          {options.map((opt) => {
            const isActive =
              opt.level === null ? isDefault : !isDefault && opt.level === value;
            return (
              <button
                key={opt.level ?? "default"}
                onClick={() => {
                  onChange(opt.level);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors
                  ${isActive ? "bg-gray-50 font-medium" : "hover:bg-gray-50"}`}
              >
                {opt.level !== null && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      { full: "bg-emerald-500", readonly: "bg-amber-500", none: "bg-gray-300" }[
                        opt.level
                      ]
                    }`}
                  />
                )}
                {opt.level === null && (
                  <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
                )}
                <span className="text-gray-700">{opt.label}</span>
                {isActive && (
                  <svg className="ml-auto text-gray-900" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Subsidiary Bulk Dropdown ─────────────────────────────────────────────────

function SubBulkControl({
  value,
  onChange,
}: {
  value: SubBulk;
  onChange: (v: SubBulk) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const label = { default: "Role Default", custom: "Custom", none: "No Access" }[value];
  const textColor = { default: "text-gray-500", custom: "text-blue-600", none: "text-red-500" }[value];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-[11px] font-medium ${textColor} hover:underline`}
      >
        {label}
        <svg width="8" height="8" viewBox="0 0 8 8" className="opacity-60">
          <path d="M1.5 3l2.5 2.5L6.5 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1">
          {(
            [
              ["default", "Role Default", "Clears all overrides"],
              ["custom", "Custom", "Set per-module access"],
              ["none", "No Access", "Block all modules"],
            ] as [SubBulk, string, string][]
          ).map(([v, l, desc]) => (
            <button
              key={v}
              onClick={() => {
                onChange(v);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${
                value === v ? "bg-gray-50" : ""
              }`}
            >
              <div className="font-medium text-gray-700">{l}</div>
              <div className="text-[10px] text-gray-400">{desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SubsidiaryAccessManager() {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [overrides, setOverrides] = useState<OverrideMap>(buildInitialOverrides);
  const [savedOverrides, setSavedOverrides] = useState<OverrideMap>(buildInitialOverrides);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const userDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (userDropRef.current && !userDropRef.current.contains(e.target as Node))
        setUserDropdownOpen(false);
    }
    if (userDropdownOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [userDropdownOpen]);

  const selectedUser = USERS.find((u) => u.id === selectedUserId)!;
  const roleDefault = getRoleDefault(selectedUser.role);

  // Effective access for a cell
  const getEffective = useCallback(
    (userId: number, subId: number, mod: string): { level: AccessLevel; isDefault: boolean } => {
      const userOv = overrides[userId];
      if (userOv) {
        const subOv = userOv[subId];
        if (subOv && mod in subOv) {
          return { level: subOv[mod], isDefault: false };
        }
      }
      return { level: getRoleDefault(USERS.find((u) => u.id === userId)!.role), isDefault: true };
    },
    [overrides],
  );

  // Determine subsidiary bulk state
  const getSubBulk = useCallback(
    (userId: number, subId: number): SubBulk => {
      const userOv = overrides[userId];
      if (!userOv || !userOv[subId]) return "default";
      const subOv = userOv[subId];
      const keys = Object.keys(subOv);
      if (keys.length === 0) return "default";
      const allNone = MODULES.every((m) => subOv[m] === "none");
      if (allNone && keys.length === MODULES.length) return "none";
      return "custom";
    },
    [overrides],
  );

  // Set override for a single cell
  const setCellOverride = useCallback(
    (userId: number, subId: number, mod: string, level: AccessLevel | null) => {
      setOverrides((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as OverrideMap;
        if (level === null) {
          // Clear override
          if (next[userId]?.[subId]) {
            delete next[userId][subId][mod];
            if (Object.keys(next[userId][subId]).length === 0) delete next[userId][subId];
            if (Object.keys(next[userId]).length === 0) delete next[userId];
          }
        } else {
          if (!next[userId]) next[userId] = {};
          if (!next[userId][subId]) next[userId][subId] = {};
          // If the override matches the role default, still store it (explicit override)
          next[userId][subId][mod] = level;
        }
        return next;
      });
    },
    [],
  );

  // Subsidiary bulk action
  const setSubBulk = useCallback(
    (userId: number, subId: number, action: SubBulk) => {
      setOverrides((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as OverrideMap;
        if (action === "default") {
          if (next[userId]?.[subId]) {
            delete next[userId][subId];
            if (Object.keys(next[userId]).length === 0) delete next[userId];
          }
        } else if (action === "none") {
          if (!next[userId]) next[userId] = {};
          next[userId][subId] = Object.fromEntries(MODULES.map((m) => [m, "none" as AccessLevel]));
        }
        // "custom" is implicit — user sets cells individually
        return next;
      });
    },
    [],
  );

  // Dirty check
  const isDirty = useMemo(
    () => JSON.stringify(overrides) !== JSON.stringify(savedOverrides),
    [overrides, savedOverrides],
  );

  // Count overrides for selected user
  const overrideCount = useMemo(() => {
    const userOv = overrides[selectedUserId];
    if (!userOv) return 0;
    return Object.values(userOv).reduce(
      (sum, subOv) => sum + Object.keys(subOv).length,
      0,
    );
  }, [overrides, selectedUserId]);

  const handleSave = () => {
    setSavedOverrides(JSON.parse(JSON.stringify(overrides)));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleDiscard = () => {
    setOverrides(JSON.parse(JSON.stringify(savedOverrides)));
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* ── Page Container ───────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 py-8 pb-28">
        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>Settings</span>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3.5 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            <span className="text-gray-600">Access Management</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Subsidiary Access Manager
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Configure what each user can see and do across subsidiaries and modules.
              </p>
            </div>
            {overrideCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {overrideCount} override{overrideCount !== 1 ? "s" : ""} set
              </div>
            )}
          </div>
        </div>

        {/* ── User Selector ────────────────────────────────────────── */}
        <div className="mb-4" ref={userDropRef}>
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Select User
          </label>
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full max-w-md flex items-center gap-3 bg-white border border-gray-200 rounded-md px-3 py-2.5 text-left hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              <UserAvatar name={selectedUser.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedUser.name}
                  </span>
                  <RoleBadge role={selectedUser.role} />
                </div>
                <span className="text-xs text-gray-400">{selectedUser.email}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-400 shrink-0">
                <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {userDropdownOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg py-1">
                {USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                      u.id === selectedUserId ? "bg-gray-50" : ""
                    }`}
                  >
                    <UserAvatar name={u.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {u.name}
                        </span>
                        <RoleBadge role={u.role} />
                      </div>
                      <span className="text-xs text-gray-400">{u.email}</span>
                    </div>
                    {u.id === selectedUserId && (
                      <svg className="text-gray-900 shrink-0" width="14" height="14" viewBox="0 0 14 14">
                        <path d="M3 7l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Role Default Banner ──────────────────────────────────── */}
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 mb-6">
          <svg width="14" height="14" viewBox="0 0 14 14" className="text-gray-400 shrink-0">
            <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 6.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r="0.7" fill="currentColor" />
          </svg>
          <p className="text-xs text-gray-600">
            <span className="font-medium text-gray-700">Default access:</span>{" "}
            <AccessBadge level={roleDefault} isDefault={false} /> to all subsidiaries
            (based on{" "}
            <span className="font-medium text-gray-700">{selectedUser.role}</span> role).
            Overrides below change access for specific modules.
          </p>
        </div>

        {/* ── Permission Matrix ────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#f9fafb]">
          {/* Column Headers */}
          <div className="grid bg-white border-b border-gray-200" style={{ gridTemplateColumns: "200px repeat(3, 1fr)" }}>
            <div className="px-4 py-3 flex items-end">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Module
              </span>
            </div>
            {SUBSIDIARIES.map((sub) => {
              const bulk = getSubBulk(selectedUserId, sub.id);
              return (
                <div
                  key={sub.id}
                  className="px-3 py-3 text-center border-l border-gray-200"
                >
                  <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                    {sub.name}
                  </div>
                  <SubBulkControl
                    value={bulk}
                    onChange={(v) => setSubBulk(selectedUserId, sub.id, v)}
                  />
                </div>
              );
            })}
          </div>

          {/* Matrix Rows */}
          {MODULES.map((mod, i) => {
            return (
              <div
                key={mod}
                className={`grid ${i < MODULES.length - 1 ? "border-b border-gray-100" : ""}`}
                style={{ gridTemplateColumns: "200px repeat(3, 1fr)" }}
              >
                {/* Module Label */}
                <div className="px-4 py-2 flex items-center gap-2 bg-white border-r border-gray-100">
                  <span className="text-sm" role="img">
                    {MODULE_ICONS[mod] || "📦"}
                  </span>
                  <span className="text-xs font-medium text-gray-700">{mod}</span>
                </div>

                {/* Cells */}
                {SUBSIDIARIES.map((sub) => {
                  const { level, isDefault } = getEffective(
                    selectedUserId,
                    sub.id,
                    mod,
                  );
                  return (
                    <div
                      key={sub.id}
                      className="px-2 py-1.5 border-l border-gray-100 flex items-center"
                    >
                      <CellDropdown
                        value={level}
                        isDefault={isDefault}
                        roleDefault={roleDefault}
                        onChange={(newLevel) =>
                          setCellOverride(selectedUserId, sub.id, mod, newLevel)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ── Legend ────────────────────────────────────────────────── */}
        <div className="mt-4 flex items-center gap-4 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 opacity-50" />
            Muted = role default (inherited)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Orange dot = explicitly overridden
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar ──────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 transition-all duration-200 ${
          isDirty
            ? "translate-y-0 opacity-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <span className="text-xs text-gray-500">
            You have unsaved changes to{" "}
            <span className="font-medium text-gray-700">
              {selectedUser.name}
            </span>
            's permissions.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium text-white rounded-md transition-colors"
              style={{ backgroundColor: "#FF884D" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f07838")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#FF884D")
              }
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* ── Toast ────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 ${
          saveToast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-emerald-400">
          <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4.5 7l2 2 3-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Permissions saved successfully
      </div>
    </div>
  );
}
