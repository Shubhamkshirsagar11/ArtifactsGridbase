// Mock data for the Wiregrass 2026 Distribution job.
// Each CU line item now carries a crew + billable flag + a logged date.
// Non-billable lines keep a unit price but their line total = $0.
// Per-line `loggedAt` enables period-bounded WIP totals: only lines logged
// within the active accrual period count toward this-period earned value.

const D = (m, d) => `2026-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

// LINE(code, desc, fn, qty, unit, price, crew, billable=true)
const LINE = (code, desc, fn, qty, unit, price, crew, billable = true) => ({
  code, desc, fn, qty, unit, price, crew, billable,
  ext: billable ? +(qty * price).toFixed(2) : 0,
  loggedAt: null,
});

// LINES(n, ...args): N identical rows, each qty=1 — used when N discrete units
// were each logged as their own production event.
const LINES = (n, code, desc, fn, price, crew, billable = true) =>
  Array.from({ length: n }, () => LINE(code, desc, fn, 1, 'EA', price, crew, billable));

// Distribute logged dates across a WO's lines, round-robin from `dates`.
const assignDates = (wo, dates) => {
  wo.lines.forEach((l, i) => { l.loggedAt = dates[i % dates.length]; });
  return wo;
};

// Sum line.ext for lines whose loggedAt falls within [start, end] inclusive.
const sumLinesInRange = (lines, start, end) =>
  +lines
    .filter((l) => l.loggedAt && l.loggedAt >= start && l.loggedAt <= end)
    .reduce((s, l) => s + l.ext, 0)
    .toFixed(2);

// Crew shortnames used in the badge stack.
const CREW_INITIALS = (name) => name.split(/\s+/).map(s => s[0]).join('').slice(0, 2).toUpperCase();

const CURRENT_USER = { name: 'Ben Glatt' };

const fmtTimestamp = (iso) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} at ${time}`;
};
// Stable color per crew (for the avatar dot).
const CREW_COLORS = {
  'Wesley Hilson': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Chete Howell':  'bg-sky-100 text-sky-700 border-sky-200',
  'Clint Smith':   'bg-violet-100 text-violet-700 border-violet-200',
  'Ethan Boles':   'bg-amber-100 text-amber-800 border-amber-200',
  'Hank Powell':   'bg-rose-100 text-rose-700 border-rose-200',
  'Roy Tanner':    'bg-indigo-100 text-indigo-700 border-indigo-200',
};
const crewColor = (name) => CREW_COLORS[name] || 'bg-slate-100 text-slate-700 border-slate-200';

