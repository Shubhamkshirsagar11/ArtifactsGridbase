// Contract Wizard — Step 4: Billing & Terms
// Refactor of the existing "Payment" step that adds Billing Trigger,
// invoicing cadence, and a conditional Billing Cycle Anchor.
//
// Tweaks panel exposes a "Preset" picker (Units / T&E / Storm / Free) so a
// reviewer can flip between the three demonstration states from the spec.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "preset": "units",
  "contractType": "Units",
  "companyCalendarSet": true
}/*EDITMODE-END*/;

// ---------------- Wizard config ----------------

const WIZARD_STEPS = [
  { id: 'basics',  label: 'Contract Setup',  done: true  },
  { id: 'rates',   label: 'Rates',           done: true  },
  { id: 'rules',   label: 'Cost & Scope Controls',   done: true  },
  { id: 'terms',   label: 'Billing & Terms', done: false },
  { id: 'review',  label: 'Review',          done: false },
];

const CONTRACT_TYPES = ['Units', 'T&E', 'Lump Sum', 'Storm'];

const CONTRACT_TYPE_COPY = {
  'Units':    'Customers are billed per completed work-order CUs at the unit-price rate sheet.',
  'T&E':      'Customers are billed for time worked plus equipment hours.',
  'Lump Sum': 'Customers are billed at fixed milestones tied to deliverables.',
  'Storm':    'Customers are billed once per storm event, on completion.',
};

// Trigger options vary by contract type. "Progress / Earned Units (WIP)" is
// always present but disabled for v1.
const TRIGGER_OPTIONS = (ct) => {
  if (ct === 'Storm') {
    return [
      { value: 'storm-complete', label: 'Upon Storm Event Completion' },
      { value: 'cumulative',    label: 'Cumulative Value Threshold', comingSoon: true },
      { value: 'wip',           label: 'Completed Unit Progress', comingSoon: true },
    ];
  }
  if (ct === 'Lump Sum') {
    return [
      { value: 'milestone',     label: 'Upon Milestone Completion' },
      { value: 'wo-complete',   label: 'Upon Work Order Completion' },
      { value: 'cumulative',    label: 'Cumulative Value Threshold', comingSoon: true },
      { value: 'wip',           label: 'Completed Unit Progress', comingSoon: true },
    ];
  }
  return [
    { value: 'wo-complete',     label: 'Upon Work Order Completion' },
    { value: 'cumulative',      label: 'Cumulative Value Threshold', comingSoon: true },
    { value: 'wip',             label: 'Completed Unit Progress', comingSoon: true },
  ];
};

const CADENCE_OPTIONS = [
  { value: 'realtime', label: 'Real-time (As it happens)', comingSoon: true },
  { value: 'weekly',   label: 'Weekly Batch' },
  { value: 'monthly',  label: 'Monthly Batch', comingSoon: true },
];

// Threshold-aware cadence options used when "Cumulative Value Threshold" is
// the active trigger — every option is gated by whether the threshold has
// been met yet.
const THRESHOLD_CADENCE_OPTIONS = [
  { value: 'immediate', label: 'Immediate (As soon as threshold is met)' },
  { value: 'weekly',    label: 'Weekly Batch (If threshold is met)' },
  { value: 'monthly',   label: 'Monthly Batch (If threshold is met)', comingSoon: true },
];

const ELIGIBILITY_BASIS_OPTIONS = [
  { value: 'wo-complete', label: 'Completed Work Orders' },
  { value: 'cu-progress', label: 'Approved Production Progress (CUs)' },
];

const PAYMENT_TERM_OPTIONS = [
  { value: 'due-on-receipt', label: 'Due on Receipt' },
  { value: 'net-15',         label: 'Net 15' },
  { value: 'net-30',         label: 'Net 30' },
  { value: 'net-45',         label: 'Net 45' },
  { value: 'net-60',         label: 'Net 60' },
  { value: 'net-90',         label: 'Net 90' },
];

