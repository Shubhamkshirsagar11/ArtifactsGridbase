/**
 * Agreements v2 — domain types.
 *
 * Ported from the union-prototype (`UNIONAGREEMENT/union-prototype/src/features/
 * agreements/types.ts`). Mirrors the lean v1.1 schema:
 *   agreement + agreement_local (M:N) + agreement_classification.derivation_type
 *   (incl. OFFSET_OF_BASE + offset_value) + period-aware fringe_rate.
 *
 * The landing surface reads the V2 API row shapes (`api/types.ts`); the wizard
 * edits the richer in-memory `AgreementDraft` below.
 *
 * NOTE: this is the single source of truth for the module's types — never
 * redeclare these inline in components (see CLAUDE.md conventions).
 */

/* ------------------------------------------------------------------ landing */

export type ExpiryState = "ok" | "expiring" | "expired";

/**
 * Landing list view mode — picks which V2 endpoint the landing fetches. The
 * status filter and KPI counts now come from the API (`StatusFilter` /
 * `AgreementCounts` in `api/types.ts`), so the old client-side `FilterKey` /
 * `HealthCounts` were retired with `utils/filters.ts`.
 */
export type AgreementsView = "loc" | "agr";

/* ----------------------------------------------------------- classifications */

/**
 * The derivation union — including OFFSET_OF_BASE. `resolveRate()` walks these
 * recursively so a class can anchor off another non-anchor class (chained bases)
 * or sit at `base + $offset`.
 */
export type Derivation =
  | { type: "ANCHOR" }
  | { type: "ABSOLUTE"; amount?: number }
  | { type: "PERCENT_OF_BASE"; baseId: string; percent: number }
  | { type: "OFFSET_OF_BASE"; baseId: string; offset: number }
  | { type: "SAME_AS_BASE"; baseId: string };

export type DerivationType = Derivation["type"];

/** A blank cell drafts as ''; a filled anchor/absolute cell holds a number. */
export type RateCell = number | "";

export interface Classification {
  id: string;
  /** Union-facing classification name (e.g. "Journeyman Lineman"). */
  name: string;
  /** Internal role display name (Step 5). '' ⇒ unmapped or Not-Available. */
  internal: string;
  /** Mapped internal role's SystemName.id (Step 5) — the value the mapping PATCH sends. */
  internalId?: number | null;
  /** Explicit "Not Available" (Step 5) — the class has no internal equivalent. */
  notAvailable?: boolean;
  /** Canonical UMO id (detail-edit only) — the key the mapping PATCH is keyed by. */
  umoId?: number | null;
  deriv: Derivation;
  /** Per-period rates. Only meaningful for ANCHOR / ABSOLUTE classes. */
  rates: RateCell[];
}

/* -------------------------------------------------------------------- funds */

export type Basis = "DOLLAR_HR" | "PCT_GROSS";
export type Liable = "ER" | "EE";
/** false = flat per-period; true = per-class editor (unit follows the fund's basis). */
export type PerClassMode = boolean;

export interface Fund {
  id: string;
  name: string;
  basis: Basis;
  liable: Liable;
  perClass: PerClassMode;
  /** Flat per-period values; '' or '—' = not in effect yet. */
  values: string[];
  /** Per-class, per-period values when perClass is set. */
  classVals: Record<string, string[]>;
}

/* ----------------------------------------------------------------- locals */

export interface CoveredLocal {
  /** Union code — the canonical identity sent to the API (e.g. "104"). */
  code: string;
  /** Numeric form of the code, for legacy display (`LU {lu}`). */
  lu: number;
  /** DERIVED from the chosen local (read-only). */
  region: string;
}

/** An explicit wage period: a start–end date range (MM/DD/YYYY). */
export interface Period {
  start: string;
  end: string;
}

/* ---------------------------------------------------------------- documents */

/**
 * A document slot's file. `name`/`size` drive the display card. A freshly-picked
 * file carries the actual `File` (`file`) to upload; a doc hydrated from the
 * server instead carries its `existingId` + `url` (already uploaded — not re-sent,
 * deletable via `clear_documents`).
 */
export interface DocFile {
  name: string;
  size: number;
  /** The picked File to upload — present for new picks, absent for server docs. */
  file?: File;
  /** Server document id — present for docs loaded from a saved draft. */
  existingId?: number;
  /** Signed URL for an already-uploaded server doc (to view it). */
  url?: string;
}

/** A user-added document slot beyond the two presets (relabelable). */
export interface ExtraDoc {
  /** Stable id for React keys — the additional-docs list is add/remove-able, so
   *  keying by array index mis-reconciles per-slot state on a middle removal. */
  id: string;
  label: string;
  file: DocFile | null;
}

/**
 * Source PDFs attached in Step 1 — either the two presets (`contract` + `wb`)
 * or, when `combinedMode` is on, a single `combined` file, plus any `extra`
 * documents.
 */
export interface AgreementDocs {
  contract: DocFile | null;
  wb: DocFile | null;
  combined: DocFile | null;
  combinedMode: boolean;
  extra: ExtraDoc[];
  /**
   * `clear_documents` tags for server docs the user removed this session
   * (`"OTHER:<id>"`). Key-slot replacements are handled server-side by the
   * toggle/replace semantics, so only OTHER removals need tracking here.
   */
  deleted: string[];
}


/* --------------------------------------------------------------- the draft */

export interface AgreementDraft {
  name: string;
  start: string;
  end: string;
  /** OT / DT multipliers applied to the ST rate. */
  otMult: number;
  dtMult: number;
  periods: Period[];
  locals: CoveredLocal[];
  classes: Classification[];
  funds: Fund[];
  /** Attached source PDFs (Step 1 · Documents). */
  docs: AgreementDocs;
}
