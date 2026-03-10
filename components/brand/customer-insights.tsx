"use client";

import { useMemo, useState } from "react";
import {
  COMMISSIONS,
  CUSTOMER_PROFILES,
  BRAND_PROGRAMS_DATA,
  deriveBuyerSegment,
  estimateAttributedRevenue,
  formatCurrency,
  formatDateTime,
  getCustomerKey
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListSurface } from "@/components/ui/list-surface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SegmentRow = {
  segment: string;
  customers: number;
  conversions: number;
  revenue: number;
};

type ProgramAudienceRow = {
  programName: string;
  businessUnit: string;
  topSegment: string;
  conversions: number;
  revenue: number;
};

type CustomerTrailRow = {
  orderId: string;
  customerName: string;
  location: string;
  segment: string;
  purchased: string;
  programName: string;
  businessUnit: string;
  amount: number;
  conversionTimestamp: string;
};

type InsightRow = {
  customerKey: string;
  customerName: string;
  segment: string;
  purchased: string;
  location: string;
  businessUnit: string;
  attributedRevenue: number;
  orderId: string;
  programName: string;
  amount: number;
  conversionTimestamp: string;
};

type InsightSummary = {
  topSegment: string;
  uniqueCustomers: number;
  totalRevenue: number;
  returningRate: number;
  programRows: ProgramAudienceRow[];
  trailRows: CustomerTrailRow[];
};

function computeSummary(rows: InsightRow[]): InsightSummary {
  const byProgram = rows.reduce<Record<string, ProgramAudienceRow>>((acc, row) => {
    acc[row.programName] ??= {
      programName: row.programName,
      businessUnit: row.businessUnit,
      topSegment: "—",
      conversions: 0,
      revenue: 0
    };
    acc[row.programName].conversions += 1;
    acc[row.programName].revenue += row.attributedRevenue;
    return acc;
  }, {});

  Object.values(byProgram).forEach((program) => {
    const segmentCount = rows
      .filter((row) => row.programName === program.programName)
      .reduce<Record<string, number>>((acc, row) => {
        acc[row.segment] = (acc[row.segment] ?? 0) + 1;
        return acc;
      }, {});
    program.topSegment =
      Object.entries(segmentCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "General Buyer";
  });

  const programRows = Object.values(byProgram).sort((a, b) => b.conversions - a.conversions);

  const trailRows: CustomerTrailRow[] = rows
    .map((row) => ({
      orderId: row.orderId,
      customerName: row.customerName,
      location: row.location,
      segment: row.segment,
      purchased: row.purchased,
      programName: row.programName,
      businessUnit: row.businessUnit,
      amount: row.amount,
      conversionTimestamp: row.conversionTimestamp
    }))
    .sort((a, b) => +new Date(b.conversionTimestamp) - +new Date(a.conversionTimestamp));

  const bySegment = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.segment] = (acc[row.segment] ?? 0) + 1;
    return acc;
  }, {});

  const topSegment =
    Object.entries(bySegment).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "General Buyer";
  const uniqueCustomers = new Set(rows.map((row) => row.customerKey)).size;
  const totalRevenue = rows.reduce((acc, row) => acc + row.attributedRevenue, 0);
  const conversionsByCustomer = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.customerKey] = (acc[row.customerKey] ?? 0) + 1;
    return acc;
  }, {});
  const returningCustomers = Object.values(conversionsByCustomer).filter((count) => count > 1).length;
  const returningRate = uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0;

  return {
    topSegment,
    uniqueCustomers,
    totalRevenue,
    returningRate,
    programRows,
    trailRows
  };
}

function buildInsights() {
  const allRows: InsightRow[] = COMMISSIONS.map((commission) => {
    const customer = CUSTOMER_PROFILES[commission.orderId];
    const program = BRAND_PROGRAMS_DATA[commission.programName];
    const customerKey = getCustomerKey(commission.orderId);
    return {
      ...commission,
      customerKey,
      customerName: customer?.name ?? "Unknown Buyer",
      segment: deriveBuyerSegment(commission),
      purchased: customer?.purchased ?? commission.productCategory,
      location: customer ? `${customer.city}, ${customer.region}` : "Unknown",
      businessUnit: program?.businessUnitName ?? "Unassigned",
      attributedRevenue: estimateAttributedRevenue(commission)
    };
  });

  const bySegment = allRows.reduce<Record<string, SegmentRow>>((acc, row) => {
    acc[row.segment] ??= { segment: row.segment, customers: 0, conversions: 0, revenue: 0 };
    acc[row.segment].conversions += 1;
    acc[row.segment].revenue += row.attributedRevenue;
    return acc;
  }, {});

  Object.values(bySegment).forEach((segment) => {
    segment.customers = new Set(
      allRows.filter((row) => row.segment === segment.segment).map((row) => row.customerKey)
    ).size;
  });

  const segmentRows = Object.values(bySegment).sort((a, b) => b.conversions - a.conversions);

  return {
    allRows,
    segmentRows,
    summary: computeSummary(allRows)
  };
}

