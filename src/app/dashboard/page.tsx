import { prisma } from "@/lib/db";
import { LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  not_started: "Niet gestart",
  on_track: "Op schema",
  at_risk: "Risico",
  delayed: "Vertraagd",
  completed: "Afgerond",
};

const statusColors: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600",
  on_track: "bg-green-100 text-green-700",
  at_risk: "bg-amber-100 text-amber-700",
  delayed: "bg-red-100 text-red-700",
  completed: "bg-slate-100 text-slate-600",
};

export default async function DashboardPage() {
  const [tasks, phases] = await Promise.all([
    prisma.task.findMany({ where: { isGroupRow: false } }),
    prisma.phase.findMany({ orderBy: { order: "asc" } }),
  ]);

  const total = tasks.length;
  const byStatus = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  const onTrack = byStatus["on_track"] ?? 0;
  const atRisk = byStatus["at_risk"] ?? 0;
  const delayed = byStatus["delayed"] ?? 0;
  const completed = byStatus["completed"] ?? 0;

  const byOwner = tasks.reduce<Record<string, { total: number; completed: number; atRisk: number }>>((acc, t) => {
    const o = t.owner || "Onbekend";
    if (!acc[o]) acc[o] = { total: 0, completed: 0, atRisk: 0 };
    acc[o].total++;
    if (t.status === "completed") acc[o].completed++;
    if (t.status === "at_risk" || t.status === "delayed") acc[o].atRisk++;
    return acc;
  }, {});

  const byPhase = phases.map((phase) => {
    const phaseTasks = tasks.filter((t) => t.phaseId === phase.id);
    const done = phaseTasks.filter((t) => t.status === "completed").length;
    const risk = phaseTasks.filter(
      (t) => t.status === "at_risk" || t.status === "delayed"
    ).length;
    return { ...phase, count: phaseTasks.length, done, risk };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <LayoutDashboard className="w-5 h-5 text-blue-600" />
        <div>
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">DigiThuis programma-overzicht</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Totaal activiteiten", value: total, icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
          { label: "Op schema", value: onTrack, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
          { label: "Risico / vertraagd", value: atRisk + delayed, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
          { label: "Afgerond", value: completed, icon: CheckCircle2, color: "text-slate-600 bg-slate-100" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Status verdeling</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(byStatus).map(([status, count]) => (
            <div
              key={status}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[status] ?? "bg-gray-100 text-gray-600"}`}
            >
              <span>{statusLabels[status] ?? status}</span>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By phase */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Voortgang per fase</h2>
        <div className="space-y-2">
          {byPhase.map((p) => {
            const pct = p.count > 0 ? Math.round((p.done / p.count) * 100) : 0;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: p.color }}
                />
                <div className="w-40 text-xs text-gray-700 truncate" title={p.name}>
                  {p.name}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: p.color }}
                  />
                </div>
                <div className="text-xs text-gray-500 w-16 text-right">
                  {p.done}/{p.count} taken
                </div>
                {p.risk > 0 && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    {p.risk} risico
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* By owner */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Actiehouders</h2>
        <div className="divide-y divide-gray-50">
          {Object.entries(byOwner).map(([owner, data]) => (
            <div key={owner} className="flex items-center gap-4 py-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {owner.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{owner}</div>
                <div className="text-xs text-gray-400">{data.total} activiteiten</div>
              </div>
              {data.atRisk > 0 && (
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {data.atRisk} risico
                </span>
              )}
              {data.completed > 0 && (
                <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  {data.completed} afgerond
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/planning"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        Naar de planning →
      </Link>
    </div>
  );
}
