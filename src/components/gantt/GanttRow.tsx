"use client";

import { GanttBar } from "./GanttBar";
import { WeekRef, compareWeeks, WEEK_COL_WIDTH } from "@/lib/week-utils";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  projectNumber: string;
  description: string;
  owner: string;
  status: string;
  barType: string;
  startWeek: number;
  startYear: number;
  endWeek: number;
  endYear: number;
  isMilestone: boolean;
  isGroupRow: boolean;
  phase?: { name: string; color: string } | null;
}

interface Props {
  task: Task;
  weekColumns: WeekRef[];
  totalWeeks: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const statusBorder: Record<string, string> = {
  on_track: "border-l-4 border-l-green-500",
  at_risk: "border-l-4 border-l-amber-500",
  delayed: "border-l-4 border-l-red-500",
  completed: "border-l-4 border-l-gray-400",
  not_started: "border-l-4 border-l-transparent",
};

function getColPosition(week: number, year: number, cols: WeekRef[]) {
  const ref: WeekRef = { week, year };
  for (let i = 0; i < cols.length; i++) {
    if (compareWeeks(cols[i], ref) >= 0) return i + 1;
  }
  return cols.length + 1;
}

function getBarSpan(
  startWeek: number,
  startYear: number,
  endWeek: number,
  endYear: number,
  cols: WeekRef[]
) {
  const colStart = getColPosition(startWeek, startYear, cols);
  const colEnd = getColPosition(endWeek, endYear, cols);
  const colSpan = Math.max(1, colEnd - colStart + 1);
  return { colStart, colSpan };
}

export function GanttRow({ task, weekColumns, totalWeeks, onSelect, isSelected }: Props) {
  const { colStart, colSpan } = getBarSpan(
    task.startWeek,
    task.startYear,
    task.endWeek,
    task.endYear,
    weekColumns
  );

  const hasBar = task.startWeek > 0 && task.endWeek > 0;

  if (task.isGroupRow) {
    return (
      <div className="flex border-b border-gray-200">
        {/* Left fixed */}
        <div
          className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-white text-xs font-bold"
          style={{ width: "var(--gantt-left-width)" }}
        >
          <span className="font-mono text-slate-300 text-[10px] w-10 shrink-0">
            {task.projectNumber}
          </span>
          <span className="uppercase tracking-wide">{task.description}</span>
        </div>
        {/* Right scrollable */}
        <div
          className="relative bg-slate-100 shrink-0"
          style={{ width: `${totalWeeks * WEEK_COL_WIDTH}px`, height: 28 }}
        >
          {hasBar && (
            <GanttBar
              barType={task.barType}
              isMilestone={false}
              colStart={colStart}
              colSpan={colSpan}
              label={task.description}
              onClick={() => onSelect(task.id)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex border-b border-gray-100 hover:bg-blue-50 transition-colors group",
        isSelected && "bg-blue-50",
        statusBorder[task.status] ?? statusBorder.not_started
      )}
    >
      {/* Left fixed panel */}
      <div
        className="shrink-0 flex items-center gap-2 px-3 py-1 bg-white group-hover:bg-blue-50 transition-colors"
        style={{ width: "var(--gantt-left-width)" }}
      >
        <span className="font-mono text-gray-400 text-[10px] w-10 shrink-0">
          {task.projectNumber}
        </span>
        <span className="flex-1 text-xs text-gray-800 truncate" title={task.description}>
          {task.description}
        </span>
        <span className="text-[10px] text-gray-500 shrink-0 w-16 text-right truncate">
          {task.owner}
        </span>
        {task.phase && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-medium"
            style={{
              background: task.phase.color + "22",
              color: task.phase.color,
              border: `1px solid ${task.phase.color}44`,
            }}
          >
            {task.phase.name.slice(0, 10)}
          </span>
        )}
      </div>

      {/* Right scrollable panel */}
      <div
        className="relative shrink-0 bg-white group-hover:bg-blue-50 transition-colors"
        style={{ width: `${totalWeeks * WEEK_COL_WIDTH}px`, height: 28 }}
      >
        {/* vertical grid lines */}
        {weekColumns.map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-r border-gray-100"
            style={{ left: `${(i + 1) * WEEK_COL_WIDTH - 1}px`, width: 1 }}
          />
        ))}

        {hasBar && (
          <GanttBar
            barType={task.barType}
            isMilestone={task.isMilestone}
            colStart={colStart}
            colSpan={colSpan}
            label={task.description}
            onClick={() => onSelect(task.id)}
          />
        )}
      </div>
    </div>
  );
}
