"use client";

import { Search, X } from "lucide-react";

export interface Filters {
  owner: string;
  search: string;
  status: string;
}

interface Props {
  filters: Filters;
  owners: string[];
  onChange: (f: Filters) => void;
}

export function GanttFilters({ filters, owners, onChange }: Props) {
  const statusOptions = [
    { value: "", label: "Alle statussen" },
    { value: "not_started", label: "Niet gestart" },
    { value: "on_track", label: "Op schema" },
    { value: "at_risk", label: "Risico" },
    { value: "delayed", label: "Vertraagd" },
    { value: "completed", label: "Afgerond" },
  ];

  const hasFilters = filters.owner || filters.search || filters.status;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Zoeken..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <select
        value={filters.owner}
        onChange={(e) => onChange({ ...filters, owner: e.target.value })}
        className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="">Alle actiehouders</option>
        {owners.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        {statusOptions.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={() => onChange({ owner: "", search: "", status: "" })}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded hover:bg-gray-100"
        >
          <X className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>
  );
}
