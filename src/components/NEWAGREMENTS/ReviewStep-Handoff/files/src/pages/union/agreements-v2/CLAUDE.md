# Agreements v2 Module — Build Reference

> Living reference for building out the Union → **Agreements v2** module.
> Auto-loads when working inside `src/pages/union/agreements-v2/`. Read it before making changes.

**Reference artifact (design source of truth):**
`/Users/apple/Desktop/Nirmitee Projects/Gridbase/UNIONAGREEMENT/union-prototype/` — a standalone Vite + React + TS + Tailwind "Agreement Designer" prototype. Source of truth for **UX, layout, data shapes, step logic, and sample data** — NOT for styling tokens (see Design System below).

- Landing: `src/features/agreements/AgreementsLanding.tsx` (+ `AgreementsTable`, `AgreementsByLocal`, `HealthCards`)
- Wizard: `src/features/agreements/wizard/` (6 steps: Setup, Classifications, Wages, Benefits, Mapping, Review)
- Domain logic: `src/features/agreements/lib/` (derivation, periods, format, tone) + `types.ts`
- Reference HTML: `preview/Agreement Designer (reference).html`, `uploads/AgreementDesigner_React_Prototype.html`
- Screenshots: `screenshots/` (107 frames)

> ⚠️ Never import from the prototype directory. Port code into this module (sample data → `data/`, copy → `constants.ts`, types → `types.ts`, helpers → `utils/`).

---

## Scope

A v2 of the union agreements surface — manages agreement **wages & benefits**: a landing list (by-local / by-agreement), a 6-step creation wizard, and agreement/local detail pages. **Fully API-wired** — landing, all 6 wizard steps, both detail pages (read), and published-agreement section **editing** (Wages / Benefits / Mapping "Corrections" + the History audit log) are all live.

**Route:** `/union/agreements-v2` (static path; ranks above the dynamic `/union/:union_slug`, so no collision). Wired in `App.tsx` under `AuthLayout`.

**Backend:** the **landing list is wired** to the V2 read-only endpoints (`api/agreementsApi.ts` → `GET /api/v2/utilities/agreements/` + `/locals/`, Phase 1.5). **Wizard Step 1 (Setup) is wired** (Phase 2) — `api/wizardApi.ts` → `POST/PATCH /agreement-drafts/.../setup/` + `GET/DELETE /agreement-drafts/{uuid}/`; Continue persists a `DRAFT` agreement and sticks its UUID to the URL, reload-resumes via GET, and landing **draft rows route to the wizard** (`is_draft`/`wizard_step`). **Wizard Steps 2–6 are wired** — `PATCH …/{uuid}/classifications/`, `…/wages/`, `…/benefits/`, `…/mapping/` + `POST …/publish/` (wages materializes OT/DT server-side; benefits maps funds ⇄ tri-state cells; mapping is id-based 3-state; publish flushes to V1 then returns to the landing list; all return normalization `warnings[]`; `applyEnvelope` re-syncs after every save). The **agreement + local detail pages are API-wired** — `GET /agreements/{uuid}/` (+ `…/documents/`, `…/history/`) via `useAgreementDetailData`, `GET /locals/{code}/` (+ `…/documents/`) via `useLocalDetailData`; read views render the server-**computed** sections directly (no re-derivation). **Editing a published agreement is wired** (Phase 3) — `hooks/useAgreementEdit` + `api/editApi.ts`: `PATCH …/{uuid}/wages|benefits|mapping/` save in-place **Corrections** (each = one audit row; wages/benefits bump `current_version` with optimistic-409 conflict handling, mapping is org-scoped/no-version). `utils/detailToDraft.ts` rebuilds an editable `AgreementDraft` from the computed read — wages resolve **by name + period sequence** (`period_id = seq`), benefits use **`per_class` by class_name**, mapping is keyed by the canonical **`umo_id`** the read now surfaces (`mapping.mapping[].umo_id` / `wages.classifications[].id`). The **mapping save is a PARTIAL body** — `toMappingEditBody` sends only the rows changed vs the live read (diffed by role name + NA flag), because the backend **scrubs a mapping on `internal_id: null`**; a full payload would wipe every untouched mapping. A no-op mapping save is skipped client-side (the backend logs an amendment per save). The **History tab** renders the real Corrections audit log. **Every edit is a "Correction"** — no "Amendment"/effective-date concept. See `Documents/UNION_AGREEMENTS_V2_API.md` §"Edit endpoints (Phase 3)" + §"Detail endpoints". **CoveredLocals fetches all active unions from `/locals/options/?page=all`** (`hooks/useLocalOptions`; NOT `/locals/`, which is agreement-filtered), sends each local's union `code`, and offers a wired **"+ Create new local"** (`NewLocalForm` → `POST /locals/create/`). W6's "already-covered" advisory is live too (`hooks/useAlreadyCovered` → `GET /agreements/?status=active&union_code=…`); the old `data/mockAgreements.ts` is deleted.

---

## Folder Structure (current actual state)

✅ = built & verified · 🔜 = planned/not yet created

