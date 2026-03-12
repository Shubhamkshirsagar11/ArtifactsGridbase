import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, Filter, X, Clock, AlertTriangle, CheckCircle2,
  DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
  User, MessageSquare, Pencil, Truck, HardHat, Building2, Trophy,
  XCircle, FolderPlus, Copy, Tag, ThumbsDown, LayoutGrid, List,
  FileText, ChevronRight, ChevronLeft, ChevronDown, Eye, Bell,
  Settings, HelpCircle, Home, Briefcase, Users, MapPin, Zap,
  BarChart3, Command, Layers, Maximize2, ArrowRight, Loader2,
  Menu, Monitor, Tablet, Smartphone, PieChart, TrendingDown
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Shared Components ───────────────────────────────────────────────────────

function Section({ title, desc, children }) {
  return (
    <div className="mb-14">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      {desc && <p className="text-sm text-gray-500 mb-6">{desc}</p>}
      {!desc && <div className="mb-6" />}
      {children}
    </div>
  );
}

function Sub({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Code({ children }) {
  return <code className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{children}</code>;
}

function Divider() {
  return <div className="border-t border-gray-100 my-8" />;
}

// ─── Section: Colors ─────────────────────────────────────────────────────────

function ColorsSection() {
  return (
    <>
      <Section title="Color System" desc="Semantic colors — every color carries meaning, not decoration.">
        <Sub title="Neutrals">
          <div className="flex gap-2 flex-wrap">
            {[
              { n: "900", v: "#111827" }, { n: "700", v: "#374151" }, { n: "600", v: "#4B5563" },
              { n: "500", v: "#6B7280" }, { n: "400", v: "#9CA3AF" }, { n: "300", v: "#D1D5DB" },
              { n: "200", v: "#E5E7EB" }, { n: "100", v: "#F3F4F6" }, { n: "50", v: "#F9FAFB" },
            ].map((c) => (
              <div key={c.n} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: c.v }} />
                <span className="text-[10px] font-medium text-gray-600">gray-{c.n}</span>
              </div>
            ))}
          </div>
        </Sub>
        <Sub title="Semantic Status Colors">
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: "Success", desc: "Won, complete, healthy", pri: "#059669", bg: "#ECFDF5", bor: "#A7F3D0" },
              { label: "Warning", desc: "Pending, urgent", pri: "#D97706", bg: "#FFFBEB", bor: "#FDE68A" },
              { label: "Error", desc: "Overdue, lost", pri: "#EF4444", bg: "#FEF2F2", bor: "#FECACA" },
              { label: "Info", desc: "In review, CTA", pri: "#2563EB", bg: "#EFF6FF", bor: "#BFDBFE" },
              { label: "Stage", desc: "Submitted", pri: "#8B5CF6", bg: "#F5F3FF", bor: "#DDD6FE" },
            ].map((g) => (
              <div key={g.label}>
                <p className="text-sm font-medium text-gray-900">{g.label}</p>
                <p className="text-xs text-gray-500 mb-2">{g.desc}</p>
                <div className="flex gap-1">
                  {[g.pri, g.bg, g.bor].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded border border-gray-200" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Sub>
        <Sub title="Project Type Badges">
          <div className="flex gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">T&E</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Veg Mgmt</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Storm</span>
          </div>
        </Sub>
        <Sub title="Dark Sidebar Palette">
          <div className="flex gap-2">
            {[
              { n: "gray-950", v: "#030712" }, { n: "white/5", v: "rgba(255,255,255,0.05)" },
              { n: "white/10", v: "rgba(255,255,255,0.1)" }, { n: "gray-600", v: "#4B5563" },
              { n: "gray-400", v: "#9CA3AF" }, { n: "white", v: "#FFFFFF" },
            ].map((c) => (
              <div key={c.n} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg border border-gray-300" style={{ backgroundColor: c.v }} />
                <span className="text-[10px] font-medium text-gray-600">{c.n}</span>
              </div>
            ))}
          </div>
        </Sub>
      </Section>
    </>
  );
}

// ─── Section: Typography ─────────────────────────────────────────────────────

function TypographySection() {
  const rows = [
    { label: "Page Title", ex: "Bid Pipeline", cls: "text-xl font-semibold text-gray-900" },
    { label: "Page Subtitle", ex: "Manage and track project estimates", cls: "text-sm text-gray-500" },
    { label: "Section Header", ex: "COST BREAKDOWN", cls: "text-xs font-medium text-gray-500 uppercase tracking-wide" },
    { label: "Panel Title", ex: "Duke Energy", cls: "text-lg font-semibold text-gray-900" },
    { label: "KPI Value", ex: "$2.7M", cls: "text-2xl font-semibold text-gray-900 tracking-tight" },
    { label: "KPI Label", ex: "PIPELINE VALUE", cls: "text-xs font-medium text-gray-500 uppercase tracking-wide" },
    { label: "Card Title", ex: "Distribution Line Rebuild", cls: "text-sm font-medium text-gray-900" },
    { label: "Card Desc", ex: "Created estimate from RFP", cls: "text-xs text-gray-500" },
    { label: "Table Header", ex: "Customer", cls: "text-xs font-medium text-gray-500" },
    { label: "Table Cell", ex: "Duke Energy", cls: "text-sm font-medium text-gray-900" },
    { label: "Currency (lg)", ex: "$284,000", cls: "text-2xl font-bold text-gray-900" },
    { label: "Currency (sm)", ex: "$284K", cls: "text-sm font-semibold text-gray-900" },
    { label: "Badge", ex: "T&E", cls: "text-[10px] font-medium text-blue-700" },
    { label: "Timestamp", ex: "Feb 20, 2:30 PM", cls: "text-xs text-gray-400" },
  ];
  return (
    <Section title="Typography" desc="System font stack. Hierarchy through weight and size, not color.">
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex items-baseline justify-between gap-4 px-5 py-3 ${i < rows.length - 1 ? "border-b border-gray-100" : ""}`}>
            <span className="text-xs text-gray-400 w-28 flex-shrink-0">{r.label}</span>
            <span className={`flex-1 ${r.cls}`}>{r.ex}</span>
            <Code>{r.cls.split(" ").slice(0, 3).join(" ")}</Code>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Section: Spacing ────────────────────────────────────────────────────────

function SpacingSection() {
  return (
    <Section title="Spacing, Borders & Shadows" desc="Base unit: 4px. All spacing follows a consistent rhythm.">
      <Sub title="Spacing Scale">
        <div className="space-y-1.5">
          {[
            { t: "0.5", px: 2, u: "Dot indicators" }, { t: "1", px: 4, u: "Icon-text gaps" },
            { t: "1.5", px: 6, u: "Avatar-name" }, { t: "2", px: 8, u: "Related elements" },
            { t: "2.5", px: 10, u: "Card gaps" }, { t: "3", px: 12, u: "Filter padding" },
            { t: "3.5", px: 14, u: "Card padding" }, { t: "4", px: 16, u: "Column gaps" },
            { t: "5", px: 20, u: "Panel padding" }, { t: "6", px: 24, u: "Page padding" },
          ].map((s) => (
            <div key={s.t} className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-500 w-6 text-right">{s.t}</span>
              <div className="bg-gray-900 rounded-sm" style={{ width: Math.max(s.px, 2), height: 14 }} />
              <span className="text-xs text-gray-400 w-8">{s.px}px</span>
              <span className="text-sm text-gray-600">{s.u}</span>
            </div>
          ))}
        </div>
      </Sub>
      <Sub title="Border Radii">
        <div className="flex gap-5 items-end">
          {[
            { l: "rounded", c: "rounded", d: "Badges" },
            { l: "rounded-md", c: "rounded-md", d: "Selects" },
            { l: "rounded-lg", c: "rounded-lg", d: "Cards, buttons" },
            { l: "rounded-xl", c: "rounded-xl", d: "KPI, panels" },
            { l: "rounded-full", c: "rounded-full", d: "Avatars, dots" },
          ].map((r) => (
            <div key={r.l} className="flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 border-2 border-gray-900 ${r.c}`} />
              <span className="text-[10px] font-medium text-gray-700">{r.l}</span>
              <span className="text-[10px] text-gray-400">{r.d}</span>
            </div>
          ))}
        </div>
      </Sub>
      <Sub title="Shadows">
        <div className="flex gap-5 items-end">
          {[
            { l: "None", c: "", d: "Default" },
            { l: "shadow-sm", c: "shadow-sm", d: "Card hover" },
            { l: "shadow-lg", c: "shadow-lg", d: "Dropdowns" },
            { l: "shadow-2xl", c: "shadow-2xl", d: "Panels" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center gap-1.5">
              <div className={`w-16 h-16 bg-white border border-gray-200 rounded-xl ${s.c}`} />
              <span className="text-[10px] font-medium text-gray-700">{s.l}</span>
              <span className="text-[10px] text-gray-400">{s.d}</span>
            </div>
          ))}
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Components ─────────────────────────────────────────────────────

