import {
  Commission,
  CUSTOMER_PROFILES,
  DISPUTES,
  deriveBuyerSegment,
  formatCurrency,
  formatDateTime,
  getProgramCommissionRatePercent,
  getClickToConversionMinutes
} from "@/lib/mock-data";

export type AttributionState = "verified" | "disputed" | "unestablished";
export type ConfidenceLevel = "High" | "Medium" | "Low";

export type EvidenceSignal = {
  label: string;
  status: "positive" | "warning" | "negative";
};

export type AttributionRecord = {
  commissionId: string;
  creator: string;
  source: string;
  product: string;
  orderValue: string;
  commission: string;
  state: AttributionState;
  confidence: ConfidenceLevel;
  buyerBehaviour: string;
  creatorInteraction: string;
  clickTimestamp?: string;
  purchaseTimestamp: string;
  timeToPurchase?: string;
  sessionContinuity: string;
  creatorCode: string;
  conflictingSignal?: string;
  systemNote?: string;
  systemConfidence: string;
  actions?: string[];
  signals: EvidenceSignal[];
};

function toBuyerBehaviour(segment: string) {
  if (segment.includes("Repeat")) return "Repeat buyer";
  if (segment.includes("Deal")) return "Deal-driven purchase";
  if (segment.includes("Subscription")) return "Subscription buyer";
  if (segment.includes("Gift")) return "Gift buyer";
  return "First-time buyer";
}

function toSourceLabel(source: string) {
  if (source === "TikTok") return "TikTok video link";
  if (source === "Instagram") return "Instagram story link";
  if (source === "YouTube") return "YouTube description link";
  if (source === "Blog") return "Creator blog link";
  if (source === "Newsletter") return "Creator newsletter link";
  if (source === "Search") return "Organic search handoff";
  if (source === "Direct link") return "Direct creator link";
  return `${source} referral link`;
}

function getEstimatedOrderValue(commission: Commission) {
  const rate = getProgramCommissionRatePercent(commission.programName);
  return rate > 0 ? commission.amount / (rate / 100) : commission.amount;
}

export function getAttributionRecord(commission: Commission): AttributionRecord {
  const buyerSegment = deriveBuyerSegment(commission);
  const buyerBehaviour = toBuyerBehaviour(buyerSegment);
  const clickToPurchaseMinutes = getClickToConversionMinutes(commission.clickTimestamp, commission.conversionTimestamp);
  const source = toSourceLabel(commission.referrerSource);
  const disputes = DISPUTES.filter((item) => item.commissionId === commission.id);
  const hasDispute = disputes.length > 0;
  const hasRisk = Boolean(commission.riskFlags?.length);
  const weakReferrer = ["Search", "Direct link", "Newsletter"].includes(commission.referrerSource);
  const unattributed = weakReferrer && commission.customerType === "Returning" && !hasDispute && !hasRisk;

  let state: AttributionState = "verified";
  if (unattributed) state = "unestablished";
  else if (hasDispute || hasRisk || commission.status === "reversed" || clickToPurchaseMinutes > 1440) state = "disputed";

  const confidence: ConfidenceLevel =
    state === "verified" ? (clickToPurchaseMinutes <= 30 ? "High" : "Medium") : state === "disputed" ? "Medium" : "Low";

  const sameSession = clickToPurchaseMinutes <= 30 && !weakReferrer;
  const creatorCode = state === "verified" ? `${commission.publisher.slice(0, 5).toUpperCase()}10 used at checkout` : "None used at checkout";
  const conflictingSignal =
    state === "disputed"
      ? hasDispute
        ? `A dispute is open on this commission citing ${disputes[0].reason.toLowerCase()}. The brand response is ${
            disputes[0].brandResponse ? "still contested by the creator." : "still pending."
          }`
        : hasRisk
          ? `${commission.riskFlags?.[0]} was detected during validation, creating competing evidence against the original attribution path.`
          : "Purchase timing or status history introduces competing signals that weaken the original creator claim."
      : undefined;

  const signals: EvidenceSignal[] =
    state === "verified"
      ? [
          { label: "Direct click path detected", status: "positive" },
          { label: "Session continuity confirmed", status: "positive" },
          { label: "Time-to-purchase within expected window", status: "positive" }
        ]
      : state === "disputed"
        ? [
            { label: "Original click path detected", status: "positive" },
            { label: "Competing or contested attribution signal present", status: "warning" },
            { label: "Validation requires manual review", status: "warning" },
            { label: "No checkout code confirms creator intent", status: "negative" }
          ]
        : [
            { label: "No reliable creator click path confirmed", status: "negative" },
            { label: "No creator code at checkout", status: "negative" },
            { label: "No session continuity supporting attribution", status: "negative" }
          ];

  const systemConfidence =
    state === "verified"
      ? `${confidence} — strong alignment between creator interaction and purchase`
      : state === "disputed"
        ? "Medium — attribution path exists but conflicting or contested signals remain"
        : "Low — insufficient signals to attribute this conversion confidently";

  return {
    commissionId: commission.id,
    creator: state === "unestablished" ? "Unattributed" : commission.publisher,
    source: state === "unestablished" ? "No creator interaction detected" : source,
    product: CUSTOMER_PROFILES[commission.orderId]?.purchased ?? commission.productCategory,
    orderValue: formatCurrency(getEstimatedOrderValue(commission), commission.currency),
    commission: formatCurrency(commission.amount, commission.currency),
    state,
    confidence,
    buyerBehaviour,
    creatorInteraction:
      state === "unestablished" ? "No creator link click or code detected prior to purchase" : `${source} clicked`,
    clickTimestamp: state === "unestablished" ? undefined : formatDateTime(commission.clickTimestamp),
    purchaseTimestamp: formatDateTime(commission.conversionTimestamp),
    timeToPurchase: `${clickToPurchaseMinutes} minutes`,
    sessionContinuity:
      state === "verified"
        ? sameSession
          ? "Same device session confirmed"
          : "Likely same purchase journey"
        : state === "disputed"
          ? "Session continuity weakened during review"
          : "No prior session detected",
    creatorCode,
    conflictingSignal,
    systemNote:
      state === "unestablished"
        ? "This conversion occurred inside an active affiliate programme but without detectable creator influence. The commission is held pending manual review."
        : undefined,
    systemConfidence,
    actions:
      state === "disputed"
        ? ["Review Commission", "Open Dispute"]
        : state === "unestablished"
          ? ["Flag for Review"]
          : undefined,
    signals
  };
}

export function getAttributionSummary(commissions: Commission[]) {
  const records = commissions.map(getAttributionRecord);
  const summary = {
    verified: { conversions: 0, revenue: 0, commission: 0 },
    disputed: { conversions: 0, revenue: 0, commission: 0 },
    unestablished: { conversions: 0, revenue: 0, commission: 0 }
  };

  for (const record of records) {
    const revenue = Number.parseFloat(record.orderValue.replace(/[$,]/g, ""));
    const commission = Number.parseFloat(record.commission.replace(/[$,]/g, ""));
    summary[record.state].conversions += 1;
    summary[record.state].revenue += revenue;
    summary[record.state].commission += commission;
  }

  return summary;
}