```
src/pages/union/agreements-v2/
│
├── api/
│   ├── types.ts                      ✅ V2 backend contract (1:1) — list rows (+is_draft/wizard_step), meta/counts, ApiExpiryCell, params, StatusFilter, wizard Step-1 (WizardSetupBody/Documents, WizardEnvelope, AgreementDocument)
│   ├── agreementsApi.ts              ✅ fetchAgreements / fetchLocals over axiosFireApi (routes: unionAgreementsV2 / unionLocalsV2)
│   └── wizardApi.ts                  ✅ Steps 1–4 draft: createDraftSetup / updateDraftSetup / loadDraft / abandonDraft / updateDraftClassifications / updateDraftWages / updateDraftBenefits (route: agreementDrafts) + mappers (toSetupDocuments / hydrateDocs / toClassificationsBody / hydrateClassifications / toWagesBody / toBenefitsBody / hydrateBenefits)
├── context/                          🔜 AgreementsListContext (when list state needs sharing)
│
├── components/
│   └── landing/
│       ├── HealthCards.tsx           ✅ 5 KPI cards (StatCard wrapped in a button for click)
│       ├── AgreementsTable.tsx       ✅ "By agreement" listing (shared DataTable)
│       ├── AgreementsByLocal.tsx     ✅ "By local" grouped view (ui/table primitives — rowspan)
│       └── ExpiryCell.tsx            ✅ color-coded contract/W&B date+dot (bespoke — see map)
│   └── wizard/
│       ├── CoveredLocals.tsx          ✅ covered-locals picker (Popover+Command: scrollable rows + "+ Add local" + pinned "+ Create new local") over live /locals/options/ (useLocalOptions) — stores/sends the union code
│       ├── NewLocalForm.tsx           ✅ inline "create new local" form (LU#/city/state) in the add dropdown — UI-only until the create-local endpoint
│       ├── WagePeriods.tsx            ✅ wage-period editor (domain widget — no storybook equiv)
│       ├── DerivationControl.tsx      ✅ rate-derivation picker (storybook Select/Input/Badge)
│       ├── PickCreateCombobox.tsx     ✅ generic pick-or-create combobox (storybook Popover/Command) — shared base; options are strings OR {value,label?,description?,keywords?} so an item can show a muted code + be searched by it
│       ├── FundCombobox.tsx           ✅ Benefits fund picker — preset over PickCreateCombobox; shows each catalog fund's code (e.g. "NECA") muted beside the name + searches by code (FUND_OPTIONS fallback)
│       ├── RoleCombobox.tsx           ✅ Mapping internal-role picker — standalone 3-state Popover+Command (pick role / Not-Available / clear), id-based over useRoleOptions (live /systemname/ catalog)
│       └── steps/
│           ├── Setup.tsx              ✅ Step 1 — identity + locals + term + periods
│           ├── Classifications.tsx    ✅ Step 2 — class rows + derivation
│           ├── Wages.tsx              ✅ Step 3 — per-period ST rate grid + OT/DT premiums
│           ├── Benefits.tsx           ✅ Step 4 — funds × periods grid + per-class slide-over
│           ├── Mapping.tsx            ✅ Step 5 — class → internal role (auto-suggest, orphan flags)
│           └── Review.tsx             ✅ Step 6 — recomputed checklist + live already-covered advisory w/ supersede checkbox + wage/benefit previews (design: Review Step.dc.html)
│   └── detail/                         (agreement + local detail pages — read views + in-place section editors)
│       ├── SectionHead.tsx           ✅ section title + Edit link
│       ├── WagesView.tsx             ✅ read-only wage matrix (API-computed rates; anchor row highlighted via base_name)
│       ├── BenefitsView.tsx          ✅ read-only funds table (API basis_label; per-class expand)
│       ├── MappingView.tsx           ✅ read-only class → role (Mapped / Not available / Orphaned) + orphan footer
│       ├── DocsTable.tsx             ✅ Documents tab (real docs; opens file_url; shared by agreement + local pages)
│       ├── HistoryTable.tsx          ✅ History tab — real Corrections audit log; cols When · Who · Type (Correction) · Effective (—) · Version · Change (section summary)
│       ├── EditorShell.tsx           ✅ section-editor chrome (wizard step inside + Cancel / Save)
│       └── SaveChangesDialog.tsx     ✅ Correction confirm modal (note + "Save correction")
│
├── hooks/
│   ├── useAgreementsLanding.ts       ✅ landing: view/search/filter state + derived KPI counts + rows
│   ├── useAgreementDraft.ts          ✅ wizard: in-memory AgreementDraft + typed actions (blank draft)
│   ├── useLocalOptions.ts            ✅ fetches /locals/options/?page=all (all active unions) → raw LocalOption rows for the CoveredLocals picker
│   ├── useAlreadyCovered.ts          ✅ Review advisory: fetches Active agreements covering the drafted locals (/agreements/?status=active&union_code=…) → per-local hits; silent on failure (publish still warns `locals_already_covered`)
│   ├── useAgreementDetailData.ts     ✅ agreement detail READ + edit-apply: GET /agreements/{uuid}/ + lazy /documents/ + /history/; applyEdit / refetch
│   ├── useLocalDetailData.ts         ✅ local detail READ: GET /locals/{code}/ (identity+agreements) + lazy /documents/
│   └── useAgreementEdit.ts           ✅ in-place section editing (Corrections): scratch draft via detailToDraft → PATCH wages/benefits/mapping; 409 → reload; mapping = PARTIAL body (only changed rows — backend scrubs on internal_id:null), no-op save skipped; `canSave` gates Save on the SAME validators as the wizard (classificationsValid + premiumError + fundsValid)
│
├── utils/
│   ├── validation.ts                 ✅ classification (blank/dup/base/**cycle**) + fund (blank/dup name+payer) + premium (OT≤DT) checks
│   ├── validation.test.ts            ✅ 20 unit tests — class/fund/premium + additional-doc validators
│   ├── tone.ts                       ✅ expiryTextClass (expiry date colors — single source, incl. ok)
│   ├── tone.test.ts                  ✅ 1 unit test — expiry color map
│   ├── format.ts                     ✅ money (currency) + acceptDecimal2dp (≤2-dp input guard)
│   ├── format.test.ts                ✅ 4 unit tests — acceptDecimal2dp + money
│   ├── derivation.ts                 ✅ rate resolution: resolveRate/rateAt, derivLabel, anchorEmptyAt, indexById
│   ├── derivation.test.ts            ✅ 14 unit tests — rate math, chained bases, cycle guard, TBD inheritance
│   ├── periods.ts                    ✅ wage-period engine: recompute + ops (addPeriod/removePeriodAt/setStartAt/canAddPeriod) + periodErrors/periodsValid
│   ├── periods.test.ts               ✅ 44 unit tests (Vitest, node env) — gap-free invariants + every edge case
│   ├── draftPeriods.ts               ✅ removeWagePeriod — drops period i + same index from every rates/values/classVals (keeps per-period data aligned)
│   ├── draftPeriods.test.ts          ✅ 5 unit tests — middle/last/no-op removes keep arrays aligned
│   ├── mapping.ts                    ✅ suggestRole — domain-aware US line-work resolver, dynamic against the passed `roles` (survives catalog edits). Pipeline: exact → FOREIGN-TRADE veto (substation/signal/meter/fiber/cable/URD/street-light/technician not in catalog → "") → apprentice step engine ("App"/"Appr" abbrev + ordinal/word/roman/bare-number step + %/date/new-hire noise → "Apprentice N") → alias-canonicalized weighted-Dice (Head→Lead, HEO/digger/crane/boring→Equipment Operator, truck/winch/pole-haul→Driver, Wire Watcher→Damage Assessor; tenure/pay/grade noise stripped; MIN_SCORE gate)
│   ├── mapping.test.ts               ✅ 16 blocks / ~100 assertions — full real-agreement corpus (foreman/lineman/apprentice/groundman/operator/mechanic/damage families), foreign-trade "Not available" cases, and dynamic catalog-edit + class-name-variation tests
│   ├── detailToDraft.ts              ✅ detail read → editable AgreementDraft (deriv rebuild, umoId, per-class funds) for the section editors
│   └── detailToDraft.test.ts         ✅ unit tests — deriv/TBD/per-class/mapping + umoId carry
│
├── constants.ts                      ✅ AGREEMENTS_UI, VIEW_OPTIONS, FILTER_CHIPS, STATUS_BADGE_VARIANT, HEALTH_CARDS
├── types.ts                          ✅ Agreement, AgreementDraft, Classification, Derivation, Fund, FilterKey, …
│
├── AgreementsV2Layout.tsx            ✅ route wrapper (full-width padded container + <Outlet/>)
├── AgreementsLanding.tsx             ✅ landing (route-level): header + cards + toolbar + table/by-local
├── AgreementWizard.tsx               ✅ wizard shell (route-level): Stepper + step body + footer nav
├── AgreementDetail.tsx               ✅ detail (route-level): fetches by uuid → header + tabs; Wages/Benefits/Mapping edit in place (Corrections) + History
├── LocalDetail.tsx                   ✅ local detail (route-level): fetches by code → identity (read-only) + agreements table + docs
└── CLAUDE.md                         ← this file
(components/wizard/steps/ — all 6 step bodies built)
```

