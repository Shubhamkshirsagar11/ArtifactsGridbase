// The Invoicing tab content. Lives inside <JobDetailPage>.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showSkeleton": false,
  "showEmpty": false,
  "density": "comfortable",
  "wipPlacement": "below",
  "divergentCalendars": false,
  "billingCadence": "per-wo"
}/*EDITMODE-END*/;

// ---------------- helpers ----------------

const woIsSelectable = (wo) => wo.status === 'Complete';
const woIsReadyToInvoice = (wo) => wo.status === 'Complete';
// Base in-progress filter — still primary for current/future periods.
const woIsWip = (wo) => wo.status === 'In Progress';

// A WIP-eligible WO for a given accrual period. Includes:
//   - Any In-Progress WO (active work, future accruals possible).
//   - Any Complete WO that finished AFTER this period's end AND has un-accrued
//     earned value within the period. This lets a biller catch up on a back
//     period before the eventual invoice sweeps the revenue into a later period.
// Returns true/false; the caller computes earnedThisPeriod separately.
const woIsWipForPeriod = (wo, period, accrualHistory) => {
  if (wo.status === 'In Progress') return true;
  if (wo.status !== 'Complete') return false;
  // Spec: if the WO completed inside this period, it graduates to Ready to
  // Invoice — not WIP — even if some line items were logged earlier in the
  // same period. We only surface back-period catch-up rows.
  if (!wo.completedAt || wo.completedAt <= period.end) return false;
  const inPeriodEarned = wo.lines
    .filter((l) => l.loggedAt && l.loggedAt >= period.start && l.loggedAt <= period.end)
    .reduce((s, l) => s + l.ext, 0);
  const accruedForPeriod = accrualHistory
    .filter((a) => a.workOrderId === wo.id && a.accruedThrough <= period.end && a.accruedThrough >= period.start && !a.reversedBy)
    .reduce((s, a) => s + a.amount, 0);
  return +(inPeriodEarned - accruedForPeriod).toFixed(2) > 0;
};

// Line-item sub-table grid — first col widened to 64px so CU CODE indents under the WO# text,
// reinforcing parent → child nesting visually.
const LINE_GRID = 'grid grid-cols-[64px_120px_minmax(0,1fr)_180px_70px_100px_120px_140px]';

// Invoiced history grid — adds a Marked By column between Crew and CUs.
const INVOICED_GRID = 'grid grid-cols-[36px_120px_minmax(0,1fr)_160px_60px_120px_110px_110px_80px]';

// ---------------- crew + billable atoms ----------------

const CrewBadge = ({ name, size = 'md' }) => {
  const color = crewColor(name);
  const sz = size === 'sm'
    ? 'w-[18px] h-[18px] text-[9px]'
    : 'w-5 h-5 text-[10px]';
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span className={`inline-flex items-center justify-center rounded-full border font-semibold shrink-0 ${color} ${sz}`}>
        {CREW_INITIALS(name)}
      </span>
      <span className="text-xs text-slate-700 truncate">{name}</span>
    </span>
  );
};

const CrewStack = ({ crews, stacked = false, subline = null }) => {
  if (!crews || crews.length === 0) return <span className="text-slate-400">—</span>;
  const avatars = (
    <span className="inline-flex -space-x-1.5 shrink-0">
      {crews.map((name, i) => (
        <span
          key={name}
          title={name}
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-[10px] font-semibold ${crewColor(name)}`}
          style={{ zIndex: crews.length - i }}
        >
          {CREW_INITIALS(name)}
        </span>
      ))}
    </span>
  );
  const names = crews.join(', ');
  if (stacked) {
    return (
      <div className="min-w-0 leading-tight">
        <div className="flex flex-col gap-1">
          {crews.map((name) => (
            <div key={name} className="flex items-center gap-2 min-w-0">
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-semibold shrink-0 ${crewColor(name)}`}>
                {CREW_INITIALS(name)}
              </span>
              <span className="text-[13px] font-medium text-slate-800 truncate">{name}</span>
            </div>
          ))}
        </div>
        {subline && <div className="text-[11.5px] text-slate-500 truncate mt-1.5 pl-[1px]">{subline}</div>}
      </div>
    );
  }
  return (
    <span className="flex items-center gap-2 min-w-0 w-full">
      {avatars}
      <span className="text-sm text-slate-700 truncate min-w-0">{names}</span>
    </span>
  );
};

const BillableChip = ({ billable }) => (
  billable ? (
    <span className="text-[11px] text-slate-500">Billable</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Non-billable
    </span>
  )
);

// Just the avatar circle — used in function summary rows where the badge is name-less.
const CrewAvatar = ({ name, size = 'md' }) => {
  const color = crewColor(name);
  const sz = size === 'sm' ? 'w-[18px] h-[18px] text-[9px]' : 'w-5 h-5 text-[9px]';
  return (
    <span title={name} className={`inline-flex items-center justify-center rounded-full border font-semibold shrink-0 ${color} ${sz}`}>
      {CREW_INITIALS(name)}
    </span>
  );
};

// Inline label used in function summary rows when ≥1 non-billable line.
const NonBillablePill = ({ count }) => (
  <span className="text-[12px] text-slate-500">
    {count} non-billable
  </span>
);

// Larger, uppercase function chip used in the per-function group bands.
const GROUP_FN_STYLES = {
  'Install':  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Transfer': { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200' },
  'Retire':   { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200' },
};
const GroupFunctionTag = ({ fn }) => (
  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-800">
    {fn}
  </span>
);

// ---------------- grouped line-item sub-table (shared) ----------------