function ComponentsSection() {
  return (
    <Section title="Components" desc="Reusable building blocks with defined variants and states.">
      <Sub title="Buttons">
        <div className="flex flex-wrap gap-3 items-center">
          <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"><Plus size={16} /> Primary</button>
          <button className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"><Copy size={14} /> Secondary</button>
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 transition-colors"><LayoutGrid size={14} /> Ghost</button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"><XCircle size={16} /> Destructive</button>
        </div>
      </Sub>

      <Sub title="Badges & Status">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">T&E</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Veg Mgmt</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Storm</span>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700"><Trophy size={10} /> WON</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600"><XCircle size={10} /> LOST</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">3</span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">11</span>
        </div>
      </Sub>

      <Sub title="Cards">
        <div className="grid grid-cols-3 gap-4">
          {/* Default */}
          <div className="bg-white rounded-lg border border-gray-200 p-3.5">
            <div className="flex justify-between mb-2"><span className="text-sm font-medium text-gray-900">Duke Energy</span><span className="text-sm font-semibold text-gray-900 tabular-nums">$284K</span></div>
            <p className="text-xs text-gray-500 mb-3">T&E – Distribution Line Rebuild</p>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">T&E</span>
              <div className="flex items-center gap-1"><div className="flex gap-0.5">{[1,1,1,1,0].map((f,i)=><div key={i} className={`w-1.5 h-1.5 rounded-full ${f?"bg-gray-800":"bg-gray-200"}`}/>)}</div><span className="text-xs text-gray-500 ml-1">75%</span></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">JM</div><span>Jason</span></div>
              <div className="flex items-center gap-1"><Calendar size={11}/><span>Mar 8</span></div>
            </div>
          </div>
          {/* Urgent */}
          <div className="bg-white rounded-lg border border-amber-200 bg-amber-50/20 p-3.5">
            <div className="flex justify-between mb-2"><span className="text-sm font-medium text-gray-900">AEP Ohio</span><span className="text-sm font-semibold text-gray-900 tabular-nums">$520K</span></div>
            <p className="text-xs text-gray-500 mb-3">Storm Restoration – Ice Event</p>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Storm</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">JM</div><span>Jason</span></div>
              <div className="flex items-center gap-1 text-amber-600"><Calendar size={11}/><span>Mar 1</span></div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium px-2 py-1.5 rounded-md bg-amber-50 text-amber-700"><AlertTriangle size={11}/>Due in 3 days</div>
          </div>
          {/* KPI */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pipeline Value</span><DollarSign size={15} className="text-gray-400"/></div>
            <div className="flex items-baseline gap-2 mt-1"><span className="text-2xl font-semibold text-gray-900 tracking-tight">$2.7M</span><span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600"><ArrowUpRight size={12}/>+12%</span></div>
            <span className="text-xs text-gray-400 mt-0.5">11 active estimates</span>
          </div>
        </div>
      </Sub>

      <Sub title="Status Indicators">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">Stage Dots</p>
            <div className="flex gap-4">
              {[{l:"Draft",c:"bg-gray-400"},{l:"Review",c:"bg-blue-500"},{l:"Submitted",c:"bg-violet-500"},{l:"Decision",c:"bg-amber-500"},{l:"Won",c:"bg-emerald-500"},{l:"Lost",c:"bg-red-400"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${s.c}`}/><span className="text-sm text-gray-600">{s.l}</span></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Win Probability</p>
            <div className="flex gap-6">
              {[0.2,0.4,0.6,0.8,1.0].map(p=>(
                <div key={p} className="flex items-center gap-1">
                  <div className="flex gap-0.5">{Array.from({length:5},(_,i)=><div key={i} className={`w-1.5 h-1.5 rounded-full ${i<Math.round(p*5)?"bg-gray-800":"bg-gray-200"}`}/>)}</div>
                  <span className="text-xs text-gray-500 ml-1">{Math.round(p*100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Progress Bar (Submitted)</p>
            <div className="flex gap-1 max-w-sm">
              {[{l:"Draft",past:true},{l:"Review",past:true},{l:"Submitted",active:true,color:"bg-violet-500"},{l:"Decision"},{l:"Won"}].map(s=>(
                <div key={s.l} className="flex-1">
                  <div className={`h-1.5 rounded-full ${s.active?s.color:s.past?"bg-gray-800":"bg-gray-200"}`}/>
                  <p className={`text-[10px] mt-1.5 ${s.active?"text-gray-900 font-medium":"text-gray-400"}`}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sub>

      <Sub title="Alert Badges">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1.5 rounded-md bg-amber-50 text-amber-700"><AlertTriangle size={11}/>Due in 3 days</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1.5 rounded-md bg-red-50 text-red-600"><AlertTriangle size={11}/>Overdue</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1.5 rounded-md bg-amber-50 text-amber-700"><Clock size={11}/>Awaiting mgr approval</div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1.5 rounded-md bg-blue-50 text-blue-700"><FolderPlus size={11}/>Project not yet created</div>
        </div>
      </Sub>

      <Sub title="Form Inputs">
        <div className="flex gap-4 items-start max-w-lg">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Search</label>
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" placeholder="Search estimates..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none"/></div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Select</label>
            <select className="text-sm border border-gray-200 rounded-md px-2 py-2 bg-white text-gray-700"><option>All Customers</option><option>Duke Energy</option></select>
          </div>
        </div>
      </Sub>

      <Sub title="Avatars">
        <div className="flex gap-5 items-center">
          {[{s:"w-5 h-5",t:"text-[10px]",l:"20px"},{s:"w-8 h-8",t:"text-xs",l:"32px"},{s:"w-10 h-10",t:"text-sm",l:"40px"},{s:"w-12 h-12",t:"text-base",l:"48px"}].map(a=>(
            <div key={a.l} className="flex flex-col items-center gap-1">
              <div className={`${a.s} rounded-full bg-gray-100 flex items-center justify-center ${a.t} font-medium text-gray-600`}>JM</div>
              <span className="text-[10px] text-gray-400">{a.l}</span>
            </div>
          ))}
        </div>
      </Sub>

      <Sub title="Table">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-w-xl">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Customer</th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Stage</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500">Value</th>
            </tr></thead>
            <tbody>
              {[{c:"Duke Energy",s:"Draft",d:"bg-gray-400",v:"$284K"},{c:"AEP Ohio",s:"Submitted",d:"bg-violet-500",v:"$520K"},{c:"FirstEnergy",s:"Won",d:"bg-emerald-500",v:"$145K"}].map((r,i)=>(
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-900">{r.c}</td>
                  <td className="py-3 px-3"><span className="inline-flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${r.d}`}/><span className="text-gray-600">{r.s}</span></span></td>
                  <td className="py-3 px-3 text-right font-medium tabular-nums text-gray-900">{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: App Shell ──────────────────────────────────────────────────────

function AppShellSection() {
  const [activeNav, setActiveNav] = useState("fuel-card");
  const [showCmd, setShowCmd] = useState(false);
  const [expanded, setExpanded] = useState({ estimates: true, unions: false, equipment: true, operations: false });

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const isChildActive = (item) => item.children?.some(c => c.id === activeNav);

  const NavItem = ({ item }) => {
    const hasActiveChild = isChildActive(item);
    const isActive = activeNav === item.id;
    const isExp = expanded[item.id];

    return (
      <div>
        <button
          onClick={() => item.expandable ? toggleExpand(item.id) : setActiveNav(item.id)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
            isActive && !item.expandable ? "bg-gray-100 text-gray-900 font-medium"
            : hasActiveChild ? "text-gray-900 font-medium"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <item.icon size={16} className="flex-shrink-0 text-gray-500" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.expandable && (
            <ChevronRight size={14} className={`text-gray-400 transition-transform duration-200 ${isExp ? "rotate-90" : ""}`} />
          )}
        </button>
        {item.expandable && isExp && (
          <div className="ml-[19px] border-l border-gray-200 pl-3 mt-0.5 mb-1 space-y-0.5">
            {item.children.map(child => (
              <button key={child.id} onClick={() => setActiveNav(child.id)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                  activeNav === child.id ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >{child.label}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const NavGroup = ({ label, items }) => (
    <div className="px-3 py-2">
      <p className="text-xs font-medium text-gray-400 px-2 mb-1.5">{label}</p>
      <div className="space-y-0.5">
        {items.map(item => <NavItem key={item.id} item={item} />)}
      </div>
    </div>
  );

  const platform = [
    { id: "estimates", icon: TrendingUp, label: "Bid Pipeline", expandable: true, children: [
      { id: "pipeline", label: "Estimates" },
      { id: "calculator", label: "Calculator" },
      { id: "rate-tables", label: "Rate Tables" },
    ]},
    { id: "projects", icon: Briefcase, label: "Projects" },
    { id: "work-orders", icon: FileText, label: "Work Orders" },
    { id: "unions", icon: Building2, label: "Unions", expandable: true, children: [
      { id: "agreements", label: "Agreements" },
      { id: "jurisdictional-map", label: "Jurisdictional Map" },
    ]},
    { id: "equipment", icon: Truck, label: "Equipment", expandable: true, children: [
      { id: "equipment-list", label: "Equipment" },
      { id: "fuel-card", label: "Fuel Card" },
      { id: "toll-charges", label: "Toll Charges" },
    ]},
    { id: "crews", icon: Users, label: "Crews" },
  ];

  const ops = [
    { id: "operations", icon: Zap, label: "Events", expandable: true, children: [
      { id: "storm-events", label: "Storm Events" },
      { id: "veg-cycles", label: "Veg Cycles" },
    ]},
    { id: "customers", icon: Building2, label: "Customers" },
    { id: "contractors", icon: HardHat, label: "Contractors" },
  ];

  return (
    <Section title="App Shell" desc={<>Based on <code className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">npx shadcn@latest add sidebar-08</code> \u2014 inset sidebar with secondary navigation.</>}>
      <Sub title="sidebar-08 \u00b7 Inset Variant">
        <div className="bg-gray-100 rounded-2xl p-2" style={{ height: 600 }}>
          <div className="flex h-full bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Sidebar */}
            <div className="w-60 flex flex-col flex-shrink-0 border-r border-gray-100">
              {/* SidebarHeader - Org Switcher */}
              <div className="px-3 pt-3 pb-1">
                <div className="flex items-center gap-2.5 px-2 py-1.5">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">Pike Electric</p>
                    <p className="text-[11px] text-gray-400">Enterprise</p>
                  </div>
                </div>
              </div>
              {/* SidebarContent */}
              <div className="flex-1 overflow-y-auto">
                <NavGroup label="Platform" items={platform} />
                <NavGroup label="Operations" items={ops} />
              </div>
              {/* nav-secondary */}
              <div className="px-3 pb-1">
                {[
                  { icon: HelpCircle, label: "Support" },
                  { icon: MessageSquare, label: "Feedback" },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    <item.icon size={16} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              {/* SidebarFooter - User */}
              <div className="border-t border-gray-100 px-3 py-3">
                <button className="w-full flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 flex-shrink-0">BT</div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate leading-tight">Ben Torres</p>
                    <p className="text-[11px] text-gray-400 truncate">ben@pikeelectric.com</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>
            </div>
            {/* SidebarInset */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="h-12 flex items-center gap-2 px-4 flex-shrink-0">
                <button className="p-1 rounded-md hover:bg-gray-100 text-gray-400"><Menu size={18}/></button>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-gray-400">Resources</span>
                  <ChevronRight size={14} className="text-gray-300" />
                  <span className="text-gray-400">Equipment</span>
                  <ChevronRight size={14} className="text-gray-300" />
                  <span className="text-gray-900 font-medium">Fuel Card</span>
                </div>
              </div>
              <div className="flex-1 p-4 pt-0 overflow-auto">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1,2,3].map(i => <div key={i} className="aspect-video bg-gray-50 rounded-xl" />)}
                </div>
                <div className="bg-gray-50 rounded-xl flex-1" style={{ minHeight: 240 }} />
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Click nav items to see active states. Click "Bid Pipeline" or "Equipment" to expand/collapse. Matches <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded font-mono">sidebar-08</code> layout: muted background \u2192 rounded container \u2192 sidebar + content.</p>
      </Sub>

      <Sub title="shadcn Component Mapping">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">shadcn Primitive</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Gridbase Usage</th>
            </tr></thead>
            <tbody>
              {[
                { p: "SidebarProvider", u: "Wraps entire layout, manages collapse state" },
                { p: 'Sidebar variant=\"inset\"', u: "Sidebar container (light bg, inset in rounded shell)" },
                { p: "SidebarInset", u: "Content area to the right" },
                { p: "SidebarHeader", u: "Org switcher \u2014 Pike Electric + Enterprise tier" },
                { p: "SidebarContent", u: "Scrollable nav area" },
                { p: "SidebarGroup + GroupLabel", u: "Nav sections: Platform, Operations" },
                { p: "SidebarMenu + MenuButton", u: "Nav item \u2014 icon + label + optional chevron" },
                { p: "Collapsible + SidebarMenuSub", u: "Expandable children with tree-line (border-l)" },
                { p: "SidebarMenuSubButton", u: "Child nav items \u2014 text only, no icons" },
                { p: "nav-secondary.tsx", u: "Support + Feedback pinned to bottom" },
                { p: "nav-user.tsx (SidebarFooter)", u: "Avatar + name + email + DropdownMenu" },
                { p: "SidebarTrigger", u: "Hamburger icon in content header" },
                { p: "Separator", u: "Vertical divider after trigger" },
                { p: "Breadcrumb", u: "Resources > Equipment > Fuel Card" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 px-4 font-mono text-xs text-gray-700">{r.p}</td>
                  <td className="py-2.5 px-4 text-gray-600">{r.u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sub>

      <Sub title="Command Palette (\u2318K)">
        {showCmd && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex justify-center pt-[15vh]" onClick={() => setShowCmd(false)}>
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xl h-fit overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200">
                <Search size={18} className="text-gray-400" />
                <input autoFocus type="text" placeholder="Search Gridbase..." className="flex-1 text-base outline-none placeholder-gray-400" />
                <kbd className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">esc</kbd>
              </div>
              <div className="py-2">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">Recent</p>
                {[{icon:FileText,t:"EST-0003 \u00b7 AEP Ohio Storm Restoration"},{icon:Users,t:"Crew Alpha \u00b7 Duke Energy"}].map((r,i)=>(
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer ${i===0?"bg-gray-100 text-gray-900":""}`}>
                    <r.icon size={16} className="text-gray-400"/><span>{r.t}</span>
                  </div>
                ))}
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">Jump To</p>
                {[{icon:TrendingUp,t:"Bid Pipeline"},{icon:FileText,t:"Work Orders"},{icon:Settings,t:"Settings \u2192 Rate Tables"}].map((r,i)=>(
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <r.icon size={16} className="text-gray-400"/><span>{r.t}</span>
                  </div>
                ))}
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-4 pt-3 pb-1">Actions</p>
                {[{icon:Plus,t:"Create new estimate"},{icon:Users,t:"Add crew member"}].map((r,i)=>(
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <r.icon size={16} className="text-gray-400"/><span>{r.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setShowCmd(true)} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Command size={16} /> Open Command Palette
        </button>
        <p className="text-xs text-gray-400 mt-2">Maps to shadcn <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded font-mono">CommandDialog</code> built on <code className="text-[11px] bg-gray-100 px-1 py-0.5 rounded font-mono">cmdk</code>.</p>
      </Sub>
    </Section>
  );
}

// ─── Section: Forms ──────────────────────────────────────────────────────────

function FormsSection() {
  const [step, setStep] = useState(1);
  return (
    <Section title="Multi-Step Forms & Wizards" desc="For complex creation flows — estimates, crew onboarding, event setup.">
      <Sub title="Stepper Pattern">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-0 py-4 px-8 border-b border-gray-200 bg-gray-50/50">
            {[{n:1,l:"Basics"},{n:2,l:"Line Items"},{n:3,l:"Review"}].map((s,i)=>(
              <div key={s.n} className="flex items-center">
                <button onClick={()=>setStep(s.n)} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    s.n<step?"bg-gray-900 text-white":s.n===step?"bg-gray-900 text-white ring-4 ring-gray-200":"bg-gray-200 text-gray-500"
                  }`}>{s.n<step?<CheckCircle2 size={14}/>:s.n}</div>
                  <span className={`text-sm ${s.n<=step?"font-medium text-gray-900":"text-gray-400"}`}>{s.l}</span>
                </button>
                {i<2&&<div className={`w-16 h-px mx-3 ${s.n<step?"bg-gray-900":"bg-gray-200"}`}/>}
              </div>
            ))}
          </div>
          {/* Form content */}
          <div className="max-w-lg mx-auto px-6 py-8">
            {step===1&&(
              <div className="space-y-5">
                <div><h3 className="text-sm font-semibold text-gray-900 mb-1">Project Details</h3><p className="text-xs text-gray-500 mb-4">Basic information about this estimate.</p></div>
                <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Customer <span className="text-red-500">*</span></label><select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"><option>Select customer...</option><option>Duke Energy</option><option>AEP Ohio</option></select></div>
                <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Project Name <span className="text-red-500">*</span></label><input type="text" placeholder="e.g., T&E – Distribution Line Rebuild" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:border-gray-300"/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Type</label><select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"><option>T&E</option><option>Veg Mgmt</option><option>Storm</option></select></div>
                  <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Due Date</label><input type="date" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700"/></div>
                </div>
                <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Notes</label><textarea rows={3} placeholder="Additional context..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 resize-y focus:outline-none"/><p className="text-xs text-gray-400 mt-1">Optional — visible to all team members</p></div>
              </div>
            )}
            {step===2&&(
              <div>
                <div className="mb-4"><h3 className="text-sm font-semibold text-gray-900 mb-1">Labor Classifications</h3><p className="text-xs text-gray-500">Add the crew roles and estimated hours for this bid.</p></div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-2.5 text-xs font-medium text-gray-500">Role</th>
                      <th className="text-right py-2 px-2.5 text-xs font-medium text-gray-500 w-14">Qty</th>
                      <th className="text-right py-2 px-2.5 text-xs font-medium text-gray-500 w-20">Rate/hr</th>
                      <th className="text-right py-2 px-2.5 text-xs font-medium text-gray-500 w-16">Hours</th>
                      <th className="text-right py-2 px-2.5 text-xs font-medium text-gray-500 w-20">Total</th>
                      <th className="w-8"/>
                    </tr></thead>
                    <tbody>
                      {[{r:"General Foreman",q:1,rt:"$92.50",h:320,t:"$29,600"},{r:"Journeyman Lineman",q:4,rt:"$78.25",h:1280,t:"$100,160"}].map((row,i)=>(
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 px-2.5 text-gray-700">{row.r}</td>
                          <td className="py-2 px-2.5 text-right tabular-nums text-gray-600">{row.q}</td>
                          <td className="py-2 px-2.5 text-right tabular-nums text-gray-600">{row.rt}</td>
                          <td className="py-2 px-2.5 text-right tabular-nums text-gray-600">{row.h}</td>
                          <td className="py-2 px-2.5 text-right tabular-nums font-medium text-gray-900">{row.t}</td>
                          <td className="py-2 px-1"><button className="text-gray-300 hover:text-red-500"><X size={14}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors flex items-center justify-center gap-1.5"><Plus size={14}/>Add classification</button>
                </div>
              </div>
            )}
            {step===3&&(
              <div>
                <div className="mb-4"><h3 className="text-sm font-semibold text-gray-900 mb-1">Review Estimate</h3><p className="text-xs text-gray-500">Confirm details before submitting.</p></div>
                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  {[{l:"Customer",v:"Duke Energy"},{l:"Project",v:"T&E – Distribution Line Rebuild"},{l:"Type",v:"T&E"},{l:"Due Date",v:"Mar 15, 2026"},{l:"Labor",v:"$129,760"},{l:"Equipment",v:"$78,000"}].map(r=>(
                    <div key={r.l} className="flex justify-between items-baseline py-1.5 border-b border-gray-200 last:border-0">
                      <span className="text-sm text-gray-500">{r.l}</span>
                      <span className="text-sm font-medium text-gray-900">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-900 text-white rounded-lg p-4 flex justify-between mt-4">
                  <span className="text-sm font-medium">Total Bid</span>
                  <span className="text-lg font-bold tabular-nums">$284,000</span>
                </div>
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-white">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><FileText size={14}/>Save as Draft</button>
            <div className="flex items-center gap-3">
              {step>1&&<button onClick={()=>setStep(step-1)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"><ChevronLeft size={14}/>Back</button>}
              <button onClick={()=>setStep(Math.min(step+1,3))} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                {step===3?"Submit Estimate":"Continue"}<ChevronRight size={14}/>
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Click Continue/Back to navigate between steps.</p>
      </Sub>

      <Sub title="Field Error State">
        <div className="max-w-xs">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Customer <span className="text-red-500">*</span></label>
          <input type="text" value="" className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg bg-white focus:outline-none" readOnly />
          <p className="text-xs text-red-500 mt-1">Customer is required</p>
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Settings ───────────────────────────────────────────────────────

function SettingsSection() {
  const [activeSetting, setActiveSetting] = useState("rates");
  const [editingRow, setEditingRow] = useState(null);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);

  return (
    <Section title="Settings & Config Pages" desc="Rate tables, user management, organization settings.">
      <Sub title="Settings Layout">
        <div className="border border-gray-200 rounded-xl overflow-hidden flex" style={{ height: 420 }}>
          {/* Settings sidebar */}
          <div className="w-48 border-r border-gray-200 bg-gray-50/50 py-4 px-2 flex-shrink-0">
            {[
              {section:"GENERAL",items:[{id:"org",l:"Organization"},{id:"users",l:"Users & Roles"},{id:"notif",l:"Notifications"}]},
              {section:"DATA",items:[{id:"rates",l:"Rate Tables"},{id:"equip",l:"Equipment Rates"},{id:"class",l:"Classifications"}]},
            ].map(g=>(
              <div key={g.section}>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 mt-4 mb-2 first:mt-0">{g.section}</p>
                {g.items.map(item=>(
                  <button key={item.id} onClick={()=>setActiveSetting(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      activeSetting===item.id?"bg-white text-gray-900 font-medium shadow-sm border border-gray-200":"text-gray-600 hover:bg-white hover:text-gray-900"
                    }`}>{item.l}</button>
                ))}
              </div>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1 px-6 py-5 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Rate Tables</h3>
            <p className="text-sm text-gray-500 mb-5">Manage labor rate schedules by collective bargaining agreement.</p>

            <div className="flex items-center justify-between mb-4">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"><option>CBA 2026</option><option>CBA 2025</option></select>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300"><ArrowUpRight size={14}/>Import CSV</button>
                <button className="flex items-center gap-1.5 text-sm text-white bg-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-800"><Plus size={14}/>Add Rate</button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Classification</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Straight</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">OT</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Benefits</th>
                  <th className="w-16"/>
                </tr></thead>
                <tbody>
                  {[{c:"General Foreman",s:"$92.50",o:"$138.75",b:"$34.20"},{c:"Journeyman Lineman",s:"$78.25",o:"$117.38",b:"$34.20"},{c:"Apprentice",s:"$52.00",o:"$78.00",b:"$28.50"},{c:"Groundman",s:"$42.75",o:"$64.13",b:"$28.50"}].map((r,i)=>(
                    <tr key={i} className={`border-b border-gray-100 last:border-0 ${editingRow===i?"bg-blue-50/30":"hover:bg-gray-50"}`}>
                      <td className="py-2.5 px-3 text-gray-700">{r.c}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-gray-900">{editingRow===i?<input className="w-16 border border-blue-300 rounded px-2 py-0.5 text-sm text-right bg-blue-50/30 focus:outline-none" defaultValue={r.s}/>:r.s}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-gray-600">{r.o}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-gray-600">{r.b}</td>
                      <td className="py-2.5 px-2 flex items-center gap-1">
                        {editingRow===i?(
                          <><button onClick={()=>setEditingRow(null)} className="text-emerald-500 hover:text-emerald-600"><CheckCircle2 size={15}/></button><button onClick={()=>setEditingRow(null)} className="text-gray-400 hover:text-gray-600"><X size={15}/></button></>
                        ):(
                          <><button onClick={()=>setEditingRow(i)} className="text-gray-300 hover:text-blue-500"><Pencil size={14}/></button></>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Click the pencil icon on any row to see inline edit mode.</p>
      </Sub>

      <Sub title="Toggle Switches">
        <div className="max-w-sm space-y-0 border border-gray-200 rounded-xl overflow-hidden">
          {[{l:"Email notifications",d:"Receive email updates on bid status changes",on:toggle1,set:setToggle1},{l:"Auto-calculate overtime",d:"Automatically compute OT rates from straight time",on:toggle2,set:setToggle2}].map((t,i)=>(
            <div key={i} className={`flex items-center justify-between py-4 px-5 ${i<1?"border-b border-gray-200":""}`}>
              <div><p className="text-sm font-medium text-gray-900">{t.l}</p><p className="text-xs text-gray-500 mt-0.5">{t.d}</p></div>
              <button onClick={()=>t.set(!t.on)} className={`w-9 h-5 rounded-full transition-colors flex items-center ${t.on?"bg-gray-900":"bg-gray-200"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${t.on?"translate-x-[18px]":"translate-x-[2px]"}`}/>
              </button>
            </div>
          ))}
        </div>
      </Sub>

      <Sub title="User Management Row">
        <div className="border border-gray-200 rounded-xl overflow-hidden max-w-xl">
          <div className="flex items-center gap-3 p-4 hover:bg-gray-50">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">SC</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
              <p className="text-xs text-gray-500">sarah@gridbase.com</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">Estimator</span>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/><span className="text-xs text-gray-500">Active</span></div>
          </div>
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Record Pages ───────────────────────────────────────────────────

function RecordSection() {
  const [tab, setTab] = useState("overview");
  return (
    <Section title="Detail / Record Pages" desc="Full-page views for crews, equipment, work orders, customers, projects.">
      <Sub title="Record Page Layout">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{height:420}}>
          <div className="px-6 pt-5">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"><ChevronLeft size={14}/>Back to Projects</button>
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"><Briefcase size={24} className="text-gray-500"/></div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-2xl font-bold text-gray-900">Duke Energy – Pole Replacement Batch 3</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/>In Progress</span>
                  </div>
                  <p className="text-sm text-gray-500">T&E – Distribution line pole replacement program</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User size={11}/>Jason Martinez</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar size={11}/>Created Feb 5, 2026</span>
                    <span>·</span>
                    <span>PRJ-0042</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium"><Pencil size={14}/>Edit</button>
                <button className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium"><Plus size={14}/>Add Work Order</button>
              </div>
            </div>
            <div className="flex gap-0 mt-6 border-b border-gray-200">
              {[{id:"overview",l:"Overview"},{id:"work-orders",l:"Work Orders",c:12},{id:"crews",l:"Crews",c:3},{id:"documents",l:"Documents",c:8},{id:"history",l:"History"}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-3 text-sm border-b-2 -mb-[1px] transition-colors ${tab===t.id?"font-medium text-gray-900 border-gray-900":"text-gray-400 hover:text-gray-600 border-transparent"}`}>
                  {t.l}{t.c&&<span className="ml-1.5 text-xs bg-gray-100 text-gray-500 rounded-full px-1.5">{t.c}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 py-5 bg-gray-50/50">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[{l:"Contract Value",v:"$342,000"},{l:"Work Orders",v:"12"},{l:"Crew Members",v:"8"}].map(k=>(
                    <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{k.l}</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">{k.v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Recent Activity</h4>
                  {[{icon:FileText,t:"Work order WO-1187 created",u:"Jason Martinez",d:"2 hours ago"},{icon:Users,t:"Crew Beta assigned to WO-1186",u:"Sarah Chen",d:"Yesterday"}].map((a,i)=>(
                    <div key={i} className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"><a.icon size={14} className="text-gray-400"/></div>
                      <div><p className="text-sm text-gray-700">{a.t}</p><p className="text-xs text-gray-400 mt-0.5">{a.u} · {a.d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Details</h4>
                  {[{l:"Customer",v:"Duke Energy"},{l:"Type",v:"T&E"},{l:"Region",v:"Southeast"},{l:"Start Date",v:"Feb 12, 2026"},{l:"Est. Completion",v:"Jun 15, 2026"},{l:"Margin",v:"13%"}].map(r=>(
                    <div key={r.l} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{r.l}</span>
                      <span className="text-sm font-medium text-gray-900">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Analytics ──────────────────────────────────────────────────────

function AnalyticsSection() {
  const lineData = [{m:"Sep",v:180},{m:"Oct",v:220},{m:"Nov",v:195},{m:"Dec",v:310},{m:"Jan",v:280},{m:"Feb",v:340}];
  const barData = [{n:"Duke",v:620},{n:"AEP",v:480},{n:"FE",v:340},{n:"Dom",v:280}];

  return (
    <Section title="Analytics & Charts" desc="Dashboard layouts, chart containers, and data visualization patterns.">
      <Sub title="Chart Containers">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900">Pipeline Trend</h4>
              <select className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-500"><option>Last 6 months</option></select>
            </div>
            <p className="text-xs text-gray-500 mb-4">Monthly pipeline value ($ thousands)</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={lineData}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#111827" stopOpacity={0.15}/><stop offset="95%" stopColor="#111827" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                <XAxis dataKey="m" tick={{fontSize:11,fill:'#9CA3AF'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#9CA3AF'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #E5E7EB'}}/>
                <Area type="monotone" dataKey="v" stroke="#111827" strokeWidth={2} fill="url(#g1)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Revenue by Customer</h4>
            <p className="text-xs text-gray-500 mb-4">YTD contracted value ($ thousands)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                <XAxis dataKey="n" tick={{fontSize:11,fill:'#9CA3AF'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#9CA3AF'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #E5E7EB'}}/>
                <Bar dataKey="v" fill="#111827" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Sub>
      <Sub title="Date Range Selector">
        <div className="flex items-center gap-3 w-fit">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"><option>Last 30 days</option><option>Last 7 days</option><option>This month</option><option>This quarter</option><option>This year</option><option>Custom</option></select>
          <span className="text-xs text-gray-400">Jan 27 – Feb 26, 2026</span>
        </div>
      </Sub>
      <Sub title="Chart Color Sequence">
        <div className="flex gap-2 items-center">
          {["#111827","#3B82F6","#059669","#D97706","#8B5CF6","#EF4444"].map((c,i)=>(
            <div key={i} className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-lg" style={{backgroundColor:c}}/><span className="text-[10px] text-gray-400">{i+1}</span></div>
          ))}
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Maps ───────────────────────────────────────────────────────────

function MapsSection() {
  return (
    <Section title="Map Views" desc="Crew locations, job sites, storm coverage, contractor territories.">
      <Sub title="Map + Sidebar Layout">
        <div className="border border-gray-200 rounded-xl overflow-hidden flex" style={{height:360}}>
          <div className="w-72 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" placeholder="Search crews..." className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none"/></div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[{n:"Crew Alpha",c:"Duke Energy",d:"3 mi",active:true,status:"Active"},{n:"Crew Beta",c:"AEP Ohio",d:"8 mi",active:false,status:"En Route"},{n:"Crew Gamma",c:"FirstEnergy",d:"12 mi",active:false,status:"Idle"}].map((crew,i)=>(
                <div key={i} className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${crew.active?"bg-blue-50 border-l-2 border-l-blue-500":"hover:bg-gray-50"}`}>
                  <div className="flex justify-between mb-0.5"><span className="text-sm font-medium text-gray-900">{crew.n}</span><span className="text-xs text-gray-400">{crew.d}</span></div>
                  <p className="text-xs text-gray-500">{crew.c}</p>
                  <div className="flex items-center gap-1 mt-1.5"><div className={`w-1.5 h-1.5 rounded-full ${crew.status==="Active"?"bg-emerald-500":crew.status==="En Route"?"bg-amber-500":"bg-gray-400"}`}/><span className="text-xs text-gray-500">{crew.status}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-gray-100 relative">
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center gap-2">
              <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-0.5">
                <button className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-900 font-medium">Crews</button>
                <button className="px-2.5 py-1 text-xs rounded-md text-gray-500">Job Sites</button>
              </div>
              <div className="ml-auto flex bg-white border border-gray-200 rounded-lg shadow-sm p-0.5">
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700"><Plus size={14}/></button>
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700"><span className="text-xs">−</span></button>
              </div>
            </div>
            {/* Map placeholder with pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute top-16 left-24 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md ring-4 ring-blue-200"/>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 mt-2 min-w-[180px]">
                    <p className="text-sm font-semibold text-gray-900">Crew Alpha</p>
                    <p className="text-xs text-gray-500 mt-0.5">Duke Energy – WO-4420</p>
                    <div className="flex items-center gap-1 mt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/><span className="text-xs text-gray-600">Active · 3 members</span></div>
                    <p className="text-xs text-blue-600 mt-2 hover:text-blue-700 cursor-pointer">View Details →</p>
                  </div>
                </div>
                <div className="absolute top-32 right-32"><div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm"/></div>
                <div className="absolute bottom-24 left-48"><div className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white shadow-sm"/></div>
                <div className="absolute top-20 right-16"><div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shadow-md">5</div></div>
              </div>
            </div>
          </div>
        </div>
      </Sub>
      <Sub title="Pin Types">
        <div className="flex gap-6 items-center">
          {[{l:"Default",c:"w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"},{l:"Selected",c:"w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md ring-4 ring-blue-200"},{l:"Active",c:"w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"},{l:"En Route",c:"w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm"},{l:"Idle",c:"w-3 h-3 rounded-full bg-gray-400 border-2 border-white shadow-sm"},{l:"Cluster",c:"w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shadow-md"}].map(p=>(
            <div key={p.l} className="flex flex-col items-center gap-2">
              <div className={p.c}>{p.l==="Cluster"?"5":""}</div>
              <span className="text-[10px] text-gray-500">{p.l}</span>
            </div>
          ))}
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Calendar ───────────────────────────────────────────────────────

function CalendarSection() {
  const days = Array.from({length:28},(_,i)=>i+1);
  const events = {3:[{t:"Storm Resp",c:"bg-amber-100 text-amber-700"}],5:[{t:"Pole Replace",c:"bg-blue-100 text-blue-700"},{t:"Veg Mgmt",c:"bg-emerald-100 text-emerald-700"}],6:[{t:"Pole Replace",c:"bg-blue-100 text-blue-700"},{t:"Veg Mgmt",c:"bg-emerald-100 text-emerald-700"}],7:[{t:"Pole Replace",c:"bg-blue-100 text-blue-700"}],12:[{t:"Cable Pull",c:"bg-blue-100 text-blue-700"}],13:[{t:"Cable Pull",c:"bg-blue-100 text-blue-700"}],18:[{t:"Storm Prep",c:"bg-amber-100 text-amber-700"}],19:[{t:"Storm Prep",c:"bg-amber-100 text-amber-700"}],20:[{t:"Storm Prep",c:"bg-amber-100 text-amber-700"}]};

  return (
    <Section title="Calendar & Scheduling" desc="Crew scheduling, event timelines, work order planning.">
      <Sub title="Month View">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><ChevronLeft size={18}/></button>
              <span className="text-lg font-semibold text-gray-900">February 2026</span>
              <button className="p-1 rounded hover:bg-gray-100 text-gray-400"><ChevronRight size={18}/></button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                <button className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-900 font-medium">Month</button>
                <button className="px-2.5 py-1 text-xs rounded-md text-gray-500">Week</button>
                <button className="px-2.5 py-1 text-xs rounded-md text-gray-500">Day</button>
              </div>
              <button className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium"><Plus size={12}/>Event</button>
            </div>
          </div>
          <div className="grid grid-cols-7">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
              <div key={d} className="text-xs font-medium text-gray-500 uppercase text-center py-2 border-b border-gray-200">{d}</div>
            ))}
            {/* Offset for Feb 2026 starting on Sunday — we'll start with 1 empty for simplicity */}
            {[0].map((_,i)=><div key={`e${i}`} className="min-h-[72px] border-r border-b border-gray-100 bg-gray-50/50"/>)}
            {days.map(d=>(
              <div key={d} className="min-h-[72px] border-r border-b border-gray-100 p-1">
                <span className={`text-xs mb-0.5 inline-flex items-center justify-center ${d===26?"w-6 h-6 rounded-full bg-gray-900 text-white font-medium":"text-gray-500"}`}>{d}</span>
                {events[d]?.map((e,i)=>(
                  <div key={i} className={`text-[9px] font-medium px-1 py-0.5 rounded truncate mb-0.5 ${e.c}`}>{e.t}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Sub>
      <Sub title="Timeline / Gantt">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="flex">
            <div className="w-40 flex-shrink-0 border-r border-gray-200">
              <div className="h-8 border-b border-gray-200 bg-gray-50"/>
              {["Crew Alpha","Crew Beta","Crew Gamma"].map(c=>(
                <div key={c} className="h-12 flex items-center px-3 text-sm font-medium text-gray-900 border-b border-gray-100">{c}</div>
              ))}
            </div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex h-8 border-b border-gray-200 bg-gray-50">
                {["Feb 24","Feb 25","Feb 26","Feb 27","Feb 28","Mar 1","Mar 2"].map(d=>(
                  <div key={d} className="flex-1 min-w-[80px] text-xs text-gray-400 text-center py-2 border-r border-gray-100">{d}</div>
                ))}
              </div>
              {[{start:0,len:5,c:"bg-blue-500"},{start:1,len:5,c:"bg-emerald-500"},{start:0,len:3,c:"bg-amber-500"}].map((bar,i)=>(
                <div key={i} className="h-12 flex items-center border-b border-gray-100 relative">
                  <div className={`absolute h-7 rounded-md ${bar.c} opacity-90`} style={{left:`${bar.start*14.28}%`,width:`${bar.len*14.28}%`}}/>
                  {i===0&&<div className="absolute w-px bg-red-400 h-full z-10" style={{left:`${2*14.28+7.14}%`}}/>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2"><div className="w-px h-3 bg-red-400"/><span className="text-[10px] text-red-500">Today marker</span></div>
      </Sub>
    </Section>
  );
}

// ─── Section: States ─────────────────────────────────────────────────────────

function StatesSection() {
  const [showToast, setShowToast] = useState(false);
  return (
    <Section title="Empty, Loading & Error States" desc="Every component needs these three states. Plus toast notifications.">
      <Sub title="Empty States">
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3"><FileText size={24} className="text-gray-400"/></div>
            <p className="text-sm font-medium text-gray-900 mb-1">No estimates yet</p>
            <p className="text-xs text-gray-500 mb-4">Create your first bid estimate to get started.</p>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium"><Plus size={14}/>New Estimate</button>
          </div>
          <div className="border border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
            <p className="text-xs text-gray-400">No estimates in this stage</p>
          </div>
          <div className="border border-gray-200 rounded-xl py-10 flex flex-col items-center text-center">
            <Users size={20} className="text-gray-300 mb-2"/>
            <p className="text-xs text-gray-500">No crew members assigned</p>
            <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">+ Add member</button>
          </div>
        </div>
      </Sub>

      <Sub title="Loading / Skeleton">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3.5 space-y-3">
            <div className="flex justify-between"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"/><div className="h-4 w-12 bg-gray-200 rounded animate-pulse"/></div>
            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse"/>
            <div className="flex gap-2"><div className="h-3 w-10 bg-gray-200 rounded animate-pulse"/><div className="h-3 w-16 bg-gray-100 rounded animate-pulse"/></div>
            <div className="flex justify-between"><div className="flex gap-1.5"><div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"/><div className="h-3 w-12 bg-gray-100 rounded animate-pulse mt-1"/></div><div className="h-3 w-14 bg-gray-100 rounded animate-pulse mt-1"/></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex justify-between"><div className="h-3 w-20 bg-gray-200 rounded animate-pulse"/><div className="w-4 h-4 bg-gray-100 rounded animate-pulse"/></div>
            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"/>
            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse"/>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {[1,2,3].map(i=>(
              <div key={i} className="flex gap-3 px-3 py-3 border-b border-gray-100 last:border-0">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"/>
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"/>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse ml-auto"/>
              </div>
            ))}
          </div>
        </div>
      </Sub>

      <Sub title="Error States">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-3"><AlertTriangle size={24} className="text-red-500"/></div>
            <p className="text-sm font-medium text-gray-900 mb-1">Something went wrong</p>
            <p className="text-xs text-gray-500 mb-4">We couldn't load your estimates. Please try again.</p>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Retry</button>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0"/>
              <div><p className="text-sm text-red-700 font-medium">Failed to save changes</p><p className="text-xs text-red-600 mt-0.5">Rate table update failed. Check your connection and try again.</p></div>
            </div>
          </div>
        </div>
      </Sub>

      <Sub title="Toast Notifications">
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50 space-y-2" style={{animation:"slideInRight 0.2s ease-out"}}>
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-start gap-3 min-w-[320px]">
              <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5"/>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">Estimate saved</p><p className="text-xs text-gray-500 mt-0.5">EST-0003 has been saved as a draft.</p></div>
              <button onClick={()=>setShowToast(false)} className="text-gray-400 hover:text-gray-600"><X size={14}/></button>
            </div>
            <div className="bg-white border border-red-200 rounded-xl shadow-lg p-4 flex items-start gap-3 min-w-[320px]">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5"/>
              <div className="flex-1"><p className="text-sm font-medium text-gray-900">Failed to delete</p><p className="text-xs text-gray-500 mt-0.5">Could not remove rate. Please try again.</p></div>
              <button onClick={()=>setShowToast(false)} className="text-gray-400 hover:text-gray-600"><X size={14}/></button>
            </div>
          </div>
        )}
        <button onClick={()=>{setShowToast(true);setTimeout(()=>setShowToast(false),4000)}} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"><Bell size={16}/>Show Toast Notifications</button>
        <p className="text-xs text-gray-400 mt-2">Auto-dismiss after 4 seconds.</p>
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      </Sub>
    </Section>
  );
}

// ─── Section: Responsive ─────────────────────────────────────────────────────

function ResponsiveSection() {
  return (
    <Section title="Responsive Behavior" desc="Breakpoint strategy and component adaptation rules.">
      <Sub title="Breakpoints">
        <div className="flex gap-4">
          {[{icon:Monitor,l:"Desktop",w:"≥1280px",d:"Full layout, expanded sidebar"},{icon:Tablet,l:"Tablet",w:"768–1279px",d:"Collapsed sidebar, stacked KPIs"},{icon:Smartphone,l:"Mobile",w:"<768px",d:"Hamburger menu, single column"}].map(b=>(
            <div key={b.l} className="flex-1 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><b.icon size={18} className="text-gray-500"/><span className="text-sm font-semibold text-gray-900">{b.l}</span></div>
              <p className="text-xs text-gray-400 mb-1">{b.w}</p>
              <p className="text-sm text-gray-600">{b.d}</p>
            </div>
          ))}
        </div>
      </Sub>
      <Sub title="Table → Card Collapse (Mobile)">
        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <p className="text-xs text-gray-400 mb-2">Desktop: Table Row</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center text-sm px-3 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500"><span className="w-28">Customer</span><span className="w-16">Stage</span><span className="w-14 text-right">Value</span><span className="w-16 text-right">Owner</span></div>
              <div className="flex items-center text-sm px-3 py-3"><span className="w-28 font-medium text-gray-900">Duke Energy</span><span className="w-16 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"/>Draft</span><span className="w-14 text-right tabular-nums font-medium">$284K</span><span className="w-16 text-right text-gray-500">Jason</span></div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Mobile: Card</p>
            <div className="border border-gray-200 rounded-lg p-3 max-w-[240px]">
              <div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-900">Duke Energy</span><span className="text-sm font-semibold tabular-nums">$284K</span></div>
              <div className="flex items-center gap-2 text-xs text-gray-500"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"/>Draft</span><span>·</span><span>Jason</span><span>·</span><span>Mar 8</span></div>
            </div>
          </div>
        </div>
      </Sub>
    </Section>
  );
}

// ─── Section: Icons ──────────────────────────────────────────────────────────

function IconsSection() {
  return (
    <Section title="Icons" desc="Lucide React library. Consistent sizing by context.">
      <Sub title="Size Scale">
        <div className="flex gap-6 items-end">
          {[{s:10,l:"10–11px",d:"Badge"},{s:12,l:"12px",d:"Card inline"},{s:14,l:"14px",d:"Compact btn"},{s:15,l:"15px",d:"KPI"},{s:16,l:"16px",d:"Button"},{s:18,l:"18–20px",d:"Panel"}].map(z=>(
            <div key={z.s} className="flex flex-col items-center gap-1.5"><CheckCircle2 size={z.s} className="text-gray-900"/><span className="text-[10px] font-medium text-gray-700">{z.l}</span><span className="text-[10px] text-gray-400">{z.d}</span></div>
          ))}
        </div>
      </Sub>
      <Sub title="Icon Mappings">
        <div className="grid grid-cols-4 gap-2">
          {[
            {i:Plus,l:"Add"},{i:Search,l:"Search"},{i:Filter,l:"Filter"},{i:X,l:"Close"},
            {i:Calendar,l:"Date"},{i:User,l:"User"},{i:DollarSign,l:"Money"},{i:TrendingUp,l:"Trending"},
            {i:Clock,l:"Time"},{i:CheckCircle2,l:"Success"},{i:AlertTriangle,l:"Warning"},{i:XCircle,l:"Error"},
            {i:Trophy,l:"Won"},{i:Pencil,l:"Edit"},{i:MessageSquare,l:"Comment"},{i:ChevronRight,l:"Navigate"},
            {i:FileText,l:"Document"},{i:Truck,l:"Equipment"},{i:HardHat,l:"Labor"},{i:Building2,l:"Building"},
            {i:Copy,l:"Duplicate"},{i:FolderPlus,l:"New Project"},{i:LayoutGrid,l:"Board"},{i:List,l:"Table"},
          ].map(item=>(
            <div key={item.l} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-gray-200">
              <item.i size={16} className="text-gray-600 flex-shrink-0"/><span className="text-xs text-gray-700">{item.l}</span>
            </div>
          ))}
        </div>
      </Sub>
    </Section>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "colors", label: "Colors", comp: ColorsSection },
  { id: "typography", label: "Type", comp: TypographySection },
  { id: "spacing", label: "Spacing", comp: SpacingSection },
  { id: "components", label: "Components", comp: ComponentsSection },
  { id: "app-shell", label: "App Shell", comp: AppShellSection },
  { id: "forms", label: "Forms", comp: FormsSection },
  { id: "settings", label: "Settings", comp: SettingsSection },
  { id: "records", label: "Records", comp: RecordSection },
  { id: "analytics", label: "Analytics", comp: AnalyticsSection },
  { id: "maps", label: "Maps", comp: MapsSection },
  { id: "calendar", label: "Calendar", comp: CalendarSection },
  { id: "states", label: "States", comp: StatesSection },
  { id: "responsive", label: "Responsive", comp: ResponsiveSection },
  { id: "icons", label: "Icons", comp: IconsSection },
];

export default function DesignSystem() {
  const [active, setActive] = useState("colors");
  const ActiveComp = SECTIONS.find(s => s.id === active)?.comp || ColorsSection;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Gridbase Design System</h1>
                <p className="text-xs text-gray-500">Interactive visual reference — all 17 sections</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/gridbase-design-system";
                  }}
                  className="px-2.5 py-1 rounded-full bg-white text-gray-900 font-medium shadow-sm"
                >
                  Design System
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/gridbase-design-system-audit";
                  }}
                  className="px-2.5 py-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  Audit View
                </button>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">v2.0</span>
            </div>
          </div>
          <div className="flex gap-0.5 overflow-x-auto pb-0.5">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`px-2.5 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap ${
                  active === s.id ? "bg-gray-900 text-white font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ActiveComp />
      </div>
    </div>
  );
}
