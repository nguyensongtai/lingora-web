import type { ReactNode } from "react";

/** Một ô số liệu; note là dòng nhỏ nói rõ con số đó tính trên phạm vi nào. */
export function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: ReactNode;
  note?: string;
}) {
  return (
    <div className="border-border bg-card rounded-card flex flex-col gap-0.5 border p-4">
      <span className="text-muted-foreground text-[13px]">{label}</span>
      <span className="text-2xl font-bold tracking-tight tabular-nums">
        {value}
      </span>
      {note ? (
        <span className="text-muted-foreground text-[11px]">{note}</span>
      ) : null}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 app:grid-cols-4">{children}</div>
  );
}
