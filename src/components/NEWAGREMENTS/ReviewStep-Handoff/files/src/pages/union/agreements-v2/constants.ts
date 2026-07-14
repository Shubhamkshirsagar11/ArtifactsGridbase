import type { StepDefinition } from "@/components/common/Stepper";
import type { Basis, DerivationType, Liable } from "./types";
import type {
  AgreementCounts,
  AgreementDocumentType,
  ApiAgreementStatus,
  StatusFilter,
} from "./api/types";

/** All landing UI copy — no magic strings in components. */
export const AGREEMENTS_UI = {
  title: "Agreements",
  subtitle:
    "Manage union agreement wages & benefits. One row per agreement; locals as chips.",
  newAgreement: "New agreement",
  searchPlaceholder: "Search local, city, agreement…",
  emptyTitle: "No agreements match",
  emptyBody: "Adjust your search or filters.",
  rowCountLabel: "agreements",
  localsCountLabel: "locals",
  // "By local" table headers
  colLocal: "Local",
  colAgreement: "Agreement",
  colContract: "Contract through",
  colWb: "W&B through",
  colStatus: "Status",
  sharedBadge: "Shared",
} as const;

/** "By local" / "By agreement" segmented-toggle options. */
export const VIEW_OPTIONS = [
  { id: "loc", label: "By local" },
  { id: "agr", label: "By agreement" },
] as const;

/** Filter chips shown in the "By agreement" view (single-select). */
export const FILTER_CHIPS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "expiring", label: "Expiring" },
  { value: "wb_expired", label: "W&B expired" },
  { value: "tbd", label: "TBD" },
];

/**
 * Status → shared <Badge> variant. Single source of truth — never inline the
 * variant string in a component. (`active` = emerald, `draft` = amber.)
 */
export const STATUS_BADGE_VARIANT = {
  Active: "active",
  Draft: "draft",
  Archived: "inactive",
} as const satisfies Record<ApiAgreementStatus, string>;

/**
 * KPI health-card config — the 5 cards across the top of the landing. Clicking a
 * card sets the `status` filter (and snaps to "By agreement"). `filter` is the
 * `?status=` value; `countKey` selects the number from the API `meta.counts`;
 * `valueClass` color-codes the number; `caption` is the static sub-line ("all" +
 * "active" captions are derived from live meta in the component). Borders stay
 * neutral gray (matches the Equipment tab) — color lives in the value only.
 * Single source — the component just maps over this.
 */
export const HEALTH_CARDS: {
  filter: StatusFilter;
  countKey: keyof AgreementCounts;
  title: string;
  valueClass: string;
  caption: string;
}[] = [
  { filter: "all", countKey: "total", title: "Agreements", valueClass: "text-gray-900", caption: "" },
  { filter: "active", countKey: "active", title: "Active", valueClass: "text-emerald-600", caption: "" },
  { filter: "expiring", countKey: "expiring_90d", title: "Expiring ≤90d", valueClass: "text-amber-600", caption: "wages/benefits" },
  { filter: "wb_expired", countKey: "wb_expired", title: "W&B expired", valueClass: "text-red-600", caption: "needs new W&B sheet" },
  { filter: "tbd", countKey: "tbd_pending", title: "TBD pending", valueClass: "text-blue-600", caption: "unallocated raises" },
];

/**
 * By-local view: the leading "Locals" tile — count of locals, with the agreements
 * count shown as its caption (mirroring the By-agreement "Agreements" tile). The
 * remaining tiles reuse the status cards above (minus the "all"/Agreements one),
 * so By-local shows the same 5-card set: Locals · Active · Expiring · W&B expired
 * · TBD. Informational (the status chips do the filtering).
 */
export const LOCALS_CARD = {
  title: "Locals",
  valueClass: "text-gray-900",
} as const;

/* ----------------------------------------------------------------- wizard */

