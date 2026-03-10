"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ViewSwitcher } from "@/components/view-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { COMPONENT_INVENTORY, ComponentGroup } from "@/lib/component-inventory";

const GROUPS: ComponentGroup[] = ["shared", "ui", "publisher", "brand"];

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ComponentExplorer({
  viewMode,
  setViewMode
}: {
  viewMode: "publisher" | "brand";
  setViewMode: (v: "publisher" | "brand") => void;
}) {
  const [group, setGroup] = useState<ComponentGroup | "all">("all");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("inventory");
  const [checked, setChecked] = useState(true);

  const items = useMemo(() => {
    return COMPONENT_INVENTORY.filter((item) => {
      const matchesGroup = group === "all" || item.group === group;
      const haystack = `${item.name} ${item.file} ${item.purpose} ${item.surfaces.join(" ")}`.toLowerCase();
      const matchesQuery = query.trim() === "" || haystack.includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  const counts = useMemo(() => {
    return GROUPS.reduce<Record<ComponentGroup, number>>((acc, current) => {
      acc[current] = COMPONENT_INVENTORY.filter((item) => item.group === current).length;
      return acc;
    }, {} as Record<ComponentGroup, number>);
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card/80 p-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Version 3 Workspace</p>
            <h1 className="text-2xl font-semibold">Component Explorer</h1>
            <p className="text-sm text-muted-foreground">Interrogate every shared, brand, publisher, and UI component in one place.</p>
          </div>
          <div className="w-full max-w-sm">
            <ViewSwitcher
              viewMode={viewMode}
              onChange={setViewMode}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {GROUPS.map((currentGroup) => (
            <Card key={currentGroup}>
              <CardHeader className="pb-3">
                <CardDescription>{titleCase(currentGroup)}</CardDescription>
                <CardTitle className="text-3xl">{counts[currentGroup]}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filter Inventory</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
                placeholder="Search by name, file, purpose, or surface"
              />
            </div>
            <Select value={group} onValueChange={(v) => setGroup(v as ComponentGroup | "all")}>
              <SelectContent>
                <SelectItem value="all">All groups</SelectItem>
                {GROUPS.map((currentGroup) => (
                  <SelectItem key={currentGroup} value={currentGroup}>
                    {titleCase(currentGroup)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="ui-bench">UI Bench</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory">
            <div className="grid gap-3">
              {items.map((item) => (
                <Card key={`${item.group}-${item.name}`}>
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <Badge variant="outline">{titleCase(item.group)}</Badge>
                    </div>
                    <CardDescription className="font-mono text-xs text-muted-foreground/90">{item.file}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{item.purpose}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.surfaces.map((surface) => (
                        <Badge key={surface} variant="secondary">
                          {surface}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="ui-bench">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Buttons and Badges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary Action</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input defaultValue="Affiliate Program Name" />
                  <Textarea defaultValue="Notes for the component behavior or states..." />
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checked} onCheckedChange={setChecked} />
                    <span>Include experimental states</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
