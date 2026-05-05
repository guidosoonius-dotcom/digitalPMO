import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } }, bars: true, phase: true },
  });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const { newComment, authorId, ...fields } = body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(fields.status !== undefined && { status: fields.status }),
      ...(fields.startWeek !== undefined && { startWeek: fields.startWeek }),
      ...(fields.startYear !== undefined && { startYear: fields.startYear }),
      ...(fields.endWeek !== undefined && { endWeek: fields.endWeek }),
      ...(fields.endYear !== undefined && { endYear: fields.endYear }),
      ...(fields.owner !== undefined && { owner: fields.owner }),
      ...(fields.barType !== undefined && { barType: fields.barType }),
      ...(fields.description !== undefined && { description: fields.description }),
      ...(fields.phaseId !== undefined && { phaseId: fields.phaseId }),
      ...(fields.updatedBy !== undefined && { updatedBy: fields.updatedBy }),
      ...(newComment && {
        comments: {
          create: {
            text: newComment,
            author: authorId ?? "Onbekend",
          },
        },
      }),
    },
    include: { comments: { orderBy: { createdAt: "asc" } }, bars: true, phase: true },
  });

  return NextResponse.json(task);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