const WORK_ORDERS = [
  // ---- In Progress (WIP only, not selectable) ----
  {
    id: 'WO-1045',
    no: '1045-WIRE',
    status: 'In Progress',
    completedAt: null,
    location: 'Feeder 17 · Pinckard Spur',
    lines: [
      // Install
      ...LINES(4, 'C1.9NPP', '45ft Class 4 Pole, framed', 'Install', 812.50, 'Ethan Boles'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 1560, 'FT', 1.25, 'Ethan Boles'),
      LINE('EQ-STBY',   'Equipment Standby (storm hold)', 'Install', 1, 'HR', 145.00, 'Ethan Boles', false),
      // Transfer
      ...LINES(5, 'H1.1', 'Transfer 1ph Conductor', 'Transfer', 383.00, 'Ethan Boles'),
      // Retire
      ...LINES(2, '40W-POLE', "40' Wood Pole", 'Retire', 600.00, 'Ethan Boles'),
    ],
  },
  {
    id: 'WO-1048',
    no: '1048-WIRE',
    status: 'In Progress',
    completedAt: null,
    location: 'Feeder 22 · Daleville Branch',
    lines: [
      ...LINES(3, '50W-POLE', "50' Wood Pole, set & framed", 'Install', 945.00, 'Wesley Hilson'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 1850, 'FT', 1.25, 'Wesley Hilson'),
      ...LINES(4, 'VE1-2', 'Single Crossarm Assembly', 'Install', 145.00, 'Wesley Hilson'),
    ],
  },
  {
    id: 'WO-1049',
    no: '1049-WIRE',
    status: 'In Progress',
    completedAt: null,
    location: 'Feeder 14 · Pansey Crossing',
    lines: [
      ...LINES(2, 'C1.9NPP', '45ft Class 4 Pole, framed', 'Install', 812.50, 'Clint Smith'),
      LINE('W4-ACSR', '#4 ACSR Conductor', 'Install', 1200, 'FT', 0.95, 'Clint Smith'),
      ...LINES(3, 'H1.1', 'Transfer 1ph Conductor', 'Transfer', 385.00, 'Clint Smith'),
    ],
  },

  // ---- Ready to invoice ----
  {
    id: 'WO-1042',
    no: '1042-WIRE',
    status: 'Complete',
    completedAt: D(5, 19),
    location: 'Feeder 22 · Headland Rd',
    lines: [
      // Install
      ...LINES(6,  'C1.9NPP', '45ft Class 4 Pole, framed', 'Install', 812.50, 'Wesley Hilson'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 4200, 'FT', 1.25, 'Wesley Hilson'),
      ...LINES(12, 'VE1-2',   'Single Crossarm Assembly',  'Install', 145.00, 'Chete Howell'),
      ...LINES(2,  'RW-CRSARM','Rework — crossarm alignment','Install', 145.00, 'Chete Howell', false),
      // Transfer
      ...LINES(8,  'H1.1', 'Transfer 1ph Conductor', 'Transfer', 385.00, 'Chete Howell'),
      // Retire
      ...LINES(3,  '40W-POLE', "40' Wood Pole", 'Retire', 625.00, 'Wesley Hilson'),
    ],
  },
  {
    id: 'WO-1043',
    no: '1043-WIRE',
    status: 'Complete',
    completedAt: D(5, 20),
    location: 'Feeder 17 · Ozark Lateral',
    lines: [
      // Install
      ...LINES(8, '50W-POLE', "50' Wood Pole, set & framed", 'Install', 945.00, 'Chete Howell'),
      LINE('W4-ACSR', '#4 ACSR Conductor', 'Install', 2800, 'FT', 0.95, 'Chete Howell'),
      ...LINES(2, 'F2.12', '25kVA Single-Phase Transformer', 'Install', 1425.00, 'Chete Howell'),
      // Transfer
      ...LINES(6, 'H1.1', 'Transfer 1ph Conductor', 'Transfer', 385.00, 'Chete Howell'),
      ...LINES(2, 'CRW-STBY', 'Pole-restage standby', 'Transfer', 200.00, 'Chete Howell', false),
    ],
  },
  {
    id: 'WO-1044',
    no: '1044-WIRE',
    status: 'Complete',
    completedAt: D(5, 21),
    location: 'Feeder 22 · Hwy 84 East',
    lines: [
      // Install
      ...LINES(4,  '55W-POLE',   "55' Wood Pole, set & framed", 'Install', 1085.00, 'Clint Smith'),
      ...LINES(3,  'C1.9NPP',    '45ft Class 4 Pole, framed',    'Install', 812.50, 'Clint Smith'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 1850, 'FT', 1.25, 'Ethan Boles'),
      ...LINES(14, '2-3 STR.CU', '#2 Stranded Cu Service Drop',  'Install', 128.00, 'Ethan Boles'),
      ...LINES(8,  'VE1-2',      'Single Crossarm Assembly',     'Install', 145.00, 'Ethan Boles'),
      // Retire
      ...LINES(4,  '40W-POLE',   "40' Wood Pole",                'Retire',  625.00, 'Clint Smith'),
      LINE('SCRAP-HAUL', 'Scrap haul — included', 'Retire', 1, 'EA', 150.00, 'Clint Smith', false),
    ],
  },

  // ---- Completed in the prior period (May 10–16) — show up only when the
  //      billing cutoff is set to "End of last week" or earlier. ----
  {
    id: 'WO-1046',
    no: '1046-WIRE',
    status: 'Complete',
    completedAt: D(5, 14),
    location: 'Feeder 22 · Newville Tap',
    lines: [
      ...LINES(4, '50W-POLE', "50' Wood Pole, set & framed", 'Install', 945.00, 'Hank Powell'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 2400, 'FT', 1.25, 'Hank Powell'),
      ...LINES(6, 'VE1-2', 'Single Crossarm Assembly', 'Install', 145.00, 'Hank Powell'),
      ...LINES(4, 'H1.1', 'Transfer 1ph Conductor', 'Transfer', 385.00, 'Hank Powell'),
    ],
  },
  {
    id: 'WO-1047',
    no: '1047-WIRE',
    status: 'Complete',
    completedAt: D(5, 16),
    location: 'Feeder 14 · Reidsville Loop',
    lines: [
      ...LINES(3, '55W-POLE', "55' Wood Pole, set & framed", 'Install', 1085.00, 'Roy Tanner'),
      LINE('W4-ACSR', '#4 ACSR Conductor', 'Install', 1800, 'FT', 0.95, 'Roy Tanner'),
      LINE('F2.12', '25kVA Single-Phase Transformer', 'Install', 1, 'EA', 1425.00, 'Roy Tanner'),
      ...LINES(2, '40W-POLE', "40' Wood Pole", 'Retire', 625.00, 'Roy Tanner'),
    ],
  },

  {
    id: 'WO-1050',
    no: '1050-WIRE',
    status: 'Complete',
    completedAt: D(5, 9),
    location: 'Feeder 14 · Westville Branch',
    lines: [
      ...LINES(2, '50W-POLE', "50' Wood Pole, set & framed", 'Install', 945.00, 'Hank Powell'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 1600, 'FT', 1.25, 'Hank Powell'),
      ...LINES(4, 'VE1-2', 'Single Crossarm Assembly', 'Install', 145.00, 'Hank Powell'),
      ...LINES(3, 'H1.1', 'Transfer 1ph Conductor', 'Transfer', 385.00, 'Hank Powell'),
    ],
  },

  // ---- Spec scenario WO: split-period logging across last week + this week ----
  // $1k logged Fri May 15 (last week), $2k logged Mon May 18 (this week, completed same day).
  // Expected behavior:
  //   • Ready to Invoice (cutoff = today) → shows full $3,000.
  //   • Ready to Invoice (cutoff = end of last week, May 16) → hidden.
  //   • WIP "Last Week" (May 10–16) → row with $1,000 earned (un-accrued back period).
  //   • WIP "This Week"  (May 17–23) → hidden (WO completed this week, graduates to Ready).
  {
    id: 'WO-1234',
    no: '1234-WIRE',
    status: 'Complete',
    completedAt: D(5, 18),
    location: 'Feeder 17 · Test Spur',
    lines: [
      LINE('40W-POLE','40\' Wood Pole, set & framed','Install', 1, 'EA',  300.00, 'Wesley Hilson'),  // pre-May 3 bucket
      LINE('H1.1',     'Transfer 1ph Conductor',     'Transfer',1, 'EA',  400.00, 'Wesley Hilson'),  // wk May 3–9 bucket
      LINE('C1.9NPP',  '45ft Class 4 Pole, framed',  'Install', 1, 'EA',  500.00, 'Wesley Hilson'),  // wk May 10–16 bucket
      LINE('VE1-2',    'Single Crossarm Assembly',   'Install', 1, 'EA',  500.00, 'Wesley Hilson'),  // wk May 10–16 bucket
      LINE('50W-POLE', "50' Wood Pole, set & framed",'Install', 1, 'EA', 1000.00, 'Wesley Hilson'),  // this week
      LINE('W1/0-ACSR','1/0 ACSR Conductor',         'Install', 800, 'FT', 1.25,  'Wesley Hilson'),  // this week
    ],
  },
];

