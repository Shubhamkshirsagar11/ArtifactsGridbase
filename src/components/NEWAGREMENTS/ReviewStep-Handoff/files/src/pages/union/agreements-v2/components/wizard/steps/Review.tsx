import { useMemo, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AgreementDraft, Basis } from "../../../types";
import type { AgreementListRow } from "../../../api/types";
import { BASIS_OPTS, REVIEW_UI } from "../../../constants";
import { useAlreadyCovered } from "../../../hooks/useAlreadyCovered";
import { anchorEmptyAt, derivLabel, indexById, isAnchorLike, rateAt } from "../../../utils/derivation";
import { money } from "../../../utils/format";
import { isoToMD, periodLabel, shortDate } from "../../../utils/periods";

/** Basis → display unit / label. */
const benUnit = (basis: Basis): "$" | "%" => (basis === "DOLLAR_HR" ? "$" : "%");
const basisLabel = (basis: Basis): string =>
  BASIS_OPTS.find((o) => o.v === basis)?.label ?? basis;

/**
 * Step 6 — Review. A checklist recomputed live from the draft (locals, structure,
 * funds, mapping, TBD, premiums), the "already-covered locals" advisory (live
 * lookup of Active agreements covering the drafted locals) with a per-agreement
 * supersede checkbox, and period-1 loaded wage / benefit previews. Read-only:
 * the wizard's footer owns Publish (gated on a complete agreement).
 *
 * The OT/DT row is green once the Wages step was completed (`premiumsReviewed`);
 * until then it's an amber "— confirm" (untouched default multipliers).
 */
