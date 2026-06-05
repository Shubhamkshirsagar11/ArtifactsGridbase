// Job → Settings tab — Billing-focused config that overrides company defaults.

const JOB_TABS = ['Overview', 'Crew & Equipment', 'Production', 'Billing', 'Settings'];

const BILLING_CADENCES = [
  { value: 'per-wo',     label: 'Per WO completion',  description: "Each completed work order becomes available to invoice immediately. Best for contracts where the customer invoices on a running basis." },
  { value: 'weekly',     label: 'Weekly',             description: 'A single invoice covers all work orders completed within each calendar week.' },
  { value: 'bimonthly',  label: 'Bi-monthly · 1st & 15th', description: 'Two invoices per month, covering work completed in the first and second halves.' },
  { value: 'monthly',    label: 'Calendar month',     description: 'One invoice per month, covering everything completed that month.' },
  { value: 'custom',     label: 'Custom',             description: 'Pick a start day and cadence length.' },
];

const STATUS_BADGES = {
  Active:      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' },
};
const StatusBadge = ({ status }) => {
  const s = STATUS_BADGES[status] || STATUS_BADGES.Active;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] font-medium ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const JOB = {
  name: 'Wiregrass EMC Distribution',
  shortName: 'Wiregrass 2026',
  contractType: 'Unit-Price',
  status: 'Active',
};

const JobSettings = () => {
  const [original] = React.useState({
    billingCadence: 'per-wo',
    defaultCutoff: 'today',
    autoRetainage: false,
    retainagePct: '0',
    contractNumber: 'WIRE-2026-001',
    contractStart: '2026-01-01',
    contractEnd:   '2026-12-31',
    contractDoc: 'Wiregrass-2026-MSA.pdf',
    costCodePrefix: 'WIRE',
    overrideAccrual: false,
    overrideAccrualCadence: 'weekly-sun-sat',
    suppressAccruals: false,
  });
  const [s, setS] = React.useState(original);
  const dirty = JSON.stringify(s) !== JSON.stringify(original);
  const set = (k, v) => setS((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen flex">
      <AppSidebar activeKey="jobs"/>
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Breadcrumb */}
        <div className="h-[60px] bg-slate-50/40 border-b border-slate-200 flex items-center px-7 text-[13px] text-slate-500">
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Bluesky</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Jobs</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <span className="text-slate-900 font-medium">{JOB.name}</span>
        </div>

        {/* Job header */}
        <div className="pt-7">
          <div className="flex items-start justify-between gap-6 px-7">
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] font-bold tracking-tight text-slate-900 leading-none">{JOB.name}</h1>
              <StatusBadge status={JOB.status}/>
            </div>
          </div>
          {/* Tabs */}
          <div className="mt-5 px-7 border-b border-slate-200">
            <div className="flex items-end gap-7">
              {JOB_TABS.map((tab) => {
                const isActive = tab === 'Settings';
                return (
                  <button key={tab} className={`relative pb-2.5 -mb-px text-[14px] transition-colors ${
                    isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}>
                    {tab}
                    {isActive && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-brand-400 rounded-full"/>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 pt-6 pb-12 flex flex-col gap-6">
          {/* Billing cadence */}
          <SettingsSection
            title="Billing cadence"
            description="How is the customer invoiced under this contract? Drives the Ready to Invoice section on the Billing tab."
          >
            <SettingRow
              label="Cadence"
              description="Set by your contract with the customer."
              fullBleed
            >
              <OptionCards
                value={s.billingCadence}
                onChange={(v) => set('billingCadence', v)}
                options={BILLING_CADENCES}
              />
            </SettingRow>
            {s.billingCadence === 'per-wo' && (
              <SettingRow
                label="Default cutoff"
                description="What completion date does the cutoff filter default to when a biller opens the Billing tab?"
              >
                <Select
                  value={s.defaultCutoff}
                  onChange={(v) => set('defaultCutoff', v)}
                  options={[
                    { value: 'today',   label: 'Today' },
                    { value: 'sat',     label: 'End of current week (Sat)' },
                    { value: 'fri',     label: 'End of current week (Fri)' },
                  ]}
                />
              </SettingRow>
            )}
          </SettingsSection>

          {/* Retainage */}
          <SettingsSection
            title="Retainage"
            description="Some contracts withhold a percentage of each invoice until the job completes. Configure here and Gridbase will subtract it on Mark as invoiced."
          >
            <SettingRow label="Withhold retainage">
              <Toggle
                value={s.autoRetainage}
                onChange={(v) => set('autoRetainage', v)}
                label={s.autoRetainage ? 'On' : 'Off'}
                description={s.autoRetainage ? 'Retainage will be withheld on each invoice' : 'No retainage withheld'}
              />
            </SettingRow>
            {s.autoRetainage && (
              <SettingRow label="Retainage percentage">
                <div className="flex items-center gap-2">
                  <TextInput value={s.retainagePct} onChange={(v) => set('retainagePct', v)} type="number" className="w-24"/>
                  <span className="text-[13px] text-slate-500">%</span>
                </div>
              </SettingRow>
            )}
          </SettingsSection>

          {/* Contract */}
          <SettingsSection
            title="Contract"
            description="Reference info billers and leads use when reconciling invoices."
          >
            <SettingRow label="Contract number">
              <TextInput value={s.contractNumber} onChange={(v) => set('contractNumber', v)} className="w-full"/>
            </SettingRow>
            <SettingRow label="Effective dates">
              <div className="grid grid-cols-2 gap-2">
                <TextInput value={s.contractStart} type="date" onChange={(v) => set('contractStart', v)} className="w-full"/>
                <TextInput value={s.contractEnd}   type="date" onChange={(v) => set('contractEnd', v)}   className="w-full"/>
              </div>
            </SettingRow>
            <SettingRow label="Contract document">
              <div className="flex items-center gap-2 px-3 h-9 border border-slate-200 rounded-md bg-white">
                <IconFileText size={14} className="text-slate-400"/>
                <span className="text-[13px] text-slate-700 truncate flex-1">{s.contractDoc}</span>
                <button className="text-[12px] text-brand-600 hover:underline font-medium">Replace</button>
              </div>
            </SettingRow>
          </SettingsSection>

          {/* Cost coding */}
          <SettingsSection
            title="Cost coding"
            description="Used when exporting WIP and invoice files to your accounting system."
          >
            <SettingRow label="Cost code prefix" description="Prepended to every export line for this job.">
              <TextInput value={s.costCodePrefix} onChange={(v) => set('costCodePrefix', v)} className="w-40"/>
            </SettingRow>
          </SettingsSection>

          {/* Per-job overrides */}
          <SettingsSection
            title="Advanced overrides"
            description="Override company-wide accounting defaults for this job only. Most jobs should leave these off."
            locked
            lockedNote="Per-job accrual overrides are planned for a future release. For now, every job follows the company-wide accrual cadence set in Admin → Settings → Accounting."
          >
            <SettingRow label="Override accrual calendar" locked>
              <Toggle value={false} onChange={() => {}} disabled label="Off" description="Use company-wide cadence: Weekly · Sun – Sat"/>
            </SettingRow>
            <SettingRow label="Suppress accruals on this job" description="One-off jobs (e.g. storm work) that should never be accrued." locked>
              <Toggle value={false} onChange={() => {}} disabled label="Off"/>
            </SettingRow>
          </SettingsSection>

          <SaveBar dirty={dirty} onSave={() => {}} onDiscard={() => {}} />
        </div>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<JobSettings/>);
