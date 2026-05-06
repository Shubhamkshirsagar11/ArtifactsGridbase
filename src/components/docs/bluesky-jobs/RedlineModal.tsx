/**
 * RedlineModal.tsx
 * ---------------------------------------------------------------------------
 * Modal for creating, editing, and removing a redline on a Compatible Unit.
 *
 * Conceptual model (see schema design doc for full context):
 *   - A redline is a CU-level record reconciling planned qty vs. logged qty.
 *   - One redline per CU. Re-opening this modal edits the existing one.
 *   - The deviation type (net_new / qty_up / qty_down) is DERIVED from
 *     plannedQty and totalQty. It is not a user-selected value.
 *   - Variance = totalQty − plannedQty. When variance hits 0, the redline
 *     is meaningless and the parent should not allow Save (this component
 *     enforces that by disabling the button).
 *   - This component is presentational. It does not write to the database.
 *     The parent owns persistence via onSave, onRemove, and onClose.
 *
 * Styling: inline style objects, no external dependencies. Drop in anywhere;
 * adapt to your styling system (Tailwind / CSS modules / styled-components)
 * as needed. Color tokens are defined as constants at the top.
 * ---------------------------------------------------------------------------
 */

import React, { useEffect, useState, type CSSProperties } from "react";

// ============================================================================
// Types
// ============================================================================

export type CUFunction = "Install" | "Remove" | "Transfer";

export type CompatibleUnit = {
  id: string;
  code: string;
  function: CUFunction;
};

/**
 * The currently-active redline on a CU, if any. Pass `undefined` when no
 * redline exists (the modal opens in "create" mode).
 */
export type ExistingRedline = {
  plannedQty: number;
  reason: string;
};

/**
 * Payload passed to `onSave`. The deviation type is derived on the backend
 * from plannedQty and the current total logged qty; no need to send it.
 */
export type RedlinePayload = {
  plannedQty: number;
  reason: string;
};

export type RedlineModalProps = {
  open: boolean;
  cu: CompatibleUnit;
  /** Sum of qty_delta across non-deleted work_log_entries for this CU. */
  totalQty: number;
  /** If present, the modal opens in "edit" mode and pre-fills the form. */
  existingRedline?: ExistingRedline;
  onClose: () => void;
  /** Called when the user saves. Should write to redline_events + UPDATE compatible_units in one txn. */
  onSave: (payload: RedlinePayload) => void | Promise<void>;
  /** Called when the user clicks "Remove redline." Should write a 'removed' event + clear redline columns. */
  onRemove?: () => void | Promise<void>;
};

type VarianceState = "none" | "net_new" | "qty_up" | "qty_down";

// ============================================================================
// Derivation helpers
// ============================================================================

export function computeVarianceState(plannedQty: number, totalQty: number): VarianceState {
  const variance = totalQty - plannedQty;
  if (variance === 0) return "none";
  if (plannedQty === 0) return "net_new";
  return variance > 0 ? "qty_up" : "qty_down";
}

function formatVariance(v: number): string {
  if (v === 0) return "0";
  return v > 0 ? `+${v}` : `${v}`;
}

const VARIANCE_CONFIG: Record<VarianceState, { label: string; caption: string; tone: "up" | "down" | "neutral" }> = {
  net_new: { label: "NET NEW", caption: "Wasn't on the WO at all", tone: "up" },
  qty_up: { label: "↑ QTY UP", caption: "More performed than WO called for", tone: "up" },
  qty_down: { label: "↓ QTY DOWN", caption: "Less performed than WO called for", tone: "down" },
  none: { label: "NO VARIANCE", caption: "WO matches logged quantity — no redline needed", tone: "neutral" },
};

// ============================================================================
// Color tokens (override or replace with your design system)
// ============================================================================

const C = {
  text: "#1a1a1a",
  textSecondary: "#555",
  textTertiary: "#888",
  border: "rgba(0,0,0,0.14)",
  borderLight: "rgba(0,0,0,0.08)",
  surface: "#ffffff",
  surfaceMuted: "#F8F8F6",
  blue: "#185FA5",
  green: "#3B6D11",
  red: "#791F1F",
  redLight: "#FCEBEB",
  orange: "#E76F51",
  orangeHover: "#D85A30",
  orangeText: "#854F0B",
  orangeBorder: "#BA7517",
  orangeLight: "#FAEEDA",
};

