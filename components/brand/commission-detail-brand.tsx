"use client";

import { Flag, RotateCcw } from "lucide-react";
import { BRAND_PROGRAMS_DATA, Commission, CREATOR_PROFILES, CUSTOMER_PROFILES, formatCurrency, formatDateTime, getAgeDays } from "@/lib/mock-data";
import { getAttributionRecord } from "@/lib/verified-influence";
import { CommissionStatusChip } from "@/components/commission-status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function CommissionDetailBrand({ commission }: { commission: Commission }) {
  const creator = CREATOR_PROFILES[commission.publisher];
  const customer = CUSTOMER_PROFILES[commission.orderId];
  const commissionRate = parseFloat(BRAND_PROGRAMS_DATA[commission.programName]?.commissionRate || "14");
  const estimatedOrderValue = commissionRate > 0 ? commission.amount / (commissionRate / 100) : commission.amount;
  const attribution = getAttributionRecord(commission);
  const timelineItems = [
    { label: "Creator Interaction", value: attribution.creatorInteraction },
    { label: "Purchase Timestamp", value: attribution.purchaseTimestamp },
    { label: "Session Continuity", value: attribution.sessionContinuity },
    ...(attribution.clickTimestamp ? [{ label: "Click Timestamp", value: attribution.clickTimestamp }] : []),
    { label: "Time to Purchase", value: attribution.timeToPurchase ?? "Unavailable" },
    { label: "Creator Code", value: attribution.creatorCode }
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_360px]">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-start justify-between gap-4 px-5 py-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-semibold leading-[22px] tracking-[-0.66px] text-[#04070f]">
                  {commission.id}
                </h1>
                <CommissionStatusChip status={commission.status} />
              </div>
              <p className="text-[12px] leading-4 text-[#ff6088]">
                {attribution.state === "verified"
                  ? "This commission looks verified"
                  : attribution.state === "disputed"
                    ? "This commission is disputed"
                    : "This commission is still unestablished"}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <InlineChip>{attribution.state}</InlineChip>
              <InlineChip>{attribution.confidence} confidence</InlineChip>
              <InlineChip>{attribution.buyerBehaviour}</InlineChip>
            </div>
          </div>

          <div className="flex flex-col items-center gap-[9px] px-[30px] py-[40px] text-center">
            {timelineItems.map((item, index) => (
              <div key={item.label} className="flex flex-col items-center gap-[9px]">
                <div className="flex flex-col items-center gap-[6px]">
                  <span className="h-[10px] w-[10px] rounded-full bg-[#ff6088]" />
                  <div className="flex flex-col items-center">
                    <p className="text-[12px] leading-4 text-[#525c63]">{item.label}</p>
                    <p className="max-w-[420px] text-[16px] font-medium leading-6 text-[#04070f]">{item.value}</p>
                  </div>
                </div>
                {index < timelineItems.length - 1 ? <div className="h-[33px] w-px bg-black/70" /> : null}
              </div>
            ))}
          </div>

          {attribution.conflictingSignal ? (
            <div className="px-5 pb-5">
              <div className="rounded-[14px] bg-[#fff0d9] px-[18px] py-[18px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#7a3e00]">Why this is contested</p>
                <p className="mt-2 text-[14px] leading-6 text-[#6d3900]">{attribution.conflictingSignal}</p>
              </div>
            </div>
          ) : attribution.systemNote ? (
            <div className="px-5 pb-5">
              <div className="rounded-[14px] border border-black/10 bg-[#f7f9fb] px-[18px] py-[18px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#525c63]">System Note</p>
                <p className="mt-2 text-[14px] leading-6 text-[#04070f]/78">{attribution.systemNote}</p>
              </div>
            </div>
          ) : null}

          <div className="grid border-t border-black/10 lg:grid-cols-2">
            <div className="border-r border-black/10 px-[30px] py-[30px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/52">Attribution signals</p>
              <ul className="mt-3 space-y-2">
                {attribution.signals.map((signal) => (
                  <li key={signal.label} className="flex gap-2 text-[14px] leading-6 text-[#04070f]">
                    <span className="font-semibold">
                      {signal.status === "positive" ? "✓" : signal.status === "warning" ? "⚠" : "✗"}
                    </span>
                    <span>{signal.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-[30px] py-[30px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/52">System confidence</p>
              <p className="mt-3 max-w-[260px] text-[14px] leading-6 text-[#04070f]/78">{attribution.systemConfidence}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Commission Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Detail label="Program" value={commission.programName} />
            <Detail label="Model" value={commission.attributionModel} />
            <Detail label="Window" value={commission.cookieWindow} />
            <Detail label="Referrer" value={commission.referrerSource} />
            <Detail label="Device" value={commission.device} />
            <Detail label="Category" value={commission.productCategory} />
            <Detail label="Order Value" value={formatCurrency(estimatedOrderValue, commission.currency)} />
            <Detail label="Commission" value={formatCurrency(commission.amount, commission.currency)} />
            <Detail label="Order Ref" value={commission.orderId} />
            <Detail label="Time in State" value={`${getAgeDays(commission.conversionTimestamp)}d`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Participating Creator</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-md border border-black/10 bg-[rgba(242,253,255,0.35)] p-3">
              <img
                alt={commission.publisher}
                src={creator?.avatar ?? "https://i.pravatar.cc/80"}
                className="h-11 w-11 rounded-full border border-black/10 object-cover"
              />
              <div>
                <p className="text-[15px] font-semibold leading-[20px] text-[#04070f]">{commission.publisher}</p>
                <p className="text-xs text-muted-foreground">{creator?.handle ?? "@creator"} · {creator?.niche ?? "Creator"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Detail label="Source" value={commission.referrerSource} />
              <Detail label="Conversion Date" value={formatDateTime(commission.conversionTimestamp)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Customer Insight</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-black/10 bg-[rgba(55,220,255,0.2)] p-3">
              <p className="text-[15px] font-semibold leading-[20px] text-[#04070f]">
                {customer?.name ?? "Unknown Buyer"}
              </p>
              <p className="text-xs text-muted-foreground">
                {customer ? `${customer.city}, ${customer.region}` : "Location unavailable"} · {customer?.buyerProfile ?? "General Buyer"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Detail label="Purchased" value={customer?.purchased ?? commission.productCategory} />
              <Detail label="Customer Type" value={commission.customerType} />
              <Detail label="Validation Window" value={`${commission.validationWindowDays} days`} />
              <Detail label="Est. Order Value" value={formatCurrency(estimatedOrderValue, commission.currency)} />
            </div>
          </CardContent>
        </Card>

        {(commission.status === "pending" || commission.status === "recorded") && (
          <Card>
            <CardHeader><CardTitle className="text-base">Brand Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Approve</Button>
              <Button className="w-full" variant="outline"><RotateCcw className="h-4 w-4" />Reverse</Button>
              <Button className="w-full" variant="outline"><Flag className="h-4 w-4" />Flag</Button>
            </CardContent>
          </Card>
        )}

        {commission.status === "reversed" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Reversal Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Detail label="Reason" value={commission.reversalReason || "-"} />
              <Detail label="Confidence" value={commission.reversalConfidence || "-"} />
              <Textarea defaultValue={commission.reversalNote} placeholder="Add internal note" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function InlineChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-black bg-white/80 px-[11px] py-[5px] text-[11px] font-medium capitalize text-[#04070f]">
      {children}
    </span>
  );
}
