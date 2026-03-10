"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandShell, type BrandScreen } from "@/components/brand/brand-shell";
import { PublisherShell, type PublisherScreen } from "@/components/publisher/publisher-shell";
import { CaptureModeWrapper } from "@/components/capture/capture-mode-wrapper";
import {
  BRAND_CAPTURE_SCREENS,
  PUBLISHER_CAPTURE_SCREENS,
  resolveCaptureModeConfig,
  resolveScreenForView,
  resolveViewModeFromParams
} from "@/lib/capture-pipeline";

const PUBLISHER_SCREENS: PublisherScreen[] = PUBLISHER_CAPTURE_SCREENS;
const BRAND_SCREENS: BrandScreen[] = BRAND_CAPTURE_SCREENS;

export function AppShell() {
  const searchParams = useSearchParams();
  const requestedViewMode = resolveViewModeFromParams(searchParams);
  const captureConfig = resolveCaptureModeConfig(searchParams);
  const [viewMode, setViewMode] = useState<"publisher" | "brand">(requestedViewMode);

  const requestedPublisherScreen = useMemo(() => {
    const screen = resolveScreenForView(searchParams, "publisher");
    return screen && PUBLISHER_SCREENS.includes(screen as PublisherScreen) ? (screen as PublisherScreen) : undefined;
  }, [searchParams]);

  const requestedBrandScreen = useMemo(() => {
    const screen = resolveScreenForView(searchParams, "brand");
    return screen && BRAND_SCREENS.includes(screen as BrandScreen) ? (screen as BrandScreen) : undefined;
  }, [searchParams]);
  const requestedProgram = searchParams.get("program") || undefined;

  useEffect(() => {
    setViewMode(requestedViewMode);
  }, [requestedViewMode]);

  return (
    <CaptureModeWrapper config={captureConfig}>
      {viewMode === "brand" ? (
        <BrandShell viewMode={viewMode} setViewMode={setViewMode} initialScreen={requestedBrandScreen} initialProgram={requestedProgram} />
      ) : (
        <PublisherShell viewMode={viewMode} setViewMode={setViewMode} initialScreen={requestedPublisherScreen} />
      )}
    </CaptureModeWrapper>
  );
}
