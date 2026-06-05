// Variation B — Multi-function selection with inline (non-stacking) QTY.
//
// Each Compatible Unit row supports:
//  - Multi-select function checkboxes (Install / Retire / Transfer)
//  - One QTY stepper per function, side-by-side (never stacks)
//  - Disabled function state with reason text (e.g. "No price configured")
//  - Stepping QTY below 1 auto-unchecks the function
//  - Same CU can be added multiple times for different Work Points
//
// Self-contained: no external component imports.

import React, { useState, useCallback } from "react";

/* ──────────────────────────  Types  ────────────────────────── */

type FunctionId = "install" | "retire" | "transfer";

interface FunctionDef {
  id: FunctionId;
  label: string;
}

interface LibraryEntry {
  id: string;
  code: string;
  desc: string;
  onWO?: boolean;
  /** Reasons keyed by function id for which the function is unavailable. */
  disabledFunctions?: Partial<Record<FunctionId, string>>;
}

interface CompletedRow {
  /** Unique per row — multiple rows can share the same `cuId`. */
  instanceId: string;
  cuId: string;
  code: string;
  desc: string;
  disabledFunctions: Partial<Record<FunctionId, string>>;
  /** Map of selected function id → qty. Absent key = unchecked. */
  selected: Partial<Record<FunctionId, number>>;
  workPoint?: string;
  pole?: string;
}

/* ──────────────────────────  Data  ────────────────────────── */

const FUNCTIONS: FunctionDef[] = [
  { id: "install", label: "Install-Default" },
  { id: "retire", label: "Retire-Default" },
  { id: "transfer", label: "Transfer-Default" },
];

const LIBRARY: LibraryEntry[] = [
  { id: "lib-fretire", code: '"F" Retire All ( Unscrew / Cut / Drive 18" below surface )', desc: '"F" Retire All ( Unscrew / Cut / Drive 18" bel...', onWO: false },
  { id: "lib-23strcu", code: "2-3 Str. Cu", desc: "2-3 Str. Cu", onWO: true },
  { id: "lib-2way", code: "2-Way Feed Sign", desc: "2-Way Feed Sign", onWO: true,
    disabledFunctions: { transfer: "No price configured" } },
  { id: "lib-30wood", code: "30' Wood Pole and Less", desc: "30' Wood Pole and Less", onWO: false },
  { id: "lib-35wood", code: "35' Wood Pole", desc: "35' Wood Pole", onWO: true },
  { id: "lib-40conc", code: "40' Concrete Pole", desc: "40' Concrete Pole", onWO: true },
  { id: "lib-40wood", code: "40' Wood Pole", desc: "40' Wood Pole", onWO: true },
];

/* ──────────────────────────  Root  ────────────────────────── */

