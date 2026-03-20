/**
 * UNIT PRICE P&L PROTOTYPE
 * ──────────────────────────────────────────────────────────────────────
 * This is a STANDALONE visual reference — not production code.
 * It demonstrates how the P&L step behaves for the Unit Price template.
 *
 * KEY DESIGN DECISION:
 * The weekly unit income is entered directly in the P&L table's revenue
 * row (Per Week column). Per Day and Total Job auto-derive from the
 * weekly input. This eliminates scroll tax — the user builds costs in
 * Steps 1–6, then enters their expected weekly income in the P&L and
 * instantly sees margin.
 *
 * DIFFERENCE FROM LUMP SUM:
 * ┌──────────────────────┬───────────────────────────┬───────────────────────────┐
 * │ Element              │ Lump Sum                  │ Unit Price                │
 * ├──────────────────────┼───────────────────────────┼───────────────────────────┤
 * │ Revenue row label    │ "Lump Sum Bid Amount"     │ "Unit Revenue"            │
 * │ Editable column      │ Total Job                 │ Per Week                  │
 * │ Per Day derivation   │ total / workingDays       │ perWeek / daysPerWeek     │
 * │ Per Week derivation  │ total / durationWeeks     │ USER INPUT                │
 * │ Total Job derivation │ USER INPUT                │ perWeek × durationWeeks   │
 * │ Data field           │ lumpSumAmount             │ weeklyUnitIncome          │
 * │ Everything else      │ Identical                 │ Identical                 │
 * └──────────────────────┴───────────────────────────┴───────────────────────────┘
 *
 * DATA STORAGE:
 * The weekly unit income is stored in `project_description.weeklyUnitIncome`
 * (string, parsed to number for calculations). Auto-saved via the existing
 * 3-second debounced PATCH mechanism. Even though the input lives in the
 * P&L step, the value is stored in project_description for consistency
 * with the data model.
 *
 * PROTOTYPE ONLY — Uses inline styles for portability. Production
 * implementation uses existing BEM CSS classes from styles.css.
 * ──────────────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";

/* ── Mock data representing a filled-out estimate ────────────────── */
const MOCK = {
  durationWeeks: 26,
  durationWorkingDays: 130,
  daysPerWeek: 5,
  hoursPerDay: 10,
  totalCrew: 12,
  equipmentUnits: 8,
  perDiemDays: 5,

  // Pre-computed costs (from Steps 1-6)
  daily: {
    laborCost: 5_280,
    perDiemCost: 900,
    equipCost: 2_640,
    burden: 1_478,
    overhead: 680,
  },
  weekly: {
    laborCost: 26_400,
    perDiemCost: 4_500,
    equipCost: 13_200,
    burden: 7_390,
    overhead: 3_400,
  },
  total: {
    laborCost: 686_400,
    perDiemCost: 117_000,
    equipCost: 343_200,
    burden: 192_140,
    overhead: 88_400,
  },

  // Burden breakdown
  laborBreakdown: {
    workersComp: { daily: 49, weekly: 243, total: 6_318 },
    benefits: { daily: 285, weekly: 1_426, total: 37_076 },
    payrollTax: { daily: 432, weekly: 2_159, total: 56_134 },
  },

  // Equipment breakdown
  equipBreakdown: {
    internal: { daily: 1_980, weekly: 9_900, total: 257_400 },
    fuel: { daily: 660, weekly: 3_300, total: 85_800 },
  },

  // Overhead breakdown
  overheadBreakdown: {
    revPctLabel: "12%",
    fixedWeeklyTotal: 947.5,
  },
};

/* ── Formatting helpers (match production format.ts) ─────────────── */
const fmt = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

const fmtK = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + Math.round(n).toLocaleString("en-US");
};

const pctStr = (profit, revenue) =>
  revenue > 0 ? ((profit / revenue) * 100).toFixed(1) + "%" : "—";

/* ── Shared styles (inline for prototype portability) ────────────── */
const FONT_MONO = "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace";
const FONT_INTER = "'Inter', -apple-system, sans-serif";
const COLOR = {
  dark: "#0f172a",
  muted: "#64748b",
  positive: "#4eb6ad",
  negative: "#dc2626",
  emerald500: "#10b981",
  emerald50: "#ecfdf5",
  emerald700: "#047857",
  blue: "#1e40af",
  blueBg: "#eff6ff",
  border: "#e2e8f0",
  headerBg: "#f8fafc",
  subBg: "#fafbfc",
};