export function CustomerInsights() {
  const data = useMemo(() => buildInsights(), []);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [showFullTrail, setShowFullTrail] = useState(false);

  const filteredRows = useMemo(
    () => (activeSegment ? data.allRows.filter((row) => row.segment === activeSegment) : data.allRows),
    [data.allRows, activeSegment]
  );
  const filtered = useMemo(() => computeSummary(filteredRows), [filteredRows]);

  const visibleTrailRows = useMemo(
    () => (showFullTrail ? filtered.trailRows : filtered.trailRows.slice(0, 6)),
    [filtered.trailRows, showFullTrail]
  );
  const maxSegmentConversions = Math.max(1, ...data.segmentRows.map((row) => row.conversions));
  const totalConversions = data.segmentRows.reduce((acc, row) => acc + row.conversions, 0);

  return (
    <div className="grid gap-6 px-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-[16px]">Buyer Segments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setActiveSegment(null);
                setShowFullTrail(false);
              }}
              className={[
                "w-full rounded-[10px] border px-3 py-2 text-left transition-colors",
                activeSegment === null
                  ? "border-black bg-[rgba(55,220,255,0.28)]"
                  : "border-black/10 bg-[rgba(242,253,255,0.35)] hover:bg-[rgba(242,253,255,0.75)]"
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-semibold text-[#04070f]">All Buyers</p>
                <span className="text-xs text-[#04070f]/70">{totalConversions}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-black/10">
                <div className="h-1.5 rounded-full bg-[#37dcff]" style={{ width: "100%" }} />
              </div>
            </button>

            {data.segmentRows.map((row) => {
              const isActive = row.segment === activeSegment;
              return (
                <button
                  type="button"
                  key={row.segment}
                  onClick={() => {
                    setActiveSegment(row.segment);
                    setShowFullTrail(false);
                  }}
                  className={[
                    "w-full rounded-[10px] border px-3 py-2 text-left transition-colors",
                    isActive
                      ? "border-black bg-[rgba(55,220,255,0.28)]"
                      : "border-black/10 bg-[rgba(242,253,255,0.35)] hover:bg-[rgba(242,253,255,0.75)]"
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-[#04070f]">{row.segment}</p>
                    <span className="text-xs text-[#04070f]/70">{row.conversions}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-black/10">
                    <div
                      className="h-1.5 rounded-full bg-[#37dcff]"
                      style={{ width: `${Math.max(8, (row.conversions / maxSegmentConversions) * 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </aside>

      <section className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardContent className="space-y-3 p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/50">Top Insight</p>
              <p className="text-[16px] text-muted-foreground">
                {activeSegment ? "Active Audience Segment" : "Top Buyer Segment"}
              </p>
              <p className="text-[42px] font-semibold leading-[40px] tracking-[-0.2px] text-[#04070f]">
                {activeSegment ?? filtered.topSegment}
              </p>
              <p className="text-sm text-muted-foreground">
                {activeSegment
                  ? `Showing only conversions from ${activeSegment}.`
                  : "Most conversions across the full brand portfolio currently come from this audience type."}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            <InsightStat label="Unique Converted Customers" value={`${filtered.uniqueCustomers}`} />
            <InsightStat label="Attributed Revenue" value={formatCurrency(filtered.totalRevenue, "USD")} />
            <InsightStat label="Returning Buyer Rate" value={`${filtered.returningRate.toFixed(0)}%`} />
          </div>
        </div>

        <ListSurface>
          <div className="px-6 pt-6">
            <h3 className="text-[18px] font-semibold">Programme Audience Fit</h3>
          </div>
          <div className="pb-6 pt-4">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Programme</TableHead>
                  <TableHead className="w-[17%]">Business Unit</TableHead>
                  <TableHead className="w-[24%]">Dominant Buyer Segment</TableHead>
                  <TableHead className="w-[14%]">Conversions</TableHead>
                  <TableHead className="w-[15%]">Attributed Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.programRows.map((row) => (
                  <TableRow key={row.programName}>
                    <TableCell className="font-medium">{row.programName}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.businessUnit}</TableCell>
                    <TableCell>{row.topSegment}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.conversions}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(row.revenue, "USD")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ListSurface>

        <ListSurface className="border-black/30 bg-[rgba(255,255,255,0.55)] shadow-[4px_4px_0_0_black]">
          <div className="px-6 pt-6">
            <h3 className="text-[18px] font-semibold">Converted Customer Trail</h3>
          </div>
          <div className="pb-6 pt-4">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[14%]">Customer Name</TableHead>
                  <TableHead className="w-[14%]">Customer Location</TableHead>
                  <TableHead className="w-[12%]">Buyer Segment</TableHead>
                  <TableHead className="w-[15%]">Product Purchased</TableHead>
                  <TableHead className="w-[14%]">Programme</TableHead>
                  <TableHead className="w-[12%]">Business Unit</TableHead>
                  <TableHead className="w-[11%]">Commission Amount</TableHead>
                  <TableHead className="w-[8%]">Conversion Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleTrailRows.map((row) => (
                  <TableRow key={`${row.orderId}-${row.programName}`}>
                    <TableCell className="font-medium text-[#04070f]">{row.customerName}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.segment}</TableCell>
                    <TableCell>{row.purchased}</TableCell>
                    <TableCell>{row.programName}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.businessUnit}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(row.amount, "USD")}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDateTime(row.conversionTimestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-6 pt-3">
              <button
                type="button"
                onClick={() => setShowFullTrail((prev) => !prev)}
                className="text-sm font-medium text-[#04070f] underline underline-offset-4 hover:opacity-80"
              >
                {showFullTrail ? "Show less" : "View full customer trail"}
              </button>
            </div>
          </div>
        </ListSurface>
      </section>
    </div>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/50">{label}</p>
        <p className="text-[30px] font-semibold leading-[32px] tracking-[-0.2px] text-[#04070f]">{value}</p>
      </CardContent>
    </Card>
  );
}
