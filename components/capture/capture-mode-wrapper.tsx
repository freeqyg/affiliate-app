"use client";

import type { ReactNode } from "react";
import type { CaptureModeConfig } from "@/lib/capture-pipeline";

export function CaptureModeWrapper({
  config,
  children
}: {
  config: CaptureModeConfig;
  children: ReactNode;
}) {
  if (!config.enabled) return <>{children}</>;

  return (
    <div
      className="capture-mode-root"
      data-capture-mode="true"
      data-capture-preset={config.preset.id}
      style={{
        ["--capture-width" as string]: `${config.preset.width}px`,
        ["--capture-min-height" as string]: `${config.preset.minHeight}px`
      }}
    >
      <div className="capture-mode-stage">{children}</div>
    </div>
  );
}