// ============================================================================
// Reusable style fragments
// ============================================================================

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  } satisfies CSSProperties,

  modal: {
    background: C.surface,
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 540,
    maxHeight: "90vh",
    overflowY: "auto" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", sans-serif',
    color: C.text,
  } satisfies CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  } satisfies CSSProperties,

  title: {
    fontSize: 17,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  } satisfies CSSProperties,

  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: 22,
    cursor: "pointer",
    color: C.textTertiary,
    lineHeight: 1,
    padding: 4,
  } satisfies CSSProperties,

  subtitle: {
    fontFamily: '"SF Mono", Menlo, Consolas, monospace',
    fontSize: 13,
    color: C.blue,
    marginBottom: 12,
  } satisfies CSSProperties,

  info: {
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 18,
  } satisfies CSSProperties,

  editBanner: {
    background: C.orangeLight,
    border: "1px solid rgba(232, 111, 81, 0.3)",
    borderRadius: 8,
    padding: "10px 12px",
    marginBottom: 16,
    fontSize: 12,
    color: C.orangeText,
    lineHeight: 1.5,
  } satisfies CSSProperties,

  bannerTitle: {
    fontWeight: 600,
    marginBottom: 2,
  } satisfies CSSProperties,

  removeLink: {
    color: C.red,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "underline",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "inherit",
    fontFamily: "inherit",
  } satisfies CSSProperties,

  variancePanel: (tone: "up" | "down" | "neutral"): CSSProperties => ({
    border: "1px solid",
    borderColor:
      tone === "up"
        ? "rgba(232, 111, 81, 0.25)"
        : tone === "down"
        ? "rgba(224, 75, 74, 0.25)"
        : C.borderLight,
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
    background:
      tone === "up" ? C.orangeLight : tone === "down" ? C.redLight : C.surfaceMuted,
  }),

  varianceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "18px 0 16px",
    position: "relative" as const,
  } satisfies CSSProperties,

  varianceDivider: {
    position: "absolute" as const,
    left: "50%",
    top: 16,
    bottom: 16,
    width: 1,
    background: "rgba(0,0,0,0.08)",
    transform: "translateX(-50%)",
  } satisfies CSSProperties,

  varianceArrow: {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: C.surface,
    border: "1px solid rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.orange,
    fontSize: 14,
    zIndex: 1,
  } satisfies CSSProperties,

  varianceSide: {
    textAlign: "center" as const,
    padding: "0 16px",
  } satisfies CSSProperties,

  varianceSideLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: C.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  } satisfies CSSProperties,

  varianceNumber: (editable: boolean, tone: "up" | "down" | "neutral"): CSSProperties => ({
    fontSize: 56,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 14,
    fontFeatureSettings: '"tnum"',
    color:
      editable && tone === "up"
        ? C.orangeHover
        : editable && tone === "down"
        ? C.red
        : C.text,
  }),

  stepperGroup: {
    display: "inline-flex",
    gap: 6,
  } satisfies CSSProperties,

  stepperBtn: {
    width: 36,
    height: 32,
    border: "1px solid rgba(0,0,0,0.15)",
    background: C.surface,
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
    color: C.text,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
  } satisfies CSSProperties,

  readonlyLabel: {
    fontSize: 11,
    color: C.textTertiary,
    fontStyle: "italic" as const,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } satisfies CSSProperties,

  varianceFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "9px 14px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  } satisfies CSSProperties,

  variancePill: (tone: "up" | "down" | "neutral"): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    background: "rgba(255,255,255,0.7)",
    color:
      tone === "up" ? C.orangeHover : tone === "down" ? C.red : C.textTertiary,
    border:
      tone === "up"
        ? "1px solid rgba(232, 111, 81, 0.4)"
        : tone === "down"
        ? "1px solid rgba(121, 31, 31, 0.3)"
        : `1px solid ${C.border}`,
  }),

  varianceAmount: (tone: "up" | "down" | "neutral"): CSSProperties => ({
    fontSize: 18,
    fontWeight: 700,
    marginLeft: 8,
    fontFeatureSettings: '"tnum"',
    color:
      tone === "up" ? C.orangeHover : tone === "down" ? C.red : C.textTertiary,
  }),

  varianceCaption: {
    fontSize: 12,
    color: C.textSecondary,
    margin: "0 0 18px",
  } satisfies CSSProperties,

  formLabel: (error: boolean): CSSProperties => ({
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: error ? C.orangeHover : C.text,
  }),

  textarea: (error: boolean): CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    border: error ? `1px solid ${C.orangeBorder}` : "1px solid rgba(0,0,0,0.14)",
    outline: "none",
    borderRadius: 8,
    fontFamily: "inherit",
    fontSize: 13,
    background: C.surface,
    minHeight: 64,
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
  }),

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    borderTop: "1px solid rgba(0,0,0,0.08)",
    marginTop: 16,
  } satisfies CSSProperties,

  footerLeft: {
    flex: 1,
  } satisfies CSSProperties,

  btn: (variant: "default" | "primary" | "ghost-danger" = "default", disabled = false): CSSProperties => ({
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    border:
      variant === "primary"
        ? `1px solid ${C.orange}`
        : variant === "ghost-danger"
        ? "1px solid transparent"
        : "1px solid rgba(0,0,0,0.14)",
    background:
      variant === "primary"
        ? C.orange
        : variant === "ghost-danger"
        ? "transparent"
        : C.surface,
    color:
      variant === "primary"
        ? "#fff"
        : variant === "ghost-danger"
        ? C.red
        : C.text,
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  }),
};