/** New-agreement wizard steps, for the shared <Stepper>. Single source. */
export const WIZARD_STEPS: StepDefinition[] = [
  { num: 1, label: "Setup" },
  { num: 2, label: "Classifications" },
  { num: 3, label: "Wages" },
  { num: 4, label: "Benefits" },
  { num: 5, label: "Mapping" },
  { num: 6, label: "Review" },
];

/** Wizard UI copy — no magic strings in the shell/steps. */
export const WIZARD_UI = {
  cancel: "Cancel",
  back: "Back",
  continue: "Continue",
  publish: "Publish agreement",
  publishBlocked: "Map all classes to publish",
  continueBlocked: "Complete the required fields to continue",
  saving: "Saving…",
  publishedToast: "Agreement published.",
  publishFailed: "Publish failed. Please try again.",
} as const;

/** Step 1 (Setup) copy. */
export const SETUP_UI = {
  identity: "Identity",
  agreementName: "Agreement name",
  coveredLocals: "Covered locals",
  coveredLocalsHint: "Search by local number or city. Two or more = a joint agreement.",
  localsSearch: "Search LU # or city…",
  localsLoading: "Loading locals…",
  localsEmpty: "No locals found.",
  noLocalsYet: "No locals yet — add one below.",
  localsError: "Couldn't load locals — check your connection and reload.",
  localNamePrefix: "IBEW Local Union No.",
  addLocalTrigger: "+ Add local — search number or city…",
  createLocal: "Create new local…",
  newLocalTitle: "Create new local",
  newLocalNamePreview: "Name: IBEW Local Union No.",
  newLocalDerived: "derived from number",
  newLocalNumber: "LU number",
  newLocalNumberEg: "e.g. 1186",
  newLocalCity: "Headquarters city",
  newLocalCityEg: "e.g. Honolulu",
  newLocalState: "State",
  newLocalStateEg: "HI",
  citySearching: "Searching…",
  newLocalAdd: "Add local",
  newLocalAdding: "Adding…",
  newLocalCancel: "Cancel",
  newLocalError: "Couldn't create the local. Please try again.",
  term: "Term",
  effectiveStart: "Effective start",
  expires: "Expires",
  wagePeriods: "Wage periods",
  wagePeriodsHint: "type each raise date (start); ends are derived",
  periodCount: "Periods",
  periodCountAria: "Number of wage periods",
  periodsExceedTerm: "more periods than this term allows",
  addPeriod: "Add period",
  periodsNeedStart: "Set an effective start date first.",
} as const;

/** Step 1 (Documents) copy. */
export const DOCUMENTS_UI = {
  title: "Documents",
  subtitle:
    "Attach the source PDFs. They'll appear on the agreement's Documents tab and on each covered local.",
  combinedLabel: "One combined PDF (contract & wages/benefits in a single file)",
  uploadCta: "Upload PDF",
  replace: "Replace",
  remove: "Remove",
  addDocument: "+ Add document",
  pdfMeta: "PDF",
  contractLabel: "Union Contract",
  contractHint: "the CBA",
  wbLabel: "Wages & Benefits sheet",
  wbHint: "rates schedule",
  combinedSlotLabel: "Contract & Wages/Benefits",
  combinedSlotHint: "combined CBA + rates",
  extraLabel: "Additional document",
  /** Accepted upload types — PDF only (all document slots). */
  accept: ".pdf",
  allowedExts: ["pdf"],
  invalidType: "Only PDF files are allowed.",
} as const;

/** Derivation picker options (non-anchor). */
export const DERIV_OPTS: { v: Exclude<DerivationType, "ANCHOR">; label: string }[] = [
  { v: "ABSOLUTE", label: "Absolute $" },
  { v: "PERCENT_OF_BASE", label: "% of base" },
  { v: "OFFSET_OF_BASE", label: "+ $ offset" },
  { v: "SAME_AS_BASE", label: "Same as" },
];

/** Fund basis options (unit shown per row). */
export const BASIS_OPTS: { v: Basis; label: string }[] = [
  { v: "DOLLAR_HR", label: "$/hr" },
  { v: "PCT_GROSS", label: "% gross" },
];

