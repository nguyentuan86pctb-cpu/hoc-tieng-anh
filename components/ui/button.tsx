import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-coral text-white shadow-lg shadow-red-200 hover:-translate-y-0.5 hover:bg-[#ff5454] focus-visible:outline-coral",
        variant === "secondary" && "bg-skytoy text-white shadow-lg shadow-sky-200 hover:-translate-y-0.5 hover:bg-[#28a4ea] focus-visible:outline-skytoy",
        variant === "ghost" && "bg-white text-ink ring-2 ring-ink/10 hover:bg-banana/30 focus-visible:outline-banana",
        variant === "danger" && "bg-ink text-white hover:bg-ink/85 focus-visible:outline-ink",
        className
      )}
      {...props}
    />
  );
}
