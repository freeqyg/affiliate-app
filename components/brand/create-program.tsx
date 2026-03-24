"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Check, ChevronDown, Rocket, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const steps = ["Program Basics", "Governance Rules", "Publisher Preview", "Confirm & Publish"] as const;
const reversalOptions = [
  "Product returned by customer",
  "Order cancelled before fulfillment",
  "Duplicate or fraudulent conversion",
  "Policy violation by publisher",
  "Funding hold or billing issue"
];
const FLOW_COLUMN_CLASS = "mx-auto w-full max-w-[860px]";
const FLOW_INPUT_CLASS = "h-9 rounded-[6px] border-black/10 bg-[rgba(224,249,255,0.6)] text-[#04070f] placeholder:text-[#04070f]/50";
const FLOW_FIELD_LABEL_CLASS = "text-[16px] font-semibold tracking-[-0.32px] text-[#04070f]";

export type CreateProgramDraft = {
  programName: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  commissionRate: string;
  commissionType: "Percentage" | "Flat Fee";
  cookieWindow: string;
  attributionModel: "Last-click" | "First-click" | "Multi-touch";
  validationWindow: string;
  reversalReasons: string;
  explanationCommitment: "Optional" | "Required";
  disputeWindow: string;
  enrollment: "Open" | "Invite Only";
};