/** Who pays the fund (employer / employee). */
export const LIABLE_OPTS: { v: Liable; label: string }[] = [
  { v: "ER", label: "ER" },
  { v: "EE", label: "EE" },
];

/** Per-class toggle. "no" → flat per-period; "yes" → per-class editor (unit follows the fund's basis). */
export const PER_CLASS_OPTS: { v: string; label: string }[] = [
  { v: "no", label: "No" },
  { v: "yes", label: "Yes" },
];

/**
 * Common IBEW trust/fringe funds — seed the Fund combobox. Not exhaustive: users
 * can still type a custom fund name (the combobox offers "Create …").
 */
export const FUND_OPTIONS: string[] = [
  "NEBF",
  "NEAP",
  "LINECO (Health & Welfare)",
  "LINECO HRA",
  "NEIF (Industry Fund)",
  "NLMCC",
  "LMCC",
  "AMF/ALBAMF",
  "Apprenticeship & Training (ALBAT)",
  "SELCAT",
  "SERF",
  "United Way",
  "FR Clothing/Safety",
  "Vacation",
  "401(k)",
  "Working Dues",
];

/** Step 4 (Benefits) copy. */
export const BENEFITS_UI = {
  intro:
    "Add/edit funds. A fund can be flat per-period, **$ per-class**, or **% per-class**. Per-class funds open a side panel to enter class-level values.",
  colFund: "Fund",
  colBasis: "Basis",
  colPays: "Pays",
  colPerClass: "Per-class",
  fundNamePlaceholder: "Fund…",
  fundSearch: "Search by code or name…",
  fundCreate: "Create new fund",
  fundNoMatch: "Type to create a fund.",
  fundsError: "Couldn't load the fund catalog — type a fund name instead.",
  addFund: "Add fund",
  empty: "No funds yet — add one below.",
  tbd: "TBD",
  notInEffect: "—",
  cellHint: "Click to edit · TBD or — when not in effect",
  cellAria: "Edit benefit value",
  pctRangeError: "% gross must be between 0 and 1000",
  tbdToggleHint: "Mark this period TBD (in effect, unallocated)",
  perClass: "per class",
  classes: "classes",
  classOne: "class",
  periods: "periods",
  periodOne: "period",
  editPerClass: "Edit per class →",
  panelDone: "Done",
  legend:
    "Each cell: a value, **TBD** (in effect, unallocated), or blank **“—”** (not in effect). Wages & benefits TBD are independent.",
  panelLegend:
    "Same periods as the main table. Each cell: a value, **TBD** (in effect, unallocated), or blank “—” (not in effect).",
} as const;

/** Step 6 (Review) copy. */
export const REVIEW_UI = {
  coveredBy: "Covered by",
  local: "local",
  locals: "locals",
  // Rate books / wage columns aren't modeled yet — every agreement is exactly
  // one implicit book with one value column, so the checklist + summary render
  // the constant "1 …" until the multi-book / multi-column structure ships
  // (locked in the wizard walkthrough review).
  rateBook: "rate book",
  wageColumn: "wage column",
  wagePeriods: "wage periods",
  classes: "classes",
  structureTail: "— derived rates resolve",
  fund: "fund",
  funds: "funds",
  perClassTail: "per-class",
  noFunds: "No funds captured",
  allMapped: "All classes mapped",
  naTail: "marked Not Available",
  unmapped: "class(es) unmapped — required to publish (fix in Mapping)",
  noTbd: "No TBD cells",
  tbdPending: "TBD pending",
  wageWord: "wage",
  benefitWord: "benefit",
  cellsUnallocated: "cell(s) unallocated",
  overtime: "Overtime",
  doubletime: "Double-time",
  premiumsApplied: "(applied to ST)",
  premiumsConfirm: "— confirm",
  dupesTitle: "Already-covered locals",
  dupesOnOne: "is already on an active agreement:",
  dupesOnMany: "is already on active agreements:",
  dupesTailOne: "Publishing won’t change it — unless this is its renewal.",
  dupesTailMany: "Publishing won’t change them — unless this is their renewal.",
  supersedePre: "This replaces",
  supersedePost: "— mark it superseded when this agreement publishes.",
  term: "Term",
  wagePreview: "Loaded wage preview",
  colRole: "Role",
  colWage: "Wage (ST)",
  colDerivation: "Derivation",
  tbd: "TBD",
  notInEffect: "—",
  benefitPreview: "Loaded benefit preview",
  benefitAsOf: "values in effect on",
  colFund: "Fund",
  colBasis: "Basis",
  colPaidBy: "Paid by",
  colP1: "P1",
  paidByER: "Employer",
  paidByEE: "Employee",
  perClassLabel: "per class",
  summaryLocals: "local(s)",
  summaryPeriods: "periods",
  summaryClasses: "classes",
  summaryFunds: "funds",
} as const;

