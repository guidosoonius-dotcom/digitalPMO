"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { GanttHeader } from "./GanttHeader";
import { GanttRow } from "./GanttRow";
import { GanttLegend } from "./GanttLegend";
import { GanttFilters, Filters } from "./GanttFilters";
import { TaskUpdateDrawer } from "@/components/task/TaskUpdateDrawer";
import {
  TIMELINE_START,
  TIMELINE_END,
  generateWeekColumns,
  WEEK_COL_WIDTH,
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
  comments: { id: string; text: string; author: string; createdAt: string }[];
}

interface Props {
  initialTasks: Task[];
  phases: Phase[];
}

export function GanttChart({ initialTasks, phases }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    owner: "",
    search: "",
    status: "",
  });

  const weekColumns = useMemo(
    () => generateWeekColumns(TIMELINE_START, TIMELINE_END),
    []
  );
  const totalWeeks = weekColumns.length;

  // Sync scroll between header and body
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const syncScroll = (source: "header" | "body") => (e: Event) => {
    const target = e.target as HTMLElement;
    if (source === "header" && bodyScrollRef.current) {
      bodyScrollRef.current.scrollLeft = target.scrollLeft;
    } else if (source === "body" && headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = target.scrollLeft;
    }
  };

  useEffect(() => {
    const header = headerScrollRef.current;
    const body = bodyScrollRef.current;
    if (!header || !body) return;
    const hListener = syncScroll("header");
    const bListener = syncScroll("body");
    header.addEventListener("scroll", hListener);
    body.addEventListener("scroll", bListener);
    return () => {
      header.removeEventListener("scroll", hListener);
      body.removeEventListener("scroll", bListener);
    };
  }, []);

  const owners = useMemo(() => {
    const set = new Set(tasks.map((t) => t.owner).filter(Boolean));
    return Array.from(set).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.owner && t.owner !== filters.owner) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !t.description.toLowerCase().includes(q) &&
          !t.projectNumber.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  async function handleTaskUpdate(
    taskId: string,
    patch: Record<string, unknown>
  ) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  }

  return (
    <div className="flex flex-col h-full">
      <GanttFilters filters={filters} owners={owners} onChange={setFilters} />
      <GanttLegend />

      {/* Sticky header with its own scroll */}
      <div
        ref={headerScrollRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <GanttHeader
          weekColumns={weekColumns}
          phases={phases}
          totalWeeks={totalWeeks}
        />
      </div>

      {/* Scrollable body */}
      <div ref={bodyScrollRef} className="flex-1 overflow-auto gantt-scroll-container">
        <div style={{ minWidth: `calc(var(--gantt-left-width) + ${totalWeeks * WEEK_COL_WIDTH}px)` }}>
          {filteredTasks.map((task) => (
            <GanttRow
              key={task.id}
              task={task}
              weekColumns={weekColumns}
              totalWeeks={totalWeeks}
              onSelect={(id) => setSelectedTaskId(selectedTaskId === id ? null : id)}
              isSelected={selectedTaskId === task.id}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Geen taken gevonden
            </div>
          )}
        </div>
      </div>

      {/* Task update drawer */}
      {selectedTask && (
        <TaskUpdateDrawer
          task={selectedTask}
          phases={phases}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}
