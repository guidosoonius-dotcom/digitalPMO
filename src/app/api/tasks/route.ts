import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { sortOrder: "asc" },
    include: { comments: { orderBy: { createdAt: "asc" } }, bars: true, phase: true },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      projectNumber: body.projectNumber ?? "",
      description: body.description ?? "",
      owner: body.owner ?? "",
      phaseId: body.phaseId ?? null,
      status: body.status ?? "not_started",
      barType: body.barType ?? "task",
      startWeek: body.startWeek ?? 0,
      startYear: body.startYear ?? 2026,
      endWeek: body.endWeek ?? 0,
      endYear: body.endYear ?? 2026,
      isMilestone: body.isMilestone ?? false,
      sortOrder: body.sortOrder ?? 0,
    },
    include: { comments: true, bars: true, phase: true },
  });
  return NextResponse.json(task, { status: 201 });
}