// Assign per-line logged dates so the WIP/Ready/Invoiced tables can prove
// every shown unit was logged within its period.
assignDates(WORK_ORDERS[0], [D(5, 13), D(5, 14), D(5, 16), D(5, 17), D(5, 18), D(5, 19), D(5, 21)]); // WO-1045 spans prior week + current week
assignDates(WORK_ORDERS[1], [D(5, 18), D(5, 19), D(5, 20)]);                            // WO-1048 (in progress, this week)
assignDates(WORK_ORDERS[2], [D(5, 19), D(5, 20), D(5, 21)]);                            // WO-1049 (in progress, this week)
assignDates(WORK_ORDERS[3], [D(5, 17), D(5, 18), D(5, 19)]);                            // WO-1042 (completed 5/19)
assignDates(WORK_ORDERS[4], [D(5, 18), D(5, 19), D(5, 20)]);                            // WO-1043 (completed 5/20)
assignDates(WORK_ORDERS[5], [D(5, 19), D(5, 20), D(5, 21)]);                            // WO-1044 (completed 5/21)
assignDates(WORK_ORDERS[6], [D(5, 12), D(5, 13), D(5, 14)]);                            // WO-1046 (completed 5/14, last week)
assignDates(WORK_ORDERS[7], [D(5, 14), D(5, 15), D(5, 16)]);                            // WO-1047 (completed 5/16, last week)
assignDates(WORK_ORDERS[8], [D(5, 6), D(5, 7), D(5, 8), D(5, 9)]);                      // WO-1050 (completed 5/9, prior week)
// WO-1234 (multi-period scenario): one line from Pre-May 3 bucket ($300),
// one from May 3–9 bucket ($400), two from May 10–16 bucket ($1k), two from
// this week ($2k). Total $3,700; "Ready to accrue" surfaces $1,700.
assignDates(WORK_ORDERS[9], [D(5, 1), D(5, 7), D(5, 15), D(5, 15), D(5, 18), D(5, 18)]);

