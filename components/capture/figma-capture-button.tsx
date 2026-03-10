"use client";

import { useState } from "react";

type PushState = "idle" | "pushing" | "done" | "error";
type FigmaCaptureApi = {
  captureForDesign?: (input: Record<string, unknown>) => Promise<unknown>;
  [key: string]: unknown;
};
type CaptureContext = { captureId: string; endpoint: string };

function readCaptureHash() {
  if (typeof window === "undefined") {
    return { captureId: null as string | null, endpoint: null as string | null };
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const params = new URLSearchParams(hash);

  return {
    captureId: params.get("figmacapture"),
    endpoint: params.get("figmaendpoint")
  };
}

function writeCaptureHash(context: CaptureContext) {
  const hash = new URLSearchParams(
    window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
  );
  hash.set("figmacapture", context.captureId);
  hash.set("figmaendpoint", context.endpoint);
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${hash.toString()}`);
}

function normalizeCaptureContext(value: unknown): CaptureContext | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;

  const captureId =
    typeof candidate.captureId === "string"
      ? candidate.captureId
      : typeof candidate.id === "string"
        ? candidate.id
        : null;
  const endpoint =
    typeof candidate.endpoint === "string"
      ? candidate.endpoint
      : typeof candidate.figmaEndpoint === "string"
        ? candidate.figmaEndpoint
        : null;

  return captureId && endpoint ? { captureId, endpoint } : null;
}

async function resolveCaptureContext(figmaApi: FigmaCaptureApi): Promise<CaptureContext | null> {
  const fromHash = readCaptureHash();
  if (fromHash.captureId && fromHash.endpoint) {
    return { captureId: fromHash.captureId, endpoint: fromHash.endpoint };
  }

  const methodCandidates = [
    "getCaptureContext",
    "createCaptureContext",
    "createCaptureSession",
    "initCaptureSession",
    "prepareCapture"
  ];

  for (const methodName of methodCandidates) {
    const maybeMethod = figmaApi[methodName];
    if (typeof maybeMethod !== "function") continue;

    try {
      const result = await (maybeMethod as (input?: Record<string, unknown>) => Promise<unknown>)({
        selector: "body"
      });
      const context = normalizeCaptureContext(result);
      if (context) {
        writeCaptureHash(context);
        return context;
      }
    } catch {
      // Try next method; APIs vary by capture runtime version.
    }
  }

  return null;
}

export function FigmaCaptureButton() {
  const [pushState, setPushState] = useState<PushState>("idle");
  const [message, setMessage] = useState<string>("");

  async function onPush() {
    const figmaApi = ((window as any)?.figma ?? {}) as FigmaCaptureApi;

    if (!figmaApi.captureForDesign) {
      setPushState("error");
      setMessage("Figma capture runtime is unavailable on this page.");
      return;
    }

    try {
      setPushState("pushing");
      setMessage("Preparing capture session...");
      const context = await resolveCaptureContext(figmaApi);

      setMessage("Pushing current screen to Figma...");
      if (context) {
        await figmaApi.captureForDesign({
          captureId: context.captureId,
          endpoint: context.endpoint,
          selector: "body"
        });
      } else {
        // Some capture runtime versions can self-initialize without explicit context.
        await figmaApi.captureForDesign({ selector: "body" });
      }
      setPushState("done");
      setMessage("Capture submitted. Check Figma import status.");
      window.setTimeout(() => {
        setPushState("idle");
        setMessage("");
      }, 3500);
    } catch {
      setPushState("error");
      setMessage("Capture failed. Open a capture-enabled URL and try again.");
    }
  }

  return (
    <div className="relative flex items-center">
      {message ? (
        <div className="pointer-events-none absolute right-0 top-full z-[120] mt-2 w-max max-w-[300px] rounded-[10px] border border-black/20 bg-[#f2fdff] px-3 py-2 text-[12px] leading-4 text-[#04070f] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          {message}
        </div>
      ) : null}
      <button
        type="button"
        onClick={onPush}
        className="px-1 py-0.5 text-[12px] font-medium leading-none text-[#04070f]/65 hover:text-[#04070f] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={pushState === "pushing"}
        title="Push current screen to Figma"
      >
        {pushState === "pushing" ? "Pushing..." : "Push to Figma"}
      </button>
    </div>
  );
}
