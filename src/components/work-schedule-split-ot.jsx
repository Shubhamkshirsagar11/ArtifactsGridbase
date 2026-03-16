import { useState, useMemo } from "react";

const HOURS_OPTIONS = [8, 10, 12, 14];

export default function WorkSchedule() {
  const [hoursPerDay, setHoursPerDay] = useState(10);
  const [weeklyHours, setWeeklyHours] = useState(50);
  const [otEnabled, setOtEnabled] = useState(true);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [payOtThreshold, setPayOtThreshold] = useState(45);
  const [billOtThreshold, setBillOtThreshold] = useState(40);
  const [unifiedOtThreshold, setUnifiedOtThreshold] = useState(40);

  const payThreshold = splitEnabled ? payOtThreshold : unifiedOtThreshold;
  const billThreshold = splitEnabled ? billOtThreshold : unifiedOtThreshold;

  const payST = otEnabled ? Math.min(payThreshold, weeklyHours) : weeklyHours;
  const payOT = otEnabled ? Math.max(0, weeklyHours - payThreshold) : 0;
  const billST = otEnabled ? Math.min(billThreshold, weeklyHours) : weeklyHours;
  const billOT = otEnabled ? Math.max(0, weeklyHours - billThreshold) : 0;

  const daysInWeek = weeklyHours > 0 ? Math.ceil(weeklyHours / hoursPerDay) : 0;

  // Generate day labels
  const dayLabels = Array.from({ length: daysInWeek }, (_, i) => `Day ${i + 1}`);

  // Build the visual bar segments
  function buildBarSegments(st, ot, total, stColor, otColor) {
    if (total === 0) return [];
    const segments = [];
    if (st > 0) segments.push({ hours: st, color: stColor, label: `${st}h ST` });
    if (ot > 0) segments.push({ hours: ot, color: otColor, label: `${ot}h OT` });
    return segments;
  }


  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-[820px] font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Work Schedule</h2>
        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
          <span className="text-[10px] text-gray-400">i</span>
        </div>
      </div>

      {/* Hours per day + Weekly hours */}
      <div className="flex items-start justify-between gap-8 mb-8">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Hours Per Day
          </label>
          <div className="flex gap-0">
            {HOURS_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => {
                  setHoursPerDay(h);
                  setWeeklyHours(h * 5);
                }}
                className={`
                  px-5 py-2.5 text-sm font-medium border transition-all
                  ${h === hoursPerDay
                    ? "bg-white text-blue-600 border-blue-500 ring-1 ring-blue-500 z-10 relative"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }
                  ${h === HOURS_OPTIONS[0] ? "rounded-l-lg" : ""}
                  ${h === HOURS_OPTIONS[HOURS_OPTIONS.length - 1] ? "rounded-r-lg" : ""}
                  ${h !== HOURS_OPTIONS[0] ? "-ml-px" : ""}
                `}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Weekly Hours
          </label>
          <input
            type="text"
            value={`${weeklyHours} hrs/wk`}
            readOnly
            className="px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg w-48"
          />
        </div>
      </div>

      {/* OT Rule Section */}
      <div className="border border-gray-200 rounded-xl p-5">
        {/* OT Toggle Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setOtEnabled(!otEnabled)}
              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                otEnabled ? "bg-blue-600" : "border-2 border-gray-300 bg-white"
              }`}
            >
              {otEnabled && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <div>
              <div className="text-sm font-semibold text-gray-900">Overtime Rule</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Hours exceeding the weekly ST threshold are paid and billed at the OT rate
              </div>
            </div>
          </div>

          {/* Unified threshold (when split is off) */}
          {otEnabled && !splitEnabled && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-gray-500">OT after</span>
              <input
                type="number"
                value={unifiedOtThreshold}
                onChange={(e) => setUnifiedOtThreshold(Math.max(0, Math.min(weeklyHours, parseInt(e.target.value) || 0)))}
                className="w-14 px-2 py-1.5 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">hrs/wk</span>
            </div>
          )}
        </div>

        {/* Split toggle */}
        {otEnabled && (
          <div className="mt-4 ml-8">
            <button
              onClick={() => setSplitEnabled(!splitEnabled)}
              className="flex items-center gap-2 group"
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                splitEnabled ? "bg-blue-600" : "border-2 border-gray-300 bg-white"
              }`}>
                {splitEnabled && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                Split pay & billing thresholds
              </span>
            </button>
          </div>
        )}

        {/* Split thresholds — each with its own bar underneath */}
        {otEnabled && splitEnabled && (
          <div className="mt-4 ml-8 space-y-4">
            {/* Pay section */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Pay</span>
                  <span className="text-xs text-gray-400">— what you pay employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">OT after</span>
                  <input
                    type="number"
                    value={payOtThreshold}
                    onChange={(e) => setPayOtThreshold(Math.max(0, Math.min(weeklyHours, parseInt(e.target.value) || 0)))}
                    className="w-14 px-2 py-1.5 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg text-center bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-500">hrs/wk</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xs font-semibold text-teal-600 tabular-nums">{payST}h ST</span>
                  {payOT > 0 && <span className="text-xs font-semibold text-amber-500 tabular-nums">{payOT}h OT</span>}
                  <span className="text-xs font-medium text-gray-400 ml-auto tabular-nums">{weeklyHours}h / week</span>
                </div>
                <BarVisualization
                  segments={buildBarSegments(payST, payOT, weeklyHours, "bg-teal-400", "bg-amber-400")}
                  total={weeklyHours}
                  hoursPerDay={hoursPerDay}
                />
              </div>
            </div>

            {/* Billing section */}
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Billing</span>
                  <span className="text-xs text-gray-400">— what you charge customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">OT after</span>
                  <input
                    type="number"
                    value={billOtThreshold}
                    onChange={(e) => setBillOtThreshold(Math.max(0, Math.min(weeklyHours, parseInt(e.target.value) || 0)))}
                    className="w-14 px-2 py-1.5 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg text-center bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-500">hrs/wk</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xs font-semibold text-teal-600 tabular-nums">{billST}h ST</span>
                  {billOT > 0 && <span className="text-xs font-semibold text-amber-500 tabular-nums">{billOT}h OT</span>}
                  <span className="text-xs font-medium text-gray-400 ml-auto tabular-nums">{weeklyHours}h / week</span>
                </div>
                <BarVisualization
                  segments={buildBarSegments(billST, billOT, weeklyHours, "bg-teal-400", "bg-amber-400")}
                  total={weeklyHours}
                  hoursPerDay={hoursPerDay}
                />
              </div>
            </div>

            {/* Shared day labels */}
            <div className="flex">
              {dayLabels.map((label, i) => (
                <div key={i} className="text-xs text-gray-400 text-center" style={{ width: `${100 / daysInWeek}%` }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unified bar (when not split) */}
        {otEnabled && !splitEnabled && (
          <div className="mt-6 ml-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-teal-600 tabular-nums">{payST}h ST</span>
              {payOT > 0 && <span className="text-xs font-semibold text-amber-500 tabular-nums">{payOT}h OT</span>}
            </div>
            <div className="flex items-center gap-0">
              <BarVisualization
                segments={buildBarSegments(payST, payOT, weeklyHours, "bg-teal-400", "bg-amber-400")}
                total={weeklyHours}
                hoursPerDay={hoursPerDay}
              />
              <span className="text-xs font-medium text-gray-500 ml-3 whitespace-nowrap tabular-nums">{weeklyHours}h / week</span>
            </div>
            <div className="flex mt-1">
              {dayLabels.map((label, i) => (
                <div key={i} className="text-xs text-gray-400 text-center" style={{ width: `${100 / daysInWeek}%` }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BarVisualization({ segments, total, hoursPerDay }) {
  if (total === 0 || segments.length === 0) return null;

  const numDays = Math.ceil(total / hoursPerDay);
  // Day divider positions as percentages (skip first and last)
  const dividers = [];
  for (let d = 1; d < numDays; d++) {
    dividers.push((d * hoursPerDay / total) * 100);
  }

  return (
    <div className="flex-1 flex h-9 rounded-lg overflow-hidden relative">
      {segments.map((seg, i) => {
        const widthPct = (seg.hours / total) * 100;
        return (
          <div
            key={i}
            className={`${seg.color} flex items-center justify-center transition-all duration-300`}
            style={{ width: `${widthPct}%` }}
          >
            <span className="text-[11px] font-semibold text-white drop-shadow-sm">
              {seg.label}
            </span>
          </div>
        );
      })}
      {dividers.map((pos, i) => (
        <div
          key={`div-${i}`}
          className="absolute top-0 bottom-0 w-px bg-white"
          style={{ left: `${pos}%`, opacity: 0.5 }}
        />
      ))}
    </div>
  );
}