// Compute totals + crew list on each WO.
for (const wo of WORK_ORDERS) {
  wo.total = +wo.lines.reduce((s, l) => s + l.ext, 0).toFixed(2);
  wo.crews = Array.from(new Set(wo.lines.map((l) => l.crew)));
  wo.crew = wo.crews[0]; // primary
}

// ---- Historical invoiced WOs (prior runs). Carry line items so users can re-expand history. ----
const INVOICED_HISTORY = [
  {
    id: 'WO-1039', no: '1039-WIRE',
    completedAt: D(5, 15),
    invoicedOn: D(5, 16), through: D(5, 16),
    markedBy: 'Ben Glatt', markedAt: '2026-05-16T15:42:00',
    lines: [
      ...LINES(4, '50W-POLE',  "50' Wood Pole, set & framed", 'Install', 945.00, 'Hank Powell'),
      LINE('W1/0-ACSR', '1/0 ACSR Conductor', 'Install', 3200, 'FT', 1.25, 'Hank Powell'),
      ...LINES(10, 'VE1-2', 'Single Crossarm Assembly', 'Install', 145.00, 'Hank Powell'),
      ...LINES(6, 'H1.1', 'Transfer 1ph Conductor', 'Transfer', 385.00, 'Hank Powell'),
      ...LINES(2, '40W-POLE', "40' Wood Pole", 'Retire', 700.00, 'Hank Powell'),
      LINE('MAT-CLN', 'Material yard cleanup', 'Retire', 1, 'EA', 120.00, 'Hank Powell', false),
    ],
  },
  {
    id: 'WO-1040', no: '1040-WIRE',
    completedAt: D(5, 16),
    invoicedOn: D(5, 16), through: D(5, 16),
    markedBy: 'Ben Glatt', markedAt: '2026-05-16T15:43:00',
    lines: [
      ...LINES(5, '55W-POLE', "55' Wood Pole, set & framed", 'Install', 1085.00, 'Roy Tanner'),
      LINE('W4-ACSR', '#4 ACSR Conductor', 'Install', 2600, 'FT', 0.95, 'Hank Powell'),
      LINE('F2.12', '25kVA Single-Phase Transformer', 'Install', 1, 'EA', 1415.00, 'Hank Powell'),
    ],
  },
];
assignDates(INVOICED_HISTORY[0], [D(5, 13), D(5, 14), D(5, 15), D(5, 16)]);  // WO-1039
assignDates(INVOICED_HISTORY[1], [D(5, 14), D(5, 15), D(5, 16)]);            // WO-1040

for (const wo of INVOICED_HISTORY) {
  wo.total = +wo.lines.reduce((s, l) => s + l.ext, 0).toFixed(2);
  wo.crews = Array.from(new Set(wo.lines.map((l) => l.crew)));
  wo.crew = wo.crews[0];
  wo.cuCount = wo.lines.length;
}

const JOB = {
  name: 'Wiregrass EMC Distribution',
  shortName: 'Wiregrass 2026',
  contractType: 'Unit-Price',
  status: 'Active',
};

// ---- formatters ----
const fmtMoney = (n, opts = {}) => {
  const { dash0 = false } = opts;
  if (dash0 && (n === 0 || n == null)) return '—';
  const v = Math.abs(n);
  const s = v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n < 0 ? '−' : '') + '$' + s;
};
const fmtMoneyBig = (n) => '$ ' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtQty = (n) => n.toLocaleString('en-US');
const fmtDateLong = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
// "May 19" — compact form for inline use in dense tables.
const fmtDateShort = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
const fmtDateLongDow = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

// Billing period definitions. "Today" anchored at May 22, 2026.
const TODAY = D(5, 22);

// Earliest dated activity in the system — used as the All Time period start.
const _ALL_DATES = [
  ...WORK_ORDERS.map((w) => w.completedAt).filter(Boolean),
  ...INVOICED_HISTORY.map((w) => w.invoicedOn),
  ...INVOICED_HISTORY.map((w) => w.through),
].sort();
const FIRST_LOGGED = _ALL_DATES[0] || TODAY;