export default function VariationB(): JSX.Element {
  const [completed, setCompleted] = useState<CompletedRow[]>([
    {
      instanceId: "i1",
      cuId: "lib-2way",
      code: "2-Way Feed Sign",
      desc: "2-Way Feed Sign",
      disabledFunctions: { transfer: "No price configured" },
      selected: { install: 1 },
    },
    {
      instanceId: "i2",
      cuId: "lib-30wood",
      code: "30' Wood Pole and Less",
      desc: "30' Wood Pole and Less",
      disabledFunctions: {},
      selected: { install: 1, retire: 2 },
    },
  ]);

  const toggleFn = useCallback((cuIdx: number, fnId: FunctionId) => {
    setCompleted((prev) =>
      prev.map((row, i) => {
        if (i !== cuIdx) return row;
        const next = { ...row.selected };
        if (fnId in next) delete next[fnId];
        else next[fnId] = 1;
        return { ...row, selected: next };
      })
    );
  }, []);

  const setQty = useCallback((cuIdx: number, fnId: FunctionId, qty: number) => {
    setCompleted((prev) =>
      prev.map((row, i) => {
        if (i !== cuIdx) return row;
        // Auto-uncheck the function if user steps below 1.
        if (qty < 1) {
          const next = { ...row.selected };
          delete next[fnId];
          return { ...row, selected: next };
        }
        return { ...row, selected: { ...row.selected, [fnId]: qty } };
      })
    );
  }, []);

  const removeRow = useCallback((cuIdx: number) => {
    setCompleted((prev) => prev.filter((_, i) => i !== cuIdx));
  }, []);

  // Library click ALWAYS adds a new instance (no dedupe).
  const addFromLibrary = useCallback((lib: LibraryEntry) => {
    setCompleted((prev) => [
      ...prev,
      {
        instanceId: "i" + (Date.now() + Math.random()),
        cuId: lib.id,
        code: lib.code,
        desc: lib.desc,
        disabledFunctions: lib.disabledFunctions ?? {},
        selected: { install: 1 },
      },
    ]);
  }, []);

  const instanceCounts = completed.reduce<Record<string, number>>((acc, r) => {
    acc[r.cuId] = (acc[r.cuId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      width: "100%", height: "100%", boxSizing: "border-box",
      background: "#fff", display: "flex", flexDirection: "column",
      fontFamily: '"Inter Tight", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    }}>
      <Header completedCount={completed.length} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <LibraryPane
          library={LIBRARY}
          instanceCounts={instanceCounts}
          onAdd={addFromLibrary}
        />
        <CompletedPane
          completed={completed}
          onToggleFn={toggleFn}
          onSetQty={setQty}
          onRemove={removeRow}
        />
      </div>
      <FooterBar completed={completed} />
    </div>
  );
}

/* ──────────────────────────  Header  ────────────────────────── */

function Header({ completedCount }: { completedCount: number }): JSX.Element {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 24px", borderBottom: "1px solid #ececea", background: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 8, border: "1px solid #ececea",
          background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
          color: "#1a1816",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          Back to WO
        </button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1816", letterSpacing: -0.2 }}>
            Add Compatible Units
          </div>
          <div style={{ fontSize: 12, color: "#75716c", marginTop: 2 }}>
            CU Library · 445 units
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#1a1816", fontWeight: 500 }}>
        {completedCount} units completed
      </div>
    </div>
  );
}

/* ──────────────────────────  Library  ────────────────────────── */

interface LibraryPaneProps {
  library: LibraryEntry[];
  instanceCounts: Record<string, number>;
  onAdd: (lib: LibraryEntry) => void;
}

function LibraryPane({ library, instanceCounts, onAdd }: LibraryPaneProps): JSX.Element {
  return (
    <div style={{
      width: 320, borderRight: "1px solid #ececea", background: "#fff",
      display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{ padding: 16, borderBottom: "1px solid #f3f2ef" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 8, border: "1px solid #ececea",
          background: "#fafaf9",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#bdb9b3" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M14 14l-3.5-3.5" />
          </svg>
          <span style={{ fontSize: 13, color: "#bdb9b3" }}>Search by CU code or description...</span>
        </div>
      </div>
      <div style={{ overflow: "auto", flex: 1 }}>
        {library.map((lib) => {
          const count = instanceCounts[lib.id] || 0;
          return (
            <button
              key={lib.id}
              onClick={() => onAdd(lib)}
              style={{
                display: "flex", gap: 10, padding: "10px 16px", width: "100%",
                borderTop: "none", borderLeft: "none", borderRight: "none",
                borderBottom: "1px solid #f3f2ef",
                background: count > 0 ? "#f0faf3" : "#fff",
                alignItems: "flex-start", textAlign: "left", cursor: "pointer",
                font: "inherit",
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                border: "1px solid #ececea", background: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "#75716c", marginTop: 1,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 2v8M2 6h8" />
                </svg>
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{
                    color: "#2563eb", fontWeight: 600, fontSize: 13,
                    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                    letterSpacing: -0.2,
                  }}>
                    {lib.code}
                  </span>
                  {lib.onWO && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "1px 6px",
                      borderRadius: 4, background: "#ececea", color: "#75716c",
                      letterSpacing: 0.4,
                    }}>ON WO</span>
                  )}
                  {count > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "1px 6px",
                      borderRadius: 999, background: "#1f9148", color: "#fff",
                      letterSpacing: 0.2,
                    }}>×{count} added</span>
                  )}
                </div>
                <div style={{
                  fontSize: 13, color: "#1a1816", marginTop: 2,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {lib.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────  Completed Pane  ────────────────────────── */

interface CompletedPaneProps {
  completed: CompletedRow[];
  onToggleFn: (cuIdx: number, fnId: FunctionId) => void;
  onSetQty: (cuIdx: number, fnId: FunctionId, qty: number) => void;
  onRemove: (cuIdx: number) => void;
}

function CompletedPane({ completed, onToggleFn, onSetQty, onRemove }: CompletedPaneProps): JSX.Element {
  return (
    <div style={{
      flex: 1, background: "#fafaf9",
      display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#75716c", letterSpacing: 0.6,
          textTransform: "uppercase",
        }}>
          Completed Units ({completed.length})
        </div>
        <button style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: "#dc2626", fontSize: 13, fontWeight: 500, font: "inherit",
        }}>
          Clear all
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px" }}>
        {completed.map((row, idx) => (
          <CompletedCard
            key={row.instanceId}
            row={row}
            onToggleFn={(fnId) => onToggleFn(idx, fnId)}
            onSetQty={(fnId, qty) => onSetQty(idx, fnId, qty)}
            onRemove={() => onRemove(idx)}
          />
        ))}
      </div>
    </div>
  );
}

interface CompletedCardProps {
  row: CompletedRow;
  onToggleFn: (fnId: FunctionId) => void;
  onSetQty: (fnId: FunctionId, qty: number) => void;
  onRemove: () => void;
}

function CompletedCard({ row, onToggleFn, onSetQty, onRemove }: CompletedCardProps): JSX.Element {
  return (
    <div style={{
      background: "#fff", border: "1px solid #ececea", borderRadius: 10,
      marginBottom: 12,
    }}>
      {/* Title row */}
      <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          color: "#2563eb", fontWeight: 600, fontSize: 15,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          letterSpacing: -0.2,
        }}>
          {row.code}
        </span>
        <span style={{ color: "#75716c", fontSize: 14 }}>{row.desc}</span>
        <button
          onClick={onRemove}
          style={{
            marginLeft: "auto", width: 28, height: 28, borderRadius: 6,
            border: "1px solid #ececea", background: "#fff", cursor: "pointer",
            color: "#75716c",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      </div>

      <div style={{ height: 1, background: "#f3f2ef" }} />

      {/* Form: FUNCTION+QTY combined into one block, then WP / Pole */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(560px, 1.7fr) minmax(170px, 1fr) minmax(170px, 1fr)",
        gap: 24, padding: "14px 18px 18px", alignItems: "start",
      }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <FieldLabel>Function & Qty Completed</FieldLabel>
            <span style={{ fontSize: 11, color: "#bdb9b3" }}>tick to log</span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${FUNCTIONS.length}, minmax(0, 1fr))`,
            gap: 8,
            border: "1px solid #ececea", borderRadius: 10, padding: 8,
            background: "#fafaf9",
          }}>
            {FUNCTIONS.map((fn) => {
              const disabledReason = row.disabledFunctions?.[fn.id];
              const checked = fn.id in row.selected;
              const qty = row.selected[fn.id] ?? 0;
              return (
                <FunctionQtyCell
                  key={fn.id}
                  label={fn.label}
                  checked={checked}
                  disabled={!!disabledReason}
                  disabledReason={disabledReason}
                  qty={qty}
                  onToggle={() => { if (!disabledReason) onToggleFn(fn.id); }}
                  onQty={(v) => onSetQty(fn.id, v)}
                />
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel required>Work Point</FieldLabel>
          <SelectInput placeholder="Type or select..." />
        </div>
        <div>
          <FieldLabel required>Pole #</FieldLabel>
          <SelectInput placeholder="Type or select..." />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────  Sub-components  ────────────────────────── */

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }): JSX.Element {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: "#75716c", letterSpacing: 0.6,
      textTransform: "uppercase", marginBottom: 8,
    }}>
      {children}
      {required && <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>}
    </div>
  );
}

interface FunctionQtyCellProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  disabledReason?: string;
  qty: number;
  onToggle: () => void;
  onQty: (v: number) => void;
}

function FunctionQtyCell({
  label, checked, disabled, disabledReason, qty, onToggle, onQty,
}: FunctionQtyCellProps): JSX.Element {
  const bg = disabled ? "#f3f2ef" : checked ? "#eff5ff" : "#fff";
  const border = disabled ? "#ececea" : checked ? "#2563eb" : "#ececea";
  const labelColor = disabled ? "#bdb9b3" : checked ? "#1d4ed8" : "#1a1816";

  return (
    <div style={{
      border: "1px solid " + border, borderRadius: 8, background: bg,
      padding: "8px 10px", opacity: disabled ? 0.85 : 1,
      display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
    }}>
      <button
        onClick={onToggle}
        disabled={disabled}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "transparent", border: "none", padding: 0,
          cursor: disabled ? "not-allowed" : "pointer", textAlign: "left",
          fontSize: 13, fontWeight: 500, color: labelColor, font: "inherit",
          textDecoration: disabled ? "line-through" : "none",
          textDecorationColor: "#d8d4cf",
          minWidth: 0, width: "100%",
        }}
      >
        <Checkbox checked={checked} disabled={disabled} />
        <span style={{
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{label}</span>
      </button>

      {disabled ? (
        <div style={{
          height: 30, display: "flex", alignItems: "center",
          fontSize: 12, color: "#bdb9b3", fontStyle: "italic", gap: 4,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="6" cy="6" r="4.5" />
            <path d="M6 4v2.5M6 8.5v.1" strokeLinecap="round" />
          </svg>
          {disabledReason}
        </div>
      ) : (
        <QtyStepperInline
          value={qty}
          dim={!checked}
          onChange={(v) => { if (checked) onQty(v); }}
        />
      )}
    </div>
  );
}

function Checkbox({ checked, disabled }: { checked: boolean; disabled: boolean }): JSX.Element {
  const border = disabled ? "#e8e6e2" : checked ? "#2563eb" : "#bdb9b3";
  const bg = disabled ? "#f3f2ef" : checked ? "#2563eb" : "#fff";
  return (
    <span style={{
      width: 14, height: 14, borderRadius: 3, border: "1.5px solid " + border,
      background: bg,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 5.2L4.2 7.4 8 3" />
        </svg>
      )}
    </span>
  );
}

function QtyStepperInline({
  value, dim, onChange,
}: { value: number; dim: boolean; onChange: (v: number) => void }): JSX.Element {
  return (
    <div style={{
      display: "inline-flex", alignSelf: "stretch", alignItems: "stretch",
      border: "1px solid #ececea", borderRadius: 6, overflow: "hidden",
      background: "#fff", height: 30, opacity: dim ? 0.45 : 1,
    }}>
      <button onClick={() => onChange(value - 1)} disabled={dim} style={qtyBtnStyle}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 5h6" />
        </svg>
      </button>
      <div style={{
        flex: 1, textAlign: "center",
        fontSize: 13, fontWeight: 700, color: "#1d4ed8",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderLeft: "1px solid #f3f2ef", borderRight: "1px solid #f3f2ef",
        minWidth: 0,
      }}>
        {value}
      </div>
      <button onClick={() => onChange(value + 1)} disabled={dim} style={qtyBtnStyle}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 2v6M2 5h6" />
        </svg>
      </button>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 26, background: "#fff", border: "none", cursor: "pointer",
  color: "#75716c",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

function SelectInput({ placeholder }: { placeholder: string }): JSX.Element {
  return (
    <div style={{
      padding: "8px 12px", borderRadius: 8, border: "1px solid #ececea",
      background: "#fff", fontSize: 13, color: "#bdb9b3",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span>{placeholder}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 4l2.5 2.5L7.5 4" />
      </svg>
    </div>
  );
}

/* ──────────────────────────  Footer  ────────────────────────── */

function FooterBar({ completed }: { completed: CompletedRow[] }): JSX.Element {
  const totalQty = completed.reduce(
    (s, r) => s + Object.values(r.selected).reduce((a, b) => a + (b ?? 0), 0),
    0
  );
  const missingFn = completed.some((r) => Object.keys(r.selected).length === 0);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", borderTop: "1px solid #ececea", background: "#fff",
    }}>
      <div style={{ fontSize: 13, color: "#1a1816" }}>
        <b>{completed.length} units completed</b>
        {missingFn && (
          <span style={{ color: "#dc2626", marginLeft: 8 }}>
            — select function for each
          </span>
        )}
      </div>
      <button style={{
        padding: "10px 16px", borderRadius: 8, border: "none",
        background: missingFn ? "#fed7aa" : "#ea580c",
        color: missingFn ? "#9a3412" : "#fff",
        fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit",
      }}>
        Add {totalQty} Units to WO
      </button>
    </div>
  );
}