const DAY_OPTIONS = [
  { value: 'sun', label: 'Sunday' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
];

const MONTHLY_ANCHOR_OPTIONS = [
  { value: '1',    label: '1st of the month' },
  { value: '15',   label: '15th of the month' },
  { value: 'last', label: 'Last day of the month' },
];

// ---- Preset states from the spec ----
const PRESETS = {
  units: {
    contractType: 'Units',
    // Spec wants Progress/WIP shown selected for State A, but that option is
    // visually disabled. We default to WO Completion so the picker remains
    // valid and call out WIP separately in the disabled option styling.
    trigger:         'wo-complete',
    cadence:         'weekly',
    matchCalendar:   true,
    periodStartDay:  'sun',
    monthlyAnchor:   '1',
    paymentTerms:    'net-30',
    retainage:       '10',
    thresholdAmount: '',
    eligibilityBasis: 'wo-complete',
    manualOverride:  false,
  },
  te: {
    contractType:    'T&E',
    trigger:         'wo-complete',
    cadence:         'weekly',
    matchCalendar:   false,
    periodStartDay:  'mon',
    monthlyAnchor:   '15',
    paymentTerms:    'net-15',
    retainage:       '5',
    thresholdAmount: '',
    eligibilityBasis: 'wo-complete',
    manualOverride:  false,
  },
  storm: {
    contractType:    'Storm',
    trigger:         'storm-complete',
    cadence:         'realtime',
    matchCalendar:   true,
    periodStartDay:  'sun',
    monthlyAnchor:   '1',
    paymentTerms:    'due-on-receipt',
    retainage:       '0',
    thresholdAmount: '',
    eligibilityBasis: 'wo-complete',
    manualOverride:  false,
  },
};

// ---------------- UI primitives specific to this wizard ----------------

const RequiredStar = () => <span className="text-rose-500 ml-0.5">*</span>;

// Rounded dropdown matching the existing app aesthetic (rounded-lg, light bg).
const WizardSelect = ({ value, onChange, options, placeholder, disabled = false }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const opts = options.map((o) => typeof o === 'object' ? o : { value: o, label: o });
  const selected = opts.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full h-11 px-4 pr-10 text-left text-[14px] rounded-lg border bg-white text-slate-900 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'
        } ${open ? 'border-brand-400 ring-2 ring-brand-400/30' : 'border-slate-200'}`}
      >
        {selected ? selected.label : <span className="text-slate-400">{placeholder || 'Select…'}</span>}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <IconChevronDown size={16}/>
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 bg-white border border-slate-200 rounded-lg shadow-pop py-1 fade-in max-h-72 overflow-auto">
          {opts.map((o) => {
            const isActive = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                disabled={o.comingSoon}
                onClick={() => {
                  if (o.comingSoon) return;
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 h-10 flex items-center gap-2 text-[14px] ${
                  o.comingSoon
                    ? 'text-slate-400 cursor-not-allowed'
                    : isActive
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {o.comingSoon && (
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    Coming soon
                  </span>
                )}
                {isActive && !o.comingSoon && (
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 8.5 3 3 6-7"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const WizardInput = ({ value, onChange, placeholder, suffix, type = 'text' }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-4 pr-10 text-[14px] rounded-lg border border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 transition-colors"
    />
    {suffix && (
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[14px] pointer-events-none">
        {suffix}
      </span>
    )}
  </div>
);

const WizardCheckbox = ({ value, onChange, label, disabled = false }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    className="inline-flex items-start gap-2.5 group text-left"
  >
    <span className={`mt-0.5 inline-flex items-center justify-center w-[18px] h-[18px] rounded border-2 transition-colors shrink-0 ${
      value
        ? 'bg-brand-400 border-brand-500'
        : 'bg-white border-slate-300 group-hover:border-slate-400'
    } ${disabled ? 'opacity-50' : ''}`}>
      {value && (
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3.5 8.5 3 3 6-7"/>
        </svg>
      )}
    </span>
    <span className="text-[14px] text-slate-800 leading-snug">{label}</span>
  </button>
);

// FieldLabel + helper text — matches the dark-bold-label style from the screenshot.
const FieldLabel = ({ children, required = false, helper = null }) => (
  <div className="mb-2">
    <label className="text-[13.5px] font-semibold text-slate-900 leading-tight">
      {children}
      {required && <RequiredStar/>}
    </label>
    {helper && <p className="text-[12.5px] text-slate-500 mt-0.5 leading-snug">{helper}</p>}
  </div>
);

// ---------------- Wizard step indicator ----------------

const StepperDot = ({ step, idx, active }) => {
  const number = idx + 1;
  if (step.done) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white shrink-0">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3.5 8.5 3 3 6-7"/>
        </svg>
      </span>
    );
  }
  if (active) {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-[12px] font-semibold shrink-0 tabular">
        {number}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 border-slate-200 text-slate-400 text-[12px] font-semibold shrink-0 tabular">
      {number}
    </span>
  );
};

const Stepper = ({ activeId }) => (
  <div className="flex items-center justify-center gap-1 px-7 py-6 border-b border-slate-100">
    {WIZARD_STEPS.map((step, i) => {
      const isActive = step.id === activeId;
      return (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2.5">
            <StepperDot step={step} idx={i} active={isActive}/>
            <span className={`text-[14px] ${
              isActive ? 'text-slate-900 font-semibold' : step.done ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
          {i < WIZARD_STEPS.length - 1 && (
            <div className="w-12 h-px bg-slate-200 mx-3"/>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ---------------- Step content ----------------

const ContractTypePill = ({ value, onChange }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contract type</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent text-[13px] font-semibold text-slate-900 focus:outline-none cursor-pointer pr-1"
    >
      {CONTRACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
    </select>
  </div>
);

const BillingCycleAnchor = ({ cadence, matchCalendar, setMatchCalendar, periodStartDay, setPeriodStartDay, monthlyAnchor, setMonthlyAnchor, companyCalendarSet = true }) => {
  // Hidden entirely for real-time / immediate cadences — there's no scheduled
  // batch period to anchor when invoices fire as soon as work is eligible.
  if (cadence === 'realtime' || cadence === 'immediate') return null;

  // Cadence-specific copy
  const isWeekly = cadence === 'weekly';
  const calendarLabel = isWeekly
    ? 'Match Company Calendar (Sun – Sat)'
    : 'Match Company Calendar (1st of the month)';
  const readOnlyHint = isWeekly
    ? 'A week is Sunday – Saturday, closing Sat at end of day.'
    : 'A month starts on the 1st and closes on the last day at end of day.';

  // When the company calendar hasn't been configured in admin settings, force
  // the user to manually pick a cadence anchor and call out the unset state
  // with a soft amber notice + link back to admin.
  if (!companyCalendarSet) {
    return (
      <section className="fade-in pt-7 mt-7 border-t border-slate-100">
        <div className="mb-4">
          <h3 className="text-[15px] font-semibold text-slate-900">Billing Cycle Anchor</h3>
          <p className="text-[12.5px] text-slate-500 mt-0.5 leading-snug max-w-[560px]">
            When does each batch period begin and end?
          </p>
        </div>

        <div
          className="px-3.5 py-3 rounded-lg border bg-[#FFFCF7] mb-4"
          style={{ borderColor: 'rgba(217,148,69,0.28)' }}
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-amber-700">
              <IconLightbulb size={15}/>
            </span>
            <div className="min-w-0 leading-snug flex-1">
              <div className="text-[13px] font-semibold text-amber-900 mb-0.5">Company calendar isn't configured yet</div>
              <div className="text-[12.5px] text-amber-800/90 leading-snug">
                Set a default operational week and fiscal close in <a href="#" onClick={(e)=>e.preventDefault()} className="font-medium text-amber-900 underline decoration-amber-700/40 underline-offset-2 hover:decoration-amber-700">Admin → Settings → Accounting</a> so every contract can match a single source of truth. Until then, this contract uses its own anchor below.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
          <div className="grid grid-cols-1 md:max-w-[280px] gap-3 fade-in">
            {isWeekly ? (
              <div>
                <FieldLabel required helper="Day the weekly batch begins.">Period Start Day</FieldLabel>
                <WizardSelect value={periodStartDay} onChange={setPeriodStartDay} options={DAY_OPTIONS}/>
              </div>
            ) : (
              <div>
                <FieldLabel required helper="Day the monthly batch closes.">Period Anchor</FieldLabel>
                <WizardSelect value={monthlyAnchor} onChange={setMonthlyAnchor} options={MONTHLY_ANCHOR_OPTIONS}/>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fade-in pt-7 mt-7 border-t border-slate-100">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-slate-900">Billing Cycle Anchor</h3>
        <p className="text-[12.5px] text-slate-500 mt-0.5 leading-snug max-w-[560px]">
          When does each batch period begin and end? Matching the company calendar keeps every contract on the same cadence.
        </p>
      </div>

      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
        <WizardCheckbox
          value={matchCalendar}
          onChange={setMatchCalendar}
          label={calendarLabel}
        />
        {matchCalendar ? (
          <p className="mt-2 ml-7 text-[12.5px] text-slate-500 leading-snug">
            <span className="font-medium text-slate-700">Set in Admin → Settings → Accounting.</span> {readOnlyHint}
          </p>
        ) : (
          <div className="mt-4 ml-7 grid grid-cols-1 md:max-w-[280px] gap-3 fade-in">
            {isWeekly ? (
              <div>
                <FieldLabel helper="Day the weekly batch begins.">Period Start Day</FieldLabel>
                <WizardSelect value={periodStartDay} onChange={setPeriodStartDay} options={DAY_OPTIONS}/>
              </div>
            ) : (
              <div>
                <FieldLabel helper="Day the monthly batch closes.">Period Anchor</FieldLabel>
                <WizardSelect value={monthlyAnchor} onChange={setMonthlyAnchor} options={MONTHLY_ANCHOR_OPTIONS}/>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const BillingTermsStep = ({ contractType, setContractType, state, setState, companyCalendarSet = true }) => {
  const trigger        = state.trigger;
  const cadence        = state.cadence;
  const matchCalendar  = state.matchCalendar;
  const periodStartDay = state.periodStartDay;
  const monthlyAnchor  = state.monthlyAnchor;
  const paymentTerms   = state.paymentTerms;
  const retainage      = state.retainage;
  const thresholdAmount = state.thresholdAmount || '';
  const eligibilityBasis = state.eligibilityBasis || 'wo-complete';
  const manualOverride = !!state.manualOverride;
  const set = (k, v) => setState((prev) => ({ ...prev, [k]: v }));
  const isCumulative = trigger === 'cumulative';
  // When the trigger is the cumulative threshold, swap to the threshold-aware
  // cadence label set so options read in context ("If threshold is met").
  const cadenceOptions = isCumulative ? THRESHOLD_CADENCE_OPTIONS : CADENCE_OPTIONS;

  // When contract type changes, snap trigger to first valid option for that type.
  React.useEffect(() => {
    const opts = TRIGGER_OPTIONS(contractType);
    if (!opts.find((o) => o.value === trigger && !o.comingSoon)) {
      const first = opts.find((o) => !o.comingSoon);
      if (first) set('trigger', first.value);
    }
  }, [contractType]); // eslint-disable-line

  // When trigger flips between cumulative and non-cumulative, default the
  // cadence selection to the most natural option for each mode so the dropdown
  // never shows a stale value the user didn't pick.
  const prevIsCumulative = React.useRef(isCumulative);
  React.useEffect(() => {
    if (prevIsCumulative.current === isCumulative) return;
    prevIsCumulative.current = isCumulative;
    if (isCumulative && !THRESHOLD_CADENCE_OPTIONS.find((o) => o.value === cadence)) {
      set('cadence', 'immediate');
    } else if (!isCumulative && !CADENCE_OPTIONS.find((o) => o.value === cadence)) {
      set('cadence', 'weekly');
    }
  }, [isCumulative]); // eslint-disable-line

  return (
    <div className="px-7 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pt-8 pb-7">
        <div>
          <h2 className="text-[24px] font-semibold tracking-tight text-slate-900">Billing & Terms</h2>
          <p className="text-[13.5px] text-slate-500 mt-1.5 max-w-[640px] leading-snug">
            Define the client's billing rules, payment terms, and retainage for this contract.
          </p>
        </div>
        <ContractTypePill value={contractType} onChange={setContractType}/>
      </div>

      <div className="text-[12px] text-slate-500 leading-snug bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 mb-7 max-w-[760px] flex items-start gap-2">
        <IconInfo size={14} className="text-slate-400 mt-0.5 shrink-0"/>
        <span>{CONTRACT_TYPE_COPY[contractType]}</span>
      </div>

      {/* Trigger + cadence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px]">
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel required helper="When does work become eligible to bill?">Billing Trigger</FieldLabel>
            <WizardSelect
              value={trigger}
              onChange={(v) => set('trigger', v)}
              options={TRIGGER_OPTIONS(contractType)}
            />
          </div>

          {/* Eligibility Basis — only relevant when work accumulates toward a threshold.
              Hidden for triggers like "Upon Work Order Completion" where each WO is
              implicitly eligible the moment it's marked complete. */}
          {isCumulative && (
            <div className="fade-in">
              <FieldLabel required helper="What type of work accumulates toward billing?">
                Eligibility Basis
              </FieldLabel>
              <div className="grid grid-cols-2 bg-slate-100 border border-slate-200 rounded-md p-0.5 w-full">
                {ELIGIBILITY_BASIS_OPTIONS.map((opt) => {
                  const active = opt.value === eligibilityBasis;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('eligibilityBasis', opt.value)}
                      className={`min-h-9 px-2 rounded text-[12.5px] font-medium leading-tight text-center transition-colors ${
                        active ? 'bg-white text-slate-900 shadow-card' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isCumulative && (
            <div className="fade-in">
              <FieldLabel required helper="Invoices are generated once the cumulative total of eligible unbilled work crosses this amount.">
                Billing Threshold Amount ($)
              </FieldLabel>
              <WizardInput
                type="number"
                value={thresholdAmount}
                onChange={(v) => set('thresholdAmount', v)}
                placeholder="0.00"
                suffix="$"
              />
            </div>
          )}
        </div>
        <div>
          <FieldLabel required helper="How often do you issue invoices for eligible work?">Invoicing Cadence</FieldLabel>
          <WizardSelect
            value={cadence}
            onChange={(v) => set('cadence', v)}
            options={cadenceOptions}
          />
        </div>
      </div>

      {/* Conditional billing cycle anchor */}
      <div className="max-w-[760px]">
        <BillingCycleAnchor
          cadence={cadence}
          matchCalendar={matchCalendar}
          setMatchCalendar={(v) => set('matchCalendar', v)}
          periodStartDay={periodStartDay}
          setPeriodStartDay={(v) => set('periodStartDay', v)}
          monthlyAnchor={monthlyAnchor}
          setMonthlyAnchor={(v) => set('monthlyAnchor', v)}
          companyCalendarSet={companyCalendarSet}
        />
      </div>

      {/* Payment terms + retainage */}
      <section className="pt-7 mt-7 border-t border-slate-100">
        <div className="mb-4">
          <h3 className="text-[15px] font-semibold text-slate-900">Payment Terms</h3>
          <p className="text-[12.5px] text-slate-500 mt-0.5 leading-snug max-w-[560px]">
            When is payment due, and how much of each invoice is withheld until the contract closes out?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px]">
          <div>
            <FieldLabel required helper="Customer's payment due window.">Payment Terms</FieldLabel>
            <WizardSelect
              value={paymentTerms}
              onChange={(v) => set('paymentTerms', v)}
              options={PAYMENT_TERM_OPTIONS}
            />
          </div>
          <div>
            <FieldLabel helper="% withheld until contract closeout.">Retainage <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
            <WizardInput
              type="number"
              value={retainage}
              onChange={(v) => set('retainage', v)}
              placeholder="0"
              suffix="%"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// ---------------- Wizard shell ----------------

const ContractWizard = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply preset on mount and whenever preset Tweak changes
  const [state, setState] = React.useState(() => {
    const p = PRESETS[t.preset] || PRESETS.units;
    return p;
  });
  const [contractType, setContractType] = React.useState(t.contractType);

  React.useEffect(() => {
    if (!t.preset || t.preset === 'free') return;
    const p = PRESETS[t.preset];
    if (!p) return;
    setState(p);
    setContractType(p.contractType);
    setTweak('contractType', p.contractType);
  }, [t.preset]); // eslint-disable-line

  // Keep tweak in sync if user manually changes contract type
  React.useEffect(() => {
    if (t.contractType !== contractType) setTweak('contractType', contractType);
  }, [contractType]); // eslint-disable-line

  return (
    <div className="min-h-screen flex">
      <AppSidebar activeKey="organizations"/>
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Breadcrumb */}
        <div className="h-[60px] bg-slate-50/40 border-b border-slate-200 flex items-center px-7 text-[13px] text-slate-500">
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Data</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Organizations</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <a href="#" onClick={(e)=>e.preventDefault()} className="hover:text-slate-800">Utilities</a>
          <IconChevronRight size={14} className="mx-2 text-slate-300"/>
          <span className="text-slate-900 font-medium">Wiregrass Alabama Electric Coop</span>
        </div>

        {/* Wizard sheet */}
        <div className="flex-1 px-7 pt-6 pb-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card">
            {/* Wizard header */}
            <div className="px-7 pt-6 pb-2 flex items-center justify-between">
              <h1 className="text-[20px] font-bold tracking-tight text-slate-900">New Contract</h1>
              <button className="w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full">
                <IconX size={16}/>
              </button>
            </div>

            <Stepper activeId="terms"/>

            <BillingTermsStep
              contractType={contractType}
              setContractType={setContractType}
              state={state}
              setState={setState}
              companyCalendarSet={t.companyCalendarSet}
            />

            {/* Footer nav */}
            <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/30">
              <Button variant="ghost" size="md">
                <IconChevronLeft size={14}/> Back
              </Button>
              <Button variant="default" size="md" className="bg-slate-900 hover:bg-slate-800 border-slate-900 text-white shadow-sm">
                Continue <IconChevronRight size={14}/>
              </Button>
            </div>
          </div>
        </div>

        {/* Tweaks panel */}
        <TweaksPanel title="Tweaks">
          <TweakSection label="Preset">
            <TweakRadio
              label="Demo state"
              value={t.preset}
              onChange={(v) => setTweak('preset', v)}
              options={[
                { value: 'units', label: 'A · Units' },
                { value: 'te',    label: 'B · T&E' },
                { value: 'storm', label: 'C · Storm' },
                { value: 'free',  label: 'Free' },
              ]}
            />
          </TweakSection>
          <TweakSection label="Contract Type">
            <TweakSelect
              label="Contract type"
              value={contractType}
              onChange={(v) => { setContractType(v); setTweak('preset', 'free'); }}
              options={CONTRACT_TYPES.map((ct) => ({ value: ct, label: ct }))}
            />
          </TweakSection>
          <TweakSection label="Admin Setup">
            <TweakToggle
              label="Company calendar set"
              value={t.companyCalendarSet}
              onChange={(v) => setTweak('companyCalendarSet', v)}
            />
          </TweakSection>
        </TweaksPanel>
      </main>
    </div>
  );
};

// IconChevronLeft is needed but may not exist. Define inline if missing.
if (typeof IconChevronLeft === 'undefined') {
  window.IconChevronLeft = (p) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={p?.size || 16} height={p?.size || 16}
      fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className={p?.className || ''} aria-hidden="true">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ContractWizard/>);
