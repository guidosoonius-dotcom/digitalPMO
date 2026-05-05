"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react";

export function TaskImport() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ imported: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/import", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
      setStatus("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Onbekende fout");
      setStatus("error");
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Sleep een Excel of CSV bestand hierheen
        </p>
        <p className="text-xs text-gray-400">of klik om te bladeren</p>
      </div>

      {/* Selected file */}
      {file && (
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3">
          <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 truncate">{file.name}</p>
            <p className="text-xs text-blue-600">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {status === "uploading" ? "Importeren..." : "Importeer taken"}
      </button>

      {/* Results */}
      {status === "success" && result && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">
              {result.imported} taken succesvol geïmporteerd
            </p>
            <a href="/planning" className="text-xs text-green-700 underline">
              Ga naar planning →
            </a>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-800">{errorMsg || "Er is een fout opgetreden"}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-700 mb-2">Verwacht formaat (kolommen):</p>
        <ul className="space-y-1 list-disc list-inside text-gray-500">
          <li><code className="bg-white px-1 rounded">Project</code> — projectnummer (bijv. 2.11)</li>
          <li><code className="bg-white px-1 rounded">Omschrijving</code> — taakomschrijving</li>
          <li><code className="bg-white px-1 rounded">Actiehouder</code> — naam actiehouder</li>
          <li><code className="bg-white px-1 rounded">startWeek</code> — weeknummer start</li>
          <li><code className="bg-white px-1 rounded">startYear</code> — jaar start</li>
          <li><code className="bg-white px-1 rounded">endWeek</code> — weeknummer eind</li>
          <li><code className="bg-white px-1 rounded">endYear</code> — jaar eind</li>
        </ul>
      </div>
    </div>
  );
}
