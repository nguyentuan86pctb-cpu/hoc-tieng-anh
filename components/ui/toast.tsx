import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-soft",
        type === "success" ? "bg-leaf" : "bg-coral"
      )}
    >
      {type === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
      {message}
    </div>
  );
}
