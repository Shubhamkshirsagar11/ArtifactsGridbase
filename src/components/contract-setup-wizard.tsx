import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  X,
  FileText,
  DollarSign,
  Receipt,
  ClipboardCheck,
  AlertTriangle,
  Trash2,
  CloudLightning,
  Building2,
  Zap,
  ChevronDown,
  ChevronUp,
  Search,
  MoreHorizontal,
  ClipboardList,
  Ticket,
  Phone,
  FolderKanban,
  BookOpen,
  Landmark,
  Truck,
  Users,
  Calculator,
  FileSpreadsheet,
  Settings,
  UserCog,
  Plug,
  Eye,
  Pencil,
  Copy,
  Archive,
} from "lucide-react";

// ─── Current Org (simulated context) ─────────────────────────
const CURRENT_ORG = "Ameren";

// ─── Shared Data ───────────────────────────────────────────
const WORK_TYPES = [
  "OH Distribution",
  "UG Distribution",
  "Transmission",
  "Vegetation Management",
  "Make-Ready",
  "Substation",
  "Fiber/Telecom",
  "Other",
];

const CONTRACT_TYPES = [
  {
    id: "te",
    label: "T&E",
    desc: "Time & Equipment — bill based on labor hours and equipment usage",
    color: "blue",
  },
  {
    id: "unit",
    label: "Unit-Price",
    desc: "Bill per compatible unit completed at contracted rates",
    color: "emerald",
  },
  {
    id: "lump",
    label: "Lump Sum",
    desc: "Fixed price for a defined scope of work",
    color: "amber",
  },
  {
    id: "storm",
    label: "Storm",
    desc: "Emergency restoration — storm-specific billing with time thresholds, expenses, and mobilization rules",
    color: "violet",
  },
];


const CLASSIFICATIONS = [
  "General Foreman",
  "Foreman",
  "Journeyman Lineman",
  "Apprentice Lineman",
  "Groundman",
  "Operator",
  "CDL Driver",
];

const EQUIPMENT_TYPES = [
  "Digger Derrick",
  "Bucket Truck (55')",
  "Bucket Truck (65')",
  "Pickup Truck",
  "Dump Truck",
  "Pole Trailer",
  "Mini Excavator",
  "Flatbed Trailer",
];

const CU_LIBRARIES = [
  `${CURRENT_ORG} – UG Distribution 2026`,
  "Acme Electric - OH Distribution 2025",
  "Keystone - Distribution CU Library v4",
  "Coastal Power - Make-Ready 2026",
];

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const FEDERAL_HOLIDAYS = [
  "New Year's Day",
  "Martin Luther King Jr. Day",
  "Presidents' Day",
  "Memorial Day",
  "Independence Day",
  "Labor Day",
  "Columbus Day",
  "Veterans Day",
  "Thanksgiving Day",
  "Christmas Day",
];

// ─── Stepper ─────────────────────────────────────────────
const STEPS = [
  { num: 1, label: "Basics", icon: FileText },
  { num: 2, label: "Rates", icon: DollarSign },
  { num: 3, label: "Billing Rules", icon: Receipt },
  { num: 4, label: "Payment", icon: ClipboardCheck },
  { num: 5, label: "Review", icon: Check },
];