// Billing calendar (contract): Sun–Sat. Set on the Job/Contract record.
const BILLING_PERIODS = [
  { id: 'this',   label: 'This Week', start: D(5, 17), end: D(5, 23) },
  { id: 'last',   label: 'Last Week', start: D(5, 10), end: D(5, 16) },
  { id: 'all',    label: 'All Time',  start: FIRST_LOGGED, end: TODAY },
  { id: 'custom', label: 'Custom range…', start: D(5, 1), end: D(5, 31), custom: true },
];

// Accrual calendar (company setting). WIP uses a rolling-backlog model:
//   - "This Week" → current open period, can't accrue yet
//   - "Ready to accrue" → everything settled (last closed period AND every
//     prior un-accrued period). One stamp covers the backlog; the system
//     emits per-period accrual entries internally so the GL stays
//     period-accurate.
const ACCRUAL_PERIODS_SUN_SAT = [
  { id: 'ready', label: 'Ready to accrue', start: D(1, 1),  end: D(5, 16) },
  { id: 'this',  label: 'This Week',       start: D(5, 17), end: D(5, 23) },
];
const ACCRUAL_PERIODS_MON_SUN = [
  { id: 'ready', label: 'Ready to accrue', start: D(1, 1),  end: D(5, 17) },
  { id: 'this',  label: 'This Week',       start: D(5, 18), end: D(5, 24) },
];

// Compute the Sun–Sat week bucket a given log-date falls into. Used by both
// the WIP tooltip breakdown and the split-stamp accrual writer so every line
// books to its own natural week regardless of how far back it was logged.
const weekBucketFor = (iso) => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = dt.getDay(); // 0 = Sunday
  const start = new Date(y, m - 1, d - dow);
  const end = new Date(y, m - 1, d - dow + 6);
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (x) => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
  const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    id: `wk-${fmt(start)}`,
    start: fmt(start),
    end: fmt(end),
    label: `${MO[start.getMonth()]} ${start.getDate()} – ${MO[end.getMonth()]} ${end.getDate()}`,
  };
};

// helper: group line items by function in stable order
const groupLinesByFunction = (lines) => {
  const order = ['Install', 'Transfer', 'Retire', 'Retire'];
  const map = new Map();
  for (const l of lines) {
    if (!map.has(l.fn)) map.set(l.fn, []);
    map.get(l.fn).push(l);
  }
  return [...map.entries()].sort((a, b) => {
    const ai = order.indexOf(a[0]), bi = order.indexOf(b[0]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
};

// helper: summarize a function group — line count, crew breakdown, non-billable count, subtotal
const summarizeFunctionGroup = (items) => {
  const crewCounts = new Map();
  let nonBillable = 0;
  let subtotal = 0;
  for (const l of items) {
    crewCounts.set(l.crew, (crewCounts.get(l.crew) || 0) + 1);
    if (!l.billable) nonBillable += 1;
    subtotal += l.ext;
  }
  // Stable: order crews by descending count, ties by name
  const crews = [...crewCounts.entries()]
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
  return {
    count: items.length,
    crews,
    nonBillable,
    subtotal: +subtotal.toFixed(2),
  };
};

// ---- Accrual history (prior accrual snapshots). One row per WO per period. ----
// reversedBy points at the eventual invoice WO id if the accrual has been
// unwound; null otherwise.
const ACCRUAL_HISTORY = [
  // WO-1042 had partial earnings in the prior accrual week (May 10–16) before
  // being marked complete on May 19. The biller accrued $24,000 of the work at
  // last week's close. When this WO is now marked invoiced, the accrual will
  // be reversed and the variance will appear as a write-up (since the final
  // billed amount is higher than what was accrued).
  {
    id: 'ACC-WO-1042-2026-05-16',
    workOrderId: 'WO-1042', no: '1042-WIRE',
    crew: 'Wesley Hilson',
    crews: ['Wesley Hilson', 'Chete Howell'],
    amount: 12000.00,
    accruedOn: D(5, 18), accruedThrough: D(5, 16),
    markedBy: 'Ben Glatt', markedAt: '2026-05-18T09:14:00',
    reversedBy: null, reversedOn: null,
  },
];

Object.assign(window, {
  WORK_ORDERS, INVOICED_HISTORY, ACCRUAL_HISTORY, JOB,
  BILLING_PERIODS, ACCRUAL_PERIODS_SUN_SAT, ACCRUAL_PERIODS_MON_SUN,
  weekBucketFor, TODAY,
  CURRENT_USER, fmtTimestamp,
  fmtMoney, fmtMoneyBig, fmtQty, fmtDateLong, fmtDateLongDow, fmtDateShort,
  groupLinesByFunction, summarizeFunctionGroup, sumLinesInRange,
  CREW_INITIALS, crewColor,
});
