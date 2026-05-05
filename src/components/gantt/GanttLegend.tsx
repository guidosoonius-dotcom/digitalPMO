export function GanttLegend() {
  const items = [
    { color: "bg-orange-400", label: "Kritieke mijlpaal" },
    { color: "bg-green-200 border border-green-400", label: "Vakantieperiode" },
    { color: "bg-pink-200 border border-pink-400", label: "Inhoudelijke besluitvorming" },
    { color: "bg-blue-400", label: "Taak" },
  ];

  return (
    <div className="flex items-center gap-5 px-4 py-2 bg-white border-b border-gray-200 text-xs text-gray-600">
      <span className="font-semibold text-gray-500 uppercase tracking-wide text-[10px]">
        Legenda
      </span>
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`inline-block w-4 h-3 rounded-sm ${color}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