/* ════════════════════════════════════════════════════════════════════
 *  MAIN PROTOTYPE COMPONENT
 * ════════════════════════════════════════════════════════════════════ */
export default function UnitPricePnLPrototype() {
  const [weeklyUnitIncome, setWeeklyUnitIncome] = useState("17308");
  const [equipExpanded, setEquipExpanded] = useState(false);
  const [burdenExpanded, setBurdenExpanded] = useState(false);

  const weeklyAmount = parseFloat(weeklyUnitIncome) || 0;

  /* ── Derived revenue (auto-calculated from Per Week input) ──────
   *
   * KEY DIFFERENCE FROM LUMP SUM:
   * - Lump Sum: user enters Total Job → Per Day/Per Week derived
   * - Unit Price: user enters Per Week → Per Day/Total Job derived
   *
   * ────────────────────────────────────────────────────────────── */
  const revenue = useMemo(() => ({
    daily: MOCK.daysPerWeek > 0 ? weeklyAmount / MOCK.daysPerWeek : 0,
    weekly: weeklyAmount,
    total: weeklyAmount * MOCK.durationWeeks,
  }), [weeklyAmount]);

  /* ── Total costs per period ────────────────────────────────────── */
  const totalCost = {
    daily: MOCK.daily.laborCost + MOCK.daily.perDiemCost + MOCK.daily.equipCost + MOCK.daily.burden + MOCK.daily.overhead,
    weekly: MOCK.weekly.laborCost + MOCK.weekly.perDiemCost + MOCK.weekly.equipCost + MOCK.weekly.burden + MOCK.weekly.overhead,
    total: MOCK.total.laborCost + MOCK.total.perDiemCost + MOCK.total.equipCost + MOCK.total.burden + MOCK.total.overhead,
  };

  const directCost = {
    daily: MOCK.daily.laborCost + MOCK.daily.perDiemCost + MOCK.daily.equipCost,
    weekly: MOCK.weekly.laborCost + MOCK.weekly.perDiemCost + MOCK.weekly.equipCost,
    total: MOCK.total.laborCost + MOCK.total.perDiemCost + MOCK.total.equipCost,
  };

  /* ── Profit calculations ───────────────────────────────────────── */
  const grossProfit = {
    daily: revenue.daily - directCost.daily - MOCK.daily.burden,
    weekly: revenue.weekly - directCost.weekly - MOCK.weekly.burden,
    total: revenue.total - directCost.total - MOCK.total.burden,
  };

  const netProfit = {
    daily: revenue.daily - totalCost.daily,
    weekly: revenue.weekly - totalCost.weekly,
    total: revenue.total - totalCost.total,
  };

  const netMarginPct = revenue.total > 0 ? netProfit.total / revenue.total : 0;
  const totalManhours = MOCK.totalCrew * MOCK.hoursPerDay * MOCK.daysPerWeek * MOCK.durationWeeks;

  /* ── Profit color helper ───────────────────────────────────────── */
  const profitColor = (val) => val >= 0 ? COLOR.positive : COLOR.negative;

  /* ════════════════════════════════════════════════════════════════
   *  RENDER
   * ════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: FONT_INTER }}>
      {/* Section header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 16px", background: COLOR.headerBg,
        border: `1px solid ${COLOR.border}`, borderRadius: "8px 8px 0 0",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLOR.dark }}>
            Project P&L
          </div>
          <div style={{ fontSize: 11, color: COLOR.muted, marginTop: 2 }}>
            Unit revenue vs. estimated costs
          </div>
        </div>
        {/* Rate Sheet button is HIDDEN for Unit Price — no billing rates to export */}
      </div>

      <div style={{
        border: `1px solid ${COLOR.border}`, borderTop: "none",
        borderRadius: "0 0 8px 8px", background: "#fff", padding: 20,
      }}>

        {/* ─── SUMMARY CARDS ROW 1 ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 12 }}>
          <SummaryCard
            label="Total Revenue"
            value={fmtK(revenue.total)}
            bg={COLOR.blueBg}
            valueColor={COLOR.blue}
          />
          <SummaryCard
            label="Gross Profit"
            value={fmtK(grossProfit.total)}
            bg={grossProfit.total >= 0 ? COLOR.emerald50 : "#fef2f2"}
            valueColor={profitColor(grossProfit.total)}
          />
          <SummaryCard
            label="Net Profit"
            value={fmtK(netProfit.total)}
            bg={netProfit.total >= 0 ? COLOR.emerald50 : "#fef2f2"}
            valueColor={profitColor(netProfit.total)}
          />
          <SummaryCard
            label="Net Margin"
            value={(netMarginPct * 100).toFixed(1) + "%"}
            bg={netMarginPct >= 0 ? COLOR.emerald50 : "#fef2f2"}
            valueColor={profitColor(netMarginPct)}
          />
        </div>

        {/* ─── SUMMARY CARDS ROW 2 ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <SummaryCardSmall
            label="Revenue / Manhour"
            value={totalManhours > 0 ? fmt(revenue.total / totalManhours) : "—"}
            valueColor={COLOR.blue}
          />
          <SummaryCardSmall
            label="Cost / Manhour"
            value={totalManhours > 0 ? fmt(totalCost.total / totalManhours) : "—"}
            valueColor={COLOR.negative}
          />
          <SummaryCardSmall
            label="Profit / Manhour"
            value={totalManhours > 0 ? fmt(netProfit.total / totalManhours) : "—"}
            valueColor={profitColor(netProfit.total)}
          />
          <SummaryCardSmall
            label="Total Manhours"
            value={totalManhours.toLocaleString()}
            valueColor={COLOR.muted}
          />
        </div>

        {/* ─── P&L TABLE ────────────────────────────────────────── */}
        <div style={{ border: `1px solid ${COLOR.border}`, borderRadius: 8, overflow: "hidden" }}>

          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr",
            background: COLOR.headerBg, borderBottom: `1px solid ${COLOR.border}`,
            padding: "8px 16px",
          }}>
            <div />
            <HeaderCell>Per Day</HeaderCell>
            <HeaderCell>Per Week</HeaderCell>
            <HeaderCell>Total Job</HeaderCell>
          </div>

          {/* ═══ REVENUE: Editable unit revenue row ═══════════════
           *
           * THIS IS THE KEY CHANGE FROM LUMP SUM:
           * - Lump Sum: editable input in Total Job column
           * - Unit Price: editable input in Per Week column
           * - Per Day = weeklyUnitIncome / daysPerWeek (auto-derived)
           * - Total Job = weeklyUnitIncome × durationWeeks (auto-derived)
           *
           * ═══════════════════════════════════════════════════════ */}
          <div style={{
            display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr",
            padding: "12px 16px",
            background: weeklyAmount > 0 ? "rgba(16, 185, 129, 0.03)" : "transparent",
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: COLOR.dark,
              fontFamily: FONT_INTER, display: "flex", alignItems: "center",
            }}>
              Unit Revenue
            </div>

            {/* Per Day — auto-derived, read-only */}
            <Cell color={COLOR.muted}>
              {weeklyAmount > 0 ? fmt(revenue.daily) : "—"}
            </Cell>

            {/* Per Week — EDITABLE INPUT */}
            <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center",
                border: `1.5px solid ${weeklyAmount > 0 ? COLOR.emerald500 + "55" : "#d1d5db"}`,
                borderRadius: 6, padding: "4px 10px",
                background: weeklyAmount > 0 ? COLOR.emerald50 : "#fafafa",
                transition: "border-color 0.15s, background 0.15s",
                maxWidth: 180,
              }}>
                <span style={{
                  fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600,
                  color: COLOR.emerald700, marginRight: 2,
                }}>$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={weeklyUnitIncome ? Number(weeklyUnitIncome).toLocaleString("en-US") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setWeeklyUnitIncome(raw);
                  }}
                  placeholder="0"
                  style={{
                    border: "none", outline: "none", background: "transparent",
                    fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600,
                    color: COLOR.dark, textAlign: "right",
                    width: "100%", minWidth: 60,
                  }}
                />
              </div>
            </div>

            {/* Total Job — auto-derived, read-only */}
            <Cell color={COLOR.muted}>
              {weeklyAmount > 0 ? fmt(revenue.total) : "—"}
            </Cell>
          </div>

          <Divider />

          {/* ═══ COSTS (identical to T&E and Lump Sum) ═════════════ */}
          <Row label="Wages (ST + OT)" values={[MOCK.daily.laborCost, MOCK.weekly.laborCost, MOCK.total.laborCost]} color={COLOR.muted} />
          <Row label="Per Diem Cost" values={[MOCK.daily.perDiemCost, MOCK.weekly.perDiemCost, MOCK.total.perDiemCost]} color={COLOR.muted} />
          <Row
            label="Equipment Cost"
            values={[MOCK.daily.equipCost, MOCK.weekly.equipCost, MOCK.total.equipCost]}
            color={COLOR.muted}
            expandable expanded={equipExpanded}
            onToggle={() => setEquipExpanded(p => !p)}
          />
          {equipExpanded && (
            <>
              <SubRow label="Internal Unit Cost" values={[MOCK.equipBreakdown.internal.daily, MOCK.equipBreakdown.internal.weekly, MOCK.equipBreakdown.internal.total]} />
              <SubRow label="Fuel Cost" values={[MOCK.equipBreakdown.fuel.daily, MOCK.equipBreakdown.fuel.weekly, MOCK.equipBreakdown.fuel.total]} />
            </>
          )}
          <Row label="Total Direct Cost" values={[directCost.daily, directCost.weekly, directCost.total]} bold color={COLOR.muted} />

          <Divider />

          {/* ═══ BURDEN ═══════════════════════════════════════════ */}
          <Row
            label="Labor Burden"
            values={[MOCK.daily.burden, MOCK.weekly.burden, MOCK.total.burden]}
            color={COLOR.muted}
            expandable expanded={burdenExpanded}
            onToggle={() => setBurdenExpanded(p => !p)}
          />
          {burdenExpanded && (
            <>
              <SubRow label="Workers' Comp (0.92%)" values={[MOCK.laborBreakdown.workersComp.daily, MOCK.laborBreakdown.workersComp.weekly, MOCK.laborBreakdown.workersComp.total]} />
              <SubRow label="Benefits (5.40%)" values={[MOCK.laborBreakdown.benefits.daily, MOCK.laborBreakdown.benefits.weekly, MOCK.laborBreakdown.benefits.total]} />
              <SubRow label="Payroll Taxes (8.18%)" values={[MOCK.laborBreakdown.payrollTax.daily, MOCK.laborBreakdown.payrollTax.weekly, MOCK.laborBreakdown.payrollTax.total]} />
            </>
          )}

          <Divider />

          {/* ═══ GROSS PROFIT ═════════════════════════════════════ */}
          <Row label="Gross Profit" values={[grossProfit.daily, grossProfit.weekly, grossProfit.total]} bold color={profitColor(grossProfit.total)} />
          <Row label="Gross Margin" textValues={[pctStr(grossProfit.daily, revenue.daily), pctStr(grossProfit.weekly, revenue.weekly), pctStr(grossProfit.total, revenue.total)]} italic color={profitColor(grossProfit.total)} />

          <Divider />

          {/* ═══ OVERHEAD ═════════════════════════════════════════ */}
          <Row label={`Overhead \u2014 % of Revenue (${MOCK.overheadBreakdown.revPctLabel})`} values={[MOCK.daily.overhead - (MOCK.overheadBreakdown.fixedWeeklyTotal / MOCK.daysPerWeek), MOCK.weekly.overhead - MOCK.overheadBreakdown.fixedWeeklyTotal, MOCK.total.overhead - (MOCK.overheadBreakdown.fixedWeeklyTotal * MOCK.durationWeeks)]} color={COLOR.muted} />
          <Row label="Overhead \u2014 Weekly Fixed" values={[MOCK.overheadBreakdown.fixedWeeklyTotal / MOCK.daysPerWeek, MOCK.overheadBreakdown.fixedWeeklyTotal, MOCK.overheadBreakdown.fixedWeeklyTotal * MOCK.durationWeeks]} color={COLOR.muted} />
          <Row label="Total Overhead" values={[MOCK.daily.overhead, MOCK.weekly.overhead, MOCK.total.overhead]} bold color={COLOR.muted} />

          <Divider />

          {/* ═══ NET PROFIT ═══════════════════════════════════════ */}
          <Row label="Net Profit" values={[netProfit.daily, netProfit.weekly, netProfit.total]} bold color={profitColor(netProfit.total)} />
          <Row label="Net Margin" textValues={[pctStr(netProfit.daily, revenue.daily), pctStr(netProfit.weekly, revenue.weekly), pctStr(netProfit.total, revenue.total)]} italic color={profitColor(netProfit.total)} />
        </div>

        {/* ─── FOOTER ───────────────────────────────────────────── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "8px 20px",
          marginTop: 16, padding: "10px 0",
          fontSize: 11, color: COLOR.muted, fontFamily: FONT_INTER,
        }}>
          <span><strong>Duration:</strong> {MOCK.durationWeeks} wks</span>
          <span><strong>Schedule:</strong> {MOCK.daysPerWeek}d x {MOCK.hoursPerDay}h = {MOCK.daysPerWeek * MOCK.hoursPerDay}h/wk</span>
          <span><strong>Crew:</strong> {MOCK.totalCrew} workers</span>
          <span><strong>Equipment:</strong> {MOCK.equipmentUnits} units</span>
          <span><strong>Per Diem:</strong> {MOCK.perDiemDays} days/wk</span>
          <span><strong>Overhead:</strong> {fmtK(MOCK.weekly.overhead)}/wk</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENTS (inline for prototype portability)
 * ════════════════════════════════════════════════════════════════════ */

function SummaryCard({ label, value, bg, valueColor }) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 8, background: bg,
      border: `1px solid ${COLOR.border}`,
    }}>
      <div style={{ fontSize: 11, color: COLOR.muted, fontFamily: FONT_INTER, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: valueColor, fontFamily: FONT_MONO }}>{value}</div>
    </div>
  );
}

