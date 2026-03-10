import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-black/10 bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={{ borderColor: "rgba(0,0,0,0.10)", ...style }}
      {...props}
    />
  );
}
