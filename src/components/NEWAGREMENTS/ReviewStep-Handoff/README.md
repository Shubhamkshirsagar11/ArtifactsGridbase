# Agreements V2 — Review Step redesign (handoff)

Implements the Claude Design comp **Review Step.dc.html** (design project `2fd50170`)
in the Agreements V2 wizard. Base: `staging` @ `4addbe90`.

## How to apply

Either apply the patch from the repo root:

```
git apply review-step.patch
```

…or drop the contents of `files/` over the repo (same relative paths). Note one
**deletion** the patch carries that the files-copy does not:
`src/pages/union/agreements-v2/data/mockAgreements.ts` is removed (and the
now-empty `data/` folder with it).

## What changed

| File | Change |
|---|---|
| `components/wizard/steps/Review.tsx` | Rebuilt to the design: new checklist copy, supersede card, benefit-preview "Paid by" + "values in effect on {P1 start}", summary counts line |
| `hooks/useAlreadyCovered.ts` | **New.** Live "already-covered locals" lookup — `GET /agreements/?status=active&union_code=…` for the drafted locals. Silent on failure (publish still returns the `locals_already_covered` warning) |
| `constants.ts` | `REVIEW_UI` copy updated (new rows, supersede strings, Paid by / Employer / Employee) |
| `AgreementWizard.tsx` | Tracks `wagesReviewed` (set on Wages Continue + on resuming a draft past Wages) and passes it to `StepReview` as `premiumsReviewed` |
| `types.ts` | Removed dead landing types (`Agreement`, `AgreementStatus`, `Expiry`) that only the deleted mock used; `ExpiryState` stays (used by `utils/tone.ts`) |
| `data/mockAgreements.ts` | **Deleted** — the advisory was matching against hardcoded sample agreements, which could name agreements the org doesn't have |
| `CLAUDE.md` (module) | Build log / folder tree updated to match |

## Behavior notes

- **OT/DT checklist row** is green ("Overtime 1.5× · Double-time 2× (applied to ST)")
  once the Wages step was completed; amber "— confirm" when the defaults were never
  touched (e.g. a free forward jump via the stepper).
- **Supersede checkbox** (default checked, one per prior Active agreement) is
  **capture-only for now** — the publish API has no supersede field yet. When the
  backend adds it, wire the selection into `POST /agreement-drafts/{uuid}/publish/`
  (the state lives in `StepReview`; see the comment there).
- **Rate books / wage columns** aren't modeled yet, so the checklist/summary show the
  constant "1 rate book · 1 wage column" and the previews render the single-book,
  single-column form — exactly the design's "Simple agreement" scenario. The design's
  multi-book preview layers (book header rows, extra wage columns) and the
  Custom-basis / "own dates" / "book only" chips come with the future model.
- The design's floating "Dev notes" widget is a prototype annotation — intentionally
  not implemented.

## Verification done

- `npm run build` (tsc + vite) ✅ · `npx eslint src/pages/union/agreements-v2/` ✅ ·
  `npx vitest run --project unit src/pages/union/agreements-v2` — 192 tests ✅
- Visual check against the comp via an isolated harness (both checklist states,
  supersede toggle, wage/benefit previews, summary card).
