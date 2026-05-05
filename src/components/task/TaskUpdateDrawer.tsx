"use client";

import { useState } from "react";
import { X, MessageSquare, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
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
  phase?: { name: string; color: string } | null;
  comments: Comment[];
}

interface Phase {
  id: string;
  name: string;
}

interface Props {
  task: Task;
  phases: Phase[];
  onClose: () => void;
  onUpdate: (taskId: string, patch: Record<string, unknown>) => Promise<void>;
}

const statusOptions = [
  { value: "not_started", label: "Niet gestart", color: "bg-gray-200 text-gray-700" },
  { value: "on_track", label: "Op schema", color: "bg-green-100 text-green-800" },
  { value: "at_risk", label: "Risico", color: "bg-amber-100 text-amber-800" },
  { value: "delayed", label: "Vertraagd", color: "bg-red-100 text-red-800" },
  { value: "completed", label: "Afgerond", color: "bg-slate-100 text-slate-600" },
];

const barTypeOptions = [
  { value: "task", label: "Taak" },
  { value: "critical_milestone", label: "Kritieke mijlpaal" },
  { value: "holiday", label: "Vakantieperiode" },
  { value: "decision", label: "Besluitvorming" },
];

export function TaskUpdateDrawer({ task, phases, onClose, onUpdate }: Props) {
  const [status, setStatus] = useState(task.status);
  const [owner, setOwner] = useState(task.owner);
  const [barType, setBarType] = useState(task.barType);
  const [startWeek, setStartWeek] = useState(task.startWeek);
  const [startYear, setStartYear] = useState(task.startYear);
  const [endWeek, setEndWeek] = useState(task.endWeek);
  const [endYear, setEndYear] = useState(task.endYear);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [authorName, setAuthorName] = useState("");

  async function save() {
    setSaving(true);
    await onUpdate(task.id, {
      status,
      owner,
      barType,
      startWeek,
      startYear,
      endWeek,
      endYear,
      ...(comment.trim() && {
        newComment: comment.trim(),
        authorId: authorName || "Anoniem",
      }),
    });
    setSaving(false);
    setComment("");
    onClose();
  }

  const currentStatus = statusOptions.find((s) => s.value === status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-start gap-3 px-4 py-4 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-400 font-mono mb-0.5">
              {task.projectNumber}
            </div>
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {task.description}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    status === s.value
                      ? `${s.color} border-current ring-2 ring-offset-1 ring-current`
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bar type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Type
            </label>
            <select
              value={barType}
              onChange={(e) => setBarType(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {barTypeOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Actiehouder
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Naam actiehouder"
            />
          </div>

          {/* Dates */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Planning (weeknummers)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-gray-400 mb-1">Start week</div>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={startWeek}
                    min={1}
                    max={53}
                    onChange={(e) => setStartWeek(Number(e.target.value))}
                    className="w-14 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={startYear}
                    min={2026}
                    max={2027}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 mb-1">Eind week</div>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={endWeek}
                    min={1}
                    max={53}
                    onChange={(e) => setEndWeek(Number(e.target.value))}
                    className="w-14 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={endYear}
                    min={2026}
                    max={2027}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                    className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              <MessageSquare className="w-3 h-3 inline mr-1" />
              Update toevoegen
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Jouw naam"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Toelichting, opmerking of update..."
            />
          </div>

          {/* Comments history */}
          {task.comments.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Historie
              </div>
              <div className="space-y-2">
                {task.comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-700">{c.author}</span>
                      <span className="text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString("nl-NL")}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Annuleren
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>
    </>
  );
}
