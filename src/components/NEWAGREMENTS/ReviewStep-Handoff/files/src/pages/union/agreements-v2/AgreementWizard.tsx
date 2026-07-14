import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/common/Stepper";
import { WIZARD_STEPS, WIZARD_UI } from "./constants";
import { useAgreementDraft } from "./hooks/useAgreementDraft";
import {
  classificationsValid,
  extraDocsValid,
  fundsValid,
  premiumError,
} from "./utils/validation";
import { anyToISO, anyToMD, isoToMD, periodsValid } from "./utils/periods";
import type {
  PublishError,
  WizardEnvelope,
  WizardSetupBody,
  WizardStep,
  WizardWarning,
} from "./api/types";
import {
  createDraftSetup,
  hydrateBenefits,
  hydrateClassifications,
  hydrateDocs,
  loadDraft,
  toBenefitsBody,
  toClassificationsBody,
  toMappingBody,
  toSetupDocuments,
  toWagesBody,
  publishDraft,
  updateDraftBenefits,
  updateDraftClassifications,
  updateDraftMapping,
  updateDraftSetup,
  updateDraftWages,
} from "./api/wizardApi";
import { StepSetup } from "./components/wizard/steps/Setup";
import { StepClassifications } from "./components/wizard/steps/Classifications";
import { StepWages } from "./components/wizard/steps/Wages";
import { StepBenefits } from "./components/wizard/steps/Benefits";
import { StepMapping } from "./components/wizard/steps/Mapping";
import { StepReview } from "./components/wizard/steps/Review";

const LANDING_PATH = "/union/agreements-v2";

/** Backend wizard step → 1-based Stepper index. */
const STEP_INDEX: Record<WizardStep, number> = {
  setup: 1,
  classifications: 2,
  wages: 3,
  benefits: 4,
  mapping: 5,
  review: 6,
};

/** Warning codes the FE silently absorbs (the re-render shows the corrected value). */
const SILENT_WARNINGS = new Set([
  "derived_st_mismatch",
  "auto_tbd",
  "auto_tbd_missing",
  "derived_tbd_propagated",
  "cycle_detected_skip",
  "tbd_value_contradiction",
  "auto_blank_missing",
  "auto_blank_missing_class",
  "applies_to_shape_mismatch",
  "internal_na_contradiction",
  "unknown_classification_id_dropped",
]);

/**
 * New Agreement wizard shell — the 6-step flow.
 *
 * Routes: `/union/agreements-v2/new` (fresh draft) and
 * `/union/agreements-v2/:uuid/:step` (resume a saved draft).
 *
 * Owns the current step; renders the shared <Stepper>, the active step body, and
 * the footer nav (Save as draft · Back · Continue / Publish).
 *
 * All 6 steps are API-backed: Continue POSTs a new draft (or PATCHes an existing
 * one), sticks the returned UUID to the URL, and resumes via GET on mount; Steps
 * 2–5 PATCH their section and Step 6 POSTs `/publish/`.
 */
