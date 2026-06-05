// Admin → Settings → Accounting
// Company-level configuration that drives the Billing tab on every job.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showFiscalActive": false,
  "showCloseLockActive": false,
  "showPermissionsActive": false,
  "showVarianceActive": false
}/*EDITMODE-END*/;

const ACCRUAL_CADENCES = [];  // legacy — replaced by dual-calendar layout

const WEEK_END_DAYS = [
  { value: 'sun', label: 'Sunday' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
];

const FISCAL_MONTH_CLOSE = [
  { group: 'Fixed Calendar Dates', items: [
    { value: 'last', label: 'Last Day of the Month' },
    { value: '15',   label: '15th of the Month' },
    { value: '25',   label: '25th of the Month' },
  ]},
  { group: 'Relative Fiscal Weeks', items: [
    { value: 'last-fri', label: 'Last Friday of the Month' },
    { value: 'last-sat', label: 'Last Saturday of the Month' },
    { value: 'last-sun', label: 'Last Sunday of the Month' },
  ]},
  { group: 'Production & Fiscal Patterns', items: [
    { value: '4-4-5', label: '4-4-5 Fiscal Calendar' },
    { value: '4-5-4', label: '4-5-4 Fiscal Calendar' },
    { value: '5-4-4', label: '5-4-4 Fiscal Calendar' },
  ]},
];

const YEAR_END_MONTHS = [
  { value: 1,  label: 'January' },
  { value: 2,  label: 'February' },
  { value: 3,  label: 'March' },
  { value: 4,  label: 'April' },
  { value: 5,  label: 'May' },
  { value: 6,  label: 'June' },
  { value: 7,  label: 'July' },
  { value: 8,  label: 'August' },
  { value: 9,  label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const ALIGNMENT_RULES = [
  { value: 'last',    label: 'Last Occurrence of Day' },
  { value: 'nearest', label: 'Day Nearest to Month‑End' },
];

const ANCHOR_DAYS = [
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
];

// Patterns that need the year-end anchor follow-up.
const PATTERN_VALUES = new Set(['4-4-5', '4-5-4', '5-4-4']);

const LOCK_DELAY_DAYS = [
  { value: '1', label: '1 Day' },
  { value: '2', label: '2 Days' },
  { value: '3', label: '3 Days' },
  { value: '4', label: '4 Days' },
  { value: '5', label: '5 Days' },
  { value: '6', label: '6 Days' },
  { value: '7', label: '7 Days' },
];

const PROVIDERS = [
  'QuickBooks Online',
  'QuickBooks Desktop',
  'Xero',
  'NetSuite',
  'Sage Intacct',
  'Other / Manual export',
];

const ROLES = ['Owner', 'Admin', 'User', 'Field'];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminAccountingSettings = () => {
  const [original] = React.useState({
    weekEndsOn: 'sat',
    fiscalMonthCloses: '4-4-5',
    yearEndMonth: 12,
    alignmentRule: 'last',
    anchorDay: 'sat',
    enforceCloseLock: false,
    lockDelay: '4',
    provider: 'QuickBooks Online',
    providerOther: '',
    canMarkInvoiced: 'Admin',
    canMarkAccrued: 'Admin',
    trackVariance: false,
    writeUpAccount: '',
    writeOffAccount: '',
    approvalThreshold: '500',
  });
  // Demo state: 4-4-5 calendar with Sun week-end vs Sat anchor day = mismatch.
  const [s, setS] = React.useState({ ...original, weekEndsOn: 'sun', provider: 'Xero' });
  const dirty = JSON.stringify(s) !== JSON.stringify(original);
  const set = (k, v) => setS((prev) => ({ ...prev, [k]: v }));

  // Tweaks let us flip each "Coming soon" section into an interactive preview
  // state so dropdowns/options can be inspected without changing default chrome.
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lockFiscal      = !tw.showFiscalActive;
  const lockCloseLock   = !tw.showCloseLockActive;
  const lockPermissions = !tw.showPermissionsActive;
  const lockVariance    = !tw.showVarianceActive;

  // Mismatch detection — for fiscal-week selections, derive the close day from
  // the fiscal value; for the 4-4-5 family, derive it from the anchor day.
  const FISCAL_DAY = { 'last-sat': 'sat', 'last-fri': 'fri', 'last-sun': 'sun' };
  const DAY_LABEL = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
  const isPattern = PATTERN_VALUES.has(s.fiscalMonthCloses);
  const fiscalDay = isPattern ? s.anchorDay : FISCAL_DAY[s.fiscalMonthCloses];
  const showMismatch = !!fiscalDay && s.weekEndsOn !== fiscalDay;

  // Compute the next N fiscal close dates relative to "today" (May 23 2026)
  // so a biller can verify the cadence matches their actual calendar.
  const upcomingCloseDates = React.useMemo(() => {
    const WEEKDAY_IDX = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    const ANCHOR = new Date(2026, 4, 23); // May 23 2026

    // 4-4-5 family closes are mathematically derived from the year-end anchor.
    // For the demo we hardcode the known-good 2026 4-4-5 dates ending on Saturday.
    // Real implementation would compute weekly buckets from the anchor backward.
    if (PATTERN_VALUES.has(s.fiscalMonthCloses)) {
      // Demo hardcode: matches spec when anchor is Sat + last rule + Dec year-end.
      if (s.fiscalMonthCloses === '4-4-5' && s.anchorDay === 'sat' && s.alignmentRule === 'last' && s.yearEndMonth === 12) {
        return [new Date(2026, 4, 23), new Date(2026, 5, 27), new Date(2026, 6, 25)];
      }
      // Otherwise approximate with last-weekday of each month.
      const lastWeekdayOf = (year, monthIdx, weekdayIdx) => {
        const lastDay = new Date(year, monthIdx + 1, 0);
        const diff = (lastDay.getDay() - weekdayIdx + 7) % 7;
        return new Date(year, monthIdx + 1, 0 - diff);
      };
      const dates = [];
      let y = ANCHOR.getFullYear();
      let m = ANCHOR.getMonth();
      while (dates.length < 3) {
        const d = lastWeekdayOf(y, m, WEEKDAY_IDX[s.anchorDay]);
        if (d >= ANCHOR) dates.push(d);
        m += 1; if (m > 11) { m = 0; y += 1; }
      }
      return dates;
    }

    const lastWeekdayOf = (year, monthIdx, weekdayIdx) => {
      const lastDay = new Date(year, monthIdx + 1, 0);
      const diff = (lastDay.getDay() - weekdayIdx + 7) % 7;
      return new Date(year, monthIdx + 1, 0 - diff);
    };
    const dates = [];
    let y = ANCHOR.getFullYear();
    let m = ANCHOR.getMonth();
    while (dates.length < 3) {
      let d;
      if (s.fiscalMonthCloses === 'last') d = new Date(y, m + 1, 0);
      else if (s.fiscalMonthCloses === '15') d = new Date(y, m, 15);
      else if (s.fiscalMonthCloses === '25') d = new Date(y, m, 25);
      else d = lastWeekdayOf(y, m, WEEKDAY_IDX[FISCAL_DAY[s.fiscalMonthCloses]]);
      if (d >= ANCHOR) dates.push(d);
      m += 1; if (m > 11) { m = 0; y += 1; }
    }
    return dates;
  }, [s.fiscalMonthCloses, s.anchorDay, s.alignmentRule, s.yearEndMonth]);
  const fmtUpcoming = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen flex">
      <SettingsSidebar activeKey="accounting"/>
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Breadcrumb */}
        <div className="h-[60px] bg-slate-50/40 border-b border-slate-200 flex items-center px-7 text-[13px] text-slate-500">
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Main Menu</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Settings</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <span className="text-slate-900 font-medium">Accounting</span>
        </div>

        {/* Header */}
        <div className="pt-7 px-7">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-slate-900 leading-none">Accounting</h1>
              <p className="text-[13px] text-slate-500 mt-2">Configure how Gridbase handles accruals, invoicing, and your accounting system.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 pt-6 pb-12 flex flex-col gap-6">
          {/* Weekly Operational Cycle */}
          <SettingsSection
            title="Weekly Operational Cycle"
            description="Establishes the boundary for weekly field time tracking, unbilled production log summaries, and external accounting system cutoff cycles."
          >
            <SettingRow
              label="Operational Week Ends On"
              description="The last day of the operational work week. Closes at end of day."
            >
              <Select
                value={s.weekEndsOn}
                onChange={(v) => set('weekEndsOn', v)}
                options={WEEK_END_DAYS}
              />
            </SettingRow>
          </SettingsSection>

          {/* External accounting */}
          <SettingsSection
            title="External accounting system"
            description="Used in confirmation copy and to format invoice/WIP exports. Gridbase does not push data directly — billers export files and import them into your accounting system."
          >
            <SettingRow label="Provider">
              <div className="w-full flex flex-col gap-2">
                <Select
                  value={s.provider}
                  onChange={(v) => set('provider', v)}
                  options={PROVIDERS}
                  fullWidth
                />
                {s.provider === 'Other / Manual export' && (
                  <div className="fade-in">
                    <TextInput
                      value={s.providerOther}
                      onChange={(v) => set('providerOther', v)}
                      placeholder="Name your accounting system"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </SettingRow>
          </SettingsSection>

          {/* Fiscal Month-End Cutoff */}
          <SettingsSection
            title="Fiscal Month-End Cutoff"
            description="Drives formal month-end close boundaries, WIP schedule over/under-billing calculations, and monthly bonding reports."
            locked={lockFiscal}
            lockedNote={lockFiscal ? "The default Weekly Operational Cycle configuration above serves as the fallback cutoff boundary for month-end processing in the meantime." : null}
          >
            <SettingRow
              label="Month-End Closing Method"
              description="How the fiscal month is bounded — a fixed calendar day, a recurring day of the week, or a production pattern."
              locked={lockFiscal}
            >
              <div className="w-full">
                <Select
                  value={s.fiscalMonthCloses}
                  onChange={(v) => set('fiscalMonthCloses', v)}
                  options={FISCAL_MONTH_CLOSE}
                  fullWidth
                  disabled={lockFiscal}
                />

                {/* Year-End Month — shown for every selection */}
                <div className="mt-4 fade-in">
                  <div className="mb-1.5">
                    <label className="text-[12.5px] font-semibold text-slate-800">
                      Fiscal Year-End Month<span className="text-rose-500 ml-0.5">*</span>
                    </label>
                  </div>
                  <Select
                    value={s.yearEndMonth}
                    onChange={(v) => set('yearEndMonth', Number(v))}
                    options={YEAR_END_MONTHS}
                    fullWidth
                    disabled={lockFiscal}
                  />
                </div>

                {/* Alignment Rule + Anchor Day — production patterns only */}
                {isPattern && (
                  <div className="mt-4 fade-in flex flex-col gap-4">
                    <div>
                      <div className="mb-1.5">
                        <label className="text-[12.5px] font-semibold text-slate-800">
                          Alignment Rule<span className="text-rose-500 ml-0.5">*</span>
                        </label>
                      </div>
                      <div className={`grid grid-cols-2 bg-slate-100 border border-slate-200 rounded-md p-0.5 w-full ${lockFiscal ? 'opacity-60' : ''}`}>
                        {ALIGNMENT_RULES.map((r) => {
                          const active = r.value === s.alignmentRule;
                          return (
                            <button
                              key={r.value}
                              type="button"
                              disabled={lockFiscal}
                              onClick={() => !lockFiscal && set('alignmentRule', r.value)}
                              className={`min-h-9 px-2 rounded text-[12px] font-medium leading-tight text-center transition-colors ${
                                lockFiscal ? 'cursor-not-allowed' : ''
                              } ${
                                active ? `bg-white shadow-card ${lockFiscal ? 'text-slate-700' : 'text-slate-900'}` : `${lockFiscal ? 'text-slate-500' : 'text-slate-600 hover:text-slate-900'}`
                              }`}
                            >
                              {r.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5">
                        <label className="text-[12.5px] font-semibold text-slate-800">
                          Anchor Day of Week<span className="text-rose-500 ml-0.5">*</span>
                        </label>
                      </div>
                      <Select
                        value={s.anchorDay}
                        onChange={(v) => set('anchorDay', v)}
                        options={ANCHOR_DAYS}
                        fullWidth
                        disabled={lockFiscal}
                      />
                    </div>
                  </div>
                )}
              </div>
            </SettingRow>
          </SettingsSection>

          {/* Enforce close lock + Lock Delay */}
          <SettingsSection
            title="Enforce close lock"
            description="Controls whether data can still be edited after a weekly or monthly period physically ends. Includes a grace period so field crews can catch up on data entry."
            locked={lockCloseLock}
            lockedNote={lockCloseLock ? "Hard locking and grace-period enforcement are planned for a future release. Until then, the Period Closed badge is informational only." : null}
          >
            <SettingRow
              label="Enforce close lock"
              description="When on, work logged in a closed period can't be edited. Display-only for now — Gridbase shows a Period Closed badge but won't block edits."
              hint="We'll enable hard locking in a future release."
              locked={lockCloseLock}
            >
              <Toggle
                value={s.enforceCloseLock}
                onChange={(v) => !lockCloseLock && set('enforceCloseLock', v)}
                disabled={lockCloseLock}
                label={s.enforceCloseLock ? 'Locked after close' : 'Display-only'}
                description={s.enforceCloseLock ? 'Edits to closed periods are blocked' : 'Edits to closed periods are allowed'}
              />
            </SettingRow>
            <SettingRow
              label="Lock Delay (Grace Period)"
              description="Number of days field crews have to input catch-up data after a weekly or monthly period physically ends before the 'Period Closed' badge triggers."
              locked={lockCloseLock}
            >
              <Select
                value={s.lockDelay}
                onChange={(v) => set('lockDelay', v)}
                options={LOCK_DELAY_DAYS}
                disabled={lockCloseLock}
              />
            </SettingRow>
          </SettingsSection>

          {/* Permissions */}
          <SettingsSection
            title="Billing permissions"
            description="Who is allowed to mark work orders invoiced or accrued. Roles cascade — Owners can do anything Admins can; Admins can do anything Users can."
            locked={lockPermissions}
            lockedNote={lockPermissions ? "Role-based permissions for billing actions are coming soon. For now, anyone with access to a job's Billing tab can mark work orders invoiced or accrued." : null}
          >
            <SettingRow label="Can mark as invoiced" description="Moves completed WOs out of Ready to Invoice." locked={lockPermissions}>
              <Select
                value={s.canMarkInvoiced}
                onChange={(v) => set('canMarkInvoiced', v)}
                options={ROLES.filter((r) => r !== 'Field').map((r) => ({ value: r, label: `${r} and above` }))}
                disabled={lockPermissions}
              />
            </SettingRow>
            <SettingRow label="Can mark as accrued" description="Snapshots earned WIP at period close." locked={lockPermissions}>
              <Select
                value={s.canMarkAccrued}
                onChange={(v) => set('canMarkAccrued', v)}
                options={ROLES.filter((r) => r !== 'Field').map((r) => ({ value: r, label: `${r} and above` }))}
                disabled={lockPermissions}
              />
            </SettingRow>
          </SettingsSection>

          {/* Variance tracking — locked for v1 */}
          <SettingsSection
            title="Variance tracking"
            description="Track write-ups and write-offs when the billed amount differs from accruals on the same work order."
            locked={lockVariance}
            lockedNote={lockVariance ? "This feature is planned for a future release. Until then, billers reconcile write-ups and write-offs in your accounting system." : null}
          >
            <SettingRow label="Track write-ups & write-offs" locked={lockVariance}>
              <Toggle value={s.trackVariance} onChange={(v) => set('trackVariance', v)} disabled={lockVariance} label={s.trackVariance ? 'On' : 'Off'} description="Variance lines won't appear on the Invoiced rows"/>
            </SettingRow>
            <SettingRow label="Write-up GL account" locked={lockVariance}>
              <TextInput value={s.writeUpAccount} onChange={(v) => set('writeUpAccount', v)} placeholder="e.g. 4100 · Revenue – Distribution" disabled={lockVariance} className="w-full"/>
            </SettingRow>
            <SettingRow label="Write-off GL account" locked={lockVariance}>
              <TextInput value={s.writeOffAccount} onChange={(v) => set('writeOffAccount', v)} placeholder="e.g. 5900 · Cost variance" disabled={lockVariance} className="w-full"/>
            </SettingRow>
            <SettingRow
              label="Approval threshold"
              description="Write-offs above this amount require lead sign-off before the Mark as invoiced action completes."
              locked={lockVariance}
            >
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-slate-400">$</span>
                <TextInput value={s.approvalThreshold} onChange={(v) => set('approvalThreshold', v)} placeholder="500" disabled={lockVariance} className="w-32"/>
              </div>
            </SettingRow>
          </SettingsSection>

          <SaveBar dirty={dirty} onSave={() => {}} onDiscard={() => {}} />
        </div>

        <TweaksPanel title="Tweaks">
          <TweakSection label="Coming Soon Sections">
            <TweakToggle label="Fiscal Month-End Cutoff" value={tw.showFiscalActive}     onChange={(v) => setTweak('showFiscalActive', v)} />
            <TweakToggle label="Enforce close lock"      value={tw.showCloseLockActive}  onChange={(v) => setTweak('showCloseLockActive', v)} />
            <TweakToggle label="Billing permissions"     value={tw.showPermissionsActive} onChange={(v) => setTweak('showPermissionsActive', v)} />
            <TweakToggle label="Variance tracking"       value={tw.showVarianceActive}   onChange={(v) => setTweak('showVarianceActive', v)} />
          </TweakSection>
        </TweaksPanel>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AdminAccountingSettings/>);
