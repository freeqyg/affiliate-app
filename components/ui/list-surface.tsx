import * as React from "react";
import { cn } from "@/lib/utils";

export function ListSurface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border-2 border-black bg-white shadow-[6px_6px_0_0_black]",
        className
      )}
      {...props}
    />
  );
}

export function ListRowButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full rounded-[12px] border border-black/10 bg-[rgba(242,253,255,0.42)] px-4 py-3 text-left transition-colors hover:bg-[rgba(242,253,255,0.82)]",
        className
      )}
      {...props}
    />
  );
}
