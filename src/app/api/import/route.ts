import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const imported: string[] = [];

  for (const row of rows) {
    const projectNumber = String(row["Project"] ?? row["project"] ?? "").trim();
    const description = String(
      row["Omschrijving"] ?? row["omschrijving"] ?? row["description"] ?? ""
    ).trim();
    const owner = String(
      row["Actiehouder"] ?? row["actiehouder"] ?? row["owner"] ?? ""
    ).trim();

    if (!description) continue;

    const task = await prisma.task.create({
      data: {
        projectNumber,
        description,
        owner,
        status: "not_started",
        barType: "task",
        startWeek: Number(row["startWeek"] ?? 0),
        startYear: Number(row["startYear"] ?? 2026),
        endWeek: Number(row["endWeek"] ?? 0),
        endYear: Number(row["endYear"] ?? 2026),
        sortOrder: 9999,
      },
    });
    imported.push(task.id);
  }

  return NextResponse.json({ imported: imported.length, ids: imported });
}