/** Step 5 (Mapping) copy. */
export const MAPPING_UI = {
  intro:
    "Map each union class to an internal role — the single source of truth for union→internal mapping. **ST (P1)** wage shown for context.",
  autoSuggest: "Auto-suggest mappings",
  colClass: "Union class",
  colWage: "ST (P1)",
  colRole: "Internal role",
  colStatus: "Status",
  mapped: "Mapped",
  notAvailable: "Not Available",
  unmapped: "Unmapped",
  rolePlaceholder: "Map to internal role…",
  roleSearch: "Search roles…",
  roleNoMatch: "No matching role.",
  roleEmpty: "No roles available.",
  rolesError: "Couldn't load internal roles.",
  clear: "Clear selection",
  use: "Use",
  mappedOf: "mapped",
  unmappedCount: "unmapped",
  naCount: "not available",
} as const;

/** Step 2 (Classifications) copy. */
export const CLASSIFICATIONS_UI = {
  intro:
    "Add/edit classes — the agreement's own data. Derivation supports **absolute**, **% of base**, **+$ offset**, **same as** (base = any class). Wages recompute live.",
  introMuted: "Internal mapping is set in Step 5.",
  colClass: "Union class",
  colDerivation: "Derivation",
  empty: "No classifications yet — add one below.",
  addClass: "Add classification",
  percentAria: "Percent of base classification",
  offsetAria: "Dollar offset above base classification",
} as const;

/** Step 3 (Wages) copy. */
export const WAGES_UI = {
  intro:
    "Straight-time (ST) rates per period. Anchor/absolute rows are editable (decimals OK); derived rows compute live. **Leave a cell empty for TBD** — an announced-but-unallocated period. Columns come from **Step 1 · Setup**.",
  colClass: "Classification",
  colDerivation: "Derivation",
  tbd: "TBD",
  cellHint: "Click to edit · clear for TBD",
  cellAria: "Edit straight-time rate",
  computedHint: "Computed live from its base — edit the anchor row instead",
  premiums: "Premiums",
  premiumsHint: "multipliers on ST",
  otLabel: "OT",
  dtLabel: "DT",
  tbdLegend: "Empty cell = TBD (unallocated)",
  noPeriods: "No wage periods yet — add them in Step 1 · Setup.",
} as const;

