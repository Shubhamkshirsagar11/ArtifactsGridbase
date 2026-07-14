import { useEffect, useMemo, useState } from "react";
import { fetchAgreements } from "../api/agreementsApi";
import type { AgreementListRow } from "../api/types";
import type { CoveredLocal } from "../types";

/** A drafted local that's already covered by ≥1 Active agreement, with the hits. */
export interface AlreadyCoveredLocal {
  local: CoveredLocal;
  hits: AgreementListRow[];
}

/**
 * Live "already-covered locals" advisory for the Review step: fetches the
 * Active agreements covering any of the drafted locals
 * (`GET /agreements/?status=active&union_code=…`). Replaces the mock-data
 * advisory, which could name agreements the org doesn't actually have.
 *
 * Advisory-only, so a fetch failure stays silent (no toast, no card) — the
 * publish response independently carries the `locals_already_covered` warning.
 */
export function useAlreadyCovered(locals: CoveredLocal[]) {
  const codes = useMemo(
    () =>
      locals
        .map((l) => l.code)
        .filter(Boolean)
        .sort()
        .join(","),
    [locals],
  );
  const [rows, setRows] = useState<AgreementListRow[]>([]);

  useEffect(() => {
    if (!codes) {
      setRows([]);
      return;
    }
    let alive = true;
    fetchAgreements({ status: "active", union_code: codes, size: 50 }).then(
      (res) => {
        if (!alive) return;
        setRows(res.success && res.data ? res.data.results : []);
      },
    );
    return () => {
      alive = false;
    };
  }, [codes]);

  const dupes = useMemo<AlreadyCoveredLocal[]>(
    () =>
      locals
        .map((local) => ({
          local,
          hits: rows.filter((r) =>
            r.locals.some((c) => c.code === local.code),
          ),
        }))
        .filter((d) => d.hits.length > 0),
    [locals, rows],
  );

  return { dupes } as const;
}
