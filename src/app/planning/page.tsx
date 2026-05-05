import { prisma } from "@/lib/db";
import { GanttChart } from "@/components/gantt/GanttChart";
import { CalendarDays, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PlanningPage() {
  const [tasks, phases] = await Promise.all([
    prisma.task.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        comments: { orderBy: { createdAt: "asc" } },
        bars: true,
        phase: true,
      },
    }),
    prisma.phase.findMany({ orderBy: { order: "asc" } }),
  ]);

  const serialized = JSON.parse(JSON.stringify(tasks));
  const serializedPhases = JSON.parse(JSON.stringify(phases));

  return (
    <div className="flex flex-col h-screen">
      {/* Page header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200 shrink-0">
        <CalendarDays className="w-5 h-5 text-blue-600" />
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            Integrale detailplanning
          </h1>
          <p className="text-xs text-gray-500">
            DigiThuis · apr-2026 t/m mrt-2027 · {tasks.length} activiteiten
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="/import"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Import Excel
          </a>
        </div>
      </div>

      {/* Gantt chart fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <GanttChart initialTasks={serialized} phases={serializedPhases} />
      </div>
    </div>
  );
}