/** Agreement detail page copy. */
export const DETAIL_UI = {
  tabs: ["Details", "Documents", "History"] as const,
  termPrefix: "Term",
  covers: "Covers",
  wagePeriodsWord: "wage periods",
  // section heads
  wages: "Wages",
  benefits: "Benefits",
  mapping: "Mapping",
  edit: "Edit",
  // wages table
  colClassification: "Classification",
  colDerivation: "Derivation",
  tbd: "TBD",
  // benefits table
  colFund: "Fund",
  colBasis: "Basis",
  colPays: "Pays",
  perClassWord: "per class",
  classesWord: "classes",
  notInEffect: "—",
  emptyClasses: "No classifications yet.",
  emptyFunds: "No benefit funds yet.",
  // mapping table
  colUnionClass: "Union class",
  colInternalRole: "Internal role",
  colStatus: "Status",
  mapped: "Mapped",
  orphaned: "Orphaned",
  notAvailable: "Not available",
  orphanFooter:
    "unmapped — this agreement could not be published until mapping is complete.",
  // documents
  docColDocument: "Document",
  docColLinked: "Linked to",
  unionContract: "Union Contract",
  wagesBenefits: "Wages & Benefits",
  // history
  hColWhen: "When",
  hColWho: "Who",
  hColType: "Type",
  hColEffective: "Effective",
  hColChange: "Change",
  hColVersion: "Version",
  historyEmpty: "No changes recorded yet.",
  historyFootnote:
    "Every edit is recorded as a Correction with a full audit trail · removed classes and funds are end-dated, never deleted.",
  // section editor chrome (Cancel / Save → SaveChangesDialog)
  cancel: "Cancel",
  save: "Save",
  saveBlocked: "Resolve the highlighted errors to save.",
  back: "Back",
  // detail data states (live API)
  loading: "Loading agreement…",
  loadError:
    "This agreement couldn't be loaded. It may be a draft (open it from the list to keep editing) or no longer available.",
  backToList: "Back to agreements",
  docsLoading: "Loading documents…",
  docsLoadError: "Couldn't load documents.",
  docsEmpty: "No documents attached to this agreement.",
  docsNote: "Source documents attached to this agreement.",
  previewDoc: "Preview document",
  previewError: "Couldn't open the document. Please try again.",
  // Edit (Correction) + History (Phase 3)
  saveCorrectionTitle: "Save correction",
  saveCorrectionDesc: "Add an optional note describing this correction.",
  saveCorrectionBtn: "Save correction",
  noteOptional: "Note (optional) — e.g. Groundman P1 typo fix",
  correctionSaved: "Correction saved.",
  correctionError: "Couldn't save the correction. Please try again.",
  noMappingChanges: "No mapping changes to save.",
  endDatedPrefix: "Will be end-dated (kept for historical payroll/bids):",
  mappingOrphansBlocked:
    "unmapped — map every class (or mark it Not Available) before saving.",
  versionConflict:
    "This agreement was updated since you opened it — reloading the latest.",
  historyLoading: "Loading history…",
  historyLoadError: "Couldn't load the change history.",
  /** "{Wages|Benefits|Mapping} correction" — the History Change column. */
  correctionType: "Correction",
  changeWages: "Wages & classifications updated",
  changeBenefits: "Benefits updated",
  changeMapping: "Mapping updated",
} as const;

/** Document type → fixed label (used when a document's own `title` is blank). */
export const DOC_TYPE_LABEL: Record<AgreementDocumentType, string> = {
  CONTRACT: DETAIL_UI.unionContract,
  WAGES_BENEFITS: DETAIL_UI.wagesBenefits,
  CONTRACT_AND_WAGES: "Contract & Wages",
  OTHER: "Document",
};

/** Local detail page copy. */
export const LOCAL_UI = {
  tabs: ["Details", "Documents"] as const,
  localDetails: "Local details",
  luNumber: "LU number",
  hqCity: "Headquarters city",
  detailsNote:
    "The local's name is derived from its number. Wages, benefits and mappings live on its agreements below.",
  agreementsCovering: "Agreements covering this local",
  noAgreements: "No agreements cover this local yet.",
  colAgreement: "Agreement",
  colContract: "Contract through",
  colWb: "W&B through",
  colStatus: "Status",
  shared: "Shared",
  unionContract: "Union Contract",
  wagesBenefits: "Wages & Benefits",
  loading: "Loading local…",
  loadError: "This local couldn't be loaded — it may be inactive or not found.",
  docsNote: "Documents from the agreements covering this local.",
  docsEmpty: "No documents found for this local.",
} as const;