const LineItemsByFunction = ({ wo }) => {
  const groups = groupLinesByFunction(wo.lines);
  const [expandedFns, setExpandedFns] = React.useState(() => new Set());

  const isExpanded = (fn) => expandedFns.has(fn);
  const toggle = (fn) => {
    setExpandedFns((prev) => {
      const next = new Set(prev);
      if (next.has(fn)) next.delete(fn); else next.add(fn);
      return next;
    });
  };
  const allExpanded = groups.length > 0 && groups.every(([fn]) => isExpanded(fn));
  const expandAll = () => setExpandedFns(new Set(groups.map(([fn]) => fn)));
  const collapseAll = () => setExpandedFns(new Set());

  return (
    <div className="border-t border-slate-200 bg-white">
      {/* sub-table column header */}
      <div className={`${LINE_GRID} items-center px-4 h-9 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100`}>
        <div></div>
        <div>CU Code</div>
        <div>Description</div>
        <div>Crew</div>
        <div className="text-right normal-case">Qty</div>
        <div className="text-right">Unit Price</div>
        <div className="pl-4">Billable</div>
        <div className="text-right pr-2">Line Total</div>
      </div>

      {groups.map(([fn, items]) => {
        const s = summarizeFunctionGroup(items);
        const expanded = isExpanded(fn);
        return (
          <React.Fragment key={fn}>
            {/* function summary row (collapsible) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggle(fn)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(fn); } }}
              className={`${LINE_GRID} items-center px-4 h-11 text-[13px] border-t border-slate-100 hover:bg-slate-50/50 cursor-pointer`}
            >
              <div className="flex justify-center">
                <span className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>
                  <IconChevronRight size={14}/>
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-3 min-w-0 flex-wrap">
                <GroupFunctionTag fn={fn}/>
                <span className="text-slate-600 text-[12px]">
                  <span className="tabular font-medium">{s.count}</span> {s.count === 1 ? 'item' : 'items'}
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-3">
                  {s.crews.map((c) => (
                    <span key={c.name} className="inline-flex items-center gap-1.5">
                      <CrewAvatar name={c.name}/>
                      <span className="tabular text-[12px] text-slate-600">{c.count}</span>
                    </span>
                  ))}
                </span>
                {s.nonBillable > 0 && (
                  <>
                    <span className="text-slate-300">·</span>
                    <NonBillablePill count={s.nonBillable}/>
                  </>
                )}
              </div>
              <div className="col-span-3"></div>
              <div className="text-right tabular pr-2 font-semibold text-sm text-slate-900">{fmtMoney(s.subtotal)}</div>
            </div>

            {/* individual log entries */}
            {expanded && items.map((l, i) => (
              <div
                key={i}
                className={`${LINE_GRID} items-center px-4 h-10 text-[13px] border-t border-slate-200/50 hover:bg-slate-50/70 ${l.billable ? 'text-slate-700' : 'text-slate-400'}`}
              >
                <div></div>
                <div className="font-mono text-[12px] truncate">{l.code}</div>
                <div className="truncate">{l.desc}</div>
                <div className="min-w-0"><CrewBadge name={l.crew}/></div>
                <div className="text-right tabular">{fmtQty(l.qty)}</div>
                <div className="text-right tabular">{fmtMoney(l.price)}</div>
                <div className="pl-4"><BillableChip billable={l.billable}/></div>
                <div className={`text-right tabular pr-2 text-sm ${l.billable ? 'text-slate-900 font-medium' : 'line-through decoration-slate-300'}`}>
                  {fmtMoney(l.ext)}
                </div>
              </div>
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// keep old name as alias for backward refs
const LineItemsGrouped = LineItemsByFunction;

// ---------------- top bar of the tab ----------------

// PeriodSelectorMeta: the right-side date range chip + Period Open/Closed badge.
// Pulled out so panel headers can split the selector (left) from the meta (right)
// to match the new visual rhythm.
const PeriodSelectorMeta = ({ period }) => {
  const isOpen = period.end >= TODAY;
  // The period's close date IS the end date — it closes at end of day on that
  // day, not the day after. Earlier we computed end+1 which produced a
  // confusing "closes Sun, May 24" when the period clearly ended Saturday.
  const closeDate = (() => {
    const [y, m, d] = period.end.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  })();
  const tip = isOpen
    ? 'This period is still in progress. Work orders can be completed, edited, or added.'
    : 'This period has ended. Data is locked for historical reference.';
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
      <IconCalendar size={13} className="text-slate-400" />
      <span className="tabular">
        {period.id === 'ready'
          ? <>Through {fmtDateLongDow(period.end)}</>
          : <>{fmtDateLongDow(period.start)} – {fmtDateLongDow(period.end)}</>
        }
      </span>
      <Tooltip content={tip} side="bottom" align="end">
        <span className="inline-flex items-center gap-1.5">
          <StatusBadge status={isOpen ? 'Period Open' : 'Period Closed'} size="sm" />
        </span>
      </Tooltip>
    </div>
  );
};

// PeriodSelector: a labeled row containing a segmented control, a date range
// chip (clickable when "Custom range\u2026" is active) and a Period Open/Closed
// status badge. Used inside the Ready and WIP card headers.
//
// Pass `compact` to drop the label and use sm-sized segments \u2014 useful when the
// selector lives inside a card header rather than a top-of-page bar.
const PeriodSelector = ({ label, period, periods, onPeriodChange, compact = false, hideStatus = false, info = null }) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [draftStart, setDraftStart] = React.useState(period.start);
  const [draftEnd, setDraftEnd] = React.useState(period.end);
  const popoverRef = React.useRef(null);

  React.useEffect(() => {
    setDraftStart(period.start);
    setDraftEnd(period.end);
  }, [period.id, period.start, period.end]);

  React.useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e) => { if (popoverRef.current && !popoverRef.current.contains(e.target)) setPickerOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setPickerOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [pickerOpen]);

  const handleSegmentChange = (id) => {
    const next = periods.find((p) => p.id === id);
    if (next.id === 'custom') {
      const useS = period.id === 'custom' ? period.start : next.start;
      const useE = period.id === 'custom' ? period.end : next.end;
      setDraftStart(useS); setDraftEnd(useE);
      onPeriodChange({ ...next, start: useS, end: useE });
      setPickerOpen(true);
    } else {
      setPickerOpen(false);
      onPeriodChange(next);
    }
  };

  const applyCustom = () => {
    if (!draftStart || !draftEnd || draftStart > draftEnd) return;
    const custom = periods.find((p) => p.id === 'custom');
    onPeriodChange({ ...custom, start: draftStart, end: draftEnd });
    setPickerOpen(false);
  };

  const isOpen = period.end >= TODAY;
  const noun = (label || 'period').toLowerCase();
  const tip = isOpen
    ? `This ${noun} is still in progress. Work orders can be completed, edited, or added.`
    : `This ${noun} has ended. Data is locked for historical reference.`;

  return (
    <div className="relative flex items-center gap-2 flex-wrap" ref={popoverRef}>
      {label && !compact && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-24 text-right shrink-0">
          {label}
        </span>
      )}
      {label && compact && info && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">
          {label}
          <Tooltip content={info} side="bottom" align="start" maxWidth={300}>
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-slate-400 hover:text-slate-600 cursor-help">
              <IconInfo size={12}/>
            </span>
          </Tooltip>
        </span>
      )}
      <Segmented
        size={compact ? 'sm' : 'md'}
        value={period.id}
        onChange={handleSegmentChange}
        options={periods.map((p) => ({ value: p.id, label: p.label }))}
      />
      {!hideStatus && (
        <>
          <button
            onClick={() => period.id === 'custom' && setPickerOpen((o) => !o)}
            className={`flex items-center gap-1.5 ${compact ? 'text-[11.5px]' : 'text-[12px]'} ${period.id === 'custom' ? 'text-slate-700 hover:text-slate-900 cursor-pointer' : 'text-slate-500 cursor-default'}`}
          >
            <IconCalendar size={13} className="text-slate-400" />
            <span className="tabular">
              {period.id === 'ready'
                ? <>Through {fmtDateLongDow(period.end)}</>
                : <>{fmtDateLongDow(period.start)} – {fmtDateLongDow(period.end)}</>
              }
            </span>
          </button>
          <Tooltip content={tip} side="bottom" align="end">
            <StatusBadge status={isOpen ? 'Period Open' : 'Period Closed'} size="sm" />
          </Tooltip>
        </>
      )}

      {pickerOpen && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[300px] bg-white border border-slate-200 rounded-lg shadow-pop p-3 fade-in">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Custom range</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11.5px] text-slate-500">Start</span>
              <input
                type="date"
                value={draftStart}
                max={draftEnd}
                onChange={(e) => setDraftStart(e.target.value)}
                className="h-8 px-2 text-[12.5px] border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11.5px] text-slate-500">End</span>
              <input
                type="date"
                value={draftEnd}
                min={draftStart}
                onChange={(e) => setDraftEnd(e.target.value)}
                className="h-8 px-2 text-[12.5px] border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => setPickerOpen(false)}>Cancel</Button>
            <Button variant="default" size="sm" onClick={applyCustom} disabled={!draftStart || !draftEnd || draftStart > draftEnd}>Apply</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const InvoicingHeader = () => {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-500 border border-brand-100">
        <IconReceipt size={20} />
      </span>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 leading-tight">Billing</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          {JOB.shortName} <span className="text-slate-300 mx-1">·</span> {JOB.contractType} contract
        </p>
      </div>
    </div>
  );
};

// ---------------- summary cards ----------------

const SummaryCard = ({ label, value, caption, accent = 'default', icon = null, valueColor }) => {
  const accents = {
    default: 'border-slate-200',
    brand:   'border-brand-200',
    amber:   'border-amber-200',
  };
  const valueColors = {
    default: 'text-slate-900',
    money:   'text-slate-900',
    brand:   'text-brand-600',
    amber:   'text-amber-700',
  };
  return (
    <Card className={`p-4 ${accents[accent]}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{label}</span>
        {icon}
      </div>
      <div className={`mt-2 text-[28px] font-semibold tracking-tight leading-none tabular ${valueColors[valueColor || 'default']}`}>
        {value}
      </div>
      <div className="mt-2 text-[12.5px] text-slate-500 leading-snug">{caption}</div>
    </Card>
  );
};

const SummaryRow = ({ totals, loading, billingPeriod, accrualPeriod, billingCadence }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[0,1].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-40 mt-3 block" />
            <Skeleton className="h-3 w-28 mt-3 block" />
          </Card>
        ))}
      </div>
    );
  }
  const readyCount = totals.readyWos.length;

  const finalityFor = (period) => {
    const isOpen = period && period.end >= TODAY;
    return {
      isOpen,
      node: isOpen
        ? <>May change until <span className="font-medium text-slate-600">{fmtDateLongDow(period.end)}</span></>
        : <>Final · period closed {fmtDateLongDow(period.end)}</>,
    };
  };
  const accrual = finalityFor(accrualPeriod);

  // Ready to Invoice caption — cadence-aware.
  //   per-wo  : the list is just whatever has been completed; no period close, no finality.
  //   period  : same finality treatment as accrual (open/closed billing period).
  const readyCaption = billingCadence === 'per-wo'
    ? (
      <div className="text-[12px] text-slate-400 mt-0.5 inline-flex items-center gap-1.5">
        <IconReceipt size={11} className="text-slate-400"/>
        Per WO completion · Queued for weekly batch
      </div>
    )
    : (() => {
      const b = finalityFor(billingPeriod);
      return (
        <div className="text-[12px] text-slate-400 mt-0.5 inline-flex items-center gap-1.5">
          {b.isOpen
            ? <span className="w-1.5 h-1.5 rounded-full bg-sky-500"/>
            : <IconLock size={11} className="text-slate-400"/>
          }
          {b.node}
        </div>
      );
    })();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SummaryCard
        label="Ready to Invoice"
        value={fmtMoneyBig(totals.readyTotal)}
        valueColor="brand"
        accent="brand"
        icon={<IconCheckCircle2 size={16} className="text-brand-500" />}
        caption={
          <>
            <div>
              <span className="font-medium text-slate-700 tabular">{readyCount}</span>
              {' '}completed work {readyCount === 1 ? 'order' : 'orders'}
            </div>
            {readyCaption}
          </>
        }
      />
      <SummaryCard
        label="Open WIP"
        value={fmtMoneyBig(totals.wipTotal)}
        icon={<IconActivity size={16} className="text-slate-400" />}
        caption={
          <>
            <div>Earned, not yet invoiced</div>
            <div className="text-[12px] text-slate-400 mt-0.5 inline-flex items-center gap-1.5">
              {accrual.isOpen
                ? <span className="w-1.5 h-1.5 rounded-full bg-sky-500"/>
                : <IconLock size={11} className="text-slate-400"/>
              }
              {accrual.node}
            </div>
          </>
        }
      />
    </div>
  );
};

// ---------------- (action bar moved into per-table headers) ----------------

// ---------------- ready-to-invoice table ----------------

// Grid template — has an optional Completed Date column when contract is per-WO.
const READY_GRID_PER_WO = 'grid grid-cols-[36px_120px_120px_minmax(0,1fr)_90px_90px_140px]';
const READY_GRID_PERIOD = 'grid grid-cols-[36px_120px_120px_minmax(0,1fr)_90px_140px]';

const ReadyTableHeader = ({ allSelected, anySelected, onToggleAll, showCompletedAt }) => (
  <div className={`${showCompletedAt ? READY_GRID_PER_WO : READY_GRID_PERIOD} items-center px-4 h-9 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/60`}>
    <div>
      <Checkbox checked={allSelected} indeterminate={anySelected && !allSelected} onChange={onToggleAll} ariaLabel="Select all" />
    </div>
    <div>WO #</div>
    <div>Status</div>
    <div>Crew</div>
    {showCompletedAt && <div>Completed</div>}
    <div className="text-right normal-case">CUs</div>
    <div className="text-right pr-2">WO Total</div>
  </div>
);

const WorkOrderRow = ({ wo, selected, expanded, onToggleSelect, onToggleExpand, density, showCompletedAt, priorAccrued }) => {
  const h = density === 'compact' ? 'h-12' : 'h-14';
  const grid = showCompletedAt ? READY_GRID_PER_WO : READY_GRID_PERIOD;
  return (
    <div className="border-t border-slate-200/80">
      <div
        className={`${grid} items-center px-4 ${h} text-sm transition-colors ${expanded ? '' : 'hover:bg-slate-50/50'}`}
        style={expanded ? { background: '#FCFCFC' } : undefined}
      >
        <div>
          <Checkbox checked={selected} onChange={onToggleSelect} ariaLabel={`Select ${wo.no}`} />
        </div>
        <button onClick={onToggleExpand} className="flex items-center gap-1.5 text-left -ml-1 pl-1 py-1 rounded hover:bg-slate-100/70">
          <span className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}><IconChevronRight size={14}/></span>
          <span className="font-semibold text-slate-900 tabular">{wo.no}</span>
        </button>
        <div><StatusBadge status={wo.status} size="sm" /></div>
        <div className="min-w-0">
          <CrewStack crews={wo.crews}/>
        </div>
        {showCompletedAt && (
          <div className="text-[12.5px] tabular text-slate-600">{fmtDateShort(wo.completedAt)}</div>
        )}
        <div className="text-right tabular text-slate-600">{wo.lines.length}</div>
        <div className="text-right tabular font-semibold text-base text-slate-900 pr-2">{fmtMoney(wo.total)}</div>
      </div>
      {expanded && <LineItemsByFunction wo={wo} />}
    </div>
  );
};

const EmptyReady = () => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    <span className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
      <IconInboxEmpty size={22} />
    </span>
    <div className="text-[14px] font-semibold text-slate-800">Nothing ready to invoice</div>
    <div className="text-[12.5px] text-slate-500 mt-1 max-w-[380px]">
      When a work order is marked complete on the work order page, it'll show up here.
    </div>
  </div>
);

// CompletedThroughPicker: a single-date cutoff control used in per-WO billing mode.
// Default value is today; presets cover the most common cutoffs.
const CompletedThroughPicker = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const ref = React.useRef(null);

  React.useEffect(() => { setDraft(value); }, [value]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const apply = (date) => { onChange(date); setOpen(false); };
  const isToday = value === TODAY;
  // End of this week (Sat) — Sat is index 6, anchor relative to TODAY.
  const eowThis = (() => {
    const [y, m, d] = TODAY.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay(); // 0 = Sun
    dt.setDate(dt.getDate() + (6 - dow));
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  })();
  const eowLast = (() => {
    const [y, m, d] = eowThis.split('-').map(Number);
    const dt = new Date(y, m - 1, d - 7);
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  })();

  return (
    <div ref={ref} className="relative inline-flex items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cutoff</span>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12.5px] text-slate-700"
      >
        <IconCalendar size={13} className="text-slate-400" />
        <span className="tabular">Completed through {isToday ? 'Today' : fmtDateLongDow(value)}</span>
        <IconChevronDown size={12} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-[260px] bg-white border border-slate-200 rounded-lg shadow-pop p-3 fade-in">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Completed through</div>
          <div className="flex flex-col gap-1 mb-3">
            {[
              { label: 'Today', date: TODAY },
              { label: `End of this week (${fmtDateShort(eowThis)})`, date: eowThis },
              { label: `End of last week (${fmtDateShort(eowLast)})`, date: eowLast },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => apply(p.date)}
                className={`h-8 px-2 rounded text-left text-[13px] ${value === p.date ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="block text-[11.5px] text-slate-500 mb-1">Custom date</span>
            <input
              type="date"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full h-8 px-2 text-[12.5px] border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
            />
          </label>
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="default" size="sm" onClick={() => apply(draft)} disabled={!draft}>Apply</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// LastSaturday helper — derive the most recent Saturday at-or-before TODAY for
// the "Through last week" cutoff segment in Ready to Invoice.
const lastSaturdayBefore = (todayIso) => {
  const [y, m, d] = todayIso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = dt.getDay(); // 0 = Sun, 6 = Sat
  // If today is Saturday, the "last week" boundary is still today (you're
  // standing on the cusp). Otherwise step back to the previous Saturday.
  const back = dow === 6 ? 7 : (dow + 1);
  dt.setDate(dt.getDate() - back);
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
};

const ReadyToInvoicePanel = ({ totals, selectedIds, setSelectedIds, expanded, setExpanded, loading, density, onMark, onExportInvoice, markDisabled, period, onPeriodChange, cadence, cutoffSegment, onCutoffSegmentChange, priorAccrualsByWo }) => {
  const ready = totals.readyWos;
  const selectableIds = ready.map((w) => w.id);
  const selectedSelectable = selectableIds.filter((id) => selectedIds.has(id));
  const allSelected = selectableIds.length > 0 && selectedSelectable.length === selectableIds.length;
  const anySelected = selectedSelectable.length > 0;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) selectableIds.forEach((id) => next.delete(id));
      else selectableIds.forEach((id) => next.add(id));
      return next;
    });
  };
  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selCount = totals.selectedWos.length;
  const readyCount = ready.length;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200">
        {/* Top row: cadence-aware filter (period selector OR cutoff picker) */}
        <div className="px-4 pt-3 pb-2.5 flex items-center justify-between gap-3 flex-wrap border-b border-slate-100">
          {cadence === 'per-wo' ? (
            <>
              <Segmented
                size="sm"
                value={cutoffSegment}
                onChange={onCutoffSegmentChange}
                options={[
                  { value: 'last',  label: 'Through last week' },
                  { value: 'today', label: 'Through today' },
                ]}
              />
              {(() => {
                const lastSat = lastSaturdayBefore(TODAY);
                const cutoffDate = cutoffSegment === 'today' ? TODAY : lastSat;
                const isOpen = cutoffSegment === 'today';
                const tip = isOpen
                  ? 'Includes everything completed so far this week. The current week is still open — additional completions may land here before Saturday.'
                  : 'Includes everything completed through the end of last week. Last week is closed; data is locked.';
                return (
                  <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
                    <IconCalendar size={13} className="text-slate-400"/>
                    <span className="tabular">Completed through {fmtDateLongDow(cutoffDate)}</span>
                    <Tooltip content={tip} side="bottom" align="end" maxWidth={320}>
                      <StatusBadge status={isOpen ? 'Period Open' : 'Period Closed'} size="sm"/>
                    </Tooltip>
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              <PeriodSelector
                label="Billing"
                period={period}
                periods={BILLING_PERIODS}
                onPeriodChange={onPeriodChange}
                compact
                hideStatus
              />
              <PeriodSelectorMeta period={period}/>
            </>
          )}
        </div>
        {/* Title row */}
        <div className="px-4 pt-3 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <h2 className="text-[16px] font-semibold text-slate-900">Ready to Invoice</h2>
            <span className="text-[13px] text-slate-500">{readyCount} completed work {readyCount === 1 ? 'order' : 'orders'}</span>
          </div>
          <button
            onClick={() => setExpanded(new Set(expanded.size === ready.length ? [] : selectableIds))}
            className="h-7 px-2 text-[12.5px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            {expanded.size === ready.length ? <IconChevronUp size={13}/> : <IconChevronDown size={13}/>}
            {expanded.size === ready.length ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
        {/* Selection bar — always visible; buttons disabled when nothing is selected */}
        <div
          className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-3"
          style={selCount > 0 ? { background: '#FFFCF7' } : undefined}
        >
          <span className="text-[13px] text-slate-700">
            <span className="text-slate-900 font-semibold">{selCount} of {readyCount}</span> work {readyCount === 1 ? 'order' : 'orders'}
            {selCount > 0 && (
              <>
                <span className="text-slate-300 mx-2">·</span>
                <span className="text-slate-900 font-semibold tabular">{fmtMoney(totals.selectedTotal)}</span> selected
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onExportInvoice} disabled={selCount === 0}>
              <IconDownload size={13}/> Export <span className="text-slate-400 font-normal">(Excel)</span>
            </Button>
            <Button variant="default" size="sm" onClick={onMark} disabled={markDisabled || selCount === 0}>
              <IconCheckCircle2 size={13}/> Mark as invoiced
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-4 space-y-2">
          {[0,1,2].map(i => <Skeleton key={i} className="h-10 w-full block" />)}
        </div>
      ) : ready.length === 0 ? (
        <EmptyReady />
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[880px]">
            <ReadyTableHeader allSelected={allSelected} anySelected={anySelected} onToggleAll={toggleAll} showCompletedAt={cadence === 'per-wo'} />
            <div>
              {ready.map((wo) => (
                <WorkOrderRow
                  key={wo.id}
                  wo={wo}
                  selected={selectedIds.has(wo.id)}
                  expanded={expanded.has(wo.id)}
                  onToggleSelect={() => toggleOne(wo.id)}
                  onToggleExpand={() => toggleExpand(wo.id)}
                  density={density}
                  showCompletedAt={cadence === 'per-wo'}
                  priorAccrued={priorAccrualsByWo && priorAccrualsByWo.get(wo.id)}
                />
              ))}
            </div>

            {/* Footer totals */}
            <div className="border-t-2 border-slate-200 bg-white">
              <div className={`${cadence === 'per-wo' ? READY_GRID_PER_WO : READY_GRID_PERIOD} items-center px-4 h-12 text-[13px]`}>
                <div></div>
                <div className={`${cadence === 'per-wo' ? 'col-span-5' : 'col-span-4'} pr-3 flex items-baseline gap-2`}>
                  <span className="text-slate-900 font-semibold">Invoice Total</span>
                  <span className="text-slate-500 text-[12.5px]">{selCount} of {readyCount} selected</span>
                </div>
                <div className="text-right tabular pr-2 font-bold text-[16px] text-slate-900">
                  {fmtMoney(totals.selectedTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const FooterRow = ({ label, value, muted = false, neg = false, bold = false }) => (
  <div className={`grid grid-cols-[36px_120px_120px_1fr_90px_140px] items-center px-4 ${bold ? 'h-11' : 'h-9'} text-[13px] border-t first:border-t-0 border-slate-200/70`}>
    <div></div>
    <div className="col-span-4 text-right pr-3">
      <span className={`${bold ? 'text-slate-900 font-semibold' : muted ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
    </div>
    <div className={`text-right tabular pr-2 ${bold ? 'text-slate-900 font-bold text-[16px]' : neg ? 'text-amber-700' : muted ? 'text-slate-400' : 'text-slate-800'}`}>
      {value}
    </div>
  </div>
);

// ---------------- WIP section ----------------

const WipPanel = ({
  totals, loading,
  expandedWip, setExpandedWip,
  density, onExportWip,
  period, accrualPeriods, onPeriodChange,
  selectedWipIds, setSelectedWipIds,
  onMarkAccrued,
}) => {
  const rows = totals.wipWos;
  const wipIds = rows.map((w) => w.id);
  const selectableIds = rows.filter((w) => w.earnedThisPeriod > 0).map((w) => w.id);
  const allExpanded = wipIds.length > 0 && wipIds.every((id) => expandedWip.has(id));
  const selCount = selectableIds.filter((id) => selectedWipIds.has(id)).length;
  const allSelected = selectableIds.length > 0 && selCount === selectableIds.length;
  const anySelected = selCount > 0;
  const isOpen = period && period.end >= TODAY;

  const toggleExpand = (id) => {
    setExpandedWip((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSel = (id) => {
    setSelectedWipIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAllSel = () => {
    setSelectedWipIds((prev) => {
      const next = new Set(prev);
      if (allSelected) selectableIds.forEach((id) => next.delete(id));
      else selectableIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const selTotal = rows
    .filter((w) => selectedWipIds.has(w.id))
    .reduce((s, w) => s + w.earnedThisPeriod, 0);

  const markTooltip = isOpen
    ? 'Accrual period is still open. You can accrue work orders once the period closes.'
    : selCount === 0
      ? 'Select work orders with earned value to accrue.'
      : null;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200">
        {/* Top row: period selector left, date/status right */}
        <div className="px-4 pt-3 pb-2.5 flex items-center justify-between gap-3 flex-wrap border-b border-slate-100">
          <PeriodSelector
            period={period}
            periods={accrualPeriods}
            onPeriodChange={onPeriodChange}
            compact
            hideStatus
          />
          <PeriodSelectorMeta period={period}/>
        </div>
        {/* Title row */}
        <div className="px-4 pt-3 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <h2 className="text-[16px] font-semibold text-slate-900">Work in Progress</h2>
            <span className="text-[13px] text-slate-500">{rows.length} {rows.length === 1 ? 'order' : 'orders'} with earned units this period</span>
          </div>
          <button
            onClick={() => setExpandedWip(new Set(allExpanded ? [] : wipIds))}
            className="h-7 px-2 text-[12.5px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            {allExpanded ? <IconChevronUp size={13}/> : <IconChevronDown size={13}/>}
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
        {/* Selection bar — always visible; buttons disabled when nothing is selected */}
        <div
          className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-3"
          style={selCount > 0 ? { background: '#FFFCF7' } : undefined}
        >
          <span className="text-[13px] text-slate-700">
            <span className="text-slate-900 font-semibold">{selCount} of {selectableIds.length}</span> work {selectableIds.length === 1 ? 'order' : 'orders'}
            {selCount > 0 && (
              <>
                <span className="text-slate-300 mx-2">·</span>
                <span className="text-slate-900 font-semibold tabular">{fmtMoney(selTotal)}</span> selected
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onExportWip} disabled={selCount === 0}>
              <IconDownload size={13}/> Export <span className="text-slate-400 font-normal">(Excel)</span>
            </Button>
            {markTooltip && selCount > 0 ? (
              <Tooltip content={markTooltip} side="bottom" align="end">
                <Button variant="default" size="sm" disabled>
                  <IconCheckCircle2 size={13}/> Mark as accrued
                </Button>
              </Tooltip>
            ) : (
              <Button variant="default" size="sm" onClick={onMarkAccrued} disabled={selCount === 0 || !!markTooltip}>
                <IconCheckCircle2 size={13}/> Mark as accrued
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[880px]">
          <div className="grid grid-cols-[36px_120px_120px_1fr_90px_140px] items-center px-4 h-9 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/60">
            <div>
              <Checkbox checked={allSelected} indeterminate={anySelected && !allSelected} onChange={toggleAllSel} disabled={isOpen} ariaLabel="Select all" />
            </div>
            <div>WO #</div>
            <div>Status</div>
            <div>Crew</div>
            <div className="text-right normal-case">CUs</div>
            <div className="text-right pr-2">Earned</div>
          </div>

          {loading ? (
            <div className="p-4 space-y-2">{[0,1,2,3].map(i => <Skeleton key={i} className="h-9 w-full block"/>)}</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-slate-500">
              No work in progress. All earned work is ready to invoice.
            </div>
          ) : (
            <>
              {rows.map((wo) => {
                const isExpanded = expandedWip.has(wo.id);
                const earned = wo.earnedThisPeriod;
                const inPeriodLines = wo.inPeriodLines || wo.lines;
                const cuCount = inPeriodLines.length;
                const hasEarned = earned > 0;
                return (
                  <div key={wo.id} className="border-t border-slate-200/80">
                    <div
                      className={`grid grid-cols-[36px_120px_120px_1fr_90px_140px] items-center px-4 ${density === 'compact' ? 'h-12' : 'h-14'} text-sm transition-colors ${isExpanded ? '' : 'hover:bg-slate-50/50'}`}
                      style={isExpanded ? { background: '#FCFCFC' } : undefined}
                    >
                      <div>
                        {isOpen && hasEarned ? (
                          <Tooltip
                            content="This period is still open — additional work may still be logged. You can mark this accrued once the period closes."
                            side="right"
                            maxWidth={280}
                          >
                            <span className="inline-flex cursor-not-allowed">
                              <Checkbox
                                checked={selectedWipIds.has(wo.id)}
                                onChange={() => toggleSel(wo.id)}
                                disabled
                                ariaLabel={`Select ${wo.no}`}
                              />
                            </span>
                          </Tooltip>
                        ) : (
                          <Checkbox
                            checked={selectedWipIds.has(wo.id)}
                            onChange={() => toggleSel(wo.id)}
                            disabled={!hasEarned || isOpen}
                            ariaLabel={`Select ${wo.no}`}
                          />
                        )}
                      </div>
                      <button onClick={() => toggleExpand(wo.id)} className="flex items-center gap-1.5 text-left -ml-1 pl-1 py-1 rounded hover:bg-slate-100/70">
                        <span className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}><IconChevronRight size={14}/></span>
                        <span className="font-semibold text-slate-900 tabular">{wo.no}</span>
                      </button>
                      <div><StatusBadge status={wo.status} size="sm" /></div>
                      <div className="min-w-0">
                        <CrewStack crews={wo.crews}/>
                      </div>
                      <div className="text-right tabular text-slate-600">{cuCount}</div>
                      <div className={`text-right tabular pr-2 ${hasEarned ? 'font-semibold text-base text-slate-900' : 'text-slate-400'}`}>
                        {hasEarned ? (
                          <Tooltip
                            side="left"
                            maxWidth={280}
                            content={
                              <>
                                <div className="font-semibold mb-1">Per-period breakdown</div>
                                {(() => {
                                  const buckets = new Map();
                                  for (const l of (wo.inPeriodLines || [])) {
                                    if (!l.billable || !l.loggedAt) continue;
                                    const b = weekBucketFor(l.loggedAt);
                                    if (!b) continue;
                                    buckets.set(b.id, { label: b.label, total: (buckets.get(b.id)?.total || 0) + l.ext });
                                  }
                                  return [...buckets.values()]
                                    .sort((a, b) => a.label.localeCompare(b.label))
                                    .map((row, i, arr) => (
                                      <div key={i} className="flex items-center justify-between gap-3 text-[11.5px]">
                                        <span className="text-slate-300">{row.label}</span>
                                        <span className="tabular text-white">{fmtMoney(row.total)}</span>
                                      </div>
                                    ));
                                })()}
                                {(() => {
                                  const ids = new Set();
                                  for (const l of (wo.inPeriodLines || [])) {
                                    if (!l.billable || !l.loggedAt) continue;
                                    const b = weekBucketFor(l.loggedAt);
                                    if (b) ids.add(b.id);
                                  }
                                  return ids.size > 1 ? (
                                    <div className="mt-1 pt-1 border-t border-slate-700 text-[10.5px] text-slate-300">
                                      On accrual, each bucket books a separate entry to its native period.
                                    </div>
                                  ) : null;
                                })()}
                              </>
                            }
                          >
                            <span className="cursor-help underline decoration-dotted decoration-slate-300 underline-offset-4">
                              {fmtMoney(earned)}
                            </span>
                          </Tooltip>
                        ) : fmtMoney(earned)}
                        {!hasEarned && wo.priorAccrued > 0 && (
                          <div className="text-[10.5px] font-normal text-slate-400 tabular">
                            <Tooltip content={`${fmtMoney(wo.priorAccrued)} already accrued from earlier in this WO's life`} side="left">
                              <span className="underline decoration-dotted">accrued earlier</span>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                    {isExpanded && <LineItemsByFunction wo={{ ...wo, lines: inPeriodLines }}/>}
                  </div>
                );
              })}
              <div className="grid grid-cols-[36px_120px_120px_1fr_90px_140px] items-center px-4 h-12 text-[13px] border-t-2 border-slate-200 bg-white">
                <div></div>
                <div className="col-span-4 pr-3 flex items-baseline gap-2">
                  <span className="text-slate-900 font-semibold">WIP Total</span>
                  <span className="text-slate-500 text-[12.5px]">{selCount} of {selectableIds.length} selected</span>
                </div>
                <div className="text-right tabular font-bold text-[16px] text-slate-900 pr-2">{fmtMoney(selCount > 0 ? selTotal : totals.wipTotal)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

// ---------------- Invoiced (history) section ----------------

const InvoicedPanel = ({ history, onExportRow, period, cadence }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [expandedRows, setExpandedRows] = React.useState(() => new Set());
  const [scope, setScope] = React.useState('period'); // 'period' | 'all'

  // For "All Time" the two views are identical — pin scope to 'all' so the toggle isn't misleading.
  const effectiveScope = period && period.id === 'all' ? 'all' : scope;

  const rows = React.useMemo(() => {
    if (effectiveScope === 'all' || !period) return history;
    return history.filter((r) => r.invoicedOn >= period.start && r.invoicedOn <= period.end);
  }, [effectiveScope, history, period]);

  const total = rows.reduce((s, r) => s + r.total, 0);

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <Card className="overflow-hidden bg-slate-50/40">
      <div className="w-full px-4 h-14 border-b border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/30">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-baseline gap-2 text-left flex-1 min-w-0"
        >
          <span className={`text-slate-400 transition-transform self-center ${collapsed ? '' : 'rotate-90'}`}>
            <IconChevronRight size={14}/>
          </span>
          <h2 className="text-[14px] font-semibold text-slate-700 shrink-0">Invoiced</h2>
          <span className="text-[12px] text-slate-500 truncate">
            {effectiveScope === 'all'
              ? <>{rows.length} {rows.length === 1 ? 'order' : 'orders'}</>
              : <>This week · {rows.length} {rows.length === 1 ? 'order' : 'orders'}</>
            }
          </span>
        </button>
        {!collapsed && period && period.id !== 'all' && (
          <Segmented
            size="sm"
            value={scope}
            onChange={setScope}
            options={[
              { value: 'period', label: 'Invoiced this week' },
              { value: 'all',    label: 'All time' },
            ]}
          />
        )}
      </div>

      {!collapsed && (
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[880px]">
            <div className={`${INVOICED_GRID} items-center px-4 h-9 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/60`}>
              <div></div>
              <div>WO #</div>
              <div>Crew</div>
              <div>Marked By</div>
              <div className="text-right normal-case">CUs</div>
              <div className="text-right">WO Total</div>
              {cadence === 'per-wo' ? (
                <>
                  <div className="text-right">Completed</div>
                  <div className="text-right">Invoiced On</div>
                </>
              ) : (
                <>
                  <div className="text-right">Invoiced On</div>
                  <div className="text-right">Period End</div>
                </>
              )}
              <div className="text-right pr-1">Export</div>
            </div>

            {rows.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-slate-500">
                {effectiveScope === 'all'
                  ? 'No invoiced work orders yet.'
                  : 'No work orders invoiced in this period.'}
              </div>
            ) : (
              <>
                {rows.map((r) => {
                  const isExpanded = expandedRows.has(r.id);
                  return (
                    <div key={r.id} className="border-t border-slate-200/80">
                      <div className={`${INVOICED_GRID} items-center px-4 h-12 text-[13px] hover:bg-white/60`}>
                        <div></div>
                        <button onClick={() => toggleRow(r.id)} className="flex items-center gap-1.5 text-left -ml-1 pl-1 py-1 rounded hover:bg-slate-100/70">
                          <span className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}><IconChevronRight size={14}/></span>
                          <span className="font-semibold text-slate-700 tabular">{r.no}</span>
                        </button>
                        <div className="min-w-0 text-slate-600">
                          <CrewStack crews={r.crews}/>
                        </div>
                        <div className="min-w-0">
                          {r.markedBy ? (
                            <Tooltip content={r.markedAt ? `Marked invoiced ${fmtTimestamp(r.markedAt)}` : `Marked invoiced by ${r.markedBy}`} side="top" maxWidth={360}>
                              <span className="inline-flex items-center gap-1.5 min-w-0">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-semibold shrink-0">
                                  {CREW_INITIALS(r.markedBy)}
                                </span>
                                <span className="text-[12.5px] text-slate-600 truncate">{r.markedBy}</span>
                              </span>
                            </Tooltip>
                          ) : <span className="text-slate-400">—</span>}
                        </div>
                        <div className="text-right tabular text-slate-600">{r.cuCount ?? (r.lines ? r.lines.length : '—')}</div>
                        <div className="text-right tabular font-medium text-slate-700">
                          {fmtMoney(r.total)}
                        </div>
                        {cadence === 'per-wo' ? (
                          <>
                            <div className="text-right tabular text-slate-500">
                              {r.completedAt ? fmtDateLong(r.completedAt) : <span className="text-slate-400">—</span>}
                            </div>
                            <div className="text-right tabular text-slate-500">{fmtDateLong(r.invoicedOn)}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-right tabular text-slate-500">{fmtDateLong(r.invoicedOn)}</div>
                            <div className="text-right tabular text-slate-500">{fmtDateLong(r.through)}</div>
                          </>
                        )}
                        <div className="text-right pr-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); onExportRow(r); }}
                            className="inline-flex items-center gap-1 text-[12px] text-slate-500 hover:text-brand-600"
                          >
                            <IconDownload size={12}/> Export
                          </button>
                        </div>
                      </div>
                      {isExpanded && r.lines && <LineItemsByFunction wo={r}/>}
                    </div>
                  );
                })}
                <div className={`${INVOICED_GRID} items-center px-4 h-12 text-[13px] border-t-2 border-slate-200 bg-white`}>
                  <div></div>
                  <div className="col-span-4 text-right pr-3 font-semibold text-slate-700">
                    {effectiveScope === 'all' ? 'Total invoiced to date' : 'Total invoiced this week'}
                  </div>
                  <div className="text-right tabular font-bold text-[16px] text-slate-900">{fmtMoney(total)}</div>
                  <div className="col-span-3"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

// ---------------- Mark-invoiced dialog ----------------

const MarkInvoicedDialog = ({ open, onClose, totals, period, onConfirm, cadence, priorAccrualsByWo }) => {
  const wos = totals.selectedWos;
  const accrualsToReverse = wos.reduce((s, w) => {
    const p = priorAccrualsByWo && priorAccrualsByWo.get(w.id);
    return s + (p ? p.total : 0);
  }, 0);
  const variance = +(totals.selectedTotal - accrualsToReverse).toFixed(2);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand-500 border border-brand-100 shrink-0">
            <IconCheckCircle2 size={20} />
          </span>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-slate-900">Mark {wos.length} work {wos.length === 1 ? 'order' : 'orders'} as invoiced?</h3>
            {cadence === 'per-wo' ? (
              <p className="text-[13px] text-slate-600 mt-1 leading-snug">
                These work orders will move to the <span className="font-medium text-slate-800">Invoiced</span> section and won't appear in Ready to Invoice again.
              </p>
            ) : (
              <p className="text-[13px] text-slate-600 mt-1 leading-snug">
                Marking through <span className="font-medium text-slate-800">{fmtDateLong(period.end)}</span>. These work orders will move out of Ready to Invoice and won't appear in next period's invoicing run.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
          {wos.map((wo, i) => {
            const prior = priorAccrualsByWo && priorAccrualsByWo.get(wo.id);
            return (
              <div key={wo.id} className={`px-3 py-2 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                <div className="grid grid-cols-[110px_minmax(0,1fr)_60px_110px] items-center gap-3 text-[13px]">
                  <div className="font-semibold tabular text-slate-900 truncate">{wo.no}</div>
                  <div className="min-w-0"><CrewStack crews={wo.crews}/></div>
                  <div className="text-[11px] text-slate-500 tabular text-right">{wo.lines.length} CU</div>
                  <div className="tabular font-medium text-slate-900 text-right">{fmtMoney(wo.total)}</div>
                </div>
                {prior && prior.count > 0 && (
                  <div className="mt-0.5 text-[11.5px] text-amber-700 inline-flex items-center gap-1.5 pl-[0px]">
                    <IconActivity size={11}/>
                    Reverses {prior.count} prior {prior.count === 1 ? 'accrual' : 'accruals'} in the Accrued ledger
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 px-3 py-2.5 rounded-md bg-slate-50 border border-slate-200 grid gap-1 text-[13px]">
          <Row label="Total invoiced" value={fmtMoney(totals.selectedTotal)} bold />
        </div>

        <p className="text-[12px] text-slate-500 mt-3 leading-snug flex items-start gap-1.5">
          <IconInfo size={13} className="text-slate-400 mt-0.5 shrink-0" />
          The actual invoice is created in your accounting system from the exported file. Gridbase only records the work as invoiced.
        </p>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40 rounded-b-lg">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="default" onClick={onConfirm}>
          <IconCheckCircle2 size={14}/> Mark as invoiced
        </Button>
      </div>
    </Dialog>
  );
};
const Row = ({ label, value, bold = false, amber = false }) => (
  <div className="flex items-center justify-between">
    <span className={`${bold ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>{label}</span>
    <span className={`tabular ${bold ? 'font-bold text-slate-900' : amber ? 'text-amber-700' : 'text-slate-800'}`}>{value}</span>
  </div>
);

// ---------------- Mark-accrued dialog ----------------

const MarkAccruedDialog = ({ open, onClose, wos, accrualTotal, period, onConfirm }) => {
  // Detect when the rolled-up earned spans more than one weekly bucket — that's
  // the case where the split-stamp behavior really matters and the biller
  // should be reassured the system is doing the right thing.
  const bucketCount = React.useMemo(() => {
    const ids = new Set();
    for (const w of wos) {
      for (const l of (w.inPeriodLines || [])) {
        if (!l.billable || !l.loggedAt) continue;
        const b = weekBucketFor(l.loggedAt);
        if (b) ids.add(b.id);
      }
    }
    return ids.size;
  }, [wos]);
  const isMultiPeriod = bucketCount > 1;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
            <IconActivity size={20} />
          </span>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-slate-900">Mark {wos.length} work {wos.length === 1 ? 'order' : 'orders'} as accrued?</h3>
            <p className="text-[13px] text-slate-600 mt-1 leading-snug">
              Each accrual will book to its native weekly period in the Accrued ledger. In-progress work orders return to WIP once new units are logged in a future period.
            </p>
            {isMultiPeriod && (
              <div
                className="mt-3 px-3 py-2.5 rounded-md border bg-[#FFFCF7] fade-in"
                style={{ borderColor: 'rgba(217,148,69,0.28)' }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 text-amber-700">
                    <IconLightbulb size={14}/>
                  </span>
                  <div className="min-w-0 leading-snug">
                    <div className="text-[12.5px] font-semibold text-amber-900 mb-0.5">Unaccrued work spans {bucketCount} prior weeks</div>
                    <div className="text-[12px] text-amber-800/90 leading-snug">
                      Gridbase will automatically create separate period-accurate snapshots in your Accrued history so your monthly billing reports stay balanced.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
          {wos.map((wo, i) => {
            // Per-WO bucket count — drives the "spans N weeks" sub-line so the
            // biller can see which row triggered the multi-period notice.
            const buckets = new Set();
            for (const l of (wo.inPeriodLines || [])) {
              if (!l.billable || !l.loggedAt) continue;
              const b = weekBucketFor(l.loggedAt);
              if (b) buckets.add(b.id);
            }
            const woSpans = buckets.size;
            return (
              <div key={wo.id} className={`px-3 py-2 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                <div className="grid grid-cols-[110px_minmax(0,1fr)_60px_110px] items-center gap-3 text-[13px]">
                  <div className="font-semibold tabular text-slate-900 truncate">{wo.no}</div>
                  <div className="min-w-0"><CrewStack crews={wo.crews}/></div>
                  <div className="text-[11px] text-slate-500 tabular text-right">{(wo.inPeriodLines || wo.lines).length} CU</div>
                  <div className="tabular font-medium text-slate-900 text-right">{fmtMoney(wo.earnedThisPeriod)}</div>
                </div>
                {woSpans > 1 && (
                  <div className="mt-0.5 text-[11.5px] text-amber-700 inline-flex items-center gap-1.5">
                    <IconActivity size={11}/>
                    Spans {woSpans} prior {woSpans === 1 ? 'week' : 'weeks'} · {woSpans} entries will be booked
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 px-3 py-2.5 rounded-md bg-slate-50 border border-slate-200 grid gap-1 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-900 font-semibold">Total accrued</span>
            <span className="tabular font-bold text-slate-900">{fmtMoney(accrualTotal)}</span>
          </div>
        </div>

      </div>
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40 rounded-b-lg">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="default" onClick={onConfirm}>
          <IconCheckCircle2 size={14}/> Mark as accrued
        </Button>
      </div>
    </Dialog>
  );
};

// ---------------- Accrued (history) section ----------------

const ACCRUED_GRID = 'grid grid-cols-[36px_180px_minmax(0,1fr)_160px_120px_110px_110px_80px]';

const AccruedPanel = ({ history, period, onExportRow }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [scope, setScope] = React.useState('period'); // 'period' | 'all'
  const effectiveScope = period && period.id === 'all' ? 'all' : scope;

  const rows = React.useMemo(() => {
    if (effectiveScope === 'all' || !period) return history;
    return history.filter((r) => r.accruedThrough >= period.start && r.accruedThrough <= period.end);
  }, [effectiveScope, history, period]);

  // Net total — reversed accruals don't count toward the "currently accrued on the books" figure.
  const netTotal = rows.filter((r) => !r.reversedBy).reduce((s, r) => s + r.amount, 0);

  return (
    <Card className="overflow-hidden bg-slate-50/40">
      <div className="w-full px-4 h-14 border-b border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/30">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-baseline gap-2 text-left flex-1 min-w-0"
        >
          <span className={`text-slate-400 transition-transform self-center ${collapsed ? '' : 'rotate-90'}`}>
            <IconChevronRight size={14}/>
          </span>
          <h2 className="text-[14px] font-semibold text-slate-700 shrink-0">Accrued</h2>
          <span className="text-[12px] text-slate-500 truncate">
            {effectiveScope === 'all'
              ? <>{rows.length} {rows.length === 1 ? 'snapshot' : 'snapshots'}</>
              : <>This week · {rows.length} {rows.length === 1 ? 'snapshot' : 'snapshots'}</>
            }
          </span>
        </button>
        {!collapsed && period && period.id !== 'all' && (
          <Segmented
            size="sm"
            value={scope}
            onChange={setScope}
            options={[
              { value: 'period', label: 'Accrued this week' },
              { value: 'all',    label: 'All time' },
            ]}
          />
        )}
      </div>

      {!collapsed && (
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[820px]">
            <div className={`${ACCRUED_GRID} items-center px-4 h-9 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/60`}>
              <div></div>
              <div>WO #</div>
              <div>Crew</div>
              <div>Marked By</div>
              <div className="text-right">Accrued Amount</div>
              <div className="text-right">Accrued On</div>
              <div className="text-right">Period End</div>
              <div className="text-right pr-1">Export</div>
            </div>

            {rows.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-slate-500">
                {effectiveScope === 'all'
                  ? 'No accruals recorded yet.'
                  : 'No accruals recorded in this period.'}
              </div>
            ) : (
              <>
                {rows.map((r) => (
                  <div key={r.id} className="border-t border-slate-200/80">
                    <div className={`${ACCRUED_GRID} items-center px-4 h-12 text-[13px] hover:bg-white/60 ${r.reversedBy ? 'opacity-60' : ''}`}>
                      <div></div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-slate-700 tabular whitespace-nowrap">{r.no}</span>
                        {r.reversedBy && (
                          <Tooltip content={`Reversed by invoice ${r.reversedBy} on ${fmtDateLong(r.reversedOn)}`} side="top" maxWidth={340}>
                            <span className="inline-flex items-center px-1.5 h-[18px] rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-200 text-slate-600 border border-slate-300 whitespace-nowrap shrink-0">
                              Reversed
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <div className="min-w-0 text-slate-600">
                        <CrewStack crews={r.crews}/>
                      </div>
                      <div className="min-w-0">
                        {r.markedBy ? (
                          <Tooltip content={r.markedAt ? `Marked accrued ${fmtTimestamp(r.markedAt)}` : `Marked accrued by ${r.markedBy}`} side="top" maxWidth={360}>
                            <span className="inline-flex items-center gap-1.5 min-w-0">
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-semibold shrink-0">
                                {CREW_INITIALS(r.markedBy)}
                              </span>
                              <span className="text-[12.5px] text-slate-600 truncate">{r.markedBy}</span>
                            </span>
                          </Tooltip>
                        ) : <span className="text-slate-400">—</span>}
                      </div>
                      <div className={`text-right tabular font-medium ${r.reversedBy ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700'}`}>{fmtMoney(r.amount)}</div>
                      <div className="text-right tabular text-slate-500">{fmtDateLong(r.accruedOn)}</div>
                      <div className="text-right tabular text-slate-500">{fmtDateLong(r.accruedThrough)}</div>
                      <div className="text-right pr-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onExportRow(r); }}
                          className="inline-flex items-center gap-1 text-[12px] text-slate-500 hover:text-brand-600"
                        >
                          <IconDownload size={12}/> Export
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className={`${ACCRUED_GRID} items-center px-4 h-12 text-[13px] border-t-2 border-slate-200 bg-white`}>
                  <div></div>
                  <div className="col-span-3 text-right pr-3 font-semibold text-slate-700">
                    {effectiveScope === 'all' ? 'Net accrued on the books' : 'Net accrued this week'}
                  </div>
                  <div className="text-right tabular font-bold text-[16px] text-slate-900">{fmtMoney(netTotal)}</div>
                  <div className="col-span-3"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

// ---------------- Tweaks panel ----------------

const InvoicingTweaks = ({ t, setTweak }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection label="Calendars">
      <TweakToggle
        label="Divergent billing/accrual"
        value={t.divergentCalendars}
        onChange={(v) => setTweak('divergentCalendars', v)}
      />
    </TweakSection>
    <TweakSection label="Layout">
      <TweakRadio
        label="WIP placement"
        value={t.wipPlacement}
        onChange={(v) => setTweak('wipPlacement', v)}
        options={[
          { value: 'below', label: 'Below' },
          { value: 'above', label: 'Above' },
        ]}
      />
      <TweakRadio
        label="Row density"
        value={t.density}
        onChange={(v) => setTweak('density', v)}
        options={[
          { value: 'compact',     label: 'Compact' },
          { value: 'comfortable', label: 'Comfort' },
        ]}
      />
    </TweakSection>
    <TweakSection label="States">
      <TweakToggle label="Loading skeletons" value={t.showSkeleton} onChange={(v) => setTweak('showSkeleton', v)} />
      <TweakToggle label="Empty state" value={t.showEmpty} onChange={(v) => setTweak('showEmpty', v)} />
    </TweakSection>
  </TweaksPanel>
);

// ---------------- Tab root ----------------

const InvoicingTab = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const toast = useToast();

  const accrualPeriods = t.divergentCalendars ? ACCRUAL_PERIODS_MON_SUN : ACCRUAL_PERIODS_SUN_SAT;

  const [billingPeriod, setBillingPeriod] = React.useState(BILLING_PERIODS[0]);
  const [accrualPeriod, setAccrualPeriod] = React.useState(accrualPeriods[0]); // default "Ready to accrue" (now the first entry after reorder)
  const [cutoffSegment, setCutoffSegment] = React.useState('last'); // 'last' = through last Saturday (default); 'today' = through today
  // when toggling divergent calendars, snap accrual to the same id from the new list
  React.useEffect(() => {
    const next = accrualPeriods.find((p) => p.id === accrualPeriod.id) || accrualPeriods[0];
    setAccrualPeriod(next);
  }, [t.divergentCalendars]); // eslint-disable-line

  const [selectedIds, setSelectedIds] = React.useState(() => new Set(['WO-1042', 'WO-1043']));
  const [selectedWipIds, setSelectedWipIds] = React.useState(() => new Set());
  const [expanded, setExpanded] = React.useState(() => new Set(['WO-1042']));
  const [expandedWip, setExpandedWip] = React.useState(() => new Set(['WO-1045']));
  const [invoicedIds, setInvoicedIds] = React.useState(() => new Set());
  const [sessionHistory, setSessionHistory] = React.useState(() => []);
  const [accrualHistory, setAccrualHistory] = React.useState(() => [...ACCRUAL_HISTORY]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [accrualDialogOpen, setAccrualDialogOpen] = React.useState(false);

  // Derive earned-this-accrual-period per WIP work order, net of prior accruals.
  const visibleWorkOrders = React.useMemo(
    () => WORK_ORDERS.filter((w) => !invoicedIds.has(w.id)),
    [invoicedIds]
  );

  const totalsRaw = React.useMemo(() => {
    let ready = visibleWorkOrders.filter(woIsReadyToInvoice);
    if (t.billingCadence === 'per-wo') {
      // Filter to only WOs completed on or before the cutoff date.
      const cutoff = cutoffSegment === 'today' ? TODAY : lastSaturdayBefore(TODAY);
      ready = ready.filter((w) => w.completedAt && w.completedAt <= cutoff);
      // Sort most-recently-completed first so the biller's eye lands on what's new.
      ready = [...ready].sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
    } else {
      // Period mode: filter to WOs completed within the billing period.
      ready = ready.filter((w) =>
        w.completedAt && w.completedAt >= billingPeriod.start && w.completedAt <= billingPeriod.end
      );
    }
    const readyTotal = ready.reduce((s, w) => s + w.total, 0);
    const selWos = ready.filter((w) => selectedIds.has(w.id));
    const selTotal = selWos.reduce((s, w) => s + w.total, 0);

    // WIP rows are augmented with earnedThisPeriod / inPeriodLines / priorAccrued.
    // Use the period-aware filter so Complete WOs with un-accrued back-period
    // earned value still surface for catch-up accrual.
    const wipRaw = visibleWorkOrders.filter((w) => woIsWipForPeriod(w, accrualPeriod, accrualHistory));
    const wipWosAll = wipRaw.map((w) => {
      const inPeriodLines = w.lines.filter((l) => l.loggedAt && l.loggedAt >= accrualPeriod.start && l.loggedAt <= accrualPeriod.end);
      const grossEarned = +inPeriodLines.reduce((s, l) => s + l.ext, 0).toFixed(2);
      // Subtract any prior accruals already taken for this WO in this same period
      const accruedThisPeriod = accrualHistory
        .filter((a) => a.workOrderId === w.id && a.accruedThrough <= accrualPeriod.end && a.accruedThrough >= accrualPeriod.start && !a.reversedBy)
        .reduce((s, a) => s + a.amount, 0);
      const earnedThisPeriod = Math.max(0, +(grossEarned - accruedThisPeriod).toFixed(2));
      // Total accrued for this WO across all prior periods (audit signal)
      const priorAccrued = accrualHistory
        .filter((a) => a.workOrderId === w.id && !a.reversedBy)
        .reduce((s, a) => s + a.amount, 0);
      return { ...w, inPeriodLines, earnedThisPeriod, priorAccrued };
    });
    // Hide rows with $0 earned for the active period — they're not actionable
    // (can't be selected, nothing to accrue) and would just be visual noise.
    const wipWos = wipWosAll.filter((w) => w.earnedThisPeriod > 0);
    const wipTotal = wipWos.reduce((s, w) => s + w.earnedThisPeriod, 0);

    return { readyWos: ready, wipWos, readyTotal, selectedWos: selWos, selectedTotal: selTotal, wipTotal };
  }, [visibleWorkOrders, selectedIds, accrualPeriod, accrualHistory, billingPeriod, cutoffSegment, t.billingCadence]);
  const totals = totalsRaw;

  // Lookup: workOrderId → total currently-open (un-reversed) accrued amount across all periods.
  // Used to surface "Includes $X from N accruals" hints in Ready/dialog and to compute write-up/write-down
  // when marking invoiced.
  const priorAccrualsByWo = React.useMemo(() => {
    const map = new Map();
    for (const a of accrualHistory) {
      if (a.reversedBy) continue;
      const cur = map.get(a.workOrderId) || { total: 0, count: 0, periods: [] };
      cur.total += a.amount;
      cur.count += 1;
      cur.periods.push(a);
      map.set(a.workOrderId, cur);
    }
    return map;
  }, [accrualHistory]);

  const emptyOverride = !!t.showEmpty;
  const loading = !!t.showSkeleton;

  const totalsForUI = emptyOverride
    ? { ...totals, readyWos: [], selectedWos: [], readyTotal: 0, selectedTotal: 0 }
    : totals;

  const handleExportWip = () => {
    toast.push({ title: 'WIP export started', description: `wip_${JOB.shortName.replace(/\s+/g,'_')}_${accrualPeriod.end}.xlsx`, kind: 'success' });
  };
  const handleExportInvoice = () => {
    const ids = totals.selectedWos.map(w => w.no).join(', ') || 'no WOs selected';
    toast.push({ title: 'Invoice export started', description: `Includes ${totals.selectedWos.length} WO · ${ids}`, kind: 'success' });
  };
  const handleConfirmMark = () => {
    const wos = totals.selectedWos;
    const ids = new Set(wos.map(w => w.id));
    const today = TODAY;
    const now = new Date().toISOString();
    // Snapshot accrual rows we're about to reverse so undo can restore their
    // pre-action state byte-for-byte.
    const reversedSnapshot = accrualHistory
      .filter((a) => !a.reversedBy && ids.has(a.workOrderId))
      .map((a) => ({ id: a.id, reversedBy: a.reversedBy, reversedOn: a.reversedOn }));
    const newHistory = wos.map((w) => {
      const prior = priorAccrualsByWo.get(w.id);
      const priorAccrued = prior ? +prior.total.toFixed(2) : 0;
      const variance = +(w.total - priorAccrued).toFixed(2);
      return {
        id: w.id,
        no: w.no,
        crew: w.crew,
        crews: w.crews,
        cuCount: w.lines.length,
        lines: w.lines,
        total: w.total,
        priorAccrued,           // sum of accruals that were reversed by this invoice
        priorAccrualIds: prior ? prior.periods.map(p => p.id) : [],
        variance,                // positive = write-up, negative = write-off, 0 = clean
        completedAt: w.completedAt,
        invoicedOn: today,
        through: billingPeriod.end,
        markedBy: CURRENT_USER.name,
        markedAt: now,
      };
    });
    // Mark associated accruals as reversed by this invoice action.
    setAccrualHistory((prev) => prev.map((a) => {
      if (a.reversedBy) return a;
      if (!ids.has(a.workOrderId)) return a;
      return { ...a, reversedBy: a.workOrderId, reversedOn: today };
    }));
    setSessionHistory((prev) => [...newHistory, ...prev]);
    setInvoicedIds((prev) => new Set([...prev, ...ids]));
    setSelectedIds(new Set());
    setExpanded(new Set());
    setDialogOpen(false);
    toast.push({
      title: `${ids.size} work ${ids.size === 1 ? 'order' : 'orders'} marked as invoiced`,
      description: t.billingCadence === 'per-wo'
        ? `${fmtMoney(totals.selectedTotal)} moved to Invoiced.`
        : `${fmtMoney(totals.selectedTotal)} invoiced through ${fmtDateLong(billingPeriod.end)}.`,
      kind: 'success',
      action: {
        label: 'Undo',
        onClick: () => {
          // Restore selection so the biller can fix what they did, drop the
          // invoiced flag, prune the newly-added history rows, and revert any
          // accrual reversals we triggered.
          const newIds = new Set(newHistory.map((h) => h.id));
          setSessionHistory((prev) => prev.filter((h) => !newIds.has(h.id)));
          setInvoicedIds((prev) => {
            const next = new Set(prev);
            for (const id of ids) next.delete(id);
            return next;
          });
          const snapMap = new Map(reversedSnapshot.map((s) => [s.id, s]));
          setAccrualHistory((prev) => prev.map((a) =>
            snapMap.has(a.id) ? { ...a, reversedBy: snapMap.get(a.id).reversedBy, reversedOn: snapMap.get(a.id).reversedOn } : a
          ));
          setSelectedIds(ids);
          toast.push({ title: 'Undone', description: `${ids.size} work ${ids.size === 1 ? 'order' : 'orders'} restored to Ready to Invoice.`, kind: 'success' });
        },
      },
    });
  };

  // ---- accrual flow ----
  const selectedWipWos = totals.wipWos.filter((w) => selectedWipIds.has(w.id) && w.earnedThisPeriod > 0);
  const accrualTotal = selectedWipWos.reduce((s, w) => s + w.earnedThisPeriod, 0);

  const handleConfirmAccrue = () => {
    const now = new Date().toISOString();
    const today = TODAY;
    // Split-stamp: bucket each WO's in-period billable lines by their natural
    // weekly period so each accrual entry books to its native GL period.
    const newAccruals = [];
    for (const w of selectedWipWos) {
      const totals = new Map();
      for (const l of (w.inPeriodLines || [])) {
        if (!l.billable || !l.loggedAt) continue;
        const b = weekBucketFor(l.loggedAt);
        if (!b) continue;
        const prev = totals.get(b.id) || { bucket: b, total: 0 };
        prev.total += l.ext;
        totals.set(b.id, prev);
      }
      for (const { bucket, total } of totals.values()) {
        if (total <= 0) continue;
        newAccruals.push({
          id: `ACC-${w.id}-${bucket.id}-${Date.now()}`,
          workOrderId: w.id, no: w.no, crew: w.crew, crews: w.crews,
          amount: +total.toFixed(2),
          accruedOn: today, accruedThrough: bucket.end,
          bucketLabel: bucket.label,
          markedBy: CURRENT_USER.name, markedAt: now,
          reversedBy: null, reversedOn: null,
        });
      }
    }
    setAccrualHistory((prev) => [...newAccruals, ...prev]);
    setSelectedWipIds(new Set());
    setAccrualDialogOpen(false);
    const newIds = new Set(newAccruals.map((a) => a.id));
    const restoreSelectionIds = new Set(selectedWipWos.map((w) => w.id));
    toast.push({
      title: `${selectedWipWos.length} work ${selectedWipWos.length === 1 ? 'order' : 'orders'} marked as accrued`,
      description: `${fmtMoney(accrualTotal)} accrued · ${newAccruals.length} period ${newAccruals.length === 1 ? 'entry' : 'entries'} booked.`,
      kind: 'success',
      action: {
        label: 'Undo',
        onClick: () => {
          setAccrualHistory((prev) => prev.filter((a) => !newIds.has(a.id)));
          setSelectedWipIds(restoreSelectionIds);
          toast.push({ title: 'Undone', description: `${selectedWipWos.length} accrual ${selectedWipWos.length === 1 ? 'entry' : 'entries'} reverted.`, kind: 'success' });
        },
      },
    });
  };

  const readyPanel = (
    <ReadyToInvoicePanel
      totals={totalsForUI}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      expanded={expanded}
      setExpanded={setExpanded}
      loading={loading}
      density={t.density}
      onMark={() => setDialogOpen(true)}
      onExportInvoice={handleExportInvoice}
      markDisabled={loading}
      period={billingPeriod}
      onPeriodChange={setBillingPeriod}
      cadence={t.billingCadence}
      cutoffSegment={cutoffSegment}
      onCutoffSegmentChange={setCutoffSegment}
      priorAccrualsByWo={priorAccrualsByWo}
    />
  );
  const wipPanel = (
    <WipPanel
      totals={totalsForUI}
      loading={loading}
      expandedWip={expandedWip}
      setExpandedWip={setExpandedWip}
      density={t.density}
      onExportWip={handleExportWip}
      period={accrualPeriod}
      accrualPeriods={accrualPeriods}
      onPeriodChange={setAccrualPeriod}
      selectedWipIds={selectedWipIds}
      setSelectedWipIds={setSelectedWipIds}
      onMarkAccrued={() => setAccrualDialogOpen(true)}
    />
  );

  const mergedHistory = React.useMemo(() => [...sessionHistory, ...INVOICED_HISTORY], [sessionHistory]);

  const handleExportRow = (r) => {
    toast.push({
      title: `Re-export started`,
      description: `${r.no} · ${fmtMoney(r.total || r.amount)} · ${r.invoicedOn ? `invoiced ${fmtDateLong(r.invoicedOn)}` : `accrued ${fmtDateLong(r.accruedOn)}`}`,
      kind: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      <InvoicingHeader />
      <SummaryRow
        totals={totalsForUI}
        loading={loading}
        billingPeriod={billingPeriod}
        accrualPeriod={accrualPeriod}
        billingCadence={t.billingCadence}
      />

      {t.wipPlacement === 'above'
        ? (<><div>{wipPanel}</div><div>{readyPanel}</div></>)
        : (<><div>{readyPanel}</div><div>{wipPanel}</div></>)}

      <InvoicedPanel history={mergedHistory} onExportRow={handleExportRow} period={billingPeriod} cadence={t.billingCadence} />
      <AccruedPanel history={accrualHistory} period={accrualPeriod} onExportRow={handleExportRow} />

      <MarkInvoicedDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        totals={totals}
        period={billingPeriod}
        onConfirm={handleConfirmMark}
        cadence={t.billingCadence}
        priorAccrualsByWo={priorAccrualsByWo}
      />
      <MarkAccruedDialog
        open={accrualDialogOpen}
        onClose={() => setAccrualDialogOpen(false)}
        wos={selectedWipWos}
        accrualTotal={accrualTotal}
        period={accrualPeriod}
        onConfirm={handleConfirmAccrue}
      />

      <InvoicingTweaks t={t} setTweak={setTweak} />
    </div>
  );
};

Object.assign(window, { InvoicingTab });