export function AgreementWizard() {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid?: string; step?: string }>();
  const { draft, actions } = useAgreementDraft();
  const [cur, setCur] = useState(1);
  const [hydrating, setHydrating] = useState<boolean>(Boolean(uuid));
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Whether the Wages step was completed (multipliers reviewed) — drives the
  // Review checklist's OT/DT row: green once reviewed, amber "— confirm" while
  // the defaults were never even looked at (e.g. a free forward jump).
  const [wagesReviewed, setWagesReviewed] = useState(false);
  // Sequence-ordered backend period ids — aligns Step-3 rate cells to periods.
  const [periodIds, setPeriodIds] = useState<number[]>([]);

  /**
   * Map a wizard envelope → draft fields + the backend period ids. The single
   * place server state flows into the form (resume + after every save). Step-3
   * materialized rates are re-aligned to our index-based cells via `periodIds`.
   */
  const applyEnvelope = (env: WizardEnvelope, rehydrateFunds = false) => {
    const a = env.agreement;
    const periods = [...a.periods].sort((p, q) => p.sequence_no - q.sequence_no);
    const ids = periods.map((p) => p.id);
    setPeriodIds(ids);
    actions.setField({
      name: a.name,
      start: anyToISO(a.start_date),
      end: anyToISO(a.end_date),
      locals: a.locals.map((l) => ({
        code: l.code,
        lu: Number(l.code) || 0,
        region: l.state || "",
      })),
      periods: periods.map((p) => ({
        start: anyToMD(p.start_date),
        end: anyToMD(p.end_date),
      })),
      docs: hydrateDocs(a.documents),
      // Only re-hydrate classes when the response carries them (Step 2/3 PATCH +
      // GET resume). The Setup response has no `payload`, so keep the in-memory
      // classes — else editing Step 1 + Continue would wipe Step 2/3 data.
      ...(Array.isArray(env.payload?.classifications)
        ? { classes: hydrateClassifications(env.payload, ids) }
        : {}),
      // Funds only on resume + the Benefits save — a Step 1 PATCH reindexes
      // benefit cells (period replace), so other saves keep the in-memory funds.
      ...(rehydrateFunds && Array.isArray(env.payload?.benefits)
        ? { funds: hydrateBenefits(env.payload, ids) }
        : {}),
      ...(a.ot_multiplier ? { otMult: Number(a.ot_multiplier) } : {}),
      ...(a.dt_multiplier ? { dtMult: Number(a.dt_multiplier) } : {}),
    });
  };

  /** Toast the non-silent normalization warnings (server auto-corrections). */
  const surfaceWarnings = (warnings?: WizardWarning[]) => {
    const notable = (warnings ?? []).filter(
      (w) => !SILENT_WARNINGS.has(w.code) && w.code !== "no_classifications_yet",
    );
    if (notable.length === 0) return;
    const extra = notable.length - 1;
    toast.warning(
      extra > 0 ? `${notable[0].message} (+${extra} more)` : notable[0].message,
    );
  };

  // Reload-resume: hydrate the saved draft, then jump to the backend's current
  // step. Runs once per uuid.
  useEffect(() => {
    if (!uuid) return;
    let alive = true;
    setHydrating(true);
    loadDraft(uuid).then((res) => {
      if (!alive) return;
      if (res.success && res.data) {
        applyEnvelope(res.data, true);
        setCur(STEP_INDEX[res.data.wizard.current_step] ?? 1);
        // Resuming past Wages ⇒ the step was completed, multipliers reviewed.
        if (STEP_INDEX[res.data.wizard.current_step] > STEP_INDEX.wages) {
          setWagesReviewed(true);
        }
      } else {
        toast.error(res.error ?? "Couldn't load this draft.");
        navigate(LANDING_PATH, { replace: true });
      }
      setHydrating(false);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const total = WIZARD_STEPS.length;
  const orphans = draft.classes.filter(
    (c) => !c.internal && !c.notAvailable,
  ).length;
  const isLast = cur === total;

  // Step 1 requires the key documents (FE rule — backend accepts none): the
  // combined PDF in combined mode, else both the contract and W&B sheet. Any
  // "Additional document" slot must also have a unique name and an attached file
  // (an added-but-empty or duplicate-named extra blocks Continue).
  const docsValid =
    (draft.docs.combinedMode
      ? Boolean(draft.docs.combined)
      : Boolean(draft.docs.contract && draft.docs.wb)) &&
    extraDocsValid(draft.docs.extra);

  // Per-step validity. Each step gates its own Continue; Publish requires ALL.
  const setupValid = Boolean(
    draft.name.trim() &&
      draft.locals.length > 0 &&
      draft.start &&
      draft.end &&
      periodsValid(draft.periods, isoToMD(draft.start), isoToMD(draft.end)) &&
      docsValid,
  );
  const classesValid = classificationsValid(draft.classes);
  const wagesValid = premiumError(draft.otMult, draft.dtMult) === null;
  const benefitsValid = fundsValid(draft.funds);
  const mappingValid = draft.classes.length > 0 && orphans === 0;

  const stepValid =
    cur === 1
      ? setupValid
      : cur === 2
        ? classesValid
        : cur === 3
          ? wagesValid
          : cur === 4
            ? benefitsValid
            : cur === 5
              ? mappingValid  // gate Continue on Mapping too — no orphans (was only enforced at Publish)
              : true;
  const canPublish =
    setupValid && classesValid && wagesValid && benefitsValid && mappingValid;
  const canProceed = isLast ? canPublish : stepValid;

  const exit = () => navigate(LANDING_PATH);
  const go = (n: number) => setCur(Math.max(1, Math.min(total, n)));

  /**
   * Persist Step 1 (POST new / PATCH existing). On success either exits (Save as
   * draft) or advances: a new draft navigates to its UUID URL (the mount effect
   * then resumes); an existing draft re-hydrates docs + jumps to the next step.
   */
  const persistSetup = async (thenExit: boolean) => {
    setSaving(true);
    setSubmitError(null);
    const body: WizardSetupBody = {
      name: draft.name.trim(),
      start: draft.start,
      end: draft.end,
      locals: draft.locals.map((l) => l.code),
      periods: draft.periods,
    };
    const docs = toSetupDocuments(draft.docs);
    const res = uuid
      ? await updateDraftSetup(uuid, body, docs)
      : await createDraftSetup(body, docs);
    setSaving(false);

    if (!res.success || !res.data) {
      const msg = res.error ?? "Couldn't save the agreement. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    const env = res.data;
    if (thenExit) {
      navigate(LANDING_PATH);
      return;
    }
    if (!uuid) {
      // New draft — stick the UUID to the URL; the mount effect resumes from it.
      navigate(`${LANDING_PATH}/${env.agreement.uuid}/${env.wizard.current_step}`, {
        replace: true,
      });
    } else {
      applyEnvelope(env);
      // Advance one step. The backend's current_step is the furthest-reached
      // (MAX rule) — used for resume, NOT step-by-step Continue (else editing an
      // earlier step would skip straight to the furthest one).
      go(cur + 1);
    }
  };

  /**
   * Persist Step 2 (PATCH classifications — full replace). The draft already
   * exists (created in Step 1, uuid on the URL). On success advances to the
   * backend's next step, or exits (Save as draft).
   */
  const persistClassifications = async (thenExit: boolean) => {
    if (!uuid) {
      const msg = "Couldn't find the draft — please complete Setup first.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    setSaving(true);
    setSubmitError(null);
    const res = await updateDraftClassifications(
      uuid,
      toClassificationsBody(draft.classes),
    );
    setSaving(false);
    if (!res.success || !res.data) {
      const msg = res.error ?? "Couldn't save classifications. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    if (thenExit) {
      navigate(LANDING_PATH);
      return;
    }
    // Don't re-hydrate classes here. A Setup PATCH (Step 1) re-creates periods,
    // which can reset the server's materialized wage rates to TBD; the FE keeps
    // its own index-aligned rates (and recomputes derived rows live), and Step 3
    // re-persists them against the current period ids. So just advance.
    go(cur + 1); // advance one step (not the backend's MAX current_step)
  };

  /**
   * Persist Step 3 (PATCH wages — JSON). Sends per-period ST per class + the
   * OT/DT multipliers; the server materializes OT/DT and may return non-blocking
   * normalization warnings, which we surface + re-hydrate the corrected rates.
   * Advances to Benefits.
   */
  const persistWages = async (thenExit: boolean) => {
    if (!uuid) {
      const msg = "Couldn't find the draft — please complete Setup first.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    setSaving(true);
    setSubmitError(null);
    const res = await updateDraftWages(
      uuid,
      toWagesBody(draft.classes, periodIds, draft.otMult, draft.dtMult),
    );
    setSaving(false);
    if (!res.success || !res.data) {
      const msg = res.error ?? "Couldn't save wages. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    const env = res.data;
    applyEnvelope(env); // reflect server-materialized OT/DT + normalized ST
    surfaceWarnings(env.warnings);
    setWagesReviewed(true); // Wages step completed — multipliers reviewed

    if (thenExit) {
      navigate(LANDING_PATH);
      return;
    }
    // Shouldn't happen (Step 2 gates this) — recover defensively.
    if (env.warnings?.some((w) => w.code === "no_classifications_yet")) {
      toast.error("Add classifications first.");
      setCur(2);
      return;
    }
    go(cur + 1); // advance one step (not the backend's MAX current_step)
  };

  /**
   * Persist Step 4 (PATCH benefits — JSON). Sends the funds grid (ALL →
   * per-period values; per-class → values-by-class); the server normalizes the
   * tri-state cells + returns warnings, which we surface + re-hydrate. Advances
   * to Mapping.
   */
  const persistBenefits = async (thenExit: boolean) => {
    if (!uuid) {
      const msg = "Couldn't find the draft — please complete Setup first.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    setSaving(true);
    setSubmitError(null);
    const res = await updateDraftBenefits(
      uuid,
      toBenefitsBody(draft.funds, periodIds, draft.classes),
    );
    setSaving(false);
    if (!res.success || !res.data) {
      const msg = res.error ?? "Couldn't save benefits. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    const env = res.data;
    applyEnvelope(env, true); // re-hydrate funds (server-normalized) + classes
    surfaceWarnings(env.warnings);
    if (thenExit) {
      navigate(LANDING_PATH);
      return;
    }
    go(cur + 1); // advance one step (not the backend's MAX current_step)
  };

  /**
   * Persist Step 5 (PATCH mapping — JSON). Sends each class's internal_id (or the
   * Not-Available flag); the server computes status, stamps internal_name, and may
   * auto-clear stale/foreign ids (warning). Re-hydrates classes + advances to Review.
   */
  const persistMapping = async (thenExit: boolean) => {
    if (!uuid) {
      const msg = "Couldn't find the draft — please complete Setup first.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    setSaving(true);
    setSubmitError(null);
    const res = await updateDraftMapping(uuid, toMappingBody(draft.classes));
    setSaving(false);
    if (!res.success || !res.data) {
      const msg = res.error ?? "Couldn't save the mapping. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    const env = res.data;
    applyEnvelope(env, true); // re-hydrate classes (status + internal_name) + funds
    surfaceWarnings(env.warnings);
    if (thenExit) {
      navigate(LANDING_PATH);
      return;
    }
    go(cur + 1); // advance one step (not the backend's MAX current_step)
  };

  /**
   * Publish Step 6 (POST /publish/ — atomic flush to the live V1 tables). On
   * success the draft becomes a PUBLISHED agreement; surface any non-blocking
   * warnings and return to the landing list (it now shows as Active). A 409 means
   * it was already published (a retry after a network drop) — treat as success. A
   * 422 carries structured per-row errors; show them and stay on Review.
   */
  const publishAgreement = async () => {
    if (!uuid) {
      const msg = "Couldn't find the draft — please complete Setup first.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    setSaving(true);
    setSubmitError(null);
    const res = await publishDraft(uuid);
    setSaving(false);

    const fields = res.fields ?? {};
    if (res.success && res.data) {
      surfaceWarnings(res.data.warnings); // classes_unmapped / locals_already_covered / no_benefits
      toast.success(WIZARD_UI.publishedToast);
      navigate(LANDING_PATH);
      return;
    }
    if (fields.code === "already_published") {
      toast.success(WIZARD_UI.publishedToast); // retry hit a prior success
      navigate(LANDING_PATH);
      return;
    }
    // 422 payload_invalid / db_integrity_error (structured), or a generic failure.
    const rows = Array.isArray(fields.errors) ? (fields.errors as PublishError[]) : [];
    const msg = rows.length
      ? rows.map((e) => e.message).filter(Boolean).join(" ")
      : (res.error ?? WIZARD_UI.publishFailed);
    setSubmitError(msg);
    toast.error(msg);
  };

  const onPrimary = async () => {
    if (!canProceed || saving) return;
    if (cur === 1) return persistSetup(false);
    if (cur === 2) return persistClassifications(false);
    if (cur === 3) return persistWages(false);
    if (cur === 4) return persistBenefits(false);
    if (cur === 5) return persistMapping(false);
    if (!isLast) return go(cur + 1);
    return publishAgreement(); // Step 6 — POST /publish/ (atomic commit to V1).
  };

  if (hydrating) {
    return (
      <div className="flex h-full min-w-0 items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-0 flex-col bg-white font-inter">
      {/* Cancel sits at the right end of the stepper row (reuses the empty space
          beside the centered steps) — exits to the Agreements list. */}
      <Stepper
        steps={WIZARD_STEPS}
        currentStep={cur}
        onStepClick={go}
        variant="dark"
        labelBreakpoint="xl"
        trailing={
          <Button
            variant="ghost"
            size="sm"
            onClick={exit}
            className="gap-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            {WIZARD_UI.cancel}
          </Button>
        }
      />

      {/* Step body — scrolls; fills the space between the stepper and footer. */}
      <div className="min-h-0 flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-5xl">
          {submitError && (
            <div className="mx-auto max-w-2xl">
              <Alert variant="destructive" className="mb-5">
                {submitError}
              </Alert>
            </div>
          )}
          {cur === 1 && (
            <StepSetup
              draft={draft}
              setField={actions.setField}
              removePeriod={actions.removePeriod}
              setPeriodCount={actions.setPeriodCount}
            />
          )}
          {cur === 2 && (
            <StepClassifications
              draft={draft}
              updateClass={actions.updateClass}
              addClass={actions.addClass}
              removeClass={actions.removeClass}
            />
          )}
          {cur === 3 && (
            <StepWages
              draft={draft}
              updateClass={actions.updateClass}
              setField={actions.setField}
              fullWidth
            />
          )}
          {cur === 4 && (
            <StepBenefits
              draft={draft}
              updateFund={actions.updateFund}
              addFund={actions.addFund}
              removeFund={actions.removeFund}
              fullWidth
            />
          )}
          {cur === 5 && (
            <StepMapping draft={draft} updateClass={actions.updateClass} />
          )}
          {cur === 6 && (
            <StepReview draft={draft} premiumsReviewed={wagesReviewed} />
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-end border-t border-gray-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-3">
          {cur > 1 && (
            <Button variant="ghost" onClick={() => go(cur - 1)} disabled={saving}>
              <ArrowLeft className="h-4 w-4" /> {WIZARD_UI.back}
            </Button>
          )}
          <Button
            variant="orange"
            onClick={onPrimary}
            disabled={!canProceed || saving}
            title={
              !canProceed
                ? isLast
                  ? WIZARD_UI.publishBlocked
                  : WIZARD_UI.continueBlocked
                : undefined
            }
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? WIZARD_UI.saving : isLast ? WIZARD_UI.publish : WIZARD_UI.continue}
            {!saving && !isLast && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AgreementWizard;
