import { TaskImport } from "@/components/task/TaskImport";
import { Upload } from "lucide-react";

export default function ImportPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-5 h-5 text-blue-600" />
        <div>
          <h1 className="text-base font-semibold text-gray-900">Import planning</h1>
          <p className="text-xs text-gray-500">
            Upload een Excel of CSV bestand om taken te importeren
          </p>
        </div>
      </div>
      <TaskImport />
    </div>
  );
}
