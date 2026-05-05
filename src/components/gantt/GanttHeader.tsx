"use client";

import {
  WeekRef,
  WEEK_COL_WIDTH,
  groupWeeksByMonth,
  weekLabel,
} from "@/lib/week-utils";

interface Phase {
  id: string;
  name: string;
  startWeek: number;
  startYear: number;
  endWeek: number;
  endYear: number;
  color: string;
  order: number;
}

interface Props {
  weekColumns: WeekRef[];
  phases: Phase[];
  totalWeeks: number;
}

function phasePosition(phase: Phase, cols: WeekRef[]) {
  let colStart = -1;
  let colEnd = -1;
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i];
    if (
      colStart === -1 &&
      (c.year > phase.startYear ||
        (c.year === phase.startYear && c.week >= phase.startWeek))
    ) {
      colStart = i;
    }
    if (
      c.year < phase.endYear ||
      (c.year === phase.endYear && c.week <= phase.endWeek)
    ) {
      colEnd = i;
    }
  }
  return { colStart, colEnd };
}

export function GanttHeader({ weekColumns, phases, totalWeeks }: Props) {
  const monthGroups = groupWeeksByMonth(weekColumns);
  const totalPx = totalWeeks * WEEK_COL_WIDTH;

  return (
    <div className="sticky top-0 z-20 bg-white shadow-sm">
      {/* Row 1: column labels (left) + phases (right) */}
      <div className="flex border-b border-gray-200">
        {/* Left fixed header */}
        <div
          className="shrink-0 flex items-center bg-slate-700 text-white text-[10px] font-semibold uppercase tracking-wide"
          style={{ width: "var(--gantt-left-width)" }}
        >
          <span className="w-10 px-3 py-2 border-r border-slate-600">Nr</span>
          <span className="flex-1 px-2 py-2 border-r border-slate-600">Omschrijving</span>
          <span className="w-16 px-2 py-2 border-r border-slate-600 text-right">Actiehouder</span>
          <span className="w-24 px-2 py-2">Fase</span>
        </div>

        {/* Right: phase color blocks */}
        <div
          className="relative shrink-0 h-8 overflow-hidden"
          style={{ width: `${totalPx}px` }}
        >
          {phases.map((phase) => {
            const { colStart, colEnd } = phasePosition(phase, weekColumns);
            if (colStart === -1 || colEnd === -1) return null;
            const left = colStart * WEEK_COL_WIDTH;
            const width = (colEnd - colStart + 1) * WEEK_COL_WIDTH;
            return (
              <div
                key={phase.id}
                className="absolute top-0 bottom-0 flex items-center justify-center text-white text-[10px] font-semibold px-1 overflow-hidden"
                style={{
                  left,
                  width,
                  backgroundColor: phase.color,
                  borderRight: "1px solid rgba(255,255,255,0.3)",
                }}
                title={phase.name}
              >
                <span className="truncate">{phase.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: month groups */}
      <div className="flex border-b border-gray-100">
        <div
          className="shrink-0 bg-gray-50"
          style={{ width: "var(--gantt-left-width)" }}
        />
        <div className="flex shrink-0" style={{ width: `${totalPx}px` }}>
          {monthGroups.map((g) => (
            <div
              key={g.label}
              className="flex items-center justify-center text-[10px] text-gray-600 font-medium border-r border-gray-200 bg-gray-50 truncate"
              style={{ width: g.weeks.length * WEEK_COL_WIDTH, height: 20 }}
            >
              {g.label}
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: week numbers */}
      <div className="flex border-b border-gray-200">
        <div
          className="shrink-0 bg-gray-50"
          style={{ width: "var(--gantt-left-width)" }}
        />
        <div className="flex shrink-0" style={{ width: `${totalPx}px` }}>
          {weekColumns.map((col, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[9px] text-gray-400 border-r border-gray-100 bg-gray-50"
              style={{ width: WEEK_COL_WIDTH, height: 18 }}
            >
              {weekLabel(col)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
