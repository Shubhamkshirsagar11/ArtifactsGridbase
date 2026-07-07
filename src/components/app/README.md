# T&E Rate Book Setup Wizard

A production React + TypeScript implementation of the **New T&E Rate Book** wizard
for Gridbase (utility-construction software), built from the Claude Design handoff
in `../project/New T&E Rate Book.dc.html` and the intent captured in `../chats/`.

T&E ("time & equipment") rate books are a *type* of Unit Library. This app is the
full flow for creating and managing one:

- **Step 1 — Book setup**: shell fields (customer, work type, book name, first rate
  period, notes) + a tile grid of what the book prices (Labor, Equipment, Per diem,
  Delay types, and custom billable categories).
- **Step 2 — Add rates**: stacked rate tables (Labor with per-classification /
  blended / both structures and calculated tier columns, Equipment, Per diem,
  Delay types, custom categories, Expenses) plus a book-settings bar (regions,
  utility billing codes, work-week start) and a full **Tier rules** engine
  (daily progression slider, weekly floor, day overrides, time types, unit-price
  premium) that auto-buckets logged hours into tiers.
- **Step 3 — Review** and **Create book**.
- **Book Detail**: effective-dated rate periods (add-period with escalation copy,
  overlap guard, end-early), per-period rate editing.
- **Blended work order preview**: fixed-price and T&E billing-basis variants with
  live hour auto-bucketing.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

## Architecture

The source design is a single ~1,760-line declarative template driven by ~2,500
lines of view-model logic. Rather than hand-transcribe every element (high risk of
subtle drift across 887 template holes, 66 loops, and 240 conditionals), the
implementation preserves the exact template and logic and runs them through a small,
typed React interpreter. Everything renders as real React elements in a real React
component tree.

| File | Role |
|------|------|
| `src/RateBookWizard.tsx` | The component logic, ported from the design's `class Component extends DCLogic`. DCLogic is API-compatible with `React.Component` (same `state` / `setState` / `props`), so state, handlers, and the `renderVals()` view-model port essentially verbatim. `render()` feeds `renderVals()` to the interpreter. |
| `src/template.html` | The design's declarative template (`{{ }}` holes + `<sc-for>` / `<sc-if>` directives), imported as a raw string. |
| `src/dcRuntime.ts` | The interpreter: parses the template once and renders it against a scope object, evaluating holes, loops, and conditionals into React elements. Converts inline CSS strings to style objects and normalizes attribute names. It renames table tags before parsing to dodge the HTML "foster-parenting" bug that broke the design's own standalone export — so `<sc-for>`/`<sc-if>` survive inside `<table>`/`<tr>`/`<td>`. |
| `src/index.css` | Global styles ported from the design's `<helmet>` block (resets, scrollbars, custom `<select>` caret). |
| `src/main.tsx` | Entry point; mounts `<RateBookWizard accentColor="#EE7B3D" />`. |

`RateBookWizard.tsx` is marked `@ts-nocheck` because it is a faithful port of
dynamically-typed prototype logic; the typed surface (interpreter, entry point,
props) lives in the other files.

### Where to take it next

The interpreter approach gets a working, pixel-faithful app now and keeps the
template declarative. Natural follow-ups: extract the largest template sections
(the rate tables, the tier-rules panel) into standalone typed React components,
and lift the monolithic `state` into typed reducers/hooks incrementally.