function Stepper({ currentStep }) {
  const steps = STEPS;
  return (
    <div className="flex items-center justify-center gap-0 py-4 border-b border-gray-200 bg-gray-50/50 px-8">
      {steps.map((step, i) => {
        const isComplete = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        const isUpcoming = currentStep < step.num;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  isComplete || isCurrent
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                } ${isCurrent ? "ring-4 ring-gray-200" : ""}`}
              >
                {isComplete ? <Check size={14} /> : step.num}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  isUpcoming
                    ? "text-gray-400"
                    : "font-medium text-gray-900"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-12 h-px mx-3 ${
                  isComplete ? "bg-gray-900" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Form Field Components ─────────────────────────────────
function Field({ label, required, optional, helper, error, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
          {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-xs text-gray-400 mt-1">{helper}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, prefix, suffix, type = "text", disabled = false, error = false, numeric = false }) {
  const handleChange = (e) => {
    const v = e.target.value;
    if (numeric) {
      if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) {
        onChange(v);
      }
      return;
    }
    onChange(v);
  };
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={numeric ? "decimal" : undefined}
        className={`w-full ${prefix ? "pl-7" : "px-3"} ${
          suffix ? "pr-12" : ""
        } py-2 text-sm border rounded-lg bg-white placeholder-gray-400 focus:outline-none transition-colors ${
          error ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100" : "border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
        } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, disabled = false, error = false }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full text-sm border rounded-lg pl-3 pr-8 py-2 bg-white text-gray-700 appearance-none focus:outline-none transition-colors ${
          error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-300"
        } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option
            key={typeof opt === "string" ? opt : opt.id}
            value={typeof opt === "string" ? opt : opt.id}
          >
            {typeof opt === "string" ? opt : opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function MultiSelect({ values = [], onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (val) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  const available = options.filter((opt) => {
    const v = typeof opt === "string" ? opt : opt.id;
    return !values.includes(v);
  });

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer min-h-[38px] flex flex-wrap items-center gap-1.5 focus:outline-none focus:border-gray-300 transition-colors"
      >
        {values.length === 0 && (
          <span className="text-gray-400">{placeholder || "Select..."}</span>
        )}
        {values.map((val) => {
          const opt = options.find((o) => (typeof o === "string" ? o : o.id) === val);
          const label = typeof opt === "string" ? opt : opt?.label || val;
          return (
            <span
              key={val}
              className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-md border border-orange-200"
            >
              {label}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggle(val); }}
                className="hover:text-orange-900 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {open && available.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {available.map((opt) => {
            const v = typeof opt === "string" ? opt : opt.id;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggle(v)}
                className="w-full text-left text-sm px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RadioGroup({ value, onChange, options, compact = false }) {
  if (compact) {
    return (
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              value === opt.id
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <div
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            value === opt.id
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
              value === opt.id ? "border-gray-900" : "border-gray-300"
            }`}
          >
            {value === opt.id && (
              <div className="w-2 h-2 rounded-full bg-gray-900" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {opt.label}
            </div>
            {opt.desc && (
              <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          value ? "bg-gray-900" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function Checkbox({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className={`flex-shrink-0 ${description ? "self-start mt-1" : ""}`}>
        <div
          onClick={(e) => {
            e.preventDefault();
            onChange(!checked);
          }}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            checked
              ? "bg-gray-900 border-gray-900"
              : "border-gray-300 group-hover:border-gray-400"
          }`}
        >
          {checked && <Check size={10} className="text-white" />}
        </div>
      </div>
      <div>
        <span className="text-sm text-gray-700">{label}</span>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// ─── Rate Table Component ──────────────────────────────────
function RateTable({ rows, setRows, columns, addLabel }) {
  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.key] = col.defaultValue || "";
    });
    setRows([...rows, newRow]);
  };

  const updateRow = (index, key, value) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [key]: value };
    setRows(updated);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 flex">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`py-2.5 px-3 text-xs font-medium text-gray-500 ${col.width || "flex-1"} ${
              col.align === "right" ? "text-right" : ""
            }`}
          >
            {col.label}
          </div>
        ))}
        <div className="w-10" />
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center border-b border-gray-100 last:border-0"
        >
          {columns.map((col) => (
            <div key={col.key} className={`${col.width || "flex-1"} px-1`}>
              {col.type === "select" ? (
                <select
                  value={row[col.key]}
                  onChange={(e) => updateRow(i, col.key, e.target.value)}
                  className="border-0 bg-transparent py-2 px-2 text-sm w-full focus:bg-blue-50/50 focus:outline-none rounded"
                >
                  <option value="">Select...</option>
                  {col.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={row[col.key]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (col.numeric && v !== "" && !/^\d*\.?\d{0,2}$/.test(v)) return;
                    updateRow(i, col.key, v);
                  }}
                  placeholder={col.placeholder || ""}
                  className={`border-0 bg-transparent py-2 px-2 text-sm w-full focus:bg-blue-50/50 focus:outline-none rounded ${
                    col.align === "right" ? "text-right tabular-nums" : ""
                  }`}
                />
              )}
            </div>
          ))}
          <div className="w-10 flex items-center justify-center">
            <button
              onClick={() => removeRow(i)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addRow}
        className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors flex items-center justify-center gap-1"
      >
        <Plus size={14} />
        {addLabel || "Add row"}
      </button>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────
function Section({ title, desc, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {desc && <p className="text-xs text-gray-500 mb-4">{desc}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ─── SectionCard (matches Storybook) ───────────────────────
function SectionCard({ title, desc, children, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
      <div
        className={`px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex items-center justify-between ${
          collapsible ? "cursor-pointer" : ""
        }`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
        {collapsible &&
          (open ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          ))}
      </div>
      {(!collapsible || open) && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}


// ─── Segmented Threshold Slider (storm) ──────────────────────────────────
function ThresholdSlider({ stBreak, otBreak, onSTBreakChange, onOTBreakChange, max = 24, suffix = "hrs/day", hasST = true, hasOT = true, hasDT = true }) {
  const barRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  // Build segments based on which rate tiers exist
  const segments = [];
  const handles = [];

  if (hasST && hasOT && hasDT) {
    segments.push({ key: "st", label: "ST", color: "bg-emerald-500", from: 0, to: stBreak });
    segments.push({ key: "ot", label: "OT", color: "bg-orange-400", from: stBreak, to: otBreak });
    segments.push({ key: "dt", label: "DT", color: "bg-red-500", from: otBreak, to: max });
    handles.push({ id: "st", at: stBreak, border: "border-emerald-600" });
    handles.push({ id: "ot", at: otBreak, border: "border-orange-500" });
  } else if (hasST && hasOT && !hasDT) {
    segments.push({ key: "st", label: "ST", color: "bg-emerald-500", from: 0, to: stBreak });
    segments.push({ key: "ot", label: "OT", color: "bg-orange-400", from: stBreak, to: max });
    handles.push({ id: "st", at: stBreak, border: "border-emerald-600" });
  } else if (!hasST && hasOT && hasDT) {
    segments.push({ key: "ot", label: "OT", color: "bg-orange-400", from: 0, to: otBreak });
    segments.push({ key: "dt", label: "DT", color: "bg-red-500", from: otBreak, to: max });
    handles.push({ id: "ot", at: otBreak, border: "border-orange-500" });
  } else if (hasST && !hasOT && hasDT) {
    segments.push({ key: "st", label: "ST", color: "bg-emerald-500", from: 0, to: otBreak });
    segments.push({ key: "dt", label: "DT", color: "bg-red-500", from: otBreak, to: max });
    handles.push({ id: "ot", at: otBreak, border: "border-emerald-600" });
  } else if (hasOT && !hasST && !hasDT) {
    segments.push({ key: "ot", label: "OT", color: "bg-orange-400", from: 0, to: max });
  } else if (hasST && !hasOT && !hasDT) {
    segments.push({ key: "st", label: "ST", color: "bg-emerald-500", from: 0, to: max });
  }

  const pct = (val) => (val / max) * 100;

  const handleMouseDown = (which) => (e) => {
    e.preventDefault();
    setDragging(which);
  };

  useEffect(() => {
    if (!dragging) return;
    const bar = barRef.current;
    const onMove = (e) => {
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const rawVal = (x / rect.width) * max;
      const snapped = Math.round(rawVal * 2) / 2;

      if (dragging === "st") {
        const upper = hasDT ? otBreak - 0.5 : max - 0.5;
        onSTBreakChange(Math.max(0.5, Math.min(snapped, upper)));
      } else if (dragging === "ot") {
        const lower = hasST ? stBreak + 0.5 : 0.5;
        onOTBreakChange(Math.max(lower, Math.min(snapped, max - 0.5)));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, stBreak, otBreak, max, hasST, hasOT, hasDT, onSTBreakChange, onOTBreakChange]);

  // Compact inline legend
  const legendItems = segments.map((seg) => {
    const dotColor = seg.key === "st" ? "bg-emerald-500" : seg.key === "ot" ? "bg-orange-500" : "bg-red-500";
    const label = seg.key === "st" ? "Standard Time" : seg.key === "ot" ? "Overtime" : "Double Time";
    return { dot: dotColor, label, range: `${seg.from}–${seg.to} ${suffix}` };
  });

  return (
    <div>
      {/* Segmented bar */}
      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
        <span>0 {suffix}</span>
        <span>{max} {suffix}</span>
      </div>
      <div ref={barRef} className="relative h-8 rounded-md overflow-hidden flex cursor-pointer select-none">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`${seg.color} flex items-center justify-center text-[11px] font-medium text-white transition-all`}
            style={{ width: `${pct(seg.to - seg.from)}%` }}
          >
            {pct(seg.to - seg.from) > 12 ? seg.label : ""}
          </div>
        ))}
        {handles.map((h) => (
          <div
            key={h.id}
            onMouseDown={handleMouseDown(h.id)}
            className="absolute top-0 bottom-0 flex items-center"
            style={{ left: `${pct(h.at)}%`, transform: "translateX(-50%)", zIndex: 10 }}
          >
            <div className={`w-4 h-4 rounded-full bg-white border-2 ${h.border} shadow cursor-grab ${dragging === h.id ? "cursor-grabbing scale-110" : "hover:scale-105"} transition-transform`} />
          </div>
        ))}
      </div>

      {/* Compact legend row */}
      <div className="flex gap-4 mt-2">
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="text-gray-400">{item.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STEP 1: BASICS
// ═══════════════════════════════════════════════════════════
function Step1Basics({ data, update, errors = {} }) {
  const ct = data.contractType;
  const isStorm = ct === "storm";
  const hasType = ct !== "";

  return (
    <div className="space-y-5">
      {/* ── 1. Contract Type ── */}
      <Section
        title="Contract Type"
        desc="This drives the rest of the wizard — rates, billing rules, and invoicing all adapt based on type."
      >
        {errors.contractType && <p className="text-xs text-red-500 mb-2">{errors.contractType}</p>}
        <RadioGroup
          value={ct}
          onChange={(v) => update("contractType", v)}
          options={CONTRACT_TYPES.map((c) => ({
            id: c.id,
            label: c.label,
            desc: c.desc,
          }))}
        />
      </Section>

      {/* ── 3. Contract Details ── */}
      {hasType && (
        <Section title="Contract Details">
          <Field
            label="Contract Name"
            error={errors.name}
            helper={
              isStorm
                ? `e.g., ${CURRENT_ORG} – Storm Master Agreement 2026`
                : ct === "unit"
                ? `e.g., ${CURRENT_ORG} – OH Distribution 2026`
                : ct === "lump"
                ? `e.g., ${CURRENT_ORG} – Main Street Rebuild`
                : `e.g., ${CURRENT_ORG} – T&E Services 2026`
            }
          >
            <TextInput
              value={data.name}
              onChange={(v) => update("name", v)}
              placeholder="Enter contract name"
              error={!!errors.name}
            />
          </Field>
          {!isStorm && (
            <Field label="Work Type" error={errors.workType} helper={ct === "lump" ? "Primary discipline for this contract" : "Disciplines covered by this contract"}>
              {ct === "lump" ? (
                <Select
                  value={typeof data.workType === "string" ? data.workType : data.workType[0] || ""}
                  onChange={(v) => update("workType", v)}
                  options={WORK_TYPES}
                  placeholder="Select work type..."
                  error={!!errors.workType}
                />
              ) : (
                <MultiSelect
                  values={Array.isArray(data.workType) ? data.workType : data.workType ? [data.workType] : []}
                  onChange={(v) => update("workType", v)}
                  options={WORK_TYPES}
                  placeholder="Select work types..."
                />
              )}
            </Field>
          )}
        </Section>
      )}

      {/* ── 4. Term ── */}
      {hasType && (
        <Section title="Term">
          <div className="grid grid-cols-2 gap-4">
            <Field label={isStorm ? "Effective Date" : "Start Date"} error={errors.startDate}>
              <TextInput
                type="date"
                value={data.startDate}
                onChange={(v) => update("startDate", v)}
                error={!!errors.startDate}
              />
            </Field>
            <Field
              label={isStorm ? "Expiration Date" : "End Date"}
              optional={!errors.endDate}
              error={errors.endDate}
              helper={!errors.endDate ? "Leave blank for evergreen contracts" : undefined}
            >
              <TextInput
                type="date"
                value={data.endDate}
                onChange={(v) => update("endDate", v)}
                error={!!errors.endDate}
              />
            </Field>
          </div>
          {(ct === "te" || ct === "unit") && (
            <Field
              label="Not to Exceed (NTE)"
              optional
              helper="The utility's authorized spending ceiling. Enables billed-vs-authorized tracking."
            >
              <TextInput
                value={data.nte}
                onChange={(v) => update("nte", v)}
                placeholder="0.00"
                prefix="$"
                numeric
              />
            </Field>
          )}
        </Section>
      )}


    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STEP 2: RATE CONFIGURATION
// ═══════════════════════════════════════════════════════════
function Step2Rates({ data, update, errors = {} }) {
  const ct = data.contractType;

  if (!ct) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle size={32} className="text-amber-500 mb-3" />
        <p className="text-sm font-medium text-gray-900">
          No Contract Type Selected
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Go back to Step 1 and select a contract type to configure rates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── T&E ── */}
      {ct === "te" && (
        <>
          <Section title="Labor Rate Structure">
            <Field label="Rate Type" error={errors.teRateType}>
              <RadioGroup
                value={data.teRateType}
                onChange={(v) => update("teRateType", v)}
                options={[
                  {
                    id: "per_class",
                    label: "Per Classification",
                    desc: "Each classification has its own ST/OT/DT rates",
                  },
                  {
                    id: "blended",
                    label: "Blended Rate",
                    desc: "Single hourly rate regardless of classification",
                  },
                ]}
              />
            </Field>
            <Field label="Billing Basis" error={errors.teBillingBasis}>
              <RadioGroup
                value={data.teBillingBasis}
                onChange={(v) => update("teBillingBasis", v)}
                options={[
                  {
                    id: "actuals",
                    label: "Actuals",
                    desc: "Invoice based on actual hours worked",
                  },
                  {
                    id: "estimated",
                    label: "Estimated",
                    desc: "Invoice based on WO estimated hours (fixed-price-per-WO)",
                  },
                ]}
              />
            </Field>
          </Section>

          {data.teRateType === "blended" && (
            <Section title="Blended Rate">
              <Field label="Hourly Rate" error={errors.blendedRate}>
                <TextInput
                  value={data.blendedRate}
                  onChange={(v) => update("blendedRate", v)}
                  placeholder="0.00"
                  prefix="$"
                  numeric
                  error={!!errors.blendedRate}
                />
              </Field>
            </Section>
          )}

          {data.teRateType === "per_class" && (
            <Section
              title="Labor Rates"
              desc="Billing rates = what customer pays. Cost rates are optional (enables margin tracking)."
            >
              {errors.laborRates && <p className="text-xs text-red-500 mb-2">{errors.laborRates}</p>}
              <RateTable
                rows={data.laborRates}
                setRows={(v) => update("laborRates", v)}
                columns={[
                  {
                    key: "classification",
                    label: "Internal Classification",
                    type: "select",
                    options: CLASSIFICATIONS,
                  },
                  {
                    key: "invoiceLabel",
                    label: "Invoice Classification",
                    placeholder: "e.g., Class A Lineman",
                  },
                  {
                    key: "st",
                    label: "ST Rate ($)",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                    width: "w-28",
                  },
                  {
                    key: "ot",
                    label: "OT Rate ($)",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                    width: "w-28",
                  },
                  {
                    key: "dt",
                    label: "DT Rate ($)",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                    width: "w-28",
                  },
                  {
                    key: "stCost",
                    label: "ST Cost",
                    placeholder: "optional",
                    align: "right",
                  },
                ]}
                addLabel="Add classification"
              />
            </Section>
          )}

          <Section
            title="Overtime Rules"
            desc={
              data.teRateType === "blended"
                ? "Determines whether OT multipliers apply to the blended rate, or if it's a flat rate regardless of hours."
                : "Determines how raw timesheet hours are classified for billing."
            }
          >
            <Field label="OT Calculation" error={errors.otCalc}>
              <Select
                value={data.otCalc}
                onChange={(v) => update("otCalc", v)}
                options={[
                  ...(data.teRateType === "blended"
                    ? ["None — flat rate regardless of hours"]
                    : []),
                  "Daily after 8hrs",
                  "Weekly after 40hrs",
                  "Both",
                ]}
                placeholder="Select..."
                error={!!errors.otCalc}
              />
            </Field>
            {data.otCalc &&
              data.otCalc !== "None — flat rate regardless of hours" && (
                <>
                  <Field label="Workweek Start" error={errors.workweekStart}>
                    <Select
                      value={data.workweekStart}
                      onChange={(v) => update("workweekStart", v)}
                      options={DAYS_OF_WEEK}
                      placeholder="Select..."
                      error={!!errors.workweekStart}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Saturday Rate" error={errors.satRate}>
                      <Select
                        value={data.satRate}
                        onChange={(v) => update("satRate", v)}
                        options={["ST", "OT", "DT"]}
                        placeholder="Select..."
                        error={!!errors.satRate}
                      />
                    </Field>
                    <Field label="Sunday Rate" error={errors.sunRate}>
                      <Select
                        value={data.sunRate}
                        onChange={(v) => update("sunRate", v)}
                        options={["ST", "OT", "DT"]}
                        placeholder="Select..."
                        error={!!errors.sunRate}
                      />
                    </Field>
                  </div>
                </>
              )}
          </Section>
        </>
      )}

      {/* ── UNIT-PRICE ── */}
      {ct === "unit" && (
        <>
          <Section
            title="CU Library"
            desc="The compatible unit library that defines the work items and pricing for this contract."
          >
            <Field label="CU Library" error={errors.cuLibrary}>
              <Select
                value={data.cuLibrary}
                onChange={(v) => update("cuLibrary", v)}
                options={CU_LIBRARIES}
                placeholder="Select CU library..."
                error={!!errors.cuLibrary}
              />
            </Field>
            <Field label="Pricing Model" error={errors.pricingModel}>
              <RadioGroup
                value={data.pricingModel}
                onChange={(v) => update("pricingModel", v)}
                options={[
                  {
                    id: "labor_only",
                    label: "Labor-Only",
                    desc: "CU prices cover labor only; materials billed separately",
                  },
                  {
                    id: "all_in",
                    label: "All-In",
                    desc: "CU prices include labor and materials",
                  },
                ]}
              />
            </Field>
          </Section>

          <Section
            title="T&E Fallback Rates"
            desc="Used for extra work, change order billing, and CUs priced as HOURLY. Most unit-price contracts include a T&E rate schedule."
          >
            <Field label="Fallback Rate Type" error={errors.fallbackRateType}>
              <RadioGroup
                value={data.fallbackRateType}
                onChange={(v) => update("fallbackRateType", v)}
                options={[
                  { id: "per_class", label: "Per Classification", desc: "Different billing rates for each labor classification" },
                  { id: "blended", label: "Blended Rate", desc: "Single hourly rate regardless of classification" },
                  { id: "none", label: "None", desc: "No T&E fallback rates on this contract" },
                ]}
              />
            </Field>
            {data.fallbackRateType === "blended" && (
              <Field label="Blended Fallback Rate" error={errors.fallbackBlendedRate}>
                <TextInput
                  value={data.fallbackBlendedRate}
                  onChange={(v) => update("fallbackBlendedRate", v)}
                  placeholder="0.00"
                  prefix="$"
                  numeric
                  error={!!errors.fallbackBlendedRate}
                />
              </Field>
            )}
            {data.fallbackRateType === "per_class" && (
              <>
              {errors.fallbackLaborRates && <p className="text-xs text-red-500 mb-2">{errors.fallbackLaborRates}</p>}
              <RateTable
                rows={data.fallbackLaborRates}
                setRows={(v) => update("fallbackLaborRates", v)}
                columns={[
                  {
                    key: "classification",
                    label: "Internal Classification",
                    type: "select",
                    options: CLASSIFICATIONS,
                  },
                  {
                    key: "invoiceLabel",
                    label: "Invoice Classification",
                    placeholder: "e.g., Class A Lineman",
                  },
                  {
                    key: "st",
                    label: "ST Rate ($)",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                    width: "w-28",
                  },
                  {
                    key: "ot",
                    label: "OT Rate ($)",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                    width: "w-28",
                  },
                  {
                    key: "dt",
                    label: "DT Rate ($)",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                    width: "w-28",
                  },
                ]}
                addLabel="Add classification"
              />
              </>
            )}
          </Section>

          <Section
            title="Billing Exclusions"
            desc="CUs that are logged for production but not invoiced."
          >
            <RateTable
              rows={data.billingExclusions}
              setRows={(v) => update("billingExclusions", v)}
              columns={[
                {
                  key: "cuCode",
                  label: "CU Code (or wildcard)",
                  width: "flex-1",
                  placeholder: "e.g., UD999 or *TEMP*",
                },
                {
                  key: "function",
                  label: "Function",
                  type: "select",
                  options: ["Install", "Remove", "Transfer", "All"],
                  width: "w-32",
                },
                {
                  key: "reason",
                  label: "Reason",
                  placeholder: "e.g., Internal tracking only",
                },
              ]}
              addLabel="Add exclusion"
            />
          </Section>
        </>
      )}

      {/* ── LUMP SUM ── */}
      {ct === "lump" && (
        <>
          <Section title="Contract Value">
            <Field label="Total Contract Value" error={errors.lumpValue}>
              <TextInput
                value={data.lumpValue}
                onChange={(v) => update("lumpValue", v)}
                placeholder="0.00"
                prefix="$"
                numeric
                error={!!errors.lumpValue}
              />
            </Field>
            <Field label="Payment Structure" error={errors.paymentStructure}>
              <RadioGroup
                value={data.paymentStructure}
                onChange={(v) => update("paymentStructure", v)}
                options={[
                  {
                    id: "milestone",
                    label: "Milestone",
                    desc: "Payments tied to defined milestones",
                  },
                  {
                    id: "pct_complete",
                    label: "Percent Complete",
                    desc: "Payments as % of total value",
                  },
                  {
                    id: "periodic_draw",
                    label: "Periodic Draw",
                    desc: "Regular scheduled payments",
                  },
                ]}
              />
            </Field>
          </Section>

          {data.paymentStructure === "milestone" && (
            <Section title="Milestone Schedule">
              {errors.milestones && <p className="text-xs text-red-500 mb-2">{errors.milestones}</p>}
              <RateTable
                rows={data.milestones}
                setRows={(v) => update("milestones", v)}
                columns={[
                  {
                    key: "name",
                    label: "Milestone",
                    placeholder: "e.g., Pole Replacement Complete",
                  },
                  {
                    key: "amount",
                    label: "Amount",
                    placeholder: "0.00",
                    numeric: true,
                    align: "right",
                  },
                  {
                    key: "trigger",
                    label: "Trigger Condition",
                    placeholder: "e.g., 100% of poles replaced",
                  },
                ]}
                addLabel="Add milestone"
              />
            </Section>
          )}

          <Section
            title="T&E Fallback Rates"
            desc="Labor and equipment rates for change orders and extra work billed at T&E."
          >
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Labor</h5>
                {errors.fallbackLaborRates && <p className="text-xs text-red-500 mb-2">{errors.fallbackLaborRates}</p>}
                <RateTable
                  rows={data.fallbackLaborRates}
                  setRows={(v) => update("fallbackLaborRates", v)}
                  columns={[
                    {
                      key: "classification",
                      label: "Internal Classification",
                      type: "select",
                      options: CLASSIFICATIONS,
                    },
                    {
                      key: "invoiceLabel",
                      label: "Invoice Classification",
                      placeholder: "e.g., Class A Lineman",
                    },
                    {
                      key: "st",
                      label: "ST Rate ($)",
                      placeholder: "0.00",
                      numeric: true,
                      align: "right",
                      width: "w-28",
                    },
                    {
                      key: "ot",
                      label: "OT Rate ($)",
                      placeholder: "0.00",
                      numeric: true,
                      align: "right",
                      width: "w-28",
                    },
                    {
                      key: "dt",
                      label: "DT Rate ($)",
                      placeholder: "0.00",
                      numeric: true,
                      align: "right",
                      width: "w-28",
                    },
                  ]}
                  addLabel="Add classification"
                />
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Equipment</h5>
                {errors.fallbackEquipmentRates && <p className="text-xs text-red-500 mb-2">{errors.fallbackEquipmentRates}</p>}
                <RateTable
                  rows={data.fallbackEquipmentRates}
                  setRows={(v) => update("fallbackEquipmentRates", v)}
                  columns={[
                    {
                      key: "type",
                      label: "Equipment Type",
                      type: "select",
                      options: EQUIPMENT_TYPES,
                    },
                    {
                      key: "rate",
                      label: "Hourly Rate ($)",
                      placeholder: "0.00",
                      numeric: true,
                      align: "right",
                      width: "w-32",
                    },
                  ]}
                  addLabel="Add equipment type"
                />
              </div>
            </div>
          </Section>
        </>
      )}

      {/* ── STORM ── */}
      {ct === "storm" && (
        <>
          <SectionCard
            title="Labor Rates"
            desc="Hourly rates by classification for ST, OT, and DT"
          >
            {errors.stormLaborRates && <p className="text-xs text-red-500 mb-2">{errors.stormLaborRates}</p>}
            <RateTable
              rows={data.stormLaborRates}
              setRows={(v) => update("stormLaborRates", v)}
              columns={[
                {
                  key: "classification",
                  label: "Internal Classification",
                  type: "select",
                  options: CLASSIFICATIONS,
                },
                {
                  key: "invoiceLabel",
                  label: "Invoice Classification",
                  placeholder: "e.g., Class A Lineman",
                },
                {
                  key: "st",
                  label: "ST Rate ($)",
                  placeholder: "0.00",
                  numeric: true,
                  align: "right",
                  width: "w-28",
                },
                {
                  key: "ot",
                  label: "OT Rate ($)",
                  placeholder: "0.00",
                  numeric: true,
                  align: "right",
                  width: "w-28",
                },
                {
                  key: "dt",
                  label: "DT Rate ($)",
                  placeholder: "0.00",
                  numeric: true,
                  align: "right",
                  width: "w-28",
                },
              ]}
              addLabel="Add classification"
            />
          </SectionCard>

          <SectionCard
            title="Equipment Rates"
            desc="Hourly rates per equipment type"
          >
            {errors.stormEquipmentRates && <p className="text-xs text-red-500 mb-2">{errors.stormEquipmentRates}</p>}
            <RateTable
              rows={data.stormEquipmentRates}
              setRows={(v) => update("stormEquipmentRates", v)}
              columns={[
                {
                  key: "type",
                  label: "Internal Classification",
                  type: "select",
                  options: EQUIPMENT_TYPES,
                },
                {
                  key: "invoiceLabel",
                  label: "Invoice Classification",
                  placeholder: "e.g., 55ft Aerial Device",
                },
                {
                  key: "rate",
                  label: "Hourly Rate ($)",
                  placeholder: "0.00",
                  numeric: true,
                  align: "right",
                  width: "w-32",
                },
                {
                  key: "approvalRequired",
                  label: "Approval Req'd",
                  type: "select",
                  options: ["No", "Yes"],
                  width: "w-32",
                },
              ]}
              addLabel="Add equipment type"
            />
          </SectionCard>
        </>
      )}

      {/* ── Equipment — bluesky T&E and Unit-Price only (lump sum uses fallback rates) ── */}
      {ct !== "storm" && ct !== "lump" && (
        <Section
          title="Equipment Rates (optional)"
          desc="Hourly equipment billing rates. Optional high-utilization rate applies above the weekly threshold."
        >
          <RateTable
            rows={data.equipmentRates}
            setRows={(v) => update("equipmentRates", v)}
            columns={[
              {
                key: "type",
                label: "Equipment Type",
                type: "select",
                options: EQUIPMENT_TYPES,
                width: "w-44",
              },
              {
                key: "rate",
                label: "Hourly Rate ($)",
                placeholder: "0.00",
                numeric: true,
                align: "right",
              },
              {
                key: "hiUtil",
                label: "Hi-Util Rate",
                placeholder: "optional",
                align: "right",
              },
              {
                key: "threshold",
                label: "Threshold (hrs/wk)",
                placeholder: "50",
                align: "right",
              },
            ]}
            addLabel="Add equipment type"
          />
        </Section>
      )}

      {/* ── Per Diem — bluesky types only ── */}
      {ct !== "storm" && (
        <Section
          title="Per Diem Reimbursement"
          desc="Whether the customer reimburses per diem on this contract. Crew-facing per diem (what you pay your people) is configured per job."
        >
          <Field label="Customer Reimbursement" error={errors.perDiemBilling}>
            <RadioGroup
              value={data.perDiemBilling}
              onChange={(v) => update("perDiemBilling", v)}
              options={[
                {
                  id: "none",
                  label: "Not Billable",
                  desc: "Per diem is a contractor expense — not billed to this customer",
                },
                {
                  id: "flat",
                  label: "Flat Rate",
                  desc: "Customer reimburses the same daily amount per person, regardless of classification",
                },
                {
                  id: "per_class",
                  label: "Per Classification",
                  desc: "Reimbursement rate varies by classification (e.g., Foreman $200/day, Groundman $125/day)",
                },
              ]}
            />
          </Field>
          {data.perDiemBilling === "flat" && (
            <Field label="Daily Reimbursement Rate" error={errors.perDiemAmount}>
              <TextInput
                value={data.perDiemAmount}
                onChange={(v) => update("perDiemAmount", v)}
                placeholder="0.00"
                prefix="$"
                numeric
                error={!!errors.perDiemAmount}
              />
            </Field>
          )}
          {data.perDiemBilling === "per_class" && (
            <>
            {errors.perDiemRates && <p className="text-xs text-red-500 mb-2">{errors.perDiemRates}</p>}
            <RateTable
              rows={data.perDiemRates}
              setRows={(v) => update("perDiemRates", v)}
              columns={[
                {
                  key: "classification",
                  label: "Internal Classification",
                  type: "select",
                  options: CLASSIFICATIONS,
                  width: "w-48",
                },
                {
                  key: "daily",
                  label: "Daily Rate",
                  placeholder: "0.00",
                  numeric: true,
                  align: "right",
                },
              ]}
              addLabel="Add classification"
            />
            </>
          )}
        </Section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STEP 3: VENDORS & COs (bluesky) / BILLING RULES (storm)
// ═══════════════════════════════════════════════════════════

// ── Storm Billing Rules ──
function StormBillingRules({ data, update, errors = {}, setErrors }) {
  // Determine which rate tiers were entered on Step 2 (labor rates)
  const hasSTRates = (data.stormLaborRates || []).some((r) => r.st && r.st !== "");
  const hasOTRates = (data.stormLaborRates || []).some((r) => r.ot && r.ot !== "");
  const hasDTRates = (data.stormLaborRates || []).some((r) => r.dt && r.dt !== "");

  const clearError = (errorKey) => {
    if (setErrors && errors[errorKey]) {
      setErrors((prev) => { const next = { ...prev }; delete next[errorKey]; return next; });
    }
  };

  const updateExpenses = (key, value) => {
    update("stormExpenses", { ...data.stormExpenses, [key]: value });
    // Map expense keys to their error keys
    const errorMap = {
      mealType: "stormMealType", mealPerDiem: "stormMealPerDiem",
      breakfastCap: "stormBreakfastCap", lunchCap: "stormLunchCap", dinnerCap: "stormDinnerCap",
      lodgingType: "stormLodgingType", lodgingRate: "stormLodgingRate",
      fuelType: "stormFuelType",
    };
    if (errorMap[key]) clearError(errorMap[key]);
  };

  const updateSpecialDay = (day, key, value) => {
    update("stormSpecialDays", {
      ...data.stormSpecialDays,
      [day]: { ...data.stormSpecialDays[day], [key]: value },
    });
    clearError(`specialDay_${day}_${key}`);
  };

  const updateTimeDivision = (division, key, value) => {
    update("stormTimeDivisions", {
      ...data.stormTimeDivisions,
      [division]: { ...data.stormTimeDivisions[division], [key]: value },
    });
    clearError(`timeDivision_${division}_${key}`);
    if (key === "applicableOn") clearError(`timeDivision_${division}`);
  };

  return (
    <div className="space-y-5">
      {/* Base Configuration */}
      <SectionCard title="Base Configuration">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Work Week Start Day" error={errors.stormWorkWeekStart}>
            <Select
              value={data.stormWorkWeekStart}
              onChange={(v) => update("stormWorkWeekStart", v)}
              options={DAYS_OF_WEEK}
              placeholder="Select day..."
              error={!!errors.stormWorkWeekStart}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Time Thresholds */}
      <SectionCard
        title="Time Thresholds"
        desc="Define when straight time transitions to overtime and double time"
      >
        <div className="space-y-8">
          {/* Daily */}
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Daily Thresholds
            </h5>
            <ThresholdSlider
              stBreak={data.stormDailySTThreshold}
              otBreak={data.stormDailyOTThreshold}
              onSTBreakChange={(v) => update("stormDailySTThreshold", v)}
              onOTBreakChange={(v) => update("stormDailyOTThreshold", v)}
              max={24}
              suffix="hrs/day"
              hasST={hasSTRates}
              hasOT={hasOTRates}
              hasDT={hasDTRates}
            />
          </div>

          {/* Weekly toggle + slider */}
          <div className="border-t border-gray-200 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Weekly Thresholds
                </h5>
                <p className="text-xs text-gray-400 mt-0.5">Apply additional overtime rules at the weekly level</p>
              </div>
              <Toggle
                value={data.stormHasWeeklyThreshold}
                onChange={(v) => update("stormHasWeeklyThreshold", v)}
              />
            </div>
            {data.stormHasWeeklyThreshold && (
              <ThresholdSlider
                stBreak={data.stormWeeklySTThreshold}
                otBreak={data.stormWeeklyOTThreshold}
                onSTBreakChange={(v) => update("stormWeeklySTThreshold", v)}
                onOTBreakChange={(v) => update("stormWeeklyOTThreshold", v)}
                max={120}
                suffix="hrs/wk"
                hasST={hasSTRates}
                hasOT={hasOTRates}
                hasDT={hasDTRates}
              />
            )}
          </div>
        </div>
      </SectionCard>

      {/* Expenses */}
      <SectionCard
        title="Expenses"
        desc="Configure meal, lodging, and fuel reimbursement rules"
      >
        <div className="divide-y divide-gray-100">
          {/* ── Meals ── */}
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">Meals</span>
              <div className="w-44 flex-shrink-0">
                <Select
                  value={data.stormExpenses.mealType}
                  onChange={(v) => updateExpenses("mealType", v)}
                  error={!!errors.stormMealType}
                  placeholder="Select..."
                  options={[
                    { id: "per_diem", label: "Per Diem" },
                    { id: "reimbursed", label: "Reimbursed" },
                    { id: "not_covered", label: "Not Covered" },
                  ]}
                />
              </div>
              {data.stormExpenses.mealType === "per_diem" && (
                <div className="w-36">
                  <TextInput
                    value={data.stormExpenses.mealPerDiem}
                    onChange={(v) => updateExpenses("mealPerDiem", v)}
                    placeholder="0.00"
                    prefix="$"
                    suffix="/day"
                    numeric
                    error={!!errors.stormMealPerDiem}
                  />
                </div>
              )}
              {data.stormExpenses.mealType === "not_covered" && (
                <span className="text-xs text-gray-400">Not billable</span>
              )}
            </div>
            {data.stormExpenses.mealType === "reimbursed" && (
              <div className="mt-3 ml-24 pl-4">
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="text-[10px] text-gray-400 mb-0.5">Breakfast</div>
                    <TextInput
                      value={data.stormExpenses.breakfastCap}
                      onChange={(v) => updateExpenses("breakfastCap", v)}
                      placeholder="0.00"
                      prefix="$"
                      numeric
                      error={!!errors.stormBreakfastCap}
                    />
                  </div>
                  <div className="w-24">
                    <div className="text-[10px] text-gray-400 mb-0.5">Lunch</div>
                    <TextInput
                      value={data.stormExpenses.lunchCap}
                      onChange={(v) => updateExpenses("lunchCap", v)}
                      placeholder="0.00"
                      prefix="$"
                      numeric
                      error={!!errors.stormLunchCap}
                    />
                  </div>
                  <div className="w-24">
                    <div className="text-[10px] text-gray-400 mb-0.5">Dinner</div>
                    <TextInput
                      value={data.stormExpenses.dinnerCap}
                      onChange={(v) => updateExpenses("dinnerCap", v)}
                      placeholder="0.00"
                      prefix="$"
                      numeric
                      error={!!errors.stormDinnerCap}
                    />
                  </div>
                  <div className="mt-3">
                    <Checkbox
                      checked={data.stormExpenses.mealReceiptsRequired}
                      onChange={(v) => updateExpenses("mealReceiptsRequired", v)}
                      label="Require receipts"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Lodging ── */}
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">Lodging</span>
              <div className="w-44 flex-shrink-0">
                <Select
                  value={data.stormExpenses.lodgingType}
                  onChange={(v) => updateExpenses("lodgingType", v)}
                  error={!!errors.stormLodgingType}
                  placeholder="Select..."
                  options={[
                    { id: "per_diem", label: "Per Diem" },
                    { id: "reimbursed", label: "Reimbursed" },
                    { id: "not_covered", label: "Not Covered" },
                  ]}
                />
              </div>
              {(data.stormExpenses.lodgingType === "per_diem" || data.stormExpenses.lodgingType === "reimbursed") && (
                <>
                  <div className="w-36">
                    <TextInput
                      value={data.stormExpenses.lodgingRate}
                      onChange={(v) => updateExpenses("lodgingRate", v)}
                      placeholder="0.00"
                      prefix="$"
                      suffix="/night"
                      numeric
                      error={!!errors.stormLodgingRate}
                    />
                  </div>
                  {data.stormExpenses.lodgingType === "reimbursed" && (
                    <Checkbox
                      checked={data.stormExpenses.lodgingReceiptsRequired}
                      onChange={(v) => updateExpenses("lodgingReceiptsRequired", v)}
                      label="Require receipts"
                    />
                  )}
                </>
              )}
              {data.stormExpenses.lodgingType === "not_covered" && (
                <span className="text-xs text-gray-400">Not billable</span>
              )}
            </div>
          </div>

          {/* ── Fuel ── */}
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">Fuel</span>
              <div className="w-44 flex-shrink-0">
                <Select
                  value={data.stormExpenses.fuelType}
                  onChange={(v) => updateExpenses("fuelType", v)}
                  error={!!errors.stormFuelType}
                  placeholder="Select..."
                  options={[
                    { id: "included", label: "Included in Equip. Rate" },
                    { id: "reimbursed", label: "Reimbursed" },
                    { id: "not_covered", label: "Not Covered" },
                  ]}
                />
              </div>
              {data.stormExpenses.fuelType === "reimbursed" && (
                <>
                  <Checkbox
                    checked={data.stormExpenses.fuelReceiptsRequired}
                    onChange={(v) => updateExpenses("fuelReceiptsRequired", v)}
                    label="Require receipts"
                  />
                  <Checkbox
                    checked={data.stormExpenses.fuelReportRequired}
                    onChange={(v) => updateExpenses("fuelReportRequired", v)}
                    label="Require fuel log"
                  />
                </>
              )}
              {data.stormExpenses.fuelType === "included" && (
                <span className="text-xs text-gray-400">Baked into equipment hourly rate</span>
              )}
              {data.stormExpenses.fuelType === "not_covered" && (
                <span className="text-xs text-gray-400">Not billable</span>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Special Day Rates */}
      <SectionCard
        title="Special Day Rates"
        desc="Override rate logic for Saturdays, Sundays, and Holidays"
      >
        <div className="space-y-6">
          {["saturday", "sunday", "holiday"].map((day) => {
            const config = data.stormSpecialDays[day];
            const dayLabel =
              day === "saturday"
                ? "Saturday"
                : day === "sunday"
                ? "Sunday"
                : "Holidays";
            return (
              <div
                key={day}
                className={
                  day !== "saturday" ? "border-t border-gray-200 pt-5" : ""
                }
              >
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  {dayLabel}
                </h5>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Rate Type" error={errors[`specialDay_${day}_rateType`]}>
                    <Select
                      value={config.rateType}
                      onChange={(v) => updateSpecialDay(day, "rateType", v)}
                      options={[
                        { id: "ot", label: "OT (1.5x)" },
                        { id: "dt", label: "DT (2x)" },
                        { id: "st", label: "ST (1x)" },
                        { id: "custom", label: "Custom Multiplier" },
                      ]}
                      placeholder="Select..."
                      error={!!errors[`specialDay_${day}_rateType`]}
                    />
                  </Field>
                  <Field label="Apply To" error={errors[`specialDay_${day}_applyTo`]}>
                    <Select
                      value={config.applyTo}
                      onChange={(v) => updateSpecialDay(day, "applyTo", v)}
                      options={[
                        { id: "all_hours", label: "All Hours" },
                        { id: "first_n", label: "First N Hours Only" },
                        { id: "after_n", label: "After N Hours" },
                      ]}
                      placeholder="Select..."
                      error={!!errors[`specialDay_${day}_applyTo`]}
                    />
                  </Field>
                  {(config.applyTo === "first_n" ||
                    config.applyTo === "after_n") && (
                    <Field label="Hour Threshold" error={errors[`specialDay_${day}_threshold`]}>
                      <TextInput
                        value={config.threshold}
                        onChange={(v) =>
                          updateSpecialDay(day, "threshold", v)
                        }
                        placeholder="0"
                        suffix="hrs"
                        numeric
                        error={!!errors[`specialDay_${day}_threshold`]}
                      />
                    </Field>
                  )}
                </div>
              </div>
            );
          })}

          {/* Holiday Picker */}
          <div className="border-t border-gray-200 pt-5">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Recognized Holidays <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {FEDERAL_HOLIDAYS.map((holiday) => (
                <Checkbox
                  key={holiday}
                  checked={(data.stormHolidays || []).includes(holiday)}
                  onChange={(checked) => {
                    const current = data.stormHolidays || [];
                    update(
                      "stormHolidays",
                      checked
                        ? [...current, holiday]
                        : current.filter((h) => h !== holiday)
                    );
                  }}
                  label={holiday}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Time Division Rates */}
      <SectionCard
        title="Time Division Rates"
        desc="Configure billing for mobilization, demobilization, and standby time"
      >
        <div className="space-y-6">
          {["mobilization", "demobilization", "standby"].map((division) => {
            const config = data.stormTimeDivisions[division];
            const divLabel =
              division === "mobilization"
                ? "Mobilization"
                : division === "demobilization"
                ? "Demobilization"
                : "Standby";
            return (
              <div
                key={division}
                className={
                  division !== "mobilization"
                    ? "border-t border-gray-200 pt-5"
                    : ""
                }
              >
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  {divLabel}
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Applicable On" error={errors[`timeDivision_${division}`]}>
                    <Select
                      value={config.applicableOn}
                      onChange={(v) =>
                        updateTimeDivision(division, "applicableOn", v)
                      }
                      options={[
                        { id: "all_events", label: "All Storm Events" },
                        { id: "cat2_plus", label: "Category 2+ Only" },
                        {
                          id: "when_specified",
                          label: "When Specified in Event",
                        },
                        { id: "not_applicable", label: "Not Applicable" },
                      ]}
                      placeholder="Select..."
                      error={!!errors[`timeDivision_${division}`]}
                    />
                  </Field>
                  {config.applicableOn !== "not_applicable" && (
                    <Field label="Rate Type" error={errors[`timeDivision_${division}_rateType`]}>
                      <Select
                        value={config.rateType}
                        onChange={(v) =>
                          updateTimeDivision(division, "rateType", v)
                        }
                        options={[
                          { id: "st", label: "Straight Time (ST)" },
                          { id: "ot", label: "Overtime (OT)" },
                          { id: "flat_daily", label: "Flat Daily Rate" },
                          { id: "percentage", label: "% of Daily Rate" },
                        ]}
                        placeholder="Select..."
                        error={!!errors[`timeDivision_${division}_rateType`]}
                      />
                    </Field>
                  )}
                </div>
                {config.applicableOn !== "not_applicable" && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Field label="Apply To" error={errors[`timeDivision_${division}_applyTo`]}>
                      <Select
                        value={config.applyTo}
                        onChange={(v) =>
                          updateTimeDivision(division, "applyTo", v)
                        }
                        options={[
                          { id: "labor_only", label: "Labor Only" },
                          {
                            id: "labor_equipment",
                            label: "Labor & Equipment",
                          },
                          { id: "all", label: "All Costs" },
                        ]}
                        placeholder="Select..."
                        error={!!errors[`timeDivision_${division}_applyTo`]}
                      />
                    </Field>
                    <Field label="Max Hours" error={errors[`timeDivision_${division}_threshold`]}>
                      <TextInput
                        value={config.threshold}
                        onChange={(v) =>
                          updateTimeDivision(division, "threshold", v)
                        }
                        placeholder="0"
                        suffix="hrs"
                        numeric
                        error={!!errors[`timeDivision_${division}_threshold`]}
                      />
                    </Field>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Special Instructions */}
      <SectionCard
        title="Special Instructions"
        desc="Additional billing notes or exceptions"
      >
        <Field
          label="Special Instructions"
          optional
          helper="Internal reference only — these notes will not appear on invoices or customer-facing documents"
        >
          <textarea
            value={data.stormSpecialInstructions}
            onChange={(e) =>
              update("stormSpecialInstructions", e.target.value)
            }
            rows={4}
            placeholder="e.g., Holiday rates apply to the actual day only, not observed dates. Mobilization travel time capped at 12 hours per day..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-colors resize-none"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

// ── Bluesky Vendors & COs ──
function BlueskyVendorsCOs({ data, update, errors = {} }) {
  const isLump = data.contractType === "lump";
  const isUnit = data.contractType === "unit";
  const methods = data.vendorBillingMethods || [];

  const toggleMethod = (id) => {
    const next = methods.includes(id) ? methods.filter((m) => m !== id) : [...methods, id];
    update("vendorBillingMethods", next);
  };

  const vendorOptions = [
    ...(isUnit
      ? [{ id: "cu_library", label: "Included in CU Library", desc: "Vendor costs are captured as billable CUs (e.g., flagging, traffic control)" }]
      : []),
    { id: "pass_through", label: "Pass-through at Cost", desc: "Invoice utility at the vendor's actual cost — no markup" },
    { id: "markup", label: "Pass-through + Markup", desc: "Actual cost plus a percentage markup" },
    { id: "lump", label: "Pre-negotiated Lump Sum", desc: "Vendor line items billed at agreed amounts" },
  ];

  return (
    <div className="space-y-5">
      {!isLump && (
        <Section
          title="Vendor Cost Rules"
          desc="How third-party costs (flagging, traffic control, tree removal) are billed to the customer."
        >
          <Field label={isUnit ? "Vendor Billing Methods" : "Vendor Billing Method"} helper={isUnit ? "Select all that apply for this contract" : undefined} error={errors.vendorBillingMethods}>
            {isUnit ? (
              <div className="space-y-2">
                {vendorOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => toggleMethod(opt.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      methods.includes(opt.id)
                        ? "border-gray-900 bg-gray-50/50"
                        : errors.vendorBillingMethods ? "border-red-200 hover:border-red-300" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      methods.includes(opt.id) ? "bg-gray-900 border-gray-900" : "border-gray-300"
                    }`}>
                      {methods.includes(opt.id) && <Check size={10} className="text-white" />}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                      {opt.desc && <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={methods[0] || ""}
                onChange={(v) => update("vendorBillingMethods", [v])}
                options={vendorOptions}
              />
            )}
          </Field>
          <Toggle
            value={data.vendorDocsRequired}
            onChange={(v) => update("vendorDocsRequired", v)}
            label="Vendor receipts/invoices required as invoice backup"
          />
        </Section>
      )}

      <Section
        title="Change Order Rules"
        desc={isLump
          ? "Controls how out-of-scope work is handled — when COs are triggered, whether approval is needed, and how they're billed."
          : "Controls how red lines (scope variances) are handled — when COs are triggered, whether approval is needed before work proceeds, and how they're billed."
        }
      >
        <Field label="Change Order Trigger" error={errors.coTrigger}>
          <RadioGroup
            value={data.coTrigger}
            onChange={(v) => update("coTrigger", v)}
            options={[
              {
                id: "any",
                label: "Any Scope Variance",
                desc: isLump
                  ? "Any work outside the original project scope triggers a CO"
                  : "Any CU quantity or scope change from the original WO triggers a CO",
              },
              {
                id: "threshold",
                label: "Threshold-based",
                desc: "Only variances exceeding a dollar or percentage threshold",
              },
              {
                id: "manual",
                label: "Manual Only",
                desc: "PM decides when to create a CO",
              },
            ]}
          />
        </Field>

        {data.coTrigger === "threshold" && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Threshold Type" error={errors.coThresholdType}>
              <Select
                value={data.coThresholdType}
                onChange={(v) => update("coThresholdType", v)}
                options={["Dollar amount", "Percentage"]}
                error={!!errors.coThresholdType}
              />
            </Field>
            <Field label="Threshold Value" error={errors.coThresholdValue}>
              <TextInput
                value={data.coThresholdValue}
                onChange={(v) => update("coThresholdValue", v)}
                placeholder={
                  data.coThresholdType === "Percentage" ? "10" : "500"
                }
                prefix={data.coThresholdType === "Percentage" ? "" : "$"}
                numeric
                error={!!errors.coThresholdValue}
              />
            </Field>
          </div>
        )}

        <Field label="Authorization Required" error={errors.coAuthRequired}>
          <RadioGroup
            value={data.coAuthRequired}
            onChange={(v) => update("coAuthRequired", v)}
            options={[
              {
                id: "yes",
                label: "Yes — Before Work Proceeds",
                desc: isLump
                  ? "Must get utility approval before executing out-of-scope work."
                  : "Must get utility approval before executing extra work. CU line items are locked until CO is approved.",
              },
              {
                id: "no",
                label: "No — Proceed and Document",
                desc: isLump
                  ? "Crew does the work, CO is submitted after the fact."
                  : "Crew does the work, CO is submitted after the fact. Common for make-ready where field conditions differ from staking sheets.",
              },
            ]}
          />
        </Field>

        {isLump ? (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
            Change orders will be billed at the T&E fallback rates defined in the Rates step.
          </p>
        ) : (
          <Field label="CO Billing Method" error={errors.coBillingMethod}>
            <RadioGroup
              value={data.coBillingMethod}
              onChange={(v) => update("coBillingMethod", v)}
              options={[
                {
                  id: "same",
                  label: "Same Contract Rates",
                  desc: "Change orders billed at the contract's existing rates",
                },
                {
                  id: "separate",
                  label: "Separate CO Rates",
                  desc: "Different rate schedule for change order work (less common)",
                },
              ]}
            />
          </Field>
        )}

        <Field label="CO Numbering">
          <Select
            value={data.coNumbering}
            onChange={(v) => update("coNumbering", v)}
            options={["Auto-sequential (CO-001, CO-002...)", "Manual"]}
          />
        </Field>
      </Section>
    </div>
  );
}

