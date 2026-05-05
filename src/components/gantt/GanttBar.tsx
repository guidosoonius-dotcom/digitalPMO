"use client";

import { cn } from "@/lib/utils";

interface Props {
  barType: string;
  isMilestone: boolean;
  colStart: number;
  colSpan: number;
  label?: string;
  onClick?: () => void;
}

const barStyles: Record<string, string> = {
  task: "bg-blue-400 border border-blue-500 text-white",
  critical_milestone: "bg-orange-400 border border-orange-500 text-white",
  holiday: "bg-green-200 border border-green-400 text-green-800 opacity-80",
  decision: "bg-pink-200 border border-pink-400 text-pink-800",
};

export function GanttBar({ barType, isMilestone, colStart, colSpan, label, onClick }: Props) {
  const style = barStyles[barType] ?? barStyles.task;

  if (isMilestone) {
    return (
      <div
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
        style={{ left: `${(colStart - 1) * 28 + 10}px`, width: 16, height: 16 }}
        onClick={onClick}
        title={label}
      >
        <div className="w-3 h-3 bg-orange-400 border-2 border-orange-600 rotate-45 group-hover:scale-125 transition-transform" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 rounded flex items-center px-1.5 text-[10px] font-medium cursor-pointer hover:opacity-80 transition-opacity overflow-hidden whitespace-nowrap",
        style
      )}
      style={{
        left: `${(colStart - 1) * 28 + 2}px`,
        width: `${colSpan * 28 - 4}px`,
      }}
      onClick={onClick}
      title={label}
    >
      {colSpan > 2 && <span className="truncate">{label}</span>}
    </div>
  );
}
