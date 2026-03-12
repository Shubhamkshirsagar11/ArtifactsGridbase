import { useState } from "react";
import {
  Plus, Search, Filter, X, Clock, AlertTriangle, CheckCircle2,
  DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
  User, MessageSquare, Pencil, Truck, HardHat, Building2, Trophy,
  XCircle, FolderPlus, Copy, LayoutGrid, List,
  FileText, ChevronRight, ChevronDown, ChevronUp, Eye, Bell,
  Settings, HelpCircle, Home, Briefcase, Users, MapPin, Zap,
  BarChart3, Loader2, Upload, MoreHorizontal, Trash2, Info,
  Mail, Lock, EyeOff, Check, ChevronLeft, ChevronsLeft, ChevronsRight,
  GripVertical, Download, Replace, ArrowRight, Minus
} from "lucide-react";

// ─── Shared Layout ──────────────────────────────────────────────────────────

function AuditPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "buttons", label: "Buttons" },
    { id: "inputs", label: "Text Inputs" },
    { id: "selects", label: "Select / Dropdown" },
    { id: "checkbox-radio", label: "Checkbox & Radio" },
    { id: "textarea", label: "Textarea" },
    { id: "datepicker", label: "Date Picker" },
    { id: "fileupload", label: "File Upload" },
    { id: "dialogs", label: "Dialog / Modal" },
    { id: "sheets", label: "Sheet / Drawer" },
    { id: "tabs", label: "Tabs" },
    { id: "tables", label: "Tables" },
    { id: "cards", label: "Cards" },
    { id: "badges", label: "Badges & Status" },
    { id: "tooltips", label: "Tooltips" },
    { id: "dropdowns", label: "Dropdown Menu" },
    { id: "pagination", label: "Pagination" },
    { id: "loaders", label: "Loaders" },
    { id: "alerts", label: "Alerts & Toasts" },
    { id: "colors", label: "Color Tokens" },
    { id: "typography", label: "Typography" },
    { id: "confirmation", label: "Confirmation Dialog" },
    { id: "accordion", label: "Accordion" },
    { id: "progress", label: "Progress Bar" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Gridbase Design System Audit</h1>
            <p className="text-sm text-gray-500 mt-0.5">Visual comparison: Design System vs Codebase vs Missing</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/gridbase-design-system";
                }}
                className="px-2.5 py-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                Design System
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/gridbase-design-system-audit";
                }}
                className="px-2.5 py-1 rounded-full bg-white text-gray-900 font-medium shadow-sm"
              >
                Audit View
              </button>
            </div>
            <div className="flex items-center gap-3">
              <StatusCount label="In Design System" count={14} color="emerald" />
              <StatusCount label="In Codebase Only" count={18} color="amber" />
              <StatusCount label="Missing / Gap" count={12} color="red" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Nav */}
        <div className="w-56 bg-white border-r border-gray-200 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto flex-shrink-0">
          <div className="p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2 mb-2">Components</p>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-16 max-w-6xl">
          <OverviewSection />
          <ButtonsSection />
          <InputsSection />
          <SelectsSection />
          <CheckboxRadioSection />
          <TextareaSection />
          <DatePickerSection />
          <FileUploadSection />
          <DialogsSection />
          <SheetsSection />
          <TabsSection />
          <TablesSection />
          <CardsSection />
          <BadgesSection />
          <TooltipsSection />
          <DropdownsSection />
          <PaginationSection />
          <LoadersSection />
          <AlertsSection />
          <ColorsSection />
          <TypographySection />
          <ConfirmationSection />
          <AccordionSection />
          <ProgressSection />
        </div>
      </div>
    </div>
  );
}

export default AuditPage;

// ─── Helpers ────────────────────────────────────────────────────────────────

function StatusCount({ label, count, color }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[color]}`}>
      <span className="tabular-nums">{count}</span> {label}
    </span>
  );
}

function Tag({ children, color = "gray" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-600 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${map[color]}`}>{children}</span>;
}

function Section({ id, title, desc, children }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function CompareRow({ label, designSystem, codebase, status }) {
  const statusMap = {
    match: { tag: "Match", color: "green" },
    partial: { tag: "Partial", color: "amber" },
    missing: { tag: "Missing", color: "red" },
    "codebase-only": { tag: "Codebase Only", color: "blue" },
  };
  const s = statusMap[status];
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <Tag color={s.color}>{s.tag}</Tag>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        <div className="p-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-3">Design System</p>
          {designSystem || <span className="text-xs text-gray-300 italic">Not defined</span>}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-3">Codebase (Actual)</p>
          {codebase || <span className="text-xs text-gray-300 italic">Not used</span>}
        </div>
      </div>
    </div>
  );
}

function MissingBlock({ label, description, children }) {
  return (
    <div className="border-2 border-dashed border-red-200 rounded-xl overflow-hidden bg-red-50/30 mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-red-50 border-b border-red-200">
        <span className="text-sm font-medium text-red-700">{label}</span>
        <Tag color="red">MISSING</Tag>
      </div>
      <div className="p-4">
        <p className="text-xs text-red-600 mb-3">{description}</p>
        {children}
      </div>
    </div>
  );
}

function Code({ children }) {
  return <code className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{children}</code>;
}

// ─── 0. Overview ────────────────────────────────────────────────────────────