export function CreateProgram({
  onSaveDraft,
  onPublish,
  onStepChange
}: {
  onSaveDraft: (draft: CreateProgramDraft) => void;
  onPublish: (draft: CreateProgramDraft) => void;
  onStepChange?: (step: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreateProgramDraft>({
    programName: "",
    category: "Snack & CPG",
    description: "",
    startDate: "",
    endDate: "",
    commissionRate: "12",
    commissionType: "Percentage",
    cookieWindow: "30 days",
    attributionModel: "Last-click",
    validationWindow: "30 days",
    reversalReasons: "Duplicate or fraudulent conversion",
    explanationCommitment: "Optional",
    disputeWindow: "7 days",
    enrollment: "Open"
  });
  const [selectedReversalReasons, setSelectedReversalReasons] = useState<string[]>(["Duplicate or fraudulent conversion"]);

  const pageMeta = useMemo(() => {
    if (step === 0) {
      return {
        title: "Program Basics",
        subtitle: "Set up the fundamentals of your program."
      };
    }
    if (step === 1) {
      return {
        title: "Governance Rules",
        subtitle: "Define the rules publishers will be held to and the commitments you're making to them."
      };
    }
    if (step === 2) {
      return {
        title: "Publisher Terms Preview",
        subtitle: "This is what creators will see when they’re invited to your program."
      };
    }
    return {
      title: "Review and Publish",
      subtitle: "Review your settings before publishing. You can also save as draft."
    };
  }, [step]);

  const isStepOneInvalid = !form.programName.trim() || !form.startDate.trim() || !form.commissionRate.trim();
  const isLastStep = step === steps.length - 1;
  const commissionDisplay = form.commissionType === "Percentage" ? `${form.commissionRate || "0"}%` : `$${form.commissionRate || "0"}`;

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  return (
    <div className="flex w-full flex-col gap-6">
      <Stepper currentStep={step} />

      <div className={cn(FLOW_COLUMN_CLASS, "space-y-2 pt-[26px] text-center")}>
        <h1 className="text-[44px] font-semibold leading-[1] tracking-[-0.2px] text-[#04070f]">{pageMeta.title}</h1>
        <p className="text-[18px] text-muted-foreground">{pageMeta.subtitle}</p>
      </div>

      {step === 0 && (
        <div className={FLOW_COLUMN_CLASS}>
          <FlowCard>
            <FlowSection>
              <Field label="Program Name" required>
                <Input
                  value={form.programName}
                  placeholder="e.g. Chocolate Bar Drop Vol. 4"
                  className={FLOW_INPUT_CLASS}
                  onChange={(e) => setForm({ ...form, programName: e.target.value })}
                />
              </Field>
            </FlowSection>

            <SectionDivider />

            <FlowSection>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Start Date" required>
                  <DateLikeInput
                    value={form.startDate}
                    placeholder="Select date"
                    onChange={(v) => setForm({ ...form, startDate: v })}
                  />
                </Field>
                <Field label="End Date">
                  <DateLikeInput
                    value={form.endDate}
                    placeholder="Ongoing"
                    onChange={(v) => setForm({ ...form, endDate: v })}
                  />
                </Field>
              </div>
            </FlowSection>

            <SectionDivider />

            <FlowSection>
              <CommissionTypeRateRow
                commissionType={form.commissionType}
                commissionRate={form.commissionRate}
                onTypeChange={(v) => setForm({ ...form, commissionType: v })}
                onRateChange={(v) => setForm({ ...form, commissionRate: v })}
              />
            </FlowSection>

            <SectionDivider />

            <FlowSection>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Cookie Window">
                  <SelectLike
                    value={form.cookieWindow}
                    options={["7 days", "14 days", "30 days"]}
                    onChange={(v) => setForm({ ...form, cookieWindow: v })}
                  />
                </Field>
                <Field label="Validation Window">
                  <SelectLike
                    value={form.validationWindow}
                    options={["7 days", "14 days", "21 days", "30 days"]}
                    onChange={(v) => setForm({ ...form, validationWindow: v })}
                  />
                </Field>
              </div>
            </FlowSection>

            <SectionDivider />

            <FlowSection>
              <InlineSegmentField
                label="Publisher Enrollment"
                value={form.enrollment}
                options={["Open", "Invite Only"]}
                onChange={(v) => setForm({ ...form, enrollment: v as CreateProgramDraft["enrollment"] })}
              />
            </FlowSection>
          </FlowCard>
        </div>
      )}

      {step === 1 && (
        <div className={FLOW_COLUMN_CLASS}>
          <FlowCard>
            <FlowSection className="space-y-3">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.2px]">Attribution Model</h2>
                <p className="text-sm text-muted-foreground">Choose how conversions are credited to publishers.</p>
              </div>

              <div className="space-y-3">
                <AttributionOption
                  checked={form.attributionModel === "Last-click"}
                  title="Last-click"
                  description="Full credit to the final touchpoint before purchase."
                  onSelect={() => setForm({ ...form, attributionModel: "Last-click" })}
                />
                <AttributionOption
                  checked={form.attributionModel === "First-click"}
                  title="First-click"
                  description="Full credit to the first touchpoint that drove awareness."
                  onSelect={() => setForm({ ...form, attributionModel: "First-click" })}
                />
                <AttributionOption
                  checked={form.attributionModel === "Multi-touch"}
                  title="Multi-touch"
                  description="Credit distributed across touchpoints proportionally."
                  onSelect={() => setForm({ ...form, attributionModel: "Multi-touch" })}
                  recommendation="Recommended"
                />
              </div>
            </FlowSection>

            <SectionDivider />

            <FlowSection className="space-y-3">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.2px]">Reversal Policy</h2>
                <p className="text-sm text-muted-foreground">Select the reasons you may reverse a commission.</p>
              </div>

              <div className="space-y-2">
                {reversalOptions.map((option) => {
                  const active = selectedReversalReasons.includes(option);
                  return (
                    <label key={option} className="flex items-center gap-3 text-[15px]">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...selectedReversalReasons, option]
                            : selectedReversalReasons.filter((item) => item !== option);
                          setSelectedReversalReasons(next);
                          setForm({ ...form, reversalReasons: next.join(", ") });
                        }}
                        className="h-4 w-4 rounded border-black"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>

              <SectionDivider />

              <GovernanceFooterRow
                explanationCommitment={form.explanationCommitment}
                disputeWindow={form.disputeWindow}
                onExplanationChange={(v) =>
                  setForm({ ...form, explanationCommitment: v as CreateProgramDraft["explanationCommitment"] })
                }
                onDisputeWindowChange={(v) => setForm({ ...form, disputeWindow: v })}
              />
            </FlowSection>
          </FlowCard>
        </div>
      )}

      {step === 2 && (
        <div className={cn(FLOW_COLUMN_CLASS, "space-y-4")}>
          <FlowCard>
            <FlowSection className="space-y-1">
              <p className="text-[32px] font-semibold tracking-[-0.2px] text-[#04070f]">{form.programName || "Program Name"}</p>
              <p className="text-[20px] text-muted-foreground">
                {formatProgramDate(form.startDate) || "Start date"} — {formatProgramDate(form.endDate) || "Ongoing"}
              </p>
            </FlowSection>

            <SectionDivider />

            <FlowSection>
              <div className="grid gap-4 md:grid-cols-2">
                <PreviewItem title="Commission" value={`${commissionDisplay} per conversion`} />
                <PreviewItem title="Cookie Window" value={form.cookieWindow} />
              </div>
            </FlowSection>

            <SectionDivider />

            <FlowSection className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <PreviewItem title="Attribution Model" value={form.attributionModel} />
                <PreviewItem title="Validation Window" value={`Commissions reviewed within ${form.validationWindow}.`} />
                <PreviewItem title="Reversal Reasons" value={form.reversalReasons || "None selected"} />
                <PreviewItem title="Explanation Commitment" value={form.explanationCommitment} />
              </div>
                <PreviewItem title="Dispute Window" value={form.disputeWindow} />
            </FlowSection>
          </FlowCard>
          <p className="text-sm text-muted-foreground">
            These terms are locked once the program is published. To change them, create a new program version.
          </p>
        </div>
      )}

      {step === 3 && (
        <div className={cn(FLOW_COLUMN_CLASS, "space-y-4")}>
          <ReviewCard
            title="Basics"
            rows={[
              ["Name", form.programName || "—"],
              ["Dates", `${formatProgramDate(form.startDate) || "—"} — ${formatProgramDate(form.endDate) || "Ongoing"}`],
              ["Commission", `${commissionDisplay} per conversion`],
              ["Cookie window", form.cookieWindow],
              ["Validation window", form.validationWindow],
              ["Enrollment", form.enrollment]
            ]}
          />
          <ReviewCard title="Attribution" rows={[["Model", form.attributionModel]]} />
          <ReviewCard
            title="Reversal Policy"
            rows={[
              ["Reasons", form.reversalReasons || "—"],
              ["Notes", form.explanationCommitment]
            ]}
          />
          <ReviewCard title="Dispute Rules" rows={[["Publisher dispute window", form.disputeWindow]]} />
        </div>
      )}

      <div className={cn(FLOW_COLUMN_CLASS, "pb-[100px] pt-4")}>
        <div className="flex items-center justify-between">
          {step === 0 ? (
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          <div className="flex items-center gap-2">
            {isLastStep && (
              <Button variant="outline" onClick={() => onSaveDraft(form)}>
                <Save className="h-4 w-4" />
                Save as Draft
              </Button>
            )}
            {!isLastStep ? (
              <Button onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))} disabled={step === 0 && isStepOneInvalid}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => onPublish(form)}>
                <Rocket className="h-4 w-4" />
                Publish Program
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-5">
      {steps.map((label, index) => {
        const complete = index < currentStep;
        const active = index === currentStep;
        return (
          <div key={label} className="flex items-center gap-2.5">
            <div
              className={[
                "flex h-[27px] w-[27px] items-center justify-center rounded-full border-2 p-[2px] text-[14px] font-semibold leading-5",
                complete || active ? "border-black bg-black text-white" : "border-black bg-white text-black"
              ].join(" ")}
            >
              {complete ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <p className={["text-[16px] leading-[22.857px] tracking-[-0.32px] text-[#04070f]", active || complete ? "font-semibold" : "font-normal"].join(" ")}>
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className={FLOW_FIELD_LABEL_CLASS}>
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SelectLike({
  value,
  options,
  onChange
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-[6px] border border-black/10 bg-[rgba(224,249,255,0.6)] px-3 pr-8 text-sm text-[#04070f]"
        style={{ borderColor: "rgba(0,0,0,0.10)" }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
    </div>
  );
}

function DateLikeInput({
  value,
  placeholder,
  onChange
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
      <Input
        ref={inputRef}
        type="date"
        value={value}
        aria-label={placeholder}
        className={cn(
          FLOW_INPUT_CLASS,
          "pl-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0"
        )}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => inputRef.current?.showPicker?.()}
      />
    </div>
  );
}

function formatProgramDate(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function Segmented({
  options,
  value,
  onChange
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex h-10 rounded-[10px] border-2 border-black bg-black p-1 shadow-[2px_2px_0px_0px_black]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={[
            "h-7 rounded-[6px] px-4 text-[14px] font-medium leading-5 transition-colors",
            value === option ? "bg-white text-black" : "text-white hover:bg-white/10"
          ].join(" ")}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SectionDivider() {
  return <div className="h-px w-full bg-black/15" />;
}

function AttributionOption({
  checked,
  title,
  description,
  recommendation,
  onSelect
}: {
  checked: boolean;
  title: string;
  description: string;
  recommendation?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-[12px] border-2 bg-white p-3.5 text-left transition-colors",
        checked ? "border-black" : "border-black/20 hover:border-black/40"
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className={["h-4 w-4 rounded-full border-2", checked ? "border-black bg-black" : "border-black/30"].join(" ")} />
        <p className="text-[24px] font-semibold leading-none tracking-[-0.2px] text-[#04070f]">{title}</p>
        {recommendation && (
          <span className="rounded-full bg-[#a6f2b4] px-2 py-0.5 text-xs font-medium text-[#0d5e1d]">{recommendation}</span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

function PreviewItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.72px] text-muted-foreground">{title}</p>
      <p className="text-[18px] text-[#04070f]">{value}</p>
    </div>
  );
}

function ReviewCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <FlowCard>
      <FlowSection className="space-y-3">
        <h2 className="text-[28px] font-semibold tracking-[-0.2px] text-[#04070f]">{title}</h2>
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-1 gap-1 border-b border-black/10 pb-2.5 last:border-0 last:pb-0 md:grid-cols-[220px_minmax(0,1fr)] md:gap-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-[18px] font-medium text-[#04070f]">{value}</p>
          </div>
        ))}
      </FlowSection>
    </FlowCard>
  );
}

function FlowCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("overflow-hidden rounded-[24px]", className)}>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

function FlowSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 md:p-6", className)}>{children}</div>;
}

function InlineSegmentField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-[16px] font-semibold tracking-[-0.32px] text-[#04070f]">{label}</Label>
      <div className="inline-flex h-10 items-start rounded-[10px] border-2 border-black bg-black p-1 shadow-[2px_2px_0px_0px_black]">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-[6px] px-4 py-1 text-[14px] font-medium leading-5",
              value === option ? "bg-white text-black" : "text-white"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function CommissionTypeRateRow({
  commissionType,
  commissionRate,
  onTypeChange,
  onRateChange
}: {
  commissionType: CreateProgramDraft["commissionType"];
  commissionRate: string;
  onTypeChange: (value: CreateProgramDraft["commissionType"]) => void;
  onRateChange: (value: string) => void;
}) {
  const isPercent = commissionType === "Percentage";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[16px] font-semibold tracking-[-0.32px] text-[#04070f]">Commission Type</Label>
        <div className="inline-flex h-10 items-start rounded-[10px] border-2 border-black bg-black p-1 shadow-[2px_2px_0px_0px_black]">
          <button
            type="button"
            onClick={() => onTypeChange("Percentage")}
            className={cn(
              "rounded-[6px] px-4 py-1 text-[14px] font-medium leading-5",
              isPercent ? "bg-white text-black" : "text-white"
            )}
          >
            %
          </button>
          <button
            type="button"
            onClick={() => onTypeChange("Flat Fee")}
            className={cn(
              "rounded-[6px] px-4 py-1 text-[14px] font-medium leading-5",
              !isPercent ? "bg-white text-black" : "text-white"
            )}
          >
            Flat Fee
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label className="text-[16px] font-semibold tracking-[-0.32px] text-[#04070f]">
          Commission Rate<span className="ml-1 text-primary">*</span>
        </Label>
        <div
          className="inline-flex h-9 items-center gap-1 rounded-[6px] border border-black/10 bg-[rgba(224,249,255,0.6)] px-3"
          style={{ borderColor: "rgba(0,0,0,0.10)" }}
        >
          {!isPercent && <span className="text-[14px] text-[#04070f]">$</span>}
          <input
            type="text"
            inputMode="decimal"
            value={commissionRate}
            onChange={(e) => onRateChange(e.target.value)}
            className="w-10 bg-transparent text-[14px] text-[#04070f]/70 outline-none"
            placeholder="12"
          />
          {isPercent && <span className="text-[14px] text-[#04070f]">%</span>}
        </div>
      </div>
    </div>
  );
}

function GovernanceFooterRow({
  explanationCommitment,
  disputeWindow,
  onExplanationChange,
  onDisputeWindowChange
}: {
  explanationCommitment: CreateProgramDraft["explanationCommitment"];
  disputeWindow: string;
  onExplanationChange: (value: string) => void;
  onDisputeWindowChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,280px)_minmax(0,1fr)_minmax(0,180px)] lg:items-center">
      <Label className="text-[16px] font-semibold tracking-[-0.32px] text-[#04070f] lg:text-[18px]">
        Supporting note on reversals
      </Label>

      <div className="inline-flex h-10 w-full items-start rounded-[10px] border-2 border-black bg-black p-1 shadow-[2px_2px_0px_0px_black]">
        {(["Optional", "Required"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onExplanationChange(option)}
            className={cn(
              "flex flex-1 items-center justify-center rounded-[6px] px-4 py-1 text-[14px] font-medium leading-5 transition-colors",
              explanationCommitment === option ? "bg-white text-black" : "text-white"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <Label className="text-[16px] font-semibold tracking-[-0.32px] text-[#04070f] lg:text-[18px]">
        Publisher dispute window
      </Label>

      <div className="relative w-full">
        <select
          value={disputeWindow}
          onChange={(e) => onDisputeWindowChange(e.target.value)}
          className="h-[56px] w-full appearance-none rounded-[14px] border border-black/10 bg-[rgba(224,249,255,0.6)] px-5 pr-12 text-[18px] font-medium tracking-[-0.36px] text-[#04070f]"
          style={{ borderColor: "rgba(0,0,0,0.10)" }}
        >
          {["7 days", "14 days", "21 days"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/50" />
      </div>
    </div>
  );
}