// ── Step 3 Router ──
function Step3({ data, update, errors = {}, setErrors }) {
  if (data.contractType === "storm") {
    return <StormBillingRules data={data} update={update} errors={errors} setErrors={setErrors} />;
  }
  return <BlueskyVendorsCOs data={data} update={update} errors={errors} />;
}

// ═══════════════════════════════════════════════════════════
//  STEP 4: INVOICE CONFIGURATION
// ═══════════════════════════════════════════════════════════
function Step4Payment({ data, update, errors = {} }) {
  const isStorm = data.contractType === "storm";

  return (
    <div className="space-y-5">
      <Section
        title="Payment"
        desc={isStorm ? "Invoice cadence and payment terms for this contract." : "Invoice cadence, payment terms, and retainage for this contract."}
      >
        <div className="space-y-4">
          {/* Row 1: Cadence + Payment Terms */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Invoice Cadence"
              error={errors.invoiceCadence}
              helper={
                isStorm
                  ? "How often invoices are generated during a storm event"
                  : "When invoices are generated for completed work"
              }
            >
              <Select
                value={data.invoiceCadence}
                onChange={(v) => update("invoiceCadence", v)}
                options={
                  isStorm
                    ? [
                        { id: "per_event", label: "Per Event (at closeout)" },
                        { id: "weekly", label: "Weekly During Event" },
                        { id: "daily", label: "Daily During Event" },
                      ]
                    : [
                        ...(data.contractType !== "lump"
                          ? [{ id: "per_wo", label: "Per Work Order Completion" }]
                          : []),
                        { id: "weekly", label: "Weekly" },
                        { id: "biweekly", label: "Biweekly" },
                        { id: "monthly", label: "Monthly" },
                        ...(data.contractType === "lump"
                          ? [{ id: "milestone", label: "Milestone" }]
                          : []),
                      ]
                }
                placeholder="Select cadence..."
                error={!!errors.invoiceCadence}
              />
            </Field>
            <Field label="Payment Terms" error={errors.paymentTerms}>
              <Select
                value={data.paymentTerms}
                onChange={(v) => update("paymentTerms", v)}
                options={
                  isStorm
                    ? [
                        { id: "due_on_receipt", label: "Due on Receipt" },
                        { id: "net_15", label: "Net 15" },
                        { id: "net_30", label: "Net 30" },
                        { id: "net_45", label: "Net 45" },
                        { id: "net_60", label: "Net 60" },
                      ]
                    : [
                        { id: "net_30", label: "Net 30" },
                        { id: "net_45", label: "Net 45" },
                        { id: "net_60", label: "Net 60" },
                        { id: "net_90", label: "Net 90" },
                      ]
                }
                placeholder="Select terms..."
                error={!!errors.paymentTerms}
              />
            </Field>
          </div>

          {/* Row 2: Conditional period start + Retainage */}
          <div className="grid grid-cols-2 gap-4">
            {!isStorm && (data.invoiceCadence === "weekly" || data.invoiceCadence === "biweekly") && (
              <Field label="Period Start Day" error={errors.periodStartDay} helper={!errors.periodStartDay ? "What day does the billing period start?" : undefined}>
                <Select
                  value={data.periodStartDay}
                  onChange={(v) => update("periodStartDay", v)}
                  options={DAYS_OF_WEEK}
                  placeholder="Select..."
                  error={!!errors.periodStartDay}
                />
              </Field>
            )}
            {!isStorm && data.invoiceCadence === "monthly" && (
              <Field label="Period Start Date" error={errors.periodStartDate} helper={!errors.periodStartDate ? "What day of the month does the period start?" : undefined}>
                <Select
                  value={data.periodStartDate}
                  onChange={(v) => update("periodStartDate", v)}
                  options={["1st", "15th"]}
                  placeholder="Select..."
                  error={!!errors.periodStartDate}
                />
              </Field>
            )}
            {!isStorm && (
              <Field label="Retainage" optional helper="% withheld until contract closeout">
                <div className="relative w-32">
                  <input
                    type="text"
                    value={data.retainage}
                    onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) update("retainage", v); }}
                    inputMode="decimal"
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white pr-8 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    %
                  </span>
                </div>
              </Field>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STEP 5: REVIEW & CREATE
// ═══════════════════════════════════════════════════════════
function ReviewRow({ label, value, fallback = "—" }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
        {value || fallback}
      </span>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </h4>
        <button
          onClick={onEdit}
          className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          Edit
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl p-5">{children}</div>
    </div>
  );
}

function Step5Review({ data, goToStep }) {
  const ctLabel =
    CONTRACT_TYPES.find((c) => c.id === data.contractType)?.label || "—";
  const isStorm = data.contractType === "storm";

  // Storm-specific helpers
  const mealLabel = isStorm
    ? data.stormExpenses.mealType === "per_diem"
      ? `Per Diem — $${data.stormExpenses.mealPerDiem || "—"}/day`
      : data.stormExpenses.mealType === "reimbursed"
      ? `Reimbursed (B: $${data.stormExpenses.breakfastCap || "—"} / L: $${data.stormExpenses.lunchCap || "—"} / D: $${data.stormExpenses.dinnerCap || "—"})`
      : "Not Covered"
    : "";

  const lodgingLabel = isStorm
    ? data.stormExpenses.lodgingType === "per_diem"
      ? `Per Diem — $${data.stormExpenses.lodgingRate || "—"}/night`
      : data.stormExpenses.lodgingType === "reimbursed"
      ? `Reimbursed — cap $${data.stormExpenses.lodgingRate || "—"}/night`
      : "Not Covered"
    : "";

  const fuelLabel = isStorm
    ? data.stormExpenses.fuelType === "included"
      ? "Included in Equipment Rate"
      : data.stormExpenses.fuelType === "reimbursed"
      ? "Reimbursed at Cost"
      : "Not Covered"
    : "";

  const specialDayLabel = (day) => {
    const c = data.stormSpecialDays[day];
    const rateMap = {
      ot: "OT (1.5x)",
      dt: "DT (2x)",
      st: "ST (1x)",
      custom: "Custom",
    };
    const applyMap = {
      all_hours: "All hours",
      first_n: `First ${c.threshold || "N"} hrs`,
      after_n: `After ${c.threshold || "N"} hrs`,
    };
    return `${rateMap[c.rateType] || "—"} → ${applyMap[c.applyTo] || "—"}`;
  };

  const divisionLabel = (div) => {
    const c = data.stormTimeDivisions[div];
    if (c.applicableOn === "not_applicable") return "Not Applicable";
    const rateMap = {
      st: "ST",
      ot: "OT",
      flat_daily: "Flat Daily",
      percentage: "% of Daily",
    };
    return `${rateMap[c.rateType] || "—"} · max ${c.threshold || "—"} hrs`;
  };

  return (
    <div className="space-y-2">
      {/* ── Basics ── */}
      <ReviewSection title="Contract Basics" onEdit={() => goToStep(1)}>
        <ReviewRow label="Contract Type" value={ctLabel} />
        <ReviewRow label="Contract Name" value={data.name} />
        {!isStorm && (
          <ReviewRow label="Work Type" value={Array.isArray(data.workType) ? data.workType.join(", ") : data.workType} />
        )}
        <ReviewRow
          label={isStorm ? "Effective Date" : "Start Date"}
          value={data.startDate}
        />
        <ReviewRow
          label={isStorm ? "Expiration Date" : "End Date"}
          value={data.endDate || "Evergreen"}
        />
        {(data.contractType === "te" || data.contractType === "unit") && (
          <ReviewRow
            label="NTE"
            value={data.nte ? `$${data.nte}` : "None"}
          />
        )}
      </ReviewSection>

      {/* ── Rates ── */}
      <ReviewSection title="Rate Configuration" onEdit={() => goToStep(2)}>
        {/* T&E */}
        {data.contractType === "te" && (
          <>
            <ReviewRow
              label="Rate Type"
              value={
                data.teRateType === "per_class"
                  ? "Per Classification"
                  : "Blended"
              }
            />
            <ReviewRow
              label="Billing Basis"
              value={
                data.teBillingBasis === "actuals" ? "Actuals" : "Estimated"
              }
            />
            {data.teRateType === "blended" && (
              <ReviewRow
                label="Blended Rate"
                value={
                  data.blendedRate ? `$${data.blendedRate}/hr` : "—"
                }
              />
            )}
            {data.teRateType === "per_class" && (
              <ReviewRow
                label="Labor Classifications"
                value={`${data.laborRates.length} configured`}
              />
            )}
          </>
        )}
        {/* Unit */}
        {data.contractType === "unit" && (
          <>
            <ReviewRow label="CU Library" value={data.cuLibrary} />
            <ReviewRow
              label="Pricing Model"
              value={
                data.pricingModel === "labor_only" ? "Labor-Only" : "All-In"
              }
            />
            <ReviewRow
              label="T&E Fallback"
              value={
                data.fallbackRateType === "none"
                  ? "None"
                  : data.fallbackRateType === "blended"
                  ? `$${data.fallbackBlendedRate || "—"}/hr`
                  : `${data.fallbackLaborRates.length} classifications`
              }
            />
            <ReviewRow
              label="Billing Exclusions"
              value={`${data.billingExclusions.length} rules`}
            />
          </>
        )}
        {/* Lump */}
        {data.contractType === "lump" && (
          <>
            <ReviewRow
              label="Contract Value"
              value={data.lumpValue ? `$${data.lumpValue}` : "—"}
            />
            <ReviewRow
              label="Payment Structure"
              value={data.paymentStructure}
            />
          </>
        )}
        {/* Storm */}
        {isStorm && (
          <>
            <ReviewRow
              label="Labor Classifications"
              value={`${data.stormLaborRates.length} configured`}
            />
            {data.stormLaborRates.slice(0, 3).map((r, i) => (
              <ReviewRow
                key={i}
                label={`  ${r.classification || "—"}`}
                value={`ST $${r.st || "—"} · OT $${r.ot || "—"} · DT $${r.dt || "—"}`}
              />
            ))}
            {data.stormLaborRates.length > 3 && (
              <ReviewRow
                label=""
                value={`+ ${data.stormLaborRates.length - 3} more`}
              />
            )}
            <ReviewRow
              label="Equipment Types"
              value={`${data.stormEquipmentRates.length} configured (hourly)`}
            />
          </>
        )}
        {/* Bluesky equipment & per diem */}
        {!isStorm && (
          <>
            <ReviewRow
              label="Equipment Types"
              value={`${data.equipmentRates.length} configured`}
            />
            <ReviewRow
              label="Per Diem Reimbursement"
              value={
                data.perDiemBilling === "none"
                  ? "Not billable"
                  : data.perDiemBilling === "flat"
                  ? `$${data.perDiemAmount || "—"}/day (flat)`
                  : `${data.perDiemRates.length} classifications configured`
              }
            />
          </>
        )}
      </ReviewSection>

      {/* ── Step 3 ── */}
      {isStorm ? (
        <ReviewSection title="Billing Rules" onEdit={() => goToStep(3)}>
          <ReviewRow label="Work Week Start" value={data.stormWorkWeekStart} />
          <ReviewRow
            label="Daily Thresholds"
            value={`ST→OT at ${data.stormDailySTThreshold}h · OT→DT at ${data.stormDailyOTThreshold}h`}
          />
          <ReviewRow
            label="Weekly Thresholds"
            value={
              data.stormHasWeeklyThreshold
                ? `ST limit ${data.stormWeeklySTThreshold}h · OT limit ${data.stormWeeklyOTThreshold}h`
                : "Not applied"
            }
          />
          <ReviewRow label="Meals" value={mealLabel} />
          <ReviewRow label="Lodging" value={lodgingLabel} />
          <ReviewRow label="Fuel" value={fuelLabel} />
          <ReviewRow label="Saturday" value={specialDayLabel("saturday")} />
          <ReviewRow label="Sunday" value={specialDayLabel("sunday")} />
          <ReviewRow label="Holidays" value={specialDayLabel("holiday")} />
          <ReviewRow
            label="Recognized Holidays"
            value={
              (data.stormHolidays || []).length > 0
                ? `${data.stormHolidays.length} selected`
                : "None"
            }
          />
          <ReviewRow
            label="Mobilization"
            value={divisionLabel("mobilization")}
          />
          <ReviewRow
            label="Demobilization"
            value={divisionLabel("demobilization")}
          />
          <ReviewRow label="Standby" value={divisionLabel("standby")} />
        </ReviewSection>
      ) : (
        <ReviewSection
          title={data.contractType === "lump" ? "Change Orders" : "Vendor Costs & Change Orders"}
          onEdit={() => goToStep(3)}
        >
          {data.contractType !== "lump" && (
            <>
              <ReviewRow
                label="Vendor Billing"
                value={
                  (() => {
                    const vm = data.vendorBillingMethods || [];
                    const labels = vm.map((m) =>
                      m === "cu_library" ? "Included in CU library"
                      : m === "pass_through" ? "Pass-through at cost"
                      : m === "markup" ? "Pass-through + markup"
                      : "Pre-negotiated lump sum"
                    );
                    return labels.join(", ") || "—";
                  })()
                }
              />
              <ReviewRow
                label="Documentation Required"
                value={data.vendorDocsRequired ? "Yes" : "No"}
              />
            </>
          )}
          <ReviewRow
            label="CO Trigger"
            value={
              data.coTrigger === "any"
                ? "Any scope variance"
                : data.coTrigger === "threshold"
                ? `Threshold: ${
                    data.coThresholdType === "Percentage"
                      ? data.coThresholdValue + "%"
                      : "$" + data.coThresholdValue
                  }`
                : "Manual only"
            }
          />
          <ReviewRow
            label="Authorization Required"
            value={
              data.coAuthRequired === "yes"
                ? "Yes — before work"
                : "No — proceed and document"
            }
          />
          <ReviewRow
            label="CO Billing"
            value={
              data.contractType === "lump"
                ? "T&E fallback rates"
                : data.coBillingMethod === "same"
                ? "Same contract rates"
                : "Separate CO rates"
            }
          />
        </ReviewSection>
      )}

      {/* ── Payment ── */}
      <ReviewSection title="Payment" onEdit={() => goToStep(4)}>
        <ReviewRow
          label="Invoice Cadence"
          value={
            ({
              per_event: "Per Event (at closeout)",
              weekly: isStorm ? "Weekly During Event" : "Weekly",
              daily: "Daily During Event",
              per_wo: "Per Work Order Completion",
              biweekly: "Biweekly",
              monthly: "Monthly",
              milestone: "Milestone",
            })[data.invoiceCadence] || "—"
          }
        />
        <ReviewRow
          label="Payment Terms"
          value={
            ({
              due_on_receipt: "Due on Receipt",
              net_15: "Net 15",
              net_30: "Net 30",
              net_45: "Net 45",
              net_60: "Net 60",
              net_90: "Net 90",
            })[data.paymentTerms] || "—"
          }
        />
        {!isStorm && (
          <ReviewRow
            label="Retainage"
            value={data.retainage ? `${data.retainage}%` : "None"}
          />
        )}
      </ReviewSection>

      {/* Storm special instructions */}
      {isStorm && data.stormSpecialInstructions && (
        <ReviewSection
          title="Special Instructions"
          onEdit={() => goToStep(3)}
        >
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {data.stormSpecialInstructions}
          </p>
        </ReviewSection>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SUCCESS STATE
// ═══════════════════════════════════════════════════════════
function SuccessState({ data, onReset, onBackToContracts }) {
  const isStorm = data.contractType === "storm";
  const ctLabel =
    CONTRACT_TYPES.find((c) => c.id === data.contractType)?.label || "Contract";

  return (
    <div className="h-full bg-gray-50/50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-emerald-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {ctLabel} Contract Created
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium text-gray-900">
            {data.name || "New Contract"}
          </span>{" "}
          has been created for{" "}
          <span className="font-medium text-gray-900">
            {data.customer || "—"}
          </span>
          .
        </p>
        {isStorm && (
          <p className="text-xs text-gray-400 mb-6">
            {data.stormLaborRates.length} labor classifications ·{" "}
            {data.stormEquipmentRates.length} equipment types
          </p>
        )}
        {!isStorm && <div className="mb-6" />}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onBackToContracts || onReset}
            className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
          >
            Back to Contracts
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            {isStorm ? (
              <>
                <Zap size={16} />
                Create Storm Event
              </>
            ) : (
              <>
                <Plus size={16} />
                Create First Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SIDEBAR + LANDING PAGE
// ═══════════════════════════════════════════════════════════

const ORG_TREE = {
  id: "powergrid", name: "PowerGrid Services", location: "Hartselle, AL",
  children: [
    { id: "pg-distribution", name: "PowerGrid Distribution", location: "Hartselle, AL", children: [
      { id: "electralines", name: "ElectraLines", location: "Birmingham, AL" },
      { id: "gridtech", name: "GridTech", location: "Garner, NC" },
      { id: "james-plc", name: "James Power Line Construction", location: "Boerne, TX" },
    ]},
    { id: "pg-transmission", name: "PowerGrid Transmission", location: "Hartselle, AL", children: [
      { id: "apex-transmission", name: "Apex Transmission", location: "Nashville, TN" },
      { id: "southern-line", name: "Southern Line Services", location: "Atlanta, GA" },
    ]},
    { id: "pg-vegetation", name: "PowerGrid Vegetation", location: "Hartselle, AL", children: [
      { id: "clearpath", name: "ClearPath Tree Services", location: "Charlotte, NC" },
      { id: "greenline", name: "GreenLine Vegetation", location: "Raleigh, NC" },
    ]},
    { id: "premium-uc", name: "Premium Utility Contractor", location: "Boca Raton, FL", children: [
      { id: "coastal-electric", name: "Coastal Electric Works", location: "Tampa, FL" },
      { id: "sunbelt-power", name: "Sunbelt Power Services", location: "Orlando, FL" },
    ]},
  ],
};

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

const STATUS_CONFIG = {
  active: { label: "Active", dot: "bg-emerald-500" },
  draft: { label: "Draft", dot: "bg-gray-400" },
  expired: { label: "Expired", dot: "bg-red-400" },
  archived: { label: "Archived", dot: "bg-gray-300" },
};

const TYPE_LABELS = { te: "T&E", unit: "Unit-Price", lump: "Lump Sum", storm: "Storm" };

const SAMPLE_CONTRACTS = [
  {
    id: "CTR-001", name: "OH Distribution — T&E Services 2026", type: "te", status: "active",
    startDate: "2026-01-15", endDate: "2026-12-31", customer: CURRENT_ORG,
    workType: ["OH Distribution"], billingEntity: "PowerGrid Distribution Services",
    nte: "2,400,000",
    teRateType: "per_class", teBillingBasis: "hourly",
    laborRates: [
      { classification: "General Foreman", invoiceLabel: "GF", st: "92.50", ot: "138.75", dt: "185.00" },
      { classification: "Foreman", invoiceLabel: "Foreman", st: "85.00", ot: "127.50", dt: "170.00" },
      { classification: "Journeyman Lineman", invoiceLabel: "Class A Lineman", st: "78.00", ot: "117.00", dt: "156.00" },
      { classification: "Apprentice Lineman", invoiceLabel: "Class B Lineman", st: "55.00", ot: "82.50", dt: "110.00" },
      { classification: "Groundman", invoiceLabel: "Groundman", st: "42.00", ot: "63.00", dt: "84.00" },
      { classification: "Operator", invoiceLabel: "Equipment Operator", st: "68.00", ot: "102.00", dt: "136.00" },
    ],
    equipmentRates: [
      { type: "Digger Derrick", rate: "85.00", hiUtil: "95.00", threshold: "45" },
      { type: "Bucket Truck (55')", rate: "65.00", hiUtil: "72.00", threshold: "45" },
      { type: "Pickup Truck", rate: "25.00", hiUtil: "", threshold: "" },
    ],
    otCalc: "Daily + Weekly", workweekStart: "Monday", satRate: "OT", sunRate: "DT",
    perDiemBilling: "flat", perDiemAmount: "175",
    vendorBillingMethods: ["pass_through"],
    coTrigger: "threshold", coThresholdType: "Dollar amount", coThresholdValue: "5000",
    coAuthRequired: "pm_approval", coBillingMethod: "same",
    invoiceCadence: "weekly", periodStartDay: "Monday", paymentTerms: "net_30", retainage: "5",
    kpis: { billedToDate: "$847,200", activeWOs: 14, crewsAssigned: 3, budgetUsed: "35%" },
  },
  {
    id: "CTR-002", name: "UG Residential Expansion — Phase 2", type: "unit", status: "active",
    startDate: "2026-02-01", endDate: "2026-09-30", customer: CURRENT_ORG,
    workType: ["UG Distribution"], billingEntity: "PowerGrid Distribution Services",
    cuLibrary: `${CURRENT_ORG} – UG Distribution 2026`, pricingModel: "all_in",
    fallbackRateType: "per_class",
    fallbackLaborRates: [
      { classification: "Foreman", invoiceLabel: "Foreman", st: "82.00", ot: "123.00", dt: "164.00" },
      { classification: "Journeyman Lineman", invoiceLabel: "Class A Lineman", st: "74.00", ot: "111.00", dt: "148.00" },
      { classification: "Operator", invoiceLabel: "Equipment Operator", st: "65.00", ot: "97.50", dt: "130.00" },
    ],
    vendorBillingMethods: ["cu_library", "pass_through"],
    coTrigger: "threshold", coThresholdType: "Dollar amount", coThresholdValue: "2500",
    coAuthRequired: "pm_approval", coBillingMethod: "same",
    perDiemBilling: "flat", perDiemAmount: "150",
    invoiceCadence: "biweekly", periodStartDay: "Monday", paymentTerms: "net_30", retainage: "10",
    kpis: { billedToDate: "$412,800", activeWOs: 47, unitsCompleted: "1,284", budgetUsed: "52%" },
  },
  {
    id: "CTR-003", name: "Main Street Rebuild", type: "lump", status: "active",
    startDate: "2026-04-01", endDate: "2026-08-15", customer: CURRENT_ORG,
    workType: ["OH Distribution"], billingEntity: "PowerGrid Distribution Services",
    lumpValue: "680,000",
    paymentStructure: "milestone",
    milestones: [
      { name: "Mobilization & Permits", amount: "68,000", trigger: "Approval" },
      { name: "Pole Replacement (Phase 1)", amount: "204,000", trigger: "Inspection" },
      { name: "Wire & Transformer Install", amount: "238,000", trigger: "Inspection" },
      { name: "Final Closeout", amount: "170,000", trigger: "Approval" },
    ],
    coTrigger: "any", coAuthRequired: "dual_approval", coBillingMethod: "te",
    invoiceCadence: "monthly", paymentTerms: "net_30", retainage: "10",
    kpis: { billedToDate: "$272,000", milestonesComplete: "1 of 4", pctComplete: "28%", budgetUsed: "40%" },
  },
  {
    id: "CTR-004", name: "Storm Master Agreement 2026", type: "storm", status: "active",
    startDate: "2026-01-01", endDate: "2026-12-31", customer: CURRENT_ORG,
    stormLaborRates: [
      { classification: "General Foreman", invoiceLabel: "GF", st: "105.00", ot: "157.50", dt: "210.00" },
      { classification: "Foreman", invoiceLabel: "FM", st: "95.00", ot: "142.50", dt: "190.00" },
      { classification: "Journeyman Lineman", invoiceLabel: "JL", st: "88.00", ot: "132.00", dt: "176.00" },
      { classification: "Apprentice Lineman", invoiceLabel: "AL", st: "62.00", ot: "93.00", dt: "124.00" },
      { classification: "Groundman", invoiceLabel: "GR", st: "48.00", ot: "72.00", dt: "96.00" },
    ],
    stormEquipmentRates: [
      { type: "Digger Derrick", invoiceLabel: "DD", rate: "95.00", approvalRequired: "No" },
      { type: "Bucket Truck (55')", invoiceLabel: "BT55", rate: "72.00", approvalRequired: "No" },
      { type: "Bucket Truck (65')", invoiceLabel: "BT65", rate: "85.00", approvalRequired: "No" },
      { type: "Pickup Truck", invoiceLabel: "PU", rate: "28.00", approvalRequired: "No" },
    ],
    stormWorkWeekStart: "Sunday",
    stormDailySTThreshold: 8, stormDailyOTThreshold: 16,
    stormExpenses: { mealType: "per_diem", mealPerDiem: "75", lodgingType: "reimbursed", lodgingRate: "150", fuelType: "reimbursed" },
    stormSpecialDays: {
      saturday: { rateType: "OT", applyTo: "all_hours" },
      sunday: { rateType: "DT", applyTo: "all_hours" },
      holiday: { rateType: "DT", applyTo: "all_hours" },
    },
    invoiceCadence: "weekly", paymentTerms: "net_15",
    kpis: { billedToDate: "$0", eventsActivated: 0, status: "Standing — no active events" },
  },
  {
    id: "CTR-005", name: "Vegetation Management — Annual", type: "te", status: "expired",
    startDate: "2025-01-01", endDate: "2025-12-31", customer: CURRENT_ORG,
    workType: ["Vegetation Management"],
    kpis: { billedToDate: "$1,240,000", activeWOs: 0, crewsAssigned: 0, budgetUsed: "100%" },
  },
  {
    id: "CTR-006", name: "Fiber Attachment — Make-Ready", type: "unit", status: "draft",
    startDate: "", endDate: "", customer: CURRENT_ORG,
    workType: ["Make-Ready"],
    kpis: { billedToDate: "$0", activeWOs: 0, unitsCompleted: "0", budgetUsed: "0%" },
  },
];

function formatDateShort(d) {
  if (!d) return "—";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getGroupIds(sub) {
  const ids = [sub.id];
  if (sub.children) sub.children.forEach((gc) => ids.push(gc.id));
  return ids;
}

// ── Sidebar Nav Components ──

function SidebarNavItem({ item, activeId, onSelect, expanded, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const [hoveredChild, setHoveredChild] = useState(null);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded.includes(item.id);
  const isActive = activeId === item.id;
  const Icon = item.icon;
  const showParentHover = hovered && !(isActive && !hasChildren);
  return (
    <div>
      <button onClick={() => (hasChildren ? onToggle(item.id) : onSelect(item.id))} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
        style={{ borderRadius: "6px", ...(isActive && !hasChildren ? { color: "#F4722B", fontWeight: 600 } : { color: "#4D4D4D" }), ...(showParentHover ? { background: "rgba(228,227,232,0.5)" } : {}) }}>
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="flex-shrink-0" style={{ color: isActive && !hasChildren ? "#F4722B" : "#4D4D4D" }} />
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
              <button key={child.id} onClick={() => onSelect(child.id)} onMouseEnter={() => setHoveredChild(child.id)} onMouseLeave={() => setHoveredChild(null)}
                className="w-full text-left pl-10 pr-3 py-1.5 text-sm transition-colors"
                style={{ borderRadius: "6px", ...(isChildActive ? { color: "#F4722B", fontWeight: 600 } : { color: "#4D4D4D" }), ...(isChildHovered ? { background: "rgba(228,227,232,0.5)" } : {}) }}>
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SidebarSectionLabel({ label }) {
  return (
    <div className="flex items-center gap-2 px-3 mb-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function OrgRow({ selected, onChange, label, sublabel, indent = 0, hovered, onHover, onLeave }) {
  return (
    <button onClick={onChange} onMouseEnter={onHover} onMouseLeave={onLeave}
      className="w-full flex items-center justify-between text-sm text-left transition-colors"
      style={{ borderRadius: "8px", paddingLeft: `${10 + indent * 14}px`, paddingRight: "10px", paddingTop: "7px", paddingBottom: "7px", color: selected ? "#111827" : indent ? "#4D4D4D" : "#293037", fontWeight: selected ? 500 : indent ? 400 : 500, background: selected ? "#F3F4F6" : hovered ? "#F9FAFB" : "transparent" }}>
      <span className="flex items-center gap-2 truncate min-w-0">
        <span className="truncate">{label}</span>
        {sublabel && <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400, flexShrink: 0 }}>{sublabel}</span>}
      </span>
      {selected && <Check size={15} style={{ color: "#111827", flexShrink: 0, marginLeft: 8 }} />}
    </button>
  );
}

function OrgSwitcherDropdown({ selectedOrg, onSelectOrg, isOpen, onToggle }) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const ref = useRef(null);
  const searchRef = useRef(null);
  useEffect(() => { if (isOpen && searchRef.current) searchRef.current.focus(); }, [isOpen]);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onToggle(false); };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onToggle]);
  useEffect(() => {
    if (isOpen) {
      const toExpand = [];
      for (const sub of ORG_TREE.children) {
        const groupIds = getGroupIds(sub);
        if ((groupIds.includes(selectedOrg) || selectedOrg === `${sub.id}-entity`) && !expandedGroups.includes(sub.id)) toExpand.push(sub.id);
      }
      if (toExpand.length) setExpandedGroups((prev) => [...prev, ...toExpand]);
    }
  }, [isOpen]);
  const toggleGroup = (gid) => setExpandedGroups((prev) => (prev.includes(gid) ? prev.filter((id) => id !== gid) : [...prev, gid]));
  const selectAndClose = (id) => { onSelectOrg(id); onToggle(false); };
  const q = search.toLowerCase();
  const filteredSubs = ORG_TREE.children.filter((c) => { const nm = c.name.toLowerCase().includes(q); const cm = c.children && c.children.some((gc) => gc.name.toLowerCase().includes(q)); return nm || cm; });
  const showAll = !q || "all organizations".includes(q);
  if (!isOpen) return null;
  return (
    <div ref={ref} className="absolute left-0 top-full mt-1 z-50" style={{ width: "300px" }}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
        <div className="p-2 border-b border-gray-100">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input ref={searchRef} type="text" placeholder="Search organizations..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none w-full" />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto py-1 px-1.5">
          {showAll && <OrgRow selected={selectedOrg === "all"} onChange={() => selectAndClose("all")} label="All Organizations" hovered={hoveredId === "all"} onHover={() => setHoveredId("all")} onLeave={() => setHoveredId(null)} />}
          {showAll && <div className="h-px bg-gray-100 mx-1.5 my-1" />}
          {(!q || ORG_TREE.name.toLowerCase().includes(q)) && <OrgRow selected={selectedOrg === ORG_TREE.id} onChange={() => selectAndClose(ORG_TREE.id)} label={ORG_TREE.name} hovered={hoveredId === ORG_TREE.id} onHover={() => setHoveredId(ORG_TREE.id)} onLeave={() => setHoveredId(null)} />}
          {filteredSubs.map((sub) => {
            const isExp = expandedGroups.includes(sub.id) || q.length > 0;
            const subMatch = sub.name.toLowerCase().includes(q);
            const fgc = sub.children ? sub.children.filter((gc) => !q || gc.name.toLowerCase().includes(q) || subMatch) : [];
            const cnt = (sub.children ? sub.children.length : 0) + 1;
            const gh = hoveredId === `${sub.id}-header`;
            return (
              <div key={sub.id}>
                <button className="w-full flex items-center justify-between text-sm text-left transition-colors"
                  style={{ borderRadius: "8px", paddingLeft: "10px", paddingRight: "6px", paddingTop: "7px", paddingBottom: "7px", color: "#293037", fontWeight: 500, ...(gh ? { background: "#F9FAFB" } : {}) }}
                  onMouseEnter={() => setHoveredId(`${sub.id}-header`)} onMouseLeave={() => setHoveredId(null)} onClick={() => toggleGroup(sub.id)}>
                  <span className="truncate">{sub.name}</span>
                  <span className="flex items-center gap-1.5 flex-shrink-0">
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}>{cnt}</span>
                    {isExp ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                  </span>
                </button>
                {isExp && (
                  <div className="mb-0.5">
                    <OrgRow selected={selectedOrg === sub.id} onChange={() => selectAndClose(sub.id)} label={sub.name} sublabel="All" indent={1} hovered={hoveredId === `${sub.id}-all`} onHover={() => setHoveredId(`${sub.id}-all`)} onLeave={() => setHoveredId(null)} />
                    {(!q || subMatch) && <OrgRow selected={selectedOrg === `${sub.id}-entity`} onChange={() => selectAndClose(`${sub.id}-entity`)} label={sub.name} indent={1} hovered={hoveredId === `${sub.id}-entity`} onHover={() => setHoveredId(`${sub.id}-entity`)} onLeave={() => setHoveredId(null)} />}
                    {fgc.map((gc) => <OrgRow key={gc.id} selected={selectedOrg === gc.id} onChange={() => selectAndClose(gc.id)} label={gc.name} indent={1} hovered={hoveredId === gc.id} onHover={() => setHoveredId(gc.id)} onLeave={() => setHoveredId(null)} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CollapsedSidebarIcon({ item, activeId, onSelect, setSidebarOpen, setExpanded }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  const isActive = activeId === item.id || (item.children && item.children.some((c) => c.id === activeId));
  return (
    <button onClick={() => { if (item.children) { setSidebarOpen(true); setExpanded((prev) => (prev.includes(item.id) ? prev : [...prev, item.id])); } else { onSelect(item.id); } }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="p-2.5 transition-colors" style={{ borderRadius: "6px", ...(isActive ? { color: "#F4722B" } : { color: "#4D4D4D" }), ...(!isActive && hovered ? { background: "rgba(228,227,232,0.5)" } : {}) }} title={item.label}>
      <Icon size={18} />
    </button>
  );
}

// ── Landing Page Components ──

function ContractRowActions({ onArchive, onDelete, isDraft }) {
  return (
    <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg overflow-hidden z-30 py-1" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
      <button onClick={onArchive} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Archive size={14} className="text-gray-400" /> Archive</button>
      {isDraft ? (
        <>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={onDelete} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} className="text-red-400" /> Delete</button>
        </>
      ) : (
        <>
          <div className="border-t border-gray-100 my-1" />
          <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 cursor-not-allowed"><Trash2 size={14} className="text-gray-200" /> Delete</button>
        </>
      )}
    </div>
  );
}

function EmptyContractState({ onCreateContract }) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white">
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-5">
          <FileText size={24} className="text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">No contracts yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">Create your first contract with this customer to define rates, billing rules, and payment terms.</p>
        <button onClick={onCreateContract} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: "#4D4D4D", color: "white" }}>
          <Plus size={16} /> New Contract
        </button>
      </div>
    </div>
  );
}

function ContractsTable({ contracts, onCreateContract, onViewContract, onArchive, onDelete }) {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archiveToast, setArchiveToast] = useState(null);
  const filtered = contracts.filter((c) => {
    const isArchived = c.status === "archived";
    if (showArchived ? !isArchived : isArchived) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || TYPE_LABELS[c.type].toLowerCase().includes(q);
  });
  const archiveCount = contracts.filter((c) => c.status === "archived").length;
  const handleArchive = (id) => {
    const contract = contracts.find((c) => c.id === id);
    onArchive && onArchive(id);
    setOpenMenu(null);
    setArchiveToast(contract?.name || "Contract");
    setTimeout(() => setArchiveToast(null), 2500);
  };
  const handleDelete = (id) => {
    onDelete && onDelete(id);
    setOpenMenu(null);
  };
  return (
    <div className="relative">
      {archiveToast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Archive size={14} className="text-gray-400" />
          {archiveToast} archived
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-colors" />
        </div>
        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
          <button onClick={() => setShowArchived(false)}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ background: !showArchived ? "#F3F4F6" : "white", color: !showArchived ? "#111827" : "#9CA3AF" }}>
            Active
          </button>
          <button onClick={() => setShowArchived(true)}
            className="px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-200"
            style={{ background: showArchived ? "#F3F4F6" : "white", color: showArchived ? "#111827" : "#9CA3AF" }}>
            Archived{archiveCount > 0 ? ` (${archiveCount})` : ""}
          </button>
        </div>
        <div className="flex-1" />
        <button onClick={onCreateContract} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0" style={{ background: "#4D4D4D", color: "white" }}>
          <Plus size={16} /> New Contract
        </button>
      </div>
      <div className="border border-gray-200 rounded-lg bg-white overflow-visible">
        <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: "#f9f9fb" }} className="border-b border-gray-200">
              <th className="py-2.5 px-4 text-xs font-medium text-left" style={{ color: "#2B333B" }}>Contract</th>
              <th className="py-2.5 px-4 text-xs font-medium text-left" style={{ color: "#2B333B" }}>Status</th>
              <th className="py-2.5 px-4 text-xs font-medium text-left" style={{ color: "#2B333B" }}>Term</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center"><p className="text-sm text-gray-400">{showArchived ? "No archived contracts." : "No contracts match your search."}</p></td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} onClick={() => onViewContract && onViewContract(c)} className="border-b border-gray-100 last:border-0 cursor-pointer transition-colors group" style={{ background: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9fb")} onMouseLeave={(e) => (e.currentTarget.style.background = "white")}>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{TYPE_LABELS[c.type]}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[c.status].dot}`} />
                    {STATUS_CONFIG[c.status].label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{c.startDate ? `${formatDateShort(c.startDate)} – ${formatDateShort(c.endDate)}` : "—"}</span>
                </td>
                <td className="py-3 px-2 relative text-right">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }}
                    className="p-2.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenu === c.id && <ContractRowActions onArchive={() => handleArchive(c.id)} onDelete={() => handleDelete(c.id)} isDraft={c.status === "draft"} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 px-1"><span className="text-xs text-gray-400">{filtered.length} contract{filtered.length !== 1 ? "s" : ""}</span></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CONTRACT DETAIL VIEW
// ═══════════════════════════════════════════════════════════

const TYPE_COLORS = {
  te: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  unit: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  lump: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  storm: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

const cardLastChildStyle = `
  .detail-card > *:last-child { border-bottom: none !important; }
  .detail-card > div:last-child > *:last-child { border-bottom: none !important; }
`;

function DetailSection({ title, children, card = false }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
      {card ? (
        <>
          <style>{cardLastChildStyle}</style>
          <div className="detail-card" style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "0.75rem", padding: "0 1.25rem", overflow: "hidden" }}>{children}</div>
        </>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-center py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold text-gray-900 ${mono ? "tabular-nums" : ""}`}>{value || "—"}</span>
    </div>
  );
}

function DetailRateTable({ columns, rows }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-200 flex">
        {columns.map((col) => (
          <div key={col.key} className={`py-2.5 px-3 text-xs font-medium text-gray-500 ${col.width || "flex-1"} ${col.align === "right" ? "text-right" : ""}`}>
            {col.label}
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center border-b border-gray-100 last:border-0 bg-white">
          {columns.map((col) => (
            <div key={col.key} className={`py-2.5 px-3 text-sm ${col.width || "flex-1"} ${col.align === "right" ? "text-right tabular-nums" : ""} ${col.primary ? "font-medium text-gray-900" : "text-gray-600"}`}>
              {col.prefix && row[col.key] ? `${col.prefix}${row[col.key]}` : row[col.key] || "—"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ContractDetailView({ contract, onBack, onEdit }) {
  const [tab, setTab] = useState("overview");
  const c = contract;
  const isTE = c.type === "te";
  const isUnit = c.type === "unit";
  const isLump = c.type === "lump";
  const isStorm = c.type === "storm";
  const tc = TYPE_COLORS[c.type];

  const detailTabs = [
    { id: "overview", label: "Overview" },
    { id: "amendments", label: "Amendments" },
    { id: "documents", label: "Documents" },
  ];

  // ── Overview Tab ──
  const renderOverview = () => (
    <div className="grid grid-cols-3 gap-6">
      {/* Left — 2 cols */}
      <div className="col-span-2 space-y-6">
        {/* Rate Schedule */}
        {(isTE || isStorm) && (
          <DetailSection title="Labor Rate Schedule">
            <DetailRateTable
              columns={[
                { key: "classification", label: "Internal Classification", primary: true },
                { key: "invoiceLabel", label: "Invoice Classification" },
                { key: "st", label: "ST", align: "right", prefix: "$", width: "w-24" },
                { key: "ot", label: "OT", align: "right", prefix: "$", width: "w-24" },
                { key: "dt", label: "DT", align: "right", prefix: "$", width: "w-24" },
              ]}
              rows={isStorm ? (c.stormLaborRates || []) : (c.laborRates || [])}
            />
          </DetailSection>
        )}

        {(isTE || isStorm) && (
          <DetailSection title="Equipment Rate Schedule">
            <DetailRateTable
              columns={[
                { key: "type", label: "Internal Classification", primary: true },
                ...(isStorm
                  ? [
                      { key: "invoiceLabel", label: "Invoice Classification" },
                      { key: "rate", label: "Hourly Rate", align: "right", prefix: "$", width: "w-28" },
                      { key: "approvalRequired", label: "Approval Req.", width: "w-28" },
                    ]
                  : [
                      { key: "rate", label: "Hourly Rate", align: "right", prefix: "$", width: "w-28" },
                      { key: "hiUtil", label: "Hi-Util Rate", align: "right", prefix: "$", width: "w-28" },
                      { key: "threshold", label: "Threshold", align: "right", width: "w-24" },
                    ]
                ),
              ]}
              rows={isStorm ? (c.stormEquipmentRates || []) : (c.equipmentRates || [])}
            />
          </DetailSection>
        )}

        {isUnit && (
          <>
            <DetailSection title="CU Library & Pricing" card>
              <DetailRow label="CU Library" value={c.cuLibrary} />
              <DetailRow label="Pricing Model" value={c.pricingModel === "all_in" ? "All-In (labor + materials)" : c.pricingModel === "labor_only" ? "Labor-Only" : "—"} />
              <DetailRow label="T&E Fallback" value={
                c.fallbackRateType === "none" ? "None"
                : c.fallbackRateType === "blended" ? `Blended Rate${c.fallbackBlendedRate ? ` — $${c.fallbackBlendedRate}/hr` : ""}`
                : c.fallbackRateType === "per_class" ? "Per Classification"
                : "—"
              } />
            </DetailSection>
            {c.fallbackRateType === "per_class" && (c.fallbackLaborRates || []).length > 0 && (
              <DetailSection title="T&E Fallback Rates">
                <DetailRateTable
                  columns={[
                    { key: "classification", label: "Internal Classification", primary: true },
                    { key: "invoiceLabel", label: "Invoice Classification" },
                    { key: "st", label: "ST", align: "right", prefix: "$", width: "w-24" },
                    { key: "ot", label: "OT", align: "right", prefix: "$", width: "w-24" },
                    { key: "dt", label: "DT", align: "right", prefix: "$", width: "w-24" },
                  ]}
                  rows={c.fallbackLaborRates || []}
                />
              </DetailSection>
            )}
            {(c.equipmentRates || []).length > 0 && (
              <DetailSection title="Equipment Rate Schedule">
                <DetailRateTable
                  columns={[
                    { key: "type", label: "Internal Classification", primary: true },
                    { key: "rate", label: "Hourly Rate", align: "right", prefix: "$", width: "w-28" },
                    { key: "hiUtil", label: "Hi-Util Rate", align: "right", prefix: "$", width: "w-28" },
                    { key: "threshold", label: "Threshold", align: "right", width: "w-24" },
                  ]}
                  rows={c.equipmentRates}
                />
              </DetailSection>
            )}
          </>
        )}

        {isLump && (
          <>
            <DetailSection title="Contract Value" card>
              <DetailRow label="Contract Value" value={c.lumpValue ? `$${c.lumpValue}` : "—"} />
              <DetailRow label="Payment Structure" value={
                c.paymentStructure === "milestone" ? "Milestone-Based"
                : c.paymentStructure === "pct_complete" ? "Percent Complete"
                : c.paymentStructure === "periodic_draw" ? "Periodic Draw"
                : c.paymentStructure || "—"
              } />
            </DetailSection>
            {c.milestones && c.milestones.length > 0 && (
              <DetailSection title="Milestone Schedule">
                <DetailRateTable
                  columns={[
                    { key: "name", label: "Milestone", primary: true },
                    { key: "amount", label: "Amount", align: "right", prefix: "$", width: "w-32" },
                    { key: "trigger", label: "Trigger", width: "w-28" },
                  ]}
                  rows={c.milestones}
                />
              </DetailSection>
            )}
            {(c.fallbackLaborRates || []).length > 0 && (
              <DetailSection title="T&E Fallback — Labor Rates">
                <DetailRateTable
                  columns={[
                    { key: "classification", label: "Internal Classification", primary: true },
                    { key: "invoiceLabel", label: "Invoice Classification" },
                    { key: "st", label: "ST", align: "right", prefix: "$", width: "w-24" },
                    { key: "ot", label: "OT", align: "right", prefix: "$", width: "w-24" },
                    { key: "dt", label: "DT", align: "right", prefix: "$", width: "w-24" },
                  ]}
                  rows={c.fallbackLaborRates}
                />
              </DetailSection>
            )}
            {(c.fallbackEquipmentRates || []).length > 0 && (
              <DetailSection title="T&E Fallback — Equipment Rates">
                <DetailRateTable
                  columns={[
                    { key: "type", label: "Internal Classification", primary: true },
                    { key: "rate", label: "Hourly Rate", align: "right", prefix: "$", width: "w-28" },
                  ]}
                  rows={c.fallbackEquipmentRates}
                />
              </DetailSection>
            )}
          </>
        )}

        {/* Billing Rules */}
        <DetailSection title={isStorm ? "Storm Billing Rules" : "Billing Rules"} card>
          {isStorm ? (
            <div className="space-y-0">
              <DetailRow label="Work Week Start" value={c.stormWorkWeekStart} />
              <DetailRow label="Daily ST→OT Threshold" value={c.stormDailySTThreshold ? `${c.stormDailySTThreshold} hrs` : "—"} />
              <DetailRow label="Daily OT→DT Threshold" value={c.stormDailyOTThreshold ? `${c.stormDailyOTThreshold} hrs` : "—"} />
              {c.stormHasWeeklyThreshold && (
                <>
                  <DetailRow label="Weekly ST→OT Threshold" value={c.stormWeeklySTThreshold ? `${c.stormWeeklySTThreshold} hrs` : "—"} />
                  <DetailRow label="Weekly OT→DT Threshold" value={c.stormWeeklyOTThreshold ? `${c.stormWeeklyOTThreshold} hrs` : "—"} />
                </>
              )}
              {c.stormExpenses && (
                <>
                  <div className="border-t border-gray-200 my-3" />
                  <DetailRow label="Meals" value={
                    c.stormExpenses.mealType === "per_diem" ? `Per Diem — $${c.stormExpenses.mealPerDiem}/day`
                    : c.stormExpenses.mealType === "reimbursed" ? "Reimbursed with caps"
                    : c.stormExpenses.mealType === "not_covered" ? "Not billable" : "—"
                  } />
                  <DetailRow label="Lodging" value={
                    c.stormExpenses.lodgingType === "per_diem" ? `Per Diem — $${c.stormExpenses.lodgingRate}/night`
                    : c.stormExpenses.lodgingType === "reimbursed" ? `Reimbursed — up to $${c.stormExpenses.lodgingRate}/night`
                    : c.stormExpenses.lodgingType === "not_covered" ? "Not billable" : "—"
                  } />
                  <DetailRow label="Fuel" value={
                    c.stormExpenses.fuelType === "reimbursed" ? "Reimbursed" : c.stormExpenses.fuelType === "not_covered" ? "Not billable" : "—"
                  } />
                </>
              )}
              {c.stormSpecialDays && (
                <>
                  <div className="border-t border-gray-200 my-3" />
                  <DetailRow label="Saturday Rate" value={`${c.stormSpecialDays.saturday?.rateType || "—"} — ${c.stormSpecialDays.saturday?.applyTo === "all_hours" ? "All hours" : c.stormSpecialDays.saturday?.applyTo || ""}`} />
                  <DetailRow label="Sunday Rate" value={`${c.stormSpecialDays.sunday?.rateType || "—"} — ${c.stormSpecialDays.sunday?.applyTo === "all_hours" ? "All hours" : c.stormSpecialDays.sunday?.applyTo || ""}`} />
                  <DetailRow label="Holiday Rate" value={`${c.stormSpecialDays.holiday?.rateType || "—"} — ${c.stormSpecialDays.holiday?.applyTo === "all_hours" ? "All hours" : c.stormSpecialDays.holiday?.applyTo || ""}`} />
                </>
              )}
              {c.stormHolidays && c.stormHolidays.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-3" />
                  <DetailRow label="Recognized Holidays" value={c.stormHolidays.join(", ")} />
                </>
              )}
              {c.stormTimeDivisions && (
                <>
                  <div className="border-t border-gray-200 my-3" />
                  {c.stormTimeDivisions.mobilization && (
                    <DetailRow label="Mobilization" value={`${c.stormTimeDivisions.mobilization.rateType || "—"} — ${c.stormTimeDivisions.mobilization.applyTo === "all_hours" ? "All hours" : c.stormTimeDivisions.mobilization.applyTo || "—"}`} />
                  )}
                  {c.stormTimeDivisions.demobilization && (
                    <DetailRow label="Demobilization" value={`${c.stormTimeDivisions.demobilization.rateType || "—"} — ${c.stormTimeDivisions.demobilization.applyTo === "all_hours" ? "All hours" : c.stormTimeDivisions.demobilization.applyTo || "—"}`} />
                  )}
                  {c.stormTimeDivisions.standby && (
                    <DetailRow label="Standby" value={`${c.stormTimeDivisions.standby.rateType || "—"} — ${c.stormTimeDivisions.standby.applyTo === "all_hours" ? "All hours" : c.stormTimeDivisions.standby.applyTo || "—"}`} />
                  )}
                </>
              )}
              {c.stormSpecialInstructions && (
                <>
                  <div className="border-t border-gray-200 my-3" />
                  <DetailRow label="Special Instructions" value={c.stormSpecialInstructions} />
                </>
              )}
            </div>
          ) : (
            <div className="space-y-0">
              {isTE && (
                <>
                  <DetailRow label="Billing Basis" value={
                    c.teBillingBasis === "actuals" ? "Actual Hours"
                    : c.teBillingBasis === "estimated" ? "Estimated Hours"
                    : c.teBillingBasis || "—"
                  } />
                  <DetailRow label="Overtime Calculation" value={c.otCalc} />
                  <DetailRow label="Work Week Start" value={c.workweekStart} />
                  <DetailRow label="Saturday Rate" value={c.satRate} />
                  <DetailRow label="Sunday Rate" value={c.sunRate} />
                  <div className="border-t border-gray-200 my-3" />
                </>
              )}
              <DetailRow label="Per Diem" value={
                c.perDiemBilling === "flat" ? `Flat — $${c.perDiemAmount}/day`
                : c.perDiemBilling === "per_class" ? "Per Classification"
                : c.perDiemBilling === "none" ? "Not Billable" : "—"
              } />
              {!isLump && (
                <DetailRow label="Vendor Costs" value={
                  (c.vendorBillingMethods || []).map((m) =>
                    m === "cu_library" ? "Included in CU library"
                    : m === "pass_through" ? "Pass-through at cost"
                    : m === "markup" ? "Pass-through + markup"
                    : "Pre-negotiated lump sum"
                  ).join(", ") || "—"
                } />
              )}
              <div className="border-t border-gray-200 my-3" />
              <DetailRow label="CO Trigger" value={
                c.coTrigger === "any" ? "Any scope variance"
                : c.coTrigger === "threshold" ? `Threshold — ${c.coThresholdType === "Percentage" ? c.coThresholdValue + "%" : "$" + c.coThresholdValue}`
                : c.coTrigger === "manual" ? "Manual only" : "—"
              } />
              <DetailRow label="CO Authorization" value={
                c.coAuthRequired === "pm_approval" ? "PM Approval"
                : c.coAuthRequired === "dual_approval" ? "Dual Approval (PM + Customer)"
                : c.coAuthRequired === "yes" ? "Yes — Before Work Proceeds"
                : c.coAuthRequired === "no" ? "No — Proceed and Document" : c.coAuthRequired || "—"
              } />
              <DetailRow label="CO Billing" value={
                c.coBillingMethod === "same" ? "Same contract rates"
                : c.coBillingMethod === "separate" ? "Separate CO rates"
                : c.coBillingMethod === "te" ? "T&E rates" : c.coBillingMethod || "—"
              } />
            </div>
          )}
        </DetailSection>

        {/* Payment Terms */}
        <DetailSection title="Payment Terms" card>
          <DetailRow label="Invoice Cadence" value={
            c.invoiceCadence === "weekly" ? "Weekly"
            : c.invoiceCadence === "biweekly" ? "Biweekly"
            : c.invoiceCadence === "monthly" ? "Monthly"
            : c.invoiceCadence || "—"
          } />
          {c.periodStartDay && <DetailRow label="Period Start Day" value={c.periodStartDay} />}
          {c.periodStartDate && <DetailRow label="Period Start Date" value={c.periodStartDate} />}
          <DetailRow label="Payment Terms" value={
            c.paymentTerms === "net_15" ? "Net 15"
            : c.paymentTerms === "net_30" ? "Net 30"
            : c.paymentTerms === "net_45" ? "Net 45"
            : c.paymentTerms === "net_60" ? "Net 60"
            : c.paymentTerms || "—"
          } />
          {c.retainage && <DetailRow label="Retainage" value={`${c.retainage}%`} />}
        </DetailSection>
      </div>

      {/* Right column — Quick Info */}
      <div className="space-y-6">
        <DetailSection title="Contract Info" card>
          <DetailRow label="Customer" value={c.customer} />
          <DetailRow label="Contract Type" value={TYPE_LABELS[c.type]} />
          {c.workType && c.workType.length > 0 && <DetailRow label="Work Type" value={c.workType.join(", ")} />}
          {c.billingEntity && <DetailRow label="Billing Entity" value={c.billingEntity} />}
          <DetailRow label="Start Date" value={c.startDate ? formatDateShort(c.startDate) : "—"} />
          <DetailRow label="End Date" value={c.endDate ? formatDateShort(c.endDate) : "—"} />
          {c.nte && <DetailRow label="NTE" value={`$${c.nte}`} />}
          <DetailRow label="Contract ID" value={c.id} />
        </DetailSection>

      </div>
    </div>
  );

  // ── Amendments Tab ──
  const renderAmendments = () => (
    <div className="border border-gray-200 rounded-xl bg-white">
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-5">
          <ClipboardList size={24} className="text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">No amendments yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          When contract terms are modified — rate changes, scope adjustments, policy updates — they'll be tracked here with effective dates and approval history.
        </p>
      </div>
    </div>
  );

  // ── Documents Tab ──
  const renderDocuments = () => (
    <div className="border border-gray-200 rounded-xl bg-white">
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-5">
          <FileText size={24} className="text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">No documents uploaded</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
          Attach the signed contract, rate sheets, amendments, or any supporting documents.
        </p>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors">
          <Plus size={16} /> Upload Document
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl">
      {/* Back link */}
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4 transition-colors">
        <ChevronLeft size={16} /> Back to Contracts
      </button>

      {/* Record Header */}
      <div className="mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[c.status].dot}`} />
            {STATUS_CONFIG[c.status].label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
          <span>{TYPE_LABELS[c.type]}</span>
          <span className="text-gray-300">·</span>
          <span>{c.customer}</span>
          {c.startDate && (
            <>
              <span className="text-gray-300">·</span>
              <span>{formatDateShort(c.startDate)} – {c.endDate ? formatDateShort(c.endDate) : "Ongoing"}</span>
            </>
          )}
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">{c.id}</span>
        </div>
      </div>

      {/* Tab Bar + Edit Button */}
      <div className="border-b border-gray-200 mb-6 flex items-end justify-between">
        <div className="flex items-center gap-0">
          {detailTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-3 text-sm -mb-px transition-colors"
              style={{
                fontWeight: tab === t.id ? 500 : 400,
                color: tab === t.id ? "#F4722B" : "#9CA3AF",
                borderBottom: tab === t.id ? "2px solid #F4722B" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          disabled
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed flex-shrink-0"
          style={{ marginBottom: "6px" }}
          title="Editing coming soon"
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Tab Content */}
      {tab === "overview" && renderOverview()}
      {tab === "amendments" && renderAmendments()}
      {tab === "documents" && renderDocuments()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  INITIAL DATA
// ═══════════════════════════════════════════════════════════
const INITIAL_DATA = {
  // Step 1 — Basics (shared)
  name: "",
  customer: CURRENT_ORG,
  billingEntity: "",
  workType: [],
  contractType: "",
  startDate: "",
  endDate: "",
  nte: "",

  // Step 1 — Storm-only

  // Step 2 — T&E
  teRateType: "",
  teBillingBasis: "",
  blendedRate: "",
  laborRates: [],
  otCalc: "",
  workweekStart: "",
  satRate: "",
  sunRate: "",

  // Step 2 — Unit-Price
  cuLibrary: "",
  pricingModel: "",
  fallbackRateType: "",
  fallbackBlendedRate: "",
  fallbackLaborRates: [],
  fallbackEquipmentRates: [],
  billingExclusions: [],

  // Step 2 — Lump Sum
  lumpValue: "",
  paymentStructure: "",
  milestones: [],

  // Step 2 — Bluesky common (equipment + per diem)
  equipmentRates: [],
  perDiemBilling: "",
  perDiemAmount: "",
  perDiemRates: [],

  // Step 2 — Storm
  stormLaborRates: [],
  stormEquipmentRates: [],

  // Step 3 — Bluesky (Vendors & COs)
  vendorBillingMethods: [],
  vendorDocsRequired: false,
  coTrigger: "",
  coThresholdType: "",
  coThresholdValue: "",
  coAuthRequired: "",
  coBillingMethod: "",
  coNumbering: "",

  // Step 3 — Storm (Billing Rules)
  stormWorkWeekStart: "",
  stormDailySTThreshold: 8,
  stormDailyOTThreshold: 16,
  stormHasWeeklyThreshold: false,
  stormWeeklySTThreshold: 40,
  stormWeeklyOTThreshold: 60,
  stormExpenses: {
    mealType: "",
    mealPerDiem: "",
    breakfastCap: "",
    lunchCap: "",
    dinnerCap: "",
    mealReceiptsRequired: false,
    lodgingType: "",
    lodgingRate: "",
    lodgingReceiptsRequired: false,
    fuelType: "",
    fuelReceiptsRequired: false,
    fuelReportRequired: false,
  },
  stormSpecialDays: {
    saturday: { rateType: "", applyTo: "", threshold: "" },
    sunday: { rateType: "", applyTo: "", threshold: "" },
    holiday: { rateType: "", applyTo: "", threshold: "" },
  },
  stormHolidays: [],
  stormTimeDivisions: {
    mobilization: {
      applicableOn: "",
      rateType: "",
      applyTo: "",
      threshold: "",
    },
    demobilization: {
      applicableOn: "",
      rateType: "",
      applyTo: "",
      threshold: "",
    },
    standby: {
      applicableOn: "",
      rateType: "",
      applyTo: "",
      threshold: "",
    },
  },
  stormSpecialInstructions: "",

  // Step 4 — Payment (shared)
  invoiceCadence: "",
  periodStartDay: "",
  periodStartDate: "",
  retainage: "",
  paymentTerms: "",
};

// ═══════════════════════════════════════════════════════════
//  MAIN WIZARD
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
//  WIZARD VIEW (inner, no shell)
// ═══════════════════════════════════════════════════════════

function WizardView({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState({});
  const [draftNotice, setDraftNotice] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user fills it
    if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const goToStep = (s) => setStep(s);

  // ── Step validation ──
  const validateStep = (s) => {
    const ct = data.contractType;
    const isStorm = ct === "storm";
    const isLump = ct === "lump";
    const isUnit = ct === "unit";
    const isTE = ct === "te";
    const errs = {};

    if (s === 1) {
      if (!ct) errs.contractType = "Select a contract type";
      if (ct && !data.name) errs.name = "Enter a contract name";
      if (ct && !isStorm) {
        const wt = data.workType;
        if (isLump ? !wt || (Array.isArray(wt) && wt.length === 0) : !wt || (Array.isArray(wt) && wt.length === 0)) errs.workType = "Select at least one work type";
      }
      if (ct && !data.startDate) errs.startDate = isStorm ? "Enter an effective date" : "Enter a start date";
      if (ct && data.startDate && data.endDate && data.endDate < data.startDate) {
        errs.endDate = isStorm ? "Expiration date cannot be before the effective date" : "End date cannot be before the start date";
      }
    }

    if (s === 2) {
      if (isStorm) {
        if (data.stormLaborRates.length === 0) {
          errs.stormLaborRates = "Add at least one labor classification";
        } else if (data.stormLaborRates.some((r) => !r.classification || !r.invoiceLabel || !(r.st || r.ot || r.dt))) {
          errs.stormLaborRates = "Each row needs a classification, invoice label, and at least one rate";
        }
        if (data.stormEquipmentRates.length === 0) {
          errs.stormEquipmentRates = "Add at least one equipment type";
        } else if (data.stormEquipmentRates.some((r) => !r.type || !r.invoiceLabel || !r.rate || !r.approvalRequired)) {
          errs.stormEquipmentRates = "Each row needs a type, invoice label, hourly rate, and approval selection";
        }
      }
      if (isTE) {
        if (!data.teRateType) errs.teRateType = "Select a rate type";
        if (!data.teBillingBasis) errs.teBillingBasis = "Select a billing basis";
        if (data.teRateType === "blended" && !data.blendedRate) errs.blendedRate = "Enter a blended rate";
        if (data.teRateType === "per_class") {
          const hasValidLabor = data.laborRates.some((r) => r.classification && (r.st || r.ot || r.dt));
          if (!hasValidLabor) errs.laborRates = "Add at least one classification with a rate";
        }
        if (!data.otCalc) errs.otCalc = "Select an overtime calculation method";
        // OT sub-fields (when OT rules apply)
        if (data.otCalc && data.otCalc !== "None — flat rate regardless of hours") {
          if (!data.workweekStart) errs.workweekStart = "Select a workweek start day";
          if (!data.satRate) errs.satRate = "Select a Saturday rate";
          if (!data.sunRate) errs.sunRate = "Select a Sunday rate";
        }
      }
      if (isUnit) {
        if (!data.cuLibrary) errs.cuLibrary = "Select a CU library";
        if (!data.pricingModel) errs.pricingModel = "Select a pricing model";
        // T&E fallback rates
        if (!data.fallbackRateType) errs.fallbackRateType = "Select a fallback rate type";
        if (data.fallbackRateType === "blended" && !data.fallbackBlendedRate) errs.fallbackBlendedRate = "Enter a fallback blended rate";
        if (data.fallbackRateType === "per_class") {
          const hasValidFallback = data.fallbackLaborRates.some((r) => r.classification && (r.st || r.ot || r.dt));
          if (!hasValidFallback) errs.fallbackLaborRates = "Add at least one fallback classification with a rate";
        }
        // "none" requires no further validation
      }
      if (isLump) {
        if (!data.lumpValue) errs.lumpValue = "Enter the contract value";
        if (!data.paymentStructure) errs.paymentStructure = "Select a payment structure";
        // Milestone table (if milestone payment)
        if (data.paymentStructure === "milestone") {
          const hasValidMilestone = data.milestones.some((m) => m.name && m.amount);
          if (!hasValidMilestone) errs.milestones = "Add at least one milestone with a name and amount";
        }
        // T&E fallback rates
        const hasValidFallbackLabor = data.fallbackLaborRates.some((r) => r.classification && (r.st || r.ot || r.dt));
        if (!hasValidFallbackLabor) errs.fallbackLaborRates = "Add at least one fallback labor classification with a rate";
        const hasValidFallbackEquip = data.fallbackEquipmentRates.some((r) => r.type && r.rate);
        if (!hasValidFallbackEquip) errs.fallbackEquipmentRates = "Add at least one fallback equipment type with a rate";
      }
      // Bluesky types need per diem selection + sub-fields
      if (!isStorm) {
        if (!data.perDiemBilling) {
          errs.perDiemBilling = "Select a per diem reimbursement option";
        } else if (data.perDiemBilling === "flat" && !data.perDiemAmount) {
          errs.perDiemAmount = "Enter a daily reimbursement rate";
        } else if (data.perDiemBilling === "per_class") {
          const hasValidPerDiem = data.perDiemRates.some((r) => r.classification && r.daily);
          if (!hasValidPerDiem) errs.perDiemRates = "Add at least one classification with a daily rate";
        }
      }
    }

    if (s === 3) {
      if (isStorm) {
        if (!data.stormWorkWeekStart) errs.stormWorkWeekStart = "Select a work week start day";
        // Meal validation
        const meal = data.stormExpenses || {};
        if (!meal.mealType) {
          errs.stormMealType = "Select a meal expense type";
        } else if (meal.mealType === "per_diem" && !meal.mealPerDiem) {
          errs.stormMealPerDiem = "Enter a per diem amount";
        } else if (meal.mealType === "reimbursed") {
          if (!meal.breakfastCap) errs.stormBreakfastCap = "Enter breakfast cap";
          if (!meal.lunchCap) errs.stormLunchCap = "Enter lunch cap";
          if (!meal.dinnerCap) errs.stormDinnerCap = "Enter dinner cap";
        }
        // Lodging validation
        if (!meal.lodgingType) {
          errs.stormLodgingType = "Select a lodging expense type";
        } else if ((meal.lodgingType === "per_diem" || meal.lodgingType === "reimbursed") && !meal.lodgingRate) {
          errs.stormLodgingRate = "Enter a nightly rate";
        }
        // Fuel validation
        if (!meal.fuelType) errs.stormFuelType = "Select a fuel expense type";
        // Special day rates
        ["saturday", "sunday", "holiday"].forEach((day) => {
          const c = data.stormSpecialDays[day];
          if (!c.rateType) errs[`specialDay_${day}_rateType`] = `Select a rate type for ${day}`;
          if (!c.applyTo) errs[`specialDay_${day}_applyTo`] = `Select apply-to for ${day}`;
          if ((c.applyTo === "first_n" || c.applyTo === "after_n") && !c.threshold) errs[`specialDay_${day}_threshold`] = "Enter an hour threshold";
        });
        // Time divisions
        ["mobilization", "demobilization", "standby"].forEach((div) => {
          const c = data.stormTimeDivisions[div];
          if (!c.applicableOn) {
            errs[`timeDivision_${div}`] = `Select when ${div} applies`;
          } else if (c.applicableOn !== "not_applicable") {
            if (!c.rateType) errs[`timeDivision_${div}_rateType`] = "Select a rate type";
            if (!c.applyTo) errs[`timeDivision_${div}_applyTo`] = "Select what it applies to";
            if (!c.threshold) errs[`timeDivision_${div}_threshold`] = "Enter max hours";
          }
        });
      } else {
        // Vendor billing (T&E and Unit only, not Lump)
        if (!isLump) {
          const vm = data.vendorBillingMethods || [];
          if (vm.length === 0) errs.vendorBillingMethods = isUnit ? "Select at least one vendor billing method" : "Select a vendor billing method";
        }
        // Change order rules
        if (!data.coTrigger) errs.coTrigger = "Select a change order trigger";
        if (data.coTrigger === "threshold") {
          if (!data.coThresholdType) errs.coThresholdType = "Select a threshold type";
          if (!data.coThresholdValue) errs.coThresholdValue = "Enter a threshold value";
        }
        if (!data.coAuthRequired) errs.coAuthRequired = "Select an authorization method";
        // CO billing method (T&E and Unit only, not Lump)
        if (!isLump && !data.coBillingMethod) errs.coBillingMethod = "Select a CO billing method";
      }
    }

    if (s === 4) {
      if (!data.invoiceCadence) errs.invoiceCadence = "Select an invoice cadence";
      if (!data.paymentTerms) errs.paymentTerms = "Select payment terms";
      // Period start fields (bluesky only)
      if (!isStorm && (data.invoiceCadence === "weekly" || data.invoiceCadence === "biweekly") && !data.periodStartDay) {
        errs.periodStartDay = "Select a period start day";
      }
      if (!isStorm && data.invoiceCadence === "monthly" && !data.periodStartDate) {
        errs.periodStartDate = "Select a period start date";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  if (created) {
    return (
      <SuccessState
        data={data}
        onBackToContracts={onClose}
        onReset={() => {
          setCreated(false);
          setStep(1);
          setData(INITIAL_DATA);
        }}
      />
    );
  }

  return (
    <div className="bg-gray-50/50 h-full flex flex-col relative">
      {/* Draft saved toast */}
      {draftNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Check size={15} className="text-emerald-400" />
          Draft saved
        </div>
      )}
      {/* Page Title + Close */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-semibold text-gray-900">New Contract</h1>
        <button
          onClick={() => {
            if (data.contractType && data.name) {
              setDraftNotice(true);
              setTimeout(() => onClose(), 1200);
            } else {
              onClose();
            }
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stepper */}
      <div className="flex-shrink-0">
        <Stepper currentStep={step} />
      </div>

      {/* Scrollable Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto px-6 py-8 max-w-4xl">
        {step === 1 && <Step1Basics data={data} update={update} errors={errors} />}
        {step === 2 && <Step2Rates data={data} update={update} errors={errors} />}
        {step === 3 && <Step3 data={data} update={update} errors={errors} setErrors={setErrors} />}
        {step === 4 && <Step4Payment data={data} update={update} errors={errors} />}
        {step === 5 && <Step5Review data={data} goToStep={goToStep} />}

        {/* Actions */}
        <div className="flex items-center justify-end pt-6 mt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 5 ? (
              <button onClick={handleContinue} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={() => setCreated(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Check size={16} /> Create Contract
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COMBINED SHELL — Landing Page + Wizard
// ═══════════════════════════════════════════════════════════

export default function ContractSetupWizard() {
  // View state: "landing", "wizard", or "detail"
  const [view, setView] = useState("landing");
  const [selectedContract, setSelectedContract] = useState(null);
  const [activeTab, setActiveTab] = useState("contracts");
  const [contracts, setContracts] = useState(SAMPLE_CONTRACTS);
  const [activeId, setActiveId] = useState("utilities");
  const [expanded, setExpanded] = useState(["organizations"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState("pg-distribution");
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);

  const toggleExpand = (id) => setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const getOrgLabel = () => {
    if (selectedOrg === "all") return "All Organizations";
    if (selectedOrg === ORG_TREE.id) return ORG_TREE.name;
    for (const sub of ORG_TREE.children) {
      if (sub.id === selectedOrg) return sub.name;
      if (selectedOrg === `${sub.id}-entity`) return sub.name;
      if (sub.children) for (const gc of sub.children) { if (gc.id === selectedOrg) return gc.name; }
    }
    return "No Selection";
  };

  const tabs = [
    { id: "details", label: "Details" },
    { id: "roster", label: "Roster" },
    { id: "contracts", label: "Contracts" },
    { id: "documents", label: "Documents" },
  ];

  // ── Render inside shell ──
  return (
    <div className="flex flex-col" style={{ height: "100vh", width: "100%", background: "#F9FAFB", fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css');`}</style>

      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center flex-shrink-0 z-10">
        <div className="flex items-center h-full">
          <div className={`flex items-center justify-between px-3 h-full transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: "#fafafa", borderRight: "1px solid #E5E7EB" }}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2.5 relative">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#4D4D4D" }}>
                    <Zap size={14} className="text-white" />
                  </div>
                  <button onClick={() => setOrgSwitcherOpen((prev) => !prev)} className="text-left flex items-center gap-1">
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#4D4D4D" }}>Gridbase</div>
                      <div className="text-[11px] flex items-center gap-1" style={{ color: "#9CA3AF", maxWidth: "130px" }}>
                        <span className="truncate">{getOrgLabel()}</span>
                        <ChevronDown size={10} className="flex-shrink-0" />
                      </div>
                    </div>
                  </button>
                  <OrgSwitcherDropdown selectedOrg={selectedOrg} onSelectOrg={setSelectedOrg} isOpen={orgSwitcherOpen} onToggle={setOrgSwitcherOpen} />
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors" title="Toggle navigation">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="14" height="12" rx="2" /><line x1="7" y1="3" x2="7" y2="15" /></svg>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors" title="Toggle navigation">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="14" height="12" rx="2" /><line x1="7" y1="3" x2="7" y2="15" /></svg>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm ml-6">
            <span className="text-gray-400">Data</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400">Organizations</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400">Utilities</span>
            <ChevronRight size={14} className="text-gray-300" />
            {view === "wizard" ? (
              <>
                <button onClick={() => setView("landing")} className="text-gray-400 hover:text-gray-600 transition-colors">{CURRENT_ORG}</button>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="font-medium text-gray-900">New Contract</span>
              </>
            ) : view === "detail" && selectedContract ? (
              <>
                <button onClick={() => { setView("landing"); setSelectedContract(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">{CURRENT_ORG}</button>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="font-medium text-gray-900 truncate max-w-xs">{selectedContract.name}</span>
              </>
            ) : (
              <span className="font-medium text-gray-900">{CURRENT_ORG}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className={`flex flex-col flex-shrink-0 transition-all ${sidebarOpen ? "w-60" : "w-14"}`} style={{ background: "#fafafa", borderRight: "1px solid #E5E7EB" }}>
          {sidebarOpen ? (
            <>
              <nav className="flex-1 overflow-y-auto px-2 py-3">
                {NAV_SECTIONS.map((section, idx) => (
                  <div key={section.label} className={idx > 0 ? "mt-5" : ""}>
                    <SidebarSectionLabel label={section.label} />
                    <div className="space-y-0.5">
                      {section.items.map((item) => (
                        <SidebarNavItem key={item.id} item={item} activeId={activeId} onSelect={setActiveId} expanded={expanded} onToggle={toggleExpand} />
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
                    <CollapsedSidebarIcon key={item.id} item={item} activeId={activeId} onSelect={setActiveId} setSidebarOpen={setSidebarOpen} setExpanded={setExpanded} />
                  ))}
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-y-auto">
            {view === "wizard" ? (
              <WizardView onClose={() => setView("landing")} />
            ) : view === "detail" && selectedContract ? (
              <ContractDetailView
                contract={selectedContract}
                onBack={() => { setView("landing"); setSelectedContract(null); }}
                onEdit={() => setView("wizard")}
              />
            ) : (
              <div className="p-6">
                <div className="mb-5">
                  <h1 className="text-xl font-semibold text-gray-900">{CURRENT_ORG}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Utility · St. Louis, MO</p>
                </div>

                <div className="border-b border-gray-200 mb-6">
                  <div className="flex items-center gap-0">
                    {tabs.map((tab) => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className="px-4 py-2.5 text-sm -mb-px transition-colors"
                        style={{ fontWeight: activeTab === tab.id ? 500 : 400, color: activeTab === tab.id ? "#F4722B" : "#6B7280", borderBottom: activeTab === tab.id ? "2px solid #F4722B" : "2px solid transparent" }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === "contracts" && (
                  <ContractsTable
                    contracts={contracts}
                    onCreateContract={() => setView("wizard")}
                    onViewContract={(c) => { setSelectedContract(c); setView("detail"); }}
                    onArchive={(id) => setContracts(contracts.map((c) => c.id === id ? { ...c, status: "archived" } : c))}
                    onDelete={(id) => setContracts(contracts.filter((c) => c.id !== id))}
                  />
                )}

                {activeTab !== "contracts" && (
                  <div className="border border-gray-200 rounded-lg bg-white py-16 text-center">
                    <p className="text-sm text-gray-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
