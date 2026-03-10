import type { BrandScreen } from "@/components/brand/brand-shell";
import type { PublisherScreen } from "@/components/publisher/publisher-shell";

export type AppViewMode = "brand" | "publisher";

export const BRAND_CAPTURE_SCREENS: BrandScreen[] = [
  "all-programs",
  "program-detail",
  "queue",
  "disputes",
  "dispute-detail",
  "publishers",
  "business-units",
  "customer-insights",
  "detail",
  "create-program",
  "creator-detail"
];

export const PUBLISHER_CAPTURE_SCREENS: PublisherScreen[] = [
  "earnings",
  "detail",
  "dispute-wizard",
  "disputes",
  "dispute-detail",
  "my-programs",
  "discover",
  "program-detail",
  "program-joined",
  "enrolled-program-detail"
];

export type CaptureBreakpointPreset = {
  id: string;
  label: string;
  width: number;
  minHeight: number;
};

export const CAPTURE_BREAKPOINT_PRESETS: Record<string, CaptureBreakpointPreset> = {
  desktop: { id: "desktop", label: "Desktop", width: 1440, minHeight: 1024 },
  laptop: { id: "laptop", label: "Laptop", width: 1280, minHeight: 900 },
  tablet: { id: "tablet", label: "Tablet", width: 1024, minHeight: 1366 },
  mobile: { id: "mobile", label: "Mobile", width: 390, minHeight: 844 }
};

const DEFAULT_CAPTURE_BREAKPOINT = CAPTURE_BREAKPOINT_PRESETS.desktop;

function firstNonEmpty(...values: Array<string | null>): string | null {
  for (const value of values) {
    if (value && value.trim().length > 0) return value;
  }
  return null;
}

export function resolveViewModeFromParams(searchParams: URLSearchParams): AppViewMode {
  const value = firstNonEmpty(searchParams.get("captureView"), searchParams.get("view"));
  if (value === "publisher" || value === "creator") return "publisher";
  return "brand";
}

export function resolveCaptureMode(searchParams: URLSearchParams): boolean {
  const value = firstNonEmpty(searchParams.get("capture"), searchParams.get("captureMode"), searchParams.get("figmacapture"));
  return value === "1" || value === "true" || value === "yes";
}

export function resolveBreakpointPreset(searchParams: URLSearchParams): CaptureBreakpointPreset {
  const presetId = firstNonEmpty(searchParams.get("breakpoint"), searchParams.get("capturePreset"));
  if (!presetId) return DEFAULT_CAPTURE_BREAKPOINT;
  return CAPTURE_BREAKPOINT_PRESETS[presetId] ?? DEFAULT_CAPTURE_BREAKPOINT;
}

export function resolveScreenForView(
  searchParams: URLSearchParams,
  viewMode: AppViewMode
): BrandScreen | PublisherScreen | undefined {
  const fallback = searchParams.get("screen");

  if (viewMode === "brand") {
    const candidate = firstNonEmpty(searchParams.get("brandScreen"), fallback);
    if (candidate && BRAND_CAPTURE_SCREENS.includes(candidate as BrandScreen)) {
      return candidate as BrandScreen;
    }
    return undefined;
  }

  const candidate = firstNonEmpty(
    searchParams.get("publisherScreen"),
    searchParams.get("creatorScreen"),
    fallback
  );
  if (candidate && PUBLISHER_CAPTURE_SCREENS.includes(candidate as PublisherScreen)) {
    return candidate as PublisherScreen;
  }
  return undefined;
}

export type CaptureModeConfig = {
  enabled: boolean;
  preset: CaptureBreakpointPreset;
};

export function resolveCaptureModeConfig(searchParams: URLSearchParams): CaptureModeConfig {
  return {
    enabled: resolveCaptureMode(searchParams),
    preset: resolveBreakpointPreset(searchParams)
  };
}

export function buildCaptureQuery(params: {
  view: AppViewMode;
  screen: BrandScreen | PublisherScreen;
  breakpoint?: keyof typeof CAPTURE_BREAKPOINT_PRESETS;
  program?: string;
}): string {
  const query = new URLSearchParams();
  query.set("capture", "1");
  query.set("view", params.view);
  query.set("screen", params.screen);
  query.set("capturePreset", params.breakpoint ?? "desktop");
  if (params.program) query.set("program", params.program);
  return query.toString();
}
