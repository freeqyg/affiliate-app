"use client";

import { useState } from "react";
import { COMMISSIONS, CREATOR_PROFILES, DETAIL_COMMISSIONS, Dispute, DISPUTES, formatDateTime, getDisputeDaysRemaining, getDisputeUrgency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListRowButton } from "@/components/ui/list-surface";
import { Textarea } from "@/components/ui/textarea";

export function DisputeInbox({
  onOpenCommission,
  showListHeader = true
}: {
  onOpenCommission: (id: string) => void;
  showListHeader?: boolean;
}) {
  const [active, setActive] = useState<Dispute | null>(null);
  const getCommission = (commissionId: string) =>
    COMMISSIONS.find((c) => c.id === commissionId) ?? DETAIL_COMMISSIONS.find((c) => c.id === commissionId);

  if (active) {
    const activeCommission = getCommission(active.commissionId);
    const activeCreatorName = activeCommission?.publisher ?? active.raisedBy;
    const activeCreator = CREATOR_PROFILES[activeCreatorName];
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setActive(null)}>← Back to disputes</Button>
        <Card>
          <CardHeader><CardTitle>{active.id} • {active.subject}</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-md border border-black/10 bg-[rgba(242,253,255,0.35)] p-3">
              <img
                alt={activeCreatorName}
                src={activeCreator?.avatar ?? "https://i.pravatar.cc/80"}
                className="h-10 w-10 rounded-full border border-black/10 object-cover"
              />
              <div>
                <p className="text-[14px] font-semibold leading-[18px] text-[#04070f]">{activeCreatorName}</p>
                <p className="text-xs text-muted-foreground">{activeCreator?.handle ?? "@creator"} · {activeCreator?.niche ?? "Creator"}</p>
              </div>
            </div>
            <p className="text-muted-foreground">Commission: <button className="underline" onClick={() => onOpenCommission(active.commissionId)}>{active.commissionId}</button></p>
            <p><strong>Evidence:</strong> {active.evidence}</p>
            <div className="space-y-2 rounded-md border p-3">
              {active.messages.map((m, i) => (
                <div key={i} className="rounded-md bg-muted/30 p-2">
                  <p className="text-xs text-muted-foreground">{m.senderName} • {formatDateTime(m.sentAt)}</p>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
            <Textarea placeholder="Respond to publisher" />
            <div className="flex flex-wrap gap-2">
              <Button>Reinstate</Button>
              <Button variant="outline">Uphold with explanation</Button>
              <Button variant="secondary">Escalate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      {showListHeader && <CardHeader><CardTitle className="text-base">Dispute Inbox</CardTitle></CardHeader>}
      <CardContent className={showListHeader ? "space-y-2" : "space-y-2 pt-6"}>
        {DISPUTES.map((d) => {
          const urgency = getDisputeUrgency(d);
          const commission = getCommission(d.commissionId);
          const creatorName = commission?.publisher ?? d.raisedBy;
          const creator = CREATOR_PROFILES[creatorName];
          return (
            <ListRowButton key={d.id} onClick={() => setActive(d)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    alt={creatorName}
                    src={creator?.avatar ?? "https://i.pravatar.cc/80"}
                    className="h-8 w-8 rounded-full border border-black/10 object-cover"
                  />
                  <div>
                  <p className="font-medium">{d.id} • {d.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {creatorName} ({creator?.handle ?? "@creator"}) • {d.commissionId} • due in {getDisputeDaysRemaining(d)}d
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{d.status.replaceAll("_", " ")}</Badge>
                  <span className={`text-xs ${urgency === "high" ? "text-status-reversed" : urgency === "medium" ? "text-status-pending" : "text-muted-foreground"}`}>{urgency}</span>
                </div>
              </div>
            </ListRowButton>
          );
        })}
      </CardContent>
    </Card>
  );
}