**Routes (in App.tsx):**
```
/union                     → AgreementsV2Layout → AgreementsLanding (re-pointed: now the Agreements entry, replacing the legacy union list UnionSidebar)
/union/agreements-v2       → AgreementsV2Layout → (index) AgreementsLanding
/union/agreements-v2/:id       → AgreementDetail (single-agreement view, nested under the layout)
/union/agreements-v2/local/:lu → LocalDetail (single-local view; reachable from the By-local LU cell + an agreement's Covers chips / LOA links)
/union/agreements-v2/new        → AgreementWizard (new draft; full-bleed, not nested under the padded layout)
/union/agreements-v2/:uuid/:step → AgreementWizard (resume a saved draft at its step; full-bleed)
```

---

## Build Rules

### Storybook-first (non-negotiable)
Every UI primitive comes from a shared component. Before writing anything inline, check in order:
1. `@/components/common/` — feature-level (`DataTable`, `SegmentedToggle`, `ChoiceChipGroup`, `StatCard`, `KPICard`, `OverflowChipList`, `SearchInput`, `EmptyState`, `PageHeader`, `Stepper`, `FormField`, …)
2. `@/components/ui/` — shadcn primitives (`Button`, `Input`, `Badge`, `Card`, `Table`, `Select`, `Popover`, `Dialog`, …)
3. Only if no match exists → add to `@/components/common/` with a `.stories.tsx` file, **and ask first** (per project rule — never silently create new common components).

