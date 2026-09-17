// src/components/ui/ResponsiveTable.tsx
//
// Shared shell for admin data tables: a real <table> (horizontally
// scrollable) at md and above, a stacked card list below it. Below `lg`
// the admin Sidebar is off-canvas so <main> gets the full viewport width -
// a wide table is still usable there via horizontal scroll, but not on an
// actual phone. `md` (768px) is also the repo's existing "intermediate
// layout" breakpoint (see the public site's 2-up grids).
//
// Deliberately just a two-slot shell, not a column-def abstraction: the
// tables using this (ResourceTable, ProjectsTable, TasksTable,
// UserManagementTable, EventsTable, BlogTable) have very little shared
// cell shape (avatars, inline <select>s, a portaled action menu), so a
// generic DataTable would need a render-prop escape hatch for nearly
// every cell - more complex than just writing the two views directly.

import type { ReactNode } from "react";

interface ResponsiveTableProps {
  table: ReactNode;
  cards: ReactNode;
}

export default function ResponsiveTable({
  table,
  cards,
}: ResponsiveTableProps) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto">{table}</div>
      <div className="md:hidden divide-y divide-mist-200">{cards}</div>
    </>
  );
}
