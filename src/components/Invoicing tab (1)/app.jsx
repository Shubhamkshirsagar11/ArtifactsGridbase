// App shell: sidebar + breadcrumb bar + job header + tabs + invoicing content

// ----- Sidebar -----

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M5 6 L16 16 L5 26" stroke="#F26A2A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6 L27 16 L16 26" stroke="#FF884D" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div className="leading-tight">
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-bold tracking-tight text-slate-900">Gridbase</span>
        <span className="text-[9.5px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded px-1 py-0.5 uppercase tracking-wider">Beta</span>
      </div>
      <div className="text-[12px] text-slate-500 -mt-0.5 flex items-center gap-1">
        PowerGrid Services
        <IconChevronDown size={11} className="text-slate-400"/>
      </div>
    </div>
  </div>
);

const SidebarSection = ({ title, children }) => (
  <div className="px-3 mt-4 first:mt-0">
    <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">{title}</div>
    <div className="flex flex-col gap-0.5">{children}</div>
  </div>
);
const NavItem = ({ icon, label, active = false, trailing = null }) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    className={`group flex items-center gap-2.5 h-8 px-2 rounded-md text-[13px] ${
      active ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
    }`}
  >
    <span className={active ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600'}>{icon}</span>
    <span className="flex-1">{label}</span>
    {trailing}
  </a>
);

const Sidebar = () => (
  <aside className="w-[248px] shrink-0 bg-white border-r border-slate-200 flex flex-col">
    <div className="h-[60px] flex items-center justify-between px-3 border-b border-slate-200">
      <Logo />
      <button className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">
        <IconPanelLeft size={16} />
      </button>
    </div>
    <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
      <SidebarSection title="Storm">
        <NavItem icon={<IconBolt size={16}/>}      label="Events" />
        <NavItem icon={<IconClipboard size={16}/>} label="Roster Verification" />
        <NavItem icon={<IconFileText size={16}/>}  label="Invoice" />
        <NavItem icon={<IconClock size={16}/>}     label="Timesheet" />
        <NavItem icon={<IconTicket size={16}/>}    label="Tickets" />
      </SidebarSection>
      <SidebarSection title="Bluesky">
        <NavItem icon={<IconBriefcase size={16}/>} label="Jobs" active />
        <NavItem icon={<IconBookOpen size={16}/>}  label="Unit Libraries" />
      </SidebarSection>
      <SidebarSection title="Data">
        <NavItem icon={<IconLandmark size={16}/>}  label="Unions"        trailing={<IconChevronRight size={13} className="text-slate-400"/>} />
        <NavItem icon={<IconBuilding size={16}/>}  label="Organizations" trailing={<IconChevronRight size={13} className="text-slate-400"/>} />
        <NavItem icon={<IconTruck size={16}/>}     label="Equipment"     trailing={<IconChevronRight size={13} className="text-slate-400"/>} />
      </SidebarSection>
      <SidebarSection title="Tools">
        <NavItem icon={<IconCalculator size={16}/>}    label="Calculators" />
        <NavItem icon={<IconFileBarChart size={16}/>}  label="Bid Estimates" />
      </SidebarSection>
      <SidebarSection title="Settings">
        <NavItem icon={<IconSettings size={16}/>} label="Settings" />
      </SidebarSection>
    </nav>
    <div className="border-t border-slate-200 p-3 flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-[12px] font-semibold inline-flex items-center justify-center relative">
        BG
        <span className="absolute -bottom-0 -right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </span>
      <div className="leading-tight min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-slate-900">Ben Glatt</div>
        <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Owner</div>
      </div>
      <button className="text-slate-400 hover:text-slate-700 -mr-1">
        <IconChevronUpDown size={14}/>
      </button>
    </div>
  </aside>
);

// ----- Top breadcrumb bar -----

const Breadcrumb = () => {
  // Pull the same TODAY constant the rest of the page uses so the demo-date
  // chip stays in lockstep with the Period Open/Closed badges.
  const todayLabel = (() => {
    const [y, m, d] = TODAY.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  })();
  return (
    <div className="h-[60px] bg-slate-50/40 border-b border-slate-200 flex items-center px-7 text-[13px] text-slate-500 backdrop-blur-sm">
      <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Bluesky</a>
      <IconChevronRight size={14} className="mx-2 text-slate-300"/>
      <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Jobs</a>
      <IconChevronRight size={14} className="mx-2 text-slate-300"/>
      <span className="text-slate-900 font-medium">{JOB.name}</span>
      <div className="flex-1"/>
      <Tooltip
        content="This mock locks today's date so the Period Open/Closed badges and the 'May change until' captions stay consistent across the page. Real users see the actual current date."
        side="bottom"
        align="end"
        maxWidth={320}
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[12px] text-slate-600 cursor-help shadow-card">
          <IconCalendar size={12} className="text-slate-400"/>
          <span className="tabular">Demo date · {todayLabel}</span>
        </span>
      </Tooltip>
    </div>
  );
};

// ----- Job header + tabs (chrome around the tab content) -----

const TABS = ['Overview', 'Crew & Equipment', 'Production', 'Billing', 'Settings'];
const SOON = { 'Settings': true };

const JobHeader = ({ activeTab, onTab }) => (
  <div className="pt-7">
    <div className="flex items-start justify-between gap-6 px-7">
      <div className="flex items-center gap-3">
        <h1 className="text-[26px] font-bold tracking-tight text-slate-900 leading-none">{JOB.name}</h1>
        <StatusBadge status={JOB.status} />
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 bg-white">
          <IconChevronDown size={14}/>
        </button>
      </div>
    </div>

    {/* Tabs */}
    <div className="mt-5 px-7 border-b border-slate-200">
      <div className="flex items-end gap-7">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          const isSoon = SOON[tab];
          return (
            <button
              key={tab}
              onClick={() => !isSoon && onTab(tab)}
              className={`relative pb-2.5 -mb-px flex items-center gap-1.5 text-[14px] transition-colors
                ${isActive ? 'text-slate-900 font-semibold' : isSoon ? 'text-slate-400 cursor-default' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {tab}
              {isSoon && (
                <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">Soon</span>
              )}
              {isActive && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-brand-400 rounded-full"/>}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

// ----- Main app -----

const JobDetailPage = () => {
  const [tab, setTab] = React.useState('Billing');
  return (
    <div className="min-h-screen flex">
      <Sidebar/>
      <main className="flex-1 min-w-0 flex flex-col">
        <Breadcrumb/>
        <JobHeader activeTab={tab} onTab={setTab}/>
        <div className="flex-1 px-7 pt-6">
          {tab === 'Billing' ? <InvoicingTab/> : <PlaceholderTab tab={tab}/>}
        </div>
      </main>
    </div>
  );
};

const PlaceholderTab = ({ tab }) => (
  <Card className="p-10 flex flex-col items-center text-center text-slate-500">
    <span className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 inline-flex items-center justify-center mb-2"><IconInbox size={18}/></span>
    <div className="text-[14px] font-semibold text-slate-700">{tab}</div>
    <div className="text-[12.5px] mt-1">Not the focus of this build — the Billing tab is the active design.</div>
  </Card>
);
const IconInbox = IconInboxEmpty;

// ----- Mount -----

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <JobDetailPage/>
  </ToastProvider>
);