If a need genuinely has no storybook component, **flag it explicitly** in the Storybook Component Map below (we did this for `ExpiryCell`).

### Design system — match GRIDBASE, not the prototype's shadcn defaults
The prototype ships shadcn's **neutral** theme (slate primary, default font, its own `ui/` primitives). We render in the **Gridbase** language instead:
- **Font:** `font-inter` (global; also set on page roots).
- **Primary CTA:** orange — `<Button variant="orange">` (`#fe884c` / `bg-primary-orange`).
- **Tones:** status/expiry colors via `utils/tone.ts` + `<Badge>` variants (emerald/amber/red/blue/gray). Never hardcode tone hex in components.

### Tailwind only
No `.css` file in this module (Jobs-style — NOT the older bid-estimate `styles.css`/BEM). Inline Tailwind utilities; color tokens from the design system.

### File conventions
- Route-level pages → module root (`AgreementsLanding.tsx`, future `AgreementWizard.tsx`).
- Supporting code → categorized folders (`components/`, `hooks/`, `utils/`, `data/`, `api/`, `context/`).
- One component per file, PascalCase. Types only in `types.ts` (single source). UI copy only in `constants.ts`.

### Component size — substantial & cohesive (confirmed preference)
Don't over-fragment into tiny files. Build real cohesive page/section components; pull **logic into hooks** (`useAgreementsLanding`), **pure helpers into utils** (`filters`, `tone`, `format`), and config into `constants.ts`. A large, well-bounded component is fine; a 30-line wrapper-of-a-wrapper is not.

### State-management defaults
| Data | Where |
|---|---|
| Landing view/search/filter + derived counts | `useAgreementsLanding` hook |
| Landing list (today: mock; later: API) | hook now → `AgreementsListContext` when it needs sharing |
| Wizard draft (later) | `useAgreementDraft` hook → promote to context if step-sharing gets complex |
| Purely local UI state | `useState` |

