"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COMMISSIONS, CommissionStatus, formatCurrency, formatDateTime, getAgeDays } from "@/lib/mock-data";
import { CommissionStatusChip } from "@/components/commission-status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListSurface } from "@/components/ui/list-surface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs: ("all" | CommissionStatus)[] = ["all", "pending", "approved", "reversed", "locked", "paid"];

export function EarningsDashboard({
  tab,
  onTab,
  onOpenCommission,
  showTopStats = true,
  programFilter = "all"
}: {
  tab: "all" | CommissionStatus;
  onTab: (t: "all" | CommissionStatus) => void;
  onOpenCommission: (id: string) => void;
  showTopStats?: boolean;
  programFilter?: "all" | string;
}) {
  const chartData = [
    { name: "Jan", value: 77.1 },
    { name: "", value: 77.5 },
    { name: "", value: 77.9 },
    { name: "", value: 77.2 },
    { name: "", value: 76.8 },
    { name: "", value: 76.4 },
    { name: "Feb", value: 76.1 },
    { name: "", value: 76.5 },
    { name: "", value: 76.2 },
    { name: "", value: 75.9 },
    { name: "", value: 75.7 },
    { name: "", value: 76.3 },
    { name: "Mar", value: 76.9 },
    { name: "", value: 77.3 },
    { name: "", value: 78.6 },
    { name: "", value: 79.1 },
    { name: "", value: 78.9 },
    { name: "Apr", value: 79.8 },
    { name: "", value: 80.4 },
    { name: "", value: 81.1 },
    { name: "May", value: 80.1 },
    { name: "", value: 81.8 },
    { name: "", value: 81.5 },
    { name: "", value: 82.3 },
    { name: "", value: 85.7 },
    { name: "", value: 86.2 },
    { name: "", value: 86.9 },
    { name: "", value: 86.3 },
    { name: "Jun", value: 88.9 }
  ];
  const scopedRows = programFilter === "all" ? COMMISSIONS : COMMISSIONS.filter((c) => c.programName === programFilter);
  const rows = tab === "all" ? scopedRows : scopedRows.filter((c) => c.status === tab);
  const total = scopedRows.filter((c) => ["paid", "locked", "approved"].includes(c.status)).reduce((a, c) => a + c.amount, 0);
  const pending = scopedRows.filter((c) => ["pending", "recorded"].includes(c.status)).reduce((a, c) => a + c.amount, 0);
  const activePrograms = new Set(scopedRows.map((c) => c.programName)).size;
  return (
    <div className="space-y-5">
      <EarningsPerformanceSection
        chartData={chartData}
        showTopStats={showTopStats}
        total={total}
        pending={pending}
        activePrograms={activePrograms}
      />
      <EarningsActivitySection rows={rows} tab={tab} onTab={onTab} onOpenCommission={onOpenCommission} />
    </div>
  );
}

export function EarningsPerformanceSection({
  chartData,
  showTopStats,
  total,
  pending,
  activePrograms,
  unified = false
}: {
  chartData: { name: string; value: number }[];
  showTopStats: boolean;
  total: number;
  pending: number;
  activePrograms: number;
  unified?: boolean;
}) {
  if (unified) {
    return (
      <Card className="overflow-hidden rounded-[20px]">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3">
            <UnifiedStat title="Total Earned" value={formatCurrency(total, "USD")} />
            <UnifiedStat title="Pending" value={formatCurrency(pending, "USD")} withDivider />
            <UnifiedStat title="Conversion Rate" value="6.4%" withDivider />
          </div>
          <div className="border-t border-black/20 px-5 py-5">
            <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#04070f]">Earnings Trend</h3>
            <div className="mt-6 h-[232px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 2, right: 6, left: -18, bottom: 2 }}>
                  <CartesianGrid stroke="#d7dbe0" strokeDasharray="2 6" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7a8289" }} />
                  <YAxis domain={[75, 89]} ticks={[75, 82, 89]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7a8289" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1b1d22"
                    strokeWidth={3}
                    dot={(props) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4.5}
                        fill="#ffffff"
                        stroke="#1b1d22"
                        strokeWidth={3}
                      />
                    )}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {showTopStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Stat title="Total Earned" value={formatCurrency(total, "USD")} />
          <Stat title="Pending" value={formatCurrency(pending, "USD")} />
          <Stat title="Conversion Rate" value="6.4%" />
          <Stat title="Active Programs" value={`${activePrograms}`} />
        </div>
      )}

      <Card>
        <CardHeader className="px-6 pb-2 pt-6"><CardTitle className="text-base">Earnings Trend</CardTitle></CardHeader>
        <CardContent className="h-64 px-6 pb-4 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#d7dbe0" strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7a8289" }} />
              <YAxis domain={[75, 89]} ticks={[75, 82, 89]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7a8289" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1b1d22"
                strokeWidth={3}
                dot={(props) => {
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4.5}
                      fill="#ffffff"
                      stroke="#1b1d22"
                      strokeWidth={3}
                    />
                  );
                }}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}

export function EarningsActivitySection({
  rows,
  tab,
  onTab,
  onOpenCommission
}: {
  rows: typeof COMMISSIONS;
  tab: "all" | CommissionStatus;
  onTab: (t: "all" | CommissionStatus) => void;
  onOpenCommission: (id: string) => void;
}) {
  return (
    <Tabs value={tab} onValueChange={(v) => onTab(v as "all" | CommissionStatus)}>
      <TabsList className="h-9 rounded-[6px] border-2 border-black bg-black p-1">
        {tabs.map((t) => (
          <TabsTrigger
            key={t}
            value={t}
            className="h-7 rounded-[4px] px-3 text-[12px] font-medium text-white transition-colors"
            inactiveClassName="hover:bg-white/10"
            activeClassName="bg-white text-black"
          >
            {t[0].toUpperCase() + t.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={tab}>
        <ListSurface>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => onOpenCommission(c.id)}>
                    <TableCell><CommissionStatusChip status={c.status} /></TableCell>
                    <TableCell>{c.programName}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(c.amount, c.currency)}</TableCell>
                    <TableCell>{formatDateTime(c.conversionTimestamp)}</TableCell>
                    <TableCell>{getAgeDays(c.conversionTimestamp)}d</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ListSurface>
      </TabsContent>
    </Tabs>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <Card className="h-[160px]">
      <CardContent className="flex h-full flex-col justify-between p-[22px]">
        <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#ff6088]">{title}</p>
        <p className="text-[45px] font-semibold leading-[35px] tracking-[-0.2px] text-[#04070f]">{value}</p>
      </CardContent>
    </Card>
  );
}

function UnifiedStat({
  title,
  value,
  withDivider = false
}: {
  title: string;
  value: string;
  withDivider?: boolean;
}) {
  return (
    <div className={withDivider ? "border-l border-black/20" : ""}>
      <div className="flex h-[160px] flex-col justify-between p-[22px]">
        <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#04070f]/50">{title}</p>
        <p className="text-[45px] font-semibold leading-[35px] tracking-[-0.2px] text-[#04070f]">{value}</p>
      </div>
    </div>
  );
}