// ============================================================================
// Lock icon
// ============================================================================

const LockIcon = () => (
  <svg width={10} height={11} viewBox="0 0 10 11" fill="currentColor" aria-hidden="true" style={{ opacity: 0.6 }}>
    <path d="M5 0a3 3 0 00-3 3v1H1.5a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-6a.5.5 0 00-.5-.5H8V3a3 3 0 00-3-3zm-2 4V3a2 2 0 014 0v1H3z" />
  </svg>
);

// ============================================================================
// Component
// ============================================================================

export function RedlineModal({
  open,
  cu,
  totalQty,
  existingRedline,
  onClose,
  onSave,
  onRemove,
}: RedlineModalProps) {
  const isEdit = !!existingRedline;

  const [plannedQty, setPlannedQty] = useState<number>(existingRedline?.plannedQty ?? 0);
  const [reason, setReason] = useState<string>(existingRedline?.reason ?? "");
  const [reasonError, setReasonError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Reset local state every time the modal opens for a new CU/redline.
  useEffect(() => {
    if (!open) return;
    setPlannedQty(existingRedline?.plannedQty ?? 0);
    setReason(existingRedline?.reason ?? "");
    setReasonError(false);
    setSaving(false);
  }, [open, cu.id, existingRedline?.plannedQty, existingRedline?.reason]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const variance = totalQty - plannedQty;
  const state = computeVarianceState(plannedQty, totalQty);
  const cfg = VARIANCE_CONFIG[state];
  const canSave = variance !== 0;

  const bumpPlanned = (delta: number) => setPlannedQty((q) => Math.max(0, q + delta));

  async function handleSave() {
    if (!reason.trim()) {
      setReasonError(true);
      return;
    }
    if (variance === 0) return;
    setSaving(true);
    try {
      await onSave({ plannedQty, reason: reason.trim() });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!onRemove) return;
    if (!window.confirm("Remove this redline? The audit trail will be preserved.")) return;
    setSaving(true);
    try {
      await onRemove();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="redline-modal-title">
        <div style={styles.header}>
          <div id="redline-modal-title" style={styles.title}>
            ✎ {isEdit ? "Edit Redline" : "Log Scope Change"}
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div style={styles.subtitle}>
          {cu.code} <span style={{ color: C.textTertiary }}>{cu.function}</span>
        </div>

        <div style={styles.info}>
          This will not change the Total Quantity logged — quantities are only adjusted via the Log Work action.
        </div>

        {isEdit && (
          <div style={styles.editBanner}>
            <div style={styles.bannerTitle}>This CU already has a redline</div>
            <div>
              Editing updates the existing redline. Changes to planned qty add an audit entry; reason-only edits do
              not.{" "}
              {onRemove && (
                <button style={styles.removeLink} onClick={handleRemove} disabled={saving}>
                  Remove redline
                </button>
              )}
            </div>
          </div>
        )}

        <div style={styles.variancePanel(cfg.tone)}>
          <div style={styles.varianceGrid}>
            <div style={styles.varianceDivider} />

            <div style={styles.varianceSide}>
              <div style={styles.varianceSideLabel}>Original Scope</div>
              <div style={styles.varianceNumber(true, cfg.tone)}>{plannedQty}</div>
              <div style={styles.stepperGroup}>
                <button style={styles.stepperBtn} onClick={() => bumpPlanned(-1)} aria-label="Decrease">
                  −
                </button>
                <button style={styles.stepperBtn} onClick={() => bumpPlanned(1)} aria-label="Increase">
                  +
                </button>
              </div>
            </div>

            <div style={styles.varianceSide}>
              <div style={styles.varianceSideLabel}>
                <LockIcon />
                <span>Currently Logged</span>
              </div>
              <div style={styles.varianceNumber(false, cfg.tone)}>{totalQty}</div>
              <div style={styles.readonlyLabel}>read only</div>
            </div>

            <div style={styles.varianceArrow}>→</div>
          </div>

          <div style={styles.varianceFooter}>
            <span style={styles.variancePill(cfg.tone)}>{cfg.label}</span>
            <span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Variance
              </span>
              <span style={styles.varianceAmount(cfg.tone)}>{formatVariance(variance)}</span>
            </span>
          </div>
        </div>

        <div style={styles.varianceCaption}>{cfg.caption}</div>

        <div>
          <label htmlFor="redline-reason" style={styles.formLabel(reasonError)}>
            Redline Reason *
          </label>
          <textarea
            id="redline-reason"
            style={styles.textarea(reasonError)}
            placeholder="Document why there was a change in scope..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError) setReasonError(false);
            }}
          />
        </div>

        <div style={styles.footer}>
          <div style={styles.footerLeft}>
            {isEdit && onRemove && (
              <button style={styles.btn("ghost-danger")} onClick={handleRemove} disabled={saving}>
                Remove redline
              </button>
            )}
          </div>
          <button style={styles.btn("default")} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            style={styles.btn("primary", !canSave || saving)}
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Redline"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example usage (delete this section before integrating)
// ============================================================================

/**
 * Minimal example showing how a parent uses RedlineModal. The parent owns
 * data fetching and persistence; the modal is purely presentational.
 *
 * In a real app:
 *   - `cu` and `totalQty` come from your data layer (React Query / RTK / etc.)
 *   - `existingRedline` is the current redline columns from compatible_units
 *   - `onSave` POSTs to your API which writes redline_events + UPDATE compatible_units
 *   - `onRemove` POSTs to your API which writes a 'removed' redline_event + clears columns
 */
export function RedlineModalExample() {
  const [open, setOpen] = useState(false);
  const [redline, setRedline] = useState<ExistingRedline | undefined>(undefined);

  const cu: CompatibleUnit = {
    id: "a4b91d-...-mock",
    code: "cu-code-1",
    function: "Install",
  };

  const totalQty = 9; // would come from SUM(qty_delta) in your backend

  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => setOpen(true)}>Open redline modal</button>

      <RedlineModal
        open={open}
        cu={cu}
        totalQty={totalQty}
        existingRedline={redline}
        onClose={() => setOpen(false)}
        onSave={async (payload) => {
          // POST to API: writes redline_events + UPDATE compatible_units
          await new Promise((r) => setTimeout(r, 300));
          setRedline(payload);
          setOpen(false);
        }}
        onRemove={async () => {
          // POST to API: writes 'removed' redline_event + clears redline columns
          await new Promise((r) => setTimeout(r, 300));
          setRedline(undefined);
          setOpen(false);
        }}
      />
    </div>
  );
}

export default RedlineModalExample;