### Derived data — never duplicate config
One record drives the rest. `STATUS_BADGE_VARIANT` maps status → Badge variant; `HEALTH_CARDS` config drives the KPI strip (component just `.map()`s it + the hook's counts); `tone.ts` is the single source for tone classes.

---

## Storybook Component Map (prototype → Gridbase)

Confirmed via component audit (landing + wizard steps built so far). Storybook covers nearly everything; the few intentionally bespoke/exception items are flagged (🚩):

| Prototype need | Gridbase component | Import | Notes |
|---|---|---|---|
| "New agreement" CTA | `Button variant="orange"` | `@/components/ui/button` | orange = primary CTA |
| Search box | `Input` + `Search` icon | `@/components/ui/input` | leading icon positioned by caller |
| Filter row (All/Active/…) | `SegmentedToggle` | `@/components/common/SegmentedToggle` | same control as the view toggle + Jobs Overview status filter (consistency) — NOT ChoiceChipGroup |
| By-local / By-agreement toggle | `SegmentedToggle` | `@/components/common/SegmentedToggle` | |
| 5 KPI cards | `StatCard` | `@/components/common/StatCard` | no `onClick` → wrapped in a `<button>`; colored count passed as `value` ReactNode |
| "By agreement" table | `DataTable` | `@/components/common/DataTable` | listing-table convention (template: `ContractsLanding.tsx`) |
| Status / "Shared" badges | `Badge` (`active`/`draft`/`secondary`) | `@/components/ui/badge` | use variants, never custom color classes |
| Local-number chips + overflow | `Badge` + `OverflowChipList` | `@/components/common/OverflowChipList` | "+N more" tooltip |
| 🚩 **Color-coded expiry date + dot** | **NONE — bespoke** | `components/landing/ExpiryCell.tsx` | no storybook primitive for a colored date+dot; lives in-module |
| 🚩 **By-local rowspan grouping** | `@/components/ui/table` primitives (NOT DataTable) | `@/components/ui/table` | DataTable has no rowspan; the grouped view uses the tier-2 table primitives directly |
| Wage rate matrix (classes × periods) | `@/components/ui/table` primitives | `@/components/ui/table` | dynamic period columns + inline-edit cells; DataTable can't do a matrix (same reasoning as by-local) |
| TBD pill (wages/benefits) | `Badge variant="info"` | `@/components/ui/badge` | blue (`bg-blue-50`/`text-blue-700`) — matches the prototype's blue ToneBadge; use the variant, never custom colors |
| 🚩 **Click-to-edit rate cell · OT/DT field** | **bespoke wrappers** `WageCell` / `MultInput` (in `steps/Wages.tsx`) | wrap storybook `Input` + `Badge` | hold the raw decimal string in LOCAL state, commit a parsed `number\|""` on blur — keeps `draft.rates`/`otMult`/`dtMult` strictly typed (prototype lifted raw strings into draft; can't under strict tsc) |
| Per-class benefit editor (slide-over) | `SlideOverPanel` (`size="2xl"`) | `@/components/common/SlideOverPanel` | replaces the prototype's hand-rolled overlay; class × period grid inside |
| Pick-or-create combobox (funds) | `PickCreateCombobox` (Popover + Command); preset `FundCombobox` | `components/wizard/PickCreateCombobox.tsx` | searchable list (live fund catalog via `useFundOptions`, `FUND_OPTIONS` fallback) + "Create …" for custom. `RoleCombobox` is now a **standalone 3-state mapping picker** over `useRoleOptions` (not a preset); `CoveredLocals` is its own Popover+Command picker. |
| Mapping status pill | `Badge` (`active` / `expired`, `dot`) | `@/components/ui/badge` | Mapped (emerald) / Orphaned (red) — variants, not custom colors |
| 🚩 **Tri-state benefit cell** (`$`/`%` · TBD · "—") | **bespoke** `BenCell` (in `steps/Benefits.tsx`) | wraps storybook `Input` + `Badge` + a tiny TBD toggle | click-to-edit; stores raw string in `values[]`/`classVals[]`; 2-dp guarded; blank = not-in-effect |
| 🚩 **Benefits matrix — frozen config columns** | `@/components/ui/table` (`table-fixed` + `colgroup` + sticky-left cells) | `@/components/ui/table` | 5 config columns stay frozen on horizontal scroll (>4 periods); colgroup keeps the per-class colSpan summary from widening period columns |

---

## Past Mistakes — Do NOT Repeat

Baked-in from prior project feedback. Violating these has caused rework before.

1. **Storybook components only.** Never build an inline replacement for something that exists in storybook. **Ask before creating a new `components/common/` component.**
2. **Edit existing files in place.** Don't create `XyzNew.tsx` / `Xyz2.tsx` replacement files.
3. **No custom color classNames on storybook components.** Use the component's `variant` (e.g. `<Badge variant="active">`, `<Button variant="orange">`) — not `<Badge className="bg-emerald-100 …">`. (Composition like wrapping `StatCard` in a `<button>` is fine; recoloring its internals via className is not.)
4. **Button/checkbox variants.** Global rule: Save = `variant="dark"`, Cancel = `variant="outline"`, Checkbox = `variant="dark"`. **This module's exception:** primary CTAs use `variant="orange"` (the design-system decision). Destructive confirmations stay dark. *(Confirm the form Save/Cancel convention when the wizard is built — see below.)*
5. **Centralize constants — no magic strings.** All copy in `constants.ts`; all types in `types.ts`.
6. **Derive config — no duplication.** One `_CONFIG`/map record; derive labels/colors/variants from it.
7. **No commits / `git revert` / DB writes during implementation.** The user handles branching, commits, and PRs. Build the change; let the user commit.
8. **Verify before claiming done.** `npm run build` (tsc + vite) + `npx eslint <files>` must pass. No `any` / `@ts-ignore`.

---

## Input & Display Conventions

- **Decimal inputs — at most 2 places after the point.** Wage rate cells, the OT/DT multipliers, and (W4) fund values reject a 3rd decimal digit *as you type* (e.g. `1.55` ok, `1.555` blocked). Shared guard: `acceptDecimal2dp(v)` in `utils/format.ts` — call it in the field's `onChange` and only `setBuf`/commit when it returns true. Display uses `money()` (`.toFixed(2)`).
- **Dates display as MM/DD/YYYY** (zero-padded, 4-digit year — e.g. `06/01/2024`). Term dates use the storybook `DateTimePicker` (already `MM/dd/yyyy`). Wage periods **store** in that format: `fmt` / `isoToMD` in `utils/periods.ts` emit `MM/DD/YYYY`; the period-editor inputs (placeholder `MM/DD/YYYY`) follow, and `parseMD` accepts a 2- or 4-digit year on input.
- **Wage/benefit period column HEADERS display short `M/D/YY`** (unpadded month/day, 2-digit year — e.g. `5/5/25–5/3/26`) to match the reference artifact (`_fd`/`periodLabel`) and the detail read view's server label, so the period columns read identically across the wizard, the read tables, and the in-place section editor. Single source: `shortDate` in `utils/periods.ts` (used by `periodLabel` for Wages/Review and by `PeriodHead` for Benefits); the read views (`WagesView`/`BenefitsView`) use the backend `p.label`, which is already `M/D/YY`. Storage/input formats are unchanged.

---

## Decisions Needing Confirmation (flag to user)

- **Nav entry** — the page is currently **URL-only** (`/union/agreements-v2`). Add a link in the Union sidebar/section, or keep URL-only until the module is further along? *(open)*
- **Form button variants (wizard)** — when the wizard is built, use the global Save=dark / Cancel=outline, or all-orange to match this module's CTA choice? *(decide at wizard time)*
- **KPI captions** — "across 12 locals" and "1 draft" are static strings ported from the prototype (`HEALTH_CARDS` in `constants.ts`). Make them data-derived later? *(low priority)*
- **API shape** — `data/mockAgreements.ts` mirrors the prototype's flat `Agreement` row. Reconcile with the real backend schema when it lands.

---

## Build Sequence

- [x] **Phase 0 — Landing** — KPI health cards (clickable → filter), search, filter chips, By-local / By-agreement toggle, listing tables. Hardcoded mock data. Build + lint green.
- [x] **W0 — Wizard shell** — route `/new`, `useAgreementDraft` (blank draft), storybook `Stepper` (orange), footer nav (Save draft / Back / Continue / Publish — publish gated on orphan classes), landing "New agreement" wired. Steps render placeholders. Build + lint green.
- [x] **W1 — Setup** — name + covered locals (storybook `MultiSelect`) + term dates (storybook `DateTimePicker`, local-date mode — ISO-native, no glue) + wage-period editor (`WagePeriods`). **Required** (gates Continue via `stepValid` in the shell): name + **≥1 covered local** + term start + expires + a **valid wage schedule** (`periodsValid` — ≥1 period, gap-free, in-order, in-term, no blanks); term dates cross-constrained (no inverted range). Build + lint green. Deferred: inline "create new local" form.
- [x] **W1.5 — Step 1 API (Setup write + resume)** — `api/wizardApi.ts` over `axiosFireApi` (route `agreementDrafts`). Continue persists via `POST /agreement-drafts/setup/` (new) or `PATCH …/{uuid}/setup/` (existing), sticks the returned UUID to the URL (`/union/agreements-v2/{uuid}/{step}`), and **reload-resumes** via `GET …/{uuid}/` on mount (hydrates name/term/locals/periods + documents, jumps to the backend `current_step`). **Documents** (the user-required `*` section, `DocumentsUpload`): split (`contract_file`+`wages_benefits_file`) XOR combined (`contract_and_wages_file`) + additive `other_files`/`other_titles` + `clear_documents`; sent as multipart (else JSON), extension-whitelisted client + server, **Contract + W&B (or combined) required** to Continue. `DocFile` now carries the real `File`; server docs hydrate with `existingId`. Validation: client gates (name/locals/term/periods/docs) + server `400` → error banner + toast (raw field body captured for future inline mapping). Landing **draft rows route to the wizard** (`is_draft`/`wizard_step`). `DELETE …/{uuid}/` (`abandonDraft`) built, not yet UI-wired. Build + lint + tsc green.
- [x] **W2.5 — Step 2 API (Classifications)** — `PATCH /agreement-drafts/{uuid}/classifications/` (full replace) via `updateDraftClassifications`. Continue maps `draft.classes` → the API body (`toClassificationsBody`: trims names, coerces legacy `ANCHOR`→`ABSOLUTE`, sends opaque sticky ids + `internal`/`rates` passthrough), then advances to `wages`. **Resume** hydrates `payload.classifications` back into `draft.classes` (`hydrateClassifications`) so reload at step 2+ restores them with their ids (deriv `baseId` refs stay valid). Validation: client `classificationErrors` (≥1 class · name required/unique-CI · base resolves · no cycles) gates Continue and mirrors the backend; server `400` (per-row envelope) → error banner + toast. Save-as-draft persists too. Build + lint + tsc green.
- [x] **W3.5 — Step 3 API (Wages)** — `PATCH /agreement-drafts/{uuid}/wages/` (JSON) via `updateDraftWages`. `toWagesBody` sends per-period ST per class (derived rows resolved via `rateAt`; empty/propagated cells flagged `tbd`) + OT/DT multipliers as strings; the **server materializes OT/DT** and returns **normalization `warnings[]`**. `applyEnvelope` is the single state-sync helper (resume + after every save): stores the sequence-ordered backend **period ids** (maps rate cells ↔ `period_id`), re-hydrates name/term/locals/periods/docs/classes + OT/DT, and converts materialized rates (`[{period_id, st, tbd}]`) back to our `RateCell[]` (`ratesToCells`). Warnings: silent codes absorbed, notable ones (clamp / tbd-contradiction / orphaned-base) → toast, `no_classifications_yet` → redirect to Step 2. Validation: `premiumError` now also gates OT/DT to `(0, 99.99]`; the `%`-derivation gate `(0, 1000]` was added in Step 2. **99 unit tests** (incl. `wizardApi.test.ts` mappers + `validation.test.ts`). Build + lint + tsc green.
- [x] **W4.5 — Step 4 API (Benefits)** — `PATCH /agreement-drafts/{uuid}/benefits/` (JSON) via `updateDraftBenefits`. `toBenefitsBody`/`hydrateBenefits` map our `Fund` ⇄ the API: basis ⇄ rate_type ($/hr↔PER_HOUR, %↔PERCENTAGE), liable ER/EE ⇄ EMPLOYER/EMPLOYEE, perClass ⇄ applies_to (ALL→`values`, CLASS_SPECIFIC→`values_by_class` keyed by class id, all classes blank-filled), and tri-state cells (`"TBD"` / `""`-blank / numeric ⇄ `{value, tbd}`, period-id aligned, 5dp cleaned). `applyEnvelope` gained a `rehydrateFunds` flag — funds re-hydrate only on resume + the Benefits save (a Step 1 PATCH reindexes benefit cells, so other saves keep the in-memory funds, like wages). Warnings: clamp/unknown-id → toast, rest silent; client `fundErrors` (name+payer dupes) mirrors `duplicate_fund_identity`. **105 unit tests.** Build + lint + tsc green. **Mock until APIs:** Steps 5–6 still in-memory.
  - **Wage-period engine** is pure + unit-tested (`utils/periods.ts` + `periods.test.ts`, 36 Vitest cases). All add/remove/edit go through `addPeriod` / `removePeriodAt` / `setStartAt`, which always return a recomputed, gap-free schedule (`WagePeriods` is now a thin renderer). Invariants: P1 pinned to Effective start, last period ends on Expires, each end = next start − 1 day. Fixed edge cases: **delete middle** (prev absorbs the gap), delete last (new last ends on Expires), delete to one (spans whole term), **add near Expires** (clamps so it never overshoots/inverts), out-of-order / duplicate / blank / past-expiry edits (flagged + block Continue). Run: `npx vitest run --project unit <file>` (test file pins `@vitest-environment node` — pure date math, sidesteps the repo's jsdom ESM load issue).
  - **Per-period data stays aligned on period remove.** `rates` / `values` / `classVals` are positional (slot i ↔ period i). Removing a period in W1 routes through the draft (`removePeriod` → `removeWagePeriod` in `utils/draftPeriods.ts`), which drops index i from periods AND every per-period array — otherwise a middle-remove would shift later slots' data onto the wrong period. Add / re-seed / edit-start are slot-preserving and need no reconcile (a newly-added trailing slot reads as TBD/blank).
- [x] **W2 — Classifications** — add/remove class rows + `DerivationControl` (Absolute / % / + $ offset / Same-as; base = any other class; ANCHOR static badge). **Validated** (gates Continue + inline row flags, via `utils/validation.ts`): ≥1 class · non-blank + **unique** names · derived classes need a valid base. Removing a base resets its dependents to Absolute, and drops the removed class's per-class fund values from every `classVals` (no orphaned data). New classes seed rates as `""` (TBD), not `0` — an unentered rate reads as "not allocated", not "$0.00". Internal-role mapping deferred to Step 5. Build + lint green.
- [x] **W3 — Wages** — per-period straight-time rate grid (storybook `Card`/`Table`/`Input`/`Badge`): anchor/absolute rows are click-to-edit (`WageCell`, decimals OK); derived rows compute live via `resolveRate` (`utils/derivation.ts`). Empty cell = blue **TBD** pill (`Badge variant="info"`); a derived cell inherits TBD from its anchor (`anchorEmptyAt`). OT/DT premium multipliers below the grid (`MultInput`). `derivation.ts` + `format.ts` (`money`) ported. **Continue gate: OT ≤ DT only** (double-time can't be a smaller multiplier than overtime — flagged inline in the premiums bar + gates Continue, via `premiumError` in `utils/validation.ts`); wages may otherwise be fully TBD (announced-but-unallocated), matching the prototype. `WageCell`/`MultInput` hold the raw decimal string in LOCAL state and commit a parsed `number\|""` on blur (keeps the draft strictly typed under strict tsc). Build + lint + vite green.
- [x] **W4 — Benefits** — fringe-fund editor: one row per fund (Fund `FundCombobox` pick-or-create · Basis · Pays ER/EE · Per-class · period columns), storybook `Card`/`Table`/`Select`/`Input`/`Badge`/`Popover`/`Command`. Flat funds edit per-period inline via `BenCell` (tri-state: value / **TBD** `Badge variant="info"` / blank "—"); per-class ($/%) funds open a `SlideOverPanel` (class × period grid). Config columns frozen on horizontal scroll (>4 periods). Decimal cells 2-dp guarded (`acceptDecimal2dp`). **Continue gate**: fund config validity (`fundsValid` / `fundErrors` in `utils/validation.ts` — non-blank name + no duplicate **name + Pays** combination, flagged inline with a red `FundCombobox` border + message; zero funds is allowed). Fund *values* may still be fully TBD/blank (announced-but-unallocated), like wages. Build + lint + vite green.
- [x] **W5 — Mapping** — class → internal role table (Union class · ST P1 wage · role `RoleCombobox` · status `Badge`), storybook `Card`/`Table`/`Badge` + the shared pick-or-create combobox. Name-based **auto-suggest** (`suggestRole` in `utils/mapping.ts` — **domain-aware US line-work resolver**: exact → foreign-trade veto → apprentice step engine → alias-canonicalized weighted-Dice, dynamic against the live `roles`; maps the many real-world spellings ("Apprentice Lineman - 1st Period"→"Apprentice 1", "H.E.O."→"Equipment Operator", "Head Lineman"→"Lead Lineman") and declines trades absent from the catalog (Substation/Signal/Meter/Fiber/Cable/URD/Street-Light); per-row "↳ Use …" + bulk "Auto-suggest mappings"). Orphaned (unmapped) classes flagged red; footer shows "X of Y mapped · N orphaned". Mapping is where orphans are cleared. ST P1 via `rateAt(c, byId, 0)` + `money`. Build + lint + vite + 5 tests green.
- **Publish gate is comprehensive** (shell): `canPublish = setupValid && classesValid && wagesValid && benefitsValid && mappingValid` (mappingValid = ≥1 class **and** no orphans). The `Stepper` allows free forward jumps, so Publish re-checks **every** step — you can't jump to the end and publish an incomplete agreement (e.g. zero classes, where `orphans` is vacuously 0). Each step's Continue still gates only its own step.
- [x] **W6 — Review** (redesigned per `Review Step.dc.html`, Claude Design project `2fd50170`) — read-only summary: a checklist recomputed live from the draft (locals · structure incl. the constant "1 rate book · 1 wage column" until multi-book/column ships · funds w/ per-class count · all-mapped + Not-Available count · TBD cell counts · OT/DT premiums — `Check`/`AlertTriangle` rows). The **OT/DT row is green once the Wages step was completed** (`premiumsReviewed` prop, from the shell's `wagesReviewed`: set on Wages Continue + on resume past Wages) and an amber "— confirm" otherwise (free forward jump / untouched defaults). The **"already-covered locals" advisory is LIVE** (`useAlreadyCovered`) and carries a **supersede checkbox per prior Active agreement** (default checked, storybook `Checkbox variant="dark"`) — capture-only: the publish API has no supersede field yet (locked in the walkthrough; wire the selection into `POST /publish/` when the backend lands). Period-1 **loaded wage preview** (`Role · Wage(ST) · Derivation`, TBD badge via `anchorEmptyAt`) + **loaded benefit preview** ("values in effect on {P1 start}"; `Fund · Basis · Paid by` — Employer/Employee spelled out — `· P1`; flat funds show value/TBD/—, per-class show "per class ($/%)"; only when funds exist), plus the summary card (**name, term, counts** incl. book/column). Publish lives in the **shell footer** (gated on the comprehensive `canPublish`) — the step has no duplicate button. Storybook `Card`/`Table`/`Badge`/`Checkbox`. Build + lint + vite green.
  - Dropped (prototype test-harness): `ScenarioPicker`, `SCENARIOS` presets, `TypeTag` schema tags, `CatalogProvider` (mock catalogs now).
  - Domain widgets (no storybook equiv — flag each): ✅ `CoveredLocals`, `WagePeriods`, `DerivationControl`, Wages cells (`WageCell`/`MultInput`), Benefits `BenCell` + frozen-column matrix.
- [x] **Detail page — API-wired (read + edit)** — single-agreement view (route `/union/agreements-v2/:id`). Fetches by uuid via `useAgreementDetailData` → `GET /agreements/{uuid}/` + lazy `…/documents/` + `…/history/`; PUBLISHED-only (DRAFT/404 → "back to agreements" card). Header + **Details / Documents / History** tabs. Read views render the server-computed sections directly. **Wages / Benefits / Mapping edit in place** as "Corrections" (`useAgreementEdit` + `api/editApi`; `utils/detailToDraft` rebuilds the editable draft; wages/benefits carry `expected_version` w/ optimistic-409, mapping is org-scoped keyed by `umo_id` and sends a **partial body — changed rows only**, since the backend scrubs on `internal_id: null`). **History** = the real Corrections audit log. Documents open the real `file_url`. Build + lint + tsc + 139 tests green.
- [x] **Local detail page — API-wired (read-only)** — single-local view (route `/union/agreements-v2/local/:lu`, `:lu` = union code). Fetches by code via `useLocalDetailData` → `GET /locals/{code}/` (identity + covering agreements) + lazy `…/documents/`; works on **any** entry point (router-state + mock fallback removed → fixes chip-entry showing mock). Header (`{name}` · HQ city · `LU {code}` badge) + **Details / Documents** tabs. Details = read-only identity (LU# + HQ city — no write endpoint) + the **"Agreements covering this local (N)"** table (rows route: DRAFT→wizard step, published→detail). Documents lazy-load real docs (open `file_url`, "Linked to" → owning agreement). Build + lint + tsc + 127 tests green.
- [x] **API integration — landing** — landing wired to the V2 read endpoints (`api/agreementsApi.ts`; `useAgreementsLanding` fetches with server-side search/status/ordering/pagination; KPI counts from `meta`). Client-side `utils/filters.ts` + `FilterKey`/`HealthCounts` retired. Loading/error/empty states. **Every surface is now API-wired: landing, wizard Steps 1–6, both detail pages (read), and published-agreement section editing (Wages/Benefits/Mapping Corrections) + the History audit log.**
- [ ] **Nav + breadcrumb** — Union sidebar entry + breadcrumb.

---

## Conventions Checklist (before PR)

- [ ] No `.css` file created in this module.
- [ ] All UI primitives from storybook (gaps flagged in the map, not silently inlined).
- [ ] New UI copy in `constants.ts`; new types in `types.ts`.
- [ ] No imports from the prototype dir (port sample data into the module if ever needed — the module is fully API-backed today).
- [ ] Config records centralized and derived (no duplication).
- [ ] Route-level components at module root; supporting code in folders.
- [ ] Gridbase tokens — `font-inter`, orange CTA, tone variants (no raw tone hex).
- [ ] `npm run build` + `npx eslint src/pages/union/agreements-v2/` pass.
- [ ] No `any` / `@ts-ignore` introduced.
- [ ] Decimal inputs capped at 2 dp (`acceptDecimal2dp`); dates rendered MM/DD/YYYY.
- [ ] Edge-case logic extracted to pure utils + colocated `*.test.ts` (Vitest, `@vitest-environment node` for pure math); UI stays a thin renderer.
