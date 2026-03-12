/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from "react";
import {
  Plus, Search, X, AlertTriangle, CheckCircle2,
  DollarSign, Calendar, ArrowUpRight,
  Pencil, Trophy,
  XCircle, Copy, LayoutGrid, List,
  FileText, ChevronRight, ChevronDown, ChevronUp, Eye,
  HelpCircle,
  Loader2, Upload, MoreHorizontal, Trash2, Info,
  Mail, Lock, EyeOff, Check, ChevronLeft, ChevronsLeft, ChevronsRight,
  Download
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
    { id: "popover", label: "Popover" },
    { id: "tabs", label: "Tabs" },
    { id: "tables", label: "Tables" },
    { id: "cards", label: "Cards" },
    { id: "badges", label: "Badges & Status" },
    { id: "tooltips", label: "Tooltips" },
    { id: "dropdowns", label: "Dropdown Menu" },
    { id: "toggle-group", label: "Toggle Group" },
    { id: "breadcrumb", label: "Breadcrumb" },
    { id: "pagination", label: "Pagination" },
    { id: "loaders", label: "Loaders" },
    { id: "alerts", label: "Alerts & Toasts" },
    { id: "empty-states", label: "Empty States" },
    { id: "error-boundary", label: "Error Boundary" },
    { id: "sidebar-layout", label: "App Shell / Sidebar" },
    { id: "stepper", label: "Multi-step Stepper" },
    { id: "command-palette", label: "Command Palette" },
    { id: "colors", label: "Color Tokens" },
    { id: "typography", label: "Typography" },
    { id: "confirmation", label: "Confirmation Dialog" },
    { id: "accordion", label: "Accordion" },
    { id: "progress", label: "Progress Bar" },
    { id: "ag-grid", label: "AG Grid Theme" },
    { id: "switch-toggle", label: "Switch / Toggle" },
    { id: "slider", label: "Slider / Range" },
    { id: "spacing", label: "Spacing & Shadows" },
    { id: "charts", label: "Charts & Analytics" },
    { id: "maps", label: "Map Views" },
    { id: "calendar", label: "Calendar / Scheduling" },
    { id: "chatbot", label: "Chatbot UI" },
    { id: "icons", label: "Icons" },
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
          <div className="flex items-center gap-3">
            <StatusCount label="Match" count={3} color="emerald" />
            <StatusCount label="Partial" count={15} color="amber" />
            <StatusCount label="Missing" count={24} color="red" />
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
          <EmptyStatesSection />
          <ErrorBoundarySection />
          <SidebarLayoutSection />
          <StepperSection />
          <CommandPaletteSection />
          <ColorsSection />
          <TypographySection />
          <ConfirmationSection />
          <AccordionSection />
          <ProgressSection />
          <PopoverSection />
          <ToggleGroupSection />
          <BreadcrumbSection />
          <AGGridSection />
          <SwitchToggleSection />
          <SliderSection />
          <SpacingSection />
          <ChartsSection />
          <MapsSection />
          <CalendarSchedulingSection />
          <ChatbotSection />
          <IconsSection />
        </div>
      </div>
    </div>
  );
}

export default AuditPage;

// ─── Helpers ────────────────────────────────────────────────────────────────