function SummaryCardSmall({ label, value, valueColor }) {
  return (
    <div style={{
      padding: "10px 16px", borderRadius: 8,
      border: `1px solid ${COLOR.border}`,
    }}>
      <div style={{ fontSize: 10, color: COLOR.muted, fontFamily: FONT_INTER, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: valueColor, fontFamily: FONT_MONO }}>{value}</div>
    </div>
  );
}

function HeaderCell({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: COLOR.muted,
      textTransform: "uppercase", letterSpacing: "0.08em",
      textAlign: "right", fontFamily: FONT_INTER,
    }}>
      {children}
    </div>
  );
}

function Cell({ children, color = COLOR.dark, bold = false }) {
  return (
    <div style={{
      fontFamily: FONT_MONO, fontSize: 13, fontWeight: bold ? 700 : 500,
      color, textAlign: "right",
    }}>
      {children}
    </div>
  );
}

function Row({ label, values, textValues, bold, italic, color = COLOR.dark, expandable, expanded, onToggle }) {
  const displayValues = textValues || values?.map(v => fmt(v)) || [];
  return (
    <div
      onClick={onToggle}
      role={onToggle ? "button" : undefined}
      style={{
        display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr",
        padding: "10px 16px",
        cursor: onToggle ? "pointer" : "default",
        ...(onToggle ? { ":hover": { background: COLOR.headerBg } } : {}),
      }}
    >
      <div style={{
        fontSize: 13, fontWeight: bold ? 700 : 400, color,
        fontStyle: italic ? "italic" : "normal",
        fontFamily: FONT_INTER, display: "flex", alignItems: "center", gap: 4,
      }}>
        {expandable && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>
            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {label}
      </div>
      {displayValues.map((v, i) => (
        <Cell key={i} color={color} bold={bold}>
          {italic ? <em>{v}</em> : v}
        </Cell>
      ))}
    </div>
  );
}

function SubRow({ label, values }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr",
      padding: "7px 36px", background: COLOR.subBg,
    }}>
      <div style={{ fontSize: 12, fontWeight: 400, color: COLOR.muted, fontFamily: FONT_INTER }}>
        {label}
      </div>
      {values.map((v, i) => (
        <div key={i} style={{
          fontFamily: FONT_MONO, fontSize: 12, fontWeight: 400,
          color: "#94a3b8", textAlign: "right",
        }}>
          {fmt(v)}
        </div>
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${COLOR.border}` }} />;
}