export function StepReview({
  draft,
  premiumsReviewed,
}: {
  draft: AgreementDraft;
  premiumsReviewed: boolean;
}) {
  const byId = useMemo(() => indexById(draft.classes), [draft.classes]);
  const orphans = draft.classes.filter(
    (c) => !c.internal && !c.notAvailable,
  ).length;
  const notAvailable = draft.classes.filter((c) => c.notAvailable).length;
  const perClass = draft.funds.filter((f) => f.perClass).length;

  // Per-cell TBD counts (wages & benefits decouple).
  const wageTbd = draft.classes
    .filter(isAnchorLike)
    .reduce(
      (n, c) => n + c.rates.filter((v) => v === "" || v == null).length,
      0,
    );
  const benTbd = draft.funds.reduce((n, f) => {
    let m = 0;
    if (f.perClass) {
      draft.classes.forEach((c) => {
        const a = f.classVals[c.id];
        if (Array.isArray(a)) m += a.filter((v) => v === REVIEW_UI.tbd).length;
      });
    } else {
      m += f.values.filter((v) => v === REVIEW_UI.tbd).length;
    }
    return n + m;
  }, 0);
  const anyTbd = wageTbd > 0 || benTbd > 0;

  // Already-covered locals — live lookup of Active agreements covering any
  // drafted local, with a supersede checkbox per prior agreement (default
  // checked: the common case is a renewal). Capture-only for now — the publish
  // API has no supersede field yet (locked in the walkthrough; backend
  // pending), so the choice isn't sent anywhere.
  const { dupes } = useAlreadyCovered(draft.locals);
  const priorAgreements = useMemo(() => {
    const seen = new Map<string, AgreementListRow>();
    dupes.forEach((d) =>
      d.hits.forEach((h) => {
        if (!seen.has(h.uuid)) seen.set(h.uuid, h);
      }),
    );
    return [...seen.values()];
  }, [dupes]);
  const [notSuperseding, setNotSuperseding] = useState<Set<string>>(new Set());
  const toggleSupersede = (uuid: string) =>
    setNotSuperseding((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });

  const nLocals = draft.locals.length;
  const nFunds = draft.funds.length;
  const checks: [ok: boolean, label: string][] = [
    [
      true,
      `${REVIEW_UI.coveredBy} ${nLocals} ${nLocals === 1 ? REVIEW_UI.local : REVIEW_UI.locals} (${draft.locals
        .map((l) => l.lu)
        .join(", ")})`,
    ],
    [
      true,
      `1 ${REVIEW_UI.rateBook} · 1 ${REVIEW_UI.wageColumn} · ${draft.periods.length} ${REVIEW_UI.wagePeriods} · ${draft.classes.length} ${REVIEW_UI.classes} ${REVIEW_UI.structureTail}`,
    ],
    [
      true,
      nFunds === 0
        ? REVIEW_UI.noFunds
        : `${nFunds} ${nFunds === 1 ? REVIEW_UI.fund : REVIEW_UI.funds}${
            perClass > 0 ? ` — ${perClass} ${REVIEW_UI.perClassTail}` : ""
          }`,
    ],
    [
      orphans === 0,
      orphans === 0
        ? `${REVIEW_UI.allMapped}${
            notAvailable > 0 ? ` · ${notAvailable} ${REVIEW_UI.naTail}` : ""
          }`
        : `${orphans} ${REVIEW_UI.unmapped}`,
    ],
    [
      !anyTbd,
      anyTbd
        ? `${REVIEW_UI.tbdPending} — ${wageTbd} ${REVIEW_UI.wageWord} / ${benTbd} ${REVIEW_UI.benefitWord} ${REVIEW_UI.cellsUnallocated}`
        : REVIEW_UI.noTbd,
    ],
    [
      premiumsReviewed,
      `${REVIEW_UI.overtime} ${draft.otMult || 1.5}× · ${REVIEW_UI.doubletime} ${draft.dtMult || 2}× ${REVIEW_UI.premiumsApplied}${
        premiumsReviewed ? "" : ` ${REVIEW_UI.premiumsConfirm}`
      }`,
    ],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="mb-5 divide-y divide-gray-100 p-0 shadow-none">
        {checks.map(([ok, label], i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm",
              ok ? "text-gray-700" : "text-amber-700",
            )}
          >
            {ok ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            {label}
          </div>
        ))}
      </Card>

      {dupes.length > 0 && (
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="mb-1.5 text-sm font-semibold text-blue-900">
            {REVIEW_UI.dupesTitle}
          </div>
          <p className="mb-3 text-xs leading-relaxed text-blue-800/90">
            {dupes
              .map(
                (d) =>
                  `LU ${d.local.lu} ${
                    d.hits.length === 1
                      ? REVIEW_UI.dupesOnOne
                      : REVIEW_UI.dupesOnMany
                  } ${d.hits.map((h) => h.name).join(", ")}.`,
              )
              .join(" ")}{" "}
            {priorAgreements.length === 1
              ? REVIEW_UI.dupesTailOne
              : REVIEW_UI.dupesTailMany}
          </p>
          <div className="space-y-2">
            {priorAgreements.map((h) => (
              <label
                key={h.uuid}
                htmlFor={`supersede-${h.uuid}`}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-blue-200 bg-white px-3 py-2.5"
              >
                <Checkbox
                  id={`supersede-${h.uuid}`}
                  variant="dark"
                  checked={!notSuperseding.has(h.uuid)}
                  onCheckedChange={() => toggleSupersede(h.uuid)}
                  className="mt-0.5"
                />
                <span className="text-xs leading-relaxed text-gray-700">
                  {REVIEW_UI.supersedePre}{" "}
                  <span className="font-medium text-gray-900">{h.name}</span>{" "}
                  {REVIEW_UI.supersedePost}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-2 text-sm font-semibold text-gray-900">
        {REVIEW_UI.wagePreview}{" "}
        <span className="text-xs font-normal text-gray-400">
          — {periodLabel(draft.periods[0])}
        </span>
      </div>

      <Card className="mb-5 overflow-hidden p-0 shadow-none">
        <div className="overflow-x-auto">
        <Table className="tabular-nums">
          <TableHeader>
            <TableRow className="bg-gray-50/80 text-xs hover:bg-gray-50/80">
              <TableHead className="px-3 text-xs">{REVIEW_UI.colRole}</TableHead>
              <TableHead className="px-3 text-right text-xs">
                {REVIEW_UI.colWage}
              </TableHead>
              <TableHead className="px-3 text-right text-xs">
                {REVIEW_UI.colDerivation}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draft.classes.map((c) => (
              <TableRow key={c.id} className="hover:bg-transparent">
                <TableCell className="whitespace-nowrap px-3 font-medium text-gray-900">
                  {c.name}
                </TableCell>
                <TableCell className="px-3 text-right">
                  {anchorEmptyAt(c, 0, byId) ? (
                    <Badge variant="info" size="sm">
                      {REVIEW_UI.tbd}
                    </Badge>
                  ) : (
                    money(rateAt(c, byId, 0))
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 text-right text-xs text-gray-400">
                  {derivLabel(c, byId)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </Card>

      {draft.funds.length > 0 && (
        <>
          <div className="mb-2 text-sm font-semibold text-gray-900">
            {REVIEW_UI.benefitPreview}{" "}
            <span className="text-xs font-normal text-gray-400">
              — {REVIEW_UI.benefitAsOf}{" "}
              {draft.periods[0] ? shortDate(draft.periods[0].start) : "—"}
            </span>
          </div>
          <Card className="mb-5 overflow-hidden p-0 shadow-none">
            <Table className="tabular-nums">
              <TableHeader>
                <TableRow className="bg-gray-50/80 text-xs hover:bg-gray-50/80">
                  <TableHead className="px-3 text-xs">{REVIEW_UI.colFund}</TableHead>
                  <TableHead className="px-3 text-xs">{REVIEW_UI.colBasis}</TableHead>
                  <TableHead className="px-3 text-xs">
                    {REVIEW_UI.colPaidBy}
                  </TableHead>
                  <TableHead className="px-3 text-right text-xs">
                    {REVIEW_UI.colP1}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draft.funds.map((f) => (
                  <TableRow key={f.id} className="hover:bg-transparent">
                    <TableCell className="px-3 font-medium text-gray-900">
                      {f.name || REVIEW_UI.notInEffect}
                    </TableCell>
                    <TableCell className="px-3 text-gray-500">
                      {basisLabel(f.basis)}
                    </TableCell>
                    <TableCell className="px-3 text-gray-500">
                      {f.liable === "ER"
                        ? REVIEW_UI.paidByER
                        : REVIEW_UI.paidByEE}
                    </TableCell>
                    <TableCell className="px-3 text-right">
                      {f.perClass ? (
                        <span className="text-xs text-gray-400">
                          {REVIEW_UI.perClassLabel} (
                          {benUnit(f.basis)})
                        </span>
                      ) : f.values[0] === REVIEW_UI.tbd ? (
                        <Badge variant="info" size="sm">
                          {REVIEW_UI.tbd}
                        </Badge>
                      ) : !f.values[0] ? (
                        <span className="text-gray-300">
                          {REVIEW_UI.notInEffect}
                        </span>
                      ) : benUnit(f.basis) === "$" ? (
                        `$${f.values[0]}`
                      ) : (
                        `${f.values[0]}%`
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-5">
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900">
            {draft.name || "—"}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            {REVIEW_UI.term} {isoToMD(draft.start)} – {isoToMD(draft.end)}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            {draft.locals.length} {REVIEW_UI.summaryLocals} · {draft.periods.length}{" "}
            {REVIEW_UI.summaryPeriods} · 1 {REVIEW_UI.rateBook} · 1{" "}
            {REVIEW_UI.wageColumn} · {draft.classes.length}{" "}
            {REVIEW_UI.summaryClasses} · {draft.funds.length}{" "}
            {REVIEW_UI.summaryFunds}
          </div>
        </div>
      </div>
    </div>
  );
}