function StatusCount({ label, count, color }: { label: string; count: number; color: "emerald" | "amber" | "red" }) {
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

function AuditTag({ children, color = "gray" }: { children: ReactNode; color?: "green" | "red" | "amber" | "blue" | "gray" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-600 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${map[color]}`}>{children}</span>;
}

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: ReactNode }) {
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

function CompareRow({ label, designSystem, codebase, status }: { label: string; designSystem?: ReactNode; codebase?: ReactNode; status: "match" | "partial" | "missing" | "codebase-only" }) {
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
        <AuditTag color={s.color}>{s.tag}</AuditTag>
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

function MissingBlock({ label, description, children }: { label: string; description: string; children: ReactNode }) {
  return (
    <div className="border-2 border-dashed border-red-200 rounded-xl overflow-hidden bg-red-50/30 mb-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-red-50 border-b border-red-200">
        <span className="text-sm font-medium text-red-700">{label}</span>
        <AuditTag color="red">MISSING</AuditTag>
      </div>
      <div className="p-4">
        <p className="text-xs text-red-600 mb-3">{description}</p>
        {children}
      </div>
    </div>
  );
}

function AuditCode({ children }: { children: ReactNode }) {
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
    { component: "Empty State", ds: true, cb: true, status: "partial", note: "DS has pattern, App uses inconsistent variants" },
    { component: "Popover", ds: false, cb: true, status: "missing", note: "12+ files: date pickers, filters, union selectors" },
    { component: "Toggle Group", ds: false, cb: true, status: "missing", note: "Grid/List view switchers, ad-hoc buttons" },
    { component: "Breadcrumb", ds: false, cb: true, status: "partial", note: "shadcn exists, CustomBreadcrum + TopBar not unified" },
    { component: "Error Boundary", ds: false, cb: true, status: "missing", note: "ErrorBoundary.tsx in common/, no DS coverage" },
    { component: "App Shell / Sidebar", ds: true, cb: true, status: "partial", note: "DS shows sidebar-08, App has custom AuthLayout" },
    { component: "Multi-step Stepper", ds: false, cb: true, status: "missing", note: "3 BreadcrumLayouts + bid estimate steps" },
    { component: "Command Palette", ds: false, cb: true, status: "missing", note: "cmdk used in 6 files (selectors, filters) but not in DS" },
    { component: "AG Grid Theme", ds: false, cb: true, status: "missing", note: "Custom agGridTheme.ts, 10+ pages, not in DS" },
    { component: "Switch / Toggle", ds: true, cb: true, status: "partial", note: "DS has toggle in Settings, App uses in rate agreements" },
    { component: "Slider / Range", ds: false, cb: true, status: "missing", note: "8 files: shift probability, billing, time sliders" },
    { component: "Spacing & Shadows", ds: true, cb: true, status: "partial", note: "DS defines scale, App uses inconsistent values" },
    { component: "Charts / Analytics", ds: true, cb: true, status: "partial", note: "DS uses recharts, App uses Chart.js + mixed patterns" },
    { component: "Map Views", ds: true, cb: true, status: "partial", note: "DS defines pin types, App has Google Maps + Leaflet" },
    { component: "Calendar / Scheduling", ds: true, cb: true, status: "partial", note: "DS has month+gantt, App uses shadcn Calendar in 11 files" },
    { component: "Chatbot UI", ds: false, cb: true, status: "missing", note: "10 files in components/chatbot/, not in DS at all" },
    { component: "Icons", ds: true, cb: true, status: "match", note: "Lucide React, consistent usage" },
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
                  <AuditTag color={r.status === "match" ? "green" : r.status === "partial" ? "amber" : "red"}>
                    {r.status === "match" ? "OK" : r.status === "partial" ? "Partial" : "Missing"}
                  </AuditTag>
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
              { label: "ST (Teal)", hex: "#4DB6AC", cls: "bg-[#4DB6AC]" },
              { label: "OT (Amber)", hex: "#FFB74D", cls: "bg-[#FFB74D]" },
              { label: "DT (Red)", hex: "#E57373", cls: "bg-[#E57373]" },
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
                <td className="py-2.5 px-4"><AuditCode>{r.ds}</AuditCode></td>
                <td className="py-2.5 px-4"><AuditCode>{r.cb}</AuditCode></td>
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

// ─── 24. Popover ──────────────────────────────────────────────────────────────

function PopoverSection() {
  return (
    <Section id="popover" title="Popover" desc="Not in design system. Used in 12+ files: date pickers, filter panels, union selectors, sidebar org switcher.">
      <MissingBlock label="Popover" description="Radix Popover via shadcn. Used for DatePickerField, FuelFilters, TollFilters, NestedUnionAgreementSelect, sidebar.">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">Date picker popover (CustomInputDate):</p>
            <div className="inline-flex flex-col">
              <button className="flex items-center gap-2 h-9 px-3 border border-[#D9D9D9] rounded-md text-[12px] text-[#000000] hover:border-black">
                <Calendar size={14} className="text-gray-400" />
                <span>03/10/2026</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <ChevronLeft size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">March 2026</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="text-gray-400 py-1">{d}</div>)}
                  {Array.from({length:10}, (_, i) => (
                    <div key={i} className={`py-1 rounded ${i === 9 ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>{i + 1}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Filter popover (FuelFilters / TollFilters):</p>
            <div className="inline-flex flex-col">
              <button className="flex items-center gap-2 h-8 px-3 border border-gray-200 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50">
                <Search size={14} /> Filter <ChevronDown size={14} />
              </button>
              <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[300px]">
                <p className="text-sm font-medium text-gray-900 mb-3">Filter by</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Date Range</label>
                    <div className="flex gap-2 mt-1">
                      <input type="text" placeholder="From" className="h-8 flex-1 border border-[#D9D9D9] rounded-md px-2 text-xs" />
                      <input type="text" placeholder="To" className="h-8 flex-1 border border-[#D9D9D9] rounded-md px-2 text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Status</label>
                    <div className="flex gap-2 mt-1">
                      {["All","Active","Inactive"].map(s => (
                        <button key={s} className={`px-2 py-1 rounded text-xs ${s === "All" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="text-xs text-gray-500">Clear</button>
                  <button className="px-3 py-1 bg-orange-500 text-white rounded text-xs">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 25. Toggle Group ─────────────────────────────────────────────────────────

function ToggleGroupSection() {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <Section id="toggle-group" title="Toggle Group / View Switcher" desc="Not in design system. 4+ custom implementations: MapListToggle, EquipmentMapListToggle, FuelCardListToggle, TollCardListToggle.">
      <MissingBlock label="Toggle Group" description="4 separate toggle components with sliding indicator animations for List/Map/Events switching. Should be unified into one.">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">View mode toggle (Equipment, Contractors):</p>
            <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${view === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${view === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <List size={14} /> List
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Orange variant (current codebase pattern):</p>
            <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-500 text-white">
                <LayoutGrid size={14} /> Grid
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-gray-600 hover:bg-gray-50">
                <List size={14} /> List
              </button>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 26. Breadcrumb ───────────────────────────────────────────────────────────

function BreadcrumbSection() {
  return (
    <Section id="breadcrumb" title="Breadcrumb" desc="shadcn breadcrumb exists. Codebase uses CustomBreadcrum + TopBar breadcrumbs, not unified.">
      <CompareRow
        label="Breadcrumb Navigation"
        status="partial"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">shadcn/ui Breadcrumb (components/ui/breadcrumb.tsx):</p>
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Home</a>
              <ChevronRight size={14} className="text-gray-300" />
              <a href="#" className="hover:text-gray-900">Organizations</a>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-900 font-medium">Contractors</span>
            </nav>
          </div>
        }
        codebase={
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">CustomBreadcrum (components/common/):</p>
              <nav className="flex items-center gap-1.5 text-sm">
                <a href="#" className="text-gray-400 hover:text-gray-600">Roster</a>
                <ChevronRight size={14} className="text-gray-300" />
                <a href="#" className="text-gray-400 hover:text-gray-600">Conversion</a>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-[#FF884D] font-medium">Upload</span>
              </nav>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">TopBar breadcrumb (layouts/auth/TopBar):</p>
              <div className="flex items-center gap-2 h-10 px-4 bg-white border-b border-gray-200">
                <span className="text-sm text-gray-400">Equipment</span>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-sm text-gray-900 font-medium">Fleet Overview</span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}

// ─── 27. Empty States ─────────────────────────────────────────────────────────

function EmptyStatesSection() {
  return (
    <Section id="empty-states" title="Empty States" desc="Design system has empty state pattern. Codebase uses inconsistent empty states across pages.">
      <CompareRow
        label="Empty State"
        status="partial"
        designSystem={
          <div className="flex flex-col items-center justify-center py-8 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FileText size={20} className="text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No estimates yet</h3>
            <p className="text-xs text-gray-500 mb-4">Create your first bid estimate to get started</p>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium">
              <Plus size={14} /> Create Estimate
            </button>
          </div>
        }
        codebase={
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Table empty state (history pages):</p>
              <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <FileText size={24} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No records found</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Card empty state (bid estimates landing):</p>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                  <FileText size={24} className="text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No Bid Estimates</h3>
                <p className="text-xs text-gray-500 mb-4">Get started by creating your first estimate</p>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#FF884D] text-white rounded-lg text-xs font-medium">
                  <Plus size={14} /> New Estimate
                </button>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}

// ─── 28. Error Boundary ───────────────────────────────────────────────────────

function ErrorBoundarySection() {
  return (
    <Section id="error-boundary" title="Error Boundary" desc="Not in design system. Codebase has ErrorBoundary component in components/common/.">
      <MissingBlock label="Error Boundary / Error State" description="ErrorBoundary.tsx in components/common/. Class component that catches React errors and shows fallback UI.">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Error boundary fallback UI (codebase):</p>
            <div className="flex flex-col items-center justify-center py-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
              <AlertTriangle size={32} className="text-red-400 mb-3" />
              <h3 className="text-sm font-semibold text-red-800 mb-1">Something went wrong</h3>
              <p className="text-xs text-red-600 mb-4 px-6 text-center">An unexpected error occurred. Please refresh the page or contact support.</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                Refresh Page
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">API error state (inline):</p>
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
              <XCircle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Failed to load data</p>
                <p className="text-xs text-red-600 mt-0.5">Unable to fetch contractor list. Check your connection.</p>
              </div>
              <button className="ml-auto text-xs text-red-700 underline flex-shrink-0">Retry</button>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 29. App Shell / Sidebar Layout ──────────────────────────────────────────

function SidebarLayoutSection() {
  return (
    <Section id="sidebar-layout" title="App Shell / Sidebar Layout" desc="Design system shows sidebar-08 inset pattern. Codebase has full implementation in layouts/auth/.">
      <CompareRow
        label="Sidebar Layout"
        status="partial"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">shadcn sidebar-08 inset pattern:</p>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden h-[180px] text-xs">
              <div className="w-[160px] bg-gray-50 border-r border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-md" />
                  <span className="font-medium text-gray-900">Gridbase</span>
                </div>
                {["Dashboard","Roster","Invoice","Equipment"].map((item, i) => (
                  <div key={item} className={`px-2 py-1 rounded text-xs ${i === 0 ? "bg-gray-200 font-medium" : "text-gray-500"}`}>{item}</div>
                ))}
                <div className="mt-auto flex items-center gap-2 pt-2 border-t border-gray-200">
                  <div className="w-5 h-5 rounded-full bg-gray-300" />
                  <span className="text-gray-500">User</span>
                </div>
              </div>
              <div className="flex-1 p-2 bg-white">
                <div className="h-6 bg-gray-100 rounded mb-2" />
                <div className="h-full bg-gray-50 rounded border border-gray-100" />
              </div>
            </div>
          </div>
        }
        codebase={
          <div>
            <p className="text-xs text-gray-500 mb-2">AuthLayout (layouts/auth/) with SideBar + TopBar:</p>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden h-[180px] text-xs">
              <div className="w-[160px] bg-white border-r border-gray-200 p-2 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-[#FF884D] rounded-md" />
                  <span className="font-medium text-gray-900">Gridbase</span>
                </div>
                {["Roster","Invoice","Timesheet","Organizations","Equipment"].map((item, i) => (
                  <div key={item} className={`px-2 py-1 rounded text-xs ${i === 0 ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-500"}`}>{item}</div>
                ))}
                <div className="mt-auto flex items-center gap-2 pt-2 border-t border-gray-200">
                  <div className="w-5 h-5 rounded-full bg-orange-200" />
                  <span className="text-gray-500">Shubham</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-[#F5F5F5]">
                <div className="h-8 bg-white border-b border-gray-200 flex items-center px-3">
                  <span className="text-gray-400">Roster</span>
                  <ChevronRight size={12} className="text-gray-300 mx-1" />
                  <span className="text-gray-900 font-medium">Upload</span>
                </div>
                <div className="flex-1 p-2">
                  <div className="h-full bg-white rounded-lg border border-gray-200" />
                </div>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}

// ─── 30. Multi-step Stepper ──────────────────────────────────────────────────

function StepperSection() {
  return (
    <Section id="stepper" title="Multi-step Stepper" desc="Not in design system. Codebase uses breadcrumb-based steppers in RosterBreadcrumLayout, InvoiceBreadcrumLayout, TimesheetBreadcrumLayout.">
      <MissingBlock label="Multi-step Stepper" description="Used for conversion flows: Upload → Client → Merge → Result. Each BreadcrumLayout renders step indicators.">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">Roster conversion stepper (RosterBreadcrumLayout):</p>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                {[
                  { label: "Upload", done: true },
                  { label: "Select Client", done: true },
                  { label: "Merge", active: true },
                  { label: "Result", done: false },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    {i > 0 && <div className={`w-12 h-px ${step.done || step.active ? "bg-orange-400" : "bg-gray-200"}`} />}
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        step.done ? "bg-orange-500 text-white" : step.active ? "border-2 border-orange-500 text-orange-500" : "border border-gray-300 text-gray-400"
                      }`}>
                        {step.done ? <Check size={12} /> : i + 1}
                      </div>
                      <span className={`text-xs ${step.active ? "text-orange-600 font-medium" : step.done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Bid estimate step indicator (sidebar stepper):</p>
            <div className="bg-white border border-gray-200 rounded-lg p-4 w-[200px]">
              {[
                { label: "Project Description", done: true },
                { label: "Work Schedule", done: true },
                { label: "Crew & Equipment", active: true },
                { label: "Labor Rates", done: false },
                { label: "Per Diem", done: false },
              ].map((step, i) => (
                <div key={step.label} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step.done ? "bg-emerald-500 text-white" : step.active ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      {step.done ? <Check size={10} /> : i + 1}
                    </div>
                    {i < 4 && <div className={`w-px h-4 ${step.done ? "bg-emerald-300" : "bg-gray-200"}`} />}
                  </div>
                  <span className={`text-xs mt-0.5 ${step.active ? "text-gray-900 font-medium" : step.done ? "text-gray-600" : "text-gray-400"}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 31. Command Palette ─────────────────────────────────────────────────────

function CommandPaletteSection() {
  return (
    <Section id="command-palette" title="Command Palette" desc="Not in design system. shadcn Command (cmdk) used in 6 files: UnionAgreementSelector, TollFilters, FuelFilters.">
      <MissingBlock label="Command Palette" description="cmdk-based Command used for searchable dropdowns in union/agreement selectors and filter panels. Not documented in DS.">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Potential implementation (shadcn Command):</p>
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-[400px] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <Search size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">Search pages, actions, contractors...</span>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-400 px-2 py-1">Quick Actions</p>
                {[
                  { icon: <Plus size={14} />, label: "New Bid Estimate", shortcut: "⌘N" },
                  { icon: <Upload size={14} />, label: "Upload Roster", shortcut: "⌘U" },
                  { icon: <FileText size={14} />, label: "View Invoice History", shortcut: "⌘I" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <span className="text-gray-400">{item.icon}</span>
                    <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                    <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.shortcut}</kbd>
                  </div>
                ))}
                <p className="text-xs text-gray-400 px-2 py-1 mt-2">Navigation</p>
                {["Roster", "Invoice", "Equipment", "Organizations"].map(page => (
                  <div key={page} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{page}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 32. AG Grid Theme ───────────────────────────────────────────────────────

function AGGridSection() {
  return (
    <Section id="ag-grid" title="AG Grid Theme" desc="Not in design system. Codebase has agGridTheme.ts using themeQuartz + iconSetMaterial. AG Grid Enterprise used in 23+ files.">
      <MissingBlock label="AG Grid Theme" description="Custom themeQuartz in lib/agGridTheme.ts with accent #FE884D, header bg #F7F7F7, Inter 12px, 40px rows. Used across equipment, toll, fuel, rate calculator.">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">AG Grid table (codebase pattern):</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#F8F9FA] border-b border-gray-200">
                <div className="grid grid-cols-5 text-xs font-medium text-gray-500">
                  <div className="px-3 py-2.5 border-r border-gray-200">Employee</div>
                  <div className="px-3 py-2.5 border-r border-gray-200">Classification</div>
                  <div className="px-3 py-2.5 border-r border-gray-200">ST Rate</div>
                  <div className="px-3 py-2.5 border-r border-gray-200">OT Rate</div>
                  <div className="px-3 py-2.5">DT Rate</div>
                </div>
              </div>
              {[
                { name: "John Doe", class: "Lineman", st: "$65.00", ot: "$97.50", dt: "$130.00" },
                { name: "Jane Smith", class: "Groundman", st: "$45.00", ot: "$67.50", dt: "$90.00" },
                { name: "Bob Johnson", class: "Operator", st: "$70.00", ot: "$105.00", dt: "$140.00" },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-5 text-xs ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 last:border-0`}>
                  <div className="px-3 py-2.5 font-medium text-gray-900 border-r border-gray-100">{row.name}</div>
                  <div className="px-3 py-2.5 text-gray-600 border-r border-gray-100">{row.class}</div>
                  <div className="px-3 py-2.5 text-teal-600 border-r border-gray-100">{row.st}</div>
                  <div className="px-3 py-2.5 text-amber-600 border-r border-gray-100">{row.ot}</div>
                  <div className="px-3 py-2.5 text-red-600">{row.dt}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">AG Grid theme tokens (from agGridTheme.ts):</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { token: "Font", value: "Inter, 12px" },
                { token: "Row Height", value: "40px" },
                { token: "Header Height", value: "40px" },
                { token: "Header BG", value: "#F7F7F7" },
                { token: "Row Hover", value: "#F7F7F7" },
                { token: "Border", value: "#EBEBEB" },
                { token: "Cell Text", value: "#5C5C5C" },
                { token: "Accent", value: "#FE884D" },
              ].map(t => (
                <div key={t.token} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                  <span className="text-gray-500">{t.token}</span>
                  <span className="font-mono text-gray-900">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 33. Switch / Toggle ─────────────────────────────────────────────────────

function SwitchToggleSection() {
  const [on1, setOn1] = useState(true);
  const [on2, setOn2] = useState(false);
  return (
    <Section id="switch-toggle" title="Switch / Toggle (On-Off)" desc="Design system defines toggle switches in Settings. Codebase uses in rate agreement forms.">
      <CompareRow
        label="Toggle Switch"
        status="partial"
        designSystem={
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-gray-500 mb-2">DS Settings toggle pattern (gray-900 track):</p>
            {[
              { label: "Email notifications", desc: "Receive updates on bid status", on: on1, set: setOn1 },
              { label: "Auto-calculate overtime", desc: "Compute OT rates from straight time", on: on2, set: setOn2 },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </div>
                <button onClick={() => t.set(!t.on)} className={`w-9 h-5 rounded-full transition-colors flex items-center ${t.on ? "bg-gray-900" : "bg-gray-200"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${t.on ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                </button>
              </div>
            ))}
          </div>
        }
        codebase={
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-gray-500 mb-2">Codebase (AddRateAgreementForm, EditRateAgreementForm):</p>
            <div className="flex items-center justify-between py-3 px-4 border border-[#D9D9D9] rounded-md">
              <div>
                <p className="text-[12px] font-medium text-[#000000]">Include Benefits</p>
                <p className="text-[12px] text-gray-500 mt-0.5">Add benefits to rate calculations</p>
              </div>
              <button className="w-9 h-5 rounded-full bg-[#FF884D] flex items-center">
                <div className="w-4 h-4 rounded-full bg-white shadow-sm translate-x-[18px]" />
              </button>
            </div>
            <p className="text-[10px] text-red-500 mt-1">Gap: DS uses gray-900 track, codebase uses orange or shadcn default</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 34. Slider / Range ──────────────────────────────────────────────────────

function SliderSection() {
  return (
    <Section id="slider" title="Slider / Range Input" desc="Not in design system. 8+ files use sliders for probability, billing windows, time allocation, per diem.">
      <MissingBlock label="Slider / Range" description="Used in ShiftControls, BillingWindowSlider, DailyPerDiemSlider, HourAllocationSlider, Threshold, TimeSlider.">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">Shift probability slider (ShiftControls):</p>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">ST Probability</label>
                <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">65%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div className="absolute h-2 bg-teal-500 rounded-full" style={{ width: "65%" }} />
                <div className="absolute w-4 h-4 bg-white border-2 border-teal-500 rounded-full -top-1 shadow-sm" style={{ left: "calc(65% - 8px)" }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0%</span><span>100%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Hour allocation (ST/OT/DT split):</p>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md">
              <div className="flex gap-0 h-3 rounded-full overflow-hidden">
                <div className="bg-teal-500" style={{ width: "50%" }} />
                <div className="bg-amber-500" style={{ width: "30%" }} />
                <div className="bg-red-500" style={{ width: "20%" }} />
              </div>
              <div className="flex justify-between text-[10px] mt-1.5">
                <span className="text-teal-600">ST: 50%</span>
                <span className="text-amber-600">OT: 30%</span>
                <span className="text-red-600">DT: 20%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Time range slider (TimeSlider.tsx):</p>
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Time Range</label>
                <span className="text-xs text-gray-500">6:00 AM — 6:00 PM</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div className="absolute h-2 bg-blue-500 rounded-full" style={{ left: "25%", width: "50%" }} />
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -top-1 shadow-sm" style={{ left: "calc(25% - 8px)" }} />
                <div className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -top-1 shadow-sm" style={{ left: "calc(75% - 8px)" }} />
              </div>
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 35. Spacing & Shadows ───────────────────────────────────────────────────

function SpacingSection() {
  return (
    <Section id="spacing" title="Spacing, Borders & Shadows" desc="Design system defines 4px grid spacing scale. Codebase uses inconsistent pixel values.">
      <CompareRow
        label="Spacing & Borders"
        status="partial"
        designSystem={
          <div className="space-y-4">
            <p className="text-xs text-gray-500 mb-2">Spacing scale (4px base):</p>
            <div className="space-y-1">
              {[
                { t: "1", px: 4, u: "Icon-text gaps" },
                { t: "2", px: 8, u: "Related elements" },
                { t: "3", px: 12, u: "Filter padding" },
                { t: "4", px: 16, u: "Column gaps" },
                { t: "5", px: 20, u: "Panel padding" },
                { t: "6", px: 24, u: "Page padding" },
              ].map(s => (
                <div key={s.t} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-400 w-4">{s.t}</span>
                  <div className="bg-gray-900 rounded-sm" style={{ width: Math.max(s.px, 2), height: 10 }} />
                  <span className="text-[10px] text-gray-400 w-8">{s.px}px</span>
                  <span className="text-[10px] text-gray-500">{s.u}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 mb-2">Radii + Shadows:</p>
            <div className="flex gap-3 items-end">
              {["rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"].map(r => (
                <div key={r} className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 border-2 border-gray-900 ${r}`} />
                  <span className="text-[9px] text-gray-500">{r}</span>
                </div>
              ))}
            </div>
          </div>
        }
        codebase={
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-2">Codebase token deviations:</p>
            <div className="text-xs space-y-2">
              {[
                { token: "Card padding", ds: "p-3.5 / p-5", cb: "p-6 / px-6 py-4", gap: true },
                { token: "Card radius", ds: "rounded-lg/xl", cb: "rounded-t-[8px]", gap: true },
                { token: "Input height", ds: "py-2 (40px)", cb: "h-9 (36px)", gap: true },
                { token: "Card border", ds: "gray-200", cb: "#E4E6EA", gap: true },
                { token: "Input border", ds: "gray-200", cb: "#D9D9D9", gap: true },
                { token: "Card header", ds: "bg-gray-50", cb: "bg-[#FAFAFC]", gap: true },
                { token: "Section gap", ds: "gap-4", cb: "gap-4", gap: false },
              ].map(t => (
                <div key={t.token} className={`flex items-center justify-between px-3 py-1.5 rounded ${t.gap ? "bg-red-50" : "bg-emerald-50"}`}>
                  <span className="text-gray-700 font-medium">{t.token}</span>
                  <div className="flex gap-3 text-[10px]">
                    <span className="text-gray-500">DS: {t.ds}</span>
                    <span className={t.gap ? "text-red-600 font-medium" : "text-emerald-600"}>App: {t.cb}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </Section>
  );
}

// ─── 36. Charts ──────────────────────────────────────────────────────────────

function ChartsSection() {
  return (
    <Section id="charts" title="Charts & Analytics" desc="DS uses recharts (gray-900 palette). Codebase uses Chart.js + react-chartjs-2 with ST/OT/DT colors.">
      <CompareRow
        label="Chart System"
        status="partial"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">DS (recharts, gray-900 series):</p>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Trend</h4>
              <div className="h-[80px] bg-gray-50 rounded-lg flex items-end gap-2 px-3 pb-3">
                {[40, 55, 48, 72, 65, 82].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-900 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Colors: #111827, #3B82F6, #059669, #D97706, #8B5CF6</p>
          </div>
        }
        codebase={
          <div>
            <p className="text-xs text-gray-500 mb-2">Codebase (Chart.js + react-chartjs-2):</p>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-[14px] font-semibold text-gray-900 mb-3">Profitability</h4>
              <div className="h-[80px] bg-gray-50 rounded-lg flex items-end gap-2 px-3 pb-3">
                {[50, 35, 65, 45, 70, 55].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: ["#4DB6AC", "#FFB74D", "#E57373", "#4DB6AC", "#FFB74D", "#E57373"][i] }} />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-red-500 mt-1">Gap: DS uses recharts + gray, App uses Chart.js + ST/OT/DT colors</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 37. Map Views ───────────────────────────────────────────────────────────

function MapsSection() {
  return (
    <Section id="maps" title="Map Views" desc="DS defines map+sidebar layout with pin types. Codebase uses Google Maps + Leaflet across 6+ pages.">
      <CompareRow
        label="Map Layout"
        status="partial"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">DS map + sidebar with pin types:</p>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden h-[140px] text-xs">
              <div className="w-[120px] border-r border-gray-200 p-2 flex flex-col gap-1">
                {["Crew Alpha", "Crew Beta", "Crew Gamma"].map((c, i) => (
                  <div key={c} className={`px-2 py-1 rounded text-[10px] ${i === 0 ? "bg-blue-50 font-medium" : "text-gray-500"}`}>{c}</div>
                ))}
              </div>
              <div className="flex-1 bg-gray-100 relative">
                <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-md ring-3 ring-blue-200" />
                <div className="absolute top-10 right-8 w-2 h-2 rounded-full bg-amber-500 border-2 border-white" />
                <div className="absolute bottom-6 left-12 w-2 h-2 rounded-full bg-gray-400 border-2 border-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              {[{ l: "Active", c: "bg-emerald-500" }, { l: "En Route", c: "bg-amber-500" }, { l: "Idle", c: "bg-gray-400" }].map(p => (
                <div key={p.l} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${p.c}`} /><span className="text-[10px] text-gray-500">{p.l}</span></div>
              ))}
            </div>
          </div>
        }
        codebase={
          <div>
            <p className="text-xs text-gray-500 mb-2">Google Maps + Leaflet usage:</p>
            <div className="text-xs space-y-1.5">
              {[
                { page: "MapView", lib: "Google Maps" },
                { page: "ContractorMap", lib: "Google Maps" },
                { page: "EquipmentMap", lib: "Google Maps" },
                { page: "RoasterBuilder", lib: "Google Maps" },
                { page: "UnionDetails", lib: "Leaflet" },
              ].map(m => (
                <div key={m.page} className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5">
                  <span className="text-gray-700 font-medium">{m.page}</span>
                  <span className="text-gray-500">{m.lib}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-red-500 mt-2">Gap: DS defines pin types, actual implementations vary per page</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 38. Calendar / Scheduling ───────────────────────────────────────────────

function CalendarSchedulingSection() {
  return (
    <Section id="calendar" title="Calendar / Scheduling" desc="DS has month view + gantt timeline. Codebase uses shadcn Calendar in 11+ files via Popover.">
      <CompareRow
        label="Calendar"
        status="partial"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">DS month view + gantt:</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <ChevronLeft size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">February 2026</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
                <div className="flex gap-1 text-[10px]">
                  <span className="px-1.5 py-0.5 bg-gray-900 text-white rounded">Month</span>
                  <span className="px-1.5 py-0.5 text-gray-500">Week</span>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center">
                {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                  <div key={d} className="text-[9px] text-gray-400 py-1 border-b border-gray-100">{d}</div>
                ))}
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} className="h-8 border-r border-b border-gray-100 p-0.5">
                    <span className="text-[9px] text-gray-500">{i + 1}</span>
                    {i === 2 && <div className="text-[7px] bg-amber-100 text-amber-700 rounded px-0.5 truncate">Storm</div>}
                    {i === 4 && <div className="text-[7px] bg-blue-100 text-blue-700 rounded px-0.5 truncate">Pole</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        codebase={
          <div>
            <p className="text-xs text-gray-500 mb-2">shadcn Calendar in 11+ files:</p>
            <div className="space-y-1.5 text-xs">
              {[
                "CreateRoasterEventModal",
                "CreateEventModal",
                "TollFilters / FuelFilters",
                "CustomInputDate",
                "HolidaySelectionModal",
                "DayRates / Basic invoicing",
              ].map(u => (
                <div key={u} className="flex items-center gap-2 bg-gray-50 rounded px-3 py-1.5">
                  <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{u}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-amber-600 mt-2">DS shows full month+gantt, codebase only uses mini calendar popover</p>
          </div>
        }
      />
    </Section>
  );
}

// ─── 39. Chatbot UI ──────────────────────────────────────────────────────────

function ChatbotSection() {
  return (
    <Section id="chatbot" title="Chatbot UI" desc="Not in design system. Complete chatbot suite in components/chatbot/ — 10 files.">
      <MissingBlock label="Chatbot / AI Chat Widget" description="ChatWidget, ChatMessage, ChatHeader, ChatInput, ChatLauncher, AiChatbot, MessageCitations. Integrated into UnionDetails.">
        <div className="flex items-end gap-4">
          <div className="w-[280px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold">G</div>
                <span className="text-sm font-medium">Gridbase AI</span>
              </div>
              <X size={16} className="text-gray-400" />
            </div>
            <div className="p-3 space-y-3 h-[180px] overflow-y-auto bg-gray-50">
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0 mt-0.5">G</div>
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-xs text-gray-700 border border-gray-200 max-w-[200px]">
                  Hello! I can help with union agreements and rate data.
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="bg-orange-500 text-white rounded-lg rounded-tr-none px-3 py-2 text-xs max-w-[200px]">
                  ST rate for Journeyman Lineman IBEW 1245?
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0 mt-0.5">G</div>
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-xs text-gray-700 border border-gray-200 max-w-[200px]">
                  <strong>$78.25/hr</strong>
                  <div className="mt-1 pt-1 border-t border-gray-100 text-[10px] text-blue-600">Source: CBA 2026</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border-t border-gray-200">
              <input placeholder="Ask anything..." className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg" />
              <button className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                <ChevronRight size={14} className="text-white" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500">Launcher:</p>
            <div className="w-12 h-12 bg-orange-500 rounded-full shadow-lg flex items-center justify-center">
              <HelpCircle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </MissingBlock>
    </Section>
  );
}

// ─── 40. Icons ───────────────────────────────────────────────────────────────

function IconsSection() {
  return (
    <Section id="icons" title="Icons" desc="Both DS and codebase use Lucide React consistently. Size conventions match.">
      <CompareRow
        label="Icon System"
        status="match"
        designSystem={
          <div>
            <p className="text-xs text-gray-500 mb-2">Lucide React size scale:</p>
            <div className="flex gap-4 items-end">
              {[
                { s: 10, l: "10px", d: "Badge" },
                { s: 12, l: "12px", d: "Card" },
                { s: 14, l: "14px", d: "Compact btn" },
                { s: 16, l: "16px", d: "Button" },
                { s: 18, l: "18px", d: "Panel" },
                { s: 24, l: "24px", d: "Empty state" },
              ].map(z => (
                <div key={z.s} className="flex flex-col items-center gap-1">
                  <CheckCircle2 size={z.s} className="text-gray-900" />
                  <span className="text-[9px] text-gray-500">{z.l}</span>
                  <span className="text-[9px] text-gray-400">{z.d}</span>
                </div>
              ))}
            </div>
          </div>
        }
        codebase={
          <div>
            <p className="text-xs text-gray-500 mb-2">Common icon mappings:</p>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { icon: <Plus size={14} />, l: "Add" },
                { icon: <Search size={14} />, l: "Search" },
                { icon: <X size={14} />, l: "Close" },
                { icon: <Calendar size={14} />, l: "Date" },
                { icon: <CheckCircle2 size={14} />, l: "Success" },
                { icon: <AlertTriangle size={14} />, l: "Warning" },
                { icon: <Pencil size={14} />, l: "Edit" },
                { icon: <Trash2 size={14} />, l: "Delete" },
                { icon: <Download size={14} />, l: "Download" },
                { icon: <Upload size={14} />, l: "Upload" },
                { icon: <Eye size={14} />, l: "View" },
                { icon: <MoreHorizontal size={14} />, l: "More" },
                { icon: <Copy size={14} />, l: "Duplicate" },
                { icon: <FileText size={14} />, l: "Document" },
                { icon: <Info size={14} />, l: "Info" },
                { icon: <Loader2 size={14} />, l: "Loading" },
              ].map(item => (
                <div key={item.l} className="flex items-center gap-1.5 p-1.5 rounded border border-gray-100">
                  <span className="text-gray-600">{item.icon}</span>
                  <span className="text-[10px] text-gray-700">{item.l}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </Section>
  );
}
