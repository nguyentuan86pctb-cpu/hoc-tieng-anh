import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-skytoy focus:ring-4 focus:ring-skytoy/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-skytoy focus:ring-4 focus:ring-skytoy/20",
        className
      )}
      {...props}
    />
  );
}
