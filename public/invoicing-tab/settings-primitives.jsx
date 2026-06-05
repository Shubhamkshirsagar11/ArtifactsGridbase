// Shared shell + form primitives used by Admin Settings + Job Settings pages.

// ---------------- Sidebar / chrome ----------------

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M5 6 L16 16 L5 26" stroke="#F26A2A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6 L27 16 L16 26" stroke="#FF884C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
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
  <a href="#" onClick={(e) => e.preventDefault()}
    className={`group flex items-center gap-2.5 h-8 px-2 rounded-md text-[13px] ${
      active ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
    }`}>
    <span className={active ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600'}>{icon}</span>
    <span className="flex-1">{label}</span>
    {trailing}
  </a>
);

const AppSidebar = ({ activeKey }) => (
  <aside className="w-[248px] shrink-0 bg-white border-r border-slate-200 flex flex-col">
    <div className="h-[60px] flex items-center justify-between px-3 border-b border-slate-200">
      <Logo />
      <button className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">
        <IconPanelLeft size={16} />
      </button>
    </div>
    <nav className="flex-1 overflow-y-auto py-3">
      <SidebarSection title="Storm">
        <NavItem icon={<IconBolt size={16}/>}      label="Events" />
        <NavItem icon={<IconClipboard size={16}/>} label="Roster Verification" />
        <NavItem icon={<IconFileText size={16}/>}  label="Invoice" />
        <NavItem icon={<IconClock size={16}/>}     label="Timesheet" />
        <NavItem icon={<IconTicket size={16}/>}    label="Tickets" />
      </SidebarSection>
      <SidebarSection title="Bluesky">
        <NavItem icon={<IconBriefcase size={16}/>} label="Jobs" active={activeKey === 'jobs'} />
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
        <NavItem icon={<IconSettings size={16}/>} label="Settings" active={activeKey === 'settings'} />
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

// Sidebar shown only inside the Settings area — replaces the main app sidebar
// so the user has a focused view of every settings sub-page.
const SettingsSidebar = ({ activeKey }) => (
  <aside className="w-[248px] shrink-0 bg-white border-r border-slate-200 flex flex-col">
    <div className="h-[60px] flex items-center justify-between px-3 border-b border-slate-200">
      <Logo />
      <button className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">
        <IconPanelLeft size={16} />
      </button>
    </div>
    <div className="px-3 pt-3">
      <a href="#" onClick={(e)=>e.preventDefault()} className="flex items-center gap-2 h-8 px-2 rounded-md text-[13px] text-slate-700 hover:bg-slate-100">
        <IconArrowLeft size={15} className="text-slate-500"/>
        Back
      </a>
    </div>
    <nav className="flex-1 overflow-y-auto py-2">
      <SidebarSection title="Account">
        <NavItem icon={<IconBuildingOffice size={16}/>} label="General"  active={activeKey === 'general'} />
        <NavItem icon={<IconUsers size={16}/>}          label="Members"  active={activeKey === 'members'} />
        <NavItem icon={<IconShield size={16}/>}         label="Security" active={activeKey === 'security'} />
      </SidebarSection>
      <SidebarSection title="Configuration">
        <NavItem icon={<IconLayoutGrid size={16}/>}    label="Classifications" active={activeKey === 'classifications'} />
        <NavItem icon={<IconFileText size={16}/>}      label="Templates"       active={activeKey === 'templates'} />
        <NavItem icon={<IconDollarSign size={16}/>}    label="Equipment Costs" active={activeKey === 'equipment-costs'} />
        <NavItem icon={<IconLandmark size={16}/>}      label="Unions"          active={activeKey === 'unions'} />
        <NavItem icon={<IconFileBarChart size={16}/>}  label="Bid Estimate"    active={activeKey === 'bid-estimate'} />
        <NavItem icon={<IconReceipt size={16}/>}       label="Accounting"      active={activeKey === 'accounting'} />
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

// ---------------- Settings page primitives ----------------

// Inline alert callout used inside SettingsSection bodies to surface
// structural validation warnings (e.g. mismatched calendar boundaries).
const InlineAlert = ({ tone = 'amber', title, children }) => {
  const tones = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
  };
  const iconColor = 'text-amber-700';
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${tones[tone]}`}>
      <span className={`mt-0.5 shrink-0 ${iconColor}`}>
        <IconAlertTriangle size={15}/>
      </span>
      <div className="min-w-0 leading-snug">
        {title && <div className="text-[13px] font-semibold mb-0.5">{title}</div>}
        <div className="text-[12.5px] text-amber-800">{children}</div>
      </div>
    </div>
  );
};

const SettingsSection = ({ title, description, locked = false, lockedNote = null, children }) => (
  <section className={`bg-white border border-slate-200 rounded-lg shadow-card ${locked ? 'opacity-95' : ''}`}>
    <header className="px-5 py-4 border-b border-slate-200 bg-slate-50/40 rounded-t-lg">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
            {title}
            {locked && (
              <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                <IconLock size={10}/>
                Coming soon
              </span>
            )}
          </h2>
          {description && <p className="text-[12.5px] text-slate-500 mt-1 leading-snug max-w-[640px]">{description}</p>}
          {locked && lockedNote && (
            <p className="text-[12px] text-slate-500 mt-1.5 leading-snug max-w-[640px]"><span className="text-slate-400">Note —</span> {lockedNote}</p>
          )}
        </div>
      </div>
    </header>
    <div className={`divide-y divide-slate-100 ${locked ? 'pointer-events-none' : ''}`}>
      {children}
    </div>
  </section>
);

// One labeled control row. Label sits left in a fixed column, control is on the right.
// Pass `description` for a small hint under the label.
const SettingRow = ({ label, description, hint, children, locked = false, fullBleed = false }) => (
  <div className={`grid grid-cols-[240px_minmax(0,1fr)] gap-6 px-5 py-4 ${locked ? 'opacity-50' : ''}`}>
    <div className="min-w-0">
      <label className="text-[13px] font-medium text-slate-800 leading-tight block">{label}</label>
      {description && <p className="text-[12px] text-slate-500 mt-1 leading-snug">{description}</p>}
    </div>
    <div className={`min-w-0 ${fullBleed ? '' : 'max-w-[420px]'}`}>
      {children}
      {hint && <p className="text-[11.5px] text-slate-400 mt-1.5 leading-snug">{hint}</p>}
    </div>
  </div>
);

// Segmented option group, vertical (like radio cards). Each option: { value, label, description }.
const OptionCards = ({ value, onChange, options, disabled = false }) => (
  <div className="flex flex-col gap-1.5">
    {options.map((o) => {
      const active = o.value === value;
      return (
        <button
          key={o.value}
          type="button"
          onClick={() => !disabled && onChange(o.value)}
          disabled={disabled}
          className={`text-left flex items-start gap-3 px-3 py-2.5 rounded-md border transition-colors ${
            active
              ? 'bg-brand-50/60 border-brand-200 ring-1 ring-brand-300/40'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full border-2 shrink-0 ${
            active ? 'bg-brand-400 border-brand-500' : 'bg-white border-slate-300'
          }`}>
            {active && <span className="w-1.5 h-1.5 rounded-full bg-white"/>}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-medium text-slate-900">{o.label}</span>
            {o.description && <span className="block text-[12px] text-slate-500 mt-0.5 leading-snug">{o.description}</span>}
          </span>
        </button>
      );
    })}
  </div>
);

const FormField = ({ children, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>
);

// Custom Select wrapper. Defaults to inline-block; pass `block` className override
// (or `w-full`) when it needs to fill a column for things like context panels
// that visually attach below.
const Select = ({ value, onChange, options, disabled = false, className = '', placeholder = 'Select…', fullWidth = false }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  // Normalise into groups for unified render. Flat lists collapse to a single
  // unlabeled group so we don't draw a header for them.
  const isGrouped = Array.isArray(options) && options[0] && typeof options[0] === 'object' && 'group' in options[0];
  const groups = isGrouped
    ? options.map((g) => ({
        label: g.group,
        items: g.items.map((o) => typeof o === 'object' ? o : { value: o, label: o }),
      }))
    : [{ label: null, items: (options || []).map((o) => typeof o === 'object' ? o : { value: o, label: o }) }];

  const totalCount = groups.reduce((s, g) => s + g.items.length, 0);
  const showSearch = totalCount >= 8;

  // Filter by query, but keep group headers when any child matches.
  const q = query.trim().toLowerCase();
  const filtered = q
    ? groups
        .map((g) => ({ ...g, items: g.items.filter((o) => String(o.label).toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0)
    : groups;

  // Flat lookup for the current label
  const allItems = groups.flatMap((g) => g.items);
  const selected = allItems.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'block w-full' : 'inline-block'} ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen((o) => !o); setQuery(''); } }}
        className={`w-full h-9 pl-3 pr-9 text-left text-[13px] rounded-md border bg-white text-slate-900 transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400'
            : 'hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40'
        } ${open ? 'border-brand-400 ring-2 ring-brand-400/30' : 'border-slate-200'}`}
      >
        {selected ? selected.label : <span className="text-slate-400">{placeholder}</span>}
        <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <IconChevronDown size={14}/>
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-40 min-w-full w-max max-w-[360px] bg-white border border-slate-200 rounded-lg shadow-pop py-1 fade-in">
          {showSearch && (
            <div className="px-2 pt-1 pb-1.5 border-b border-slate-100">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <IconSearch size={13}/>
                </span>
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full h-8 pl-7 pr-2 text-[12.5px] bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400"
                />
              </div>
            </div>
          )}

          <div className="max-h-72 overflow-auto py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-[12.5px] text-slate-400">No matches.</div>
            )}
            {filtered.map((g, gi) => (
              <React.Fragment key={g.label || `g-${gi}`}>
                {g.label && (
                  <div className="px-3 pt-1.5 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                    {g.label}
                  </div>
                )}
                {g.items.map((o) => {
                  const isActive = o.value === value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { onChange(o.value); setOpen(false); }}
                      className={`w-full text-left px-3 h-8 flex items-center gap-2 text-[13px] whitespace-nowrap ${
                        isActive ? 'bg-slate-50 text-slate-900 font-medium' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-3.5 inline-flex justify-center shrink-0 text-slate-700">
                        {isActive && (
                          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3.5 8.5 3 3 6-7"/>
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">{o.label}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TextInput = ({ value, onChange, placeholder, disabled = false, type = 'text', className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className={`h-9 px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400/40 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
  />
);

// Native toggle switch.
const Toggle = ({ value, onChange, disabled = false, label = null, description = null }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    role="switch"
    aria-checked={!!value}
    className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${label ? '' : ''}`}
  >
    <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${
      value ? 'bg-brand-400' : 'bg-slate-300'
    } ${disabled ? 'opacity-50' : ''}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
        value ? 'translate-x-4' : 'translate-x-0'
      }`}/>
    </span>
    {label && (
      <span className="text-left">
        <span className="block text-[13px] font-medium text-slate-800">{label}</span>
        {description && <span className="block text-[12px] text-slate-500">{description}</span>}
      </span>
    )}
  </button>
);

const SaveBar = ({ onSave, onDiscard, dirty }) => (
  <div className={`sticky bottom-0 -mx-7 px-7 py-3 bg-brand-50 border-t border-brand-200 flex items-center justify-between transition-opacity ${dirty ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <span className="text-[12.5px] text-brand-700 font-medium">You have unsaved changes.</span>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="md" onClick={onDiscard} className="text-brand-700 hover:bg-brand-100">Discard</Button>
      <Button variant="default" size="md" onClick={onSave}>Save changes</Button>
    </div>
  </div>
);

Object.assign(window, {
  AppSidebar, SettingsSidebar, Logo, SidebarSection, NavItem,
  SettingsSection, SettingRow, InlineAlert,
  OptionCards, FormField, Select, TextInput, Toggle, SaveBar,
});
