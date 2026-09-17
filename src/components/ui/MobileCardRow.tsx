// src/components/ui/MobileCardRow.tsx
//
// A label:value row for the mobile card view of a ResponsiveTable - the
// stacked equivalent of one non-identity table column (e.g. "Category",
// "Status", "Created"). Not used for the card's identity block (title,
// avatar, thumbnail) - that JSX is reused verbatim from the desktop row.

import type { ReactNode } from "react";

interface MobileCardRowProps {
  label: string;
  children: ReactNode;
}

export default function MobileCardRow({ label, children }: MobileCardRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-500">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm text-navy-800">{children}</dd>
    </div>
  );
}