function OverviewSection() {
  const data = [
    { component: "Buttons", ds: true, cb: true, status: "partial", note: "DS uses gray-900, App uses orange #FF884D" },
    { component: "Text Input", ds: true, cb: true, status: "partial", note: "DS shows basic input, App has icons/password/RHF" },
    { component: "Select (React Select)", ds: false, cb: true, status: "missing", note: "DS only shows native <select>" },
    { component: "Checkbox", ds: false, cb: true, status: "missing", note: "Not in DS at all" },
    { component: "Radio Button", ds: false, cb: true, status: "missing", note: "Not in DS at all" },
    { component: "Textarea", ds: false, cb: true, status: "missing", note: "Mentioned in stepper only" },
    { component: "Date Picker", ds: false, cb: true, status: "missing", note: "DS shows calendar month view, not picker" },
    { component: "File Upload", ds: false, cb: true, status: "missing", note: "Not in DS at all" },
    { component: "Dialog / Modal", ds: false, cb: true, status: "missing", note: "10+ modals in app, none in DS" },
    { component: "Sheet / Drawer", ds: false, cb: true, status: "missing", note: "Used for detail panels" },
    { component: "Tabs", ds: true, cb: true, status: "partial", note: "DS shows inside Record, App uses orange underline" },
    { component: "Table", ds: true, cb: true, status: "match", note: "Well covered" },
    { component: "Cards", ds: true, cb: true, status: "partial", note: "DS cards differ from app SectionCard" },
    { component: "Badges", ds: true, cb: true, status: "partial", note: "App has StatusPill with different colors" },
    { component: "Tooltip", ds: false, cb: true, status: "missing", note: "Custom tooltips in FuelCard/TollPages" },
    { component: "Dropdown Menu", ds: false, cb: true, status: "missing", note: "Used for row actions" },
    { component: "Pagination", ds: false, cb: true, status: "missing", note: "Every table page uses it" },
    { component: "Loaders (Spinner)", ds: false, cb: true, status: "missing", note: "DS only shows skeleton, not spinners" },
    { component: "Alert / Toast", ds: true, cb: true, status: "partial", note: "DS has toast, App uses sonner + FormError" },
    { component: "Accordion", ds: false, cb: true, status: "missing", note: "Used in settings, table expansion" },
    { component: "Confirmation Dialog", ds: false, cb: true, status: "missing", note: "UnsavedChangesModal pattern" },
    { component: "Progress Bar", ds: true, cb: true, status: "partial", note: "DS has stepper, App has linear bar" },
    { component: "Skeleton", ds: true, cb: true, status: "match", note: "Well covered" },
    { component: "Empty State", ds: true, cb: true, status: "match", note: "Well covered" },
  ];

  return (
    <Section id="overview" title="Overview — Component Coverage Matrix" desc="Green = matched, Amber = partial, Red = missing from design system">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Component</th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-500 w-24">Design System</th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-500 w-24">Codebase</th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-500 w-20">Status</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Gap / Note</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-2.5 px-4 font-medium text-gray-900">{r.component}</td>
                <td className="py-2.5 px-3 text-center">
                  {r.ds ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <XCircle size={16} className="text-red-400 mx-auto" />}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {r.cb ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <XCircle size={16} className="text-gray-300 mx-auto" />}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <Tag color={r.status === "match" ? "green" : r.status === "partial" ? "amber" : "red"}>
                    {r.status === "match" ? "OK" : r.status === "partial" ? "Partial" : "Missing"}
                  </Tag>
                </td>
                <td className="py-2.5 px-4 text-xs text-gray-500">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── 1. Buttons ─────────────────────────────────────────────────────────────

function ButtonsSection() {
  return (
    <Section id="buttons" title="Buttons" desc="Design system defines gray-900 primary. Codebase uses orange #FF884D as primary CTA.">
      <CompareRow
        label="Primary Button"
        status="partial"
        designSystem={
          <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus size={16} /> Create Estimate
          </button>
        }
        codebase={
          <button className="flex items-center gap-2 bg-[#FF884D] hover:bg-[#FF884D]/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} /> Create Estimate
          </button>
        }
      />
      <CompareRow
        label="Secondary Button"
        status="partial"
        designSystem={
          <button className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors">
            <Copy size={14} /> Duplicate
          </button>
        }
        codebase={
          <button className="flex items-center gap-2 bg-white text-[#5C5C5C] border border-[#5C5C5C] px-3 py-1 rounded-lg text-xs font-semibold hover:bg-[#F7F7F7] transition-colors font-inter">
            <Copy size={14} /> Duplicate
          </button>
        }
      />
      <CompareRow
        label="Ghost Button"
        status="match"
        designSystem={
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 transition-colors">
            <LayoutGrid size={14} /> Grid View
          </button>
        }
        codebase={
          <button className="hover:bg-accent hover:text-accent-foreground px-3 py-1.5 text-sm rounded-md transition-colors inline-flex items-center gap-1.5">
            <LayoutGrid size={14} /> Grid View
          </button>
        }
      />
      <CompareRow
        label="Destructive Button"
        status="partial"
        designSystem={
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            <XCircle size={16} /> Delete
          </button>
        }
        codebase={
          <button className="flex items-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <XCircle size={16} /> Delete
          </button>
        }
      />
      <CompareRow
        label="Loading State"
        status="match"
        designSystem={
          <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-80" disabled>
            <Loader2 size={16} className="animate-spin" /> Loading...
          </button>
        }
        codebase={
          <button className="flex items-center gap-2 bg-[#FF884D] text-white px-4 py-2 rounded-md text-sm font-medium opacity-80" disabled>
            <Loader2 size={16} className="animate-spin" /> Loading...
          </button>
        }
      />
    </Section>
  );
}

// ─── 2. Text Inputs ─────────────────────────────────────────────────────────

function InputsSection() {
  return (
    <Section id="inputs" title="Text Inputs" desc="Design system shows basic input. Codebase has CustomInput with icons, password toggle, RHF integration, exact border colors.">
      <CompareRow
        label="Standard Input"
        status="partial"
        designSystem={
          <div className="max-w-xs">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Field Label</label>
            <input type="text" placeholder="Enter value..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none" />
          </div>
        }
        codebase={
          <div className="max-w-xs">
            <label className="font-inter font-medium text-[#000000] text-[12px]" style={{ lineHeight: "115%" }}>Field Label</label>
            <input type="text" placeholder="Enter value..." className="flex h-9 w-full rounded-md border border-[#D9D9D9] bg-transparent px-3 py-1 text-[12px] text-[#000000] placeholder:text-[#7E7E7F] placeholder:text-[12px] focus-visible:outline-none focus-visible:border-black hover:border-black mt-1.5" />
          </div>
        }
      />
      <CompareRow
        label="Input with Start Icon"
        status="missing"
        designSystem={
          <div className="max-w-xs">
            <p className="text-xs text-gray-400 italic">Only search icon shown, not generic start icons</p>
            <div className="relative mt-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg" />
            </div>
          </div>
        }
        codebase={
          <div className="max-w-xs">
            <label className="font-inter font-medium text-[#000000] text-[12px]">Email</label>
            <div className="relative mt-1.5">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="email" placeholder="john@example.com" className="flex h-9 w-full rounded-md border border-[#D9D9D9] bg-transparent pl-10 pr-3 py-1 text-[12px] text-[#000000] placeholder:text-[#7E7E7F] focus-visible:border-black hover:border-black" />
            </div>
          </div>
        }
      />
      <MissingBlock label="Password Input with Toggle" description="CustomInput supports password type with show/hide toggle. Not in design system.">
        <div className="max-w-xs">
          <label className="font-inter font-medium text-[#000000] text-[12px]">Password</label>
          <div className="relative mt-1.5">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="password" placeholder="••••••••" className="flex h-9 w-full rounded-md border border-[#D9D9D9] bg-transparent pl-10 pr-10 py-1 text-[12px] text-[#000000] focus-visible:border-black hover:border-black" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2"><EyeOff size={16} className="text-gray-400" /></button>
          </div>
        </div>
      </MissingBlock>
      <CompareRow
        label="Error State"
        status="partial"
        designSystem={
          <div className="max-w-xs">
            <input type="text" className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg bg-white" defaultValue="Bad value" />
            <p className="text-xs text-red-500 mt-1">This field is required</p>
          </div>
        }
        codebase={
          <div className="max-w-xs">
            <input type="text" className="flex h-9 w-full rounded-md border border-red-500 bg-transparent px-3 py-1 text-[12px] text-[#000000]" defaultValue="Bad value" />
            <p className="text-sm text-red-500 mt-1">This field is required</p>
          </div>
        }
      />
      <CompareRow
        label="Disabled State"
        status="missing"
        designSystem={<p className="text-xs text-gray-400 italic">Not defined in design system</p>}
        codebase={
          <div className="max-w-xs">
            <input type="text" disabled defaultValue="Disabled value" className="flex h-9 w-full rounded-md border border-[#BFBFBF] bg-[#F2F2F2] px-3 py-1 text-[12px] text-gray-500 cursor-not-allowed" />
          </div>
        }
      />
    </Section>
  );
}

// ─── 3. Selects ─────────────────────────────────────────────────────────────

function SelectsSection() {
  return (
    <Section id="selects" title="Select / Dropdown" desc="CRITICAL GAP: Design system shows native &lt;select&gt;. Codebase uses React Select (CustomSelect2) everywhere.">
      <CompareRow
        label="Select Dropdown"
        status="missing"
        designSystem={
          <div className="max-w-xs">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Customer</label>
            <select className="text-sm border border-gray-200 rounded-md px-2 py-2 bg-white text-gray-700 w-full">
              <option>All Customers</option>
              <option>Duke Energy</option>
              <option>AEP Ohio</option>
            </select>
            <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1"><AlertTriangle size={10} /> Native HTML select — NOT used anywhere in the app</p>
          </div>
        }
        codebase={
          <div className="max-w-xs">
            <label className="font-inter font-medium text-[#000000] text-[12px]" style={{ fontWeight: 500 }}>Customer</label>
            <div className="mt-1.5 relative">
              {/* Simulated React Select */}
              <div className="flex items-center justify-between h-[36px] border border-[#D9D9D9] rounded-lg bg-white px-2 hover:border-black cursor-pointer">
                <span className="text-[12px] text-[#000000]">Duke Energy</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              {/* Simulated dropdown */}
              <div className="mt-1 border border-[#D9D9D9] rounded-lg bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="px-3 py-2 flex items-center justify-between bg-[#F7F7F8]">
                  <span className="text-[12px] text-[#525866]">Duke Energy</span>
                  <Check size={16} className="text-[#335CFF]" />
                </div>
                <div className="px-3 py-2 hover:bg-[#F7F7F8] cursor-pointer">
                  <span className="text-[12px] text-[#525866]">AEP Ohio</span>
                </div>
                <div className="px-3 py-2 hover:bg-[#F7F7F8] cursor-pointer">
                  <span className="text-[12px] text-[#525866]">FirstEnergy</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 size={10} /> React Select (CustomSelect2) — used on every form</p>
          </div>
        }
      />
      <MissingBlock label="Multi-Select" description="CustomSelect2 supports isMulti prop. Shows selected items as tags. Not in design system.">
        <div className="max-w-sm">
          <label className="font-inter font-medium text-[#000000] text-[12px]">Vehicles</label>
          <div className="mt-1.5 flex items-center gap-1 flex-wrap min-h-[36px] border border-[#D9D9D9] rounded-lg bg-white px-2 py-1">
            {["Truck 101", "Van 203"].map(v => (
              <span key={v} className="inline-flex items-center gap-1 bg-gray-100 text-[11px] text-gray-700 px-2 py-0.5 rounded">
                {v} <X size={12} className="text-gray-400 cursor-pointer" />
              </span>
            ))}
            <span className="text-[12px] text-[#AAAAAA]">Select more...</span>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 4. Checkbox & Radio ────────────────────────────────────────────────────

function CheckboxRadioSection() {
  return (
    <Section id="checkbox-radio" title="Checkbox & Radio Button" desc="Completely missing from design system. Used across forms, settings, and modals.">
      <MissingBlock label="Checkbox" description="CustomCheckbox wraps shadcn Checkbox (Radix). Used in HolidaySelectionModal, Settings, Forms.">
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <div className="h-4 w-4 shrink-0 rounded-sm border border-gray-400 bg-[#111827] flex items-center justify-center mt-0.5">
              <Check size={12} className="text-white" />
            </div>
            <div className="grid gap-1 leading-none">
              <span className="text-sm font-medium cursor-pointer">Email notifications</span>
              <span className="text-sm text-gray-500">Receive email when estimate status changes</span>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="h-4 w-4 shrink-0 rounded-sm border border-gray-400 mt-0.5" />
            <div className="grid gap-1 leading-none">
              <span className="text-sm font-medium cursor-pointer">SMS notifications</span>
              <span className="text-sm text-gray-500">Receive text messages for urgent updates</span>
            </div>
          </div>
          <div className="flex items-start space-x-2 opacity-50">
            <div className="h-4 w-4 shrink-0 rounded-sm border border-gray-300 bg-gray-100 mt-0.5 cursor-not-allowed" />
            <div className="grid gap-1 leading-none">
              <span className="text-sm font-medium cursor-not-allowed">Slack integration</span>
              <span className="text-sm text-gray-500">Coming soon</span>
            </div>
          </div>
        </div>
      </MissingBlock>
      <MissingBlock label="Blue Checkbox Variant" description="shadcn checkbox.tsx has a 'blue' variant: data-[state=checked]:bg-[#335CFF]. Used in select options.">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 shrink-0 rounded-sm border border-gray-400 bg-[#335CFF] flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium">Blue variant (selected options)</span>
        </div>
      </MissingBlock>
      <MissingBlock label="Radio Button" description="CustomRadioButton uses native HTML radio with blue styling. Not in design system.">
        <div className="space-y-2">
          {[
            { label: "1.5x", desc: "Standard overtime", checked: true },
            { label: "2.0x", desc: "Double time", checked: false },
          ].map(opt => (
            <div key={opt.label} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${opt.checked ? "border-blue-600" : "border-gray-300"}`}>
                {opt.checked && <div className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>
              <div>
                <span className="text-sm font-medium leading-none">{opt.label}</span>
                <p className="text-sm text-gray-600 mt-0.5">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 5. Textarea ────────────────────────────────────────────────────────────

function TextareaSection() {
  return (
    <Section id="textarea" title="Textarea" desc="Missing from design system. CustomTextarea used in ticket forms, document forms, feedback.">
      <MissingBlock label="Textarea (Standard)" description="CustomTextarea with label, min/max height, scrollbar styling, hover/focus border-black.">
        <div className="max-w-md">
          <label className="font-inter font-medium text-[#000000] text-[12px]" style={{ lineHeight: "115%" }}>Notes <span className="text-red-500">*</span></label>
          <textarea
            placeholder="Enter notes..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none resize-none min-h-[96px] max-h-[120px] leading-[1.5] placeholder:text-xs placeholder:text-[#7E7E7F] hover:border-black focus:border-black mt-1.5"
            defaultValue="This is a sample note with multiple lines of content to show the textarea behavior."
          />
        </div>
      </MissingBlock>
      <MissingBlock label="Textarea (Error)" description="Error state with red border.">
        <div className="max-w-md">
          <label className="font-inter font-medium text-[#000000] text-[12px]">Description</label>
          <textarea className="w-full rounded-md border border-red-500 bg-white px-3 py-2 text-sm resize-none min-h-[96px] mt-1.5" defaultValue="" />
          <p className="text-sm text-red-500 mt-1">Description is required</p>
        </div>
      </MissingBlock>
      <MissingBlock label="Textarea (Disabled)" description="Disabled state.">
        <div className="max-w-md">
          <textarea disabled defaultValue="This field is disabled" className="w-full rounded-md border border-[#BFBFBF] bg-[#F2F2F2] px-3 py-2 text-sm text-gray-500 cursor-not-allowed resize-none min-h-[96px]" />
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 6. Date Picker ─────────────────────────────────────────────────────────

function DatePickerSection() {
  return (
    <Section id="datepicker" title="Date Picker" desc="Design system shows Calendar (month view). Codebase uses Popover+Calendar as date picker input.">
      <CompareRow
        label="Date Selection"
        status="missing"
        designSystem={
          <div>
            <p className="text-xs text-gray-400 mb-2">Month view calendar only (no input trigger)</p>
            <div className="border border-gray-200 rounded-xl p-3 bg-white inline-block">
              <div className="flex items-center justify-between mb-3">
                <ChevronLeft size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-900">February 2026</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d} className="text-gray-400 py-1">{d}</span>)}
                {Array.from({ length: 28 }, (_, i) => (
                  <span key={i} className={`py-1 rounded ${i === 14 ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}>{i + 1}</span>
                ))}
              </div>
            </div>
          </div>
        }
        codebase={
          <div className="max-w-xs">
            <label className="font-inter font-medium text-[#000000] text-[12px]">Start Date</label>
            <button className="flex h-9 w-full items-center justify-between rounded-md border border-[#D9D9D9] bg-white px-3 py-1 text-[12px] mt-1.5 hover:border-black">
              <span className="text-[#000000]">Feb 15, 2026</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            <p className="text-[10px] text-blue-600 mt-2 flex items-center gap-1"><Info size={10} /> Opens shadcn Popover with Calendar component</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 7. File Upload ─────────────────────────────────────────────────────────

function FileUploadSection() {
  return (
    <Section id="fileupload" title="File Upload / Drag & Drop" desc="Completely missing from design system. CustomFile and DropBox used in tickets, documents, feedback.">
      <MissingBlock label="Drag & Drop Upload (Empty)" description="CustomFile with dashed border zone. Used in TicketForm, AddDocumentForm, FeedbackForm.">
        <div className="max-w-md">
          <label className="block w-full cursor-pointer border border-dashed border-[#D6D8DB] rounded-2xl bg-white px-4 py-8 text-center transition-all duration-200 hover:border-gray-400">
            <Upload size={20} className="mx-auto text-gray-400 mb-4" />
            <p className="font-semibold text-[#23272E] text-base mb-1">Drag & drop files here</p>
            <p className="text-sm text-[#8B8B8B] mb-4">PDF, DOCX, XLSX up to 10MB</p>
            <span className="inline-block px-3 py-2 bg-transparent text-[#5C5C5C] font-medium rounded-lg text-[12px] border border-[#5C5C5C] hover:bg-gray-100">
              Browse Files
            </span>
          </label>
        </div>
      </MissingBlock>
      <MissingBlock label="File Selected State" description="After file selection — shows file info with replace/download actions.">
        <div className="max-w-md border border-[#E6E6E6] rounded-xl bg-white p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-[15px] text-black leading-tight">contract_v2.pdf</p>
              <p className="text-xs text-[#7E7E7F] mt-0.5">2.4 MB • Jan 15, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[#5C5C5C] font-medium text-[14px] hover:underline">Replace</button>
            <button className="text-[#5C5C5C] font-medium text-[14px] px-4 py-2 border border-[#5C5C5C] rounded-lg flex items-center gap-1">
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </MissingBlock>
      <MissingBlock label="Upload Progress" description="Progress bar during upload.">
        <div className="max-w-md bg-[#F7F7F7] rounded-xl p-4 border border-[#EBEBEB]">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-gray-500" />
            <div className="flex-1">
              <p className="text-[15px] font-medium text-[#23272E] leading-tight">invoice_march.pdf</p>
              <p className="text-xs text-[#6b7280]">1.2 MB</p>
            </div>
            <span className="text-xs text-[#6b7280] font-medium">67%</span>
          </div>
          <div className="mt-2 bg-[#ededed] h-1 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: "67%" }} />
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 8. Dialogs ─────────────────────────────────────────────────────────────

function DialogsSection() {
  return (
    <Section id="dialogs" title="Dialog / Modal" desc="CRITICAL GAP: 10+ modals in codebase. Zero standalone modal patterns in design system.">
      <MissingBlock label="Standard Dialog" description="shadcn Dialog used for HolidayModal, RateModal, EquipmentModal, OverheadModal, etc.">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 leading-none">Select Holidays</h3>
                <p className="text-sm text-gray-500 mt-1.5">Choose applicable holidays for this rate agreement</p>
              </div>
              <button className="rounded-sm opacity-70 hover:opacity-100 p-1"><X size={16} /></button>
            </div>
            <div className="px-6 py-4 max-h-[200px] overflow-y-auto space-y-2">
              {["New Year's Day", "Memorial Day", "Independence Day", "Labor Day", "Thanksgiving"].map(h => (
                <div key={h} className="flex items-center space-x-2">
                  <div className="h-4 w-4 shrink-0 rounded-sm border border-gray-400 bg-[#111827] flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="text-sm">{h}</span>
                </div>
              ))}
              {["Christmas Eve", "Christmas Day"].map(h => (
                <div key={h} className="flex items-center space-x-2">
                  <div className="h-4 w-4 shrink-0 rounded-sm border border-gray-400" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 p-6 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50">Cancel</button>
              <button className="px-4 py-2 text-sm font-medium bg-[#FF884D] text-white rounded-md hover:bg-[#FF884D]/90">Save (5 selected)</button>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 9. Sheets ──────────────────────────────────────────────────────────────

function SheetsSection() {
  return (
    <Section id="sheets" title="Sheet / Drawer" desc="Missing from design system. Used for detail panels and export options.">
      <MissingBlock label="Right Sheet / Drawer" description="shadcn Sheet used for detail views, export drawers. Slides in from right.">
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-4 flex items-center justify-center text-xs text-gray-400">
            Main Content (dimmed)
          </div>
          <div className="w-[300px] border border-gray-200 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Estimate Detail</h3>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="flex-1 p-4 text-sm text-gray-500">
              <div className="space-y-3">
                <div><span className="text-xs text-gray-400">Customer</span><p className="font-medium text-gray-900">Duke Energy</p></div>
                <div><span className="text-xs text-gray-400">Value</span><p className="font-medium text-gray-900 tabular-nums">$284,000</p></div>
                <div><span className="text-xs text-gray-400">Stage</span><p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" /><span className="text-gray-600">Submitted</span></p></div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md">Close</button>
              <button className="px-3 py-1.5 text-sm bg-[#FF884D] text-white rounded-md">Edit</button>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 10. Tabs ───────────────────────────────────────────────────────────────

function TabsSection() {
  const [activeTab, setActiveTab] = useState("details");
  const [activeTab2, setActiveTab2] = useState("details");
  return (
    <Section id="tabs" title="Tabs" desc="Design system shows tabs inside Record page only. Codebase uses orange underline tabs (TabLayout) everywhere.">
      <CompareRow
        label="Tab Navigation"
        status="partial"
        designSystem={
          <div>
            <div className="flex border-b border-gray-200">
              {["Overview", "Work Orders", "Crews", "Documents"].map(t => (
                <button key={t} onClick={() => setActiveTab(t === "Overview" ? "details" : t.toLowerCase())}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    (activeTab === "details" && t === "Overview") || activeTab === t.toLowerCase()
                      ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}>{t}</button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Gray-900 underline (design system)</p>
          </div>
        }
        codebase={
          <div>
            <div className="flex border-b border-[#D9D9D9]">
              {["Details", "Classifications", "Rates", "Documents"].map(t => (
                <button key={t} onClick={() => setActiveTab2(t.toLowerCase())}
                  className={`px-4 h-11 relative text-[12px] font-inter transition-none ${
                    activeTab2 === t.toLowerCase()
                      ? "text-[#E97135] font-medium after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[1px] after:bg-[#e97135] after:z-10"
                      : "text-[#7E7E7F]"
                  }`}>{t}</button>
              ))}
            </div>
            <p className="text-[10px] text-[#E97135] mt-2">Orange #E97135 underline (actual codebase)</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 11. Tables ─────────────────────────────────────────────────────────────

function TablesSection() {
  return (
    <Section id="tables" title="Tables" desc="Design system table is well-covered. Minor differences in header bg color.">
      <CompareRow
        label="Table Header"
        status="partial"
        designSystem={
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Customer</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500">Value</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-gray-900">Duke Energy</td><td className="py-3 px-3 text-right tabular-nums text-gray-900">$284K</td></tr>
              </tbody>
            </table>
            <p className="px-3 py-1.5 text-[10px] text-gray-400">bg-gray-50/80 header</p>
          </div>
        }
        codebase={
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F4F4F4] border-b border-[#EBEBEB]">
                <th className="text-left py-2.5 px-3 text-[12px] font-medium text-[#525866]">Customer</th>
                <th className="text-right py-2.5 px-3 text-[12px] font-medium text-[#525866]">Value</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50"><td className="py-3 px-3 font-medium text-[12px] text-[#686868]">Duke Energy</td><td className="py-3 px-3 text-right tabular-nums text-[12px] text-[#686868]">$284K</td></tr>
              </tbody>
            </table>
            <p className="px-3 py-1.5 text-[10px] text-gray-400">bg-[#F4F4F4] header, text-[#525866], text-[#686868] cells</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 12. Cards ──────────────────────────────────────────────────────────────

function CardsSection() {
  return (
    <Section id="cards" title="Cards" desc="Design system has pipeline cards. Codebase also uses SectionCard with different header pattern.">
      <CompareRow
        label="Section Card (with header bar)"
        status="partial"
        designSystem={
          <div className="bg-white rounded-lg border border-gray-200 p-3.5">
            <span className="text-sm font-medium text-gray-900">Design System Card</span>
            <p className="text-xs text-gray-500 mt-1">Flat card, no header bar</p>
          </div>
        }
        codebase={
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-0 h-[38px] border-b border-[#E4E6EA] bg-[#FAFAFC] rounded-t-lg">
              <span className="font-inter font-semibold text-[14px] text-gray-900">Codebase SectionCard</span>
              <button className="text-gray-400 hover:text-gray-600"><Pencil size={14} /></button>
            </div>
            <div className="p-6">
              <p className="text-xs text-gray-500">Content area with bg-[#FAFAFC] header bar</p>
            </div>
          </div>
        }
      />
    </Section>
  );
}

// ─── 13. Badges ─────────────────────────────────────────────────────────────

function BadgesSection() {
  return (
    <Section id="badges" title="Badges & Status Pills" desc="Design system has pipeline badges. Codebase also has StatusPill with different color mappings.">
      <CompareRow
        label="Status Badges"
        status="partial"
        designSystem={
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700"><Trophy size={10} /> WON</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600"><XCircle size={10} /> LOST</span>
          </div>
        }
        codebase={
          <div className="flex flex-wrap gap-2">
            <span className="px-2 rounded-full border bg-[#E0FAEC] border-[#E0FAEC] text-[#1FC16B] text-[12px] font-inter font-medium flex items-center justify-center py-1">ACTIVE</span>
            <span className="px-2 rounded-full border bg-[#FFF3EB] border-[#FFE8D9] text-[#FA7319] text-[12px] font-inter font-medium flex items-center justify-center py-1">REVIEW</span>
            <span className="px-2 rounded-full border bg-blue-50 border-blue-50 text-blue-700 text-[12px] font-inter font-medium flex items-center justify-center py-1">PENDING</span>
            <span className="px-2 rounded-full border bg-red-50 border-red-500 text-red-700 text-[12px] font-inter font-medium flex items-center justify-center py-1">FAILED</span>
            <span className="px-2 rounded-full border bg-gray-50 border-gray-500 text-gray-700 text-[12px] font-inter font-medium flex items-center justify-center py-1">INACTIVE</span>
          </div>
        }
      />
    </Section>
  );
}

// ─── 14. Tooltips ───────────────────────────────────────────────────────────

function TooltipsSection() {
  return (
    <Section id="tooltips" title="Tooltips" desc="Missing from design system. Custom tooltips used in FuelCard, Toll pages, and AG Grid.">
      <MissingBlock label="Standard Tooltip" description="shadcn Tooltip with white bg, #EBEBEB border, #171717 text. Arrow support.">
        <div className="flex items-center gap-8">
          <div className="relative inline-block">
            <div className="flex items-center gap-1 text-sm text-gray-600"><HelpCircle size={16} className="text-gray-400" /> Hover for info</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg bg-white border border-[#EBEBEB] px-3 py-2 text-[12px] font-inter text-[#171717] shadow-md whitespace-nowrap">
              This is a tooltip
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white" />
            </div>
          </div>
          <div className="relative inline-block">
            <div className="flex items-center gap-1 text-sm text-gray-600"><Info size={16} className="text-blue-500" /> Rich tooltip</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg bg-white border border-[#EBEBEB] px-3 py-2 shadow-md w-48">
              <p className="text-[12px] font-semibold text-[#171717]">Pipeline Value</p>
              <p className="text-[11px] text-gray-500 mt-1">Total value of all active estimates in the pipeline</p>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 15. Dropdown Menu ──────────────────────────────────────────────────────

function DropdownsSection() {
  return (
    <Section id="dropdowns" title="Dropdown Menu (Actions)" desc="Missing from design system. shadcn DropdownMenu used for table row actions.">
      <MissingBlock label="Actions Dropdown" description="Used on every list/table page for row actions (Edit, Duplicate, Delete).">
        <div className="flex gap-8">
          <div>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 border border-gray-200"><MoreHorizontal size={16} /></button>
          </div>
          <div className="w-48 rounded-md border border-gray-200 bg-white shadow-md overflow-hidden">
            <div className="p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 cursor-pointer"><Pencil size={14} className="text-gray-500" /> Edit</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 cursor-pointer"><Copy size={14} className="text-gray-500" /> Duplicate</div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 cursor-pointer"><Eye size={14} className="text-gray-500" /> View Details</div>
              <div className="h-px bg-gray-200 my-1" />
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-red-50 cursor-pointer text-red-600"><Trash2 size={14} /> Delete</div>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 16. Pagination ─────────────────────────────────────────────────────────

function PaginationSection() {
  return (
    <Section id="pagination" title="Pagination" desc="Missing from design system. TablePagination used on every list page.">
      <MissingBlock label="Table Pagination" description="Page numbers + prev/next + page size selector + summary text.">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing 1–25 of 148</span>
          <div className="flex items-center gap-1">
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-400 opacity-50"><ChevronsLeft size={14} /></button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-400 opacity-50"><ChevronLeft size={14} /></button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center bg-gray-100 border-gray-100 text-sm font-medium">1</button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-500">2</button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-500">3</button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-400">...</button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-500">6</button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-500"><ChevronRight size={14} /></button>
            <button className="border rounded-md min-w-[32px] h-8 flex items-center justify-center border-gray-200 text-sm text-gray-500"><ChevronsRight size={14} /></button>
          </div>
          <select className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700">
            <option>25 / page</option>
            <option>50 / page</option>
            <option>100 / page</option>
          </select>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 17. Loaders ────────────────────────────────────────────────────────────

function LoadersSection() {
  return (
    <Section id="loaders" title="Loaders" desc="Design system shows skeleton only. Codebase has 6+ spinner/loader variants.">
      <CompareRow
        label="Loading Pattern"
        status="partial"
        designSystem={
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-2">Skeleton only:</p>
            <div className="bg-white rounded-lg border border-gray-200 p-3.5 space-y-2">
              <div className="flex justify-between"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></div>
              <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        }
        codebase={
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Full-screen spinner (Loader.tsx):</p>
              <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
                <Loader2 size={32} className="animate-spin text-[#FF884D]" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Inline button spinner:</p>
              <button className="flex items-center gap-2 bg-[#FF884D] text-white px-4 py-2 rounded-md text-sm" disabled>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </button>
            </div>
          </div>
        }
      />
    </Section>
  );
}

// ─── 18. Alerts & Toasts ────────────────────────────────────────────────────

function AlertsSection() {
  return (
    <Section id="alerts" title="Alerts & Toasts" desc="Design system has basic toasts. Codebase has FormError banner + shadcn Alert + sonner toasts.">
      <CompareRow
        label="Error Banner"
        status="partial"
        designSystem={
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <XCircle size={16} /> Something went wrong
            <button className="ml-auto"><X size={14} /></button>
          </div>
        }
        codebase={
          <div className="text-sm bg-red-600 text-white rounded-lg p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} />
              <span>Failed to save estimate. Please try again.</span>
            </div>
            <button className="hover:opacity-70"><X size={14} /></button>
          </div>
        }
      />
      <MissingBlock label="shadcn Alert Component" description="Alert with variant (default/destructive). Not in design system.">
        <div className="space-y-3">
          <div className="relative w-full rounded-lg border px-4 py-3 text-sm bg-white">
            <div className="flex items-start gap-3">
              <Info size={16} className="mt-0.5 text-gray-600" />
              <div>
                <h5 className="font-medium text-gray-900">Note</h5>
                <p className="text-gray-600 mt-1">Rate tables were last updated 30 days ago.</p>
              </div>
            </div>
          </div>
          <div className="relative w-full rounded-lg border border-red-200 px-4 py-3 text-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="mt-0.5 text-red-600" />
              <div>
                <h5 className="font-medium text-red-600">Error</h5>
                <p className="text-red-600 mt-1">Failed to load rate agreement data.</p>
              </div>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 19. Colors ─────────────────────────────────────────────────────────────

function ColorsSection() {
  return (
    <Section id="colors" title="Color Token Gaps" desc="Colors used in codebase but missing from design system tokens.">
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-900">In Design System</span>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "gray-900", hex: "#111827", cls: "bg-gray-900" },
              { label: "gray-200", hex: "#E5E7EB", cls: "bg-gray-200" },
              { label: "gray-50", hex: "#F9FAFB", cls: "bg-gray-50" },
              { label: "Success", hex: "#059669", cls: "bg-emerald-600" },
              { label: "Warning", hex: "#D97706", cls: "bg-amber-600" },
              { label: "Error", hex: "#EF4444", cls: "bg-red-500" },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded border border-gray-200 ${c.cls}`} />
                <div><p className="text-xs font-medium text-gray-700">{c.label}</p><p className="text-[10px] text-gray-400">{c.hex}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-2 border-dashed border-red-200 rounded-xl overflow-hidden bg-red-50/30">
          <div className="px-4 py-2.5 bg-red-50 border-b border-red-200">
            <span className="text-sm font-medium text-red-700">Missing — Used in Codebase</span>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Brand Orange", hex: "#FF884D", cls: "bg-[#FF884D]" },
              { label: "Tab Active Orange", hex: "#E97135", cls: "bg-[#E97135]" },
              { label: "Input Border", hex: "#D9D9D9", cls: "bg-[#D9D9D9]" },
              { label: "Card Header BG", hex: "#FAFAFC", cls: "bg-[#FAFAFC]" },
              { label: "Card Border", hex: "#E4E6EA", cls: "bg-[#E4E6EA]" },
              { label: "Section Text", hex: "#525866", cls: "bg-[#525866]" },
              { label: "Cell Text", hex: "#686868", cls: "bg-[#686868]" },
              { label: "Disabled BG", hex: "#F2F2F2", cls: "bg-[#F2F2F2]" },
              { label: "Disabled Border", hex: "#BFBFBF", cls: "bg-[#BFBFBF]" },
              { label: "Active StatusPill", hex: "#1FC16B", cls: "bg-[#1FC16B]" },
              { label: "Review StatusPill", hex: "#FA7319", cls: "bg-[#FA7319]" },
              { label: "Check Blue", hex: "#335CFF", cls: "bg-[#335CFF]" },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded border border-gray-200 ${c.cls}`} />
                <div><p className="text-xs font-medium text-red-700">{c.label}</p><p className="text-[10px] text-red-400">{c.hex}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── 20. Typography ─────────────────────────────────────────────────────────

function TypographySection() {
  return (
    <Section id="typography" title="Typography Gaps" desc="Design system uses Tailwind defaults. Codebase uses explicit pixel sizes.">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50/80 border-b border-gray-200">
            <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Role</th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Design System</th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Codebase (Actual)</th>
            <th className="text-center py-2.5 px-3 text-xs font-medium text-gray-500 w-20">Match?</th>
          </tr></thead>
          <tbody>
            {[
              { role: "Label", ds: "text-sm font-medium text-gray-700", cb: "text-[12px] font-medium text-[#000000] font-inter", match: false },
              { role: "Body Text", ds: "text-xs text-gray-500", cb: "text-[12px] text-[#000000] font-inter", match: false },
              { role: "Card Header", ds: "text-sm font-medium text-gray-900", cb: "text-[14px] font-semibold text-gray-900 font-inter", match: false },
              { role: "Section Header", ds: "text-xs uppercase tracking-wide text-gray-500", cb: "text-[14px] font-semibold text-[#525866] font-inter", match: false },
              { role: "Table Cell", ds: "text-sm text-gray-900", cb: "text-[12px] text-[#686868] font-inter", match: false },
              { role: "Placeholder", ds: "placeholder-gray-400", cb: "placeholder:text-[#7E7E7F] placeholder:text-[12px]", match: false },
              { role: "Page Title", ds: "text-xl font-semibold text-gray-900", cb: "text-2xl font-semibold font-inter", match: true },
              { role: "Timestamp", ds: "text-xs text-gray-400", cb: "text-xs text-gray-400", match: true },
            ].map(r => (
              <tr key={r.role} className="border-b border-gray-100 last:border-0">
                <td className="py-2.5 px-4 font-medium text-gray-900">{r.role}</td>
                <td className="py-2.5 px-4"><Code>{r.ds}</Code></td>
                <td className="py-2.5 px-4"><Code>{r.cb}</Code></td>
                <td className="py-2.5 px-3 text-center">
                  {r.match ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <XCircle size={16} className="text-red-400 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── 21. Confirmation Dialog ────────────────────────────────────────────────

function ConfirmationSection() {
  return (
    <Section id="confirmation" title="Confirmation Dialog" desc="Missing from design system. UnsavedChangesModal used whenever user navigates away from unsaved forms.">
      <MissingBlock label="Unsaved Changes Modal" description="Custom modal (not shadcn Dialog) with rounded-[20px], specific shadows, 3 action buttons.">
        <div className="max-w-md mx-auto">
          <div className="min-w-[320px] rounded-[20px] border border-[#EBEBEB] bg-white shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.1)] p-6">
            <h3 className="text-[20px] font-semibold text-[#171717] mb-2">Unsaved Changes</h3>
            <p className="text-[#5C5C5C] text-[14px] leading-relaxed font-inter mb-4">
              You have unsaved changes. Would you like to save before leaving?
            </p>
            <div className="border-t border-[#EBEBEB] mb-4" />
            <div className="flex gap-3 justify-center">
              <button className="w-[138px] h-8 rounded-lg border border-[#5C5C5C] bg-white hover:bg-[#F7F7F7] font-inter font-semibold text-xs text-[#5C5C5C]">
                Continue Editing
              </button>
              <button className="w-[138px] h-8 rounded-lg border border-[#5C5C5C] bg-white hover:bg-[#F7F7F7] font-inter font-semibold text-xs text-[#5C5C5C]">
                Discard
              </button>
              <button className="min-w-[88px] h-8 rounded-lg bg-[#FE884D] hover:bg-[#FE884D]/90 text-white font-inter font-semibold text-xs">
                Save
              </button>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 22. Accordion ──────────────────────────────────────────────────────────

function AccordionSection() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="accordion" title="Accordion / Collapsible" desc="Missing from design system. shadcn Accordion used in settings, table expansion.">
      <MissingBlock label="Accordion" description="AccordionItem, AccordionTrigger, AccordionContent with expand/collapse animations.">
        <div className="max-w-md border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
          {["Organization Settings", "Rate Tables", "Equipment Defaults"].map((item, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 text-left">
                {item}
                {open === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {open === i && (
                <div className="px-4 pb-3 text-sm text-gray-500">
                  Content for {item}. This would contain the relevant settings or configuration options.
                </div>
              )}
            </div>
          ))}
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 23. Progress Bar ───────────────────────────────────────────────────────

function ProgressSection() {
  return (
    <Section id="progress" title="Progress Bar" desc="Design system has stepper-style progress. Codebase uses linear horizontal bars.">
      <CompareRow
        label="Progress Indicator"
        status="partial"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">Step-based progress:</p>
            <div className="flex gap-1 max-w-sm">
              {[{ l: "Draft", past: true }, { l: "Review", past: true }, { l: "Submitted", active: true }, { l: "Decision" }, { l: "Won" }].map(s => (
                <div key={s.l} className="flex-1">
                  <div className={`h-1.5 rounded-full ${s.active ? "bg-violet-500" : s.past ? "bg-gray-800" : "bg-gray-200"}`} />
                  <p className={`text-[10px] mt-1.5 ${s.active ? "text-gray-900 font-medium" : "text-gray-400"}`}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        }
        codebase={
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Inline progress bar:</p>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden max-w-sm">
                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: "67%" }} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Card progress bar:</p>
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                  <span className="text-sm font-medium text-gray-700">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "67%" }} />
                </div>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}
